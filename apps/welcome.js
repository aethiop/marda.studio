$(function () {
	if (JOY.key()) {
		return;
	}
	var pasteKey = async function () {
		const text = await navigator.clipboard.readText();
		if (!text) return;
		JOY.auth(JSON.parse(text));
	};

	meta.edit({
		combo: ["V"],
		on: async function (e) {
			console.log("Paste Key");
			pasteKey();
		},
	});
});
