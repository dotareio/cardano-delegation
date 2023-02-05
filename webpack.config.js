const path = require('path');

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            compilerOptions: {
                                noEmit: false,
                            },
                        },
                    }],
                include: [
                    path.resolve(__dirname, "./src/types/global.d.ts"),
                    path.resolve(__dirname, "./src/load.ts"),
                    path.resolve(__dirname, "./src/delegation.ts")
                ],
                exclude: /node_modules/,
            },
        ],
    },
    experiments: {
        asyncWebAssembly: true
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'cardano-delegation',
        libraryTarget: 'umd',
    },
    optimization: {
        minimize: true
    }
}