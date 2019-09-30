    console.log("starting up!!");

    const express = require('express');
    const methodOverride = require('method-override');
    const pg = require('pg');
    const cookieParser = require('cookie-parser');
    const request = require('request')

/////////////////////////////////////////////// Copy from ebook /////////////////////////

// inside of db.js

//require the url library
//this comes with node, so no need to yarn add
const url = require('url');

//check to see if we have this heroku environment variable
if( process.env.DATABASE_URL ){

  //we need to take apart the url so we can set the appropriate configs

  const params = url.parse(process.env.DATABASE_URL);
  const auth = params.auth.split(':');

  //make the configs object
  var configs = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true
  };

}else{

  //otherwise we are on the local network
  var configs = {
    user: 'ghostshiphost',
    password: 'Laser123',
    host: '127.0.0.1',
    database: 'storedb',
    port: 5432,
};
}

//this is the same
// const pool = new pg.Pool(configs);

///////////////////////////////////////////////////

    // // Initialise postgres client
    // const configs = {
    //     user: 'ghostshiphost',
    //     password: 'Laser123',
    //     host: '127.0.0.1',
    //     database: 'storedb',
    //     port: 5432,
    // };

    const pool = new pg.Pool(configs);
    pool.on('error', function (err) {
        console.log('idle client error', err.message, err.stack);
    });

    /**
     * ===================================
     * Configurations and set up
     * ===================================
     */

    // Init express app
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));

    app.use(methodOverride('_method'));
    app.use(cookieParser());

    // Set react-views to be the default view engine
    const reactEngine = require('express-react-views').createEngine();
    app.set('views', __dirname + '/views');
    app.use(express.static(__dirname + '/static/'));
    app.set('view engine', 'jsx');
    app.engine('jsx', reactEngine);

    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));
    
    let onClose = function () {
        console.log("closing");
        server.close(() => {
            console.log('Process terminated');
            pool.end(() => console.log('Shut down db connection pool'));
        })
    };

    /**
     * ===================================
     * Routes
     * ===================================
     */


    let movieList = [];
    let genreList = [];
    let topSellList = [];
    let recommARList = [];
        
    let viewType = 1;
    let searchContent = '';
    let user_id = '';
    let user_name = '';
    let loggedIn = false;
    let isLogout = false;
    const APIKey = 'df0cdb7503c3bacaaafa327fb721d077';

    let make_API_call = function (url) {
        return new Promise((resolve, reject) => {
            request(url, {
                json: true
            }, (err, res, body) => {
                if (err) 
                {
                    reject("err")
                } else {
                resolve(body)
                }
            });
        })
    };

    var delay = (seconds) => new Promise((resolves) => {
        setTimeout(resolves, seconds * 1000);
    });

    let languageDes = function (param) {
        switch (param) {
            case 'en':
                return 'English';
            case 'vi':
                return 'Vietnam';
            case 'zh':
                return 'China';
            case 'id':
                return 'Indonesia';
            case 'ko':
                return 'Korea';
            case 'ta':
                return 'Sri Lanka';
            case 'ja':
                return 'Japan';
            case 'pa':
                return 'Pakistan';
            case 'ar':
                return 'Bahrein';
            case 'es':
                return 'Argentina';
            case 'it':
                return 'Italy';
            case 'ru':
                return 'Belarus';
            default:
                return this.props.movie.original_language;
        }
    };

    let getGenre = function () {
        if (genreList.length == 0) {
            genreList = [];

            const queryText = 'SELECT movieoasis_genre.id, movieoasis_genre.name FROM movieoasis_genre ' +
                'INNER JOIN movie_genre ON movie_genre.genre_id = movieoasis_genre.id  ' +
                'GROUP BY movieoasis_genre.id, movieoasis_genre.name  ' +
                'ORDER BY movieoasis_genre.name ASC ';
            pool.query(queryText, (err, res) => {
                if (err) {
                    //console.log("query error - getGenre", err.message);
                } else {
                    genreList = res.rows;
                }
            });
        }
    };

    let getTopSell = function () {
        const queryText = 'SELECT COUNT(movieoasis_movie.movie_id), movieoasis_movie.movie_id, movieoasis_movie.title ' +
            ' FROM movieoasis_movie INNER JOIN collector_log on movieoasis_movie.movie_id = collector_log.content_id ' +
            ' WHERE event = $1 GROUP BY movieoasis_movie.movie_id, movieoasis_movie.title ' +
            ' ORDER BY COUNT(movieoasis_movie.movie_id) DESC LIMIT 15';
        const values = ['buy'];
        pool.query(queryText, values, (err, res) => {
            if (err) {
                //console.log("query error - getGenre", err.message);
            } else {
                topSellList = res.rows;
            }
        });
    }

    let getMoviesByGenre = function (response) {
        movieList = [];
        const queryText = 'SELECT movieoasis_movie.movie_id, movieoasis_movie.title, movieoasis_movie.year FROM movieoasis_movie ' +
            ' INNER JOIN movie_genre ON movieoasis_movie.movie_id = movie_genre.movie_id' +
            ' WHERE movie_genre.genre_id = ' + searchContent + ' ORDER BY movieoasis_movie.year DESC LIMIT 30';

        pool.query(queryText, (err, res) => {
            if (err) {
                //console.log("query error - getMoviesByGenre", err.message);
            } else {
                for (let i = 0; i < res.rows.length; i++) {
                    make_API_call('https://api.themoviedb.org/3/find/tt' + res.rows[i].movie_id + '?external_source=imdb_id&api_key=' + APIKey)
                        .then(result => {
                            if (result != "err") {
                                
                                if (result.movie_results != 'undefined' || result.movie_results != null) {
                                    result.movie_results[0].id = res.rows[i].movie_id;
                                    result.movie_results[0].original_language = languageDes(result.movie_results[0].original_language);
                                    movieList.push(result.movie_results[0]);
                                }
                            }
                        });
                }
            }
        });

        for (let i = 0; i < genreList.length; i++) {
            if (genreList[i].id == searchContent)
            {
                saveCollectorLog(response, 0, "genre:" + genreList[i].name);
            }
        }
    }

    let getFavouriteList = function () {
        movieList = [];
        const queryText = ' select distinct content_id from ( ' 
                    + ' select * from collector_log where event = $1 and user_id =$2 order by created desc '
                    + ' ) as tbl limit 30';
        
                    let values = ['addToList', user_id]
        pool.query(queryText, values, (err, res) => {
            if (err) {
                console.log("query error - getMovieList", err.message);
            } else {
				// console.log(res.rows[i].content_id)
                for (let i = 0; i < res.rows.length; i++) {
                    make_API_call('https://api.themoviedb.org/3/find/tt' + res.rows[i].content_id + '?external_source=imdb_id&api_key=' + APIKey)
                        .then(result => {

                            if (result != "err") {
                                if (result.movie_results != 'undefined' || result.movie_results != null) {
                                    result.movie_results[0].id = res.rows[i].content_id;
                                    result.movie_results[0].original_language = languageDes(result.movie_results[0].original_language);
                                    movieList.push(result.movie_results[0]);
                                }
                            }
                        });
                }
            }
        });
    }

    let getMovieList = function () {
        movieList = [];
        const queryText = 'SELECT * FROM movieoasis_movie ORDER BY year DESC LIMIT 30';
        pool.query(queryText, (err, res) => {
            if (err) {
                //console.log("query error - getMovieList", err.message);
            } else {
                for (let i = 0; i < res.rows.length; i++) {
                    make_API_call('https://api.themoviedb.org/3/find/tt' + res.rows[i].movie_id + '?external_source=imdb_id&api_key=' + APIKey)
                        .then(result => {

                            if (result != "err") {
                                if (result.movie_results != 'undefined' || result.movie_results != null) {
                                    result.movie_results[0].id = res.rows[i].movie_id;
                                    result.movie_results[0].original_language = languageDes(result.movie_results[0].original_language);
                                    movieList.push(result.movie_results[0]);
                                }
                            }
                        });
                }
            }
        });
    }

    let searchMovie = function () {

        movieList = [];
        const queryText = 'SELECT movieoasis_movie.movie_id, movieoasis_movie.title, movieoasis_movie.year FROM movieoasis_movie ' +
            ' WHERE LOWER(movieoasis_movie.title) LIKE $1 ORDER BY movieoasis_movie.year DESC LIMIT 30';
        const values = ['%' + searchContent + '%'];
      
        pool.query(queryText, values, (err, res) => {
            if (err) {
                //console.log("query error - searchMovie", err.message);
            } else {
                for (let i = 0; i < res.rows.length; i++) {
                    make_API_call('https://api.themoviedb.org/3/find/tt' + res.rows[i].movie_id + '?external_source=imdb_id&api_key=' + APIKey)
                        .then(result => {
                            if (result != "err") {
                                if (result.movie_results != 'undefined' || result.movie_results != null) {
                                    result.movie_results[0].id = res.rows[i].movie_id;
                                    result.movie_results[0].original_language = languageDes(result.movie_results[0].original_language);
                                    movieList.push(result.movie_results[0]);
                                }
                            }
                        });
                }
            }
        });
    };

    let detailView = function (response) {
        
        movieList = [];
        make_API_call('https://api.themoviedb.org/3/find/tt' + searchContent + '?external_source=imdb_id&api_key=' + APIKey)
            .then(result => {
                if (result != "err") {
                   
                    if (result.movie_results != 'undefined' || result.movie_results != null) {
                        let movieGenre = [];
                    
                        for (let i = 0; i < result.movie_results[0].genre_ids.length; i++) {
                            for (let j = 0; j < genreList.length; j++) {
                                if (result.movie_results[0].genre_ids[i] == genreList[j]["id"]) {
                                    //console.log(genreList[j]);
                                    let genre = {
                                        "id": genreList[j]["id"],
                                        "name": genreList[j]["name"]
                                    }
                                    movieGenre.push(genre);
                                }
                            }
                        }
                   
                        result.movie_results[0]["genre_names"] = movieGenre;
                        result.movie_results[0]["movie_id"] = searchContent;
                        result.movie_results[0].original_language = languageDes(result.movie_results[0].original_language);
                        movieList.push(result.movie_results[0]);
                      
                    }
                }
            });
            saveCollectorLog(response, searchContent, "moreDetails");            
    };

    let getRecomm_AR = function () {
        recommARList = [];
        const queryText = 'SELECT distinct target FROM ( '
                        + 'SELECT target FROM seeded_recs INNER JOIN collector_log ON seeded_recs.source = collector_log.content_id ' 
                        + ' WHERE event = $1 AND user_id = $2 ORDER BY confidence ) as tbl LIMIT 10'
        
        const values = ['buy', user_id];
        pool.query(queryText, values, (err, res) => {
            if (err) {
                //console.log("query error - getRecommAR", err.message);
            } else {
                for (let i = 0; i < res.rows.length; i++) {
                    make_API_call('https://api.themoviedb.org/3/find/tt' + res.rows[i].target + '?external_source=imdb_id&api_key=' + APIKey)
                        .then(result => {
                            if (result != "err") {
                                if (result.movie_results != 'undefined' || result.movie_results != null) {
                                    result.movie_results[0].id = res.rows[i].target;
                                    recommARList.push(result.movie_results[0]);
                                }
                            }
                        });
                }
            }
        });
    };

    let displayHomePage = async (request, response) => {

        await getGenre();
        await getTopSell();
        
        if (isLogout)
        {
            user_id = "";
            user_name = "";
            loggedIn = false;
        } 
        else if (user_id == "" && request.cookies["id"] != "") 
        {
            user_id = request.cookies["id"];
            user_name = request.cookies["name"];
            loggedIn = request.cookies["loggedIn"];
        }
        
        console.log("user info")
        console.log(user_id);
        console.log(user_name);
        console.log(loggedIn);
      
        await getRecomm_AR();

        if (viewType == 1) //default view
            await getMovieList();
        else if (viewType == 2) 
            await getMoviesByGenre(response);
        else if (viewType == 3)
            await searchMovie();
        else if (viewType == 4) 
            await detailView(response);
        else if (viewType ==5)
            await getFavouriteList(response);
        await delay(5);

        //console.log("movie list count " + movieList.length);
        //console.log("movie list count " + movieList[0]);
        //console.log("Path --------------")
        //console.log(request.url);
        //console.log(request.originalUrl);
        //console.log(request.protocol);

        let data = {
            userId: user_id,
            userName: user_name,
            loggedIn: loggedIn,
            view: viewType,
            movies: movieList,
            genres: genreList,
            topsell: topSellList,
            recommAR: recommARList,
        }
        response.render('home', data)
    };

    let datestamp = function () {
        let date = new Date();
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    };

    let saveCollectorLog = function (response, content_id,  event) {

        const queryText = 'INSERT INTO collector_log (created, user_id, content_id, event, session_id) ' +
            'VALUES ($1, $2, $3, $4, $5)';
        const values = [datestamp(), user_id, content_id, event, user_id]
        pool.query(queryText, values, (err, res) => {
            if (err) {
                console.log("query error - getGenre", err.message);
            } 
        });
    }

    //get register user
    app.get('/register', (request, response) => {
        response.render('register')
    });

    //post register user
    app.post('/register', (request, response) => {
        pool.connect((err) => {
            const queryText = 'INSERT INTO auth_user (first_name, last_name, username, password, email,' +
                'is_superuser, is_staff, is_active, date_joined, last_login) ' +
                ' VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)';

            const user = request.body;
            const values = [user.firstName, user.lastName, user.userName, user.password, user.email,
                'f', 'f', 't', datestamp(), datestamp()
            ];

            pool.query(queryText, values, (err, res) => {
                if (err) {
                    console.log("query error", err.message);
                } else {
                    response.render('login')
                }
            });
        });
    });

    //user login form
    app.get('/login', (request, response) => {
        pool.connect((err) => {
            let displayMsg = {
                message: ''
            }
            response.render('login', displayMsg)
        });
    });

    //post user login
    app.post('/login', (request, response) => {
        pool.connect((err) => {
            let email = request.body.email;
            let password = request.body.password;

            const queryText = 'SELECT * FROM auth_user where email=$1 and password=$2';
            const values = [email, password];
            
            pool.query(queryText, values, (err, res) => {
                if (err) {
                    console.log("query error", err.message);
                } else {
                    if (res.rows.length > 0) {
                        response.cookie('loggedIn', true);
                        response.cookie('name', res.rows[0].username);
                        response.cookie('id', res.rows[0].id);
                        user_id = res.rows[0].id;
                        user_name = res.rows[0].username;
                        loggedIn = true;
                        isLogout = false;

                        viewType = 1;
                        displayHomePage(request, response);

                    } else {
                        let displayMsg = {
                            message: "Invalid email or password",
                            email: email,
                            password: password
                        }
                        response.render('login', displayMsg)
                    }

                }
            });
        });
    });

    // Home screen
    app.get('/', (request, response) => {
        viewType = 1;
        searchContent = "";
        displayHomePage(request, response);
    });

    // Display movies by genre
    app.get('/genre/:id', (request, response) => {
        viewType = 2;
        searchContent = request.params.id;
        displayHomePage(request, response);
    });

    // Search movies
    app.post('/movies/search', (request, response) => {
        viewType = 3;
        searchContent = request.body.q;
        displayHomePage(request, response);
    });

    // Detail view
    app.get('/movie/:id', (request, response) => {
        viewType = 4;
        searchContent = request.params.id;
        displayHomePage(request, response);
    });

    // Buy movie
    app.get('/buy/:id', (request, response) => {
        viewType = 1;
        searchContent = request.params.id;
        saveCollectorLog(response, searchContent, "buy");
        displayHomePage(request, response);
    });

    //save for later
    app.get('/movie/:id/viewlater', (request, response) => {
        viewType = 1;
        searchContent = request.params.id;
        saveCollectorLog(response, searchContent, "addToList");
        displayHomePage(request, response);
    });

     //favourite
     app.get('/favourite', (request, response) => {
        viewType = 5;
        displayHomePage(request, response);
    });

    //logout
    app.get('/logout', (request, response) => {
        response.cookie('loggedIn', false);
        response.cookie('name', "");
        response.cookie('id', "");
        loggedIn = false;
        user_id = "";
        user_name = "";
        searchContent = "";
        isLogout = true;
        viewType = 1;
        displayHomePage(request, response);
    });

   

    

























































    process.on('SIGTERM', onClose);
    process.on('SIGINT', onClose);



    //new artist form   >> [/new]        >> artist_new.jsx
    //edit an artist    >> [/artist/:id/edit]   >>artist_edit.jsx
    //delete an artist  >> [/artist/:id/delete]  >>artist_delete.jsx
    //show an artist    >> [/artist/:id] >> artist.jsx
    //show all artists  >> [/artists]    >> artists.jsx , artist.jsx

    //add new song of an artist      >> [/artist/:id/songs/new]  >> song_new.jsx
    //show songs of an artist           >> [/artist/:id/songs]      >> songs.jsx, song.jsx

    //add new favorite song          >> [/fovorites/new]         >> favorite_new.jsx
    //show songs of a user favorite  >> [/favorites]             >> songs.jsx, song.jsx

    //register user         >> [/register]      >> register_user.jsx
    //login user            >> [/login]         >> login.jsx

    //remark : id of the songs start from 500
