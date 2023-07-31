---
title: Azure Event Grid output binding for Azure Functions
description: Learn to send an Event Grid event in Azure Functions.

ms.topic: reference
ms.date: 03/04/2022
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: devx-track-csharp, fasttrack-edit, devx-track-python, devx-track-extended-java, devx-track-js
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Azure Event Grid output binding for Azure Functions

Use the Event Grid output binding to write events to a custom topic. You must have a valid [access key for the custom topic](../event-grid/security-authenticate-publishing-clients.md). The Event Grid output binding doesn't support shared access signature (SAS) tokens.

For information on setup and configuration details, see [How to work with Event Grid triggers and bindings in Azure Functions](event-grid-how-tos.md).

::: zone pivot="programming-language-python"
Azure Functions supports two programming models for Python. The way that you define your bindings depends on your chosen programming model.

# [v2](#tab/python-v2)
The Python v2 programming model lets you define bindings using decorators directly in your Python function code. For more information, see the [Python developer guide](functions-reference-python.md?pivots=python-mode-decorators#programming-model).

# [v1](#tab/python-v1)
The Python v1 programming model requires you to define bindings in a separate *function.json* file in the function folder. For more information, see the [Python developer guide](functions-reference-python.md?pivots=python-mode-configuration#programming-model).

---

This article supports both programming models.

::: zone-end

> [!IMPORTANT]
> The Event Grid output binding is only available for Functions 2.x and higher.

## Example

::: zone pivot="programming-language-csharp"

The type of the output parameter used with an Event Grid output binding depends on the Functions runtime version, the binding extension version, and the modality of the C# function. The C# function can be created using one of the following C# modes:

* [In-process class library](functions-dotnet-class-library.md): compiled C# function that runs in the same process as the Functions runtime. 
* [Isolated worker process class library](dotnet-isolated-process-guide.md): compiled C# function that runs in a worker process isolated from the runtime.

# [In-process](#tab/in-process)

The following example shows a C# function that publishes a `CloudEvent` using version 3.x of the extension:

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

The following example shows a C# function that publishes an `EventGridEvent` using version 3.x of the extension:

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

The following example shows a C# function that publishes an [EventGridEvent][EventGridEvent] message to an Event Grid custom topic, using the method return value as the output:

```csharp
[FunctionName("EventGridOutput")]
[return: EventGrid(TopicEndpointUri = "MyEventGridTopicUriSetting", TopicKeySetting = "MyEventGridTopicKeySetting")]
public static EventGridEvent Run([TimerTrigger("0 */5 * * * *")] TimerInfo myTimer, ILogger log)
{
    return new EventGridEvent("message-id", "subject-name", "event-data", "event-type", DateTime.UtcNow, "1.0");
}
```

It is also possible to use an `out` parameter to accomplish the same thing:
```csharp
[FunctionName("EventGridOutput")]
[return: EventGrid(TopicEndpointUri = "MyEventGridTopicUriSetting", TopicKeySetting = "MyEventGridTopicKeySetting")]
public static void Run(
    [TimerTrigger("0 */5 * * * *")] TimerInfo myTimer,
    EventGrid(TopicEndpointUri = "MyEventGridTopicUriSetting", TopicKeySetting = "MyEventGridTopicKeySetting") out eventGridEvent,
    ILogger log)
{
    eventGridEvent = EventGridEvent("message-id", "subject-name", "event-data", "event-type", DateTime.UtcNow, "1.0");
}
```

The following example shows how to use the `IAsyncCollector` interface to send a batch of `EventGridEvent` messages.

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

Starting in version 3.3.0, it is possible to use Azure Active Directory when authenticating the output binding:

```csharp
[FunctionName("EventGridAsyncOutput")]
public static async Task Run(
    [TimerTrigger("0 */5 * * * *")] TimerInfo myTimer,
    [EventGrid(Connection = "MyEventGridConnection"]IAsyncCollector<CloudEvent> outputEvents,
    ILogger log)
{
    for (var i = 0; i < 3; i++)
    {
        var myEvent = new CloudEvent("message-id-" + i, "subject-name", "event-data");
        await outputEvents.AddAsync(myEvent);
    }
}
```

When using the Connection property, the `topicEndpointUri` must be specified as a child of the connection setting, and the `TopicEndpointUri` and `TopicKeySetting` properties should not be used. For local development, use the local.settings.json file to store the connection information:
```json
{
  "Values": {
    "myConnection__topicEndpointUri": "{topicEndpointUri}"
  }
}
```
When deployed, use the application settings to store this information.

[!INCLUDE [functions-event-grid-connections](../../includes/functions-event-grid-connections.md)]

# [Isolated process](#tab/isolated-process)

The following example shows how the custom type is used in both the trigger and an Event Grid output binding:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/EventGrid/EventGridFunction.cs" range="4-49":::

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

You can also use a POJO class to send Event Grid messages.

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
    eventType = "testEvent"
    subject = "testapp/testPublish"
    eventTime = "2020-08-27T21:03:07+00:00"
    data = @{
        Message = $message
    }
    dataVersion = "1.0"
}

Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
    StatusCode = 200
    Body = "OK"
})
```

::: zone-end  
::: zone pivot="programming-language-python"  

The following example shows a trigger binding and a Python function that uses the binding. It then sends in an event to the custom topic, as specified by the `topicEndpointUri`. The example depends on whether you use the [v1 or v2 Python programming model](functions-reference-python.md). 

# [v2](#tab/python-v2)

Here's the function in the function_app.py file:

```python
import logging
import azure.functions as func
import datetime

@app.function_name(name="eventgrid_output")
@app.route(route="eventgrid_output")
@app.event_grid_output(
    arg_name="outputEvent",
    topic_endpoint_uri="MyEventGridTopicUriSetting",
    topic_key_setting="MyEventGridTopicKeySetting")
def eventgrid_output(eventGridEvent: func.EventGridEvent, 
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

# [v1](#tab/python-v1)
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

Both [in-process](functions-dotnet-class-library.md) and [isolated worker process](dotnet-isolated-process-guide.md) C# libraries use attribute to configure the binding. C# script instead uses a function.json configuration file as described in the [C# scripting guide](./functions-reference-csharp.md#event-grid-output).

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

[!INCLUDE [functions-bindings-event-grid-output-dotnet-isolated-types](../../includes/functions-bindings-event-grid-output-dotnet-isolated-types.md)]

# [Extension v2.x](#tab/extensionv2/isolated-process)

Requires you to define a custom type, or use a string. See the [Example section](#example) for examples of using a custom parameter type.

# [Functions 1.x](#tab/functionsv1/isolated-process)

Functions version 1.x doesn't support isolated worker process. 

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

[EventGridEvent]: /dotnet/api/azure.messaging.eventgrid.eventgridevent
[CloudEvent]: /dotnet/api/azure.messaging.cloudevent
