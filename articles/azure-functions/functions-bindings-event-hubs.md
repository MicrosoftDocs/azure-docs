---
title: Azure Functions Event Hub bindings | Microsoft Docs
description: Understand how to use Azure Event Hub bindings in Azure Functions.
services: functions
documentationcenter: na
author: wesmc7777
manager: erikre
editor: ''
tags: ''
keywords: azure functions, functions, event processing, dynamic compute, serverless architecture

ms.assetid: daf81798-7acc-419a-bc32-b5a41c6db56b
ms.service: functions
ms.devlang: multiple
ms.topic: reference
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 11/02/2016
ms.author: wesmc

---
# Azure Functions Event Hub bindings
[!INCLUDE [functions-selector-bindings](../../includes/functions-selector-bindings.md)]

This article explains how to configure and code [Azure Event Hub](../event-hubs/event-hubs-what-is-event-hubs.md) bindings for Azure Functions.
Azure Functions supports trigger and output bindings for Event Hubs.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

If you are new to Azure Event Hubs, see the [Azure Event Hub overview](../event-hubs/event-hubs-what-is-event-hubs.md).

<a name="trigger"></a>

## Event Hub trigger
Use the Event Hub trigger to respond to an event sent to an event hub event stream. You must have read access to the event hub to set up the trigger.

The Event Hub trigger to a function uses the following JSON object in the `bindings` array of function.json:

```json
{
    "type": "eventHubTrigger",
    "name": "<Name of trigger parameter in function signature>",
    "direction": "in",
    "path": "<Name of the Event Hub>",
    "consumerGroup": "Consumer group to use - see below",
    "connection": "<Name of app setting with connection string - see below>"
}
```

`consumerGroup` is an optional property used to set the [consumer group](../event-hubs/event-hubs-what-is-event-hubs.md#event-consumers)
used to subscribe to events in the hub. If omitted, the `$Default` consumer group is used.  
`connection` must be the name of an app setting that contains the connection string to the event hub's namespace.
Copy this connection string by clicking the **Connection Information** button for the *namespace*, not the event hub
itself. This connection string must have at least read permissions to activate the trigger.

[Additional settings](https://github.com/Azure/azure-webjobs-sdk-script/wiki/host.json) can be provided in a host.json file to further fine tune Event Hub triggers.  

<a name="triggerusage"></a>

## Trigger usage
When an Event Hub trigger function is triggered, the message that triggers it is passed into the function as a string.

<a name="triggersample"></a>

## Trigger sample
Suppose you have the following Event Hub trigger in the `bindings` array of function.json:

```json
{
  "type": "eventHubTrigger",
  "name": "myEventHubMessage",
  "direction": "in",
  "path": "MyEventHub",
  "connection": "myEventHubReadConnectionString"
}
```

See the language-specific sample that logs the message body of the event hub trigger.

* [C#](#triggercsharp)
* [F#](#triggerfsharp)
* [Node.js](#triggernodejs)

<a name="triggercsharp"></a>

### Trigger sample in C# #

```cs
using System;

public static void Run(string myEventHubMessage, TraceWriter log)
{
    log.Info($"C# Event Hub trigger function processed a message: {myEventHubMessage}");
}
```

You can also receive the event as an [EventData](/dotnet/api/microsoft.servicebus.messaging.eventdata) object, which gives you access to the event metadata.

```cs
#r "Microsoft.ServiceBus"
using System.Text;
using Microsoft.ServiceBus.Messaging;

public static void Run(EventData myEventHubMessage, TraceWriter log)
{
    log.Info($"{Encoding.UTF8.GetString(myEventHubMessage.GetBytes())}");
}
```

To receive events in a batch, change the method signature to `string[]` or `EventData[]`.

```cs
public static void Run(string[] eventHubMessages, TraceWriter log)
{
    foreach (var message in eventHubMessages)
    {
        log.Info($"C# Event Hub trigger function processed a message: {message}");
    }
}
```

<a name="triggerfsharp"></a>

### Trigger sample in F# #

```fsharp
let Run(myEventHubMessage: string, log: TraceWriter) =
    log.Info(sprintf "F# eventhub trigger function processed work item: %s" myEventHubMessage)
```

<a name="triggernodejs"></a>

### Trigger sample in Node.js

```javascript
module.exports = function (context, myEventHubMessage) {
    context.log('Node.js eventhub trigger function processed work item', myEventHubMessage);    
    context.done();
};
```

<a name="output"></a>

## Event Hub output binding
Use the Event Hub output binding to write events to an event hub event stream. You must have send permission to an
event hub to write events to it.

The output binding uses the following JSON object in the `bindings` array of function.json:

```json
{
    "type": "eventHub",
    "name": "<Name of output parameter in function signature>",
    "path": "<Name of event hub>",
    "connection": "<Name of app setting with connection string - see below>"
    "direction": "out"
}
```

`connection` must be the name of an app setting that contains the connection string to the event hub's namespace.
Copy this connection string by clicking the **Connection Information** button for the *namespace*, not the event hub
itself. This connection string must have send permissions to send the message to the event stream.

## Output usage
This section shows you how to use your Event Hub output binding in your function code.

You can output messages to the configured event hub with the following parameter types:

* `out string`
* `ICollector<string>` (to output multiple messages)
* `IAsyncCollector<string>` (async version of `ICollector<T>`)

<a name="outputsample"></a>

## Output sample
Suppose you have the following Event Hub output binding in the `bindings` array of function.json:

```json
{
    "type": "eventHub",
    "name": "outputEventHubMessage",
    "path": "myeventhub",
    "connection": "MyEventHubSend",
    "direction": "out"
}
```

See the language-specific sample that writes an event to the even stream.

* [C#](#outcsharp)
* [F#](#outfsharp)
* [Node.js](#outnodejs)

<a name="outcsharp"></a>

### Output sample in C# #

```cs
using System;

public static void Run(TimerInfo myTimer, out string outputEventHubMessage, TraceWriter log)
{
    String msg = $"TimerTriggerCSharp1 executed at: {DateTime.Now}";
    log.Verbose(msg);   
    outputEventHubMessage = msg;
}
```

Or, to create multiple messages:

```cs
public static void Run(TimerInfo myTimer, ICollector<string> outputEventHubMessage, TraceWriter log)
{
    string message = $"Event Hub message created at: {DateTime.Now}";
    log.Info(message);
    outputEventHubMessage.Add("1 " + message);
    outputEventHubMessage.Add("2 " + message);
}
```

<a name="outfsharp"></a>

### Output sample in F# #

```fsharp
let Run(myTimer: TimerInfo, outputEventHubMessage: byref<string>, log: TraceWriter) =
    let msg = sprintf "TimerTriggerFSharp1 executed at: %s" DateTime.Now.ToString()
    log.Verbose(msg);
    outputEventHubMessage <- msg;
```

<a name="outnodejs"></a>

### Output sample for Node.js

```javascript
module.exports = function (context, myTimer) {
    var timeStamp = new Date().toISOString();
    context.log('Event Hub message created at: ', timeStamp);   
    context.bindings.outputEventHubMessage = "Event Hub message created at: " + timeStamp;
    context.done();
};
```

Or, to send multiple messages,

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

## Next steps
[!INCLUDE [next steps](../../includes/functions-bindings-next-steps.md)]
