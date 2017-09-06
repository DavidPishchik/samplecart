import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';


export default class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      total: 0,
    };
  }

  addItem(e, item){
    this.state.items.push(item);
      this.countTotal();
  }
  countTotal(){
    let total = 0;
    this.state.items.forEach((item, index) => {
      total = total + item.price;
    });
    this.setState({total: total});
  }


  render(){
    let display = this.state.total;
    let items = this.state.items.map(function(item){
      return (
        <li key={item.id}>
          <spam> {item.name}</spam>
          <spam> {item.price}</spam>
        </li>
      );
    });
    let body = (<ul>{items}</ul>);
    let empty = <div> <p>Cart Empty </p></div>;


    return(
      <div>
        <h1>CART</h1>
            {items.length > 0 ? body : empty  }
      </div>

    )
  }

}
