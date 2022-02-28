import session from "./session.js";
import { gun } from "./main.js";
import helpers from "./helpers.js";
import vibe from "./vibe.js";
import { generateAvatarURL } from "./avatar.js";

var friends = (window.friends = {});

//Create a channel
function newFriend(pub, friendLink) {
	if (!pub || Object.prototype.hasOwnProperty.call(friends, pub)) {
		return;
	}

	const channel = new iris.Channel({
		gun,
		key: session.getKey(),
		chatLink: friendLink,
		participants: pub,
	});
	addFriend(channel);
}

//Add the channel to friends[pub]
function addFriend(channel) {
	var pub = channel.getId();
	var element = $(
		"<div class='user'><div class='row' style='width: auto; height: auto;'><img class='profile-avatar' alt='profile-avatar' style='width: auto; height: 75px; border:none;'><div class='row' style='width: 30%; height:auto;margin-left: 12px;'><div class='row' align='left'><p id='friend-username' style='color: #f2f2f2; font-family: Sansation-Bold; margin: 1.5rem; padding-left: 0.3rem;'></p></div><div class='row' align='left' style='margin-left: 12px;margin-right: -50px;margin-top: -24px;'><p>Status:   </p><i id='online-status' class='material-icons mx-2' aria-hidden='true'></i><p id='online-tag'></p></div></div></div></div>"
	);

	var callee = $(
		'<div id="vibe-avatar" class="row" style="width: auto; height: auto;"><img class="profile-avatar" alt="profile-avatar" style="width: auto; height: 75px; border:none;"></div>'
	);
	var callButton = $("#start-vibe");

	if (friends[pub]) {
		return;
	}
	friends[pub] = channel;
	element.attr("user-pub", pub);
	gun.user(pub)
		.get("profile")
		.get("username")
		.on(async (username) => {
			friends[pub].username = await username;
			element.find("#friend-username").text(friends[pub].username);
			element
				.find(".profile-avatar")
				.attr(
					"src",
					`https://vibatar.herokuapp.com/4.x/big-smile/png?seed=` +
						pub
				);
			console.log(friends[pub]);
		});

	gun.user(pub)
		.get("profile")
		.get("avatar")
		.on(async (profileAvatar) => {
			console.log("PROFILE AVATAR: ", profileAvatar);
			friends[pub].avatar = await profileAvatar;

			console.log(profileAvatar);
		});

	// gun.user(pub)
	// 	.get("profile")
	// 	.get("watching")
	// 	.on(async (videoId) => {
	// 		friends[pub].watching = await videoId;
	// 		var title = "";
	// 		var url = "https://www.youtube.com/watch?v=" + videoId;
	// 		$.getJSON(
	// 			"https://noembed.com/embed",
	// 			{ format: "json", url: url },
	// 			function (data) {
	// 				title = data.title;
	// 				console.log(title);
	// 				console.log(data);
	// 				element
	// 					.find("#friend-username")
	// 					.text(
	// 						friends[pub].username +
	// 							" is watching" +
	// 							" -- " +
	// 							title
	// 					);
	// 			}
	// 		);
	// 	});

	friends[pub].online = {};
	friends[pub].put("call", null);

	iris.Channel.getOnline(gun, pub, (online) => {
		friends[pub].online = online;
		console.log();
		var status = friends[pub].online;
		if (status) {
			if (status.isOnline) {
			} else if (status.lastActive) {
				var d = new Date(status.lastActive);
				var lastSeenText = iris.util.getDaySeparatorText(
					d,
					d.toLocaleDateString({ dateStyle: "short" })
				);
				if (lastSeenText === "today") {
					lastSeenText = iris.util.formatTime(d);
				} else {
					lastSeenText = iris.util.formatDate(d);
				}
			}
			if (friends[pub].online.isOnline) {
				$("#online-status").css("color", "#67F286");
				$("#online-status").html("fiber_manual_record");
				$("#online-tag").text("Online");
			} else {
				$("#online-status").css("color", "#F96D6D");
				$("#online-status").html("fiber_manual_record");
				$("#online-tag").text("Offline");
			}
		}
	});
	$("#friend-list").append(element);
	$(".user").click(function () {
		var friend_pub = $(this).attr("user-pub");
		if ($(".callee").empty()) {
			callee.find("#friend-username").text(friends[friend_pub].username);
			callee
				.find(".profile-avatar")
				.attr("src", generateAvatarURL(friends[friend_pub].avatar));
			$(".callee").append(callee);
			if (friends[pub].online.isOnline) {
				callButton.prop("disabled", false);
				callButton.click(() => vibe.callUser(friend_pub));
			}
		} else {
			$("#close_session").click(() => {
				$(".callee").remove(callee);
				callButton.prop("disabled", true);
			});
			$(".callee").remove(callee);
		}
	});

	friends[pub].onTheir("call", (call) => vibe.onCallMessage(pub, call));
}

//Listen for paste function and create channel
function onPasteFriendLink(event) {
	var val = $(event.target).val();
	if (val.length < 30) {
		return;
	}
	var s = val.split("?");
	if (s.length !== 2) {
		return;
	}
	var friendId =
		helpers.getUrlParameter("chatWith", s[1]) ||
		helpers.getUrlParameter("chatWith", s[1]);

	if (friendId) {
		newFriend(friendId, val);
	}
	console.log("Successfully shared");
	$(event.target).val("");
}

function init() {
	$("#friend-url").on("input", onPasteFriendLink);
	var [my_xSlider, my_ySlider, my_zSlider] = [
		$(".my-xcon-slider"),
		$(".my-ycon-slider"),
		$(".my-zcon-slider"),
	];
	var [my_xPos_view, my_yPos_view, my_zPos_view] = [
		$("#my-xpos-value"),
		$("#my-ypos-value"),
		$("#my-zpos-value"),
	];

	var [my_xPos_value, my_yPos_value, my_zPos_value] = [
		$("<p></p>"),
		$("<p></p>"),
		$("<p></p>"),
	];

	my_xPos_value.text(my_xSlider.val());
	my_yPos_value.text(my_ySlider.val());
	my_zPos_value.text(my_zSlider.val());
	my_xPos_view.append(my_xPos_value);
	my_yPos_view.append(my_yPos_value);
	my_zPos_view.append(my_zPos_value);
	my_xSlider.on("input", function () {
		my_xPos_view.css("left", my_xSlider.val() * 5 + "%");
		my_xPos_value.text(my_xSlider.val());
	});
	my_ySlider.on("input", function () {
		my_yPos_view.css("left", my_ySlider.val() * 5 + "%");
		my_yPos_value.text(my_ySlider.val());
	});
	my_zSlider.on("input", function () {
		my_zPos_view.css("left", my_zSlider.val() * 5 + "%");
		my_zPos_value.text(my_zSlider.val());
	});

	var [friend_xSlider, friend_ySlider, friend_zSlider] = [
		$(".friend-xcon-slider"),
		$(".friend-ycon-slider"),
		$(".friend-zcon-slider"),
	];
	var [friend_xPos_view, friend_yPos_view, friend_zPos_view] = [
		$("#friend-xpos-value"),
		$("#friend-ypos-value"),
		$("#friend-zpos-value"),
	];

	var [friend_xPos_value, friend_yPos_value, friend_zPos_value] = [
		$("<p></p>"),
		$("<p></p>"),
		$("<p></p>"),
	];

	friend_xPos_value.text(friend_xSlider.val());
	friend_yPos_value.text(friend_ySlider.val());
	friend_zPos_value.text(friend_zSlider.val());
	friend_xPos_view.append(friend_xPos_value);
	friend_yPos_view.append(friend_yPos_value);
	friend_zPos_view.append(friend_zPos_value);
	friend_xSlider.on("input", function () {
		friend_xPos_view.css("left", friend_xSlider.val() * 5 + "%");
		friend_xPos_value.text(friend_xSlider.val());
	});
	friend_ySlider.on("input", function () {
		friend_yPos_view.css("left", friend_ySlider.val() * 5 + "%");
		friend_yPos_value.text(friend_ySlider.val());
	});
	friend_zSlider.on("input", function () {
		friend_zPos_view.css("left", friend_zSlider.val() * 5 + "%");
		friend_zPos_value.text(friend_zSlider.val());
	});

	var [tv_xSlider, tv_ySlider, tv_zSlider] = [
		$(".tv-xcon-slider"),
		$(".tv-ycon-slider"),
		$(".tv-zcon-slider"),
	];
	var [tv_xPos_view, tv_yPos_view, tv_zPos_view] = [
		$("#tv-xpos-value"),
		$("#tv-ypos-value"),
		$("#tv-zpos-value"),
	];

	var [tv_xPos_value, tv_yPos_value, tv_zPos_value] = [
		$("<p></p>"),
		$("<p></p>"),
		$("<p></p>"),
	];

	tv_xPos_value.text(tv_xSlider.val());
	tv_yPos_value.text(tv_ySlider.val());
	tv_zPos_value.text(tv_zSlider.val());
	tv_xPos_view.append(tv_xPos_value);
	tv_yPos_view.append(tv_yPos_value);
	tv_zPos_view.append(tv_zPos_value);
	tv_xSlider.on("input", function () {
		tv_xPos_view.css("left", tv_xSlider.val() * 5 + "%");
		tv_xPos_value.text(tv_xSlider.val());
	});
	tv_ySlider.on("input", function () {
		tv_yPos_view.css("left", tv_ySlider.val() * 5 + "%");
		tv_yPos_value.text(tv_ySlider.val());
	});
	tv_zSlider.on("input", function () {
		tv_zPos_view.css("left", tv_zSlider.val() * 5 + "%");
		tv_zPos_value.text(tv_zSlider.val());
	});
}

export { init, addFriend, newFriend, friends };
export default { init, addFriend, newFriend, friends };
