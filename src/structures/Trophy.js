'use strict';

const RedditAPIError = require('../errors/RedditAPIError');
const Reddit = require('../client/RedditClient');
const Client = require('../client/Client');
const Fullname = require('./Fullname');
const Collection = require('./Collection');

/**
 * Represents a reddit trophy.
 */
class Trophy {
constructor(data, client){

    /**
     * The client that intiated this.
     * @type {Client}
     */
    this.client = client;
    /**
     * The raw data of this trophy.
     * @type {object}
     */
    this.raw = data;
    /**
     * The icon of this award (71x71)
     * @type {string}
     */
    this.icon70 = data.icon_70;
    /**
     * The icon of this award (41x41)
     * @type {string}
     */
    this.icon40 = data.icon_40;
    /**
     * The date the award was granted.
     * @type {?date}
     */
    this.grantedAt = data.granted_at;
    /**
     * The URL of this award.
     * @type {?string}
     */
    this.url = data.url;
    /**
     * The name of this award.
     * @type {string}
     */
    this.name = data.name;
    /**
     * The `award_id` of this award.
     * @type {string}
     */
    this.award_id = data.award_id;
    /**
     * The ID of this award.
     * @type {string}
     */
    this.id = data.id;
    /**
     * The description of this award.
     * @type {?string}
     */
    this.description = data.description;
    }
    /**
     * Report an award. Reporting an award brings it to the attention of a Reddit admin.
     * @param {string} reason The reason for reporting this. No longer than 100 characters.
     */
    async report(reason) {

        if (!reason) throw new RedditAPIError("ReportError: The reason parameter is missing.");
        if (typeof reason !== "string") throw new RedditAPIError("ReportError: The reason must be a string.");
        if (reason.length > 100) throw new RedditAPIError("ReportError: The reason must not exceed 100 in length.");

        var res = await this.client.post('/api/report_award', {
            award_id: this.award_id,
            reason: reason
        });

        if (!res) throw new RedditAPIError("ReportError: Unable to report the award.")

        if (res.errors && res.errors.length > 0) throw new RedditAPIError("ReportError: " + res.errors.map(err => err).join("\n"));
        return res;

    }
}

module.exports = Trophy;