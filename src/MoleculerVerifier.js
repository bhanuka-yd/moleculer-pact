import express from "express";
import bodyParser from "body-parser";
import { Verifier } from '@pact-foundation/pact';

const jsonBodyParser = bodyParser.json;

export default class {

    #initialized = false;
    #broker;
    #app;
    #providerName;
    #pactVerifierOptions;
    #pactVerifier;
    #listener;

    constructor(providerName, broker, pactVerifierOptions) {
        this.#app = express();
        this.#app.use(jsonBodyParser())
        this.#broker = broker;
        this.#providerName = providerName;
        this.#pactVerifierOptions = pactVerifierOptions;
    }

    async initialize() {
        this.#app.post("/:actionName", async (req, res) => {
            const actionName = req.params.actionName;
            const { params, opts } = req.body;
            const ret = await this.#broker.call(`${this.#providerName}.${actionName}`, params, opts);

            res.send({
                ctx: {},
                willReturn: ret
            });
        });
        var portPromResolve, portPromReject;
        const portPromise = new Promise((resolve, reject) => {
            portPromResolve = resolve;
            portPromReject = reject;
        })
        try {
            this.#listener = this.#app.listen(0, () => {
                if (portPromResolve) {
                    portPromResolve(this.#listener.address().port);
                }
            });
        } catch (e) {
            portPromReject(e);
        }
        const port = await portPromise;
        const verifierOptions = {
            provider: this.#providerName,
            providerBaseUrl: `http://127.0.0.1:${port}`,
            ...this.#pactVerifierOptions
        };
        this.#pactVerifier = new Verifier(verifierOptions);
        this.#initialized = true;
    }
    verifyProvider() {
        if (!this.#initialized) {
            throw new Error("MoleculerVerifier must be initialized befire verifying. call MoleculerVerifier.initialize first.")
        }
        return this.#pactVerifier.verifyProvider();
    }
    async destroy() {
        if (this.#listener) {
            this.#listener.close();
        }
    }
}