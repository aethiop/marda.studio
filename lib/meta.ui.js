(function () {
	try {
		/* UI */
		if (meta.css) {
			return;
		}

		var $m = $("<div>").attr("id", "meta");
		$m.append(
			$("<span class='menu-icon'>")
				.html(`<i class="fa-solid fa-circle-dot"></i>`)
				.addClass("meta-start")
		);

		$m.append($("<div>").addClass("meta-menu meta-none").append("<ul>"));
		$(document.body).append($m);
	} catch (e) {}
})();
