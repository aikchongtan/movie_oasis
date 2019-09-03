var React = require('react');
var MovieAll = require('./movie_all.jsx');
var MovieDetail = require('./movie_detail.jsx');
var TopSellMovie = require('./topsell.jsx');
var RecommAR = require('./recomm_ar.jsx');
var Genre = require('./genre.jsx');

class Home extends React.Component {
  render() {

    let movieList = [];
    let recommARList = [];
    let content1;
    let content2;
    let content3;

    let movie = this.props.movies[0];
    let userId = this.props.userId;
    let loggedIn = this.props.loggedIn;
    let linebreak = "  |";

    if (loggedIn && userId != "") 
    {
      content1 = <font>Logged in as <i><b>{this.props.userName}</b></i></font>;
      content2 = <a className="nav-bar-ul btn-m-l brand" href="/logout">Logout</a>;
      content3 = <a className="brand" href="/favourite">Saved List</a>;
    } 
    else 
    {
      content1 = <a className="nav-bar-ul btn-m-r brand" href="/register">Create Account</a>;
      content2 = <a className="nav-bar-ul btn-m-l brand" href="/login">Sign In</a>;
      content3 = "";
    }

    if (this.props.movies.length == 0) {
      movieList = <p className='title-unavail'>Search title unavailable</p>;
    } 
    else {
      movieList = this.props.movies.map((value) => {
        if (this.props.view == 4) {
          return <MovieDetail movie={movie} />
        } else {
          return <MovieAll movie={value} />
        }
      });
    }

    recommARList = this.props.recommAR.map((value) => {
      return <RecommAR recommAR={value} />
    });

    return (
      <html>
        <head>
          <title>Movie Oasis</title>
        </head>

        <link rel="stylesheet" href="/css/movieoasis.css" />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script>
        <link href="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" rel="stylesheet" />
        <link href="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap-theme.min.css" rel="stylesheet" />

        <body>

          {/* --------- Banner ------------ */}
          <div className="container">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">

              <div className="nav-bar">
                <div className="nav-bar-logoname">
                  <p className="brand">Movie Oasis</p>
                </div>

                <div className="">
                  <form method="POST" className="form-inline nav-bar-form" action="/movies/search/">
                    <input name="q" className="form-control mr-sm-5 btn-m-r" type="search" placeholder="Search" aria-label="Search" />
                    <button className="btn btn-outline-success my-2 my-sm-0 search-btn" type="submit">Search</button>
                  </form>
                </div>

                <div className="nav-bar-right">
                  {content1}{linebreak}
                  {content2}<br />{content3}
                </div>

              </div>
            </nav>

            <div className="banner">
            </div>


            {/* --------- Content Left (Genre) ------------ */}
            <div className="row movie-content">
              <div className="col-xs-2 sidebar collapse navbar-collapse genre-top-frame">
                <div className="well genre-frame">
                  <p className="genre-header">Genres</p>
                  <ul className="nav nav-sidebar">{<Genre genres={this.props.genres} />}</ul>
                </div>
              </div>

              <div className="col-xs-8 main max-size">
                {/* ----------- Content Body (Movie) -------------- */}
                <div id="movies" className="row">{movieList}</div>

                {/* --------- Content Body (Top seller) ------------- */}
              </div>
              <div id="right" className="col-xs-2 sidebar collapse navbar-collapse topsell-top-frame">
                <div className="well topsell-frame">
                  <p className="topsell-header">Top Seller</p>
                  <ol id="top_content" className="nav nav-sidebar">{<TopSellMovie topsell={this.props.topsell} />}</ol>
                </div>
              </div>

            </div>
            {/* --------- Content Bottom (Recommender) ------------- */}
            <div className="row movie-content-recomm">
              <div className="col-xs-8 main max-size">
                <div id="association_rules_recs" className="row recommAR-Frame">
                  <p className="recomm-header">You may also like these titles...</p><br />
                  {recommARList}
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    );
  }
}



module.exports = Home;





