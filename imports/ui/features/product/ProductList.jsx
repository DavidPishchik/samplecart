import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import { Redirect } from 'react-router';
import Cart from '../cart/Cart.jsx';

// Product component - represents a single todo item
export default class ProductList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false,
      search: '',
      added: false,
    };
  }
  updateSearch(event){
    this.setState({search: event.target.value.substr(0, 20)});
  }

  toggleChecked() {
    // Set the checked property to the opposite of its current value
    Meteor.call('products.setChecked', this.props.product._id, !this.props.product.checked);
  }

  deleteThisProduct() {
    Meteor.call('products.remove', this.props.product._id);
  }

  editThisProduct() {
    this.setState({ redirect: true });
  }

  togglePrivate() {
    Meteor.call('products.setPrivate', this.props.product._id, !this.props.product.private);
  }

  addToCart(event) {
      event.preventDefault();
       <Cart id="cart" className='Cart' />

      const cart = {
        name: this.props.product.name,
        price: this.props.product.price,
        category: this.props.product.category,
      };
      Meteor.call('carts.insert', cart, (error, cartId) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          Bert.alert('Added to Cart!', 'success');
        }
      });
    }

  render() {
    if (this.state.redirect) {
      let productlink =  '/product/' + this.props.product._id + '/edit';
      return <Redirect push to={productlink}  />;
    }

    // Give products a different className when they are checked off,
    // so that we can style them nicely in CSS
    const productClassName = classnames({
      checked: this.props.product.checked,
      private: this.props.product.private,
    });

    return (
      <li className={productClassName}>
        <div className="product-options col-md-4">
          <button className="cart" onClick={this.addToCart.bind(this)}>Buy</button>
        </div>

        <button className="edit" onClick={this.editThisProduct.bind(this)}>Edit</button>

        <button className="delete" onClick={this.deleteThisProduct.bind(this)}>
          &times;
        </button>

        <input
          type="checkbox"
          readOnly
          checked={this.props.product.checked}
          onClick={this.toggleChecked.bind(this)}
        />
        { this.props.showPrivateButton ? (
          <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
            { this.props.product.private ? 'Private' : 'Public' }
          </button>
        ) : ''}

        <span className="text">
          <strong>{this.props.product.username}</strong>: {this.props.product.text} - comments {this.props.product.comments} - Category: {this.props.product.category}  Purchase Price: ${this.props.product.purchaseprice} Retail Price: ${this.props.product.retailprice}
        </span>
      </li>
    );
  }
}
