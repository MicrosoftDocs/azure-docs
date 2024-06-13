---
title: Reference - Java Client-side SDK for Azure Web PubSub
description: This reference describes the Java client-side SDK for Azure Web PubSub service.
author: kevinguo-ed
ms.author: kevinguo
ms.service: azure-web-pubsub
ms.custom: devx-track-extended-java
ms.topic: conceptual 
ms.date: 07/17/2023
---

# Azure WebPubSub client library for Java

> [!NOTE]
> Details about the terms used here are described in [key concepts](./key-concepts.md) article.

The client-side SDK aims to speed up developer's workflow; more specifically,
- simplifies managing client connections
- simplifies sending messages among clients
- automatically retries after unintended drops of client connection
- **reliably** deliveries messages in number and in order after recovering from connection drops

As shown in the diagram, your clients establish WebSocket connections with your Web PubSub resource. 

:::image type="content" source="./media/reference-client-sdk-java/flow-overview.png" alt-text="Screenshot showing clients establishing WebSocket connection with a Web PubSub resource":::

## Getting started

### Prerequisites

- Java Development Kit (JDK) with version 8 or above
- Azure subscription
- An existing Web PubSub instance

### Adding the package to your product

[//]: # ({x-version-update-start;com.azure:azure-messaging-webpubsub-client;current})
```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-messaging-webpubsub-client</artifactId>
    <version>1.0.0-beta.1</version>
</dependency>
```
[//]: # ({x-version-update-end})

### Authenticate the client

A client uses a `Client Access URL` to connect and authenticate with the service. The URL follows a pattern of `wss://<service_name>.webpubsub.azure.com/client/hubs/<hub_name>?access_token=<token>`. There are multiple ways to get a `Client Access URL`. As a quick start, you can copy and paste from Azure portal, and for production, you usually need a negotiation server to generate the URL. [See details.](#use-negotiation-server-to-generate-client-access-url)

#### Use `Client Access URL` from Azure portal

As a quick start, you can go to Azure portal and copy the **Client Access URL** from **Keys** blade.

:::image type="content" source="./media/reference-client-sdk-java/get-client-access-url.png" alt-text="Screenshot showing how to get Client Access Url on Azure portal":::

As shown in the diagram, the client is granted permission of sending messages to specific groups and joining specific groups. Learn more about client permission, see [permissions.](./reference-json-reliable-webpubsub-subprotocol.md#permissions)

```java readme-sample-createClientFromUrl
WebPubSubClient client = new WebPubSubClientBuilder()
    .clientAccessUrl("<client-access-url>")
    .buildClient();
```

#### Use negotiation server to generate `Client Access URL`

In production, a client usually fetches the `Client Access URL` from a negotiation server. The server holds the `connection string` and generates the `Client Access URL` through `WebPubSubServiceClient`. As a sample, the code snippet just demonstrates how to generate the `Client Access URL` inside a single process.

```java readme-sample-createClientFromCredential
// WebPubSubServiceAsyncClient is from com.azure:azure-messaging-webpubsub
// create WebPubSub service client
WebPubSubServiceAsyncClient serverClient = new WebPubSubServiceClientBuilder()
    .connectionString("<connection-string>")
    .hub("<hub>>")
    .buildAsyncClient();

// wrap WebPubSubServiceAsyncClient.getClientAccessToken as WebPubSubClientCredential
WebPubSubClientCredential clientCredential = new WebPubSubClientCredential(Mono.defer(() ->
    serverClient.getClientAccessToken(new GetClientAccessTokenOptions()
            .setUserId("<user-name>")
            .addRole("webpubsub.joinLeaveGroup")
            .addRole("webpubsub.sendToGroup"))
        .map(WebPubSubClientAccessToken::getUrl)));

// create WebPubSub client
WebPubSubClient client = new WebPubSubClientBuilder()
    .credential(clientCredential)
    .buildClient();
```

Features to differentiate `WebPubSubClient` and `WebPubSubServiceClient`.

|Class Name|WebPubSubClient|WebPubSubServiceClient|
|------|---------|---------|
|Package Name|azure-messaging-webpubsub-client|azure-messaging-webpubsub|
|Features|Used on client side. Publish messages and subscribe to messages.|Used on server side. Generate `Client Access URL` and manage clients.|

## Examples

### Consume messages from the server and groups

A client can add callbacks to consume messages from the server and groups. Note, clients can only receive group messages that it has joined.

```java readme-sample-listenMessages
client.addOnGroupMessageEventHandler(event -> {
    System.out.println("Received group message from " + event.getFromUserId() + ": "
        + event.getData().toString());
});
client.addOnServerMessageEventHandler(event -> {
    System.out.println("Received server message: "
        + event.getData().toString());
});
```

### Add callbacks for `connected`, `disconnected`, and `stopped` events

When a client connection is connected to the service, the `connected` event is triggered.

When a client connection is disconnected and fails to recover, the `disconnected` event is triggered.

When a client is stopped, which means the client connection is disconnected and the client stops trying to reconnect, the `stopped` event is triggered. This usually happens after the `client.StopAsync()` is called, or disabled `AutoReconnect`. If you want to restart the client, you can call `client.StartAsync()` in the `Stopped` event.

```java readme-sample-listenEvent
client.addOnConnectedEventHandler(event -> {
    System.out.println("Connection is connected: " + event.getConnectionId());
});
client.addOnDisconnectedEventHandler(event -> {
    System.out.println("Connection is disconnected");
});
client.addOnStoppedEventHandler(event -> {
    System.out.println("Client is stopped");
});
```

### Operation and retry

By default, the operation such as `client.joinGroup()`, `client.leaveGroup()`, `client.sendToGroup()`, `client.sendEvent()` has three reties. You can use `WebPubSubClientBuilder.retryOptions()` to change. If all retries have failed, an error is thrown. You can keep retrying by passing in the same `ackId` as previous retries, thus the service can help to deduplicate the operation with the same `ackId`.

```java readme-sample-sendAndRetry
try {
    client.joinGroup("testGroup");
} catch (SendMessageFailedException e) {
    if (e.getAckId() != null) {
        client.joinGroup("testGroup", e.getAckId());
    }
}
```

## Troubleshooting
### Enable logs
You can set the following environment variable to get the debug logs when using this library.

```bash
export AZURE_LOG_LEVEL=verbose
```

For more detailed instructions on how to enable logs, you can look at the [@azure/logger package docs](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/core/logger).

### Live Trace
Use [Live Trace tool](./howto-troubleshoot-resource-logs.md#capture-resource-logs-by-using-the-live-trace-tool) from Azure portal to inspect live message traffic through your Web PubSub resource.
