import { $$, $DOC, Component } from 'uuuf';
import loadComponents from '../../loadComponents';

export default class TimelineCtrl extends Component {
    get DOM() {
        return {
            select: [$$`[data-timeline-select]`, {
                'input': this.handleInput,
            }],
            fieldSelect: `[data-timeline-select][name="field"]`,
            orderSelect: `[data-timeline-select][name="order"]`,
            timeline: $DOC`[data-component="timeline"]`,
        }
    }

    async ready() {
        this.bind();

        this.formValue = {
            field: this.dom.fieldSelect.value,
            order: this.dom.orderSelect.value,
        }
    }

    handleInput(evt) {
        const fieldName= evt.currentTarget.name;
        const value = evt.currentTarget.value;
        this.formValue[fieldName] = value;
        this.dom.timeline.component.sort(
            this.formValue.field,
            this.formValue.order,
        )
    }
}