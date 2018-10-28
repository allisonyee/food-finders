import React, { Component } from 'react';
import axios from 'axios';
import { startsWith } from 'lodash';
import BusinessProfile from './business-profile';
import './styles/App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      business: null,
    };

    this.server = 'http://192.168.1.11:8888';
    this.urlInput = React.createRef();
  }

  getYelpBusiness(alias) {
    return axios.get(`${this.server}/api/businesses/${alias}`).then(res => {
      console.log(res);
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

  parseAlias(inputURL) {
    const url = new URL(inputURL);
    if (url.host.indexOf('yelp.com') === -1) throw new Error('Not a Yelp URL!');
    if (startsWith(url.pathname, '/biz/')) return url.pathname.slice(5);
    throw new Error('Invalid URL');
  }

  render() {
    const { business } = this.state;

    return (
      <div className="App">
        <form>
          <label htmlFor="url">
            Yelp URL
            <input ref={this.urlInput} type="text" name="url" />
          </label>
          <button onClick={this.onClick} type="submit">
            Save
          </button>
        </form>
        <div>
          <strong>Business data:</strong>
          {business ? <BusinessProfile business={business} /> : 'Loading...'}
        </div>
      </div>
    );
  }
}

export default App;
