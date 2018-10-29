import React, { Component } from 'react';
import axios from 'axios';
import { map, isEmpty } from 'lodash';

class FoodFinders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bookmarks: [],
    };

    this.server = 'http://192.168.1.11:8888';
    this.urlInput = React.createRef();
  }

  componentDidMount() {
    this.getBookmarks('kevin');
  }

  async getBookmarks(user) {
    return axios.get(`${this.server}/api/bookmarks?user=${user}`).then(resp => {
      const data = resp.data.results;
      const bookmarks = map(data, bookmark => {
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
      this.setState(() => ({ bookmarks }));
    });
  }

  renderBookmark(bookmark) {
    const { id, tags } = bookmark;
    const { name, location } = bookmark.business;

    return (
      <li key={id} className="list__bookmark">
        <h3 className="list__bookmark_name">{name}</h3>
        <div className="list__bookmark_address">
          {location.display_address[0]}
        </div>
        <div className="list__bookmark_tags">{tags.join(', ')}</div>
      </li>
    );
  }

  renderBookmarks() {
    const { bookmarks } = this.state;
    if (isEmpty(bookmarks)) return null;

    return map(bookmarks, bookmark => this.renderBookmark(bookmark));
  }

  render() {
    return (
      <div className="food_finders__main">
        <div className="main__map" />
        <div className="main__content">
          <h1>Food Finders</h1>
          <h2>Bookmarks</h2>
          <ul className="main__list">{this.renderBookmarks()}</ul>
        </div>
      </div>
    );
  }
}

export default FoodFinders;
