/*
* https://github.com/spatools/node-signtool
*/

import signtool from 'signtool';

const runOptions = {
  // verbose: true,
  // debug: true,
};

function sign({
  executable,
  certificateFile,
  certificatePassword,
  signingHashAlgorithm,
  rfc3161TimeStampServer,
}) {
  console.log('Start signing...');
  return signtool.sign(executable, {
    certificate: certificateFile,
    password: certificatePassword,
    algorithm: signingHashAlgorithm,
    rfcTimestamp: rfc3161TimeStampServer || 'http://sha256timestamp.ws.symantec.com/sha256/timestamp',
  }, runOptions).then((res) => {
    // result.code // The signtool exit code.
    // result.stdout // The signtool stdout content.
    // result.stderr // The signtool stderr content.
    console.log(res.stdout);
    return res;
  });
}

export default {
  sign,
};
