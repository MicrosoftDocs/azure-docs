---
title: Use Azure SignalR Management SDK
description: Learn how to use Azure SignalR Management SDK
author: vicancy
ms.service: signalr
ms.topic: how-to
ms.date: 12/23/2023
ms.author: lianwei 
---

# Use Azure SignalR Management SDK

Azure SignalR Management SDK helps you to manage SignalR clients through Azure SignalR Service directly such as broadcast messages. Therefore, this SDK could be but not limited to be used in [serverless](https://azure.microsoft.com/solutions/serverless/) environments. You could use this SDK to manage SignalR clients connected to your Azure SignalR Service in any environment, such as in a console app, in an Azure function or in a web server.

> [!NOTE]
> 
> To see guides for SDK version 1.9.x and before, go to [Azure SignalR Service Management SDK (Legacy)](https://github.com/Azure/azure-signalr/blob/dev/docs/management-sdk-guide-legacy.md). You might also want to read [Migration guidance](https://github.com/Azure/azure-signalr/blob/dev/docs/management-sdk-migration.md).

## Features

| Feature                                    | Transient          | Persistent         |
| ------------------------------------------ | ------------------ | ------------------ |
| Broadcast                                  | :heavy_check_mark: | :heavy_check_mark: |
| Broadcast except some clients              | :heavy_check_mark: | :heavy_check_mark: |
| Send to a client                           | :heavy_check_mark: | :heavy_check_mark: |
| Send to clients                            | :heavy_check_mark: | :heavy_check_mark: |
| Send to a user                             | :heavy_check_mark: | :heavy_check_mark: |
| Send to users                              | :heavy_check_mark: | :heavy_check_mark: |
| Send to a group                            | :heavy_check_mark: | :heavy_check_mark: |
| Send to groups                             | :heavy_check_mark: | :heavy_check_mark: |
| Send to a group except some clients        | :heavy_check_mark: | :heavy_check_mark: |
| Add a user to a group                      | :heavy_check_mark: | :heavy_check_mark: |
| Remove a user from a group                 | :heavy_check_mark: | :heavy_check_mark: |
| Check if a user in a group                 | :heavy_check_mark: | :heavy_check_mark: |
|                                            |                    |                    |
| Multiple SignalR service instances support | :x:                | :heavy_check_mark: |
| [MessagePack clients support](#message-pack-serialization)  |  since v1.21.0 |  since v1.20.0     |
| [Retry transient error](#http-requests-retry)                      | since v1.22.0      |  :x:               |

**Features only come with new API**

| Feature                      | Transient          | Persistent  |
| ---------------------------- | ------------------ | ----------- |
| Check if a connection exists | :heavy_check_mark: | Since v1.11 |
| Check if a group exists      | :heavy_check_mark: | Since v1.11 |
| Check if a user exists       | :heavy_check_mark: | Since v1.11 |
| Close a client connection    | :heavy_check_mark: | Since v1.11 |

* More details about different modes can be found [here](#transport-type).

* A full sample on management SDK can be found [here](https://github.com/aspnet/AzureSignalR-samples/tree/master/samples/Management).

## Usage

This section shows how to use the Management SDK.

### Create Service Manager

Build your instance of `ServiceManager` from a `ServiceManagerBuilder`

``` C#

var serviceManager = new ServiceManagerBuilder()
                    .WithOptions(option =>
                    {
                        option.ConnectionString = "<Your Azure SignalR Service Connection String>";
                    })
                    .WithLoggerFactory(loggerFactory)
                    .BuildServiceManager();

```

You can use `ServiceManager` to check the Azure SignalR endpoint health and create service hub context. The following [section](#create-service-hub-context) provides details about creating service hub context.

To check the Azure SignalR endpoint health, you can use `ServiceManager.IsServiceHealthy` method. If you have multiple Azure SignalR endpoints, only the first endpoint is checked.

```cs
var health = await serviceManager.IsServiceHealthy(cancellationToken);
```

### Create Service Hub Context

Create your instance of `ServiceHubContext` from a `ServiceManager`:

``` C#
var serviceHubContext = await serviceManager.CreateHubContextAsync("<Your Hub Name>",cancellationToken);
```

### Negotiation

In [default mode](concept-service-mode.md#default-mode), an endpoint `/<Your Hub Name>/negotiate` is exposed for negotiation by Azure SignalR Service SDK. SignalR clients reach this endpoint and then redirect to Azure SignalR Service later.

In [serverless mode](concept-service-mode.md#serverless-mode), we recommend you hosting a negotiation endpoint to serve the SignalR clients' negotiate request and redirect the clients to Azure SignalR Service.

> [!TIP]
> Read more details about the redirection at SignalR's [Negotiation Protocol](https://github.com/aspnet/SignalR/blob/master/specs/TransportProtocols.md#post-endpoint-basenegotiate-request).

Both of endpoint and access token are useful when you want to redirect SignalR clients to your Azure SignalR Service.

You could use the instance of `ServiceHubContext` to generate the endpoint url and corresponding access token for SignalR clients to connect to your Azure SignalR Service.

```C#
var negotiationResponse = await serviceHubContext.NegotiateAsync(new (){UserId = "<Your User Id>"});
```

Suppose your hub endpoint is `http://<Your Host Name>/<Your Hub Name>`, then your negotiation endpoint is `http://<Your Host Name>/<Your Hub Name>/negotiate`. Once you host the negotiation endpoint, you can use the SignalR clients to connect to your hub like this:

``` c#
var connection = new HubConnectionBuilder().WithUrl("http://<Your Host Name>/<Your Hub Name>").Build();
await connection.StartAsync();
```

The sample on how to use Management SDK to redirect SignalR clients to Azure SignalR Service can be found [here](https://github.com/aspnet/AzureSignalR-samples/tree/master/samples/Management).

### Send messages and manage groups

The `ServiceHubContext` we build from `ServiceHubContextBuilder` is a class that implements and extends `IServiceHubContext`. You could use it to send messages to your clients and managing your groups.

```C#
try
{
    // Broadcast
    await hubContext.Clients.All.SendAsync(callbackName, obj1, obj2, ...);

    // Send to user
    await hubContext.Clients.User(userId).SendAsync(callbackName, obj1, obj2, ...);

    // Send to group
    await hubContext.Clients.Group(groupId).SendAsync(callbackName, obj1, obj2, ...);

    // add user to group
    await hubContext.UserGroups.AddToGroupAsync(userId, groupName);

    // remove user from group
    await hubContext.UserGroups.RemoveFromGroupAsync(userId, groupName);
}
finally
{
    await hubContext.DisposeAsync();
}
```

### Strongly typed hub

A strongly typed hub is a programming model that you can extract your client methods into an interface, so that avoid errors like misspelling the method name or passing the wrong parameter types.

Let's say we have a client method called `ReceivedMessage` with two string parameters. Without strongly typed hubs, you broadcast to clients through `hubContext.Clients.All.SendAsync("ReceivedMessage", user, message)`. With strongly typed hubs, you first define an interface like this:

```cs
public interface IChatClient
{
    Task ReceiveMessage(string user, string message);
}
```

And then you create a strongly typed hub context, which implements `IHubContext<Hub<T>, T>`, `T` is your client method interface:

```cs
ServiceHubContext<IChatClient> serviceHubContext = await serviceManager.CreateHubContextAsync<IChatClient>(hubName, cancellationToken);
```

Finally, you could directly invoke the method:

```cs
await Clients.All.ReceiveMessage(user, message);
```

Except for the difference of sending messages, you could negotiate or manage groups with `ServiceHubContext<T>` just like `ServiceHubContext`.

Read more on strongly typed hubs in the ASP.NET Core docs [here](/aspnet/core/signalr/hubs#strongly-typed-hubs).

### Transport type

This SDK can communicates to Azure SignalR Service with two transport types:

* Transient: Create an Http request Azure SignalR Service for each message sent. The SDK simply wraps up [Azure SignalR Service REST API](./signalr-reference-data-plane-rest-api.md) in Transient mode. It's useful when you're unable to establish a WebSockets connection.
* Persistent: Create a WebSockets connection first and then send all messages in this connection. It's useful when you send large number of messages.

### Summary of serialization behaviors of the arguments in messages

| Serialization                  | Transient          | Persistent                        |
| ------------------------------ | ------------------ | --------------------------------- |
| Default JSON library           | `Newtonsoft.Json`  | The same as ASP.NET Core SignalR: <br>`Newtonsoft.Json` for .NET Standard 2.0; <br>`System.Text.Json` for .NET Core App 3.1 and above  |
| MessagePack clients support    |  since v1.21.0   |  since v1.20.0                    |

#### JSON serialization
In Management SDK, the method arguments sent to clients are serialized into JSON. We have several ways to customize JSON serialization. We show all the ways in the order from the most recommended to the least recommended.

##### `ServiceManagerOptions.UseJsonObjectSerializer(ObjectSerializer objectSerializer)`
The most recommended way is to use a general abstract class [`ObjectSerializer`](/dotnet/api/azure.core.serialization.objectserializer), because it supports different JSON serialization libraries such as `System.Text.Json` and `Newtonsoft.Json` and it applies to all the transport types. Usually you don't need to implement `ObjectSerializer` yourself, as handy JSON implementations for `System.Text.Json` and `Newtonsoft.Json` are already provided.

* When using `System.Text.Json` as JSON processing library
    The builtin [`JsonObjectSerializer`](/dotnet/api/azure.core.serialization.jsonobjectserializer) uses `System.Text.Json.JsonSerializer` to for serialization/deserialization. Here's a sample to use camel case naming for JSON serialization:

    ```cs
    var serviceManager = new ServiceManagerBuilder()
        .WithOptions(o =>
        {
            o.ConnectionString = "***";
            o.UseJsonObjectSerializer(new JsonObjectSerializer(new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            }));
        })
        .BuildServiceManager();

    ```

* When using `Newtonsoft.Json` as JSON processing library
    First install the package `Microsoft.Azure.Core.NewtonsoftJson` from NuGet using .NET CLI:

    ```dotnetcli
    dotnet add package Microsoft.Azure.Core.NewtonsoftJson
    ```

    Here's a sample to use camel case naming with [`NewtonsoftJsonObjectSerializer`](/dotnet/api/azure.core.serialization.newtonsoftjsonobjectserializer):

    ```cs
    var serviceManager = new ServiceManagerBuilder()
        .WithOptions(o =>
        {
            o.ConnectionString = "***";
            o.UseJsonObjectSerializer(new NewtonsoftJsonObjectSerializer(new JsonSerializerSettings()
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            }));
        })
        .BuildServiceManager();
    ```

* When using other JSON processing libraries

    You could also implement `ObjectSerializer` on your own. The following links might help:

    * [API reference of `ObjectSerializer`](/dotnet/api/azure.core.serialization.objectserializer)
    * [API reference of `JsonObjectSerializer`](/dotnet/api/azure.core.serialization.jsonobjectserializer)

##### `ServiceManagerBuilder.WithNewtonsoftJson(Action<NewtonsoftServiceHubProtocolOptions> configure)`
This method is only for `Newtonsoft.Json` users. Here's a sample to use camel case naming:
```cs
var serviceManager = new ServiceManagerBuilder()
    .WithNewtonsoftJson(o =>
    {
        o.PayloadSerializerSettings = new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        };
    })
    .BuildServiceManager();
```

##### ~~`ServiceManagerOptions.JsonSerializerSettings`~~ (Deprecated)
This method only applies to transient transport type. Don't use this.
```cs
var serviceManager = new ServiceManagerBuilder()
    .WithOptions(o =>
    {
        o.JsonSerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
    })
    .BuildServiceManager();
```

#### Message Pack serialization

1. You need to install `Microsoft.AspNetCore.SignalR.Protocols.MessagePack` package.
1. To add a MessagePack protocol side-by-side with the default JSON protocol:

    ```csharp
    var serviceManagerBuilder = new ServiceManagerBuilder()
        .AddHubProtocol(new MessagePackHubProtocol());
    ```

1. To fully control the hub protocols, you can use

    ```csharp
        var serviceManagerBuilder = new ServiceManagerBuilder()
            .WithHubProtocols(new MessagePackHubProtocol(), new JsonHubProtocol());
    ```

    `WithHubProtocols` first clears the existing protocols, and then adds the new protocols. You can also use this method to remove the JSON protocol and use MessagePack only.

> For transient mode, by default the service side converts JSON payload to MessagePack payload and it's the legacy way to support MessagePack. However, we recommend you to add a MessagePack hub protocol explicitly as the legacy way might not work as you expect.

### HTTP requests retry

For the **transient** mode, this SDK provides the capability to automatically resend requests when transient errors occur, as long as the requests are idempotent. To enable this capability, you can use the `ServiceManagerOptions.RetryOptions` property.

In particular, the following types of requests are retried:

* For message requests that send messages to SignalR clients, the SDK retries the request if the HTTP response status code is greater than 500. When the HTTP response code is equal to 500, it might indicate a timeout on the service side, and retrying the request could result in duplicate messages.

* For other types of requests, such as adding a connection to a group, the SDK retries the request under the following conditions:
    1. The HTTP response status code is in the 5xx range, or the request timed out with a status code of 408 (Request Timeout).
    2. The request timed out with a duration longer than the timeout length configured in `ServiceManagerOptions.HttpClientTimeout`.

The SDK can only retry idempotent requests, which are requests that have no other effect if they're repeated. If your requests aren't idempotent, you might need to handle retries manually.

## Next steps

In this article, you learn how to use SignalR Service in your applications. Check the following articles to learn more about SignalR Service.

> [!div class="nextstepaction"]
> [Azure SignalR Service internals](./signalr-concept-internals.md)

> [!div class="nextstepaction"]
> [Quickstart: Create a chat room by using SignalR Service](./signalr-quickstart-dotnet-core.md)
