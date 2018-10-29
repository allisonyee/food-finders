import React, { Component } from 'react';
import axios from 'axios';
import { map } from 'lodash';

class FoodFinders extends Component {
  constructor(props) {
    super(props);

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

  render() {
    return <div className="App" />;
  }
}

export default FoodFinders;
