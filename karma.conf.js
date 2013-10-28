// Karma configuration
// Generated on Fri Oct 25 2013 22:35:12 GMT+0100 (BST)

module.exports = function (config) {
    config.set({
        basePath: 'tests',
        frameworks: ['qunit'],
        files: [
            'dist/deps.min.js',
            'helper.js',
            'adapter_tests.js',
            'adapter_embedded_tests.js'
        ],
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_ERROR,
        browsers: ['PhantomJS'],
        singleRun: true,
        autoWatch: false
    });
};
