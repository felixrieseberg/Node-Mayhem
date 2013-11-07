// https://github.com/nko4/website/blob/master/module/README.md#nodejs-knockout-deploy-check-ins
require('nko')('vwPITUrcgKik0DFV');

var isProduction = (process.env.NODE_ENV === 'production');
var http = require('http');
var port = (isProduction ? 80 : 8000);

http.createServer(function (req, res) {
  // http://blog.nodeknockout.com/post/35364532732/protip-add-the-vote-ko-badge-to-your-app
  var voteko = '<iframe src="http://nodeknockout.com/iframe/west-coast-hackers" frameborder=0 scrolling=no allowtransparency=true width=115 height=25></iframe>';

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('<html><body>' + voteko + '</body></html>\n');
}).listen(port, function(err) {
  if (err) { console.error(err); process.exit(-1); }

  // if run as root, downgrade to the owner of this file
  if (process.getuid() === 0) {
    require('fs').stat(__filename, function(err, stats) {
      if (err) { return console.error(err); }
      process.setuid(stats.uid);
    });
  }

  console.log('Server running at http://0.0.0.0:' + port + '/');
});
