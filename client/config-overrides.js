const webpack = require('webpack');
module.exports = function override(config, env) {

    config.resolve.fallback = {
        url: require.resolve('url'),
        assert: require.resolve('assert'),
        crypto: require.resolve('crypto-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        buffer: require.resolve('buffer'),
        stream: require.resolve('stream-browserify'),
        vm: require.resolve("vm-browserify"),
        path: require.resolve("path-browserify"),
        console: require.resolve("console-browserify"),
        zlib: require.resolve("browserify-zlib"),
        domain: require.resolve("domain-browser"),
        constants: require.resolve("constants-browserify"),
        fs: false,
        module: false,
        diagnostics_channel: false,
        worker_threads: false,
        stream: false,
        util: false,
        perf_hooks: false,
        net: false,
        tls: false,
        async_hooks: false,
        repl: false,
        child_process:false
    };
    config.plugins.push(
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
    );

    return config;
}