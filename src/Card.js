import React, { Component } from 'react';
import './Card.css';
import $ from "jquery";

class Card extends Component {

  constructor(props){
    super(props);

    this.state = {
      edit:false,
    }
  }

  // refresh
  componentWillReceiveProps(nextProps){
    this.setState({
      edit:false,
    });
  }

  // local handler for click
  handleSave = (e)=>{
    e.preventDefault();
    var name = this.refs.name.value !=="" ? this.refs.name.value : this.props.person.name;
    var birth_year = this.refs.birth_year.value !== "" ? this.refs.birth_year.value : this.props.person.birth_year;
    var image = this.refs.image.value !== "" ? this.refs.image.value : this.props.person.image;
    var homeworld = this.refs.homeworld.value;
    var newEdit = !this.state.edit;
    this.setState({
      edit:newEdit
    },()=>{
      var id = this.props.person.id;

      // pass params back to app component
      this.props.onSave(name,birth_year,id,homeworld,image);
    });
  }

  // local handle for Edit & Cancel
  handleToggle = (e)=>{
    e.preventDefault();
    var newEdit = !this.state.edit;
    this.setState({
      edit:newEdit
    });
  }

  // local handle for like
  handleLike = (e)=>{
    e.preventDefault();
    this.props.onLike(this.props.person.id);
  }


  render() {

    var renderOptions = ()=>{
      var planets = this.props.planets;
      var idx = 0;
      return planets.map((planet)=>{
        idx++;
        var selected = planet === this.props.homeworld;
        return (
          <option selected={selected} value={idx}>{planet}</option>
        );
      })
    }


    var renderCard = ()=>{
      if(this.state.edit === false){
        return (
            <div className='card-content'>
                <div className="like" onClick={this.handleLike}>
                  <i aria-hidden="true" className={this.props.like? "fa fa-thumbs-up" : "fa fa-thumbs-o-up" }/>
                </div>
              	<div className='card-name'>{this.props.person.name}</div>
              	<img src={"http://localhost:3008/" + this.props.person.image} alt='profile'/>
                <p>
                    <span>Birthday:</span>
                    <span>{this.props.person.birth_year}</span>
                </p>
                <p>
                    {/* Note that in order to get the homeworld's name, you have to get the planet name from a different endpoint than the people */}
                    <span>Homeworld:</span>
                    <span>{this.props.homeworld}</span>
                </p>
                <div style={{textAlign:"center"}}>
                  <button className="btn btn-primary" onClick={this.handleToggle}>Edit</button>
                </div>
            </div>
        );
      }else{
        return (
            <div className='card-content'>
                <p>
                    <span>Name:</span>
                    <input type="text" ref="name" placeholder={this.props.person.name} className='form-control'/>
                </p>
                <p>
                    <span>Image:</span>
                    <span><input type="text" ref="image" placeholder={this.props.person.image} className="form-control"/></span>
                </p>
                <p>
                    <span>Birthday:</span>
                    <span><input type="text" ref="birth_year" placeholder={this.props.person.birth_year} className="form-control"/></span>
                </p>
                <p>
                    {/* Note that in order to get the homeworld's name, you have to get the planet name from a different endpoint than the people */}
                    <span>Homeworld:</span>
                    <span>
                      <select className="form-control" ref="homeworld">
                        {renderOptions()}
                      </select>
                    </span>

                </p>
                <div style={{textAlign:"center"}}>
                  <button className="btn btn-danger" onClick={this.handleSave} style={{marginRight:"10px"}}>Save</button>
                  <button className="btn btn-primary" onClick={this.handleToggle}>Cancel</button>
                </div>
            </div>
        );
      }
    };



    return (
      <div className='card'>
        {renderCard()}
      </div>

    );
  }
}

export default Card;
