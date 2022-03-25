$(function () {
	meta.edit({
		name: JOY.icon("file", "solid", "N"),
		combo: ["N"],
		on: async function (e) {
			location.href = location.origin + "/paper/";
		},
	});
	// meta.edit({
	// 	name: JOY.icon("calculator", "solid", "M"),
	// 	combo: ["M"],
	// 	on: async function (e) {
	// 		location.href = location.origin + "/math/";
	// 	},
	// });
});
