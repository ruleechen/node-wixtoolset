var http = require('http');
var fs = require('fs');
var path = require('path');
var os = require('os');
var unzip = require('unzip');

var WIX_BINARY_URL = 'https://github.com/wixtoolset/wix3/releases/download/wix3111rtm/wix311-binaries.zip';

var zipPath = path.resolve(os.tmpdir(), 'wix.zip');
var file = fs.createWriteStream(zipPath);
var request = http.get(WIX_BINARY_URL, function (response) {
  response.pipe(file);
  console.log('Downloading WIX Binaries');
  response.on('data', function () {
    process.stdout.write(".");
  });
  response.on('end', function () {
    console.log('Extracting');
    fs.createReadStream(zipPath).pipe(unzip.Extract({
      path: path.resolve(__dirname, 'wix-bin')
    }));
  })
});
