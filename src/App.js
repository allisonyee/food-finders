import React, { Component } from 'react';
import axios from 'axios';
import { startsWith } from 'lodash';
import BusinessProfile from './business-profile';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      business: null
    };

    this.server = 'http://192.168.1.11:8888';
    this.urlInput = React.createRef();
  }

  parseAlias(inputURL) {
    const url = new URL(inputURL);
    if (url.host.indexOf('yelp.com') === -1) throw 'Not a Yelp URL!';
    if (startsWith(url.pathname, '/biz/')) return url.pathname.slice(5);
    throw 'Invalid URL';
  }

  getYelpBusiness(alias) {
    return axios.get(`${this.server}/api/businesses/${alias}`).then(res => {
      return res.data;
    });
  }

  onClick = event => {
    event.preventDefault();
    const url = this.urlInput.current.value;
    this.getYelpBusiness(this.parseAlias(url)).then(business => {
      this.setState({ business });
    });
  };

  render() {
    return (
      <div className="App">
        <form>
          <label htmlFor="url">Yelp URL</label>
          <input ref={this.urlInput} type="text" name="url" />
          <button onClick={this.onClick}>Save</button>
        </form>
        <div>
          <strong>Business data:</strong>
          {this.state.business ? (
            <BusinessProfile business={this.state.business} />
          ) : (
            'Loading...'
          )}
        </div>
      </div>
    );
  }
}

export default App;
