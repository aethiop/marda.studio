$(function () {
	meta.edit({
		name: JOY.icon("file", "solid", "N"),
		combo: ["N"],
		on: async function (e) {
			location.href = location.origin + "/paper/";
		},
	});

	meta.edit({
		name: JOY.icon("game", "solid", "G"),
		combo: ["G"],
		on: async function (e) {
			location.href = location.origin + "/game/";
		},
	});
});
