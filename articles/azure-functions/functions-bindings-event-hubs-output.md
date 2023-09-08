---
title: Azure Event Hubs output binding for Azure Functions
description: Learn to write messages to Azure Event Hubs streams using Azure Functions.
ms.assetid: daf81798-7acc-419a-bc32-b5a41c6db56b
ms.topic: reference
ms.custom: ignite-2022, devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 03/03/2023
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Azure Event Hubs output binding for Azure Functions

This article explains how to work with [Azure Event Hubs](../event-hubs/event-hubs-about.md) bindings for Azure Functions. Azure Functions supports trigger and output bindings for Event Hubs.

For information on setup and configuration details, see the [overview](functions-bindings-event-hubs.md).

Use the Event Hubs output binding to write events to an event stream. You must have send permission to an event hub to write events to it.

Make sure the required package references are in place before you try to implement an output binding.

::: zone pivot="programming-language-python"
Azure Functions supports two programming models for Python. The way that you define your bindings depends on your chosen programming model.

# [v2](#tab/python-v2)
The Python v2 programming model lets you define bindings using decorators directly in your Python function code. For more information, see the [Python developer guide](functions-reference-python.md?pivots=python-mode-decorators#programming-model).

# [v1](#tab/python-v1)
The Python v1 programming model requires you to define bindings in a separate *function.json* file in the function folder. For more information, see the [Python developer guide](functions-reference-python.md?pivots=python-mode-configuration#programming-model).

---

This article supports both programming models.

> [!IMPORTANT]
> The Python v2 programming model is currently in preview.
::: zone-end


## Example

::: zone pivot="programming-language-csharp"

# [In-process](#tab/in-process)

The following example shows a [C# function](functions-dotnet-class-library.md) that writes a message to an event hub, using the method return value as the output:

```csharp
[FunctionName("EventHubOutput")]
[return: EventHub("outputEventHubMessage", Connection = "EventHubConnectionAppSetting")]
public static string Run([TimerTrigger("0 */5 * * * *")] TimerInfo myTimer, ILogger log)
{
    log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");
    return $"{DateTime.Now}";
}
```

The following example shows how to use the `IAsyncCollector` interface to send a batch of messages. This scenario is common when you are processing messages coming from one event hub and sending the result to another event hub.

```csharp
[FunctionName("EH2EH")]
public static async Task Run(
    [EventHubTrigger("source", Connection = "EventHubConnectionAppSetting")] EventData[] events,
    [EventHub("dest", Connection = "EventHubConnectionAppSetting")]IAsyncCollector<EventData> outputEvents,
    ILogger log)
{
    foreach (EventData eventData in events)
    {
        // Do some processing:
        string newEventBody = DoSomething(eventData);
        
        // Queue the message to be sent in the background by adding it to the collector.
        // If only the event is passed, an Event Hubs partition to be be assigned via
        // round-robin for each batch.
        await outputEvents.AddAsync(new EventData(newEventBody));
        
        // If your scenario requires that certain events are grouped together in an
        // Event Hubs partition, you can specify a partition key.  Events added with 
        // the same key will always be assigned to the same partition.        
        await outputEvents.AddAsync(new EventData(newEventBody), "sample-key");
    }
}
```
# [Isolated process](#tab/isolated-process)

The following example shows a [C# function](dotnet-isolated-process-guide.md) that writes a message string to an event hub, using the method return value as the output:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/EventHubs/EventHubsFunction.cs" range="12-23":::

---

::: zone-end 
::: zone pivot="programming-language-javascript"  

The following example shows an event hub trigger binding in a *function.json* file and a function that uses the binding. The function writes an output message to an event hub.

The following example shows an Event Hubs binding data in the *function.json* file, which is different for version 1.x of the Functions runtime compared to later versions. 

# [Functions 2.x+](#tab/functionsv2)

```json
{
    "type": "eventHub",
    "name": "outputEventHubMessage",
    "eventHubName": "myeventhub",
    "connection": "MyEventHubSendAppSetting",
    "direction": "out"
}
```

# [Functions 1.x](#tab/functionsv1)

```json
{
    "type": "eventHub",
    "name": "outputEventHubMessage",
    "path": "myeventhub",
    "connection": "MyEventHubSendAppSetting",
    "direction": "out"
}
```

---

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

::: zone-end  
::: zone pivot="programming-language-powershell" 
 
Complete PowerShell examples are pending.
::: zone-end 
::: zone pivot="programming-language-python"  
The following example shows an event hub trigger binding and a Python function that uses the binding. The function writes a message to an event hub. The example depends on whether you use the [v1 or v2 Python programming model](functions-reference-python.md).

# [v2](#tab/python-v2)

```python
import logging
import azure.functions as func

app = func.FunctionApp()

@app.function_name(name="eventhub_output")
@app.route(route="eventhub_output")
@app.event_hub_output(arg_name="event",
                      event_hub_name="<EVENT_HUB_NAME>",
                      connection="<CONNECTION_SETTING>")
def eventhub_output(req: func.HttpRequest, event: func.Out[str]):
    body = req.get_body()
    if body is not None:
        event.set(body.decode('utf-8'))
    else:    
        logging.info('req body is none')
    return 'ok'
```

# [v1](#tab/python-v1)

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
    logging.info('Message created at: %s', timestamp)
    return 'Message created at: {}'.format(timestamp)
```

---

::: zone-end
::: zone pivot="programming-language-java"
The following example shows a Java function that writes a message containing the current time to an event hub.

```java
@FunctionName("sendTime")
@EventHubOutput(name = "event", eventHubName = "samples-workitems", connection = "AzureEventHubConnection")
public String sendTime(
   @TimerTrigger(name = "sendTimeTrigger", schedule = "0 */5 * * * *") String timerInfo)  {
     return LocalDateTime.now().toString();
 }
```

In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `@EventHubOutput` annotation on parameters whose value would be published to Event Hubs.  The parameter should be of type `OutputBinding<T>` , where `T` is a POJO or any native Java type.

::: zone-end
::: zone pivot="programming-language-csharp"
## Attributes

Both [in-process](functions-dotnet-class-library.md) and [isolated worker process](dotnet-isolated-process-guide.md) C# libraries use attribute to configure the binding. C# script instead uses a function.json configuration file as described in the [C# scripting guide](./functions-reference-csharp.md#event-hubs-output).

# [In-process](#tab/in-process)

Use the [EventHubAttribute] to define an output binding to an event hub, which supports the following properties.

| Parameters | Description|
|---------|----------------------|
|**EventHubName** | The name of the event hub. When the event hub name is also present in the connection string, that value overrides this property at runtime. |
|**Connection** | The name of an app setting or setting collection that specifies how to connect to Event Hubs. To learn more, see [Connections](#connections).|

# [Isolated process](#tab/isolated-process)

Use the [EventHubOutputAttribute] to define an output binding to an event hub, which supports the following properties.

| Parameters | Description|
|---------|----------------------|
|**EventHubName** | The name of the event hub. When the event hub name is also present in the connection string, that value overrides this property at runtime. |
|**Connection** | The name of an app setting or setting collection that specifies how to connect to Event Hubs. To learn more, see [Connections](#connections).|

---

::: zone-end  
::: zone pivot="programming-language-python"
## Decorators

_Applies only to the Python v2 programming model._

For Python v2 functions defined using a decorator, the following properties on the `cosmos_db_trigger`:

| Property    | Description |
|-------------|-----------------------------|
|`arg_name` | The variable name used in function code that represents the event. |
|`event_hub_name`  | he name of the event hub. When the event hub name is also present in the connection string, that value overrides this property at runtime. |
|`connection`  | The name of an app setting or setting collection that specifies how to connect to Event Hubs. To learn more, see [Connections](#connections). |

For Python functions defined by using *function.json*, see the [Configuration](#configuration) section.
::: zone-end

::: zone pivot="programming-language-java"  
## Annotations

In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the [EventHubOutput](/java/api/com.microsoft.azure.functions.annotation.eventhuboutput) annotation on parameters whose value would be published to Event Hubs. The following settings are supported on the annotation:

+ [name](/java/api/com.microsoft.azure.functions.annotation.eventhuboutput.name)
+ [dataType](/java/api/com.microsoft.azure.functions.annotation.eventhuboutput.datatype)
+ [eventHubName](/java/api/com.microsoft.azure.functions.annotation.eventhuboutput.eventhubname)
+ [connection](/java/api/com.microsoft.azure.functions.annotation.eventhuboutput.connection)

::: zone-end 
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-powershell"  

## Configuration
::: zone-end

::: zone pivot="programming-language-python" 
_Applies only to the Python v1 programming model._

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-python"  

The following table explains the binding configuration properties that you set in the *function.json* file, which differs by runtime version.

# [Functions 2.x+](#tab/functionsv2)

|function.json property | Description|
|---------|------------------------|
|**type** |  Must be set to `eventHub`. |
|**direction** | Must be set to `out`. This parameter is set automatically when you create the binding in the Azure portal. |
|**name** |  The variable name used in function code that represents the event. |
|**eventHubName** | Functions 2.x and higher. The name of the event hub. When the event hub name is also present in the connection string, that value overrides this property at runtime. |
|**connection**  | The name of an app setting or setting collection that specifies how to connect to Event Hubs. To learn more, see [Connections](#connections).|

# [Functions 1.x](#tab/functionsv1)

|function.json property | Description|
|---------|------------------------|
|**type** |  Must be set to `eventHub`. |
|**direction** | Must be set to `out`. This parameter is set automatically when you create the binding in the Azure portal. |
|**name** |  The variable name used in function code that represents the event. |
|**path** | Functions 1.x only. The name of the event hub. When the event hub name is also present in the connection string, that value overrides this property at runtime. |
|**connection**  | The name of an app setting or setting collection that specifies how to connect to Event Hubs. To learn more, see [Connections](#connections).|

---

::: zone-end

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Usage

::: zone pivot="programming-language-csharp"  
The parameter type supported by the Event Hubs output binding depends on the Functions runtime version, the extension package version, and the C# modality used. 

# [Extension v5.x+](#tab/extensionv5/in-process)

In-process C# class library functions supports the following types:

+ [Azure.Messaging.EventHubs.EventData](/dotnet/api/azure.messaging.eventhubs.eventdata)
+ String
+ Byte array
+ Plain-old CLR object (POCO)

This version of [EventData](/dotnet/api/azure.messaging.eventhubs.eventdata) drops support for the legacy `Body` type in favor of [EventBody](/dotnet/api/azure.messaging.eventhubs.eventdata.eventbody).

Send messages by using a method parameter such as `out string paramName`. To write multiple messages, you can use `ICollector<EventData>` or `IAsyncCollector<EventData>` in place of `out string`.  Partition keys may only be used with `IAsyncCollector<EventData>`.

# [Extension v3.x+](#tab/extensionv3/in-process)

In-process C# class library functions supports the following types:

+ [Microsoft.Azure.EventHubs.EventData](/dotnet/api/microsoft.azure.eventhubs.eventdata)
+ String
+ Byte array
+ Plain-old CLR object (POCO)

Send messages by using a method parameter such as `out string paramName`. To write multiple messages, you can use `ICollector<string>` or `IAsyncCollector<string>` in place of `out string`.

# [Extension v5.x+](#tab/extensionv5/isolated-process)

[!INCLUDE [functions-bindings-event-hubs-output-dotnet-isolated-types](../../includes/functions-bindings-event-hubs-output-dotnet-isolated-types.md)]

# [Extension v3.x+](#tab/extensionv3/isolated-process)

Requires you to define a custom type, or use a string. Additional options are available in **Extension v5.x+**.

---

::: zone-end  
::: zone pivot="programming-language-java" 

There are two options for outputting an Event Hubs message from a function by using the [EventHubOutput](/java/api/com.microsoft.azure.functions.annotation.eventhuboutput) annotation:

- **Return value**: By applying the annotation to the function itself, the return value of the function is persisted as an Event Hubs message.

- **Imperative**: To explicitly set the message value, apply the annotation to a specific parameter of the type [`OutputBinding<T>`](/java/api/com.microsoft.azure.functions.OutputBinding), where `T` is a POJO or any native Java type. With this configuration, passing a value to the `setValue` method persists the value as an Event Hubs message.
::: zone-end
::: zone pivot="programming-language-powershell" 
 
Complete PowerShell examples are pending.
::: zone-end 
::: zone pivot="programming-language-javascript"

Access the output event by using `context.bindings.<name>` where `<name>` is the value specified in the `name` property of *function.json*.

::: zone-end  
::: zone pivot="programming-language-python"  

There are two options for outputting an Event Hubs message from a function:

- **Return value**: Set the `name` property in *function.json* to `$return`. With this configuration, the function's return value is persisted as an Event Hubs message.

- **Imperative**: Pass a value to the [set](/python/api/azure-functions/azure.functions.out#set-val--t-----none) method of the parameter declared as an [Out](/python/api/azure-functions/azure.functions.out) type. The value passed to `set` is persisted as an Event Hubs message.

::: zone-end

[!INCLUDE [functions-event-hubs-connections](../../includes/functions-event-hubs-connections.md)]

## Exceptions and return codes

| Binding | Reference |
|---|---|
| Event Hubs | [Operations Guide](/rest/api/eventhub/publisher-policy-operations) |

## Next steps

- [Respond to events sent to an event hub event stream (Trigger)](./functions-bindings-event-hubs-trigger.md)
 

[EventHubAttribute]: /dotnet/api/microsoft.azure.webjobs.eventhubattribute
