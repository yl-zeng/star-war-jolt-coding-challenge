import React, { Component } from 'react';
import Card from './Card.js';

class CardList extends Component {
  render() {

    var people = this.props.people;
    var planets = this.props.planets;
    var favos = this.props.favos;

    console.log(planets);

    var renderCards = ()=>{
      return people.map((person)=>{
        var homeworld = planets[person.homeworld-1];
        var id = person.id;
        var like = false;
        if(favos[id]){
          like = favos[id];
        }

        return (
          <Card person={person} like={like} homeworld={homeworld}
            planets={planets} onLike={this.props.onLike} onSave={this.props.onSave}/>
        );
      });
    }


      return (
        <div>
          {renderCards()}
        </div>
      );

  }
}

export default CardList;
