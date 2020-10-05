'use strict';

module.exports = {
    /* Client */
    Client: require('./client/Client'),
    RedditClient: require('./client/RedditClient'),
    /* Structures */
    Fullname: require('./structures/Fullname'),
    ClientUser: require('./structures/ClientUser'),
    Collection: require('./structures/Collection'),
    RedditPost: require('./structures/RedditPost'),
    UUID: require('./structures/UUID'),
    Subreddit: require('./structures/Subreddit'),
    /* Managers */
    UserPrefsManager: require('./managers/UserPrefsManager')
}