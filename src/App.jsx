import React, { Component } from 'react';
import axios from 'axios';
import { map, startsWith } from 'lodash';
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
    this.bookmarks = [];
  }

  componentDidMount() {
    this.getBookmarks('kevin');
  }

  async getBookmarks(user) {
    return axios.get(`${this.server}/api/bookmarks?user=${user}`).then(resp => {
      const bookmarks = resp.data.results;
      this.bookmarks = map(bookmarks, bookmark => {
        const { business_id, id, owner_id, tags } = bookmark;
        const business = JSON.parse(bookmark.business.data);

        return {
          business,
          businessId: business_id,
          id,
          ownerId: owner_id,
          tags,
        };
      });
    });
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

  saveBookmark(user, business, { tags = null, notes = null }) {
    axios
      .post(`${this.server}/api/bookmark`, {
        user,
        business,
        tags,
        notes,
      })
      .then(resp => {
        console.log(resp);
        return resp;
      });
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
