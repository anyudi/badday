/**
 * 隐藏：人非草芥
 * 日期：2018/04/13
 * 时间：15:05
 * 作用：aplayer 此处打码
 */
/* unused harmony export Url */
/* unused harmony export Http */
/* unused harmony export Resource */
/*!
 * vue-resource v1.5.0
 * https://github.com/pagekit/vue-resource
 * Released under the MIT License.
 */

/**
 * Promises/A+ polyfill v1.1.4 (https://github.com/bramstein/promis)
 */

var RESOLVED = 0;
var REJECTED = 1;
var PENDING = 2;

function Promise$1(executor) {

  this.state = PENDING;
  this.value = undefined;
  this.deferred = [];

  var promise = this;

  try {
    executor(function (x) {
      promise.resolve(x);
    }, function (r) {
      promise.reject(r);
    });
  } catch (e) {
    promise.reject(e);
  }
}

Promise$1.reject = function (r) {
  return new Promise$1(function (resolve, reject) {
    reject(r);
  });
};

Promise$1.resolve = function (x) {
  return new Promise$1(function (resolve, reject) {
    resolve(x);
  });
};

Promise$1.all = function all(iterable) {
  return new Promise$1(function (resolve, reject) {
    var count = 0, result = [];

    if (iterable.length === 0) {
      resolve(result);
    }

    function resolver(i) {
      return function (x) {
        result[i] = x;
        count += 1;

        if (count === iterable.length) {
          resolve(result);
        }
      };
    }

    for (var i = 0; i < iterable.length; i += 1) {
      Promise$1.resolve(iterable[i]).then(resolver(i), reject);
    }
  });
};

Promise$1.race = function race(iterable) {
  return new Promise$1(function (resolve, reject) {
    for (var i = 0; i < iterable.length; i += 1) {
      Promise$1.resolve(iterable[i]).then(resolve, reject);
    }
  });
};

var p = Promise$1.prototype;

p.resolve = function resolve(x) {
  var promise = this;

  if (promise.state === PENDING) {
    if (x === promise) {
      throw new TypeError('Promise settled with itself.');
    }

    var called = false;

    try {
      var then = x && x['then'];

      if (x !== null && typeof x === 'object' && typeof then === 'function') {
        then.call(x, function (x) {
          if (!called) {
            promise.resolve(x);
          }
          called = true;

        }, function (r) {
          if (!called) {
            promise.reject(r);
          }
          called = true;
        });
        return;
      }
    } catch (e) {
      if (!called) {
        promise.reject(e);
      }
      return;
    }

    promise.state = RESOLVED;
    promise.value = x;
    promise.notify();
  }
};

p.reject = function reject(reason) {
  var promise = this;

  if (promise.state === PENDING) {
    if (reason === promise) {
      throw new TypeError('Promise settled with itself.');
    }

    promise.state = REJECTED;
    promise.value = reason;
    promise.notify();
  }
};

p.notify = function notify() {
  var promise = this;

  nextTick(function () {
    if (promise.state !== PENDING) {
      while (promise.deferred.length) {
        var deferred = promise.deferred.shift(),
          onResolved = deferred[0],
          onRejected = deferred[1],
          resolve = deferred[2],
          reject = deferred[3];

        try {
          if (promise.state === RESOLVED) {
            if (typeof onResolved === 'function') {
              resolve(onResolved.call(undefined, promise.value));
            } else {
              resolve(promise.value);
            }
          } else if (promise.state === REJECTED) {
            if (typeof onRejected === 'function') {
              resolve(onRejected.call(undefined, promise.value));
            } else {
              reject(promise.value);
            }
          }
        } catch (e) {
          reject(e);
        }
      }
    }
  });
};

p.then = function then(onResolved, onRejected) {
  var promise = this;

  return new Promise$1(function (resolve, reject) {
    promise.deferred.push([onResolved, onRejected, resolve, reject]);
    promise.notify();
  });
};

p.catch = function (onRejected) {
  return this.then(undefined, onRejected);
};

/**
 * Promise adapter.
 */

if (typeof Promise === 'undefined') {
  window.Promise = Promise$1;
}

function PromiseObj(executor, context) {

  if (executor instanceof Promise) {
    this.promise = executor;
  } else {
    this.promise = new Promise(executor.bind(context));
  }

  this.context = context;
}

PromiseObj.all = function (iterable, context) {
  return new PromiseObj(Promise.all(iterable), context);
};

PromiseObj.resolve = function (value, context) {
  return new PromiseObj(Promise.resolve(value), context);
};

PromiseObj.reject = function (reason, context) {
  return new PromiseObj(Promise.reject(reason), context);
};

PromiseObj.race = function (iterable, context) {
  return new PromiseObj(Promise.race(iterable), context);
};

var p$1 = PromiseObj.prototype;

p$1.bind = function (context) {
  this.context = context;
  return this;
};

p$1.then = function (fulfilled, rejected) {

  if (fulfilled && fulfilled.bind && this.context) {
    fulfilled = fulfilled.bind(this.context);
  }

  if (rejected && rejected.bind && this.context) {
    rejected = rejected.bind(this.context);
  }

  return new PromiseObj(this.promise.then(fulfilled, rejected), this.context);
};

p$1.catch = function (rejected) {

  if (rejected && rejected.bind && this.context) {
    rejected = rejected.bind(this.context);
  }

  return new PromiseObj(this.promise.catch(rejected), this.context);
};

p$1.finally = function (callback) {

  return this.then(function (value) {
      callback.call(this);
      return value;
    }, function (reason) {
      callback.call(this);
      return Promise.reject(reason);
    }
  );
};

/**
 * Utility functions.
 */

var ref = {};
var hasOwnProperty = ref.hasOwnProperty;
var ref$1 = [];
var slice = ref$1.slice;
var debug = false, ntick;

var inBrowser = typeof window !== 'undefined';

function Util (ref) {
  var config = ref.config;
  var nextTick = ref.nextTick;

  ntick = nextTick;
  debug = config.debug || !config.silent;
}

function warn(msg) {
  if (typeof console !== 'undefined' && debug) {
    console.warn('[VueResource warn]: ' + msg);
  }
}

function error(msg) {
  if (typeof console !== 'undefined') {
    console.error(msg);
  }
}

function nextTick(cb, ctx) {
  return ntick(cb, ctx);
}

function trim(str) {
  return str ? str.replace(/^\s*|\s*$/g, '') : '';
}

function trimEnd(str, chars) {

  if (str && chars === undefined) {
    return str.replace(/\s+$/, '');
  }

  if (!str || !chars) {
    return str;
  }

  return str.replace(new RegExp(("[" + chars + "]+$")), '');
}

function toLower(str) {
  return str ? str.toLowerCase() : '';
}

function toUpper(str) {
  return str ? str.toUpperCase() : '';
}

var isArray = Array.isArray;

function isString(val) {
  return typeof val === 'string';
}

function isFunction(val) {
  return typeof val === 'function';
}

function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

function isPlainObject(obj) {
  return isObject(obj) && Object.getPrototypeOf(obj) == Object.prototype;
}

function isBlob(obj) {
  return typeof Blob !== 'undefined' && obj instanceof Blob;
}

function isFormData(obj) {
  return typeof FormData !== 'undefined' && obj instanceof FormData;
}

function when(value, fulfilled, rejected) {

  var promise = PromiseObj.resolve(value);

  if (arguments.length < 2) {
    return promise;
  }

  return promise.then(fulfilled, rejected);
}

function options(fn, obj, opts) {

  opts = opts || {};

  if (isFunction(opts)) {
    opts = opts.call(obj);
  }

  return merge(fn.bind({$vm: obj, $options: opts}), fn, {$options: opts});
}

function each(obj, iterator) {

  var i, key;

  if (isArray(obj)) {
    for (i = 0; i < obj.length; i++) {
      iterator.call(obj[i], obj[i], i);
    }
  } else if (isObject(obj)) {
    for (key in obj) {
      if (hasOwnProperty.call(obj, key)) {
        iterator.call(obj[key], obj[key], key);
      }
    }
  }

  return obj;
}

var assign = Object.assign || _assign;

function merge(target) {

  var args = slice.call(arguments, 1);

  args.forEach(function (source) {
    _merge(target, source, true);
  });

  return target;
}

function defaults(target) {

  var args = slice.call(arguments, 1);

  args.forEach(function (source) {

    for (var key in source) {
      if (target[key] === undefined) {
        target[key] = source[key];
      }
    }

  });

  return target;
}

function _assign(target) {

  var args = slice.call(arguments, 1);

  args.forEach(function (source) {
    _merge(target, source);
  });

  return target;
}

function _merge(target, source, deep) {
  for (var key in source) {
    if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
      if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
        target[key] = {};
      }
      if (isArray(source[key]) && !isArray(target[key])) {
        target[key] = [];
      }
      _merge(target[key], source[key], deep);
    } else if (source[key] !== undefined) {
      target[key] = source[key];
    }
  }
}

/**
 * Root Prefix Transform.
 */

function root (options$$1, next) {

  var url = next(options$$1);

  if (isString(options$$1.root) && !/^(https?:)?\//.test(url)) {
    url = trimEnd(options$$1.root, '/') + '/' + url;
  }

  return url;
}

/**
 * Query Parameter Transform.
 */

function query (options$$1, next) {

  var urlParams = Object.keys(Url.options.params), query = {}, url = next(options$$1);

  each(options$$1.params, function (value, key) {
    if (urlParams.indexOf(key) === -1) {
      query[key] = value;
    }
  });

  query = Url.params(query);

  if (query) {
    url += (url.indexOf('?') == -1 ? '?' : '&') + query;
  }

  return url;
}

/**
 * URL Template v2.0.6 (https://github.com/bramstein/url-template)
 */

function expand(url, params, variables) {

  var tmpl = parse(url), expanded = tmpl.expand(params);

  if (variables) {
    variables.push.apply(variables, tmpl.vars);
  }

  return expanded;
}

function parse(template) {

  var operators = ['+', '#', '.', '/', ';', '?', '&'], variables = [];

  return {
    vars: variables,
    expand: function expand(context) {
      return template.replace(/\{([^{}]+)\}|([^{}]+)/g, function (_, expression, literal) {
        if (expression) {

          var operator = null, values = [];

          if (operators.indexOf(expression.charAt(0)) !== -1) {
            operator = expression.charAt(0);
            expression = expression.substr(1);
          }

          expression.split(/,/g).forEach(function (variable) {
            var tmp = /([^:*]*)(?::(\d+)|(\*))?/.exec(variable);
            values.push.apply(values, getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
            variables.push(tmp[1]);
          });

          if (operator && operator !== '+') {

            var separator = ',';

            if (operator === '?') {
              separator = '&';
            } else if (operator !== '#') {
              separator = operator;
            }

            return (values.length !== 0 ? operator : '') + values.join(separator);
          } else {
            return values.join(',');
          }

        } else {
          return encodeReserved(literal);
        }
      });
    }
  };
}

function getValues(context, operator, key, modifier) {

  var value = context[key], result = [];

  if (isDefined(value) && value !== '') {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      value = value.toString();

      if (modifier && modifier !== '*') {
        value = value.substring(0, parseInt(modifier, 10));
      }

      result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : null));
    } else {
      if (modifier === '*') {
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : null));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              result.push(encodeValue(operator, value[k], k));
            }
          });
        }
      } else {
        var tmp = [];

        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            tmp.push(encodeValue(operator, value));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              tmp.push(encodeURIComponent(k));
              tmp.push(encodeValue(operator, value[k].toString()));
            }
          });
        }

        if (isKeyOperator(operator)) {
          result.push(encodeURIComponent(key) + '=' + tmp.join(','));
        } else if (tmp.length !== 0) {
          result.push(tmp.join(','));
        }
      }
    }
  } else {
    if (operator === ';') {
      result.push(encodeURIComponent(key));
    } else if (value === '' && (operator === '&' || operator === '?')) {
      result.push(encodeURIComponent(key) + '=');
    } else if (value === '') {
      result.push('');
    }
  }

  return result;
}

function isDefined(value) {
  return value !== undefined && value !== null;
}

function isKeyOperator(operator) {
  return operator === ';' || operator === '&' || operator === '?';
}

function encodeValue(operator, value, key) {

  value = (operator === '+' || operator === '#') ? encodeReserved(value) : encodeURIComponent(value);

  if (key) {
    return encodeURIComponent(key) + '=' + value;
  } else {
    return value;
  }
}

function encodeReserved(str) {
  return str.split(/(%[0-9A-Fa-f]{2})/g).map(function (part) {
    if (!/%[0-9A-Fa-f]/.test(part)) {
      part = encodeURI(part);
    }
    return part;
  }).join('');
}

/**
 * URL Template (RFC 6570) Transform.
 */

function template (options) {

  var variables = [], url = expand(options.url, options.params, variables);

  variables.forEach(function (key) {
    delete options.params[key];
  });

  return url;
}

/**
 * Service for URL templating.
 */

function Url(url, params) {

  var self = this || {}, options$$1 = url, transform;

  if (isString(url)) {
    options$$1 = {url: url, params: params};
  }

  options$$1 = merge({}, Url.options, self.$options, options$$1);

  Url.transforms.forEach(function (handler) {

    if (isString(handler)) {
      handler = Url.transform[handler];
    }

    if (isFunction(handler)) {
      transform = factory(handler, transform, self.$vm);
    }

  });

  return transform(options$$1);
}

/**
 * Url options.
 */

Url.options = {
  url: '',
  root: null,
  params: {}
};

/**
 * Url transforms.
 */

Url.transform = {template: template, query: query, root: root};
Url.transforms = ['template', 'query', 'root'];

/**
 * Encodes a Url parameter string.
 *
 * @param {Object} obj
 */

Url.params = function (obj) {

  var params = [], escape = encodeURIComponent;

  params.add = function (key, value) {

    if (isFunction(value)) {
      value = value();
    }

    if (value === null) {
      value = '';
    }

    this.push(escape(key) + '=' + escape(value));
  };

  serialize(params, obj);

  return params.join('&').replace(/%20/g, '+');
};

/**
 * Parse a URL and return its components.
 *
 * @param {String} url
 */

Url.parse = function (url) {

  var el = document.createElement('a');

  if (document.documentMode) {
    el.href = url;
    url = el.href;
  }

  el.href = url;

  return {
    href: el.href,
    protocol: el.protocol ? el.protocol.replace(/:$/, '') : '',
    port: el.port,
    host: el.host,
    hostname: el.hostname,
    pathname: el.pathname.charAt(0) === '/' ? el.pathname : '/' + el.pathname,
    search: el.search ? el.search.replace(/^\?/, '') : '',
    hash: el.hash ? el.hash.replace(/^#/, '') : ''
  };
};

function factory(handler, next, vm) {
  return function (options$$1) {
    return handler.call(vm, options$$1, next);
  };
}

function serialize(params, obj, scope) {

  var array = isArray(obj), plain = isPlainObject(obj), hash;

  each(obj, function (value, key) {

    hash = isObject(value) || isArray(value);

    if (scope) {
      key = scope + '[' + (plain || hash ? key : '') + ']';
    }

    if (!scope && array) {
      params.add(value.name, value.value);
    } else if (hash) {
      serialize(params, value, key);
    } else {
      params.add(key, value);
    }
  });
}

/**
 * XDomain client (Internet Explorer).
 */

function xdrClient (request) {
  return new PromiseObj(function (resolve) {

    var xdr = new XDomainRequest(), handler = function (ref) {
      var type = ref.type;


      var status = 0;

      if (type === 'load') {
        status = 200;
      } else if (type === 'error') {
        status = 500;
      }

      resolve(request.respondWith(xdr.responseText, {status: status}));
    };

    request.abort = function () { return xdr.abort(); };

    xdr.open(request.method, request.getUrl());

    if (request.timeout) {
      xdr.timeout = request.timeout;
    }

    xdr.onload = handler;
    xdr.onabort = handler;
    xdr.onerror = handler;
    xdr.ontimeout = handler;
    xdr.onprogress = function () {};
    xdr.send(request.getBody());
  });
}

/**
 * CORS Interceptor.
 */

var SUPPORTS_CORS = inBrowser && 'withCredentials' in new XMLHttpRequest();

function cors (request) {

  if (inBrowser) {

    var orgUrl = Url.parse(location.href);
    var reqUrl = Url.parse(request.getUrl());

    if (reqUrl.protocol !== orgUrl.protocol || reqUrl.host !== orgUrl.host) {

      request.crossOrigin = true;
      request.emulateHTTP = false;

      if (!SUPPORTS_CORS) {
        request.client = xdrClient;
      }
    }
  }

}

/**
 * Form data Interceptor.
 */

function form (request) {

  if (isFormData(request.body)) {
    request.headers.delete('Content-Type');
  } else if (isObject(request.body) && request.emulateJSON) {
    request.body = Url.params(request.body);
    request.headers.set('Content-Type', 'application/x-www-form-urlencoded');
  }

}

/**
 * JSON Interceptor.
 */

function json (request) {

  var type = request.headers.get('Content-Type') || '';

  if (isObject(request.body) && type.indexOf('application/json') === 0) {
    request.body = JSON.stringify(request.body);
  }

  return function (response) {

    return response.bodyText ? when(response.text(), function (text) {

      var type = response.headers.get('Content-Type') || '';

      if (type.indexOf('application/json') === 0 || isJson(text)) {

        try {
          response.body = JSON.parse(text);
        } catch (e) {
          response.body = null;
        }

      } else {
        response.body = text;
      }

      return response;

    }) : response;

  };
}

function isJson(str) {

  var start = str.match(/^\s*(\[|\{)/);
  var end = {'[': /]\s*$/, '{': /}\s*$/};

  return start && end[start[1]].test(str);
}

/**
 * JSONP client (Browser).
 */

function jsonpClient (request) {
  return new PromiseObj(function (resolve) {

    var name = request.jsonp || 'callback', callback = request.jsonpCallback || '_jsonp' + Math.random().toString(36).substr(2), body = null, handler, script;

    handler = function (ref) {
      var type = ref.type;


      var status = 0;

      if (type === 'load' && body !== null) {
        status = 200;
      } else if (type === 'error') {
        status = 500;
      }

      if (status && window[callback]) {
        delete window[callback];
        document.body.removeChild(script);
      }

      resolve(request.respondWith(body, {status: status}));
    };

    window[callback] = function (result) {
      body = JSON.stringify(result);
    };

    request.abort = function () {
      handler({type: 'abort'});
    };

    request.params[name] = callback;

    if (request.timeout) {
      setTimeout(request.abort, request.timeout);
    }

    script = document.createElement('script');
    script.src = request.getUrl();
    script.type = 'text/javascript';
    script.async = true;
    script.onload = handler;
    script.onerror = handler;

    document.body.appendChild(script);
  });
}

/**
 * JSONP Interceptor.
 */

function jsonp (request) {

  if (request.method == 'JSONP') {
    request.client = jsonpClient;
  }

}

/**
 * Before Interceptor.
 */

function before (request) {

  if (isFunction(request.before)) {
    request.before.call(this, request);
  }

}

/**
 * HTTP method override Interceptor.
 */

function method (request) {

  if (request.emulateHTTP && /^(PUT|PATCH|DELETE)$/i.test(request.method)) {
    request.headers.set('X-HTTP-Method-Override', request.method);
    request.method = 'POST';
  }

}

/**
 * Header Interceptor.
 */

function header (request) {

  var headers = assign({}, Http.headers.common,
    !request.crossOrigin ? Http.headers.custom : {},
    Http.headers[toLower(request.method)]
  );

  each(headers, function (value, name) {
    if (!request.headers.has(name)) {
      request.headers.set(name, value);
    }
  });

}

/**
 * XMLHttp client (Browser).
 */

function xhrClient (request) {
  return new PromiseObj(function (resolve) {

    var xhr = new XMLHttpRequest(), handler = function (event) {

      var response = request.respondWith(
        'response' in xhr ? xhr.response : xhr.responseText, {
          status: xhr.status === 1223 ? 204 : xhr.status, // IE9 status bug
          statusText: xhr.status === 1223 ? 'No Content' : trim(xhr.statusText)
        });

      each(trim(xhr.getAllResponseHeaders()).split('\n'), function (row) {
        response.headers.append(row.slice(0, row.indexOf(':')), row.slice(row.indexOf(':') + 1));
      });

      resolve(response);
    };

    request.abort = function () { return xhr.abort(); };

    xhr.open(request.method, request.getUrl(), true);

    if (request.timeout) {
      xhr.timeout = request.timeout;
    }

    if (request.responseType && 'responseType' in xhr) {
      xhr.responseType = request.responseType;
    }

    if (request.withCredentials || request.credentials) {
      xhr.withCredentials = true;
    }

    if (!request.crossOrigin) {
      request.headers.set('X-Requested-With', 'XMLHttpRequest');
    }

    // deprecated use downloadProgress
    if (isFunction(request.progress) && request.method === 'GET') {
      xhr.addEventListener('progress', request.progress);
    }

    if (isFunction(request.downloadProgress)) {
      xhr.addEventListener('progress', request.downloadProgress);
    }

    // deprecated use uploadProgress
    if (isFunction(request.progress) && /^(POST|PUT)$/i.test(request.method)) {
      xhr.upload.addEventListener('progress', request.progress);
    }

    if (isFunction(request.uploadProgress) && xhr.upload) {
      xhr.upload.addEventListener('progress', request.uploadProgress);
    }

    request.headers.forEach(function (value, name) {
      xhr.setRequestHeader(name, value);
    });

    xhr.onload = handler;
    xhr.onabort = handler;
    xhr.onerror = handler;
    xhr.ontimeout = handler;
    xhr.send(request.getBody());
  });
}

/**
 * Http client (Node).
 */

function nodeClient (request) {

  var client = __webpack_require__(1);

  return new PromiseObj(function (resolve) {

    var url = request.getUrl();
    var body = request.getBody();
    var method = request.method;
    var headers = {}, handler;

    request.headers.forEach(function (value, name) {
      headers[name] = value;
    });

    client(url, {body: body, method: method, headers: headers}).then(handler = function (resp) {

      var response = request.respondWith(resp.body, {
        status: resp.statusCode,
        statusText: trim(resp.statusMessage)
      });

      each(resp.headers, function (value, name) {
        response.headers.set(name, value);
      });

      resolve(response);

    }, function (error$$1) { return handler(error$$1.response); });
  });
}

/**
 * Base client.
 */

function Client (context) {

  var reqHandlers = [sendRequest], resHandlers = [];

  if (!isObject(context)) {
    context = null;
  }

  function Client(request) {
    while (reqHandlers.length) {

      var handler = reqHandlers.pop();

      if (isFunction(handler)) {

        var response = (void 0), next = (void 0);

        response = handler.call(context, request, function (val) { return next = val; }) || next;

        if (isObject(response)) {
          return new PromiseObj(function (resolve, reject) {

            resHandlers.forEach(function (handler) {
              response = when(response, function (response) {
                return handler.call(context, response) || response;
              }, reject);
            });

            when(response, resolve, reject);

          }, context);
        }

        if (isFunction(response)) {
          resHandlers.unshift(response);
        }

      } else {
        warn(("Invalid interceptor of type " + (typeof handler) + ", must be a function"));
      }
    }
  }

  Client.use = function (handler) {
    reqHandlers.push(handler);
  };

  return Client;
}

function sendRequest(request) {

  var client = request.client || (inBrowser ? xhrClient : nodeClient);

  return client(request);
}

/**
 * HTTP Headers.
 */

var Headers = function Headers(headers) {
  var this$1 = this;


  this.map = {};

  each(headers, function (value, name) { return this$1.append(name, value); });
};

Headers.prototype.has = function has (name) {
  return getName(this.map, name) !== null;
};

Headers.prototype.get = function get (name) {

  var list = this.map[getName(this.map, name)];

  return list ? list.join() : null;
};

Headers.prototype.getAll = function getAll (name) {
  return this.map[getName(this.map, name)] || [];
};

Headers.prototype.set = function set (name, value) {
  this.map[normalizeName(getName(this.map, name) || name)] = [trim(value)];
};

Headers.prototype.append = function append (name, value) {

  var list = this.map[getName(this.map, name)];

  if (list) {
    list.push(trim(value));
  } else {
    this.set(name, value);
  }
};

Headers.prototype.delete = function delete$1 (name) {
  delete this.map[getName(this.map, name)];
};

Headers.prototype.deleteAll = function deleteAll () {
  this.map = {};
};

Headers.prototype.forEach = function forEach (callback, thisArg) {
  var this$1 = this;

  each(this.map, function (list, name) {
    each(list, function (value) { return callback.call(thisArg, value, name, this$1); });
  });
};

function getName(map, name) {
  return Object.keys(map).reduce(function (prev, curr) {
    return toLower(name) === toLower(curr) ? curr : prev;
  }, null);
}

function normalizeName(name) {

  if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
    throw new TypeError('Invalid character in header field name');
  }

  return trim(name);
}

/**
 * HTTP Response.
 */

var Response = function Response(body, ref) {
  var url = ref.url;
  var headers = ref.headers;
  var status = ref.status;
  var statusText = ref.statusText;


  this.url = url;
  this.ok = status >= 200 && status < 300;
  this.status = status || 0;
  this.statusText = statusText || '';
  this.headers = new Headers(headers);
  this.body = body;

  if (isString(body)) {

    this.bodyText = body;

  } else if (isBlob(body)) {

    this.bodyBlob = body;

    if (isBlobText(body)) {
      this.bodyText = blobText(body);
    }
  }
};

Response.prototype.blob = function blob () {
  return when(this.bodyBlob);
};

Response.prototype.text = function text () {
  return when(this.bodyText);
};

Response.prototype.json = function json () {
  return when(this.text(), function (text) { return JSON.parse(text); });
};

Object.defineProperty(Response.prototype, 'data', {

  get: function get() {
    return this.body;
  },

  set: function set(body) {
    this.body = body;
  }

});

function blobText(body) {
  return new PromiseObj(function (resolve) {

    var reader = new FileReader();

    reader.readAsText(body);
    reader.onload = function () {
      resolve(reader.result);
    };

  });
}

function isBlobText(body) {
  return body.type.indexOf('text') === 0 || body.type.indexOf('json') !== -1;
}

/**
 * HTTP Request.
 */

var Request = function Request(options$$1) {

  this.body = null;
  this.params = {};

  assign(this, options$$1, {
    method: toUpper(options$$1.method || 'GET')
  });

  if (!(this.headers instanceof Headers)) {
    this.headers = new Headers(this.headers);
  }
};

Request.prototype.getUrl = function getUrl () {
  return Url(this);
};

Request.prototype.getBody = function getBody () {
  return this.body;
};

Request.prototype.respondWith = function respondWith (body, options$$1) {
  return new Response(body, assign(options$$1 || {}, {url: this.getUrl()}));
};

/**
 * Service for sending network requests.
 */

var COMMON_HEADERS = {'Accept': 'application/json, text/plain, */*'};
var JSON_CONTENT_TYPE = {'Content-Type': 'application/json;charset=utf-8'};

function Http(options$$1) {

  var self = this || {}, client = Client(self.$vm);

  defaults(options$$1 || {}, self.$options, Http.options);

  Http.interceptors.forEach(function (handler) {

    if (isString(handler)) {
      handler = Http.interceptor[handler];
    }

    if (isFunction(handler)) {
      client.use(handler);
    }

  });

  return client(new Request(options$$1)).then(function (response) {

    return response.ok ? response : PromiseObj.reject(response);

  }, function (response) {

    if (response instanceof Error) {
      error(response);
    }

    return PromiseObj.reject(response);
  });
}

Http.options = {};

Http.headers = {
  put: JSON_CONTENT_TYPE,
  post: JSON_CONTENT_TYPE,
  patch: JSON_CONTENT_TYPE,
  delete: JSON_CONTENT_TYPE,
  common: COMMON_HEADERS,
  custom: {}
};

Http.interceptor = {before: before, method: method, jsonp: jsonp, json: json, form: form, header: header, cors: cors};
Http.interceptors = ['before', 'method', 'jsonp', 'json', 'form', 'header', 'cors'];

['get', 'delete', 'head', 'jsonp'].forEach(function (method$$1) {

  Http[method$$1] = function (url, options$$1) {
    return this(assign(options$$1 || {}, {url: url, method: method$$1}));
  };

});

['post', 'put', 'patch'].forEach(function (method$$1) {

  Http[method$$1] = function (url, body, options$$1) {
    return this(assign(options$$1 || {}, {url: url, method: method$$1, body: body}));
  };

});

/**
 * Service for interacting with RESTful services.
 */

function Resource(url, params, actions, options$$1) {

  var self = this || {}, resource = {};

  actions = assign({},
    Resource.actions,
    actions
  );

  each(actions, function (action, name) {

    action = merge({url: url, params: assign({}, params)}, options$$1, action);

    resource[name] = function () {
      return (self.$http || Http)(opts(action, arguments));
    };
  });

  return resource;
}

function opts(action, args) {

  var options$$1 = assign({}, action), params = {}, body;

  switch (args.length) {

    case 2:

      params = args[0];
      body = args[1];

      break;

    case 1:

      if (/^(POST|PUT|PATCH)$/i.test(options$$1.method)) {
        body = args[0];
      } else {
        params = args[0];
      }

      break;

    case 0:

      break;

    default:

      throw 'Expected up to 2 arguments [params, body], got ' + args.length + ' arguments';
  }

  options$$1.body = body;
  options$$1.params = assign({}, options$$1.params, params);

  return options$$1;
}

Resource.actions = {

  get: {method: 'GET'},
  save: {method: 'POST'},
  query: {method: 'GET'},
  update: {method: 'PUT'},
  remove: {method: 'DELETE'},
  delete: {method: 'DELETE'}

};

/**
 * Install plugin.
 */

function plugin(Vue) {

  if (plugin.installed) {
    return;
  }

  Util(Vue);

  Vue.url = Url;
  Vue.http = Http;
  Vue.resource = Resource;
  Vue.Promise = PromiseObj;

  Object.defineProperties(Vue.prototype, {

    $url: {
      get: function get() {
        return options(Vue.url, this, this.$options.url);
      }
    },

    $http: {
      get: function get() {
        return options(Vue.http, this, this.$options.http);
      }
    },

    $resource: {
      get: function get() {
        return Vue.resource.bind(this);
      }
    },

    $promise: {
      get: function get() {
        var this$1 = this;

        return function (executor) { return new Vue.Promise(executor, this$1); };
      }
    }

  });
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}

/* harmony default export */ __webpack_exports__["a"] = (plugin);

//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vbm9kZV9tb2R1bGVzL192dWUtcmVzb3VyY2VAMS41LjBAdnVlLXJlc291cmNlL2Rpc3QvdnVlLXJlc291cmNlLmVzbS5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uLi9ub2RlX21vZHVsZXMvX3Z1ZS1yZXNvdXJjZUAxLjUuMEB2dWUtcmVzb3VyY2UvZGlzdC92dWUtcmVzb3VyY2UuZXNtLmpzP2RlMDkiXSwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiB2dWUtcmVzb3VyY2UgdjEuNS4wXG4gKiBodHRwczovL2dpdGh1Yi5jb20vcGFnZWtpdC92dWUtcmVzb3VyY2VcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIFByb21pc2VzL0ErIHBvbHlmaWxsIHYxLjEuNCAoaHR0cHM6Ly9naXRodWIuY29tL2JyYW1zdGVpbi9wcm9taXMpXG4gKi9cblxudmFyIFJFU09MVkVEID0gMDtcbnZhciBSRUpFQ1RFRCA9IDE7XG52YXIgUEVORElORyA9IDI7XG5cbmZ1bmN0aW9uIFByb21pc2UkMShleGVjdXRvcikge1xuXG4gICAgdGhpcy5zdGF0ZSA9IFBFTkRJTkc7XG4gICAgdGhpcy52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmRlZmVycmVkID0gW107XG5cbiAgICB2YXIgcHJvbWlzZSA9IHRoaXM7XG5cbiAgICB0cnkge1xuICAgICAgICBleGVjdXRvcihmdW5jdGlvbiAoeCkge1xuICAgICAgICAgICAgcHJvbWlzZS5yZXNvbHZlKHgpO1xuICAgICAgICB9LCBmdW5jdGlvbiAocikge1xuICAgICAgICAgICAgcHJvbWlzZS5yZWplY3Qocik7XG4gICAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcHJvbWlzZS5yZWplY3QoZSk7XG4gICAgfVxufVxuXG5Qcm9taXNlJDEucmVqZWN0ID0gZnVuY3Rpb24gKHIpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UkMShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHJlamVjdChyKTtcbiAgICB9KTtcbn07XG5cblByb21pc2UkMS5yZXNvbHZlID0gZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UkMShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHJlc29sdmUoeCk7XG4gICAgfSk7XG59O1xuXG5Qcm9taXNlJDEuYWxsID0gZnVuY3Rpb24gYWxsKGl0ZXJhYmxlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlJDEoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICB2YXIgY291bnQgPSAwLCByZXN1bHQgPSBbXTtcblxuICAgICAgICBpZiAoaXRlcmFibGUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiByZXNvbHZlcihpKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbaV0gPSB4O1xuICAgICAgICAgICAgICAgIGNvdW50ICs9IDE7XG5cbiAgICAgICAgICAgICAgICBpZiAoY291bnQgPT09IGl0ZXJhYmxlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXRlcmFibGUubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIFByb21pc2UkMS5yZXNvbHZlKGl0ZXJhYmxlW2ldKS50aGVuKHJlc29sdmVyKGkpLCByZWplY3QpO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG5Qcm9taXNlJDEucmFjZSA9IGZ1bmN0aW9uIHJhY2UoaXRlcmFibGUpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UkMShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXRlcmFibGUubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIFByb21pc2UkMS5yZXNvbHZlKGl0ZXJhYmxlW2ldKS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbnZhciBwID0gUHJvbWlzZSQxLnByb3RvdHlwZTtcblxucC5yZXNvbHZlID0gZnVuY3Rpb24gcmVzb2x2ZSh4KSB7XG4gICAgdmFyIHByb21pc2UgPSB0aGlzO1xuXG4gICAgaWYgKHByb21pc2Uuc3RhdGUgPT09IFBFTkRJTkcpIHtcbiAgICAgICAgaWYgKHggPT09IHByb21pc2UpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Byb21pc2Ugc2V0dGxlZCB3aXRoIGl0c2VsZi4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjYWxsZWQgPSBmYWxzZTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIHRoZW4gPSB4ICYmIHhbJ3RoZW4nXTtcblxuICAgICAgICAgICAgaWYgKHggIT09IG51bGwgJiYgdHlwZW9mIHggPT09ICdvYmplY3QnICYmIHR5cGVvZiB0aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdGhlbi5jYWxsKHgsIGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghY2FsbGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnJlc29sdmUoeCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2FsbGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghY2FsbGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnJlamVjdChyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYWxsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgaWYgKCFjYWxsZWQpIHtcbiAgICAgICAgICAgICAgICBwcm9taXNlLnJlamVjdChlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb21pc2Uuc3RhdGUgPSBSRVNPTFZFRDtcbiAgICAgICAgcHJvbWlzZS52YWx1ZSA9IHg7XG4gICAgICAgIHByb21pc2Uubm90aWZ5KCk7XG4gICAgfVxufTtcblxucC5yZWplY3QgPSBmdW5jdGlvbiByZWplY3QocmVhc29uKSB7XG4gICAgdmFyIHByb21pc2UgPSB0aGlzO1xuXG4gICAgaWYgKHByb21pc2Uuc3RhdGUgPT09IFBFTkRJTkcpIHtcbiAgICAgICAgaWYgKHJlYXNvbiA9PT0gcHJvbWlzZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUHJvbWlzZSBzZXR0bGVkIHdpdGggaXRzZWxmLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvbWlzZS5zdGF0ZSA9IFJFSkVDVEVEO1xuICAgICAgICBwcm9taXNlLnZhbHVlID0gcmVhc29uO1xuICAgICAgICBwcm9taXNlLm5vdGlmeSgpO1xuICAgIH1cbn07XG5cbnAubm90aWZ5ID0gZnVuY3Rpb24gbm90aWZ5KCkge1xuICAgIHZhciBwcm9taXNlID0gdGhpcztcblxuICAgIG5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHByb21pc2Uuc3RhdGUgIT09IFBFTkRJTkcpIHtcbiAgICAgICAgICAgIHdoaWxlIChwcm9taXNlLmRlZmVycmVkLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9IHByb21pc2UuZGVmZXJyZWQuc2hpZnQoKSxcbiAgICAgICAgICAgICAgICAgICAgb25SZXNvbHZlZCA9IGRlZmVycmVkWzBdLFxuICAgICAgICAgICAgICAgICAgICBvblJlamVjdGVkID0gZGVmZXJyZWRbMV0sXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUgPSBkZWZlcnJlZFsyXSxcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0ID0gZGVmZXJyZWRbM107XG5cbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZS5zdGF0ZSA9PT0gUkVTT0xWRUQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb25SZXNvbHZlZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob25SZXNvbHZlZC5jYWxsKHVuZGVmaW5lZCwgcHJvbWlzZS52YWx1ZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHByb21pc2UudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb21pc2Uuc3RhdGUgPT09IFJFSkVDVEVEKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9uUmVqZWN0ZWQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9uUmVqZWN0ZWQuY2FsbCh1bmRlZmluZWQsIHByb21pc2UudmFsdWUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHByb21pc2UudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG5wLnRoZW4gPSBmdW5jdGlvbiB0aGVuKG9uUmVzb2x2ZWQsIG9uUmVqZWN0ZWQpIHtcbiAgICB2YXIgcHJvbWlzZSA9IHRoaXM7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UkMShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHByb21pc2UuZGVmZXJyZWQucHVzaChbb25SZXNvbHZlZCwgb25SZWplY3RlZCwgcmVzb2x2ZSwgcmVqZWN0XSk7XG4gICAgICAgIHByb21pc2Uubm90aWZ5KCk7XG4gICAgfSk7XG59O1xuXG5wLmNhdGNoID0gZnVuY3Rpb24gKG9uUmVqZWN0ZWQpIHtcbiAgICByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgb25SZWplY3RlZCk7XG59O1xuXG4vKipcbiAqIFByb21pc2UgYWRhcHRlci5cbiAqL1xuXG5pZiAodHlwZW9mIFByb21pc2UgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgd2luZG93LlByb21pc2UgPSBQcm9taXNlJDE7XG59XG5cbmZ1bmN0aW9uIFByb21pc2VPYmooZXhlY3V0b3IsIGNvbnRleHQpIHtcblxuICAgIGlmIChleGVjdXRvciBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgdGhpcy5wcm9taXNlID0gZXhlY3V0b3I7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoZXhlY3V0b3IuYmluZChjb250ZXh0KSk7XG4gICAgfVxuXG4gICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbn1cblxuUHJvbWlzZU9iai5hbGwgPSBmdW5jdGlvbiAoaXRlcmFibGUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2VPYmooUHJvbWlzZS5hbGwoaXRlcmFibGUpLCBjb250ZXh0KTtcbn07XG5cblByb21pc2VPYmoucmVzb2x2ZSA9IGZ1bmN0aW9uICh2YWx1ZSwgY29udGV4dCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZU9iaihQcm9taXNlLnJlc29sdmUodmFsdWUpLCBjb250ZXh0KTtcbn07XG5cblByb21pc2VPYmoucmVqZWN0ID0gZnVuY3Rpb24gKHJlYXNvbiwgY29udGV4dCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZU9iaihQcm9taXNlLnJlamVjdChyZWFzb24pLCBjb250ZXh0KTtcbn07XG5cblByb21pc2VPYmoucmFjZSA9IGZ1bmN0aW9uIChpdGVyYWJsZSwgY29udGV4dCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZU9iaihQcm9taXNlLnJhY2UoaXRlcmFibGUpLCBjb250ZXh0KTtcbn07XG5cbnZhciBwJDEgPSBQcm9taXNlT2JqLnByb3RvdHlwZTtcblxucCQxLmJpbmQgPSBmdW5jdGlvbiAoY29udGV4dCkge1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5wJDEudGhlbiA9IGZ1bmN0aW9uIChmdWxmaWxsZWQsIHJlamVjdGVkKSB7XG5cbiAgICBpZiAoZnVsZmlsbGVkICYmIGZ1bGZpbGxlZC5iaW5kICYmIHRoaXMuY29udGV4dCkge1xuICAgICAgICBmdWxmaWxsZWQgPSBmdWxmaWxsZWQuYmluZCh0aGlzLmNvbnRleHQpO1xuICAgIH1cblxuICAgIGlmIChyZWplY3RlZCAmJiByZWplY3RlZC5iaW5kICYmIHRoaXMuY29udGV4dCkge1xuICAgICAgICByZWplY3RlZCA9IHJlamVjdGVkLmJpbmQodGhpcy5jb250ZXh0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2VPYmoodGhpcy5wcm9taXNlLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCksIHRoaXMuY29udGV4dCk7XG59O1xuXG5wJDEuY2F0Y2ggPSBmdW5jdGlvbiAocmVqZWN0ZWQpIHtcblxuICAgIGlmIChyZWplY3RlZCAmJiByZWplY3RlZC5iaW5kICYmIHRoaXMuY29udGV4dCkge1xuICAgICAgICByZWplY3RlZCA9IHJlamVjdGVkLmJpbmQodGhpcy5jb250ZXh0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2VPYmoodGhpcy5wcm9taXNlLmNhdGNoKHJlamVjdGVkKSwgdGhpcy5jb250ZXh0KTtcbn07XG5cbnAkMS5maW5hbGx5ID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG5cbiAgICByZXR1cm4gdGhpcy50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXMpO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXMpO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVhc29uKTtcbiAgICB9XG4gICAgKTtcbn07XG5cbi8qKlxuICogVXRpbGl0eSBmdW5jdGlvbnMuXG4gKi9cblxudmFyIHJlZiA9IHt9O1xudmFyIGhhc093blByb3BlcnR5ID0gcmVmLmhhc093blByb3BlcnR5O1xudmFyIHJlZiQxID0gW107XG52YXIgc2xpY2UgPSByZWYkMS5zbGljZTtcbnZhciBkZWJ1ZyA9IGZhbHNlLCBudGljaztcblxudmFyIGluQnJvd3NlciA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnO1xuXG5mdW5jdGlvbiBVdGlsIChyZWYpIHtcbiAgICB2YXIgY29uZmlnID0gcmVmLmNvbmZpZztcbiAgICB2YXIgbmV4dFRpY2sgPSByZWYubmV4dFRpY2s7XG5cbiAgICBudGljayA9IG5leHRUaWNrO1xuICAgIGRlYnVnID0gY29uZmlnLmRlYnVnIHx8ICFjb25maWcuc2lsZW50O1xufVxuXG5mdW5jdGlvbiB3YXJuKG1zZykge1xuICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgZGVidWcpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdbVnVlUmVzb3VyY2Ugd2Fybl06ICcgKyBtc2cpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZXJyb3IobXNnKSB7XG4gICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBuZXh0VGljayhjYiwgY3R4KSB7XG4gICAgcmV0dXJuIG50aWNrKGNiLCBjdHgpO1xufVxuXG5mdW5jdGlvbiB0cmltKHN0cikge1xuICAgIHJldHVybiBzdHIgPyBzdHIucmVwbGFjZSgvXlxccyp8XFxzKiQvZywgJycpIDogJyc7XG59XG5cbmZ1bmN0aW9uIHRyaW1FbmQoc3RyLCBjaGFycykge1xuXG4gICAgaWYgKHN0ciAmJiBjaGFycyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvXFxzKyQvLCAnJyk7XG4gICAgfVxuXG4gICAgaWYgKCFzdHIgfHwgIWNoYXJzKSB7XG4gICAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKG5ldyBSZWdFeHAoKFwiW1wiICsgY2hhcnMgKyBcIl0rJFwiKSksICcnKTtcbn1cblxuZnVuY3Rpb24gdG9Mb3dlcihzdHIpIHtcbiAgICByZXR1cm4gc3RyID8gc3RyLnRvTG93ZXJDYXNlKCkgOiAnJztcbn1cblxuZnVuY3Rpb24gdG9VcHBlcihzdHIpIHtcbiAgICByZXR1cm4gc3RyID8gc3RyLnRvVXBwZXJDYXNlKCkgOiAnJztcbn1cblxudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuXG5mdW5jdGlvbiBpc1N0cmluZyh2YWwpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZyc7XG59XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xuICAgIHJldHVybiBvYmogIT09IG51bGwgJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCc7XG59XG5cbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3Qob2JqKSB7XG4gICAgcmV0dXJuIGlzT2JqZWN0KG9iaikgJiYgT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaikgPT0gT2JqZWN0LnByb3RvdHlwZTtcbn1cblxuZnVuY3Rpb24gaXNCbG9iKG9iaikge1xuICAgIHJldHVybiB0eXBlb2YgQmxvYiAhPT0gJ3VuZGVmaW5lZCcgJiYgb2JqIGluc3RhbmNlb2YgQmxvYjtcbn1cblxuZnVuY3Rpb24gaXNGb3JtRGF0YShvYmopIHtcbiAgICByZXR1cm4gdHlwZW9mIEZvcm1EYXRhICE9PSAndW5kZWZpbmVkJyAmJiBvYmogaW5zdGFuY2VvZiBGb3JtRGF0YTtcbn1cblxuZnVuY3Rpb24gd2hlbih2YWx1ZSwgZnVsZmlsbGVkLCByZWplY3RlZCkge1xuXG4gICAgdmFyIHByb21pc2UgPSBQcm9taXNlT2JqLnJlc29sdmUodmFsdWUpO1xuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cblxuICAgIHJldHVybiBwcm9taXNlLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7XG59XG5cbmZ1bmN0aW9uIG9wdGlvbnMoZm4sIG9iaiwgb3B0cykge1xuXG4gICAgb3B0cyA9IG9wdHMgfHwge307XG5cbiAgICBpZiAoaXNGdW5jdGlvbihvcHRzKSkge1xuICAgICAgICBvcHRzID0gb3B0cy5jYWxsKG9iaik7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1lcmdlKGZuLmJpbmQoeyR2bTogb2JqLCAkb3B0aW9uczogb3B0c30pLCBmbiwgeyRvcHRpb25zOiBvcHRzfSk7XG59XG5cbmZ1bmN0aW9uIGVhY2gob2JqLCBpdGVyYXRvcikge1xuXG4gICAgdmFyIGksIGtleTtcblxuICAgIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG9iai5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaXRlcmF0b3IuY2FsbChvYmpbaV0sIG9ialtpXSwgaSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KG9iaikpIHtcbiAgICAgICAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgICAgICAgICAgICBpdGVyYXRvci5jYWxsKG9ialtrZXldLCBvYmpba2V5XSwga2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvYmo7XG59XG5cbnZhciBhc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IF9hc3NpZ247XG5cbmZ1bmN0aW9uIG1lcmdlKHRhcmdldCkge1xuXG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgICBhcmdzLmZvckVhY2goZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgICAgICBfbWVyZ2UodGFyZ2V0LCBzb3VyY2UsIHRydWUpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRhcmdldDtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdHModGFyZ2V0KSB7XG5cbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgIGFyZ3MuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlKSB7XG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICAgICAgaWYgKHRhcmdldFtrZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9KTtcblxuICAgIHJldHVybiB0YXJnZXQ7XG59XG5cbmZ1bmN0aW9uIF9hc3NpZ24odGFyZ2V0KSB7XG5cbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgIGFyZ3MuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgICAgIF9tZXJnZSh0YXJnZXQsIHNvdXJjZSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xufVxuXG5mdW5jdGlvbiBfbWVyZ2UodGFyZ2V0LCBzb3VyY2UsIGRlZXApIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICAgIGlmIChkZWVwICYmIChpc1BsYWluT2JqZWN0KHNvdXJjZVtrZXldKSB8fCBpc0FycmF5KHNvdXJjZVtrZXldKSkpIHtcbiAgICAgICAgICAgIGlmIChpc1BsYWluT2JqZWN0KHNvdXJjZVtrZXldKSAmJiAhaXNQbGFpbk9iamVjdCh0YXJnZXRba2V5XSkpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHt9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzQXJyYXkoc291cmNlW2tleV0pICYmICFpc0FycmF5KHRhcmdldFtrZXldKSkge1xuICAgICAgICAgICAgICAgIHRhcmdldFtrZXldID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfbWVyZ2UodGFyZ2V0W2tleV0sIHNvdXJjZVtrZXldLCBkZWVwKTtcbiAgICAgICAgfSBlbHNlIGlmIChzb3VyY2Vba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIFJvb3QgUHJlZml4IFRyYW5zZm9ybS5cbiAqL1xuXG5mdW5jdGlvbiByb290IChvcHRpb25zJCQxLCBuZXh0KSB7XG5cbiAgICB2YXIgdXJsID0gbmV4dChvcHRpb25zJCQxKTtcblxuICAgIGlmIChpc1N0cmluZyhvcHRpb25zJCQxLnJvb3QpICYmICEvXihodHRwcz86KT9cXC8vLnRlc3QodXJsKSkge1xuICAgICAgICB1cmwgPSB0cmltRW5kKG9wdGlvbnMkJDEucm9vdCwgJy8nKSArICcvJyArIHVybDtcbiAgICB9XG5cbiAgICByZXR1cm4gdXJsO1xufVxuXG4vKipcbiAqIFF1ZXJ5IFBhcmFtZXRlciBUcmFuc2Zvcm0uXG4gKi9cblxuZnVuY3Rpb24gcXVlcnkgKG9wdGlvbnMkJDEsIG5leHQpIHtcblxuICAgIHZhciB1cmxQYXJhbXMgPSBPYmplY3Qua2V5cyhVcmwub3B0aW9ucy5wYXJhbXMpLCBxdWVyeSA9IHt9LCB1cmwgPSBuZXh0KG9wdGlvbnMkJDEpO1xuXG4gICAgZWFjaChvcHRpb25zJCQxLnBhcmFtcywgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgaWYgKHVybFBhcmFtcy5pbmRleE9mKGtleSkgPT09IC0xKSB7XG4gICAgICAgICAgICBxdWVyeVtrZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHF1ZXJ5ID0gVXJsLnBhcmFtcyhxdWVyeSk7XG5cbiAgICBpZiAocXVlcnkpIHtcbiAgICAgICAgdXJsICs9ICh1cmwuaW5kZXhPZignPycpID09IC0xID8gJz8nIDogJyYnKSArIHF1ZXJ5O1xuICAgIH1cblxuICAgIHJldHVybiB1cmw7XG59XG5cbi8qKlxuICogVVJMIFRlbXBsYXRlIHYyLjAuNiAoaHR0cHM6Ly9naXRodWIuY29tL2JyYW1zdGVpbi91cmwtdGVtcGxhdGUpXG4gKi9cblxuZnVuY3Rpb24gZXhwYW5kKHVybCwgcGFyYW1zLCB2YXJpYWJsZXMpIHtcblxuICAgIHZhciB0bXBsID0gcGFyc2UodXJsKSwgZXhwYW5kZWQgPSB0bXBsLmV4cGFuZChwYXJhbXMpO1xuXG4gICAgaWYgKHZhcmlhYmxlcykge1xuICAgICAgICB2YXJpYWJsZXMucHVzaC5hcHBseSh2YXJpYWJsZXMsIHRtcGwudmFycyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGV4cGFuZGVkO1xufVxuXG5mdW5jdGlvbiBwYXJzZSh0ZW1wbGF0ZSkge1xuXG4gICAgdmFyIG9wZXJhdG9ycyA9IFsnKycsICcjJywgJy4nLCAnLycsICc7JywgJz8nLCAnJiddLCB2YXJpYWJsZXMgPSBbXTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHZhcnM6IHZhcmlhYmxlcyxcbiAgICAgICAgZXhwYW5kOiBmdW5jdGlvbiBleHBhbmQoY29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlLnJlcGxhY2UoL1xceyhbXnt9XSspXFx9fChbXnt9XSspL2csIGZ1bmN0aW9uIChfLCBleHByZXNzaW9uLCBsaXRlcmFsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV4cHJlc3Npb24pIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgb3BlcmF0b3IgPSBudWxsLCB2YWx1ZXMgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAob3BlcmF0b3JzLmluZGV4T2YoZXhwcmVzc2lvbi5jaGFyQXQoMCkpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0b3IgPSBleHByZXNzaW9uLmNoYXJBdCgwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb24gPSBleHByZXNzaW9uLnN1YnN0cigxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb24uc3BsaXQoLywvZykuZm9yRWFjaChmdW5jdGlvbiAodmFyaWFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0bXAgPSAvKFteOipdKikoPzo6KFxcZCspfChcXCopKT8vLmV4ZWModmFyaWFibGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzLnB1c2guYXBwbHkodmFsdWVzLCBnZXRWYWx1ZXMoY29udGV4dCwgb3BlcmF0b3IsIHRtcFsxXSwgdG1wWzJdIHx8IHRtcFszXSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFibGVzLnB1c2godG1wWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wZXJhdG9yICYmIG9wZXJhdG9yICE9PSAnKycpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNlcGFyYXRvciA9ICcsJztcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wZXJhdG9yID09PSAnPycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXBhcmF0b3IgPSAnJic7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdG9yICE9PSAnIycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXBhcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICh2YWx1ZXMubGVuZ3RoICE9PSAwID8gb3BlcmF0b3IgOiAnJykgKyB2YWx1ZXMuam9pbihzZXBhcmF0b3IpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlcy5qb2luKCcsJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbmNvZGVSZXNlcnZlZChsaXRlcmFsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGdldFZhbHVlcyhjb250ZXh0LCBvcGVyYXRvciwga2V5LCBtb2RpZmllcikge1xuXG4gICAgdmFyIHZhbHVlID0gY29udGV4dFtrZXldLCByZXN1bHQgPSBbXTtcblxuICAgIGlmIChpc0RlZmluZWQodmFsdWUpICYmIHZhbHVlICE9PSAnJykge1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgIGlmIChtb2RpZmllciAmJiBtb2RpZmllciAhPT0gJyonKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5zdWJzdHJpbmcoMCwgcGFyc2VJbnQobW9kaWZpZXIsIDEwKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGVuY29kZVZhbHVlKG9wZXJhdG9yLCB2YWx1ZSwgaXNLZXlPcGVyYXRvcihvcGVyYXRvcikgPyBrZXkgOiBudWxsKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobW9kaWZpZXIgPT09ICcqJykge1xuICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZS5maWx0ZXIoaXNEZWZpbmVkKS5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goZW5jb2RlVmFsdWUob3BlcmF0b3IsIHZhbHVlLCBpc0tleU9wZXJhdG9yKG9wZXJhdG9yKSA/IGtleSA6IG51bGwpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXModmFsdWUpLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0RlZmluZWQodmFsdWVba10pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goZW5jb2RlVmFsdWUob3BlcmF0b3IsIHZhbHVlW2tdLCBrKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIHRtcCA9IFtdO1xuXG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLmZpbHRlcihpc0RlZmluZWQpLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0bXAucHVzaChlbmNvZGVWYWx1ZShvcGVyYXRvciwgdmFsdWUpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXModmFsdWUpLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0RlZmluZWQodmFsdWVba10pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG1wLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGspKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0bXAucHVzaChlbmNvZGVWYWx1ZShvcGVyYXRvciwgdmFsdWVba10udG9TdHJpbmcoKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoaXNLZXlPcGVyYXRvcihvcGVyYXRvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyAnPScgKyB0bXAuam9pbignLCcpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRtcC5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godG1wLmpvaW4oJywnKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKG9wZXJhdG9yID09PSAnOycpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpKTtcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJycgJiYgKG9wZXJhdG9yID09PSAnJicgfHwgb3BlcmF0b3IgPT09ICc/JykpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgJz0nKTtcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJycpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKCcnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGlzRGVmaW5lZCh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc0tleU9wZXJhdG9yKG9wZXJhdG9yKSB7XG4gICAgcmV0dXJuIG9wZXJhdG9yID09PSAnOycgfHwgb3BlcmF0b3IgPT09ICcmJyB8fCBvcGVyYXRvciA9PT0gJz8nO1xufVxuXG5mdW5jdGlvbiBlbmNvZGVWYWx1ZShvcGVyYXRvciwgdmFsdWUsIGtleSkge1xuXG4gICAgdmFsdWUgPSAob3BlcmF0b3IgPT09ICcrJyB8fCBvcGVyYXRvciA9PT0gJyMnKSA/IGVuY29kZVJlc2VydmVkKHZhbHVlKSA6IGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSk7XG5cbiAgICBpZiAoa2V5KSB7XG4gICAgICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoa2V5KSArICc9JyArIHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGVuY29kZVJlc2VydmVkKHN0cikge1xuICAgIHJldHVybiBzdHIuc3BsaXQoLyglWzAtOUEtRmEtZl17Mn0pL2cpLm1hcChmdW5jdGlvbiAocGFydCkge1xuICAgICAgICBpZiAoIS8lWzAtOUEtRmEtZl0vLnRlc3QocGFydCkpIHtcbiAgICAgICAgICAgIHBhcnQgPSBlbmNvZGVVUkkocGFydCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhcnQ7XG4gICAgfSkuam9pbignJyk7XG59XG5cbi8qKlxuICogVVJMIFRlbXBsYXRlIChSRkMgNjU3MCkgVHJhbnNmb3JtLlxuICovXG5cbmZ1bmN0aW9uIHRlbXBsYXRlIChvcHRpb25zKSB7XG5cbiAgICB2YXIgdmFyaWFibGVzID0gW10sIHVybCA9IGV4cGFuZChvcHRpb25zLnVybCwgb3B0aW9ucy5wYXJhbXMsIHZhcmlhYmxlcyk7XG5cbiAgICB2YXJpYWJsZXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGRlbGV0ZSBvcHRpb25zLnBhcmFtc1trZXldO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHVybDtcbn1cblxuLyoqXG4gKiBTZXJ2aWNlIGZvciBVUkwgdGVtcGxhdGluZy5cbiAqL1xuXG5mdW5jdGlvbiBVcmwodXJsLCBwYXJhbXMpIHtcblxuICAgIHZhciBzZWxmID0gdGhpcyB8fCB7fSwgb3B0aW9ucyQkMSA9IHVybCwgdHJhbnNmb3JtO1xuXG4gICAgaWYgKGlzU3RyaW5nKHVybCkpIHtcbiAgICAgICAgb3B0aW9ucyQkMSA9IHt1cmw6IHVybCwgcGFyYW1zOiBwYXJhbXN9O1xuICAgIH1cblxuICAgIG9wdGlvbnMkJDEgPSBtZXJnZSh7fSwgVXJsLm9wdGlvbnMsIHNlbGYuJG9wdGlvbnMsIG9wdGlvbnMkJDEpO1xuXG4gICAgVXJsLnRyYW5zZm9ybXMuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlcikge1xuXG4gICAgICAgIGlmIChpc1N0cmluZyhoYW5kbGVyKSkge1xuICAgICAgICAgICAgaGFuZGxlciA9IFVybC50cmFuc2Zvcm1baGFuZGxlcl07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgICAgICAgICAgdHJhbnNmb3JtID0gZmFjdG9yeShoYW5kbGVyLCB0cmFuc2Zvcm0sIHNlbGYuJHZtKTtcbiAgICAgICAgfVxuXG4gICAgfSk7XG5cbiAgICByZXR1cm4gdHJhbnNmb3JtKG9wdGlvbnMkJDEpO1xufVxuXG4vKipcbiAqIFVybCBvcHRpb25zLlxuICovXG5cblVybC5vcHRpb25zID0ge1xuICAgIHVybDogJycsXG4gICAgcm9vdDogbnVsbCxcbiAgICBwYXJhbXM6IHt9XG59O1xuXG4vKipcbiAqIFVybCB0cmFuc2Zvcm1zLlxuICovXG5cblVybC50cmFuc2Zvcm0gPSB7dGVtcGxhdGU6IHRlbXBsYXRlLCBxdWVyeTogcXVlcnksIHJvb3Q6IHJvb3R9O1xuVXJsLnRyYW5zZm9ybXMgPSBbJ3RlbXBsYXRlJywgJ3F1ZXJ5JywgJ3Jvb3QnXTtcblxuLyoqXG4gKiBFbmNvZGVzIGEgVXJsIHBhcmFtZXRlciBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICovXG5cblVybC5wYXJhbXMgPSBmdW5jdGlvbiAob2JqKSB7XG5cbiAgICB2YXIgcGFyYW1zID0gW10sIGVzY2FwZSA9IGVuY29kZVVSSUNvbXBvbmVudDtcblxuICAgIHBhcmFtcy5hZGQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuXG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgICB2YWx1ZSA9ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wdXNoKGVzY2FwZShrZXkpICsgJz0nICsgZXNjYXBlKHZhbHVlKSk7XG4gICAgfTtcblxuICAgIHNlcmlhbGl6ZShwYXJhbXMsIG9iaik7XG5cbiAgICByZXR1cm4gcGFyYW1zLmpvaW4oJyYnKS5yZXBsYWNlKC8lMjAvZywgJysnKTtcbn07XG5cbi8qKlxuICogUGFyc2UgYSBVUkwgYW5kIHJldHVybiBpdHMgY29tcG9uZW50cy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKi9cblxuVXJsLnBhcnNlID0gZnVuY3Rpb24gKHVybCkge1xuXG4gICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuXG4gICAgaWYgKGRvY3VtZW50LmRvY3VtZW50TW9kZSkge1xuICAgICAgICBlbC5ocmVmID0gdXJsO1xuICAgICAgICB1cmwgPSBlbC5ocmVmO1xuICAgIH1cblxuICAgIGVsLmhyZWYgPSB1cmw7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBocmVmOiBlbC5ocmVmLFxuICAgICAgICBwcm90b2NvbDogZWwucHJvdG9jb2wgPyBlbC5wcm90b2NvbC5yZXBsYWNlKC86JC8sICcnKSA6ICcnLFxuICAgICAgICBwb3J0OiBlbC5wb3J0LFxuICAgICAgICBob3N0OiBlbC5ob3N0LFxuICAgICAgICBob3N0bmFtZTogZWwuaG9zdG5hbWUsXG4gICAgICAgIHBhdGhuYW1lOiBlbC5wYXRobmFtZS5jaGFyQXQoMCkgPT09ICcvJyA/IGVsLnBhdGhuYW1lIDogJy8nICsgZWwucGF0aG5hbWUsXG4gICAgICAgIHNlYXJjaDogZWwuc2VhcmNoID8gZWwuc2VhcmNoLnJlcGxhY2UoL15cXD8vLCAnJykgOiAnJyxcbiAgICAgICAgaGFzaDogZWwuaGFzaCA/IGVsLmhhc2gucmVwbGFjZSgvXiMvLCAnJykgOiAnJ1xuICAgIH07XG59O1xuXG5mdW5jdGlvbiBmYWN0b3J5KGhhbmRsZXIsIG5leHQsIHZtKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvcHRpb25zJCQxKSB7XG4gICAgICAgIHJldHVybiBoYW5kbGVyLmNhbGwodm0sIG9wdGlvbnMkJDEsIG5leHQpO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZShwYXJhbXMsIG9iaiwgc2NvcGUpIHtcblxuICAgIHZhciBhcnJheSA9IGlzQXJyYXkob2JqKSwgcGxhaW4gPSBpc1BsYWluT2JqZWN0KG9iaiksIGhhc2g7XG5cbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcblxuICAgICAgICBoYXNoID0gaXNPYmplY3QodmFsdWUpIHx8IGlzQXJyYXkodmFsdWUpO1xuXG4gICAgICAgIGlmIChzY29wZSkge1xuICAgICAgICAgICAga2V5ID0gc2NvcGUgKyAnWycgKyAocGxhaW4gfHwgaGFzaCA/IGtleSA6ICcnKSArICddJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc2NvcGUgJiYgYXJyYXkpIHtcbiAgICAgICAgICAgIHBhcmFtcy5hZGQodmFsdWUubmFtZSwgdmFsdWUudmFsdWUpO1xuICAgICAgICB9IGVsc2UgaWYgKGhhc2gpIHtcbiAgICAgICAgICAgIHNlcmlhbGl6ZShwYXJhbXMsIHZhbHVlLCBrZXkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFyYW1zLmFkZChrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG4vKipcbiAqIFhEb21haW4gY2xpZW50IChJbnRlcm5ldCBFeHBsb3JlcikuXG4gKi9cblxuZnVuY3Rpb24geGRyQ2xpZW50IChyZXF1ZXN0KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlT2JqKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG5cbiAgICAgICAgdmFyIHhkciA9IG5ldyBYRG9tYWluUmVxdWVzdCgpLCBoYW5kbGVyID0gZnVuY3Rpb24gKHJlZikge1xuICAgICAgICAgICAgICAgIHZhciB0eXBlID0gcmVmLnR5cGU7XG5cblxuICAgICAgICAgICAgICAgIHZhciBzdGF0dXMgPSAwO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdsb2FkJykge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMgPSAyMDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cyA9IDUwMDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlcXVlc3QucmVzcG9uZFdpdGgoeGRyLnJlc3BvbnNlVGV4dCwge3N0YXR1czogc3RhdHVzfSkpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICByZXF1ZXN0LmFib3J0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4geGRyLmFib3J0KCk7IH07XG5cbiAgICAgICAgeGRyLm9wZW4ocmVxdWVzdC5tZXRob2QsIHJlcXVlc3QuZ2V0VXJsKCkpO1xuXG4gICAgICAgIGlmIChyZXF1ZXN0LnRpbWVvdXQpIHtcbiAgICAgICAgICAgIHhkci50aW1lb3V0ID0gcmVxdWVzdC50aW1lb3V0O1xuICAgICAgICB9XG5cbiAgICAgICAgeGRyLm9ubG9hZCA9IGhhbmRsZXI7XG4gICAgICAgIHhkci5vbmFib3J0ID0gaGFuZGxlcjtcbiAgICAgICAgeGRyLm9uZXJyb3IgPSBoYW5kbGVyO1xuICAgICAgICB4ZHIub250aW1lb3V0ID0gaGFuZGxlcjtcbiAgICAgICAgeGRyLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgeGRyLnNlbmQocmVxdWVzdC5nZXRCb2R5KCkpO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIENPUlMgSW50ZXJjZXB0b3IuXG4gKi9cblxudmFyIFNVUFBPUlRTX0NPUlMgPSBpbkJyb3dzZXIgJiYgJ3dpdGhDcmVkZW50aWFscycgaW4gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbmZ1bmN0aW9uIGNvcnMgKHJlcXVlc3QpIHtcblxuICAgIGlmIChpbkJyb3dzZXIpIHtcblxuICAgICAgICB2YXIgb3JnVXJsID0gVXJsLnBhcnNlKGxvY2F0aW9uLmhyZWYpO1xuICAgICAgICB2YXIgcmVxVXJsID0gVXJsLnBhcnNlKHJlcXVlc3QuZ2V0VXJsKCkpO1xuXG4gICAgICAgIGlmIChyZXFVcmwucHJvdG9jb2wgIT09IG9yZ1VybC5wcm90b2NvbCB8fCByZXFVcmwuaG9zdCAhPT0gb3JnVXJsLmhvc3QpIHtcblxuICAgICAgICAgICAgcmVxdWVzdC5jcm9zc09yaWdpbiA9IHRydWU7XG4gICAgICAgICAgICByZXF1ZXN0LmVtdWxhdGVIVFRQID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGlmICghU1VQUE9SVFNfQ09SUykge1xuICAgICAgICAgICAgICAgIHJlcXVlc3QuY2xpZW50ID0geGRyQ2xpZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG59XG5cbi8qKlxuICogRm9ybSBkYXRhIEludGVyY2VwdG9yLlxuICovXG5cbmZ1bmN0aW9uIGZvcm0gKHJlcXVlc3QpIHtcblxuICAgIGlmIChpc0Zvcm1EYXRhKHJlcXVlc3QuYm9keSkpIHtcbiAgICAgICAgcmVxdWVzdC5oZWFkZXJzLmRlbGV0ZSgnQ29udGVudC1UeXBlJyk7XG4gICAgfSBlbHNlIGlmIChpc09iamVjdChyZXF1ZXN0LmJvZHkpICYmIHJlcXVlc3QuZW11bGF0ZUpTT04pIHtcbiAgICAgICAgcmVxdWVzdC5ib2R5ID0gVXJsLnBhcmFtcyhyZXF1ZXN0LmJvZHkpO1xuICAgICAgICByZXF1ZXN0LmhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XG4gICAgfVxuXG59XG5cbi8qKlxuICogSlNPTiBJbnRlcmNlcHRvci5cbiAqL1xuXG5mdW5jdGlvbiBqc29uIChyZXF1ZXN0KSB7XG5cbiAgICB2YXIgdHlwZSA9IHJlcXVlc3QuaGVhZGVycy5nZXQoJ0NvbnRlbnQtVHlwZScpIHx8ICcnO1xuXG4gICAgaWYgKGlzT2JqZWN0KHJlcXVlc3QuYm9keSkgJiYgdHlwZS5pbmRleE9mKCdhcHBsaWNhdGlvbi9qc29uJykgPT09IDApIHtcbiAgICAgICAgcmVxdWVzdC5ib2R5ID0gSlNPTi5zdHJpbmdpZnkocmVxdWVzdC5ib2R5KTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmJvZHlUZXh0ID8gd2hlbihyZXNwb25zZS50ZXh0KCksIGZ1bmN0aW9uICh0ZXh0KSB7XG5cbiAgICAgICAgICAgIHZhciB0eXBlID0gcmVzcG9uc2UuaGVhZGVycy5nZXQoJ0NvbnRlbnQtVHlwZScpIHx8ICcnO1xuXG4gICAgICAgICAgICBpZiAodHlwZS5pbmRleE9mKCdhcHBsaWNhdGlvbi9qc29uJykgPT09IDAgfHwgaXNKc29uKHRleHQpKSB7XG5cbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5ib2R5ID0gSlNPTi5wYXJzZSh0ZXh0KTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLmJvZHkgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXNwb25zZS5ib2R5ID0gdGV4dDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuXG4gICAgICAgIH0pIDogcmVzcG9uc2U7XG5cbiAgICB9O1xufVxuXG5mdW5jdGlvbiBpc0pzb24oc3RyKSB7XG5cbiAgICB2YXIgc3RhcnQgPSBzdHIubWF0Y2goL15cXHMqKFxcW3xcXHspLyk7XG4gICAgdmFyIGVuZCA9IHsnWyc6IC9dXFxzKiQvLCAneyc6IC99XFxzKiQvfTtcblxuICAgIHJldHVybiBzdGFydCAmJiBlbmRbc3RhcnRbMV1dLnRlc3Qoc3RyKTtcbn1cblxuLyoqXG4gKiBKU09OUCBjbGllbnQgKEJyb3dzZXIpLlxuICovXG5cbmZ1bmN0aW9uIGpzb25wQ2xpZW50IChyZXF1ZXN0KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlT2JqKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG5cbiAgICAgICAgdmFyIG5hbWUgPSByZXF1ZXN0Lmpzb25wIHx8ICdjYWxsYmFjaycsIGNhbGxiYWNrID0gcmVxdWVzdC5qc29ucENhbGxiYWNrIHx8ICdfanNvbnAnICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyKDIpLCBib2R5ID0gbnVsbCwgaGFuZGxlciwgc2NyaXB0O1xuXG4gICAgICAgIGhhbmRsZXIgPSBmdW5jdGlvbiAocmVmKSB7XG4gICAgICAgICAgICB2YXIgdHlwZSA9IHJlZi50eXBlO1xuXG5cbiAgICAgICAgICAgIHZhciBzdGF0dXMgPSAwO1xuXG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gJ2xvYWQnICYmIGJvZHkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBzdGF0dXMgPSAyMDA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgICAgICAgICBzdGF0dXMgPSA1MDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzdGF0dXMgJiYgd2luZG93W2NhbGxiYWNrXSkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB3aW5kb3dbY2FsbGJhY2tdO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVzb2x2ZShyZXF1ZXN0LnJlc3BvbmRXaXRoKGJvZHksIHtzdGF0dXM6IHN0YXR1c30pKTtcbiAgICAgICAgfTtcblxuICAgICAgICB3aW5kb3dbY2FsbGJhY2tdID0gZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5KHJlc3VsdCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVxdWVzdC5hYm9ydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGhhbmRsZXIoe3R5cGU6ICdhYm9ydCd9KTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXF1ZXN0LnBhcmFtc1tuYW1lXSA9IGNhbGxiYWNrO1xuXG4gICAgICAgIGlmIChyZXF1ZXN0LnRpbWVvdXQpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQocmVxdWVzdC5hYm9ydCwgcmVxdWVzdC50aW1lb3V0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgICBzY3JpcHQuc3JjID0gcmVxdWVzdC5nZXRVcmwoKTtcbiAgICAgICAgc2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcbiAgICAgICAgc2NyaXB0LmFzeW5jID0gdHJ1ZTtcbiAgICAgICAgc2NyaXB0Lm9ubG9hZCA9IGhhbmRsZXI7XG4gICAgICAgIHNjcmlwdC5vbmVycm9yID0gaGFuZGxlcjtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogSlNPTlAgSW50ZXJjZXB0b3IuXG4gKi9cblxuZnVuY3Rpb24ganNvbnAgKHJlcXVlc3QpIHtcblxuICAgIGlmIChyZXF1ZXN0Lm1ldGhvZCA9PSAnSlNPTlAnKSB7XG4gICAgICAgIHJlcXVlc3QuY2xpZW50ID0ganNvbnBDbGllbnQ7XG4gICAgfVxuXG59XG5cbi8qKlxuICogQmVmb3JlIEludGVyY2VwdG9yLlxuICovXG5cbmZ1bmN0aW9uIGJlZm9yZSAocmVxdWVzdCkge1xuXG4gICAgaWYgKGlzRnVuY3Rpb24ocmVxdWVzdC5iZWZvcmUpKSB7XG4gICAgICAgIHJlcXVlc3QuYmVmb3JlLmNhbGwodGhpcywgcmVxdWVzdCk7XG4gICAgfVxuXG59XG5cbi8qKlxuICogSFRUUCBtZXRob2Qgb3ZlcnJpZGUgSW50ZXJjZXB0b3IuXG4gKi9cblxuZnVuY3Rpb24gbWV0aG9kIChyZXF1ZXN0KSB7XG5cbiAgICBpZiAocmVxdWVzdC5lbXVsYXRlSFRUUCAmJiAvXihQVVR8UEFUQ0h8REVMRVRFKSQvaS50ZXN0KHJlcXVlc3QubWV0aG9kKSkge1xuICAgICAgICByZXF1ZXN0LmhlYWRlcnMuc2V0KCdYLUhUVFAtTWV0aG9kLU92ZXJyaWRlJywgcmVxdWVzdC5tZXRob2QpO1xuICAgICAgICByZXF1ZXN0Lm1ldGhvZCA9ICdQT1NUJztcbiAgICB9XG5cbn1cblxuLyoqXG4gKiBIZWFkZXIgSW50ZXJjZXB0b3IuXG4gKi9cblxuZnVuY3Rpb24gaGVhZGVyIChyZXF1ZXN0KSB7XG5cbiAgICB2YXIgaGVhZGVycyA9IGFzc2lnbih7fSwgSHR0cC5oZWFkZXJzLmNvbW1vbixcbiAgICAgICAgIXJlcXVlc3QuY3Jvc3NPcmlnaW4gPyBIdHRwLmhlYWRlcnMuY3VzdG9tIDoge30sXG4gICAgICAgIEh0dHAuaGVhZGVyc1t0b0xvd2VyKHJlcXVlc3QubWV0aG9kKV1cbiAgICApO1xuXG4gICAgZWFjaChoZWFkZXJzLCBmdW5jdGlvbiAodmFsdWUsIG5hbWUpIHtcbiAgICAgICAgaWYgKCFyZXF1ZXN0LmhlYWRlcnMuaGFzKG5hbWUpKSB7XG4gICAgICAgICAgICByZXF1ZXN0LmhlYWRlcnMuc2V0KG5hbWUsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG59XG5cbi8qKlxuICogWE1MSHR0cCBjbGllbnQgKEJyb3dzZXIpLlxuICovXG5cbmZ1bmN0aW9uIHhockNsaWVudCAocmVxdWVzdCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZU9iaihmdW5jdGlvbiAocmVzb2x2ZSkge1xuXG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKSwgaGFuZGxlciA9IGZ1bmN0aW9uIChldmVudCkge1xuXG4gICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gcmVxdWVzdC5yZXNwb25kV2l0aChcbiAgICAgICAgICAgICAgICAncmVzcG9uc2UnIGluIHhociA/IHhoci5yZXNwb25zZSA6IHhoci5yZXNwb25zZVRleHQsIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiB4aHIuc3RhdHVzID09PSAxMjIzID8gMjA0IDogeGhyLnN0YXR1cywgLy8gSUU5IHN0YXR1cyBidWdcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzVGV4dDogeGhyLnN0YXR1cyA9PT0gMTIyMyA/ICdObyBDb250ZW50JyA6IHRyaW0oeGhyLnN0YXR1c1RleHQpXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBlYWNoKHRyaW0oeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpKS5zcGxpdCgnXFxuJyksIGZ1bmN0aW9uIChyb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UuaGVhZGVycy5hcHBlbmQocm93LnNsaWNlKDAsIHJvdy5pbmRleE9mKCc6JykpLCByb3cuc2xpY2Uocm93LmluZGV4T2YoJzonKSArIDEpKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICByZXF1ZXN0LmFib3J0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4geGhyLmFib3J0KCk7IH07XG5cbiAgICAgICAgeGhyLm9wZW4ocmVxdWVzdC5tZXRob2QsIHJlcXVlc3QuZ2V0VXJsKCksIHRydWUpO1xuXG4gICAgICAgIGlmIChyZXF1ZXN0LnRpbWVvdXQpIHtcbiAgICAgICAgICAgIHhoci50aW1lb3V0ID0gcmVxdWVzdC50aW1lb3V0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJlcXVlc3QucmVzcG9uc2VUeXBlICYmICdyZXNwb25zZVR5cGUnIGluIHhocikge1xuICAgICAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9IHJlcXVlc3QucmVzcG9uc2VUeXBlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJlcXVlc3Qud2l0aENyZWRlbnRpYWxzIHx8IHJlcXVlc3QuY3JlZGVudGlhbHMpIHtcbiAgICAgICAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFyZXF1ZXN0LmNyb3NzT3JpZ2luKSB7XG4gICAgICAgICAgICByZXF1ZXN0LmhlYWRlcnMuc2V0KCdYLVJlcXVlc3RlZC1XaXRoJywgJ1hNTEh0dHBSZXF1ZXN0Jyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBkZXByZWNhdGVkIHVzZSBkb3dubG9hZFByb2dyZXNzXG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKHJlcXVlc3QucHJvZ3Jlc3MpICYmIHJlcXVlc3QubWV0aG9kID09PSAnR0VUJykge1xuICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgcmVxdWVzdC5wcm9ncmVzcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNGdW5jdGlvbihyZXF1ZXN0LmRvd25sb2FkUHJvZ3Jlc3MpKSB7XG4gICAgICAgICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCByZXF1ZXN0LmRvd25sb2FkUHJvZ3Jlc3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZGVwcmVjYXRlZCB1c2UgdXBsb2FkUHJvZ3Jlc3NcbiAgICAgICAgaWYgKGlzRnVuY3Rpb24ocmVxdWVzdC5wcm9ncmVzcykgJiYgL14oUE9TVHxQVVQpJC9pLnRlc3QocmVxdWVzdC5tZXRob2QpKSB7XG4gICAgICAgICAgICB4aHIudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgcmVxdWVzdC5wcm9ncmVzcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNGdW5jdGlvbihyZXF1ZXN0LnVwbG9hZFByb2dyZXNzKSAmJiB4aHIudXBsb2FkKSB7XG4gICAgICAgICAgICB4aHIudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgcmVxdWVzdC51cGxvYWRQcm9ncmVzcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXF1ZXN0LmhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUsIG5hbWUpIHtcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKG5hbWUsIHZhbHVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgeGhyLm9ubG9hZCA9IGhhbmRsZXI7XG4gICAgICAgIHhoci5vbmFib3J0ID0gaGFuZGxlcjtcbiAgICAgICAgeGhyLm9uZXJyb3IgPSBoYW5kbGVyO1xuICAgICAgICB4aHIub250aW1lb3V0ID0gaGFuZGxlcjtcbiAgICAgICAgeGhyLnNlbmQocmVxdWVzdC5nZXRCb2R5KCkpO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIEh0dHAgY2xpZW50IChOb2RlKS5cbiAqL1xuXG5mdW5jdGlvbiBub2RlQ2xpZW50IChyZXF1ZXN0KSB7XG5cbiAgICB2YXIgY2xpZW50ID0gcmVxdWlyZSgnZ290Jyk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2VPYmooZnVuY3Rpb24gKHJlc29sdmUpIHtcblxuICAgICAgICB2YXIgdXJsID0gcmVxdWVzdC5nZXRVcmwoKTtcbiAgICAgICAgdmFyIGJvZHkgPSByZXF1ZXN0LmdldEJvZHkoKTtcbiAgICAgICAgdmFyIG1ldGhvZCA9IHJlcXVlc3QubWV0aG9kO1xuICAgICAgICB2YXIgaGVhZGVycyA9IHt9LCBoYW5kbGVyO1xuXG4gICAgICAgIHJlcXVlc3QuaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSwgbmFtZSkge1xuICAgICAgICAgICAgaGVhZGVyc1tuYW1lXSA9IHZhbHVlO1xuICAgICAgICB9KTtcblxuICAgICAgICBjbGllbnQodXJsLCB7Ym9keTogYm9keSwgbWV0aG9kOiBtZXRob2QsIGhlYWRlcnM6IGhlYWRlcnN9KS50aGVuKGhhbmRsZXIgPSBmdW5jdGlvbiAocmVzcCkge1xuXG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSByZXF1ZXN0LnJlc3BvbmRXaXRoKHJlc3AuYm9keSwge1xuICAgICAgICAgICAgICAgIHN0YXR1czogcmVzcC5zdGF0dXNDb2RlLFxuICAgICAgICAgICAgICAgIHN0YXR1c1RleHQ6IHRyaW0ocmVzcC5zdGF0dXNNZXNzYWdlKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGVhY2gocmVzcC5oZWFkZXJzLCBmdW5jdGlvbiAodmFsdWUsIG5hbWUpIHtcbiAgICAgICAgICAgICAgICByZXNwb25zZS5oZWFkZXJzLnNldChuYW1lLCB2YWx1ZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG5cbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yJCQxKSB7IHJldHVybiBoYW5kbGVyKGVycm9yJCQxLnJlc3BvbnNlKTsgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogQmFzZSBjbGllbnQuXG4gKi9cblxuZnVuY3Rpb24gQ2xpZW50IChjb250ZXh0KSB7XG5cbiAgICB2YXIgcmVxSGFuZGxlcnMgPSBbc2VuZFJlcXVlc3RdLCByZXNIYW5kbGVycyA9IFtdO1xuXG4gICAgaWYgKCFpc09iamVjdChjb250ZXh0KSkge1xuICAgICAgICBjb250ZXh0ID0gbnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBDbGllbnQocmVxdWVzdCkge1xuICAgICAgICB3aGlsZSAocmVxSGFuZGxlcnMubGVuZ3RoKSB7XG5cbiAgICAgICAgICAgIHZhciBoYW5kbGVyID0gcmVxSGFuZGxlcnMucG9wKCk7XG5cbiAgICAgICAgICAgIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSAodm9pZCAwKSwgbmV4dCA9ICh2b2lkIDApO1xuXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBoYW5kbGVyLmNhbGwoY29udGV4dCwgcmVxdWVzdCwgZnVuY3Rpb24gKHZhbCkgeyByZXR1cm4gbmV4dCA9IHZhbDsgfSkgfHwgbmV4dDtcblxuICAgICAgICAgICAgICAgIGlmIChpc09iamVjdChyZXNwb25zZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlT2JqKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzSGFuZGxlcnMuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gd2hlbihyZXNwb25zZSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBoYW5kbGVyLmNhbGwoY29udGV4dCwgcmVzcG9uc2UpIHx8IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgd2hlbihyZXNwb25zZSwgcmVzb2x2ZSwgcmVqZWN0KTtcblxuICAgICAgICAgICAgICAgICAgICB9LCBjb250ZXh0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoaXNGdW5jdGlvbihyZXNwb25zZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzSGFuZGxlcnMudW5zaGlmdChyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHdhcm4oKFwiSW52YWxpZCBpbnRlcmNlcHRvciBvZiB0eXBlIFwiICsgKHR5cGVvZiBoYW5kbGVyKSArIFwiLCBtdXN0IGJlIGEgZnVuY3Rpb25cIikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgQ2xpZW50LnVzZSA9IGZ1bmN0aW9uIChoYW5kbGVyKSB7XG4gICAgICAgIHJlcUhhbmRsZXJzLnB1c2goaGFuZGxlcik7XG4gICAgfTtcblxuICAgIHJldHVybiBDbGllbnQ7XG59XG5cbmZ1bmN0aW9uIHNlbmRSZXF1ZXN0KHJlcXVlc3QpIHtcblxuICAgIHZhciBjbGllbnQgPSByZXF1ZXN0LmNsaWVudCB8fCAoaW5Ccm93c2VyID8geGhyQ2xpZW50IDogbm9kZUNsaWVudCk7XG5cbiAgICByZXR1cm4gY2xpZW50KHJlcXVlc3QpO1xufVxuXG4vKipcbiAqIEhUVFAgSGVhZGVycy5cbiAqL1xuXG52YXIgSGVhZGVycyA9IGZ1bmN0aW9uIEhlYWRlcnMoaGVhZGVycykge1xuICAgIHZhciB0aGlzJDEgPSB0aGlzO1xuXG5cbiAgICB0aGlzLm1hcCA9IHt9O1xuXG4gICAgZWFjaChoZWFkZXJzLCBmdW5jdGlvbiAodmFsdWUsIG5hbWUpIHsgcmV0dXJuIHRoaXMkMS5hcHBlbmQobmFtZSwgdmFsdWUpOyB9KTtcbn07XG5cbkhlYWRlcnMucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uIGhhcyAobmFtZSkge1xuICAgIHJldHVybiBnZXROYW1lKHRoaXMubWFwLCBuYW1lKSAhPT0gbnVsbDtcbn07XG5cbkhlYWRlcnMucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldCAobmFtZSkge1xuXG4gICAgdmFyIGxpc3QgPSB0aGlzLm1hcFtnZXROYW1lKHRoaXMubWFwLCBuYW1lKV07XG5cbiAgICByZXR1cm4gbGlzdCA/IGxpc3Quam9pbigpIDogbnVsbDtcbn07XG5cbkhlYWRlcnMucHJvdG90eXBlLmdldEFsbCA9IGZ1bmN0aW9uIGdldEFsbCAobmFtZSkge1xuICAgIHJldHVybiB0aGlzLm1hcFtnZXROYW1lKHRoaXMubWFwLCBuYW1lKV0gfHwgW107XG59O1xuXG5IZWFkZXJzLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiBzZXQgKG5hbWUsIHZhbHVlKSB7XG4gICAgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShnZXROYW1lKHRoaXMubWFwLCBuYW1lKSB8fCBuYW1lKV0gPSBbdHJpbSh2YWx1ZSldO1xufTtcblxuSGVhZGVycy5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24gYXBwZW5kIChuYW1lLCB2YWx1ZSkge1xuXG4gICAgdmFyIGxpc3QgPSB0aGlzLm1hcFtnZXROYW1lKHRoaXMubWFwLCBuYW1lKV07XG5cbiAgICBpZiAobGlzdCkge1xuICAgICAgICBsaXN0LnB1c2godHJpbSh2YWx1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0KG5hbWUsIHZhbHVlKTtcbiAgICB9XG59O1xuXG5IZWFkZXJzLnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbiBkZWxldGUkMSAobmFtZSkge1xuICAgIGRlbGV0ZSB0aGlzLm1hcFtnZXROYW1lKHRoaXMubWFwLCBuYW1lKV07XG59O1xuXG5IZWFkZXJzLnByb3RvdHlwZS5kZWxldGVBbGwgPSBmdW5jdGlvbiBkZWxldGVBbGwgKCkge1xuICAgIHRoaXMubWFwID0ge307XG59O1xuXG5IZWFkZXJzLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gZm9yRWFjaCAoY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgICAgdmFyIHRoaXMkMSA9IHRoaXM7XG5cbiAgICBlYWNoKHRoaXMubWFwLCBmdW5jdGlvbiAobGlzdCwgbmFtZSkge1xuICAgICAgICBlYWNoKGxpc3QsIGZ1bmN0aW9uICh2YWx1ZSkgeyByZXR1cm4gY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2YWx1ZSwgbmFtZSwgdGhpcyQxKTsgfSk7XG4gICAgfSk7XG59O1xuXG5mdW5jdGlvbiBnZXROYW1lKG1hcCwgbmFtZSkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhtYXApLnJlZHVjZShmdW5jdGlvbiAocHJldiwgY3Vycikge1xuICAgICAgICByZXR1cm4gdG9Mb3dlcihuYW1lKSA9PT0gdG9Mb3dlcihjdXJyKSA/IGN1cnIgOiBwcmV2O1xuICAgIH0sIG51bGwpO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVOYW1lKG5hbWUpIHtcblxuICAgIGlmICgvW15hLXowLTlcXC0jJCUmJyorLl5fYHx+XS9pLnRlc3QobmFtZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBjaGFyYWN0ZXIgaW4gaGVhZGVyIGZpZWxkIG5hbWUnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJpbShuYW1lKTtcbn1cblxuLyoqXG4gKiBIVFRQIFJlc3BvbnNlLlxuICovXG5cbnZhciBSZXNwb25zZSA9IGZ1bmN0aW9uIFJlc3BvbnNlKGJvZHksIHJlZikge1xuICAgIHZhciB1cmwgPSByZWYudXJsO1xuICAgIHZhciBoZWFkZXJzID0gcmVmLmhlYWRlcnM7XG4gICAgdmFyIHN0YXR1cyA9IHJlZi5zdGF0dXM7XG4gICAgdmFyIHN0YXR1c1RleHQgPSByZWYuc3RhdHVzVGV4dDtcblxuXG4gICAgdGhpcy51cmwgPSB1cmw7XG4gICAgdGhpcy5vayA9IHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwO1xuICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzIHx8IDA7XG4gICAgdGhpcy5zdGF0dXNUZXh0ID0gc3RhdHVzVGV4dCB8fCAnJztcbiAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhoZWFkZXJzKTtcbiAgICB0aGlzLmJvZHkgPSBib2R5O1xuXG4gICAgaWYgKGlzU3RyaW5nKGJvZHkpKSB7XG5cbiAgICAgICAgdGhpcy5ib2R5VGV4dCA9IGJvZHk7XG5cbiAgICB9IGVsc2UgaWYgKGlzQmxvYihib2R5KSkge1xuXG4gICAgICAgIHRoaXMuYm9keUJsb2IgPSBib2R5O1xuXG4gICAgICAgIGlmIChpc0Jsb2JUZXh0KGJvZHkpKSB7XG4gICAgICAgICAgICB0aGlzLmJvZHlUZXh0ID0gYmxvYlRleHQoYm9keSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5SZXNwb25zZS5wcm90b3R5cGUuYmxvYiA9IGZ1bmN0aW9uIGJsb2IgKCkge1xuICAgIHJldHVybiB3aGVuKHRoaXMuYm9keUJsb2IpO1xufTtcblxuUmVzcG9uc2UucHJvdG90eXBlLnRleHQgPSBmdW5jdGlvbiB0ZXh0ICgpIHtcbiAgICByZXR1cm4gd2hlbih0aGlzLmJvZHlUZXh0KTtcbn07XG5cblJlc3BvbnNlLnByb3RvdHlwZS5qc29uID0gZnVuY3Rpb24ganNvbiAoKSB7XG4gICAgcmV0dXJuIHdoZW4odGhpcy50ZXh0KCksIGZ1bmN0aW9uICh0ZXh0KSB7IHJldHVybiBKU09OLnBhcnNlKHRleHQpOyB9KTtcbn07XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZXNwb25zZS5wcm90b3R5cGUsICdkYXRhJywge1xuXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJvZHk7XG4gICAgfSxcblxuICAgIHNldDogZnVuY3Rpb24gc2V0KGJvZHkpIHtcbiAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcbiAgICB9XG5cbn0pO1xuXG5mdW5jdGlvbiBibG9iVGV4dChib2R5KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlT2JqKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG5cbiAgICAgICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG5cbiAgICAgICAgcmVhZGVyLnJlYWRBc1RleHQoYm9keSk7XG4gICAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXNvbHZlKHJlYWRlci5yZXN1bHQpO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGlzQmxvYlRleHQoYm9keSkge1xuICAgIHJldHVybiBib2R5LnR5cGUuaW5kZXhPZigndGV4dCcpID09PSAwIHx8IGJvZHkudHlwZS5pbmRleE9mKCdqc29uJykgIT09IC0xO1xufVxuXG4vKipcbiAqIEhUVFAgUmVxdWVzdC5cbiAqL1xuXG52YXIgUmVxdWVzdCA9IGZ1bmN0aW9uIFJlcXVlc3Qob3B0aW9ucyQkMSkge1xuXG4gICAgdGhpcy5ib2R5ID0gbnVsbDtcbiAgICB0aGlzLnBhcmFtcyA9IHt9O1xuXG4gICAgYXNzaWduKHRoaXMsIG9wdGlvbnMkJDEsIHtcbiAgICAgICAgbWV0aG9kOiB0b1VwcGVyKG9wdGlvbnMkJDEubWV0aG9kIHx8ICdHRVQnKVxuICAgIH0pO1xuXG4gICAgaWYgKCEodGhpcy5oZWFkZXJzIGluc3RhbmNlb2YgSGVhZGVycykpIHtcbiAgICAgICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnModGhpcy5oZWFkZXJzKTtcbiAgICB9XG59O1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5nZXRVcmwgPSBmdW5jdGlvbiBnZXRVcmwgKCkge1xuICAgIHJldHVybiBVcmwodGhpcyk7XG59O1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5nZXRCb2R5ID0gZnVuY3Rpb24gZ2V0Qm9keSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuYm9keTtcbn07XG5cblJlcXVlc3QucHJvdG90eXBlLnJlc3BvbmRXaXRoID0gZnVuY3Rpb24gcmVzcG9uZFdpdGggKGJvZHksIG9wdGlvbnMkJDEpIHtcbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKGJvZHksIGFzc2lnbihvcHRpb25zJCQxIHx8IHt9LCB7dXJsOiB0aGlzLmdldFVybCgpfSkpO1xufTtcblxuLyoqXG4gKiBTZXJ2aWNlIGZvciBzZW5kaW5nIG5ldHdvcmsgcmVxdWVzdHMuXG4gKi9cblxudmFyIENPTU1PTl9IRUFERVJTID0geydBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9wbGFpbiwgKi8qJ307XG52YXIgSlNPTl9DT05URU5UX1RZUEUgPSB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTgnfTtcblxuZnVuY3Rpb24gSHR0cChvcHRpb25zJCQxKSB7XG5cbiAgICB2YXIgc2VsZiA9IHRoaXMgfHwge30sIGNsaWVudCA9IENsaWVudChzZWxmLiR2bSk7XG5cbiAgICBkZWZhdWx0cyhvcHRpb25zJCQxIHx8IHt9LCBzZWxmLiRvcHRpb25zLCBIdHRwLm9wdGlvbnMpO1xuXG4gICAgSHR0cC5pbnRlcmNlcHRvcnMuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlcikge1xuXG4gICAgICAgIGlmIChpc1N0cmluZyhoYW5kbGVyKSkge1xuICAgICAgICAgICAgaGFuZGxlciA9IEh0dHAuaW50ZXJjZXB0b3JbaGFuZGxlcl07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgICAgICAgICAgY2xpZW50LnVzZShoYW5kbGVyKTtcbiAgICAgICAgfVxuXG4gICAgfSk7XG5cbiAgICByZXR1cm4gY2xpZW50KG5ldyBSZXF1ZXN0KG9wdGlvbnMkJDEpKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXG4gICAgICAgIHJldHVybiByZXNwb25zZS5vayA/IHJlc3BvbnNlIDogUHJvbWlzZU9iai5yZWplY3QocmVzcG9uc2UpO1xuXG4gICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cbiAgICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgIGVycm9yKHJlc3BvbnNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlT2JqLnJlamVjdChyZXNwb25zZSk7XG4gICAgfSk7XG59XG5cbkh0dHAub3B0aW9ucyA9IHt9O1xuXG5IdHRwLmhlYWRlcnMgPSB7XG4gICAgcHV0OiBKU09OX0NPTlRFTlRfVFlQRSxcbiAgICBwb3N0OiBKU09OX0NPTlRFTlRfVFlQRSxcbiAgICBwYXRjaDogSlNPTl9DT05URU5UX1RZUEUsXG4gICAgZGVsZXRlOiBKU09OX0NPTlRFTlRfVFlQRSxcbiAgICBjb21tb246IENPTU1PTl9IRUFERVJTLFxuICAgIGN1c3RvbToge31cbn07XG5cbkh0dHAuaW50ZXJjZXB0b3IgPSB7YmVmb3JlOiBiZWZvcmUsIG1ldGhvZDogbWV0aG9kLCBqc29ucDoganNvbnAsIGpzb246IGpzb24sIGZvcm06IGZvcm0sIGhlYWRlcjogaGVhZGVyLCBjb3JzOiBjb3JzfTtcbkh0dHAuaW50ZXJjZXB0b3JzID0gWydiZWZvcmUnLCAnbWV0aG9kJywgJ2pzb25wJywgJ2pzb24nLCAnZm9ybScsICdoZWFkZXInLCAnY29ycyddO1xuXG5bJ2dldCcsICdkZWxldGUnLCAnaGVhZCcsICdqc29ucCddLmZvckVhY2goZnVuY3Rpb24gKG1ldGhvZCQkMSkge1xuXG4gICAgSHR0cFttZXRob2QkJDFdID0gZnVuY3Rpb24gKHVybCwgb3B0aW9ucyQkMSkge1xuICAgICAgICByZXR1cm4gdGhpcyhhc3NpZ24ob3B0aW9ucyQkMSB8fCB7fSwge3VybDogdXJsLCBtZXRob2Q6IG1ldGhvZCQkMX0pKTtcbiAgICB9O1xuXG59KTtcblxuWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLmZvckVhY2goZnVuY3Rpb24gKG1ldGhvZCQkMSkge1xuXG4gICAgSHR0cFttZXRob2QkJDFdID0gZnVuY3Rpb24gKHVybCwgYm9keSwgb3B0aW9ucyQkMSkge1xuICAgICAgICByZXR1cm4gdGhpcyhhc3NpZ24ob3B0aW9ucyQkMSB8fCB7fSwge3VybDogdXJsLCBtZXRob2Q6IG1ldGhvZCQkMSwgYm9keTogYm9keX0pKTtcbiAgICB9O1xuXG59KTtcblxuLyoqXG4gKiBTZXJ2aWNlIGZvciBpbnRlcmFjdGluZyB3aXRoIFJFU1RmdWwgc2VydmljZXMuXG4gKi9cblxuZnVuY3Rpb24gUmVzb3VyY2UodXJsLCBwYXJhbXMsIGFjdGlvbnMsIG9wdGlvbnMkJDEpIHtcblxuICAgIHZhciBzZWxmID0gdGhpcyB8fCB7fSwgcmVzb3VyY2UgPSB7fTtcblxuICAgIGFjdGlvbnMgPSBhc3NpZ24oe30sXG4gICAgICAgIFJlc291cmNlLmFjdGlvbnMsXG4gICAgICAgIGFjdGlvbnNcbiAgICApO1xuXG4gICAgZWFjaChhY3Rpb25zLCBmdW5jdGlvbiAoYWN0aW9uLCBuYW1lKSB7XG5cbiAgICAgICAgYWN0aW9uID0gbWVyZ2Uoe3VybDogdXJsLCBwYXJhbXM6IGFzc2lnbih7fSwgcGFyYW1zKX0sIG9wdGlvbnMkJDEsIGFjdGlvbik7XG5cbiAgICAgICAgcmVzb3VyY2VbbmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gKHNlbGYuJGh0dHAgfHwgSHR0cCkob3B0cyhhY3Rpb24sIGFyZ3VtZW50cykpO1xuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc291cmNlO1xufVxuXG5mdW5jdGlvbiBvcHRzKGFjdGlvbiwgYXJncykge1xuXG4gICAgdmFyIG9wdGlvbnMkJDEgPSBhc3NpZ24oe30sIGFjdGlvbiksIHBhcmFtcyA9IHt9LCBib2R5O1xuXG4gICAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuXG4gICAgICAgIGNhc2UgMjpcblxuICAgICAgICAgICAgcGFyYW1zID0gYXJnc1swXTtcbiAgICAgICAgICAgIGJvZHkgPSBhcmdzWzFdO1xuXG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIDE6XG5cbiAgICAgICAgICAgIGlmICgvXihQT1NUfFBVVHxQQVRDSCkkL2kudGVzdChvcHRpb25zJCQxLm1ldGhvZCkpIHtcbiAgICAgICAgICAgICAgICBib2R5ID0gYXJnc1swXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zID0gYXJnc1swXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAwOlxuXG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBkZWZhdWx0OlxuXG4gICAgICAgICAgICB0aHJvdyAnRXhwZWN0ZWQgdXAgdG8gMiBhcmd1bWVudHMgW3BhcmFtcywgYm9keV0sIGdvdCAnICsgYXJncy5sZW5ndGggKyAnIGFyZ3VtZW50cyc7XG4gICAgfVxuXG4gICAgb3B0aW9ucyQkMS5ib2R5ID0gYm9keTtcbiAgICBvcHRpb25zJCQxLnBhcmFtcyA9IGFzc2lnbih7fSwgb3B0aW9ucyQkMS5wYXJhbXMsIHBhcmFtcyk7XG5cbiAgICByZXR1cm4gb3B0aW9ucyQkMTtcbn1cblxuUmVzb3VyY2UuYWN0aW9ucyA9IHtcblxuICAgIGdldDoge21ldGhvZDogJ0dFVCd9LFxuICAgIHNhdmU6IHttZXRob2Q6ICdQT1NUJ30sXG4gICAgcXVlcnk6IHttZXRob2Q6ICdHRVQnfSxcbiAgICB1cGRhdGU6IHttZXRob2Q6ICdQVVQnfSxcbiAgICByZW1vdmU6IHttZXRob2Q6ICdERUxFVEUnfSxcbiAgICBkZWxldGU6IHttZXRob2Q6ICdERUxFVEUnfVxuXG59O1xuXG4vKipcbiAqIEluc3RhbGwgcGx1Z2luLlxuICovXG5cbmZ1bmN0aW9uIHBsdWdpbihWdWUpIHtcblxuICAgIGlmIChwbHVnaW4uaW5zdGFsbGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBVdGlsKFZ1ZSk7XG5cbiAgICBWdWUudXJsID0gVXJsO1xuICAgIFZ1ZS5odHRwID0gSHR0cDtcbiAgICBWdWUucmVzb3VyY2UgPSBSZXNvdXJjZTtcbiAgICBWdWUuUHJvbWlzZSA9IFByb21pc2VPYmo7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhWdWUucHJvdG90eXBlLCB7XG5cbiAgICAgICAgJHVybDoge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMoVnVlLnVybCwgdGhpcywgdGhpcy4kb3B0aW9ucy51cmwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgICRodHRwOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3B0aW9ucyhWdWUuaHR0cCwgdGhpcywgdGhpcy4kb3B0aW9ucy5odHRwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAkcmVzb3VyY2U6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBWdWUucmVzb3VyY2UuYmluZCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAkcHJvbWlzZToge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRoaXMkMSA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGV4ZWN1dG9yKSB7IHJldHVybiBuZXcgVnVlLlByb21pc2UoZXhlY3V0b3IsIHRoaXMkMSk7IH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH0pO1xufVxuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LlZ1ZSkge1xuICAgIHdpbmRvdy5WdWUudXNlKHBsdWdpbik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHBsdWdpbjtcbmV4cG9ydCB7IFVybCwgSHR0cCwgUmVzb3VyY2UgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4uL25vZGVfbW9kdWxlcy9fdnVlLXJlc291cmNlQDEuNS4wQHZ1ZS1yZXNvdXJjZS9kaXN0L3Z1ZS1yZXNvdXJjZS5lc20uanNcbi8vIG1vZHVsZSBpZCA9IC4uL25vZGVfbW9kdWxlcy9fdnVlLXJlc291cmNlQDEuNS4wQHZ1ZS1yZXNvdXJjZS9kaXN0L3Z1ZS1yZXNvdXJjZS5lc20uanNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==
