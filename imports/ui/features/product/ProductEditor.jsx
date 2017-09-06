import React from 'react';
import { Meteor } from 'meteor/meteor';
import { FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class ProductEditor extends React.Component {
  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        text: {
          required: true,
        },
        category: {
          required: true,
        },
      },
      messages: {
        text: {
          required: 'Need some text in here',
        },
        category: {
          required: 'Need some category up in here up in here',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const { history } = this.props;
    const existingProduct = this.props.product && this.props.product._id;
    const methodToCall = existingProduct ? 'products.update' : 'products.insert';
    const product = {
      text: this.text.value.trim(),
      category: this.category.value.trim(),
    };

    if (existingProduct) product._id = existingProduct;

    Meteor.call(methodToCall, product, (error, productId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        const confirmation = existingProduct ? 'Product updated!' : 'Product added!';
        this.form.reset();
        Bert.alert(confirmation, 'success');
        history.push(`/product/${productId}`);
      }
    });
  }

  render() {
    const { product } = this.props;
    return (
      <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
        <FormGroup>
          <ControlLabel>Text</ControlLabel>
          <input
            type="text"
            className="form-control"
            name="text"
            ref={text => (this.text = text)}
            defaultValue={product && product.text}
            placeholder="text"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Category</ControlLabel>
          <input
            type="text"
            className="form-control"
            name="category"
            ref={category => (this.category = category)}
            defaultValue={product && product.category}
            placeholder="category"
          />
        </FormGroup>

        <Button type="submit" bsStyle="success">
          {product && product._id ? 'Save Changes' : 'Add Product'}
        </Button>
      </form>
    );
  }
}

ProductEditor.defaultProps = {
  product: {
    text: '',
    category: '',
  },
};

export default ProductEditor;
