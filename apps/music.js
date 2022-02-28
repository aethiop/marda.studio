var song = {};
// TODO:
// 1. Manually OR automatically load music.js API, dependencies, and modules. - FINE for now
// 2. only export music API, not meta, not dom, not mouselock system, not UI/html, etc. better module isolation and export.
// 3. `var wave = Wave('a').play()` // also on `Music.now`
// defaults... instrument: pure tones, volume curve: |\_ , speed curve: 0.5
// 4. `wave.blur(0.5).itch(0.5);`
// 5. wave.long(2); // how long in seconds each note plays, optionally: wave.pace(60) is bpm
// 6. wave.loud(0.5); // 0% to 100% volume loudness of device output.
// 7. wave.vary(0.5); // slows down or speeds up wiggle per harmonic
// 8:
// wave structure, does ToneJS allow us to change the sine wave smoothness/type continuously or is it a pre-fixed type?
// wave structure: /\/\/, |_|, /|/, \|\| do some research with ToneJS whether these are dynamic or fixed
// wave.itch(); // changes the shape of the wiggle from smooth sine to square or triangle
// wave.blur(220hz); // blur may not apply/work on pure notes other than filtering them.

meta.edit({ name: "Music", combo: ["M"] });

meta.edit({
	name: "Play",
	combo: ["M", "P"],
	on: function (eve) {
		// TODO: We still need to add to meta API ability to change name.
		if (song.play) {
			console.log("song.now: ", song.now);
			music.stop();
			song.play = false;
		}
		music.stop();
		song.play = true;
		setTimeout(function () {
			song.now = wave($("#page").text()).play();
		}, 200);
	},
});

meta.edit({
	name: "Blur",
	combo: ["M", "B"],
	on: function (eve) {
		var on = meta.tap(),
			was = on.width();
		$(document).on("mousemove.tmp", function (eve) {
			var long = Math.mix(0, 3, eve.pageX / $("body").innerWidth());
			song.now.long(long);
		});
	},
	up: function () {
		$(document).off(".tmp");
	},
});

meta.edit({
	name: "Vary",
	combo: ["M", "V"],
	on: function (eve) {
		var on = meta.tap(),
			was = on.width();
		$(document).on("mousemove.tmp", function (eve) {
			var vary = Math.mix(0, 1, eve.pageX / $("body").innerWidth());
			song.now.vary(vary);
		});
	},
	up: function () {
		$(document).off(".tmp");
	},
});

meta.edit({
	name: "Shout",
	combo: ["M", "S"],

	on: function (eve) {
		var on = meta.tap(),
			was = on.width();
		$(document).on("mousemove.tmp", function (eve) {
			var loud = Math.mix(0, 1, eve.pageX / $("body").innerWidth());
			song.now.loud(loud);
		});
	},
	up: function () {
		$(document).off(".tmp");
	},
});
meta.edit({
	name: "Itch",
	combo: ["M", "I"],

	on: function (eve) {
		var on = meta.tap(),
			was = on.width();
		$(document).on("mousemove.tmp", function (eve) {
			var itch = Math.mix(0, 1, eve.pageX / $("body").innerWidth());
			song.now.itch(itch);
		});
	},
	up: function () {
		$(document).off(".tmp");
	},
});
$(document).on("keydown", function (eve) {
	music.play(String.fromCharCode(eve.which));
});
