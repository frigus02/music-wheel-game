import { html } from '../utils/mw-template.js';
import MwStateElementMixin from './mixins/mw-state-element-mixin.js';

import './mw-game-canvas.js';
import './mw-game-controls.js';
import './mw-game-status.js';
import './mw-audio-frequency-canvas.js';
import './mw-audio-player.js';

const template = html`
    <style>
        :host {
            display: block;
        }

        mw-game-status,
        mw-game-controls {
            position: absolute;
            width: 50%;
            height: 32px;
            line-height: 32px;
            padding: 0 8px;
            box-sizing: border-box;
            vertical-align: middle;
        }

        mw-game-controls {
            left: 50%;
            text-align: right;
        }

        mw-game-canvas,
        mw-audio-frequency-canvas {
            height: 100%;
        }
    </style>

    <mw-audio-player></mw-audio-player>
    <mw-game-status></mw-game-status>
    <mw-game-controls id="controls"></mw-game-controls>
    <mw-game-canvas id="game-canvas"></mw-game-canvas>
    <mw-audio-frequency-canvas id="audio-frequency-canvas"></mw-audio-frequency-canvas>
`;

class MusicWheelGame extends MwStateElementMixin(HTMLElement) {
    async connectedCallback() {
        if (!this.shadowRoot) {
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(document.importNode(template.content, true));

            this.$ = {
                controls: this.shadowRoot.getElementById('controls'),
                gameCanvas: this.shadowRoot.getElementById('game-canvas'),
                audioFrequencyCanvas: this.shadowRoot.getElementById('audio-frequency-canvas')
            };
        }

        this.dispatch({ type: 'LOAD_FILE', file: this.$.controls.musicFile });

        super.connectedCallback();
    }

    _onUpdate(oldState = {}, newState) {
        if (oldState.ui !== newState.ui) {
            this.$.gameCanvas.style.display = newState.ui === 'game' ? 'block' : 'none';
            this.$.audioFrequencyCanvas.style.display = newState.ui === 'audio-frequency' ? 'block' : 'none';
        }
    }
}

customElements.define('mw-game', MusicWheelGame);

export default MusicWheelGame;
