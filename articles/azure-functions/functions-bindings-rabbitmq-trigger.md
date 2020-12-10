---
title: RabbitMQ trigger for Azure Functions
description: Learn to run an Azure Function when a RabbitMQ message is created.
author: cachai

ms.assetid:
ms.topic: reference
ms.date: 02/19/2020
ms.author: cachai
ms.custom:
---

# RabbitMQ trigger for Azure Functions overview

Use the RabbitMQ trigger to respond to messages from a RabbitMQ queue.
Starting with extension version 3.1.0, you can trigger on a session-enabled queue.

For information on setup and configuration details, see the [overview](functions-bindings-rabbitmq.md).

## Example

# [C#](#tab/csharp)

The following example shows a [C# function](functions-dotnet-class-library.md) that reads RabbitMQ [message metadata](#message-metadata) and logs the message:

```cs
[FunctionName("RabbitMQQueueTriggerCSharp")]
public static void RabbitMQTrigger_BasicDeliverEventArgs(
    [RabbitMQTrigger("queue", Hostname = "localhost")] BasicDeliverEventArgs args,
    ILogger logger
    )
{
    logger.LogInformation($"RabbitMQ queue trigger function processed message: {Encoding.UTF8.GetString(args.Body)}");
}
```

# [C# Script](#tab/csharp-script)

The following example shows a RabbitMQ trigger binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding. The function reads [message metadata](#message-metadata) and logs a RabbitMQ message.

Here's the binding data in the *function.json* file:

```json
{
"bindings": [
    {
    "queueName": "testqueue",
    "connection": "MyRabbitMQConnection",
    "name": "myQueueItem",
    "type": "RabbitMQTrigger",
    "direction": "in"
    }
],
"disabled": false
}
```

Here's the C# script code:

```cs
using System;

public static void Run(string myQueueItem,
    Int32 deliveryCount,
    DateTime enqueuedTimeUtc,
    string messageId,
    TraceWriter log)
{
    log.Info($"C# RabbitMQ queue trigger function processed message: {myQueueItem}");

    log.Info($"EnqueuedTimeUtc={enqueuedTimeUtc}");
    log.Info($"DeliveryCount={deliveryCount}");
    log.Info($"MessageId={messageId}");
}
```

# [JavaScript](#tab/javascript)

The following example shows a RabbitMQ trigger binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding. The function reads [message metadata](#message-metadata) and logs a RabbitMQ message.

Here's the binding data in the *function.json* file:

```json
{
    "scriptFile": "index.js",
    "disabled": false,
    "dataType": "string",
    "bindings": [
        {
            "dataType": "string",
            "type": "rabbitMQTrigger",
            "connectionStringSetting": "rabbitMQConnection",
            "queueName": "queue",
            "name": "message"
        }
    ]
}
```

Here's the JavaScript script code:

```javascript
module.exports = async function(context, message) {
    context.log('Node.js RabbitMQ trigger function processed work item: ', message);
    context.done();
};
```

# [Python](#tab/python)

The following example demonstrates how to read a RabbitMQ queue message via a trigger.

A RabbitMQ binding is defined in *function.json* where *type* is set to `RabbitMQTrigger`.

```json
{
    "scriptFile": "__init__.py",
    "disabled": false,
    "dataType": "string",
    "bindings": [
        {
            "dataType": "string",
            "type": "rabbitMQTrigger",
            "connectionStringSetting": "rabbitMQConnection",
            "queueName": "queue",
            "name": "message"
        }
    ]
}
```

The code in *_\_init_\_.py* declares a parameter as `func.RabbitMQMessage`, which allows you to read the message in your function.

```python
import azure.functions as func

import logging

def main(message):
    logging.info("Receive message from output function: %s", message)
```

# [Java](#tab/java)

The following Java function uses the `@RabbitMQTrigger` annotation from the [Java functions runtime library](/java/api/overview/azure/functions/runtime) to describe the configuration for a RabbitMQ queue trigger. The function grabs the message placed on the queue and adds it to the logs.

```java
@FunctionName("RabbitMQTriggerExample")
public void run(
            @RabbitMQTrigger(connectionStringSetting = "rabbitMQ", queueName = "TestQueue") String input,
            final ExecutionContext context) {
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

# [Python](#tab/python)

Attributes are not supported by Python.

# [Java](#tab/java)

The `RabbitMQTrigger` annotation allows you to create a function that runs when a RabbitMQ message is created. Configuration options available include queue name and connection string name.

See the trigger [example](#example) for more detail.

---

## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `RabbitMQTrigger` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type** | n/a | Must be set to "RabbitMQTrigger". This property is set automatically when you create the trigger in the Azure portal.|
|**direction** | n/a | Must be set to "in". This property is set automatically when you create the trigger in the Azure portal. |
|**name** | n/a | The name of the variable that represents the queue in function code. |
|**queueName**|**QueueName**|Name of the queue to receive messages from.  Set only if monitoring a queue, not for a topic.|
|**hostName**|**HostName**|(optional if using ConnectStringSetting) Hostname of the queue (Ex: 10.26.45.210)|
|**userNameSetting**|**UserNameSetting**|(optional if using ConnectionStringSetting) Name to access the queue |
|**passwordSetting**|**PasswordSetting**|(optional if using ConnectionStringSetting) Password to access the queue|
|**connectionStringSetting**|**ConnectionStringSetting**|The name of the app setting that contains the RabbitMQ message queue connection string. (Example: amqp://user:password@url:port)|
|**preFetchCount**|**PreFetchCount**| Gets the prefetch count while creating the RabbitMQ QoS. This setting controls how many values are cached.|

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Usage

# [C#](#tab/csharp)

The following parameter types are available for the message:

* [RabbitMQ event arguments](https://www.rabbitmq.com/releases/rabbitmq-dotnet-client/v3.2.2/rabbitmq-dotnet-client-3.2.2-client-htmldoc/html/type-RabbitMQ.Client.Events.BasicDeliverEventArgs.html) - the default format for RabbitMQ messages.
* `string` - If the message is text.
* `JSON object` - If the message is delivered as a valid JSON string
* `C# POCO` - If the message is properly formatted as a C# object

# [C# Script](#tab/csharp-script)

The following parameter types are available for the queue or topic message:

* `string` - If the message is text.
* `byte[]` - Useful for binary data.
* A custom type - If the message contains JSON, Azure Functions tries to deserialize the JSON data.
* `BrokeredMessage` - Gives you the deserialized message with the [BrokeredMessage.GetBody\<T>()](/dotnet/api/microsoft.RabbitMQ.messaging.brokeredmessage.getbody?view=azure-dotnet#Microsoft_RabbitMQ_Messaging_BrokeredMessage_GetBody__1)
  method.

These parameters are for Azure Functions version 1.x; for 2.x and higher, use [`Message`](/dotnet/api/microsoft.azure.RabbitMQ.message) instead of `BrokeredMessage`.

# [JavaScript](#tab/javascript)

Access the queue or topic message by using `context.bindings.<name from function.json>`. The RabbitMQ message is passed into the function as either a string or JSON object.

# [Python](#tab/python)

The message is available to the function via a parameter typed as `func.RabbitMQMessage`. The RabbitMQ message is passed into the function as either a string or JSON object.

# [Java](#tab/java)

The incoming RabbitMQ message is available via a `RabbitMQQueueMessage` or `RabbitMQTopicMessage` parameter.

[See the example for details](#example).

---

## Configuring a Dead Letter Exchange and Queue
Dead Letter queue creation is not supported by the RabbitMQ extensions. Please refer to RabbitMQ's documentation on [Dead Letter Exchanges](https://www.rabbitmq.com/dlx.html).

## Message metadata

The RabbitMQ trigger provides several [metadata properties](./functions-bindings-expressions-patterns.md#trigger-metadata). These properties can be used as part of binding expressions in other bindings or as parameters in your code. These properties are members of the BasicDeliverEventArgsBasicDeliverEventArgs class. Please refer to the [RabbitMQ documentation](https://www.rabbitmq.com/releases/rabbitmq-dotnet-client/v3.2.2/rabbitmq-dotnet-client-3.2.2-client-htmldoc/html/type-RabbitMQ.Client.Events.BasicDeliverEventArgs.html) for full details on the properties.

See [code examples](#example) that use these properties earlier in this article.

## RabbitMQ Dashboard
If you would like to monitor your queues and exchanges for a certain RabbitMQ endpoint, first enable the [RabbitMQ management plugin](https://www.rabbitmq.com/management.html). Then, point your browser to the address of format http://{node-hostname}:15672 and log in with your user name and password.

## Next steps

- [Send RabbitMQ messages from Azure Functions (Output binding)](./functions-bindings-service-bus-output.md)
