import { $DOC, Component } from 'uuuf';

export default class MobileOpen extends Component {
    async ready() {
        this.elem.addEventListener('click', () => {
            const name = this.elem.dataset.modalTarget;
            const modal = document.querySelector(`[data-modal-name="${name}"]`)
            modal.component.show();
        })
    }
}