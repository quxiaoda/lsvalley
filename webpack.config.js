
//webpack config

var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var glob = require('glob');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var WebpackMd5Hash = require('webpack-md5-hash');
var DashboardPlugin = require('webpack-dashboard/plugin');

//各文件夹的路径
var ROOT_PATH = path.resolve(__dirname);
var SRC_PATH = path.resolve(ROOT_PATH, 'src'); //源码目录
var DIST_PATH = path.resolve(ROOT_PATH, 'dist'); //生产环境目录打包目录
var VIEWS_PATH = path.resolve(ROOT_PATH, 'views'); //模板目录
var NODE_MODULES = path.resolve(ROOT_PATH, 'node_modules'); //npm包目录

//获取构建环境
var NODE_ENV = process.env.NODE_ENV;
var isProduction = NODE_ENV ==='production' ? true : false; //生成环境
var isTest = NODE_ENV ==='testing' ? true : false; //测试环境

var entryTpl = {}; //存放模板对象 用于跟入口js对应
var plugins = []; //存放动态生成的插件数组

//入口html
var entryHtml = glob.sync(VIEWS_PATH + '/**/*.html');
//var entryHtmlArr=[];
entryHtml.forEach(function(filePath){
    var entryPath = path.dirname(filePath);
        entryPath = entryPath.substring(entryPath.lastIndexOf('\/')+1);
    var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
    var conf = {
        template: filePath,
        filename: 'views/' + entryPath + '/'+filename + '.html',
        inject:'body',
        chunks:['vender',filename]
    }
    plugins.push(new HtmlwebpackPlugin(conf));
    entryTpl[filename] = filePath;
});

//入口js 
var entryFiles = glob.sync(SRC_PATH + '/**/*.{js,vue}');
var entryJs = {};
entryFiles.forEach(function(filePath){
    if(filePath.indexOf('common')==-1){
       // var entryPath = path.dirname(filePath);
        //entryPath = entryPath.substring(entryPath.lastIndexOf('\/')+1);
        var entryName = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        if(entryName in entryTpl){
            entryJs[entryName] = filePath;
            //console.log(entryPath);
        }
    }
});

var extractCSS;  
if(isProduction){
    extractCSS = new ExtractTextPlugin('[name]/[name].[contenthash:20].css'); // contenthash 给css文件生成独立的hash值（与对应的js文件区分开）
     plugins.push(extractCSS,
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        }),
        new webpack.DefinePlugin({ //解决压缩后的文件在控制台警告问题
            "process.env": { 
                NODE_ENV: JSON.stringify(process.env.NODE_ENV) 
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
        new WebpackMd5Hash() // 解决只修改css文件时 导致引用该文件的js重复生成新hash值的问题（正常不需要）， 参考文献 http://www.cnblogs.com/ihardcoder/p/5623411.html
    );

}else{
    extractCSS = new ExtractTextPlugin('[name]/[name].css');
    //new webpack.optimize.UglifyJsPlugin({minimize: true})
    plugins.push(extractCSS,new webpack.HotModuleReplacementPlugin()); 
}

//设置资源路径
var pubPath = 'http://dev.ihome.lsvalley.com:9900/dist/';
if(isProduction || isTest){
    // pubPath = 'http://i0.tuanimg.com/ms/h5mall_static/dist/';
    pubPath = 'http://ihome.lsvalley.com/wxpub/'
}

module.exports = {
  
  entry: Object.assign(entryJs,{ //生成公共主库文件根据项目的基础框架选择合并提取
        'vender': ['vue','vuex']
  }),
  
  output: {
    path:DIST_PATH,
    filename: isProduction ? '[name]/[name].[chunkhash].js':'[name]/[name].js',
    //chunkFilename: "[chunkhash].[id].chunk.js",
    publicPath: pubPath
  },

  module: {
    loaders: [
        {
        test: /\.vue$/,
        loader: 'vue'
      },
        {
        test:/\.js?$/,
        loader:'babel',
        // include:SRC_PATH
        include: [
            SRC_PATH,
            path.join(ROOT_PATH, 'node_modules/vue-echarts-v3/src')
        ]
    },
        {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test:/\.css$/,    
        loader:ExtractTextPlugin.extract('style-loader','css-loader!postcss-loader'),
        include:SRC_PATH
      },
      {
        test:/\.(jpe?g|png|gif)$/,
        loaders:[
            'url?limit=8192&name=img/[name].[ext]', //<= 8kb 的图自动转换成base64编码 dataurl 
            // 'image?{bypassOnDebug:true, progressive:true,optimizationLevel:3,pngquant:{quality:"65-80",speed:4}}' // 压缩图片
            'image-webpack'
        ],
        include:SRC_PATH
      }

    ]
    //noParse: ['']
  },
  imageWebpackLoader: {
      bypassOnDebug: true,
      progressive: true,
      optipng: {
          optimizationLevel: 3
      },
      pngquant: {
          quality: "65-80",
          speed: 4
      }
  },
  postcss:function(webpack){
      return [
          require('postcss-cssnext'),
          require('postcss-import')
          ]
  },
  resolve: {
        //查找module的话从这里开始查找
       // root: './static/libs/', //绝对路径
        //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
        extensions: ['', '.js','.vue','.json'],
        //模块别名定义，方便后续直接引用别名，无须多写长长的地址
         alias: {
            'jQuery': path.join(SRC_PATH,'libs/jquery-vendor.js'),
            //  'gizwits': path.join(SRC_PATH,'libs/gizwits_ws_0.1.1.min.js')
            //  'zepto' : path.join(STATIC_PATH,'libs/zepto/zepto.js')
        //      'react': path.join(NODE_MODULES, '/react/dist/react.min.js'),
        // 'react-dom': path.join(NODE_MODULES, '/react-dom/dist/react-dom.min.js'),
        //  'reflux': path.join(NODE_MODULES, '/reflux/dist/reflux.min.js')
        }
    },
    // externals:{
    //     'Zepto':'Zepto'
    // },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
        name:['vender'],
        filename:'[name]/[name].js',
    //    chunks:['gizwits'],
       // children:true,
        minChunks: Infinity  
    }),
    new DashboardPlugin()
  ].concat(plugins),
   devtool: isProduction ? null : '#eval-source-map'
   ,devServer: {
        historyApiFallback: true,
        hot: true,
        port: 9900,
        inline: true,
        progress: true,
        stats: {
            cached: false,
            colors: true
        },
        proxy: {
            '/': {
                target: 'http://ihome.lsvalley.com',
                secure: true,
                changeOrigin: true
            }
        }
    }
};

