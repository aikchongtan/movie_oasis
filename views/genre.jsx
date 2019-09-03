var React = require('react');

class Genre extends React.Component {
    render() {

      const genreList = [];

      for (const [index, genre] of this.props.genres.entries()) {
        genreList.push(<li key={index} className="genre-li"><a href={'/genre/' + genre.id} >{genre.name}</a></li>)
      }

    return (
      <html>
        <body>
        <div>
          {genreList}
        </div>
        </body>
      </html>
    );
  }
}

module.exports = Genre;



