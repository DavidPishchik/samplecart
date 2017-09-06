import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';

export const Products = new Mongo.Collection('products');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish products that are public or belong to the current user
  Meteor.publish('products', function productsPublication() {
    return Products.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ],
    });
  });

  Meteor.publish('products.view', function productsView(productId) {
    check(productId, String);
    return Products.find({ _id: productId, owner: this.userId });
  });

}

Meteor.methods({
  'products.insert'(product) {
    check(product, {
      text: String,
      category: String,
      retailprice: String,
      purchaseprice: String,
      comments: [String],
    });

    // Make sure the user is logged in before inserting a product
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Products.insert({
        username: Meteor.user().username,
        owner: this.userId, ...product });
  },

  'products.update'(product) {
    check(product, {
      _id: String,
      text: String,
      category: String,
    });

    const productId = product._id;
    Products.update(productId, { $set: product });
  },

  'products.remove'(productId) {
    check(productId, String);

    const product = Products.findOne(productId);
    if (product.private && product.owner !== Meteor.userId()) {
      // If the product is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    Products.remove(productId);
  },

  'products.setChecked'(productId, setChecked) {
    check(productId, String);
    check(setChecked, Boolean);

    const product = Products.findOne(productId);
    if (product.private && product.owner !== Meteor.userId()) {
      // If the product is private, make sure only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }

    Products.update(productId, { $set: { checked: setChecked } });
  },

  'products.setPrivate'(productId, setToPrivate) {
    check(productId, String);
    check(setToPrivate, Boolean);

    const product = Products.findOne(productId);

    // Make sure only the product owner can make a product private
    if (product.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Products.update(productId, { $set: { private: setToPrivate } });
  },
});


Products.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Products.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Products.schema = new SimpleSchema({
  text: {
    type: String,
    label: 'The text of the product.',
  },
  category: {
    type: String,
    label: 'The category of the product.',
  },
  retailprice: {
    type: String,
    label: 'Retail Price',
  },
  purchaseprice: {
    type: String,
    label: 'Retail Price',
  },
  username: {
    type: String,
    label: 'The username of the product.',
  },
  owner: {
    type: String,
    label: 'The username of the product.',
  },
  comments: {
    type: Array,
    label: 'The username of the product.',
  },

});

Products.attachSchema(Products.schema);

export default Products;
