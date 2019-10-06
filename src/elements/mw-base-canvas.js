class MusicWheelBaseCanvas extends HTMLElement {
	constructor() {
		super();

		this._draw = this._draw.bind(this);
		this._onResized = this._onResized.bind(this);
	}

	connectedCallback() {
		if (!this.shadowRoot) {
			this.style.display = "block";
			this.style.overflow = "hidden";

			this.attachShadow({ mode: "open" });

			const canvas = document.createElement("canvas");
			this.shadowRoot.appendChild(canvas);

			this.$ = { canvas };

			this._drawSettings = {
				context: this.$.canvas.getContext("2d"),
				width: 0,
				height: 0
			};
		}

		this._onResized();
		window.addEventListener("resize", this._onResized);
		this._startDrawing();
	}

	disconnectedCallback() {
		window.removeEventListener("resize", this._onResized);
		this._stopDrawing();
	}

	_onResized() {
		this._drawSettings.width = this.clientWidth;
		this._drawSettings.height = this.clientHeight;

		this.$.canvas.width = this._drawSettings.width;
		this.$.canvas.height = this._drawSettings.height;
	}

	_startDrawing() {
		this._drawRaf = requestAnimationFrame(this._draw);
	}

	_draw() {
		this._onDraw(this._drawSettings);
		this._drawRaf = requestAnimationFrame(this._draw);
	}

	_onDraw() {
		// Should be overidden in subclass.
	}

	_stopDrawing() {
		cancelAnimationFrame(this._drawRaf);
	}
}

customElements.define("mw-analyser-frequency-canvas", MusicWheelBaseCanvas);

export default MusicWheelBaseCanvas;
