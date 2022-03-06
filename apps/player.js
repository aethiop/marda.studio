(function () {
	var p = $("#player");
	p.x = 50;
	p.y = 50;
	meta.p = p || {};
	meta.edit({
		// name: "Up",
		combo: ["W"],
		on: function () {
			console.log("up");
			this.to = this.to || setInterval(this.on, 60);
			$("html, body")
				.stop()
				.animate({ scrollTop: $(window).scrollTop() - 60 }, 60);
			p.css({ top: --p.y + "%" });
		},
		use: function () {},
		up: function () {
			clearTimeout(this.to);
			this.to = 0;
		},
	});
	meta.edit({
		// name: "Left",
		combo: ["A"],
		on: function () {
			console.log("left");
			this.to = this.to || setInterval(this.on, 60);
			p.css({ left: --p.x + "%" });
		},
		use: function () {},
		up: function () {
			clearTimeout(this.to);
			this.to = 0;
		},
	});
	meta.edit({
		// name: "Down",
		combo: ["S"],
		on: function on() {
			console.log("down");
			this.to = this.to || setInterval(this.on, 60);
			$("html, body")
				.stop()
				.animate({ scrollTop: $(window).scrollTop() + 60 }, 60);
			p.css({ top: ++p.y + "%" });
		},
		use: function () {},
		up: function () {
			clearTimeout(this.to);
			this.to = 0;
		},
	});
	meta.edit({
		// name: "Right",
		combo: ["D"],
		on: function () {
			console.log("right");
			this.to = this.to || setInterval(this.on, 60);
			p.css({ left: ++p.x + "%" });
		},
		use: function () {},
		up: function () {
			clearTimeout(this.to);
			this.to = 0;
		},
	});
	// meta.edit({
	// 	// name: "Jump",
	// 	combo: [32],
	// 	on: function () {
	// 		console.log("jump");
	// 	},
	// 	use: function () {},
	// 	up: function () {},
	// });
	// meta.edit({
	// 	// name: "Crouch",
	// 	combo: [16],
	// 	on: function () {
	// 		console.log("crouch");
	// 	},
	// 	use: function () {},
	// 	up: function () {},
	// });
	// meta.edit({
	// 	name: "Use",
	// 	combo: ["E"],
	// 	on: function () {
	// 		console.log("use");
	// 	},
	// 	use: function () {},
	// 	up: function () {},
	// });
	// meta.edit({
	// 	// name: "Fire",
	// 	combo: ["F"],
	// 	on: function () {
	// 		console.log("fire");
	// 	},
	// 	use: function () {},
	// 	up: function () {},
	// });
	// meta.edit({
	// 	// name: "Switch",
	// 	combo: [9],
	// 	on: function () {
	// 		console.log("Switch");
	// 	},
	// 	use: function () {},
	// 	up: function () {},
	// });

	window.requestAnimationFrame = window.requestAnimationFrame || setTimeout;
	window.requestAnimationFrame(function frame() {
		window.requestAnimationFrame(frame, 16);
	}, 16);
})();
