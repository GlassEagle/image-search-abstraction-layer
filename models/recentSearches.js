'use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var recentSearch = new Schema({
    term: {type: String},
    when: {type: Date, default: Date.now}
});

recentSearch.path("when").get(function(v){
    return v.toString();
});

module.exports = mongoose.model('recentSearch', recentSearch);