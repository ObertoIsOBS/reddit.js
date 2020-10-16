'use strict';

const RedditAPIError = require('../errors/RedditAPIError');
const Reddit = require('../client/RedditClient');
const Client = require('../client/Client');
const Fullname = require('./Fullname');
const Collection = require('./Collection');
const Subreddit = require('./Subreddit');

/**
 * Represents karma earned in a subreddit.
 */
class SubredditKarma {
constructor(data, client) {
    /**
     * The raw data of the subreddit karma.
     * @type {object}
     */
    this.raw = data;
    /**
     * The client that intiated this.
     * @type {Client}
     */
    this.client = client;
    /**
     * The name of the subreddit the karma belongs to. (Without `r/` or `r_`)
     * @type {string}
     */
    this.subreddit = data.sr;
    /**
     * Karma earned from comments.
     * @type {number} 
     */    
    this.comments = data.comment_karma;
    /**
     * Karma earned from links.
     * @type {number}
     */
    this.links = data.link_karma;
}
    /**
     * Fetches the subreddit the karma belongs to.
     * @return {Promise<Subreddit>}
     */
    async fetch() {
        return await this.client.fetchSubreddit(this.subreddit);
    }
}

module.exports = SubredditKarma;