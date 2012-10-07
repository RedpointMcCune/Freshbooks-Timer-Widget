// utilities.js
//
// Adapted for Windows by Andrew Flusche from code by FreshBooks.
// aflusche@gmail.com - www.andrewflusche.com

//
// clocker is the object which holds how much time has actually been clocked by this widget.
// It's stable across widget shutdowns (assuming you save the first three members), as it
// counts from the timestamp when it was last started.
var clocker = {
	// Stopped by default.
	clockRunning: false
	// How much time has been stored up, but not counted in the current start-cycle.
,	millisecondsClocked: 0
	// Just a default number, never used.
,	startTime: new Date()
,	setStartStopButtons: function () {
		setElementVisibility("startbutton", !this.clockRunning);
		setElementVisibility("pausebutton",  this.clockRunning);
		setElementVisibility("startbutton2", this.clockRunning);
		setElementVisibility("pausebutton2",  !this.clockRunning);
	}
,	startClock: function () {
		this.startTime = new Date();
		this.clockRunning = true;
		this.setStartStopButtons();
	}
	// Save the time accumulated by asking ourselves how much has accumulated!
,	stopClock: function () {
		this.millisecondsClocked = this.getTime();
		this.clockRunning = false;
		this.setStartStopButtons();
	}
,	getTime: function () {
		var now = new Date();
		var millisecondsUnclocked = 0;
		if (this.clockRunning)
		{
			millisecondsUnclocked = now.getTime() - this.startTime.getTime();
		}
		return millisecondsUnclocked + this.millisecondsClocked;
	}
,	reset: function () {
		this.stopClock();
		this.millisecondsClocked = 0;
	}
,	getState: function () {
		return [this.clockRunning, this.millisecondsClocked, this.startTime.getTime()].join();
	}
,	setState: function (state) {
		if (!state) return;
		var vars = state.split(",");
		this.clockRunning = vars[0] == "true" ? true : false;
		this.millisecondsClocked = parseInt(vars[1]);
		this.startTime.setTime(parseInt(vars[2]));
		this.setStartStopButtons();
	}
};

//
// Provide fade effects for status lines.
// (id of status text div,
//  message to display,
//  [whether you want it to fade in or just *bam*
//   [, how long it should stay on the screen]])
var setStatus = (function () {
	var timeoutSet = {};
	return function (which,msg,instant,timeout) {
		tag = "#"+which;
		instant = instant || false;
		timeout = timeout || 3000; // Default to 5 seconds
		// New effect now, so cancel whatever was happening before.
		$(tag).queue("fx",[]);
		if (timeoutSet[which]) {
			// Cancel any previous things we had queued
			clearTimeout(timeoutSet[which]);
			// Fade out current content before fading in the new stuff
			if (!instant) $(tag).fadeOut();
		}
		$(tag).queue(function(){
			if (instant) $(tag).css("display","block");
			else $(tag).css("display", "none").fadeIn();
			$(tag)[0].innerHTML = msg;
			$(tag).dequeue();
			});
		timeoutSet[which] = setTimeout(
			function () {
				$(tag).fadeOut();
				timeoutSet[which] = null;
			},timeout);
	};
})();

//
// Make the hourglass start() or stop() pulsing.
var hourglass = {
	start: function () {
		hourglass.busy = true;
		hourglass.toggle = true;
		$("#reload").fadeIn(hourglass.fadeTime, hourglass.pulse);
	}
,	pulse: function () {
		if (hourglass.busy) {
			$("#reload").fadeTo(
				hourglass.fadeTime,
				hourglass.toggle ? hourglass.minOpacity : hourglass.maxOpacity,
				hourglass.pulse);
			hourglass.toggle = !hourglass.toggle;
		}
	}
,	stop: function () {
		hourglass.busy = false;
		$("#reload").queue("fx",[]);
		$("#reload").fadeOut(hourglass.fadeTime);
	}
,	minOpacity: 0.2
,	maxOpacity: 1.0
,	fadeTime: "slow"
,	toggle: false
,	busy: false
};


// Input parameters:  
// String text, [Number length, String ellipsis]  
//  
// Returns:  
// String text  

function truncate(text, length, ellipsis) {

	// Set length and ellipsis to defaults if not defined
	if (typeof length == 'undefined') var length = 16;
	if (typeof ellipsis == 'undefined') var ellipsis = '..';
	
	// Return if the text is already lower than the cutoff
	if (text.length < length) return text;
	
	// Otherwise, check if the last character is a space.
	// If not, keep counting down from the last character
	// until we find a character that is a space
	//for (var i = length-1; text.charAt(i) != ' '; i--) {
	//	length--;
	//}
	
	// The for() loop ends when it finds a space, and the length var  
	// has been updated so it doesn't cut in the middle of a word.  
	return text.substr(0, length) + ellipsis;
}