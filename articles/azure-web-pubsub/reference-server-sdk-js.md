---
title: Reference - JavaScript SDK for Azure Web PubSub
description: This reference describes the JavaScript SDK for the Azure Web PubSub service.
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: conceptual 
ms.date: 08/26/2021
---

# JavaScript SDK for Azure Web PubSub

There are two libraries offered for JavaScript: the service client library and express middleware. The following sections contain more information about these libraries.

<a name="service-client-library"></a>

## Azure Web PubSub service client library for JavaScript

You can use this library to:
- Send messages to hubs and groups. 
- Send messages to particular users and connections.
- Organize users and connections into groups.
- Close connections.
- Grant, revoke, and check permissions for an existing connection.

[Source code](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/web-pubsub/web-pubsub) |
[Package (NPM)](https://www.npmjs.com/package/@azure/web-pubsub) |
[API reference documentation](/javascript/api/@azure/web-pubsub/) |
[Product documentation](./index.yml) |
[Samples][samples_ref]

### Get started

Use [Node.js](https://nodejs.org/) version 8.x.x or later. Additionally, make sure you have the following prerequisites:

- An [Azure subscription][azure_sub].
- An existing Azure Web PubSub service instance.

#### Install the `@azure/web-pubsub` package

```bash
npm install @azure/web-pubsub
```

#### Create and authenticate `WebPubSubServiceClient`

```js
const { WebPubSubServiceClient } = require("@azure/web-pubsub");

const serviceClient = new WebPubSubServiceClient("<ConnectionString>", "<hubName>");
```

You can also authenticate `WebPubSubServiceClient` by using an endpoint and an `AzureKeyCredential`:

```js
const { WebPubSubServiceClient, AzureKeyCredential } = require("@azure/web-pubsub");

const key = new AzureKeyCredential("<Key>");
const serviceClient = new WebPubSubServiceClient("<Endpoint>", key, "<hubName>");
```

### Key concepts

[!INCLUDE [Terms](includes/terms.md)]

### Examples

#### Broadcast a JSON message to all users

```js
const { WebPubSubServiceClient } = require("@azure/web-pubsub");

const serviceClient = new WebPubSubServiceClient("<ConnectionString>", "<hubName>");
await serviceClient.sendToAll({ message: "Hello world!" });
```

#### Broadcast a plain text message to all users

```js
const { WebPubSubServiceClient } = require("@azure/web-pubsub");

const serviceClient = new WebPubSubServiceClient("<ConnectionString>", "<hubName>");
await serviceClient.sendToAll("Hi there!", { contentType: "text/plain" });
```

#### Broadcast a binary message to all users

```js
const { WebPubSubServiceClient } = require("@azure/web-pubsub");

const serviceClient = new WebPubSubServiceClient("<ConnectionString>", "<hubName>");

const payload = new Uint8Array(10);
await serviceClient.sendToAll(payload.buffer);
```

### Troubleshooting

You can set the following environment variable to get the debug logs when you're using this library:

- Getting debug logs from the SignalR client library

```bash
export AZURE_LOG_LEVEL=verbose
```

For more detailed instructions on how to enable logs, see the [@azure/logger package docs](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/core/logger).

<a name="express"></a>

## Azure Web PubSub CloudEvents handlers for express

You can use the express library to:
- Add Web PubSub CloudEvents middleware to handle incoming client events.
  - Handle abuse validation requests.
  - Handle client events requests.

[Source code](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/web-pubsub/web-pubsub-express) |
[Package (NPM)](https://www.npmjs.com/package/@azure/web-pubsub-express) |
[API reference documentation](/javascript/api/@azure/web-pubsub-express/) |
[Product documentation](./index.yml) |
[Samples][samples_ref]

### Get started

Use [Node.js](https://nodejs.org/) version 8.x.x or later, or [Express](https://expressjs.com/) version 4.x.x or later. Additionally, make sure you have the following prerequisites:

- An [Azure subscription][azure_sub].
- An existing Azure Web PubSub endpoint.

#### Install the `@azure/web-pubsub-express` package

```bash
npm install @azure/web-pubsub-express
```

#### Create `WebPubSubEventHandler`

```js
const express = require("express");

const { WebPubSubEventHandler } = require("@azure/web-pubsub-express");
const handler = new WebPubSubEventHandler(
  "chat",
  ["https://<yourAllowedService>.webpubsub.azure.com"],
  {
    handleConnect: (req, res) => {
      // auth the connection and set the userId of the connection
      res.success({
        userId: "<userId>"
      });
    }
  }
);

const app = express();

app.use(handler.getMiddleware());

app.listen(3000, () =>
  console.log(`Azure WebPubSub Upstream ready at http://localhost:3000${handler.path}`)
);
```

### Key concepts

- **Client events:** A client creates events during the lifecycle of a connection. For example, a simple WebSocket client connection creates the following events:
  - A `connect` event when it tries to connect to the service.
  - A `connected` event when it successfully connects to the service.
  - A `message` event when it sends messages to the service.
  - A `disconnected` event when it disconnects from the service.

- **Event handler:** An event handler contains the logic to handle the client events. The event handler needs to be registered and configured in the service beforehand, through the Azure portal or the Azure CLI. The server generally hosts the event handler logic.

### Troubleshooting

#### Dump request

Set `dumpRequest` to `true` to view the incoming requests.

#### Live Trace

Use **Live Trace** from the Web PubSub service portal to view the live traffic.

[azure_sub]: https://azure.microsoft.com/free/
[samples_ref]: https://github.com/Azure/azure-webpubsub/tree/main/samples/javascript


## Next steps

[!INCLUDE [next step](includes/include-next-step.md)]