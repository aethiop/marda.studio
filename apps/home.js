$(function () {
	// pages.map().once(async function (d, k) {
	// 	$("#pages").each(function (i) {
	// 		if (!$(this).children("div[data-key=" + k + "]").length != 0) {
	// 			$("#pages").append(
	// 				$(
	// 					"<div class='pg act left rim gap max tint unit center sap-sm'>"
	// 				)
	// 					.attr("data-key", k)
	// 					.html(d)
	// 			);

	// 			$('.pg[data-key="' + k + '"]').on("click", function () {
	// 				console.log("Clicked page", k);
	// 				showPage(k, d);
	// 			});
	// 		}
	// 	});
	// });
	(function () {
		$(document).on("click", function () {
			var tmp = $(".meta-on");
			if (!tmp.length) {
				return;
			}
			tmp.removeClass("meta-on");
		});

		meta.edit({
			combo: [39], // right
			on: function (eve) {
				var on = $(".pg").removeClass("meta-on");
				on = on.next().or(on);
				on.addClass("meta-on");
			},
			up: function () {},
		});
		meta.edit({
			combo: [37], // right
			on: function (eve) {
				var on = $(".pg").removeClass("meta-on");
				on = on.prev().or(on);
				on.addClass("meta-on");
			},
			up: function () {},
		});
	})();
	meta.edit({
		combo: ["C"],
		on: async function (e) {
			if (!JOY.key()) {
				return;
			}
			var key = JSON.stringify(JOY.key());
			console.log("Copied", key);
			navigator.clipboard.writeText(key);
		},
	});

	meta.edit({
		combo: ["P"],
		on: async function (e) {
			// cosole.log()
			window.location.href = location.origin + "/paper";
			// load("./apps/page.js");
		},
	});
	meta.edit({
		combo: ["X"],
		on: async function (e) {
			if (!JOY.key()) {
				return;
			}
			localStorage.removeItem("user-key");
			gun.user().leave();
			location.reload();
		},
	});
});
