---
title: "Troubleshooting Guide"
description: Learn 
author: YanJin
ms.service: signalr
ms.topic: conceptual
ms.date: 11/06/2020
ms.author: yajin1
---
# Troubleshooting Guide

This guidance is to provide useful troubleshooting guide based on the common issues customers encountered and resolved in the past years.

## Access token too long

### Possible errors:

1. Client-side `ERR_CONNECTION_`
2. 414 URI Too Long
3. 413 Payload Too Large
4. Access Token must not be longer than 4K. 413 Request Entity Too Large

### Root cause:

For HTTP/2, the max length for a single header is **4 K**, so if you are using browser to access Azure service, you will encounter this limitation with `ERR_CONNECTION_` error.

For HTTP/1.1, or C# clients, the max URI length is **12 K**, the max header length is **16 K**.

With SDK version **1.0.6** or higher, `/negotiate` will throw `413 Payload Too Large` when the generated access token is larger than **4 K**.

### Solution:

By default, claims from `context.User.Claims` are included when generating JWT access token to **ASRS**(**A**zure **S**ignal**R** **S**ervice), so that the claims are preserved and can be passed from **ASRS** to the `Hub` when the client connects to the `Hub`.

In some cases, `context.User.Claims` are leveraged to store lots of information for app server, most of which are not used by `Hub`s but by other components.

The generated access token is passed through the network, and for WebSocket/SSE connections, access tokens are passed through query strings. So as the best practice, we suggest only passing **necessary** claims from the client through **ASRS** to your app server when the Hub needs.

There is a `ClaimsProvider` for you to customize the claims passing to **ASRS** inside the access token.

For ASP.NET Core:
```cs
services.AddSignalR()
        .AddAzureSignalR(options =>
            {
                // pick up necessary claims
                options.ClaimsProvider = context => context.User.Claims.Where(...);
            });
```

For ASP.NET:
```cs
services.MapAzureSignalR(GetType().FullName, options =>
            {
                // pick up necessary claims
                options.ClaimsProvider = context.Authentication?.User.Claims.Where(...);
            });
```

## TLS 1.2 required

### Possible errors:

1. ASP.NET "No server available" error [#279](https://github.com/Azure/azure-signalr/issues/279)
2. ASP.NET "The connection is not active, data cannot be sent to the service." error [#324](https://github.com/Azure/azure-signalr/issues/324)
3. "An error occurred while making the HTTP request to https://<API endpoint>. This could be due to the fact that the server certificate is not configured properly with HTTP.SYS in the HTTPS case. This could also be caused by a mismatch of the security binding between the client and the server."

### Root cause:

Azure Service only supports TLS1.2 for security concerns. With .NET framework, it is possible that TLS1.2 is not the default protocol. As a result, the server connections to ASRS cannot be successfully established.

### Troubleshooting Guide

1. If this error can be repro-ed locally, uncheck *Just My Code* and throw all CLR exceptions and debug the app server locally to see what exception throws.
    * Uncheck *Just My Code*

        ![Uncheck Just My Code](./media/signalr-howto-troubleshooting-guide/uncheck_just_my_code.png)
    * Throw CLR exceptions

        ![Throw CLR exceptions](./media/signalr-howto-troubleshooting-guide/throw_clr_exceptions.png)
    * See the exceptions throw when debugging the app server-side code:

        ![Exception throws](./media/signalr-howto-troubleshooting-guide/tls_throws.png)

2. For ASP.NET ones, you can also add following code to your `Startup.cs` to enable detailed trace and see the errors from the log.
```cs
app.MapAzureSignalR(this.GetType().FullName);
// Make sure this switch is called after MapAzureSignalR
GlobalHost.TraceManager.Switch.Level = SourceLevels.Information;
```

### Solution:

Add following code to your Startup:
```cs
ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
```

## 400 Bad Request returned for client requests

### Root cause

Check if your client request has multiple `hub` query strings. `hub` is a preserved query parameter and 400 will throw if the service detects more than one `hub` in the query.

## 401 Unauthorized returned for client requests

### Root cause

Currently the default value of JWT token's lifetime is 1 hour.

For ASP.NET Core SignalR, when it is using WebSocket transport type, it is OK.

For ASP.NET Core SignalR's other transport type, SSE and long-polling, this means by default the connection can at most persist for 1 hour.

For ASP.NET SignalR, the client sends a `/ping` KeepAlive request to the service from time to time, when the `/ping` fails, the client **aborts** the connection and never reconnect. This means, for ASP.NET SignalR, the default token lifetime makes the connection lasts for **at most** 1 hour for all the transport type.

### Solution

For security concerns, extend TTL is not encouraged. We suggest adding reconnect logic from the client to restart the connection when such 401 occurs. When the client restarts the connection, it will negotiate with app server to get the JWT token again and get a renewed token.

Check [here](#restart_connection) for how to restart client connections.

## 404 returned for client requests

For a SignalR persistent connection, it first `/negotiate` to Azure SignalR service and then establishes the real connection to Azure SignalR service.

### Troubleshooting Guide

1. Following [How to view outgoing requests](#view_request) to get the request from the client to the service.
1. Check the URL of the request when 404 occurs. If the URL is targeting to your web app, and similar to `{your_web_app}/hubs/{hubName}`, check if the client `SkipNegotiation` is `true`. When using Azure SignalR, the client receives redirect URL when it first negotiates with the app server. The client should **NOT** skip negotiation when using Azure SignalR.
1. Another 404 can happen when the connect request is handled more than **5** seconds after `/negotiate` is called. Check the timestamp of the client request, and open an issue to us if the request to the service has a slow response.

## 404 returned for ASP.NET SignalR's reconnect request

For ASP.NET SignalR, when the [client connection drops](#client_connection_drop), it reconnects using the same `connectionId` for three times before stopping the connection. `/reconnect` can help if the connection is dropped due to network intermittent issues that `/reconnect` can reestablish the persistent connection successfully. Under other circumstances, for example, the client connection is dropped due to the routed server connection is dropped, or SignalR Service has some internal errors like instance restart/failover/deployment, the connection no longer exists, thus `/reconnect` returns `404`. It is the expected behavior for `/reconnect` and after three times retry the connection stops. We suggest having [connection restart](#restart_connection) logic when connection stops.

## 429(Too Many Requests) returned for client requests

429 returns if your **concurrent** connection count exceeds limit.

For **Free** instances, **Concurrent** connection count limit is 20
For **Standard** instances, **concurrent** connection count limit **per unit** is 1 K, which means Unit100 allows 100-K concurrent connections.

The connections include both client and server connections. check [here](https://docs.microsoft.com/azure/azure-signalr/signalr-concept-messages-and-connections#how-connections-are-counted) for how connections are counted.

## 500 Error when negotiate: Azure SignalR Service is not connected yet, please try again later.

### Root cause

This error is reported when there is no server connection to Azure SignalR Service connected.

### Troubleshooting Guide

Enable server-side trace to find out the error details when the server tries to connect to Azure SignalR Service.

#### Enable server-side logging for ASP.NET Core SignalR

Server-side logging for ASP.NET Core SignalR integrates with the `ILogger` based [logging](https://docs.microsoft.com/aspnet/core/fundamentals/logging/?view=aspnetcore-2.1&tabs=aspnetcore2x) provided in the ASP.NET Core framework. You can enable server-side logging by using `ConfigureLogging`, a sample usage as follows:
```cs
.ConfigureLogging((hostingContext, logging) =>
        {
            logging.AddConsole();
            logging.AddDebug();
        })
```
Logger categories for Azure SignalR always start with `Microsoft.Azure.SignalR`. To enable detailed logs from Azure SignalR, configure the preceding prefixes to `Debug` level in your **appsettings.json** file like below:
```JSON
{
    "Logging": {
        "LogLevel": {
            ...
            "Microsoft.Azure.SignalR": "Debug",
            ...
        }
    }
}
```

#### Enable server-side traces for ASP.NET SignalR

When using SDK version >= `1.0.0`, you can enable traces by adding the following to `web.config`: ([Details](https://github.com/Azure/azure-signalr/issues/452#issuecomment-478858102))
```xml
<system.diagnostics>
    <sources>
      <source name="Microsoft.Azure.SignalR" switchName="SignalRSwitch">
        <listeners>
          <add name="ASRS" />
        </listeners>
      </source>
    </sources>
    <!-- Sets the trace verbosity level -->
    <switches>
      <add name="SignalRSwitch" value="Information" />
    </switches>
    <!-- Specifies the trace writer for output -->
    <sharedListeners>
      <add name="ASRS" type="System.Diagnostics.TextWriterTraceListener" initializeData="asrs.log.txt" />
    </sharedListeners>
    <trace autoflush="true" />
  </system.diagnostics>
```

<a name="client_connection_drop"></a>

## Client connection drops

When the client is connected to the Azure SignalR, the persistent connection between the client and Azure SignalR can sometimes drop for different reasons. This section describes several possibilities causing such connection drop and provides some guidance on how to identify the root cause.

### Possible errors seen from the client-side

1. `The remote party closed the WebSocket connection without completing the close handshake`
2. `Service timeout. 30.00ms elapsed without receiving a message from service.`
3. `{"type":7,"error":"Connection closed with an error."}`
4. `{"type":7,"error":"Internal server error."}`

### Root cause:

Client connections can drop under various circumstances:
1. When `Hub` throws exceptions with the incoming request.
2. When the server connection the client routed to drops, see below section for details on [server connection drops](#server_connection_drop).
3. When a network connectivity issue happens between client and SignalR Service.
4. When SignalR Service has some internal errors like instance restart, failover, deployment, and so on.

### Troubleshooting Guide

1. Open app server-side log to see if anything abnormal took place
2. Check app server-side event log to see if the app server restarted
3. Create an issue to us providing the time frame, and email the resource name to us


## Client connection increases constantly

It might be caused by improper usage of client connection. If someone forgets to stop/dispose SignalR client, the connection remains open.

### Possible errors seen from the SignalR's metrics blade

Client connections rise constantly for a long time in Azure SignalR's metrics blade.
![client_connection_increasing_constantly](./media/signalr-howto-troubleshooting-guide/client_connection_increasing_constantly.jpg)

### Root cause:

SignalR client connection's `DisposeAsync` never be called, the connection keeps open.

### Troubleshooting Guide

1. Check if the SignalR client **never** close.

### Solution

Check if you close connection. Manually call `HubConnection.DisposeAsync()` to stop the connection after using it.

For example:

```C#
var connection = new HubConnectionBuilder()
	.WithUrl(...)
	.Build();
try
{
	await connection.StartAsync();
	// Do your stuff
	await connection.StopAsync();
}
finally
{
	await connection.DisposeAsync();
}
```

### Common Improper Client Connection Usage

#### Azure Function Example 

This issue often occurs when someone establishes SignalR client connection in Azure Function method instead of making it a static member to your Function class. You might expect only one client connection is established, but you see client connection count increases constantly in metrics blade, all these connections drop only after the Azure Function or Azure SignalR service restarts. This is because for **each** request, Azure Function creates **one** client connection, if you don't stop client connection in Function method, the client keeps the connections alive to Azure SignalR service.

#### Solution

1. Remember to close client connection if you use SignalR clients in Azure function or use SignalR client as a singleton.
1. Instead of using SignalR clients in Azure function, you can create SignalR clients anywhere else and use [Azure Functions Bindings for Azure SignalR Service](https://github.com/Azure/azure-functions-signalrservice-extension) to [negotiate](https://github.com/Azure/azure-functions-signalrservice-extension/blob/dev/samples/simple-chat/csharp/FunctionApp/Functions.cs#L22) the client to Azure SignalR. And you can also utilize the binding to [send messages](https://github.com/Azure/azure-functions-signalrservice-extension/blob/dev/samples/simple-chat/csharp/FunctionApp/Functions.cs#L40). Samples to negotiate client and send messages can be found [here](https://github.com/Azure/azure-functions-signalrservice-extension/tree/dev/samples). Further information can be found [here](https://github.com/Azure/azure-functions-signalrservice-extension).
1. When you use SignalR clients in Azure function, there might be a better architecture to your scenario. Check if you design a proper serverless architecture. You can refer to [Real-time serverless applications with the SignalR Service bindings in Azure Functions](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.SignalRService).

<a name="server_connection_drop"></a>

## Server connection drops

When the app server starts, in the background, the Azure SDK starts to initiate server connections to the remote Azure SignalR. As described in [Internals of Azure SignalR Service](https://github.com/Azure/azure-signalr/blob/dev/docs/internal.md), Azure SignalR routes incoming client traffics to these server connections. Once a server connection is dropped, all the client connections it serves will be closed too.

As the connections between the app server and SignalR Service are persistent connections, they may experience network connectivity issues. In the Server SDK, we have **Always Reconnect** strategy to server connections. As the best practice, we also encourage users to add continuous reconnect logic to the clients with a random delay time to avoid massive simultaneous requests to the server.

On a regular basis, there are new version releases for the Azure SignalR Service, and sometimes the Azure wide OS patching or upgrades or occasionally interruption from our dependent services. These may bring in a short period of service disruption, but as long as client-side has the disconnect/reconnect mechanism, the impact is minimal like any client-side caused disconnect-reconnect.

This section describes several possibilities leading to server connection drop and provides some guidance on how to identify the root cause.

### Possible errors seen from server-side:

1. `[Error]Connection "..." to the service was dropped`
2. `The remote party closed the WebSocket connection without completing the close handshake`
3. `Service timeout. 30.00ms elapsed without receiving a message from service.`

### Root cause:

Server-service connection is closed by **ASRS**(**A**zure **S**ignal**R** **S**ervice).

### Troubleshooting Guide

1. Open app server-side log to see if anything abnormal took place
2. Check app server-side event log to see if the app server restarted
3. Create an issue to us providing the time frame, and email the resource name to us

## Tips

<a name="view_request"></a>

* How to view the outgoing request from client?
Take ASP.NET Core one for example (ASP.NET one is similar):
    1. From browser:

        Take Chrome as an example, you can use **F12** to open the console window, and switch to **Network** tab. You might need to refresh the page using **F5** to capture the network from the very beginning.
        
        ![Chrome View Network](./media/signalr-howto-troubleshooting-guide/chrome_network.gif)

    2. From C# client:

        You can view local web traffics using [Fiddler](https://www.telerik.com/fiddler). WebSocket traffics are supported since Fiddler 4.5.

        ![Fiddler View Network](./media/signalr-howto-troubleshooting-guide/fiddler_view_network.png)

<a name="restart_connection"></a>

* How to restart client connection?
	
	Here are the [Sample codes](https://github.com/Azure/azure-signalr/tree/dev/samples) containing restarting connection logic with *ALWAYS RETRY* strategy:

	* [ASP.NET Core C# Client](https://github.com/Azure/azure-signalr/tree/dev/samples/ChatSample/ChatSample.CSharpClient/Program.cs#L64)

	* [ASP.NET Core JavaScript Client](https://github.com/Azure/azure-signalr/tree/dev/samples/ChatSample/ChatSample/wwwroot/index.html#L164)

	* [ASP.NET C# Client](https://github.com/Azure/azure-signalr/tree/dev/samples/AspNet.ChatSample/AspNet.ChatSample.CSharpClient/Program.cs#L78)

	* [ASP.NET JavaScript Client](https://github.com/Azure/azure-signalr/tree/dev/samples/AspNet.ChatSample/AspNet.ChatSample.JavaScriptClient/wwwroot/index.html#L71)
 name="tls_1.2_required"></a>
