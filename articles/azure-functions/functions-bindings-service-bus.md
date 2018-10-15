---
title: Azure Service Bus bindings for Azure Functions
description: Understand how to use Azure Service Bus triggers and bindings in Azure Functions.
services: functions
documentationcenter: na
author: ggailey777
manager: jeconnoc
keywords: azure functions, functions, event processing, dynamic compute, serverless architecture

ms.assetid: daedacf0-6546-4355-a65c-50873e74f66b
ms.service: azure-functions
ms.devlang: multiple
ms.topic: reference
ms.date: 04/01/2017
ms.author: glenga

---
# Azure Service Bus bindings for Azure Functions

This article explains how to work with Azure Service Bus bindings in Azure Functions. Azure Functions supports trigger and output bindings for Service Bus queues and topics.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

## Packages - Functions 1.x

The Service Bus bindings are provided in the [Microsoft.Azure.WebJobs.ServiceBus](http://www.nuget.org/packages/Microsoft.Azure.WebJobs.ServiceBus) NuGet package, version 2.x. 

[!INCLUDE [functions-package](../../includes/functions-package.md)]

## Packages - Functions 2.x

The Service Bus bindings are provided in the [Microsoft.Azure.WebJobs.Extensions.ServiceBus](http://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.ServiceBus) NuGet package, version 3.x. Source code for the package is in the [azure-webjobs-sdk](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs.Extensions.ServiceBus/) GitHub repository.

[!INCLUDE [functions-package-v2](../../includes/functions-package-v2.md)]

## Trigger

Use the Service Bus trigger to respond to messages from a Service Bus queue or topic. 

## Trigger - example

See the language-specific example:

* [C#](#trigger---c-example)
* [C# script (.csx)](#trigger---c-script-example)
* [F#](#trigger---f-example)
* [JavaScript](#trigger---javascript-example)
* [Java](#trigger---java-example)

### Trigger - C# example

The following example shows a [C# function](functions-dotnet-class-library.md) that reads [message metadata](#trigger---message-metadata) and
logs a Service Bus queue message:

```cs
[FunctionName("ServiceBusQueueTriggerCSharp")]                    
public static void Run(
    [ServiceBusTrigger("myqueue", AccessRights.Manage, Connection = "ServiceBusConnection")] 
    string myQueueItem,
    Int32 deliveryCount,
    DateTime enqueuedTimeUtc,
    string messageId,
    TraceWriter log)
{
    log.Info($"C# ServiceBus queue trigger function processed message: {myQueueItem}");
    log.Info($"EnqueuedTimeUtc={enqueuedTimeUtc}");
    log.Info($"DeliveryCount={deliveryCount}");
    log.Info($"MessageId={messageId}");
}
```

This example is for Azure Functions version 1.x; for 2.x, [omit the access rights parameter](#trigger---configuration).
 
### Trigger - C# script example

The following example shows a Service Bus trigger binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding. The function reads [message metadata](#trigger---message-metadata) and logs a Service Bus queue message.

Here's the binding data in the *function.json* file:

```json
{
"bindings": [
    {
    "queueName": "testqueue",
    "connection": "MyServiceBusConnection",
    "name": "myQueueItem",
    "type": "serviceBusTrigger",
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
    log.Info($"C# ServiceBus queue trigger function processed message: {myQueueItem}");

    log.Info($"EnqueuedTimeUtc={enqueuedTimeUtc}");
    log.Info($"DeliveryCount={deliveryCount}");
    log.Info($"MessageId={messageId}");
}
```

### Trigger - F# example

The following example shows a Service Bus trigger binding in a *function.json* file and an [F# function](functions-reference-fsharp.md) that uses the binding. The function logs a Service Bus queue message. 

Here's the binding data in the *function.json* file:

```json
{
"bindings": [
    {
    "queueName": "testqueue",
    "connection": "MyServiceBusConnection",
    "name": "myQueueItem",
    "type": "serviceBusTrigger",
    "direction": "in"
    }
],
"disabled": false
}
```

Here's the F# script code:

```fsharp
let Run(myQueueItem: string, log: TraceWriter) =
    log.Info(sprintf "F# ServiceBus queue trigger function processed message: %s" myQueueItem)
```

### Trigger - JavaScript example

The following example shows a Service Bus trigger binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding. The function reads [message metadata](#trigger---message-metadata) and logs a Service Bus queue message. 

Here's the binding data in the *function.json* file:

```json
{
"bindings": [
    {
    "queueName": "testqueue",
    "connection": "MyServiceBusConnection",
    "name": "myQueueItem",
    "type": "serviceBusTrigger",
    "direction": "in"
    }
],
"disabled": false
}
```

Here's the JavaScript script code:

```javascript
module.exports = function(context, myQueueItem) {
    context.log('Node.js ServiceBus queue trigger function processed message', myQueueItem);
    context.log('EnqueuedTimeUtc =', context.bindingData.enqueuedTimeUtc);
    context.log('DeliveryCount =', context.bindingData.deliveryCount);
    context.log('MessageId =', context.bindingData.messageId);
    context.done();
};
```

### Trigger - Java example

The following example shows a Service Bus trigger binding in a *function.json* file and a [Java function](functions-reference-java.md) that uses the binding. The function is triggered by a message placed on a Service Bus queue, and the function logs the queue message.

Here's the binding data in the *function.json* file:

```json
{
"bindings": [
    {
    "queueName": "myqueuename",
    "connection": "MyServiceBusConnection",
    "name": "msg",
    "type": "ServiceBusQueueTrigger",
    "direction": "in"
    }
],
"disabled": false
}
```

Here's the Java code:

```java
@FunctionName("sbprocessor")
 public void serviceBusProcess(
    @ServiceBusQueueTrigger(name = "msg",
                             queueName = "myqueuename",
                             connection = "myconnvarname") String message,
   final ExecutionContext context
 ) {
     context.getLogger().info(message);
 }
 ```

## Trigger - attributes

In [C# class libraries](functions-dotnet-class-library.md), use the following attributes to configure a Service Bus trigger:

* [ServiceBusTriggerAttribute](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs.Extensions.ServiceBus/ServiceBusTriggerAttribute.cs)

  The attribute's constructor takes the name of the queue or the topic and subscription. In Azure Functions version 1.x, you can also specify the connection's access rights. If you don't specify access rights, the default is `Manage`. For more information, see the [Trigger - configuration](#trigger---configuration) section.

  Here's an example that shows the attribute used with a string parameter:

  ```csharp
  [FunctionName("ServiceBusQueueTriggerCSharp")]                    
  public static void Run(
      [ServiceBusTrigger("myqueue")] string myQueueItem, TraceWriter log)
  {
      ...
  }
  ```

  You can set the `Connection` property to specify the Service Bus account to use, as shown in the following example:

  ```csharp
  [FunctionName("ServiceBusQueueTriggerCSharp")]                    
  public static void Run(
      [ServiceBusTrigger("myqueue", Connection = "ServiceBusConnection")] 
      string myQueueItem, TraceWriter log)
  {
      ...
  }
  ```

  For a complete example, see [Trigger - C# example](#trigger---c-example).

* [ServiceBusAccountAttribute](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs.Extensions.ServiceBus/ServiceBusAccountAttribute.cs)

  Provides another way to specify the Service Bus account to use. The constructor takes the name of an app setting that contains a Service Bus connection string. The attribute can be applied at the parameter, method, or class level. The following example shows class level and method level:

  ```csharp
  [ServiceBusAccount("ClassLevelServiceBusAppSetting")]
  public static class AzureFunctions
  {
      [ServiceBusAccount("MethodLevelServiceBusAppSetting")]
      [FunctionName("ServiceBusQueueTriggerCSharp")]
      public static void Run(
          [ServiceBusTrigger("myqueue", AccessRights.Manage)] 
          string myQueueItem, TraceWriter log)
  {
      ...
  }
  ```

The Service Bus account to use is determined in the following order:

* The `ServiceBusTrigger` attribute's `Connection` property.
* The `ServiceBusAccount` attribute applied to the same parameter as the `ServiceBusTrigger` attribute.
* The `ServiceBusAccount` attribute applied to the function.
* The `ServiceBusAccount` attribute applied to the class.
* The "AzureWebJobsServiceBus" app setting.

## Trigger - configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `ServiceBusTrigger` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type** | n/a | Must be set to "serviceBusTrigger". This property is set automatically when you create the trigger in the Azure portal.|
|**direction** | n/a | Must be set to "in". This property is set automatically when you create the trigger in the Azure portal. |
|**name** | n/a | The name of the variable that represents the queue or topic message in function code. Set to "$return" to reference the function return value. | 
|**queueName**|**QueueName**|Name of the queue to monitor.  Set only if monitoring a queue, not for a topic.
|**topicName**|**TopicName**|Name of the topic to monitor. Set only if monitoring a topic, not for a queue.|
|**subscriptionName**|**SubscriptionName**|Name of the subscription to monitor. Set only if monitoring a topic, not for a queue.|
|**connection**|**Connection**|The name of an app setting that contains the Service Bus connection string to use for this binding. If the app setting name begins with "AzureWebJobs", you can specify only the remainder of the name. For example, if you set `connection` to "MyServiceBus", the Functions runtime looks for an app setting that is named "AzureWebJobsMyServiceBus." If you leave `connection` empty, the Functions runtime uses the default Service Bus connection string in the app setting that is named "AzureWebJobsServiceBus".<br><br>To obtain a connection string, follow the steps shown at [Obtain the management credentials](../service-bus-messaging/service-bus-dotnet-get-started-with-queues.md#obtain-the-management-credentials). The connection string must be for a Service Bus namespace, not limited to a specific queue or topic. |
|**accessRights**|**Access**|Access rights for the connection string. Available values are `manage` and `listen`. The default is `manage`, which indicates that the `connection` has the **Manage** permission. If you use a connection string that does not have the **Manage** permission, set `accessRights` to "listen". Otherwise, the Functions runtime might fail trying to do operations that require manage rights. In Azure Functions version 2.x, this property is not available because the latest version of the Storage SDK doesn't support manage operations.|

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Trigger - usage

In C# and C# script, you can use the following parameter types for the queue or topic message:

* `string` - If the message is text.
* `byte[]` - Useful for binary data.
* A custom type - If the message contains JSON, Azure Functions tries to deserialize the JSON data.
* `BrokeredMessage` - Gives you the deserialized message with the [BrokeredMessage.GetBody<T>()](https://docs.microsoft.com/en-us/dotnet/api/microsoft.servicebus.messaging.brokeredmessage.getbody?view=azure-dotnet#Microsoft_ServiceBus_Messaging_BrokeredMessage_GetBody__1)
  method.

These parameters are for Azure Functions version 1.x; for 2.x, use [`Message`](https://docs.microsoft.com/dotnet/api/microsoft.azure.servicebus.message) instead of `BrokeredMessage`.

In JavaScript, access the queue or topic message by using `context.bindings.<name from function.json>`. The Service Bus message is passed into the function as either a string or JSON object.

## Trigger - poison messages

Poison message handling can't be controlled or configured in Azure Functions. Service Bus handles poison messages itself.

## Trigger - PeekLock behavior

The Functions runtime receives a message in [PeekLock mode](../service-bus-messaging/service-bus-performance-improvements.md#receive-mode). It calls `Complete` on the message if the function finishes successfully, or calls `Abandon` if the function fails. If the function runs longer than the `PeekLock` timeout, the lock is automatically renewed as long as the function is running. 

Functions 1.x allows you to configure `autoRenewTimeout` in *host.json*, which maps to [OnMessageOptions.AutoRenewTimeout](https://docs.microsoft.com/dotnet/api/microsoft.servicebus.messaging.onmessageoptions.autorenewtimeout?view=azure-dotnet#Microsoft_ServiceBus_Messaging_OnMessageOptions_AutoRenewTimeout). The maximum allowed for this setting is 5 minutes according to the Service Bus documentation, whereas you can increase the Functions time limit from the default of 5 minutes to 10 minutes. For Service Bus functions you wouldn’t want to do that then, because you’d exceed the Service Bus renewal limit.

## Trigger - message metadata

The Service Bus trigger provides several [metadata properties](functions-triggers-bindings.md#binding-expressions---trigger-metadata). These properties can be used as part of binding expressions in other bindings or as parameters in your code. These are properties of the [BrokeredMessage](https://docs.microsoft.com/dotnet/api/microsoft.servicebus.messaging.brokeredmessage) class.

|Property|Type|Description|
|--------|----|-----------|
|`DeliveryCount`|`Int32`|The number of deliveries.|
|`DeadLetterSource`|`string`|The dead letter source.|
|`ExpiresAtUtc`|`DateTime`|The expiration time in UTC.|
|`EnqueuedTimeUtc`|`DateTime`|The enqueued time in UTC.|
|`MessageId`|`string`|A user-defined value that Service Bus can use to identify duplicate messages, if enabled.|
|`ContentType`|`string`|A content type identifier utilized by the sender and receiver for application specific logic.|
|`ReplyTo`|`string`|The reply to queue address.|
|`SequenceNumber`|`Int64`|The unique number assigned to a message by the Service Bus.|
|`To`|`string`|The send to address.|
|`Label`|`string`|The application specific label.|
|`CorrelationId`|`string`|The correlation ID.|
|`Properties`|`IDictionary<String,Object>`|The application specific message properties.|

See [code examples](#trigger---example) that use these properties earlier in this article.

## Trigger - host.json properties

The [host.json](functions-host-json.md#servicebus) file contains settings that control Service Bus trigger behavior.

[!INCLUDE [functions-host-json-event-hubs](../../includes/functions-host-json-service-bus.md)]

## Output

Use Azure Service Bus output binding to send queue or topic messages.

## Output - example

See the language-specific example:

* [C#](#output---c-example)
* [C# script (.csx)](#output---c-script-example)
* [F#](#output---f-example)
* [JavaScript](#output---javascript-example)
* [Java](#output--java-example)

### Output - C# example

The following example shows a [C# function](functions-dotnet-class-library.md) that sends a Service Bus queue message:

```cs
[FunctionName("ServiceBusOutput")]
[return: ServiceBus("myqueue", Connection = "ServiceBusConnection")]
public static string ServiceBusOutput([HttpTrigger] dynamic input, TraceWriter log)
{
    log.Info($"C# function processed: {input.Text}");
    return input.Text;
}
```

### Output - C# script example

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
public static void Run(TimerInfo myTimer, TraceWriter log, out string outputSbQueue)
{
    string message = $"Service Bus queue message created at: {DateTime.Now}";
    log.Info(message); 
    outputSbQueue = message;
}
```

Here's C# script code that creates multiple messages:

```cs
public static void Run(TimerInfo myTimer, TraceWriter log, ICollector<string> outputSbQueue)
{
    string message = $"Service Bus queue messages created at: {DateTime.Now}";
    log.Info(message); 
    outputSbQueue.Add("1 " + message);
    outputSbQueue.Add("2 " + message);
}
```

### Output - F# example

The following example shows a Service Bus output binding in a *function.json* file and an [F# script function](functions-reference-fsharp.md) that uses the binding. The function uses a timer trigger to send a queue message every 15 seconds.

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

Here's F# script code that creates a single message:

```fsharp
let Run(myTimer: TimerInfo, log: TraceWriter, outputSbQueue: byref<string>) =
    let message = sprintf "Service Bus queue message created at: %s" (DateTime.Now.ToString())
    log.Info(message)
    outputSbQueue = message
```

### Output - JavaScript example

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


### Output - Java example

The following example shows a Java function that sends a message to a Service Bus queue `myqueue` when triggered by a HTTP request.

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

## Output - attributes

In [C# class libraries](functions-dotnet-class-library.md), use the [ServiceBusAttribute](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs.Extensions.ServiceBus/ServiceBusAttribute.cs).

The attribute's constructor takes the name of the queue or the topic and subscription. You can also specify the connection's access rights. How to choose the access rights setting is explained in the [Output - configuration](#output---configuration) section. Here's an example that shows the attribute applied to the return value of the function:

```csharp
[FunctionName("ServiceBusOutput")]
[return: ServiceBus("myqueue")]
public static string Run([HttpTrigger] dynamic input, TraceWriter log)
{
    ...
}
```

You can set the `Connection` property to specify the Service Bus account to use, as shown in the following example:

```csharp
[FunctionName("ServiceBusOutput")]
[return: ServiceBus("myqueue", Connection = "ServiceBusConnection")]
public static string Run([HttpTrigger] dynamic input, TraceWriter log)
{
    ...
}
```

For a complete example, see [Output - C# example](#output---c-example).

You can use the `ServiceBusAccount` attribute to specify the Service Bus account to use at class, method, or parameter level.  For more information, see [Trigger - attributes](#trigger---attributes).

## Output - configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `ServiceBus` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type** | n/a | Must be set to "serviceBus". This property is set automatically when you create the trigger in the Azure portal.|
|**direction** | n/a | Must be set to "out". This property is set automatically when you create the trigger in the Azure portal. |
|**name** | n/a | The name of the variable that represents the queue or topic in function code. Set to "$return" to reference the function return value. | 
|**queueName**|**QueueName**|Name of the queue.  Set only if sending queue messages, not for a topic.
|**topicName**|**TopicName**|Name of the topic to monitor. Set only if sending topic messages, not for a queue.|
|**connection**|**Connection**|The name of an app setting that contains the Service Bus connection string to use for this binding. If the app setting name begins with "AzureWebJobs", you can specify only the remainder of the name. For example, if you set `connection` to "MyServiceBus", the Functions runtime looks for an app setting that is named "AzureWebJobsMyServiceBus." If you leave `connection` empty, the Functions runtime uses the default Service Bus connection string in the app setting that is named "AzureWebJobsServiceBus".<br><br>To obtain a connection string, follow the steps shown at [Obtain the management credentials](../service-bus-messaging/service-bus-dotnet-get-started-with-queues.md#obtain-the-management-credentials). The connection string must be for a Service Bus namespace, not limited to a specific queue or topic.|
|**accessRights**|**Access**|Access rights for the connection string. Available values are `manage` and `listen`. The default is `manage`, which indicates that the `connection` has the **Manage** permission. If you use a connection string that does not have the **Manage** permission, set `accessRights` to "listen". Otherwise, the Functions runtime might fail trying to do operations that require manage rights. In Azure Functions version 2.x, this property is not available because the latest version of the Storage SDK doesn't support manage operations.|

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Output - usage

In Azure Functions 1.x, the runtime creates the queue if it doesn't exist and you have set `accessRights` to `manage`. In Functions version 2.x, the queue or topic must already exist; if you specify a queue or topic that doesn't exist, the function will fail. 

In C# and C# script, you can use the following parameter types for the output binding:

* `out T paramName` - `T` can be any JSON-serializable type. If the parameter value is null when the function exits, Functions creates the message with a null object.
* `out string` - If the parameter value is null when the function exits, Functions does not create a message.
* `out byte[]` - If the parameter value is null when the function exits, Functions does not create a message.
* `out BrokeredMessage` - If the parameter value is null when the function exits, Functions does not create a message.
* `ICollector<T>` or `IAsyncCollector<T>` - For creating multiple messages. A message is created when you call the `Add` method.

In async functions, use the return value or `IAsyncCollector` instead of an `out` parameter.

These parameters are for Azure Functions version 1.x; for 2.x, use [`Message`](https://docs.microsoft.com/dotnet/api/microsoft.azure.servicebus.message) instead of `BrokeredMessage`.

In JavaScript, access the queue or topic by using `context.bindings.<name from function.json>`. You can assign a string, a byte array, or a Javascript object (deserialized into JSON) to `context.binding.<name>`.

## Exceptions and return codes

| Binding | Reference |
|---|---|
| Service Bus | [Service Bus Error Codes](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-messaging-exceptions) |
| Service Bus | [Service Bus Limits](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-quotas) |

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure functions triggers and bindings](functions-triggers-bindings.md)
