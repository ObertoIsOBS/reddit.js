'use strict';

const RedditAPIError = require('../errors/RedditAPIError');
const Reddit = require('../client/RedditClient');
const Client = require('../client/Client');
const Fullname = require('./Fullname');
const Collection = require('./Collection');

class Subreddit {
    constructor(data, client){
        /* Cons. */
        this.raw = data;
        this.client = client;
        /* Basic */
        // Glob //
        var basic = data.basic.data;
        this.basic = data.basic;
        //
        /**
         * The fullname prefix of the data.
         * @returns {String} The kind of data.
         * @deprecated This always returns `t5`.
         */
        this.kind = data.basic.kind;
        /**
         * 
         */
    }
}

module.exports = Subreddit;