## About
Reddit.js an intuitive wrapper that lets you interact easily with the reddit api.
- Promise based
- Object Oriented
- Best API coverage
- Predicatable Errors
- Fully Documented

## Installation
Ignore unmet dependency warnings. They are optional.

`npm i js-reddit.js`.

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
const client = new Reddit.Client();


client.login(opts);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.name}!`);
})
```

## Contributing
Want to become a developer on this project? Email me at [obs@obs.wtf](mailto:obs@obs.wtf) or on [discord](https://dsc.bio/obs).

Please double check JSDoc notes before making a pull request or issue.

## Support
If you need help with this wrapper please join our [support server](https://discord.gg/C2AEdvj).