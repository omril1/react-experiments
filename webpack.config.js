const webpack = require('webpack');
const path = require('path');

// variables
const isProduction = process.argv.indexOf('-p') >= 0;
const sourcePath = path.join(__dirname, './src');
const outPath = path.join(__dirname, './dist');

// plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');

/**@type { webpack.Configuration } */
const config = {
  context: sourcePath,
  entry: {
    main: './main.tsx'
  },
  output: {
    path: outPath,
    filename: '[hash].bundle.js',
    chunkFilename: '[chunkhash].chunk.js',
    publicPath: '/'
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    // Fix webpack's default behavior to not load packages with jsnext:main module
    // (jsnext:main directs not usually distributable es6 format, but es6 sources)
    mainFields: ['module', 'browser', 'main'],
    alias: {
      app: path.resolve(__dirname, 'src/app/')
    }
  },
  module: {
    rules: [
      // .ts, .tsx
      {
        test: /\.tsx?$/,
        use: isProduction
          ? 'ts-loader'
          : ['babel-loader?plugins[]=react-hot-loader/babel', 'ts-loader']
      },
      // css
      {
        test: /\.css$/,
        use: cssLoaders(MiniCssExtractPlugin, webpack, {
          useModules: false,
          isProduction
        })
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          ...cssLoaders(MiniCssExtractPlugin, webpack, {
            useModules: true,
            isProduction
          }),
          'sass-loader?sourceMap'
        ]
      },
      // static assets
      { test: /\.png$/, use: 'url-loader?limit=10000' },
      { test: /\.jpg$/, use: 'file-loader' }
    ]
  },
  optimization: {
    splitChunks: {
      name: true,
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: -10
        }
      }
    },
    runtimeChunk: true
  },
  plugins: [
    new WebpackCleanupPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: isProduction ? '[name].[hash].css' : '[name].css',
      chunkFilename: isProduction ? '[name].[hash].css' : '[name].css'
    }),
    new HtmlWebpackPlugin({
      template: 'index.html'
    })
  ],
  devServer: {
    contentBase: sourcePath,
    hot: true,
    inline: true,
    historyApiFallback: {
      disableDotRule: true
    },
    stats: 'minimal'
  },
  devtool: 'cheap-module-eval-source-map',
  node: {
    // workaround for webpack-dev-server issue
    // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
    fs: 'empty',
    tls: 'empty',
    net: 'empty',
    console: true
  }
};

module.exports = config;

function cssLoaders(MiniCssExtractPlugin, webpack, args) {
  const { useModules, isProduction } = args;

  return [
    isProduction ? 'css-hot-loader?sourceMap' : null,
    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
    {
      loader: 'css-loader',
      options: {
        modules: useModules,
        sourceMap: true,
        importLoaders: 1,
        localIdentName: isProduction
          ? '[hash:base64:8]'
          : '[local]__[hash:base64:5]',
        camelCase: true
      }
    },
    {
      //DOCS: http://postcss.org/
      //Available plugins by categories: https://www.postcss.parts/
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
        ident: 'postcss',
        plugins: [
          require('postcss-import')({
            //imports local files using '@import' like in SASS (https://github.com/postcss/postcss-import)
            addDependencyTo: webpack
          }),
          // @ts-ignore
          require('postcss-url')(), //utility to resolve/inline urls in CSS, helpful for third party CSS with urls like bootstrap (https://github.com/postcss/postcss-url)
          require('postcss-cssnext')(), //autoprefixer + transpiler of new CSS to older browsers according to the browserslist (http://cssnext.io/)
          require('postcss-reporter')(), //logs CSS errors and warnings to console
          require('postcss-browser-reporter')({
            //displays CSS errors and warnings in the brwoser window
            disabled: isProduction
          })
        ]
      }
    }
  ].filter((a) => a); //remove loaders that have value of null/undefined
}
