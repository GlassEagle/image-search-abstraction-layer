"using strict"

var path = process.cwd()
var imagescearchHandler = require(path + "/controllers/imagesearchHandler.server.js")
var latestimagesearchHandler = require(path + "/controllers/latestimagesearchHandler.server.js")
var express = require("express");


var app = express()
var mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/data");

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get("/api/imagesearch/:query", imagescearchHandler)
app.get("/api/latest/imagesearch", latestimagesearchHandler)

app.listen(8080, function () {
  console.log('Example app listening on port 3000!')
})