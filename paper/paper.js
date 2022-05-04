$(function () {
	var page = {};
	page.geez = false;
	$("#content").on("keyup", function (e) {});
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
				// console.log("author, author is: ", author);
				page.render({ id: page.id, hash: page.hash }, "me");

				// Edit
				meta.edit({
					name: JOY.icon("pen-to-square", "solid", "E"),
					combo: ["E"],
					on: function () {
						$("#content").focus();
						$("#content").attr(
							"contenteditable",
							"true" == $("#content").attr("contenteditable")
								? false
								: true
						);
					},
					use: function () {},
					up: function () {},
				});
				meta.edit({
					name: JOY.icon("share", "solid", "S"),
					combo: ["S"],
					on: function () {
						navigator.clipboard.writeText(location.href);
					},
					use: function () {},
					up: function () {},
				});
				meta.edit({
					name: JOY.icon("home", "solid", "H"),
					combo: ["H"],
					on: function () {
						location.href = location.origin + "/";
					},
					use: function () {},
					up: function () {},
				});
				meta.edit({
					// name: JOY.icon("home", "solid", "H"),
					combo: [-1, "H"],
					on: function () {
						location.href = location.origin + "/";
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
			}, wait || 75);
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
		page.wait(async function (e) {
			var el = $(this);
			var data = el.html();
			await gun
				.user()
				.get("papers")
				.get(page.hash)
				.get(page.id)
				.get("content")
				.put(data);
			var when = gun
				.user()
				.get("papers")
				.get(page.hash)
				.get(page.id)
				.get("last");
			var now = new Date().toLocaleString();
			await gun
				.user()
				.get("papers")
				.get(page.hash)
				.get(page.id)
				.get("last")
				.put(now);
			console.log(when);
			$("#last").text(now);
		}, 75)
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
			on: function (e) {
				m.list(this, true);
				// console.log(m.list);
			},
			back: meta.edit,
		})
	); // -1 is key for typing.
	meta.text.it[-1] = meta.text.it;
	document.execCommand("defaultParagraphSeparator", false, "p");

	// Exit to home
	meta.edit({
		combo: [27],
		on: function () {
			location.href = "/";
		},
	});

	// Font size
	meta.edit({
		name: JOY.icon("font", "solid", "A"),
		combo: [-1, "A"],
		// fake: -1,
	});
	meta.edit({
		name: "Small",
		combo: [-1, "A", "S"],
		fake: -1,
		on: function (eve) {
			meta.text.editor("fontSize", 2);
		},
		up: function () {},
	});
	meta.edit({
		name: "Normal",
		combo: [-1, "A", "N"],
		fake: -1,
		on: function (eve) {
			meta.text.editor("fontSize", 5);
		},
		up: function () {},
	});
	meta.edit({
		name: "Header",
		combo: [-1, "A", "H"],
		fake: -1,
		on: function (eve) {
			meta.text.editor("fontSize", 6);
		},
		up: function () {},
	});
	meta.edit({
		name: "Title",
		combo: [-1, "A", "T"],
		fake: -1,
		on: function (eve) {
			meta.text.editor("fontSize", 7);
		},
		up: function () {},
	});

	// Strikethrough
	meta.edit({
		name: JOY.icon("strikethrough", "solid", "S"),
		combo: [-1, "S"],
		fake: -1,
		on: function (eve) {
			// meta.text.editor("strikethrough");
			var r = meta.text.range || monotype();
			meta.text.editor({
				tag: $("<strike>" + r + "</strike>"),
			});
		},
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
		up: function () {},
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
	// Blockquote

	// Links
	meta.edit({
		name: JOY.icon("link", "solid", "K"),
		combo: [-1, "K"],
		fake: -1,
		on: function (eve) {
			var range = meta.text.range || monotype();
			meta.ask("Paste link...", function (url) {
				meta.text.editor({
					tag: $('<a href="' + url + '">link</a>'),
					edit: url ? "createLink" : "unlink",
					as: url,
					range: range,
				});
			});
		},
	});
	mediaQuery = window.matchMedia("only screen and (max-width: 600px)");
	// Show only on desktop
	if (!mediaQuery.matches) {
		// Aligh

		meta.edit({
			name: JOY.icon("square", "solid", "G"),
			combo: [-1, "G"],
		});
		meta.edit({
			name: JOY.icon("align-left", "solid", "L"),
			combo: [-1, "G", "L"],
			fake: -1,
			on: function (eve) {
				meta.text.editor("justifyLeft");
			},
			up: function () {
				this.edit.fake = -1;
			},
		});
		meta.edit({
			name: JOY.icon("align-right", "solid", "R"),
			combo: [-1, "G", "R"],
			// fake: -1,
			on: function (eve) {
				meta.text.editor("justifyRight");
			},
			up: function () {
				this.edit.fake = -1;
			},
		});

		meta.edit({
			name: JOY.icon("align-center", "solid", "M"),
			combo: [-1, "G", "M"],
			// fake: -1,
			on: function (eve) {
				meta.text.editor("justifyCenter");
			},
			up: function () {
				this.edit.fake = -1;
			},
		});
		meta.edit({
			name: JOY.icon("align-justify", "solid", "J"),
			combo: [-1, "G", "J"],
			// fake: -1,
			on: function (eve) {
				meta.text.editor("justifyFull");
			},
			up: function () {
				this.edit.fake = -1;
			},
		});
		// Superscript
		meta.edit({
			combo: [-1, 54],
			fake: -1,
			on: function (eve) {
				meta.text.editor("superscript");
			},
			up: function () {},
		});
		// Subscript
		meta.edit({
			combo: [-1, 53],
			fake: -1,
			on: function (eve) {
				meta.text.editor("subscript");
			},
			up: function () {},
		});
		// Indent
		meta.edit({
			combo: [-1, 221],
			fake: -1,
			on: function (eve) {
				meta.text.editor("indent");
			},
			up: function () {},
		});
		// Outdent
		meta.edit({
			combo: [-1, 160],
			fake: -1,
			on: function (eve) {
				meta.text.editor("outdent");
			},
			up: function () {},
		});
		// Lists
		meta.edit({
			name: JOY.icon("list-ul", "solid", "-"),
			combo: [-1, 189],
			// fake: -1,
			on: function (eve) {
				console.log(eve);
				meta.text.editor("insertunorderedlist");
			},
			up: function () {
				this.edit.fake = -1;
			},
		});
		meta.edit({
			name: JOY.icon("list-ol", "solid", "0"),
			combo: [-1, 48],
			on: function (eve) {
				console.log("list-ol");
				meta.text.editor("insertorderedlist");
			},
			up: function () {
				this.edit.fake = -1;
			},
		});
		meta.edit({
			name: JOY.icon("photo-film", "solid", "X"),
			combo: [-1, "X"],
		});
		// Images
		meta.edit({
			name: JOY.icon("image", "solid", "I"),
			combo: [-1, "X", "I"],
			fake: -1,
			on: function (eve) {
				var range = meta.text.range || monotype();
				meta.ask("Paste link...", function (url) {
					meta.text.editor({
						tag: $(
							'<img class="center" src="' + url + '" /><br />'
						),
						range: range,
						as: url,
					});
				});
			},
		});

		meta.edit({
			name: JOY.icon("video", "solid", "V"),
			combo: [-1, "X", "V"],
			fake: -1,
			on: function (eve) {
				var range = meta.text.range || monotype();
				meta.ask("Paste link...", function (url) {
					console.log(url);
					let r =
						/(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
					var id = url.match(r)[1];
					console.log(id);
					meta.text.editor({
						tag: $(
							`<section class='video'>
							<iframe width="560" height="315" src="https://www.youtube.com/embed/${id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
							</iframe>
						</section>`
						),
						range: range || id,
						as: id,
					});
				});
			},
		});
	}
	// Code
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
