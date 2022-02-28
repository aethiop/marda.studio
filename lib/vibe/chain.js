// var Gun = typeof window !== "undefined" ? window.Gun : require("./gun");
// var SEA = typeof window !== "undefined" ? window.SEA : require("./gun/sea");
Gun.chain.generateCert = async function (who, where, path) {
	var user = this;
	var gun = user.back(-1);
	var pair = user._.sea;
	let certExists =
		who === "*" ? await user.get(path) : await user.get(path).get(who);
	if (certExists) return;
	let certificate = await SEA.certify(who, where, pair);
	if (who === "*") {
		user.get(path).put(certificate, ({ ok }) => {
			if (ok) console.log("Public Request Certificate created");
		});
	} else {
		user &&
			user
				.get(path)
				.get(who)
				.put(certificate, ({ ok }) => {
					if (ok)
						console.log("Friend Certificate created for: ", who);
					console.log("Friend Certificate: ", certificate);
				});
	}
};
Gun.chain.addFriend = async function (pub) {
	var user = this;
	var gun = user.back(-1);
	var pair = user._.sea;

	const cert = await gun.user(pub).get("certificates/notifications");
	gun.user(pub)
		.get("notifications")
		.set(
			user._.sea.pub,
			({ err }) => {
				if (err) {
					console.log("Error: ", err);
				} else {
					gun.user(pub)
						.get("notify")
						.get("enabled")
						.put(true, null, { opt: { cert } });
					user.generateCert(
						pub,
						{ "*": "friends" },
						"certificates/friends"
					);
					user.generateCert(
						pub,
						{ "*": "chats" },
						"certificates/chats"
					);

					console.log("Request sent");
				}
			},
			{ opt: { cert } }
		);
};

Gun.chain.acceptFriend = async function (pub) {
	var user = this;
	var myPub = user._.sea.pub;
	var gun = user.back(-1);
	user.generateCert(pub, [{ "*": "friends" }], "certificates/friends");

	user.generateCert(pub, { "*": "chats" }, "certificates/chats");
	console.log(
		"CER: ",
		await gun
			.get("~" + pub)
			.get("certificates/friends")
			.get(myPub)
	);
	const cert = await gun
		.get("~" + pub)
		.get("certificates/friends")
		.get(myPub);
	gun.user(pub)
		.get("friends")
		.set(
			myPub,
			({ ok }) => {
				if (ok) user.get("friends").set(pub);
			},
			{ opt: { cert } }
		);
};

Gun.chain.upload = function (b64, opt, cb) {
	const gun = this;
	var length = b64.length;
	opt = opt || { size: 1024 * 1024 };
	// info.id = Gun.text.random();
	splitAndUpload(b64, 0);

	async function splitAndUpload(b64, chunks) {
		chunks = chunks || 0;
		var b64String = b64.slice(0, opt.size);

		if (b64.length) {
			gun &&
				gun.get(chunks).put(b64String, ({ ok, err }) => {
					if (ok) {
						chunks++;
						splitAndUpload(b64.slice(opt.size), chunks);
					} else {
						splitAndUpload(b64, chunks);
					}
				});
			cb((1 - b64.length / length) * 100);
		} else {
			cb(100);
			return;
		}
	}
};

Gun.chain.download = async function (proof, size, cb) {
	const gun = this;

	async function loop(i, chunks) {
		i = i || 0;
		chunks = chunks || [];
		let currentProof = await SEA.work(chunks.join(""), null, null, {
			name: "SHA-256s",
		});
		if (proof === currentProof) {
			cb(100, chunks.join(""));
			return;
		}
		chunks[i] = await gun.get(i);
		if (chunks[i]) {
			cb((chunks.join("").length / size) * 100, null);
			loop(i + 1, chunks);
		}
	}
	loop();
};
