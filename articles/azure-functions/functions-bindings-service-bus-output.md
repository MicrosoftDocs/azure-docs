---
title: Azure Service Bus output bindings for Azure Functions
description: Learn to send Azure Service Bus messages from Azure Functions.
author: craigshoemaker

ms.assetid: daedacf0-6546-4355-a65c-50873e74f66b
ms.topic: reference
ms.date: 02/19/2020
ms.author: cshoe
ms.custom: tracking-python

---
# Azure Service Bus output binding for Azure Functions

Use Azure Service Bus output binding to send queue or topic messages.

For information on setup and configuration details, see the [overview](functions-bindings-service-bus-output.md).

## Example

# [C#](#tab/csharp)

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

# [JavaScript](#tab/javascript)

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
module.exports = function (context, myTimer) {
    var message = 'Service Bus queue message created at ' + timeStamp;
    context.log(message);   
    context.bindings.outputSbQueue = message;
    context.done();
};
```

Here's JavaScript script code that creates multiple messages:

```javascript
module.exports = function (context, myTimer) {
    var message = 'Service Bus queue message created at ' + timeStamp;
    context.log(message);   
    context.bindings.outputSbQueue = [];
    context.bindings.outputSbQueue.push("1 " + message);
    context.bindings.outputSbQueue.push("2 " + message);
    context.done();
};
```

# [Python](#tab/python)

The following example demonstrates how to write out to a Service Bus queue in Python.

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

# [Java](#tab/java)

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

 In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `@QueueOutput` annotation on function parameters whose value would be written to a Service Bus queue.  The parameter type should be `OutputBinding<T>`, where T is any native Java type of a POJO.

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

---

## Attributes and annotations

# [C#](#tab/csharp)

In [C# class libraries](functions-dotnet-class-library.md), use the [ServiceBusAttribute](https://github.com/Azure/azure-functions-servicebus-extension/blob/master/src/Microsoft.Azure.WebJobs.Extensions.ServiceBus/ServiceBusAttribute.cs).

The attribute's constructor takes the name of the queue or the topic and subscription. You can also specify the connection's access rights. How to choose the access rights setting is explained in the [Output - configuration](#configuration) section. Here's an example that shows the attribute applied to the return value of the function:

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

For a complete example, see [Output - example](#example).

You can use the `ServiceBusAccount` attribute to specify the Service Bus account to use at class, method, or parameter level.  For more information, see [Trigger - attributes](functions-bindings-service-bus-trigger.md#attributes-and-annotations).

# [C# Script](#tab/csharp-script)

Attributes are not supported by C# Script.

# [JavaScript](#tab/javascript)

Attributes are not supported by JavaScript.

# [Python](#tab/python)

Attributes are not supported by Python.

# [Java](#tab/java)

The `ServiceBusQueueOutput` and `ServiceBusTopicOutput` annotations are available to write a message as a function output. The parameter decorated with these annotations must be declared as an `OutputBinding<T>` where `T` is the type corresponding to the message's type.

---

## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `ServiceBus` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type** | n/a | Must be set to "serviceBus". This property is set automatically when you create the trigger in the Azure portal.|
|**direction** | n/a | Must be set to "out". This property is set automatically when you create the trigger in the Azure portal. |
|**name** | n/a | The name of the variable that represents the queue or topic message in function code. Set to "$return" to reference the function return value. |
|**queueName**|**QueueName**|Name of the queue.  Set only if sending queue messages, not for a topic.
|**topicName**|**TopicName**|Name of the topic. Set only if sending topic messages, not for a queue.|
|**connection**|**Connection**|The name of an app setting that contains the Service Bus connection string to use for this binding. If the app setting name begins with "AzureWebJobs", you can specify only the remainder of the name. For example, if you set `connection` to "MyServiceBus", the Functions runtime looks for an app setting that is named "AzureWebJobsMyServiceBus". If you leave `connection` empty, the Functions runtime uses the default Service Bus connection string in the app setting that is named "AzureWebJobsServiceBus".<br><br>To obtain a connection string, follow the steps shown at [Get the management credentials](../service-bus-messaging/service-bus-quickstart-portal.md#get-the-connection-string). The connection string must be for a Service Bus namespace, not limited to a specific queue or topic.|
|**accessRights** (v1 only)|**Access**|Access rights for the connection string. Available values are `manage` and `listen`. The default is `manage`, which indicates that the `connection` has the **Manage** permission. If you use a connection string that does not have the **Manage** permission, set `accessRights` to "listen". Otherwise, the Functions runtime might fail trying to do operations that require manage rights. In Azure Functions version 2.x and higher, this property is not available because the latest version of the Service Bus SDK doesn't support manage operations.|

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Usage

In Azure Functions 1.x, the runtime creates the queue if it doesn't exist and you have set `accessRights` to `manage`. In Functions version 2.x and higher, the queue or topic must already exist; if you specify a queue or topic that doesn't exist, the function will fail. 

# [C#](#tab/csharp)

Use the following parameter types for the output binding:

* `out T paramName` - `T` can be any JSON-serializable type. If the parameter value is null when the function exits, Functions creates the message with a null object.
* `out string` - If the parameter value is null when the function exits, Functions does not create a message.
* `out byte[]` - If the parameter value is null when the function exits, Functions does not create a message.
* `out BrokeredMessage` - If the parameter value is null when the function exits, Functions does not create a message (for Functions 1.x)
* `out Message` - If the parameter value is null when the function exits, Functions does not create a message (for Functions 2.x and higher)
* `ICollector<T>` or `IAsyncCollector<T>` (for async methods) - For creating multiple messages. A message is created when you call the `Add` method.

When working with C# functions:

* Async functions need a return value or `IAsyncCollector` instead of an `out` parameter.

* To access the session ID, bind to a [`Message`](https://docs.microsoft.com/dotnet/api/microsoft.azure.servicebus.message) type and use the `sessionId` property.

# [C# Script](#tab/csharp-script)

Use the following parameter types for the output binding:

* `out T paramName` - `T` can be any JSON-serializable type. If the parameter value is null when the function exits, Functions creates the message with a null object.
* `out string` - If the parameter value is null when the function exits, Functions does not create a message.
* `out byte[]` - If the parameter value is null when the function exits, Functions does not create a message.
* `out BrokeredMessage` - If the parameter value is null when the function exits, Functions does not create a message (for Functions 1.x)
* `out Message` - If the parameter value is null when the function exits, Functions does not create a message (for Functions 2.x and higher)
* `ICollector<T>` or `IAsyncCollector<T>` - For creating multiple messages. A message is created when you call the `Add` method.

When working with C# functions:

* Async functions need a return value or `IAsyncCollector` instead of an `out` parameter.

* To access the session ID, bind to a [`Message`](https://docs.microsoft.com/dotnet/api/microsoft.azure.servicebus.message) type and use the `sessionId` property.

# [JavaScript](#tab/javascript)

Access the queue or topic by using `context.bindings.<name from function.json>`. You can assign a string, a byte array, or a JavaScript object (deserialized into JSON) to `context.binding.<name>`.

# [Python](#tab/python)

Use the [Azure Service Bus SDK](https://docs.microsoft.com/azure/service-bus-messaging) rather than the built-in output binding.

# [Java](#tab/java)

Use the [Azure Service Bus SDK](https://docs.microsoft.com/azure/service-bus-messaging) rather than the built-in output binding.

---

## Exceptions and return codes

| Binding | Reference |
|---|---|
| Service Bus | [Service Bus Error Codes](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-messaging-exceptions) |
| Service Bus | [Service Bus Limits](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-quotas) |

<a name="host-json"></a>  

## host.json settings

This section describes the global configuration settings available for this binding in versions 2.x and higher. The example host.json file below contains only the settings for this binding. For more information about global configuration settings, see [host.json reference for Azure Functions version](functions-host-json.md).

> [!NOTE]
> For a reference of host.json in Functions 1.x, see [host.json reference for Azure Functions 1.x](functions-host-json-v1.md).

```json
{
    "version": "2.0",
    "extensions": {
        "serviceBus": {
            "prefetchCount": 100,
            "messageHandlerOptions": {
                "autoComplete": true,
                "maxConcurrentCalls": 32,
                "maxAutoRenewDuration": "00:05:00"
            },
            "sessionHandlerOptions": {
                "autoComplete": false,
                "messageWaitTimeout": "00:00:30",
                "maxAutoRenewDuration": "00:55:00",
                "maxConcurrentSessions": 16
            }
        }
    }
}
```

If you have `isSessionsEnabled` set to `true`, the `sessionHandlerOptions` will be honored.  If you have `isSessionsEnabled` set to `false`, the `messageHandlerOptions` will be honored.

|Property  |Default | Description |
|---------|---------|---------|
|prefetchCount|0|Gets or sets the number of messages that the message receiver can simultaneously request.|
|maxAutoRenewDuration|00:05:00|The maximum duration within which the message lock will be renewed automatically.|
|autoComplete|true|Whether the trigger should automatically call complete after processing, or if the function code will manually call complete.<br><br>Setting to `false` is only supported in C#.<br><br>If set to `true`, the trigger completes the message automatically if the function execution completes successfully, and abandons the message otherwise.<br><br>When set to `false`, you are responsible for calling [MessageReceiver](https://docs.microsoft.com/dotnet/api/microsoft.azure.servicebus.core.messagereceiver?view=azure-dotnet) methods to complete, abandon, or deadletter the message. If an exception is thrown (and none of the `MessageReceiver` methods are called), then the lock remains. Once the lock expires, the message is re-queued with the `DeliveryCount` incremented and the lock is automatically renewed.<br><br>In non-C# functions, exceptions in the function results in the runtime calls `abandonAsync` in the background. If no exception occurs, then `completeAsync` is called in the background. |
|maxConcurrentCalls|16|The maximum number of concurrent calls to the callback that the message pump should initiate per scaled instance. By default, the Functions runtime processes multiple messages concurrently.|
|maxConcurrentSessions|2000|The maximum number of sessions that can be handled concurrently per scaled instance.|

## Next steps

- [Run a function when a Service Bus queue or topic message is created (Trigger)](./functions-bindings-service-bus-trigger.md)
