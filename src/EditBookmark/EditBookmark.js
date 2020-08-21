import React from 'react';
import BookmarksContext from '../BookmarksContext';
import config from '../config';
import './EditBookmark.css';

const Required = () => (
  <span className='EditBookmark__required'>*</span>
)

class EditBookmark extends React.Component {
  static contextType = BookmarksContext;
  
  state = {
    error: null,
    title: '',
    url: '',
    description: '',
    rating: 1
  };

  updateTitle(title) {
    this.setState({
      title: title
    });
  }

  updateUrl(url) {
    this.setState({
      url: url
    });
  }

  updateDescription(description) {
    this.setState({
      description: description
    });
  }

  updateRating(rating) {
    this.setState({
      rating: rating
    });
  }
  
  componentDidMount() {
    const bookmarkId = this.props.match.params.bookmarkId;

    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(error => {
            throw error;
          });
        }
        return res.json();
      })
      .then(data => {
        this.setState({
          ...data
        });
      })
      .catch(error => this.setState({ error }));
  }

  handleClickCancel = () => {
    this.props.history.push('/');
  }

  handleSubmit = e => {
    e.preventDefault();

    const { title, url, description, rating } = this.state;

    fetch(config.API_ENDPOINT + `/${this.state.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        title: title,
        url: url,
        description: description,
        rating: rating
      }),
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      }
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(error => {
          throw error;
        });
      }
      return res.json();
    })
    .then(data => {
      this.context.updateBookmark(data);
    })
    .catch(error => this.setState({ error }));
  }
  
  render() {
    const { error, title, url, description, rating } = this.state;

    return (
      <section className='EditBookmark'>
        <h2>Edit a bookmark</h2>
        <form
          className='EditBookmark__form'
          onSubmit={this.handleSubmit}
        >
          <div className='EditBookmark__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor='title'>
              Title
              {' '}
              <Required />
            </label>
            <input
              type='text'
              name='title'
              id='title'
              placeholder='Great website!'
              required
              value={title}
              onChange={e => this.updateTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor='url'>
              URL
              {' '}
              <Required />
            </label>
            <input
              type='url'
              name='url'
              id='url'
              placeholder='https://www.great-website.com/'
              required
              value={url}
              onChange={e => this.updateUrl(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor='description'>
              Description
            </label>
            <textarea
              name='description'
              id='description'
              value={description}
              onChange={e => this.updateDescription(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor='rating'>
              Rating
              {' '}
              <Required />
            </label>
            <input
              type='number'
              name='rating'
              id='rating'
              min='1'
              max='5'
              required
              value={rating}
              onChange={e => this.updateRating(e.target.value)}
            />
          </div>
          <div className='EditBookmark__buttons'>
            <button type='button' onClick={this.handleClickCancel}>
              Cancel
            </button>
            {' '}
            <button type='submit'>
              Save
            </button>
          </div>
        </form>
      </section>
    );
  }
}

export default EditBookmark;