(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, (function () { 'use strict';

  var isAbsoluteNaN = function isAbsoluteNaN(it) {
    return it !== it && typeof it === "number";
  };
  var isNone = function isNone(data) {
    return isAbsoluteNaN(data) || data === undefined || data === null;
  };
  var isNumber = function isNumber(it) {
    return typeof it === "number" && !isAbsoluteNaN(it);
  };
  var isInfinity = function isInfinity(it) {
    return it === Number.POSITIVE_INFINITY || it === Number.NEGATIVE_INFINITY;
  };
  var isArray = function isArray(data) {
    return Array.isArray(data) || data instanceof Array;
  };
  var isObject = function isObject(it) {
    return it !== null && typeof it === "object" ? true : false;
  };
  var isFunction = function isFunction(it) {
    return typeof it === "function";
  };
  /*
    * likeObject is have hasOwnProperty
  */

  var likeObject = function likeObject(it) {
    return isObject(it) || isFunction(it);
  };
  var likeString = function likeString(data) {
    if (typeof data === "string") return true;
    if (isNumber(data)) return true;
    return false;
  };
  var likeArray = function (nodeFn, webFn) {
    var definedNodeList;

    try {
      definedNodeList = 0 instanceof NodeList;
      definedNodeList = true;
    } catch (e) {
      definedNodeList = false;
    }

    return definedNodeList ? webFn : nodeFn;
  }( //nodeFn
  function (data) {
    return isArray(data);
  }, //webFn
  function (data) {
    return isArray(data) || data instanceof NodeList;
  }); //TODO : native isPlainObject
  var isPlainObject = function isPlainObject(data) {
    return typeof data === "object" && data.constructor === Object;
  };
  var likePromise = function likePromise(target) {
    return typeof target === "object" && target !== null && typeof target['then'] === "function" && typeof target['catch'] === "function";
  };

  var asArray$1 = function asArray(data, defaultArray) {
    if (defaultArray === void 0) {
      defaultArray = undefined;
    }

    if (isArray(data)) {
      return data;
    }

    if (isNone(data)) {
      return isArray(defaultArray) ? defaultArray : isNone(defaultArray) ? [] : [defaultArray];
    }

    if (typeof data === "object" && typeof data.toArray === "function") {
      return data.toArray();
    }

    return [data];
  };
  var clone = function clone(target) {
    switch (typeof target) {
      case "undefined":
      case "function":
      case "boolean":
      case "number":
      case "string":
        return target;
        break;

      case "object":
        if (target === null) return target;

        if (isArray(target)) {
          var _r = [];

          for (var i = 0, length = target.length; i < length; i++) {
            _r.push(target[i]);
          }

          return _r;
        }

        if (!isPlainObject(target)) {
          if (target instanceof Date) {
            var _r2 = new Date();

            _r2.setTime(target.getTime());

            return _r2;
          }

          return target;
        }

        var r = {};
        Object.keys(target).forEach(function (k) {
          if (target.hasOwnProperty(k)) r[k] = target[k];
        });
        return r;
        break;

      default:
        console.error("clone::copy failed : target => ", target);
        return target;
        break;
    }
  };
  var cloneDeep = function cloneDeep(target) {
    if (typeof target === "object") {
      var d;

      if (isArray(target)) {
        if (!isArray(d)) {
          d = [];
        }

        for (var i = 0, l = target.length; i < l; i++) {
          d.push(typeof target[i] === "object" && target[i] !== null ? clone(target[i]) : target[i]);
        }

        return d;
      } else {
        d = {};
        Object.keys(target).forEach(function (p) {
          typeof target[p] === "object" && target[p] !== null && d[p] ? clone(target[p], d[p]) : d[p] = target[p];
        });
        return d;
      }
    } else {
      return clone(target);
    }
  };

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  var entries = function entries(it) {
    var result = [];

    switch (typeof it) {
      case "object":
        isNone(it) ? 0 : likeArray(it) ? asArray$1(it).forEach(function (v, k) {
          result.push([k, v]);
        }) : Object.keys(it).forEach(function (key) {
          result.push([key, it[key]]);
        });
        break;
    }

    return result;
  };

  var matchString = function matchString(it, search, at) {
    if (at === void 0) {
      at = 0;
    }

    if (typeof it !== "string") throw new Error("matchString :: worng argument " + it);
    if (typeof search === "string") search = search.replace(new RegExp("(\\.|\\[|\\])", "g"), function (s) {
      return "\\" + s;
    });
    var result = it.substr(at).match(search);
    return result ? [result.index + at, result[0].length] : [-1, 0];
  };

  var all = function all(data, fn) {
    data = asArray$1(data);

    if (data.length === 0) {
      return false;
    }

    for (var i = 0, l = data.length; i < l; i++) {
      if (!fn(data[i], i)) {
        return false;
      }
    }
    return true;
  };

  var readString = function () {
    var rebaseMatches = function rebaseMatches(matches) {
      return entries(asArray$1(matches));
    };

    return function (text, matches, castFn, props) {
      var payload = {
        content: text,
        props: props
      };
      var newMatchEntries = rebaseMatches(matches);
      var castingState = {
        firstIndex: 0,
        lastIndex: text.length,
        castingStart: 0,
        cursor: 0
      };

      if (typeof props === "object" && isNumber(props.start)) {
        castingState.castingStart = props.start;
        castingState.cursor = props.start;
      }

      var open = function open(_ref) {
        var _ref$castingState = _ref.castingState,
            firstIndex = _ref$castingState.firstIndex,
            lastIndex = _ref$castingState.lastIndex,
            castingStart = _ref$castingState.castingStart,
            cursor = _ref$castingState.cursor,
            matchEntries = _ref.matchEntries,
            castFn = _ref.castFn,
            parentScope = _ref.parentScope;

        if (cursor >= lastIndex) {
          return false;
        } //find match


        var matchesMap = matchEntries.map(function (_ref2) {
          var matchType = _ref2[0],
              matchExp = _ref2[1];
          return [matchString(text, matchExp, cursor), matchType, matchExp];
        });
        var firstMatch = asArray$1(matchesMap).sort(function (_ref3, _ref4) {
          var a = _ref3[0],
              aPriority = _ref3[1];
          var b = _ref4[0],
              bPriority = _ref4[1];
          return a[0] < 0 ? true : b[0] < 0 ? false : a[0] == b[0] ? aPriority < bPriority : a[0] > b[0];
        })[0]; // top match is not exsist

        if (!firstMatch) {
          return false;
        } // unmatched


        if (firstMatch[0][0] === -1) {
          firstMatch = [[-1, 0], -1, null];
        } //next variant


        var _firstMatch = firstMatch,
            _firstMatch$ = _firstMatch[0],
            matchIndex = _firstMatch$[0],
            matchSize = _firstMatch$[1],
            matchType = _firstMatch[1],
            matchExp = _firstMatch[2];
        var castStart = castingStart;
        var castEnd = matchType === -1 ? lastIndex : matchIndex + matchSize;
        var castSize = castEnd - castStart;
        var skipSize = castSize - matchSize; //next params

        var matching = {
          matchType: matchType,
          matchExp: matchExp,
          matchIndex: matchIndex,
          matchSize: matchSize,
          skipSize: skipSize
        };
        var casting = {
          firstIndex: firstIndex,
          lastIndex: lastIndex,
          castStart: castStart,
          castEnd: castEnd,
          castSize: castSize
        };
        var scope = {
          fork: function fork(matchEntries, castFn) {
            var newMatchEntries = rebaseMatches(matches);
            open({
              castingState: {
                firstIndex: matching.matchIndex,
                lastIndex: matching.matchIndex + matchSize,
                castingStart: matching.matchIndex,
                cursor: matching.matchIndex
              },
              matchEntries: newMatchEntries,
              castFn: castFn,
              parentScope: parentScope
            });
          },
          next: function next(needCursor) {
            var cursorTo = isNumber(needCursor) ? needCursor : casting.castEnd;
            open({
              castingState: {
                firstIndex: firstIndex,
                lastIndex: lastIndex,
                castingStart: cursorTo,
                cursor: cursorTo
              },
              matchEntries: matchEntries,
              castFn: castFn,
              parentScope: parentScope
            });
          },
          enter: function enter(enterMatches, enterCastFn) {
            open({
              castingState: {
                firstIndex: firstIndex,
                lastIndex: lastIndex,
                castingStart: matching.matchIndex,
                cursor: matching.matchIndex
              },
              matchEntries: rebaseMatches(enterMatches),
              castFn: enterCastFn,
              parentScope: {
                next: scope.next
              }
            });
          },
          exit: function exit(needCursor) {
            parentScope && parentScope.next(isNumber(needCursor) ? needCursor : casting.castEnd);
          },
          more: function more() {
            open({
              castingState: {
                firstIndex: firstIndex,
                lastIndex: lastIndex,
                castingStart: castStart,
                cursor: casting.castEnd
              },
              matchEntries: matchEntries,
              castFn: castFn,
              parentScope: parentScope
            });
          }
        };
        castFn(_objectSpread({}, payload, matching, casting, scope));
        return true;
      };

      open({
        castingState: castingState,
        matchEntries: newMatchEntries,
        castFn: castFn
      });
      return payload;
    };
  }();
  var readPath = function () {
    var __filterDotPath = function __filterDotPath(dotPath, removeFirstDot) {
      return removeFirstDot && dotPath.indexOf(".") === 0 ? dotPath.substr(1) : dotPath;
    };

    var __filterBlockPath = function __filterBlockPath(blockPath) {
      //remove []
      blockPath = blockPath.substring(1, blockPath.length - 1); //interger

      if (/^[0-9]+$/.test(blockPath)) {
        return parseInt(blockPath, 10);
      } //remove ''


      if (/^\'.*\'$/.test(blockPath) || /^\".*\"$/.test(blockPath)) {
        blockPath = blockPath.substring(1, blockPath.length - 1);
      }

      return blockPath;
    };

    return function (pathParam) {
      if (isArray(pathParam)) {
        return pathParam;
      }

      if (likeString(pathParam)) {
        if (isNumber(pathParam)) {
          return [pathParam];
        }

        if (typeof pathParam === "string") {
          //one depth
          if (!/\.|\[/.test(pathParam)) {
            return [pathParam];
          } //multiple depth


          var _readString = readString(pathParam, [".", "["], function (_ref5) {
            var content = _ref5.content,
                path = _ref5.props.path,
                matchExp = _ref5.matchExp,
                castStart = _ref5.castStart,
                castEnd = _ref5.castEnd,
                castSize = _ref5.castSize,
                skipSize = _ref5.skipSize,
                enter = _ref5.enter,
                next = _ref5.next;

            if (matchExp === ".") {
              skipSize && path.push(content.substr(castStart, skipSize));
              next();
            }

            if (matchExp === "[") {
              var stackCount = 0;

              if (skipSize) {
                path.push(__filterDotPath(content.substr(castStart, skipSize), castStart !== 0));
              }

              enter(["[", "]"], function (_ref6) {
                var matchExp = _ref6.matchExp,
                    castStart = _ref6.castStart,
                    castEnd = _ref6.castEnd,
                    more = _ref6.more,
                    exit = _ref6.exit;
                if (matchExp === "[") stackCount++;
                if (matchExp === "]") stackCount--;
                if (matchExp === null) return;

                if (stackCount === 0) {
                  path.push(__filterBlockPath(content.substring(castStart, castEnd)));
                  exit();
                } else {
                  more();
                }
              });
            }

            if (matchExp === null) {
              path.push(__filterDotPath(content.substr(castStart, castEnd), castStart !== 0));
            }
          }, {
            path: []
          }),
              result = _readString.props.path;

          return result;
        }
      }

      return [];
    };
  }();
  var get = function get(target, path, defaultValue) {
    if (typeof target === "object") {
      switch (typeof path) {
        case "number":
          path += "";

        case "string":
          path = readPath(path);

        case "object":
          if (isArray(path)) {
            var allget = all(path, function (name) {
              if (likeObject(target) && (target.hasOwnProperty(name) || target[name])) {
                target = target[name];
                return true;
              } else {
                return false;
              }
            });
            return allget ? target : defaultValue;
          } else {
            return;
          }

          break;

        case "function":
          return path.call(this, target);
      }
    } else if (typeof target === "function") {
      return target.apply(this, Array.prototype.slice.call(arguments, 1));
    }

    return target;
  };

  var top = function top(data, iteratee, topLength) {
    switch (typeof iteratee) {
      case "function":
        //iteratee=iteratee;
        break;

      case "string":
        var path = iteratee;

        iteratee = function iteratee(a, b) {
          return get(a, path) < get(b, path);
        };

        break;

      case "boolean":
        iteratee = iteratee ? function (a, b) {
          return a < b;
        } : function (a, b) {
          return a > b;
        };
        break;

      default:
        iteratee = function iteratee(a, b) {
          return a < b;
        };

        break;
    }

    if (typeof topLength === "boolean") {
      topLength = topLength ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    }

    return isNumber(topLength) || isInfinity(topLength) ? asArray$1(data).sort(function (a, b) {
      return iteratee(a, b);
    }).splice(0, topLength) : asArray$1(data).sort(function (a, b) {
      return iteratee(a, b);
    })[0];
  };

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
  var newPromise = function newPromise(fn) {
    return new PromiseClass(function (r, c) {
      var maybeAwaiter = fn(r, c);
      likePromise(maybeAwaiter) && maybeAwaiter.then(r).catch(c);
    });
  };
  var reject = rejectFn;
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

  var ODBCObjectConnection = function () {
    var ODBCObjectConnector = function ODBCObjectConnector(object, writeFn) {
      this.dataSource = object;

      this.writeDataSource = function (beforeFn) {
        var result;

        if (typeof beforeFn === "function") {
          result = beforeFn();
        }

        return writeFn(this.dataSource).then(function (resp) {
          console.log("[" + Date.now() + "] Success write ODBC dataSource");
          return result;
        });
      }.bind(this);
    };

    ODBCObjectConnector.prototype = {
      all: function all$$1() {
        return cloneDeep(this.dataSource);
      },
      table: function table(tableName) {
        return new ODBCObjectTable(this, tableName);
      },
      createTable: function createTable(modelKey) {
        if (!this.dataSource[modelKey]) {
          this.dataSource[modelKey] = [];
        }

        return this.dataSource[modelKey];
      },
      dropTable: function dropTable(modelKey) {
        var droped = this.dataSource[modelKey] || [];

        if (this.dataSource.hasOwnProperty(modelKey)) {
          delete this.dataSource[modelKey];
        }

        return droped;
      }
    };

    var ODBCObjectTable = function ODBCObjectTable(driver, tableName) {
      this.tableName = tableName;

      this.handleSource = function (handle) {
        if (!driver.dataSource[this.tableName]) driver.dataSource[this.tableName] = [];
        return handle(driver.dataSource[this.tableName]);
      };

      this.dataSoruce = function (where) {
        if (!driver.dataSource[this.tableName]) driver.dataSource[this.tableName] = [];
        return cloneDeep(where ? asArray$1(driver.dataSource[this.tableName]).filter(where) : driver.dataSource[this.tableName]);
      };
    };

    ODBCObjectTable.prototype = {
      all: function all$$1() {
        return this.dataSoruce();
      },
      where: function where(query) {
        return this.dataSoruce(query);
      },
      id: function id(_id) {
        return this.dataSoruce({
          id: ~~_id
        })[0];
      },
      insert: function insert(datum) {
        return typeof datum === "object" ? this.handleSource(function (dataSource) {
          var maxId = get(top(dataSource, "id"), "id");

          if (typeof maxId === "number") {
            maxId++;
          } else {
            maxId = 1;
          }

          datum.id = maxId;
          dataSource.push(datum);
          return datum;
        }) : null;
      },
      deleteBy: function deleteBy(yieldFn) {
        return this.handleSource(function (dataSource) {
          var deleted = [];

          var saveData = asArray$1(dataSource).filter(function (d, i) {
            if (!yieldFn(d, i)) {
              return true;
            } else {
              deleted.push(d);
            }
          });

          Array.prototype.splice.apply(dataSource, [0, dataSource.length].concat(saveData));
          return deleted;
        });
      },
      updateBy: function updateBy(filterFn, yieldFn) {
        this.handleSource(function (dataSource) {
          asArray(dataSource).filter(filterFn).forEach(function (datum) {
            yieldFn(datum);
          });
        });
      }
    };
    return function (object, writeFn) {
      return new ODBCObjectConnector(object, writeFn);
    };
  }();

  var ODBC = function () {
    var ODBCWriterFactory = function ODBCWriterFactory(path) {
      return function (data) {
        return writeFile(path, JSON.stringify(data)).then(function () {
          return data;
        });
      };
    };

    return {
      open: function open(raw, option) {
        var object;

        if (typeof raw === "object") {
          object = raw;
        } else {
          try {
            object = JSON.parse(raw);
          } catch (e) {
            reject(new Error("odbc data source is borken"));
          }
        }

        return ODBCObjectConnection(object, option);
      },
      read: function read(path) {
        return readFile(path, 'utf8').then(function (raw) {
          return ODBC.open(raw, ODBCWriterFactory(path));
        });
      },
      createFrom: function createFrom(path, data) {
        switch (typeof data) {
          case "object":
          case "undefined":
            data = data || {};
            return writeFile(path, data).then(function () {
              return ODBC.open(data, ODBCWriterFactory(path));
            });
            break;

          case "string":
            return readFile(data, 'utf8').then(function (data) {
              return writeFile(path, data).then(function () {
                return ODBC.open(data, ODBCWriterFactory(path));
              });
            });
            break;

          default:
            return reject(new Error("Unknown db create data type"));
            break;
        }
      }
    };
  }();

  module.exports = ODBC;

  var doctor = function doctor(rootPath, asyncFn) {
    var file = {
      parseJSON: function parseJSON(path) {
        return newPromise(function (resolve$$1, reject$$1) {});
      },
      write: function write(path, content) {
        return newPromise(function (resolve$$1, reject$$1) {});
      }
    };
    asyncFn({
      file: file
    });
  };

  exports.module = doctor;

})));
