import MwStateElementMixin from "./mixins/mw-state-element-mixin.js";

class MusicWheelAudioPlayer extends MwStateElementMixin(HTMLElement) {
	constructor() {
		super();

		this._context = new (window.AudioContext || window.webkitAudioContext)();
		this._source = null;
		this._analyser = this._context.createAnalyser();
		this._analyser.connect(this._context.destination);
		this._analyser.fftSize = 32;
		this._analyserBufferLength = this._analyser.frequencyBinCount;
		this._analyserBuffer = new Float32Array(this._analyserBufferLength);

		this._startedAt = 0;

		this._sendTick = this._sendTick.bind(this);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._stopSendingTicks();
	}

	_onUpdate(oldState, newState) {
		switch (newState.gameState) {
			case "LOADING":
				if (this._source) {
					this._pause();
				}

				if (
					newState.music.file &&
					newState.music.file !== oldState.music.file &&
					!newState.music.buffer
				) {
					this._loadMusicFile(newState.music.file);
				}
				break;
			case "READY":
				if (this._source) {
					this._pause();
				}
				break;
			case "PLAYING":
				if (this._source && this._source.buffer !== newState.music.buffer) {
					this._pause();
				}

				if (!this._source) {
					this._play(newState.music.buffer, newState.data.elapsed);
				}
				break;
			case "PAUSED":
				if (this._source) {
					this._pause();
				}
				break;
		}
	}

	_startSendingTicks() {
		this._sendTickRaf = requestAnimationFrame(this._sendTick);
	}

	_sendTick() {
		this._analyser.getFloatFrequencyData(this._analyserBuffer);

		const elapsed = this._context.currentTime - this._startedAt;
		this.dispatch({
			type: "TICK",
			elapsed: elapsed,
			frequencyData: new Float32Array(this._analyserBuffer)
		});

		this._sendTickRaf = requestAnimationFrame(this._sendTick);
	}

	_stopSendingTicks() {
		cancelAnimationFrame(this._sendTickRaf);
	}

	async _loadMusicFile(fileName) {
		this.dispatch({ type: "LOG", message: "Loading music file..." });
		const response = await fetch(fileName);
		const arrayBuffer = await response.arrayBuffer();

		this.dispatch({ type: "LOG", message: "Decoding music file..." });
		const buffer = await this._context.decodeAudioData(arrayBuffer);

		this.dispatch({ type: "LOG", message: "" });
		this.dispatch({
			type: "SET_MUSIC",
			file: fileName,
			buffer: buffer,
			duration: buffer.duration
		});
	}

	_play(buffer, elapsed) {
		this._source = this._context.createBufferSource();
		this._source.buffer = buffer;
		this._source.connect(this._analyser);
		this._source.start(0, elapsed);
		this._startedAt = this._context.currentTime - elapsed;
		this._startSendingTicks();
	}

	_pause() {
		this._stopSendingTicks();
		this._source.disconnect();
		this._source.stop(0);
		this._source = null;
	}
}

customElements.define("mw-audio-player", MusicWheelAudioPlayer);

export default MusicWheelAudioPlayer;
