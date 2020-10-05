'use strict';

const RedditAPIError = require("../errors/RedditAPIError");
const Fullname = require("./Fullname");
const Reddit = require("../client/RedditClient");
const UUID = require('./UUID');
const RedditPost = require('./RedditPost');

/**
 * Represents a reddit collection of posts.
 */
class Collection {
/**
 * Creates a new reddit collection.
 * @param {Client} client The reddit client.
 * @param {Object} data The collection data
 */
    constructor(client, data) {
//super(client, data);

this.client = client;
/**
 * Raw reddit collection data.
 * @readonly
 */
this.raw = data;

/* Posts */
/**
 * A sorted array of posts in this collection.
 * @type {Array<RedditPost>}
 */
this.posts = data.sorted_links.data.children;

/* Coll. Information */
/**
 * The ID of the subreddit the collection belongs to.
 * @type {Fullname}
 */
this.subredditID = data.subreddit_id;
/**
 * The description of this collection.
 * @type {String}
 */
this.description = data.description;
/**
 * The ID of the primary link.
 * @type {Fullname}
 */
this.primaryLinkId = data.primary_link_id;
/**
 * The ID of this collection.
 * @type {UUID}
 */
this.id = data.collection_id;
/**
 * The display layout of this collection.
 * @type {?String}
 */
this.displayLayout = data.display_layout;
/**
 * The permalink to this collection.
 * @type {String}
 */
this.permalink = data.permalink;
/**
 * An array of IDs for each link in the collection. Type `t3_`.
 * @type {Array<Fullname>}
 */
this.linkIds = data.link_ids;
/**
 * The title of this collection.
 * @type {String}
 */
this.title = data.title;
/**
 * The UTC timestamp the collection was created.
 * @type {Date}
 */
this.createAtUtc = data.created_at_utc;
/**
 * The author of this collection.
 * @type {Object}
 * @property {String} name The name of the author.
 * @property {Fullname} id The ID of the author.
 */
this.author = {
    name: data.author_name,
    id: data.author_id
}
/**
 * The UTC timestamp of the last update to the collection.
 * @type {Date}
 */
this.lastUpdateUtc = data.last_update_utc;

    }
/**
 * Adds a post to this collection.
 * @param {Fullname} link The post to add to the collection.
 * @returns {RedditPost} The post that was added. 
 * @example collection.addPost("t3_c3wypn").then(post => {
 * console.log(`${post.title} has been added to ${collection.title}`);
 * })
 */
async addPost(link) {
    if (!link || !link.startsWith('t3_')) throw new RedditAPIError('This is not a valid link fullname. Type must be t3_')
    var res = await this.client.post('/api/v1/collections/add_post_to_collection', {
        "collection_id": this.id,
        "link_fullname": link
    });

    if (!res) throw new RedditAPIError("Unable to add the post to the collection.");
           
    if (res.errors && res.errors.length > 0) throw new RedditAPIError("CollectionPostError: " + res.errors.map(err => err).join("\n"));

    return res;
}
/**
 * Deletes this collection.
 * @returns {Collection} The deleted collection.
 * @example collection.delete().then(coll => {
 * console.log(`${coll.title} has been deleted.`);
 * })
 */
async delete(){
    var res = await this.client.post('/api/v1/collections/delete_collection', {
        "collection_id": this.id
    });

    if (!res) throw new RedditAPIError("Unable to delete the collection.");
           
    if (res.errors && res.errors.length > 0) throw new RedditAPIError("CollectionPostError: " + res.errors.map(err => err).join("\n"));

    return res;
}
/**
 * Follows or unfollows the subreddit. True is equivalent to `follow` while false is `unfollow`.
 * @param {Boolean} follow If the user should be following the collection.
 * @returns {Collection} This collection.
 * @example collection.follow(true).then(coll => {
 * console.log(`You are now following ${coll.title}`);
 * })
 */
async following(follow) {
    if (typeof follow !== "boolean") throw new RedditAPIError('TypeError: The value must be a boolean.');

    var res = await this.client.post('/api/v1/collections/add_post_to_collection', {
        "collection_id": this.id,
        "follow": follow
    });

    if (!res) throw new RedditAPIError("Unable to update the collection following.");
           
    if (res.errors && res.errors.length > 0) throw new RedditAPIError("CollectionPostError: " + res.errors.map(err => err).join("\n"));

    return res;
}
/**
 * Removes a post from the collection.
 * @param {Fullname} link The link to the post.
 * @returns {RedditPost} The deleted post. 
 */
async removePost(link){
    if (!link || !link.startsWith('t3_')) throw new RedditAPIError('This is not a valid link fullname. Type must be t3_')
    var res = await this.client.post('/api/v1/collections/remove_post_in_collection', {
        "collection_id": this.id,
        "link_fullname": link
    });

    if (!res) throw new RedditAPIError("Unable to the the post from the collection.")
           
    if (res.errors && res.errors.length > 0) throw new RedditAPIError("CollectionPostRemoveError: " + res.errors.map(err => err).join("\n"));

    return res;
}
/**
 * Reorders the posts in this collection.
 * @param {Array<Fullname>} linkIds An odered array of link ids. Use `Collection#linkIds` to get a list of valid links in this collection.
 * @returns {Collection} The updated collection.
 * @example collection.reorder(['t3_c3ywpn', 't3_c5qa4t', 't3_c4jf5v']).then(coll => {
 * console.log(`The order has been changed to ${coll.linkIds}`);
 * }) 
 */
async reorder(linkIds){
    var res = await this.client.post('/api/v1/collections/reorder_collection', {
        "collection_id": this.id,
        "link_fullname": linkIds
    });

    if (!res) throw new RedditAPIError("Unable to reorder the collection.")
           
    if (res.errors && res.errors.length > 0) throw new RedditAPIError("CollectionReorderError: " + res.errors.map(err => err).join("\n"));

    return res;
}
/**
 * Changes the description of the collection.
 * @param {String} description The new description.
 * @returns {Collection} The updated collection.
 */
async setDescription(description){
    if (!description) throw new RedditAPIError("The method is missing the description.")
    if (description.length > 500) throw new RedditAPIError("RangeError: The description of a collection can be no more than 500 characters.");
    var res = await this.client.post('/api/v1/collections/update_collection_description', {
        "collection_id": this.id,
        "description": description
    });

    if (!res) throw new RedditAPIError("Unable to update the collection description.")
           
    if (res.errors && res.errors.length > 0) throw new RedditAPIError("CollectionSetDescriptionError: " + res.errors.map(err => err).join("\n"));

    return res;
}
/**
 * Sets the display layout of the collection.
 * @param {String} layout The display layout `one of ('TIMELINE', 'GALLERY')`
 * @returns {Collection} The updated collection.
 */
async setLayout(layout){
if (!layout || layout !== 'TIMELINE' && layout !== "GALLERY") throw new RedditAPIError("The display layout must be one of (TIMELINE, GALLERY)");

var res = await this.client.post('/api/v1/collections/update_collection_dsplay_layout', {
    "collection_id": this.id,
    "display_layout": layout
});

if (!res) throw new RedditAPIError("Unable update the collection layout.")
       
if (res.errors && res.errors.length > 0) throw new RedditAPIError("CollectionLayoutError: " + res.errors.map(err => err).join("\n"));

return res;
}
/**
 * Changes the title of the collection.
 * @param {String} title The new title.
 * @returns {Collection} The updated collection.
 */
async setTitle(title){
    if (!title) throw new RedditAPIError("The method is missing the title.")
    if (title.length > 300) throw new RedditAPIError("RangeError: The title of a collection can be no more than 300 characters.");
    var res = await this.client.post('/api/v1/collections/update_collection_title', {
        "collection_id": this.id,
        "description": description
    });

    if (!res) throw new RedditAPIError("Unable to update the collection title.")
           
    if (res.errors && res.errors.length > 0) throw new RedditAPIError("CollectionSetTitleError: " + res.errors.map(err => err).join("\n"));

    return res;
}
}

module.exports = Collection;