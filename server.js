"using strict"

var path = process.cwd()
var imagescearchHandler = require(path + "/controllers/imagesearchHandler.server.js")
var express = require("express");


var app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get("/api/imagesearch/:query", imagescearchHandler)

app.listen(8080, function () {
  console.log('Example app listening on port 3000!')
})