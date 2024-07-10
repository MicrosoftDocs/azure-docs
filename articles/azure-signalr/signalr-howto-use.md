---
title: Use Azure SignalR Service
description: Learn how to use Azure SignalR Service in your app server
author: vicancy
ms.service: signalr
ms.topic: how-to
ms.date: 04/18/2024
ms.author: lianwei 
---

# Use Azure SignalR Service


This article shows you how to use SDK in your app server side to connect to SignalR Service when you are using SignalR in your app server.

## Create an Azure SignalR Service instance

Follow [Quickstart: Use an ARM template to deploy Azure SignalR](./signalr-quickstart-azure-signalr-service-arm-template.md) to create a SignalR service instance.

## For ASP.NET Core SignalR

### Install the SDK

Run the command to install SignalR Service SDK to your ASP.NET Core project.

```bash
dotnet add package Microsoft.Azure.SignalR
```

In your `Startup` class, use SignalR Service SDK as the following code snippet.

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddSignalR()
            .AddAzureSignalR();
}

public void Configure(IApplicationBuilder app)
{
    app.UseEndpoints(routes =>
    {
        routes.MapHub<YourHubClass>("/path_for_your_hub");
    });
}
```

### Configure connection string

There are two approaches to configure SignalR Service's connection string in your application.

- Set an environment variable with name `Azure:SignalR:ConnectionString` or `Azure__SignalR__ConnectionString`.
  - In Azure App Service, put it in application settings.
- Pass the connection string as a parameter of `AddAzureSignalR()`.

    ```csharp
    services.AddSignalR()
            .AddAzureSignalR("<replace with your connection string>");
    ```

    or

    ```csharp
    services.AddSignalR()
            .AddAzureSignalR(options => options.ConnectionString = "<replace with your connection string>");
    ```

### Configure options

There are a few [options](https://github.com/Azure/azure-signalr/blob/dev/src/Microsoft.Azure.SignalR/ServiceOptions.cs) you can customize when using Azure SignalR Service SDK.

#### `ConnectionString`

- Default value is the `Azure:SignalR:ConnectionString` `connectionString` or `appSetting` in `web.config` file.
- It can be reconfigured, but make sure the value is **NOT** hard coded.

#### `InitialHubServerConnectionCount`

- Default value is `5`.
- This option controls the initial count of connections per hub between application server and Azure SignalR Service. Usually keep it as the default value is enough. During runtime, the SDK might start new server connections for performance tuning or load balancing. When you have large number of clients, you can give it a larger number for better throughput. For example, if you have 100,000 clients in total, the connection count can be increased to `10` or `15`.

#### `MaxHubServerConnectionCount`

- Default value is `null`.
- This option controls the max count of connections allowed per hub between application server and Azure SignalR Service. During runtime, the SDK might start new server connections for performance tuning or load balancing. By default a new server connection starts whenever needed. When the max allowed server connection count is configured, the SDK doesn't start new connections when server connection count reaches the limit.

#### `ApplicationName`

- Default value is `null`.
- This option can be useful when you want to share the same Azure SignalR instance for different app servers containing the same hub names. If not set, all the connected app servers are considered to be instances of the same application.

#### `ClaimsProvider`

- Default value is `null`.
- This option controls what claims you want to associate with the client connection.
It's used when Service SDK generates access token for client in client's negotiate request.
By default, all claims from `HttpContext.User` of the negotiated request are reserved.
They can be accessed at [`Hub.Context.User`](/dotnet/api/microsoft.aspnetcore.signalr.hubcallercontext.user).
- Normally you should leave this option as is. Make sure you understand what happens before customizing it.

#### `AccessTokenLifetime`

- Default value is `1 hour`.
- This option controls the valid lifetime of the access token, that Service SDK generates for each client.
The access token is returned in the response to client's negotiate request.
- When `ServerSentEvent` or `LongPolling` is used as transport, client connection will be closed due to authentication failure after the expired time.
You can increase this value to avoid client disconnect.

#### `AccessTokenAlgorithm`

- Default value is `HS256`
- This option provides choice of [`SecurityAlgorithms`](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet/blob/dev/src/Microsoft.IdentityModel.Tokens/SecurityAlgorithms.cs) when generate access token. Now supported optional values are `HS256` and `HS512`. Note that `HS512` is more secure but the generated token is comparatively longer than that using `HS256`.

#### `ServerStickyMode`

- Default value is `Disabled`.
- This option specifies the mode for **server sticky**. When the client is routed to the server that it first negotiates with, we call it **server sticky**.
- In distributed scenarios, there can be multiple app servers connected to one Azure SignalR instance. As [internals of client connections](signalr-concept-internals.md#client-connections) explains, client first negotiates with the app server, and then redirects to Azure SignalR to establish the persistent connection. Azure SignalR then finds one app server to serve the client, as [Transport Data between client and server](signalr-concept-internals.md#data-transmission-between-client-and-server) explains.
  - When `Disabled`, the client routes to a random app server. In general, app servers have balanced client connections with this mode. If your scenarios are *broadcast* or *group send*, use this default option is enough.
  - When `Preferred`, Azure SignalR tries to find the app server that the client first negotiates with in a way that no other cost or global routing is needed. This one can be useful when your scenario is sent to connection*. *Send to connection* can have better performance and lower latency when the sender and the receiver are routed to the same app server.
  - When `Required`, Azure SignalR always tries to find the app server that the client first negotiates with. This option can be useful when some client context is fetched from `negotiate` step and stored in memory, and then to be used inside `Hub`s. However, this option might have performance drawbacks because it requires Azure SignalR to take other efforts to find this particular app server globally, and to keep globally routing traffics between client and server.

#### `GracefulShutdown`

##### `GracefulShutdown.Mode`

- Default value is `Off`
- This option specifies the behavior after the app server receives a **SIGINT** (CTRL + C).
- When set to `WaitForClientsClose`, instead of stopping the server immediately, we remove it from the Azure SignalR Service to prevent new client connections from being assigned to this server.
- When set to `MigrateClients`, in addition, we try migrating client connections to another valid server. The migration will be triggered only after a message is delivered.
  - `OnConnected` and `OnDisconnected` are triggered when connections be migrated in/out.
  - `IConnectionMigrationFeature` can help you identify if the connection is migrated in/out.
  - See our [sample codes](https://github.com/Azure/azure-signalr/blob/dev/samples/ChatSample) for detail usage.

##### `GracefulShutdown.Timeout`

- Default value is `30 seconds`
- This option specifies the longest time in waiting for clients to be closed/migrated.

#### `ServiceScaleTimeout`

- Default value is `5 minutes`
- This option specifies the longest time in waiting for dynamic scaling service endpoints, that to affect online clients at minimum. Normally the dynamic scale between single app server and a service endpoint can be finished in seconds, while considering if you have multiple app servers and multiple service endpoints with network jitter and would like to ensure client stability, you can configure this value accordingly.

#### `MaxPollIntervalInSeconds`

- Default value is `5`
- This option defines the max poll interval allowed for `LongPolling` connections in Azure SignalR Service. If the next poll request doesn't come in within `MaxPollIntervalInSeconds`, Azure SignalR Service cleans up the client connection.
- The value is limited to `[1, 300]`.

#### `TransportTypeDetector`

- Default value: All transports are enabled.
- This option defines a function to customize the transports that clients can use to send HTTP requests.
- Use this options instead of [`HttpConnectionDispatcherOptions.Transports`](/aspnet/core/signalr/configuration?&tabs=dotnet#advanced-http-configuration-options) to configure transports. 

### Sample

You can configure above options like the following sample code.

```csharp
services.AddSignalR()
        .AddAzureSignalR(options =>
            {
                options.InitialHubServerConnectionCount = 10;
                options.AccessTokenLifetime = TimeSpan.FromDays(1);
                options.ClaimsProvider = context => context.User.Claims;

                options.GracefulShutdown.Mode = GracefulShutdownMode.WaitForClientsClose;
                options.GracefulShutdown.Timeout = TimeSpan.FromSeconds(10);
                options.TransportTypeDetector = httpContext => AspNetCore.Http.Connections.HttpTransportType.WebSockets | AspNetCore.Http.Connections.HttpTransportType.LongPolling;
            });
```

## For the legacy ASP.NET SignalR

> [!NOTE]
>
> If it is your first time trying SignalR, we recommend you use the [ASP.NET Core SignalR](/aspnet/core/signalr/introduction), it is **simpler, more reliable, and easier to use**.

### Install the SDK

Install SignalR Service SDK to your ASP.NET project with **Package Manager Console**:

```powershell
Install-Package Microsoft.Azure.SignalR.AspNet
```

In your `Startup` class, use SignalR Service SDK as the following code snippet, replace `MapSignalR()` to `MapAzureSignalR({your_applicationName})`. Replace `{YourApplicationName}` to the name of your application, this is the unique name to distinguish this application with your other applications. You can use `this.GetType().FullName` as the value.

```csharp
public void Configuration(IAppBuilder app)
{
    app.MapAzureSignalR(this.GetType().FullName);
}
```

### Configure connection string

Set the connection string in the `web.config` file, to the `connectionStrings` section:

```xml
<configuration>
    <connectionStrings>
        <add name="Azure:SignalR:ConnectionString" connectionString="Endpoint=...;AccessKey=..."/>
    </connectionStrings>
    ...
</configuration>
```

### Configure options

There are a few [options](https://github.com/Azure/azure-signalr/blob/dev/src/Microsoft.Azure.SignalR.AspNet/ServiceOptions.cs) you can customize when using Azure SignalR Service SDK.

#### `ConnectionString`

- Default value is the `Azure:SignalR:ConnectionString` `connectionString` or `appSetting` in `web.config` file.
- It can be reconfigured, but make sure the value is **NOT** hard coded.

#### `InitialHubServerConnectionCount`

- Default value is `5`.
- This option controls the initial count of connections per hub between application server and Azure SignalR Service. Usually keep it as the default value is enough. During runtime, the SDK might start new server connections for performance tuning or load balancing. When you have large number of clients, you can give it a larger number for better throughput. For example, if you have 100,000 clients in total, the connection count can be increased to `10` or `15`.

#### `MaxHubServerConnectionCount`

- Default value is `null`.
- This option controls the max count of connections allowed per hub between application server and Azure SignalR Service. During runtime, the SDK might start new server connections for performance tuning or load balancing. By default a new server connection starts whenever needed. When the max allowed server connection count is configured, the SDK doesn't start new connections when server connection count reaches the limit.

#### `ApplicationName`

- Default value is `null`.
- This option can be useful when you want to share the same Azure SignalR instance for different app servers containing the same hub names. If not set, all the connected app servers are considered to be instances of the same application.

#### `ClaimProvider`

- Default value is `null`.
- This option controls what claims you want to associate with the client connection.
It's used when Service SDK generates access token for client in client's negotiate request.
By default, all claims from `IOwinContext.Authentication.User` of the negotiated request are reserved.
- Normally you should leave this option as is. Make sure you understand what happens before customizing it.

#### `AccessTokenLifetime`

- Default value is `1 hour`.
- This option controls the valid lifetime of the access token, which Service SDK generates for each client.
The access token is returned in the response to client's negotiate request.
- When `ServerSentEvent` or `LongPolling` is used as transport, client connection will be closed due to authentication failure after the expired time.
You can increase this value to avoid client disconnect.

#### `AccessTokenAlgorithm`

- Default value is `HS256`
- This option provides choice of [`SecurityAlgorithms`](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet/blob/dev/src/Microsoft.IdentityModel.Tokens/SecurityAlgorithms.cs) when generate access token. Now supported optional values are `HS256` and `HS512`. Note that `HS512` is more secure but the generated token is comparatively longer than that using `HS256`.

#### `ServerStickyMode`

- Default value is `Disabled`.
- This option specifies the mode for **server sticky**. When the client is routed to the server that it first negotiates with, we call it **server sticky**.
- In distributed scenarios, there can be multiple app servers connected to one Azure SignalR instance. As [internals of client connections](signalr-concept-internals.md#client-connections) explains, client first negotiates with the app server, and then redirects to Azure SignalR to establish the persistent connection. Azure SignalR then finds one app server to serve the client, as [Transport Data between client and server](signalr-concept-internals.md#data-transmission-between-client-and-server) explains.
  - When `Disabled`, the client routes to a random app server. In general, app servers have balanced client connections with this mode. If your scenarios are *broadcast* or *group send*, use this default option is enough.
  - When `Preferred`, Azure SignalR tries to find the app server that the client first negotiates with in a way that no other cost or global routing is needed. This one can be useful when your scenario is sent to connection*. *Send to connection* can have better performance and lower latency when the sender and the receiver are routed to the same app server.
  - When `Required`, Azure SignalR always tries to find the app server that the client first negotiates with. This option can be useful when some client context is fetched from `negotiate` step and stored in memory, and then to be used inside `Hub`s. However, this option might have performance drawbacks because it requires Azure SignalR to take other efforts to find this particular app server globally, and to keep globally routing traffics between client and server.

#### `MaxPollIntervalInSeconds`

- Default value is `5`
- This option defines the max idle time allowed for inactive connections in Azure SignalR Service. In ASP.NET SignalR, it applies to long polling transport type or reconnection. If the next `/reconnect` or `/poll` request doesn't come in within `MaxPollIntervalInSeconds`, Azure SignalR Service cleans up the client connection.
- The value is limited to `[1, 300]`.

### Sample

You can configure above options like the following sample code.

```csharp
app.Map("/signalr",subApp => subApp.RunAzureSignalR(this.GetType().FullName, new HubConfiguration(), options =>
{
    options.InitialHubServerConnectionCount = 1;
    options.AccessTokenLifetime = TimeSpan.FromDays(1);
    options.ClaimProvider = context => context.Authentication?.User.Claims;
}));
```

## Scale out application server

With Azure SignalR Service, persistent connections are offloaded from application server so that you can focus on implementing your business logic in hub classes.
But you still need to scale out application servers for better performance when handling massive client connections.
Below are a few tips for scaling out application servers.
- Multiple application servers can connect to the same Azure SignalR Service instance.
- If you'd like to share the same Azure SignalR instance for different applications containing the same hub names, set them with different [ApplicationName](#applicationname) option. If not set, all the connected app servers are considered to be instances of the same application.
- As long as the [ApplicationName](#applicationname) option and the name of the hub class is the same, connections from different application servers are grouped in the same hub.
- Each client connection is only created in ***one*** of the application servers, and messages from that client are only sent to that same application server. If you want to access client information globally *(from all application servers)*, you have to use some centralized storage to save client information from all application servers.

## Next steps

In this article, you learn how to use SignalR Service in your applications. Check the following articles to learn more about SignalR Service.

> [!div class="nextstepaction"]
> [Azure SignalR Service internals](./signalr-concept-internals.md)

> [!div class="nextstepaction"]
> [Quickstart: Create a chat room by using SignalR Service](./signalr-quickstart-dotnet-core.md)
