const path = require("path")
const FaviconsWebpackPlugin = require("favicons-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin")
const helper = require("./helper.js")

const htmlPages = helper.htmlPages
const includeStylesInMain = helper.includeStylesInMain
includeStylesInMain()

module.exports = (options) => {
  const isProduction = !!options.hasOwnProperty("production")
  const isLossyOptimization = true

  const createHash = (ext) => `[name].[contenthash].${ext}`

  const createAssetPath = (pathData) => {
      const filepath = path
        .dirname(pathData.filename)
        .split("/")
        .slice(1)
        .join("/");
      return `assets/${filepath}/[name][ext]`;
    }

  /* =============================== OPTIONS =============================== */

  const imageMinOptions = {
    minimizer: {
      implementation: ImageMinimizerPlugin.imageminMinify,
      options: {
        plugins: isLossyOptimization
          ? ['imagemin-gifsicle', 'imagemin-mozjpeg', 'imagemin-pngquant']
          : [
            ['gifsicle', {interlaced: true}],
            ['jpegtran', {progressive: true}],
            ['optipng', {optimizationLevel: 5}]
          ]
      }
    }
  }

  const faviconOptions = {
    logo: "./assets/icons/favicon.png",
    outputPath: "assets/icons/favicon"
  }

  /* =============================== CONFIG ================================ */

  return {
    mode: isProduction ? "production" : "development",
    context: path.resolve(__dirname, "src"),
    entry: {
      main: path.resolve(__dirname, "src/scripts/index.js")
    },
    output: {
      clean: true,
      path: path.resolve(__dirname, "dist"),
      filename: isProduction ? createHash("js") : "[name].js",
      assetModuleFilename: (pathData) => createAssetPath(pathData),
    },
    devServer: {
      compress: true,
      hot: true,
      open: true,
      port: 8097
    },
    plugins: [
      new MiniCssExtractPlugin({filename: createHash("css")}),
      new FaviconsWebpackPlugin(faviconOptions),
      ...htmlPages
    ],
    module: {
      rules: [
        {
          test: /\.html$/i,
          loader: "html-loader"
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"]
        },
        {
          test: /\.(png|jpg|jpeg|gif|webp|svg)$/i,
          type: isProduction ? 'asset/resource' : 'asset/inline'
        },
        {
          test: /\.(woff2?|eot|ttf|otf)$/i,
          type: "asset/resource"
        },
      ]
    },
    optimization: {
      splitChunks: {
        chunks: "all"
      },
      minimize: true,
      minimizer: [new ImageMinimizerPlugin(imageMinOptions)]
    }
  }
}
