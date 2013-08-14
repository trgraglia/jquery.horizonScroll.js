/**
 * HorizonScroll
 * Version: 1.0.0.0
 * URL: https://github.com/trgraglia/jquery.horizonScroll.js/
 * Description: This is a jQuery plugin which allows for websites to scroll left and right.
 * Requires: jQuery 1.10.2, jQuery TouchSwipe (http://labs.rampinteractive.co.uk/touchSwipe/)
 * Author: Anthony Graglia
 * Copyright: Copyright 2013 Anthony Graglia
 * License: MIT License
 */

// Semicolon to prevent breakage with concatenation
;(function( $ ) {

	$.fn.horizon = function(options) {
		if(options=='scrollLeft') {
			scrollLeft();
		} else if(options=='scrollRight') {
			scrollRight();
		} else {			
			$.extend( $.fn.horizon.defaults, options );
		
			$.fn.horizon.defaults.sections = this;
			$.fn.horizon.defaults.limit = this.length;
			$.fn.horizon.defaults.i = 0;
					
			sizeSections();
			
			$(document).on("mousewheel DOMMouseScroll", function(e){
				// equalize event object.
				var evt = window.event || e;
				// convert to originalEvent if possible.
				evt = evt.originalEvent ? evt.originalEvent : evt;
				// check for detail first, because it is used by Opera and FF.
				var delta = evt.detail ? evt.detail*(-40) : evt.wheelDelta;

				scrollAction(delta);
			}).on('click','.horizon-next',function(){
				scrollRight();
			}).on('click','.horizon-prev',function(){
				scrollLeft();
			});
			
			if($.fn.horizon.defaults.swipe) {
				$(document).swipe({
					// Generic swipe handler for all directions.
					swipe:function(event, direction, distance, duration, fingerCount) {
						switch(direction) {
							case 'right':
								scrollLeft();
							break;
							case 'down':
								scrollLeft();
							break;
							case 'left':
								scrollRight();
							break;
							case 'up':
								scrollRight();
							break;
							default: return; // Exit handler for other keys
						}
					},
					click:function (event, target) {
						$(target).click();
					},
					// Default is 75px, set to 0 for demo so any distance triggers swipe
					threshold:75
				});
			}

			$(window).on('resize', function() {
				sizeSections();	
			}).on('keydown', function(e) {
				switch(e.which) {
					// Left, Up, Right, Down
					case 37:
						scrollLeft();
						break;
					case 38:
						scrollLeft();
						break;
					case 39:
						scrollRight();
						break;
					case 40:
						scrollRight();
						break;
					default:
						return;
				}
				e.preventDefault();
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
		swipe: true
    };
	
	// HTML animate does not work in webkit. BODY does not work in opera.
	// For animate, we must do both.
	// http://stackoverflow.com/questions/8790752/callback-of-animate-gets-called-twice-jquery
	var scrollTo = function(index, speed){
		if(index > ($.fn.horizon.defaults.limit - 1) || index < 0)
			return;
			
		var $section = $($.fn.horizon.defaults.sections[index]);
		$('html,body').animate({scrollLeft:$section.offset().left}, speed, 'swing');
		
		if (index == 0) {
			$('.horizon-prev').hide();
		} else if(index == $.fn.horizon.defaults.limit - 1) {
			$('.horizon-next').hide();
		} else {
			$('.horizon-next').show();
			$('.horizon-prev').show();
		}
	};

	var scrollLeft = function(){
		if($.fn.horizon.defaults.i > 0)
			scrollTo(--$.fn.horizon.defaults.i, $.fn.horizon.defaults.scrollDuration);
	};

	var scrollRight = function(){
		if($.fn.horizon.defaults.i < $.fn.horizon.defaults.limit - 1)
			scrollTo(++$.fn.horizon.defaults.i, $.fn.horizon.defaults.scrollDuration);
	};
	
	// Executes on "scrollbegin".
	var scrollBeginHandler = function(delta) {
		// Scroll up, Scroll down.
		if (delta > 1) 
			scrollLeft();
		else if (delta < -1)
			scrollRight();
	};

	// Executes on "scrollend".
	var scrollEndHandler = function() {
		$.fn.horizon.defaults.scrollTimeout = null;
	};

	var scrollAction = function(delta) {
		if ( $.fn.horizon.defaults.scrollTimeout === null )
			scrollBeginHandler(delta);
		else
			clearTimeout($.fn.horizon.defaults.scrollTimeout);
				
		$.fn.horizon.defaults.scrollTimeout = setTimeout(scrollEndHandler, $.fn.horizon.defaults.scrollEndDelay);
	};

	var sizeSections = function(){
		$.fn.horizon.defaults.docWidth = $(window).innerWidth();
		$.fn.horizon.defaults.sections.each(function(){
			$(this).width($.fn.horizon.defaults.docWidth);
		});
		
		$('html').width($.fn.horizon.defaults.limit * $.fn.horizon.defaults.docWidth);
		
		scrollTo($.fn.horizon.defaults.i, 0);
	};	
 
})(jQuery);

// SCROLLING NOTES
// http://stackoverflow.com/questions/4989632/differentiate-between-scroll-up-down-in-jquery
// http://stackoverflow.com/questions/4289473/javascript-do-an-action-after-user-is-done-scrolling
