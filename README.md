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

Trackr depends on jQuery and Google Analytics. They must both be included _before_ `trackr.js`.

```html
<!-- google analytics embed code -->
<script src="jquery.min.js"></script>
<script src="bower_components/trackr/trackr.min.js"></script>
```

Alternatively, just grab the `trackr.min.js` script from [Github][repo] and include it in your HTML however you'd like.


## All the things

You can also set up the following [optional attributes][attributes] accepted by Google Analytics:

- label `data-trackr-label`
- value `data-trackr-value`

```html
<span data-trackr="videos/play" data-trackr-label="Baby\'s First Birthday">...</span>
```

Need to use the _non-interactional_ attribute? Just add `data-trackr-nointeract`.

```html
<span data-trackr="videos/play" data-trackr-nointeract>...</span>
```

### How it works

Trackr attaches a delegated `click` event listener to `$(document)` on DOM-ready. This means that it will work for elements injected after the page is loaded. When an element with `data-trackr` is clicked, Trackr collects the data attributes and then simply calls the Google Analytics API.

```js
_trackEvent(category, action, opt_label, opt_value, opt_noninteraction)
```



[event-tracking]: https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
[attributes]: https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide#SettingUpEventTracking
[repo]: https://github.com/l1f7/trackr
