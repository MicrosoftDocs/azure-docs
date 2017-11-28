---
title: Azure Functions Event Hubs bindings
description: Understand how to use Azure Event Hubs bindings in Azure Functions.
services: functions
documentationcenter: na
author: wesmc7777
manager: cfowler
editor: ''
tags: ''
keywords: azure functions, functions, event processing, dynamic compute, serverless architecture

ms.assetid: daf81798-7acc-419a-bc32-b5a41c6db56b
ms.service: functions
ms.devlang: multiple
ms.topic: reference
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 11/08/2017
ms.author: wesmc

---
# Azure Functions Event Hubs bindings

This article explains how to work with [Azure Event Hubs](../event-hubs/event-hubs-what-is-event-hubs.md) bindings for Azure Functions. Azure Functions supports trigger and output bindings for Event Hubs.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

## Event Hubs trigger

Use the Event Hubs trigger to respond to an event sent to an event hub event stream. You must have read access to the event hub to set up the trigger.

When an Event Hubs trigger function is triggered, the message that triggers it is passed into the function as a string.

## Trigger - example

See the language-specific example:

* [Precompiled C#](#trigger---c-example)
* [C# script](#trigger---c-script-example)
* [F#](#trigger---f-example)
* [JavaScript](#trigger---javascript-example)

### Trigger - C# example

The following example shows [precompiled C#](functions-dotnet-class-library.md) code that logs the message body of the event hub trigger.

```csharp
[FunctionName("EventHubTriggerCSharp")]
public static void Run([EventHubTrigger("samples-workitems", Connection = "EventHubConnection")] string myEventHubMessage, TraceWriter log)
{
    log.Info($"C# Event Hub trigger function processed a message: {myEventHubMessage}");
}
```

To get access to the event metadata, bind to an [EventData](/dotnet/api/microsoft.servicebus.messaging.eventdata) object (requires a `using` statement for `Microsoft.ServiceBus.Messaging`).

```csharp
[FunctionName("EventHubTriggerCSharp")]
public static void Run([EventHubTrigger("samples-workitems", Connection = "EventHubConnection")] EventData myEventHubMessage, TraceWriter log)
{
    log.Info($"{Encoding.UTF8.GetString(myEventHubMessage.GetBytes())}");
}
```
To receive events in a batch, make `string` or `EventData` an array:

```cs
[FunctionName("EventHubTriggerCSharp")]
public static void Run([EventHubTrigger("samples-workitems", Connection = "EventHubConnection")] string[] eventHubMessages, TraceWriter log)
{
    foreach (var message in eventHubMessages)
    {
        log.Info($"C# Event Hub trigger function processed a message: {message}");
    }
}
```

### Trigger - C# script example

The following example shows an event hub trigger binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding. The function logs the message body of the event hub trigger.

Here's the binding data in the *function.json* file:

```json
{
  "type": "eventHubTrigger",
  "name": "myEventHubMessage",
  "direction": "in",
  "path": "MyEventHub",
  "connection": "myEventHubReadConnectionString"
}
```
Here's the C# script code:

```cs
using System;

public static void Run(string myEventHubMessage, TraceWriter log)
{
    log.Info($"C# Event Hub trigger function processed a message: {myEventHubMessage}");
}
```

To get access to the event metadata, bind to an [EventData](/dotnet/api/microsoft.servicebus.messaging.eventdata) object (requires a using statement for `Microsoft.ServiceBus.Messaging`).

```cs
#r "Microsoft.ServiceBus"
using System.Text;
using Microsoft.ServiceBus.Messaging;

public static void Run(EventData myEventHubMessage, TraceWriter log)
{
    log.Info($"{Encoding.UTF8.GetString(myEventHubMessage.GetBytes())}");
}
```

To receive events in a batch, make `string` or `EventData` an array:

```cs
public static void Run(string[] eventHubMessages, TraceWriter log)
{
    foreach (var message in eventHubMessages)
    {
        log.Info($"C# Event Hub trigger function processed a message: {message}");
    }
}
```

### Trigger - F# example

The following example shows an event hub trigger binding in a *function.json* file and an [F# function](functions-reference-fsharp.md) that uses the binding. The function logs the message body of the event hub trigger.

Here's the binding data in the *function.json* file:

```json
{
  "type": "eventHubTrigger",
  "name": "myEventHubMessage",
  "direction": "in",
  "path": "MyEventHub",
  "connection": "myEventHubReadConnectionString"
}
```

Here's the F# code:

```fsharp
let Run(myEventHubMessage: string, log: TraceWriter) =
    log.Info(sprintf "F# eventhub trigger function processed work item: %s" myEventHubMessage)
```

### Trigger - JavaScript example

The following example shows an event hub trigger binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding. The function logs the message body of the event hub trigger.

Here's the binding data in the *function.json* file:

```json
{
  "type": "eventHubTrigger",
  "name": "myEventHubMessage",
  "direction": "in",
  "path": "MyEventHub",
  "connection": "myEventHubReadConnectionString"
}
```

Here's the JavaScript code:

```javascript
module.exports = function (context, myEventHubMessage) {
    context.log('Node.js eventhub trigger function processed work item', myEventHubMessage);    
    context.done();
};
```

## Trigger - Attributes for precompiled C#

For [precompiled C#](functions-dotnet-class-library.md) functions, use the [EventHubTriggerAttribute](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs.ServiceBus/EventHubs/EventHubTriggerAttribute.cs) attribute, which is defined in NuGet package [Microsoft.Azure.WebJobs.ServiceBus](http://www.nuget.org/packages/Microsoft.Azure.WebJobs.ServiceBus).

The attribute's constructor takes the name of the event hub, the name of the consumer group, and the name of an app setting that contains the connection string. For more information about these settings, see the [trigger configuration section](#trigger---configuration). Here's an `EventHubTriggerAttribute` attribute example:

```csharp
[FunctionName("EventHubTriggerCSharp")]
public static void Run([EventHubTrigger("samples-workitems", Connection = "EventHubConnection")] string myEventHubMessage, TraceWriter log)
```

## Trigger - configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `EventHubTrigger` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type** | n/a | Must be set to `eventHubTrigger`. This property is set automatically when you create the trigger in the Azure portal.|
|**direction** | n/a | Must be set to `in`. This property is set automatically when you create the trigger in the Azure portal. |
|**name** | n/a | The name of the variable that represents the event item in function code. | 
|**path** |**EventHubName** | The name of the event hub. | 
|**consumerGroup** |**ConsumerGroup** | An optional property that sets the [consumer group](../event-hubs/event-hubs-features.md#event-consumers) used to subscribe to events in the hub. If omitted, the `$Default` consumer group is used. | 
|**connection** |**Connection** | The name of an app setting that contains the connection string to the event hub's namespace. Copy this connection string by clicking the **Connection Information** button for the *namespace*, not the event hub itself. This connection string must have at least read permissions to activate the trigger.<br/>When you're developing locally, app settings go into the values of the [local.settings.json file](functions-run-local.md#local-settings-file).|

## Trigger - host.json properties

The [host.json](functions-host-json.md#eventhub) file contains settings that control Event Hubs trigger behavior.

[!INCLUDE [functions-host-json-event-hubs](../../includes/functions-host-json-event-hubs.md)]

## Event Hubs output binding

Use the Event Hubs output binding to write events to an event stream. You must have send permission to an event hub to write events to it.

## Output - example

See the language-specific example:

* [Precompiled C#](#output---c-example)
* [C# script](#output---c-script-example)
* [F#](#output---f-example)
* [JavaScript](#output---javascript-example)

### Output - C# example

The following example shows a [precompiled C# function](functions-dotnet-class-library.md) that writes a message to an event hub, using the method return value as the output:

```csharp
[FunctionName("EventHubOutput")]
[return: EventHub("outputEventHubMessage", Connection = "EventHubConnection")]
public static string Run([TimerTrigger("0 */5 * * * *")] TimerInfo myTimer, TraceWriter log)
{
    log.Info($"C# Timer trigger function executed at: {DateTime.Now}");
    return $"{DateTime.Now}";
}
```

### Output - C# script example

The following example shows an event hub trigger binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding. The function writes a message to an event hub.

Here's the binding data in the *function.json* file:

```json
{
    "type": "eventHub",
    "name": "outputEventHubMessage",
    "path": "myeventhub",
    "connection": "MyEventHubSend",
    "direction": "out"
}
```

Here's C# script code that creates one message:

```cs
using System;

public static void Run(TimerInfo myTimer, out string outputEventHubMessage, TraceWriter log)
{
    String msg = $"TimerTriggerCSharp1 executed at: {DateTime.Now}";
    log.Verbose(msg);   
    outputEventHubMessage = msg;
}
```

Here's C# script code that creates multiple messages:

```cs
public static void Run(TimerInfo myTimer, ICollector<string> outputEventHubMessage, TraceWriter log)
{
    string message = $"Event Hub message created at: {DateTime.Now}";
    log.Info(message);
    outputEventHubMessage.Add("1 " + message);
    outputEventHubMessage.Add("2 " + message);
}
```

### Output - F# example

The following example shows an event hub trigger binding in a *function.json* file and an [F# function](functions-reference-fsharp.md) that uses the binding. The function writes a message to an event hub.

Here's the binding data in the *function.json* file:

```json
{
    "type": "eventHub",
    "name": "outputEventHubMessage",
    "path": "myeventhub",
    "connection": "MyEventHubSend",
    "direction": "out"
}
```

Here's the F# code:

```fsharp
let Run(myTimer: TimerInfo, outputEventHubMessage: byref<string>, log: TraceWriter) =
    let msg = sprintf "TimerTriggerFSharp1 executed at: %s" DateTime.Now.ToString()
    log.Verbose(msg);
    outputEventHubMessage <- msg;
```

### Output - JavaScript example

The following example shows an event hub trigger binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding. The function writes a message to an event hub.

Here's the binding data in the *function.json* file:

```json
{
    "type": "eventHub",
    "name": "outputEventHubMessage",
    "path": "myeventhub",
    "connection": "MyEventHubSend",
    "direction": "out"
}
```

Here's JavaScript code that sends a single message:

```javascript
module.exports = function (context, myTimer) {
    var timeStamp = new Date().toISOString();
    context.log('Event Hub message created at: ', timeStamp);   
    context.bindings.outputEventHubMessage = "Event Hub message created at: " + timeStamp;
    context.done();
};
```

Here's JavaScript code that sends multiple messages:

```javascript
module.exports = function(context) {
    var timeStamp = new Date().toISOString();
    var message = 'Event Hub message created at: ' + timeStamp;

    context.bindings.outputEventHubMessage = [];

    context.bindings.outputEventHubMessage.push("1 " + message);
    context.bindings.outputEventHubMessage.push("2 " + message);
    context.done();
};
```

## Output - Attributes for precompiled C#

For [precompiled C#](functions-dotnet-class-library.md) functions, use the [EventHubAttribute](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs.ServiceBus/EventHubs/EventHubAttribute.cs) attribute, which is defined in NuGet package [Microsoft.Azure.WebJobs.ServiceBus](http://www.nuget.org/packages/Microsoft.Azure.WebJobs.ServiceBus).

The attribute's constructor takes the name of the event hub and the name of an app setting that contains the connection string. For more information about these settings, see [Output - configuration](#output---configuration). Here's an `EventHub` attribute example:

```csharp
[FunctionName("EventHubOutput")]
[return: EventHub("outputEventHubMessage", Connection = "EventHubConnection")]
public static string Run([TimerTrigger("0 */5 * * * *")] TimerInfo myTimer, TraceWriter log)
```

## Output - configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `EventHub` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type** | n/a | Must be set to "eventHub". |
|**direction** | n/a | Must be set to "out". This parameter is set automatically when you create the binding in the Azure portal. |
|**name** | n/a | The variable name used in function code that represents the event. | 
|**path** |**EventHubName** | The name of the event hub. | 
|**connection** |**Connection** | The name of an app setting that contains the connection string to the event hub's namespace. Copy this connection string by clicking the **Connection Information** button for the *namespace*, not the event hub itself. This connection string must have send permissions to send the message to the event stream.<br/>When you're developing locally, app settings go into the values of the [local.settings.json file](functions-run-local.md#local-settings-file).|

## Output - usage

In C# and C# script, send messages by using a method parameter such as `out string paramName`. In C# script, `paramName` is the value specified in the `name` property of *function.json*. To write multiple messages, you can use `ICollector<string>` or
`IAsyncCollector<string>` in place of `out string`.

In JavaScript, access the output event by using `context.bindings.<name>`. `<name>` is the value specified in the `name` property of *function.json*.

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure functions triggers and bindings](functions-triggers-bindings.md)
