const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

function resolve(dir) {
  return path.join(__dirname, dir);
}

const ENV = process.env.NODE_ENV;
const entry = './src/main.js';
const port = 8001;

module.exports = {
  // outputDir: 'dist',
  // assetsDir: 'static',
  filenameHashing: true,
  publicPath: `//localhost:${port}`,
  // 自定义webpack配置
  devServer: {
    // host: '0.0.0.0',
    hot: true,
    disableHostCheck: true,
    port,
    overlay: {
      warnings: false,
      errors: true
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  },
  // 自定义webpack配置
  configureWebpack: {
    // name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    output: {
      // 把子应用打包成 umd 库格式
      library: '[name]',
      filename: '[name]-[hash].js',
      libraryTarget: 'umd',
      globalObject: 'this',
    }
  },
  chainWebpack: (config) => {
    console.log('env:', ENV);
    console.log('entry:', entry);

    config.entry('app')
      .add(entry)
      .end();

    if (['mfe_dev', 'mfe_prod'].includes(ENV)) {      
      config.externals({
        vue: 'Vue',
        vuex: 'Vuex',
        'vue-router': 'VueRouter',
        'vue-i18n': 'VueI18n',
        axios: 'axios',
        'element-ui': 'ElementUI'
      });      
    }
    if (['mfe_prod', 'production'].includes(ENV)) {
      config.plugin('webpack-bundle-anlyzer')
        .use(BundleAnalyzerPlugin)
        .tap(args => [...args, {
          analyzerPort: 8010
        }])
        .end()
    }
  },
}
