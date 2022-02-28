(function () {
	try {
		/* UI */
		if (meta.css) {
			return;
		}
		var $m = $("<div>").attr("id", "meta");
		$m.append($("<span>").text("+").addClass("meta-start"));
		$m.append($("<div>").addClass("meta-menu meta-none").append("<ul>"));
		$(document.body).append($m);
		css({
			"#meta": {
				display: "block",
				position: "fixed",
				bottom: "2em",
				right: "2em",
				"font-size": "18pt",
				"font-family": "Tahoma, arial",
				"border-radius": "1em",
				"text-align": "center",
				"z-index": 999999,
				margin: 0,
				padding: 0,
				width: "2em",
				height: "2em",
				outline: "none",
				overflow: "none",
				transition: "all 0.2s ease-in",
			},
			"#meta *": { outline: "none" },
			"#meta .meta-none": { display: "none" },
			"#meta span": { "line-height": "2em" },
			"#meta .meta-menu": {
				width: "12em",
				right: "-2em",
				bottom: "-2em",
				overflow: "none",
				position: "absolute",
				"text-align": "right",
				"min-height": "20em",
				height: "100vh",
			},
			"#meta .meta-menu ul": {
				padding: 0,
				margin: "1em 1em 2em 0",
				"list-style-type": "none",
			},
			"#meta .meta-menu ul li": {
				display: "block",
				float: "right",
				padding: "0.5em 1em",
				"border-radius": "1.5em",
				"margin-left": "0.25em",
				"margin-top": "0.25em",
				background: "rgba(0,0,0,0.2)",
				"backdrop-filter": "blur(10px)",
				color: "white",
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
				"min-height": "10em",
				height: "25vh",
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
