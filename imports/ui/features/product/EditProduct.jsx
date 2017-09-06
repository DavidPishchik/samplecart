import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Products } from '../../../api/products.js';
import ProductEditor from './ProductEditor';

const EditProduct = ({ product, history }) => (product ? (
  <div className="EditProduct">
    <h4 className="page-header">{`Editing "${product.text}"`}</h4>
    <ProductEditor product={product} />
  </div>
) : 'not found');

export default createContainer(({ match }) => {
  const productId = match.params._id;
  const subscription = Meteor.subscribe('products.view', productId);

  return {
    loading: !subscription.ready(),
    product: Products.findOne(productId),
  };
}, EditProduct);
