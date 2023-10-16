---
title: Azure Event Grid trigger for Azure Functions
description: Learn to run code when Event Grid events in Azure Functions are dispatched.
ms.topic: reference
ms.date: 04/02/2023
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: devx-track-csharp, fasttrack-edit, devx-track-python, devx-track-extended-java, devx-track-js
zone_pivot_groups: programming-languages-set-functions
---

# Azure Event Grid trigger for Azure Functions

Use the function trigger to respond to an event sent by an [Event Grid source](../event-grid/overview.md). You must have an event subscription to the source to receive events. To learn how to create an event subscription, see [Create a subscription](event-grid-how-tos.md#create-a-subscription). For information on binding setup and configuration, see the [overview](./functions-bindings-event-grid.md).

> [!NOTE]
> Event Grid triggers aren't natively supported in an internal load balancer App Service Environment (ASE). The trigger uses an HTTP request that can't reach the function app without a gateway into the virtual network.

::: zone pivot="programming-language-javascript,programming-language-typescript"
[!INCLUDE [functions-nodejs-model-tabs-description](../../includes/functions-nodejs-model-tabs-description.md)]
::: zone-end
::: zone pivot="programming-language-python"
Azure Functions supports two programming models for Python. The way that you define your bindings depends on your chosen programming model.

# [v2](#tab/python-v2)
The Python v2 programming model lets you define bindings using decorators directly in your Python function code. For more information, see the [Python developer guide](functions-reference-python.md?pivots=python-mode-decorators#programming-model).

# [v1](#tab/python-v1)
The Python v1 programming model requires you to define bindings in a separate *function.json* file in the function folder. For more information, see the [Python developer guide](functions-reference-python.md?pivots=python-mode-configuration#programming-model).

---

This article supports both programming models.

::: zone-end

## Example

::: zone pivot="programming-language-csharp"

For an HTTP trigger example, see [Receive events to an HTTP endpoint](../event-grid/receive-events.md). 

The type of the input parameter used with an Event Grid trigger depends on these three factors:

+ Functions runtime version
+ Binding extension version
+ Modality of the C# function. 

[!INCLUDE [functions-bindings-csharp-intro](../../includes/functions-bindings-csharp-intro.md)]

# [Isolated worker model](#tab/isolated-process)

When running your C# function in an isolated worker process, you need to define a custom type for event properties. The following example defines a `MyEventType` class.

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/EventGrid/EventGridFunction.cs" range="35-49":::

The following example shows how the custom type is used in both the trigger and an Event Grid output binding:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/EventGrid/EventGridFunction.cs" range="11-33":::

# [In-process model](#tab/in-process)

The following example shows a Functions version 4.x function that uses a `CloudEvent`  binding parameter:

```cs
using Azure.Messaging;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.EventGrid;
using Microsoft.Extensions.Logging;

namespace Company.Function
{
    public static class CloudEventTriggerFunction
    {
        [FunctionName("CloudEventTriggerFunction")]
        public static void Run(
            ILogger logger,
            [EventGridTrigger] CloudEvent e)
        {
            logger.LogInformation("Event received {type} {subject}", e.Type, e.Subject);
        }
    }
}
```

The following example shows a Functions version 4.x function that uses an `EventGridEvent` binding parameter:

```cs
using Microsoft.Azure.WebJobs;
using Azure.Messaging.EventGrid;
using Microsoft.Azure.WebJobs.Extensions.EventGrid;
using Microsoft.Extensions.Logging;

namespace Company.Function
{
    public static class EventGridTriggerDemo
    {
        [FunctionName("EventGridTriggerDemo")]
        public static void Run([EventGridTrigger] EventGridEvent eventGridEvent, ILogger log)
        {
            log.LogInformation(eventGridEvent.Data.ToString());
        }
    }
}
```

The following example shows a function that uses a  `JObject`  binding parameter:

```cs
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.EventGrid;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Microsoft.Extensions.Logging;

namespace Company.Function
{
    public static class EventGridTriggerCSharp
    {
        [FunctionName("EventGridTriggerCSharp")]
        public static void Run([EventGridTrigger] JObject eventGridEvent, ILogger log)
        {
            log.LogInformation(eventGridEvent.ToString(Formatting.Indented));
        }
    }
}
```
---

::: zone-end
::: zone pivot="programming-language-java"

This section contains the following examples:

* [Event Grid trigger, String parameter](#event-grid-trigger-string-parameter)
* [Event Grid trigger, POJO parameter](#event-grid-trigger-pojo-parameter)

The following examples show trigger binding in [Java](functions-reference-java.md) that use the binding and generate an event, first receiving the event as `String` and second as a POJO.

### Event Grid trigger, String parameter

```java
  @FunctionName("eventGridMonitorString")
  public void logEvent(
    @EventGridTrigger(
      name = "event"
    )
    String content,
    final ExecutionContext context) {
      context.getLogger().info("Event content: " + content);
  }
```

### Event Grid trigger, POJO parameter

This example uses the following POJO, representing the top-level properties of an Event Grid event:

```java
import java.util.Date;
import java.util.Map;

public class EventSchema {

  public String topic;
  public String subject;
  public String eventType;
  public Date eventTime;
  public String id;
  public String dataVersion;
  public String metadataVersion;
  public Map<String, Object> data;

}
```

Upon arrival, the event's JSON payload is de-serialized into the ```EventSchema``` POJO for use by the function. This process allows the function to access the event's properties in an object-oriented way.

```java
  @FunctionName("eventGridMonitor")
  public void logEvent(
    @EventGridTrigger(
      name = "event"
    )
    EventSchema event,
    final ExecutionContext context) {
      context.getLogger().info("Event content: ");
      context.getLogger().info("Subject: " + event.subject);
      context.getLogger().info("Time: " + event.eventTime); // automatically converted to Date by the runtime
      context.getLogger().info("Id: " + event.id);
      context.getLogger().info("Data: " + event.data);
  }
```

In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `EventGridTrigger` annotation on parameters whose value would come from Event Grid. Parameters with these annotations cause the function to run when an event arrives.  This annotation can be used with native Java types, POJOs, or nullable values using `Optional<T>`.
::: zone-end  
::: zone pivot="programming-language-typescript"  

# [Model v4](#tab/nodejs-v4)

The following example shows an event grid trigger [TypeScript function](functions-reference-node.md?tabs=typescript).

:::code language="typescript" source="~/azure-functions-nodejs-v4/ts/src/functions/eventGridTrigger1.ts" :::

# [Model v3](#tab/nodejs-v3)

TypeScript samples are not documented for model v3.

---

::: zone-end
::: zone pivot="programming-language-javascript"  

# [Model v4](#tab/nodejs-v4)

The following example shows an event grid trigger [JavaScript function](functions-reference-node.md).

:::code language="javascript" source="~/azure-functions-nodejs-v4/js/src/functions/eventGridTrigger1.js" :::

# [Model v3](#tab/nodejs-v3)

The following example shows a trigger binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding.

Here's the binding data in the *function.json* file:

```json
{
  "bindings": [
    {
      "type": "eventGridTrigger",
      "name": "eventGridEvent",
      "direction": "in"
    }
  ],
  "disabled": false
}
```

Here's the JavaScript code:

```javascript
module.exports = async function (context, eventGridEvent) {
    context.log("JavaScript Event Grid function processed a request.");
    context.log("Subject: " + eventGridEvent.subject);
    context.log("Time: " + eventGridEvent.eventTime);
    context.log("Data: " + JSON.stringify(eventGridEvent.data));
};
```

---

::: zone-end  
::: zone pivot="programming-language-powershell"  

The following example shows how to configure an Event Grid trigger binding in the *function.json* file.

```powershell
{
  "bindings": [
    {
      "type": "eventGridTrigger",
      "name": "eventGridEvent",
      "direction": "in"
    }
  ]
}
```

The Event Grid event is made available to the function via a parameter named `eventGridEvent`, as shown in the following PowerShell example.

```powershell
param($eventGridEvent, $TriggerMetadata)

# Make sure to pass hashtables to Out-String so they're logged correctly
$eventGridEvent | Out-String | Write-Host
```
::: zone-end  
::: zone pivot="programming-language-python"  
The following example shows an Event Grid trigger binding and a Python function that uses the binding. The example depends on whether you use the [v1 or v2 Python programming model](functions-reference-python.md).

# [v2](#tab/python-v2)

```python
import logging
import json
import azure.functions as func

app = func.FunctionApp()

@app.function_name(name="eventGridTrigger")
@app.event_grid_trigger(arg_name="event")
def eventGridTest(event: func.EventGridEvent):
    result = json.dumps({
        'id': event.id,
        'data': event.get_json(),
        'topic': event.topic,
        'subject': event.subject,
        'event_type': event.event_type,
    })

    logging.info('Python EventGrid trigger processed an event: %s', result)
```

# [v1](#tab/python-v1)

Here's the binding data in the *function.json* file:

```json
{
  "bindings": [
    {
      "type": "eventGridTrigger",
      "name": "event",
      "direction": "in"
    }
  ],
  "disabled": false,
  "scriptFile": "__init__.py"
}
```

Here's the Python code:

```python
import json
import logging

import azure.functions as func

def main(event: func.EventGridEvent):

    result = json.dumps({
        'id': event.id,
        'data': event.get_json(),
        'topic': event.topic,
        'subject': event.subject,
        'event_type': event.event_type,
    })

    logging.info('Python EventGrid trigger processed an event: %s', result)
```

---
::: zone-end  
::: zone pivot="programming-language-csharp"
## Attributes

Both [in-process](functions-dotnet-class-library.md) and [isolated worker process](dotnet-isolated-process-guide.md) C# libraries use the [EventGridTrigger](https://github.com/Azure/azure-functions-eventgrid-extension/blob/master/src/EventGridExtension/TriggerBinding/EventGridTriggerAttribute.cs) attribute. C# script instead uses a function.json configuration file as described in the [C# scripting guide](./functions-reference-csharp.md#event-grid-trigger).

# [Isolated worker model](#tab/isolated-process)

Here's an `EventGridTrigger` attribute in a method signature:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/EventGrid/EventGridFunction.cs" range="13-16":::

# [In-process model](#tab/in-process)

Here's an `EventGridTrigger` attribute in a method signature:

```csharp
[FunctionName("EventGridTest")]
public static void EventGridTest([EventGridTrigger] JObject eventGridEvent, ILogger log)
{
```
---

::: zone-end  
::: zone pivot="programming-language-java"  
## Annotations

The [EventGridTrigger](/java/api/com.microsoft.azure.functions.annotation.eventgridtrigger) annotation allows you to declaratively configure an Event Grid binding by providing configuration values. See the [example](#example) and [configuration](#configuration) sections for more detail.
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"  
## Configuration

# [Model v4](#tab/nodejs-v4)

The `options` object passed to the `app.eventGrid()` method currently doesn't support any properties for model v4.

# [Model v3](#tab/nodejs-v3)

The following table explains the binding configuration properties that you set in the *function.json* file.

| Property | Description |
|---------|---------|
| **type** | Required - must be set to `eventGridTrigger`. |
| **direction** | Required - must be set to `in`. |
| **name** | Required - the variable name used in function code for the parameter that receives the event data. |

---

::: zone-end  
::: zone pivot="programming-language-powershell,programming-language-python"  
## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file. There are no constructor parameters or properties to set in the `EventGridTrigger` attribute.

|function.json property |Description|
|---------|---------|
| **type** | Required - must be set to `eventGridTrigger`. |
| **direction** | Required - must be set to `in`. |
| **name** | Required - the variable name used in function code for the parameter that receives the event data. |
::: zone-end  

See the [Example section](#example) for complete examples.

## Usage

The Event Grid trigger uses a webhook HTTP request, which can be configured using the same [*host.json* settings as the HTTP Trigger](functions-bindings-http-webhook.md#hostjson-settings).

::: zone pivot="programming-language-csharp"  
The parameter type supported by the Event Grid trigger depends on the Functions runtime version, the extension package version, and the C# modality used. 

# [Extension v3.x](#tab/extensionv3/in-process)

In-process C# class library functions supports the following types:

+ [Azure.Messaging.CloudEvent][CloudEvent]
+ [Azure.Messaging.EventGrid][EventGridEvent2]
+ [Newtonsoft.Json.Linq.JObject][JObject]
+ [System.String][String]

# [Extension v2.x](#tab/extensionv2/in-process)

In-process C# class library functions supports the following types:

+ [Microsoft.Azure.EventGrid.Models.EventGridEvent][EventGridEvent]
+ [Newtonsoft.Json.Linq.JObject][JObject]
+ [System.String][String]

# [Functions 1.x](#tab/functionsv1/in-process)

In-process C# class library functions supports the following types:

+ [Newtonsoft.Json.Linq.JObject][JObject]
+ [System.String][String]

# [Extension v3.x](#tab/extensionv3/isolated-process)

[!INCLUDE [functions-bindings-event-grid-trigger-dotnet-isolated-types](../../includes/functions-bindings-event-grid-trigger-dotnet-isolated-types.md)]

# [Extension v2.x](#tab/extensionv2/isolated-process)

Requires you to define a custom type, or use a string. See the [Example section](#example) for examples of using a custom parameter type.

# [Functions 1.x](#tab/functionsv1/isolated-process)

Functions version 1.x doesn't support the isolated worker process. 

---

::: zone-end  
::: zone pivot="programming-language-java"
The Event Grid event instance is available via the parameter associated to the `EventGridTrigger` attribute, typed as an `EventSchema`. 
::: zone-end  
::: zone pivot="programming-language-powershell"  
The Event Grid instance is available via the parameter configured in the *function.json* file's `name` property.
::: zone-end  
::: zone pivot="programming-language-python"  
The Event Grid instance is available via the parameter configured in the *function.json* file's `name` property, typed as `func.EventGridEvent`.
::: zone-end 

## Event schema

Data for an Event Grid event is received as a JSON object in the body of an HTTP request. The JSON looks similar to the following example:

```json
[{
  "topic": "/subscriptions/{subscriptionid}/resourceGroups/eg0122/providers/Microsoft.Storage/storageAccounts/egblobstore",
  "subject": "/blobServices/default/containers/{containername}/blobs/blobname.jpg",
  "eventType": "Microsoft.Storage.BlobCreated",
  "eventTime": "2018-01-23T17:02:19.6069787Z",
  "id": "{guid}",
  "data": {
    "api": "PutBlockList",
    "clientRequestId": "{guid}",
    "requestId": "{guid}",
    "eTag": "0x8D562831044DDD0",
    "contentType": "application/octet-stream",
    "contentLength": 2248,
    "blobType": "BlockBlob",
    "url": "https://egblobstore.blob.core.windows.net/{containername}/blobname.jpg",
    "sequencer": "000000000000272D000000000003D60F",
    "storageDiagnostics": {
      "batchId": "{guid}"
    }
  },
  "dataVersion": "",
  "metadataVersion": "1"
}]
```

The example shown is an array of one element. Event Grid always sends an array and may send more than one event in the array. The runtime invokes your function once for each array element.

The top-level properties in the event JSON data are the same among all event types, while the contents of the `data` property are specific to each event type. The example shown is for a blob storage event.

For explanations of the common and event-specific properties, see [Event properties](../event-grid/event-schema.md#event-properties) in the Event Grid documentation.

## Next steps

* If you have questions, submit an issue to the team [here](https://github.com/Azure/azure-functions-eventgrid-extension/issues)
* [Dispatch an Event Grid event](./functions-bindings-event-grid-output.md)

[EventGridEvent]: /dotnet/api/microsoft.azure.eventgrid.models.eventgridevent
[EventGridEvent2]: /dotnet/api/azure.messaging.eventgrid.eventgridevent
[CloudEvent]: /dotnet/api/azure.messaging.cloudevent
[JObject]: https://www.newtonsoft.com/json/help/html/t_newtonsoft_json_linq_jobject.htm
[String]: /dotnet/api/system.string
