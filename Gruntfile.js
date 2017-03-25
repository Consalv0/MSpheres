module.exports = function (grunt) {
  grunt.initConfig({
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 100,
          syncImport: true,
          strictImports: true
        },
        files: {
          // target.css file: source.less file
          'css/main.css': 'less/main.less'
        }
      }
    },
    jade: {
      compile: {
        options: {
          pretty: false
        },
        files: {
          // target.css file: source.less file
          'index.html': ['jade/index.jade'],
          '/Users/Consalvo/Sites/index.html': 'jade/index.jade'
        }
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      my_target: {
        files: {
          'js/main.min.js': ['js/main.js'],
          'js/game.min.js': ['js/game.js']
        }
      }
    },
    watch: {
      jade: {
        files: ['jade/**/*.jade', 'css/**/*.css', 'js/**/*.min.js'], // which files to watch
        tasks: ['jade'],
        options: {
          nospawn: true
        }
      },
      less: {
        files: ['less/**/*.less'], // which files to watch
        tasks: ['less', 'jade'],
        options: {
          nospawn: true
        }
      },
      uglify: {
        files: ['js/**/*.js', '!js/**/*.min.js'],
        tasks: ['uglify', 'jade'],
        options: {
          nospawn: true
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-less')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-jade')
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.registerTask('default', ['uglify', 'less', 'jade', 'watch'])
  grunt.registerTask('build', ['uglify', 'less', 'jade'])
}
