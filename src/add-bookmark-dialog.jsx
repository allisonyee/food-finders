import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { startsWith } from 'lodash';

const propTypes = {
  server: PropTypes.string.isRequired,
};

class AddBookmarkDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      business: null,
    };

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
    return (
      <form>
        <label htmlFor="url">
          Yelp URL
          <input ref={this.urlInput} type="text" name="url" />
        </label>
        <button onClick={this.onClick} type="submit">
          Save
        </button>
      </form>
    );
  }
}

AddBookmarkDialog.propTypes = propTypes;

export default AddBookmarkDialog;
