var index = (function() {
  'use strict';
  function s(e, t) {
    if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
  }
  function i(e, t) {
    for (var n = 0; n < t.length; n++) {
      var i = t[n];
      (i.enumerable = i.enumerable || !1), (i.configurable = !0), 'value' in i && (i.writable = !0), Object.defineProperty(e, i.key, i);
    }
  }
  function e(e, t, n) {
    return t && i(e.prototype, t), n && i(e, n), e;
  }
  function t(t, e) {
    var n = Object.keys(t);
    if (Object.getOwnPropertySymbols) {
      var i = Object.getOwnPropertySymbols(t);
      e &&
        (i = i.filter(function(e) {
          return Object.getOwnPropertyDescriptor(t, e).enumerable;
        })),
        n.push.apply(n, i);
    }
    return n;
  }
  function n(o) {
    for (var e = 1; e < arguments.length; e++) {
      var s = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? t(Object(s), !0).forEach(function(e) {
            var t, n, i;
            (t = o), (i = s[(n = e)]), n in t ? Object.defineProperty(t, n, { value: i, enumerable: !0, configurable: !0, writable: !0 }) : (t[n] = i);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(o, Object.getOwnPropertyDescriptors(s))
        : t(Object(s)).forEach(function(e) {
            Object.defineProperty(o, e, Object.getOwnPropertyDescriptor(s, e));
          });
    }
    return o;
  }
  var r = new (e(o, [
    {
      key: 'setLoggerLevel',
      value: function(e) {
        this.loggerLevel = e;
      }
    },
    {
      key: 'shouldLog',
      value: function(e) {
        return this.levels.indexOf(e) >= this.levels.indexOf(this.loggerLevel);
      }
    },
    {
      key: 'verbose',
      value: function(e) {
        this.printMessage('verbose', e);
      }
    },
    {
      key: 'debug',
      value: function(e) {
        this.printMessage('debug', e);
      }
    },
    {
      key: 'info',
      value: function(e) {
        this.printMessage('info', e);
      }
    },
    {
      key: 'warning',
      value: function(e) {
        this.printMessage('warning', e);
      }
    },
    {
      key: 'error',
      value: function(e) {
        this.printMessage('error', e);
      }
    },
    {
      key: 'printMessage',
      value: function(e, t) {
        if (this.shouldLog(e)) {
          var n = e.charAt(0).toUpperCase() + e.slice(1),
            i = '['.concat(n, '] Vuex WebExtensions: ').concat(t);
          'error' == e ? console.error(i) : 'warning' == e ? console.warn(i) : 'info' == e ? console.info(i) : console.log(i);
        }
      }
    }
  ]),
  o)();
  function o() {
    return s(this, o), o.instance || ((this.loggerLevel = 'warning'), (this.levels = ['verbose', 'debug', 'info', 'warning', 'error', 'none']), (o.instance = this)), o.instance;
  }
  function c(n, e) {
    console.log(n, e);
    var i = {};
    return (
      e.forEach(function(e) {
        var t = n[e];
        void 0 !== t && t && (i[e] = t);
      }),
      i
    );
  }
  var a =
    (e(u, [
      {
        key: 'onConnection',
        value: function(t) {
          var n = this;
          t.onDisconnect.addListener(function(e) {
            n.onDisconnect(e);
          }),
            (t.receivedMutations = []),
            (t.receivedActions = []),
            t.onMessage.addListener(function(e) {
              n.onMessage(t, e);
            }),
            this.connections.push(t),
            this.syncCurrentState(t);
        }
      },
      {
        key: 'onDisconnect',
        value: function(e) {
          for (var t = this.connections.length - 1; 0 <= t; t--) this.connections[t].name === e.name && this.connections.splice(t, 1);
        }
      },
      {
        key: 'onMessage',
        value: function(e, t) {
          if (t.type)
            switch (t.type) {
              case '@@STORE_SYNC_MUTATION':
                e.receivedMutations.push(t.data), this.store.commit(t.data.type, t.data.payload);
                break;
              case '@@STORE_SYNC_ACTION':
                e.receivedActions.push(t.data), this.store.dispatch(t.data.type, t.data.payload);
            }
        }
      },
      {
        key: 'syncCurrentState',
        value: function(e) {
          try {
            e.postMessage({ type: '@@STORE_SYNC_STATE', data: this.store.state });
          } catch (e) {
            r.error('Initial state not sent: '.concat(e));
          }
        }
      },
      {
        key: 'sendMutation',
        value: function(e, t) {
          r.verbose('Sending mutation ('.concat(t.type, ') to connection: ').concat(e.name));
          try {
            e.postMessage({ type: '@@STORE_SYNC_MUTATION', data: t });
          } catch (e) {
            r.error('Mutation not sent: '.concat(e));
          }
        }
      },
      {
        key: 'sendAction',
        value: function(e, t) {
          r.verbose('Sending action ('.concat(t.type, ') to connection: ').concat(e.name));
          try {
            e.postMessage({ type: '@@STORE_SYNC_ACTION', data: t });
          } catch (e) {
            r.error('Action not sent: '.concat(e));
          }
        }
      }
    ]),
    u);
  function u(e, i, t) {
    var o = this;
    if (
      (s(this, u),
      (this.store = e),
      (this.browser = i),
      (this.settings = t),
      (this.connections = []),
      this.settings.persistentStates.length &&
        (r.info('Persistent states detected on config, reading from localstorage...'),
        this.browser.getPersistentStates().then(function(e) {
          if (null === e) r.debug('No data found on localstorage for persistent states');
          else if (
            (r.verbose('Saved persistent states found on localstorage'),
            o.store.commit('vweReplaceState', n({}, o.store.state, {}, c(e, o.settings.persistentStates))),
            0 < o.connections.length)
          ) {
            r.info('Sending initial state to other contexts...');
            for (var t = o.connections.length - 1; 0 <= t; t--) o.syncCurrentState(o.connections[t]);
          }
        })),
      this.store.subscribe(function(e) {
        if ((r.debug('Hooked mutation ('.concat(e.type, ')')), 0 < o.settings.ignoredMutations.length && o.settings.ignoredMutations.includes(e.type)))
          r.info('Mutation ('.concat(e.type, ') are on ignored mutations list, skiping...'));
        else {
          for (var t = o.connections.length - 1; 0 <= t; t--) {
            o.connections[t].receivedMutations.length || o.sendMutation(o.connections[t], e);
            for (var n = o.connections[t].receivedMutations.length - 1; 0 <= n; n--)
              o.connections[t].receivedMutations[n].type == e.type && o.connections[t].receivedMutations[n].payload == e.payload
                ? o.connections[t].receivedMutations.splice(n, 1)
                : 0 == t && o.sendMutation(o.connections[t], e);
          }
          i.savePersistentStates(c(o.store.state, o.settings.persistentStates));
        }
      }),
      1 == this.settings.syncActions)
    )
      try {
        r.verbose('Listening for actions'),
          this.store.subscribeAction(function(e) {
            if ((r.debug('Hooked action ('.concat(e.type, ')')), 0 < o.settings.ignoredActions.length && o.settings.ignoredActions.includes(e.type)))
              r.info('Action ('.concat(e.type, ') are on ignored actions list, skiping...'));
            else
              for (var t = o.connections.length - 1; 0 <= t; t--) {
                o.connections[t].receivedActions.length || o.sendAction(o.connections[t], e);
                for (var n = o.connections[t].receivedActions.length - 1; 0 <= n; n--)
                  o.connections[t].receivedActions[n].type == e.type ? o.connections[t].receivedActions.splice(n, 1) : 0 == t && o.sendAction(o.connections[t], e);
              }
          });
      } catch (e) {
        r.info("Can't sync actions because isn't available in your Vuex version, use Vuex v2.5.0 or later for this feature");
      }
    i.handleConnection(function(e) {
      o.onConnection(e);
    });
  }
  var d = Object.freeze({
      firefox: { name: 'Mozilla Firefox', namespace: 'browser', type: 'promise' },
      chrome: { name: 'Google Chrome', namespace: 'chrome', type: 'callback' },
      edge: { name: 'Microsoft Edge', namespace: 'browser', type: 'callback' }
    }),
    g =
      (e(l, [
        {
          key: 'detectBrowser',
          value: function() {
            return 'undefined' == typeof chrome ? void (this.browser = d.edge) : 'undefined' == typeof browser ? void (this.browser = d.chrome) : void (this.browser = d.firefox);
          }
        },
        {
          key: 'isBackgroundScript',
          value: function(n) {
            var e = this;
            return new Promise(function(t) {
              try {
                e.browser == d.chrome
                  ? chrome.runtime.getBackgroundPage(function(e) {
                      return t(n === e);
                    })
                  : e.browser == d.firefox
                  ? browser.runtime.getBackgroundPage().then(function(e) {
                      return t(n === e);
                    })
                  : e.browser == d.edge &&
                    browser.runtime.getBackgroundPage(function(e) {
                      return t(n === e);
                    });
              } catch (e) {
                return t(!1);
              }
              return !1;
            });
          }
        },
        {
          key: 'getPersistentStates',
          value: function() {
            var e = this;
            return new Promise(function(t, n) {
              try {
                e.browser == d.chrome
                  ? chrome.storage.local.get('@@vwe-persistence', function(e) {
                      return e['@@vwe-persistence'] ? t(e['@@vwe-persistence']) : t(null);
                    })
                  : e.browser == d.firefox
                  ? browser.storage.local.get('@@vwe-persistence').then(function(e) {
                      return e['@@vwe-persistence'] ? t(e['@@vwe-persistence']) : t(null);
                    })
                  : e.browser == d.edge &&
                    browser.storage.local.get('@@vwe-persistence', function(e) {
                      return e['@@vwe-persistence'] ? t(e['@@vwe-persistence']) : t(null);
                    });
              } catch (e) {
                return n(e);
              }
              return !1;
            });
          }
        },
        {
          key: 'savePersistentStates',
          value: function(e) {
            if (this.browser == d.chrome)
              try {
                chrome.storage.local.set({ '@@vwe-persistence': e });
              } catch (e) {
                r.error("Can't write persistent states to local storage. Did you grant storage permission to your WebExtension?");
              }
            else if (this.browser == d.firefox)
              try {
                browser.storage.local.set({ '@@vwe-persistence': e });
              } catch (e) {
                r.error("Can't write persistent states to local storage. Did you grant storage permission to your WebExtension?");
              }
            else if (this.browser == d.edge)
              try {
                browser.storage.local.set({ '@@vwe-persistence': e });
              } catch (e) {
                r.error("Can't write persistent states to local storage. Did you grant storage permission to your WebExtension?");
              }
          }
        },
        {
          key: 'handleConnection',
          value: function(e) {
            return this.browser == d.chrome ? chrome.runtime.onConnect.addListener(e) : browser.runtime.onConnect.addListener(e);
          }
        },
        {
          key: 'connectToBackground',
          value: function(e) {
            return this.browser == d.chrome ? chrome.runtime.connect({ name: e }) : browser.runtime.connect({ name: e });
          }
        }
      ]),
      l);
  function l() {
    s(this, l), (this.browser = null), this.detectBrowser();
  }
  var h =
    (e(p, [
      {
        key: 'onMessage',
        value: function(e) {
          if ((r.verbose('Received message from background'), e.type))
            switch (e.type) {
              case '@@STORE_SYNC_STATE':
                r.info('Received store initial state'), this.store.commit('vweReplaceState', e.data), (this.initialized = !0), this.processPendingMutations();
                break;
              case '@@STORE_SYNC_MUTATION':
                if ((r.debug('Received mutation '.concat(e.data.type)), !this.initialized)) {
                  r.info('Received mutation ('.concat(e.data.type, ") but the store isn't initilized yet"));
                  break;
                }
                this.receivedMutations.push(e.data), this.store.commit(e.data.type, e.data.payload);
                break;
              case '@@STORE_SYNC_ACTION':
                if ((r.debug('Received action '.concat(e.data.type)), !this.initialized)) {
                  r.info('Received action ('.concat(e.data.type, ") but the store isn't initilized yet"));
                  break;
                }
                this.receivedActions.push(e.data), this.store.dispatch(e.data);
            }
        }
      },
      {
        key: 'hookMutation',
        value: function(e) {
          if ((r.debug('Hooked mutation ('.concat(e.type, ')')), 'vweReplaceState' !== e.type))
            if (0 < this.settings.ignoredMutations.length && this.settings.ignoredMutations.includes(e.type))
              r.info('Mutation ('.concat(e.type, ') are on ignored mutations list, skiping...'));
            else {
              if (!this.initialized) return r.info('Hooked mutation ('.concat(e.type, ') before initialization, enqued on pending mutations')), this.pendingMutations.push(e);
              if (!this.receivedMutations.length) return this.sendMutation(e);
              for (var t = this.receivedMutations.length - 1; 0 <= t; t--)
                this.receivedMutations[t].type == e.type && this.receivedMutations[t].payload == e.payload
                  ? (r.verbose('Mutation '.concat(this.receivedMutations[t].type, " it's received mutation, don't send to background again")), this.receivedMutations.splice(t, 1))
                  : 0 == t && this.sendMutation(e);
            }
          else r.debug("vweReplaceState mutation don't need send to other contexts");
        }
      },
      {
        key: 'hookAction',
        value: function(e) {
          if ((r.debug('Hooked action ('.concat(e.type, ')')), 0 < this.settings.ignoredActions.length && this.settings.ignoredActions.includes(e.type)))
            r.info('Action ('.concat(e.type, ') are on ignored action list, skiping...'));
          else {
            if (!this.initialized) return r.info('Hooked action ('.concat(e.type, ') before initialization, enqued on pending actions')), this.pendingActions.push(e);
            if (!this.receivedActions.length) return this.sendAction(e);
            for (var t = this.receivedActions.length - 1; 0 <= t; t--)
              this.receivedActions[t].type == e.type && this.receivedActions[t].payload == e.payload
                ? (r.verbose('Action '.concat(this.receivedActions[t].type, " it's received action, don't send to background again")), this.receivedActions.splice(t, 1))
                : 0 == t && this.sendAction(e);
          }
        }
      },
      {
        key: 'sendMutation',
        value: function(e) {
          r.debug('Sending mutation ('.concat(e.type, ') to background script')), this.connection.postMessage({ type: '@@STORE_SYNC_MUTATION', data: e });
        }
      },
      {
        key: 'sendAction',
        value: function(e) {
          r.debug('Sending action ('.concat(e.type, ') to background script')), this.connection.postMessage({ type: '@@STORE_SYNC_ACTION', data: e });
        }
      },
      {
        key: 'processPendingMutations',
        value: function() {
          if ((r.debug('Processing pending mutations list...'), this.pendingMutations.length))
            for (var e = 0; e < this.pendingMutations.length; e++)
              r.verbose('Processing pending mutation ('.concat(this.pendingMutations[e].type, ') with payload: ').concat(this.pendingMutations[e].payload)),
                this.store.commit(this.pendingMutations[e].type, this.pendingMutations[e].payload),
                this.pendingMutations.splice(e, 1);
          else r.info('The pending mutations list are empty');
        }
      },
      {
        key: 'processPendingActions',
        value: function() {
          if ((r.debug('Processing pending actions list...'), this.pendingActions.length))
            for (var e = 0; e < this.pendingActions.length; e++)
              r.verbose('Processing pending action ('.concat(this.pendingActions[e].type, ') with payload: ').concat(this.pendingActions[e].payload)),
                this.store.dispatch(this.pendingActions[e].type, this.pendingActions[e].payload),
                this.pendingActions.splice(e, 1);
          else r.info('The pending actions list are empty');
        }
      }
    ]),
    p);
  function p(e, t, n) {
    var i = this;
    if (
      (s(this, p),
      (this.store = e),
      (this.browser = t),
      (this.settings = n),
      (this.scriptId = Math.random()
        .toString(36)
        .substr(2, 9)),
      (this.connection = null),
      (this.receivedMutations = []),
      (this.receivedActions = []),
      (this.initialized = !1),
      (this.pendingMutations = []),
      (this.pendingActions = []),
      (this.connection = t.connectToBackground(''.concat(this.settings.connectionName, '_').concat(this.scriptId))),
      this.connection.onMessage.addListener(function(e) {
        i.onMessage(e);
      }),
      r.verbose('Listening for mutations'),
      this.store.subscribe(function(e) {
        i.hookMutation(e);
      }),
      1 == this.settings.syncActions)
    )
      try {
        r.verbose('Listening for actions'),
          this.store.subscribeAction(function(e) {
            e.payload instanceof Event && (e.payload = null), i.hookAction(e);
          });
      } catch (e) {
        r.info("Can't sync actions because isn't available in your Vuex version, use Vuex v2.5.0 or later for this feature");
      }
  }
  var f = { connectionName: 'vuex-webextensions', loggerLevel: 'warning', persistentStates: [], ignoredMutations: [], ignoredActions: [], syncActions: !0 };
  return function(e) {
    if ('undefined' == typeof window) return function() {};
    var t = n({}, f, {}, e);
    r.setLoggerLevel(t.loggerLevel);
    var i = new g();
    return function(n) {
      n.registerModule('@@VWE_Helper', {
        mutations: {
          vweReplaceState: function(e, t) {
            Object.keys(n.state).forEach(function(e) {
              n.state[e] = t[e];
            });
          }
        }
      }),
        i.isBackgroundScript(window).then(function(e) {
          return e ? new a(n, i, t) : new h(n, i, t);
        });
    };
  };
})();
//# sourceMappingURL=index.js.map
