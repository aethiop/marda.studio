$(function () {
	$(function () {
		meta.edit({
			combo: [16],
			fake: 16,
			on: async function (e) {
				$(".key-none").removeClass("key-none");
			},
		});
	});
	var joy = (window.JOY = function () {});
	joy.paper = {};
	joy.getPapers = function (hash) {
		return new Promise((resolve, reject) => {
			gun.user()
				.get("papers")
				.get(hash)
				.then((val) => {
					if (val) {
						gun.user()
							.get("papers")
							.get(hash)
							.map()
							.once((data, key) => {
								joy.paper[key] = data;
							});
						console.log("getPapers", hash, joy.paper);
						resolve(joy.paper);
					} else {
						//No data found
						resolve({}); //Return empty object
					}
				});
		});
	};

	joy.key = function () {
		return gun.user()._.sea;
	};
	joy.quicktips = function (msg) {
		return `
		<div class=" unit col sap-sm stroke surfaces">
			<h2 class="center">Quick Commands</h2>
			<div class="sap-sm gap right">

				<p class="crack surfacet">Show / Hide Commands <span class="gap"><kbd>Ctrl</kbd> <span class="gap">or</span>
					<kbd>⌘</kbd></span></p>
				<p class="crack surfacet">Show Keyboard Shortcut<span class="gap"><kbd>Shift</kbd></span>
				<p class="crack surfacet">New Paper<span class="gap"><kbd>N</kbd></span>
				<p class="crack surfacet">Hold (Typing)<span class="gap"><kbd>Ctrl</kbd></span>
				</p>
			</div>
		</div>
		`;
	};
	joy.icon = function (name, type, kbd) {
		return `
		<div style='display:flex; flex-direction: row; align-items: center; justify-content: flex-end; gap: 0.75em;'>
			<p class='key-none'><kbd>${kbd}</kbd></p>
			<i class="fa-${type || "regular"} fa-${name}"></i>
		</div>`;
	};
	joy.auth = function (k, cb, o) {
		if (!o) {
			o = cb;
			cb = 0;
		}
		if (o === true) {
			SEA.pair().then((key) => {
				JOY.auth(key);
				// gun.user().get("profile").get("name").put(k);
				// gun.user().get("profile").get("name").put(k);
				if (cb) {
					cb(k);
				}
			});
			return;
		}
		var k = k || joy.key();
		localStorage.setItem(k.pub, JSON.stringify(k));
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
					// "http://localhost:8765/gun",
					"https://marda.herokuapp.com/gun",
				];
			})());
	window.gun = window.gun || Gun(opt);

	gun.on("auth", async function (ack) {
		if (!ack.err) {
			var hash = await SEA.work(JOY.key().pub, null, null, {
				name: "SHA-256",
			});

			gun.user()
				.get("papers")
				.get(hash)
				.map()
				.once((data, key) => {
					$("#papers").removeClass("hide");
					console.log("map", data, key);
					console.log($("#papers").find(`[data-key="${key}"]`));
					if ($("#papers").find(`[data-key="${key}"]`).length) return;
					var title = data.title || `Untitled ${key}`;
					var url = `/paper/?paper=${key}#${hash}`;
					var paper = $(
						`<li class="unit rim left" data-key="${key} href=''">
							<a class='yak gap row left unit' href=${url}>
								<i class="fa-solid loud fa-circle-user unit left surfacet"></i>
								<span>
								<p class="unit right ">${title}</p></span>
							</a>
						</li>`
					);
					$("#papers").append(paper);
				});
		} else {
			console.log("Login Failed");
		}
		console.log("Your namespace is publicly available at", ack.soul);
		$(function () {
			if (JOY.paper) {
				console.log(JOY.paper);
			}
		});
	});

	if (localStorage.getItem("user-key")) {
		var key = localStorage.getItem("user-key");
		JOY.auth(JSON.parse(key));
	} else {
		console.log("NO ACCOUNT");
		JOY.auth(
			null,
			() => {
				var key = JOY.key();
				localStorage.setItem("user-key", JSON.stringify(key));
				console.log("ACCOUNT CREATED", key);
				console.log("SAVED TO LOCAL-STORATE");
			},
			true
		);
	}
});
