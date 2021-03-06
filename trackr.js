

/*
  Easy event tracking with Google Analytics using `data-` attributes
*/

(function(win, $){

  'use strict';

  win.Trackr = {
    name : 'Trackr',
    version : '0.0.3',
    href : jQuery(location).attr('href'),
    defaults : {
      youtube : false,
      facebook : false,
      twitter : {
        click : false,
        tweet : false,
        retweet : false,
        favorite : false,
        follow : false
      },
      trackr : true
    },

    init : function (options) {
      // set options
      var opts = $.extend(true, {}, this.defaults, options);
      if (opts.trackr === true)
        this.listen();

      if (opts.facebook === true)
        this.facebook();

      if (opts.youtube === true)
        this.youtube();

      if (opts.twitter.click === true || opts.twitter.tweet === true || opts.twitter.retweet === true || opts.twitter.favorite === true || opts.twitter.follow === true)
        this.twitter(opts);

    },

    /*
      ======================================
      Basic Link Tracking Stuff
      ======================================
     */

        /*
         * Attach a delegated event listener for any element with the `data-trackr` attribute.
         * Delegated so it works with dynamically injected content.
         */
        listen : function () {
          $(document).on('click', '[data-trackr]', function (ev) {
            ev.stopPropagation();
            ev.preventDefault();
            var data = Trackr.collect(this);
            Trackr.report(data);
          });
        },

        /*
         * Gather data to be reported from `data-` attributes.
         */
        collect : function (el) {
          var $el   = $(el)
          ,   data  = []
          ,   topic = this.formatTopic($el.data('trackr'))
          ,   labelDefault;

          // default label to href attr unless it's an internal link
          if (!/^#/.test($el.attr('href'))) {
            labelDefault = $el.attr('href');
          }

          // construct the data to pass to Google Analytics
          data[0] = topic[0] || undefined;
          data[1] = topic[1] || undefined;
          data[2] = $el.data('trackr-label') || labelDefault;
          data[3] = $el.data('trackr-value') || undefined;
          data[4] = $el.data('trackr-nointeract') || false;

          return data;
        },

        /*
         * Split a topic string into components
         * @returns Array to be used as [category, action]
         */
        formatTopic : function (str, delimiter) {
          delimiter = delimiter || ':';
          var topic = str.replace(/\./g, ' - ').split(delimiter) || [];

          for (var i = 0; i < topic.length; i++) {
            topic[i] = this.titleize(topic[i]);
          }

          return topic;
        },

        /*
         * Push event to Google Analytics
         */
        report : function (data) {
          var params;

          // abort if required data is not passed in.
          if (!data || data[0] === undefined || data[1] === undefined) {
            if(win.console)
              console.warn('Cannot report event to Google Analytics; required data not passed in. You need to set at minimum a category/action on your link, ie: <a href="http://link.com" data-trackr="category:action">Link.com</a>');
            return false;
          }

          if (win.console)
            console.log('sending data to GA', data);

          // send event
          // (@TODO: this also seems inordinately ugly, need to revisit)
          win.ga('send','event',data[0],data[1],data[2],data[3],data[4]);
        },

        // borrowed from https://github.com/epeli/underscore.string
        titleize : function (str) {
          if (str === null) { return ''; }
          str = String(str).toLowerCase();
          return str.replace(/(?:^|\s|-)\S/g, function(c){ return c.toUpperCase(); });
        },


    /*
      ======================================
      Facebook
      ======================================
     */
        facebook : function () {
          window.fbAsyncInit = this.fbInit;
        },

        fbInit : function () {
          FB.Event.subscribe('edge.create', function (href, widget) {
            var data = Trackr.collect(widget.parentNode);

            // abort if required data is not passed in.
            if (!data || data[0] === undefined || data[1] === undefined) {
              if(win.console)
                console.warn('Cannot report event to Google Analytics; required data not passed in. You need to set at minimum a category/action on your link, ie: <a href="http://link.com" data-trackr="category:action">Link.com</a>');
              return false;
            }

            if (win.console)
              console.log('sending FB Like: ', data);

            ga('send', 'social', 'facebook', 'like', data[2]);
            ga('send', 'event', 'facebook', 'like', data[2]);
          });

          //Unlikes the page
          FB.Event.subscribe('edge.remove', function (href, widget) {
            var data = Trackr.collect(widget.parentNode);

            // abort if required data is not passed in.
            if (!data || data[0] === undefined || data[1] === undefined) {
              if(win.console)
                console.warn('Cannot report event to Google Analytics; required data not passed in. You need to wrap your Facebook element in a div with the data-trackr attributes, ie: <div data-trackr="category:action" data-trackr-label="label"><div class="fb-like" data-href="https://www.facebook.com/" data-layou="standard" data-action="like" data-show-faces="true" data-share="true"></div></div>');
              return false;
            }

            if (win.console)
              console.log('sending FB Unlike: ', data);

            ga('send', 'social', 'facebook', 'like', data[2]);
            ga('send', 'event', 'facebook', 'like', data[2]);
          });


          //Send or Share The Page
          //
          // This doesn't work from what I've found, but leaving
          // in case I figure something out in the future
          //
          //
          // FB.Event.subscribe('message.send', function (href, widget) {
          //   var data = Trackr.collect(widget.parentNode);

          //   // abort if required data is not passed in.
          //   if (!data || data[0] === undefined || data[1] === undefined) {
          //     if(win.console)
          //       console.warn('Cannot report event to Google Analytics; required data not passed in. You need to set at minimum a category/action on your link, ie: <a href="http://link.com" data-trackr="category:action">Link.com</a>');
          //     return false;
          //   }

          //   if (win.console)
          //     console.log('sending FB Share: ', data);

          //   ga('send', 'social', 'facebook', 'share', data[2]);
          //   ga('send', 'event', 'facebook', 'share', data[2]);
          // });
        },

    /*
      ======================================
      Twitter
      ======================================
     */
      // TODO: Build out more functionality
      //       https://dev.twitter.com/docs/tfw/events
        twitter : function (opts) {
          win.twttr.ready(function (twttr) {
            if (opts.twitter.click === true)
              twttr.events.bind('click', Trackr.twitterClick);

            if (opts.twitter.tweet === true)
              twttr.events.bind('tweet', Trackr.twitterTweet);

            if (opts.twitter.retweet === true)
              twttr.events.bind('retweet', Trackr.twitterRetweet);

            if (opts.twitter.favorite === true)
              twttr.events.bind('favorite', Trackr.twitterFavorite);

            if (opts.twitter.follow === true)
              twttr.events.bind('follow', Trackr.twitterFollow);

          });

        },

        twitterClick : function (event) {
          if (!event) return;

          var data = Trackr.collect(event.target.parentNode);

          // abort if required data is not passed in.
          if (!data || data[0] === undefined || data[1] === undefined) {
            if(win.console)
              console.warn('Cannot report event to Google Analytics; required data not passed in. You need to wrap your Twitter element in a div with the data-trackr attributes, ie: <div data-trackr="category:action" data-trackr-label="label"><a href="https://twitter.com" class="twitter-share-button" data-url="http://www.liftinteractive.com">Tweet</a></div>');
            return false;
          }

          if (win.console)
            console.log('twitterClick data: ', data);

          // send events
          ga('send', 'event', {
            'eventCategory': data[0],
            'eventAction': data[1],
            'eventLabel' : data[2],
            'eventValue': data[3]
          });
        },

        twitterTweet : function (event) {
          if (!event) return;

          var data = Trackr.collect(event.target.parentNode);

          // abort if required data is not passed in.
          if (!data || data[0] === undefined || data[1] === undefined) {
            if(win.console)
              console.warn('Cannot report event to Google Analytics; required data not passed in. You need to wrap your Twitter element in a div with the data-trackr attributes, ie: <div data-trackr="category:action" data-trackr-label="label"><a href="https://twitter.com" class="twitter-share-button" data-url="http://www.liftinteractive.com">Tweet</a></div>');
            return false;
          }

          if (win.console)
            console.log('Tweet Sent: ', data);


          ga('send', 'event', {
            'eventCategory': 'Tweet Sent',
            'eventAction': data[1],
            'eventLabel' : data[2],
            'eventValue': data[3]
          });
          ga('send', {
            'hitType': 'social',
            'socialNetwork': 'Twitter',
            'socialAction': 'Tweet',
            'socialTarget': document.title,
            'page': Trackr.href
          });
        },

        twitterRetweet : function (event) {
          if (!event) return;

          var data = Trackr.collect(event.target.parentNode);

          // abort if required data is not passed in.
          if (!data || data[0] === undefined || data[1] === undefined) {
            if(win.console)
              console.warn('Cannot report event to Google Analytics; required data not passed in. You need to wrap your Twitter element in a div with the data-trackr attributes, ie: <div data-trackr="category:action" data-trackr-label="label"><a href="https://twitter.com" class="twitter-share-button" data-url="http://www.liftinteractive.com">Tweet</a></div>');
            return false;
          }

          if (win.console)
            console.log('Retweet: ', data);


          ga('send', 'event', {
            'eventCategory': 'Retweeted',
            'eventAction': data[1],
            'eventLabel' : data[2],
            'eventValue': data[3]
          });
          ga('send', {
            'hitType': 'social',
            'socialNetwork': 'Twitter',
            'socialAction': 'Retweet',
            'socialTarget': document.title,
            'page': Trackr.href
          });
        },

        twitterFavorite : function (event) {
          if (!event) return;

          var data = Trackr.collect(event.target.parentNode);

          // abort if required data is not passed in.
          if (!data || data[0] === undefined || data[1] === undefined) {
            if(win.console)
              console.warn('Cannot report event to Google Analytics; required data not passed in. You need to wrap your Twitter element in a div with the data-trackr attributes, ie: <div data-trackr="category:action" data-trackr-label="label"><a href="https://twitter.com" class="twitter-share-button" data-url="http://www.liftinteractive.com">Tweet</a></div>');
            return false;
          }

          if (win.console)
            console.log('Twitter Favorited: ', data);


          ga('send', 'event', {
            'eventCategory': 'Twitter Favorite',
            'eventAction': data[1],
            'eventLabel' : data[2],
            'eventValue': data[3]
          });
          ga('send', {
            'hitType': 'social',
            'socialNetwork': 'Twitter',
            'socialAction': 'Favorite',
            'socialTarget': document.title,
            'page': Trackr.href
          });
        },

        twitterFollow : function (event) {
          console.log('twitter follow');
          if (!event) return;

          var data = Trackr.collect(event.target.parentNode);

          // abort if required data is not passed in.
          if (!data || data[0] === undefined || data[1] === undefined) {
            if(win.console)
              console.warn('Cannot report event to Google Analytics; required data not passed in. You need to wrap your Twitter element in a div with the data-trackr attributes, ie: <div data-trackr="category:action" data-trackr-label="label"><a href="https://twitter.com" class="twitter-share-button" data-url="http://www.liftinteractive.com">Tweet</a></div>');
            return false;
          }

          if (win.console)
            console.log('Retweet: ', data);


          ga('send', 'event', {
            'eventCategory': 'Twitter Follow',
            'eventAction': data[1],
            'eventLabel' : data[2],
            'eventValue': data[3]
          });
          ga('send', {
            'hitType': 'social',
            'socialNetwork': 'Twitter',
            'socialAction': 'Follow',
            'socialTarget': document.title,
            'page': Trackr.href
          });
        },

    /*
      ======================================
      YouTube
      ======================================
     */

        youtube : function () {
          if(!win.YT){
            if(win.console)
              console.log('YouTube api is non-existant. Injecting API.');

            // Inject API
            var j = document.createElement('script'),
            f = document.getElementsByTagName('script')[0];
            j.src = '//www.youtube.com/iframe_api';
            j.async = true;
            f.parentNode.insertBefore(j, f);

            // Once YouTube api has loaded
            j.onload = function () {
              win.onYouTubeIframeAPIReady = Trackr.onYouTubeIframeAPIReady;
            };
          } else {
            win.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady;
          }
        },


        /*
         * Attach our YT listener once the API is loaded
         *
         * Due to the encapsulated nature here, I had to add the
         * various events directly inside the initialization
         * (originally wanted them to be part of the main Trackr object)
         */
        onYouTubeIframeAPIReady : function () {
          for (var e = document.getElementsByTagName('iframe'), x = e.length; x--;){

            if (/youtube.com\/embed/.test(e[x].src)) {
              new YT.Player(e[x], {
                events: {

                  /*
                   * When the API is all setup and the YouTube player is ready
                   * Leaving for later, not sure what to do with this now.
                   */
                  'onReady': function (e) {
                  },

                  /*
                   * Listen for changes in the video player, fire appropriate events to GA
                   */
                  'onStateChange': function (e) {
                    var percentID;
                    var data = e['target'].getVideoData();
                    if (e['data'] === YT.PlayerState.PLAYING) {
                      ga('send', 'event', {
                        'eventCategory': 'YouTube',
                        'eventAction': 'Play',
                        'eventLabel' : data['title'] + ' : ' + e['target'].getVideoUrl()
                      });
                      // Report % played every second
                      var onPlayerPercent = function (e) {
                        var t = e['getDuration']() - e['getCurrentTime']() <= 1.5 ? 1 : (Math.floor(e['getCurrentTime']() / e['getDuration']() * 4) / 4).toFixed(2);
                        if (!e['lastP'] || t > e['lastP']) {
                          e['lastP'] = t;
                          console.log('played: '+ (t * 100 + '%'));
                          ga('send', 'event', {
                            'eventCategory': 'YouTube',
                            'eventAction': 'Percentage',
                            'eventLabel' : data['title'] + ' : ' + (t * 100 + '%'),
                            'eventValue': t * 100
                          });
                          //ga('send', 'event', 'youtube', 'played: '+ (t * 100 + "%"));
                        }
                        /* jshint ignore:start */
                        e['lastP'] !== 1 && setTimeout(onPlayerPercent, 1000, e);
                        /* jshint ignore:end */
                      };
                      setTimeout(onPlayerPercent, 1000, e['target']);
                    }

                    // Send event on Paused
                    if (e['data'] === YT.PlayerState.PAUSED) {
                      ga('send', 'event', {
                        'eventCategory': 'YouTube',
                        'eventAction': 'Pause',
                        'eventLabel' : data['title'] + ' : ' + e['target'].getVideoUrl()
                      });
                    }

                    // Send event on Completed
                    if (e['data'] === YT.PlayerState.ENDED) {
                      ga('send', 'event', {
                        'eventCategory': 'YouTube',
                        'eventAction': 'Completed',
                        'eventLabel' : data['title'] + ' : ' + e['target'].getVideoUrl()
                      });
                    }
                  },


                  /*
                   * Catch all to report errors through the GTM data layer
                   */
                  'onError': function (e) {
                      var data = e['target'].getVideoData();
                      ga('send', 'event', {
                        'eventCategory': 'YouTube',
                        'eventAction': 'Error',
                        'eventLabel' : data['title'] + ' : ' + e['target'].getVideoUrl()
                      });
                  }
                }
              });
            }
          }
        },
  };

  /*
   * Attach our Trackr script to jQuery
   */
  $.fn.trackr = function (options) {
    // abort if Google Analytics doesn't exist
    if (!win.ga) {
      if (window.console)
        console.log('Google Analytics Universal does not exist');
      return false;
    }

    Trackr.init(options);
  };
})(window, window.jQuery);

