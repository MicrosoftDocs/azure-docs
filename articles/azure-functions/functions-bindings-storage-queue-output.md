---
title: Azure Queue storage output binding for Azure Functions
description: Learn to create Azure Queue storage messages in Azure Functions.
ms.topic: reference
ms.date: 03/06/2023
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: "devx-track-csharp, cc996988-fb4f-47, devx-track-python"
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Azure Queue storage output bindings for Azure Functions

Azure Functions can create new Azure Queue storage messages by setting up an output binding.

For information on setup and configuration details, see the [overview](./functions-bindings-storage-queue.md).

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

# [Isolated process](#tab/isolated-process)

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/Queue/QueueFunction.cs" id="docsnippet_queue_output_binding" :::

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

---

::: zone-end
::: zone pivot="programming-language-java"

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

::: zone-end  
::: zone pivot="programming-language-javascript"  

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
module.exports = async function (context, input) {
    context.bindings.myQueueItem = input.body;
};
```

You can send multiple messages at once by defining a message array for the `myQueueItem` output binding. The following JavaScript code sends two queue messages with hard-coded values for each HTTP request received.

```javascript
module.exports = async function(context) {
    context.bindings.myQueueItem = ["message 1","message 2"];
};
```

::: zone-end  
::: zone pivot="programming-language-powershell"  

The following code examples demonstrate how to output a queue message from an HTTP-triggered function. The configuration section with the `type` of `queue` defines the output binding.

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "Request",
      "methods": [
        "get",
        "post"
      ]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "Response"
    },
    {
      "type": "queue",
      "direction": "out",
      "name": "Msg",
      "queueName": "outqueue",
      "connection": "MyStorageConnectionAppSetting"
    }
  ]
}
```

Using this binding configuration, a PowerShell function can create a queue message using `Push-OutputBinding`. In this example, a message is created from a query string or body parameter.

```powershell
using namespace System.Net

# Input bindings are passed in via param block.
param($Request, $TriggerMetadata)

# Write to the Azure Functions log stream.
Write-Host "PowerShell HTTP trigger function processed a request."

# Interact with query parameters or the body of the request.
$message = $Request.Query.Message
Push-OutputBinding -Name Msg -Value $message
Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
    StatusCode = 200
    Body = "OK"
})
```

To send multiple messages at once, define a message array and use `Push-OutputBinding` to send messages to the Queue output binding.

```powershell
using namespace System.Net

# Input bindings are passed in via param block.
param($Request, $TriggerMetadata)

# Write to the Azure Functions log stream.
Write-Host "PowerShell HTTP trigger function processed a request."

# Interact with query parameters or the body of the request.
$message = @("message1", "message2")
Push-OutputBinding -Name Msg -Value $message
Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
    StatusCode = 200
    Body = "OK"
})
```

::: zone-end  
::: zone pivot="programming-language-python"  

The following example demonstrates how to output single and multiple values to storage queues. The configuration needed for *function.json* is the same either way. The example depends on whether you use the [v1 or v2 Python programming model](functions-reference-python.md).

# [v2](#tab/python-v2)

```python
import logging
import azure.functions as func

app = func.FunctionApp()

@app.function_name(name="QueueOutput1")
@app.route(route="message")
@app.queue_output(arg_name="msg", 
                  queue_name="<QUEUE_NAME>", 
                  connection="<CONNECTION_SETTING>")
def main(req: func.HttpRequest, msg: func.Out[str]) -> func.HttpResponse:
    input_msg = req.params.get('name')
    logging.info(input_msg)
    
    msg.set(input_msg)
    
    logging.info(f'name: {name}')
    return 'OK'
```
# [v1](#tab/python-v1)

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

---

::: zone-end  
::: zone pivot="programming-language-csharp"
## Attributes

The attribute that defines an output binding in C# libraries depends on the mode in which the C# class library runs. C# script instead uses a function.json configuration file.


# [In-process](#tab/in-process)

In [C# class libraries](functions-dotnet-class-library.md), use the [QueueAttribute](/dotnet/api/microsoft.azure.webjobs.queueattribute).

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

You can use the `StorageAccount` attribute to specify the storage account at class, method, or parameter level. For more information, see Trigger - attributes.

# [Isolated process](#tab/isolated-process)

When running in an isolated worker process, you use the [QueueOutputAttribute](https://github.com/Azure/azure-functions-dotnet-worker/blob/main/extensions/Worker.Extensions.Storage.Queues/src/QueueOutputAttribute.cs), which takes the name of the queue, as shown in the following example:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/Queue/QueueFunction.cs" id="docsnippet_queue_trigger" :::

Only returned variables are supported when running in an isolated worker process. Output parameters can't be used. 

# [C# script](#tab/csharp-script)

C# script uses a function.json file for configuration instead of attributes.

The following table explains the binding configuration properties that you set in the *function.json* file and the `Queue` attribute.

|function.json property | Description|
|---------|----------------------|
|**type** |Must be set to `queue`. This property is set automatically when you create the trigger in the Azure portal.|
|**direction** |  Must be set to `out`. This property is set automatically when you create the trigger in the Azure portal. |
|**name** |  The name of the variable that represents the queue in function code. Set to `$return` to reference the function return value.|
|**queueName** | The name of the queue. |
|**connection** | The name of an app setting or setting collection that specifies how to connect to Azure Queues. See [Connections](#connections).|

::: zone-end  
::: zone pivot="programming-language-python"
## Decorators

_Applies only to the Python v2 programming model._

For Python v2 functions defined using a decorator, the following properties on the `queue_output`:

| Property    | Description |
|-------------|-----------------------------|
| `arg_name` | The name of the variable that represents the queue in function code. |
| `queue_name` | The name of the queue. |
| `connection` | The name of an app setting or setting collection that specifies how to connect to Azure Queues. See [Connections](#connections). |

For Python functions defined by using *function.json*, see the [Configuration](#configuration) section.
::: zone-end

::: zone pivot="programming-language-java"  
## Annotations

The [QueueOutput](/java/api/com.microsoft.azure.functions.annotation.queueoutput) annotation allows you to write a message as the output of a function. The following example shows an HTTP-triggered function that creates a queue message.

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

The parameter associated with the [QueueOutput](/java/api/com.microsoft.azure.functions.annotation.queueoutput) annotation is typed as an [OutputBinding\<T\>](/java/api/com.microsoft.azure.functions.outputbinding) instance.
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
|---------|-----------------------|
|**type** |Must be set to `queue`. This property is set automatically when you create the trigger in the Azure portal.|
|**direction** |  Must be set to `out`. This property is set automatically when you create the trigger in the Azure portal. |
|**name** |  The name of the variable that represents the queue in function code. Set to `$return` to reference the function return value.|
|**queueName** | The name of the queue. |
|**connection** | The name of an app setting or setting collection that specifies how to connect to Azure Queues. See [Connections](#connections).|

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

::: zone-end  

See the [Example section](#example) for complete examples.

## Usage

::: zone pivot="programming-language-csharp"  
The usage of the Queue output binding depends on the extension package version and the C# modality used in your function app, which can be one of the following:

# [In-process](#tab/in-process)

An in-process class library is a compiled C# function runs in the same process as the Functions runtime.
 
# [Isolated process](#tab/isolated-process)

An isolated worker process class library compiled C# function runs in a process isolated from the runtime.   
   
# [C# script](#tab/csharp-script)

C# script is used primarily when creating C# functions in the Azure portal.

---

Choose a version to see usage details for the mode and version. 

# [Extension 5.x+](#tab/extensionv5/in-process)

Write a single queue message by using a method parameter such as `out T paramName`. You can use the method return type instead of an `out` parameter, and `T` can be any of the following types:

* An object serializable as JSON
* `string`
* `byte[]`
* [QueueMessage]

For examples using these types, see [the GitHub repository for the extension](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Microsoft.Azure.WebJobs.Extensions.Storage.Queues#examples).

You can write multiple messages to the queue by using one of the following types: 

* `ICollector<T>` or `IAsyncCollector<T>`
* [QueueClient]

For examples using [QueueMessage] and [QueueClient], see [the GitHub repository for the extension](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Microsoft.Azure.WebJobs.Extensions.Storage.Queues#examples).

[!INCLUDE [functions-bindings-storage-attribute](../../includes/functions-bindings-storage-attribute.md)]

# [Extension 2.x+](#tab/extensionv2/in-process)

Write a single queue message by using a method parameter such as `out T paramName`. You can use the method return type instead of an `out` parameter, and `T` can be any of the following types:

* An object serializable as JSON
* `string`
* `byte[]`
* [CloudQueueMessage] 

If you try to bind to [CloudQueueMessage] and get an error message, make sure that you have a reference to [the correct Storage SDK version](functions-bindings-storage-queue.md#azure-storage-sdk-version-in-functions-1x).

You can write multiple messages to the queue by using one of the following types: 

* `ICollector<T>` or `IAsyncCollector<T>`
* [CloudQueue](/dotnet/api/microsoft.azure.storage.queue.cloudqueue)

[!INCLUDE [functions-bindings-storage-attribute](../../includes/functions-bindings-storage-attribute.md)]

# [Extension 5.x+](#tab/extensionv5/isolated-process)

Isolated worker process currently only supports binding to string parameters.

# [Extension 2.x+](#tab/extensionv2/isolated-process)

Isolated worker process currently only supports binding to string parameters.

# [Extension 5.x+](#tab/extensionv5/csharp-script)

Write a single queue message by using a method parameter such as `out T paramName`. You can use the method return type instead of an `out` parameter, and `T` can be any of the following types:

* An object serializable as JSON
* `string`
* `byte[]`
* [QueueMessage]

For examples using these types, see [the GitHub repository for the extension](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Microsoft.Azure.WebJobs.Extensions.Storage.Queues#examples).

You can write multiple messages to the queue by using one of the following types: 

* `ICollector<T>` or `IAsyncCollector<T>`
* [QueueClient]

For examples using [QueueMessage] and [QueueClient], see [the GitHub repository for the extension](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Microsoft.Azure.WebJobs.Extensions.Storage.Queues#examples).

# [Extension 2.x+](#tab/extensionv2/csharp-script)

Write a single queue message by using a method parameter such as `out T paramName`. You can use the method return type instead of an `out` parameter, and `T` can be any of the following types:

* An object serializable as JSON
* `string`
* `byte[]`
* [CloudQueueMessage] 

If you try to bind to [CloudQueueMessage] and get an error message, make sure that you have a reference to [the correct Storage SDK version](functions-bindings-storage-queue.md#azure-storage-sdk-version-in-functions-1x).

You can write multiple messages to the queue by using one of the following types: 

* `ICollector<T>` or `IAsyncCollector<T>`
* [CloudQueue](/dotnet/api/microsoft.azure.storage.queue.cloudqueue)

---

::: zone-end  
<!--Any of the below pivots can be combined if the usage info is identical.-->
::: zone pivot="programming-language-java"
There are two options for writing to a queue from a function by using the [QueueOutput](/java/api/com.microsoft.azure.functions.annotation.queueoutput) annotation:

- **Return value**: By applying the annotation to the function itself, the return value of the function is written to the queue.

- **Imperative**: To explicitly set the message value, apply the annotation to a specific parameter of the type [`OutputBinding<T>`](/java/api/com.microsoft.azure.functions.outputbinding), where `T` is a POJO or any native Java type. With this configuration, passing a value to the `setValue` method writes the value to the queue.

::: zone-end  
::: zone pivot="programming-language-javascript"
  
The output queue item is available via `context.bindings.<NAME>` where `<NAME>` matches the name defined in *function.json*. You can use a string or a JSON-serializable object for the queue item payload.

::: zone-end  
::: zone pivot="programming-language-powershell"
  
Output to the queue message is available via `Push-OutputBinding` where you pass arguments that match the name designated by binding's `name` parameter in the *function.json* file.

::: zone-end   
::: zone pivot="programming-language-python"
  
There are two options for writing from your function to the configured queue:

- **Return value**: Set the `name` property in *function.json* to `$return`. With this configuration, the function's return value is persisted as a Queue storage message.

- **Imperative**: Pass a value to the [set](/python/api/azure-functions/azure.functions.out#set-val--t-----none) method of the parameter declared as an [Out](/python/api/azure-functions/azure.functions.out) type. The value passed to `set` is persisted as a Queue storage message.

::: zone-end  

[!INCLUDE [functions-storage-queue-connections](../../includes/functions-storage-queue-connections.md)]

## Exceptions and return codes

| Binding |  Reference |
|---|---|
| Queue | [Queue Error Codes](/rest/api/storageservices/queue-service-error-codes) |
| Blob, Table, Queue | [Storage Error Codes](/rest/api/storageservices/fileservices/common-rest-api-error-codes) |
| Blob, Table, Queue |  [Troubleshooting](/rest/api/storageservices/fileservices/troubleshooting-api-operations) |

## Next steps

- [Run a function as queue storage data changes (Trigger)](./functions-bindings-storage-queue-trigger.md)

<!-- LINKS -->

[CloudQueueMessage]: /dotnet/api/microsoft.azure.storage.queue.cloudqueuemessage
[QueueMessage]: /dotnet/api/azure.storage.queues.models.queuemessage
[QueueClient]: /dotnet/api/azure.storage.queues.queueclient
