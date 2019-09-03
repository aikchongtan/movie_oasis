var React = require("react");

class Login extends React.Component {
    
  render() {

    return (
<html>
<head>
          <title>Movie Oasis</title>
        </head>
<link rel="stylesheet" href="/css/movieoasis.css" />
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css" />
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script>
<body className="body-account">
   
    <div className="container"> 
        <div className="row">
            <div className="col-md-4 col-md-offset-4">
                <div className="panel panel-default p-login">
                    <div className="panel-heading">
                        <strong>Login</strong>
                    </div>
                    <div className="panel-body">

    <form method="POST" className="form-horizontal" role="form" action={"/login"}>
        <div className="form-group">
            <label className="col-sm-10 control-label text-danger">
                {this.props.message}
            </label>
        </div>
        
        <div className="form-group">
            <label name="inputEmail3" className="col-sm-3 control-label">
                Email
            </label>
            <div className="col-sm-9">
                <input type="email" name="email" className="form-control" id="inputEmail3" placeholder="Email" value={this.props.email} required="" />
            </div>
        </div>
        <div className="form-group">
            <label name="inputPassword3" className="col-sm-3 control-label">
                Password
            </label>
            <div className="col-sm-9">
                <input type="password" name="password" className="form-control" id="inputPassword3" placeholder="Password" value={this.props.password}  required="" />
            </div>
        </div>
        <div className="form-group">
            <div className="col-sm-offset-3 col-sm-9">
                <div className="checkbox">
                    <label><input type="checkbox" />Remember me
                    </label>
                </div>
            </div>
        </div>
        <div className="form-group last">
            <div className="col-sm-offset-3 col-sm-9">
                <button type="submit" className="btn btn-success btn-md btn-m-r">Sign in</button>
                <button type="reset" className="btn btn-default btn-md">Reset</button>
            </div>
        </div>
    </form>
                </div>
                    <div className="panel-footer">
                        <center>Not Registered? <a href="/register">Register here</a></center>
                    </div>
                </div>
            </div>
        </div>
    </div>

    
        </body>
      </html>
    );
  }
}

module.exports = Login;
