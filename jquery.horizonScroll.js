/**
 * HorizonScroll
 * Version: 1.1.0
 * URL: https://github.com/trgraglia/jquery.horizonScroll.js/
 * Description: This is a jQuery plugin which allows for websites to scroll left and right.
 * Requires: jQuery 1.10.2
 * Optional: jQuery TouchSwipe (http://labs.rampinteractive.co.uk/touchSwipe/)
 * Author: Anthony Graglia
 * Copyright: Copyright 2013 Anthony Graglia
 * License: MIT License
 */

// Semicolon to prevent breakage with concatenation.
;
(function ($) {
    'use strict';

    $.fn.horizon = function (options, i) {
        if (options === 'scrollLeft') {
            scrollLeft();
        } else if (options === 'scrollRight') {
            scrollRight();
        } else if (options === 'scrollTo') {
            if (isNumeric(i)) {
                scrollTo(+i, $.fn.horizon.defaults.scrollDuration);
            } else {
                scrollToId(i, $.fn.horizon.defaults.scrollDuration);
            }
        } else {
            $.extend($.fn.horizon.defaults, options);

            $.fn.horizon.defaults.sections = this;
            $.fn.horizon.defaults.limit = this.length;
            $.fn.horizon.defaults.i = 0;

            sizeSections();

            $(document).on('mousewheel DOMMouseScroll', function (e) {
                // Equalize event object.
                var evt = window.event || e;
                // Convert to originalEvent if possible.
                evt = evt.originalEvent ? evt.originalEvent : evt;
                // Check for detail first, because it is used by Opera and FF.
                var delta = evt.detail ? evt.detail * (-40) : evt.wheelDelta;

                scrollAction(delta);
            }).on('click', '.horizon-next', function () {
                scrollRight();
            }).on('click', '.horizon-prev', function () {
                scrollLeft();
            }).on('click', 'a[href^="#"]', function () {
                var hash = $(this).attr('href');
                if (-1 < hash.indexOf('#')) {
                    scrollToId(hash.split('#')[1], $.fn.horizon.defaults.scrollDuration);
                }
            });

            if ($.fn.horizon.defaults.swipe) {
                $(document).swipe({
                    // Generic swipe handler for all directions.
                    swipe: function (event, direction, distance, duration, fingerCount) {
                        if (scrolls[direction]) {
                            scrolls[direction]();
                        }
                    },
                    /*click: function (event, target) {
                     event.preventDefault();
                     event.stopPropagation();
                     event.stopImmediatePropagation();

                     //$(target).click();
                     },
                     tap: function (event, target) {
                     event.preventDefault();
                     event.stopPropagation();
                     event.stopImmediatePropagation();

                     $(target).click();
                     },*/
                    // Default is 75px, set to 0 for demo so any distance triggers swipe
                    threshold: 75
                });
            }

            $(window).on('resize', function () {
                sizeSections();
            }).on('keydown', function (e) {
                if (scrolls[e.which]) {
                    scrolls[e.which]();
                    e.preventDefault();
                }
            });

            return this;
        }
    };

    $.fn.horizon.defaults = {
        scrollTimeout: null,
        scrollEndDelay: 250,
        scrollDuration: 400,
        i: 0,
        limit: 0,
        docWidth: 0,
        sections: null,
        swipe: true,
        fnCallback: function (i) {
        }
    };

    function isNumeric(num) {
        return !isNaN(num)
    }

    function scrollToId(id, speed) {
        var i = -1;
        $.fn.horizon.defaults.sections.each(function (index, element) {
            if (id === $(this).attr('id')) {
                i = index;
            }
        });

        if (0 <= i) {
            scrollTo(i, $.fn.horizon.defaults.scrollDuration);
        }
    }

    // HTML animate does not work in webkit. BODY does not work in opera.
    // For animate, we must do both.
    // http://stackoverflow.com/questions/8790752/callback-of-animate-gets-called-twice-jquery
    var scrollTo = function (index, speed) {
        if (index > ($.fn.horizon.defaults.limit - 1) || index < 0) {
            console.log('Scroll where? I think you want me to go out of my limits. Sorry, no can do.');
            return;
        }

        console.log('Scroll to: ' + index);
        $.fn.horizon.defaults.i = index;

        var $section = $($.fn.horizon.defaults.sections[index]);
        $('html,body').animate({scrollLeft: $section.offset().left}, speed, 'swing', $.fn.horizon.defaults.fnCallback(index));

        if (index === 0) {
            $('.horizon-prev').hide();
            $('.horizon-next').show();
        } else if (index === $.fn.horizon.defaults.limit - 1) {
            $('.horizon-prev').show();
            $('.horizon-next').hide();
        } else {
            $('.horizon-next').show();
            $('.horizon-prev').show();
        }
    };

    var scrollLeft = function () {
        console.log('Scroll left');

        var i2 = $.fn.horizon.defaults.i - 1;

        if (i2 > -1) {
            scrollTo(i2, $.fn.horizon.defaults.scrollDuration);
        }
    };

    var scrollRight = function () {
        console.log('Scroll right');

        var i2 = $.fn.horizon.defaults.i + 1;

        if (i2 < $.fn.horizon.defaults.limit) {
            scrollTo(i2, $.fn.horizon.defaults.scrollDuration);
        }
    };

    // Executes on 'scrollbegin'.
    var scrollBeginHandler = function (delta) {
        // Scroll up, Scroll down.
        if (delta > 1) {
            scrollLeft();
        } else if (delta < -1) {
            scrollRight();
        }
    };

    // Executes on 'scrollend'.
    var scrollEndHandler = function () {
        $.fn.horizon.defaults.scrollTimeout = null;
    };

    var scrollAction = function (delta) {
        if ($.fn.horizon.defaults.scrollTimeout === null) {
            scrollBeginHandler(delta);
        } else {
            clearTimeout($.fn.horizon.defaults.scrollTimeout);
        }

        $.fn.horizon.defaults.scrollTimeout = setTimeout(scrollEndHandler, $.fn.horizon.defaults.scrollEndDelay);
    };

    var sizeSections = function () {
        var iInnerWidth = $(window).innerWidth();

        // Store window width and assign it to each panel or section.
        $.fn.horizon.defaults.docWidth = iInnerWidth;
        $.fn.horizon.defaults.sections.each(function () {
            $(this).width(iInnerWidth);
        });

        // Set the page to be a width large enough to include all panels.
        $('html').width($.fn.horizon.defaults.limit * iInnerWidth);

        // Scroll to current section without animation.
        scrollTo($.fn.horizon.defaults.i, 0);
    };

    var scrolls = {
        'right': scrollLeft,
        'down': scrollLeft,
        'left': scrollRight,
        'up': scrollRight,
        37: scrollLeft,
        38: scrollLeft,
        39: scrollRight,
        40: scrollRight
    };

})
(jQuery);
