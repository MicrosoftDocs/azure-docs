---
title: Reference - .NET server SDK for Azure Web PubSub service
description: The reference describes the .NET server SDK for Azure Web PubSub service
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: conceptual 
ms.date: 08/26/2021
---

# .NET server SDK for Azure Web PubSub service

This library can be used to do the following actions. Details about the terms used here are described in [Key concepts](#key-concepts) section.

- Send messages to hubs and groups. 
- Send messages to particular users and connections.
- Organize users and connections into groups.
- Close connections
- Grant, revoke, and check permissions for an existing connection

[Source code][code] |
[Package][package] |
[API reference documentation][api] |
[Product documentation](https://aka.ms/awps/doc) |
[Samples][samples_ref]

## Getting started
### Install the package

Install the client library from [NuGet](https://www.nuget.org/):

```PowerShell
dotnet add package Azure.Messaging.WebPubSub --prerelease
```

### Prerequisites

- An [Azure subscription][azure_sub].
- An existing Azure Web PubSub service instance.

### Authenticate the client

In order to interact with the service, you'll need to create an instance of the WebPubSubServiceClient class. To make this possible, you'll need the connection string or a key, which you can access in the Azure portal.

### Create a `WebPubSubServiceClient`

```csharp
var serviceClient = new WebPubSubServiceClient(new Uri("<endpoint>"), "<hub>", new AzureKeyCredential("<access-key>"));
```

## Key concepts

[!INCLUDE [Termsc](includes/terms.md)]

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
You can also easily [enable console logging](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/core/Azure.Core/samples/Diagnostics.md#logging) if you want to dig deeper into the requests you're making against the service.

[azure_sub]: https://azure.microsoft.com/free/
[samples_ref]: https://github.com/Azure/azure-webpubsub/tree/main/samples/csharp
[code]: https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/webpubsub/Azure.Messaging.WebPubSub/src
[package]: https://www.nuget.org/packages/Azure.Messaging.WebPubSub
[api]: /dotnet/api/azure.messaging.webpubsub

## Next steps

[!INCLUDE [next step](includes/include-next-step.md)]
