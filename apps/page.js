$(function () {
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
		page.wait(function () {
			console.log("keyup");
			console.log(page.hash);
			// var hash = $("#hash").text();
			var el = $(this);
			var data = el.html();
			console.log(page.hash, data);
			// gun.user().get("pages").get().put(data);
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
	if (location.hash !== "#page") return;
	meta.key.wipe();
	meta.edit({
		name: "Edit",
		combo: ["E"],
		on: function () {
			$("#content").attr(
				"contenteditable",
				"true" == $("#content").attr("contenteditable") ? false : true
			);

			$("#content").focus();
		},
		use: function () {},
		up: function () {},
	});

	meta.edit({
		combo: [-1, 27],
		fake: -1,
		on: function () {
			$("#content").attr(
				"contenteditable",
				"true" == $("#content").attr("contenteditable") ? false : true
			);
			console.log($("#content").html());
		},
		use: function () {},
		up: function () {},
	});
	meta.edit({
		name: "Bold",
		combo: [-1, "B"],
		fake: -1,
		on: function (eve) {
			meta.text.editor("bold");
		},
		up: function () {
			console.log("Bold up");
		},
	});
	meta.edit({
		name: "Italic",
		combo: [-1, "I"],
		fake: -1,
		on: function (eve) {
			meta.text.editor("italic");
		},
		up: function () {},
	});
	meta.edit({
		combo: [-1, "U"],
		fake: -1,
		on: function (eve) {
			meta.text.editor("underline");
		},
		up: function () {},
	});
	meta.edit({
		name: "linK",
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
	// meta.edit({ name: "aliGn", combo: [-1, "G"] }); // MOVE TO ADVANCED MENu!
	meta.edit({
		name: "Left",
		combo: [-1, "G", "L"],
		fake: -1,
		on: function (eve) {
			meta.text.editor("justifyLeft");
		},
		up: function () {},
	});
	meta.edit({
		name: "Right",
		combo: [-1, "G", "R"],
		fake: -1,
		on: function (eve) {
			meta.text.editor("justifyRight");
		},
		up: function () {},
	});
	meta.edit({
		name: "Middle",
		combo: [-1, "G", "M"],
		fake: -1,
		on: function (eve) {
			meta.text.editor("justifyCenter");
		},
		up: function () {},
	});
	meta.edit({
		name: "Color",
		combo: [-1, "G", "C"],
		fake: -1,
		on: function (eve) {
			meta.ask("Color or Hex", function (color) {
				// if (!meta.text.editor("HiliteColor", false, colour)) {
				meta.text.editor("foreColor", color, false);
				// }
			});
		},
		up: function () {},
	});
	meta.edit({
		name: "Unordered List",
		combo: [-1, 32, "U"],
		fake: -1,
		on: function (eve) {
			// if (!meta.text.editor("HiliteColor", false, colour)) {
			meta.text.editor("insertUnorderedList");
		},
		up: function () {},
	});
	meta.edit({
		name: "Indent",
		combo: [-1, 32, "I"],
		fake: -1,
		on: function (eve) {
			// if (!meta.text.editor("HiliteColor", false, colour)) {
			meta.text.editor("indent");
		},
		up: function () {},
	});
	meta.edit({
		name: "Outdent",
		combo: [-1, 32, "O"],
		fake: -1,
		on: function (eve) {
			// if (!meta.text.editor("HiliteColor", false, colour)) {
			meta.text.editor("outdent");
		},
		up: function () {},
	});
	meta.edit({
		name: "Paragraph",
		combo: [-1, 32, "P"],
		fake: -1,
		on: function (eve) {
			// if (!meta.text.editor("HiliteColor", false, colour)) {
			meta.text.editor("insertParagraph");
		},
		up: function () {},
	});
	meta.edit({
		name: "Numbered List",
		combo: [-1, 32, "N"],
		fake: -1,
		on: function (eve) {
			// if (!meta.text.editor("HiliteColor", false, colour)) {
			meta.text.editor("insertOrderedList");
		},
		up: function () {},
	});
	meta.edit({
		name: "Hilight",
		combo: [-1, "G", "H"],
		fake: -1,
		on: function (eve) {
			meta.ask("Color or Hex", function (color) {
				// if (!meta.text.editor("HiliteColor", false, colour)) {
				meta.text.editor("backColor", color);
				// }
			});
		},
		up: function () {},
	});
	meta.edit({
		name: "Middle",
		combo: [-1, "G", "M"],
		fake: -1,
		on: function (eve) {
			meta.text.editor("justifyCenter");
		},
		up: function () {},
	});
	meta.edit({
		name: "Justify",
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
		name: "Size",
		combo: [-1, "S"],
	});
	meta.edit({
		name: "Small",
		combo: [-1, "S", "S"],
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
		combo: [-1, "S", "N"],
		fake: -1,
		on: function (eve) {
			meta.text.editor("fontSize", 5);
		},
		up: function () {},
	});
	meta.edit({
		name: "Header",
		combo: [-1, "S", "H"],
		fake: -1,
		on: function (eve) {
			meta.text.editor("fontSize", 6);
		},
		up: function () {},
	});
	meta.edit({
		name: "Title",
		combo: [-1, "S", "T"],
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
