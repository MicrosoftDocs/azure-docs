---
title: Azure Queue storage output binding for Azure Functions
description: Learn to create Azure Queue storage messages in Azure Functions.
author: craigshoemaker

ms.topic: reference
ms.date: 02/18/2020
ms.author: cshoe
ms.custom: cc996988-fb4f-47, tracking-python
---

# Azure Queue storage output bindings for Azure Functions

Azure Functions can create new Azure Queue storage messages by setting up an output binding.

For information on setup and configuration details, see the [overview](./functions-bindings-storage-queue.md).

## Example

# [C#](#tab/csharp)

The following example shows a [C# function](functions-dotnet-class-library.md) that creates a queue message for each HTTP request received.

```csharp
[StorageAccount("MyStorageConnectionAppSetting")]
public static class QueueFunctions
{
    [FunctionName("QueueOutput")]
    [return: Queue("myqueue-items")]
    public static string QueueOutput([HttpTrigger] dynamic input,  ILogger log)
    {
        log.LogInformation($"C# function processed: {input.Text}");
        return input.Text;
    }
}
```

# [C# Script](#tab/csharp-script)

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
      "name": "$return"
    },
    {
      "type": "queue",
      "direction": "out",
      "name": "$return",
      "queueName": "outqueue",
      "connection": "MyStorageConnectionAppSetting"
    }
  ]
}
```

The [configuration](#configuration) section explains these properties.

Here's C# script code that creates a single queue message:

```cs
public class CustomQueueMessage
{
    public string PersonName { get; set; }
    public string Title { get; set; }
}

public static CustomQueueMessage Run(CustomQueueMessage input, ILogger log)
{
    return input;
}
```

You can send multiple messages at once by using an `ICollector` or `IAsyncCollector` parameter. Here's C# script code that sends multiple messages, one with the HTTP request data and one with hard-coded values:

```cs
public static void Run(
    CustomQueueMessage input, 
    ICollector<CustomQueueMessage> myQueueItems, 
    ILogger log)
{
    myQueueItems.Add(input);
    myQueueItems.Add(new CustomQueueMessage { PersonName = "You", Title = "None" });
}
```

# [JavaScript](#tab/javascript)

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
      "name": "$return"
    },
    {
      "type": "queue",
      "direction": "out",
      "name": "myQueueItem",
      "queueName": "outqueue",
      "connection": "MyStorageConnectionAppSetting"
    }
  ]
}
```

The [configuration](#configuration) section explains these properties.

Here's the JavaScript code:

```javascript
module.exports = function (context, input) {
    context.bindings.myQueueItem = input.body;
    context.done();
};
```

You can send multiple messages at once by defining a message array for the `myQueueItem` output binding. The following JavaScript code sends two queue messages with hard-coded values for each HTTP request received.

```javascript
module.exports = function(context) {
    context.bindings.myQueueItem = ["message 1","message 2"];
    context.done();
};
```

# [Python](#tab/python)

The following example demonstrates how to output single and multiple values to storage queues. The configuration needed for *function.json* is the same either way.

A Storage queue binding is defined in *function.json* where *type* is set to `queue`.

```json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "authLevel": "function",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": [
        "get",
        "post"
      ]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "$return"
    },
    {
      "type": "queue",
      "direction": "out",
      "name": "msg",
      "queueName": "outqueue",
      "connection": "AzureStorageQueuesConnectionString"
    }
  ]
}
```

To set an individual message on the queue, you pass a single value to the `set` method.

```python
import azure.functions as func

def main(req: func.HttpRequest, msg: func.Out[str]) -> func.HttpResponse:

    input_msg = req.params.get('message')

    msg.set(input_msg)

    return 'OK'
```

To create multiple messages on the queue, declare a parameter as the appropriate list type and pass an array of values (that match the list type) to the `set` method.

```python
import azure.functions as func
import typing

def main(req: func.HttpRequest, msg: func.Out[typing.List[str]]) -> func.HttpResponse:

    msg.set(['one', 'two'])

    return 'OK'
```

# [Java](#tab/java)

 The following example shows a Java function that creates a queue message for when triggered by an  HTTP request.

```java
@FunctionName("httpToQueue")
@QueueOutput(name = "item", queueName = "myqueue-items", connection = "MyStorageConnectionAppSetting")
 public String pushToQueue(
     @HttpTrigger(name = "request", methods = {HttpMethod.POST}, authLevel = AuthorizationLevel.ANONYMOUS)
     final String message,
     @HttpOutput(name = "response") final OutputBinding<String> result) {
       result.setValue(message + " has been added.");
       return message;
 }
```

In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `@QueueOutput` annotation on parameters whose value would be written to Queue storage.  The parameter type should be `OutputBinding<T>`, where `T` is any native Java type of a POJO.

---

## Attributes and annotations

# [C#](#tab/csharp)

In [C# class libraries](functions-dotnet-class-library.md), use the [QueueAttribute](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs.Extensions.Storage/Queues/QueueAttribute.cs).

The attribute applies to an `out` parameter or the return value of the function. The attribute's constructor takes the name of the queue, as shown in the following example:

```csharp
[FunctionName("QueueOutput")]
[return: Queue("myqueue-items")]
public static string Run([HttpTrigger] dynamic input,  ILogger log)
{
    ...
}
```

You can set the `Connection` property to specify the storage account to use, as shown in the following example:

```csharp
[FunctionName("QueueOutput")]
[return: Queue("myqueue-items", Connection = "StorageConnectionAppSetting")]
public static string Run([HttpTrigger] dynamic input,  ILogger log)
{
    ...
}
```

For a complete example, see [Output example](#example).

You can use the `StorageAccount` attribute to specify the storage account at class, method, or parameter level. For more information, see Trigger - attributes.

# [C# Script](#tab/csharp-script)

Attributes are not supported by C# Script.

# [JavaScript](#tab/javascript)

Attributes are not supported by JavaScript.

# [Python](#tab/python)

Attributes are not supported by Python.

# [Java](#tab/java)

The `QueueOutput` annotation allows you to write a message as the output of a function. The following example shows an HTTP-triggered function that creates a queue message.

```java
package com.function;
import java.util.*;
import com.microsoft.azure.functions.annotation.*;
import com.microsoft.azure.functions.*;

public class HttpTriggerQueueOutput {
    @FunctionName("HttpTriggerQueueOutput")
    public HttpResponseMessage run(
            @HttpTrigger(name = "req", methods = {HttpMethod.GET, HttpMethod.POST}, authLevel = AuthorizationLevel.FUNCTION) HttpRequestMessage<Optional<String>> request,
            @QueueOutput(name = "message", queueName = "messages", connection = "MyStorageConnectionAppSetting") OutputBinding<String> message,
            final ExecutionContext context) {

        message.setValue(request.getQueryParameters().get("name"));
        return request.createResponseBuilder(HttpStatus.OK).body("Done").build();
    }
}
```

| Property    | Description |
|-------------|-----------------------------|
|`name`       | Declares the parameter name in the function signature. When the function is triggered, this parameter's value has the contents of the queue message. |
|`queueName`  | Declares the queue name in the storage account. |
|`connection` | Points to the storage account connection string. |

The parameter associated with the `QueueOutput` annotation is typed as an [OutputBinding\<T\>](https://github.com/Azure/azure-functions-java-library/blob/master/src/main/java/com/microsoft/azure/functions/OutputBinding.java) instance.

---

## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `Queue` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type** | n/a | Must be set to `queue`. This property is set automatically when you create the trigger in the Azure portal.|
|**direction** | n/a | Must be set to `out`. This property is set automatically when you create the trigger in the Azure portal. |
|**name** | n/a | The name of the variable that represents the queue in function code. Set to `$return` to reference the function return value.|
|**queueName** |**QueueName** | The name of the queue. |
|**connection** | **Connection** |The name of an app setting that contains the Storage connection string to use for this binding. If the app setting name begins with "AzureWebJobs", you can specify only the remainder of the name here. For example, if you set `connection` to "MyStorage", the Functions runtime looks for an app setting that is named "MyStorage." If you leave `connection` empty, the Functions runtime uses the default Storage connection string in the app setting that is named `AzureWebJobsStorage`.|

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Usage

# [C#](#tab/csharp)

Write a single queue message by using a method parameter such as `out T paramName`. You can use the method return type instead of an `out` parameter, and `T` can be any of the following types:

* An object serializable as JSON
* `string`
* `byte[]`
* [CloudQueueMessage] 

If you try to bind to `CloudQueueMessage` and get an error message, make sure that you have a reference to [the correct Storage SDK version](functions-bindings-storage-queue.md#azure-storage-sdk-version-in-functions-1x).

In C# and C# script, write multiple queue messages by using one of the following types: 

* `ICollector<T>` or `IAsyncCollector<T>`
* [CloudQueue](/dotnet/api/microsoft.azure.storage.queue.cloudqueue)

# [C# Script](#tab/csharp-script)

Write a single queue message by using a method parameter such as `out T paramName`. The `paramName` is the value specified in the `name` property of *function.json*. You can use the method return type instead of an `out` parameter, and `T` can be any of the following types:

* An object serializable as JSON
* `string`
* `byte[]`
* [CloudQueueMessage] 

If you try to bind to `CloudQueueMessage` and get an error message, make sure that you have a reference to [the correct Storage SDK version](functions-bindings-storage-queue.md#azure-storage-sdk-version-in-functions-1x).

In C# and C# script, write multiple queue messages by using one of the following types: 

* `ICollector<T>` or `IAsyncCollector<T>`
* [CloudQueue](/dotnet/api/microsoft.azure.storage.queue.cloudqueue)

# [JavaScript](#tab/javascript)

The output queue item is available via `context.bindings.<NAME>` where `<NAME>` matches the name defined in *function.json*. You can use a string or a JSON-serializable object for the queue item payload.

# [Python](#tab/python)

There are two options for outputting an Event Hub message from a function:

- **Return value**: Set the `name` property in *function.json* to `$return`. With this configuration, the function's return value is persisted as a Queue storage message.

- **Imperative**: Pass a value to the [set](https://docs.microsoft.com/python/api/azure-functions/azure.functions.out?view=azure-python#set-val--t-----none) method of the parameter declared as an [Out](https://docs.microsoft.com/python/api/azure-functions/azure.functions.out?view=azure-python) type. The value passed to `set` is persisted as a Queue storage message.

# [Java](#tab/java)

There are two options for outputting an Event Hub message from a function by using the [QueueOutput](https://docs.microsoft.com/java/api/com.microsoft.azure.functions.annotation.queueoutput) annotation:

- **Return value**: By applying the annotation to the function itself, the return value of the function is persisted as an Event Hub message.

- **Imperative**: To explicitly set the message value, apply the annotation to a specific parameter of the type [`OutputBinding<T>`](https://docs.microsoft.com/java/api/com.microsoft.azure.functions.OutputBinding), where `T` is a POJO or any native Java type. With this configuration, passing a value to the `setValue` method persists the value as an Event Hub message.

---

## Exceptions and return codes

| Binding |  Reference |
|---|---|
| Queue | [Queue Error Codes](https://docs.microsoft.com/rest/api/storageservices/queue-service-error-codes) |
| Blob, Table, Queue | [Storage Error Codes](https://docs.microsoft.com/rest/api/storageservices/fileservices/common-rest-api-error-codes) |
| Blob, Table, Queue |  [Troubleshooting](https://docs.microsoft.com/rest/api/storageservices/fileservices/troubleshooting-api-operations) |

<a name="host-json"></a>  

## host.json settings

This section describes the global configuration settings available for this binding in versions 2.x and higher. The example host.json file below contains only the version 2.x+ settings for this binding. For more information about global configuration settings in versions 2.x and beyond, see [host.json reference for Azure Functions](functions-host-json.md).

> [!NOTE]
> For a reference of host.json in Functions 1.x, see [host.json reference for Azure Functions 1.x](functions-host-json-v1.md).

```json
{
    "version": "2.0",
    "extensions": {
        "queues": {
            "maxPollingInterval": "00:00:02",
            "visibilityTimeout" : "00:00:30",
            "batchSize": 16,
            "maxDequeueCount": 5,
            "newBatchThreshold": 8
        }
    }
}
```

|Property  |Default | Description |
|---------|---------|---------|
|maxPollingInterval|00:00:01|The maximum interval between queue polls. Minimum is 00:00:00.100 (100 ms) and increments up to 00:01:00 (1 min).  In 1.x the data type is milliseconds, and in 2.x and higher it is a TimeSpan.|
|visibilityTimeout|00:00:00|The time interval between retries when processing of a message fails. |
|batchSize|16|The number of queue messages that the Functions runtime retrieves simultaneously and processes in parallel. When the number being processed gets down to the `newBatchThreshold`, the runtime gets another batch and starts processing those messages. So the maximum number of concurrent messages being processed per function is `batchSize` plus `newBatchThreshold`. This limit applies separately to each queue-triggered function. <br><br>If you want to avoid parallel execution for messages received on one queue, you can set `batchSize` to 1. However, this setting eliminates concurrency only so long as your function app runs on a single virtual machine (VM). If the function app scales out to multiple VMs, each VM could run one instance of each queue-triggered function.<br><br>The maximum `batchSize` is 32. |
|maxDequeueCount|5|The number of times to try processing a message before moving it to the poison queue.|
|newBatchThreshold|batchSize/2|Whenever the number of messages being processed concurrently gets down to this number, the runtime retrieves another batch.|

## Next steps

- [Run a function as queue storage data changes (Trigger)](./functions-bindings-storage-queue-trigger.md)

<!-- LINKS -->

[CloudQueueMessage]: /dotnet/api/microsoft.azure.storage.queue.cloudqueuemessage
