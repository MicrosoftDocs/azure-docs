---
author: craigshoemaker
ms.service: azure-functions
ms.topic: include
ms.date: 03/05/2019
ms.author: cshoe
---

## Trigger

Use the function trigger to respond to an event sent to an event hub event stream. You must have read access to the underlying event hub to set up the trigger. When the function is triggered, the message passed to the function is typed as a string.

## Trigger - scaling

Each instance of an event triggered function is backed by a single [EventProcessorHost](https://docs.microsoft.com/dotnet/api/microsoft.azure.eventhubs.processor) instance. The trigger (powered by Event Hubs) ensures that only one [EventProcessorHost](https://docs.microsoft.com/dotnet/api/microsoft.azure.eventhubs.processor) instance can get a lease on a given partition.

For example, consider an Event Hub as follows:

* 10 partitions
* 1,000 events distributed evenly across all partitions, with 100 messages in each partition

When your function is first enabled, there is only one instance of the function. Let's call the first function instance `Function_0`. The `Function_0` function has a single instance of [EventProcessorHost](https://docs.microsoft.com/dotnet/api/microsoft.azure.eventhubs.processor) that holds a lease on all ten partitions. This instance is reading events from partitions 0-9. From this point forward, one of the following happens:

* **New function instances are not needed**: `Function_0` is able to process all 1,000 events before the Functions scaling logic take effect. In this case, all 1,000 messages are processed by `Function_0`.

* **An additional function instance is added**: If the Functions scaling logic determines that `Function_0` has more messages than it can process, a new function app instance (`Function_1`) is created. This new function also has an associated instance of [EventProcessorHost](https://docs.microsoft.com/dotnet/api/microsoft.azure.eventhubs.processor). As the underlying Event Hubs detect that a new host instance is trying read messages, it load balances the partitions across the its host instances. For example, partitions 0-4 may be assigned to `Function_0` and partitions 5-9 to `Function_1`.

* **N more function instances are added**: If the Functions scaling logic determines that both `Function_0` and `Function_1` have more messages than they can process, new `Functions_N` function app instances are created.  Apps are created to the point where `N` is greater than the number of event hub partitions. In our example, Event Hubs again load balances the partitions, in this case across the instances `Function_0`...`Functions_9`.

When Functions scales,  `N` instances is a number greater than the number of event hub partitions. This is done to ensure [EventProcessorHost](https://docs.microsoft.com/dotnet/api/microsoft.azure.eventhubs.processor) instances are available to obtain locks on partitions as they become available from other instances. You are only charged for the resources used when the function instance executes. In other words, you are not charged for this over-provisioning.

When all function execution completes (with or without errors), checkpoints are added to the associated storage account. When check-pointing succeeds, all 1,000 messages are never retrieved again.

## Trigger - example

See the language-specific example:

* [C#](#trigger---c-example)
* [C# script (.csx)](#trigger---c-script-example)
* [F#](#trigger---f-example)
* [Java](#trigger---java-example)
* [JavaScript](#trigger---javascript-example)
* [Python](#trigger---python-example)

### Trigger - C# example

The following example shows a [C# function](../articles/azure-functions/functions-dotnet-class-library.md) that logs the message body of the event hub trigger.

```csharp
[FunctionName("EventHubTriggerCSharp")]
public static void Run([EventHubTrigger("samples-workitems", Connection = "EventHubConnectionAppSetting")] string myEventHubMessage, ILogger log)
{
    log.LogInformation($"C# function triggered to process a message: {myEventHubMessage}");
}
```

To get access to [event metadata](#trigger---event-metadata) in function code, bind to an [EventData](/dotnet/api/microsoft.servicebus.messaging.eventdata) object (requires a using statement for `Microsoft.Azure.EventHubs`). You can also access the same properties by using binding expressions in the method signature.  The following example shows both ways to get the same data:

```csharp
[FunctionName("EventHubTriggerCSharp")]
public static void Run(
    [EventHubTrigger("samples-workitems", Connection = "EventHubConnectionAppSetting")] EventData myEventHubMessage,
    DateTime enqueuedTimeUtc,
    Int64 sequenceNumber,
    string offset,
    ILogger log)
{
    log.LogInformation($"Event: {Encoding.UTF8.GetString(myEventHubMessage.Body)}");
    // Metadata accessed by binding to EventData
    log.LogInformation($"EnqueuedTimeUtc={myEventHubMessage.SystemProperties.EnqueuedTimeUtc}");
    log.LogInformation($"SequenceNumber={myEventHubMessage.SystemProperties.SequenceNumber}");
    log.LogInformation($"Offset={myEventHubMessage.SystemProperties.Offset}");
    // Metadata accessed by using binding expressions in method parameters
    log.LogInformation($"EnqueuedTimeUtc={enqueuedTimeUtc}");
    log.LogInformation($"SequenceNumber={sequenceNumber}");
    log.LogInformation($"Offset={offset}");
}
```

To receive events in a batch, make `string` or `EventData` an array.  

> [!NOTE]
> When receiving in a batch you cannot bind to method parameters like in the above example with `DateTime enqueuedTimeUtc` and must receive these from each `EventData` object  

```cs
[FunctionName("EventHubTriggerCSharp")]
public static void Run([EventHubTrigger("samples-workitems", Connection = "EventHubConnectionAppSetting")] EventData[] eventHubMessages, ILogger log)
{
    foreach (var message in eventHubMessages)
    {
        log.LogInformation($"C# function triggered to process a message: {Encoding.UTF8.GetString(message.Body)}");
        log.LogInformation($"EnqueuedTimeUtc={message.SystemProperties.EnqueuedTimeUtc}");
    }
}
```

### Trigger - C# script example

The following example shows an event hub trigger binding in a *function.json* file and a [C# script function](../articles/azure-functions/functions-reference-csharp.md) that uses the binding. The function logs the message body of the event hub trigger.

The following examples show Event Hubs binding data in the *function.json* file.

#### Version 2.x

```json
{
  "type": "eventHubTrigger",
  "name": "myEventHubMessage",
  "direction": "in",
  "eventHubName": "MyEventHub",
  "connection": "myEventHubReadConnectionAppSetting"
}
```

#### Version 1.x

```json
{
  "type": "eventHubTrigger",
  "name": "myEventHubMessage",
  "direction": "in",
  "path": "MyEventHub",
  "connection": "myEventHubReadConnectionAppSetting"
}
```

Here's the C# script code:

```cs
using System;

public static void Run(string myEventHubMessage, TraceWriter log)
{
    log.Info($"C# function triggered to process a message: {myEventHubMessage}");
}
```

To get access to [event metadata](#trigger---event-metadata) in function code, bind to an [EventData](/dotnet/api/microsoft.servicebus.messaging.eventdata) object (requires a using statement for `Microsoft.Azure.EventHubs`). You can also access the same properties by using binding expressions in the method signature.  The following example shows both ways to get the same data:

```cs
#r "Microsoft.Azure.EventHubs"

using System.Text;
using System;
using Microsoft.ServiceBus.Messaging;
using Microsoft.Azure.EventHubs;

public static void Run(EventData myEventHubMessage,
    DateTime enqueuedTimeUtc,
    Int64 sequenceNumber,
    string offset,
    TraceWriter log)
{
    log.Info($"Event: {Encoding.UTF8.GetString(myEventHubMessage.Body)}");
    log.Info($"EnqueuedTimeUtc={myEventHubMessage.SystemProperties.EnqueuedTimeUtc}");
    log.Info($"SequenceNumber={myEventHubMessage.SystemProperties.SequenceNumber}");
    log.Info($"Offset={myEventHubMessage.SystemProperties.Offset}");

    // Metadata accessed by using binding expressions
    log.Info($"EnqueuedTimeUtc={enqueuedTimeUtc}");
    log.Info($"SequenceNumber={sequenceNumber}");
    log.Info($"Offset={offset}");
}
```

To receive events in a batch, make `string` or `EventData` an array:

```cs
public static void Run(string[] eventHubMessages, TraceWriter log)
{
    foreach (var message in eventHubMessages)
    {
        log.Info($"C# function triggered to process a message: {message}");
    }
}
```

### Trigger - F# example

The following example shows an event hub trigger binding in a *function.json* file and an [F# function](../articles/azure-functions/functions-reference-fsharp.md) that uses the binding. The function logs the message body of the event hub trigger.

The following examples show Event Hubs binding data in the *function.json* file. 

#### Version 2.x

```json
{
  "type": "eventHubTrigger",
  "name": "myEventHubMessage",
  "direction": "in",
  "eventHubName": "MyEventHub",
  "connection": "myEventHubReadConnectionAppSetting"
}
```

#### Version 1.x

```json
{
  "type": "eventHubTrigger",
  "name": "myEventHubMessage",
  "direction": "in",
  "path": "MyEventHub",
  "connection": "myEventHubReadConnectionAppSetting"
}
```

Here's the F# code:

```fsharp
let Run(myEventHubMessage: string, log: TraceWriter) =
    log.Log(sprintf "F# eventhub trigger function processed work item: %s" myEventHubMessage)
```

### Trigger - JavaScript example

The following example shows an event hub trigger binding in a *function.json* file and a [JavaScript function](../articles/azure-functions/functions-reference-node.md) that uses the binding. The function reads [event metadata](#trigger---event-metadata) and logs the message.

The following examples show Event Hubs binding data in the *function.json* file.

#### Version 2.x

```json
{
  "type": "eventHubTrigger",
  "name": "myEventHubMessage",
  "direction": "in",
  "eventHubName": "MyEventHub",
  "connection": "myEventHubReadConnectionAppSetting"
}
```

#### Version 1.x

```json
{
  "type": "eventHubTrigger",
  "name": "myEventHubMessage",
  "direction": "in",
  "path": "MyEventHub",
  "connection": "myEventHubReadConnectionAppSetting"
}
```

Here's the JavaScript code:

```javascript
module.exports = function (context, eventHubMessage) {
    context.log('Function triggered to process a message: ', myEventHubMessage);
    context.log('EnqueuedTimeUtc =', context.bindingData.enqueuedTimeUtc);
    context.log('SequenceNumber =', context.bindingData.sequenceNumber);
    context.log('Offset =', context.bindingData.offset);

    context.done();
};
```

To receive events in a batch, set `cardinality` to `many` in the *function.json* file, as shown in the following examples.

#### Version 2.x

```json
{
  "type": "eventHubTrigger",
  "name": "eventHubMessages",
  "direction": "in",
  "eventHubName": "MyEventHub",
  "cardinality": "many",
  "connection": "myEventHubReadConnectionAppSetting"
}
```

#### Version 1.x

```json
{
  "type": "eventHubTrigger",
  "name": "eventHubMessages",
  "direction": "in",
  "path": "MyEventHub",
  "cardinality": "many",
  "connection": "myEventHubReadConnectionAppSetting"
}
```

Here's the JavaScript code:

```javascript
module.exports = function (context, eventHubMessages) {
    context.log(`JavaScript eventhub trigger function called for message array ${eventHubMessages}`);

    eventHubMessages.forEach((message, index) => {
        context.log(`Processed message ${message}`);
        context.log(`EnqueuedTimeUtc = ${context.bindingData.enqueuedTimeUtcArray[index]}`);
        context.log(`SequenceNumber = ${context.bindingData.sequenceNumberArray[index]}`);
        context.log(`Offset = ${context.bindingData.offsetArray[index]}`);
    });

    context.done();
};
```

### Trigger - Python example

The following example shows an event hub trigger binding in a *function.json* file and a [Python function](../articles/azure-functions/functions-reference-python.md) that uses the binding. The function reads [event metadata](#trigger---event-metadata) and logs the message.

The following examples show Event Hubs binding data in the *function.json* file.

```json
{
  "type": "eventHubTrigger",
  "name": "event",
  "direction": "in",
  "eventHubName": "MyEventHub",
  "connection": "myEventHubReadConnectionAppSetting"
}
```

Here's the Python code:

```python
import logging
import azure.functions as func

def main(event: func.EventHubEvent):
    logging.info('Function triggered to process a message: ', event.get_body())
    logging.info('  EnqueuedTimeUtc =', event.enqueued_time)
    logging.info('  SequenceNumber =', event.sequence_number)
    logging.info('  Offset =', event.offset)
```

### Trigger - Java example

The following example shows an Event Hub trigger binding in a *function.json* file and an [Java function](../articles/azure-functions/functions-reference-java.md) that uses the binding. The function logs the message body of the Event Hub trigger.

```json
{
  "type": "eventHubTrigger",
  "name": "msg",
  "direction": "in",
  "eventHubName": "myeventhubname",
  "connection": "myEventHubReadConnectionAppSetting"
}
```

```java
@FunctionName("ehprocessor")
public void eventHubProcessor(
  @EventHubTrigger(name = "msg",
                  eventHubName = "myeventhubname",
                  connection = "myconnvarname") String message,
       final ExecutionContext context )
       {
          context.getLogger().info(message);
 }
```

 In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `EventHubTrigger` annotation on parameters whose value would come from Event Hub. Parameters with these annotations cause the function to run when an event arrives.  This annotation can be used with native Java types, POJOs, or nullable values using Optional<T>.

## Trigger - attributes

In [C# class libraries](../articles/azure-functions/functions-dotnet-class-library.md), use the [EventHubTriggerAttribute](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs.Extensions.EventHubs/EventHubTriggerAttribute.cs) attribute.

The attribute's constructor takes the name of the event hub, the name of the consumer group, and the name of an app setting that contains the connection string. For more information about these settings, see the [trigger configuration section](#trigger---configuration). Here's an `EventHubTriggerAttribute` attribute example:

```csharp
[FunctionName("EventHubTriggerCSharp")]
public static void Run([EventHubTrigger("samples-workitems", Connection = "EventHubConnectionAppSetting")] string myEventHubMessage, ILogger log)
{
    ...
}
```

For a complete example, see [Trigger - C# example](#trigger---c-example).

## Trigger - configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `EventHubTrigger` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type** | n/a | Must be set to `eventHubTrigger`. This property is set automatically when you create the trigger in the Azure portal.|
|**direction** | n/a | Must be set to `in`. This property is set automatically when you create the trigger in the Azure portal. |
|**name** | n/a | The name of the variable that represents the event item in function code. |
|**path** |**EventHubName** | Functions 1.x only. The name of the event hub. When the event hub name is also present in the connection string, that value overrides this property at runtime. |
|**eventHubName** |**EventHubName** | Functions 2.x only. The name of the event hub. When the event hub name is also present in the connection string, that value overrides this property at runtime. |
|**consumerGroup** |**ConsumerGroup** | An optional property that sets the [consumer group](../articles/event-hubs/event-hubs-features.md)#event-consumers) used to subscribe to events in the hub. If omitted, the `$Default` consumer group is used. |
|**cardinality** | n/a | For Javascript. Set to `many` in order to enable batching.  If omitted or set to `one`, single message passed to function. |
|**connection** |**Connection** | The name of an app setting that contains the connection string to the event hub's namespace. Copy this connection string by clicking the **Connection Information** button for the [namespace](../articles/event-hubs/event-hubs-create.md)#create-an-event-hubs-namespace), not the event hub itself. This connection string must have at least read permissions to activate the trigger.|
|**path**|**EventHubName**|The name of the event hub. Can be referenced via app settings `%eventHubName%`|

[!INCLUDE [app settings to local.settings.json](../articles/azure-functions/../../includes/functions-app-settings-local.md)]

## Trigger - event metadata

The Event Hubs trigger provides several [metadata properties](../articles/azure-functions/./functions-bindings-expressions-patterns.md). These properties can be used as part of binding expressions in other bindings or as parameters in your code. These are properties of the [EventData](https://docs.microsoft.com/dotnet/api/microsoft.servicebus.messaging.eventdata) class.

|Property|Type|Description|
|--------|----|-----------|
|`PartitionContext`|[PartitionContext](https://docs.microsoft.com/dotnet/api/microsoft.servicebus.messaging.partitioncontext)|The `PartitionContext` instance.|
|`EnqueuedTimeUtc`|`DateTime`|The enqueued time in UTC.|
|`Offset`|`string`|The offset of the data relative to the Event Hub partition stream. The offset is a marker or identifier for an event within the Event Hubs stream. The identifier is unique within a partition of the Event Hubs stream.|
|`PartitionKey`|`string`|The partition to which event data should be sent.|
|`Properties`|`IDictionary<String,Object>`|The user properties of the event data.|
|`SequenceNumber`|`Int64`|The logical sequence number of the event.|
|`SystemProperties`|`IDictionary<String,Object>`|The system properties, including the event data.|

See [code examples](#trigger---example) that use these properties earlier in this article.

## Trigger - host.json properties

The [host.json](../articles/azure-functions/functions-host-json.md#eventhub) file contains settings that control Event Hubs trigger behavior.

[!INCLUDE [functions-host-json-event-hubs](../articles/azure-functions/../../includes/functions-host-json-event-hubs.md)]

## Output

Use the Event Hubs output binding to write events to an event stream. You must have send permission to an event hub to write events to it.

Ensure the required package references are in place: Functions 1.x or Functions 2.x

## Output - example

See the language-specific example:

* [C#](#output---c-example)
* [C# script (.csx)](#output---c-script-example)
* [F#](#output---f-example)
* [Java](#output---java-example)
* [JavaScript](#output---javascript-example)
* [Python](#output---python-example)

### Output - C# example

The following example shows a [C# function](../articles/azure-functions/functions-dotnet-class-library.md) that writes a message to an event hub, using the method return value as the output:

```csharp
[FunctionName("EventHubOutput")]
[return: EventHub("outputEventHubMessage", Connection = "EventHubConnectionAppSetting")]
public static string Run([TimerTrigger("0 */5 * * * *")] TimerInfo myTimer, ILogger log)
{
    log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");
    return $"{DateTime.Now}";
}
```

The following sample shows how to use the `IAsyncCollector` interface to send a batch of messages. This scenario is common when you are processing messages coming from one Event Hub and sending the result to another Event Hub.

```csharp
[FunctionName("EH2EH")]
public static async Task Run(
    [EventHubTrigger("source", Connection = "EventHubConnectionAppSetting")] EventData[] events,
    [EventHub("dest", Connection = "EventHubConnectionAppSetting")]IAsyncCollector<string> outputEvents,
    ILogger log)
{
    foreach (EventData eventData in events)
    {
        // do some processing:
        var myProcessedEvent = DoSomething(eventData);

        // then send the message
        await outputEvents.AddAsync(JsonConvert.SerializeObject(myProcessedEvent));
    }
}
```

### Output - C# script example

The following example shows an event hub trigger binding in a *function.json* file and a [C# script function](../articles/azure-functions/functions-reference-csharp.md) that uses the binding. The function writes a message to an event hub.

The following examples show Event Hubs binding data in the *function.json* file. The first example is for Functions 2.x, and the second one is for Functions 1.x. 

```json
{
    "type": "eventHub",
    "name": "outputEventHubMessage",
    "eventHubName": "myeventhub",
    "connection": "MyEventHubSendAppSetting",
    "direction": "out"
}
```

```json
{
    "type": "eventHub",
    "name": "outputEventHubMessage",
    "path": "myeventhub",
    "connection": "MyEventHubSendAppSetting",
    "direction": "out"
}
```

Here's C# script code that creates one message:

```cs
using System;
using Microsoft.Extensions.Logging;

public static void Run(TimerInfo myTimer, out string outputEventHubMessage, ILogger log)
{
    String msg = $"TimerTriggerCSharp1 executed at: {DateTime.Now}";
    log.LogInformation(msg);   
    outputEventHubMessage = msg;
}
```

Here's C# script code that creates multiple messages:

```cs
public static void Run(TimerInfo myTimer, ICollector<string> outputEventHubMessage, ILogger log)
{
    string message = $"Message created at: {DateTime.Now}";
    log.LogInformation(message);
    outputEventHubMessage.Add("1 " + message);
    outputEventHubMessage.Add("2 " + message);
}
```

### Output - F# example

The following example shows an event hub trigger binding in a *function.json* file and an [F# function](../articles/azure-functions/functions-reference-fsharp.md) that uses the binding. The function writes a message to an event hub.

The following examples show Event Hubs binding data in the *function.json* file. The first example is for Functions 2.x, and the second one is for Functions 1.x. 

```json
{
    "type": "eventHub",
    "name": "outputEventHubMessage",
    "eventHubName": "myeventhub",
    "connection": "MyEventHubSendAppSetting",
    "direction": "out"
}
```
```json
{
    "type": "eventHub",
    "name": "outputEventHubMessage",
    "path": "myeventhub",
    "connection": "MyEventHubSendAppSetting",
    "direction": "out"
}
```

Here's the F# code:

```fsharp
let Run(myTimer: TimerInfo, outputEventHubMessage: byref<string>, log: ILogger) =
    let msg = sprintf "TimerTriggerFSharp1 executed at: %s" DateTime.Now.ToString()
    log.LogInformation(msg);
    outputEventHubMessage <- msg;
```

### Output - JavaScript example

The following example shows an event hub trigger binding in a *function.json* file and a [JavaScript function](../articles/azure-functions/functions-reference-node.md) that uses the binding. The function writes a message to an event hub.

The following examples show Event Hubs binding data in the *function.json* file. The first example is for Functions 2.x, and the second one is for Functions 1.x. 

```json
{
    "type": "eventHub",
    "name": "outputEventHubMessage",
    "eventHubName": "myeventhub",
    "connection": "MyEventHubSendAppSetting",
    "direction": "out"
}
```

```json
{
    "type": "eventHub",
    "name": "outputEventHubMessage",
    "path": "myeventhub",
    "connection": "MyEventHubSendAppSetting",
    "direction": "out"
}
```

Here's JavaScript code that sends a single message:

```javascript
module.exports = function (context, myTimer) {
    var timeStamp = new Date().toISOString();
    context.log('Message created at: ', timeStamp);   
    context.bindings.outputEventHubMessage = "Message created at: " + timeStamp;
    context.done();
};
```

Here's JavaScript code that sends multiple messages:

```javascript
module.exports = function(context) {
    var timeStamp = new Date().toISOString();
    var message = 'Message created at: ' + timeStamp;

    context.bindings.outputEventHubMessage = [];

    context.bindings.outputEventHubMessage.push("1 " + message);
    context.bindings.outputEventHubMessage.push("2 " + message);
    context.done();
};
```

### Output - Python example

The following example shows an event hub trigger binding in a *function.json* file and a [Python function](../articles/azure-functions/functions-reference-python.md) that uses the binding. The function writes a message to an event hub.

The following examples show Event Hubs binding data in the *function.json* file.

```json
{
    "type": "eventHub",
    "name": "$return",
    "eventHubName": "myeventhub",
    "connection": "MyEventHubSendAppSetting",
    "direction": "out"
}
```

Here's Python code that sends a single message:

```python
import datetime
import logging
import azure.functions as func

def main(timer: func.TimerRequest) -> str:
    timestamp = datetime.datetime.utcnow()
    logging.info('Message created at: %s', timestamp);   
    return 'Message created at: {}'.format(timestamp)
```

### Output - Java example

The following example shows a Java function that writes a message contianing the current time to an Event Hub.

```java
@}FunctionName("sendTime")
@EventHubOutput(name = "event", eventHubName = "samples-workitems", connection = "AzureEventHubConnection")
public String sendTime(
   @TimerTrigger(name = "sendTimeTrigger", schedule = "0 *&#47;5 * * * *") String timerInfo)  {
     return LocalDateTime.now().toString();
 }
```

In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `@EventHubOutput` annotation on parameters whose value would be published to Event Hub.  The parameter should be of type `OutputBinding<T>` , where T is a POJO or any native Java type.

## Output - attributes

For [C# class libraries](../articles/azure-functions/functions-dotnet-class-library.md), use the [EventHubAttribute](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs.ServiceBus/EventHubs/EventHubAttribute.cs) attribute.

The attribute's constructor takes the name of the event hub and the name of an app setting that contains the connection string. For more information about these settings, see [Output - configuration](#output---configuration). Here's an `EventHub` attribute example:

```csharp
[FunctionName("EventHubOutput")]
[return: EventHub("outputEventHubMessage", Connection = "EventHubConnectionAppSetting")]
public static string Run([TimerTrigger("0 */5 * * * *")] TimerInfo myTimer, ILogger log)
{
    ...
}
```

For a complete example, see [Output - C# example](#output---c-example).

## Output - configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `EventHub` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type** | n/a | Must be set to "eventHub". |
|**direction** | n/a | Must be set to "out". This parameter is set automatically when you create the binding in the Azure portal. |
|**name** | n/a | The variable name used in function code that represents the event. |
|**path** |**EventHubName** | Functions 1.x only. The name of the event hub. When the event hub name is also present in the connection string, that value overrides this property at runtime. |
|**eventHubName** |**EventHubName** | Functions 2.x only. The name of the event hub. When the event hub name is also present in the connection string, that value overrides this property at runtime. |
|**connection** |**Connection** | The name of an app setting that contains the connection string to the event hub's namespace. Copy this connection string by clicking the **Connection Information** button for the *namespace*, not the event hub itself. This connection string must have send permissions to send the message to the event stream.|

[!INCLUDE [app settings to local.settings.json](../articles/azure-functions/../../includes/functions-app-settings-local.md)]

## Output - usage

In C# and C# script, send messages by using a method parameter such as `out string paramName`. In C# script, `paramName` is the value specified in the `name` property of *function.json*. To write multiple messages, you can use `ICollector<string>` or
`IAsyncCollector<string>` in place of `out string`.

In JavaScript, access the output event by using `context.bindings.<name>`. `<name>` is the value specified in the `name` property of *function.json*.

## Exceptions and return codes

| Binding | Reference |
|---|---|
| Event Hub | [Operations Guide](https://docs.microsoft.com/rest/api/eventhub/publisher-policy-operations) |

<a name="host-json"></a>  

## host.json settings

This section describes the global configuration settings available for this binding in version 2.x. The example host.json file below contains only the version 2.x settings for this binding. For more information about global configuration settings in version 2.x, see [host.json reference for Azure Functions version 2.x](../articles/azure-functions/functions-host-json.md).

> [!NOTE]
> For a reference of host.json in Functions 1.x, see [host.json reference for Azure Functions 1.x](../articles/azure-functions/functions-host-json-v1.md).

```json
{
    "version": "2.0",
    "extensions": {
        "eventHubs": {
            "batchCheckpointFrequency": 5,
            "eventProcessorOptions": {
                "maxBatchSize": 256,
                "prefetchCount": 512
            }
        }
    }
}  
```

|Property  |Default | Description |
|---------|---------|---------|
|maxBatchSize|64|The maximum event count received per receive loop.|
|prefetchCount|n/a|The default PrefetchCount that will be used by the underlying EventProcessorHost.|
|batchCheckpointFrequency|1|The number of event batches to process before creating an EventHub cursor checkpoint.|