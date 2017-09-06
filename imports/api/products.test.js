/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';

import { Products } from './products.js';

if (Meteor.isServer) {
  describe('Products', () => {
    describe('methods', () => {
      const userId = Random.id();
      let productId;

      beforeEach(() => {
        Products.remove({});
        productId = Products.insert({
          text: 'test product',
          createdAt: new Date(),
          owner: userId,
          username: 'tmeasday',
        });
      });

      it('can delete owned product', () => {
        // Find the internal implementation of the product method so we can
        // test it in isolation
        const deleteProduct = Meteor.server.method_handlers['products.remove'];

        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        // Run the method with `this` set to the fake invocation
        deleteProduct.apply(invocation, [productId]);

        // Verify that the method does what we expected
        assert.equal(Products.find().count(), 0);
      });
    });
  });
}
