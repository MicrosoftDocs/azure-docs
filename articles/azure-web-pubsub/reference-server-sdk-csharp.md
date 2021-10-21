---
title: Reference - .NET server SDK for Azure Web PubSub
description: This reference describes the .NET server SDK for the Azure Web PubSub service.
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: conceptual 
ms.date: 08/26/2021
---

# .NET server SDK for Azure Web PubSub

You can use this library to:

- Send messages to hubs and groups. 
- Send messages to particular users and connections.
- Organize users and connections into groups.
- Close connections.
- Grant, revoke, and check permissions for an existing connection.

For more information about this terminology, see [Key concepts](#key-concepts).

[Source code][code] |
[Package][package] |
[API reference documentation][api] |
[Product documentation](./index.yml) |
[Samples][samples_ref]

## Get started

Install the client library from [NuGet](https://www.nuget.org/):

```PowerShell
dotnet add package Azure.Messaging.WebPubSub --prerelease
```

### Prerequisites

- An [Azure subscription][azure_sub].
- An existing instance of the Azure Web PubSub service.

### Authenticate the client

To interact with the service, you'll need to create an instance of the `WebPubSubServiceClient` class. To make this possible, you'll need the connection string or a key, which you can access in the Azure portal.

### Create a `WebPubSubServiceClient`

Here's how:

```csharp
var serviceClient = new WebPubSubServiceClient(new Uri("<endpoint>"), "<hub>", new AzureKeyCredential("<access-key>"));
```

## Key concepts

[!INCLUDE [Terms](includes/terms.md)]

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

If you want to dig deeper into the requests you're making against the service, you can [enable console logging](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/core/Azure.Core/samples/Diagnostics.md#logging).

[azure_sub]: https://azure.microsoft.com/free/
[samples_ref]: https://github.com/Azure/azure-webpubsub/tree/main/samples/csharp
[code]: https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/webpubsub/Azure.Messaging.WebPubSub/src
[package]: https://www.nuget.org/packages/Azure.Messaging.WebPubSub
[api]: /dotnet/api/azure.messaging.webpubsub

## Next steps

[!INCLUDE [next step](includes/include-next-step.md)]