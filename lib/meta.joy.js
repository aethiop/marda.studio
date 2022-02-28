window.meta.joy = {};
window.addEventListener("gamepadconnected", function (eve) {
	if (!navigator.getGamepads) {
		return;
	}
	var was = {};
	window.requestAnimationFrame(function frame() {
		var pads = navigator.getGamepads() || [],
			pad,
			tmp;
		for (var i in pads) {
			if ((pad = pads[i])) {
				window.meta.joy = pad;
				break;
			}
		}
		if (!pad) {
			return;
		}
		tmp = pad.axes || [];
		pad.ls = { x: tmp[0], y: tmp[1] };
		pad.rs = { x: tmp[2], y: tmp[3] };
		tmp = 0;
		var b = pad.buttons,
			ts = pad.timestamp;
		if (!b) {
			return;
		}
		pad.ba = b[0].value ? was.ba || (tmp = ts) : 0;
		pad.bb = b[1].value ? was.bb || (tmp = ts) : 0;
		pad.bx = b[2].value ? was.bx || (tmp = ts) : 0;
		pad.by = b[3].value ? was.by || (tmp = ts) : 0;
		pad.lb = b[4].value ? was.lb || (tmp = ts) : 0;
		pad.rb = b[5].value ? was.rb || (tmp = ts) : 0;

		if (tmp) {
			$(document).trigger("joystart");
		}

		pad.lt = b[6].value;
		pad.rt = b[7].value;
		was = pad;
		window.requestAnimationFrame(frame);
	});
});
window.addEventListener("gamepaddisconnected", function () {
	window.meta.joy = null;
});
var $look = $("<div id='look'>").appendTo("body").css({
	position: "fixed",
	"border-radius": "100%",
	background: "rgba(0,0,0,0.9)",
	width: "0.1em",
	height: "0.1em",
	top: 0,
	left: 0,
	border: "3px white solid",
});
$look.x = $look.y = 0;
var y_ = 0,
	Y = 0,
	FPS = 60,
	f;
window.requestAnimationFrame(function frame() {
	window.requestAnimationFrame(frame);
	var joy = window.meta.joy;
	if (!joy) {
		return;
	}

	var axe = joy.axes,
		lx = axe[1],
		ly = axe[1],
		rx = axe[2],
		ry = axe[3];
	f = 0;
	if (Math.abs(ly) > 0.1) {
		Y = 1 === Math.abs(y_) ? Y + ly / 5 : ly * 10;
		y_ = ly;
		f = 1;
	}
	if (Y) {
		window.scroll(0, window.scrollY + Y);
		if (!f) {
			Y /= 4;
		}
	}
	//if(y > 0.1 || y < -0.1){ window.scroll(0, window.scrollY + (y*20)) }
	if (rx > 0.1 || rx < -0.1 || ry > 0.1 || ry < -0.1) {
		$look.css({
			left: ($look.x = Math.lim(
				0,
				window.innerWidth - 3,
				$look.x + rx * 10
			)),
			top: ($look.y = Math.lim(
				0,
				window.innerHeight - 3,
				$look.y + ry * 10
			)),
		});
	}

	var ding = joy.ba ? "g" : joy.bb ? "b" : joy.bx ? "x" : joy.by ? "y" : 0;
	// : Math.floor(Math.random() * 100).toString(36);
	ding && (window.song = wave(ding).play());
	if (window.song) {
		song.loud(Math.remix(-1, 1, ly))
			.vary(Math.remix(-1, 1, lx))
			.blur(joy.rt)
			.itch(joy.lt);
	}
});

// ////////////////
