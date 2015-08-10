var express = require("express");
var bodyparser = require("body-parser");
var logger = require("./lib/logger");
var async = require("async");
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
var jsonParser = bodyparser.json()
app.use(bodyparser.urlencoded({ extended: false}));

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

app.post('/gitlab/user/create',jsonParser,  function(req, res){

  var result = [];
  var selectedRow = [];
  var csv = JSON.parse(req.body.data);

  for(var i=0; i<csv.length;i++){
    if(csv[i].Checked == true){
      selectedRow.push(csv[i]);
    }
  }


  async.each(selectedRow, function(row, callback) {


      console.log("----------------------------------")
      console.log(row.Name);
      console.log("----------------------------------")


        // set param object to each individula data point
        var param = {};
        param.name = row.Name;
        param.username = row.Name;
        param.password = row.Email;
        param.email = row.Email;

        console.log(param);



        gitlab.users.create(param, function(list){
          if(list == true){
              result.push({name: param.name, email: param.email, status: "exist" });
              callback();
            }else {
              result.push({name: list.name, email: list.email, status: "success" });
              callback();

          }
        });


  }, function (err) {
        console.log(result);
        res.json(JSON.stringify(result));
  });

});

app.delete('/gitlab/user/:id', function(req, res){

  // code for deleting user

});

// Port setup
var port = process.argv[2] || 3000;
console.log(port);

// Server setup
var server = app.listen(port, function () {

    var host = server.address().address;
    var port = server.address().port;
    logger.log("info", host );
    logger.log("info", port)

});
