---
title: Azure Functions Queue storage bindings
description: Understand how to use the Azure Queue storage trigger and output binding in Azure Functions.
services: functions
documentationcenter: na
author: ggailey777
manager: cfowler
editor: ''
tags: ''
keywords: azure functions, functions, event processing, dynamic compute, serverless architecture

ms.service: functions
ms.devlang: multiple
ms.topic: reference
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 10/23/2017
ms.author: glenga
---

# Azure Functions Queue storage bindings

This article explains how to work with Azure Queue storage bindings in Azure Functions. Azure Functions supports trigger and output bindings for queues.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

## Queue storage trigger

Use the queue trigger to start a function when a new item is received on a queue. The queue message is provided as input to the function.

## Trigger - example

See the language-specific example:

* [Precompiled C#](#trigger---c-example)
* [C# script](#trigger---c-script-example)
* [JavaScript](#trigger---javascript-example)

### Trigger - C# example

The following example shows [precompiled C#](functions-dotnet-class-library.md) code that polls the `myqueue-items` queue and writes a log each time a queue item is processed.

```csharp
public static class QueueFunctions
{
    [FunctionName("QueueTrigger")]
    public static void QueueTrigger(
        [QueueTrigger("myqueue-items")] string myQueueItem, 
        TraceWriter log)
    {
        log.Info($"C# function processed: {myQueueItem}");
    }
}
```

### Trigger - C# script example

The following example shows a blob trigger binding in a *function.json* file and [C# script](functions-reference-csharp.md) code that uses the binding. The function polls the `myqueue-items` queue and writes a log each time a queue item is processed.

Here's the *function.json* file:

```json
{
    "disabled": false,
    "bindings": [
        {
            "type": "queueTrigger",
            "direction": "in",
            "name": "myQueueItem",
            "queueName": "myqueue-items",
            "connection":"MyStorageConnectionAppSetting"
        }
    ]
}
```

The [settings](#trigger---settings) section explains these properties.

Here's the C# script code:

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

The [usage](#trigger---usage) section explains `myQueueItem`, which is named by the `name` property in function.json.  The [message metadata section](#trigger---message-metadata) explains all of the other variables shown.

### Trigger - JavaScript example

The following example shows a blob trigger binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding. The function polls the `myqueue-items` queue and writes a log each time a queue item is processed.

Here's the *function.json* file:

```json
{
    "disabled": false,
    "bindings": [
        {
            "type": "queueTrigger",
            "direction": "in",
            "name": "myQueueItem",
            "queueName": "myqueue-items",
            "connection":"MyStorageConnectionAppSetting"
        }
    ]
}
```

The [settings](#trigger---settings) section explains these properties.

Here's the JavaScript code:

```javascript
module.exports = function (context) {
    context.log('Node.js queue trigger function processed work item', context.bindings.myQueueItem);
    context.log('queueTrigger =', context.bindingData.queueTrigger);
    context.log('expirationTime =', context.bindingData.expirationTime);
    context.log('insertionTime =', context.bindingData.insertionTime);
    context.log('nextVisibleTime =', context.bindingData.nextVisibleTime);
    context.log('id =', context.bindingData.id);
    context.log('popReceipt =', context.bindingData.popReceipt);
    context.log('dequeueCount =', context.bindingData.dequeueCount);
    context.done();
};
```

The [usage](#trigger---usage) section explains `myQueueItem`, which is named by the `name` property in function.json.  The [message metadata section](#trigger---message-metadata) explains all of the other variables shown.

## Trigger - .NET attributes
 
For [precompiled C#](functions-dotnet-class-library.md) functions, use the following attributes to configure a queue trigger:

* [QueueTriggerAttribute](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/QueueTriggerAttribute.cs), defined in NuGet package [Microsoft.Azure.WebJobs](http://www.nuget.org/packages/Microsoft.Azure.WebJobs)

  The attribute's constructor takes the name of the queue to monitor, as shown in the following example:

  ```csharp
  [FunctionName("QueueTrigger")]
  public static void Run(
      [QueueTrigger("myqueue-items")] string myQueueItem, 
      TraceWriter log)
  ```

  You can set the `Connection` property to specify the storage account to use, as shown in the following example:

  ```csharp
  [FunctionName("QueueTrigger")]
  public static void Run(
      [QueueTrigger("myqueue-items", Connection = "StorageConnectionAppSetting")] string myQueueItem, 
      TraceWriter log)
  ```
 
* [StorageAccountAttribute](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/StorageAccountAttribute.cs), defined in NuGet package [Microsoft.Azure.WebJobs](http://www.nuget.org/packages/Microsoft.Azure.WebJobs)

  Provides another way to specify the storage account to use. The constructor takes the name of an app setting that contains a storage connection string. The attribute can be applied at the parameter, method, or class level. The following example shows class level and method level:

  ```csharp
  [StorageAccount("ClassLevelStorageAppSetting")]
  public static class AzureFunctions
  {
      [FunctionName("QueueTrigger")]
      [StorageAccount("FunctionLevelStorageAppSetting")]
      public static void Run( //...
  ```

The storage account to use is determined in the following order:

* The `QueueTrigger` attribute's `Connection` property.
* The `StorageAccount` attribute applied to the same parameter as the `QueueTrigger` attribute.
* The `StorageAccount` attribute applied to the function.
* The `StorageAccount` attribute applied to the class.
* The "AzureWebJobsStorage" app setting.

## Trigger - configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `QueueTrigger` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type** | n/a| Must be set to `queueTrigger`. This property is set automatically when you create the trigger in the Azure portal.|
|**direction**| n/a | In the *function.json* file only. Must be set to `in`. This property is set automatically when you create the trigger in the Azure portal. |
|**name** | n/a |The name of the variable that represents the queue in function code.  | 
|**queueName** | **QueueName**| The name of the queue to poll. | 
|**connection** | **Connection** |The name of an app setting that contains the Storage connection string to use for this binding. If the app setting name begins with "AzureWebJobs", you can specify only the remainder of the name here. For example, if you set `connection` to "MyStorage", the Functions runtime looks for an app setting that is named "AzureWebJobsMyStorage." If you leave `connection` empty, the Functions runtime uses the default Storage connection string in the app setting that is named `AzureWebJobsStorage`.|

## Trigger - usage
 
In C# and C# script, access the blob data by using a method parameter such as `Stream paramName`. In C# script, `paramName` is the value specified in the `name` property of *function.json*. You can bind to any of the following types:

* POCO object - The Functions runtime deserializes a JSON payload into a POCO object. 
* `string`
* `byte[]`
* [CloudQueueMessage]

In JavaScript, use `context.bindings.<name>` to access the queue item payload. If the payload is JSON, it's deserialized into an object.

## Trigger - message metadata

The queue trigger provides several metadata properties. These properties can be used as part of binding expressions in other bindings or as parameters in your code. The values have the same semantics as [CloudQueueMessage](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.queue.cloudqueuemessage).

|Property|Type|Description|
|--------|----|-----------|
|`QueueTrigger`|`string`|Queue payload (if a valid string). If the queue message payload as a string, `QueueTrigger` has the same value as the variable named by the `name` property in *function.json*.|
|`DequeueCount`|`int`|The number of times this message has been dequeued.|
|`ExpirationTime`|`DateTimeOffset?`|The time that the message expires.|
|`Id`|`string`|Queue message ID.|
|`InsertionTime`|`DateTimeOffset?`|The time that the message was added to the queue.|
|`NextVisibleTime`|`DateTimeOffset?`|The time that the message will next be visible.|
|`PopReceipt`|`string`|The message's pop receipt.|

## Trigger - poison messages

When a queue trigger function fails, Azure Functions retries the function up to five times for a given queue message, including the first try. If all five attempts fail, the functions runtime adds a message to a queue named *&lt;originalqueuename>-poison*. You can write a function to process messages from the poison queue by logging them or sending a  notification that manual attention is needed.

To handle poison messages manually, check the [dequeueCount](#trigger---message-metadata) of the queue message.

## Trigger - host.json properties

The [host.json](functions-host-json.md#queues) file contains settings that control queue trigger behavior.

[!INCLUDE [functions-host-json-queues](../../includes/functions-host-json-queues.md)]

## Queue storage output binding

Use the Azure Queue storage output binding to write messages to a queue.

## Output - example

See the language-specific example:

* [Precompiled C#](#output---c-example)
* [C# script](#output---c-script-example)
* [JavaScript](#output---javascript-example)

### Output - C# example

The following example shows [precompiled C#](functions-dotnet-class-library.md) code that creates a queue message for each HTTP request received.

```csharp
[StorageAccount("AzureWebJobsStorage")]
public static class QueueFunctions
{
    [FunctionName("QueueOutput")]
    [return: Queue("myqueue-items")]
    public static string QueueOutput([HttpTrigger] dynamic input,  TraceWriter log)
    {
        log.Info($"C# function processed: {input.Text}");
        return input.Text;
    }
}
```

### Output - C# script example

The following example shows a blob trigger binding in a *function.json* file and [C# script](functions-reference-csharp.md) code that uses the binding. The function creates a queue item with a POCO payload for each HTTP request received.

Here's the *function.json* file:

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
      "connection": "MyStorageConnectionAppSetting",
    }
  ]
}
``` 

The [settings](#output---settings) section explains these properties.

Here's C# script code that creates a single queue message:

```cs
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

You can send multiple messages at once by using an `ICollector` or `IAsyncCollector` parameter. Here's C# script code that sends multiple messages, one with the HTTP request data and one with hard-coded values:

```cs
public static void Run(
    CustomQueueMessage input, 
    ICollector<CustomQueueMessage> myQueueItem, 
    TraceWriter log)
{
    myQueueItem.Add(input);
    myQueueItem.Add(new CustomQueueMessage { PersonName = "You", Title = "None" });
}
```

### Output - JavaScript example

The following example shows a blob trigger binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding. The function creates a queue item for each HTTP request received.

Here's the *function.json* file:

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
      "connection": "MyStorageConnectionAppSetting",
    }
  ]
}
``` 

The [settings](#output---settings) section explains these properties.

Here's the JavaScript code:

```javascript
module.exports = function (context, input) {
    context.done(null, input.body);
};
```

You can send multiple messages at once by defining a message array for the `myQueueItem` output binding. The following JavaScript code sends two queue messages with hard-coded values for each HTTP request received.

```javascript
module.exports = function(context) {
    context.bindings.myQueueItem = ["message 1","message 2"];
    context.done();
};
```

## Output - .NET attributes
 
For [precompiled C#](functions-dotnet-class-library.md) functions, use the [QueueAttribute](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/QueueAttribute.cs), which is defined in NuGet package [Microsoft.Azure.WebJobs](http://www.nuget.org/packages/Microsoft.Azure.WebJobs).

The attribute applies to an `out` parameter or the return value of the function. The attribute's constructor takes the name of the queue, as shown in the following example:

```csharp
[FunctionName("QueueOutput")]
[return: Queue("myqueue-items")]
public static string Run([HttpTrigger] dynamic input,  TraceWriter log)
```

You can set the `Connection` property to specify the storage account to use, as shown in the following example:

```csharp
[FunctionName("QueueOutput")]
[return: Queue("myqueue-items, Connection = "StorageConnectionAppSetting")]
public static string Run([HttpTrigger] dynamic input,  TraceWriter log)
```

You can use the `StorageAccount` attribute to specify the storage account at class, method, or parameter level. For more information, see [Trigger - .NET attributes](#trigger---net-attributes).

## Output - configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `Queue` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type** | n/a | Must be set to `queue`. This property is set automatically when you create the trigger in the Azure portal.|
|**direction** | n/a | Must be set to `out`. This property is set automatically when you create the trigger in the Azure portal. |
|**name** | n/a | The name of the variable that represents the queue in function code. Set to `$return` to reference the function return value.| 
|**queueName** |**QueueName** | The name of the queue. | 
|**connection** | **Connection** |The name of an app setting that contains the Storage connection string to use for this binding. If the app setting name begins with "AzureWebJobs", you can specify only the remainder of the name here. For example, if you set `connection` to "MyStorage", the Functions runtime looks for an app setting that is named "AzureWebJobsMyStorage." If you leave `connection` empty, the Functions runtime uses the default Storage connection string in the app setting that is named `AzureWebJobsStorage`.|

## Output - usage
 
In C# and C# script, write a single queue message by using a method parameter such as `out T paramName`. In C# script, `paramName` is the value specified in the `name` property of *function.json*. You can use the method return type instead of an `out` parameter, and `T` can be any of the following types:

* A POCO serializable as JSON
* `string`
* `byte[]`
* [CloudQueueMessage] 

In C# and C# script, write multiple queue messages by using one of the following types: 

* `ICollector<T>` or `IAsyncCollector<T>`
* [CloudQueue](/dotnet/api/microsoft.windowsazure.storage.queue.cloudqueue)

In JavaScript functions, use `context.bindings.<name>` to access the output queue message. You can use a string or a JSON-serializable object for the queue item payload.

## Next steps

> [!div class="nextstepaction"]
> [Go to a quickstart that uses a Queue storage trigger](functions-create-storage-queue-triggered-function.md)

> [!div class="nextstepaction"]
> [Go to a tutorial that uses a Queue storage output binding](functions-integrate-storage-queue-output-binding.md)

> [!div class="nextstepaction"]
> [Learn more about Azure functions triggers and bindings](functions-triggers-bindings.md)

<!-- LINKS -->

[CloudQueueMessage]: /dotnet/api/microsoft.windowsazure.storage.queue.cloudqueuemessage