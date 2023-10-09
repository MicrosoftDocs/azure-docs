---
title: Azure Web PubSub samples - authenticate and connect
titleSuffix: Azure Web PubSub
description: A list of code samples showing how to authenticate and connect to Web PubSub resource(s)
author: kevinguo-ed
ms.author: kevinguo
ms.service: azure-web-pubsub
ms.topic: sample
ms.date: 05/15/2023
ms.custom: mode-ui, devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: azure-web-pubsub-samples-authenticate-and-connect
---

# Azure Web PubSub samples - Authenticate and connect

To make use of your Azure Web PubSub resource, you need to authenticate and connect to the service first. Azure Web PubSub service distinguishes two roles and they're given a different set of capabilities.

## Client

The client can be a browser, a mobile app, an IoT device or even an EV charging point as long as it supports WebSocket. A client is limited to publishing and subscribing to messages.

## Application server

While the client's role is often limited, the application server's role goes beyond simply receiving and publishing messages. Before a client tries to connect with your Web PubSub resource, it goes to the application server for a Client Access Token first. The token is used to establish a persistent WebSocket connection with your Web PubSub resource.

::: zone pivot="method-sdk-csharp"
| Use case | Description |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| [Using connection string](https://github.com/Azure/azure-webpubsub/blob/main/samples/csharp/chatapp/Startup.cs#L29) | Applies to application server only.
| [Using Client Access Token](https://github.com/Azure/azure-webpubsub/blob/main/samples/csharp/chatapp/wwwroot/index.html#L13) | Applies to client only. Client Access Token is generated on the application server.
| [Using Microsoft Entra ID](https://github.com/Azure/azure-webpubsub/blob/main/samples/csharp/chatapp-aad/Startup.cs#L26) | Using Microsoft Entra ID for authorization offers improved security and ease of use compared to Access Key authorization.
| [Anonymous connection](https://github.com/Azure/azure-webpubsub/blob/main/samples/csharp/clientWithCert/client/Program.cs#L15) | Anonymous connection allows clients to connect with Azure Web PubSub directly without going to an application server for a Client Access Token first. This is useful for clients that have limited networking capabilities, like an EV charging point.
::: zone-end

::: zone pivot="method-sdk-javascript"
| Use case | Description |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| [Using connection string](https://github.com/Azure/azure-webpubsub/blob/main/samples/javascript/chatapp/sdk/server.js#L9) | Applies to application server only.
| [Using Client Access Token](https://github.com/Azure/azure-webpubsub/blob/main/samples/javascript/chatapp/sdk/src/index.js#L5) | Applies to client only. Client Access Token is generated on the application server.
| [Using Microsoft Entra ID](https://github.com/Azure/azure-webpubsub/blob/main/samples/javascript/chatapp-aad/server.js#L24) | Using Microsoft Entra ID for authorization offers improved security and ease of use compared to Access Key authorization.
::: zone-end

::: zone pivot="method-sdk-java"
| Use case | Description |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| [Using connection string](https://github.com/Azure/azure-webpubsub/blob/eb60438ff9e0735d90a6e7e6370b9d38aa6bc730/samples/java/chatapp/src/main/java/com/webpubsub/tutorial/App.java#L21) | Applies to application server only.
| [Using Client Access Token](https://github.com/Azure/azure-webpubsub/blob/eb60438ff9e0735d90a6e7e6370b9d38aa6bc730/samples/java/chatapp/src/main/resources/public/index.html#L12) | Applies to client only. Client Access Token is generated on the application server.
| [Using Microsoft Entra ID](https://github.com/Azure/azure-webpubsub/blob/eb60438ff9e0735d90a6e7e6370b9d38aa6bc730/samples/java/chatapp-aad/src/main/java/com/webpubsub/tutorial/App.java#L22) | Using Microsoft Entra ID for authorization offers improved security and ease of use compared to Access Key authorization.
::: zone-end

::: zone pivot="method-sdk-python"
| Use case | Description |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| [Using connection string](https://github.com/Azure/azure-webpubsub/blob/eb60438ff9e0735d90a6e7e6370b9d38aa6bc730/samples/python/chatapp/server.py#L19) | Applies to application server only.
| [Using Client Access Token](https://github.com/Azure/azure-webpubsub/blob/eb60438ff9e0735d90a6e7e6370b9d38aa6bc730/samples/python/chatapp/public/index.html#L13) | Applies to client only. Client Access Token is generated on the application server.
| [Using Microsoft Entra ID](https://github.com/Azure/azure-webpubsub/blob/eb60438ff9e0735d90a6e7e6370b9d38aa6bc730/samples/python/chatapp-aad/server.py#L21) | Using Microsoft Entra ID for authorization offers improved security and ease of use compared to Access Key authorization.
::: zone-end
