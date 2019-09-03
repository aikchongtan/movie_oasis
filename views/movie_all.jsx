var React = require('react');

class Movies extends React.Component {
    render() {
    let image_url = "http://image.tmdb.org/t/p/w500/" + this.props.movie.poster_path;
    let detail_url = "/movie/" + this.props.movie.id;
    let viewlater_url = "/movie/" + this.props.movie.id + '/viewlater';

    return (
      <html>
        <body>
        <div className="tooltip-movie col-xs-2">
          
          <a href={ detail_url }><img id= { this.props.movie.id } className="movie img-rounded img-frame" src={image_url} height="150px" width="110px" /></a>
          <div className="tooltiptext-movie" onMouseOver="">
            <p>Released: {this.props.movie.release_date}</p>
            <p>Language: {this.props.movie.original_language}</p>
            <p>Average Rating: {this.props.movie.vote_average}</p>
            <p className="text-purple"><a href={viewlater_url}>Save for later</a></p>
            <p className="text-purple"><a href={detail_url}>View Detail</a></p>
          </div>
        </div>
        </body>
      </html>
    );
  }
}

module.exports = Movies;



