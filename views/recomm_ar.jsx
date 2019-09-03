var React = require('react');

class RecommAR extends React.Component {
    render() {

    let image_url = "http://image.tmdb.org/t/p/w500/" + this.props.recommAR.poster_path;
    let detail_url = "/movie/" + this.props.recommAR.id;
    let viewlater_url = "/movie/" + this.props.recommAR.id + '/viewlater';

    return (
      <html>
        <body>
        <div className="tooltip-movie col-xs-1">
          <a href={ detail_url }><img id= { this.props.recommAR.id } className="movie img-rounded" src={image_url} height="150px" width="110px" /></a>
          <div className="tooltiptext-movie">
            <p>Released: {this.props.recommAR.release_date}</p>
            <p>Language: {this.props.recommAR.original_language}</p>
            <p>Average Rating: {this.props.recommAR.vote_average}</p>
            <p className="text-purple"><a href={viewlater_url}>Save for later</a></p>
            <p className="text-purple"><a href={detail_url}>View Detail</a></p>
          </div>        
        </div>
        </body>
      </html>
    );
  }
}

module.exports = RecommAR;



