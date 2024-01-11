---
title: RabbitMQ trigger for Azure Functions
description: Learn how to run an Azure Function when a RabbitMQ message is created.
author: cachai2
ms.assetid:
ms.topic: reference
ms.date: 01/21/2022
ms.author: cachai
ms.devlang: csharp, java, javascript, python
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# RabbitMQ trigger for Azure Functions overview

> [!NOTE]
> The RabbitMQ bindings are only fully supported on **Premium and Dedicated** plans. Consumption is not supported.

Use the RabbitMQ trigger to respond to messages from a RabbitMQ queue.

For information on setup and configuration details, see the [overview](functions-bindings-rabbitmq.md).

## Example

::: zone pivot="programming-language-csharp"

[!INCLUDE [functions-bindings-csharp-intro-with-csx](../../includes/functions-bindings-csharp-intro-with-csx.md)]

# [Isolated worker model](#tab/isolated-process)

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/RabbitMQ/RabbitMQFunction.cs" range="12-23" :::

# [In-process model](#tab/in-process)

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

Like with Json objects, an error will occur if the message isn't properly formatted as a C# object. If it is, it's then bound to the variable pocObj, which can be used for what whatever it's needed for.

---

::: zone-end
::: zone pivot="programming-language-java"

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
::: zone-end  
::: zone pivot="programming-language-javascript"  

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

::: zone-end  
::: zone pivot="programming-language-python"  

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

::: zone-end  
::: zone pivot="programming-language-powershell"
::: zone-end  
::: zone pivot="programming-language-csharp"

## Attributes

Both [in-process](functions-dotnet-class-library.md) and [isolated worker process](dotnet-isolated-process-guide.md) C# libraries use the <!--attribute API here--> attribute to define the function. C# script instead uses a [function.json configuration file](#configuration).

The attribute's constructor takes the following parameters:

|Parameter | Description|
|---------|----------------------|
|**QueueName**| Name of the queue from which to receive messages. |
|**HostName**|Hostname of the queue, such as 10.26.45.210. Ignored when using `ConnectStringSetting`.|
|**UserNameSetting**|Name of the app setting that contains the username to access the queue, such as `UserNameSetting: "%< UserNameFromSettings >%"`. Ignored when using `ConnectStringSetting`.|
|**PasswordSetting**|Name of the app setting that contains the password to access the queue, such as `PasswordSetting: "%< PasswordFromSettings >%"`. Ignored when using `ConnectStringSetting`.|
|**ConnectionStringSetting**|The name of the app setting that contains the RabbitMQ message queue connection string. The trigger won't work when you specify the connection string directly instead through an app setting. For example, when you have set `ConnectionStringSetting: "rabbitMQConnection"`, then in both the *local.settings.json* and in your function app you need a setting like `"RabbitMQConnection" : "< ActualConnectionstring >"`.|
|**Port**|Gets or sets the port used. Defaults to 0, which points to the RabbitMQ client's default port setting of `5672`. |

# [Isolated worker model](#tab/isolated-process)

In [C# class libraries](functions-dotnet-class-library.md), use the [RabbitMQTrigger](https://github.com/Azure/azure-functions-rabbitmq-extension/blob/dev/extension/WebJobs.Extensions.RabbitMQ/Trigger/RabbitMQTriggerAttribute.cs) attribute.

Here's a `RabbitMQTrigger` attribute in a method signature for an isolated worker process library:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/RabbitMQ/RabbitMQFunction.cs" range="12-16":::

# [In-process model](#tab/in-process)

In [C# class libraries](functions-dotnet-class-library.md), use the [RabbitMQTrigger](https://github.com/Azure/azure-functions-rabbitmq-extension/blob/dev/extension/WebJobs.Extensions.RabbitMQ/Trigger/RabbitMQTriggerAttribute.cs) attribute.

Here's a `RabbitMQTrigger` attribute in a method signature for an in-process library:

```csharp
[FunctionName("RabbitMQTest")]
public static void RabbitMQTest([RabbitMQTrigger("queue")] string message, ILogger log)
{
    ...
}
```

---

::: zone-end  
::: zone pivot="programming-language-java"  

## Annotations

The `RabbitMQTrigger` annotation allows you to create a function that runs when a RabbitMQ message is created. 

The annotation supports the following configuration options:

|Parameter | Description|
|---------|----------------------|
|**queueName**| Name of the queue from which to receive messages. |
|**hostName**|Hostname of the queue, such as 10.26.45.210. Ignored when using `ConnectStringSetting`.|
|**userNameSetting**|Name of the app setting that contains the username to access the queue, such as `UserNameSetting: "%< UserNameFromSettings >%"`. Ignored when using `ConnectStringSetting`.|
|**passwordSetting**|Name of the app setting that contains the password to access the queue, such as `PasswordSetting: "%< PasswordFromSettings >%"`. Ignored when using `ConnectStringSetting`.|
|**connectionStringSetting**|The name of the app setting that contains the RabbitMQ message queue connection string. The trigger won't work when you specify the connection string directly instead through an app setting. For example, when you have set `ConnectionStringSetting: "rabbitMQConnection"`, then in both the *local.settings.json* and in your function app you need a setting like `"RabbitMQConnection" : "< ActualConnectionstring >"`.|
|**port**|Gets or sets the port used. Defaults to 0, which points to the RabbitMQ client's default port setting of `5672`. |

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-powershell"  

## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file.

|function.json property | Description|
|---------|----------------------|
|**type** |  Must be set to `RabbitMQTrigger`.|
|**direction** | Must be set to `in`.|
|**name** | The name of the variable that represents the queue in function code. |
|**queueName**| Name of the queue from which to receive messages. |
|**hostName**|Hostname of the queue, such as 10.26.45.210. Ignored when using `connectStringSetting`.|
|**userNameSetting**|Name of the app setting that contains the username to access the queue, such as `UserNameSetting: "%< UserNameFromSettings >%"`. Ignored when using `connectStringSetting`.|
|**passwordSetting**|Name of the app setting that contains the password to access the queue, such as `PasswordSetting: "%< PasswordFromSettings >%"`. Ignored when using `connectStringSetting`.|
|**connectionStringSetting**|The name of the app setting that contains the RabbitMQ message queue connection string. The trigger won't work when you specify the connection string directly instead through an app setting. For example, when you have set `connectionStringSetting: "rabbitMQConnection"`, then in both the *local.settings.json* and in your function app you need a setting like `"rabbitMQConnection" : "< ActualConnectionstring >"`.|
|**port**|Gets or sets the port used. Defaults to 0, which points to the RabbitMQ client's default port setting of `5672`. |

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

::: zone-end  

See the [Example section](#example) for complete examples.

## Usage

::: zone pivot="programming-language-csharp"  
The parameter type supported by the RabbitMQ trigger depends on the C# modality used.

# [Isolated worker model](#tab/isolated-process)

The RabbitMQ bindings currently support only string and serializable object types when running in an isolated process.

# [In-process model](#tab/in-process)

The default message type is [RabbitMQ Event](https://rabbitmq.github.io/rabbitmq-dotnet-client/api/RabbitMQ.Client.Events.BasicDeliverEventArgs.html), and the `Body` property of the RabbitMQ Event can be read as the types listed below:

* `An object serializable as JSON` - The message is delivered as a valid JSON string.
* `string`
* `byte[]`
* `POCO` - The message is formatted as a C# object. For complete code, see C# [example](#example).

---

For a complete example, see C# [example](#example).

::: zone-end  
::: zone pivot="programming-language-java"

Refer to Java [annotations](#annotations).

::: zone-end  
::: zone pivot="programming-language-javascript"  

The queue message is available via `context.bindings.<NAME>` where `<NAME>` matches the name defined in function.json. If the payload is JSON, the value is deserialized into an object.

::: zone-end   
::: zone pivot="programming-language-powershell"
::: zone-end  
::: zone pivot="programming-language-python"  

Refer to the Python [example](#example).

::: zone-end  

## Dead letter queues
Dead letter queues and exchanges can't be controlled or configured from the RabbitMQ trigger.  To use dead letter queues, pre-configure the queue used by the trigger in RabbitMQ. Refer to the [RabbitMQ documentation](https://www.rabbitmq.com/dlx.html).

## host.json settings

[!INCLUDE [functions-host-json-section-intro](../../includes/functions-host-json-section-intro.md)]

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
|connectionString|n/a|The RabbitMQ message queue connection string. The connection string is directly specified here and not through an app setting.|
|port|0|(ignored if using connectionString) Gets or sets the Port used. Defaults to 0, which points to rabbitmq client's default port setting: 5672.|

## Local testing

> [!NOTE]
> The connectionString takes precedence over "hostName", "userName", and "password". If these are all set, the connectionString will override the other two.

If you're testing locally without a connection string, you should set the "hostName" setting and "userName" and "password" if applicable in the "rabbitMQ" section of *host.json*:

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
