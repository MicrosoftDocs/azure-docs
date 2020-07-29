---
title: Azure Functions SignalR Service trigger binding
description: Learn to send SignalR Service messages from Azure Functions.
author: chenyl
ms.topic: reference
ms.date: 05/11/2020
ms.author: chenyl
---

# SignalR Service trigger binding for Azure Functions

Use the *SignalR* trigger binding to respond to messages sent from Azure SignalR Service. When function is triggered, messages passed to the function is parsed as a json object.

For information on setup and configuration details, see the [overview](functions-bindings-signalr-service.md).

## Example

The following example shows a function that receives a message using the trigger binding and log the message.

# [C#](#tab/csharp)

SignalR Service trigger binding for C# has two programming models. Class based model and traditional model. Class based model can provide a consistent SignalR server-side programming experience. And traditional model provides more flexibility and similar with other function bindings.

### With Class based model

See [Class based model](../azure-signalr/signalr-concept-serverless-development-config.md#class-based-model) for details.

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

Traditional model obeys the convention of Azure Function developed by C#. If you're not familiar with it, you can learn from [documents](https://docs.microsoft.com/azure/azure-functions/functions-dotnet-class-library).

```cs
[FunctionName("SignalRTest")]
public static async Task Run([SignalRTrigger("SignalRTest", "messages", "SendMessage", parameterNames: new string[] {"message"})]InvocationContext invocationContext, string message, ILogger logger)
{
    logger.LogInformation($"Receive {message} from {invocationContext.ConnectionId}.");
}
```

#### Use attribute `[SignalRParameter]` to simplify `ParameterNames`

As it's bit cumbersome to use `ParameterNames`, `SignalRParameter` is provided to achieve the same purpose.

```cs
[FunctionName("SignalRTest")]
public static async Task Run([SignalRTrigger("SignalRTest", "messages", "SendMessage")]InvocationContext invocationContext, [SignalRParameter]string message, ILogger logger)
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
|**category**|**Category**| This value must be set as the category of messages for the function to be triggered. The category can be one of the following values: <ul><li>**connections**: Including *connected* and *disconnected* events</li><li>**messages**: Including all other events except those in *connections* category</li></ul> |
|**event**|**Event**| This value must be set as the event of messages for the function to be triggered. For *messages* category, event is the *target* in [invocation message](https://github.com/dotnet/aspnetcore/blob/master/src/SignalR/docs/specs/HubProtocol.md#invocation-message-encoding) that clients send. For *connections* category, only *connected* and *disconnected* is used. |
|**parameterNames**|**ParameterNames**| (Optional) A list of names that binds to the parameters. |
|**connectionStringSetting**|**ConnectionStringSetting**| The name of the app setting that contains the SignalR Service connection string (defaults to "AzureSignalRConnectionString") |

## Payload

The trigger input type is declared as either `InvocationContext` or a custom type. If you choose `InvocationContext` you get full access to the request content. For a custom type, the runtime tries to parse the JSON request body to set the object properties.

### InvocationContext

InvocationContext contains all the content in the message send from SignalR Service.

|Property in InvocationContext | Description|
|------------------------------|------------|
|Arguments| Available for *messages* category. Contains *arguments* in [invocation message](https://github.com/dotnet/aspnetcore/blob/master/src/SignalR/docs/specs/HubProtocol.md#invocation-message-encoding)|
|Error| Available for *disconnected* event. It can be Empty if the connection closed with no error, or it contains the error messages.|
|Hub| The hub name which the message belongs to.|
|Category| The category of the message.|
|Event| The event of the message.|
|ConnectionId| The connection ID of the client which sends the message.|
|UserId| The user identity of the client which sends the message.|
|Headers| The headers of the request.|
|Query| The query of the request when clients connect to the service.|
|Claims| The claims of the client.|

## Using `ParameterNames`

The property `ParameterNames` in `SignalRTrigger` allows you to bind arguments of invocation messages to the parameters of functions. That gives you a more convenient way to access arguments of `InvocationContext`.

Say you have a JavaScript SignalR client trying to invoke method `broadcast` in Azure Function with two arguments.

```javascript
await connection.invoke("broadcast", message1, message2);
```

You can access these two arguments from parameter as well as assign type of parameter for them by using `ParameterNames`.

### Remarks

For the parameter binding, the order matters. If you are using `ParameterNames`, the order in `ParameterNames` matches the order of the arguments you invoke in the client. If you are using attribute `[SignalRParameter]` in C#, the order of arguments in Azure Function methods matches the order of arguments in clients.

`ParameterNames` and attribute `[SignalRParameter]` **cannot** be used at the same time, or you will get an exception.

## Send messages to SignalR Service trigger binding

Azure Function generates a URL for SignalR Service trigger binding and it is formatted as following:

    https://<APP_NAME>.azurewebsites.net/runtime/webhooks/signalr?code=<API_KEY>

The `API_KEY` is generated by Azure Function. You can get the `API_KEY` from Azure portal as you're using SignalR Service trigger binding.
:::image type="content" source="media/functions-bindings-signalr-service/signalr-keys.png" alt-text="API key":::

You should set this URL in `UrlTemplate` in the upstream settings of SignalR Service.

## Next steps

* [Azure Functions development and configuration with Azure SignalR Service](../azure-signalr/signalr-concept-serverless-development-config.md)
* [SignalR Service Trigger binding sample](https://github.com/Azure/azure-functions-signalrservice-extension/tree/dev/samples/bidirectional-chat)