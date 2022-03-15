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
				return [
					`${window.location.origin}/gun`,
					// "https://marda.herokuapp.com/gun",
				];
			})());
	window.gun = window.gun || Gun(opt);
	$(".page").not(":first").hide();

	gun.on("auth", function (ack) {
		if (!ack.err) {
			// as.route("home");
			// as.route("home");
			// load("./apps/home.js");
			$(".page").hide();
			$("#app").show();

			JOY.profile();
			console.log(JOY.profile());
		} else {
		}
		// console.log($("#app").attr("name", ack.soul));
		console.log("Your namespace is publicly available at", ack.soul);
	});
	$(function () {
		var pasteKey = async function () {
			const text = await navigator.clipboard.readText();
			if (!text) return;
			JOY.auth(JSON.parse(text));
		};

		meta.edit({
			combo: ["V"],
			on: async function (e) {
				if (JOY.key()) {
					return;
				}
				pasteKey();
			},
		});
	});
	if (localStorage.getItem("user-key")) {
		var key = localStorage.getItem("user-key");
		JOY.auth(JSON.parse(key));
	}
});
