import { PactV3, MatchersV3 } from '@pact-foundation/pact';

export default class {

    /**@type {import('@pact-foundation/pact').PactV3} */
    #provider;

    constructor({
        consumer,
        provider,
        port,
        pactFilesDir
    }) {
        this.#provider = new PactV3({
            consumer,
            provider,
            port,
            dir: pactFilesDir
        });
    }
    uponReceiving(msg) {
        this.#provider.uponReceiving(msg);
        return this;
    }
    given(providerState, parameters) {
        this.#provider.given(providerState, parameters)
        return this;
    }
    withCall({
        action,
        params,
        opts
    }) {
        this.#provider.withRequest({
            method: 'POST',
            path: `/${action}`,
            body: {
                params,
                opts
            }
        })
        return this;
    }
    willRespondWith({
        ctx,
        willReturn
    }) {
        this.#provider.willRespondWith({
            status: 200,
            body: {
                willReturn
            }
        });
        return this;
    }
    executeTest(...args) {
        return this.#provider.executeTest(...args);
    }
}