---
title: Client negotiation in Azure SignalR Service
description: This article provides information about client negotiation in Azure SignalR Service.
author: JialinXin
ms.author: jixin
ms.service: signalr
ms.topic: conceptual
ms.date: 04/02/2024
---

# Client negotiation

The first request between a client and a server is the negotiation request. When you use self-hosted SignalR, you use the request to establish a connection between the client and the server. And when you use Azure SignalR Service, clients connect to the service instead of the application server. This article shares concepts about negotiation protocols and ways to customize a negotiation endpoint.

## What is negotiation?

The response to the `POST [endpoint-base]/negotiate` request contains one of three types of responses:

* A response that contains `connectionId`, which identifies the connection on the server and the list of transports that the server supports:

  ```json
  {
    "connectionToken":"05265228-1e2c-46c5-82a1-6a5bcc3f0143",
    "connectionId":"807809a5-31bf-470d-9e23-afaee35d8a0d",
    "negotiateVersion":1,
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

  The payload that this endpoint returns provides the following data:

  * The `connectionId` value is required by the `LongPolling` and `ServerSentEvents` transports to correlate sending and receiving.
  * The `negotiateVersion` value is the negotiation protocol version that you use between the server and the client, see [Transport Protocols](https://github.com/dotnet/aspnetcore/blob/main/src/SignalR/docs/specs/TransportProtocols.md).
    * `negotiateVersion: 0` only returns `connectionId`, and client should use the value of `connectionId` as `id` in connect requests.
    * `negotiateVersion: 1` returns `connectionId` and `connectionToken`, and client should use the value of `connectionToken` as `id` in connect requests.
  * The `availableTransports` list describes the transports that the server supports. For each transport, the payload lists the name of the transport (`transport`) and a list of transfer formats that the transport supports (`transferFormats`).

* A redirect response that tells the client which URL and (optionally) access token to use as a result:

  ```json
  {
    "url": "https://<Server endpoint>/<Hub name>",
    "accessToken": "<accessToken>"
  }
  ```

  The payload that this endpoint returns provides the following data:

  * The `url` value is the URL that the client should connect to.
  * The `accessToken` value is an optional bearer token for accessing the specified URL.

* A response that contains an `error` entry that should stop the connection attempt:

  ```json
  {
    "error": "This connection is not allowed."
  }
  ```

  The payload that this endpoint returns provides the following data:

  * The `error` string gives details about why the negotiation failed.

When you use Azure SignalR Service, clients connect to the service instead of the app server. There are three steps to establish persistent connections between the client and Azure SignalR Service:

1. A client sends a negotiation request to the app server.

1. The app server uses the Azure SignalR Service SDK to return a redirect response that contains the Azure SignalR Service URL and access token.

   For ASP.NET Core SignalR, a typical redirect response looks like this example:

   ```cs
   {
       "url":"https://<SignalR name>.service.signalr.net/client/?hub=<Hub name>&...",
       "accessToken":"<accessToken>"
   }
   ```

1. After the client receives the redirect response, it uses the URL and access token to connect to SignalR Service. The service then routes the client to the app server.

> [!IMPORTANT]
> In self-hosted SignalR, some users might choose to skip client negotiation when clients support only WebSocket and save the round trip for negotiation. However, when you're working with Azure SignalR Service, clients should always ask a trusted server or a trusted authentication center to build the access token. So _don't_ set `SkipNegotiation` to `true` on the client side. `SkipNegotiation` means clients need to build the access token themselves. This setting brings a security risk that the client could do anything to the service endpoint.

## What can you do during negotiation?

### Custom settings for client connections

You can gate the client connection to customize settings for security or business needs. For example:

* Use a short `AccessTokenLifetime` value for security.
* Pass only necessary information from client claims.
* Add custom claims for business needs.

```cs
services.AddSignalR().AddAzureSignalR(options =>
    {
        //  Pass only necessary information in the negotiation step
        options.ClaimsProvider = context => new[]
        {
            new Claim(ClaimTypes.NameIdentifier, context.Request.Query["username"]),
            new Claim("<Custom Claim Name>", "<Custom Claim Value>")
        };
        options.AccessTokenLifetime = TimeSapn.FromMinutes(5);
    });
```

### Server stickiness

When you have multiple app servers, there's no guarantee (by default) that the server that does negotiation and the server that gets the hub invocation are the same. In some cases, you might want to have client state information maintained locally on the app server.

For example, when you're using server-side Blazor, the UI state is maintained at the server side. So you want all client requests to go to the same server, including the SignalR connection. Then you need to enable server sticky mode to `Required` during negotiation:

```cs
services.AddSignalR().AddAzureSignalR(options => {
    options.ServerStickyMode = ServerStickyMode.Required;
});
```

### Custom routing in multiple endpoints

Another way that you can customize negotiation is in multiple endpoints. Because the app server provides the service URL as the negotiation response, the app server can determine which endpoint to return to clients for load balancing and communication efficiency. That is, you can let the client connect to the nearest service endpoint to save traffic costs.

```cs
// Sample of a custom router
private class CustomRouter : EndpointRouterDecorator
{    
    public override ServiceEndpoint GetNegotiateEndpoint(HttpContext context, IEnumerable<ServiceEndpoint> endpoints)
    {
        // Override the negotiation behavior to get the endpoint from the query string
        var endpointName = context.Request.Query["endpoint"];
        if (endpointName.Count == 0)
        {
            context.Response.StatusCode = 400;
            var response = Encoding.UTF8.GetBytes("Invalid request");
            context.Response.Body.Write(response, 0, response.Length);
            return null;
        }

        return endpoints.FirstOrDefault(s => s.Name == endpointName && s.Online) // Get the endpoint with the name that matches the incoming request
               ?? base.GetNegotiateEndpoint(context, endpoints); // Fall back to the default behavior to randomly select one from primary endpoints, or fall back to secondary when no primary ones are online
    }
}
```

Also register the router to dependency injection:

```cs
// Sample of configuring multiple endpoints and dependency injection
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

## How can you add a client negotiation endpoint in serverless mode?

In serverless (`Serverless`) mode, no server accepts SignalR clients. To help protect your connection string, you need to redirect SignalR clients from the negotiation endpoint to Azure SignalR Service instead of giving your connection string to all the SignalR clients.

The best practice is to host a negotiation endpoint. Then you can use SignalR clients to this endpoint and fetch the service URL and access token.

### Azure SignalR Service Management SDK

You can approach negotiation by working with the [Management SDK](https://github.com/Azure/azure-signalr/blob/dev/docs/management-sdk-guide.md).

You can use the instance of `ServiceHubContext` to generate the endpoint URL and corresponding access token for SignalR clients to connect to Azure SignalR Service:

```cs
var negotiationResponse = await serviceHubContext.NegotiateAsync(new (){ UserId = "<Your User Id>" });
```

Suppose your hub endpoint is `http://<Your Host Name>/<Your Hub Name>`. Then your negotiation endpoint is `http://<Your Host Name>/<Your Hub Name>/negotiate`. After you host the negotiation endpoint, you can use the SignalR clients to connect to your hub:

```cs
var connection = new HubConnectionBuilder().WithUrl("http://<Your Host Name>/<Your Hub Name>").Build();
await connection.StartAsync();
```

You can find a full sample on how to use the Management SDK to redirect SignalR clients to Azure SignalR Service on [GitHub](https://github.com/aspnet/AzureSignalR-samples/tree/main/samples/Management).

### Azure SignalR Service function extension

When you use an Azure function app, you can work with the function extension. Here's a sample of using `SignalRConnectionInfo` to help you build the negotiation response:

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

Then your clients can request the function endpoint `https://<Your Function App Name>.azurewebsites.net/api/negotiate` to get the service URL and access token. You can find a full sample on [GitHub](https://github.com/aspnet/AzureSignalR-samples/tree/main/samples/BidirectionChat).

### Self-exposing `/negotiate` endpoint

You could also expose the negotiation endpoint in your own server and return the negotiation response by yourself if you are using other languages. 

#### Using ConnectionString

Below is a pseudo code in JavaScript showing how to implement the negotiation endpoint for hub `chat` and generate access token from Azure SignalR connection string.

```js
import express from 'express';
const connectionString = '<your-connection-string>';
const hub = 'chat';
let app = express();
app.post('/chat/negotiate', (req, res) => {
  let endpoint = /Endpoint=(.*?);/.exec(connectionString)[1];
  let accessKey = /AccessKey=(.*?);/.exec(connectionString)[1];
  let url = `${endpoint}/client/?hub=${hub}`;
  let token = jwt.sign({ aud: url }, accessKey, { expiresIn: 3600 });
  res.json({ url: url, accessToken: token });
});
app.listen(8080, () => console.log('server started'));
```

A JavaScript SignalR client then connects with URL `/chat`:

```js
let connection = new signalR.HubConnectionBuilder().withUrl('/chat').build();
connection.start();
```

#### Using Microsoft Entra ID
Azure SignalR also provides REST API `POST /api/hubs/${hub}/:generateToken?api-version=2022-11-01&userId=${userId}&minutesToExpire=${minutesToExpire}` to generate the client access token for you when you are using Microsoft Entra ID.

The steps are:
1. Follow [Add role assignments](signalr-howto-authorize-application.md#add-role-assignments-in-the-azure-portal) to assign role `SignalR REST API Owner` or `SignalR Service Owner` to your identity so that your identity has the permission to invoke the REST API to generate the client access token.
2. Use Azure Identity client library to fetch the Microsoft Entra ID token with scope `https://signalr.azure.com/.default`
3. Use this token to visit the generate token REST API
4. Return the client access token in the negotiation response.

Below is a pseudo code in JavaScript showing how to implement the negotiation endpoint for hub `chat` and get access token using Microsoft Entra ID and REST API `/generateToken`.
```js
import express from "express";
import axios from "axios";
import { DefaultAzureCredential } from "@azure/identity";

const endpoint = "https://<your-service>.service.signalr.net";
const hub = "chat";
const generateTokenUrl = `${endpoint}/api/hubs/${hub}/:generateToken?api-version=2022-11-01`;
let app = express();
app.get("/chat/negotiate", async (req, res) => {
  // use DefaultAzureCredential to get the Entra ID token to call the Azure SignalR REST API
  const credential = new DefaultAzureCredential();
  const entraIdToken = await credential.getToken("https://signalr.azure.com/.default");
  const token = (
    await axios.post(generateTokenUrl, undefined, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${entraIdToken.token}`,
      },
    })
  ).data.token;
  let url = `${endpoint}/client/?hub=${hub}`;
  res.json({ url: url, accessToken: token });
});
app.listen(8080, () => console.log("server started"));

```

## Next steps

To learn more about how to use default and serverless modes, see the following articles:

* [Azure SignalR Service internals](signalr-concept-internals.md)
* [Azure Functions development and configuration with Azure SignalR Service](signalr-concept-serverless-development-config.md)
