'use strict';

const RedditAPIError = require('../errors/RedditAPIError');

/**
 * Fullname ID pattern used by reddit.
 */
class Fullname {
    /**
     * Creates a Fullname ID pattern.
     * @param {String} type The type of reddit ID.
     * @param {String} str The string to encode.
     */
    constructor(type, str){
        var redditTypes = [
            "t1_",
            "t2_",
            "t3_",
            "t4_",
            "t5_",
            "t6_"
        ];

if (!redditTypes.includes(type)) return;

this.type = type;
this.id = id;
/**
 * The reddit type prefixes for Fullname ids.
 * `t1_ : Comment,
 * t2_ : Account,
 * t3_ : Link,
 * t4_ : Message,
 * t5_ : Subreddit,
 * t6_ : Award`
 * @type {String}
 */
this.TYPES = `
t1_ : Comment
t2_ : Account
t3_ : Link
t4_ : Message
t5_ : Subreddit
t6_ : Award
`

        return Array.prototype.map.call(str, function (c) {
            return `${type}` + c.charCodeAt(0).toString(36);
        }).join("");
    }
}

module.exports = Fullname;