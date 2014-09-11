module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg      : grunt.file.readJSON('storelocator.jquery.json'),
		banner   : '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
				' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
		// Task configuration.
		clean    : {
			files: ['dist']
		},
		less     : {
			dist: {
				src : 'src/css/storelocator.less',
				dest: 'dist/css/storelocator.css'
			}
		},
		concat   : {
			options: {
				stripBanners: true
			},
			dist   : {
				src : ['src/js/jquery.<%= pkg.name %>.js'],
				dest: 'dist/js/jquery.<%= pkg.name %>.js'
			}
		},
		uglify   : {
			dist: {
				files: {
					'dist/js/jquery.<%= pkg.name %>.min.js': '<%= concat.dist.dest %>',
					'dist/js/handlebars.min.js'            : 'libs/handlebars/*.js',
					'dist/js/geocode.min.js'               : 'src/js/geocode.js'
				}
			}
		},
		qunit    : {
			files: ['test/**/*.html']
		},
		jshint   : {
			gruntfile: {
				options: {
					jshintrc: '.jshintrc'
				},
				src    : 'Gruntfile.js'
			},
			src      : {
				options: {
					jshintrc: 'src/.jshintrc'
				},
				globals: {
					jQuery: true,
					google: true
				},
				src    : ['src/**/*.js']
			},
			test     : {
				options: {
					jshintrc: 'test/.jshintrc'
				},
				src    : ['test/**/*.js']
			}
		},
		usebanner: {
			dist: {
				options: {
					position: 'top',
					banner  : '<%= banner %>'
				},
				files  : {
					'dist/js/jquery.<%= pkg.name %>.js'    : 'dist/js/jquery.<%= pkg.name %>.js',
					'dist/js/jquery.<%= pkg.name %>.min.js': 'dist/js/jquery.<%= pkg.name %>.min.js'
				}
			}
		},
		cssmin   : {
			dist: {
				files: {
					'dist/css/storelocator.min.css': 'dist/css/storelocator.css'
				}
			}
		},
		watch    : {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: ['jshint:gruntfile']
			},
			src      : {
				files  : ['src/**/*'],
				tasks  : ['less', 'concat', 'uglify', 'usebanner', 'cssmin'],
				options: {
					spawn     : false,
					livereload: true
				}
			},
			test     : {
				files: '<%= jshint.test.src %>',
				tasks: ['jshint:test', 'qunit']
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-banner');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	// Default task.
	grunt.registerTask('default', ['jshint', 'qunit', 'less', 'concat', 'uglify', 'usebanner', 'cssmin']);
	// Build
	grunt.registerTask('build', ['less', 'concat', 'uglify', 'usebanner', 'cssmin']);
	//Watch src build
	grunt.registerTask('watchsrc', ['watch:src']);

};