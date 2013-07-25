var crypto = require('crypto');
var fs = require('fs');

var clientSeed = crypto.randomBytes(24),
    serverSeed = crypto.randomBytes(128),
    betCount = 0;

var roll = function(cSeed, sSeed, count) {
  var hmac = crypto.createHmac('sha256', sSeed),
  clientStr = cSeed + ":" + count.toString();

  hmac.update(clientStr);

  var digest = hmac.digest('hex'),
      lucky;

  while (!lucky || lucky > 1000000) {
    if (digest.length > 3) {
      lucky = parseInt(digest.substring(0,5), 16);
      digest = digest.substring(5);
    } else {
      lucky = parseInt(digest.substring(0,3), 16);
    }
  }

  return lucky / 10000.0;
}

var loop = function(cSeed, sSeed, count) {
  var lucky = roll(clientSeed, serverSeed, count);
  fs.appendFile('rolls.csv', //clientSeed+":"+count+","+serverSeed+","+lucky,
    lucky.toString() + '\n',
    function(err) {
      if (err) { throw err; }
      setImmediate(loop, cSeed, sSeed, count + 1);
    });
};

loop(clientSeed, serverSeed, betCount);
