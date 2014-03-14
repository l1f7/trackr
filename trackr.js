/*
  Easy event tracking with Google Analytics using `data-` attributes
*/

(function(win, $, undefined){

  'use strict';

  // abort if Google Analytics is not present
  if (!win._gaq) {
    console.warn('Google Analytics not loading on page.');
    return false;
  }

  function init () {
    console.log('init()');
    listen();
  }

  /*
   * Attach a delegated event listener for any element with the `data-trackr` attribute.
   * Delegated so it works with dynamically injected content.
   */
  function listen () {
    $(document).on('click', '[data-trackr]', function (e) {
      e.preventDefault(); // hacked for now...easier testing

      var data = collect(this);
      report(data);
    });
  }

  /*
   * Gather data to be reported from `data-` attributes.
   */
  function collect (el) {
    console.dirxml('collect()', el);
    var $el = $(el);
    var data = [];
    var topic = formatTopic($el.data('trackr'));

    // construct the data to pass to Google Analytics
    data[0] = topic[0] || undefined;
    data[1] = topic[1] || undefined;
    data[2] = $el.data('trackr-label') || undefined;
    data[3] = $el.data('trackr-value') || undefined;
    data[4] = $el.data('trackr-nointeract') || undefined;

    return data;
  }

  /*
   * Push event to Google Analytics
   * See https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide#SettingUpEventTracking
   */
  function report (data) {
    var params;

    // abort if required data is not passed in.
    if (!data || data[0] === undefined || data[1] === undefined) {
      console.warn('cannot report event to Google Analytics; required data not passed in', data);
      return false;
    }

    params = ['_trackEvent'].concat(data);

    // _gaq.push(['_trackEvent', 'Videos', 'Play', 'Baby\'s First Birthday']);
    win._gaq.push(params);
    console.log('sending data to GA', params);
  }

  /*
   * Split a topic string into components
   * @returns Array to be used as [category, action]
   */
  function formatTopic (str, delimiter) {
    delimiter = delimiter || '/';

    var topic = str.replace(/\./g, ' - ').split(delimiter) || [];

    for (var i = 0; i < topic.length; i++) {
      topic[i] = titleize(topic[i]);
    }

    return topic;
  }

  // borrowed from https://github.com/epeli/underscore.string
  function titleize (str) {
    if (str === null) { return ''; }
    str = String(str).toLowerCase();
    return str.replace(/(?:^|\s|-)\S/g, function(c){ return c.toUpperCase(); });
  }

  // dom ready
  $(function(){
    init();
  });

})(window, window.jQuery || window.Zepto);
