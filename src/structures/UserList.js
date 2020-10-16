'use strict';

const RedditAPIError = require('../errors/RedditAPIError');
const Reddit = require('../client/RedditClient');
const Client = require('../client/Client');
const Fullname = require('./Fullname');
const Collection = require('./Collection');

/**
 * Represents a list of users.
 */
class UserList {
    constructor(data){

        /**
         * The raw data of the user list.
         * @type {object}
         */
        this.raw = data;

        /**
         * The members of this user list.
         * @type {Array}
         */
        this.children = data.data.children;

    }
}

module.exports = UserList;