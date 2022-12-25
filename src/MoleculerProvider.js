import { PactV3 } from '@pact-foundation/pact';

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
    upnReceiving(msg) {
        this.#provider.uponReceiving(msg);
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
            data: {
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