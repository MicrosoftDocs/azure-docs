---
title: Azure Functions SignalR Service bindings
description: Understand how to use SignalR Service bindings with Azure Functions.
services: functions
documentationcenter: na
author: anthonychu
manager: cfowler
editor: ''
tags: ''
keywords: azure functions, functions, event processing, dynamic compute, serverless architecture

ms.service: functions
ms.devlang: multiple
ms.topic: reference
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 09/23/2018
ms.author: antchu
---

# SignalR Service bindings for Azure Functions

This article explains how to send real-time messages to connected clients by using [SignalR Service](https://azure.microsoft.com/services/signalr-service/) bindings in Azure Functions. Azure Functions supports input and output bindings for SignalR Service.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

## Packages - Functions 2.x

The SignalR Service bindings are provided in the [Microsoft.Azure.WebJobs.Extensions.SignalRService](http://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.SignalRService) NuGet package, version 0.x. Source code for the package is in the [azure-functions-signalrservice-extension](https://github.com/Azure/azure-functions-signalrservice-extension) GitHub repository.

> [!NOTE]
> Azure SignalR Service is generally available. However, SignalR Service bindings for Azure Functions are currently in preview.

[!INCLUDE [functions-package-v2](../../includes/functions-package-v2.md)]


## SignalR connection info input binding

Before a client can connect to SignalR Service, it must retrieve the service endpoint and a valid access key. The *SignalRConnectionInfo* input binding produces the SignalR Service endpoint and a valid token that is used as an access key to connect to the service. Because the token is time-limited and can be used to authenticate a user to a connection, you should not cache the token or share it between clients. An HTTP trigger using this binding can be used by clients to retrieve the connection information.

See the language-specific example:

* [2.x C#](#2x-c-input-example)
* [2.x JavaScript](#2x-javascript-input-example)

### 2.x C# input example

The following example shows a [C# function](functions-dotnet-class-library.md) that acquires SignalR connection information using the input binding and returns it over HTTP.

```cs
[FunctionName("GetSignalRInfo")]
public static IActionResult GetSignalRInfo(
    [HttpTrigger(AuthorizationLevel.Anonymous)]HttpRequest req, 
    [SignalRConnectionInfo(HubName = "chat")]SignalRConnectionInfo connectionInfo)
{
    return new OkObjectResult(connectionInfo);
}
```

#### Authenticated tokens

If the function is triggered by an authenticated client, you can add a user ID claim to the generated token. You can easily add authentication to a function app using [App Service Authentication]
(../app-service/app-service-authentication-overview.md).

App Service Authentication sets an HTTP header named `x-ms-client-principal-id` the authenticated user's client principal ID. You can set the `UserId` property of the binding to the value from the header using a [binding expression](functions-triggers-bindings.md#binding-expressions-and-patterns): `{headers.x-ms-client-principal-id}`. 

```cs
[FunctionName("GetSignalRInfo")]
public static IActionResult GetSignalRInfo(
    [HttpTrigger(AuthorizationLevel.Anonymous)]HttpRequest req, 
    [SignalRConnectionInfo(HubName = "chat", UserId = "{headers.x-ms-client-principal-id}")]SignalRConnectionInfo connectionInfo)
{
    // connectionInfo contains an access key token with a name identifier claim set to the authenticated user
    return new OkObjectResult(connectionInfo);
}
```

### 2.x JavaScript input example

The following example shows a SignalR connection info input binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding.

Here's binding data in the *function.json* file:

Example function.json:

```json
{
    "type": "signalRConnectionInfo",
    "name": "connectionInfo",
    "hubName": "chat",
    "connectionStringSetting": "<name of setting containing SignalR Service connection string>",
    "direction": "in"
}
```

Here's the JavaScript code:

```javascript
module.exports = function (context, req, connectionInfo) {
    context.res = { body: connectionInfo };
    context.done();
};
```

#### Authenticated tokens

If the function is triggered by an authenticated client, you can add a user ID claim to the generated token. You can easily add authentication to a function app using [App Service Authentication]
(../app-service/app-service-authentication-overview.md).

App Service Authentication sets an HTTP header named `x-ms-client-principal-id` the authenticated user's client principal ID. You can set the `userId` property of the binding to the value from the header using a [binding expression](functions-triggers-bindings.md#binding-expressions-and-patterns): `{headers.x-ms-client-principal-id}`. 

Example function.json:

```json
{
    "type": "signalRConnectionInfo",
    "name": "connectionInfo",
    "hubName": "chat",
    "userId": "{headers.x-ms-client-principal-id}",
    "connectionStringSetting": "<name of setting containing SignalR Service connection string>", // Defaults to AzureSignalRConnectionString
    "direction": "in"
}
```

Here's the JavaScript code:

```javascript
module.exports = function (context, req, connectionInfo) {
    // connectionInfo contains an access key token with a name identifier claim set to the authenticated user
    context.res = { body: connectionInfo };
    context.done();
};
```

## SignalR output binding

Use the *SignalR* output binding to send one or more messages. You can broadcast a message to all connected clients, or you can broadcast it only to connected clients that have been authenticated to a given user.

See the language-specific example:

* [2.x C#](#2x-c-output-example)
* [2.x JavaScript](#2x-javascript-output-example)

### 2.x C# output example

#### Broadcast to all clients

The following example shows a [C# function](functions-dotnet-class-library.md) that sends a message using the output binding to all connected clients. The target is the name of the method to be invoked on each client. The arguments property is an array zero or more objects to be passed to the client method.

```cs
[FunctionName("SendMessage")]
public static async Task<IActionResult> SendMessage(
    [HttpTrigger(AuthorizationLevel.Anonymous, "post")]HttpRequest req, 
    [SignalR(HubName = "chat")]IAsyncCollector<SignalRMessage> signalRMessages)
{
    dynamic message = await req.Content.ReadAsAsync<object>();

    await signalRMessages.AddAsync(
        new SignalRMessage 
        {
            Target = "newMessage", 
            Arguments = new [] { message } 
        });

    return new OkResult();
}
```

#### Send to a user

You can send a message only to connections that have been authenticated to a user or users by specifying one or more user IDs in the `UserIds` property of the SignalR message.

```cs
[FunctionName("SendMessage")]
public static async Task<IActionResult> SendMessage(
    [HttpTrigger(AuthorizationLevel.Anonymous, "post")]HttpRequest req, 
    [SignalR(HubName = "chat")]IAsyncCollector<SignalRMessage> signalRMessages)
{
    dynamic message = await req.Content.ReadAsAsync<object>();

    await signalRMessages.AddAsync(
        new SignalRMessage 
        {
            UserIds = new [] { "userId1", "userId2" },
            Target = "newMessage", 
            Arguments = new [] { message } 
        });

    return new OkResult();
}
```

### 2.x JavaScript output example

#### Broadcast to all clients

The following example shows a SignalR output binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding. Set the output binding to an array of one or more SignalR messages. A SignalR message consists of a target property that specifies the name of the method to invoke on each client, and an arguments property that is an array of objects to pass to the client method as arguments.

Here's binding data in the *function.json* file:

Example function.json:

```json
{
  "type": "signalR",
  "name": "signalRMessages", // name of the output binding
  "hubName": "<hub_name>",
  "connectionStringSetting": "<name of setting containing SignalR Service connection string>", // Defaults to AzureSignalRConnectionString
  "direction": "out"
}
```

Here's the JavaScript code:

```javascript
module.exports = function (context, req) {
    context.bindings.signalRMessages = [{
        "target": "newMessage",
        "arguments": [ req.body ]
    }];
    context.done();
};
```

#### Send to a user

You can send a message only to connections that have been authenticated to a user or users by specifying one or more user IDs in the `userIds` property of the SignalR message.

*function.json* stays the same. Here's the JavaScript code:

```javascript
module.exports = function (context, req) {
    context.bindings.signalRMessages = [{
        "userIds": [ "userId1", "userId2" ],
        "target": "newMessage",
        "arguments": [ req.body ]
    }];
    context.done();
};
```

## Configuration

### SignalRConnectionInfo

The following table explains the binding configuration properties that you set in the *function.json* file and the `SignalRConnectionInfo` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type**|| must be set to `signalRConnectionInfo`.|
|**direction**|| must be set to `in`.|
|**name**|| Variable name used in function code for connection info object. |
|**hubName**|**HubName**| This value must be set to the name of the SignalR hub for which the connection information is generated.|
|**userId**|**UserId**| Optional: The value of the user identifier claim to be set in the access key token. |
|**connectionStringSetting**|**ConnectionStringSetting**| The name of the app setting that contains the SignalR Service connection string (defaults to "AzureSignalRConnectionString") |

### SignalR

The following table explains the binding configuration properties that you set in the *function.json* file and the `SignalR` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type**|| must be set to `signalR`.|
|**direction**|| must be set to `out`.|
|**name**|| Variable name used in function code for connection info object. |
|**hubName**|**HubName**| This value must be set to the name of the SignalR hub for which the connection information is generated.|
|**connectionStringSetting**|**ConnectionStringSetting**| The name of the app setting that contains the SignalR Service connection string (defaults to "AzureSignalRConnectionString") |

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure functions triggers and bindings](functions-triggers-bindings.md)

