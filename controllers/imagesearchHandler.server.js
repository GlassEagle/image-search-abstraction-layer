"use strict";

var config = require(process.env.HOME + "/secret/config.js");
var pixabay_api_key = config.pixabay_api_key;
var https = require("https");
var recentSearch = require("../models/recentSearches.js");

function imagesearchHandler(req, res){
    if(undefined == req.query.offset || req.query.offset < 1){
        req.query.offset = 1;
    }
    var hostname = "pixabay.com";
    var path = "/api/?" +
        "key=" + pixabay_api_key +
        "&q=" + req.params.query +
        "&per_page=10" +
        "&page=" + req.query.offset;
    
    var latest = new recentSearch();
    latest.term = req.params.query;
    latest.save(function(err){
        if (err) console.log(err);
    });
        
    var options = {"hostname": hostname, "path": path};
    https.get(options, pixabay_callback);
  
    function pixabay_callback(pixabay_res){
        let rawData = "";
        
        pixabay_res.on("data", function(chunk){
            rawData+=chunk;
        });
        
        pixabay_res.on("end", function(){
            var toSend = parse_pixabay_results(rawData);
            toSend = JSON.stringify(toSend);
            res.setHeader("content-type", "application/json");
            res.send(toSend);
        });
    }  
}

function parse_pixabay_results(json){
    var data = JSON.parse(json);
    var hits = [];
    var index;
    
    for (index in data.hits){
        let obj = {};
        obj.url = data.hits[index].webformatURL;
        obj.snippet = data.hits[index].tags;
        obj.thumbnail = data.hits[index].previewURL;
        obj.context = data.hits[index].pageURL;
        hits.push(obj);
    }
    
    return hits;
}

module.exports = imagesearchHandler;