---
title: Azure Service Bus trigger for Azure Functions
description: Learn to run an Azure Function when as Azure Service Bus messages are created.
author: craigshoemaker

ms.assetid: daedacf0-6546-4355-a65c-50873e74f66b
ms.topic: reference
ms.date: 02/19/2020
ms.author: cshoe
ms.custom: tracking-python
---

# Azure Service Bus trigger for Azure Functions

Use the Service Bus trigger to respond to messages from a Service Bus queue or topic. 
Starting with extension version 3.1.0, you can trigger on a session-enabled queue or topic.

For information on setup and configuration details, see the [overview](functions-bindings-service-bus-output.md).

## Example

# [C#](#tab/csharp)

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

# [C# Script](#tab/csharp-script)

The following example shows a Service Bus trigger binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding. The function reads [message metadata](#message-metadata) and logs a Service Bus queue message.

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

Here's the C# script code:

```cs
using System;

public static void Run(string myQueueItem,
    Int32 deliveryCount,
    DateTime enqueuedTimeUtc,
    string messageId,
    TraceWriter log)
{
    log.Info($"C# ServiceBus queue trigger function processed message: {myQueueItem}");

    log.Info($"EnqueuedTimeUtc={enqueuedTimeUtc}");
    log.Info($"DeliveryCount={deliveryCount}");
    log.Info($"MessageId={messageId}");
}
```

# [JavaScript](#tab/javascript)

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
module.exports = function(context, myQueueItem) {
    context.log('Node.js ServiceBus queue trigger function processed message', myQueueItem);
    context.log('EnqueuedTimeUtc =', context.bindingData.enqueuedTimeUtc);
    context.log('DeliveryCount =', context.bindingData.deliveryCount);
    context.log('MessageId =', context.bindingData.messageId);
    context.done();
};
```

# [Python](#tab/python)

The following example demonstrates how to read a Service Bus queue message via a trigger.

A Service Bus binding is defined in *function.json* where *type* is set to `serviceBusTrigger`.

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
    })

    logging.info(result)
```

# [Java](#tab/java)

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

---

## Attributes and annotations

# [C#](#tab/csharp)

In [C# class libraries](functions-dotnet-class-library.md), use the following attributes to configure a Service Bus trigger:

* [ServiceBusTriggerAttribute](https://github.com/Azure/azure-functions-servicebus-extension/blob/master/src/Microsoft.Azure.WebJobs.Extensions.ServiceBus/ServiceBusTriggerAttribute.cs)

  The attribute's constructor takes the name of the queue or the topic and subscription. In Azure Functions version 1.x, you can also specify the connection's access rights. If you don't specify access rights, the default is `Manage`. For more information, see the [Trigger - configuration](#configuration) section.

  Here's an example that shows the attribute used with a string parameter:

  ```csharp
  [FunctionName("ServiceBusQueueTriggerCSharp")]                    
  public static void Run(
      [ServiceBusTrigger("myqueue")] string myQueueItem, ILogger log)
  {
      ...
  }
  ```

  Since the `Connection` property isn't defined, Functions looks for an app setting named `AzureWebJobsServiceBus`, which is the default name for the Service Bus connection string. You can also set the `Connection` property to specify the name of an application setting that contains the Service Bus connection string to use, as shown in the following example:

  ```csharp
  [FunctionName("ServiceBusQueueTriggerCSharp")]                    
  public static void Run(
      [ServiceBusTrigger("myqueue", Connection = "ServiceBusConnection")] 
      string myQueueItem, ILogger log)
  {
      ...
  }
  ```

  For a complete example, see [Trigger - example](#example).

* [ServiceBusAccountAttribute](https://github.com/Azure/azure-functions-servicebus-extension/blob/master/src/Microsoft.Azure.WebJobs.Extensions.ServiceBus/ServiceBusAccountAttribute.cs)

  Provides another way to specify the Service Bus account to use. The constructor takes the name of an app setting that contains a Service Bus connection string. The attribute can be applied at the parameter, method, or class level. The following example shows class level and method level:

  ```csharp
  [ServiceBusAccount("ClassLevelServiceBusAppSetting")]
  public static class AzureFunctions
  {
      [ServiceBusAccount("MethodLevelServiceBusAppSetting")]
      [FunctionName("ServiceBusQueueTriggerCSharp")]
      public static void Run(
          [ServiceBusTrigger("myqueue", AccessRights.Manage)] 
          string myQueueItem, ILogger log)
  {
      ...
  }
  ```

The Service Bus account to use is determined in the following order:

* The `ServiceBusTrigger` attribute's `Connection` property.
* The `ServiceBusAccount` attribute applied to the same parameter as the `ServiceBusTrigger` attribute.
* The `ServiceBusAccount` attribute applied to the function.
* The `ServiceBusAccount` attribute applied to the class.
* The "AzureWebJobsServiceBus" app setting.

# [C# Script](#tab/csharp-script)

Attributes are not supported by C# Script.

# [JavaScript](#tab/javascript)

Attributes are not supported by JavaScript.

# [Python](#tab/python)

Attributes are not supported by Python.

# [Java](#tab/java)

The `ServiceBusQueueTrigger` annotation allows you to create a function that runs when a Service Bus queue message is created. Configuration options available include queue name and connection string name.

The `ServiceBusTopicTrigger` annotation allows you to designate a topic and subscription to target what data triggers the function.

See the trigger [example](#example) for more detail.

---

## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `ServiceBusTrigger` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type** | n/a | Must be set to "serviceBusTrigger". This property is set automatically when you create the trigger in the Azure portal.|
|**direction** | n/a | Must be set to "in". This property is set automatically when you create the trigger in the Azure portal. |
|**name** | n/a | The name of the variable that represents the queue or topic message in function code. |
|**queueName**|**QueueName**|Name of the queue to monitor.  Set only if monitoring a queue, not for a topic.
|**topicName**|**TopicName**|Name of the topic to monitor. Set only if monitoring a topic, not for a queue.|
|**subscriptionName**|**SubscriptionName**|Name of the subscription to monitor. Set only if monitoring a topic, not for a queue.|
|**connection**|**Connection**|The name of an app setting that contains the Service Bus connection string to use for this binding. If the app setting name begins with "AzureWebJobs", you can specify only the remainder of the name. For example, if you set `connection` to "MyServiceBus", the Functions runtime looks for an app setting that is named "AzureWebJobsMyServiceBus". If you leave `connection` empty, the Functions runtime uses the default Service Bus connection string in the app setting that is named "AzureWebJobsServiceBus".<br><br>To obtain a connection string, follow the steps shown at [Get the management credentials](../service-bus-messaging/service-bus-quickstart-portal.md#get-the-connection-string). The connection string must be for a Service Bus namespace, not limited to a specific queue or topic. |
|**accessRights**|**Access**|Access rights for the connection string. Available values are `manage` and `listen`. The default is `manage`, which indicates that the `connection` has the **Manage** permission. If you use a connection string that does not have the **Manage** permission, set `accessRights` to "listen". Otherwise, the Functions runtime might fail trying to do operations that require manage rights. In Azure Functions version 2.x and higher, this property is not available because the latest version of the Service Bus SDK doesn't support manage operations.|
|**isSessionsEnabled**|**IsSessionsEnabled**|`true` if connecting to a [session-aware](../service-bus-messaging/message-sessions.md) queue or subscription. `false` otherwise, which is the default value.|

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Usage

# [C#](#tab/csharp)

The following parameter types are available for the queue or topic message:

* `string` - If the message is text.
* `byte[]` - Useful for binary data.
* A custom type - If the message contains JSON, Azure Functions tries to deserialize the JSON data.
* `BrokeredMessage` - Gives you the deserialized message with the [BrokeredMessage.GetBody\<T>()](https://docs.microsoft.com/dotnet/api/microsoft.servicebus.messaging.brokeredmessage.getbody?view=azure-dotnet#Microsoft_ServiceBus_Messaging_BrokeredMessage_GetBody__1)
  method.
* [`MessageReceiver`](https://docs.microsoft.com/dotnet/api/microsoft.azure.servicebus.core.messagereceiver?view=azure-dotnet) - Used to receive and acknowledge messages from the message container (required when [`autoComplete`](functions-bindings-service-bus-output.md#hostjson-settings) is set to `false`)

These parameter types are for Azure Functions version 1.x; for 2.x and higher, use [`Message`](https://docs.microsoft.com/dotnet/api/microsoft.azure.servicebus.message) instead of `BrokeredMessage`.

# [C# Script](#tab/csharp-script)

The following parameter types are available for the queue or topic message:

* `string` - If the message is text.
* `byte[]` - Useful for binary data.
* A custom type - If the message contains JSON, Azure Functions tries to deserialize the JSON data.
* `BrokeredMessage` - Gives you the deserialized message with the [BrokeredMessage.GetBody\<T>()](https://docs.microsoft.com/dotnet/api/microsoft.servicebus.messaging.brokeredmessage.getbody?view=azure-dotnet#Microsoft_ServiceBus_Messaging_BrokeredMessage_GetBody__1)
  method.

These parameters are for Azure Functions version 1.x; for 2.x and higher, use [`Message`](https://docs.microsoft.com/dotnet/api/microsoft.azure.servicebus.message) instead of `BrokeredMessage`.

# [JavaScript](#tab/javascript)

Access the queue or topic message by using `context.bindings.<name from function.json>`. The Service Bus message is passed into the function as either a string or JSON object.

# [Python](#tab/python)

The queue message is available to the function via a parameter typed as `func.ServiceBusMessage`. The Service Bus message is passed into the function as either a string or JSON object.

# [Java](#tab/java)

The incoming Service Bus message is available via a `ServiceBusQueueMessage` or `ServiceBusTopicMessage` parameter.

[See the example for details](#example).

---

## Poison messages

Poison message handling can't be controlled or configured in Azure Functions. Service Bus handles poison messages itself.

## PeekLock behavior

The Functions runtime receives a message in [PeekLock mode](../service-bus-messaging/service-bus-performance-improvements.md#receive-mode). It calls `Complete` on the message if the function finishes successfully, or calls `Abandon` if the function fails. If the function runs longer than the `PeekLock` timeout, the lock is automatically renewed as long as the function is running. 

The `maxAutoRenewDuration` is configurable in *host.json*, which maps to [OnMessageOptions.MaxAutoRenewDuration](https://docs.microsoft.com/dotnet/api/microsoft.azure.servicebus.messagehandleroptions.maxautorenewduration?view=azure-dotnet). The maximum allowed for this setting is 5 minutes according to the Service Bus documentation, whereas you can increase the Functions time limit from the default of 5 minutes to 10 minutes. For Service Bus functions you wouldn’t want to do that then, because you’d exceed the Service Bus renewal limit.

## Message metadata

The Service Bus trigger provides several [metadata properties](./functions-bindings-expressions-patterns.md#trigger-metadata). These properties can be used as part of binding expressions in other bindings or as parameters in your code. These properties are members of the [Message](/dotnet/api/microsoft.azure.servicebus.message?view=azure-dotnet) class.

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
|`UserProperties`|`IDictionary<string, object>`|Properties set by the sender.|

See [code examples](#example) that use these properties earlier in this article.

## Next steps

- [Send Azure Service Bus messages from Azure Functions (Output binding)](./functions-bindings-service-bus-output.md)
