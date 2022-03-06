(function () {
	try {
		/* UI */
		if (meta.css) {
			return;
		}
		var $m = $("<div>").attr("id", "meta");
		$m.append($("<span>").text("CTRL or ⌘").addClass("meta-start"));
		$m.append($("<div>").addClass("meta-menu meta-none").append("<ul>"));
		$(document.body).append($m);
		css({
			"#meta": {
				display: "block",
				position: "fixed",
				bottom: "1em",
				right: "2em",
				"font-size": "14pt",
				color: "#707070",
				"border-radius": "1em",
				"text-align": "center",
				"z-index": 999999,
				margin: 0,
				padding: 0,
				height: "2em",
				outline: "none",
				cursor: "pointer",
				overflow: "none",
				transition: "all 0.2s ease-in",
			},
			"#meta *": { outline: "none" },
			"#meta .meta-none": { display: "none" },
			"#meta span": { "line-height": "2em" },
			"#meta .meta-menu": {
				width: "12em",
				right: "-2em",
				bottom: "2.5em",
				overflow: "none",
				position: "absolute",
				"text-align": "right",
				// "min-height": "20em",
			},
			"#meta .meta-menu ul": {
				padding: "0 1em",
				"list-style-type": "none",
			},
			"#meta .meta-menu ul li": {
				display: "inline-block",
				// float: "right",
				padding: "0.5em 1em",
				"font-size": "14pt",
				"border-radius": "0.75em",
				"margin-top": "0.25em",
				// color: "white",
				cursor: "pointer",
			},
			"#meta .meta-menu ul li:hover": {
				background: "rgba(0,0,0,0.5)",
			},
			"#meta a": { color: "black" },
			"#meta:hover": { opacity: 1 },
			"#meta:hover .meta-menu": { display: "block" },
			"#meta .meta-menu ul:before": {
				content: "' '",
				display: "block",
				// height: "25vh",
			},
			"#meta .meta-start": {
				cursor: "pointer",
			},
		});
		function css(css) {
			var tmp = "";
			$.each(css, function (c, r) {
				tmp += c + " {\n";
				$.each(r, function (k, v) {
					tmp += "\t" + k + ": " + v + ";\n";
				});
				tmp += "}\n";
			});
			var tag = document.createElement("style");
			tag.innerHTML = tmp;
			document.body.appendChild(tag);
		}
	} catch (e) {}
})();
