---
title: Reference - JavaScript SDK for the Azure Web PubSub service
description: The reference describes the JavaScript SDK for the Azure Web PubSub service
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: conceptual 
ms.date: 08/26/2021
---

# JavaScript SDK for the Azure Web PubSub service

There are 2 libraries offered for JavaScript:
- [Service client library](#service-client-library) to
    - Send messages to hubs and groups.
    - Send messages to particular users and connections.
    - Organize users and connections into groups.
    - Close connections
    - Grant/revoke/check permissions for an existing connection
- [Express middleware](#express) to handle incoming client events
  - Handle abuse validation requests
  - Handle client events requests

<a name="service-client-library"></a>

## Azure Web PubSub service client library for JavaScript
Use the library to:

- Send messages to hubs and groups.
- Send messages to particular users and connections.
- Organize users and connections into groups.
- Close connections
- Grant/revoke/check permissions for an existing connection

[Source code](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/web-pubsub/web-pubsub) |
[Package (NPM)](https://www.npmjs.com/package/@azure/web-pubsub) |
[API reference documentation](/javascript/api/@azure/web-pubsub/) |
[Product documentation](https://aka.ms/awps/doc) |
[Samples][samples_ref]

### Getting started

#### Currently supported environments

- [Node.js](https://nodejs.org/) version 8.x.x or higher

#### Prerequisites

- An [Azure subscription][azure_sub].
- An existing Azure Web PubSub service instance.

#### 1. Install the `@azure/web-pubsub` package

```bash
npm install @azure/web-pubsub
```

#### 2. Create and authenticate a WebPubSubServiceClient

```js
const { WebPubSubServiceClient } = require("@azure/web-pubsub");

const serviceClient = new WebPubSubServiceClient("<ConnectionString>", "<hubName>");
```

You can also authenticate the `WebPubSubServiceClient` using an endpoint and an `AzureKeyCredential`:

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

#### Enable logs

You can set the following environment variable to get the debug logs when using this library.

- Getting debug logs from the SignalR client library

```bash
export AZURE_LOG_LEVEL=verbose
```

For more detailed instructions on how to enable logs, you can look at the [@azure/logger package docs](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/core/logger).

<a name="express"></a>

## Azure Web PubSub CloudEvents handlers for Express

Use the express library to:
- Add Web PubSub CloudEvents middleware to handle incoming client events
  - Handle abuse validation requests
  - Handle client events requests

[Source code](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/web-pubsub/web-pubsub-express) |
[Package (NPM)](https://www.npmjs.com/package/@azure/web-pubsub-express) |
[API reference documentation](/javascript/api/@azure/web-pubsub-express/) |
[Product documentation](https://aka.ms/awps/doc) |
[Samples][samples_ref]

### Getting started

#### Currently supported environments

- [Node.js](https://nodejs.org/) version 8.x.x or higher
- [Express](https://expressjs.com/) version 4.x.x or higher

#### Prerequisites

- An [Azure subscription][azure_sub].
- An existing Azure Web PubSub endpoint.

#### 1. Install the `@azure/web-pubsub-express` package

```bash
npm install @azure/web-pubsub-express
```

#### 2. Create a WebPubSubEventHandler

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

#### Client Events

Events are created during the lifecycle of a client connection. For example, a simple WebSocket client connection creates a `connect` event when it tries to connect to the service, a `connected` event when it successfully connected to the service, a `message` event when it sends messages to the service and a `disconnected` event when it disconnects from the service.

#### Event Handler

Event handler contains the logic to handle the client events. Event handler needs to be registered and configured in the service through the portal or Azure CLI beforehand. The place to host the event handler logic is generally considered as the server-side.

### Troubleshooting

#### Dump request

Set `dumpRequest` to `true` to view the incoming requests.

#### Live Trace

Use **Live Trace** from the Web PubSub service portal to view the live traffic.

[azure_sub]: https://azure.microsoft.com/free/
[samples_ref]: https://github.com/Azure/azure-webpubsub/tree/main/samples/javascript


## Next steps

[!INCLUDE [next step](includes/include-next-step.md)]
