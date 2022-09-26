---
title: Azure Event Grid output binding for Azure Functions
description: Learn to send an Event Grid event in Azure Functions.

ms.topic: reference
ms.date: 03/04/2022
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: "devx-track-csharp, fasttrack-edit, devx-track-python"
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Azure Event Grid output binding for Azure Functions

Use the Event Grid output binding to write events to a custom topic. You must have a valid [access key for the custom topic](../event-grid/security-authenticate-publishing-clients.md). The Event Grid output binding doesn't support shared access signature (SAS) tokens.

For information on setup and configuration details, see [How to work with Event Grid triggers and bindings in Azure Functions](event-grid-how-tos.md).


> [!IMPORTANT]
> The Event Grid output binding is only available for Functions 2.x and higher.

## Example

::: zone pivot="programming-language-csharp"

The type of the output parameter used with an Event Grid output binding depends on the Functions runtime version, the binding extension version, and the modality of the C# function. The C# function can be created using one of the following C# modes:

* [In-process class library](functions-dotnet-class-library.md): compiled C# function that runs in the same process as the Functions runtime. 
* [Isolated process class library](dotnet-isolated-process-guide.md): compiled C# function that runs in a process isolated from the runtime. Isolated process is required to support C# functions running on .NET 5.0. 
* [C# script](functions-reference-csharp.md): used primarily when creating C# functions in the Azure portal.

# [In-process](#tab/in-process)

The following example shows a C# function that binds to a `CloudEvent` using version 3.x of the extension, which is in preview:

```cs
using System.Threading.Tasks;
using Azure.Messaging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.EventGrid;
using Microsoft.Azure.WebJobs.Extensions.Http;

namespace Azure.Extensions.WebJobs.Sample
{
    public static class CloudEventBindingFunction
    {
        [FunctionName("CloudEventBindingFunction")]
        public static async Task<IActionResult> RunAsync(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            [EventGrid(TopicEndpointUri = "EventGridEndpoint", TopicKeySetting = "EventGridKey")] IAsyncCollector<CloudEvent> eventCollector)
        {
            CloudEvent e = new CloudEvent("IncomingRequest", "IncomingRequest", await req.ReadAsStringAsync());
            await eventCollector.AddAsync(e);
            return new OkResult();
        }
    }
}
```

The following example shows a C# function that binds to an `EventGridEvent` using version 3.x of the extension, which is in preview:

```cs
using System.Threading.Tasks;
using Azure.Messaging.EventGrid;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.EventGrid;

namespace Azure.Extensions.WebJobs.Sample
{
    public static class EventGridEventBindingFunction
    {
        [FunctionName("EventGridEventBindingFunction")]
        public static async Task<IActionResult> RunAsync(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            [EventGrid(TopicEndpointUri = "EventGridEndpoint", TopicKeySetting = "EventGridKey")] IAsyncCollector<EventGridEvent> eventCollector)
        {
            EventGridEvent e = new EventGridEvent(await req.ReadAsStringAsync(), "IncomingRequest", "IncomingRequest", "1.0.0");
            await eventCollector.AddAsync(e);
            return new OkResult();
        }
    }
}
```

The following example shows a C# function that writes an [Microsoft.Azure.EventGrid.Models.EventGridEvent][EventGridEvent] message to an Event Grid custom topic, using the method return value as the output:

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

# [Isolated process](#tab/isolated-process)

The following example shows how the custom type is used in both the trigger and an Event Grid output binding:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/EventGrid/EventGridFunction.cs" range="4-49":::

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
---

::: zone-end  
::: zone pivot="programming-language-java"  

The following example shows a Java function that writes a message to an Event Grid custom topic. The function uses the binding's `setValue` method to output a string.

```java
public class Function {
    @FunctionName("EventGridTriggerTest")
    public void run(@EventGridTrigger(name = "event") String content,
            @EventGridOutput(name = "outputEvent", topicEndpointUri = "MyEventGridTopicUriSetting", topicKeySetting = "MyEventGridTopicKeySetting") OutputBinding<String> outputEvent,
            final ExecutionContext context) {
        context.getLogger().info("Java EventGrid trigger processed a request." + content);
        final String eventGridOutputDocument = "{\"id\": \"1807\", \"eventType\": \"recordInserted\", \"subject\": \"myapp/cars/java\", \"eventTime\":\"2017-08-10T21:03:07+00:00\", \"data\": {\"make\": \"Ducati\",\"model\": \"Monster\"}, \"dataVersion\": \"1.0\"}";
        outputEvent.setValue(eventGridOutputDocument);
    }
}
```

You can also use a POJO class to send EventGrid messages.

```java
public class Function {
    @FunctionName("EventGridTriggerTest")
    public void run(@EventGridTrigger(name = "event") String content,
            @EventGridOutput(name = "outputEvent", topicEndpointUri = "MyEventGridTopicUriSetting", topicKeySetting = "MyEventGridTopicKeySetting") OutputBinding<EventGridEvent> outputEvent,
            final ExecutionContext context) {
        context.getLogger().info("Java EventGrid trigger processed a request." + content);

        final EventGridEvent eventGridOutputDocument = new EventGridEvent();
        eventGridOutputDocument.setId("1807");
        eventGridOutputDocument.setEventType("recordInserted");
        eventGridOutputDocument.setEventTime("2017-08-10T21:03:07+00:00");
        eventGridOutputDocument.setDataVersion("1.0");
        eventGridOutputDocument.setSubject("myapp/cars/java");
        eventGridOutputDocument.setData("{\"make\": \"Ducati\",\"model\":\"monster\"");

        outputEvent.setValue(eventGridOutputDocument);
    }
}

class EventGridEvent {
    private String id;
    private String eventType;
    private String subject;
    private String eventTime;
    private String dataVersion;
    private String data;

    public String getId() {
        return id;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getDataVersion() {
        return dataVersion;
    }

    public void setDataVersion(String dataVersion) {
        this.dataVersion = dataVersion;
    }

    public String getEventTime() {
        return eventTime;
    }

    public void setEventTime(String eventTime) {
        this.eventTime = eventTime;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public void setId(String id) {
        this.id = id;
    }  
}
```

::: zone-end  
::: zone pivot="programming-language-javascript" 

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
};
```

Here's JavaScript code that creates multiple events:

```javascript
module.exports = async function(context) {
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
};
```

::: zone-end  
::: zone pivot="programming-language-powershell"  

The following example demonstrates how to configure a function to output an Event Grid event message. The section where `type` is set to `eventGrid` configures the values needed to establish an Event Grid output binding.

```powershell
{
  "bindings": [
    {
      "type": "eventGrid",
      "name": "outputEvent",
      "topicEndpointUri": "MyEventGridTopicUriSetting",
      "topicKeySetting": "MyEventGridTopicKeySetting",
      "direction": "out"
    },
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "Request",
      "methods": [
        "get",
        "post"
      ]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "Response"
    }
  ]
}
```

In your function, use the `Push-OutputBinding` to send an event to a custom topic through the Event Grid output binding.

```powershell
using namespace System.Net

# Input bindings are passed in via param block.
param($Request, $TriggerMetadata)

# Write to the Azure Functions log stream.
Write-Host "PowerShell HTTP trigger function processed a request."

# Interact with query parameters or the body of the request.
$message = $Request.Query.Message

Push-OutputBinding -Name outputEvent -Value  @{
    id = "1"
    EventType = "testEvent"
    Subject = "testapp/testPublish"
    EventTime = "2020-08-27T21:03:07+00:00"
    Data = @{
        Message = $message
    }
    DataVersion = "1.0"
}

Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
    StatusCode = 200
    Body = "OK"
})
```

::: zone-end  
::: zone pivot="programming-language-python"  

The following example shows a trigger binding in a *function.json* file and a [Python function](functions-reference-python.md) that uses the binding. It then sends in an event to the custom topic, as specified by the `topicEndpointUri`.

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

Here's the Python sample to send an event to a custom topic by setting the `EventGridOutputEvent`:

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

::: zone-end  
::: zone pivot="programming-language-csharp"
## Attributes

Both [in-process](functions-dotnet-class-library.md) and [isolated process](dotnet-isolated-process-guide.md) C# libraries use attribute to configure the binding. C# script instead uses a function.json configuration file.    

The attribute's constructor takes the name of an application setting that contains the name of the custom topic, and the name of an application setting that contains the topic key. 

# [In-process](#tab/in-process)

The following table explains the parameters for the `EventGridAttribute`.

|Parameter | Description|
|---------|---------|----------------------|
|**TopicEndpointUri** | The name of an app setting that contains the URI for the custom topic, such as `MyTopicEndpointUri`. |
|**TopicKeySetting** | The name of an app setting that contains an access key for the custom topic. |

# [Isolated process](#tab/isolated-process)

The following table explains the parameters for the `EventGridOutputAttribute`.

|Parameter | Description|
|---------|---------|----------------------|
|**TopicEndpointUri** | The name of an app setting that contains the URI for the custom topic, such as `MyTopicEndpointUri`. |
|**TopicKeySetting** | The name of an app setting that contains an access key for the custom topic. |

# [C# Script](#tab/csharp-script)

C# script uses a function.json file for configuration instead of attributes. 

The following table explains the binding configuration properties for C# script that you set in the *function.json* file.

|function.json property | Description|
|---------|---------|----------------------|
|**type** |  Must be set to `eventGrid`. |
|**direction** | Must be set to `out`. This parameter is set automatically when you create the binding in the Azure portal. |
|**name** | The variable name used in function code that represents the event. |
|**topicEndpointUri** | The name of an app setting that contains the URI for the custom topic, such as `MyTopicEndpointUri`. |
|**topicKeySetting** | The name of an app setting that contains an access key for the custom topic. |

---

::: zone-end  
::: zone pivot="programming-language-java"  
## Annotations

For Java classes, use the [EventGridAttribute](https://github.com/Azure/azure-functions-java-library/blob/dev/src/main/java/com/microsoft/azure/functions/annotation/EventGridOutput.java) attribute.

The attribute's constructor takes the name of an app setting that contains the name of the custom topic, and the name of an app setting that contains the topic key. For more information about these settings, see [Output - configuration](#configuration). Here's an `EventGridOutput` attribute example:

```java
public class Function {
    @FunctionName("EventGridTriggerTest")
    public void run(@EventGridTrigger(name = "event") String content,
            @EventGridOutput(name = "outputEvent", topicEndpointUri = "MyEventGridTopicUriSetting", topicKeySetting = "MyEventGridTopicKeySetting") OutputBinding<String> outputEvent, final ExecutionContext context) {
            ...
    }
}
```
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-python"  
## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file.

|function.json property |Description|
|---------|---------|----------------------|
|**type** | Must be set to `eventGrid`. |
|**direction** | Must be set to `out`. This parameter is set automatically when you create the binding in the Azure portal. |
|**name** | The variable name used in function code that represents the event. |
|**topicEndpointUri** | The name of an app setting that contains the URI for the custom topic, such as `MyTopicEndpointUri`. |
|**topicKeySetting** | The name of an app setting that contains an access key for the custom topic. |

::: zone-end

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

> [!IMPORTANT]
> Make sure that you set the value of the `TopicEndpointUri` configuration property to the name of an app setting that contains the URI of the custom topic. Don't specify the URI of the custom topic directly in this property.

See the [Example section](#example) for complete examples.

## Usage

::: zone pivot="programming-language-csharp"  
The parameter type supported by the Event Grid output binding depends on the Functions runtime version, the extension package version, and the C# modality used. 

# [Extension v3.x](#tab/extensionv3/in-process)

In-process C# class library functions supports the following types:

+ [Azure.Messaging.CloudEvent][CloudEvent]
+ [Azure.Messaging.EventGrid][EventGridEvent2]
+ [Newtonsoft.Json.Linq.JObject][JObject]
+ [System.String][String]

Send messages by using a method parameter such as `out EventGridEvent paramName`. 
To write multiple messages, you can instead use `ICollector<EventGridEvent>` or `IAsyncCollector<EventGridEvent>`.

# [Extension v2.x](#tab/extensionv2/in-process)

In-process C# class library functions supports the following types:

+ [Microsoft.Azure.EventGrid.Models.EventGridEvent][EventGridEvent]
+ [Newtonsoft.Json.Linq.JObject][JObject]
+ [System.String][String]

Send messages by using a method parameter such as `out EventGridEvent paramName`. 
To write multiple messages, you can instead use `ICollector<EventGridEvent>` or `IAsyncCollector<EventGridEvent>`.

# [Functions 1.x](#tab/functionsv1/in-process)

In-process C# class library functions supports the following types:

+ [Newtonsoft.Json.Linq.JObject][JObject]
+ [System.String][String]

# [Extension v3.x](#tab/extensionv3/isolated-process)

Requires you to define a custom type, or use a string. See the [Example section](#example) for examples of using a custom parameter type.

# [Extension v2.x](#tab/extensionv2/isolated-process)

Requires you to define a custom type, or use a string. See the [Example section](#example) for examples of using a custom parameter type.

# [Functions 1.x](#tab/functionsv1/isolated-process)

Functions version 1.x doesn't support isolated process. 

# [Extension v3.x](#tab/extensionv3/csharp-script)

C# script functions support the following types:

+ [Azure.Messaging.CloudEvent][CloudEvent]
+ [Azure.Messaging.EventGrid][EventGridEvent2]
+ [Newtonsoft.Json.Linq.JObject][JObject]
+ [System.String][String]

Send messages by using a method parameter such as `out EventGridEvent paramName`. 
To write multiple messages, you can instead use `ICollector<EventGridEvent>` or `IAsyncCollector<EventGridEvent>`.

# [Extension v2.x](#tab/extensionv2/csharp-script)

C# script functions support the following types:

+ [Microsoft.Azure.EventGrid.Models.EventGridEvent][EventGridEvent]
+ [Newtonsoft.Json.Linq.JObject][JObject]
+ [System.String][String]

Send messages by using a method parameter such as `out EventGridEvent paramName`. 
To write multiple messages, you can instead use `ICollector<EventGridEvent>` or `IAsyncCollector<EventGridEvent>`.

# [Functions 1.x](#tab/functionsv1/csharp-script)

C# script functions support the following types:

+ [Newtonsoft.Json.Linq.JObject][JObject]
+ [System.String][String]

---

::: zone-end  
::: zone pivot="programming-language-java" 

Send individual messages by calling a method parameter such as `out EventGridOutput paramName`, and write multiple messages with `ICollector<EventGridOutput>`.

::: zone-end  
::: zone pivot="programming-language-javascript"  

Access the output event by using `context.bindings.<name>` where `<name>` is the value specified in the `name` property of *function.json*.

::: zone-end  
::: zone pivot="programming-language-powershell"  

Access the output event by using the `Push-OutputBinding` cmdlet to send an event to the Event Grid output binding.

::: zone-end  
::: zone pivot="programming-language-python" 

There are two options for outputting an Event Grid message from a function:
- **Return value**: Set the `name` property in *function.json* to `$return`. With this configuration, the function's return value is persisted as an Event Grid message.
- **Imperative**: Pass a value to the [set](/python/api/azure-functions/azure.functions.out#set-val--t-----none) method of the parameter declared as an [Out](/python/api/azure-functions/azure.functions.out) type. The value passed to `set` is persisted as an Event Grid message.

::: zone-end

## Next steps

* [Dispatch an Event Grid event](./functions-bindings-event-grid-trigger.md)

[EventGridEvent]: /dotnet/api/microsoft.azure.eventgrid.models.eventgridevent
[CloudEvent]: /dotnet/api/azure.messaging.cloudevent
