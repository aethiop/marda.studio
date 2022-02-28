import session from "./session.js";
import { gun } from "./main.js";

const AVATAR = {
	topType: [
		"NoHair",
		"Eyepatch",
		"Hat",
		"Hijab",
		"Turban",
		"WinterHat1",
		"WinterHat2",
		"WinterHat3",
		"WinterHat4",
		"LongHairBigHair",
		"LongHairBob",
		"LongHairBun",
		"LongHairCurly",
		"LongHairCurvy",
		"LongHairDreads",
		"LongHairFrida",
		"LongHairFro",
		"LongHairFroBand",
		"LongHairNotTooLong",
		"LongHairShavedSides",
		"LongHairMiaWallace",
		"LongHairStraight",
		"LongHairStraight2",
		"LongHairStraightStrand",
		"ShortHairDreads01",
		"ShortHairDreads02",
		"ShortHairFrizzle",
		"ShortHairShaggyMullet",
		"ShortHairShortCurly",
		"ShortHairShortFlat",
		"ShortHairShortRound",
		"ShortHairShortWaved",
		"ShortHairSides",
		"ShortHairTheCaesar",
		"ShortHairTheCaesarSidePart",
	],

	accessoriesType: [
		"Blank",
		"Kurt",
		"Prescription01",
		"Prescription02",
		"Round",
		"Sunglasses",
		"Wayfarers",
	],

	hairColor: [
		"Auburn",
		"Black",
		"Blonde",
		"BlondeGolden",
		"Brown",
		"BrownDark",
		"PastelPink",
		"Platinum",
		"Red",
		"SilverGray",
	],

	facialHairType: [
		"Blank",
		"BeardMedium",
		"BeardLight",
		"BeardMagestic",
		"MoustacheFancy",
		"MoustacheMagnum",
	],

	clothType: [
		"BlazerShirt",
		"BlazerSweater",
		"CollarSweater",
		"GraphicShirt",
		"Hoodie",
		"Overall",
		"ShirtCrewNeck",
		"ShirtScoopNeck",
		"ShirtVNeck",
	],

	clothColor: [
		"Black",
		"Blue01",
		"Blue02",
		"Blue03",
		"Gray01",
		"Gray02",
		"Heather",
		"PastelBlue",
		"PastelGreen",
		"PastelRed",
		"PastelYellow",
		"Pink",
		"Red",
		"White",
	],

	eyeType: [
		"Close",
		"Cry",
		"Default",
		"Dizzy",
		"EyeRoll",
		"Happy",
		"Hearts",
		"Side",
		"Squint",
		"Surprised",
		"Wink",
		"WinkWacky",
	],

	eyebrowType: [
		"Angry",
		"AngryNatural",
		"Default",
		"DefaultNatural",
		"FlatNatural",
		"RaisedExcited",
		"RaisedExcitedNatural",
		"SadConcerned",
		"SadConcernedNatural",
		"UnibrowNatural",
		"UpDown",
		"UpDownNatural",
	],

	mouthType: [
		"Concerned",
		"Default",
		"Disbelief",
		"Eating",
		"Grimace",
		"Sad",
		"ScreamOpen",
		"Serious",
		"Smile",
		"Tongue",
		"Twinkle",
		"Vomit",
	],

	skinColor: [
		"Tanned",
		"Yellow",
		"Pale",
		"Light",
		"Brown",
		"DarkBrown",
		"Black",
	],
};
//Helper function

function getRandomAvatar() {
	var avatarData = {};
	Object.keys(AVATAR).forEach((attrib) => {
		var attribVals = Object.values(AVATAR[attrib]);
		avatarData[attrib] =
			attribVals[parseInt(Math.random() * attribVals.length)];
	});
	return avatarData;
}

function generateAvatarURL(avataaar = getRandomAvatar()) {
	var url = "https://avataaars.io/?avatarStyle=Transparent&";

	Object.keys(avataaar).forEach((k, i) => {
		url += k + "=" + avataaar[k];
		if (i != avataaar.length - 1) {
			url += "&";
		}
	});
	return url;
}

function init() {
	var container = $("<div>");
	var title;
	var selector;
	var option;
	var myAvatarData;
	gun.user()
		.get("profile")
		.get("avatar")
		.on((av) => {
			$("#avatar-edit").empty();
			delete av["_"];
			myAvatarData = av;
			Object.keys(AVATAR).forEach((k) => {
				title = $("<p>");
				selector = $(
					'<select class="custom-select mx-4" style="width: 100%;display: block;">'
				);

				var v = Object.values(AVATAR[k]);

				v.forEach((attr) => {
					option = $("<option>").attr("value", attr).text(attr);
					if (myAvatarData[k] == attr) {
						option.attr("selected", true);
					}
					option.appendTo(selector);
				});

				title.html(k);

				$("#avatar-edit").append(title).append(selector);
			});
		});
	// $("#avatar-edit").find("option").change(() => {
	//     var attribute = $(this).children().find("option:selected").attr("value");
	//     console.log($(this));
	// })
	$("#avatar-edit").on("change", "select", function (e) {
		var attr = $(e.target).prev().text();
		var val = $(e.target).find("option:selected").text(); //only time the find is required
		myAvatarData[attr] = val;
		gun.user().get("profile").get("avatar").put(myAvatarData);
	});
	//console.log(myAvatarData);
}

export default { init, getRandomAvatar, generateAvatarURL };
export { getRandomAvatar, generateAvatarURL };
