---
title: RabbitMQ trigger for Azure Functions
description: Learn to run an Azure Function when a RabbitMQ message is created.
author: cachai2

ms.assetid:
ms.topic: reference
ms.date: 12/11/2020
ms.author: cachai
ms.custom:
---

# RabbitMQ trigger for Azure Functions overview

> [!NOTE]
> The RabbitMQ bindings are only fully supported on **Windows Premium** plans. Linux support will be released early in the 2021 calendar year. Consumption is not supported.

Use the RabbitMQ trigger to respond to messages from a RabbitMQ queue.

For information on setup and configuration details, see the [overview](functions-bindings-rabbitmq.md).

## Example

# [C#](#tab/csharp)

The following example shows a [C# function](functions-dotnet-class-library.md) that reads and logs the RabbitMQ message:

```cs
[FunctionName("RabbitMQTriggerCSharp")]
public static void RabbitMQTrigger_BasicDeliverEventArgs(
    [RabbitMQTrigger("queue", ConnectionStringSetting = "rabbitMQConnection")] BasicDeliverEventArgs args,
    ILogger logger
    )
{
    logger.LogInformation($"C# RabbitMQ queue trigger function processed message: {Encoding.UTF8.GetString(args.Body)}");
}
```

# [C# Script](#tab/csharp-script)

The following example shows a RabbitMQ trigger binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding. The function reads and logs the RabbitMQ message.

Here's the binding data in the *function.json* file:

```json
{​​
    "bindings": [
        {​​
            "name": "myQueueItem",
            "type": "rabbitMQTrigger",
            "direction": "in",
            "queueName": "queue",
            "connectionStringSetting": "rabbitMQConnection"
        }​​
    ]
}​​
```

Here's the C# script code:

```cs
using System;

public static void Run(string myQueueItem, ILogger log)
{​​
    log.LogInformation($"C# Script RabbitMQ trigger function processed: {​​myQueueItem}​​");
}​​
```

# [JavaScript](#tab/javascript)

The following example shows a RabbitMQ trigger binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding. The function reads and logs a RabbitMQ message.

Here's the binding data in the *function.json* file:

```json
{​​
    "bindings": [
        {​​
            "name": "myQueueItem",
            "type": "rabbitMQTrigger",
            "direction": "in",
            "queueName": "queue",
            "connectionStringSetting": "rabbitMQConnection"
        }​​
    ]
}​​
```

Here's the JavaScript script code:

```javascript
module.exports = async function (context, myQueueItem) {​​
    context.log('JavaScript RabbitMQ trigger function processed work item', myQueueItem);
}​​;
```

# [Powershell](#tab/powershell)

The following example demonstrates how to read a RabbitMQ queue message via a trigger.

```powershell
# Input bindings are passed in via param block.
param([string] $MyQueueItem, $TriggerMetadata)

# Write out the queue message and insertion time to the information log.
Write-Host "PowerShell rabbitmq trigger function processed work item: $MyQueueItem"
Write-Host "Queue item insertion time: $($TriggerMetadata.InsertionTime)"
```

# [Python](#tab/python)

The following example demonstrates how to read a RabbitMQ queue message via a trigger.

A RabbitMQ binding is defined in *function.json* where *type* is set to `RabbitMQTrigger`.

```json
{​​
    "scriptFile": "__init__.py",
    "bindings": [
        {​​
            "name": "myQueueItem",
            "type": "rabbitMQTrigger",
            "direction": "in",
            "queueName": "",
            "connectionStringSetting": ""
        }​​
    ]
}​​
```

The code in *_\_init_\_.py* declares a parameter as `func.RabbitMQMessage`, which allows you to read the message in your function.

```python
import logging
import azure.functions as func

def main(myQueueItem) -> None:
    logging.info('Python RabbitMQ trigger function processed a queue item: %s', myQueueItem)
```

# [Java](#tab/java)

The following Java function uses the `@RabbitMQTrigger` annotation from the [Java RabbitMQ types](https://mvnrepository.com/artifact/com.microsoft.azure.functions/azure-functions-java-library-rabbitmq) to describe the configuration for a RabbitMQ queue trigger. The function grabs the message placed on the queue and adds it to the logs.

```java
@FunctionName("RabbitMQTriggerExample")
public void run(
    @RabbitMQTrigger(connectionStringSetting = "rabbitMQConnection", queueName = "queue") String input,
    final ExecutionContext context)
{
    context.getLogger().info("Java HTTP trigger processed a request." + input);
}
```

---

## Attributes and annotations

# [C#](#tab/csharp)

In [C# class libraries](functions-dotnet-class-library.md), use the [RabbitMQTrigger](https://github.com/Azure/azure-functions-rabbitmq-extension/blob/dev/src/Trigger/RabbitMQTriggerAttribute.cs) attribute.

Here's a `RabbitMQTrigger` attribute in a method signature:

```csharp
[FunctionName("RabbitMQTest")]
public static void RabbitMQTest([RabbitMQTrigger("queue")] string message, ILogger log)
{
    ...
}
```

For a complete example, see C# example.

# [C# Script](#tab/csharp-script)

Attributes are not supported by C# Script.

# [JavaScript](#tab/javascript)

Attributes are not supported by JavaScript.

# [Powershell](#tab/powershell)

Attributes are not supported by Powershell

# [Python](#tab/python)

Attributes are not supported by Python.

# [Java](#tab/java)

The `RabbitMQTrigger` annotation allows you to create a function that runs when a RabbitMQ message is created. Configuration options available include queue name and connection string name. For additional parameter details please visit the [RabbitMQTrigger Java annotations](https://github.com/Azure/azure-functions-rabbitmq-extension/blob/dev/binding-library/java/src/main/java/com/microsoft/azure/functions/rabbitmq/annotation/RabbitMQTrigger.java).

See the trigger [example](#example) for more detail.

---

## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `RabbitMQTrigger` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type** | n/a | Must be set to "RabbitMQTrigger".|
|**direction** | n/a | Must be set to "in".|
|**name** | n/a | The name of the variable that represents the queue in function code. |
|**queueName**|**QueueName**| Name of the queue to receive messages from. |
|**hostName**|**HostName**|(optional if using ConnectStringSetting) <br>Hostname of the queue (Ex: 10.26.45.210)|
|**userNameSetting**|**UserNameSetting**|(optional if using ConnectionStringSetting) <br>Name to access the queue |
|**passwordSetting**|**PasswordSetting**|(optional if using ConnectionStringSetting) <br>Password to access the queue|
|**connectionStringSetting**|**ConnectionStringSetting**|The name of the app setting that contains the RabbitMQ message queue connection string. Please note that if you specify the connection string directly and not through an app setting in local.settings.json, the trigger will not work. (Ex: In *function.json*: connectionStringSetting: "rabbitMQConnection" <br> In *local.settings.json*: "rabbitMQConnection" : "< ActualConnectionstring >")|
|**port**|**Port**|Gets or sets the Port used. Defaults to 0.|

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Usage

# [C#](#tab/csharp)

The following parameter types are available for the message:

* [RabbitMQ Event](https://www.rabbitmq.com/releases/rabbitmq-dotnet-client/v3.2.2/rabbitmq-dotnet-client-3.2.2-client-htmldoc/html/type-RabbitMQ.Client.Events.BasicDeliverEventArgs.html) - the default format for RabbitMQ messages.
  * `byte[]`- Through Body property.
* `string` - If the message is text.
* `JSON object` - If the message is delivered as a valid JSON string
* `POCO` - If the message is properly formatted as a C# object

# [C# Script](#tab/csharp-script)

The RabbitMQ message is passed into the function as either a string or JSON object.

# [JavaScript](#tab/javascript)

The RabbitMQ message is passed into the function as either a string or JSON object.

# [Powershell](#tab/powershell)

The RabbitMQ message is passed into the function as either a string or JSON object.

# [Python](#tab/python)

The RabbitMQ message is passed into the function as either a string or JSON object.

# [Java](#tab/java)

Refer to Java [attributes and annotations](#Attributes-and-annotations).

---

## Dead Letter Queues
Dead letter queues and exchanges can't be controlled or configured from the RabbitMQ extensions and should be configured in RabbitMQ. Please refer to the [RabbitMQ documentation](https://www.rabbitmq.com/dlx.html).

## RabbitMQ Dashboard
If you would like to monitor your queues and exchanges for a certain RabbitMQ endpoint, first enable the [RabbitMQ management plugin](https://www.rabbitmq.com/management.html). Then, point your browser to the address of format http://{node-hostname}:15672 and log in with your user name and password.

## host.json settings

This section describes the global configuration settings available for this binding in versions 2.x and higher. The example host.json file below contains only the settings for this binding. For more information about global configuration settings, see [host.json reference for Azure Functions version](functions-host-json.md).

```json
{
    "version": "2.0",
    "extensions": {
        "rabbitMQ": {
            "prefetchCount": 100,
            "hostName": "localhost",
            "queueName": "queue",
            "password": "<your password>",
            "userName": "<your username>",
            "connectionString": "amqp://user:password@url:port",
            "port": 10
        }
    }
}
```

> [!NOTE]
> The connectionString takes precedence over hostName and userName. If these are all set, the connectionString will override the other two.

|Property  |Default | Description |
|---------|---------|---------|
|prefetchCount|30|Gets or sets the number of messages that the message receiver can simultaneously request and is cached.|
|hostName|n/a|(optional if using ConnectStringSetting) <br>Hostname of the queue (Ex: 10.26.45.210)|
|queueName|n/a| Name of the queue to receive messages from. |
|password|n/a|(optional if using ConnectionStringSetting) <br>Password to access the queue|
|userName|n/a|(optional if using ConnectionStringSetting) <br>Name to access the queue |
|connectionString|n/a|The name of the app setting that contains the RabbitMQ message queue connection string. Please note that if you specify the connection string directly and not through an app setting in local.settings.json, the trigger will not work.|
|port|0|The maximum number of sessions that can be handled concurrently per scaled instance.|

## Next steps

- [Send RabbitMQ messages from Azure Functions (Output binding)](./functions-bindings-service-bus-output.md)
