'use strict';

const RedditAPIError = require('../errors/RedditAPIError');
const Reddit = require('../client/RedditClient');
const Client = require('../client/Client');
const Fullname = require('./Fullname');
const Collection = require('./Collection');
const Subreddit = require('./Subreddit');

/**
 * Represents the clients subreddit. Also known as profile page.
 */
class ClientSubreddit {
    constructor(data, client) {
        /**
         * The raw data of this subreddit.
         * @type {object}
         */
        this.raw = data;
        /**
         * The client that intiated this.
         * @type {Client}
         */
        this.client = client;
        /**
         * If this is the default set.
         * @type {?Boolean}
         */
        this.defaultSet = data.defualt_set;
        /**
         * If the user is a contributor in the subreddit.
         * @type {?Boolean}
         */
        this.contributor = data.user_is_contributor;
        /**
         * The banner image for the subreddit.
         * @type {?String}
         */
        this.bannerImg = data.banner_img;
        /**
         * If this subreddit restricts posting.
         * @type {?Boolean}
         * @deprecated User subreddits are always restricted.
         */
        this.restrictPosting = data.restrict_posting;
        /**
         * If the user is banned from the subreddit.
         * @type {?Boolean}
         * @deprecated The user cannot be banned from it's own subreddit.
         */
        this.banned = data.user_is_banned;
        /**
         * If free form reports are allowed.
         * @type {?Boolean}
         */
        this.freeFormReports = data.free_form_reports;
        /**
         * The icon for this community.
         * @type {?String}
         */
        this.communityIcon = data.community_icon;
        /**
         * If show media is enabled in the subreddit.
         * @type {?Boolean}
         */
        this.showMedia = data.show_media;
        /**
         * The color of this subreddits icon.
         * @type {?String}
         */
        this.iconColor = data.icon_color;
        /**
         * If the user is muted in the subreddit.
         * @type {?Boolean}
         * @deprecated The user cannot be muted in it's own subreddit.
         */
        this.muted = data.user_is_muted;
        /**
         * The display name of the reddit. Always `u_[username]`.
         * @type {String}
         */
        this.displayName = data.display_name;
        /**
         * The header image of this subreddit.
         * @type {?String}
         */
        this.headerImg = data.header_img;
        /**
         * The title of this subreddit. Also the users title.
         * @type {String}
         */
        this.title = data.title;
        /**
         * The amount of coins the subreddits client has.
         * @type {Number}
         */
        this.coins = data.coins;
        /**
         * An array of any names the subreddit had.
         * @type {?Array<String>}
         */
        this.previousNames = data.previous_names;
        /**
         * If the subreddits client is over 18.
         * @type {?Boolean}
         */
        this.client.over18 = data.over_18;
        /**
         * An array of the X and Y length of this subreddits icon in pixels.
         * @type {?Array<Number>}
         * @example [256, 256]
         */
        this.iconSize = data.icon_size;
        /**
         * The primary color of the subreddit.
         * @type {?String}
         */
        this.primaryColor = data.primary_color;
        /**
         * The icon image for this subreddit.
         * @type {?String}
         */
        this.iconImg = data.icon_img;
        /**
         * The description of the subreddit.
         * @type {?String}
         */
        this.description = data.description;
        /**
         * The submit link label for this subreddit.
         * @type {?String}
         */
        this.submitLinkLabel = data.submit_link_label;
        /**
         * An array of the X and Y length of this subreddits header in pixels.
         * @type {?Array<Number>}
         * @example [256, 256]
         */
        this.headerSize = data.header_size;
        /**
         * If this subreddit restricts commenting.
         * @type {?Boolean}
         */
        this.restrictComenting = data.restrict_commenting;
        /**
         * The number of subscribers this subreddit has.
         * @type {Number}
         */
        this.subscribers = data.subscribers;
        /**
         * The submit text label for this subreddit.
         * @type {?String}
         */
        this.submitTextLabel = data.submit_text_label;
        /**
         * If the subreddit uses the default icon.
         * @type {?Boolean}
         */
        this.isDefualtIcon = data.is_default_icon;
        /**
         * The link flair position of this subreddit.
         * @type {?String}
         */
        this.linkFlairPosition = data.link_flair_position;
        /**
         * The display name of the subreddit. Always `u/[username]`
         * @type {String}
         * @deprecated There is no need for this method.
         */
        this.displayNamePrefixed = data.display_name_prefixed;
        /**
         * The key color of this subreddit.
         * @type {?String}
         */
        this.keyColor = data.key_color;
        /**
         * The fullname of this subreddit.
         * @type {Fullname}
         */
        this.name = data.name;
        /**
         * If the subreddit uses the default banner.
         * @type {?Boolean}
         */
        this.isDefualtBanner = data.is_default_banner;
        /**
         * The URL of this subreddit. Always `/user/[username]/`
         * @type {String}
         */
        this.url = data.url;
        /**
         * An array of the X and Y length of this subreddits banner in pixels.
         * @type {?Array<Number>}
         * @example [256, 256]
         */
        this.bannerSize = data.banner_size;
        /**
         * If the user is a moderator.
         * @type {?Boolean}
         * @deprecated The user is always a moderator in their own subreddit.
         */
        this.moderator = data.user_is_moderator;
        /**
         * The public description of this subreddit. Aka Bio.
         * @type {?String}
         */
        this.bio = data.public_description;
        /**
         * If link flair is enabled in this subreddit.
         * @type {?Boolean}
         */
        this.linkFlairEnabled = data.link_flair_enabled;
        /**
         * If contributor requests is disabled.
         * @type {?Boolean}
         */
        this.disableContributorRequests = data.disable_contributor_requests;
        /**
         * The type of subreddit.
         * @type {String}
         * @deprecated This is always `user`.
         */
        this.type = data.subreddit_type;
        /**
         * If the user is a subscriber of this subreddit.
         * @type {?Boolean}
         */
        this.subscriber = data.user_is_subscriber;
    }
}

module.exports = ClientSubreddit;