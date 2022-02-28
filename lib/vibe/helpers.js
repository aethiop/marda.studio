import { gun } from "./main.js";

export default {
	copyToClipboard: (text) => {
		console.log(text);
		return navigator.clipboard.writeText(text);
	},
	getUrlParameter: (sParam, sParams) => {
		var sPageURL = sParams || window.location.search.substring(1),
			sURLVariables = sPageURL.split("&"),
			sParameterName,
			i;
		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split("=");
			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined
					? true
					: decodeURIComponent(sParameterName[1]);
			}
		}
	},
	getUserFriendLink: (pub) => {
		return "http://localhost:3000/chatWith=" + pub;
	},
};
