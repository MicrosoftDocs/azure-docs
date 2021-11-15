---
title: Reference - .NET SDK for Azure Web PubSub
description: This reference describes the .NET SDK for the Azure Web PubSub service.
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: conceptual 
ms.date: 11/11/2021
---

# Azure Web PubSub service client library for .NET

[Azure Web PubSub Service](https://aka.ms/awps/doc) is an Azure-managed service that helps developers easily build web applications with real-time features and publish-subscribe pattern. Any scenario that requires real-time publish-subscribe messaging between server and clients or among clients can use Azure Web PubSub service. Traditional real-time features that often require polling from server or submitting HTTP requests can also use Azure Web PubSub service.

You can use this library in your app server side to manage the WebSocket client connections, as shown in below diagram:

![overflow](https://user-images.githubusercontent.com/668244/140014067-25a00959-04dc-47e8-ac25-6957bd0a71ce.png)

Use this library to:
- Send messages to hubs and groups. 
- Send messages to particular users and connections.
- Organize users and connections into groups.
- Close connections
- Grant, revoke, and check permissions for an existing connection

Details about the terms used here are described in [Key concepts](#key-concepts) section.
 
[Source code](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/webpubsub/Azure.Messaging.WebPubSub/src) |
[Package](https://www.nuget.org/packages/Azure.Messaging.WebPubSub) |
[API reference documentation](https://aka.ms/awps/sdk/csharp) |
[Product documentation](https://aka.ms/awps/doc) |
[Samples][samples_ref]

## Getting started

### Install the package

Install the client library from [NuGet](https://www.nuget.org/):

```dotnetcli
dotnet add package Azure.Messaging.WebPubSub
```

### Prerequisites

- An [Azure subscription][azure_sub].
- An existing Azure Web PubSub service instance.

### Create and authenticate a `WebPubSubServiceClient`

In order to interact with the service, you'll need to create an instance of the `WebPubSubServiceClient` class. To make this possible, you'll need the connection string or a key, which you can access in the Azure portal.

```C# Snippet:WebPubSubAuthenticate
var serviceClient = new WebPubSubServiceClient(new Uri(endpoint), "some_hub", new AzureKeyCredential(key));
```

## Key concepts

### Connection

A connection, also known as a client or a client connection, represents an individual WebSocket connection connected to the Web PubSub service. When successfully connected, a unique connection ID is assigned to this connection by the Web PubSub service.

### Hub

A hub is a logical concept for a set of client connections. Usually you use one hub for one purpose, for example, a chat hub, or a notification hub. When a client connection is created, it connects to a hub, and during its lifetime, it belongs to that hub. Different applications can share one Azure Web PubSub service by using different hub names.

### Group

A group is a subset of connections to the hub. You can add a client connection to a group, or remove the client connection from the group, anytime you want. For example, when a client joins a chat room, or when a client leaves the chat room, this chat room can be considered to be a group. A client can join multiple groups, and a group can contain multiple clients.

### User

Connections to Web PubSub can belong to one user. A user might have multiple connections, for example when a single user is connected across multiple devices or multiple browser tabs.

### Message

When a client is connected, it can send messages to the upstream application, or receive messages from the upstream application, through the WebSocket connection.

## Examples

### Broadcast a text message to all clients

```C# Snippet:WebPubSubHelloWorld
var serviceClient = new WebPubSubServiceClient(new Uri(endpoint), "some_hub", new AzureKeyCredential(key));

serviceClient.SendToAll("Hello World!");
```

### Broadcast a JSON message to all clients

```C# Snippet:WebPubSubSendJson
var serviceClient = new WebPubSubServiceClient(new Uri(endpoint), "some_hub", new AzureKeyCredential(key));

serviceClient.SendToAll(RequestContent.Create(
        new
        {
            Foo = "Hello World!",
            Bar = 42
        }),
        ContentType.ApplicationJson);
```

### Broadcast a binary message to all clients

```C# Snippet:WebPubSubSendBinary
var serviceClient = new WebPubSubServiceClient(new Uri(endpoint), "some_hub", new AzureKeyCredential(key));

Stream stream = BinaryData.FromString("Hello World!").ToStream();
serviceClient.SendToAll(RequestContent.Create(stream), ContentType.ApplicationOctetStream);
```

## Troubleshooting

### Setting up console logging
You can also easily [enable console logging](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/core/Azure.Core/samples/Diagnostics.md#logging) if you want to dig deeper into the requests you're making against the service.

## Next steps

[!INCLUDE [next step](includes/include-next-step.md)]


[azure_sub]: https://azure.microsoft.com/free/dotnet/
[samples_ref]: https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/webpubsub/Azure.Messaging.WebPubSub/tests/Samples/
[awps_sample]: https://github.com/Azure/azure-webpubsub/tree/main/samples/csharp
