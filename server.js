"use strict";

var path = process.cwd()
var imagescearchHandler = require(path + "/controllers/imagesearchHandler.server.js")
var latestimagesearchHandler = require(path + "/controllers/latestimagesearchHandler.server.js")
var express = require("express");


var app = express()
var mongoose = require("mongoose")
mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost:27017/data", {useMongoClient: true});

app.get('/', function(req, res){
  res.sendFile(process.cwd() + "/public/index.html");
});

app.get("/api/imagesearch/:query", imagescearchHandler)
app.get("/api/latest/imagesearch", latestimagesearchHandler)

app.listen(process.env.PORT, function () {
  console.log('App listening on port %s!', process.env.PORT)
})