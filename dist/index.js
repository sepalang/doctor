(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.module = factory());
}(this, (function () { 'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            Promise.resolve(value).then(_next, _throw);
          }
        }

        function _next(value) {
          step("next", value);
        }

        function _throw(err) {
          step("throw", err);
        }

        _next();
      });
    };
  }

  var argumentNamesBy = function getArgs(fn) {
    if (typeof fn !== "function") return []; // normal -  function[^\(]*?\(([^)]*)\)
    // arrow  -  \([\)]*\)\s*\=\>\s*\{

    var args = fn.toString().match(/function[^\(]*?\(([^)]*)\)|\([\)]*\)\s*\=\>\s*\{/)[1];
    if (!args) return [];
    return args.split(',').map(function (s) {
      return s.trim();
    }).filter(function (n) {
      return n;
    });
  };

  var PromiseClass = Promise;
  var rejectFn = PromiseClass.reject;
  var abortMessage = new function () {
    Object.defineProperty(this, "message", {
      get: function get$$1() {
        return ":abort";
      }
    });
    Object.defineProperty(this, "abort", {
      get: function get$$1() {
        return true;
      }
    });
  }();
  var promisify = function promisify(asyncErrCallbackfn) {
    var argumentNames = argumentNamesBy(asyncErrCallbackfn).slice(1);

    var promisified = function promisified() {
      var _this = this;

      var args = Array.from(arguments);
      return new Promise(function (resolve, reject) {
        asyncErrCallbackfn.apply(_this, args.concat(function (err) {
          var _Array$from = Array.from(arguments),
              error = _Array$from[0],
              callbakArgs = _Array$from.slice(1);

          if (error) {
            reject(error);
          } else if (argumentNames.length && callbakArgs.length > 1) {
            resolve(argumentNames.reduce(function (dest, name, index) {
              dest[name] = callbakArgs[index];
              return dest;
            }, {}));
          } else {
            resolve(callbakArgs[0]);
          }
        }));
      });
    };

    return function () {
      return promisified.apply(this, Array.from(arguments));
    };
  };

  var fs = require('fs');

  var readFile = promisify(fs.readFile);

  var writeFile = promisify(fs.writeFile);

  var connectFile = (function () {
    var QuerySymbol = Symbol("FileConnection::QueryConnection");

    var FileConnection = function FileConnection(path, charset) {
      if (charset === void 0) {
        charset = 'utf-8';
      }

      this.path = path;
      this.charset = charset;
      this.opened = false;
      this.content = undefined;
    };

    FileConnection.prototype = {
      open: function () {
        var _open = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return readFile(this.path);

                case 2:
                  this.content = _context.sent;

                case 3:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        return function open() {
          return _open.apply(this, arguments);
        };
      }(),
      is: function is(type) {},
      query: function query(type, handle) {}
    };

    function factoryQuery(type, _temp) {
      var _QueryConnectionProto;

      var _ref = _temp === void 0 ? {} : _temp,
          methods = _ref.methods;

      var QueryConnection = function QueryConnection(parent) {};

      var QueryConnectionPrototype = (_QueryConnectionProto = {}, _QueryConnectionProto[QuerySymbol] = true, _QueryConnectionProto);

      if (typeof methods === "object") {
        Object.assign(QueryConnection.prototype, methods);
      }

      QueryConnection.prototype = QueryConnectionPrototype;
    }

    var JSONConnection = factoryQuery("json", {
      methods: {
        setDefault: function setDefault() {}
      }
    });
    return function (object, writeFn) {
      return new FileConnection(object, writeFn);
    };
  })();

  function index (rootPath, asyncFn) {
    var file = {
      open: function () {
        var _open = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee(path, charset) {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (charset === void 0) {
                    charset = 'utf-8';
                  }

                  _context.next = 3;
                  return connectFile(path, charset).open();

                case 3:
                  return _context.abrupt("return", _context.sent);

                case 4:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        return function open(_x, _x2) {
          return _open.apply(this, arguments);
        };
      }(),
      touch: function () {
        var _touch = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee2(path, charset) {
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  if (charset === void 0) {
                    charset = 'utf-8';
                  }

                  _context2.next = 3;
                  return connectFile(path, charset).open().catch(function () {
                    return file.write(path, "", charset = 'utf-8');
                  });

                case 3:
                  return _context2.abrupt("return", _context2.sent);

                case 4:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        return function touch(_x3, _x4) {
          return _touch.apply(this, arguments);
        };
      }(),
      write: function () {
        var _write = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee3(path, content, charset) {
          var connectedFile;
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  if (charset === void 0) {
                    charset = 'utf-8';
                  }

                  _context3.next = 3;
                  return connectFile(path, charset).open();

                case 3:
                  connectedFile = _context3.sent;
                  _context3.next = 6;
                  return connectedFile.setContent(content).write();

                case 6:
                  return _context3.abrupt("return", _context3.sent);

                case 7:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        return function write(_x5, _x6, _x7) {
          return _write.apply(this, arguments);
        };
      }()
    };
    asyncFn({
      file: file
    });
  }

  return index;

})));
