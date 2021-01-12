/**
 * 防抖，重在清零，只执行一次
 */
export function throttle (fn, delay = 300) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  }
}

