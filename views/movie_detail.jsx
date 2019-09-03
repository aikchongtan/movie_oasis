var React = require('react');

class MovieDetail extends React.Component {
   
  render() {

    let image_url = "http://image.tmdb.org/t/p/w500/" + this.props.movie.poster_path;
    let movieGenre = this.props.movie.genre_names.map((value)=>{
       return (<li>{value.name}</li>)
    });

    return (
      <html>
        <body>
          <form method="Get" className="navbar-form" action={"/buy/" + this.props.movie.movie_id + '?_method=GET'}>

            <div className="">
              <img id={this.props.movie.id} className="movie img-rounded" src={image_url} height="200px" width="150px" /><br /><br />
              <p><b>Description:</b> {this.props.movie.overview}</p>
              <p><b>Released:</b> {this.props.movie.release_date}</p>
              <p><b>Language:</b> {this.props.movie.original_language}</p>
              <p><b>Average Rating:</b> {this.props.movie.vote_average}</p>

              <b>Genre:</b><ul>{movieGenre}</ul>
              <button className="btn btn-success my-2 my-sm-0" type="submit">Buy</button>
            </div>
          </form>
        </body>
      </html>
    );
  }
}

module.exports = MovieDetail;



