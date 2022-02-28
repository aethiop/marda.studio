import { friends } from "./friend.js";
import { gun } from "./main.js";
import session from "./session.js";
var ourIceCandidates;
var userMediaStream;
var localAudio = $(".localAudio");
var remoteAudio = $(".remoteAudio");
async function addStreamtoPeerConnection(pc) {
	var constraints = { audio: true, video: false };
	userMediaStream = await navigator.mediaDevices.getUserMedia(constraints);
	userMediaStream.getTracks().forEach((track) => {
		pc.addTrack(track, userMediaStream);
	});
	localAudio[0].srcObject = userMediaStream;
	localAudio[0].onloadedmetadata = function () {
		console.log(">>>>LOCAL AUDIO HERE<<<<<");
		localAudio[0].muted = true;
		localAudio[0].play();
	};
	localAudio.attr("disabled", true);
}
function showIncomingCall(pub) {
	if (!friends[pub].pc) {
		var answer_reject_btn = $(
			'<button class="mx-4" id="answer-vibe" type="btn"><i class="material-icons" aria-hidden="true">call</i> Answer</button><button id="reject-vibe" type="btn"><i class="material-icons" aria-hidden="true">call_end</i> Reject</button>'
		);
		$("#start-vibe").replaceWith(answer_reject_btn);
		var answer = $("#answer-vibe");
		var reject = $("#reject-vibe");
		answer.click(() => answerCall(pub));
		reject.click(() => rejectCall(pub));
	}
}

function showVibeVideo(pub) {
	gun.user(pub)
		.get("profile")
		.get("watching")
		.on((videoId) => {
			console.log("HERE IT IS", videoId);
			session.vibeYoutube(videoId);
		});
	gun.user(pub)
		.get("profile")
		.get("status")
		.on((status) => {
			if (status == 1 || status == 3) {
				window.player.playVideo();
			}
			if (status == 2) {
				window.player.pauseVideo();
			}
			if (status == -1 || status == 5) {
				window.player.stopVideo();
			}
			console.log(pub, "- is: ", status);
		});
}

function stopUserMedia() {
	userMediaStream.getTracks().forEach((track) => track.stop());
}

function onCallMessage(pub, call) {
	if (call.offer) {
		console.log("incomming call from ", pub, call);
		showIncomingCall(pub);
		showVibeVideo(pub);
	}
}

function cancelCall(pub) {
	friends[pub].put("call", null);
	friends[pub].pc = null;
}

function endCall(pub) {
	friends[pub].pc && friends[pub].pc.close();
	stopUserMedia(pub);
	friends[pub].put("call", null);
	friends[pub].pc = null;
	resetView();
}

function closeIncomingCall() {
	var start_vibe = $(
		'<button id="start-vibe" type="btn" disabled><i class="material-icons" aria-hidden="true">play_arrow</i> Start Vibe</button>'
	);
	$("#answer-vibe").remove();
	$("#reject-vibe").replaceWith(start_vibe);
}

function resetView() {
	var start_vibe = $(
		'<button id="start-vibe" type="btn" disabled><i class="material-icons" aria-hidden="true">play_arrow</i> Start Vibe</button>'
	);
	$(".callee").empty();
	$("#answer-vibe").remove();
	$("#reject-action").replaceWith(start_vibe);
}

function rejectCall(pub) {
	console.log("REJECTED");
	resetView();
	closeIncomingCall();
	friends[pub].pc && friends[pub].pc.close();
	friends[pub].put("call", null);
	friends[pub].pc = null;
}
async function answerCall(pub) {
	var end_vibe = $(
		'<button id="end-vibe" type="btn"><i class="material-icons" aria-hidden="true">call_end</i> End Vibe</button>'
	);

	$("#reject-vibe").remove();
	$("#answer-vibe").replaceWith(end_vibe);
	$("#end-vibe").click(() => endCall(pub));
	await initConnection(false, pub);
}
async function callUser(pub) {
	var end_vibe = $(
		'<button style="height:100%" id="end-vibe" type="btn"><i class="material-icons" aria-hidden="true">call_end</i> End Vibe</button>'
	);
	await initConnection(true, pub);
	console.log("Calling", pub);

	var call = () =>
		friends[pub].put("call", {
			time: new Date().toISOString(),
			type: "voice",
			offer: true,
		});
	call();
	$("#vibe-action").empty();
	$("#vibe-action").append(end_vibe);
	$("#end-vibe").click(() => endCall(pub));
}

function createResonanceScence(audioElement) {
	let audioContext = new AudioContext() || webkitAudioContext();
	let resonanceAudioScene = new ResonanceAudio(audioContext);

	resonanceAudioScene.output.connect(audioContext.destination);

	let roomDimensions = {
		width: 3.1,
		height: 2.5,
		depth: 3.4,
	};

	let roomMaterials = {
		// Room wall materials
		left: "brick-bare",
		right: "curtain-heavy",
		front: "marble",
		back: "glass-thin",
		// Room floor
		down: "grass",
		// Room ceiling
		up: "transparent",
	};
	console.log("Room Properties set");
	resonanceAudioScene.setRoomProperties(roomDimensions, roomMaterials);

	let audioElementSource = audioContext.createMediaStreamSource(audioElement);

	let source = resonanceAudioScene.createSource();
	audioElementSource.connect(source.input);

	//Position scene binaurally
	source.setPosition(-3, 0, 0);
	source.setMaxDistance(4);

	//Ear position
	resonanceAudioScene.setListenerPosition(0, 0, 0);

	console.log("audio is playing");
}

async function initConnection(createOffer, pub) {
	ourIceCandidates = {};
	const theirIceCandidateKeys = [];
	friends[pub].pc = new RTCPeerConnection({
		iceServers: [
			{ urls: ["stun:turn.hepic.tel"] },
			{ urls: ["stun:stun.l.google.com:19302"] },
		],
	});
	await addStreamtoPeerConnection(friends[pub].pc);
	async function createOfferFn() {
		try {
			if (friends[pub].isNegotiating) {
				return;
			}
			friends[pub].isNegotiating = true;
			var offer = await friends[pub].pc.createOffer();
			friends[pub].pc.setLocalDescription(offer);
			friends[pub].put("sdp", {
				time: new Date().toISOString(),
				data: offer,
			});
		} finally {
			friends[pub].isNegotiating = false;
		}
	}
	if (createOffer) {
		await createOfferFn();
	}

	friends[pub].onTheir("sdp", async (sdp) => {
		await friends[pub].pc.setRemoteDescription(
			new RTCSessionDescription(sdp.data)
		);
		console.log("got their sdp", sdp.data);
	});
	friends[pub].onTheir("icecandidates", (c) => {
		console.log("got their icecandidates", c);
		Object.keys(c.data).forEach((k) => {
			if (theirIceCandidateKeys.indexOf(k) === -1) {
				theirIceCandidateKeys.push(k);
				console.log(c.data[k]);
				friends[pub].pc.addIceCandidate(new RTCIceCandidate(c.data[k]));
			}
		});
	});
	friends[pub].pc.onicecandidate =
		friends[pub].pc.onicecandidate ||
		(({ candidate }) => {
			if (!candidate) return;
			console.log("sending our ice candidate");
			var i = Gun.SEA.random(12).toString("base64");
			ourIceCandidates[i] = candidate;
			friends[pub].put("icecandidates", {
				time: new Date().toISOString(),
				data: ourIceCandidates,
			});
		});
	if (createOffer) {
		friends[pub].pc.onnegotiationneeded = async () => {
			createOfferFn();
		};
	}
	friends[pub].pc.onsignalingstatechange = async () => {
		if (!friends[pub].pc) {
			return;
		}
		console.log(
			"Signaling State Change:" + friends[pub].pc,
			friends[pub].pc.signalingState
		);
		switch (friends[pub].pc.signalingState) {
			case "have-remote-offer":
				var answer = await friends[pub].pc.createAnswer({
					offerToReceiveAudio: 1,
				});
				friends[pub].pc.setLocalDescription(answer);
				friends[pub].put("sdp", {
					time: new Date().toISOString(),
					data: answer,
				});
				break;
			case "stable":
				console.log("call answered by", pub);
				break;
			case "closed":
				console.log("Signalling state is 'closed'");
				break;
		}
	};
	friends[pub].pc.onconnectionstatechange = () => {
		console.log(
			"iceConnectionState changed",
			friends[pub].pc.iceConnectionState
		);
		switch (friends[pub].pc.iceConnectionState) {
			case "connected":
				console.log("Connected");
				var end_vibe = $(
					'<button id="end-vibe" type="btn"><i class="material-icons" aria-hidden="true">call_end</i> End Vibe</button>'
				);

				$("#start-vibe").replaceWith(end_vibe);
				$("#end-vibe").click(() => endCall(pub));

				break;
			case "disconnected":
				console.log("Disconnected");
				friends[pub].pc & friends[pub].pc.close();
				friends[pub].put("call", null);
				var start_vibe = $(
					'<button id="start-vibe" type="btn" disabled><i class="material-icons" aria-hidden="true">play_arrow</i> Start Vibe</button>'
				);

				$("#start-vibe").replaceWith(start_vibe);

				break;
			case "new":
				break;
			case "failed":
				console.log("Failed");
				break;
			case "closed":
				break;
			default:
				console.log(
					"Change of state",
					friends[pub].pc.iceConnectionState
				);
				break;
		}
	};
	friends[pub].pc.ontrack = (event) => {
		console.log("ontrack", event);
		if (remoteAudio[0].srcObject !== event.streams[0]) {
			//createResonanceScence(event.streams[0]);
			remoteAudio[0].muted = true;

			remoteAudio[0].srcObject = event.streams[0];
			remoteAudio[0].onloadedmetadata = function () {
				remoteAudio[0].play();
				console.log("metadata loaded");
			};
			createResonanceScence(event.streams[0]);
			console.log("received remote stream", event);
		}
	};
}

export default {
	callUser,
	onCallMessage,
};
