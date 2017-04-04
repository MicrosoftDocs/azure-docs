---
title: Azure Functions Service Bus triggers and bindings | Microsoft Docs
description: Understand how to use Azure Service Bus triggers and bindings in Azure Functions.
services: functions
documentationcenter: na
author: christopheranderson
manager: erikre
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
ms.author: chrande; glenga

---
# Azure Functions Service Bus bindings
[!INCLUDE [functions-selector-bindings](../../includes/functions-selector-bindings.md)]

This article explains how to configure and work with Azure Service Bus bindings in Azure Functions. 

Azure Functions supports trigger and output bindings for Service Bus queues and topics.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

<a name="trigger"></a>

## Service Bus trigger
Use the Service Bus trigger to respond to messages from a Service Bus queue or topic. 

The Service Bus queue and topic triggers are defined by the following JSON objects in the `bindings` array of function.json:

* *queue* trigger:

    ```json
    {
        "name" : "<Name of input parameter in function signature>",
        "queueName" : "<Name of the queue>",
        "connection" : "<Name of app setting that has your queue's connection string - see below>",
        "accessRights" : "<Access rights for the connection string - see below>",
        "type" : "serviceBusTrigger",
        "direction" : "in"
    }
    ```

* *topic* trigger:

    ```json
    {
        "name" : "<Name of input parameter in function signature>",
        "topicName" : "<Name of the topic>",
        "subscriptionName" : "<Name of the subscription>",
        "connection" : "<Name of app setting that has your topic's connection string - see below>",
        "accessRights" : "<Access rights for the connection string - see below>",
        "type" : "serviceBusTrigger",
        "direction" : "in"
    }
    ```

Note the following:

* For `connection`, [create an app setting in your function app](functions-how-to-use-azure-function-app-settings.md) that contains the connection string to your Service Bus namespace, then specify the 
  name of the app setting in the `connection` property in your trigger. You obtain the connection string by following the steps shown at 
  [Obtain the management credentials](../service-bus-messaging/service-bus-dotnet-get-started-with-queues.md#obtain-the-management-credentials).
  The connection string must be for a Service Bus namespace, not limited to a specific queue or topic.
  If you leave `connection` empty, the trigger assumes that a default Service Bus connection string is specified 
  in an app setting named `AzureWebJobsServiceBus`.
* For `accessRights`, available values are `manage` and `listen`. The default is `manage`, which indicates that the 
  `connection` has the **Manage** permission. If you use a connection string that does not have the **Manage** permission, 
  set `accessRights` to `listen`. Otherwise, the Functions runtime might fail trying to do operations that require manage 
  rights.

## Trigger behavior
* **Single-threading** - By default, the Functions runtime processes multiple messages concurrently. To direct the runtime 
  to process only a single queue or topic message at a time, set `serviceBus.maxConcurrentCalls` to 1 in *host.json*. 
  For information about *host.json*, see [Folder Structure](functions-reference.md#folder-structure) and 
  [host.json](https://git
  .com/Azure/azure-webjobs-sdk-script/wiki/host.json).
* **Poison message handling** - Service Bus does its own poison message handling, which can't be controlled or configured 
  in Azure Functions configuration or code. 
* **PeekLock behavior** - The Functions runtime receives a message in 
  [`PeekLock` mode](../service-bus-messaging/service-bus-performance-improvements.md#receive-mode) 
  and calls `Complete` on the message if the function finishes successfully, or calls `Abandon` if the function fails. 
  If the function runs longer than the `PeekLock` timeout, the lock is automatically renewed.

<a name="triggerusage"></a>

## Trigger usage
This section shows you how to use your Service Bus trigger in your function code. 

In C# and F#, the Service Bus trigger message can be deserialized to any of the following input types:

* `string` - useful for string messages
* `byte[]` - useful for binary data
* Any [Object](https://msdn.microsoft.com/library/system.object.aspx) - useful for JSON-serialized data.
  If you declare a custom input type, such as `CustomType`, Azure Functions tries to deserialize the JSON data
  into your specified type.
* `BrokeredMessage` - gives you the deserialized message with the [BrokeredMessage.GetBody<T>()](https://msdn.microsoft.com/library/hh144211.aspx)
  method.

In Node.js, the Service Bus trigger message is passed into the function as either a string or JSON object.

<a name="triggersample"></a>

## Trigger sample
Suppose you have the following function.json:

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

See the language-specific sample that processes a Service Bus queue message.

* [C#](#triggercsharp)
* [F#](#triggerfsharp)
* [Node.js](#triggernodejs)

<a name="triggercsharp"></a>

### Trigger sample in C# #

```cs
public static void Run(string myQueueItem, TraceWriter log)
{
    log.Info($"C# ServiceBus queue trigger function processed message: {myQueueItem}");
}
```

<a name="triggerfsharp"></a>

### Trigger sample in F# #

```fsharp
let Run(myQueueItem: string, log: TraceWriter) =
    log.Info(sprintf "F# ServiceBus queue trigger function processed message: %s" myQueueItem)
```

<a name="triggernodejs"></a>

### Trigger sample in Node.js

```javascript
module.exports = function(context, myQueueItem) {
    context.log('Node.js ServiceBus queue trigger function processed message', myQueueItem);
    context.done();
};
```

<a name="output"></a>

## Service Bus output binding
The Service Bus queue and topic output for a function use the following JSON objects in the `bindings` array of function.json:

* *queue* output:

	```json
    {
        "name" : "<Name of output parameter in function signature>",
        "queueName" : "<Name of the queue>",
        "connection" : "<Name of app setting that has your queue's connection string - see below>",
        "accessRights" : "<Access rights for the connection string - see below>",
        "type" : "serviceBus",
        "direction" : "out"
    }
	```
* *topic* output:

	```json
    {
        "name" : "<Name of output parameter in function signature>",
        "topicName" : "<Name of the topic>",
        "subscriptionName" : "<Name of the subscription>",
        "connection" : "<Name of app setting that has your topic's connection string - see below>",
        "accessRights" : "<Access rights for the connection string - see below>"
        "type" : "serviceBus",
        "direction" : "out"
    }
	```

Note the following:

* For `connection`, [create an app setting in your function app](functions-how-to-use-azure-function-app-settings.md) that contains the connection string to your Service Bus namespace, then specify the 
  name of the app setting in the `connection` property in your output binding. You obtain the connection string by following the steps shown at 
  [Obtain the management credentials](../service-bus-messaging/service-bus-dotnet-get-started-with-queues.md#obtain-the-management-credentials).
  The connection string must be for a Service Bus namespace, not limited to a specific queue or topic.
  If you leave `connection` empty, the output binding assumes that a default Service Bus connection string is specified 
  in an app setting named `AzureWebJobsServiceBus`.
* For `accessRights`, available values are `manage` and `listen`. The default is `manage`, which indicates that the 
  `connection` has the **Manage** permission. If you use a connection string that does not have the **Manage** permission, 
  set `accessRights` to `listen`. Otherwise, the Functions runtime might fail trying to do operations that require manage 
  rights.

<a name="outputusage"></a>

## Output usage
In C# and F#, Azure Functions can create a Service Bus queue message from any of the following types:

* Any [Object](https://msdn.microsoft.com/library/system.object.aspx) - Parameter definition looks like `out T paramName` (C#).
  Functions deserializes the object into a JSON message. If the output value is null when the function exits, Functions creates the message with a null object.
* `string` - Parameter definition looks like `out string paraName` (C#). If the parameter value is non-null when the function exits, Functions creates a message.
* `byte[]` - Parameter definition looks like `out byte[] paraName` (C#). If the parameter value is non-null when the function exits, Functions creates a message.
* `BrokeredMessage` Parameter definition looks like `out BrokeredMessage paraName` (C#). If the parameter value is non-null when the function exits, Functions creates a message.

For creating multiple messages in a C# function, you can use `ICollector<T>` or `IAsyncCollector<T>`. A message is created when you call the `Add` method.

In Node.js, you can assign a string, a byte array, or a Javascript object (deserialized into JSON) to `context.binding.<paramName>`.

<a name="outputsample"></a>

## Output sample
Suppose you have the following function.json, that defines a Service Bus queue output:

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

See the language-specific sample that sends a message to the service bus queue.

* [C#](#outcsharp)
* [F#](#outfsharp)
* [Node.js](#outnodejs)

<a name="outcsharp"></a>

### Output sample in C# #

```cs
public static void Run(TimerInfo myTimer, TraceWriter log, out string outputSbQueue)
{
    string message = $"Service Bus queue message created at: {DateTime.Now}";
    log.Info(message); 
    outputSbQueue = message;
}
```

Or, to create multiple messages:

```cs
public static void Run(TimerInfo myTimer, TraceWriter log, ICollector<string> outputSbQueue)
{
    string message = $"Service Bus queue message created at: {DateTime.Now}";
    log.Info(message); 
    outputSbQueue.Add("1 " + message);
    outputSbQueue.Add("2 " + message);
}
```

<a name="outfsharp"></a>

### Output sample in F# #

```fsharp
let Run(myTimer: TimerInfo, log: TraceWriter, outputSbQueue: byref<string>) =
    let message = sprintf "Service Bus queue message created at: %s" (DateTime.Now.ToString())
    log.Info(message)
    outputSbQueue = message
```

<a name="outnodejs"></a>

### Output sample in Node.js

```javascript
module.exports = function (context, myTimer) {
    var message = 'Service Bus queue message created at ' + timeStamp;
    context.log(message);   
    context.bindings.outputSbQueueMsg = message;
    context.done();
};
```

Or, to create multiple messages:

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

## Next steps
[!INCLUDE [next steps](../../includes/functions-bindings-next-steps.md)]

