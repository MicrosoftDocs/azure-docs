---
title: Azure Service Bus output bindings for Azure Functions
description: Learn to send Azure Service Bus messages from Azure Functions.
ms.assetid: daedacf0-6546-4355-a65c-50873e74f66b
ms.topic: reference
ms.date: 03/06/2023
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: devx-track-csharp, devx-track-python, ignite-2022
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Azure Service Bus output binding for Azure Functions

Use Azure Service Bus output binding to send queue or topic messages.

For information on setup and configuration details, see the [overview](functions-bindings-service-bus.md).

::: zone pivot="programming-language-python"
Azure Functions supports two programming models for Python. The way that you define your bindings depends on your chosen programming model.

# [v2](#tab/python-v2)
The Python v2 programming model lets you define bindings using decorators directly in your Python function code. For more information, see the [Python developer guide](functions-reference-python.md?pivots=python-mode-decorators#programming-model).

# [v1](#tab/python-v1)
The Python v1 programming model requires you to define bindings in a separate *function.json* file in the function folder. For more information, see the [Python developer guide](functions-reference-python.md?pivots=python-mode-configuration#programming-model).

---

This article supports both programming models.

> [!IMPORTANT]
> The Python v2 programming model is currently in preview.
::: zone-end

## Example

::: zone pivot="programming-language-csharp"

[!INCLUDE [functions-bindings-csharp-intro](../../includes/functions-bindings-csharp-intro.md)]

# [In-process](#tab/in-process)

The following example shows a [C# function](functions-dotnet-class-library.md) that sends a Service Bus queue message:

```cs
[FunctionName("ServiceBusOutput")]
[return: ServiceBus("myqueue", Connection = "ServiceBusConnection")]
public static string ServiceBusOutput([HttpTrigger] dynamic input, ILogger log)
{
    log.LogInformation($"C# function processed: {input.Text}");
    return input.Text;
}
```
# [Isolated process](#tab/isolated-process)

The following example shows a [C# function](dotnet-isolated-process-guide.md) that receives a Service Bus queue message, logs the message, and sends a message to different Service Bus queue:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/ServiceBus/ServiceBusFunction.cs" range="10-25":::

# [C# Script](#tab/csharp-script)

The following example shows a Service Bus output binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding. The function uses a timer trigger to send a queue message every 15 seconds.

Here's the binding data in the *function.json* file:

```json
{
    "bindings": [
        {
            "schedule": "0/15 * * * * *",
            "name": "myTimer",
            "runsOnStartup": true,
            "type": "timerTrigger",
            "direction": "in"
        },
        {
            "name": "outputSbQueue",
            "type": "serviceBus",
            "queueName": "testqueue",
            "connection": "MyServiceBusConnection",
            "direction": "out"
        }
    ],
    "disabled": false
}
```

Here's C# script code that creates a single message:

```cs
public static void Run(TimerInfo myTimer, ILogger log, out string outputSbQueue)
{
    string message = $"Service Bus queue message created at: {DateTime.Now}";
    log.LogInformation(message); 
    outputSbQueue = message;
}
```

Here's C# script code that creates multiple messages:

```cs
public static async Task Run(TimerInfo myTimer, ILogger log, IAsyncCollector<string> outputSbQueue)
{
    string message = $"Service Bus queue messages created at: {DateTime.Now}";
    log.LogInformation(message); 
    await outputSbQueue.AddAsync("1 " + message);
    await outputSbQueue.AddAsync("2 " + message);
}
```
---

::: zone-end
::: zone pivot="programming-language-java"

The following example shows a Java function that sends a message to a Service Bus queue `myqueue` when triggered by an HTTP request.

```java
@FunctionName("httpToServiceBusQueue")
@ServiceBusQueueOutput(name = "message", queueName = "myqueue", connection = "AzureServiceBusConnection")
public String pushToQueue(
  @HttpTrigger(name = "request", methods = {HttpMethod.POST}, authLevel = AuthorizationLevel.ANONYMOUS)
  final String message,
  @HttpOutput(name = "response") final OutputBinding<T> result ) {
      result.setValue(message + " has been sent.");
      return message;
 }
```

 In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `@QueueOutput` annotation on function parameters whose value would be written to a Service Bus queue.  The parameter type should be `OutputBinding<T>`, where `T` is any native Java type of a POJO.

Java functions can also write to a Service Bus topic. The following example uses the `@ServiceBusTopicOutput` annotation to describe the configuration for the output binding. 

```java
@FunctionName("sbtopicsend")
    public HttpResponseMessage run(
            @HttpTrigger(name = "req", methods = {HttpMethod.GET, HttpMethod.POST}, authLevel = AuthorizationLevel.ANONYMOUS) HttpRequestMessage<Optional<String>> request,
            @ServiceBusTopicOutput(name = "message", topicName = "mytopicname", subscriptionName = "mysubscription", connection = "ServiceBusConnection") OutputBinding<String> message,
            final ExecutionContext context) {
        
        String name = request.getBody().orElse("Azure Functions");

        message.setValue(name);
        return request.createResponseBuilder(HttpStatus.OK).body("Hello, " + name).build();
        
    }
```

::: zone-end  
::: zone pivot="programming-language-javascript"  

The following example shows a Service Bus output binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding. The function uses a timer trigger to send a queue message every 15 seconds.

Here's the binding data in the *function.json* file:

```json
{
    "bindings": [
        {
            "schedule": "0/15 * * * * *",
            "name": "myTimer",
            "runsOnStartup": true,
            "type": "timerTrigger",
            "direction": "in"
        },
        {
            "name": "outputSbQueue",
            "type": "serviceBus",
            "queueName": "testqueue",
            "connection": "MyServiceBusConnection",
            "direction": "out"
        }
    ],
    "disabled": false
}
```

Here's JavaScript script code that creates a single message:

```javascript
module.exports = async function (context, myTimer) {
    var message = 'Service Bus queue message created at ' + timeStamp;
    context.log(message);   
    context.bindings.outputSbQueue = message;
};
```

Here's JavaScript script code that creates multiple messages:

```javascript
module.exports = async function (context, myTimer) {
    var message = 'Service Bus queue message created at ' + timeStamp;
    context.log(message);   
    context.bindings.outputSbQueue = [];
    context.bindings.outputSbQueue.push("1 " + message);
    context.bindings.outputSbQueue.push("2 " + message);
};
```

::: zone-end  
::: zone pivot="programming-language-powershell"  

The following example shows a Service Bus output binding in a *function.json* file and a [PowerShell function](functions-reference-powershell.md) that uses the binding. 

Here's the binding data in the *function.json* file:

```json
{
  "bindings": [
    {
      "type": "serviceBus",
      "direction": "out",
      "connection": "AzureServiceBusConnectionString",
      "name": "outputSbMsg",
      "queueName": "outqueue",
      "topicName": "outtopic"
    }
  ]
}
```

Here's the PowerShell that creates a message as the function's output.

```powershell
param($QueueItem, $TriggerMetadata) 

Push-OutputBinding -Name outputSbMsg -Value @{ 
    name = $QueueItem.name 
    employeeId = $QueueItem.employeeId 
    address = $QueueItem.address 
} 
```

::: zone-end  
::: zone pivot="programming-language-python"  

The following example demonstrates how to write out to a Service Bus queue in Python. The example depends on whether you use the [v1 or v2 Python programming model](functions-reference-python.md).

# [v2](#tab/python-v2)

```python
import logging
import azure.functions as func

app = func.FunctionApp()

@app.route(route="put_message")
@app.service_bus_topic_output(arg_name="message",
                              connection="<CONNECTION_SETTING>",
                              topic_name="<TOPIC_NAME>")
def main(req: func.HttpRequest, message: func.Out[str]) -> func.HttpResponse:
    input_msg = req.params.get('message')
    message.set(input_msg)
    return 'OK'
```

# [v1](#tab/python-v1)

A Service Bus binding definition is defined in *function.json* where *type* is set to `serviceBus`.

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
    },
    {
      "type": "serviceBus",
      "direction": "out",
      "connection": "AzureServiceBusConnectionString",
      "name": "msg",
      "queueName": "outqueue"
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

---

::: zone-end  
::: zone pivot="programming-language-csharp"
## Attributes

Both [in-process](functions-dotnet-class-library.md) and [isolated worker process](dotnet-isolated-process-guide.md) C# libraries use attributes to define the output binding. C# script instead uses a function.json configuration file.

# [In-process](#tab/in-process)

In [C# class libraries](functions-dotnet-class-library.md), use the [ServiceBusAttribute](https://github.com/Azure/azure-functions-servicebus-extension/blob/master/src/Microsoft.Azure.WebJobs.Extensions.ServiceBus/ServiceBusAttribute.cs).

The following table explains the properties you can set using the attribute:

| Property |Description|
| --- | --- |
|**QueueName**|Name of the queue.  Set only if sending queue messages, not for a topic. |
|**TopicName**|Name of the topic. Set only if sending topic messages, not for a queue.|
|**Connection**|The name of an app setting or setting collection that specifies how to connect to Service Bus. See [Connections](#connections).|
|**Access**|Access rights for the connection string. Available values are `manage` and `listen`. The default is `manage`, which indicates that the `connection` has the **Manage** permission. If you use a connection string that does not have the **Manage** permission, set `accessRights` to "listen". Otherwise, the Functions runtime might fail trying to do operations that require manage rights. In Azure Functions version 2.x and higher, this property is not available because the latest version of the Service Bus SDK doesn't support manage operations.|

Here's an example that shows the attribute applied to the return value of the function:

```csharp
[FunctionName("ServiceBusOutput")]
[return: ServiceBus("myqueue")]
public static string Run([HttpTrigger] dynamic input, ILogger log)
{
    ...
}
```

You can set the `Connection` property to specify the name of an app setting that contains the Service Bus connection string to use, as shown in the following example:

```csharp
[FunctionName("ServiceBusOutput")]
[return: ServiceBus("myqueue", Connection = "ServiceBusConnection")]
public static string Run([HttpTrigger] dynamic input, ILogger log)
{
    ...
}
```

For a complete example, see [Example](#example).

You can use the `ServiceBusAccount` attribute to specify the Service Bus account to use at class, method, or parameter level.  For more information, see [Attributes](functions-bindings-service-bus-trigger.md#attributes) in the trigger reference.

# [Isolated process](#tab/isolated-process)

In [C# class libraries](dotnet-isolated-process-guide.md), use the [ServiceBusOutputAttribute](https://github.com/Azure/azure-functions-dotnet-worker/blob/main/extensions/Worker.Extensions.ServiceBus/src/ServiceBusOutputAttribute.cs) to define the queue or topic written to by the output.

The following table explains the properties you can set using the attribute:

| Property |Description|
| --- | --- |
|**EntityType**|Sets the entity type as either `Queue` for sending messages to a queue or `Topic` when sending messages to a topic. |
|**QueueOrTopicName**|Name of the topic or queue to send messages to. Use `EntityType` to set the destination type.|
|**Connection**|The name of an app setting or setting collection that specifies how to connect to Service Bus. See [Connections](#connections).|

# [C# script](#tab/csharp-script)

C# script uses a *function.json* file for configuration instead of attributes. The following table explains the binding configuration properties that you set in the *function.json* file.

|function.json property | Description|
|---------|---------|----------------------|
|**type** |Must be set to "serviceBus". This property is set automatically when you create the trigger in the Azure portal.|
|**direction**  | Must be set to "out". This property is set automatically when you create the trigger in the Azure portal. |
|**name**  | The name of the variable that represents the queue or topic message in function code. Set to "$return" to reference the function return value. |
|**queueName**|Name of the queue.  Set only if sending queue messages, not for a topic.
|**topicName**|Name of the topic. Set only if sending topic messages, not for a queue.|
|**connection**|The name of an app setting or setting collection that specifies how to connect to Service Bus. See [Connections](#connections).|
|**accessRights** (v1 only)|Access rights for the connection string. Available values are `manage` and `listen`. The default is `manage`, which indicates that the `connection` has the **Manage** permission. If you use a connection string that does not have the **Manage** permission, set `accessRights` to "listen". Otherwise, the Functions runtime might fail trying to do operations that require manage rights. In Azure Functions version 2.x and higher, this property is not available because the latest version of the Service Bus SDK doesn't support manage operations.|

---

::: zone-end  

::: zone pivot="programming-language-python"
## Decorators

_Applies only to the Python v2 programming model._

For Python v2 functions defined using a decorator, the following properties on the `service_bus_topic_output`:

| Property    | Description |
|-------------|-----------------------------|
| `arg_name` | The name of the variable that represents the queue or topic message in function code. |
| `queue_name` | Name of the queue.  Set only if sending queue messages, not for a topic. |
| `topic_name` | Name of the topic. Set only if sending topic messages, not for a queue. |
| `connection` | The name of an app setting or setting collection that specifies how to connect to Service Bus. See [Connections](#connections). |

For Python functions defined by using *function.json*, see the [Configuration](#configuration) section.
::: zone-end

::: zone pivot="programming-language-java"  
## Annotations

The `ServiceBusQueueOutput` and `ServiceBusTopicOutput` annotations are available to write a message as a function output. The parameter decorated with these annotations must be declared as an `OutputBinding<T>` where `T` is the type corresponding to the message's type.

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-python"  
## Configuration
::: zone-end

::: zone pivot="programming-language-python" 
_Applies only to the Python v1 programming model._

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-python"  

The following table explains the binding configuration properties that you set in the *function.json* file and the `ServiceBus` attribute.

|function.json property | Description|
|---------|---------|----------------------|
|**type** |Must be set to "serviceBus". This property is set automatically when you create the trigger in the Azure portal.|
|**direction**  | Must be set to "out". This property is set automatically when you create the trigger in the Azure portal. |
|**name**  | The name of the variable that represents the queue or topic message in function code. Set to "$return" to reference the function return value. |
|**queueName**|Name of the queue.  Set only if sending queue messages, not for a topic.
|**topicName**|Name of the topic. Set only if sending topic messages, not for a queue.|
|**connection**|The name of an app setting or setting collection that specifies how to connect to Service Bus. See [Connections](#connections).|
|**accessRights** (v1 only)|Access rights for the connection string. Available values are `manage` and `listen`. The default is `manage`, which indicates that the `connection` has the **Manage** permission. If you use a connection string that does not have the **Manage** permission, set `accessRights` to "listen". Otherwise, the Functions runtime might fail trying to do operations that require manage rights. In Azure Functions version 2.x and higher, this property is not available because the latest version of the Service Bus SDK doesn't support manage operations.|

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

::: zone-end  

See the [Example section](#example) for complete examples.

## Usage

::: zone pivot="programming-language-csharp"

The following output parameter types are supported by all C# modalities and extension versions:

| Type | Description |
| --- | --- |
| **[System.String](/dotnet/api/system.string)** | Use when the message to write is simple text. When the parameter value is null when the function exits, Functions doesn't create a message.|
| **byte[]** | Use for writing binary data messages. When the parameter value is null when the function exits, Functions doesn't create a message. |
| **Object** | When a message contains JSON, Functions serializes the object into a JSON message payload. When the parameter value is null when the function exits, Functions creates a message with a null object.|

Messaging-specific parameter types contain additional message metadata. The specific types supported by the Event Grid Output binding depend on the Functions runtime version, the extension package version, and the C# modality used.

# [Extension v5.x](#tab/extensionv5/in-process)

Use the [ServiceBusMessage](/dotnet/api/azure.messaging.servicebus.servicebusmessage) type when sending messages with metadata. Parameters are defined as `return` type attributes. Use an `ICollector<T>` or `IAsyncCollector<T>` to write multiple messages. A message is created when you call the `Add` method.

When the parameter value is null when the function exits, Functions doesn't create a message.

[!INCLUDE [functions-service-bus-account-attribute](../../includes/functions-service-bus-account-attribute.md)]

# [Functions 2.x and higher](#tab/functionsv2/in-process)

Use the [Message](/dotnet/api/microsoft.azure.servicebus.message) type when sending messages with metadata. Parameters are defined as `return` type attributes. Use an `ICollector<T>` or `IAsyncCollector<T>` to write multiple messages. A message is created when you call the `Add` method.

When the parameter value is null when the function exits, Functions doesn't create a message.

[!INCLUDE [functions-service-bus-account-attribute](../../includes/functions-service-bus-account-attribute.md)]

# [Functions 1.x](#tab/functionsv1/in-process)

Use the [BrokeredMessage](/dotnet/api/microsoft.servicebus.messaging.brokeredmessage) type when sending messages with metadata. Parameters are defined as `return` type attributes. When the parameter value is null when the function exits, Functions doesn't create a message.

[!INCLUDE [functions-service-bus-account-attribute](../../includes/functions-service-bus-account-attribute.md)]

# [Extension 5.x and higher](#tab/extensionv5/isolated-process)

Messaging-specific types are not yet supported. 

# [Functions 2.x and higher](#tab/functionsv2/isolated-process)

Messaging-specific types are not yet supported.

# [Functions 1.x](#tab/functionsv1/isolated-process)

Messaging-specific types are not yet supported.

# [Extension 5.x and higher](#tab/extensionv5/csharp-script)

Use the [ServiceBusMessage](/dotnet/api/azure.messaging.servicebus.servicebusmessage) type when sending messages with metadata. Parameters are defined as `out` parameters. Use an `ICollector<T>` or `IAsyncCollector<T>` to write multiple messages. A message is created when you call the `Add` method.

When the parameter value is null when the function exits, Functions doesn't create a message.

# [Functions 2.x and higher](#tab/functionsv2/csharp-script)

Use the [Message](/dotnet/api/microsoft.azure.servicebus.message) type when sending messages with metadata. Parameters are defined as `out` parameters. Use an `ICollector<T>` or `IAsyncCollector<T>` to write multiple messages. A message is created when you call the `Add` method.

When the parameter value is null when the function exits, Functions doesn't create a message.

# [Functions 1.x](#tab/functionsv1/csharp-script)

Use the [BrokeredMessage](/dotnet/api/microsoft.servicebus.messaging.brokeredmessage) type when sending messages with metadata. Parameters are defined as `out` parameters. Use an `ICollector<T>` or `IAsyncCollector<T>` to write multiple messages. A message is created when you call the `Add` method. 

When the parameter value is null when the function exits, Functions doesn't create a message.

---
::: zone-end  

In Azure Functions 1.x, the runtime creates the queue if it doesn't exist and you have set `accessRights` to `manage`. In Azure Functions version 2.x and higher, the queue or topic must already exist; if you specify a queue or topic that doesn't exist, the function fails. 

<!--Any of the below pivots can be combined if the usage info is identical.-->
::: zone pivot="programming-language-java"
Use the [Azure Service Bus SDK](../service-bus-messaging/index.yml) rather than the built-in output binding.
::: zone-end  
::: zone pivot="programming-language-javascript"  
Access the queue or topic by using `context.bindings.<name from function.json>`. You can assign a string, a byte array, or a JavaScript object (deserialized into JSON) to `context.binding.<name>`.
::: zone-end  
::: zone pivot="programming-language-powershell"  
Output to the Service Bus is available via the `Push-OutputBinding` cmdlet where you pass arguments that match the name designated by binding's name parameter in the *function.json* file.
::: zone-end   
::: zone pivot="programming-language-python"  
Use the [Azure Service Bus SDK](../service-bus-messaging/index.yml) rather than the built-in output binding.
::: zone-end  
For a complete example, see [the examples section](#example).

[!INCLUDE [functions-service-bus-connections](../../includes/functions-service-bus-connections.md)]

## Exceptions and return codes

| Binding | Reference |
|---|---|
| Service Bus | [Service Bus Error Codes](../service-bus-messaging/service-bus-messaging-exceptions.md) |
| Service Bus | [Service Bus Limits](../service-bus-messaging/service-bus-quotas.md) |

## Next steps

- [Run a function when a Service Bus queue or topic message is created (Trigger)](./functions-bindings-service-bus-trigger.md)
