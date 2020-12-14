---
title: RabbitMQ output bindings for Azure Functions
description: Learn to send RabbitMQ messages from Azure Functions.
author: cachai2

ms.assetid: 
ms.topic: reference
ms.date: 12/13/2020
ms.author: cachai
ms.custom: 
---

# RabbitMQ output binding for Azure Functions overview

> [!NOTE]
> The RabbitMQ bindings are only fully supported on **Windows Premium** plans. Linux support will be released early in the 2021 calendar year. Consumption is not supported.

Use the RabbitMQ output binding to send messages to a RabbitMQ queue.

For information on setup and configuration details, see the [overview](functions-bindings-rabbitmq-output.md).

## Example

# [C#](#tab/csharp)

The following example shows a [C# function](functions-dotnet-class-library.md) that sends a RabbitMQ message when triggered by a TimerTrigger every 5 minutes using the method return value as the output:

```cs
[FunctionName("RabbitMQOutput")]
[return: RabbitMQ("outputQueue", ConnectionStringSetting = "ConnectionStringSetting")]
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
[RabbitMQTrigger("sourceQueue", ConnectionStringSetting = "TriggerConnectionString")] string rabbitMQEvent,
[RabbitMQ("destinationQueue", ConnectionStringSetting = "OutputConnectionString")]IAsyncCollector<string> outputEvents,
ILogger log)
{
    // processing:
    var myProcessedEvent = DoSomething(rabbitMQEvent);
    
     // send the message
    await outputEvents.AddAsync(JsonConvert.SerializeObject(myProcessedEvent));
}
```

The following example shows how to send the messages as POCOs.

```cs
public class TestClass
{
    public string x { get; set; }
}

[FunctionName("RabbitMQOutput")]
public static async Task Run(
[RabbitMQTrigger("sourceQueue", ConnectionStringSetting = "TriggerConnectionString")] TestClass rabbitMQEvent,
[RabbitMQ("destinationQueue", ConnectionStringSetting = "OutputConnectionString")]IAsyncCollector<TestClass> outputPocObj,
ILogger log)
{
    // send the message
    await outputPocObj.Add(rabbitMQEvent);
}
```

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
            "connectionStringSetting": "connectionStringAppSetting",
            "direction": "out"
        }
    ]
}
```

Here's the C# script code:

```csx
using System;
using Microsoft.Extensions.Logging;

public static void Run(string input, out string outputMessage, ILogger log)
{
    log.LogInformation(input);
    outputMessage = input;
}
```

# [JavaScript](#tab/javascript)

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
            "connectionStringSetting": "connectionStringAppSetting",
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

# [Powershell](#tab/powershell)

The following example shows a RabbitMQ output binding in a *function.json* file and a [Powershell function](functions-reference-powershell.md) that uses the binding. The function reads in the message from an HTTP trigger and outputs it to the RabbitMQ queue.

Here's the binding data in the *function.json* file:

```json
{
    "bindings": [
        {
            "type": "httpTrigger",
            "direction": "in",
            "authLevel": "anonymous",
            "name": "Request",
            "methods":[
                "get",
                "post"
            ]
        },
        {
            "type": "rabbitMQ",
            "name": "outputMessage",
            "queueName": "outputQueue",
            "connectionStringSetting": "connectionStringAppSetting",
            "direction": "out"
        }
    ]
}
```

Here's the Powershell code:

```powershell
using namespace System.Net

param($Request, $TriggerMetadata)
Write-Host "PowerShell HTTP trigger function processed a request."

$message = $Request.Query.Message
Push-OutputBinding -Name outputMessage -Value $message
```

# [Python](#tab/python)

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
            "connectionStringSetting": "connectionStringAppSetting",
            "direction": "out"
        }
    ]
}
```

In *_\_init_\_.py*, you can write out a message to the queue by passing a value to the `set` method.

```python
import azure.functions as func

def main(req: func.HttpRequest, msg: func.Out[str]) -> func.HttpResponse:
    input_msg = req.params.get('message')
    msg.set(input_msg)
    return 'OK'
```

# [Java](#tab/java)

The following example shows a Java function that sends a message to RabbitMQ queue when triggered by a TimerTrigger every 5 minutes.

```java
@FunctionName("RabbitMQOutputExample")
public void run(
@TimerTrigger(name = "keepAliveTrigger", schedule = "0 */5 * * * *") String timerInfo,
@RabbitMQOutput(connectionStringSetting = "rabbitMQ", queueName = "hello") OutputBinding<String> output,
final ExecutionContext context) {
    output.setValue("Some string");
}
```

---

## Attributes and annotations

# [C#](#tab/csharp)

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

# [C# Script](#tab/csharp-script)

Attributes are not supported by C# Script.

# [JavaScript](#tab/javascript)

Attributes are not supported by JavaScript.

# [JavaScript](#tab/powershell)

Attributes are not supported by Powershell.

# [Python](#tab/python)

Attributes are not supported by Python.

# [Java](#tab/java)

The `RabbitMQOutput` annotation allows you to create a function that runs when sending a RabbitMQ message. Configuration options available include queue name and connection string name. For additional parameter details please visit the [RabbitMQOutput Java annotations](https://github.com/Azure/azure-functions-rabbitmq-extension/blob/dev/binding-library/java/src/main/java/com/microsoft/azure/functions/rabbitmq/annotation/RabbitMQOutput.java).

See the output binding [example](#example) for more detail.

---

## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `RabbitMQ` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type** | n/a | Must be set to "RabbitMQ".|
|**direction** | n/a | Must be set to "out". |
|**name** | n/a | The name of the variable that represents the queue in function code. |
|**queueName**|**QueueName**| Name of the queue to send messages to. |
|**hostName**|**HostName**|(optional if using ConnectStringSetting) <br>Hostname of the queue (Ex: 10.26.45.210)|
|**userName**|**UserName**|(optional if using ConnectionStringSetting) <br>Name to access the queue |
|**password**|**Password**|(optional if using ConnectionStringSetting) <br>Password to access the queue|
|**connectionStringSetting**|**ConnectionStringSetting**|The name of the app setting that contains the RabbitMQ message queue connection string. Please note that if you specify the connection string directly and not through an app setting in local.settings.json, the trigger will not work. (Ex: In *function.json*: connectionStringSetting: "rabbitMQConnection" <br> In *local.settings.json*: "rabbitMQConnection" : "< ActualConnectionstring >")|
|**port**|**Port**|Gets or sets the Port used. Defaults to 0.|

## Usage

# [C#](#tab/csharp)

Use the following parameter types for the output binding:

* `byte[]` - If the parameter value is null when the function exits, Functions does not create a message.
* `string` - If the parameter value is null when the function exits, Functions does not create a message.
* `POCO` - If the parameter value isn't formatted as a C# object, an error will be received. For a complete example, see C# [example](#example).

When working with C# functions:

* Async functions need a return value or `IAsyncCollector` instead of an `out` parameter.

# [C# Script](#tab/csharp-script)

The RabbitMQ message is sent through a string.

# [JavaScript](#tab/javascript)

The RabbitMQ message is sent through a string.

# [Powershell](#tab/powershell)

The RabbitMQ message is sent through a string.

# [Python](#tab/python)

The RabbitMQ message is sent through a string.

# [Java](#tab/java)

Use the following parameter types for the output binding:

* `byte[]` - If the parameter value is null when the function exits, Functions does not create a message.
* `string` - If the parameter value is null when the function exits, Functions does not create a message.
* `POJO` - If the parameter value isn't formatted as a Java object, an error will be received.

---

## Next steps

- [Run a function when a RabbitMQ message is created (Trigger)](./functions-bindings-rabbitmq-trigger.md)
