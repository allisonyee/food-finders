import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { startsWith } from 'lodash';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const propTypes = {
  server: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
  isModalOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
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
    const { server } = this.props;

    return axios.get(`${server}/api/businesses/${alias}`).then(res => {
      console.log(res);
      return res.data;
    });
  }

  onClick = event => {
    event.preventDefault();
    const url = this.urlInput.current.value;
    this.getYelpBusiness(this.parseAlias(url)).then(business => {
      // this.setState({ business });
      this.saveBookmark(business);
    });
  };

  parseAlias(inputURL) {
    const url = new URL(inputURL);
    if (url.host.indexOf('yelp.com') === -1) throw new Error('Not a Yelp URL!');
    if (startsWith(url.pathname, '/biz/')) return url.pathname.slice(5);
    throw new Error('Invalid URL');
  }

  saveBookmark(business, { tags, notes } = { tags: null, notes: null }) {
    const { user, server } = this.props;
    console.log(business);
    const newBookmark = {
      user,
      bookmark: {
        business: {
          id: business.alias,
          data: JSON.stringify(business),
        },
      },
    };
    if (tags) newBookmark.bookmark.tags = tags;
    if (notes) newBookmark.bookmark.notes = notes;

    axios
      .post(`${server}/api/bookmark`, newBookmark, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then(resp => {
        console.log(resp);
        return resp;
      });
  }

  render() {
    const { isModalOpen, closeModal } = this.props;

    return (
      <Modal
        isOpen={isModalOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Add bookmark"
      >
        <form>
          <label htmlFor="url">
            Yelp URL
            <input ref={this.urlInput} type="text" name="url" />
          </label>
          <button onClick={this.onClick} type="submit">
            Save
          </button>
        </form>
      </Modal>
    );
  }
}

AddBookmarkDialog.propTypes = propTypes;

export default AddBookmarkDialog;
