import MusicWheelBaseCanvas from "./mw-base-canvas.js";
import MwStateElementMixin from "./mixins/mw-state-element-mixin.js";

class MusicWheelAudioFrequencyCanvas extends MwStateElementMixin(
	MusicWheelBaseCanvas
) {
	static get DOT_SIZE() {
		return 2;
	}

	_startDrawing() {
		this._x = 0;
		this._paths = [];
		this._offsetPaths = [];

		super._startDrawing();
	}

	_onDraw(settings) {
		const dot = MusicWheelAudioFrequencyCanvas.DOT_SIZE;

		const data = this.getState().data.frequencyData;
		if (!data || data === this._lastData) return;
		this._lastData = data;
		const dataLength = data.length;

		const freqElementHeight = settings.height / dataLength;

		if (this._paths.length === 0) {
			for (let i = 0; i < dataLength; i++) {
				this._paths.push(new Path2D());
				this._offsetPaths.push(new Path2D());
			}
		}

		settings.context.fillStyle = "black";
		settings.context.fillRect(0, 0, settings.width, settings.height);

		const barWidth = settings.width / dataLength;

		// Bars
		for (let i = 0; i < dataLength; i++) {
			if (data[i] === -Infinity) continue;

			const barValue = -((data[i] / 140) * settings.height);

			settings.context.fillStyle = "red";
			settings.context.fillRect(
				i * barWidth,
				barValue,
				barWidth - 1,
				settings.height - barValue
			);
		}

		// Lines
		for (let i = 0; i < dataLength; i++) {
			if (data[i] === -Infinity) continue;

			const lineOffset = i * freqElementHeight;
			const lineValue = ((data[i] + 15) / 140) * freqElementHeight;

			this._offsetPaths[i].lineTo(this._x, lineOffset + freqElementHeight);
			this._paths[i].lineTo(this._x, lineOffset - lineValue);

			settings.context.strokeStyle = `dimgray`;
			settings.context.stroke(this._offsetPaths[i]);
			settings.context.strokeStyle = `lightgray`;
			settings.context.stroke(this._paths[i]);
		}

		this._x += dot;
		if (this._x >= settings.width) {
			this._x = 0;
			this._paths = [];
			this._offsetPaths = [];
		}
	}
}

customElements.define(
	"mw-audio-frequency-canvas",
	MusicWheelAudioFrequencyCanvas
);

export default MusicWheelAudioFrequencyCanvas;
