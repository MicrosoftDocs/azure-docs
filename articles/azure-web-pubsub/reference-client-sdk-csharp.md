---
title: Reference - C# Client-side SDK for Azure Web PubSub
description: This reference describes the C# client-side SDK for Azure Web PubSub service.
author: kevinguo-ed
ms.author: kevinguo
ms.service: azure-web-pubsub
ms.custom: devx-track-dotnet
ms.topic: conceptual 
ms.date: 07/17/2023
---

# Azure Web PubSub client library for .NET

> [!NOTE]
> Details about the terms used here are described in [key concepts](./key-concepts.md) article.

The client-side SDK aims to speed up developer's workflow; more specifically,
- simplifies managing client connections
- simplifies sending messages among clients
- automatically retries after unintended drops of client connection
- **reliably** deliveries messages in number and in order after recovering from connection drops

As shown in the diagram, your clients establish WebSocket connections with your Web PubSub resource. 
:::image type="content" source="./media/reference-client-sdk-csharp/flow-overview.png" alt-text="Screenshot showing clients establishing WebSocket connection with a Web PubSub resource":::

## Getting started

### Install the package

Install the client library from [NuGet](https://www.nuget.org/):

```dotnetcli
dotnet add package Azure.Messaging.WebPubSub.Client --prerelease
```

### Prerequisites

- An Azure subscription
- An existing Web PubSub instance

### Authenticate the client

A Client uses a `Client Access URL` to connect and authenticate with the service. `Client Access URL` follows the pattern as `wss://<service_name>.webpubsub.azure.com/client/hubs/<hub_name>?access_token=<token>`. There are multiple ways to get a `Client Access URL`. As a quick start, you can copy and paste from Azure portal, and for production, you usually need a negotiation server to generate `Client Access URL`. [See details.](#use-negotiation-server-to-generate-client-access-url)

#### Use Client Access URL from Azure portal

As a quick start, you can go to Azure portal and copy the **Client Access URL** from **Keys** blade.

:::image type="content" source="./media/reference-client-sdk-csharp/get-client-access-url.png" alt-text="Screenshot showing how to get Client Access Url on Azure portal":::

As shown in the diagram, the client is granted permission of sending messages to specific groups and joining specific groups. Learn more about client permission, see [permissions.](./reference-json-reliable-webpubsub-subprotocol.md#permissions)

```C# Snippet:WebPubSubClient_Construct
var client = new WebPubSubClient(new Uri("<client-access-uri>"));
```

#### Use negotiation server to generate `Client Access URL`

In production, a client usually fetches the `Client Access URL` from a negotiation server. The server holds the `connection string` and generates the `Client Access URL` through `WebPubSubServiceClient`. As a sample, the code snippet just demonstrates how to generate the `Client Access URL` inside a single process.

```C# Snippet:WebPubSubClient_Construct2
var client = new WebPubSubClient(new WebPubSubClientCredential(token =>
{
    // In common practice, you will have a negotiation server for generating token. Client should fetch token from it.
    return FetchClientAccessTokenFromServerAsync(token);
}));
```

```C# Snippet:WebPubSubClient_GenerateClientAccessUri
public async ValueTask<Uri> FetchClientAccessTokenFromServerAsync(CancellationToken token)
{
    var serviceClient = new WebPubSubServiceClient("<< Connection String >>", "hub");
    return await serviceClient.GetClientAccessUriAsync();
}
```

Features to differentiate `WebPubSubClient` and `WebPubSubServiceClient`.

|Class Name|WebPubSubClient|WebPubSubServiceClient|
|------|---------|---------|
|NuGet Package Name|Azure.Messaging.WebPubSub.Client |Azure.Messaging.WebPubSub|
|Features|Used on client side. Publish messages and subscribe to messages.|Used on server side. Generate Client Access Uri and manage clients|

## Examples

### Consume messages from the server and groups

A client can add callbacks to consume messages from the server and groups. Note, clients can only receive group messages that it has joined.

```C# Snippet:WebPubSubClient_Subscribe_ServerMessage
client.ServerMessageReceived += eventArgs =>
{
    Console.WriteLine($"Receive message: {eventArgs.Message.Data}");
    return Task.CompletedTask;
};
```

```C# Snippet:WebPubSubClient_Subscribe_GroupMessage
client.GroupMessageReceived += eventArgs =>
{
    Console.WriteLine($"Receive group message from {eventArgs.Message.Group}: {eventArgs.Message.Data}");
    return Task.CompletedTask;
};
```

### Add callbacks for `connected`, `disconnected`, and `stopped` events

When a client connection is connected to the service, the `connected` event is triggered once it received the connected message from the service.

```C# Snippet:WebPubSubClient_Subscribe_Connected
client.Connected += eventArgs =>
{
    Console.WriteLine($"Connection {eventArgs.ConnectionId} is connected");
    return Task.CompletedTask;
};
```

When a client connection is disconnected and fails to recover, the `disconnected` event is triggered.

```C# Snippet:WebPubSubClient_Subscribe_Disconnected
client.Disconnected += eventArgs =>
{
    Console.WriteLine($"Connection is disconnected");
    return Task.CompletedTask;
};
```

When a client is stopped, which means the client connection is disconnected and the client stops trying to reconnect, the `stopped` event is triggered. This usually happens after the `client.StopAsync()` is called, or disabled `AutoReconnect`. If you want to restart the client, you can call `client.StartAsync()` in the `Stopped` event.

```C# Snippet:WebPubSubClient_Subscribe_Stopped
client.Stopped += eventArgs =>
{
    Console.WriteLine($"Client is stopped");
    return Task.CompletedTask;
};
```

### Auto rejoin groups and handle rejoin failure

When a client connection has dropped and fails to recover, all group contexts are cleaned up on the service side. That means when the client reconnects, it needs to rejoin groups. By default, the client enabled `AutoRejoinGroups` options. However, this feature has limitations. The client can only rejoin groups that it's originally joined **by the client** rather than joined **by the server side**. And rejoin group operations may fail due to various reasons, for example, the client doesn't have permission to join groups. In such cases, users need to add a callback to handle such failure.

```C# Snippet:WebPubSubClient_Subscribe_RestoreFailed
client.RejoinGroupFailed += eventArgs =>
{
    Console.WriteLine($"Restore group failed");
    return Task.CompletedTask;
};
```

### Operation and retry

By default, the operation such as `client.JoinGroupAsync()`, `client.LeaveGroupAsync()`, `client.SendToGroupAsync()`, `client.SendEventAsync()` has three reties. You can use `WebPubSubClientOptions.MessageRetryOptions` to change. If all retries have failed, an error is thrown. You can keep retrying by passing in the same `ackId` as previous retries, thus the service can help to deduplicate the operation with the same `ackId`.

```C# Snippet:WebPubSubClient_JoinGroupAndRetry
// Send message to group "testGroup"
try
{
    await client.JoinGroupAsync("testGroup");
}
catch (SendMessageFailedException ex)
{
    if (ex.AckId != null)
    {
        await client.JoinGroupAsync("testGroup", ackId: ex.AckId);
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
