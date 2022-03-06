$(function () {
	function check(hash) {
		if (location.hash === "#" + hash) {
			return;
		}
	}
	function load(src, cb) {
		var s = document.createElement("script");
		s.src = src;
		s.async = true;
		s.onload = cb;
		document.body.appendChild(s);
	}
	if (!JOY.key()) {
		return;
	}
	function showPage(k, d) {
		as.route("page");
		$("#hash").text(k);
		console.log("Showing page", k);
		console.log("Showing data", d);
		$("#content").html(d);
	}
	var pages = gun.user().get("pages");
	pages.map().once(async function (d, k) {
		$("#pages").each(function (i) {
			if (!$(this).children("div[data-key=" + k + "]").length != 0) {
				$("#pages").append(
					$(
						"<div class='pg act left rim gap max tint unit center sap-sm'>"
					)
						.attr("data-key", k)
						.html(d)
				);

				$('.pg[data-key="' + k + '"]').on("click", function () {
					console.log("Clicked page", k);
					showPage(k, d);
				});
			}
		});
	});
	console.log("HOME: ", location.href);
	meta.edit({
		combo: ["C"],
		on: async function (e) {
			// cosole.log()
			var key = localStorage.getItem("user-key");
			// Copy to clipboard
			if (!key) return;
			navigator.clipboard.writeText(key);
		},
	});
	meta.edit({
		combo: [27],
		on: function () {
			check("home");
			as.route("home");
			load("./apps/home.js");
			location.reload();
		},
	});
	meta.edit({
		name: "Page",
		combo: ["P"],
		on: async function (e) {
			// cosole.log()
			check("page");

			var hash = $("#hash").text() || Gun.text.random(16);

			as.route("page");
			$("#hash").text(hash);
			load("./apps/page.js");
		},
	});
	meta.edit({
		combo: ["X"],
		on: async function (e) {
			localStorage.removeItem("user-key");
			gun.user().leave();
			location.reload();
			as.route("welcome");
		},
	});
});
