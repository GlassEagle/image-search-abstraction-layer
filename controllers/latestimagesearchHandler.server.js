"use strict";

var recentSearch = require("../models/recentSearches.js");

function latestimagesearchHandler(req, res){
    recentSearch
    .find({}, {_id: false, term: true, when: true})
    .limit(10)
    .sort("-when")
    .exec(function(err, doc){
        if(err){
            res.setHeader("content-type", "application/json");
            res.send(JSON.stringify(err));
            return;
        }
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(doc));
    });
}

module.exports = latestimagesearchHandler;