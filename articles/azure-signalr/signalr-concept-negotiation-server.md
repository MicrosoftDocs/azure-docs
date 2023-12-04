---
title: Negotiation Server
description: This article provides information about customized negotiate in Azure SignalR service.
author: JialinXin
ms.author: jixin
ms.service: signalr
ms.topic: conceptual
ms.date: 12/04/2023
---

# Negotiation Server

When use Azure SignalR service, negotiation is a required step. Negotiation ensures the security of service that isn't directly controlled by the client. And in some cases, customer would need a negotiate server to process client request before allowing them set up the connection to service.

* Server would like to gate clients before they start connecting service
* Serverless mode that doesn't have a web server handling negotiation

> [!NOTE]
> When working with Azure SignalR service, clients should always ask a trusted server or a trusted authntication center to build the access token. __DO NOT__ set `SkipNegotiation` to `true` in client side. `SkipNegotiation` means clients need to build the accessToken themselves. This brings security risks that client could do anything to the service endpoint. 

## How to add negotiation server?

### `Default` Mode

Under `Default` mode, server SDK would handle negotiation for you. And you can use server side `ServiceOptions` to customize some configuration related to the client, such as `AccessTokenLifetime`, `ClaimsProvider`, `AccessTokenAlgorithm`, `DiagnosticClientFilter`, etc.

```cs
services.AddSignalR()
        .AddAzureSignalR(options =>
        {
            //  This is a sample to associate user name with connection.
            //  For PROD, we suggest to use authentication and authorization, see here:
            //  https://learn.microsoft.com/aspnet/core/signalr/authn-and-authz
            options.ClaimsProvider = context => new[]
            {
                new Claim(ClaimTypes.NameIdentifier, context.Request.Query["username"])
            };
            options.AccessTokenLifetime = TimeSapn.FromMinutes(5);
        });
```

### `Serverless` Mode

Under `Serverless` mode, there's is no server accepts SignalR clients. To protect your connection string, you need to redirect SignalR clients from the negotiation endpoint to Azure SignalR Service instead of giving your connection string to all the SignalR clients.

The best practice is to host a negotiation endpoint and then you can use SignalR clients to connect your hub: `/<Your Hub Name>`.

Negotiation can be approached by working with [Management SDK](https://github.com/Azure/azure-signalr/blob/dev/docs/management-sdk-guide.md).

You can use the instance of `ServiceHubContext` to generate the endpoint url and corresponding access token for SignalR clients to connect to your Azure SignalR Service.

```cs
var negotiationResponse = await serviceHubContext.NegotiateAsync(new (){UserId = "<Your User Id>"});
```

Suppose your hub endpoint is `http://<Your Host Name>/<Your Hub Name>`, then your negotiation endpoint is `http://<Your Host Name>/<Your Hub Name>/negotiate`. Once you host the negotiation endpoint, you can use the SignalR clients to connect to your hub like this:

```cs
var connection = new HubConnectionBuilder().WithUrl("http://<Your Host Name>/<Your Hub Name>").Build();
await connection.StartAsync();
```

The sample on how to use Management SDK to redirect SignalR clients to Azure SignalR Service can be found [here](https://github.com/aspnet/AzureSignalR-samples/tree/main/samples/Management).

## Next Steps

See the following articles to learn more about how to use Default and Serverless modes.

- [Azure SignalR Service internals](signalr-concept-internals.md)

- [Azure Functions development and configuration with Azure SignalR Service](signalr-concept-serverless-development-config.md)
