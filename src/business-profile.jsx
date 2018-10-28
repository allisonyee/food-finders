import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import './App.css';

class BusinessProfile extends Component {
  render() {
    const { name, location, photos } = this.props.business;

    return (
      <div className="profile">
        <h1>{name}</h1>
        <div className="profile__photo">
          <img src={photos[0]} />
        </div>
        <div className="profile__address">
          {map(location.display_address, (line, index) => (
            <div key={index} className="profile__address__line">
              {line}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

BusinessProfile.propTypes = {
  business: PropTypes.object.isRequired
};

export default BusinessProfile;
