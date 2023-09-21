---
title: 'How to: Use test automation with Azure Fluid Relay'
description: How to use test automation libraries to create automated tests for Fluid applications
ms.date: 10/05/2021
ms.topic: article
ms.service: azure-fluid
fluid.url: https://fluidframework.com/docs/testing/testing/
---

# How to: Use test automation with Azure Fluid Relay

Testing and automation are crucial to maintaining the quality and longevity of your code. Internally, Fluid uses a range of unit and integration tests powered by [Mocha](https://mochajs.org/), [Jest](https://jestjs.io/), [Puppeteer](https://github.com/puppeteer/puppeteer), and [Webpack](https://webpack.js.org/).

You can run tests using the local [@fluidframework/azure-local-service](https://www.npmjs.com/package/@fluidframework/azure-local-service) or using a test tenant in Azure Fluid Relay service. [AzureClient](https://fluidframework.com/docs/apis/azure-client/azureclient-class) can be configured to connect to both a remote service and a local service, which enables you to use a single client type between tests against live and local service instances. The only difference is the configuration used to create the client.

## Automation against Azure Fluid Relay

Your automation can connect to a test tenant for Azure Fluid Relay in the same way as a production tenant and only needs the appropriate connection configuration. See [How to: Connect to an Azure Fluid Relay service](connect-fluid-azure-service.md) for more details.

## Creating an adaptable test client

In order to create an adaptable test client, you need to configure the AzureClient differently depending on the service target. The function below uses an environment variable to determine this. You can set the environment variable in a test script to control which service is targeted.

```typescript
function createAzureClient(): AzureClient {
    const useAzure = process.env.FLUID_CLIENT === "azure";
    const tenantKey = useAzure ? process.env.FLUID_TENANTKEY as string : "";
    const user = { id: "userId", name: "Test User" };

    const connectionConfig = useAzure ? {
        type: "remote",
        tenantId: "myTenantId",
        tokenProvider: new InsecureTokenProvider(tenantKey, user),
        endpoint: "https://myServiceEndpointUrl",
    } : {
        type: "local",
        tokenProvider: new InsecureTokenProvider("", user),
        endpoint: "http://localhost:7070",
    };
    const clientProps = {
        connection: config,
    };

    return new AzureClient(clientProps);
}
```

Your tests can call this function to create an AzureClient object without concerning itself about the underlying service. The [Mocha](https://mochajs.org/) test below creates the service client before running any tests, and then uses it to run each test. There is a single test that uses the service client to create a container which passes as long as no errors are thrown.

```typescript
describe("ClientTest", () => {
    const client = createAzureClient();
    let documentId: string;

    it("can create Azure container successfully", async () => {
        const schema: ContainerSchema = {
            initialObjects: {
                customMap: SharedMap
            },
        };
        documentId = await container.attach();
        const { container, services } = await azureClient.createContainer(schema);
    });
});

```

## Running tests

You can add the following npm scripts in your project's package.json to run tests:

```json
"scripts": {
    "start:local": "npx @fluidframework/azure-local-service@latest > local-service.log 2>&1",
    "test:mocha": "mocha",
    "test:azure": "cross-env process.env.FLUID_CLIENT='\"azure\"' && npm run test:mocha",
    "test:local": "start-server-and-test start:local 7070 test:mocha"
}
```

To install the dependencies required by the scripts above, you can use the following command:

```bash
npm install cross-env start-server-and-test mocha
```

The `test:local` script uses the [start-server-and-test](https://www.npmjs.com/package/start-server-and-test) library to start the local server, wait until port 7070 (the default port used by the local server) responds, run the test script, and then terminate the local server.
