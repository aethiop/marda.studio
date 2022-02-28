(function () {
	$(document).on("click", "a, button", function (e) {
		var tmp = $(this).attr("href") || "";
		if (0 === tmp.indexOf("http")) {
			return;
		}
		e.preventDefault();
		r(tmp);
	});
	function r(href) {
		if (!href) {
			return;
		}
		if (href[0] == "#") {
			href = href.slice(1);
		}
		var h = href.split("/")[0];
		$(".page").hide();
		$("#" + h).show();
		if (r.on === h) {
			return;
		}
		location.hash = href;
		(r.page[h] || { on: function () {} }).on();
		r.on = h;
		return r;
	}
	r.page = function (h, cb) {
		r.page[h] = r.page[h] || { on: cb };
		return r;
	};

	window.onhashchange = function () {
		r(location.hash.slice(1));
	};
	$.JOY && ($.JOY.route = r);
	if (window.JOY) {
		JOY.route = r;
	} else {
		$.route = r;
	}
})();
(function () {
	$(function () {
		$(".page").not(":first").hide();
		$.route(location.hash.slice(1));
		$(
			(JOY.start =
				JOY.start ||
				function () {
					$.as(document, gun, null, JOY.opt);
				})
		);
	});
});
(function () {
	function load(src, cb) {
		var script = document.createElement("script");
		script.onload = cb;
		script.src = src;
		document.head.appendChild(script);
	}
	var joy = (window.JOY = function () {});
	joy.auth = function (k, cb, o) {
		if (!o) {
			o = cb;
			cb = 0;
		}
		if (o === true) {
			SEA.pair().then((key) => {
				JOY.auth(key);
				gun.user().get("profile").get("name").put(k);
				if (cb) {
					cb(k);
				}
			});
			return;
		}
		var k = k || JOY.key;
		gun.user().auth(k, cb, o);
	};

	var opt = (joy.opt = window.CONFIG || {}),
		peers;
	$("link[type=peer]").each(function () {
		console.log("peer", this.href);
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
				return ["http://localhost:8765/gun"];
			})());
	window.gun = window.gun || Gun(opt);
	if (localStorage.getItem("user-key")) {
		var key = localStorage.getItem("user-key");
		console.log(key);
		joy.auth(JSON.parse(key));
		$.route("home");
	}
	$.route("welcome");
	gun.on("auth", function (ack) {
		if (ack.err) {
			$.route("welcome");
			return;
		}
		localStorage.setItem("user-key", JSON.stringify(ack.sea));
		$.route("page");
		load("./gun/lib/meta.js");
		load("./lib/meta.ui.js");
		load("./apps/editor.js");
		JOY.pub = ack.soul;
		console.log("Your namespace is publicly available at", ack.soul);
	});
	$("#get-started").on("submit", function () {
		if (!username) {
			return;
		}
		joy.auth(username, true);
		window.location.href = window.location.origin;
		$.route("page");
		return false;
	});
})();
