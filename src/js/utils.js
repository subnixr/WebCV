export function debounceImmediate(delay, fn) {
    let fired = false;
    return function (...args) {
        if (!fired) {
            fn(...args);
            fired = true;
            setTimeout(() => fired = false, delay);
        }
    }
}