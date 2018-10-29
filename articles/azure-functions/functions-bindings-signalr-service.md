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

This article explains how to authenticate and send real-time messages to clients connected to [Azure SignalR Service](https://azure.microsoft.com/services/signalr-service/) by using SignalR Service bindings in Azure Functions. Azure Functions supports input and output bindings for SignalR Service.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

## Packages - Functions 2.x

The SignalR Service bindings are provided in the [Microsoft.Azure.WebJobs.Extensions.SignalRService](http://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.SignalRService) NuGet package, version 1.0.0-preview1-*. Source code for the package is in the [azure-functions-signalrservice-extension](https://github.com/Azure/azure-functions-signalrservice-extension) GitHub repository.

> [!NOTE]
> Azure SignalR Service is generally available. However, SignalR Service bindings for Azure Functions are currently in preview.

[!INCLUDE [functions-package-v2](../../includes/functions-package-v2-manual-portal.md)]

## SignalR connection info input binding

Before a client can connect to Azure SignalR Service, it must retrieve the service endpoint URL and a valid access token. The *SignalRConnectionInfo* input binding produces the SignalR Service endpoint URL and a valid token that are used to connect to the service. Because the token is time-limited and can be used to authenticate a specific user to a connection, you should not cache the token or share it between clients. An HTTP trigger using this binding can be used by clients to retrieve the connection information.

See the language-specific example:

* [2.x C#](#2x-c-input-example)
* [2.x JavaScript](#2x-javascript-input-example)

### 2.x C# input example

The following example shows a [C# function](functions-dotnet-class-library.md) that acquires SignalR connection information using the input binding and returns it over HTTP.

```cs
[FunctionName("GetSignalRInfo")]
public static SignalRConnectionInfo GetSignalRInfo(
    [HttpTrigger(AuthorizationLevel.Anonymous)]HttpRequest req, 
    [SignalRConnectionInfo(HubName = "chat")]SignalRConnectionInfo connectionInfo)
{
    return connectionInfo;
}
```

#### Authenticated tokens

If the function is triggered by an authenticated client, you can add a user ID claim to the generated token. You can easily add authentication to a function app using [App Service Authentication]
(../app-service/app-service-authentication-overview.md).

App Service Authentication sets HTTP headers named `x-ms-client-principal-id` and `x-ms-client-principal-name` that contain the authenticated user's client principal ID and name, respectively. You can set the `UserId` property of the binding to the value from either header using a [binding expression](functions-triggers-bindings.md#binding-expressions-and-patterns): `{headers.x-ms-client-principal-id}` or `{headers.x-ms-client-principal-name}`. 

```cs
[FunctionName("GetSignalRInfo")]
public static SignalRConnectionInfo GetSignalRInfo(
    [HttpTrigger(AuthorizationLevel.Anonymous)]HttpRequest req, 
    [SignalRConnectionInfo
        (HubName = "chat", UserId = "{headers.x-ms-client-principal-id}")]
        SignalRConnectionInfo connectionInfo)
{
    // connectionInfo contains an access key token with a name identifier claim set to the authenticated user
    return connectionInfo;
}
```

### 2.x JavaScript input example

The following example shows a SignalR connection info input binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding to return the connection information.

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

App Service Authentication sets HTTP headers named `x-ms-client-principal-id` and `x-ms-client-principal-name` that contain the authenticated user's client principal ID and name, respectively. You can set the `userId` property of the binding to the value from either header using a [binding expression](functions-triggers-bindings.md#binding-expressions-and-patterns): `{headers.x-ms-client-principal-id}` or `{headers.x-ms-client-principal-name}`. 

Example function.json:

```json
{
    "type": "signalRConnectionInfo",
    "name": "connectionInfo",
    "hubName": "chat",
    "userId": "{headers.x-ms-client-principal-id}",
    "connectionStringSetting": "<name of setting containing SignalR Service connection string>",
    "direction": "in"
}
```

Here's the JavaScript code:

```javascript
module.exports = function (context, req, connectionInfo) {
    // connectionInfo contains an access key token with a name identifier 
    // claim set to the authenticated user
    context.res = { body: connectionInfo };
    context.done();
};
```

## SignalR output binding

Use the *SignalR* output binding to send one or more messages using Azure SignalR Service. You can broadcast a message to all connected clients, or you can broadcast it only to connected clients that have been authenticated to a given user.

See the language-specific example:

* [2.x C#](#2x-c-output-example)
* [2.x JavaScript](#2x-javascript-output-example)

### 2.x C# output example

#### Broadcast to all clients

The following example shows a [C# function](functions-dotnet-class-library.md) that sends a message using the output binding to all connected clients. The `Target` is the name of the method to be invoked on each client. The `Arguments` property is an array of zero or more objects to be passed to the client method.

```cs
[FunctionName("SendMessage")]
public static Task SendMessage(
    [HttpTrigger(AuthorizationLevel.Anonymous, "post")]object message, 
    [SignalR(HubName = "chat")]IAsyncCollector<SignalRMessage> signalRMessages)
{
    return signalRMessages.AddAsync(
        new SignalRMessage 
        {
            Target = "newMessage", 
            Arguments = new [] { message } 
        });
}
```

#### Send to a user

You can send a message only to connections that have been authenticated to a user by setting the `UserId` property of the SignalR message.

```cs
[FunctionName("SendMessage")]
public static Task SendMessage(
    [HttpTrigger(AuthorizationLevel.Anonymous, "post")]object message, 
    [SignalR(HubName = "chat")]IAsyncCollector<SignalRMessage> signalRMessages)
{
    return signalRMessages.AddAsync(
        new SignalRMessage 
        {
            // the message will only be sent to these user IDs
            UserId = "userId1",
            Target = "newMessage", 
            Arguments = new [] { message } 
        });
}
```

### 2.x JavaScript output example

#### Broadcast to all clients

The following example shows a SignalR output binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding to send a message with Azure SignalR Service. Set the output binding to an array of one or more SignalR messages. A SignalR message consists of a `target` property that specifies the name of the method to invoke on each client, and an `arguments` property that is an array of objects to pass to the client method as arguments.

Here's binding data in the *function.json* file:

Example function.json:

```json
{
  "type": "signalR",
  "name": "signalRMessages",
  "hubName": "<hub_name>",
  "connectionStringSetting": "<name of setting containing SignalR Service connection string>",
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

You can send a message only to connections that have been authenticated to a user by setting the `userId` property of the SignalR message.

*function.json* stays the same. Here's the JavaScript code:

```javascript
module.exports = function (context, req) {
    context.bindings.signalRMessages = [{
        // message will only be sent to these user IDs
        "userId": "userId1",
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
|**type**|| Must be set to `signalRConnectionInfo`.|
|**direction**|| Must be set to `in`.|
|**name**|| Variable name used in function code for connection info object. |
|**hubName**|**HubName**| This value must be set to the name of the SignalR hub for which the connection information is generated.|
|**userId**|**UserId**| Optional: The value of the user identifier claim to be set in the access key token. |
|**connectionStringSetting**|**ConnectionStringSetting**| The name of the app setting that contains the SignalR Service connection string (defaults to "AzureSignalRConnectionString") |

### SignalR

The following table explains the binding configuration properties that you set in the *function.json* file and the `SignalR` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type**|| Must be set to `signalR`.|
|**direction**|| Must be set to `out`.|
|**name**|| Variable name used in function code for connection info object. |
|**hubName**|**HubName**| This value must be set to the name of the SignalR hub for which the connection information is generated.|
|**connectionStringSetting**|**ConnectionStringSetting**| The name of the app setting that contains the SignalR Service connection string (defaults to "AzureSignalRConnectionString") |

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure functions triggers and bindings](functions-triggers-bindings.md)

