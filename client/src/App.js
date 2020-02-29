import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import Navbar from "./components/Navbar";
import CommentsModal from "./components/Modal";

 


class App extends Component {
  constructor(){
    super();
    this.state = {
      data: [],
      statusText: 'Scraping...',
      search: 'moo'
    };
    // this.getScrape = this.getScrape.bind(this);
    // this.handleSearch = this.handleSearch.bind(this);
 }

  componentDidMount() {
    // this.getScrape();
    this.handleSearch();
  }


  getScrape = async (order) => {
      let scrapeData = await axios.get(`/scrape/${order}`);
      console.log(scrapeData.data);
      this.setState(scrapeData.data);
  };

  handleSearch = async (criteria, order) => { 
      if (criteria) {
          this.setState({search: criteria});
          this.setState({statusText: `Searching for '${criteria}' ...`}); 
      let searchData = await axios
      .get(`/search/${criteria}`);
      console.log(searchData);
      if (searchData.data.data.length < 1) this.setState({statusText: `No results found for '${criteria}'`}) ;
      this.setState({data: searchData.data.data});  
      } else {
          this.setState({statusText: `Scraping ...`});
          this.getScrape(order);
          
      }
    };

    doSort = async (order) => {
      let sortData = await axios.get(`/sort/${order}`);
      console.log(sortData.data);
      this.setState(sortData.data);
  };

  handleSortOrder = async (order) => { this.doSort(order); };
  
  incrementCommentButton = (arrIndex) => {
    console.log('index we aftr: ' + arrIndex);
    let temp = this.state.data;
    console.log('old tally: : ' + temp[arrIndex].commentsTally);
    
    temp[arrIndex].commentsTally++;
    console.log('incremented now: ' + temp[arrIndex].commentsTally);
    this.setState({data: temp});
  };

  comKey = async (asd) => { 
    let eee = asd + 'com';
    return eee;
  };


  render() {
    const { data } = this.state;


    return (
      
      <div>
        <Navbar 
        handleSearch = {this.handleSearch} 
        handleSortOrder = {this.handleSortOrder}
        />

        <div className="container-fluid pb-3">
          <div className="row justify-content-md-center">
      
        
          {data.length <= 0
            ? <div>{this.state.statusText}</div>
            : data.map((dat, index) => (
                
            <div key={dat._id} className="card bg-light news-card">
              <div className="card-body">
                <div className="news-image cover" style={{ backgroundImage: `url(${dat.img})` }}></div>
                <div className="news-content">
                    <p className="news-title">{dat.title}</p>
                    <p className="news-body">{dat.body}</p>
                    <span className="news-byline"><span className="news-author">{dat.byline}&nbsp;&nbsp; 
                      {moment(dat.date).fromNow()}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <a href={dat.url} rel="noopener noreferrer" target="_blank" className="news-url">Full Article</a>&nbsp;&nbsp;&nbsp;&nbsp;
                      
                        <CommentsModal 
                          key={this.comKey(dat._id)}
                          arrIndex={index} 
                          comTally={dat.commentsTally} 
                          incComFunc={this.incrementCommentButton}
                          artId={dat._id} 
                          artTitle={dat.title} 
                          comments={dat.commentsIds} 
                          onClick={this.loadCommentsFromDB}
                        />
                      </span>
                  
                </div>
              </div>
            </div>

              ))}
  
            </div>
          </div>
        </div>
    );
  }
}

export default App;