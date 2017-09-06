import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';




class NewProductForm extends React.Component {
  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const product = {
      text: this.text.value.trim(),
      category: this.category.value.trim(),
      retailprice: this.retailprice.value.trim(),
      purchaseprice: this.purchaseprice.value.trim(),
      comments: ['good', 'great'],
    };

    Meteor.call('products.insert', product);

    this.text.value = '';
    this.category.value = '';
    this.retailprice.value = '';
   this.purchaseprice.value = '';
  }

  render() {
    return (
      <form className="new-product" onSubmit={this.handleSubmit.bind(this)} >
        <input
          type="text"
          ref={text => (this.text = text)}
          placeholder="Type to add new products"
        />
        <select ref={category => (this.category = category)}>
           <option value="Electronics">Electronics</option>
           <option value="Cell Phones">Cell Phones</option>
           <option value="Accessories">Accessories</option>
         </select>

          Purchase Price: $<input type="number" ref={purchaseprice => (this.purchaseprice = purchaseprice)} required size='5px' name="purchaseprice" min="0" defaultValue="0" step=".01" />
          Retail Price: $<input type="number" ref={retailprice => (this.retailprice = retailprice)} required size='5px' name="retailprice" min="0" defaultValue="0" step=".01" />

        <button> Submit </button>

      </form>
    )
  }
}

export default NewProductForm;
