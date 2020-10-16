'use strict';

const RedditAPIError = require('../errors/RedditAPIError');
const Reddit = require('../client/RedditClient');
const Client = require('../client/Client');
const Fullname = require('./Fullname');
const UserPrefsManager = require('../managers/UserPrefsManager');
const UserList = require('./UserList');
const Trophy = require('./Trophy');
const SubredditKarma = require('./SubredditKarma');
const ClientSubreddit = require('./ClientSubreddit');

/**
 * Represents a client user.
 */
class ClientUser {
 /**
 * Creates a new client user from the data.
 * @param {Object} data The user data.
 */   
    constructor(client, data){
this.client = client;
        var user = data.user;
/* --------------------------------
    Main Properties
----------------------------------- */
/**
 * The raw data of the client user.
 * @type {Object}
 */
this.raw = data;

/* Create an array of trophies */
function trophyArray(arr){
    var trophyList = [];
    arr.forEach(trophy => {
        trophyList.push(new Trophy(trophy.data, client));
    });
        return trophyList;
};
/**
 * An array of trophies the user has.
 * @type {Array<Trophy>} 
 */
this.trophies = trophyArray(data.trophies.data.trophies);
/**
 * A UserPrefsManager.
 * @type {UserPrefsManager}
 */
this.prefs = new UserPrefsManager(client, data.prefs);

/* Create an array of karma */
function karmaArray(arr){
    var karmaList = [];
    arr.forEach(karma => {
        karmaList.push(new SubredditKarma(karma, client));
    });
        return karmaList;
};
/**
 * A breakdown of this user's karma.
 * @type {Array<SubredditKarma>}
 */
this.karma = karmaArray(data.karma);
/**
 * This users subreddit. Also known as profile page.
 * @type {ClientSubreddit}
 */
this.subreddit = new ClientSubreddit(user.subreddit, client);
/**
 * Information on user features.
 * @type {Object}
 */
this.features = user.features;
/**
 * A reddit `UserList` of this users friends.
 * @type {UserList}
 */
this.friends = new UserList(data.friends.data);
/* --------------------------------
    User Args
----------------------------------- */
/**
 * If the user is an employee.
 * @type {?Boolean}
 * @readonly
 */
this.isEmployee = user.is_employee;
/**
 * If the user has seen the layout switch.
 * @type {?Boolean}
 * @readonly
 */
this.seenlayoutSwitch = user.seen_layout_switch;
/**
 * If the user has visited their new profile.
 * @type {?Boolean}
 * @readonly
 */
this.hasVisitedNewProfile = user.has_visited_new_profile;
/**
 * If the user has enabled no profanity.
 * @type {?Boolean}
 * @readonly
 */
this.prefNoProfanity = user.pref_no_profanity;
/** 
 * If the user has an external account.
 * @type {?Boolean}
 * @readonly
*/
this.hasExternalAccount = user.has_external_account;
/**
 * If the user has enabled popular by location.
 * @type {?Boolean}
 * @readonly
 */
this.prefGeopopular = user.pref_geopopular;
/**
 * If the user has seen the redesign model.
 * @type {?Boolean}
 * @readonly
 */
this.seenRedesignModel = user.seen_redesign_modal;
/**
 * If the user has enabled show trending.
 * @type {?Boolean}
 * @readonly
 */
this.prefShowTrending = user.pref_show_trending;
/**
 * If the user has an android subscription.
 * @type {?Boolean}
 * @readonly
 */
this.hasAndroidSubscription = user.has_android_subscription;
/**
 * If the user is verified.
 * @type {?Boolean}
 * @readonly
 */
this.verified = user.verified;
/**
 * If new modmail exists on the user's account.
 * @type {?Boolean}
 * @readonly
 */
this.newModmailExists = user.new_modmail_exists; 
/**
 * If the user has enabled autoplay. 
 * @type {?Boolean}
 * @readonly
 */
this.prefAutoplay = user.pref_autoplay;
/**
 * The amount of coins the user has.
 * @type {Number}
 * @readonly
 */
this.coins = user.coins;
/**
 * If the user has a paypal subscription.
 * @type {?Boolean}
 * @readonly
 */
this.hasPaypalSubscription = user.has_paypal_subscription;
/**
 * If the user has subscribed to premium.
 * @type {?Boolean}
 * @readonly
 */
this.hasSubscribedToPremium = user.has_subscribed_to_premium;
/**
 * The Fullname ID of the user.
 * @type {Fullname}
 * @readonly
 */
this.id = user.id;
/**
 * If the user has a stripe subscription.
 * @type {?Boolean}
 * @readonly
 */
this.hasStripeSubscription = user.has_stripe_subscription;
/**
 * The ID of the oauth client.
 * @type {String}
 * @readonly
 */
this.oauthClientId = user.oauth_client_id;
/**
 * If the user can create a subreddit.
 * @type {?Boolean}
 * @readonly
 */
this.canCreateSubreddit = user.can_create_subreddit;
/**
 * If the user is over 18.
 * @type {?Boolean}
 * @readonly
 */
this.over18 = user.over_18;
/**
 * If the user is gold.
 * @type {?Boolean}
 * @readonly
 */
this.isGold = user.is_gold;
/**
 * If the user is a mod.
 * @type {?Boolean}
 * @readonly
 */
this.isMod = user.is_mod;
/**
 * The amount of karma the user has awarded.
 * @type {Number}
 * @readonly
 */
this.awarderKarma = user.awarder_karma;
/**
 * The UTC timestamp the user's suspension will end.
 * @type {?Date}
 * @readonly
 */
this.suspensionExpirationUtc = user.suspension_expiration_utc;
/**
 * If the user has verified their email.
 * @type {?Boolean}
 * @readonly
 */
this.hasVerifiedEmail = user.has_verified_email;
/**
 * If the user is currently suspended.
 * @type {?Boolean}
 * @readonly
 */
this.isSuspended = user.is_suspended;
/**
 * If the user has enabled video autoplay.
 * @type {?Boolean}
 * @readonly
 */
this.prefVideoAutoplay = user.pref_video_autoplay;
/**
 * If the user is currently in a chat.
 * @type {?Boolean}
 * @readonly
 */
this.inChat = user.in_chat;
/**
 * If the user can edit their name.
 * @type {?Boolean}
 * @readonly
 */
this.canEditName = user.can_edit_name;
/**
 * If the user is in the beta redesgin.
 * @type {?Boolean}
 * @readonly
 */
this.inRedesignBeta = user.in_redesign_beta;
/**
 * The URL of this user's icon.
 * @type {String}
 * @readonly
 */
this.iconImg = user.icon_img;
/**
 * If the user has modmail.
 * @type {?Boolean}
 * @readonly
 */
this.hasModMail = user.has_mod_mail;
/**
 * If the user is in night mode.
 * @type {?Boolean}
 * @readonly
 */
this.prefNightmode = user.pref_nightmode;
/**
 * The amount of karma the user has been awarded.
 * @type {Number}
 * @readonly
 */
this.awardeeKarma = user.awardee_karma;
/**
 * If the user is hidden from bots.
 * @type {?Boolean}
 * @readonly
 */
this.hideFromRobots = user.hide_from_robots;
/**
 * If the user has set their password.
 * @type {?Boolean}
 * @readonly
 * @deprecated Client users are required to have their password set.
 */
this.passwordSet = user.password_set;
/**
 * Total amount of karam the user has earned from links.
 * @type {Number}
 * @readonly
 */
this.linkKarma = user.link_karma;
/**
 * If the user will be forced to reset their password on login.
 * @type {?Boolean}
 * @readonly
 */
this.forcePasswordReset = user.force_password_reset;
/**
 * The total amount of karma the user has.
 * @type {Number}
 * @readonly
 */
this.totalKarma = user.total_karma;
/**
 * If the user has seen the give award tooltip.
 * @type {?Boolean}
 * @readonly
 */
this.seenGiveAwardTooltip = user.seen_give_award_tooltip;
/**
 * The total number of unread messages in the user's inbox.
 * @type {Number}
 * @readonly
 */
this.inboxCount = user.inbox_count;
/**
 * If the user has seen the ad free premium popup.
 * @type {?Boolean}
 * @readonly
 */
this.seenPremiumAdblockModel = user.seen_premium_adblock_modal;
/**
 * If the user has enabled top karma subreddits.
 * @type {?Boolean}
 * @readonly
 */
this.prefTopKarmaSubreddits = user.pref_top_karma_subreddits;
/**
 * If the user has any mail.
 * @type {?Boolean}
 * @readonly
 * @deprecated Identical to `inboxCount > 0`
 */
this.hasMail = user.has_mail;
/**
 * If the user has enabled the snoo avatar.
 * @type {?Boolean}
 * @readonly
 */
this.prefShowSnoovatar = user.pref_show_snoovatar;
/**
 * The name of the user (without u/ or u_)
 * @type {String}
 * @readonly
 */
this.name = user.name;
/**
 * If the user has enabled the click gadget.
 * @type {?Boolean}
 * @readonly
 */
this.prefClickgadget = user.pref_clickgadget;
/**
 * The timestamp the user was created.
 * @type {Date}
 * @readonly
 */
this.created = user.created;
/**
 * The UTC timestamp the user was created.
 * @type {Date}
 * @readonly
 */
this.createdUtc = user.created_utc;
/**
 * The total amount of gold credits the user has.
 * @type {Number}
 * @readonly
 */
this.goldCredits = user.gold_creddits;
/**
 * If the user has an iOS subscription.
 * @type {?Boolean}
 * @readonly
 */
this.hasIosSubscription = user.has_ios_subscription;
/**
 * If the user displays twitter on their profile.
 * @type {?Boolean}
 * @readonly
 */
this.prefShowTwitter = user.pref_show_twitter;
/**
 * If the user is in beta.
 * @type {?Boolean}
 * @readonly
 */
this.inBeta = user.in_beta;
/**
 * The total amount of karma earned from comments.
 * @type {Number}
 * @readonly
 */
this.commentKarma = user.comment_karma;
/**
 * If the user has subscribed.
 * @type {?Boolean}
 * @readonly
 */
this.hasSubscribed = user.has_subscribed;
/**
 * An array of users linked to this account.
 * @type {Array<Object>}
 * @readonly
 */
this.linkedIdentities = user.linked_identities;
/**
 * If the user has seen a subreddit chat ftux.
 * @type {?Boolean}
 * @readonly
 */
this.seenSubredditChatFtux = user.seen_subreddit_chat_ftux;


    }
}



module.exports = ClientUser;