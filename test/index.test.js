
var Analytics = require('analytics.js-core').constructor;
var integration = require('analytics.js-integration');
var sandbox = require('clear-env');
var tester = require('analytics.js-integration-tester');
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
          reach_tracking: false,
          pid: '000000000000000000000000'
        };
        analytics.initialize();
        analytics.page();
        analytics.deepEqual(window.__reach_config, expected);
      });

      it('should inherit global window.__reach_config defaults', function() {
        window.__reach_config = { ignore_errors: true, pid: '12345' };
        var expected = {
          reach_tracking: false,
          ignore_errors: true,
          pid: '12345'
        };

        analytics.initialize();
        analytics.page();
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
      analytics.page();
      analytics.loaded('<script src="http://d8rk54i4mohrb.cloudfront.net/js/reach.js">');
    });
  });

  describe('after loading', function() {
    beforeEach(function(done) {
      analytics.once('ready', done);
      analytics.initialize();
      analytics.page();
    });

    it('SimpleReach SPR should exist', function() {
      analytics.page({ path: '/path', title: 'title' });
      analytics.assert(typeof window.SPR.collect === 'function');
    });

    describe('#page', function() {
      beforeEach(function() {
        analytics.stub(window.SPR, 'collect');
      });

      it('should send a page view', function() {
        var title = document.title;
        analytics.page();
        analytics.equal(window.__reach_config.url, 'http://mygreatreachtestsite.com/ogurl.html');
        analytics.equal(window.__reach_config.title, title);
        analytics.called(window.SPR.collect);
      });
    });

    describe('#track', function() {
      beforeEach(function() {
        analytics.stub(window.SPR, 'collect');
      });

      it('should send collect when there is revenue and an order ID', function() {
        var title = document.title;
        var orderId = '50314b8e9bcf000000000000';
        var revenue = 25;

        analytics.track('Completed Order', {
          orderId: orderId,
          revenue: revenue,
          title: title
        });

        analytics.called(window.SPR.collect, {
          pid: options.pid,
          reach_tracking: false,
          url: 'http://mygreatreachtestsite.com/ogurl.html',
          title: title,
          ctx_revenue: revenue,
          ctx_order_id: orderId
        });
      });
      it('should not send collect when the order id is missing', function() {
        var revenue = 25;

        analytics.track('Completed Order', {
          revenue: revenue
        });

        analytics.didNotCall(window.SPR.collect);
      });
    });
  });
});

