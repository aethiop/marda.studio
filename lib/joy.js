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

	joy.key = function () {
		return gun.user()._.sea;
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
					// "http://localhost:8765/gun",
					"https://marda.herokuapp.com/gun",
					"https://andromedastudio.herokuapp.com/gun",
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
					if ($("#papers").find(`[data-key="${key}"]`).length) return;
					var $content = $(data.content);
					var title =
						$content.find("#title").text() || `Untitled ${key}`;
					var url = `/paper/?paper=${key}#${hash}`;
					var last = data.last;
					var paper = $(
						`<div class="paper unit gap sap-sm act rim min left" data-key="${key}">
							<p class='sap-sm row unit'>
								<i class="fa-solid fa-file"></i>
								<span class="gap">${title}</span>
								</p>
								<small class=" surfacet">Last updated: ${last}</small>
						</div>`
					);
					paper.on("click", function (e) {
						e.preventDefault();
						window.location.href = url;
					});
					$("#papers").append(paper);
				});
		} else {
		}
	});

	if (localStorage.getItem("user-key")) {
		var key = localStorage.getItem("user-key");
		JOY.auth(JSON.parse(key));
	} else {
		JOY.auth(
			null,
			() => {
				var key = JOY.key();
				localStorage.setItem("user-key", JSON.stringify(key));
			},
			true
		);
	}
});
