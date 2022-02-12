/**
 * 判断是否是一个对象，纯对象
 * @param {object} val
 * @returns {boolean}
 */
function isPlainObject(val) {
  if (toString.call(val) !== "[object Object]") {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * 判断是否是一个广义的“对象”。
 * @param {object} val
 * @returns {boolean}
 */
function isObject(val) {
  return val !== null && typeof val === "object";
}

/**
 * 判断是否是URLSearchParams，URLSearchParams是一个正在试验中，兼容不完全的对象。它可以用来方便的处理URL的参数串。
 * @param {Object} val
 * @returns {boolean}
 */
function isURLSearchParams(val) {
  return toString.call(val) === "[object URLSearchParams]";
}

/**
 *
 * @param {Object} val
 * @returns {boolean}
 */
function isDate(val) {
  return toString.call(val) === "[object Date]";
}

function isArray(val) {
  return Array.isArray(val);
}

/**
 * 这是一个可以遍历对象或者数组的方法，如果是数组会使回调函数的参数包括value、index、complete array
 *
 * 如果是对象，则会是value、key、complete object
 *
 * @param {Object | Array} obj 需要遍历的数组或对象
 * @param {Function } fn  毁掉函数
 */
function forEach(obj, fn) {
  if (obj === null || typeof obj === "undefined") {
    return;
  }

  // 如果obj不是一个对象，那就强制转换成数组
  if (typeof obj !== "object") {
    obj = [obj];
  }

  // 简单说就是，数组就for，对象就forin
  if (isArray(obj)) {
    // 数组的话那就直接for循环遍历，回调函数直接调用
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // 对象的话，也类似，就用for in
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

export default {
  isDate,
  isArray,
  isObject,
  isPlainObject,
  isURLSearchParams,
  forEach,
};