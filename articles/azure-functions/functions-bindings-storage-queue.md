---
title: Azure Functions queue storage bindings | Microsoft Docs
description: Understand how to use Azure Storage triggers and bindings in Azure Functions.
services: functions
documentationcenter: na
author: lindydonna
manager: erikre
editor: ''
tags: ''
keywords: azure functions, functions, event processing, dynamic compute, serverless architecture

ms.assetid: 4e6a837d-e64f-45a0-87b7-aa02688a75f3
ms.service: functions
ms.devlang: multiple
ms.topic: reference
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 05/30/2017
ms.author: donnam, glenga

---
# Azure Functions Queue Storage bindings
[!INCLUDE [functions-selector-bindings](../../includes/functions-selector-bindings.md)]

This article describes how to configure and code Azure Queue storage bindings in Azure Functions. Azure Functions supports trigger and output bindings for Azure queues. For features that are available in all bindings, see [Azure Functions triggers and bindings concepts](functions-triggers-bindings.md).

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

<a name="trigger"></a>

## Queue storage trigger
The Azure Queue storage trigger enables you to monitor a queue storage for new messages and react to them. 

Define a queue trigger using the **Integrate** tab in the Functions portal. The portal creates the following definition in the  **bindings** section of *function.json*:

```json
{
    "type": "queueTrigger",
    "direction": "in",
    "name": "<The name used to identify the trigger data in your code>",
    "queueName": "<Name of queue to poll>",
    "connection":"<Name of app setting - see below>"
}
```

* The `connection` property must contain the name of an app setting that contains a storage connection string. In the Azure portal, the standard editor in the **Integrate** tab configures this app setting for you when you select a storage account.

Additional settings can be provided in a [host.json file](https://github.com/Azure/azure-webjobs-sdk-script/wiki/host.json) to further fine-tune queue storage triggers. For example, you can change the queue polling interval in host.json.

<a name="triggerusage"></a>

## Using a queue trigger
In Node.js functions, access the queue data using `context.bindings.<name>`.


In .NET functions, access the queue payload using a method parameter such as `CloudQueueMessage paramName`. Here, `paramName` is the value you specified in the [trigger configuration](#trigger). The queue message can be deserialized to any of the following types:

* POCO object. Use if the queue payload is a JSON object. The Functions runtime deserializes the payload into the POCO object. 
* `string`
* `byte[]`
* [`CloudQueueMessage`]

<a name="meta"></a>

### Queue trigger metadata
The queue trigger provides several metadata properties. These properties can be used as part of binding expressions in other bindings or as parameters in your code. The values have the same semantics as [`CloudQueueMessage`].

* **QueueTrigger** - queue payload (if a valid string)
* **DequeueCount** - Type `int`. The number of times this message has been dequeued.
* **ExpirationTime** - Type `DateTimeOffset?`. The time that the message expires.
* **Id** - Type `string`. Queue message ID.
* **InsertionTime** - Type `DateTimeOffset?`. The time that the message was added to the queue.
* **NextVisibleTime** - Type `DateTimeOffset?. The time that the message will next be visible.
* **PopReceipt** - Type `string`. The message's pop receipt.

See how to use the queue metadata in [Trigger sample](#triggersample).

<a name="triggersample"></a>

## Trigger sample
Suppose you have the following function.json that defines a queue trigger:

```json
{
    "disabled": false,
    "bindings": [
        {
            "type": "queueTrigger",
            "direction": "in",
            "name": "myQueueItem",
            "queueName": "myqueue-items",
            "connection":"MyStorageConnectionString"
        }
    ]
}
```

See the language-specific sample that retrieves and logs queue metadata.

* [C#](#triggercsharp)
* [Node.js](#triggernodejs)

<a name="triggercsharp"></a>

### Trigger sample in C# #
```csharp
#r "Microsoft.WindowsAzure.Storage"

using Microsoft.WindowsAzure.Storage.Queue;
using System;

public static void Run(CloudQueueMessage myQueueItem, 
    DateTimeOffset expirationTime, 
    DateTimeOffset insertionTime, 
    DateTimeOffset nextVisibleTime,
    string queueTrigger,
    string id,
    string popReceipt,
    int dequeueCount,
    TraceWriter log)
{
    log.Info($"C# Queue trigger function processed: {myQueueItem.AsString}\n" +
        $"queueTrigger={queueTrigger}\n" +
        $"expirationTime={expirationTime}\n" +
        $"insertionTime={insertionTime}\n" +
        $"nextVisibleTime={nextVisibleTime}\n" +
        $"id={id}\n" +
        $"popReceipt={popReceipt}\n" + 
        $"dequeueCount={dequeueCount}");
}
```

<!--
<a name="triggerfsharp"></a>
### Trigger sample in F# ## 
```fsharp

```
-->

<a name="triggernodejs"></a>

### Trigger sample in Node.js

```javascript
module.exports = function (context) {
    context.log('Node.js queue trigger function processed work item', context.bindings.myQueueItem);
    context.log('queueTrigger =', context.bindingData.queueTrigger);
    context.log('expirationTime =', context.bindingData.expirationTime);
    context.log('insertionTime =', context.bindingData.insertionTime);
    context.log('nextVisibleTime =', context.bindingData.nextVisibleTime);
    context.log('id=', context.bindingData.id);
    context.log('popReceipt =', context.bindingData.popReceipt);
    context.log('dequeueCount =', context.bindingData.dequeueCount);
    context.done();
};
```

### Handling poison queue messages
When a queue trigger function fails, Azure Functions retries that function up to five times for a given queue message, including the first try. If all five attempts fail, the functions runtime adds a message to a queue storage named *&lt;originalqueuename>-poison*. You can write a function to process messages from the poison queue by logging them or sending a  notification that manual attention is needed. 

To handle poison messages manually, check the `dequeueCount` of the queue message (see [Queue trigger metadata](#meta)).

<a name="output"></a>

## Queue storage output binding
The Azure queue storage output binding enables you to write messages to a queue. 

Define a queue output binding using the **Integrate** tab in the Functions portal. The portal creates the following definition in the  **bindings** section of *function.json*:

```json
{
   "type": "queue",
   "direction": "out",
   "name": "<The name used to identify the trigger data in your code>",
   "queueName": "<Name of queue to write to>",
   "connection":"<Name of app setting - see below>"
}
```

* The `connection` property must contain the name of an app setting that contains a storage connection string. In the Azure portal, the standard editor in the **Integrate** tab configures this app setting for you when you select a storage account.

<a name="outputusage"></a>

## Using a queue output binding
In Node.js functions, you access the output queue using `context.bindings.<name>`.

In .NET functions, you can output to any of the following types. When there is a type parameter `T`, `T` must be one of the supported output types, such as `string` or a POCO.

* `out T` (serialized as JSON)
* `out string`
* `out byte[]`
* `out` [`CloudQueueMessage`] 
* `ICollector<T>`
* `IAsyncCollector<T>`
* [`CloudQueue`](/dotnet/api/microsoft.windowsazure.storage.queue.cloudqueue)

You can also use the method return type as the output binding.

<a name="outputsample"></a>

## Queue output sample
The following *function.json* defines an HTTP trigger with a queue output binding:

```json
{
  "bindings": [
    {
      "type": "httpTrigger",
      "direction": "in",
      "authLevel": "function",
      "name": "input"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "return"
    },
    {
      "type": "queue",
      "direction": "out",
      "name": "$return",
      "queueName": "outqueue",
      "connection": "MyStorageConnectionString",
    }
  ]
}
``` 

See the language-specific sample that outputs a queue message with the incoming HTTP payload.

* [C#](#outcsharp)
* [Node.js](#outnodejs)

<a name="outcsharp"></a>

### Queue output sample in C# #

```cs
// C# example of HTTP trigger binding to a custom POCO, with a queue output binding
public class CustomQueueMessage
{
    public string PersonName { get; set; }
    public string Title { get; set; }
}

public static CustomQueueMessage Run(CustomQueueMessage input, TraceWriter log)
{
    return input;
}
```

To send multiple messages, use an `ICollector`:

```cs
public static void Run(CustomQueueMessage input, ICollector<CustomQueueMessage> myQueueItem, TraceWriter log)
{
    myQueueItem.Add(input);
    myQueueItem.Add(new CustomQueueMessage { PersonName = "You", Title = "None" });
}
```

<a name="outnodejs"></a>

### Queue output sample in Node.js

```javascript
module.exports = function (context, input) {
    context.done(null, input.body);
};
```

Or, to send multiple messages,

```javascript
module.exports = function(context) {
	// Define a message array for the myQueueItem output binding. 
    context.bindings.myQueueItem = ["message 1","message 2"];
    context.done();
};
```

## Next steps

For an example of a function that uses queue storage triggers and bindings, see [Create an Azure Function connected to an Azure service](functions-create-an-azure-connected-function.md).

[!INCLUDE [next steps](../../includes/functions-bindings-next-steps.md)]

<!-- LINKS -->

[`CloudQueueMessage`]: /dotnet/api/microsoft.windowsazure.storage.queue.cloudqueuemessage