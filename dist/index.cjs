'use strict';

const pact = require('@pact-foundation/pact');
const Axios = require('axios');

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
var _provider;
class MoleculerProvider {
  constructor({
    consumer,
    provider,
    port,
    pactFilesDir
  }) {
    __privateAdd$1(this, _provider, void 0);
    __privateSet$1(this, _provider, new pact.PactV3({
      consumer,
      provider,
      port,
      dir: pactFilesDir
    }));
  }
  upnReceiving(msg) {
    __privateGet$1(this, _provider).uponReceiving(msg);
    return this;
  }
  withCall({
    action,
    params,
    opts
  }) {
    __privateGet$1(this, _provider).withRequest({
      method: "POST",
      path: `/${action}`,
      data: {
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
    __privateGet$1(this, _provider).willRespondWith({
      status: 200,
      body: {
        willReturn
      }
    });
    return this;
  }
  executeTest(...args) {
    return __privateGet$1(this, _provider).executeTest(...args);
  }
}
_provider = new WeakMap();

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
var _axios;
class MockBroker {
  constructor(mockServer) {
    __privateAdd(this, _axios, void 0);
    __privateSet(this, _axios, Axios.create({ baseURL: mockServer.url }));
  }
  async call(actionName, params, opts) {
    const httpResp = await __privateGet(this, _axios).post(`/${actionName}`, {
      params,
      opts
    });
    return httpResp.data.willReturn;
  }
}
_axios = new WeakMap();

exports.MockBroker = MockBroker;
exports.MoleculerProvider = MoleculerProvider;
