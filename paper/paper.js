$(function () {
	var page = {};

	page.render = async (obj, who) => {
		if (who == "me") {
			var mine = await gun.user().get("papers").get(obj.hash).get(obj.id);
			mine?.content && $("#content").html(mine.content);
		} else {
			gun.get("~" + obj.author)
				.get("papers")
				.get(obj.hash)
				.get(obj.id)
				.on((d) => {
					$("#content").html(d.content);
				});
		}
	};

	page.start = async function () {
		if (window.location.search) {
			page.id = new URLSearchParams(window.location.search).get("paper");
			page.hash = window.location.hash.slice(1);
			var author = await gun.get("marda.studio#").get(page.hash);
			var key = JOY.key();
			if (author === key.pub) {
				//
				console.log("author, author is: ", author);
				page.render({ id: page.id, hash: page.hash }, "me");
				// Show Keyboard shortcuts
				meta.edit({
					combo: [-1, 16],
					fake: -1,
					on: async function (e) {
						$(".key-none").toggle();
					},
				});

				// Show Keyboard shortcuts
				meta.edit({
					combo: [-1, "G", 16],
					fake: -1,
					on: async function (e) {
						$(".key-none").toggle();
					},
				});

				// Edit
				meta.edit({
					name: JOY.icon("pen-to-square", "solid", "E"),
					combo: ["E"],
					on: function () {
						$("#content").attr("contenteditable", true);
						if ($("#content").attr("contenteditable"))
							$("#content").focus();
					},
					use: function () {},
					up: function () {},
				});
			} else {
				console.log("reader, author is: ", author);
				page.render(
					{ id: page.id, hash: page.hash, author: author },
					"other"
				);
			}
		} else {
			page.key = JOY.key();
			page.id = SEA.random(7).toString("hex");
			page.pass = SEA.random(11).toString("hex");
			page.hash = await SEA.work(page.key.pub, null, null, {
				name: "SHA-256",
			});
			var hash = gun.get(`marda.studio#`).get(page.hash);
			!(await hash) && hash.put(page.key.pub);
			hash.set(page.id);
			var url = `?paper=${page.id}#${page.hash}`;
			history.pushState({}, "", url);
			location.reload();
		}
	};

	page.start();
	page.wait = function (cb, wait, to) {
		return function (a, b, c) {
			var me = (page.typing = this);
			clearTimeout(to);
			to = setTimeout(function () {
				cb.call(me, a, b, c);
				page.typing = me = false;
			}, wait || 200);
		};
	};
	var monotype =
		window.monotype ||
		function () {
			console.log("monotype needed");
		};
	var m = meta;
	m.text = { zws: "&#8203;" };
	$(document).on("click", function () {
		var tmp = $(".meta-on");
		if (!tmp.length) {
			return;
		}
		tmp.removeClass("meta-on");
	});

	m.text.on = function (eve) {
		var tmp;
		if ($((eve || {}).target).closest("#meta").length) {
			return;
		}

		m.text.range = null;
		if (!(m.text.copy() || "").trim()) {
			m.flip(false);
			m.list(m.text.it);
			return;
		}
		m.text.range = monotype((eve || {}).target);
	};
	m.text.copy = function (tmp) {
		return (
			((tmp = window.getSelection) && tmp().toString()) ||
			((tmp = document.selection) && tmp.createRange().text) ||
			""
		);
	};
	$(document).on(
		"select contextmenu keyup mouseup",
		"[contenteditable=true]",
		m.text.on
	);
	$(document).on(
		"keyup",
		"[contenteditable]",
		page.wait(async function () {
			// var hash = $("#hash").text();
			var el = $(this);
			var data = el.html();
			console.log(data);
			console.log(page.id, page.hash);

			// var hash = await SEA.work(JOY.key().pub, null, null, {
			// var what = await SEA.encrypt(data, page.pass);
			await gun
				.user()
				.get("papers")
				.get(page.hash)
				.get(page.id)
				.get("content")
				.put(data);
			var when = new Date().toUTCString();
			await gun
				.user()
				.get("papers")
				.get(page.hash)
				.get(page.id)
				.get("last")
				.put(when);
		}, 100)
	);
	m.text.editor = function (opt, as) {
		var tmp;
		if (!opt) {
			return;
		}
		opt =
			typeof opt == "string"
				? { edit: opt }
				: opt.tag
				? opt
				: { tag: opt };
		var r = (opt.range = opt.range || m.text.range || monotype()),
			cmd = opt.edit;
		as = opt.as = opt.as || as;
		if (cmd && document.execCommand) {
			r.restore();
			if (document.execCommand(cmd, null, as || null)) {
				if (m.text.range) {
					m.text.range = monotype();
				}
				return;
			}
		}
		if (!opt.tag) {
			return;
		}
		opt.tag = $(opt.tag);
		opt.name = opt.name || opt.tag.prop("tagName");
		if ((tmp = $(r.get()).closest(opt.name)).length) {
			if (r.s === r.e) {
				tmp.after(m.text.zws);
				r = r.select(monotype.next(tmp[0]), 1);
			} else {
				tmp.contents().unwrap(opt.name);
			}
		} else if (r.s === r.e) {
			r.insert(opt.tag);
			r = r.select(opt.tag);
		} else {
			r.wrap(opt.tag);
		}
		r.restore();
		opt.range = null;
		if (m.text.range) {
			m.text.range = monotype();
		}
	};
	meta.edit(
		(meta.text.it = {
			combo: [-1],
			on: function () {
				m.list(this, true);
				// console.log(m.list);
			},
			back: meta.edit,
		})
	); // -1 is key for typing.
	meta.text.it[-1] = meta.text.it;
	document.execCommand("defaultParagraphSeparator", false, "p");
	// Show Keyboard shortcuts
	meta.edit({
		combo: [16],
		on: async function (e) {
			$(".key-none").toggle();
		},
	});

	// Exit to home
	meta.edit({
		name: JOY.icon("home", "solid", "ESC"),
		combo: [27],
		on: function () {
			location.href = "/";
		},
		use: function () {},
		up: function () {},
	});

	// Quit editing
	meta.edit({
		name: JOY.icon("arrow-right-to-bracket", "solid", "Q"),
		combo: [-1, "Q"],
		fake: -1,
		on: function (e) {
			e.preventDefault();

			$("#content").attr("contenteditable", "false");
			console.log($("#content").html());
		},
		use: function () {},
		up: function () {},
	});

	// Bold
	meta.edit({
		name: JOY.icon("bold", "solid", "B"),
		combo: [-1, "B"],
		fake: -1,
		on: function (eve) {
			meta.text.editor("bold");
		},
		up: function () {
			console.log("Bold up");
		},
	});

	// Italic
	meta.edit({
		name: JOY.icon("italic", "solid", "I"),
		combo: [-1, "I"],
		fake: -1,
		on: function (eve) {
			meta.text.editor("italic");
		},
		up: function () {},
	});

	// Strikethrough
	meta.edit({
		name: JOY.icon("strikethrough", "solid", "S"),
		combo: [-1, "S"],
		fake: -1,
		on: function (eve) {
			meta.text.editor("strikethrough");
		},
		up: function () {},
	});

	// Link
	meta.edit({
		name: JOY.icon("link", "solid", "K"),
		combo: [-1, "K"],
		fake: -1,
		on: function (eve) {
			var range = meta.text.range || monotype();
			meta.ask("Paste or type link...", function (url) {
				meta.text.editor({
					tag: $('<a href="' + url + '">link</a>'),
					edit: url ? "createLink" : "unlink",
					as: url,
					range: range,
				});
			});
		},
	});
	// Show Align Menu
	// meta.edit({ name: "aliGn", combo: [-1, "A"] }); // MOVE TO ADVANCED MENu!

	// meta.edit({
	// 	name: JOY.icon("eye-dropper", "solid", "C"),
	// 	combo: [-1, "A", "C"],
	// 	fake: -1,
	// 	on: function (eve) {
	// 		meta.ask("Color or Hex", function (color) {
	// 			// if (!meta.text.editor("HiliteColor", false, colour)) {
	// 			meta.text.editor("foreColor", color, false);
	// 			// }
	// 		});
	// 	},
	// 	up: function () {},
	// });

	// Indentation menu
	// meta.edit({
	// 	name: JOY.icon("indent", "solid", "Tab"),
	// 	combo: [-1, ],
	// 	fake: -1,
	// 	on: function (eve) {
	// 		// if (!meta.text.editor("HiliteColor", false, colour)) {
	// 		meta.text.editor("indent");
	// 	},
	// 	up: function () {},
	// });
	// meta.edit({
	// 	name: JOY.icon("outdent", "solid", "O"),
	// 	combo: [-1, 16, 9],
	// 	fake: [-1, 16],
	// 	on: function (eve) {
	// 		// if (!meta.text.editor("HiliteColor", false, colour)) {
	// 		meta.text.editor("outdent");
	// 	},
	// 	up: function () {},
	// });

	// Space for paragraph

	meta.edit({
		combo: [-1, "U"],
		fake: -1,
		on: function (eve) {
			// if (!meta.text.editor("HiliteColor", false, colour)) {

			meta.text.editor("indent");
		},
		up: function () {},
	});

	meta.edit({
		combo: [-1, "Y"],
		fake: -1,
		on: function (eve) {
			// if (!meta.text.editor("HiliteColor", false, colour)) {

			meta.text.editor("outdent");
		},
		up: function () {},
	});
	meta.edit({
		name: JOY.icon("list-ul", "solid", "L"),
		combo: [-1, "L"],
		fake: -1,
		on: function (eve) {
			meta.text.editor("insertUnorderedList");
		},
		up: function () {},
	});
	meta.edit({
		name: JOY.icon("list-ol", "solid", "J"),
		combo: [-1, "J"],
		fake: -1,
		on: function (eve) {
			meta.text.editor("insertOrderedList");
		},
		up: function () {},
	});

	// meta.edit({
	// 	name: JOY.icon("highlighter", "solid", "C"),
	// 	combo: [-1, "C"],
	// 	fake: -1,
	// 	on: function (eve) {
	// 		meta.ask("Color or Hex", function (color) {
	// 			// if (!meta.text.editor("HiliteColor", false, colour)) {
	// 			meta.text.editor("backColor", color);
	// 			// }
	// 		});
	// 	},
	// 	up: function () {},
	// });

	// ADVANCED MENU
	meta.edit({
		name: JOY.icon("align-left", "solid", "L"),
		combo: [-1, "G", "L"],
		fake: -1,
		on: function (eve) {
			meta.text.editor("justifyLeft");
		},
		up: function () {},
	});
	meta.edit({
		name: JOY.icon("align-right", "solid", "R"),
		combo: [-1, "G", "R"],
		fake: -1,
		on: function (eve) {
			meta.text.editor("justifyRight");
		},
		up: function () {},
	});

	meta.edit({
		name: JOY.icon("align-center", "solid", "M"),
		combo: [-1, "G", "M"],
		fake: -1,
		on: function (eve) {
			meta.text.editor("justifyCenter");
		},
		up: function () {},
	});
	meta.edit({
		name: JOY.icon("align-justify", "solid", "J"),
		combo: [-1, "G", "J"],
		fake: -1,
		on: function (eve) {
			meta.text.editor("justifyFull");
		},
		up: function () {},
	});
	// Align Number
	// Align Points
	// Align Strike

	meta.edit({
		name: "Small",
		combo: [-1, "V", "S"],
		fake: -1,
		on: function (eve) {
			console.log("Small");
			console.log(eve);
			meta.text.editor("fontSize", 2);
		},
		up: function () {},
	});
	meta.edit({
		name: "Normal",
		combo: [-1, "V", "N"],
		fake: -1,
		on: function (eve) {
			meta.text.editor("fontSize", 5);
		},
		up: function () {},
	});
	meta.edit({
		name: "Header",
		combo: [-1, "V", "H"],
		fake: -1,
		on: function (eve) {
			meta.text.editor("fontSize", 6);
		},
		up: function () {},
	});
	meta.edit({
		name: "Title",
		combo: [-1, "V", "T"],
		fake: -1,
		on: function (eve) {
			meta.text.editor("fontSize", 7);
		},
		up: function () {},
	});
});

/*
	Edit
		Bold
		Italic
		Link
		?
			Left
			Middle
			Right
			Justify
		?
			Small
			Normal
			Header
			Title
	Design
		Add
			Row
			Column
			Text
			Delete
		Turn
		Grab
		Size
			X
			Y
		Fill
	Logic
		Symbol
		Action
		Data
*/
