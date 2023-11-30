---
title: Negotiation Server
description: This article provides information about negotiate in Azure SignalR service.
author: JialinXin
ms.author: jixin
ms.service: signalr
ms.topic: conceptual
ms.date: 12/01/2023
---

# Negotiation Server

When use Azure SignalR service, negotiation is a required step. This ensures the security of service that is not directly controlled by the client. And in some cases, customer would need a negotiate server to process client request before allowing them setup the connection to service.

* Server would like to gate clients before they start connecting service
* Serverless mode that don't have a web server handling negotiation

## How to add negotiation server?

Under `Default` mode, server SDK would handling this for you. And you can leverage server side `ServiceOptions` to customize some configuration related to the client, i.e. `AccessTokenLifetime`, `ClaimsProvider`, `AccessTokenAlgorithm`.

Under `Serverless` mode, there's is not server accepts SignalR clients. To protect your connection string, you need to redirect SignalR clients from the negotiation endpoint to Azure SignalR Service instead of giving your connection string to all the SignalR clients.

The best practice is to host a negotiation endpoint and then you can use SignalR clients to connect your hub: `/<Your Hub Name>`.

This can be approached by working with [Management SDK](https://github.com/Azure/azure-signalr/blob/dev/docs/management-sdk-guide.md).

You can use the instance of `ServiceHubContext` to generate the endpoint url and corresponding access token for SignalR clients to connect to your Azure SignalR Service.

```cs
var negotiationResponse = await serviceHubContext.NegotiateAsync(new (){UserId = "<Your User Id>"});
```

Suppose your hub endpoint is `http://<Your Host Name>/<Your Hub Name>`, then your negotiation endpoint will be `http://<Your Host Name>/<Your Hub Name>/negotiate`. Once you host the negotiation endpoint, you can use the SignalR clients to connect to your hub like this:

```cs
var connection = new HubConnectionBuilder().WithUrl("http://<Your Host Name>/<Your Hub Name>").Build();
await connection.StartAsync();
```

The sample on how to use Management SDK to redirect SignalR clients to Azure SignalR Service can be found [here](https://github.com/aspnet/AzureSignalR-samples/tree/main/samples/Management/NegotiationServer).

## Next Steps

See the following articles to learn more about how to use Default and Serverless modes.

- [Azure SignalR Service internals](signalr-concept-internals.md)

- [Azure Functions development and configuration with Azure SignalR Service](signalr-concept-serverless-development-config.md)
