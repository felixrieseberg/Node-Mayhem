## Quick Start

~~~sh
# getting the code
git clone git@github.com:nko4/west-coast-hackers.git && cd ./west-coast-hackers/

# developing
npm install
npm start

# deploying (to http://west-coast-hackers.2013.nodeknockout.com/)
./deploy nko

# ssh access
ssh deploy@west-coast-hackers.2013.nodeknockout.com
ssh root@west-coast-hackers.2013.nodeknockout.com
# or, if you get prompted for a password
ssh -i ./id_deploy deploy@west-coast-hackers.2013.nodeknockout.com
ssh -i ./id_deploy root@west-coast-hackers.2013.nodeknockout.com
~~~

Read more about this setup [on our blog][deploying-nko].

[deploying-nko]: http://blog.nodeknockout.com/post/66039926165/node-knockout-deployment-setup

## Tips

### Your Server

We've already set up a basic node server for you. Details:

* Ubuntu 12.04 (Precise) - 64-bit
* server.js is at: `/home/deploy/current/server.js`
* logs are at: `/home/deploy/shared/logs/server/current`
* `runit` keeps the server running.
  * `sv restart serverjs` - restarts
  * `sv start serverjs` - starts
  * `sv stop serverjs` - stops
  * `ps -ef | grep runsvdir` - to see logs
  * `cat /etc/service/serverjs/run` - to see the config

You can use the `./deploy` script included in this repo to deploy to your
server right now. Advanced users, feel free to tweak.

Read more about this setup [on our blog][deploying-nko].

### Vote KO Widget

![Vote KO widget](http://f.cl.ly/items/1n3g0W0F0G3V0i0d0321/Screen%20Shot%202012-11-04%20at%2010.01.36%20AM.png)

Use our "Vote KO" widget to let from your app directly. Here's the code for
including it in your site:

~~~html
<iframe src="http://nodeknockout.com/iframe/west-coast-hackers" frameborder=0 scrolling=no allowtransparency=true width=115 height=25>
</iframe>
~~~

### Tutorials & Free Services

If you're feeling a bit lost about how to get started or what to use, we've
got some [great resources for you](http://nodeknockout.com/resources),
including:

* [How to install node and npm](http://blog.nodeknockout.com/post/65463770933/how-to-install-node-js-and-npm)
* [Getting started with Express](http://blog.nodeknockout.com/post/65630558855/getting-started-with-express)
* [OAuth with Passport](http://blog.nodeknockout.com/post/66118192565/getting-started-with-passport)
* [Going Beyond “Hello World” with Drywall](http://blog.nodeknockout.com/post/65711111886/going-beyond-hello-world-with-drywall)
* [and many more](http://nodeknockout.com/resources#tutorials)&hellip;

## Have fun!

If you have any issues, we're on IRC in #nodeknockout on freenode, email us at
<help@nodeknockout.com>, or tweet [@node_knockout](https://twitter.com/node_knockout).
