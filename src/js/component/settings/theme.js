import { $$, Component } from 'uuuf';
import loadComponents from '../../loadComponents';

export default class ThemeCtrl extends Component {
    get DOM() {
        return {
            cta: [$$`[data-theme-target]`, {
                click: this.handleClick,
            }]
        }
    }

    async ready() {
        this.bind();
        const theme = localStorage.getItem('theme');
        if (theme) {
            this.setTheme(theme);
        }
    }

    setTheme(theme) {
        document.body.classList.forEach(cl => {
            if (/^theme-/.test(cl)) {
                document.body.classList.remove(cl);
            }
        });
        document.body.classList.add(`theme-${theme}`);
        localStorage.setItem('theme', theme);
    }

    handleClick(evt) {
        const theme = evt.currentTarget.dataset.themeTarget;
        this.setTheme(theme);
    }
}