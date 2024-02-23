import { $DOC, Component } from 'uuuf';
import template from 'lodash.template';
import loadComponents from '../loadComponents';

export default class Timeline extends Component {
    get DOM() {
        return {
            data: {
                experiences: $DOC`script#data-experiences`,
                education: $DOC`script#data-education`,
            },
            tpl: {
                experiences: `script[name="card-experience"]`,
                education: `script[name="card-education"]`,
            },
            section: {
                experiences: `[data-section="experiences"]`,
                education: `[data-section="education"]`,
            }
        }
    }

    async ready() {
        this.bind();
        this.tpl = {
            experiences: template(this.dom.tpl.experiences.innerHTML),
            education: template(this.dom.tpl.education.innerHTML),
        }
        this.data = {
            experiences: JSON.parse(this.dom.data.experiences.innerHTML),
            education: JSON.parse(this.dom.data.education.innerHTML),
        }
        await this.sort();
    }

    async sort(field = 'endDate', ordering = 'desc') {
        for (const t of ['experiences', 'education']) {
            const data = JSON.parse(JSON.stringify(this.data[t]));
            data.sort((a, b) => {
                const isDesc = ordering === 'desc';
                const av = a[field];
                const bv = b[field];
                if (!/^\d/.test(av)) return isDesc ? -1 : 1;
                if (!/^\d/.test(bv)) return isDesc ? 1 : -1;
                return isDesc
                    ? bv.localeCompare(av)
                    : av.localeCompare(bv);
            });
            
            let html = '';
            data.forEach(item => {
                html += this.tpl[t]({ item })
            });
            this.dom.section[t].innerHTML = html;
        }

        await loadComponents(this.elem.children);
        this.emit('layout:animation-reload');
    }
}