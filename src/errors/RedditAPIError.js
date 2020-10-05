'use strict';

class RedditAPIError {
    constructor(message){
        this.message = message;

console.error(`RedditAPIError: ` + message);
    
}
}

module.exports = RedditAPIError;