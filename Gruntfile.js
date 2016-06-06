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
				files: {
					'dist/assets/css/bootstrap-example.css' : 'src/css/bootstrap-example.less'
				}
			}
		},
		sass     : {
			dist: {
				files: {
					'dist/assets/css/storelocator.css' : 'src/css/storelocator.scss'
				}
			}
		},
		concat   : {
			options: {
				stripBanners: true
			},
			dist   : {
				src : ['src/js/jquery.<%= pkg.name %>.js'],
				dest: 'dist/assets/js/plugins/storeLocator/jquery.<%= pkg.name %>.js'
			}
		},
		uglify: {
			dist: {
				files: {
					'dist/assets/js/plugins/storeLocator/jquery.<%= pkg.name %>.min.js': '<%= concat.dist.dest %>',
					'dist/assets/js/libs/handlebars.min.js'                            : 'libs/handlebars/*.js',
					'dist/assets/js/geocode.min.js'                                    : 'src/js/geocode.js',
					'dist/assets/js/libs/markerclusterer.min.js'                       : 'libs/markerclusterer/*.js',
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
					'dist/assets/js/plugins/storeLocator/jquery.<%= pkg.name %>.js'    : 'dist/assets/js/plugins/storeLocator/jquery.<%= pkg.name %>.js',
					'dist/assets/js/plugins/storeLocator/jquery.<%= pkg.name %>.min.js': 'dist/assets/js/plugins/storeLocator/jquery.<%= pkg.name %>.min.js'
				}
			}
		},
		cssmin   : {
			dist: {
				files: {
					'dist/assets/css/storelocator.min.css': 'dist/assets/css/storelocator.css',
					'dist/assets/css/bootstrap-example.min.css': 'dist/assets/css/bootstrap-example.css'
				}
			}
		},
		handlebars   : {
			dist: {
				files: {
					'dist/assets/js/plugins/storeLocator/templates/compiled/standard-templates.js': 'src/templates/standard/*.html',
					'dist/assets/js/plugins/storeLocator/templates/compiled/kml-templates.js': 'src/templates/kml/*.html'
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
				tasks  : ['less', 'sass', 'concat', 'uglify', 'usebanner', 'cssmin'],
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
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-banner');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-handlebars');

	// Build
	grunt.registerTask('build', ['less', 'sass', 'concat', 'uglify', 'usebanner', 'cssmin']);
	
	//Watch src build
	grunt.registerTask('watchsrc', ['watch:src']);

};