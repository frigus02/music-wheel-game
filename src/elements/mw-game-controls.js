import {parseTemplate} from '../utils/mw-template.js';
import MwStateElementMixin from './mixins/mw-state-element-mixin.js';

const template = parseTemplate('mw-game-controls', `
    <template>
        <style>
            :host {
                display: block;
            }

            button {
                width: 100px;
            }
        </style>

        <button id="glyph-button">Add glyph</button>
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
    </template>
`);

class MusicWheelGameControls extends MwStateElementMixin(HTMLElement) {
    constructor() {
        super();

        this._addRandomGlyphs = this._addRandomGlyphs.bind(this);
        this._play = this._play.bind(this);
        this._pause = this._pause.bind(this);
        this._musicFileSelected = this._musicFileSelected.bind(this);
        this._uiSelected = this._uiSelected.bind(this);
    }

    async connectedCallback() {
        if (window.ShadyCSS) ShadyCSS.styleElement(this);
        if (!this.shadowRoot) {
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(document.importNode(template.content, true));

            this.$ = {
                glyphButton: this.shadowRoot.getElementById('glyph-button'),
                playButton: this.shadowRoot.getElementById('play-button'),
                pauseButton: this.shadowRoot.getElementById('pause-button'),
                musicFileSelect: this.shadowRoot.getElementById('music-file-select'),
                uiSelect: this.shadowRoot.getElementById('ui-select')
            };
        }

        this.$.glyphButton.addEventListener('click', this._addRandomGlyphs);
        this.$.playButton.addEventListener('click', this._play);
        this.$.pauseButton.addEventListener('click', this._pause);
        this.$.musicFileSelect.addEventListener('change', this._musicFileSelected);
        this.$.uiSelect.addEventListener('change', this._uiSelected);

        super.connectedCallback();
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        this.$.glyphButton.removeEventListener('click', this._addRandomGlyphs);
        this.$.playButton.removeEventListener('click', this._play);
        this.$.pauseButton.removeEventListener('click', this._pause);
        this.$.musicFileSelect.removeEventListener('change', this._musicFileSelected);
        this.$.uiSelect.removeEventListener('change', this._uiSelected);
    }

    get musicFile() {
        return '/src/music/' + this.$.musicFileSelect.selectedOptions[0].value;
    }

    _addRandomGlyphs() {
        this.dispatch({
            type: 'ADD_RANDOM_GLYPHS',
            count: 100
        });
    }

    _play() {
        this.dispatch({ type: 'PLAY' });
    }

    _pause() {
        this.dispatch({ type: 'PAUSE' });
    }

    _onUpdate(oldState = {}, newState) {
        if (oldState.gameState !== newState.gameState) {
            this.$.glyphButton.disabled = newState.gameState !== 'PLAYING';
            this.$.playButton.disabled = !(newState.gameState === 'READY' || newState.gameState === 'PAUSED');
            this.$.pauseButton.disabled = newState.gameState !== 'PLAYING';
            this.$.musicFileSelect.disabled = newState.gameState === 'LOADING';
        }
    }

    _musicFileSelected() {
        this.dispatch({ type: 'LOAD_FILE', file: this.musicFile });
    }

    _uiSelected() {
        this.dispatch({ type: 'SET_UI', ui: this.$.uiSelect.selectedOptions[0].value });
    }
}

customElements.define('mw-game-controls', MusicWheelGameControls);

export default MusicWheelGameControls;