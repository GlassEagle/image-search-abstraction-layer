"use strict";

var mongoose = require("mongoose");
var cacheManager = require("cache-manager");
var mongooseStore = require("cache-manager-mongoose");

var cache = cacheManager.caching({
    store: mongooseStore,
    mongoose, mongoose,
    ttl: 60
});
//TODO: change ttl to 24 hours

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
    getPixabayQuery(options.path, sendJSON);
    
    function sendJSON(err, data){
        //process data
        if(err) {throw err};
        res.setHeader("content-type", "application/json");
        res.send(data);
    }
    
    function getPixabayQuery(id, cb){
        cache.wrap(id, function(cacheCallback){
            //not in cache, get from pixabay
            let data = "";
            https.get(options, function(pixabay_response){
                pixabay_response.on("data", function(chunk){
                    data += chunk;
                });
                pixabay_response.on("end", function(){
                    data = parse_pixabay_results(data);
                    data = JSON.stringify(data);
                    cache.set(id, data);
                    cacheCallback(null, data);
                })
            });
        }, cb);
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