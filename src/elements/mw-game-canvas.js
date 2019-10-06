import MusicWheelBaseCanvas from "./mw-base-canvas.js";
import MwStateElementMixin from "./mixins/mw-state-element-mixin.js";

class MusicWheelGameCanvas extends MwStateElementMixin(MusicWheelBaseCanvas) {
	constructor() {
		super();

		this._onMoveMove = this._onMoveMove.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();

		this.$.canvas.addEventListener("mousemove", this._onMoveMove);
		this.$.canvas.addEventListener("touchmove", this._onMoveMove);
	}

	disconnectedCallback() {
		this.$.canvas.removeEventListener("mousemove", this._onMoveMove);
		this.$.canvas.removeEventListener("touchmove", this._onMoveMove);

		super.disconnectedCallback();
	}

	_onDraw(settings) {
		const ctx = settings.context;
		const glyphs = this.getState().data.glyphs;
		const radius = this.getState().data.glyphRadius;

		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, settings.width, settings.height);

		ctx.strokeStyle = "white";
		ctx.beginPath();
		ctx.arc(settings.width / 2, settings.height / 2, 20, 0, 2 * Math.PI);
		ctx.stroke();

		for (const glyph of glyphs) {
			const x = settings.width / 2 + glyph.x;
			const y = settings.height / 2 + glyph.y;

			ctx.strokeStyle = glyph.color;
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, 2 * Math.PI);
			ctx.stroke();
		}
	}

	_onMoveMove(event) {
		this.dispatch({
			type: "HIT_GLYPH",
			x:
				this._getTouchCoordinate(event, "pageX") - this._drawSettings.width / 2,
			y:
				this._getTouchCoordinate(event, "pageY") - this._drawSettings.height / 2
		});
	}

	_getTouchCoordinate(evt, prop) {
		if (evt.touches && evt.touches.length > 0) {
			return evt.touches[0][prop];
		} else {
			return evt[prop];
		}
	}
}

customElements.define("mw-game-canvas", MusicWheelGameCanvas);

export default MusicWheelGameCanvas;
