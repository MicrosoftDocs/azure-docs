---
title: Client negotiation in Azure SignalR service
description: This article provides information about client negotiation in Azure SignalR service.
author: JialinXin
ms.author: jixin
ms.service: signalr
ms.topic: conceptual
ms.date: 12/08/2023
---

# Client negotiation

The first request between client and server is the negotiation request. When use self-host SignalR, the request is used to establish a connection between the client and the server. And when use Azure SignalR service, clients connect to the service instead of the application server. This article shares the concept about negotiation protocols and ways to customize negotiation endpoint.

## What is negotiation?

The response to the `POST [endpoint-base]/negotiate` request contains one of three types of responses:

* A response that contains the `connectionId`, which is used to identify the connection on the server and the list of the transports supported by the server.

   ```json
   {
     "connectionId":"807809a5-31bf-470d-9e23-afaee35d8a0d",
     "negotiateVersion":0,
     "availableTransports":[
       {
         "transport": "WebSockets",
         "transferFormats": [ "Text", "Binary" ]
       },
       {
         "transport": "ServerSentEvents",
         "transferFormats": [ "Text" ]
       },
       {
         "transport": "LongPolling",
         "transferFormats": [ "Text", "Binary" ]
       }
     ]
   }
   ```

   The payload returned from this endpoint provides the following data:

   * The `connectionId` is **required** by the Long Polling and Server-Sent Events transports (in order to correlate sends and receives).
   * The `negotiateVersion` is the negotiation protocol version being used between the server and client.
   * The `availableTransports` list describes the transports the server supports. For each transport, the name of the transport (`transport`) is listed, as is a list of "transfer  formats" supported by the transport (`transferFormats`)

   > [!NOTE]
   > Now Azure SignalR service supports negotiate `Version 0` only. And client with the `negotiateVersion` greater than zero will get a response with `negotiateVersion=0` by design. Please check [TransportProtocols](https://github.com/dotnet/aspnetcore/blob/main/src/SignalR/docs/specs/TransportProtocols.md) for protocol details. 

* A redirect response tells the client the URL and optionally access token to use as a result.

   ```json
   {
     "url": "https://<Server endpoint>/<Hub name>",
     "accessToken": "<accessToken>"
   }
   ```

   The payload returned from this endpoint provides the following data:
 
   * The `url` is the URL the client should connect to.
   * The `accessToken` is an optional bearer token for accessing the specified url.

* A response that contains an `error` that should stop the connection attempt.

   ```json
   {
     "error": "This connection is not allowed."
   }
   ```

   The payload returned from this endpoint provides the following data:

   * The `error` that gives details about why the negotiation failed.

When you use the Azure SignalR service, clients connect to the service instead of the application server. There are three steps to establish persistent connections between the client and the SignalR Service.

1. A client sends a negotiate request to the application server.

1. The application server uses Azure SignalR Service SDK to return a redirect response containing the Azure SignalR service URL and access token.

    For ASP.NET Core SignalR, a typical redirect response looks like:

    ```cs
    {
        "url":"https://<SignalR name>.service.signalr.net/client/?hub=<Hub name>&...",
        "accessToken":"<accessToken>"
    }
    ```

1. After the client receives the redirect response, it uses the URL and access token to connect to SignalR Service, then service routes client to app server.

> [!IMPORTANT]
> In self-host SignalR, some user would choose to skip client negotiation when clients only support WebSocket and save the roundtrip for negotiation. However, when working with Azure SignalR service, clients should always ask a trusted server or a trusted authntication center to build the access token. So __DO NOT__ set `SkipNegotiation` to `true` in client side. `SkipNegotiation` means clients need to build the accessToken themselves. This brings security risks that client could do anything to the service endpoint. 

## What can be done during negotiation?

### Custom settings for client connections

Customer can gate the client connection to customize settings for security or business needs. For example:

* Use a short `AccessTokenLifetime` for security
* Only pass necessary info of client claims
* Add custom claims for business needs

```cs
services.AddSignalR().AddAzureSignalR(options =>
    {
        //  Only pass necessary info in negotiation step
        options.ClaimsProvider = context => new[]
        {
            new Claim(ClaimTypes.NameIdentifier, context.Request.Query["username"]),
            new Claim("<Custom Claim Name>", "<Custom Claim Value>")
        };
        options.AccessTokenLifetime = TimeSapn.FromMinutes(5);
    });
```

### Server stickiness

When you have multiple app servers, by default there's no guarantee that two servers (the one who does negotiation and the one who gets the hub invocation) are the same one. In some cases, customers may want to have client state information maintained locally on the app server. For example, when using server-side Blazor, UI state is maintained at server side so you want all client requests go to the same server including the SignalR connection. Then you would need to enable server sticky mode to `Required` during negotiation.

```cs
services.AddSignalR().AddAzureSignalR(options => {
    options.ServerStickyMode = ServerStickyMode.Required;
});
```

### Custom routing in multiple endpoints

Another case customer would customize negotiation is in multiple endpoints cases. Since app server provides the service URL as the negotiation response, app server can determine which endpoint to return clients for load balancing and communication efficiency, that is let client connect to the nearest service endpoint to save traffic cost.

```cs
// Sample of custom router
private class CustomRouter : EndpointRouterDecorator
{    
    public override ServiceEndpoint GetNegotiateEndpoint(HttpContext context, IEnumerable<ServiceEndpoint> endpoints)
    {
        // Override the negotiate behavior to get the endpoint from query string
        var endpointName = context.Request.Query["endpoint"];
        if (endpointName.Count == 0)
        {
            context.Response.StatusCode = 400;
            var response = Encoding.UTF8.GetBytes("Invalid request");
            context.Response.Body.Write(response, 0, response.Length);
            return null;
        }

        return endpoints.FirstOrDefault(s => s.Name == endpointName && s.Online) // Get the endpoint with name matching the incoming request
               ?? base.GetNegotiateEndpoint(context, endpoints); // Or fallback to the default behavior to randomly select one from primary endpoints, or fallback to secondary when no primary ones are online
    }
}
```

Besides, also register the router to DI using:
```cs
// Sample of configure multiple endpoints and DI CustomRouter.
services.AddSingleton(typeof(IEndpointRouter), typeof(CustomRouter));
services.AddSignalR().AddAzureSignalR(
    options => 
    {
        options.Endpoints = new ServiceEndpoint[]
        {
            new ServiceEndpoint(name: "east", connectionString: "<connectionString1>"),
            new ServiceEndpoint(name: "west", connectionString: "<connectionString2>"),
            new ServiceEndpoint("<connectionString3>")
        };
    });

```

## How to add a client negotiation endpoint in `Serverless` mode?

Under `Serverless` mode, there's is no server accepts SignalR clients. To protect your connection string, you need to redirect SignalR clients from the negotiation endpoint to Azure SignalR Service instead of giving your connection string to all the SignalR clients.

The best practice is to host a negotiation endpoint and then you can use SignalR clients to this endpoint and fetch service url and access token.

### Azure SignalR service Management SDK

Negotiation can be approached by working with [Management SDK](https://github.com/Azure/azure-signalr/blob/dev/docs/management-sdk-guide.md).

You can use the instance of `ServiceHubContext` to generate the endpoint url and corresponding access token for SignalR clients to connect to your Azure SignalR Service.

```cs
var negotiationResponse = await serviceHubContext.NegotiateAsync(new (){ UserId = "<Your User Id>" });
```

Suppose your hub endpoint is `http://<Your Host Name>/<Your Hub Name>`, then your negotiation endpoint is `http://<Your Host Name>/<Your Hub Name>/negotiate`. Once you host the negotiation endpoint, you can use the SignalR clients to connect to your hub like this:

```cs
var connection = new HubConnectionBuilder().WithUrl("http://<Your Host Name>/<Your Hub Name>").Build();
await connection.StartAsync();
```

A full sample on how to use Management SDK to redirect SignalR clients to Azure SignalR Service can be found [here](https://github.com/aspnet/AzureSignalR-samples/tree/main/samples/Management).

### Azure SignalR service functions extension

When you use Azure Function App, typically, you can work with the Function Extension. Here's a sample using `SignalRConnectionInfo` to help you build the negotiation response.

```cs
[FunctionName("negotiate")]
public SignalRConnectionInfo Negotiate([HttpTrigger(AuthorizationLevel.Anonymous)]HttpRequest req)
{
    var claims = GetClaims(req.Headers["Authorization"]);
    return Negotiate(
        claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value,
        claims
    );
}
```

Then your clients can request to this function endpoint `https://<Your Function App Name>.azurewebsites.net/api/negotiate` to get the service url and accessToken. A full sample can be found [here](https://github.com/aspnet/AzureSignalR-samples/tree/main/samples/BidirectionChat).

## Next steps

See the following articles to learn more about how to use Default and Serverless modes.

- [Azure SignalR Service internals](signalr-concept-internals.md)

- [Azure Functions development and configuration with Azure SignalR Service](signalr-concept-serverless-development-config.md)
