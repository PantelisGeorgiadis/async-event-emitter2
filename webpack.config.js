const { BannerPlugin } = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const pkg = require('./package.json');

const rootPath = process.cwd();
const context = path.join(rootPath, 'src');
const outputPath = path.join(rootPath, 'build');
const filename = path.parse(pkg.main).base;

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = ('0' + (today.getMonth() + 1)).slice(-2);
  const date = ('0' + today.getDate()).slice(-2);
  return `${year}-${month}-${date}`;
};

const getBanner = () => {
  return (
    `/*! ${pkg.name} - ${pkg.version} - ` +
    `${getCurrentDate()} ` +
    `| (c) 2025 ${pkg.author} | ${pkg.homepage} */`
  );
};

module.exports = {
  mode: 'production',
  context,
  entry: {
    asyncEventEmitter2: './index.js',
  },
  target: 'web',
  output: {
    filename,
    library: {
      commonjs: 'async-event-emitter2',
      amd: 'async-event-emitter2',
      root: 'asyncEventEmitter2',
    },
    libraryTarget: 'umd',
    path: outputPath,
    umdNamedDefine: true,
    globalObject: 'this',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        parallel: true,
        terserOptions: {
          sourceMap: true,
        },
      }),
    ],
  },
  externals: Object.keys(pkg.dependencies).reduce((acc, cur) => {
    acc[cur] = cur;
    return acc;
  }, new Object()),
  plugins: [
    new BannerPlugin({
      banner: getBanner(),
      entryOnly: true,
      raw: true,
    }),
  ],
};
