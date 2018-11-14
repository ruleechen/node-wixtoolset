var path = require('path');
var download = require('download');

var WIX_BINARY_URL = 'https://github.com/wixtoolset/wix3/releases/download/wix3111rtm/wix311-binaries.zip';

console.log('Start downloading wix binaries...');
var dest = path.resolve(__dirname, 'wix-bin');
download(WIX_BINARY_URL, dest, { extract: true }).then(() => {
  console.log('Done downloading wix binaries');
});
