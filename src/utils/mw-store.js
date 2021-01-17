import * as reducers from "./reducers/index.js";

const reducer = Redux.combineReducers(reducers);

const store = Redux.createStore(
	reducer,
	window.__REDUX_DEVTOOLS_EXTENSION__ &&
		window.__REDUX_DEVTOOLS_EXTENSION__({
			maxAge: 10,
			shouldRecordChanges: false,
		})
);

export default store;
