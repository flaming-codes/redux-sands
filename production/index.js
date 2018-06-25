"use strict";
var _regenerator = require("babel-runtime/regenerator"),
  _regenerator2 = _interopRequireDefault(_regenerator),
  _defineProperty2 = require("babel-runtime/helpers/defineProperty"),
  _defineProperty3 = _interopRequireDefault(_defineProperty2),
  _keys = require("babel-runtime/core-js/object/keys"),
  _keys2 = _interopRequireDefault(_keys),
  _extends3 = require("babel-runtime/helpers/extends"),
  _extends4 = _interopRequireDefault(_extends3),
  _classCallCheck2 = require("babel-runtime/helpers/classCallCheck"),
  _classCallCheck3 = _interopRequireDefault(_classCallCheck2),
  _createClass2 = require("babel-runtime/helpers/createClass"),
  _createClass3 = _interopRequireDefault(_createClass2),
  _reactRedux = require("react-redux"),
  _effects = require("redux-saga/effects");
Object.defineProperty(exports, "__esModule", { value: !0 });
function _interopRequireDefault(a) {
  return a && a.__esModule ? a : { default: a };
} /*
 *
 * Classes.
 *
 */ //
//  redux/index.js
//  medoboard
//
//  Created by Thomas Schönmann on 20.6.2018.
//  Copyright © expressFlow GmbH. All rights reserved.
//
//  Model to minify Redux-debris in app.
//
var ReduxWrapper = (function() {
  function a(b) {
    if (((0, _classCallCheck3.default)(this, a), !b.called))
      throw Error("ReduxWrapper : constructor - missing 'called'-arg");
    (this._id = b.called),
      (this.component = b.component || null),
      (this.actionReducers = {}),
      (this.saga = []),
      (this.otherStateProps = {}),
      (this.otherStateActions = {}),
      this._bind();
  }
  return (
    (0, _createClass3.default)(
      a,
      [
        {
          key: "mapStateToProps",
          value: function mapStateToProps(a) {
            var b = (0, _extends4.default)({}, a[this._id]),
              c = (0, _extends4.default)({}, this.otherStateProps);
            return (
              (0, _keys2.default)(c).forEach(function(d) {
                if ("all" === c[d]) return (b = (0, _extends4.default)({}, b, a[d]));
                if (c[d].constructor === Array) {
                  var e = (0, _extends4.default)({}, a[d]); // Now let's check each element in the array. It may be either
                  //  - a String
                  //  - an Object
                  // based on the caller input. If it's an object, the wrapped comp
                  // uses the foreign state-prop under a custom name. If only a string
                  // is provided, we can copy as is.
                  return c[d].forEach(function(a) {
                    if (a.constructor === String) return (b[a] = e[a]);
                    if (a.constructor === Object) return (b[a.as] = e[a.origin]);
                    throw Error(
                      "ReduxWrapper : mapStateToProps - Unsupported type as value for " + d + " in " + a
                    );
                  });
                }
                throw Error("ReduxWrapper : mapStateToProps - Unsupported type as value for " + d);
              }),
              (0, _extends4.default)({}, b)
            );
          }
        },
        {
          key: "mapDispatchToProps",
          value: function mapDispatchToProps(a) {
            return this.dispatches(a);
          }
        },
        {
          key: "add",
          value: function add(a) {
            var b = a.initState,
              c = a.component,
              d = a.reducer,
              e = a.otherStateProps; // Let's see what param has been passed. Only one per add-call is valid.
            // If non was found, the caller uses the shorthand version to add an actionReducer.
            return (
              b
                ? (this.initState = b)
                : c
                  ? (this.component = c)
                  : d
                    ? this._addActionReducer({ action: d })
                    : e
                      ? (this.otherStateProps = (0, _extends4.default)({}, this.otherStateProps, {
                          otherStateProps: e
                        }))
                      : this._addActionReducer({ action: a }),
              this
            );
          }
        },
        {
          key: "import",
          value: function _import(a) {
            return (
              a.reducer && this._importOtherDispatchProps(a), a.state && this._importOtherStateProps(a), this
            );
          }
        },
        {
          key: "dispatches",
          value: function dispatches(b) {
            var c = this,
              d = this.actionReducers,
              e = {}; // Process own actionReducers.
            return (
              (0, _keys2.default)(d).forEach(
                function(a) {
                  e = (0, _extends4.default)({}, e, c._dispatch({ dispatch: b, type: a, action: d[a] }));
                } //obj[fnName] = params => dispatch(actionReducers[type].f({ type, ...params }));
              ),
              (0, _keys2.default)(this.otherStateActions).forEach(function(d) {
                c.otherStateActions[d].forEach(function(f) {
                  var g = a._extractImportReducerParams(f),
                    h = a._createExternalTypes({ namespace: d, fName: g.fName, _id: c._id });
                  e[g.exposedName] = function(a) {
                    return b((0, _extends4.default)({ type: h.proxy, dispatch: b }, a));
                  };
                });
              }),
              e
            );
          }
        },
        {
          key: "reducer", // Exposed to store.
          value: function reducer() {
            var a = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : this.initState,
              b = arguments[1];
            return this.actionReducers[b.type] && this.actionReducers[b.type].isReducable
              ? this.actionReducers[b.type].f(a, b)
              : (0, _extends4.default)({}, a);
          } /*
   * Internal.
   */
        },
        {
          key: "_bind",
          value: function _bind() {
            (this.mapStateToProps = this.mapStateToProps.bind(this)),
              (this.mapDispatchToProps = this.mapDispatchToProps.bind(this)),
              (this.dispatches = this.dispatches.bind(this)),
              (this.reducer = this.reducer.bind(this)),
              (this._importOtherDispatchProps = this._importOtherDispatchProps.bind(this)),
              (this._importOtherStateProps = this._importOtherStateProps.bind(this)),
              (this._addActionReducer = this._addActionReducer.bind(this)),
              (this._addAtomicActionReducer = this._addAtomicActionReducer.bind(this)),
              (this._addSaga = this._addSaga.bind(this)),
              (this._addSagaAction = this._addSagaAction.bind(this));
          }
        },
        {
          key: "_dispatch",
          value: function _dispatch(a) {
            var b = a.dispatch,
              c = a.type,
              d = a.action,
              e = (0, _extends4.default)({}, d); // If no name is provided, the action only lives
            // as a reducer without being exposed to the caller.
            // This is a valid use case, e.g. when implementing sagas.
            return e.name
              ? (0, _defineProperty3.default)({}, e.name, function(a) {
                  return e.params
                    ? b((0, _extends4.default)({ type: c }, a, e.params))
                    : b((0, _extends4.default)({ type: c }, a));
                })
              : void 0;
          }
        },
        {
          key: "_importOtherDispatchProps",
          value: function _importOtherDispatchProps(b) {
            var c = this,
              d = (0, _extends4.default)({}, b.reducer),
              e = this.isLogging;
            (0, _keys2.default)(d).forEach(function(b) {
              (c.otherStateActions[b] = d[b]),
                d[b].forEach(function(d) {
                  var e = a._extractImportReducerParams(d),
                    f = e.fName,
                    g = e.exposedName,
                    h = e.withSaga,
                    i = a._createExternalTypes({ namespace: b, fName: f, _id: c._id, withSaga: h });
                  c.saga.push(
                    (0, _effects.takeEvery)(
                      i.proxy,
                      /*#__PURE__*/ _regenerator2.default.mark(function a(b) {
                        var c, d, e;
                        return _regenerator2.default.wrap(
                          function(a) {
                            for (;;)
                              switch ((a.prev = a.next)) {
                                case 0:
                                  if (
                                    ((c = (0, _extends4.default)({}, b)),
                                    (d = c.dispatch),
                                    (e = {}),
                                    (0, _keys2.default)(b)
                                      .filter(function(a) {
                                        return "dispatch" !== a && "type" !== a;
                                      })
                                      .forEach(function(a) {
                                        return (e[a] = c[a]);
                                      }),
                                    !h)
                                  ) {
                                    a.next = 9;
                                    break;
                                  }
                                  return (
                                    (a.next = 7),
                                    (0, _effects.put)(
                                      (0, _extends4.default)(
                                        {
                                          type: i.saga.req,
                                          call: _effects.call,
                                          put: _effects.put,
                                          result: { type: i.saga.rec }
                                        },
                                        e
                                      )
                                    )
                                  );
                                case 7:
                                  a.next = 11;
                                  break;
                                case 9:
                                  return (
                                    (a.next = 11),
                                    (0, _effects.put)((0, _extends4.default)({ type: i.basic }, e))
                                  );
                                case 11:
                                case "end":
                                  return a.stop();
                              }
                          },
                          a,
                          this
                        );
                      })
                    )
                  );
                });
            });
          }
        },
        {
          key: "_importOtherStateProps",
          value: function _importOtherStateProps(a) {
            var b = this,
              c = (0, _extends4.default)({}, a.state);
            (0, _keys2.default)(c).forEach(function(a) {
              return (b.otherStateProps = (0, _extends4.default)(
                {},
                b.otherStateProps,
                (0, _defineProperty3.default)({}, a, c[a])
              ));
            });
          }
        },
        {
          key: "_addActionReducer",
          value: function _addActionReducer(a) {
            var b = a.action;
            return b[(0, _keys2.default)(b)[0]].withSaga
              ? this._addSaga(b)
              : void this._addAtomicActionReducer({ action: b, isShort: !b[(0, _keys2.default)(b)[0]].fn });
          }
        },
        {
          key: "_addAtomicActionReducer",
          value: function _addAtomicActionReducer(a) {
            var b = a.action,
              c = a.isShort,
              d = (0, _extends4.default)({}, b),
              e = (0, _keys2.default)(d)[0],
              f = this._id.toUpperCase() + "_" + e.toUpperCase();
            this.actionReducers[f] = { name: e, f: void 0 !== c && c ? d[e] : d[e].fn, isReducable: !0 };
          }
        },
        {
          key: "_addSaga",
          value: function _addSaga(a) {
            // Only one key in 'withSaga', which is the name of
            // the saga-function that listens, e.g. takeEvery.
            var b = (0, _keys2.default)(a)[0],
              c = (0, _keys2.default)(a[b].withSaga)[0];
            switch (c) {
              case "takeEvery":
                return this._addSagaAction({
                  action: a,
                  exposedFnName: b,
                  sagaFnName: c,
                  sagaListener: _effects.takeEvery
                });
              default:
                throw Error(
                  "ReduxWrapper : _addSaga : fn-signature unknown. The key in 'withSaga' can't be used or isn't provided."
                );
            }
          }
        },
        {
          key: "_addSagaAction",
          value: function _addSagaAction(a) {
            var b = a.action,
              c = a.exposedFnName,
              d = a.sagaFnName,
              e = a.sagaListener,
              f = (0, _extends4.default)({}, b),
              g = (0, _keys2.default)(f)[0],
              h = "SAGA_REQ_" + this._id.toUpperCase() + "_" + g.toUpperCase(),
              i = "SAGA_REC_" + this._id.toUpperCase() + "_" + g.toUpperCase();
            (this.actionReducers[h] = {
              name: g,
              isReducable: !1,
              params: { call: _effects.call, put: _effects.put, result: { type: i } }
            }),
              this.saga.push(e(h, f[c].withSaga[d])),
              (this.actionReducers[i] = { f: f[g].fn, isReducable: !0 });
          }
        },
        {
          key: "connection",
          get: function get() {
            return (0, _reactRedux.connect)(this.mapStateToProps, this.mapDispatchToProps)(this.component);
          }
        }
      ],
      [
        {
          key: "_createExternalTypes",
          value: function _createExternalTypes(a) {
            var b = a.namespace,
              c = a.fName,
              d = a._id,
              e = a.withSaga,
              f = {
                basic: b.toUpperCase() + "_" + c.toUpperCase(),
                proxy: d.toUpperCase() + "_PROXY_" + b.toUpperCase() + "_" + c.toUpperCase()
              };
            return (
              void 0 !== e &&
                e &&
                (f.saga = {
                  req: "SAGA_REQ_" + b.toUpperCase() + "_" + c.toUpperCase(),
                  rec: "SAGA_REC_" + b.toUpperCase() + "_" + c.toUpperCase()
                }),
              (0, _extends4.default)({}, f)
            );
          }
        },
        {
          key: "_extractImportReducerParams",
          value: function _extractImportReducerParams(a) {
            var b = {};
            if (a.constructor === String) b = { fName: a, exposedName: a, withSaga: !1 };
            else if (a.constructor === Object) {
              if (!a.origin) throw Error("No 'origin' provided in element to read from.");
              b = { fName: a.origin, exposedName: a.as || a.origin, withSaga: a.withSaga || !1 };
            } else throw Error("Unexpected type in otherStateActions' key found.");
            return (0, _extends4.default)({}, b);
          }
        }
      ]
    ),
    a
  );
})();
/*
 *
 * Exports.
 *
 */ exports.default = ReduxWrapper;