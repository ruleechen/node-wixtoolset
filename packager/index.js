/*
* wix packager
* WiX (Windows Installer XML)
*/

const path = require('path');
const wix = require('../index');

async function pack({
  appPath,
  distPath,
  artifactName = 'app.msi',
  wixVariables = {},
  wixVariables: {
    AppGuid,
    AppIcon,
    AppName,
    Version,
    Publisher,
    EulaFile,
    InstallDirName,
  },
  productWxs = path.resolve(__dirname, './xml/product.wxs'),
  i18nWxl = path.resolve(__dirname, './xml/en-us.wxl'),
  i18nCulture = 'en-us',
  suppressIces,
  extensions,
  arch = 'x86',
  env = 'dev',
} = {}) {
  const artifactFilePath = path.resolve(distPath, artifactName);

  // temp files
  const productWixObj = path.resolve(distPath, `./wix/product-${arch}.wixobj`);
  const filesWxs = path.resolve(distPath, `./wix/files-${arch}.wxs`);
  const filesWixObj = path.resolve(distPath, `./wix/files-${arch}.wixobj`);
  const wixLib = path.resolve(distPath, `./wix/app-${arch}.wixlib`);

  // id consistance
  const filesGroupId = 'AppFiles';
  const installDirId = 'APPLICATIONROOTDIRECTORY';

  // define a wix variable, with or without a value.
  const mergedVariables = {
    ...wixVariables,
    AppPath: appPath,
    FilesGroupId: filesGroupId,
    InstallDirId: installDirId,
    BuildEnv: env,
    BuildArch: arch, // x86, x64, or ia64 (default: x86)
  };
  var variables = {};
  Object.keys(mergedVariables).forEach((key) => {
    variables[`d_${key}`] = mergedVariables[key];
  });

  // output options
  const outputOptions = {
    v: true, // verbose output
    // pedantic: true, // show pedantic messages
  };

  // heat
  console.log('==================== wix.heat ====================');
  await wix.heat({
    dir: appPath, // harvest a directory
    gg: true, // generate guids now
    scom: true, // suppress COM elements.
    sfrag: true, // suppress generation of fragments for directories and components.
    srd: true, // suppress harvesting the root directory as an element.
    sreg: true, // suppress registry harvesting.
    var: 'var.AppPath', // become File/@Source="$(var.MySource)\myfile.txt"
    dr: installDirId, // drectory reference to root directories (cannot contains spaces e.g. -dr MyAppDirRef).
    cg: filesGroupId, // component group name (cannot contain spaces e.g -cg MyComponentGroup).
    indent: 2, // indentation multiple (overrides default of 4)
    out: filesWxs,
  });

  // candle
  console.log('==================== wix.candle ====================');
  await Promise.all([
    wix.candle(productWxs, {
      ...variables,
      ...outputOptions,
      arch, // x86, x64, or ia64 (default: x86)
      out: productWixObj, // specify output file (default: write to current directory)
    }),
    wix.candle(filesWxs, {
      ...variables,
      ...outputOptions,
      arch, // x86, x64, or ia64 (default: x86)
      out: filesWixObj, // specify output file (default: write to current directory)
    }),
  ]);

  // lit
  console.log('==================== wix.lit ====================');
  await wix.lit({
    ...outputOptions,
    bf: [productWixObj, filesWixObj], // bind files into the library file
    out: wixLib, // specify output file (default: write to current directory)
  });

  // light
  console.log('==================== wix.light ====================');
  await wix.light(wixLib, {
    // ...variables,
    ...outputOptions,
    loc: i18nWxl, // bind localization strings from a wxl into the library file
    sice: suppressIces, // Suppress running internal consistency evaluators (ICEs) with specific IDs.
    cultures: i18nCulture, // semicolon or comma delimited list of localized string cultures to load from .wxl files and libraries.
    ext: ['WixUIExtension', ...(extensions || [])], // extension assembly or "class, assembly"
    out: artifactFilePath, // specify output file (default: write to current directory)
  });

  return artifactFilePath;
}

module.exports = {
  pack,
};
