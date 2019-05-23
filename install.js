var fs = require('fs');
var path = require('path');
var download = require('download');

var WIX_BINARY_URL = 'https://github.com/wixtoolset/wix3/releases/download/wix3111rtm/wix311-binaries.zip';

function install() {
  var dest = path.resolve(__dirname, 'wix-bin');
  var versionPath = path.resolve(dest, 'version.txt');
  if (fs.existsSync(versionPath)) {
    var url = fs.readFileSync(versionPath, 'utf8');
    if (url === WIX_BINARY_URL) {
      console.log('Wix binaries exists...');
      return Promise.resolve({ dest });
    }
  }

  console.log('Start downloading wix binaries...');
  return download(WIX_BINARY_URL, dest, { extract: true }).then(() => {
    fs.writeFileSync(versionPath, WIX_BINARY_URL, { encoding: 'utf8' });
    console.log('Done downloading wix binaries');
    return { dest };
  });
};

module.exports = install;
