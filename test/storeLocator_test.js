(function($) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

	/**
	 * This file contains very minimal testing. I may or may not do more extensive tests -
	 * more or less playing around with it for the first time
	 */

  module('storeLocator', {
    // This will run before each test in this module.
    setup: function() {
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('is chainable', 1, function() {
    // Not a bad test to run on collection methods.
    strictEqual(this.elems.storeLocator({
			'infowindowTemplatePath': '../dist/assets/js/plugins/storeLocator/templates/infowindow-description.html',
			'listTemplatePath': '../dist/assets/js/plugins/storeLocator/templates/location-list-description.html'
		}), this.elems, 'Should be chainable');
  });


	module('Independent methods', {
    // This will run before each test in this module.
    setup: function() {
      $('#bh-sl-map-container').storeLocator({
				'infowindowTemplatePath': '../dist/assets/js/plugins/storeLocator/templates/infowindow-description.html',
				'listTemplatePath': '../dist/assets/js/plugins/storeLocator/templates/location-list-description.html',
				'taxonomyFilters': {
					'category' : 'category-filters-container1',
					'features' : 'category-filters-container2',
					'city' : 'city-filter',
					'postal': 'postal-filter'
				}
			});
    },

		teardown: function() {
			$('#bh-sl-map-container').data('plugin_storeLocator').destroy();
		}
  });

	/**
	 * Distance calculations
	 */
	test('geoCodeCalcToRadian()', 3, function() {
		var $this = $('#bh-sl-map-container').data('plugin_storeLocator');
		var radiansPerDegree = Math.PI / 180;

		deepEqual($this.geoCodeCalcToRadian(0), 0, 'Zero test');
		deepEqual($this.geoCodeCalcToRadian(10), 10 * radiansPerDegree, 'Integer test');
		deepEqual($this.geoCodeCalcToRadian(10.10), 10.10 * radiansPerDegree, 'Float test');
	});

	test('geoCodeCalcDiffRadian()', 2, function() {
		var $this = $('#bh-sl-map-container').data('plugin_storeLocator');
		
		deepEqual($this.geoCodeCalcDiffRadian(10, 5), ($this.geoCodeCalcToRadian(5) - $this.geoCodeCalcToRadian(10)), 'Integer test');
		deepEqual($this.geoCodeCalcDiffRadian(10.10, 5.5), ($this.geoCodeCalcToRadian(5.5) - $this.geoCodeCalcToRadian(10.10)), 'Float test');
	});

	/**
	 * Query string
	 *
	 * URL needs to be set to /test/storeLocator.html?bh-sl-address=test for this to pass
	 */
	test('getQueryString()', 2, function() {
		var $this = $('#bh-sl-map-container').data('plugin_storeLocator');

		deepEqual($this.getQueryString(), undefined, 'Empty test');
		deepEqual($this.getQueryString('bh-sl-address'), 'test', 'String test');
	});

	/**
	 * Get data
	 */
	asyncTest('getData', 1, function() {
		var $this = $('#bh-sl-map-container').data('plugin_storeLocator');
		var dataRequest = $this._getData('44.8896866', '-93.34994890000002', 'Edina,MN');

		setTimeout(function() {
			ok(dataRequest.done(), 'Data was called successfully');
			start();
		}, 1000);
	});

	/**
	 * Round number
	 */
	test('roundNumber()', 2, function() {
		var $this = $('#bh-sl-map-container').data('plugin_storeLocator');

		deepEqual($this.roundNumber(2.345432, 0), 2, 'Round down test');
		deepEqual($this.roundNumber(2.694928, 0), 3, 'Round up test');
	});

	/**
	 * Empty object test
	 */
	test('isEmptyObject()', 2, function() {
		var $this = $('#bh-sl-map-container').data('plugin_storeLocator');
		var emptyObj = {};
		var nonEmptyObj = {
			'test': 'testing'
		};

		deepEqual($this.isEmptyObject(emptyObj), true, 'Empty object test');
		deepEqual($this.isEmptyObject(nonEmptyObj), false, 'Empty object fail test');
	});

	/**
	 * Empty object values test
	 */
	test('hasEmptyObjectVals()', 3, function() {
		var $this = $('#bh-sl-map-container').data('plugin_storeLocator');
		var emptyObj = {};
		var emptyObjVals = {
			'test1' : '',
			'test2' : ''
		};
		var nonEmptyObj = {
			'test': 'testing'
		};

		deepEqual($this.hasEmptyObjectVals(emptyObj), true, 'Empty object test');
		deepEqual($this.hasEmptyObjectVals(emptyObjVals), true, 'Empty object vals test');
		deepEqual($this.hasEmptyObjectVals(nonEmptyObj), false, 'Empty object fail test');
	});


	/**
	 * Sort locations (array of objects) numerically by distance test
	 */
	test('sortNumerically()', 1, function() {
		var $this = $('#bh-sl-map-container').data('plugin_storeLocator');
		var positiveTest = [
			{ 'distance': 9 },
			{ 'distance': 2 },
			{ 'distance': 30 },
			{ 'distance': 5 }
		];
		var positiveMatch = [
			{ 'distance': 2 },
			{ 'distance': 5 },
			{ 'distance': 9 },
			{ 'distance': 30 }
		];

		$this.sortNumerically(positiveTest);

		deepEqual(positiveTest, positiveMatch, 'Positive test');
	});

	/**
	 * Filter data test
	 */
	test('filterData()', 2, function() {
		var filter, filters, locationset, locationMatch, locationsMatch, inclusiveTest, exclusiveTest;
		var $this = $('#bh-sl-map-container').data('plugin_storeLocator');

		// Single filter
		filter = {
			'city': ['Minneapolis']
		};

		// Multi-filter
		filters = {
			'city': ['Minneapolis', 'St. Paul']
		};

		locationset = [{
			'city': 'St. Paul',
			'state': 'MN'
		}, {
			'city': 'Des Moines',
			'state': 'IA'
		}, {
			'city': 'Minneapolis',
			'state': 'MN'
		}];

		locationMatch = [{
			'city': 'Minneapolis',
			'state': 'MN'
		}];

		locationsMatch = [{
			'city': 'St. Paul',
			'state': 'MN'
		}, {
			'city': 'Minneapolis',
			'state': 'MN'
		}];

		inclusiveTest = $.grep(locationset, function (val, i) {
			return $this.filterData(val, filter);
		});

		// Inclusive test
		deepEqual(inclusiveTest, locationMatch, 'Inclusive filtering test');

		$this.settings.exclusiveFiltering = true;

		exclusiveTest = $.grep(locationset, function (val, i) {
			return $this.filterData(val, filters);
		});

		// Exclusive test
		deepEqual(exclusiveTest, locationsMatch, 'Exclusive filtering test');
	});

	
}(jQuery));
