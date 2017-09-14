import React, { Component } from 'react';
import './App.css';
import CardList from './CardList.js';
import SearchBar from "./SearchBar.js"
import star from './images/star.svg';
import wars from './images/wars.svg';
import ReactPaginate from 'react-paginate';
import $ from "jquery";



class App extends Component {

  constructor(props){
    super(props);

    var ajaxPlanets = this.ajaxPlanets;

    this.state = {
      people:[],
      planets:[],
      searchText:"",
      page:1,
      pageCount:1,
      favos:{}
    }

    $.ajax({
      type:"GET",
      url:"http://localhost:3008/planets",
      async: false,
      success:(data)=>{
        var planets = [];
        for(var i = 0;i<data.length;i++){
          planets.push(data[i].name);
        };
        this.state.planets = planets;
      }
    });
  }

  componentWillMount(){
    this.updatePageCount();
    this.update();
    this.getFavorites();
  }

  // get data for current searchText to calculate pageCount
  updatePageCount = ()=>{
    var searchText = this.state.searchText;
    $.ajax({
      type:"GET",
      url:"http://localhost:3008/people?q=" + searchText,
      async: false,
      success: (data) =>{
        this.setState({
          pageCount: Math.ceil(data.length/3)
        });
      }
    });
  }


  update = ()=>{

    var page = this.state.page;
    var searchText = this.state.searchText;

    // get data for current page
    $.ajax({
      type:"GET",
      url:"http://localhost:3008/people?_page="+ page + "&_limit=3&q=" + searchText,
      async: false,
      success: (data) =>{
        console.log(data);
        this.setState({
          people:data,
        });
      }
    });
  }

  handlePageClick = (data)=>{
    var page = data.selected+1;
    this.setState({
      page
    },()=>{
      this.update();
    });
  }

  handleSearch = (searchText)=>{
    this.setState({
      searchText,
      page:1
    },()=>{
      this.updatePageCount();
      this.update();
    });
  }


  handleSave = (name,birth,id,homeworld,image)=>{
    var data = {
      name,
      birth_year:birth,
      homeworld,
      image
    }
    $.ajax({
      type:"PATCH",
      url:"http://localhost:3008/people/" + id,
      async: false,
      data,
      dataType:"json",
      success:()=>{
        this.update();
      }
    });
  }

  // get favorites, if null just initial
  getFavorites = ()=>{
    $.ajax({
      type:"GET",
      url:"http://localhost:3008/peoplefavorites",
      async: false,
      success:(data)=>{
        var favos = !data[0] ? {}: data[0];

        //initial
        if(!data[0]){
          favos.total = 0;
          $.ajax({
            type:"POST",
            url:"http://localhost:3008/peoplefavorites",
            async: false,
            dataType:"json",
            data:{
              total:0
            }
          })
        }
        this.setState({
          favos
        });
      }
    })
  }

  // handler for like and unlike
  handleLike = (id)=>{
    var favos = this.state.favos;
    //like
    if(!favos[id]){
      favos[id] = true;
      favos.total = favos.total + 1;
    }else{
      favos[id] = false;
      favos.total = favos.total - 1;
    }
    this.setState({
      favos
    },()=>{
      $.ajax({
        type:"PATCH",
        url:"http://localhost:3008/peoplefavorites/1",
        async: false,
        dataType:"json",
        data:favos,
      });
    });
  }

  render() {

    return (
      <div>
        <div className='content'>
          <div className='logo'>
            <img src={star} alt="star-logo" />
            <span className='interview-text'>The Interview</span>
            <img src={wars} alt="wars-logo" />
            <h1 style={{color:"red"}}>Favorites: {this.state.favos.total?this.state.favos.total:0}</h1>
          </div>
          <SearchBar onSearch={this.handleSearch}/>
          <CardList people={this.state.people} planets={this.state.planets}
            favos={this.state.favos} onLike={this.handleLike} onSave={this.handleSave}/>
        </div>
        <div style={{textAlign:"center"}}>
          <ReactPaginate previousLabel={"previous"}
                         nextLabel={"next"}
                         breakLabel={<a href="#">...</a>}
                         breakClassName={"break-me"}
                         pageCount={this.state.pageCount}
                         marginPagesDisplayed={2}
                         pageRangeDisplayed={5}
                         onPageChange={this.handlePageClick}
                         containerClassName={"pagination"}
                         subContainerClassName={"pages pagination"}
                         activeClassName={"active"}
                         forcePage={this.state.page-1}/>
        </div>

      </div>

    );
  }
}

export default App;
