---
title: RabbitMQ output bindings for Azure Functions
description: Learn to send RabbitMQ messages from Azure Functions.
author: cachai2
ms.assetid: 
ms.topic: reference
ms.date: 11/17/2021
ms.author: cachai
ms.custom: zone_pivot_groups: programming-languages-set-functions
---

# RabbitMQ output binding for Azure Functions overview

> [!NOTE]
> The RabbitMQ bindings are only fully supported on **Premium and Dedicated** plans. Consumption is not supported.

Use the RabbitMQ output binding to send messages to a RabbitMQ queue.

For information on setup and configuration details, see the [overview](functions-bindings-rabbitmq-output.md).

## Example

::: zone pivot="programming-language-csharp"

[](../../includes/functions-bindings-csharp-intro.md)

# [In-process](#tab/in-process)

The following example shows a [C# function](functions-dotnet-class-library.md) that sends a RabbitMQ message when triggered by a TimerTrigger every 5 minutes using the method return value as the output:

```cs
[FunctionName("RabbitMQOutput")]
[return: RabbitMQ(QueueName = "outputQueue", ConnectionStringSetting = "rabbitMQConnectionAppSetting")]
public static string Run([TimerTrigger("0 */5 * * * *")] TimerInfo myTimer, ILogger log)
{
    log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");
    return $"{DateTime.Now}";
}
```

The following example shows how to use the IAsyncCollector interface to send messages.

```cs
[FunctionName("RabbitMQOutput")]
public static async Task Run(
[RabbitMQTrigger("sourceQueue", ConnectionStringSetting = "rabbitMQConnectionAppSetting")] string rabbitMQEvent,
[RabbitMQ(QueueName = "destinationQueue", ConnectionStringSetting = "rabbitMQConnectionAppSetting")]IAsyncCollector<string> outputEvents,
ILogger log)
{
     // send the message
    await outputEvents.AddAsync(JsonConvert.SerializeObject(rabbitMQEvent));
}
```

The following example shows how to send the messages as POCOs.

```cs
namespace Company.Function
{
    public class TestClass
    {
        public string x { get; set; }
    }
    public static class RabbitMQOutput{
        [FunctionName("RabbitMQOutput")]
        public static async Task Run(
        [RabbitMQTrigger("sourceQueue", ConnectionStringSetting = "rabbitMQConnectionAppSetting")] TestClass rabbitMQEvent,
        [RabbitMQ(QueueName = "destinationQueue", ConnectionStringSetting = "rabbitMQConnectionAppSetting")]IAsyncCollector<TestClass> outputPocObj,
        ILogger log)
        {
            // send the message
            await outputPocObj.AddAsync(rabbitMQEvent);
        }
    }
}
```

# [Isolated process](#tab/isolated-process)

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/RabbitMQ/RabbitMQFunction.cs" range="17-25":::


# [C# Script](#tab/csharp-script)

The following example shows a RabbitMQ output binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding. The function reads in the message from an HTTP trigger and outputs it to the RabbitMQ queue.

Here's the binding data in the *function.json* file:

```json
{
    "bindings": [
        {
            "type": "httpTrigger",
            "direction": "in",
            "authLevel": "function",
            "name": "input",
            "methods": [
                "get",
                "post"
            ]
        },
        {
            "type": "rabbitMQ",
            "name": "outputMessage",
            "queueName": "outputQueue",
            "connectionStringSetting": "rabbitMQConnectionAppSetting",
            "direction": "out"
        }
    ]
}
```

Here's the C# script code:

```C#
using System;
using Microsoft.Extensions.Logging;

public static void Run(string input, out string outputMessage, ILogger log)
{
    log.LogInformation(input);
    outputMessage = input;
}
```
---

::: zone-end
::: zone pivot="programming-language-java"

The following Java function uses the `@RabbitMQOutput` annotation from the [Java RabbitMQ types](https://mvnrepository.com/artifact/com.microsoft.azure.functions/azure-functions-java-library-rabbitmq) to describe the configuration for a RabbitMQ queue output binding. The function sends a message to the RabbitMQ queue when triggered by a TimerTrigger every 5 minutes.

```java
@FunctionName("RabbitMQOutputExample")
public void run(
@TimerTrigger(name = "keepAliveTrigger", schedule = "0 */5 * * * *") String timerInfo,
@RabbitMQOutput(connectionStringSetting = "rabbitMQConnectionAppSetting", queueName = "hello") OutputBinding<String> output,
final ExecutionContext context) {
    output.setValue("Some string");
}
```

::: zone-end  
::: zone pivot="programming-language-javascript"  

The following example shows a RabbitMQ output binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding. The function reads in the message from an HTTP trigger and outputs it to the RabbitMQ queue.

Here's the binding data in the *function.json* file:

```json
{
    "bindings": [
        {
            "type": "httpTrigger",
            "direction": "in",
            "authLevel": "function",
            "name": "input",
            "methods": [
                "get",
                "post"
            ]
        },
        {
            "type": "rabbitMQ",
            "name": "outputMessage",
            "queueName": "outputQueue",
            "connectionStringSetting": "rabbitMQConnectionAppSetting",
            "direction": "out"
        }
    ]
}
```

Here's JavaScript code:

```javascript
module.exports = function (context, input) {
    context.bindings.myQueueItem = input.body;
    context.done();
};
```

::: zone-end   
::: zone pivot="programming-language-python"  

The following example shows a RabbitMQ output binding in a *function.json* file and a Python function that uses the binding. The function reads in the message from an HTTP trigger and outputs it to the RabbitMQ queue.

Here's the binding data in the *function.json* file:

```json
{
    "scriptFile": "__init__.py",
    "bindings": [
        {
            "authLevel": "function",
            "type": "httpTrigger",
            "direction": "in",
            "name": "req",
            "methods": [
                "get",
                "post"
            ]
        },
        {
            "type": "http",
            "direction": "out",
            "name": "$return"
        },​​
        {
            "type": "rabbitMQ",
            "name": "outputMessage",
            "queueName": "outputQueue",
            "connectionStringSetting": "rabbitMQConnectionAppSetting",
            "direction": "out"
        }
    ]
}
```

In *_\_init_\_.py*:

```python
import azure.functions as func

def main(req: func.HttpRequest, outputMessage: func.Out[str]) -> func.HttpResponse:
    input_msg = req.params.get('message')
    outputMessage.set(input_msg)
    return 'OK'
```

::: zone-end  
::: zone pivot="programming-language-csharp"

## Attributes

Both [in-process](functions-dotnet-class-library.md) and [isolated process](dotnet-isolated-process-guide.md) C# libraries use the <!--attribute API here--> attribute to define the function. C# script instead uses a function.json configuration file.

# [In-process](#tab/in-process)

In [C# class libraries](functions-dotnet-class-library.md), use the [RabbitMQAttribute](https://github.com/Azure/azure-functions-rabbitmq-extension/blob/dev/src/RabbitMQAttribute.cs).

Here's a `RabbitMQAttribute` attribute in a method signature:

```csharp
[FunctionName("RabbitMQOutput")]
public static async Task Run(
[RabbitMQTrigger("SourceQueue", ConnectionStringSetting = "TriggerConnectionString")] string rabbitMQEvent,
[RabbitMQ("DestinationQueue", ConnectionStringSetting = "OutputConnectionString")]IAsyncCollector<string> outputEvents,
ILogger log)
{
    ...
}
```

For a complete example, see C# [example](#example).

# [Isolated process](#tab/isolated-process)

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/RabbitMQ/RabbitMQFunction.cs" range="12-16":::


# [C# script](#tab/csharp-script)

Attributes are not supported by C# Script.

---

::: zone-end  
::: zone pivot="programming-language-javascript"  

## Annotations

Annotations are not supported by JavaScript.

::: zone-end 
::: zone pivot="programming-language-python"  

## Annotations

Annotations are not supported by Python.

::: zone-end 
::: zone pivot="programming-language-java"  

The `RabbitMQOutput` annotation allows you to create a function that runs when sending a RabbitMQ message. Configuration options available include queue name and connection string name. For more parameter details, visit the [RabbitMQOutput Java annotations](https://github.com/Azure/azure-functions-rabbitmq-extension/blob/dev/binding-library/java/src/main/java/com/microsoft/azure/functions/rabbitmq/annotation/RabbitMQOutput.java).

See the output binding [example](#example) for more detail.

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-csharp,programming-language-java,programming-language-python" 
 
## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `RabbitMQ` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type** | n/a | Must be set to "RabbitMQ".|
|**direction** | n/a | Must be set to "out". |
|**name** | n/a | The name of the variable that represents the queue in function code. |
|**queueName**|**QueueName**| Name of the queue to send messages to. |
|**hostName**|**HostName**|(ignored if using ConnectStringSetting) <br>Hostname of the queue (Ex: 10.26.45.210)|
|**userName**|**UserName**|(ignored if using ConnectionStringSetting) <br>Name of the app setting that contains the username to access the queue. Ex. UserNameSetting: "< UserNameFromSettings >"|
|**password**|**Password**|(ignored if using ConnectionStringSetting) <br>Name of the app setting that contains the password to access the queue. Ex. UserNameSetting: "< UserNameFromSettings >"|
|**connectionStringSetting**|**ConnectionStringSetting**|The name of the app setting that contains the RabbitMQ message queue connection string. If you specify the connection string directly and not through an app setting in local.settings.json, the trigger won't work. (Ex: In *function.json*: connectionStringSetting: "rabbitMQConnection" <br> In *local.settings.json*: "rabbitMQConnection" : "< ActualConnectionstring >")|
|**port**|**Port**|(ignored if using ConnectionStringSetting) Gets or sets the Port used. Defaults to 0, which points to rabbitmq client's default port setting: 5672.|

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

::: zone-end  

See the [Example section](#example) for complete examples.

## Usage

::: zone pivot="programming-language-csharp"  
The parameter type supported by the Event Grid trigger depends on the Functions runtime version, the extension package version, and the C# modality used.

# [In-process](#tab/in-process)

Use the following parameter types for the output binding:

* `byte[]` - If the parameter value is null when the function exits, Functions doesn't create a message.
* `string` - If the parameter value is null when the function exits, Functions doesn't create a message.
* `POCO` - If the parameter value isn't formatted as a C# object, an error will be received. For a complete example, see C# [example](#example).

When working with C# functions:

* Async functions need a return value or `IAsyncCollector` instead of an `out` parameter.

# [Isolated process](#tab/isolated-process)

<!--If available, call out any usage information from the linked example in the worker repo. -->

# [C# script](#tab/csharp-script)

Use the following parameter types for the output binding:

* `byte[]` - If the parameter value is null when the function exits, Functions doesn't create a message.
* `string` - If the parameter value is null when the function exits, Functions doesn't create a message.
* `POCO` - If the parameter value isn't formatted as a C# object, an error will be received. For a complete example, see C# Script [example](#example).

When working with C# Script functions:

* Async functions need a return value or `IAsyncCollector` instead of an `out` parameter.

---

::: zone-end  
::: zone pivot="programming-language-java"

Use the following parameter types for the output binding:

* `byte[]` - If the parameter value is null when the function exits, Functions doesn't create a message.
* `string` - If the parameter value is null when the function exits, Functions doesn't create a message.
* `POJO` - If the parameter value isn't formatted as a Java object, an error will be received.

::: zone-end  
::: zone pivot="programming-language-javascript"
  
The queue message is available via context.bindings.\<NAME\> where \<NAME\> matches the name defined in function.json. If the payload is JSON, the value is deserialized into an object.

::: zone-end  
::: zone pivot="programming-language-python"  

Refer to the Python [example](#example).

::: zone-end  

## Next steps

- [Run a function when a RabbitMQ message is created (Trigger)](./functions-bindings-rabbitmq-trigger.md)