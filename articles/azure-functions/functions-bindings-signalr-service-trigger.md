---
title: Azure Functions SignalR Service trigger binding
description: Learn to send SignalR Service messages from Azure Functions.
author: chenyl
ms.topic: reference
ms.devlang: csharp, javascript, python
ms.custom: devx-track-csharp
ms.date: 11/29/2021
ms.author: chenyl
zone_pivot_groups: programming-languages-set-functions
---

# SignalR Service trigger binding for Azure Functions

Use the *SignalR* trigger binding to respond to messages sent from Azure SignalR Service. When function is triggered, messages passed to the function is parsed as a json object.

In SignalR Service serverless mode, SignalR Service uses the [Upstream](../azure-signalr/concept-upstream.md) feature to send messages from client to Function App. And Function App uses SignalR Service trigger binding to handle these messages. The general architecture is shown below:

:::image type="content" source="media/functions-bindings-signalr-service/signalr-trigger.png" alt-text="SignalR Trigger Architecture":::

For information on setup and configuration details, see the [overview](functions-bindings-signalr-service.md).

## Example

The following example shows a function that receives a message using the trigger binding and logs the message.

::: zone pivot="programming-language-csharp"

<!--Optional intro text goes here, followed by the C# modes include.-->

[!INCLUDE [functions-bindings-csharp-intro](../../includes/functions-bindings-csharp-intro.md)]

# [C#](#tab/csharp)

SignalR Service trigger binding for C# has two programming models. Class based model and traditional model. Class based model provides a consistent SignalR server-side programming experience. Traditional model provides more flexibility and is similar to other function bindings.

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

Traditional model obeys the convention of Azure Function developed by C#. If you're not familiar with it, you can learn from [documents](./functions-dotnet-class-library.md).

```cs
[FunctionName("SignalRTest")]
public static async Task Run([SignalRTrigger("SignalRTest", "messages", "SendMessage", parameterNames: new string[] {"message"})]InvocationContext invocationContext, string message, ILogger logger)
{
    logger.LogInformation($"Receive {message} from {invocationContext.ConnectionId}.");
}
```

#### Use attribute `[SignalRParameter]` to simplify `ParameterNames`

As it's a bit cumbersome to use `ParameterNames`, the `SignalRParameter` attribute achieves the same purpose.

```cs
[FunctionName("SignalRTest")]
public static async Task Run([SignalRTrigger("SignalRTest", "messages", "SendMessage")]InvocationContext invocationContext, [SignalRParameter]string message, ILogger logger)
{
    logger.LogInformation($"Receive {message} from {invocationContext.ConnectionId}.");
}
```

# [In-process](#tab/in-process)

<!--Content and samples from the C# tab in ##Examples go here.-->

# [Isolated process](#tab/isolated-process)

<!--add a link to the extension-specific code example in this repo: https://github.com/Azure/azure-functions-dotnet-worker/blob/main/samples/Extensions/ as in the following example:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/EventGrid/EventGridFunction.cs" range="35-49":::
-->

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

---

::: zone-end

::: zone pivot="programming-language-java"

::: zone-end 
 
::: zone pivot="programming-language-javascript"  

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

::: zone-end  

::: zone pivot="programming-language-powershell"  

<!--Content and samples from the PowerShell tab in ##Examples go here.-->

::: zone-end 
 
::: zone pivot="programming-language-python"  

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

::: zone-end 
 
::: zone pivot="programming-language-csharp"

## Attributes

Both [in-process](functions-dotnet-class-library.md) and [isolated process](dotnet-isolated-process-guide.md) C# libraries use the <!--attribute API here--> attribute to define the function. C# script instead uses a function.json configuration file.

<!-- If the attribute's constructor takes parameters, you'll need to include a table like this, where the values are from the original table in the Configuration section:

The attribute's constructor takes the following parameters:

|Parameter | Description|
|---------|----------------------|
|**Parameter1** |Description 1|
|**Parameter2** | Description 2|

-->

# [In-process](#tab/in-process)

<!--C# attribute information for the trigger from ## Attributes and annotations goes here, with intro sentence.-->

# [Isolated process](#tab/isolated-process)

<!-- C# attribute information for the trigger goes here with an intro sentence. Use a code link like the following to show the method definition: 

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/EventGrid/EventGridFunction.cs" range="13-16":::
-->

# [C# script](#tab/csharp-script)

C# script uses a function.json file for configuration instead of attributes.

The following table explains the binding configuration properties for C# script that you set in the *function.json* file. 

<!-- Use the parts of the existing table in ## Configuration that apply to C# script, which might look like the following:

|function.json property |Description|
|---------|---------|
| **type** | Required - must be set to `eventGridTrigger`. |
| **direction** | Required - must be set to `in`. |
| **name** | Required - the variable name used in function code for the parameter that receives the event data. |
| **parameter1** |See the **Parameter1** attribute above.|
| **parameter2** |See the **Parameter2** attribute above.|
-->

---

::: zone-end 
 
::: zone pivot="programming-language-java" 
 
## Annotations

<!-- Content from the Java tab under ## Attributes and annotations. -->
::: zone-end  

::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python" 
 
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

::: zone-end  

See the [Example section](#example) for complete examples.

## Usage

::: zone pivot="programming-language-csharp"  
The parameter type supported by the Event Grid trigger depends on the Functions runtime version, the extension package version, and the C# modality used.

# [In-process](#tab/in-process)

<!--Any usage information from the C# tab in ## Usage. -->

# [Isolated process](#tab/isolated-process)

<!--If available, call out any usage information from the linked example in the worker repo. -->

# [C# script](#tab/csharp-script)

<!--Any usage information from the C# script tab in ## Usage. This might also be shared with C# in-process-->

---

::: zone-end  
<!--Any of the below pivots can be combined if the usage info is identical.-->
::: zone pivot="programming-language-java"
<!--Any usage information from the Java tab in ## Usage. -->
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-powershell"  
<!--Any usage information from the JavaScript tab in ## Usage. -->
::: zone-end  
::: zone pivot="programming-language-powershell"  
<!--Any usage information from the PowerShell tab in ## Usage. -->
::: zone-end  
::: zone pivot="programming-language-typescript"  
<!--Any usage information from the TypeScript tab in ## Usage. -->
::: zone-end  
::: zone pivot="programming-language-python"  
<!--Any usage information from the Python tab in ## Usage. -->
::: zone-end  

<!---## Extra sections

Put any sections with content that doesn't fit into the above section headings down here. This will likely get moved to another article after the refactor. 
-->

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

The property `ParameterNames` in `SignalRTrigger` lets you bind arguments of invocation messages to the parameters of functions. You can use the name you defined as part of [binding expressions](../azure-functions/functions-bindings-expressions-patterns.md) in other binding or as parameters in your code. That gives you a more convenient way to access arguments of `InvocationContext`.

Say you have a JavaScript SignalR client trying to invoke method `broadcast` in Azure Function with two arguments `message1`, `message2`.

```javascript
await connection.invoke("broadcast", message1, message2);
```

After you set `parameterNames`, the name you defined, respectively, corresponds to the arguments sent on the client side. 

```cs
[SignalRTrigger(parameterNames: new string[] {"arg1, arg2"})]
```

Then, the `arg1` will contain the content of `message1`, and `arg2` will contain the content of `message2`.

### Remarks

For the parameter binding, the order matters. If you're using `ParameterNames`, the order in `ParameterNames` matches the order of the arguments you invoke in the client. If you're using attribute `[SignalRParameter]` in C#, the order of arguments in Azure Function methods matches the order of arguments in clients.

`ParameterNames` and attribute `[SignalRParameter]` **cannot** be used at the same time, or you will get an exception.

## SignalR Service integration

SignalR Service needs a URL to access Function App when you're using SignalR Service trigger binding. The URL should be configured in **Upstream Settings** on the SignalR Service side. 

:::image type="content" source="../azure-signalr/media/concept-upstream/upstream-portal.png" alt-text="Upstream Portal":::

When using SignalR Service trigger, the URL can be simple and formatted as shown below:

```http
<Function_App_URL>/runtime/webhooks/signalr?code=<API_KEY>
```

The `Function_App_URL` can be found on Function App's Overview page and The `API_KEY` is generated by Azure Function. You can get the `API_KEY` from `signalr_extension` in the **App keys** blade of Function App.
:::image type="content" source="media/functions-bindings-signalr-service/signalr-keys.png" alt-text="API key":::

If you want to use more than one Function App together with one SignalR Service, upstream can also support complex routing rules. Find more details at [Upstream settings](../azure-signalr/concept-upstream.md).

## Step by step sample

You can follow the sample in GitHub to deploy a chat room on Function App with SignalR Service trigger binding and upstream feature: [Bidirectional chat room sample](https://github.com/aspnet/AzureSignalR-samples/tree/master/samples/BidirectionChat)

## Next steps

* [Azure Functions development and configuration with Azure SignalR Service](../azure-signalr/signalr-concept-serverless-development-config.md)
* [SignalR Service Trigger binding sample](https://github.com/aspnet/AzureSignalR-samples/tree/master/samples/BidirectionChat)
