---
title: Azure Queue storage bindings for Azure Functions
description: Understand how to use the Azure Queue storage trigger and output binding in Azure Functions.
services: functions
documentationcenter: na
author: ggailey777
manager: jeconnoc
keywords: azure functions, functions, event processing, dynamic compute, serverless architecture

ms.service: azure-functions
ms.devlang: multiple
ms.topic: reference
ms.date: 09/03/2018
ms.author: glenga
ms.custom: cc996988-fb4f-47
---

# Azure Queue storage bindings for Azure Functions

This article explains how to work with Azure Queue storage bindings in Azure Functions. Azure Functions supports trigger and output bindings for queues.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

## Packages - Functions 1.x

The Queue storage bindings are provided in the [Microsoft.Azure.WebJobs](http://www.nuget.org/packages/Microsoft.Azure.WebJobs) NuGet package, version 2.x. Source code for the package is in the [azure-webjobs-sdk](https://github.com/Azure/azure-webjobs-sdk/tree/v2.x/src/Microsoft.Azure.WebJobs.Storage/Queue) GitHub repository.

[!INCLUDE [functions-package-auto](../../includes/functions-package-auto.md)]

[!INCLUDE [functions-storage-sdk-version](../../includes/functions-storage-sdk-version.md)]

## Packages - Functions 2.x

The Queue storage bindings are provided in the [Microsoft.Azure.WebJobs.Extensions.Storage](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Storage) NuGet package, version 3.x. Source code for the package is in the [azure-webjobs-sdk](https://github.com/Azure/azure-webjobs-sdk/tree/dev/src/Microsoft.Azure.WebJobs.Extensions.Storage/Queues) GitHub repository.

[!INCLUDE [functions-package-v2](../../includes/functions-package-v2.md)]

## Trigger

Use the queue trigger to start a function when a new item is received on a queue. The queue message is provided as input to the function.

## Trigger - example

See the language-specific example:

* [C#](#trigger---c-example)
* [C# script (.csx)](#trigger---c-script-example)
* [JavaScript](#trigger---javascript-example)
* [Java](#trigger---Java-example)

### Trigger - C# example

The following example shows a [C# function](functions-dotnet-class-library.md) that polls the `myqueue-items` queue and writes a log each time a queue item is processed.

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

The following example shows a queue trigger binding in a *function.json* file and [C# script (.csx)](functions-reference-csharp.md) code that uses the binding. The function polls the `myqueue-items` queue and writes a log each time a queue item is processed.

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

The [configuration](#trigger---configuration) section explains these properties.

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

The following example shows a queue trigger binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding. The function polls the `myqueue-items` queue and writes a log each time a queue item is processed.

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

The [configuration](#trigger---configuration) section explains these properties.

> [!NOTE]
> The name parameter reflects as `context.bindings.<name>` in the JavaScript code which contains the queue item payload. This payload is also passed as the second parameter to the function.

Here's the JavaScript code:

```javascript
module.exports = async function (context, message) {
    context.log('Node.js queue trigger function processed work item', message);
    // OR access using context.bindings.<name>
    // context.log('Node.js queue trigger function processed work item', context.bindings.myQueueItem);
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

### Trigger - Java example

The following Java example shows a storage queue trigger functions which logs the triggered message placed into queue `myqueuename`.
 
 ```java
 @FunctionName("queueprocessor")
 public void run(
    @QueueTrigger(name = "msg",
                   queueName = "myqueuename",
                   connection = "myconnvarname") String message,
     final ExecutionContext context
 ) {
     context.getLogger().info(message);
 }
 ```

## Trigger - attributes
 
In [C# class libraries](functions-dotnet-class-library.md), use the following attributes to configure a queue trigger:

* [QueueTriggerAttribute](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/QueueTriggerAttribute.cs)

  The attribute's constructor takes the name of the queue to monitor, as shown in the following example:

  ```csharp
  [FunctionName("QueueTrigger")]
  public static void Run(
      [QueueTrigger("myqueue-items")] string myQueueItem, 
      TraceWriter log)
  {
      ...
  }
  ```

  You can set the `Connection` property to specify the storage account to use, as shown in the following example:

  ```csharp
  [FunctionName("QueueTrigger")]
  public static void Run(
      [QueueTrigger("myqueue-items", Connection = "StorageConnectionAppSetting")] string myQueueItem, 
      TraceWriter log)
  {
      ....
  }
  ```
 
  For a complete example, see [Trigger - C# example](#trigger---c-example).

* [StorageAccountAttribute](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/StorageAccountAttribute.cs)

  Provides another way to specify the storage account to use. The constructor takes the name of an app setting that contains a storage connection string. The attribute can be applied at the parameter, method, or class level. The following example shows class level and method level:

  ```csharp
  [StorageAccount("ClassLevelStorageAppSetting")]
  public static class AzureFunctions
  {
      [FunctionName("QueueTrigger")]
      [StorageAccount("FunctionLevelStorageAppSetting")]
      public static void Run( //...
  {
      ...
  }
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
|**name** | n/a |The name of the variable that contains the queue item payload in the function code.  | 
|**queueName** | **QueueName**| The name of the queue to poll. | 
|**connection** | **Connection** |The name of an app setting that contains the Storage connection string to use for this binding. If the app setting name begins with "AzureWebJobs", you can specify only the remainder of the name here. For example, if you set `connection` to "MyStorage", the Functions runtime looks for an app setting that is named "AzureWebJobsMyStorage." If you leave `connection` empty, the Functions runtime uses the default Storage connection string in the app setting that is named `AzureWebJobsStorage`.|

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Trigger - usage
 
In C# and C# script, access the message data by using a method parameter such as `string paramName`. In C# script, `paramName` is the value specified in the `name` property of *function.json*. You can bind to any of the following types:

* Object - The Functions runtime deserializes a JSON payload into an instance of an arbitrary class defined in your code. 
* `string`
* `byte[]`
* [CloudQueueMessage]

If you try to bind to `CloudQueueMessage` and get an error message, make sure that you have a reference to [the correct Storage SDK version](#azure-storage-sdk-version-in-functions-1x).

In JavaScript, use `context.bindings.<name>` to access the queue item payload. If the payload is JSON, it's deserialized into an object.

## Trigger - message metadata

The queue trigger provides several [metadata properties](functions-triggers-bindings.md#binding-expressions---trigger-metadata). These properties can be used as part of binding expressions in other bindings or as parameters in your code. These are properties of the [CloudQueueMessage](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.queue.cloudqueuemessage) class.

|Property|Type|Description|
|--------|----|-----------|
|`QueueTrigger`|`string`|Queue payload (if a valid string). If the queue message payload as a string, `QueueTrigger` has the same value as the variable named by the `name` property in *function.json*.|
|`DequeueCount`|`int`|The number of times this message has been dequeued.|
|`ExpirationTime`|`DateTimeOffset`|The time that the message expires.|
|`Id`|`string`|Queue message ID.|
|`InsertionTime`|`DateTimeOffset`|The time that the message was added to the queue.|
|`NextVisibleTime`|`DateTimeOffset`|The time that the message will next be visible.|
|`PopReceipt`|`string`|The message's pop receipt.|

## Trigger - poison messages

When a queue trigger function fails, Azure Functions retries the function up to five times for a given queue message, including the first try. If all five attempts fail, the functions runtime adds a message to a queue named *&lt;originalqueuename>-poison*. You can write a function to process messages from the poison queue by logging them or sending a  notification that manual attention is needed.

To handle poison messages manually, check the [dequeueCount](#trigger---message-metadata) of the queue message.

## Trigger - polling algorithm

The queue trigger implements a random exponential back-off algorithm to reduce the effect of idle-queue polling on storage transaction costs.  When a message is found, the runtime waits two seconds and then checks for another message; when no message is found, it waits about four seconds before trying again. After subsequent failed attempts to get a queue message, the wait time continues to increase until it reaches the maximum wait time, which defaults to one minute. The maximum wait time is configurable via the `maxPollingInterval` property in the [host.json file](functions-host-json.md#queues).

## Trigger - concurrency

When there are multiple queue messages waiting, the queue trigger retrieves a batch of messages and invokes function instances concurrently to process them. By default, the batch size is 16. When the number being processed gets down to 8, the runtime gets another batch and starts processing those messages. So the maximum number of concurrent messages being processed per function on one virtual machine (VM) is 24. This limit applies separately to each queue-triggered function on each VM. If your function app scales out to multiple VMs, each VM will wait for triggers and attempt to run functions. For example, if a function app scales out to 3 VMs, the default maximum number of concurrent instances of one queue-triggered function is 72.

The batch size and the threshold for getting a new batch are configurable in the [host.json file](functions-host-json.md#queues). If you want to minimize parallel execution for queue-triggered functions in a function app, you can set the batch size to 1. This setting eliminates concurrency only so long as your function app runs on a single virtual machine (VM). 

The queue trigger automatically prevents a function from processing a queue message multiple times; functions do not have to be written to be idempotent.

## Trigger - host.json properties

The [host.json](functions-host-json.md#queues) file contains settings that control queue trigger behavior.

[!INCLUDE [functions-host-json-queues](../../includes/functions-host-json-queues.md)]

## Output

Use the Azure Queue storage output binding to write messages to a queue.

## Output - example

See the language-specific example:

* [C#](#output---c-example)
* [C# script (.csx)](#output---c-script-example)
* [JavaScript](#output---javascript-example)
* [Java](#output---java-example)

### Output - C# example

The following example shows a [C# function](functions-dotnet-class-library.md) that creates a queue message for each HTTP request received.

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

The following example shows an HTTP trigger binding in a *function.json* file and [C# script (.csx)](functions-reference-csharp.md) code that uses the binding. The function creates a queue item with a **CustomQueueMessage** object payload for each HTTP request received.

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

The [configuration](#output---configuration) section explains these properties.

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
    ICollector<CustomQueueMessage> myQueueItems, 
    TraceWriter log)
{
    myQueueItems.Add(input);
    myQueueItems.Add(new CustomQueueMessage { PersonName = "You", Title = "None" });
}
```

### Output - JavaScript example

The following example shows an HTTP trigger binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding. The function creates a queue item for each HTTP request received.

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

The [configuration](#output---configuration) section explains these properties.

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

### Output - Java example

 The following example shows a Java function that creates a queue message for when triggered by a  HTTP request.

```java
@FunctionName("httpToQueue")
@QueueOutput(name = "item", queueName = "myqueue-items", connection = "AzureWebJobsStorage")
 public String pushToQueue(
     @HttpTrigger(name = "request", methods = {HttpMethod.POST}, authLevel = AuthorizationLevel.ANONYMOUS)
     final String message,
     @HttpOutput(name = "response") final OutputBinding&lt;String&gt; result) {
       result.setValue(message + " has been added.");
       return message;
 }
 ```

In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `@QueueOutput` annotation on parameters whose value would be written to Queue storage.  The parameter type should be `OutputBinding<T>`, where T is any native Java type of a POJO.


## Output - attributes
 
In [C# class libraries](functions-dotnet-class-library.md), use the [QueueAttribute](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/QueueAttribute.cs).

The attribute applies to an `out` parameter or the return value of the function. The attribute's constructor takes the name of the queue, as shown in the following example:

```csharp
[FunctionName("QueueOutput")]
[return: Queue("myqueue-items")]
public static string Run([HttpTrigger] dynamic input,  TraceWriter log)
{
    ...
}
```

You can set the `Connection` property to specify the storage account to use, as shown in the following example:

```csharp
[FunctionName("QueueOutput")]
[return: Queue("myqueue-items", Connection = "StorageConnectionAppSetting")]
public static string Run([HttpTrigger] dynamic input,  TraceWriter log)
{
    ...
}
```

For a complete example, see [Output - C# example](#output---c-example).

You can use the `StorageAccount` attribute to specify the storage account at class, method, or parameter level. For more information, see [Trigger - attributes](#trigger---attribute).

## Output - configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `Queue` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type** | n/a | Must be set to `queue`. This property is set automatically when you create the trigger in the Azure portal.|
|**direction** | n/a | Must be set to `out`. This property is set automatically when you create the trigger in the Azure portal. |
|**name** | n/a | The name of the variable that represents the queue in function code. Set to `$return` to reference the function return value.| 
|**queueName** |**QueueName** | The name of the queue. | 
|**connection** | **Connection** |The name of an app setting that contains the Storage connection string to use for this binding. If the app setting name begins with "AzureWebJobs", you can specify only the remainder of the name here. For example, if you set `connection` to "MyStorage", the Functions runtime looks for an app setting that is named "AzureWebJobsMyStorage." If you leave `connection` empty, the Functions runtime uses the default Storage connection string in the app setting that is named `AzureWebJobsStorage`.|

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Output - usage
 
In C# and C# script, write a single queue message by using a method parameter such as `out T paramName`. In C# script, `paramName` is the value specified in the `name` property of *function.json*. You can use the method return type instead of an `out` parameter, and `T` can be any of the following types:

* An object serializable as JSON
* `string`
* `byte[]`
* [CloudQueueMessage] 

If you try to bind to `CloudQueueMessage` and get an error message, make sure that you have a reference to [the correct Storage SDK version](#azure-storage-sdk-version-in-functions-1x).

In C# and C# script, write multiple queue messages by using one of the following types: 

* `ICollector<T>` or `IAsyncCollector<T>`
* [CloudQueue](/dotnet/api/microsoft.windowsazure.storage.queue.cloudqueue)

In JavaScript functions, use `context.bindings.<name>` to access the output queue message. You can use a string or a JSON-serializable object for the queue item payload.


## Exceptions and return codes

| Binding |  Reference |
|---|---|
| Queue | [Queue Error Codes](https://docs.microsoft.com/rest/api/storageservices/queue-service-error-codes) |
| Blob, Table, Queue | [Storage Error Codes](https://docs.microsoft.com/rest/api/storageservices/fileservices/common-rest-api-error-codes) |
| Blob, Table, Queue |  [Troubleshooting](https://docs.microsoft.com/rest/api/storageservices/fileservices/troubleshooting-api-operations) |

## Next steps

* [Learn more about Azure functions triggers and bindings](functions-triggers-bindings.md)

<!--
> [!div class="nextstepaction"]
> [Go to a quickstart that uses a Queue storage trigger](functions-create-storage-queue-triggered-function.md)
-->

> [!div class="nextstepaction"]
> [Go to a tutorial that uses a Queue storage output binding](functions-integrate-storage-queue-output-binding.md)

<!-- LINKS -->

[CloudQueueMessage]: /dotnet/api/microsoft.windowsazure.storage.queue.cloudqueuemessage
