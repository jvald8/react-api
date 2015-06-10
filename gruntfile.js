module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      src: ['test/*.js', 'gruntfile.js', 'server.js'],
      options: {
        globals: {
          describe: true,
          it: true,
        },
        node: true,
        mocha: true,
      },
    },
    simplemocha: {
      src: ['test/*.js'],
    },
    watch: {
      scripts: {
        files: ['test/*.js', 'gruntfile.js', 'server.js'],
        tasks: ['jshint', 'simplemocha', 'jscs'],
      },
    },
    jscs: {
      src: ['test/*.js', 'gruntfile.js', 'server.js'],
      options: {
        config: '.jscsrc',
      },
    },
  });

  grunt.loadNpmTasks('grunt-simple-mocha');

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.loadNpmTasks('grunt-jscs');

  grunt.registerTask('default', ['jshint', 'test', 'jscs']);

  grunt.registerTask('test', 'simplemocha');

};
