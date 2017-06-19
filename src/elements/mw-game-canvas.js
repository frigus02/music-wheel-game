import MusicWheelBaseCanvas from './mw-base-canvas.js';
import MwStateElementMixin from './mixins/mw-state-element-mixin.js';

class MusicWheelGameCanvas extends MwStateElementMixin(MusicWheelBaseCanvas) {
    constructor() {
        super();

        this._onMoveMove = this._onMoveMove.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();

        this.$.canvas.addEventListener('mousemove', this._onMoveMove);
    }

    disconnectedCallback() {
        this.$.canvas.removeEventListener('mousemove', this._onMoveMove);

        super.disconnectedCallback();
    }

    _onDraw(settings) {
        const ctx = settings.context;
        const glyphs = this.getState().data.glyphs;
        const isBigRadius = this.getState().data.remainingBigRadiusTicks > 0;
        const radius = isBigRadius ? 15 : 7;

        ctx.clearHitRegions();
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, settings.width, settings.height);

        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.arc(settings.width / 2, settings.height / 2, 20, 0, 2 * Math.PI);
        ctx.stroke();

        for (const glyph of glyphs) {
            const x = (settings.width / 2) + glyph.x;
            const y = (settings.height / 2) + glyph.y;

            ctx.strokeStyle = glyph.color;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.addHitRegion({id: glyph.id});
        }
    }

    _onMoveMove(event) {
        if (event.region) {
            this.dispatch({
                type: 'HIT_GLYPH',
                id: event.region
            });
        }
    }
}

customElements.define('mw-game-canvas', MusicWheelGameCanvas);

export default MusicWheelGameCanvas;
