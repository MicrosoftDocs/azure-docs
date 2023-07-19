---
title: Reference - Java Client-side SDK for Azure Web PubSub
description: This reference describes the Java client-side SDK for Azure Web PubSub service.
author: kevinguo-ed
ms.author: kevinguo
ms.service: azure-web-pubsub
ms.custom: devx-track-js
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

As shown in the diagram below, your clients establish WebSocket connections with your Web PubSub resource. 

![overflow](https://user-images.githubusercontent.com/668244/140014067-25a00959-04dc-47e8-ac25-6957bd0a71ce.png)

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

A client uses a `Client Access URL` to connect and authenticate with the service. The URL follows a pattern of `wss://<service_name>.webpubsub.azure.com/client/hubs/<hub_name>?access_token=<token>`. There're multiple ways to get a `Client Access URL`. As a quick start, you can copy and paste from Azure Portal, and for production, you usually need a negotiation server to generate the URL. [See details below.](#use-negotiation-server-to-generate-client-access-url)

#### Use `Client Access URL` from Azure Portal

As a quick start, you can go to the Portal and copy the **Client Access URL** from **Keys** blade.

![get_client_url](https://camo.githubusercontent.com/77f1e3e39a5deef7ced866eea73684ecf844f9809dc25111006436a379f8238a/68747470733a2f2f6c6561726e2e6d6963726f736f66742e636f6d2f617a7572652f617a7572652d7765622d7075627375622f6d656469612f686f77746f2d776562736f636b65742d636f6e6e6563742f67656e65726174652d636c69656e742d75726c2e706e67)

As shown in the diagram, the client will be granted permission of sending messages to specific groups and joining specific groups. Learn more about client permission, see [permissions.](https://learn.microsoft.com/azure/azure-web-pubsub/reference-json-reliable-webpubsub-subprotocol#permissions)

```java readme-sample-createClientFromUrl
WebPubSubClient client = new WebPubSubClientBuilder()
    .clientAccessUrl("<client-access-url>")
    .buildClient();
```

#### Use negotiation server to generate `Client Access URL`

In production, a client usually fetches the `Client Access URL` from a negotiation server. The server holds the `connection string` and generates the `Client Access URL` through `WebPubSubServiceClient`. As a sample, the code snippet below just demonstrates how to generate the `Client Access URL` inside a single process.

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
|Features|Usually used on client side. Publish messages and subscribe to messages.|Usually used on server side. Generate `Client Access URL` and manage clients.|

## Examples

### Consume messages from the server and groups

A client can add callbacks to consume messages from the server and groups. Please note, clients can only receive group messages that it has joined.

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

When a client is stopped, which means the client connection is disconnected and the client stops trying to reconnect, the `stopped` event will be triggered. This usually happens after the `client.StopAsync()` is called, or disabled `AutoReconnect`. If you want to restart the client, you can call `client.StartAsync()` in the `Stopped` event.

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

By default, the operation such as `client.joinGroup()`, `client.leaveGroup()`, `client.sendToGroup()`, `client.sendEvent()` has three reties. You can use `WebPubSubClientBuilder.retryOptions()` to change. If all retries have failed, an error will be thrown. You can keep retrying by passing in the same `ackId` as previous retries, thus the service can help to deduplicate the operation with the same `ackId`.

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
Use [Live Trace tool](./howto-troubleshoot-resource-logs.md#capture-resource-logs-by-using-the-live-trace-tool) from Azure Portal to inspect live message traffic through your Web PubSub resource.