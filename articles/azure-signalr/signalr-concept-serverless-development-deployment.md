---
title: Develop and deploy Azure Functions SignalR Service applications
description: Details on how to develop and deploy serverless real-time applications using Azure Functions and Azure SignalR Service
author: anthonychu
ms.service: signalr
ms.topic: concept
ms.date: 02/19/2019
ms.author: antchu
---

# Azure Functions development and deployment with Azure SignalR Service

## Azure Functions development

A serverless real-time application built with Azure Functions and Azure SignalR Service typically require two Azure Functions:

* A "negotiate" function that the client will call to obtain a valid SignalR Service access token and service endpoint URL
* One or more functions that send messages or manage group membership

### negotiate function

A client application requires a valid access token to connect to Azure SignalR Service. An access token can be anonymous or authenticated to a given user ID. Serverless SignalR Service applications an HTTP endpoint named "negotiate" to obtain a token and other connection information, such as the SignalR Service endpoint URL.

Use an HTTP triggered Azure Function and the *SignalRConnectionInfo* input binding to generate the connection information object. The function must have an HTTP route that ends in `/negotiate`.

For more information, see the [*SignalRConnectionInfo* input binding reference](../azure-functions/functions-bindings-signalr-service.md#signalr-connection-info-input-binding).

To learn about how to create an authenticated token, refer to [Using App Service Authentication](#using-app-service-authentication).

### Sending messages and managing group membership

Use the *SignalR* output binding to send messages to clients connected to Azure SignalR Service. You can send messages to all connected clients, or you can send to a subset of clients that are authenticated with a specific user ID or have been added to a specific group.

Users can be added to one or more groups. You can also use the *SignalR* output binding to add or remove users to/from groups.

For more information, see the [*SignalR* output binding reference](../azure-functions/functions-bindings-signalr-service.md#signalr-output-binding).

### SignalR Hubs

SignalR has a concept of "hubs". Each client connection and each message sent from Azure Functions is scoped to a specific hub. You can use hubs as a way to separate your connections and messages into logical namespaces.

## Client development

### Configuring a client connection

To connect SignalR Service, a client must complete a successful handshake that consists of these steps:

1. Make a request to the *negotiate* HTTP endpoint discussed above to obtain valid connection information
1. Connect to SignalR Service using the service endpoint URL and access token obtained from the *negotiate* endpoint

SignalR client SDKs already contain the logic required to perform the negotiation handshake. Pass the negotiate endpoint's URL, minus the `negotiate` segment, to the SDK's `HubConnectionBuilder`. Here is an example in JavaScript:

```javascript
const connection = new signalR.HubConnectionBuilder()
  .withUrl('https://my-signalr-function-app.azurewebsites.net/api')
  .build()
```

By convention, the SDK automatically appends `/negotiate` to the URL and uses it to begin the negotiation handshake.

> [!NOTE]
> If you are using the JavaScript/TypeScript SDK in a browser, you need to enable cross-origin resource sharing (CORS) on your Function App.

For more information on how to use the SignalR client SDK, refer to the documentation for your language:

* [.NET Standard](https://docs.microsoft.com/aspnet/core/signalr/dotnet-client)
* [JavaScript](https://docs.microsoft.com/aspnet/core/signalr/javascript-client)
* [Java](https://docs.microsoft.com/aspnet/core/signalr/java-client)

### Sending messages from client to the service

Although the SignalR SDK allows client applications to invoke backend logic in a SignalR hub, this functionality is not yet supported when you use Azure Functions with SignalR Service. Use HTTP requests to invoke Azure Functions.

## Azure Functions deployment

### Configuring CORS

### Using App Service Authentication

## Next steps

In this article, you have learned how to configure your application to achieve resiliency for SignalR service. To understand more details about server/client connection and connection routing in SignalR service, you can read [this article](signalr-concept-internals.md) for SignalR service internals.