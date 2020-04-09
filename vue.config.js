// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    "transpileDependencies": [
        "vuetify"
    ],
    configureWebpack: {
        // TODO get back to this later and extract CSS properly - errors now :-/
        // optimization: {
        //     splitChunks: {
        //         cacheGroups: {
        //             styles: {
        //                 name: 'styles',
        //                 test: /\.css$/,
        //                 chunks: 'all',
        //                 enforce: true,
        //             },
        //         },
        //     },
        // },
        // plugins: [
        //     new MiniCssExtractPlugin({
        //         filename: '[name].css?[hash]',
        //     }),
        // ],
        // module: {
        //     rules: [
        //         {
        //         test: /\.css$/,
        //         use: [MiniCssExtractPlugin.loader, 'css-loader'],
        //         },
        //     ],
        // },
    },
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = 'Victorious - The Victory Tracker';
                return args;
            });
    }
}