import { $ALL, Component } from 'uuuf';
import loadComponents from '../loadComponents';

export default class Modal extends Component {
    get DOM() {
        return {
            window: [`[data-modal-window]`, {
                click: evt => evt.stopPropagation(),
            }],
            closeCta: [$ALL`[data-modal-close]`, {
                click: () => this.hide(),
            }],
        }
    }    

    get CSS() {
        return {
            shown: '-shown',
            scrollLock: '-scroll-lock',
        }
    }

    async ready() {
        this.bind();
        await loadComponents(this.elem.children);
    }

    _transitionEndPromise() {
        return new Promise(resolve => {
            this.elem.addEventListener('transitionend', () => {
                resolve();
            }, { once: true });
        })
    }

    show() {
        this.css.scrollLock(document.body);
        this.css.shown(this.elem);
        this.elem.setAttribute('aria-hidden', 'false');
        return this._transitionEndPromise();
    }

    hide() {
        this.css.scrollLock(document.body, false);
        this.css.shown(this.elem, false);
        this.elem.setAttribute('aria-hidden', 'true');
        return this._transitionEndPromise();
    }
}