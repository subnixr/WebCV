import { makeLoadComponents } from 'uuuf';

async function importComponent(componentName) {
    // this is an example with webpack dynamic imports
    return import(`@/js/component/${componentName}`).then(mod => mod.default);
}

export default makeLoadComponents(importComponent, {
    componentSelector: '[data-component]',
    getComponentName: e => e.dataset.component,
});