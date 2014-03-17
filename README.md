# Trackr

> A declarative, DOM based event tracker for Google Analytics.

[Event Tracking][event-tracking] in Google Analytics is not difficult. Trackr just makes it simpler.

```html
<span data-trackr="videos/play">...</span>
```

When the above element is clicked Trackr will log an event in Google Analytics with a category of **Videos** and an action of **Play**.


## Installation

```bash
bower install trackr --save
```

Trackr depends on jQuery (or Zepto) and Google Analytics. They must both be included _before_ `trackr.js`.

```html
<!-- google analytics embed code -->
<script src="jquery.min.js"></script>
<script src="bower_components/trackr/trackr.min.js"></script>
```

Alternatively, just grab the `trackr.min.js` script from [Github][repo] and include it in your HTML however you'd like.


## All the things

### Optional attributes

You can also set up the following [optional attributes][attributes] accepted by Google Analytics:

- label `data-trackr-label`
- value `data-trackr-value`

```html
<span data-trackr="videos/play" data-trackr-label="Baby\'s First Birthday">...</span>
```

If the element you are tracking is an anchor tag `<a>`, the `href` attribute will be used as the default Label. This will happen only if you do not specify a `data-trackr-label` attribute and the `href` does not start with `#`.

Need to use the _non-interactional_ attribute? Just add `data-trackr-nointeract`.

```html
<span data-trackr="videos/play" data-trackr-nointeract>...</span>
```

### How it works

Trackr attaches a delegated `click` event listener to `$(document)` on DOM-ready. This means that it will work for elements injected after the page is loaded. When an element with `data-trackr` is clicked, Trackr collects the data attributes and then simply calls the Google Analytics API.

```js
_trackEvent(category, action, opt_label, opt_value, opt_noninteraction)
```

### Special Characters

Trackr looks for a slash `/` in the `data-trackr` attribute. This will be used to split the string into a category and action. For example, ` data-trackr="videos/play"` will result in the category of _Videos_ and action of _Play_. These attributes will be automatically capitalized so they look nicer in Google Analytics.

A period `.` character can be used to combine multiple word attributes. For example, `data-trackr="interaction.videos/controls.play"` will yield a category of _Interaction - Videos_ and an action of _Controls - Play_. This is a short cut to keep you data attributes looking clean and simple. 

The slash `/` and period `.` are the only special characters that Trackr looks for.

## Configuration

There are no configuration options for Trackr at this time. This is meant to be an extremely simple solution that covers basic use cases. If you need something extra, just use the Google Analytics API directly ;) Having said that, we're open to discussion... just [file an issue][issues] on Github.


[event-tracking]: https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
[attributes]: https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide#SettingUpEventTracking
[repo]: https://github.com/l1f7/trackr
[issues]: https://github.com/l1f7/trackr/issues
