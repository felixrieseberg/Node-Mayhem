node.js knockout deploy check-ins
---------------------------------

So, we need to keep track of your deploys for lots of different reasons.
Because we want to be as platform-agnostic as possible, we now have this fancy
module that will ping the competition website whenever you deploy.

Installation
============

Add `nko` to the dependencies section of your package.json:

    "dependencies": {
      "nko": "*",
      "other-awesome-stuff": "2.1.4"
    }

After that, `npm install`.

Usage
=====

Just require it somewhere in your normal execution path. We recommend at the
top of your `server.js`:

    require('nko')(secret);

The `secret` parameter is available on [your team page] (make sure you're
signed in to see it). It's tied to just your team, so don't share it with
others unless you want them hijacking your deploys.

If for whatever reason, you want to know when we've recorded the deploy, you
can pass an optional callback as the second parameter:

    require('nko')('<your-team-secret>', function(err, res) {
      if (err) throw err;
      res.on('data', function(d) { console.log(d.toString()); });
    });

__Important: Not seeing your deploy count rise? Here's what to check:__

* The module will only ping us if the `NODE_ENV` environment
  variable is set to `production`.
* We wait until your server has been __running for 5 seconds__ before sending
  the deploy ping, so your server crashes before that, your deploy will not
  get recorded.
* We ensure that your server responds to a HTTP GET request on port 80 before
  recording the deploy.
* We ensure that the remote IP address from the ping matches the Joyent
  instance we setup for your team. (So starting up your development machine
  with `NODE_ENV=production` will not affect your deploy count.)

Problems?
=========

As always, you can contact us at [all@nodeknockout.com] or [@node_knockout].
You can also try checking the [issue tracker].

[your team page]: http://nodeknockout.com/teams/mine
[all@nodeknockout.com]: mailto:all@nodeknockout.com
[@node_knockout]: http://twitter.com/node_knockout
[issue tracker]: https://github.com/nko2/website/issues
