import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Products } from '../../api/products.js';
import Cart from '../features/cart/Cart.jsx';
import ProductList from '../features/product/ProductList.jsx';
import NewProductForm from '../features/product/NewProductForm.jsx';

import Papa from 'papaparse';
import { Doughnut } from 'react-chartjs-2';


// App component - represents the whole app
class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ref: 'chart',
      type: 'bar',
      data: {
        labels: ['bos', 'wor', 'sprin'],
        datasets: [{
          label: 'Population',
          data: [1212, 232323, 42424],
        },
      ],
      },
      options: {},
      hideCompleted: false,
    };
  }



  toggleHideCompleted() {
    this.setState({
        hideCompleted: !this.state.hideCompleted,
      });
  }

  renderProducts() {
    let filteredProducts = this.props.products;
    if (this.state.hideCompleted) {
      filteredProducts = filteredProducts.filter(product => !product.checked);
    }

    return filteredProducts.map((product) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = product.owner === currentUserId;

      return (
      <ProductList
        key={product._id}
        product={product}
        showPrivateButton={showPrivateButton}
      />
    );
    });
  }

  handleExportButton() {
    let data = this.props.products;
    let downloadCSV = function (csv) {
      var blob = new Blob([csv]);
      var a = window.document.createElement('a');
      a.href = window.URL.createObjectURL(blob, { type: 'text/plain' });
      a.download = 'products.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    var csv = Papa.unparse(data);
    downloadCSV(csv);
  }

  handleImportSubmit(event) {
    event.preventDefault();

    const file = ReactDOM.findDOMNode(this.refs.fileInput).files[0];

    Papa.parse(file, {
      step: function (row) {
        console.log('Row:', row.data[0]);
        const newProducts = {
          text: new String(row.data[0]).trim(),
        };
        Meteor.call('products.insert',  newProducts);
      },

      complete: function () {
        console.log('All done!');
      },

    });

  }

  handleImportButton() {
    importform = (<form className="parseUpload" onSubmit={this.handleImportSubmit.bind(this)} >

      <input
        type="file"
        ref="fileInput"
      />
      <button>
        submit
      </button>
    </form>);
    alert('import form goes here ' + importform);

  }

  componentDidMount() {
    console.log(this.refs.chart.chart_instance);
  }

  render() {
    console.log(this.props.criticalCount);
    let criticalproducts = this.props.criticalCount;
    let opportunityproducts = this.props.opportunityCount;
    let overthehorizonproducts = this.props.horizonCount;

    const data = {
      labels: [
        'Electronics',
        'Cell Phones',
        'Accessories',
      ],
      datasets: [
        {
          data: [criticalproducts, opportunityproducts, overthehorizonproducts],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
          ],
        },
        ],
    };

    const styles = {
      graphCotainer: {
        border: '1px solid black',
        padding: '15px',
      },
    };
  let procollect = [
    {
      id: 1,
      price: 500,
      name: 'one'
    },
    {
      id: 2,
      price: 600,
      name: 'two'
    }
  ];
    return (
      <div className="container">
           <h1>Dashboard</h1>
           <h4> Total Products ({this.props.incompleteCount})</h4>
           <Doughnut ref='chart' data={data} />
            <label className="hide-completed">
             <input
               type="checkbox"
               readOnly
               checked={this.state.hideCompleted}
               onClick={this.toggleHideCompleted.bind(this)}
             />
             Hide Completed Products
            </label>

            <NewProductForm />
            <br />
        <ul>
          {this.renderProducts()}
        </ul>
        <div className="row">

          <Cart items={procollect} total={500}  />

        </div>
      </div>
    );
  }
}
Dashboard.defaultProps = {
  product: { text: '', price: '' },
};

export default createContainer(() => {
  Meteor.subscribe('products');

  return {
    products: Products.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Products.find({ checked: { $ne: true } }).count(),
    criticalCount: Products.find({ category: 'Electronics' }).count(),
    opportunityCount: Products.find({ category: 'Cell Phones' }).count(),
    horizonCount: Products.find({ category: 'Accessories' }).count(),
    currentUser: Meteor.user(),
  };
}, Dashboard);
