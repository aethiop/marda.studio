$(function () {
	var avatar = {
		type: "big-smile",
		url: `https://vibatar.herokuapp.com/api/${this.type}/${this.seed}`,
		seed: "",
	};
	var joy = (window.JOY = function () {});
	joy.key = function () {
		return gun.user()._.sea;
	};
	joy.auth = function (k, cb, o) {
		if (!o) {
			o = cb;
			cb = 0;
		}
		if (o === true) {
			SEA.pair().then((key) => {
				JOY.auth(key);

				gun.user().get("profile").get("name").put(k);
				gun.user()
					.get("profile")
					.get("avatar")
					.put(
						`https://vibatar.herokuapp.com/api/open-peeps/${key.pub}.svg`
					);
				//
				// gun.user().get("profile").get("name").put(k);
				if (cb) {
					cb(k);
				}
			});
			return;
		}
		var k = k || joy.key();
		localStorage.setItem("user-key", JSON.stringify(k));
		gun.user().auth(k, cb, o);
	};
	joy.include = function (id, filename, status) {
		if (status == "on") {
			var head = document.getElementsByTagName("head")[0];

			script = document.createElement("script");
			script.src = filename;
			script.type = "text/javascript";
			script.id = id;

			head.appendChild(script);
		} else {
			(elem = document.getElementById(id)).parentNode.removeChild(elem);
		}
	};

	joy.profile = function (cb) {
		var user = gun.user();
		user.get("profile")
			.get("name")
			.on(function (name) {
				var username = $(".username");
				username.text(name);
				cb && cb(name);
			});
		user.get("profile")
			.get("avatar")
			.on(function (a) {
				var avatar = $(".avatar");
				avatar.attr("src", a);
				cb && cb(name);
			});
	};
	var opt = (joy.opt = window.CONFIG || {}),
		peers;
	$("link[type=peer]").each(function () {
		(peers || (peers = [])).push($(this).attr("href"));
	});
	!window.gun &&
		(opt.peers =
			opt.peers ||
			peers ||
			(function () {
				(console.warn || console.log)(
					"Warning: No peer provided, defaulting to DEMO peer. Do not run in production, or your data will be regularly wiped, reset, or deleted. For more info, check https://github.com/eraeco/joydb#peers !"
				);
				return ["https://marda.herokuapp.com/gun"];
			})());
	window.gun = window.gun || Gun(opt);
	if (localStorage.getItem("user-key")) {
		var key = localStorage.getItem("user-key");
		JOY.auth(JSON.parse(key));
	}
	$(function () {
		$(".page").not(":first").hide();
		$.as.route(location.hash.slice(1));
		console.log("JOY STARTED");
		$(
			(JOY.start =
				JOY.start ||
				function () {
					$.as(document, gun, null, JOY.opt);
				})
		);

		if ($("body").attr("peers")) {
			(console.warn || console.log)(
				'Warning: Please upgrade <body peers=""> to https://github.com/eraeco/joydb#peers !'
			);
		}
	});
	as.route("welcome");
	gun.on("auth", function (ack) {
		if (!ack.err) {
			as.route("home");
			// as.route("home");
			load("./apps/home.js");
			// $("#welcome").addClass("model");
			JOY.profile();
			console.log(JOY.profile());
		}
		console.log($("#app").attr("name", ack.soul));
		console.log("Your namespace is publicly available at", ack.soul);
	});
});
(window.onhashchange = function () {
	var file = (location.hash || "").slice(1);
	var [where, what] = file.split("?");
	if (file && where) {
		console.log("Routing to", where, what);
		// $.as.route(where);
	}
	var S = +new Date();
	if (where !== "page") {
		return;
	}
})();
