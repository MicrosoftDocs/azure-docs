---
title: Azure Event Grid output binding for Azure Functions
description: Learn to send an Event Grid event in Azure Functions.
author: craigshoemaker

ms.topic: reference
ms.date: 02/14/2020
ms.author: cshoe
ms.custom: fasttrack-edit, tracking-python
---

# Azure Event Grid output binding for Azure Functions

Use the Event Grid output binding to write events to a custom topic. You must have a valid [access key for the custom topic](../event-grid/security-authentication.md#authenticate-publishing-clients-using-sas-or-key).

For information on setup and configuration details, see the [overview](./functions-bindings-event-grid.md).

> [!NOTE]
> The Event Grid output binding does not support shared access signatures (SAS tokens). You must use the topic's access key.

> [!IMPORTANT]
> The Event Grid output binding is only available for Functions 2.x and higher.

## Example

# [C#](#tab/csharp)

The following example shows a [C# function](functions-dotnet-class-library.md) that writes a message to an Event Grid custom topic, using the method return value as the output:

```csharp
[FunctionName("EventGridOutput")]
[return: EventGrid(TopicEndpointUri = "MyEventGridTopicUriSetting", TopicKeySetting = "MyEventGridTopicKeySetting")]
public static EventGridEvent Run([TimerTrigger("0 */5 * * * *")] TimerInfo myTimer, ILogger log)
{
    return new EventGridEvent("message-id", "subject-name", "event-data", "event-type", DateTime.UtcNow, "1.0");
}
```

The following example shows how to use the `IAsyncCollector` interface to send a batch of messages.

```csharp
[FunctionName("EventGridAsyncOutput")]
public static async Task Run(
    [TimerTrigger("0 */5 * * * *")] TimerInfo myTimer,
    [EventGrid(TopicEndpointUri = "MyEventGridTopicUriSetting", TopicKeySetting = "MyEventGridTopicKeySetting")]IAsyncCollector<EventGridEvent> outputEvents,
    ILogger log)
{
    for (var i = 0; i < 3; i++)
    {
        var myEvent = new EventGridEvent("message-id-" + i, "subject-name", "event-data", "event-type", DateTime.UtcNow, "1.0");
        await outputEvents.AddAsync(myEvent);
    }
}
```

# [C# Script](#tab/csharp-script)

The following example shows the Event Grid output binding data in the *function.json* file.

```json
{
    "type": "eventGrid",
    "name": "outputEvent",
    "topicEndpointUri": "MyEventGridTopicUriSetting",
    "topicKeySetting": "MyEventGridTopicKeySetting",
    "direction": "out"
}
```

Here's C# script code that creates one event:

```cs
#r "Microsoft.Azure.EventGrid"
using System;
using Microsoft.Azure.EventGrid.Models;
using Microsoft.Extensions.Logging;

public static void Run(TimerInfo myTimer, out EventGridEvent outputEvent, ILogger log)
{
    outputEvent = new EventGridEvent("message-id", "subject-name", "event-data", "event-type", DateTime.UtcNow, "1.0");
}
```

Here's C# script code that creates multiple events:

```cs
#r "Microsoft.Azure.EventGrid"
using System;
using Microsoft.Azure.EventGrid.Models;
using Microsoft.Extensions.Logging;

public static void Run(TimerInfo myTimer, ICollector<EventGridEvent> outputEvent, ILogger log)
{
    outputEvent.Add(new EventGridEvent("message-id-1", "subject-name", "event-data", "event-type", DateTime.UtcNow, "1.0"));
    outputEvent.Add(new EventGridEvent("message-id-2", "subject-name", "event-data", "event-type", DateTime.UtcNow, "1.0"));
}
```

# [JavaScript](#tab/javascript)

The following example shows the Event Grid output binding data in the *function.json* file.

```json
{
    "type": "eventGrid",
    "name": "outputEvent",
    "topicEndpointUri": "MyEventGridTopicUriSetting",
    "topicKeySetting": "MyEventGridTopicKeySetting",
    "direction": "out"
}
```

Here's JavaScript code that creates a single event:

```javascript
module.exports = async function (context, myTimer) {
    var timeStamp = new Date().toISOString();

    context.bindings.outputEvent = {
        id: 'message-id',
        subject: 'subject-name',
        dataVersion: '1.0',
        eventType: 'event-type',
        data: "event-data",
        eventTime: timeStamp
    };
    context.done();
};
```

Here's JavaScript code that creates multiple events:

```javascript
module.exports = function(context) {
    var timeStamp = new Date().toISOString();

    context.bindings.outputEvent = [];

    context.bindings.outputEvent.push({
        id: 'message-id-1',
        subject: 'subject-name',
        dataVersion: '1.0',
        eventType: 'event-type',
        data: "event-data",
        eventTime: timeStamp
    });
    context.bindings.outputEvent.push({
        id: 'message-id-2',
        subject: 'subject-name',
        dataVersion: '1.0',
        eventType: 'event-type',
        data: "event-data",
        eventTime: timeStamp
    });
    context.done();
};
```

# [Python](#tab/python)

The following example shows a trigger binding in a *function.json* file and a [Python function](functions-reference-python.md) that uses the binding. It then sends in an event to the custom Event Grid topic, as specified by the `topicEndpointUri`.

Here's the binding data in the *function.json* file:

```json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "type": "eventGridTrigger",
      "name": "eventGridEvent",
      "direction": "in"
    },
    {
      "type": "eventGrid",
      "name": "outputEvent",
      "topicEndpointUri": "MyEventGridTopicUriSetting",
      "topicKeySetting": "MyEventGridTopicKeySetting",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

Here's the Python sample to send a event to a custom Event Grid topic by setting the `EventGridOutputEvent`:

```python
import logging
import azure.functions as func
import datetime


def main(eventGridEvent: func.EventGridEvent, 
         outputEvent: func.Out[func.EventGridOutputEvent]) -> None:

    logging.log("eventGridEvent: ", eventGridEvent)

    outputEvent.set(
        func.EventGridOutputEvent(
            id="test-id",
            data={"tag1": "value1", "tag2": "value2"},
            subject="test-subject",
            event_type="test-event-1",
            event_time=datetime.datetime.utcnow(),
            data_version="1.0"))
```

# [Java](#tab/java)

The Event Grid output binding is not available for Java.

---

## Attributes and annotations

# [C#](#tab/csharp)

For [C# class libraries](functions-dotnet-class-library.md), use the [EventGridAttribute](https://github.com/Azure/azure-functions-eventgrid-extension/blob/dev/src/EventGridExtension/OutputBinding/EventGridAttribute.cs) attribute.

The attribute's constructor takes the name of an app setting that contains the name of the custom topic, and the name of an app setting that contains the topic key. For more information about these settings, see [Output - configuration](#configuration). Here's an `EventGrid` attribute example:

```csharp
[FunctionName("EventGridOutput")]
[return: EventGrid(TopicEndpointUri = "MyEventGridTopicUriSetting", TopicKeySetting = "MyEventGridTopicKeySetting")]
public static string Run([TimerTrigger("0 */5 * * * *")] TimerInfo myTimer, ILogger log)
{
    ...
}
```

For a complete example, see [example](#example).

# [C# Script](#tab/csharp-script)

Attributes are not supported by C# Script.

# [JavaScript](#tab/javascript)

Attributes are not supported by JavaScript.

# [Python](#tab/python)

The Event Grid output binding is not available for Python.

# [Java](#tab/java)

The Event Grid output binding is not available for Java.

---

## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `EventGrid` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type** | n/a | Must be set to "eventGrid". |
|**direction** | n/a | Must be set to "out". This parameter is set automatically when you create the binding in the Azure portal. |
|**name** | n/a | The variable name used in function code that represents the event. |
|**topicEndpointUri** |**TopicEndpointUri** | The name of an app setting that contains the URI for the custom topic, such as `MyTopicEndpointUri`. |
|**topicKeySetting** |**TopicKeySetting** | The name of an app setting that contains an access key for the custom topic. |

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

> [!IMPORTANT]
> Ensure that you set the value of the `TopicEndpointUri` configuration property to the name of an app setting that contains the URI of the custom topic. Do not specify the URI of the custom topic directly in this property.

## Usage

# [C#](#tab/csharp)

Send messages by using a method parameter such as `out EventGridEvent paramName`. To write multiple messages, you can use `ICollector<EventGridEvent>` or
`IAsyncCollector<EventGridEvent>` in place of `out EventGridEvent`.

# [C# Script](#tab/csharp-script)

Send messages by using a method parameter such as `out EventGridEvent paramName`. In C# script, `paramName` is the value specified in the `name` property of *function.json*. To write multiple messages, you can use `ICollector<EventGridEvent>` or
`IAsyncCollector<EventGridEvent>` in place of `out EventGridEvent`.

# [JavaScript](#tab/javascript)

Access the output event by using `context.bindings.<name>` where `<name>` is the value specified in the `name` property of *function.json*.

# [Python](#tab/python)

The Event Grid output binding is not available for Python.

# [Java](#tab/java)

The Event Grid output binding is not available for Java.

---

## Next steps

* [Dispatch an Event Grid event](./functions-bindings-event-grid-trigger.md)
