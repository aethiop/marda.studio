window.onYouTubeIframeAPIReady = function onYouTubeIframeAPIReady() {
	console.log("YOUTUBE LOADED");

	window.player = new YT.Player("player", {
		height: "315",
		width: "590",
		videoId: "WdBQ7q9z7rE",
		playerVars: { autoplay: 0, controls: 1, rel: 0 },
		events: {
			onReady: onPlayerReady,
			onStateChange: onPlayerStateChange,
		},
	});
};

// 4. The API will call this function when the video player is ready.
window.onPlayerReady = function onPlayerReady(event) {
	console.log("PRINT");
};

var done = false;
window.onPlayerStateChange = function onPlayerStateChange(event) {
	gun.user().get("profile").get("status").put(event.data);
};
