import MusicWheelBaseCanvas from './mw-base-canvas.js';
import MwStateElementMixin from './mixins/mw-state-element-mixin.js';

class MusicWheelGameCanvas extends MwStateElementMixin(MusicWheelBaseCanvas) {
    _onDraw(settings) {
        const ctx = settings.context;
        const glyphs = this.getState().data.glyphs;

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
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }
}

customElements.define('mw-game-canvas', MusicWheelGameCanvas);

export default MusicWheelGameCanvas;
