---
title: Azure Functions SignalR Service trigger binding
description: Learn to send SignalR Service messages from Azure Functions.
author: chenyl
ms.topic: reference
ms.date: 05/11/2020
ms.author: chenyl
---

# SignalR Service trigger binding for Azure Functions

Use the *SignalR* trigger binding to response to messages sent from Azure SignalR Service. When function is triggered, messages passed to the function is parsed as a json object.

For information on setup and configuration details, see the [overview](functions-bindings-signalr-service.md).

## Example

The following example shows a function that receive a message using the trigger binding and log the message.

# [C#](#tab/csharp)

SignalR Service trigger for C# has two programming model. Class based model and traditional model. Class based model can provide a consistent SignalR server side programming experience. And traditional model provide more flexibility and similar with other function bindings.

### With Class based model

See [Class based model](#class-based-model) for details.

```cs
public class SignalRTestHub : ServerlessHub
{
    [FunctionName("SignalRTest")]
    public async Task SendMessage([SignalRTrigger]InvocationContext invocationContext, string message, ILogger logger)
    {
        logger.LogInformation($"Receive {message} from {invocationContext.ConnectionId}.");
    }
}
```

### With Traditional model

```cs
[FunctionName("SignalRTest")]
public static async Task Run([SignalRTrigger("SignalRTest", "messages", "SendMessage", "message")]InvocationContext invocationContext, string message, ILogger logger)
{
    logger.LogInformation($"Receive {message} from {invocationContext.ConnectionId}.");
}
```

# [C# Script](#tab/csharp-script)

Here's binding data in the *function.json* file:

Example function.json:

```json
{
    "type": "signalRTrigger",
    "name": "invocation",
    "hubName": "SignalRTest",
    "category": "messages",
    "event": "SendMessage",
    "parameterNames": [
        "message"
    ],
    "direction": "in"
}
```

Here's the C# Script code:

```cs
#r "Microsoft.Azure.WebJobs.Extensions.SignalRService"
using System;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using Microsoft.Extensions.Logging;

public static void Run(InvocationContext invocation, string message, ILogger logger)
{
    logger.LogInformation($"Receive {message} from {invocationContext.ConnectionId}.");
}
```

# [JavaScript](#tab/javascript)

Here's binding data in the *function.json* file:

Example function.json:

```json
{
    "type": "signalRTrigger",
    "name": "invocation",
    "hubName": "SignalRTest",
    "category": "messages",
    "event": "SendMessage",
    "parameterNames": [
        "message"
    ],
    "direction": "in"
}
```

Here's the JavaScript code:

```javascript
module.exports = function (context, invocation) {
    context.log(`Receive ${context.bindingData.message} from ${invocation.ConnectionId}.`)
    context.done();
};
```

# [Python](#tab/python)

Here's binding data in the *function.json* file:

Example function.json:

```json
{
    "type": "signalRTrigger",
    "name": "invocation",
    "hubName": "SignalRTest",
    "category": "messages",
    "event": "SendMessage",
    "parameterNames": [
        "message"
    ],
    "direction": "in"
}
```

Here's the Python code:

```python
import logging
import json
import azure.functions as func

def main(invocation) -> None:
    invocation_json = json.loads(invocation)
    logging.info("Receive {0} from {1}".format(invocation_json['Arguments'][0], invocation_json['ConnectionId']))
```

---

## Configuration

### SignalRTrigger

The following table explains the binding configuration properties that you set in the *function.json* file and the `SignalRTrigger` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type**| n/a | Must be set to `SignalRTrigger`.|
|**direction**| n/a | Must be set to `in`.|
|**name**| n/a | Variable name used in function code for trigger invocation context object. |
|**hubName**|**HubName**| This value must be set to the name of the SignalR hub for the function to be triggered.|
|**category**|**Category**| This value must be set as the category of messages for the function to be triggered. The category can be one of the following values: <ul><li>**connections**: Including *connected* and *disconnected* events</li><li>**messages**: Including all other events except those in **connections** category</li></ul> |
|**event**|**Event**| This value must be set as the event of messages for the function to be triggered. |
|**parameterNames**|**ParameterNames**| (Optional) A list of names that binds to the parameters. |
|**connectionStringSetting**|**ConnectionStringSetting**| The name of the app setting that contains the SignalR Service connection string (defaults to "AzureSignalRConnectionString") |

## Payload

The trigger input type is declared as either `InvocationContext` or a custom type. If you choose `InvocationContext` you get full access to the request content. For a custom type, the runtime tries to parse the JSON request body to set the object properties.

## Using `ParameterNames`

The property `ParameterNames` in `SignalRTrigger` allows you bind arguments of invocation messages to the parameters of functions. That gives you a more convenient way to access arguments of `InvocationContext`.

Say you have a JavaScript SignalR client trying to invoke method `broadcast` in Azure Function with two arguments.

```javascript
await connection.invoke("broadcast", message1, message2);
```

You can access these two arguments from parameter as well as assign type of parameter for them by using `ParameterNames`.

```cs
[FunctionName("SignalRTest")]
public static async Task Run([SignalRTrigger("SignalRTest", "messages", "broadcast", parameterNames: new string[] {"message1, message2"})]InvocationContext invocationContext, string message1, string message2)
{
}
```

### Use attribute `[SignalRParameter]` to simplify `ParameterNames`

As it's bit cumbersome to use `ParameterNames`, `SignalRParameter` is provided to achieve the same purpose.

```cs
[FunctionName("SignalRTest")]
public static async Task Run([SignalRTrigger("SignalRTest", "messages", "broadcast")]InvocationContext invocationContext, [SignalRParameter]string message1, [SignalRParameter]string message2)
{
}
```

### Remark

For the parameter binding, the order matters. If you are using `ParameterNames`, the order in `ParameterNames` match the order of the arguments you invoke in the client. If you are using attribute `[SignalRParameter]`, the order of arguments in Azure Function methods match the order of arguments in clients.

`ParameterNames` and attribute `[SignalRParameter]` **can not** be used at the same time, or you will get an exception.

## Class based model

The class based model is dedicated for C#. With class based model can have a consistent SignalR server side programming experience. It has the following features.

* Less configuration works: The class name is used as `HubName`, the method name is used as `Event` and the `Category` is decided automatically according to method name.
* Auto parameter binding: Neither `ParameterNames` nor attribute `[SignalRParameter]` is needed. Parameters are auto bound to arguments of Azure Function method in order.
* Convenient output and negotiate experience.

The following codes demonstrate these features:

```cs
public class SignalRTestHub : ServerlessHub
{
    [FunctionName("negotiate")]
    public SignalRConnectionInfo Negotiate([HttpTrigger(AuthorizationLevel.Anonymous)]HttpRequest req)
    {
        return Negotiate(req.Headers["x-ms-signalr-user-id"], GetClaims(req.Headers["Authorization"]));
    }

    [FunctionName(nameof(OnConnected))]
    public async Task OnConnected([SignalRTrigger]InvocationContext invocationContext, ILogger logger)
    {
        await Clients.All.SendAsync(NewConnectionTarget, new NewConnection(invocationContext.ConnectionId));
        logger.LogInformation($"{invocationContext.ConnectionId} has connected");
    }

    [FunctionName(nameof(Broadcast))]
    public async Task Broadcast([SignalRTrigger]InvocationContext invocationContext, string message, ILogger logger)
    {
        await Clients.All.SendAsync(NewMessageTarget, new NewMessage(invocationContext, message));
        logger.LogInformation($"{invocationContext.ConnectionId} broadcast {message}");
    }

    [FunctionName(nameof(OnDisconnected))]
    public void OnDisconnected([SignalRTrigger]InvocationContext invocationContext)
    {
    }
}
```

All the functions that want to leverage class based model need to be the method of class that inherit from **ServerlessHub**. The class name `SignalRTestHub` in the sample is the hub name.

### Define hub method

All the hub methods **must**  have a `[SignalRTrigger]` attribute and **must** use parameterless constructor. Then the **method name** is treated as parameter **event**.

By default `category=messages` except the method name is one of the following:

* **OnConnected**: Treated as `category=connections, event=connected`
* **OnDisconnected**: Treated as `category=connections, event=disconnected`

### Parameter binding experience

In class based model, `[SignalRParameter]` is unnecessary because all the arguments are marked as `[SignalRParameter]` by default except it is one of the following situation:

* The argument is decorated by a binding attribute.
* The argument's type is `ILogger` or `CancellationToken`
* The argument is decorated by attribute `[SignalRIgnore]`

### Negotiate experience in class based model

Instead of using SignalR input binding `[SignalR]`, negotiation in class based model can be more flexible. Base class `ServerlessHub` has a method

```cs
SignalRConnectionInfo Negotiate(string userId = null, IList<Claim> claims = null, TimeSpan? lifeTime = null)
```

This features user customize `userId` or `claims` during the function execution.

## Use `SignalRFilterAttribute`

User can inherit and implement the abstract class `SignalRFilterAttribute`. If exceptions thrown in `FilterAsync`, `403 Forbidden` will be sent back to clients.

The following sample demonstrate how to implement a customer filter that only allow the `admin` to invoke `broadcast`.

```cs
[AttributeUsage(AttributeTargets.Method, AllowMultiple = true, Inherited = true)]
internal class FunctionAuthorizeAttribute: SignalRFilterAttribute
{
    private const string AdminKey = "admin";

    public override Task FilterAsync(InvocationContext invocationContext, CancellationToken cancellationToken)
    {
        if (invocationContext.Claims.TryGetValue(AdminKey, out var value) &&
            bool.TryParse(value, out var isAdmin) &&
            isAdmin)
        {
            return Task.CompletedTask;
        }

        throw new Exception($"{invocationContext.ConnectionId} doesn't have admin role");
    }
}
```

Leverage the attribute to authorize the function.

```cs
[FunctionAuthorize]
[FunctionName(nameof(Broadcast))]
public async Task Broadcast([SignalRTrigger]InvocationContext invocationContext, string message, ILogger logger)
{
}
```

## API key authorization

SignalR trigger require an API key in the request. So your Azure SignalR Service upstream settings normally looks like the following URL:

    https://<APP_NAME>.azurewebsites.net/runtime/webhooks/signalr?code=<API_KEY>

You can get the key from Azure Portal - App keys - System keys - signalr_extension
:::image type="content" source="media/functions-bindings-signalr-service/signalr-keys.png" alt-text="API key":::
