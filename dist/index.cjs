'use strict';

const pact = require('@pact-foundation/pact');
const Axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');

var __accessCheck$2 = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet$2 = (obj, member, getter) => {
  __accessCheck$2(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd$2 = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet$2 = (obj, member, value, setter) => {
  __accessCheck$2(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _provider;
class MoleculerProvider {
  constructor({
    consumer,
    provider,
    port,
    pactFilesDir
  }) {
    __privateAdd$2(this, _provider, void 0);
    __privateSet$2(this, _provider, new pact.PactV3({
      consumer,
      provider,
      port,
      dir: pactFilesDir
    }));
  }
  upnReceiving(msg) {
    __privateGet$2(this, _provider).uponReceiving(msg);
    return this;
  }
  withCall({
    action,
    params,
    opts
  }) {
    __privateGet$2(this, _provider).withRequest({
      method: "POST",
      path: `/${action}`,
      body: {
        params,
        opts
      }
    });
    return this;
  }
  willRespondWith({
    ctx,
    willReturn
  }) {
    __privateGet$2(this, _provider).willRespondWith({
      status: 200,
      headers: {
        "Content-Type": pact.MatchersV3.string()
      },
      body: {
        willReturn
      }
    });
    return this;
  }
  executeTest(...args) {
    return __privateGet$2(this, _provider).executeTest(...args);
  }
}
_provider = new WeakMap();

var __accessCheck$1 = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet$1 = (obj, member, getter) => {
  __accessCheck$1(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd$1 = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet$1 = (obj, member, value, setter) => {
  __accessCheck$1(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _axios;
class MockBroker {
  constructor(mockServer) {
    __privateAdd$1(this, _axios, void 0);
    __privateSet$1(this, _axios, Axios.create({ baseURL: mockServer.url }));
  }
  async call(actionName, params, opts) {
    const httpResp = await __privateGet$1(this, _axios).post(`/${actionName}`, {
      params,
      opts
    });
    return httpResp.data.willReturn;
  }
}
_axios = new WeakMap();

var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _initialized, _broker, _app, _providerName, _pactVerifierOptions, _pactVerifier, _listener;
class MoleculerVerifier {
  constructor(providerName, broker, pactVerifierOptions) {
    __privateAdd(this, _initialized, false);
    __privateAdd(this, _broker, void 0);
    __privateAdd(this, _app, void 0);
    __privateAdd(this, _providerName, void 0);
    __privateAdd(this, _pactVerifierOptions, void 0);
    __privateAdd(this, _pactVerifier, void 0);
    __privateAdd(this, _listener, void 0);
    __privateSet(this, _app, express());
    __privateGet(this, _app).use(bodyParser.json());
    __privateSet(this, _broker, broker);
    __privateSet(this, _providerName, providerName);
    __privateSet(this, _pactVerifierOptions, pactVerifierOptions);
  }
  async initialize() {
    __privateGet(this, _app).post("/:actionName", async (req, res) => {
      const actionName = req.params.actionName;
      const { params, opts } = req.body;
      const ret = await __privateGet(this, _broker).call(`${__privateGet(this, _providerName)}.${actionName}`, params, opts);
      res.send({
        ctx: {},
        willReturn: ret
      });
    });
    var portPromResolve, portPromReject;
    const portPromise = new Promise((resolve, reject) => {
      portPromResolve = resolve;
      portPromReject = reject;
    });
    try {
      __privateSet(this, _listener, __privateGet(this, _app).listen(0, () => {
        if (portPromResolve) {
          portPromResolve(__privateGet(this, _listener).address().port);
        }
      }));
    } catch (e) {
      portPromReject(e);
    }
    const port = await portPromise;
    const verifierOptions = {
      provider: __privateGet(this, _providerName),
      providerBaseUrl: `http://localhost:${port}`,
      ...__privateGet(this, _pactVerifierOptions)
    };
    __privateSet(this, _pactVerifier, new pact.Verifier(verifierOptions));
    __privateSet(this, _initialized, true);
  }
  verifyProvider() {
    if (!__privateGet(this, _initialized)) {
      throw new Error("MoleculerVerifier must be initialized befire verifying. call MoleculerVerifier.initialize first.");
    }
    return __privateGet(this, _pactVerifier).verifyProvider();
  }
  async destroy() {
    if (__privateGet(this, _listener)) {
      __privateGet(this, _listener).close();
    }
  }
}
_initialized = new WeakMap();
_broker = new WeakMap();
_app = new WeakMap();
_providerName = new WeakMap();
_pactVerifierOptions = new WeakMap();
_pactVerifier = new WeakMap();
_listener = new WeakMap();

exports.MockBroker = MockBroker;
exports.MoleculerProvider = MoleculerProvider;
exports.MoleculerVerifier = MoleculerVerifier;
