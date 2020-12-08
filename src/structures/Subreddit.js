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
        // Global //
        var basic = data.basic.data;
        this.basic = data.basic;
        //
        /**
         * The fullname prefix of the data.
         * @returns {String} The kind of data.
         * @deprecated This always returns `t5`.
         */
        this.kind = data.basic.kind;
        /* Data */
        /**
         * The background color of the clients user flair.
         * @returns {?String} The hex color code.
         */
        this.userFlairBackgroundColor = basic.user_flair_background_color;
        /**
         * The html for submissions to this subreddit.
         * @returns {?String} The html code. 
         */
        this.submitTextHtml = basic.submit_text_html;
        /**
         * If this subreddit restricts posting.
         * @returns {?Boolean}
         */
        this.restrictPosting = basic.restrict_posting;
        /**
         * If the client is banned from the subreddit.
         * @returns {?Boolean}
         */
        this.userIsBanned = basic.user_is_banned;
        /**
         * If free form reports are enabled in the subreddit.
         * @returns {?Boolean}
         */
        this.freeFormReports = basic.free_form_reports;
        /**
         * If the wiki is enabled in the subreddit.
         * @returns {?Boolean}
         */
        this.wikiEnabled = basic.wiki_enabled;
        /**
         * If the client is muted in the subreddit.
         * @returns {?Boolean}
         */
        this.userIsMuted = basic.user_is_muted;
        
    }
}

module.exports = Subreddit;