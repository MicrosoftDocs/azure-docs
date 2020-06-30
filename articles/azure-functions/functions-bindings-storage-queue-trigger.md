---
title: Azure Queue storage trigger for Azure Functions
description: Learn to run an Azure Function as Azure Queue storage data changes.
author: craigshoemaker

ms.topic: reference
ms.date: 02/18/2020
ms.author: cshoe
ms.custom: cc996988-fb4f-47, tracking-python
---

# Azure Queue storage trigger for Azure Functions

The queue storage trigger runs a function as messages are added to Azure Queue storage.

## Encoding

Functions expect a *base64* encoded string. Any adjustments to the encoding type (in order to prepare data as a *base64* encoded string) need to be implemented in the calling service.

## Example

Use the queue trigger to start a function when a new item is received on a queue. The queue message is provided as input to the function.

# [C#](#tab/csharp)

The following example shows a [C# function](functions-dotnet-class-library.md) that polls the `myqueue-items` queue and writes a log each time a queue item is processed.

```csharp
public static class QueueFunctions
{
    [FunctionName("QueueTrigger")]
    public static void QueueTrigger(
        [QueueTrigger("myqueue-items")] string myQueueItem, 
        ILogger log)
    {
        log.LogInformation($"C# function processed: {myQueueItem}");
    }
}
```

# [C# Script](#tab/csharp-script)

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

The [configuration](#configuration) section explains these properties.

Here's the C# script code:

```csharp
#r "Microsoft.WindowsAzure.Storage"

using Microsoft.Extensions.Logging;
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
    ILogger log)
{
    log.LogInformation($"C# Queue trigger function processed: {myQueueItem.AsString}\n" +
        $"queueTrigger={queueTrigger}\n" +
        $"expirationTime={expirationTime}\n" +
        $"insertionTime={insertionTime}\n" +
        $"nextVisibleTime={nextVisibleTime}\n" +
        $"id={id}\n" +
        $"popReceipt={popReceipt}\n" + 
        $"dequeueCount={dequeueCount}");
}
```

The [usage](#usage) section explains `myQueueItem`, which is named by the `name` property in function.json.  The [message metadata section](#message-metadata) explains all of the other variables shown.

# [JavaScript](#tab/javascript)

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

The [configuration](#configuration) section explains these properties.

> [!NOTE]
> The name parameter reflects as `context.bindings.<name>` in the JavaScript code which contains the queue item payload. This payload is also passed as the second parameter to the function.

Here's the JavaScript code:

```javascript
module.exports = async function (context, message) {
    context.log('Node.js queue trigger function processed work item', message);
    // OR access using context.bindings.<name>
    // context.log('Node.js queue trigger function processed work item', context.bindings.myQueueItem);
    context.log('expirationTime =', context.bindingData.expirationTime);
    context.log('insertionTime =', context.bindingData.insertionTime);
    context.log('nextVisibleTime =', context.bindingData.nextVisibleTime);
    context.log('id =', context.bindingData.id);
    context.log('popReceipt =', context.bindingData.popReceipt);
    context.log('dequeueCount =', context.bindingData.dequeueCount);
    context.done();
};
```

The [usage](#usage) section explains `myQueueItem`, which is named by the `name` property in function.json.  The [message metadata section](#message-metadata) explains all of the other variables shown.

# [Python](#tab/python)

The following example demonstrates how to read a queue message passed to a function via a trigger.

A Storage queue trigger is defined in *function.json* where *type* is set to `queueTrigger`.

```json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "name": "msg",
      "type": "queueTrigger",
      "direction": "in",
      "queueName": "messages",
      "connection": "AzureStorageQueuesConnectionString"
    }
  ]
}
```

The code *_\_init_\_.py* declares a parameter as `func.ServiceBusMessage`, which allows you to read the queue message in your function.

```python
import logging
import json

import azure.functions as func

def main(msg: func.QueueMessage):
    logging.info('Python queue trigger function processed a queue item.')

    result = json.dumps({
        'id': msg.id,
        'body': msg.get_body().decode('utf-8'),
        'expiration_time': (msg.expiration_time.isoformat()
                            if msg.expiration_time else None),
        'insertion_time': (msg.insertion_time.isoformat()
                           if msg.insertion_time else None),
        'time_next_visible': (msg.time_next_visible.isoformat()
                              if msg.time_next_visible else None),
        'pop_receipt': msg.pop_receipt,
        'dequeue_count': msg.dequeue_count
    })

    logging.info(result)
```

# [Java](#tab/java)

The following Java example shows a storage queue trigger function, which logs the triggered message placed into queue `myqueuename`.

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

 ---

## Attributes and annotations

# [C#](#tab/csharp)

In [C# class libraries](functions-dotnet-class-library.md), use the following attributes to configure a queue trigger:

* [QueueTriggerAttribute](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs.Extensions.Storage/Queues/QueueTriggerAttribute.cs)

  The attribute's constructor takes the name of the queue to monitor, as shown in the following example:

  ```csharp
  [FunctionName("QueueTrigger")]
  public static void Run(
      [QueueTrigger("myqueue-items")] string myQueueItem, 
      ILogger log)
  {
      ...
  }
  ```

  You can set the `Connection` property to specify the app setting that contains the storage account connection string to use, as shown in the following example:

  ```csharp
  [FunctionName("QueueTrigger")]
  public static void Run(
      [QueueTrigger("myqueue-items", Connection = "StorageConnectionAppSetting")] string myQueueItem, 
      ILogger log)
  {
      ....
  }
  ```

  For a complete example, see [example](#example).

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

# [C# Script](#tab/csharp-script)

Attributes are not supported by C# Script.

# [JavaScript](#tab/javascript)

Attributes are not supported by JavaScript.

# [Python](#tab/python)

Attributes are not supported by Python.

# [Java](#tab/java)

The `QueueTrigger` annotation gives you access to the queue that triggers the function. The following example makes the queue message available to the function via the `message` parameter.

```java
package com.function;
import com.microsoft.azure.functions.annotation.*;
import java.util.Queue;
import com.microsoft.azure.functions.*;

public class QueueTriggerDemo {
    @FunctionName("QueueTriggerDemo")
    public void run(
        @QueueTrigger(name = "message", queueName = "messages", connection = "MyStorageConnectionAppSetting") String message,
        final ExecutionContext context
    ) {
        context.getLogger().info("Queue message: " + message);
    }
}
```

| Property    | Description |
|-------------|-----------------------------|
|`name`       | Declares the parameter name in the function signature. When the function is triggered, this parameter's value has the contents of the queue message. |
|`queueName`  | Declares the queue name in the storage account. |
|`connection` | Points to the storage account connection string. |

---

## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `QueueTrigger` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type** | n/a| Must be set to `queueTrigger`. This property is set automatically when you create the trigger in the Azure portal.|
|**direction**| n/a | In the *function.json* file only. Must be set to `in`. This property is set automatically when you create the trigger in the Azure portal. |
|**name** | n/a |The name of the variable that contains the queue item payload in the function code.  |
|**queueName** | **QueueName**| The name of the queue to poll. |
|**connection** | **Connection** |The name of an app setting that contains the Storage connection string to use for this binding. If the app setting name begins with "AzureWebJobs", you can specify only the remainder of the name here. For example, if you set `connection` to "MyStorage", the Functions runtime looks for an app setting that is named "MyStorage." If you leave `connection` empty, the Functions runtime uses the default Storage connection string in the app setting that is named `AzureWebJobsStorage`.|

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Usage

# [C#](#tab/csharp)

Access the message data by using a method parameter such as `string paramName`. You can bind to any of the following types:

* Object - The Functions runtime deserializes a JSON payload into an instance of an arbitrary class defined in your code. 
* `string`
* `byte[]`
* [CloudQueueMessage]

If you try to bind to `CloudQueueMessage` and get an error message, make sure that you have a reference to [the correct Storage SDK version](functions-bindings-storage-queue.md#azure-storage-sdk-version-in-functions-1x).

# [C# Script](#tab/csharp-script)

Access the message data by using a method parameter such as `string paramName`. The `paramName` is the value specified in the `name` property of *function.json*. You can bind to any of the following types:

* Object - The Functions runtime deserializes a JSON payload into an instance of an arbitrary class defined in your code. 
* `string`
* `byte[]`
* [CloudQueueMessage]

If you try to bind to `CloudQueueMessage` and get an error message, make sure that you have a reference to [the correct Storage SDK version](functions-bindings-storage-queue.md#azure-storage-sdk-version-in-functions-1x).

# [JavaScript](#tab/javascript)

The queue item payload is available via `context.bindings.<NAME>` where `<NAME>` matches the name defined in *function.json*. If the payload is JSON, the value is deserialized into an object.

# [Python](#tab/python)

Access the queue message via the parameter typed as [QueueMessage](https://docs.microsoft.com/python/api/azure-functions/azure.functions.queuemessage?view=azure-python).

# [Java](#tab/java)

The [QueueTrigger](https://docs.microsoft.com/java/api/com.microsoft.azure.functions.annotation.queuetrigger?view=azure-java-stable) annotation gives you access to the queue message that triggered the function.

---

## Message metadata

The queue trigger provides several [metadata properties](./functions-bindings-expressions-patterns.md#trigger-metadata). These properties can be used as part of binding expressions in other bindings or as parameters in your code. The properties are members of the [CloudQueueMessage](https://docs.microsoft.com/dotnet/api/microsoft.azure.storage.queue.cloudqueuemessage) class.

|Property|Type|Description|
|--------|----|-----------|
|`QueueTrigger`|`string`|Queue payload (if a valid string). If the queue message payload is a string, `QueueTrigger` has the same value as the variable named by the `name` property in *function.json*.|
|`DequeueCount`|`int`|The number of times this message has been dequeued.|
|`ExpirationTime`|`DateTimeOffset`|The time that the message expires.|
|`Id`|`string`|Queue message ID.|
|`InsertionTime`|`DateTimeOffset`|The time that the message was added to the queue.|
|`NextVisibleTime`|`DateTimeOffset`|The time that the message will next be visible.|
|`PopReceipt`|`string`|The message's pop receipt.|

## Poison messages

When a queue trigger function fails, Azure Functions retries the function up to five times for a given queue message, including the first try. If all five attempts fail, the functions runtime adds a message to a queue named *&lt;originalqueuename>-poison*. You can write a function to process messages from the poison queue by logging them or sending a  notification that manual attention is needed.

To handle poison messages manually, check the [dequeueCount](#message-metadata) of the queue message.

## Polling algorithm

The queue trigger implements a random exponential back-off algorithm to reduce the effect of idle-queue polling on storage transaction costs.

The algorithm uses the following logic:

- When a message is found, the runtime waits two seconds and then checks for another message
- When no message is found, it waits about four seconds before trying again.
- After subsequent failed attempts to get a queue message, the wait time continues to increase until it reaches the maximum wait time, which defaults to one minute.
- The maximum wait time is configurable via the `maxPollingInterval` property in the [host.json file](functions-host-json.md#queues).

For local development the maximum polling interval defaults to two seconds.

In regard to billing, time spent polling by the runtime is "free" and not counted against your account.

## Concurrency

When there are multiple queue messages waiting, the queue trigger retrieves a batch of messages and invokes function instances concurrently to process them. By default, the batch size is 16. When the number being processed gets down to 8, the runtime gets another batch and starts processing those messages. So the maximum number of concurrent messages being processed per function on one virtual machine (VM) is 24. This limit applies separately to each queue-triggered function on each VM. If your function app scales out to multiple VMs, each VM will wait for triggers and attempt to run functions. For example, if a function app scales out to 3 VMs, the default maximum number of concurrent instances of one queue-triggered function is 72.

The batch size and the threshold for getting a new batch are configurable in the [host.json file](functions-host-json.md#queues). If you want to minimize parallel execution for queue-triggered functions in a function app, you can set the batch size to 1. This setting eliminates concurrency only so long as your function app runs on a single virtual machine (VM). 

The queue trigger automatically prevents a function from processing a queue message multiple times; functions do not have to be written to be idempotent.

## host.json properties

The [host.json](functions-host-json.md#queues) file contains settings that control queue trigger behavior. See the [host.json settings](functions-bindings-storage-queue-output.md#hostjson-settings) section for details regarding available settings.

## Next steps

- [Write queue storage messages (Output binding)](./functions-bindings-storage-blob-output.md)

<!-- LINKS -->

[CloudQueueMessage]: /dotnet/api/microsoft.azure.storage.queue.cloudqueuemessage
