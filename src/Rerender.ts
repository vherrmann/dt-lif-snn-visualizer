export let rerender: { fn: null | (() => void) } = { fn: null };
let rerenderRequested = false;
export function requestRerender() {
  if (rerender.fn && !rerenderRequested) {
    rerenderRequested = true;
    window.requestAnimationFrame(() => {
      rerender.fn && rerender.fn();
      rerenderRequested = false;
    });
  }
}
