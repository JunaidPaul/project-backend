var express = require("express");
var bodyparser = require("body-parser");
var logger = require("./lib/logger");
var csvData = [];
// var gitlab = require('gitlab')({
//   url:   'https://gitlab.com',
//   token: 'C_uLeyKFmHMrgtDAtyRi'
// });

var gitlab = require('gitlab')({
  url:   'http://45.55.229.21',
  token: 'sMgZCxzCKLEnixCcoyos'
});



var app  = express();

// body parser middleware
app.use(bodyparser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});


app.get('/gitlab/users/list', function(req, res){

  // Listing users
  var users = [];
  gitlab.users.all(function(list) {
    for (var i = 0; i < list.length; i++) {
      users.push(list[i].name);
    }
    res.status(200).send(users);
  });

});

app.post('/gitlab/user/create', function(req, res){

  // code for creating new user
  var param = {name: "createtest",username: "createtest",password: "createtest", email: "createtest@test.com"};
  // var param = {name: req.body.name,username: req.body.username,password: req.body.password, email: req.body.email};
  gitlab.users.create(param, function(list){
    if(list){
      res.status(200).send(list);
    }else{
      res.status(500).send("something went wrong");
    }
  });

});

app.delete('/gitlab/user/:id', function(req, res){

  // code for deleting user

});

// receive csv file
app.post('/gitlab/upload/csv', function(req, res){


        var body;
        var files = [];

        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
          var csv = body.split('\n');
          var header = csv[3].split(',');

          for(var i=0; i<csv.length; i++){
            if(i>3 && i<csv.length-2){
              var row = '';
              row = csv[i].split(',');
              var file = {};
              // add header to the object
              for(var j=0; j<row.length; j++){
                file[header[j]] = row[j];
                if(j == row.length-1){
                  files.push(file);
                }
              }
          }
        }

          for(var k=0; k<files.length; k++){
            console.log(files[k]);
          }
          res.send(files);
        });

});

// Port setup
var port = process.argv[2] || 3000;

// Server setup
var server = app.listen(port, function () {

    var host = server.address().address;
    var port = server.address().port;
    logger.log("info", host );
    logger.log("info", port)

});
