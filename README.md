## About
Reddit.js an intuitive wrapper that lets you interact easily with the reddit api.
- Promise based
- Object Oriented
- Best API coverage
- Predicatable Errors
- Fully Documented

## Installation
Ignore unmet dependency warnings. They are optional.


Without UUID class: `npm i js-reddit.js`.

With UUID class: `npm i js-reddit.js uuid-class`

## Example Usage
```js
const Reddit = require('../src/index.js');
const opts = {
    username: 'RedditGuy',
    password: 'RedditGuy',
    appId: 'secretID',
    appSecret: 'appSecret',
    userAgent: "Anything goes."
  };
const client = new Reddit.Client(opts);

client.fetchSelf().then(user => {
console.log(`This client is logged into ${user.name}`);
});
```

## Contributing
Want to become a developer on this project? Email me at [obs@obs.wtf](mailto:obs@obs.wtf) or on [discord](https://dsc.bio/obs).

Please double check JSDoc notes before making a pull request or issue.

