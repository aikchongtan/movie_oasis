var React = require('react');

class Topsell extends React.Component {
    render() {

      const topsellList = [];

      for (const [index, movie] of this.props.topsell.entries()) {
        topsellList.push(<li key={index} className="topsell-li"><a href={'/movie/' + movie.movie_id } >{movie.title}</a></li>)
      }

    return (
      <html>
        <body>
        <div>
          {topsellList}
        </div>
        </body>
      </html>
    );
  }
}

module.exports = Topsell;



