---
title: Reference - .NET SDK for Azure Web PubSub
description: This reference describes the .NET SDK for the Azure Web PubSub service.
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.custom: devx-track-dotnet
ms.topic: conceptual
ms.date: 11/11/2021
---

# Azure Web PubSub service client library for .NET

[Azure Web PubSub Service](./index.yml) is an Azure-managed service that helps developers easily build web applications with real-time features and publish-subscribe pattern. Any scenario that requires real-time publish-subscribe messaging between server and clients or among clients can use Azure Web PubSub service. Traditional real-time features that often require polling from server or submitting HTTP requests can also use Azure Web PubSub service.

You can use this library in your app server side to manage the WebSocket client connections, as shown in below diagram:

![The overflow diagram shows the overflow of using the service client library.](media/sdk-reference/service-client-overflow.png)

Use this library to:

- Send messages to hubs and groups.
- Send messages to particular users and connections.
- Organize users and connections into groups.
- Close connections
- Grant, revoke, and check permissions for an existing connection

[Source code](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/webpubsub/Azure.Messaging.WebPubSub/src) |
[Package](https://www.nuget.org/packages/Azure.Messaging.WebPubSub) |
[API reference documentation](/dotnet/api/overview/azure/messaging.webpubsub-readme) |
[Product documentation](./index.yml) |
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

You can also [enable console logging](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/core/Azure.Core/samples/Diagnostics.md#logging) if you want to dig deeper into the requests you're making against the service.

## Next steps

[!INCLUDE [next step](includes/include-next-step.md)]

[azure_sub]: https://azure.microsoft.com/free/dotnet/
[samples_ref]: https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/webpubsub/Azure.Messaging.WebPubSub/tests/Samples/
[awps_sample]: https://github.com/Azure/azure-webpubsub/tree/main/samples/csharp