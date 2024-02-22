import { $ALL, Component } from 'uuuf';
import loadComponents from '../loadComponents';
import { debounceImmediate } from '../utils';

const HEADER_SAFE_HEIGHT = 200;

export default class Page extends Component {
    get DOM() {
        return {
            header: `[data-header]`,
            main: `[data-main]`,
            stuckables: $ALL`[data-stuckable]`,
            animated: $ALL`[data-animate]`,
        }
    }

    get CSS() {
        return {
            slim: '-slim',
            stuck: '-stuck',
        }
    }

    async ready() {
        await loadComponents(this.elem.children);
        this.init();
    }

    init() {
        this.bind();

        this.initStuckObserver();
        this.animObvs = this.initAnimationObserver();
        document.addEventListener('layout:animation-reload', () => {
            this.animObvs.disconnect();
            this.bind();
            this.animObvs = this.initAnimationObserver();
        })

        this.lastScrollTop = window.scrollY;
        document.addEventListener('scroll', debounceImmediate(100, this.handleScroll));
        this.handleScroll();
    }

    initStuckObserver() {
        const headerHeight = HEADER_SAFE_HEIGHT;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(e => {
                const elemTop = e.target.getBoundingClientRect().top;
                const isStuck = e.intersectionRatio < 1 && elemTop < headerHeight;
                this.css.stuck(e.target, isStuck);
                this.css.stuck(this.elem, this.dom.stuckables.some(el => {
                    return this.css.stuck.match(el);
                }));
            })
        }, {
            threshold: 1.0,
            rootMargin: `-${headerHeight + 1}px 0px 0px 0px`,
        });

        this.dom.stuckables.forEach(e => {
            observer.observe(e);
        })

        return observer;
    }

    initAnimationObserver() {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(e => {
                e.target.dataset.animate = e.isIntersecting ? 'in' : 'out';
            })
        }, {
            rootMargin: `-64px 0px -64px 0px`,
        });

        this.dom.animated.forEach(e => {
            observer.observe(e);
        })

        return observer;
    }


    handleScroll() {
        const downwards = window.scrollY > this.lastScrollTop;
        this.css.slim(this.elem, downwards);
        this.lastScrollTop = window.scrollY;
    }
}