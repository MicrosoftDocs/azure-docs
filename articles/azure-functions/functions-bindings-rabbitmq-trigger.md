---
title: RabbitMQ trigger for Azure Functions
description: Learn to run an Azure Function when a RabbitMQ message is created.
author: cachai2

ms.assetid:
ms.topic: reference
ms.date: 12/17/2020
ms.author: cachai
ms.custom:
---

# RabbitMQ trigger for Azure Functions overview

> [!NOTE]
> The RabbitMQ bindings are only fully supported on **Premium and Dedicated** plans. Consumption is not supported.

Use the RabbitMQ trigger to respond to messages from a RabbitMQ queue.

For information on setup and configuration details, see the [overview](functions-bindings-rabbitmq.md).

## Example

# [C#](#tab/csharp)

The following example shows a [C# function](functions-dotnet-class-library.md) that reads and logs the RabbitMQ message as a [RabbitMQ Event](https://rabbitmq.github.io/rabbitmq-dotnet-client/api/RabbitMQ.Client.Events.BasicDeliverEventArgs.html):

```cs
[FunctionName("RabbitMQTriggerCSharp")]
public static void RabbitMQTrigger_BasicDeliverEventArgs(
    [RabbitMQTrigger("queue", ConnectionStringSetting = "rabbitMQConnectionAppSetting")] BasicDeliverEventArgs args,
    ILogger logger
    )
{
    logger.LogInformation($"C# RabbitMQ queue trigger function processed message: {Encoding.UTF8.GetString(args.Body)}");
}
```

The following example shows how to read the message as a POCO.

```cs
namespace Company.Function
{
    public class TestClass
    {
        public string x { get; set; }
    }

    public class RabbitMQTriggerCSharp{
        [FunctionName("RabbitMQTriggerCSharp")]
        public static void RabbitMQTrigger_BasicDeliverEventArgs(
            [RabbitMQTrigger("queue", ConnectionStringSetting = "rabbitMQConnectionAppSetting")] TestClass pocObj,
            ILogger logger
            )
        {
            logger.LogInformation($"C# RabbitMQ queue trigger function processed message: {pocObj}");
        }
    }
}
```

Like with Json objects, an error will occur if the message isn't properly formatted as a C# object. If it is, it is then bound to the variable pocObj, which can be used for what whatever it is needed for.

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
            "connectionStringSetting": "rabbitMQConnectionAppSetting"
        }​​
    ]
}​​
```

Here's the C# script code:

```C#
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
            "connectionStringSetting": "rabbitMQConnectionAppSetting"
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
            "queueName": "queue",
            "connectionStringSetting": "rabbitMQConnectionAppSetting"
        }​​
    ]
}​​
```

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
    @RabbitMQTrigger(connectionStringSetting = "rabbitMQConnectionAppSetting", queueName = "queue") String input,
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

For a complete example, see C# [example](#example).

# [C# Script](#tab/csharp-script)

Attributes are not supported by C# Script.

# [JavaScript](#tab/javascript)

Attributes are not supported by JavaScript.

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
|**hostName**|**HostName**|(ignored if using ConnectStringSetting) <br>Hostname of the queue (Ex: 10.26.45.210)|
|**userNameSetting**|**UserNameSetting**|(ignored if using ConnectionStringSetting) <br>Name of the app setting that contains the username to access the queue. Ex. UserNameSetting: "%< UserNameFromSettings >%"|
|**passwordSetting**|**PasswordSetting**|(ignored if using ConnectionStringSetting) <br>Name of the app setting that contains the password to access the queue. Ex. PasswordSetting: "%< PasswordFromSettings >%"|
|**connectionStringSetting**|**ConnectionStringSetting**|The name of the app setting that contains the RabbitMQ message queue connection string. Please note that if you specify the connection string directly and not through an app setting in local.settings.json, the trigger will not work. (Ex: In *function.json*: connectionStringSetting: "rabbitMQConnection" <br> In *local.settings.json*: "rabbitMQConnection" : "< ActualConnectionstring >")|
|**port**|**Port**|(ignored if using ConnectionStringSetting) Gets or sets the Port used. Defaults to 0 which points to rabbitmq client's default port setting: 5672.|

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Usage

# [C#](#tab/csharp)

The default message type is [RabbitMQ Event](https://rabbitmq.github.io/rabbitmq-dotnet-client/api/RabbitMQ.Client.Events.BasicDeliverEventArgs.html), and the `Body` property of the RabbitMQ Event can be read as the types listed below:

* `An object serializable as JSON` - The message is delivered as a valid JSON string.
* `string`
* `byte[]`
* `POCO` - The message is formatted as a C# object. For a complete example, see C# [example](#example).

# [C# Script](#tab/csharp-script)

The default message type is [RabbitMQ Event](https://rabbitmq.github.io/rabbitmq-dotnet-client/api/RabbitMQ.Client.Events.BasicDeliverEventArgs.html), and the `Body` property of the RabbitMQ Event can be read as the types listed below:

* `An object serializable as JSON` - The message is delivered as a valid JSON string.
* `string`
* `byte[]`
* `POCO` - The message is formatted as a C# object. For a complete example, see C# Script [example](#example).

# [JavaScript](#tab/javascript)

The queue message is available via context.bindings.<NAME> where <NAME> matches the name defined in function.json. If the payload is JSON, the value is deserialized into an object.

# [Python](#tab/python)

Refer to the Python [example](#example).

# [Java](#tab/java)

Refer to Java [attributes and annotations](#attributes-and-annotations).

---

## Dead letter queues
Dead letter queues and exchanges can't be controlled or configured from the RabbitMQ trigger.  In order to use dead letter queues, pre-configure the queue used by the trigger in RabbitMQ. Please refer to the [RabbitMQ documentation](https://www.rabbitmq.com/dlx.html).

## host.json settings

This section describes the global configuration settings available for this binding in versions 2.x and higher. The example *host.json* file below contains only the settings for this binding. For more information about global configuration settings, see [host.json reference for Azure Functions version](functions-host-json.md).

```json
{
    "version": "2.0",
    "extensions": {
        "rabbitMQ": {
            "prefetchCount": 100,
            "queueName": "queue",
            "connectionString": "amqp://user:password@url:port",
            "port": 10
        }
    }
}
```

|Property  |Default | Description |
|---------|---------|---------|
|prefetchCount|30|Gets or sets the number of messages that the message receiver can simultaneously request and is cached.|
|queueName|n/a| Name of the queue to receive messages from.|
|connectionString|n/a|The RabbitMQ message queue connection string. Please note that the connection string is directly specified here and not through an app setting.|
|port|0|(ignored if using connectionString) Gets or sets the Port used. Defaults to 0 which points to rabbitmq client's default port setting: 5672.|

## Local testing

> [!NOTE]
> The connectionString takes precedence over "hostName", "userName", and "password". If these are all set, the connectionString will override the other two.

If you are testing locally without a connection string, you should set the "hostName" setting and "userName" and "password" if applicable in the "rabbitMQ" section of *host.json*:

```json
{
    "version": "2.0",
    "extensions": {
        "rabbitMQ": {
            ...
            "hostName": "localhost",
            "username": "userNameSetting",
            "password": "passwordSetting"
        }
    }
}
```

|Property  |Default | Description |
|---------|---------|---------|
|hostName|n/a|(ignored if using connectionString) <br>Hostname of the queue (Ex: 10.26.45.210)|
|userName|n/a|(ignored if using connectionString) <br>Name to access the queue |
|password|n/a|(ignored if using connectionString) <br>Password to access the queue|


## Enable Runtime Scaling

In order for the RabbitMQ trigger to scale out to multiple instances, the **Runtime Scale Monitoring** setting must be enabled. 

In the portal, this setting can be found under **Configuration** > **Function runtime settings** for your function app.

:::image type="content" source="media/functions-networking-options/virtual-network-trigger-toggle.png" alt-text="VNETToggle":::

In the CLI, you can enable **Runtime Scale Monitoring** by using the following command:

```azurecli-interactive
az resource update -g <resource_group> -n <function_app_name>/config/web --set properties.functionsRuntimeScaleMonitoringEnabled=1 --resource-type Microsoft.Web/sites
```

## Monitoring RabbitMQ endpoint
To monitor your queues and exchanges for a certain RabbitMQ endpoint:

* Enable the [RabbitMQ management plugin](https://www.rabbitmq.com/management.html)
* Browse to http://{node-hostname}:15672 and log in with your user name and password.

## Next steps

- [Send RabbitMQ messages from Azure Functions (Output binding)](./functions-bindings-rabbitmq-output.md)
