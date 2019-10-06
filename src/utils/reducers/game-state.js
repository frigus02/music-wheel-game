export default function reducer(state = "LOADING", action) {
	switch (action.type) {
		case "LOAD_FILE":
			return "LOADING";
		case "SET_MUSIC":
			return "PLAYING"; //'READY'
		case "PLAY":
			if (!(state === "READY" || state === "PAUSED")) return state;
			return "PLAYING";
		case "PAUSE":
			if (state !== "PLAYING") return state;
			return "PAUSED";
		default:
			return state;
	}
}
