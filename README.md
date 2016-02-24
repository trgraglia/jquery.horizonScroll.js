jquery.horizonScroll.js - Horizontal Scrolling (Paging) Websites
=======================
This is a jQuery plugin which allows for websites to page(scroll by set width) left and right horizontally. Horizontal scroll sites offer a new and unique way to develope sites! Check it out and give feedback! THX

Demo
=======================
Click here for the [demo](http://trgraglia.github.io/jquery.horizonScroll.js/demo/index.html)

Usage
=======================
Initial usage. All elements specified by the selector become a page.
```javascript
$('selector').horizon();
```

If you do not want to use jquery.swipeTouch.js for swipe left and right:
```javascript
$('selector').horizon({swipe: false});
```

Additional plugin options and their default values:
```javascript
$.fn.horizon.defaults = {
    scrollTimeout: null,
    scrollEndDelay: 250,
    scrollDuration: 400,
    i: 0,
    limit: 0,
    docWidth: 0,
    sections: null,
    swipe: true,
    fnCallback: function (i) {}
};
```

You can invoke a left page scroll, right page scroll or page scroll to a page index. This helps if you would like to bind to additional elements on the page.
The selector here is ignored.
```javascript
$(document).horizon('scrollRight');
$(document).horizon('scrollLeft');

// As of 1.1.0, i can be an integer with or without quotes in order to scroll to an index.
// Or i can be a string of an element id to scroll to.
$(document).horizon('scrollTo', i); 
```

Changelog
=======================
1.1.0:
- Added support for element IDs using scrollTo()
- Added support for animating the scroll to a section via hash links
- Updated sample index.html
- Updated readme

Notes and References
====================
http://stackoverflow.com/questions/4989632/differentiate-between-scroll-up-down-in-jquery
http://stackoverflow.com/questions/4289473/javascript-do-an-action-after-user-is-done-scrolling
http://stackoverflow.com/questions/175739/is-there-a-built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
