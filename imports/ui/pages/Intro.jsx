import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

// App component - represents the whole app
class Intro extends Component {

  render() {
    return (
      <div className="container">
        <h1>Login</h1>
      </div>
    );
  }
}

export default createContainer(() => {
  return {
  };
}, Intro);
