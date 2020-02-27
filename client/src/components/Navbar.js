import React from "react";
import { useState } from "react";

function Navbar(props) {

  const [searchText, setSearchText] = useState('');
  const passSearch = (e) => {
    e.preventDefault();
    props.handleSearch(searchText);
  }

  const [sortOrder, setSortOrder] = useState('latest');
  const passSortOrder = (asd) => {
    props.handleSortOrder(asd);
  }


  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="navbar-brand">
        Space Scraper
      </div>
      <button
        className="navbar-toggler"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          {/* <li className="nav-item active">
            <a className="nav-link" href="#">
              Home <span className="sr-only">(current)</span>
            </a>
          </li> */}
          {/* <li className="nav-item">
            <a className="nav-link" href="#">
              Link
            </a>
          </li> */}
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Order by {sortOrder}
            </a>



            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <a className="dropdown-item" href="#" 
              onClick={() => 
              {setSortOrder("latest");
              passSortOrder("latest");
            }}>
                Latest First
              </a>
              <a className="dropdown-item" href="#" 
              onClick={() => 
                {setSortOrder("oldest");
                passSortOrder("oldest");
              }}>
                Oldest First
              </a>
              <div className="dropdown-divider" />
              <a className="dropdown-item" href="#"
              onClick={() => 
                {setSortOrder("comments");
                passSortOrder("comments");
              }}>
                Most Comments
              </a>
            </div>
          </li>
        </ul>
        <form className="form-inline my-2 my-lg-0">
          <input
            className="form-control mr-sm-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button className="btn btn-outline-success my-2 my-sm-0" onClick={passSearch}>
            Search
          </button>


          {/* <a href="#" onClick={props.handleSearch(searchText)}>Test</a> */}
        </form>
      </div>
    </nav>
  );
}

export default Navbar;
