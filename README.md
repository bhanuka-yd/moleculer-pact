# Moleculer-pact

This library will make it easy to do contract testing for
[Moleculer](https://moleculer.services) services with
[Pact](https://docs.pact.io)

### Why I created this library?

I needed to do contract testing for a micro-services projet written in
moleculer. and pact is a great library for contract testing. but I have found it
quite difficult to integrate into moleculer concept. So this library will fix
that for the time being, until a better solution comes along.

### How ?

This library uses a hacky way of using the HTTP protocol to do the contract
testing for moleculer services.

### Support ?

I will continue to add features like streams, but will stop supporting once I
found a better solution.

---

## Example

#### client.test.js (consumer)

```js
const path = require('path');
const { MoleculerProvider, MockBroker } = require('moleculer-pact');

const pact = require('@pact-foundation/pact-node');
const { MatchersV3 } = require('@pact-foundation/pact');

describe('Test Describe', () => {
    const mock_port = 1234;
    const pactFilesDir = path.resolve(process.cwd(), 'tests', 'pacts');

    const provider = new MoleculerProvider({
        consumer: 'bundler-service',
        provider: 'printable-service',
        port: mock_port,
        pactFilesDir: pactFilesDir
    });

    const publisherOpts = {
        pactFilesOrDirs: [pactFilesDir],
        pactBroker: 'http://127.0.0.1:9292',
        pactBrokerUsername: 'testuser',
        pactBrokerPassword: 'testpass',
        consumerVersion: '1.0.0'
    };

    afterAll(async () => {
        await pact.publishPacts(publisherOpts);
        console.log('Published pacts');
    });
    it('test: isPrintJobReady', () => {
        provider
            .upnReceiving('a call to check if print job is done')
            .withCall({
                action: 'isPrintJobReady',
                params: {
                    printJobId: '123456789-10'
                },
                opts: {}
            })
            .willRespondWith({
                ctx: {},
                willReturn: MatchersV3.boolean()
            });
        return provider.executeTest(async (mockServer) => {
            const broker = new MockBroker(mockServer);
            const ret = await broker.call(
                'isPrintJobReady',
                {
                    printJobId: '123456789-10'
                },
                {}
            );
            expect(typeof ret).toEqual('boolean');
        });
    });
});
```

### server.test.js (provider)

```js
const assert = require('assert');
const { ServiceBroker, Context } = require('moleculer');
const { MoleculerVerifier } = require('moleculer-pact');

const Service = {
    name: 'printable-service',
    actions: {
        isPrintJobReady: {
            // Add param validation
            params: {
                printJobId: 'string'
            },
            handler(ctx) {
                return Math.random() * 10 > 5;
            }
        }
    }
};

let broker = new ServiceBroker({ logger: false });
let serviceS = broker.createService(Service);

const consumer_name = 'bundler-service';

beforeAll(() => broker.start());
afterAll(async () => {
    await broker.stop();
});

describe('Pact Verification', () => {
    const options = {
        provider: 'printable-service',
        pactBrokerUrl: 'http://127.0.0.1:9292',
        pactBrokerUsername: 'testuser',
        pactBrokerPassword: 'testpass',
        consumerVersionSelectors: [
            {
                consumer: consumer_name,
                latest: true,
                currentlyDeployed: false
            }
        ],
        publishVerificationResult: true,
        providerVersion: '1.0.0'
    };

    const verifier = new MoleculerVerifier(
        'printable-service',
        broker,
        options
    );

    beforeAll(async () => {
        await verifier.initialize();
    });
    afterAll(async () => {
        await verifier.destroy();
    });

    it('verifies the provider', async () => {
        try {
            const verifyRes = await verifier.verifyProvider();
            console.log('Pact Verification Complete!');
            console.log('Result:', verifyRes);
        } catch (e) {
            console.log(e);
            assert.fail();
        }
    });
});
```

## Asynchronous Pacts

You dont need this library to test asynchronous message pacts. since it can be
done using just Pact-js
