export default function reducer(state = "", action) {
	switch (action.type) {
		case "LOG":
			return action.message;
		default:
			return state;
	}
}
