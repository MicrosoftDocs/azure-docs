---
title: Azure Functions Service Bus triggers and bindings | Microsoft Docs
description: Understand how to use Azure Service Bus triggers and bindings in Azure Functions.
services: functions
documentationcenter: na
author: christopheranderson
manager: cfowler
editor: ''
tags: ''
keywords: azure functions, functions, event processing, dynamic compute, serverless architecture

ms.assetid: daedacf0-6546-4355-a65c-50873e74f66b
ms.service: functions
ms.devlang: multiple
ms.topic: reference
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 04/01/2017
ms.author: glenga

---
# Azure Functions Service Bus bindings

This article explains how to work with Azure Service Bus bindings in Azure Functions. Azure Functions supports trigger and output bindings for Service Bus queues and topics.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

## Service Bus trigger

Use the Service Bus trigger to respond to messages from a Service Bus queue or topic. 

## Trigger example

See the language-specific example:

* [Precompiled C#](#trigger---c-example)
* [C# script](#trigger---c-script-example)
* [JavaScript](#trigger---javascript-example)

### Trigger - C# example

The following example shows a [precompiled C# function](functions-dotnet-class-library.md) that logs a Service Bus queue message.

```cs
[FunctionName("ServiceBusQueueTriggerCSharp")]                    
public static void Run(
    [ServiceBusTrigger("myqueue", AccessRights.Manage, Connection = "ServiceBusConnection")] 
    string myQueueItem, 
    TraceWriter log)
{
    log.Info($"C# ServiceBus queue trigger function processed message: {myQueueItem}");
}
```

### Trigger - C# script example

The following example shows a Service Bus trigger binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding. The function logs a Service Bus queue message.

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
public static void Run(string myQueueItem, TraceWriter log)
{
    log.Info($"C# ServiceBus queue trigger function processed message: {myQueueItem}");
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

The following example shows a Service Bus trigger binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding. The function logs a Service Bus queue message. 

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
    context.done();
};
```

## Trigger - C# attributes

For [precompiled C#](functions-dotnet-class-library.md) functions, use the following attributes to configure a Service Bus trigger:

* [ServiceBusTriggerAttribute](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs.ServiceBus/ServiceBusTriggerAttribute.cs), defined in NuGet package [Microsoft.Azure.WebJobs.ServiceBus](http://www.nuget.org/packages/Microsoft.Azure.WebJobs.ServiceBus)

  The attribute's constructor takes the name of the queue or the topic and subscription. You can also specify the access rights and an app setting that points to a Service Bus connection string. Here's an example:

  ```csharp
  [FunctionName("ServiceBusQueueTriggerCSharp")]                    
  public static void Run(
      [ServiceBusTrigger("myqueue", AccessRights.Manage, Connection = "ServiceBusConnection")] 
      string myQueueItem, TraceWriter log)
  ```

* [ServiceBusAccountAttribute](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs.ServiceBus/ServiceBusAccountAttribute.cs), defined in NuGet package [Microsoft.Azure.WebJobs.ServiceBus](http://www.nuget.org/packages/Microsoft.Azure.WebJobs.ServiceBus)

  Enables you to specify a Service Bus account at the parameter, method, or class level. Parameter level overrides method and class level, and method level overrides class level. Here's an example:

  ```csharp
  [ServiceBusAccount("ServiceBusConnection")]
  [FunctionName("ServiceBusQueueTriggerCSharp")]
  public static void Run(
      [ServiceBusTrigger("myqueue", AccessRights.Manage)] 
      string myQueueItem, TraceWriter log)
  ```

## Trigger - settings

The following settings appear only in the *function.json* file:

|Property  |Description  |
|---------|---------|
|`type` | Must be set to `serviceBusTrigger`. This property is set automatically when you create the trigger in the Azure portal.|
|`direction` | Must be set to `in`. This property is set automatically when you create the trigger in the Azure portal. |
|`name` | The name of the variable that represents the queue or topic message in function code. Set to `$return` to reference the function return value. | 

The following settings are configured in the *function.json* file and the C# attribute constructor:

|Property  |Description  |
|---------|---------|
|`queueName`|Name of the queue to monitor.  Set only if monitoring a queue, not for a topic.
|`topicName`|Name of the topic to monitor. Set only if monitoring a topic, not for a queue.|
|`subscriptionName`|Name of the subscription to monitor. Set only if monitoring a topic, not for a queue.|
|`connection`|The name of an app setting that contains the Service Bus connection string to use for this trigger binding. [Create an app setting](functions-how-to-use-azure-function-app-settings.md) that contains the connection string to the Service Bus namespace. Then specify the 
  name of the app setting in the `connection` property. Obtain the connection string by following the steps shown at [Obtain the management credentials](../service-bus-messaging/service-bus-dotnet-get-started-with-queues.md#obtain-the-management-credentials). The connection string must be for a Service Bus namespace, not limited to a specific queue or topic. If you leave `connection` empty, the trigger assumes that a default Service Bus connection string is specified in an app setting named `AzureWebJobsServiceBus`.|
|`accessRights`|Access rights for the connection string. Available values are `manage` and `listen`. The default is `manage`, which indicates that the `connection` has the **Manage** permission. If you use a connection string that does not have the **Manage** permission, set `accessRights` to `listen`. Otherwise, the Functions runtime might fail trying to do operations that require manage rights.|

## Trigger - usage

In C# and C# script, access the queue or topic message by using a method parameter such as `string paramName`. In C# script, `paramName` is the value specified in the `name` property of *function.json*. You can use any of the following types instead of `string`:

* `byte[]` - Useful for binary data.
* A custom type - If the message contains JSON, Azure Functions tries to deserialize the JSON data.
* `BrokeredMessage` - Gives you the deserialized message with the [BrokeredMessage.GetBody<T>()](https://msdn.microsoft.com/library/hh144211.aspx)
  method.

In JavaScript, access the queue or topic message by using `context.bindings.<name>`. `<name>` is the value specified in the `name` property of *function.json*. The Service Bus message is passed into the function as either a string or JSON object.

## Trigger - poison messages

Service Bus does its own poison message handling, which can't be controlled or configured in Azure Functions configuration or code. 

## Trigger - PeekLock behavior

The Functions runtime receives a message in [`PeekLock` mode](../service-bus-messaging/service-bus-performance-improvements.md#receive-mode) and calls `Complete` on the message if the function finishes successfully, or calls `Abandon` if the function fails. If the function runs longer than the `PeekLock` timeout, the lock is automatically renewed.

## Trigger - host.json

The [host.json](functions-host-json.md#servicebus) file contains settings that control Service Bus trigger behavior.

[!INCLUDE [functions-host-json-event-hubs](../../includes/functions-host-json-service-bus.md)]

## Service Bus output binding

Use Azure Service Bus output binding to send queue or topic messages.

## Output - example

See the language-specific example:

* [Precompiled C#](#output---c-example)
* [C# script](#output---c-script-example)
* [F# script](#output---f-script-example)
* [JavaScript](#output---javascript-example)

### Trigger - C# example

The following example shows a [precompiled C# function](functions-dotnet-class-library.md) that sends a Service Bus queue message when it is triggered by an HTTP request:

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

The following example shows a Service Bus output binding in a *function.json* file and a [F# script function](functions-reference-fsharp.md) that uses the binding. The function uses a timer trigger to send a queue message every 15 seconds.

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
    context.bindings.outputSbQueueMsg = message;
    context.done();
};
```

Here's JavaScript script code that creates multiple messages:

```javascript
module.exports = function (context, myTimer) {
    var message = 'Service Bus queue message created at ' + timeStamp;
    context.log(message);   
    context.bindings.outputSbQueueMsg = [];
    context.bindings.outputSbQueueMsg.push("1 " + message);
    context.bindings.outputSbQueueMsg.push("2 " + message);
    context.done();
};
```
## Trigger - settings

The following settings appear only in the *function.json* file:

|Property  |Description  |
|---------|---------|
|`type` | Must be set to `serviceBus`. This property is set automatically when you create the trigger in the Azure portal.|
|`direction` | Must be set to `out`. This property is set automatically when you create the trigger in the Azure portal. |
|`name` | The name of the variable that represents the queue or topic in function code. Set to `$return` to reference the function return value. | 

The following settings are configured in the *function.json* file and the C# attribute constructor:

|Property  |Description  |
|---------|---------|
|`queueName`|Name of the queue.  Set only if sending queue messages, not for a topic.
|`topicName`|Name of the topic to monitor. Set only if sending topic mesages, not for a queue.|
|`subscriptionName`|Name of the subscription to monitor. Set only if sending topic messages, not for a queue.|
|`connection`|The name of an app setting that contains the Service Bus connection string to use for this trigger binding. [Create an app setting](functions-how-to-use-azure-function-app-settings.md) that contains the connection string to the Service Bus namespace. Then specify the 
  name of the app setting in the `connection` property. Obtain the connection string by following the steps shown at [Obtain the management credentials](../service-bus-messaging/service-bus-dotnet-get-started-with-queues.md#obtain-the-management-credentials). The connection string must be for a Service Bus namespace, not limited to a specific queue or topic. If you leave `connection` empty, the trigger assumes that a default Service Bus connection string is specified in an app setting named `AzureWebJobsServiceBus`.|
|`accessRights`|Access rights for the connection string. Available values are `manage` and `listen`. The default is `manage`, which indicates that the 
  `connection` has the **Manage** permission. If you use a connection string that does not have the **Manage** permission, set `accessRights` to `listen`. Otherwise, the Functions runtime might fail trying to do operations that require manage 
  rights.|

## Output - usage

In C# and C# script, access the queue or topic by using a method parameter such as `out string paramName`. In C# script, `paramName` is the value specified in the `name` property of *function.json*. You can use any of the following parameter types:

* `out T paramName` - `T` can be any JSON-serializable type. If the parameter value is null when the function exits, Functions creates the message with a null object.
* `out string` - If the parameter value is null when the function exits, Functions does not create a message.
* `out byte[]` - If the parameter value is null when the function exits, Functions does not create a message.
* `BrokeredMessage` - If the parameter value is null when the function exits, Functions does not create a message.

For creating multiple messages in a C# or C# script function, you can use `ICollector<T>` or `IAsyncCollector<T>`. A message is created when you call the `Add` method.

In JavaScript, access the queue or topic by using `context.bindings.<name>`. `<name>` is the value specified in the `name` property of *function.json*. You can assign a string, a byte array, or a Javascript object (deserialized into JSON) to `context.binding.<name>`.

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure functions triggers and bindings](functions-triggers-bindings.md)
