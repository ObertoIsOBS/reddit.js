'use strict';

const RedditAPIError = require('../errors/RedditAPIError');
const Reddit = require('./RedditClient');
const ClientUser = require('../structures/ClientUser');
const Collection = require('../structures/Collection');
const Fullname = require('../structures/Fullname');
const Subreddit = require('../structures/Subreddit');

/**
 * Represents a reddit client.
 * @extends RedditClient
 * @example new Reddit.Client({
 * username: "Cool",
 * password: "Cooler",
 * appId: "Nice ID",
 * appSecret: "Super secret",
 * userAgent: "Anything goes"
 * });
 */
class Client extends Reddit {
    constructor(opts) {
        super(opts)
        this.opts = opts;
    }
    async fetchSelf() {

        var getters = {
            user: async () => {
                var res = await this.get('/api/v1/me');

                if (!res) throw new RedditAPIError("Unable to fetch user.")

                if (!res) throw new RedditAPIError("Unable to fetch userrs.")

                if (res.errors && res.errors.length > 0) throw new RedditAPIError("fetchSelfError: " + res.errors.map(err => err).join("\n"));

                return res;
            },
            karma: async () => {
                var res = await this.get('/api/v1/me/karma');

                if (!res) throw new RedditAPIError("Unable to fetch user karma.")

                if (!res) throw new RedditAPIError("Unable to fetch user karma.")

                if (res.errors && res.errors.length > 0) throw new RedditAPIError("fetchSelfError: " + res.errors.map(err => err).join("\n"));
                return res.data;
            },
            prefs: async () => {
                var res = await this.get('/api/v1/me/prefs');

                if (!res) throw new RedditAPIError("Unable to fetch user prefs.")

                if (!res) throw new RedditAPIError("Unable to fetch user prefs.")

                if (res.errors && res.errors.length > 0) throw new RedditAPIError("fetchSelfError: " + res.errors.map(err => err).join("\n"));
                return res;
            },
            trophies: async () => {
                var res = await this.get('/api/v1/me/trophies');

                if (!res) throw new RedditAPIError("Unable to fetch user trophies.")

                if (!res) throw new RedditAPIError("Unable to fetch user trophies.")

                if (res.errors && res.errors.length > 0) throw new RedditAPIError("fetchSelfError: " + res.errors.map(err => err).join("\n"));
                return res;
            },
            friends: async () => {
                var res = await this.get('/api/v1/me/friends');

                if (!res) throw new RedditAPIError("Unable to fetch user friends.")

                if (!res) throw new RedditAPIError("Unable to fetch user friends.")

                if (res.errors && res.errors.length > 0) throw new RedditAPIError("fetchSelfError: " + res.errors.map(err => err).join("\n"));
                return res;
            }
        };
        var data = {
            user: await getters.user(),
            karma: await getters.karma(),
            prefs: await getters.prefs(),
            trophies: await getters.trophies(),
            friends: await getters.friends(),
        };

        return new ClientUser(this, data);

    }
    /**
     * Fetches a collection from reddit.
     * @param {UUID} uuid The UUID of the collection.
     * @param {?Boolean} includeLinks @default true
     * @returns {Collection} The collection.
     */
    async fetchCollection(uuid, includeLinks = false) {
        if (!uuid) throw new RedditAPIError('The function is missing the UUID parameter.');
        let res = await this.get('/api/v1/collections/collection',
            {
                "collection_id": uuid,
                "include_links": includeLinks
            });

        if (!res) throw new RedditAPIError("Unable to fetch collection.")

        if (res.errors && res.errors.length > 0) throw new RedditAPIError("fetchCollectionError: " + res.errors.map(err => err).join("\n"));

        return new Collection(this, res);

    }
    /**
     * 
     * @param {String} description The description for the collection.
     * @param {String} layout The layout style. Must be `one of ('TIMELINE', 'GALLERY')`.
     * @param {Fullname} sr The subreddit to create the collection in.
     * @param {String} title The title for the collection.
     * @returns {Collection} The collection that was created.
     */
    async createCollection(description, layout, sr, title) {
        /* Ensure params */
        if (!description) throw new RedditAPIError('createCollectionError: The method is missing the description parameter.');
        if (!layout) throw new RedditAPIError('createCollectionError: The method is missing the layout parameter.');
        if (!sr) throw new RedditAPIError('createCollectionError: The method is missing the sr parameter.');
        if (!title) throw new RedditAPIError('createCollectionError: The method is missing the title parameter.');
        /* Validate params */
        if (description.length > 500) throw new RedditAPIError('createCollectionError: RangeError: The description can be no longer than 500 characters.');
        if (title.length > 300) throw new RedditAPIError('createCollectionError: RangeError: The title can be no longer than 300 characters.');
        if (layout !== "TIMELINE" && layout !== "GALLERY") throw new RedditAPIError("createCollectionError: The layout must be one of (TIMELINE, GALLERY).");
        if (!sr.startsWith('t5_')) throw new RedditAPIError('TypeError: The sr fullname must be of a subreddit.');
        /* Create Collection */
        var res = await this.post('/api/v1/collections/create_collection', {
            "description": description,
            "display_layout": layout,
            "sr_fullname": sr
        })

        if (!res) throw new RedditAPIError("createCollectionError: Unable to create the collection.");

        if (res.errors && res.errors.length > 0) throw new RedditAPIError("createCollectionError: " + res.errors.map(err => err).join("\n"));

        return new Collection(this, res);

    }
    /**
     * Fetches an existing subreddit.
     * @param {String} name The name of the subreddit. The `r/` is optional.
     * @returns {Subreddit} The subreddit.
     */
    async fetchSubreddit(name) {
        if (!name) throw new RedditAPIError("The name parameter is missing.");

        name = name.replace('r/', '');

        var getters = {
            basic: async (name) => {
                var res = await this.get(`/r/${name}/about`)

                if (!res) throw new RedditAPIError("fetchSubredditError: Unable to fetch the subreddit.");

                if (res.errors && res.errors.length > 0) throw new RedditAPIError("fetchSubredditError: " + res.errors.map(err => err).join("\n"));
                return res;
            },
            settings: async (name) => {
                var res = await this.get(`/r/${name}/about/edit`)

                if (!res) throw new RedditAPIError("fetchSubredditError: Unable to fetch the subreddit.");

                if (res.errors && res.errors.length > 0) throw new RedditAPIError("fetchSubredditError: " + res.errors.map(err => err).join("\n"));
                return res;
            },
            rules: async (name) => {
                var res = await this.get(`/r/${name}/about/rules`)

                if (!res) throw new RedditAPIError("fetchSubredditError: Unable to fetch the subreddit.");

                if (res.errors && res.errors.length > 0) throw new RedditAPIError("fetchSubredditError: " + res.errors.map(err => err).join("\n"));
                return res;
            },
            traffic: async (name) => {
                var res = await this.get(`/r/${name}/about/traffic`)

                if (!res) throw new RedditAPIError("fetchSubredditError: Unable to fetch the subreddit.");

                if (res.errors && res.errors.length > 0) throw new RedditAPIError("fetchSubredditError: " + res.errors.map(err => err).join("\n"));
                return res;
            },
            banned: async (name) => {
                var res = await this.get(`/r/${name}/about/banned`)

                if (!res) throw new RedditAPIError("fetchSubredditError: Unable to fetch the subreddit.");

                if (res.errors && res.errors.length > 0) throw new RedditAPIError("fetchSubredditError: " + res.errors.map(err => err).join("\n"));
                return res;
            },
            muted: async (name) => {
                var res = await this.get(`/r/${name}/about/muted`)

                if (!res) throw new RedditAPIError("fetchSubredditError: Unable to fetch the subreddit.");

                if (res.errors && res.errors.length > 0) throw new RedditAPIError("fetchSubredditError: " + res.errors.map(err => err).join("\n"));
                return res;
            },
            wikiBanned: async (name) => {
                var res = await this.get(`/r/${name}/about/wikibanned`)

                if (!res) throw new RedditAPIError("fetchSubredditError: Unable to fetch the subreddit.");

                if (res.errors && res.errors.length > 0) throw new RedditAPIError("fetchSubredditError: " + res.errors.map(err => err).join("\n"));
                return res;
            },
            contributors: async (name) => {
                var res = await this.get(`/r/${name}/about/contributors`)

                if (!res) throw new RedditAPIError("fetchSubredditError: Unable to fetch the subreddit.");

                if (res.errors && res.errors.length > 0) throw new RedditAPIError("fetchSubredditError: " + res.errors.map(err => err).join("\n"));
                return res;
            },
            wikiContributors: async (name) => {
                var res = await this.get(`/r/${name}/about/wikicontributors`)

                if (!res) throw new RedditAPIError("fetchSubredditError: Unable to fetch the subreddit.");

                if (res.errors && res.errors.length > 0) throw new RedditAPIError("fetchSubredditError: " + res.errors.map(err => err).join("\n"));
                return res;
            },
            moderators: async (name) => {
                var res = await this.get(`/r/${name}/about/moderators`)

                if (!res) throw new RedditAPIError("fetchSubredditError: Unable to fetch the subreddit.");

                if (res.errors && res.errors.length > 0) throw new RedditAPIError("fetchSubredditError: " + res.errors.map(err => err).join("\n"));
                return res;
            }
        };

        var data = {
            basic: await getters.basic(name),
            settings: await getters.settings(name),
            rules: await getters.rules(name),
            traffic: await getters.traffic(name),
            banned: await getters.banned(name),
            muted: await getters.muted(name),
            wikiBanned: await getters.wikiBanned(name),
            contributors: await getters.contributors(name),
            wikiContributors: await getters.wikiContributors(name),
            moderators: await getters.moderators(name),
        }

        return new Subreddit(data, this)

    }
}

module.exports = Client;