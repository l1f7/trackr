module.exports = function (grunt) {
  'use strict';

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    app: {
      src: 'src/'
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['<%= app.src %>*.js']
      }
    },

    concat: {
      options: {
        separator: '\n\n;'
      },
      src: {
        files: {
          'trackr.js': [
            '<%= app.src %>trackr.js'
          ]
        }
      }
    },

    uglify: {
      src: {
        files: {
          'trackr.min.js': ['trackr.js']
        }
      }
    },

    ///////////////////////////////////////////
    // Automation Magic (Dev Workflow)
    ///////////////////////////////////////////

    watch: {
      scripts: {
        files: ['Gruntfile.js', '<%= app.src %>*.js'],
        tasks: ['build']
      }
    }

  });

  // Default task
  grunt.registerTask('build', ['jshint', 'concat', 'uglify']);
  grunt.registerTask('default', ['build', 'watch']);

};
