import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import './styles/business-profile.less';

const propTypes = {
  business: PropTypes.shape({
    name: PropTypes.string,
    location: PropTypes.object,
    photos: PropTypes.array,
  }).isRequired,
};

class BusinessProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  renderAddress() {
    const { location } = this.props.business;

    return map(location.display_address, (line, index) => (
      <div key={index} className="profile__address__line">
        {line}
      </div>
    ));
  }

  renderTags() {
    return (
      <React.Fragment>
        <h2 className="profile__section_header">Tags</h2>
        <button className="profile__edit_btn">Edit</button>
      </React.Fragment>
    );
  }

  renderNotes() {
    return (
      <React.Fragment>
        <h2 className="profile__section_header">Notes</h2>
        <button className="profile__edit_btn">Edit</button>
      </React.Fragment>
    );
  }

  render() {
    const { business } = this.props;
    const { name } = business;

    return (
      <div className="profile">
        <div
          className="profile__photo"
          style={{ backgroundImage: `url(${business.image_url})` }}
        />
        <div className="profile__content">
          <h1 className="profile__name">{name}</h1>
          <div className="profile__address">{this.renderAddress()}</div>
          <div className="profile__tags">{this.renderTags()}</div>
          <div className="profile__notes">{this.renderNotes()}</div>
        </div>
      </div>
    );
  }
}

BusinessProfile.propTypes = propTypes;

export default BusinessProfile;
