import seeder from '@cleverbeagle/seeder';
import { Meteor } from 'meteor/meteor';
import Products from '../../api/products';

const productscategorylist = ['Electronics', 'Cell Phones', 'Accessories'];
const productsretailpricelist = [ 15.45, 100, 150.00, 2.25];
const productspurchasepricelist =  productsretailpricelist.map(function(x) {return x / 2;});

const crititcalProductsSeed = (userId, username) => ({
  collection: Products,
  environments: ['development', 'staging'],
  noLimit: true,
  modelCount: 15,
  model(dataIndex) {
    return {
      username: 'admin',
      owner: userId,
      text: `Product #${dataIndex + 1}`,
      category: productscategorylist[Math.floor(Math.random() * productscategorylist.length)],
      retailprice : productsretailpricelist[Math.floor(Math.random() * productsretailpricelist.length)],
      purchaseprice : productspurchasepricelist[Math.floor(Math.random() * productspurchasepricelist.length)],
    };
  },
});


seeder(Meteor.users, {
  environments: ['development', 'staging'],
  noLimit: true,
  data: [{
    username: 'admin',
    password: 'password',
    data(userId, username) {
      return crititcalProductsSeed(userId, username);
    },
  },
  ],

});
