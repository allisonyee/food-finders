import React from 'react';
import ReactDOM from 'react-dom';
import AddBookmarkDialog from './add-bookmark-dialog';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AddBookmarkDialog />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('parseAlias', () => {
  const app = new AddBookmarkDialog();

  it('should throw an error when a non-Yelp URL is entered', () => {
    const url = 'https://www.google.com/';
    expect(() => app.parseAlias(url)).toThrow();
  });

  it('should return the alias for a Yelp URL', () => {
    const url = 'https://www.yelp.com/biz/benu-san-francisco-4';
    expect(app.parseAlias(url)).toEqual('benu-san-francisco-4');
  });

  it('should return the alias for a Yelp URL with queries', () => {
    const url = 'https://www.yelp.com/biz/cafe-europa-san-francisco?osq=food';
    expect(app.parseAlias(url)).toEqual('cafe-europa-san-francisco');
  });
});
