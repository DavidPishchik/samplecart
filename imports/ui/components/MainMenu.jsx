import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

// App component - represents the whole app
class MainMenu extends Component {

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="/">Tackle-bp</a>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          { this.props.currentUser ?
            <ul className="navbar-nav pull-left mr-auto">
              <li className="nav-item">
                <a className="nav-link" href="/dashboard">Dashboard</a>
              </li>
            </ul> : ''
          }
          <ul className="navbar-nav pull-right mr-auto">
            <li>
              <AccountsUIWrapper />
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default createContainer(() => {
  return {
    currentUser: Meteor.user(),
  };
}, MainMenu);
