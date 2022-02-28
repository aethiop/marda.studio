
var vibe = {};
function load(src, cb) {
	var script = document.createElement("script");
	script.onload = cb;
	script.src = src;
	document.head.appendChild(script);
}
vibe.initNotif = function () {
	if (vibe.key) {
		gun.user().generateCert(
			"*",
			[{"*": "notifications"}, {"*": "notify"}],
			"certificates/notifications"
		)
	}
}

vibe.getFriends = function(gun, pub) {
	const friends = gun.get("~" + pub).get("friends");
	let friendsArray = [];
	friends.map().once(async (friend) => {
		if (friendsArray.includes(friend)) return;
		friendsArray.push(friend);
	});
	return friendsArray;
};

vibe.auth = function () {
	$("#welcome").removeClass("model");
	meta.edit({ name: "Authenticate", combo: ["A"] });
	meta.edit({
		name: "U sername",
		combo: ["A", "U"],
		on: function () {
			meta.ask("Type your name", (name) => {
				vibe.create(name);
				$("#welcome").addClass("model");
			});
		},
	});
	meta.edit({
		name: "Paste key",
		combo: ["A", "P"],
		on: function () {
			navigator.clipboard.readText().then(
				key => {
					vibe.login(JSON.parse(key))
				}
			)
		},
	});
};
vibe.app = function () {
	load("./lib/editor.js")
	$("#page").removeClass("model");
	// meta.edit({ name: "F riends", combo: ["F"] });
	meta.edit({ name: "Settings", combo: ["S"], on: function () {
		$("#page").addClass("model")
		$("#settings").removeClass("model")
	} , up: function () {
		console.log(vibe.key)
		console.log("UP");

	}});
	meta.edit({
		name: "Logout",
		combo: ["S", "L"],
		on: function () {
			vibe.logout();
		}
	});
	meta.edit({
		name: "Copy key",
		combo: ["S", "C"],
		on: function () {
			navigator.clipboard.writeText(JSON.stringify(vibe.key));
		}
	});
	meta.edit({
		name: "Home",
		combo: ["S", "H"],
		on: function () {
			$("#settings").addClass("model")
			$("#vibe").removeClass("model")
			meta.check("down", "back")
		}
	})
};
vibe.login = function (k) {
	gun.user().auth(k);
	localStorage.setItem("user-key", JSON.stringify(k));
	vibe.key = k;
	gun.user()
		.get("profile")
		.get("name")
		.on(function (name) {
			vibe.username = name;
		});
	gun.user().get("profile").get("avatar").on(function(avatar){
		vibe.avatar = avatar
	})
	window.location.hash = "app";
};
//
// vibe.cert = async function (where, how, succ, code, cb) {
// 	let certExists = await gun.user().get("certificates").get(where).once();
// 	if (certExists) return;
// 	let certificate = await SEA.certify(
// 		["*"],
// 		[{"*": how}],
// 		vibe.key,
// 		null
// 	)
// 	gun.user().get("certificates").get(where).put(certificate, ({err}) => {
// 		if (err) return cb({err: err, code: code, success: undefined})
// 		else return cb({err: undefined, code: undefined, certificate, success: succ})
// 	})
// }
// vibe.certPub = async function (where, how, succ, code,  pub, cb) {
// 	let certExists = await gun.user().get("certificates").get(pub).get(where).once();
// 	if (certExists) return;
//
// 	let certificate = await SEA.certify(
// 		[pub],
// 		[{'*': how}],
// 		vibe.key,
// 		null);
//
// 	gun
//     .user()
//     .get("certificates")
//     .get(pub)
//     .get(where)
//     .put(certificate, ({ err }) => {
//       if (err)
//         return cb({
//           err: err,
//           code: code,
//           success: undefined,
//         });
//       else
//         return cb({
//           err: undefined,
//           code: undefined,
//           certificate,
//           success:
//             succ,
//         });
//     });
//
// vibe.addFriend = async function (pub, cb) {
// 	let where = "friend-request"
// 	let friendRequest = await gun.user().get("certificates").get(where)
// 	gun.user(pub).get("friend-request").set(gun.user().is.pub, ({err}) => {
// 		if (err) return cb({err: err, code: code, success: undefined});
//
// 	})
//
// }

vibe.create = function (n) {
	SEA.pair().then((k) => {
		vibe.login(k);
		gun.user().get("profile").get("name").put(n);
		gun.user().get("profile").get("avatar").put(vibe.createAvatar(k.pub))
		console.log("Profile Created");
	});
};
vibe.logout = function () {
	gun.user().leave();
	localStorage.removeItem("user-key");
	window.location.hash = "auth";
};
vibe.init = function () {
	var localKey = localStorage.getItem("user-key");
	if (localKey) {
		window.location.hash = "app";
		var key = JSON.parse(localKey);
		vibe.login(key);
		vibe.app();
		return;
	}
	window.location.hash = "auth";
	vibe.auth();
	vibe.initNotif();
	return;
};
vibe.createAvatar = function (seed) {
	return `https://avatars.dicebear.com/api/open-peeps/${seed}.svg`
}

// The front page should switch between screens
// Going to Friends will create a friends component which is a widget
//

window.onhashchange = function () {
	window.location.reload();
};
vibe.init();
