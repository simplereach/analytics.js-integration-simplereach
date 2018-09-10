'use strict';

var Analytics = require('@segment/analytics.js-core').constructor;
var integration = require('@segment/analytics.js-integration');
var sandbox = require('@segment/clear-env');
var tester = require('@segment/analytics.js-integration-tester');
var SimpleReach = require('../lib/');

describe('Simplereach', function() {
  var analytics;
  var simplereach;
  var options = {
    pid: '000000000000000000000000'
  };

  beforeEach(function() {
    analytics = new Analytics();
    simplereach = new SimpleReach(options);
    analytics.use(SimpleReach);
    analytics.use(tester);
    analytics.add(simplereach);
  });

  afterEach(function() {
    analytics.restore();
    analytics.reset();
    simplereach.reset();
    sandbox();
  });

  it('should have the right settings', function() {
    analytics.compare(SimpleReach, integration('SimpleReach')
      .global('SPR')
      .global('__reach_config')
      .option('pid', ''));
  });

  describe('before loading', function() {
    beforeEach(function() {
      analytics.stub(simplereach, 'load');
    });

    describe('#initialize', function() {
      it('should create window.__reach_config', function() {
        var expected = {
          pid: '000000000000000000000000'
        };
        analytics.initialize();
        analytics.deepEqual(window.__reach_config, expected);
      });

      it('should inherit global window.__reach_config defaults', function() {
        window.__reach_config = { ignore_errors: true, pid: '12345' };
        var expected = {
          ignore_errors: true,
          pid: '12345'
        };

        analytics.initialize();
        analytics.deepEqual(window.__reach_config, expected);
      });

      it('should call #load', function() {
        analytics.initialize();
        analytics.page();
        analytics.called(simplereach.load);
      });
    });
  });

  describe('loading', function() {
    it('should load', function(done) {
      analytics.load(simplereach, done);
    });

    it('should load the library', function() {
      analytics.spy(simplereach, 'load');
      analytics.initialize();
      analytics.loaded('<script src="http://d8rk54i4mohrb.cloudfront.net/js/reach.js">');
    });
  });

  describe('after loading', function() {
    beforeEach(function(done) {
      analytics.once('ready', done);
      analytics.initialize();
    });

    it('SimpleReach SPR should exist', function() {
      analytics.isFunction(window.SPR.collect);
    });

    describe('#page', function() {
      beforeEach(function() {
        analytics.stub(window.SPR, 'collect');
      });

      it('should send a page view', function() {
        analytics.page();
        analytics.called(window.SPR.collect);
      });

      // SimpleReach JS should detect url, title, date,
      // tags, authors, and channels if  not provided
      it('should detect fields from meta if not present in config', function() {
        var expected = {
          pid: window.__reach_config.pid,
          url: 'http://mygreatreachtestsite.com/ogurl.html',
          title: document.title,
          date: '2018-02-19',
          tags: ['$tag1', '$tag2'],
          authors: 'Henry David Thoreau',
          channels: 'nickelodeon'
        };

        analytics.page();

        var actual = analytics.spies[0].args[0][0];
        analytics.deepEqual(actual, expected);
      });
    });
  });
});
