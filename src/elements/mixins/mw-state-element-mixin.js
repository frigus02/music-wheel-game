import store from "../../utils/mw-store.js";

const MwStateElementMixin = superclass =>
	class MwStateElementMixin extends superclass {
		constructor() {
			super();

			this._update = this._update.bind(this);
		}

		connectedCallback() {
			super.connectedCallback && super.connectedCallback();

			this._update();
			this._stopUpdates = store.subscribe(this._update);
		}

		disconnectedCallback() {
			super.disconnectedCallback && super.disconnectedCallback();

			this._stopUpdates();
		}

		_update() {
			const oldState = this._lastState;
			const newState = store.getState();
			this._lastState = newState;

			this._onUpdate(oldState, newState);
		}

		_onUpdate(/*oldState, newState*/) {
			// Should be overidden in subclass.
		}

		dispatch(action) {
			store.dispatch(action);
		}

		getState() {
			return store.getState();
		}
	};

export default MwStateElementMixin;
