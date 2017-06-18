import {parseTemplate} from '../utils/mw-template.js';
import MwStateElementMixin from './mixins/mw-state-element-mixin.js';

const template = parseTemplate('mw-game-status', `
    <template>
        <style>
            :host {
                display: block;
                color: #fff;
            }

            div {
                display: inline-block;
                width: 200px;
            }
        </style>

        <div id="info"></div>
        <div>
            <span id="time-elapsed"></span> /
            <span id="time-duration">NaN</span>
        </div>
    </template>
`);

class MusicWheelGameStatus extends MwStateElementMixin(HTMLElement) {
    connectedCallback() {
        if (window.ShadyCSS) ShadyCSS.styleElement(this);
        if (!this.shadowRoot) {
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(document.importNode(template.content, true));

            this.$ = {
                info: this.shadowRoot.getElementById('info'),
                timeDuration: this.shadowRoot.getElementById('time-duration'),
                timeElapsed: this.shadowRoot.getElementById('time-elapsed')
            };
        }

        super.connectedCallback();
    }

    _onUpdate(oldState = {music: {}, data: {}}, newState) {
        if (oldState.log !== newState.log) {
            this.$.info.textContent = newState.log;
        }

        if (oldState.music.duration !== newState.music.duration) {
            this.$.timeDuration.textContent = this._formatTime(newState.music.duration);
        }

        if (oldState.data.elapsed !== newState.data.elapsed) {
            this.$.timeElapsed.textContent = this._formatTime(newState.data.elapsed);
        }
    }

    _formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        if (seconds < 10) {
            seconds = '0' + seconds;
        }

        return `${minutes}:${seconds}`;
    }
}

customElements.define('mw-game-status', MusicWheelGameStatus);

export default MusicWheelGameStatus;
