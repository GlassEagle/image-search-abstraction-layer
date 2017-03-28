"use strict";

function imagesearchHandler(req, res){
  res.send(req.params.query + "?offset=" + req.query.offset)
}

module.exports = imagesearchHandler;