var React = require("react");

class Register extends React.Component {
    
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
                <div className="panel panel-default p-register">
                    <div className="panel-heading">
                        <strong>Register</strong>
                    </div>
                  
                    <div className="panel-body">


    <form method="POST" className="form-horizontal" role="form" action={"/register"}>
        <div className="form-group">
            <label name="inputfirstName3" className="col-sm-3 control-label">
                First Name
            </label>
            <div className="col-sm-9">
                <input name="firstName" className="form-control" id="inputfirstName3" placeholder="First Name" required="" />
            </div>
        </div>
        <div className="form-group">
            <label name="inputlastname3" className="col-sm-3 control-label">
                Last Name
            </label>
            <div className="col-sm-9">
                <input name="lastName" className="form-control" id="inputlastname3" placeholder="Last Name" required="" />
            </div>
        </div>
        <div className="form-group">
            <label name="inputEmail3" className="col-sm-3 control-label">
                Email
            </label>
            <div className="col-sm-9">
                <input type="email" name="email" className="form-control" id="inputEmail3" placeholder="Email" required="" />
            </div>
        </div>
        <div className="form-group">
            <label name="inputUserName3" className="col-sm-3 control-label">
                User Name
            </label>
            <div className="col-sm-9">
                <input name="userName" className="form-control" id="inputUserName3" placeholder="User Name" required="" />
            </div>
        </div>
        <div className="form-group">
            <label name="inputPassword3" className="col-sm-3 control-label">
                Password
            </label>
            <div className="col-sm-9">
                <input type="password" name="password" className="form-control" id="inputPassword3" placeholder="Password" required="" />
            </div>
        </div>
        <div className="form-group last">
            <div className="col-sm-offset-3 col-sm-9">
                <button type="submit" className="btn btn-success btn-md btn-m-r">Register</button>
                <button type="reset" className="btn btn-default btn-md">Reset</button>
            </div>
        </div>
    </form>
    </div>
        <div className="panel-footer">
            <center>Already Registered? <a href="/login">Login here</a></center>
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

module.exports = Register;
