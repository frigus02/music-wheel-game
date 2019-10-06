import { html } from "../utils/mw-template.js";
import MwStateElementMixin from "./mixins/mw-state-element-mixin.js";

const template = html`
	<style>
		:host {
			display: block;
		}

		button {
			width: 100px;
		}
	</style>

	<button id="play-button">Play</button>
	<button id="pause-button">Pause</button>
	<select id="music-file-select">
		<option>Come Back To You.mp3</option>
		<option selected>Stories from Emona I.mp3</option>
	</select>
	<select id="ui-select">
		<option value="game" selected>Game</option>
		<option value="audio-frequency">Audio Frequency</option>
	</select>
`;

class MusicWheelGameControls extends MwStateElementMixin(HTMLElement) {
	constructor() {
		super();

		this._play = this._play.bind(this);
		this._pause = this._pause.bind(this);
		this._musicFileSelected = this._musicFileSelected.bind(this);
		this._uiSelected = this._uiSelected.bind(this);
	}

	async connectedCallback() {
		if (!this.shadowRoot) {
			this.attachShadow({ mode: "open" });
			this.shadowRoot.appendChild(document.importNode(template.content, true));

			this.$ = {
				playButton: this.shadowRoot.getElementById("play-button"),
				pauseButton: this.shadowRoot.getElementById("pause-button"),
				musicFileSelect: this.shadowRoot.getElementById("music-file-select"),
				uiSelect: this.shadowRoot.getElementById("ui-select")
			};
		}

		this.$.playButton.addEventListener("click", this._play);
		this.$.pauseButton.addEventListener("click", this._pause);
		this.$.musicFileSelect.addEventListener("change", this._musicFileSelected);
		this.$.uiSelect.addEventListener("change", this._uiSelected);

		super.connectedCallback();
	}

	disconnectedCallback() {
		super.disconnectedCallback();

		this.$.playButton.removeEventListener("click", this._play);
		this.$.pauseButton.removeEventListener("click", this._pause);
		this.$.musicFileSelect.removeEventListener(
			"change",
			this._musicFileSelected
		);
		this.$.uiSelect.removeEventListener("change", this._uiSelected);
	}

	get musicFile() {
		return "music/" + this.$.musicFileSelect.selectedOptions[0].value;
	}

	_play() {
		this.dispatch({ type: "PLAY" });
	}

	_pause() {
		this.dispatch({ type: "PAUSE" });
	}

	_onUpdate(oldState = {}, newState) {
		if (oldState.gameState !== newState.gameState) {
			this.$.playButton.disabled = !(
				newState.gameState === "READY" || newState.gameState === "PAUSED"
			);
			this.$.pauseButton.disabled = newState.gameState !== "PLAYING";
			this.$.musicFileSelect.disabled = newState.gameState === "LOADING";
		}
	}

	_musicFileSelected() {
		this.dispatch({ type: "LOAD_FILE", file: this.musicFile });
	}

	_uiSelected() {
		this.dispatch({
			type: "SET_UI",
			ui: this.$.uiSelect.selectedOptions[0].value
		});
	}
}

customElements.define("mw-game-controls", MusicWheelGameControls);

export default MusicWheelGameControls;
