var fs = require('fs');
var path = require('path');
var download = require('download');

var WIX_BINARY_URL = 'https://github.com/wixtoolset/wix3/releases/download/wix3111rtm/wix311-binaries.zip';
var WIX_BINARY_DEST = path.resolve(__dirname, 'wix-bin');
if (process.env.LOCALAPPDATA) {
  WIX_BINARY_DEST = path.resolve(process.env.LOCALAPPDATA, 'wixtoolset', 'bin');
}

function install() {
  var res = {
    url: WIX_BINARY_URL,
    dest: WIX_BINARY_DEST,
  };
  return new Promise((resolve, reject) => {
    var versionPath = path.resolve(WIX_BINARY_DEST, 'version.txt');
    if (fs.existsSync(versionPath)) {
      var url = fs.readFileSync(versionPath, 'utf8');
      if (url === WIX_BINARY_URL) {
        resolve(res);
        return;
      }
    }
    console.log('Start downloading wix binaries...');
    download(WIX_BINARY_URL, WIX_BINARY_DEST, { extract: true }).then(() => {
      fs.writeFileSync(versionPath, WIX_BINARY_URL, { encoding: 'utf8' });
      console.log('Download wix binaries completed', res);
      resolve(res);
    }).catch((ex) => {
      console.error(`Download wix binaries failed ${ex}`);
      reject(ex);
    });
  });
};

module.exports = install;
