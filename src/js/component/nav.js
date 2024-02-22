import { $$, $$DOC, $WIN, Component } from 'uuuf';
import loadComponents from '../loadComponents';
import { debounceImmediate } from '../utils';

export default class Nav extends Component {
    get DOM() {
        return {
            navlinks: [$$`[data-navlink]`, {
                'click': this.handleClick,
            }],
            navsections: $$DOC`[data-navsection]`,
        }
    }

    get CSS() {
        return {
            current: '-current',
        }
    }

    async ready() {
        await loadComponents(this.elem.children);
        this.bind();
        window.addEventListener('scroll', debounceImmediate(50, this.handleScroll));
        this.updateLinks();
    }

    _getHashId(url) {
        return new URL(url).hash.slice(1);
    }

    handleClick(evt) {
        evt.preventDefault();
        const target = document.getElementById(
            this._getHashId(evt.currentTarget.href)
        );
        this.setCurrent(evt.currentTarget);

        const amount = window.scrollY + target.getBoundingClientRect().top;
        window.scroll({
            behavior: 'smooth',
            left: 0,
            top: amount + 1,
        });
        this.updateLinks();

        if (target.id === 'skills') {
            setTimeout(() => {
                window.scroll({
                    behavior: 'smooth',
                    top: 0,
                })
            }, 100);
        }
    }

    setCurrent(...elems) {
        this.dom.navlinks.forEach(e => this.css.current(e, false));
        if (elems) {
            elems.forEach(e => this.css.current(e));
        }
    }

    updateLinks() {
        const lastCrossed = this.dom.navsections.reduce((r, e) => {
            if (e.offsetTop <= window.scrollY) return e;
            return r;
        });
        const lnks = this.dom.navlinks.filter(e => {
            return this._getHashId(e) === lastCrossed.dataset.navsection;
        });
        this.setCurrent(...lnks)
    }

    handleScroll() {
        this.updateLinks();
    }
}