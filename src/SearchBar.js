import React, { Component } from 'react';
import './SearchBar.css';

class SearchBar extends Component {

  handleChange = (e)=>{
    e.preventDefault();
    var searchText = this.refs.searchText.value;
    this.props.onSearch(searchText);
  }

  render() {


    return (
      <div className='search-bar'>
        <input type="search" ref="searchText" placeholder='Search Your Destiny' onChange={this.handleChange} />
      </div>
    );
  }
}

export default SearchBar;
