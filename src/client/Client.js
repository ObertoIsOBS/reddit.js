'use strict';

const RedditAPIError = require('../errors/RedditAPIError');
const Reddit = require('./RedditClient');
const ClientUser = require('../structures/ClientUser');
const Collection = require('../structures/Collection');
const Fullname = require('../structures/Fullname');
const Subreddit = require('../structures/Subreddit');
const { EventEmitter } = require("events");
const debug = require('debug')('reddit');
const get = require('simple-get');
const querystring = require('querystring');

const TOKEN_BASE_URL = 'https://www.reddit.com/api/v1/access_token';
const API_BASE_URL = 'https://oauth.reddit.com';
const REQUEST_TIMEOUT = 30 * 1000;

/**
 * Represents a reddit client.
 * @extends RedditClient
 * @example new Reddit.Client()
 * @event ready Emitted when the client logs into reddit.
 */
class Client extends EventEmitter {
    constructor() {
        super()
    }
/* API Managers */
async get (url, data = {}) {
    return this._sendRequest('GET', API_BASE_URL + url, data)
  }

  async post (url, data = {}) {
    return this._sendRequest('POST', API_BASE_URL + url, data)
  }

  async patch (url, data = {}) {
    return this._sendRequest('PATCH', API_BASE_URL + url, data)
  }

  async put (url, data = {}) {
    return this._sendRequest('PUT', API_BASE_URL + url, data)
  }

  async delete (url, data = {}) {
    return this._sendRequest('DELETE', API_BASE_URL + url, data)
  }

  async _sendRequest (method, url, data) {
    const token = await this._getToken()
    const body = await this._makeRequest(method, url, data, token)

    const errors = body && body.json && body.json.errors
    if (errors && errors.length > 0) {
      const err = new Error(
        errors.map(
          error => `${error[0]}: ${error[1]} (${error[2]})`
        ).join('. ')
      )
      err.code = errors[0][0]
      err.codes = errors.map(error => error[0])
      throw err
    }

    return body
  }

  async _getToken () {
    if (Date.now() / 1000 <= this.tokenExpireDate) {
      return this.token
    }

    return new Promise((resolve, reject) => {
      get.concat({
        url: TOKEN_BASE_URL,
        method: 'POST',
        form: {
          grant_type: 'password',
          username: this.username,
          password: this.password
        },
        headers: {
          authorization: `Basic ${Buffer.from(`${this.appId}:${this.appSecret}`).toString('base64')}`,
          'user-agent': this.userAgent
        },
        json: true,
        timeout: REQUEST_TIMEOUT
      }, (err, res, body) => {
        if (err) {
          err.message = `Error getting token: ${err.message}`
          return reject(err)
        }

        const statusType = Math.floor(res.statusCode / 100)

        if (statusType === 2) {
          const {
            access_token: accessToken,
            expires_in: expiresIn,
            token_type: tokenType
          } = body

          if (tokenType == null || accessToken == null) {
            return reject(new Error(`Cannot obtain token for username ${this.username}. ${body.error}.`))
          }

          this.token = `${tokenType} ${accessToken}`
          // Shorten token expiration time by half to avoid race condition where
          // token is valid at request time, but server will reject it
          this.tokenExpireDate = ((Date.now() / 1000) + expiresIn) / 2

          return resolve(this.token)
        } else if (statusType === 4) {
          return reject(
            new Error(`Cannot obtain token for username ${this.username}. Did you give ${this.username} access in your Reddit App Preferences? ${body.error}. Status code: ${res.statusCode}`)
          )
        } else {
          return reject(
            new Error(`Cannot obtain token for username ${this.username}. ${body.error}. Status code: ${res.statusCode}`)
          )
        }
      })
    })
  }

  _makeRequest (method, url, data, token) {
    return new Promise((resolve, reject) => {
      const opts = {
        url: url,
        method: method,
        headers: {
          authorization: token,
          'user-agent': this.userAgent
        },
        timeout: REQUEST_TIMEOUT
      }

      // Request JSON API response type
      data.api_type = 'json'
      opts.json = true

      if (method === 'GET') {
        opts.url += '?' + querystring.encode(data)
      } else if (method === 'POST') {
        opts.form = data
      } else if (method === 'PATCH' || method === 'PUT' || method === 'DELETE') {
        opts.body = data
      }

      debug(`Making ${method} request to ${url}`)

      get.concat(opts, (err, res, body) => {
        if (err) {
          err.message = `API error: ${err.message}`
          return reject(err)
        }

        debug('Got a response with statusCode: ' + res.statusCode)

        const statusType = Math.floor(res.statusCode / 100)

        if (statusType === 2) {
          return resolve(body)
        } else {
          return reject(
            new Error(`API error: ${body.message}. Status code: ${res.statusCode}`)
          )
        }
      })
    })
  }
/* END OF API MANAGERS */

    /**
     * Logs the client into reddit.
     * @param {object} opts Client options
     * @param {string} opts.username The username of the client user.
     * @param {string} opts.password The password of the client user.
     * @param {string} opts.appId The Id of the client application.
     * @param {string} opts.appSecret The client secret.
     * @param {string} opts.userAgent The user agent
     * @example const opts = {
    username: 'RedditGuy',
    password: 'RedditGuy',
    appId: 'secretID',
    appSecret: 'appSecret',
    userAgent: "Anything goes."
  };
  client.login(opts);
     */
    async login(opts){

        this.opts = opts;
        this.username = opts.username;
        this.password = opts.password;
        this.appId = opts.appId;
        this.appSecret = opts.appSecret;
        this.userAgent = opts.userAgent;
        
        if (!opts) throw new RedditAPIError("Invalid login options provided.");
        
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

        /**
         * Represents the clients reddit user.
         * @type {ClientUser} 
         */
        this.user = new ClientUser(this, data);

        this.emit("ready");
   
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