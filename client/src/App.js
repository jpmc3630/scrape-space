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
      baba: [],
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
      let searchData = await axios
      .get(`/search/${criteria}`);
      console.log(searchData);
      this.setState({data: searchData.data.data});  
      } else {
          this.getScrape(order);
      }
    };

  handleSortOrder = async (order) => { this.getScrape(order); };
  

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

        <div className="container">
          <div className="row justify-content-md-center">
      
        
          {data.length <= 0
            ? 'NO DB ENTRIES YET'
            : data.map((dat) => (
                
            <div key={dat._id} className="card  bg-light news-card">
              <div className="card-body">
                <div className="news-image cover" style={{ backgroundImage: `url(${dat.img})` }}></div>
                <div className="news-content">
                    <p className="news-title">{dat.title}</p>
                    <p className="news-body">{dat.body}</p>
                    <p className="news-byline">{dat.byline} - 
                      {moment(dat.date).fromNow()} - 
                      <a href={dat.url} target="_blank" className="news-url">Full Article</a> - 
                      
                        <CommentsModal 
                          key={this.comKey(dat._id)}
                          artId={dat._id} 
                          artTitle={dat.title} 
                          comments={dat.commentsIds} 
                          onClick={this.loadCommentsFromDB}
                        />
                      </p>
                  
                  
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