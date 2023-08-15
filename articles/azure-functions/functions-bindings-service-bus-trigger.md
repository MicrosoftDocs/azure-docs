---
title: Azure Service Bus trigger for Azure Functions
description: Learn to run an Azure Function when as Azure Service Bus messages are created.
ms.assetid: daedacf0-6546-4355-a65c-50873e74f66b
ms.topic: reference
ms.date: 04/04/2023
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: devx-track-csharp, devx-track-python, devx-track-extended-java, devx-track-js
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Azure Service Bus trigger for Azure Functions

Use the Service Bus trigger to respond to messages from a Service Bus queue or topic. 
Starting with extension version 3.1.0, you can trigger on a session-enabled queue or topic.

For information on setup and configuration details, see the [overview](functions-bindings-service-bus.md).

Service Bus scaling decisions for the Consumption and Premium plans are made based on target-based scaling. For more information, see [Target-based scaling](functions-target-based-scaling.md).

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

[!INCLUDE [functions-bindings-csharp-intro](../../includes/functions-bindings-csharp-intro.md)]

# [In-process](#tab/in-process)

The following example shows a [C# function](functions-dotnet-class-library.md) that reads [message metadata](#message-metadata) and
logs a Service Bus queue message:

```cs
[FunctionName("ServiceBusQueueTriggerCSharp")]                    
public static void Run(
    [ServiceBusTrigger("myqueue", Connection = "ServiceBusConnection")] 
    string myQueueItem,
    Int32 deliveryCount,
    DateTime enqueuedTimeUtc,
    string messageId,
    ILogger log)
{
    log.LogInformation($"C# ServiceBus queue trigger function processed message: {myQueueItem}");
    log.LogInformation($"EnqueuedTimeUtc={enqueuedTimeUtc}");
    log.LogInformation($"DeliveryCount={deliveryCount}");
    log.LogInformation($"MessageId={messageId}");
}
```
# [Isolated process](#tab/isolated-process)

The following example shows a [C# function](dotnet-isolated-process-guide.md) that receives a Service Bus queue message, logs the message, and sends a message to different Service Bus queue:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/ServiceBus/ServiceBusFunction.cs" range="10-25":::

---

::: zone-end
::: zone pivot="programming-language-java"

The following Java function uses the `@ServiceBusQueueTrigger` annotation from the [Java functions runtime library](/java/api/overview/azure/functions/runtime) to describe the configuration for a Service Bus queue trigger. The  function grabs the message placed on the queue and adds it to the logs.

```java
@FunctionName("sbprocessor")
 public void serviceBusProcess(
    @ServiceBusQueueTrigger(name = "msg",
                             queueName = "myqueuename",
                             connection = "myconnvarname") String message,
   final ExecutionContext context
 ) {
     context.getLogger().info(message);
 }
```

Java functions can also be triggered when a message is added to a Service Bus topic. The following example uses the `@ServiceBusTopicTrigger` annotation to describe the trigger configuration.

```java
@FunctionName("sbtopicprocessor")
    public void run(
        @ServiceBusTopicTrigger(
            name = "message",
            topicName = "mytopicname",
            subscriptionName = "mysubscription",
            connection = "ServiceBusConnection"
        ) String message,
        final ExecutionContext context
    ) {
        context.getLogger().info(message);
    }
```
::: zone-end  
::: zone pivot="programming-language-javascript"  

The following example shows a Service Bus trigger binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding. The function reads [message metadata](#message-metadata) and logs a Service Bus queue message.

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
module.exports = async function(context, myQueueItem) {
    context.log('Node.js ServiceBus queue trigger function processed message', myQueueItem);
    context.log('EnqueuedTimeUtc =', context.bindingData.enqueuedTimeUtc);
    context.log('DeliveryCount =', context.bindingData.deliveryCount);
    context.log('MessageId =', context.bindingData.messageId);
};
```

::: zone-end  
::: zone pivot="programming-language-powershell"  

The following example shows a Service Bus trigger binding in a *function.json* file and a [PowerShell function](functions-reference-powershell.md) that uses the binding. 

Here's the binding data in the *function.json* file:

```json
{
  "bindings": [
    {
      "name": "mySbMsg",
      "type": "serviceBusTrigger",
      "direction": "in",
      "topicName": "mytopic",
      "subscriptionName": "mysubscription",
      "connection": "AzureServiceBusConnectionString"
    }
  ]
}
```

Here's the function that runs when a Service Bus message is sent.

```powershell
param([string] $mySbMsg, $TriggerMetadata)

Write-Host "PowerShell ServiceBus queue trigger function processed message: $mySbMsg"
```

::: zone-end  
::: zone pivot="programming-language-python"  

The following example demonstrates how to read a Service Bus queue message via a trigger. The example depends on whether you use the [v1 or v2 Python programming model](functions-reference-python.md).

# [v2](#tab/python-v2)

```python
import logging
import azure.functions as func

app = func.FunctionApp()

@app.function_name(name="ServiceBusQueueTrigger1")
@app.service_bus_queue_trigger(arg_name="msg", 
                               queue_name="<QUEUE_NAME>", 
                               connection="<CONNECTION_SETTING>")
def test_function(msg: func.ServiceBusMessage):
    logging.info('Python ServiceBus queue trigger processed message: %s',
                 msg.get_body().decode('utf-8'))
```

# [v1](#tab/python-v1)

A Service Bus binding is defined in *function.json* where *type* is set to `serviceBusTrigger` and the queue is set by `queueName`.

```json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "name": "msg",
      "type": "serviceBusTrigger",
      "direction": "in",
      "queueName": "inputqueue",
      "connection": "AzureServiceBusConnectionString"
    }
  ]
}
```

The code in *_\_init_\_.py* declares a parameter as `func.ServiceBusMessage`, which allows you to read the queue message in your function.

```python
import azure.functions as func

import logging
import json

def main(msg: func.ServiceBusMessage):
    logging.info('Python ServiceBus queue trigger processed message.')

    result = json.dumps({
        'message_id': msg.message_id,
        'body': msg.get_body().decode('utf-8'),
        'content_type': msg.content_type,
        'expiration_time': msg.expiration_time,
        'label': msg.label,
        'partition_key': msg.partition_key,
        'reply_to': msg.reply_to,
        'reply_to_session_id': msg.reply_to_session_id,
        'scheduled_enqueue_time': msg.scheduled_enqueue_time,
        'session_id': msg.session_id,
        'time_to_live': msg.time_to_live,
        'to': msg.to,
        'user_properties': msg.user_properties,
        'metadata' : msg.metadata
    }, default=str)

    logging.info(result)
```

---

The following example demonstrates how to read a Service Bus queue topic via a trigger.

# [v2](#tab/python-v2)

```python
import logging
import azure.functions as func

app = func.FunctionApp()

@app.function_name(name="ServiceBusTopicTrigger1")
@app.service_bus_topic_trigger(arg_name="message", 
                               topic_name="TOPIC_NAME", 
                               connection="CONNECTION_SETTING", 
                               subscription_name="SUBSCRIPTION_NAME")
def test_function(message: func.ServiceBusMessage):
    message_body = message.get_body().decode("utf-8")
    logging.info("Python ServiceBus topic trigger processed message.")
    logging.info("Message Body: " + message_body)
```

# [v1](#tab/python-v1)

A Service Bus binding is defined in *function.json* where *type* is set to `serviceBusTrigger` and the topic is set by `topicName`.

```json
{
  "scriptFile": "__init__.py",
  "bindings": [
   {
     "type": "serviceBusTrigger",
     "direction": "in",
     "name": "msg",
     "topicName": "inputtopic",
     "connection": "AzureServiceBusConnectionString"
   }
  ]
}
```

The code in *_\_init_\_.py* declares a parameter as `func.ServiceBusMessage`, which allows you to read the topic in your function.

```python
import json

import azure.functions as azf


def main(msg: azf.ServiceBusMessage) -> str:
    result = json.dumps({
        'message_id': msg.message_id,
        'body': msg.get_body().decode('utf-8'),
        'content_type': msg.content_type,
        'delivery_count': msg.delivery_count,
        'expiration_time': (msg.expiration_time.isoformat() if
                            msg.expiration_time else None),
        'label': msg.label,
        'partition_key': msg.partition_key,
        'reply_to': msg.reply_to,
        'reply_to_session_id': msg.reply_to_session_id,
        'scheduled_enqueue_time': (msg.scheduled_enqueue_time.isoformat() if
                                   msg.scheduled_enqueue_time else None),
        'session_id': msg.session_id,
        'time_to_live': msg.time_to_live,
        'to': msg.to,
        'user_properties': msg.user_properties,
    })

    logging.info(result)
```

---

::: zone-end  
::: zone pivot="programming-language-csharp"
## Attributes

Both [in-process](functions-dotnet-class-library.md) and [isolated worker process](dotnet-isolated-process-guide.md) C# libraries use the [ServiceBusTriggerAttribute](https://github.com/Azure/azure-functions-servicebus-extension/blob/master/src/Microsoft.Azure.WebJobs.Extensions.ServiceBus/ServiceBusTriggerAttribute.cs) attribute to define the function trigger. C# script instead uses a function.json configuration file as described in the [C# scripting guide](./functions-reference-csharp.md#service-bus-trigger).

# [In-process](#tab/in-process)

The following table explains the properties you can set using this trigger attribute:

| Property |Description|
| --- | --- |
|**QueueName**|Name of the queue to monitor. Set only if monitoring a queue, not for a topic. |
|**TopicName**|Name of the topic to monitor. Set only if monitoring a topic, not for a queue.|
|**SubscriptionName**|Name of the subscription to monitor. Set only if monitoring a topic, not for a queue.|
|**Connection**| The name of an app setting or setting collection that specifies how to connect to Service Bus. See [Connections](#connections).|
|**Access**|Access rights for the connection string. Available values are `manage` and `listen`. The default is `manage`, which indicates that the `connection` has the **Manage** permission. If you use a connection string that does not have the **Manage** permission, set `accessRights` to "listen". Otherwise, the Functions runtime might fail trying to do operations that require manage rights. In Azure Functions version 2.x and higher, this property is not available because the latest version of the Service Bus SDK doesn't support manage operations.|
|**IsBatched**| Messages are delivered in batches. Requires an array or collection type. |
|**IsSessionsEnabled**|`true` if connecting to a [session-aware](../service-bus-messaging/message-sessions.md) queue or subscription. `false` otherwise, which is the default value.|
|**AutoComplete**|`true` Whether the trigger should automatically call complete after processing, or if the function code will manually call complete.<br/><br/>If set to `true`, the trigger completes the message automatically if the function execution completes successfully, and abandons the message otherwise.<br/><br/>When set to `false`, you are responsible for calling [MessageReceiver](/dotnet/api/microsoft.azure.servicebus.core.messagereceiver) methods to complete, abandon, or deadletter the message. If an exception is thrown (and none of the `MessageReceiver` methods are called), then the lock remains. Once the lock expires, the message is re-queued with the `DeliveryCount` incremented and the lock is automatically renewed. |

# [Isolated process](#tab/isolated-process)

The following table explains the properties you can set using this trigger attribute:

| Property |Description|
| --- | --- |
|**QueueName**|Name of the queue to monitor. Set only if monitoring a queue, not for a topic. |
|**TopicName**|Name of the topic to monitor. Set only if monitoring a topic, not for a queue.|
|**SubscriptionName**|Name of the subscription to monitor. Set only if monitoring a topic, not for a queue.|
|**Connection**| The name of an app setting or setting collection that specifies how to connect to Service Bus. See [Connections](#connections).|
|**IsBatched**| Messages are delivered in batches. Requires an array or collection type. |
|**IsSessionsEnabled**|`true` if connecting to a [session-aware](../service-bus-messaging/message-sessions.md) queue or subscription. `false` otherwise, which is the default value.|

---
[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]
::: zone-end  

::: zone pivot="programming-language-python"
## Decorators

_Applies only to the Python v2 programming model._

For Python v2 functions defined using a decorator, the following properties on the `service_bus_queue_trigger`:

| Property    | Description |
|-------------|-----------------------------|
| `arg_name` | The name of the variable that represents the queue or topic message in function code. |
| `queue_name` | Name of the queue to monitor. Set only if monitoring a queue, not for a topic. |
| `connection` | The name of an app setting or setting collection that specifies how to connect to Service Bus. See [Connections](#connections). |

For Python functions defined by using *function.json*, see the [Configuration](#configuration) section.
::: zone-end

::: zone pivot="programming-language-java"  
## Annotations

The `ServiceBusQueueTrigger` annotation allows you to create a function that runs when a Service Bus queue message is created. Configuration options available include the following properties:

|Property | Description|
|---------|----------------------|
|**name** | The name of the variable that represents the queue or topic message in function code. |
|**queueName**| Name of the queue to monitor.  Set only if monitoring a queue, not for a topic.
|**topicName**| Name of the topic to monitor. Set only if monitoring a topic, not for a queue.|
|**subscriptionName**| Name of the subscription to monitor. Set only if monitoring a topic, not for a queue.|
|**connection**|  The name of an app setting or setting collection that specifies how to connect to Service Bus. See [Connections](#connections).|

The `ServiceBusTopicTrigger` annotation allows you to designate a topic and subscription to target what data triggers the function.

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

See the trigger [example](#example) for more detail.

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-python"  
## Configuration
::: zone-end

::: zone pivot="programming-language-python" 
_Applies only to the Python v1 programming model._

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-python"  

The following table explains the binding configuration properties that you set in the *function.json* file.

|function.json property | Description|
|---------|----------------------|
|**type** |  Must be set to `serviceBusTrigger`. This property is set automatically when you create the trigger in the Azure portal.|
|**direction** | Must be set to "in". This property is set automatically when you create the trigger in the Azure portal. |
|**name** | The name of the variable that represents the queue or topic message in function code. |
|**queueName**| Name of the queue to monitor.  Set only if monitoring a queue, not for a topic.
|**topicName**| Name of the topic to monitor. Set only if monitoring a topic, not for a queue.|
|**subscriptionName**| Name of the subscription to monitor. Set only if monitoring a topic, not for a queue.|
|**connection**|  The name of an app setting or setting collection that specifies how to connect to Service Bus. See [Connections](#connections).|
|**accessRights**| Access rights for the connection string. Available values are `manage` and `listen`. The default is `manage`, which indicates that the `connection` has the **Manage** permission. If you use a connection string that does not have the **Manage** permission, set `accessRights` to "listen". Otherwise, the Functions runtime might fail trying to do operations that require manage rights. In Azure Functions version 2.x and higher, this property is not available because the latest version of the Service Bus SDK doesn't support manage operations.|
|**isSessionsEnabled**| `true` if connecting to a [session-aware](../service-bus-messaging/message-sessions.md) queue or subscription. `false` otherwise, which is the default value.|
|**autoComplete**| Must be `true` for non-C# functions, which means that the trigger should either automatically call complete after processing, or the function code manually calls complete.<br/><br/>When set to `true`, the trigger completes the message automatically if the function execution completes successfully, and abandons the message otherwise.<br/><br/>Exceptions in the function results in the runtime calls `abandonAsync` in the background. If no exception occurs, then `completeAsync` is called in the background. This property is available only in Azure Functions 2.x and higher. |

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

::: zone-end  

See the [Example section](#example) for complete examples.

## Usage

::: zone pivot="programming-language-csharp"  
The following parameter types are supported by all C# modalities and extension versions:

| Type | Description |
| --- | --- |
| **[System.String](/dotnet/api/system.string)** | Use when the message is simple text. |
| **byte[]** | Use for binary data messages. |
| **Object** | When a message contains JSON, Functions tries to deserialize the JSON data into known plain-old CLR object type. |

Messaging-specific parameter types contain additional message metadata. The specific types supported by the Service Bus trigger depend on the Functions runtime version, the extension package version, and the C# modality used.

# [Extension v5.x](#tab/extensionv5/in-process)

Use the [ServiceBusReceivedMessage](/dotnet/api/azure.messaging.servicebus.servicebusreceivedmessage) type to receive message metadata from Service Bus Queues and Subscriptions. To learn more, see [Messages, payloads, and serialization](../service-bus-messaging/service-bus-messages-payloads.md).

In [C# class libraries](functions-dotnet-class-library.md), the attribute's constructor takes the name of the queue or the topic and subscription. 

[!INCLUDE [functions-service-bus-account-attribute](../../includes/functions-service-bus-account-attribute.md)]

# [Functions 2.x and higher](#tab/functionsv2/in-process)

Use the [Message](/dotnet/api/microsoft.azure.servicebus.message) type to receive messages with metadata. To learn more, see [Messages, payloads, and serialization](../service-bus-messaging/service-bus-messages-payloads.md).

In [C# class libraries](functions-dotnet-class-library.md), the attribute's constructor takes the name of the queue or the topic and subscription. 

[!INCLUDE [functions-service-bus-account-attribute](../../includes/functions-service-bus-account-attribute.md)]

# [Functions 1.x](#tab/functionsv1/in-process)

The following parameter types are available for the queue or topic message:

* [BrokeredMessage](/dotnet/api/microsoft.servicebus.messaging.brokeredmessage) - Gives you the deserialized message with the [BrokeredMessage.GetBody\<T>()](/dotnet/api/microsoft.servicebus.messaging.brokeredmessage.getbody#Microsoft_ServiceBus_Messaging_BrokeredMessage_GetBody__1) method.
* [MessageReceiver](/dotnet/api/microsoft.azure.servicebus.core.messagereceiver) - Used to receive and acknowledge messages from the message container, which is required when `autoComplete` is set to `false`.

In [C# class libraries](functions-dotnet-class-library.md), the attribute's constructor takes the name of the queue or the topic and subscription. In Azure Functions version 1.x, you can also specify the connection's access rights. If you don't specify access rights, the default is `Manage`. 

[!INCLUDE [functions-service-bus-account-attribute](../../includes/functions-service-bus-account-attribute.md)]

# [Extension 5.x and higher](#tab/extensionv5/isolated-process)

[!INCLUDE [functions-bindings-service-bus-trigger-dotnet-isolated-types](../../includes/functions-bindings-service-bus-trigger-dotnet-isolated-types.md)]

# [Functions 2.x and higher](#tab/functionsv2/isolated-process)

Earlier versions of this extension in the isolated worker process only support binding to messaging-specific types. Additional options are available to **extension 5.x and higher**

# [Functions 1.x](#tab/functionsv1/isolated-process)

Functions version 1.x doesn't support isolated worker process. To use the isolated worker model, [upgrade your application to Functions 4.x].

---

When the `Connection` property isn't defined, Functions looks for an app setting named `AzureWebJobsServiceBus`, which is the default name for the Service Bus connection string. You can also set the `Connection` property to specify the name of an application setting that contains the Service Bus connection string to use.

::: zone-end  
::: zone pivot="programming-language-java"

The incoming Service Bus message is available via a `ServiceBusQueueMessage` or `ServiceBusTopicMessage` parameter.

::: zone-end  
::: zone pivot="programming-language-javascript"  
Access the queue or topic message by using `context.bindings.<name from function.json>`. The Service Bus message is passed into the function as either a string or JSON object.
::: zone-end  
::: zone pivot="programming-language-powershell"  
The Service Bus instance is available via the parameter configured in the *function.json* file's name property.
::: zone-end   
::: zone pivot="programming-language-python"  
The queue message is available to the function via a parameter typed as `func.ServiceBusMessage`. The Service Bus message is passed into the function as either a string or JSON object.
::: zone-end 
For a complete example, see [the examples section](#example).

[!INCLUDE [functions-service-bus-connections](../../includes/functions-service-bus-connections.md)]

## Poison messages

Poison message handling can't be controlled or configured in Azure Functions. Service Bus handles poison messages itself.

## PeekLock behavior

The Functions runtime receives a message in [PeekLock mode](../service-bus-messaging/service-bus-performance-improvements.md#receive-mode). It calls `Complete` on the message if the function finishes successfully, or calls `Abandon` if the function fails. If the function runs longer than the `PeekLock` timeout, the lock is automatically renewed as long as the function is running.

The `maxAutoRenewDuration` is configurable in *host.json*, which maps to [OnMessageOptions.MaxAutoRenewDuration](/dotnet/api/microsoft.azure.servicebus.messagehandleroptions.maxautorenewduration). The default value of this setting is 5 minutes.

::: zone pivot="programming-language-csharp" 
## Message metadata

Messaging-specific types let you easily retrieve [metadata as properties of the object](./functions-bindings-expressions-patterns.md#trigger-metadata). These properties depend on the Functions runtime version, the extension package version, and the C# modality used.

# [Extension v5.x](#tab/extensionv5/in-process)

These properties are members of the [ServiceBusReceivedMessage](/dotnet/api/azure.messaging.servicebus.servicebusreceivedmessage) class.

|Property|Type|Description|
|--------|----|-----------|
|`ApplicationProperties`|`ApplicationProperties`|Properties set by the sender.|
|`ContentType`|`string`|A content type identifier utilized by the sender and receiver for application-specific logic.|
|`CorrelationId`|`string`|The correlation ID.|
|`DeliveryCount`|`Int32`|The number of deliveries.|
|`EnqueuedTime`|`DateTime`|The enqueued time in UTC.|
|`ScheduledEnqueueTimeUtc`|`DateTime`|The scheduled enqueued time in UTC.|
|`ExpiresAt`|`DateTime`|The expiration time in UTC.|
|`MessageId`|`string`|A user-defined value that Service Bus can use to identify duplicate messages, if enabled.|
|`ReplyTo`|`string`|The reply to queue address.|
|`Subject`|`string`|The application-specific label which can be used in place of the `Label` metadata property.|
|`To`|`string`|The send to address.|

# [Functions 2.x and higher](#tab/functionsv2/in-process)

These properties are members of the [Message](/dotnet/api/microsoft.azure.servicebus.message) class.

|Property|Type|Description|
|--------|----|-----------|
|`ContentType`|`string`|A content type identifier utilized by the sender and receiver for application-specific logic.|
|`CorrelationId`|`string`|The correlation ID.|
|`DeliveryCount`|`Int32`|The number of deliveries.|
|`ScheduledEnqueueTimeUtc`|`DateTime`|The scheduled enqueued time in UTC.|
|`ExpiresAtUtc`|`DateTime`|The expiration time in UTC.|
|`Label`|`string`|The application-specific label.|
|`MessageId`|`string`|A user-defined value that Service Bus can use to identify duplicate messages, if enabled.|
|`ReplyTo`|`string`|The reply to queue address.|
|`To`|`string`|The send to address.|
|`UserProperties`|`IDictionary<string, object>`|Properties set by the sender. |

# [Functions 1.x](#tab/functionsv1/in-process)

These properties are members of the [BrokeredMessage](/dotnet/api/microsoft.servicebus.messaging.brokeredmessage) and [MessageReceiver](/dotnet/api/microsoft.azure.servicebus.core.messagereceiver) classes.

|Property|Type|Description|
|--------|----|-----------|
|`ContentType`|`string`|A content type identifier utilized by the sender and receiver for application-specific logic.|
|`CorrelationId`|`string`|The correlation ID.|
|`DeadLetterSource`|`string`|The dead letter source.|
|`DeliveryCount`|`Int32`|The number of deliveries.|
|`EnqueuedTimeUtc`|`DateTime`|The enqueued time in UTC.|
|`ExpiresAtUtc`|`DateTime`|The expiration time in UTC.|
|`Label`|`string`|The application-specific label.|
|`MessageId`|`string`|A user-defined value that Service Bus can use to identify duplicate messages, if enabled.|
|`MessageReceiver`|`MessageReceiver`|Service Bus message receiver. Can be used to abandon, complete, or deadletter the message.|
|`MessageSession`|`MessageSession`|A message receiver specifically for session-enabled queues and topics.|
|`ReplyTo`|`string`|The reply to queue address.|
|`SequenceNumber`|`long`|The unique number assigned to a message by the Service Bus.|
|`To`|`string`|The send to address.|
|`UserProperties`|`IDictionary<string, object>`|Properties set by the sender. |

# [Extension 5.x and higher](#tab/extensionv5/isolated-process)

These properties are members of the [ServiceBusReceivedMessage](/dotnet/api/azure.messaging.servicebus.servicebusreceivedmessage) class.

|Property|Type|Description|
|--------|----|-----------|
|`ApplicationProperties`|`ApplicationProperties`|Properties set by the sender.|
|`ContentType`|`string`|A content type identifier utilized by the sender and receiver for application-specific logic.|
|`CorrelationId`|`string`|The correlation ID.|
|`DeliveryCount`|`Int32`|The number of deliveries.|
|`EnqueuedTime`|`DateTime`|The enqueued time in UTC.|
|`ScheduledEnqueueTimeUtc`|`DateTime`|The scheduled enqueued time in UTC.|
|`ExpiresAt`|`DateTime`|The expiration time in UTC.|
|`MessageId`|`string`|A user-defined value that Service Bus can use to identify duplicate messages, if enabled.|
|`ReplyTo`|`string`|The reply to queue address.|
|`Subject`|`string`|The application-specific label which can be used in place of the `Label` metadata property.|
|`To`|`string`|The send to address.|


# [Functions 2.x and higher](#tab/functionsv2/isolated-process)

Earlier versions of this extension in the isolated worker process only support binding to messaging-specific types. Additional options are available to **Extension 5.x and higher**

# [Functions 1.x](#tab/functionsv1/isolated-process)

Functions version 1.x doesn't support isolated worker process. To use the isolated worker model, [upgrade your application to Functions 4.x].

---

::: zone-end

## Next steps

- [Send Azure Service Bus messages from Azure Functions (Output binding)](./functions-bindings-service-bus-output.md)


[BrokeredMessage]: /dotnet/api/microsoft.servicebus.messaging.brokeredmessage
[upgrade your application to Functions 4.x]: ./migrate-version-1-version-4.md
