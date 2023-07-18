---
title: Reference - JavaScript Client-side SDK for Azure Web PubSub
description: This reference describes the JavaScript client-side SDK for Azure Web PubSub service.
author: kevinguo-ed
ms.author: kevinguo
ms.service: azure-web-pubsub
ms.custom: devx-track-js
ms.topic: conceptual 
ms.date: 07/17/2023
---
# Web PubSub client-side SDK for JavaScript

> [!NOTE]
> Details about the terms used here are described in [key concepts](./key-concepts.md) article.

The client-side SDK aims to speed up developer's workflow; more specifically,
- simplifies managing client connections
- simplifies sending messages among clients
- automatically retries after unintended drops of client connection
- **reliably** deliveries messages in number and in order after recovering from connection drops

As shown in the diagram below, your clients establish WebSocket connections with your Web PubSub resource. 
![overflow](https://user-images.githubusercontent.com/668244/140014067-25a00959-04dc-47e8-ac25-6957bd0a71ce.png)

## Getting started

### Prerequisites
- [LTS versions of Node.js](https://nodejs.org/about/releases/)
- An Azure subscription
- A Web PubSub resource

### 1. Install the `@azure/web-pubsub-client` package
```bash
npm install @azure/web-pubsub-client
```

### 2. Connect with your Web PubSub resource
A client uses a Client Access URL to connect and authenticate with the service, which follows a pattern of `wss://<service_name>.webpubsub.azure.com/client/hubs/<hub_name>?access_token=<token>`. A client can have a few ways to obtain the Client Access URL. For this quick guide, you can copy and paste one from Azure Portal shown below. (For production, your clients usually get the Client Access URL genegrated on your application server. [See details below](#use-negotiation-server-to-generate-client-access-url) )

![get_client_url](./media/howto-websocket-connect/generate-client-url.png)

As shown in the diagram above, the client has the permissions to send messages to and join a specific group named "_group1_". 

```js
// Imports the client library
const { WebPubSubClient } = require("@azure/web-pubsub-client");

// Instantiates the client object
Expand All
	@@ -68,9 +58,8 @@ await client.start();
// The client can join/leave groups, send/receive messages to and from those groups all in real-time
```

### 3. Join groups
Note that a client can only receive messages from groups that it has joined and you need to add a callback to specify the logic of what to do when receiving messages.

```js
// ...continues the code snippet from above
Expand All
	@@ -87,7 +76,7 @@ client.on("group-message", (e) => {
await client.joinGroup(groupName);
```

### 4. Send messages to a group
```js
// ...continues the code snippet from above

Expand All
	@@ -98,39 +87,37 @@ await client.sendToGroup(groupName, "hello world", "text");
```
---
## Examples
### Handle `connected`, `disconnected` and `stopped` events
Azure Web PubSub fires system events like `connected`, `disconnected` and `stopped`. You can register event handlers to decide what the program should do when the events are fired. 

1. When a client is successfully connected to your Web PubSub resource, the `connected` event is triggered. This snippet simply logs the [connection ID](./key-concepts.md)
```js
client.on("connected", (e) => {
  console.log(`Connection ${e.connectionId} is connected.`);
});
```

2. When a client is disconnected and fails to recover the connection, the `disconnected` event is triggered. This snippet simply logs the message.
```js
client.on("disconnected", (e) => {
  console.log(`Connection disconnected: ${e.message}`);
});
```

3. The `stopped` event will be triggered when the client is disconnected **and** the client stops trying to reconnect. This usually happens after the `client.stop()` is called, or `autoReconnect` is disabled or a specified limit to trying to reconnect has reached. If you want to restart the client, you can call `client.start()` in the stopped event.

```js
// Registers an event handler for the "stopped" event
client.on("stopped", () => {
  console.log(`Client has stopped`);
});
```

### Use an application server to generate Client Access URL programatically
In production, clients usually fetch the Client Access URL from an application server. The server holds the `connection string` to your Web PubSub resource and generates the `Client Access URL` with the help from the server-side library `@azure/web-pubsub`.

#### 1. Application server 
The code snippet below is an example of an application server exposes a `/negotiate` endpoint and returns the Client Access URL.

```js
// This code snippet uses the popular Express framework
const express = require('express');
const app = express();
const port = 8080;

// Imports the server library, which is different from the client library
const { WebPubSubServiceClient } = require('@azure/web-pubsub');
const hubName = 'sample_chat';

const serviceClient = new WebPubSubServiceClient("<web-pubsub-connectionstring>", hubName);

// Note that the token allows the client to join and send messages to any groups. It is specified with the "roles" option.
app.get('/negotiate', async (req, res) => {
  let token = await serviceClient.getClientAccessToken({roles: ["webpubsub.joinLeaveGroup", "webpubsub.sendToGroup"] });
  res.json({
    url: token.url
  });
});

app.listen(port, () => console.log(`Application server listening at http://localhost:${port}/negotiate`));
```

#### 2. Client side
```js
const { WebPubSubClient } = require("@azure/web-pubsub-client")

const client = new WebPubSubClient({
  getClientAccessUrl: async () => {
    let value = await (await fetch(`/negotiate`)).json();
    return value.url;
  }
});

await client.start();
```

> [!NOTE]
> To see the full code of this sample, please refer to [samples-browser](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/web-pubsub/web-pubsub-client/samples-browser).

---
### A client consumes messages from the application server or joined groups
A client can add callbacks to consume messages from an application server or groups. 

```js
// Registers a listener for the "server-message". The callback will be invoked when your application server sends message to the connectionID, to or broadcast to all connections.
client.on("server-message", (e) => {
  console.log(`Received message ${e.message.data}`);
});

// Registers a listener for the "group-message". The callback will be invoked when the client receives a message from the groups it has joined.
client.on("group-message", (e) => {
    console.log(`Received message from ${e.message.group}: ${e.message.data}`);
});
```

> [!NOTE]
> For `group-message` event, the client can **only** receive messages from the groups that it has joined.

### Handle rejoin failure
When a client is disconnected and fails to recover, all group contexts will be cleaned up in your Web PubSub resource. This means when the client re-connects, it needs to rejoin groups. By default, the client has `autoRejoinGroup` option enabled. 

However, you should be aware of `autoRejoinGroup`'s limitations. 
- The client can only rejoin groups that it's originally joined by the client code _not_ by the server side code. 
- "Rejoin group" operations may fail due to various reasons, e.g. the client doesn't have permission to join the groups. In such cases, you need to add a callback to handle this failure.

```js
// By default autoRejoinGroups=true. You can disable it by setting to false.
const client = new WebPubSubClient("<client-access-url>", { autoRejoinGroups: true });

// Registers a listener to handle "rejoin-group-failed" event
client.on("rejoin-group-failed", e => {
  console.log(`Rejoin group ${e.group} failed: ${e.error}`);
})
```

### Retry
By default, the operation such as `client.joinGroup()`, `client.leaveGroup()`, `client.sendToGroup()`, `client.sendEvent()` has three retries. You can configure through the `messageRetryOptions`. If all retries have failed, an error will be thrown. You can keep retrying by passing in the same `ackId` as previous retries so that the Web PubSub service can deduplicate the operation.

```js
try {
  await client.joinGroup(groupName);
} catch (err) {
  let id = null;
  if (err instanceof SendMessageError) {
    id = err.ackId;
  }
  await client.joinGroup(groupName, {ackId: id});
}
```

## JavaScript Bundle
To use this client library in the browser, first, you need to use a bundler. For details on how to do this, please refer to our [bundling documentation](https://github.com/Azure/azure-sdk-for-js/blob/main/documentation/Bundling.md).

## Troubleshooting
### Enable logs
You can set the following environment variable to get the debug logs when using this library.

```bash
export AZURE_LOG_LEVEL=verbose
```

For more detailed instructions on how to enable logs, you can look at the [@azure/logger package docs](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/core/logger).

### Live Trace
Use [Live Trace tool](./howto-troubleshoot-network-trace.md#capture-resource-logs-by-using-the-live-trace-tool) from Azure Portal to view live message traffic through your Web PubSub resource.