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
    ClientSubreddit: require('./structures/ClientSubreddit'),
    Trophy: require('./structures/Trophy'),
    UserList: require('./structures/UserList'),
    SubredditKarma: require('./structures/SubredditKarma'),
    /* Managers */
    UserPrefsManager: require('./managers/UserPrefsManager')
}