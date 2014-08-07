# Trackr

> A declarative, DOM based event tracker for Google Analytics Universal that includes support for Twitter, Facebook, and YouTube.

[Event Tracking][event-tracking] in Google Analytics is not difficult. Trackr just makes it simpler.

```html
<span data-trackr="Trackr:Click">...</span>
```

When the above element is clicked Trackr will log an event in Google Analytics with a category of **Trackr**, an action of **Click**.


## Installation

Trackr depends on jQuery and Google Analytics *Universal*. They must both be included _before_ `trackr.js`.

> **NOTE:** If you want to use the basic element tracking with the previous version of Google Analytics (_gaq), [version 0.0.1 of Trackr](https://github.com/l1f7/trackr/tree/c060b9c290352970635f55a81c8fbbdcd52d7b6c) works with that version of Google Analytics. Since the update to 0.2.0, Google Analytics Universal is required.

```bash
bower install trackr --save
```

```html
<!-- google analytics embed code -->
<script src="jquery.min.js"></script>
<script src="bower_components/trackr/trackr.min.js"></script>
```

Alternatively, just grab the `trackr.min.js` script from [Github][repo] and include it in your HTML however you'd like.

**Initialization**
Trackr, as of version 0.2, requires initialization and you can optionally pass an options object to the library. By default, YouTube, Facebook, and Twitter are turned off. If you want to use these platforms, you need to set their boolean values to true in the options object:
```html
<script>
  $(document).ready(function () {
    $(document).trackr({
      youtube: true,
      facebook: true,
      twitter: {
        click : true,
        tweet : true,
        retweet : true,
        favorite : true,
        follow : true
      },
      trackr: true
    });
  });
</script>
```

## All the things

### Optional attributes

You can also set up the following [optional attributes][attributes] accepted by Google Analytics:

- label `data-trackr-label`
- value `data-trackr-value`

```html
<span data-trackr="videos:play" data-trackr-label="Baby\'s First Birthday">...</span>
```

If the element you are tracking is an anchor tag `<a>`, the `href` attribute will be used as the default Label. This will happen only if you do not specify a `data-trackr-label` attribute and the `href` does not start with `#`.

### How it works

Trackr attaches a delegated `click` event listener to `$(document)` on DOM-ready. This means that it will work for elements injected after the page is loaded. When an element with `data-trackr` is clicked, Trackr collects the data attributes and then simply calls the Google Analytics API.

```js
win.ga('send','event',data[0],data[1],data[2],data[3],data[4]);
```

### Special Characters

Trackr looks for a slash `:` in the `data-trackr` attribute. This will be used to split the string into a category and action. For example, ` data-trackr="videos:play"` will result in the category of _Videos_ and action of _Play_. These attributes will be automatically capitalized so they look nicer in Google Analytics.

A period `.` character can be used to combine multiple word attributes. For example, `data-trackr="interaction.videos:controls.play"` will yield a category of _Interaction - Videos_ and an action of _Controls - Play_. This is a short cut to keep your data attributes looking clean and simple. 

The slash `:` and period `.` are the only special characters that Trackr looks for.


##### Facebook
Right now, the Facebook functionality only tracks `Likes` and `Unlikes` as there is little else we can do with the Facebook Widget API from what we have seen so far although we will continue to investigate. You have to add the Facebook HTML5 widget js into your page as per their instructions for embedding the Like button.

The power here though is that you can easily track the engagement of `Likes` on different areas of your page by wrapping the FB Element in a `div` with our normal Trackr attributes:

```html
<div data-trackr="FB Like:lift" data-trackr-label="Blog Sidebar">
  <div data-href="https://www.facebook.com/liftinteractive" data-layout="standard" data-action="like" data-show-faces="true" data-share="true" class="fb-like"></div>
</div>
<div data-trackr="FB Like:lift" data-trackr-label="Footer Button">
  <div data-href="https://www.facebook.com/liftinteractive" class="fb-share-button"></div>
</div>
```

This would report two different `Like` events in the category `Facebook`, one with a label `Homepage Like Button`, and one with a label `Footer Button`.

##### Twitter
The Twitter functionality works identical to the Facebook tracking by wrapping the widget in a `div` with the Trackr attributes. You also need to embed the Twitter widget js as per their instructions.

Twitter also allows us to track a lot more events including Clicks, Tweets, Retweets, Favorites, and Follows:

```html
<div data-trackr="Twitter:button" data-trackr-label="Lift Interactive Tweet">
  <a href="https://twitter.com/share" data-url="http://www.liftinteractive.com" data-size="large" class="twitter-share-button">Tweet Lift</a>
  </div>

<div data-trackr="Twitter:Timeline" data-trackr-label="blog.sidebar">
  <a href="https://twitter.com/liftinteractive" data-widget-id="373554246584512512" class="twitter-timeline">Tweets by @liftinteractive</a>
</div>

<div data-trackr="Twitter:Follow" data-trackr-label="footer">
  <a href="https://twitter.com/liftinteractive" data-show-count="false" data-lang="en" class="twitter-follow-button">Follow @twitterapi</a>
</div>

<div data-trackr="Twitter:Embedded Tweet" data-trackr-label="Blog Post Title">
  <blockquote class="twitter-tweet" lang="en"><p>Google&#39;s Project Zero tracks down security flaws in the world&#39;s software. They&#39;ve recruited a hacker dream team! <a href="http://t.co/B3fmCJAFWy">http://t.co/B3fmCJAFWy</a></p>&mdash; Lift Interactive (@liftinteractive) <a href="https://twitter.com/liftinteractive/statuses/494512880201777152">July 30, 2014</a></blockquote>
</div>
```


##### YouTube

As long as you initialize YouTube in the Trackr options object, there is nothing else you need to do. When it's initialized, Trackr automatically tracks all major events for every YouTube video on the page. The events it tracks are: `play`, `pause`, `ended` (video completed), and also reports percentage of the video at `0%`,`25%`,`50%`, and `75%` so it's possible to see how deep into the videos people have watched. This also makes it easy to report for conversions (ie. if watching more than 50% is considered a conversion).

## Roadmap

We're open to discussion on what else you'd like to see integrated so just [file an issue][issues] on Github with your ideas. In the meantime, the only other major integrations we'd like to do are:

* Vimeo
* Pinterest (waiting on their API to be finished)


[event-tracking]: https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
[attributes]: https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide#SettingUpEventTracking
[repo]: https://github.com/l1f7/trackr
[issues]: https://github.com/l1f7/trackr/issues
