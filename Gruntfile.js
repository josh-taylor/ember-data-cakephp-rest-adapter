module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-ember-template-compiler');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-neuter');

    grunt.initConfig({
        jshint: {
            all: ['dist/ember-data-cakephp-rest-adapter.js', 'tests/adapter_tests.js', 'tests/adapter_embedded_tests.js']
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },
        neuter: {
            build: {
                basePath: 'src/',
                src: 'src/main.js',
                dest: 'dist/ember-data-cakephp-rest-adapter.js'
            }
        },
        concat: {
            test: {
                src: [
                    'tests/lib/jquery-1.9.1.js',
                    'tests/lib/handlebars-1.0.0.js',
                    'tests/lib/ember-1.0.0.js',
                    'tests/lib/ember-data.js',
                    'tests/lib/jquery.mockjax.js',
                    'tests/lib/tmpl.min.js',
                    'dist/ember-data-cakephp-rest-adapter.js',
                    'tests/app.js'
                ],
                dest: 'tests/dist/deps.min.js'
            }
        },
        emberhandlebars: {
            compile: {
                options: {
                    templateName: function (sourceFile) {
                        var newSource = sourceFile.replace('tests/templates/', '');
                        return newSource.replace('.handlebars', '');
                    }
                },
                files: ['tests/templates/*.handlebars'],
                dest: 'tests/lib/tmpl.min.js'
            }
        }
    });

    grunt.task.registerTask('test', ['build', 'jshint', 'emberhandlebars', 'concat:test', 'karma']);
    grunt.task.registerTask('build', ['neuter:build']);
    grunt.task.registerTask('dist', ['build']);
    grunt.task.registerTask('default', ['dist']);
}
