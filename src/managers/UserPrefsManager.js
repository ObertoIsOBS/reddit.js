'use strict';

const RedditAPIError = require('../errors/RedditAPIError');
const ClientUser = require('../structures/ClientUser');

/**
 * Represents a UserPrefsManager
 */
class UserPrefsManager {
/**
 * Creates a new perference manager.
 * @param {Client} client The client.
 * @param {Object} prefs 
 */
    constructor(client, prefs){
this.client = client;
/**
 * A list of this users preferences.
 * @type {Object}
 * @readonly
 */
this.cache = prefs;
/**
 * The accepted values for `UserPrefsManager#edit`
 * `accept_pms": one of (\`everyone\`, \`whitelisted\`),
  "activity_relevant_ads": boolean value,
  "allow_clicktracking": boolean value,
  "beta": boolean value,
  "clickgadget": boolean value,
  "collapse_read_messages": boolean value,
  "compress": boolean value,
  "creddit_autorenew": boolean value,
  "default_comment_sort": one of (\`confidence\`, \`top\`, \`new\`, \`controversial\`, \`old\`, \`random\`, \`qa\`, \`live\`),
  "domain_details": boolean value,
  "email_digests": boolean value,
  "email_messages": boolean value,
  "email_unsubscribe_all": boolean value,
  "enable_default_themes": boolean value,
  "g": one of (\`GLOBAL\`, \`US\`, \`AR\`, \`AU\`, \`BG\`, \`CA\`, \`CL\`, \`CO\`, \`HR\`, \`CZ\`, \`FI\`, \`GR\`, \`HU\`, \`IS\`, \`IN\`, \`IE\`, \`JP\`, \`MY\`, \`MX\`, \`NZ\`, \`PH\`, \`PL\`, \`PT\`, \`PR\`, \`RO\`, \`RS\`, \`SG\`, \`SE\`, \`TW\`, \`TH\`, \`TR\`, \`GB\`, \`US_WA\`, \`US_DE\`, \`US_DC\`, \`US_WI\`, \`US_WV\`, \`US_HI\`, \`US_FL\`, \`US_WY\`, \`US_NH\`, \`US_NJ\`, \`US_NM\`, \`US_TX\`, \`US_LA\`, \`US_NC\`, \`US_ND\`, \`US_NE\`, \`US_TN\`, \`US_NY\`, \`US_PA\`, \`US_CA\`, \`US_NV\`, \`US_VA\`, \`US_CO\`, \`US_AK\`, \`US_AL\`, \`US_AR\`, \`US_VT\`, \`US_IL\`, \`US_GA\`, \`US_IN\`, \`US_IA\`, \`US_OK\`, \`US_AZ\`, \`US_ID\`, \`US_CT\`, \`US_ME\`, \`US_MD\`, \`US_MA\`, \`US_OH\`, \`US_UT\`, \`US_MO\`, \`US_MN\`, \`US_MI\`, \`US_RI\`, \`US_KS\`, \`US_MT\`, \`US_MS\`, \`US_SC\`, \`US_KY\`, \`US_OR\`, \`US_SD\`),
  "hide_ads": boolean value,
  "hide_downs": boolean value,
  "hide_from_robots": boolean value,
  "hide_ups": boolean value,
  "highlight_controversial": boolean value,
  "highlight_new_comments": boolean value,
  "ignore_suggested_sort": boolean value,
  "in_redesign_beta": boolean value,
  "label_nsfw": boolean value,
  "lang": a valid IETF language tag (underscore separated),
  "legacy_search": boolean value,
  "live_orangereds": boolean value,
  "mark_messages_read": boolean value,
  "media": one of (\`on\`, \`off\`, \`subreddit\`),
  "media_preview": one of (\`on\`, \`off\`, \`subreddit\`),
  "min_comment_score": an integer between -100 and 100,
  "min_link_score": an integer between -100 and 100,
  "monitor_mentions": boolean value,
  "newwindow": boolean value,
  "nightmode": boolean value,
  "no_profanity": boolean value,
  "num_comments": an integer between 1 and 500,
  "numsites": an integer between 1 and 100,
  "organic": boolean value,
  "other_theme": subreddit name,
  "over_18": boolean value,
  "private_feeds": boolean value,
  "profile_opt_out": boolean value,
  "public_votes": boolean value,
  "research": boolean value,
  "search_include_over_18": boolean value,
  "send_crosspost_messages": boolean value,
  "send_welcome_messages": boolean value,
  "show_flair": boolean value,
  "show_gold_expiration": boolean value,
  "show_link_flair": boolean value,
  "show_location_based_recommendations": boolean value,
  "show_promote": boolean value,
  "show_stylesheets": boolean value,
  "show_trending": boolean value,
  "show_twitter": boolean value,
  "store_visits": boolean value,
  "survey_last_seen_time": an integer,
  "theme_selector": subreddit name,
  "third_party_data_personalized_ads": boolean value,
  "third_party_site_data_personalized_ads": boolean value,
  "third_party_site_data_personalized_content": boolean value,
  "threaded_messages": boolean value,
  "threaded_modmail": boolean value,
  "top_karma_subreddits": boolean value,
  "use_global_defaults": boolean value,
  "video_autoplay": boolean value,`
 */
this.FLAGS = `
accept_pms": one of (\`everyone\`, \`whitelisted\`),
  "activity_relevant_ads": boolean value,
  "allow_clicktracking": boolean value,
  "beta": boolean value,
  "clickgadget": boolean value,
  "collapse_read_messages": boolean value,
  "compress": boolean value,
  "creddit_autorenew": boolean value,
  "default_comment_sort": one of (\`confidence\`, \`top\`, \`new\`, \`controversial\`, \`old\`, \`random\`, \`qa\`, \`live\`),
  "domain_details": boolean value,
  "email_digests": boolean value,
  "email_messages": boolean value,
  "email_unsubscribe_all": boolean value,
  "enable_default_themes": boolean value,
  "g": one of (\`GLOBAL\`, \`US\`, \`AR\`, \`AU\`, \`BG\`, \`CA\`, \`CL\`, \`CO\`, \`HR\`, \`CZ\`, \`FI\`, \`GR\`, \`HU\`, \`IS\`, \`IN\`, \`IE\`, \`JP\`, \`MY\`, \`MX\`, \`NZ\`, \`PH\`, \`PL\`, \`PT\`, \`PR\`, \`RO\`, \`RS\`, \`SG\`, \`SE\`, \`TW\`, \`TH\`, \`TR\`, \`GB\`, \`US_WA\`, \`US_DE\`, \`US_DC\`, \`US_WI\`, \`US_WV\`, \`US_HI\`, \`US_FL\`, \`US_WY\`, \`US_NH\`, \`US_NJ\`, \`US_NM\`, \`US_TX\`, \`US_LA\`, \`US_NC\`, \`US_ND\`, \`US_NE\`, \`US_TN\`, \`US_NY\`, \`US_PA\`, \`US_CA\`, \`US_NV\`, \`US_VA\`, \`US_CO\`, \`US_AK\`, \`US_AL\`, \`US_AR\`, \`US_VT\`, \`US_IL\`, \`US_GA\`, \`US_IN\`, \`US_IA\`, \`US_OK\`, \`US_AZ\`, \`US_ID\`, \`US_CT\`, \`US_ME\`, \`US_MD\`, \`US_MA\`, \`US_OH\`, \`US_UT\`, \`US_MO\`, \`US_MN\`, \`US_MI\`, \`US_RI\`, \`US_KS\`, \`US_MT\`, \`US_MS\`, \`US_SC\`, \`US_KY\`, \`US_OR\`, \`US_SD\`),
  "hide_ads": boolean value,
  "hide_downs": boolean value,
  "hide_from_robots": boolean value,
  "hide_ups": boolean value,
  "highlight_controversial": boolean value,
  "highlight_new_comments": boolean value,
  "ignore_suggested_sort": boolean value,
  "in_redesign_beta": boolean value,
  "label_nsfw": boolean value,
  "lang": a valid IETF language tag (underscore separated),
  "legacy_search": boolean value,
  "live_orangereds": boolean value,
  "mark_messages_read": boolean value,
  "media": one of (\`on\`, \`off\`, \`subreddit\`),
  "media_preview": one of (\`on\`, \`off\`, \`subreddit\`),
  "min_comment_score": an integer between -100 and 100,
  "min_link_score": an integer between -100 and 100,
  "monitor_mentions": boolean value,
  "newwindow": boolean value,
  "nightmode": boolean value,
  "no_profanity": boolean value,
  "num_comments": an integer between 1 and 500,
  "numsites": an integer between 1 and 100,
  "organic": boolean value,
  "other_theme": subreddit name,
  "over_18": boolean value,
  "private_feeds": boolean value,
  "profile_opt_out": boolean value,
  "public_votes": boolean value,
  "research": boolean value,
  "search_include_over_18": boolean value,
  "send_crosspost_messages": boolean value,
  "send_welcome_messages": boolean value,
  "show_flair": boolean value,
  "show_gold_expiration": boolean value,
  "show_link_flair": boolean value,
  "show_location_based_recommendations": boolean value,
  "show_promote": boolean value,
  "show_stylesheets": boolean value,
  "show_trending": boolean value,
  "show_twitter": boolean value,
  "store_visits": boolean value,
  "survey_last_seen_time": an integer,
  "theme_selector": subreddit name,
  "third_party_data_personalized_ads": boolean value,
  "third_party_site_data_personalized_ads": boolean value,
  "third_party_site_data_personalized_content": boolean value,
  "threaded_messages": boolean value,
  "threaded_modmail": boolean value,
  "top_karma_subreddits": boolean value,
  "use_global_defaults": boolean value,
  "video_autoplay": boolean value,`;

    }
/**
 * Edits the given user preference.
 * @param {String} flag The pref flag. See {UserPrefsManager#FLAGS}
 * @param {any} value The new value for the flag. Must match the syntax, see {UserPrefsManager#FLAGS}
 */
async edit(flag, value){
var res = await this.client.patch('/api/v1/me/prefs', {
    [flag]: value
});
if (!res) throw new RedditAPIError("Unable to edit user preferences.");
           
    if (res.errors && res.errors.length > 0) throw new RedditAPIError("UserPrefsEditError: " + res.errors.map(err => err).join("\n"));
}
}

module.exports = UserPrefsManager;