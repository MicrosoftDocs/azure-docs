---
title: Azure Blob storage input binding for Azure Functions
description: Learn how to provide Azure Blob storage input binding data to an Azure Function.
ms.topic: reference
ms.date: 03/04/2022
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: "devx-track-csharp, devx-track-python"
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Azure Blob storage input binding for Azure Functions

The input binding allows you to read blob storage data as input to an Azure Function.

For information on setup and configuration details, see the [overview](./functions-bindings-storage-blob.md).

## Example

::: zone pivot="programming-language-csharp"

[!INCLUDE [functions-bindings-csharp-intro](../../includes/functions-bindings-csharp-intro.md)]

# [In-process](#tab/in-process)

The following example is a [C# function](functions-dotnet-class-library.md) that uses a queue trigger and an input blob binding. The queue message contains the name of the blob, and the function logs the size of the blob.

```csharp

[FunctionName("BlobInput")]
public static void Run(
    [QueueTrigger("myqueue-items")] string myQueueItem,
    [Blob("samples-workitems/{queueTrigger}", FileAccess.Read)] Stream myBlob,
    ILogger log)
{
    log.LogInformation($"BlobInput processed blob\n Name:{myQueueItem} \n Size: {myBlob.Length} bytes");
}
```

# [Isolated process](#tab/isolated-process)

The following example is a [C# function](dotnet-isolated-process-guide.md) that runs in an isolated worker process and uses a blob trigger with both blob input and blob output blob bindings. The function is triggered by the creation of a blob in the *test-samples-trigger* container. It reads a text file from the *test-samples-input* container and creates a new text file in an output container based on the name of the triggered file.

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/Blob/BlobFunction.cs" range="9-26":::

# [C# Script](#tab/csharp-script)

The following example shows blob input and output bindings in a *function.json* file and [C# script (.csx)](functions-reference-csharp.md) code that uses the bindings. The function makes a copy of a text blob. The function is triggered by a queue message that contains the name of the blob to copy. The new blob is named *{originalblobname}-Copy*.

In the *function.json* file, the `queueTrigger` metadata property is used to specify the blob name in the `path` properties:

```json
{
  "bindings": [
    {
      "queueName": "myqueue-items",
      "connection": "MyStorageConnectionAppSetting",
      "name": "myQueueItem",
      "type": "queueTrigger",
      "direction": "in"
    },
    {
      "name": "myInputBlob",
      "type": "blob",
      "path": "samples-workitems/{queueTrigger}",
      "connection": "MyStorageConnectionAppSetting",
      "direction": "in"
    },
    {
      "name": "myOutputBlob",
      "type": "blob",
      "path": "samples-workitems/{queueTrigger}-Copy",
      "connection": "MyStorageConnectionAppSetting",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

The [configuration](#configuration) section explains these properties.

Here's the C# script code:

```cs
public static void Run(string myQueueItem, string myInputBlob, out string myOutputBlob, ILogger log)
{
    log.LogInformation($"C# Queue trigger function processed: {myQueueItem}");
    myOutputBlob = myInputBlob;
}
```
---

::: zone-end
::: zone pivot="programming-language-java"

This section contains the following examples:

* [HTTP trigger, look up blob name from query string](#http-trigger-look-up-blob-name-from-query-string)
* [Queue trigger, receive blob name from queue message](#queue-trigger-receive-blob-name-from-queue-message)

#### HTTP trigger, look up blob name from query string

 The following example shows a Java function that uses the `HttpTrigger` annotation to receive a parameter containing the name of a file in a blob storage container. The `BlobInput` annotation then reads the file and passes its contents to the function as a `byte[]`.

```java
  @FunctionName("getBlobSizeHttp")
  @StorageAccount("Storage_Account_Connection_String")
  public HttpResponseMessage blobSize(
    @HttpTrigger(name = "req", 
      methods = {HttpMethod.GET}, 
      authLevel = AuthorizationLevel.ANONYMOUS) 
    HttpRequestMessage<Optional<String>> request,
    @BlobInput(
      name = "file", 
      dataType = "binary", 
      path = "samples-workitems/{Query.file}") 
    byte[] content,
    final ExecutionContext context) {
      // build HTTP response with size of requested blob
      return request.createResponseBuilder(HttpStatus.OK)
        .body("The size of \"" + request.getQueryParameters().get("file") + "\" is: " + content.length + " bytes")
        .build();
  }
```

#### Queue trigger, receive blob name from queue message

 The following example shows a Java function that uses the `QueueTrigger` annotation to receive a message containing the name of a file in a blob storage container. The `BlobInput` annotation then reads the file and passes its contents to the function as a `byte[]`.

```java
  @FunctionName("getBlobSize")
  @StorageAccount("Storage_Account_Connection_String")
  public void blobSize(
    @QueueTrigger(
      name = "filename", 
      queueName = "myqueue-items-sample") 
    String filename,
    @BlobInput(
      name = "file", 
      dataType = "binary", 
      path = "samples-workitems/{queueTrigger}") 
    byte[] content,
    final ExecutionContext context) {
      context.getLogger().info("The size of \"" + filename + "\" is: " + content.length + " bytes");
  }
```

In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `@BlobInput` annotation on parameters whose value would come from a blob.  This annotation can be used with native Java types, POJOs, or nullable values using `Optional<T>`.

::: zone-end  
::: zone pivot="programming-language-javascript"  

The following example shows blob input and output bindings in a *function.json* file and [JavaScript code](functions-reference-node.md) that uses the bindings. The function makes a copy of a blob. The function is triggered by a queue message that contains the name of the blob to copy. The new blob is named *{originalblobname}-Copy*.

In the *function.json* file, the `queueTrigger` metadata property is used to specify the blob name in the `path` properties:

```json
{
  "bindings": [
    {
      "queueName": "myqueue-items",
      "connection": "MyStorageConnectionAppSetting",
      "name": "myQueueItem",
      "type": "queueTrigger",
      "direction": "in"
    },
    {
      "name": "myInputBlob",
      "type": "blob",
      "path": "samples-workitems/{queueTrigger}",
      "connection": "MyStorageConnectionAppSetting",
      "direction": "in"
    },
    {
      "name": "myOutputBlob",
      "type": "blob",
      "path": "samples-workitems/{queueTrigger}-Copy",
      "connection": "MyStorageConnectionAppSetting",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

The [configuration](#configuration) section explains these properties.

Here's the JavaScript code:

```javascript
module.exports = async function(context) {
    context.log('Node.js Queue trigger function processed', context.bindings.myQueueItem);
    context.bindings.myOutputBlob = context.bindings.myInputBlob;
};
```

::: zone-end  
::: zone pivot="programming-language-powershell"  

The following example shows a blob input binding, defined in the _function.json_ file, which makes the incoming blob data available to the [PowerShell](functions-reference-powershell.md) function.

Here's the json configuration:

```json
{
  "bindings": [
    {
      "name": "InputBlob",
      "type": "blobTrigger",
      "direction": "in",
      "path": "source/{name}",
      "connection": "AzureWebJobsStorage"
    }
  ]
}
```

Here's the function code:

```powershell
# Input bindings are passed in via param block.
param([byte[]] $InputBlob, $TriggerMetadata)

Write-Host "PowerShell Blob trigger: Name: $($TriggerMetadata.Name) Size: $($InputBlob.Length) bytes"
```

::: zone-end  
::: zone pivot="programming-language-python"  

The following example shows blob input and output bindings in a *function.json* file and [Python code](functions-reference-python.md) that uses the bindings. The function makes a copy of a blob. The function is triggered by a queue message that contains the name of the blob to copy. The new blob is named *{originalblobname}-Copy*.

In the *function.json* file, the `queueTrigger` metadata property is used to specify the blob name in the `path` properties:

```json
{
  "bindings": [
    {
      "queueName": "myqueue-items",
      "connection": "MyStorageConnectionAppSetting",
      "name": "queuemsg",
      "type": "queueTrigger",
      "direction": "in"
    },
    {
      "name": "inputblob",
      "type": "blob",
      "dataType": "binary",
      "path": "samples-workitems/{queueTrigger}",
      "connection": "MyStorageConnectionAppSetting",
      "direction": "in"
    },
    {
      "name": "$return",
      "type": "blob",
      "path": "samples-workitems/{queueTrigger}-Copy",
      "connection": "MyStorageConnectionAppSetting",
      "direction": "out"
    }
  ],
  "disabled": false,
  "scriptFile": "__init__.py"
}
```

The [configuration](#configuration) section explains these properties.

The `dataType` property determines which binding is used. The following values are available to support different binding strategies:

| Binding value | Default | Description | Example |
| --- | --- | --- | --- |
| `string` | N | Uses generic binding and casts the input type as a `string` | `def main(input: str)` |
| `binary` | N | Uses generic binding and casts the input blob as `bytes` Python object | `def main(input: bytes)` |

If the `dataType` property is not defined in function.json, the default value is `string`.

Here's the Python code:

```python
import logging
import azure.functions as func


# The input binding field inputblob can either be 'bytes' or 'str' depends
# on dataType in function.json, 'binary' or 'string'.
def main(queuemsg: func.QueueMessage, inputblob: bytes) -> bytes:
    logging.info(f'Python Queue trigger function processed {len(inputblob)} bytes')
    return inputblob
```

::: zone-end  
::: zone pivot="programming-language-csharp"
## Attributes

Both [in-process](functions-dotnet-class-library.md) and [isolated worker process](dotnet-isolated-process-guide.md) C# libraries use attributes to define the function. C# script instead uses a function.json configuration file.

# [In-process](#tab/in-process)

In [C# class libraries](functions-dotnet-class-library.md), use the [BlobAttribute](/dotnet/api/microsoft.azure.webjobs.blobattribute), which takes the following parameters:

|Parameter | Description|
|---------|----------------------|
|**BlobPath** | The path to the blob.|
|**Connection** | The name of an app setting or setting collection that specifies how to connect to Azure Blobs. See [Connections](#connections).|
|**Access** | Indicates whether you will be reading or writing.|

The following example shows how the attribute's constructor takes the path to the blob and a `FileAccess` parameter indicating read for the input binding:

```csharp
[FunctionName("BlobInput")]
public static void Run(
    [QueueTrigger("myqueue-items")] string myQueueItem,
    [Blob("samples-workitems/{queueTrigger}", FileAccess.Read)] Stream myBlob,
    ILogger log)
{
    log.LogInformation($"BlobInput processed blob\n Name:{myQueueItem} \n Size: {myBlob.Length} bytes");
}

```

[!INCLUDE [functions-bindings-storage-attribute](../../includes/functions-bindings-storage-attribute.md)]

# [Isolated process](#tab/isolated-process)

isolated worker process defines an input binding by using a `BlobInputAttribute` attribute, which takes the following parameters:

|Parameter | Description|
|---------|----------------------|
|**BlobPath** | The path to the blob.|
|**Connection** | The name of an app setting or setting collection that specifies how to connect to Azure Blobs. See [Connections](#connections).|

# [C# script](#tab/csharp-script)

C# script uses a function.json file for configuration instead of attributes.

The following table explains the binding configuration properties for C# script that you set in the *function.json* file. 

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `blob`. |
|**direction** | Must be set to `in`. Exceptions are noted in the [usage](#usage) section. |
|**name** | The name of the variable that represents the blob in function code.|
|**path** | The path to the blob. |
|**connection** | The name of an app setting or setting collection that specifies how to connect to Azure Blobs. See [Connections](#connections).|
|**dataType**| For dynamically typed languages, specifies the underlying data type. Possible values are `string`, `binary`, or `stream`. For more detail, refer to the [triggers and bindings concepts](functions-triggers-bindings.md?tabs=python#trigger-and-binding-definitions). |

---

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

::: zone-end  
::: zone pivot="programming-language-java"  
## Annotations

The `@BlobInput` attribute gives you access to the blob that triggered the function. If you use a byte array with the attribute, set `dataType` to `binary`. Refer to the [input example](#example) for details.

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-python"  
## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file. 

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `blob`. |
|**direction** | Must be set to `in`. Exceptions are noted in the [usage](#usage) section. |
|**name** | The name of the variable that represents the blob in function code.|
|**path** | The path to the blob. |
|**connection** | The name of an app setting or setting collection that specifies how to connect to Azure Blobs. See [Connections](#connections).|
|**dataType**| For dynamically typed languages, specifies the underlying data type. Possible values are `string`, `binary`, or `stream`. For more detail, refer to the [triggers and bindings concepts](functions-triggers-bindings.md?tabs=python#trigger-and-binding-definitions). |

::: zone-end  

See the [Example section](#example) for complete examples.

## Usage

::: zone pivot="programming-language-csharp" 

The usage of the Blob input binding depends on the extension package version, and the C# modality used in your function app, which can be one of the following:

[!INCLUDE [functions-bindings-blob-storage-usage-csharp](../../includes/functions-bindings-blob-storage-usage-csharp.md)] 

::: zone-end  
::: zone pivot="programming-language-java"
The `@BlobInput` attribute gives you access to the blob that triggered the function. If you use a byte array with the attribute, set `dataType` to `binary`. Refer to the [input example](#example) for details.
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-powershell"  
Access blob data using `context.bindings.<NAME>` where `<NAME>` matches the value defined in *function.json*.
::: zone-end  
::: zone pivot="programming-language-powershell"  
Access the blob data via a parameter that matches the name designated by binding's name parameter in the _function.json_ file.
::: zone-end  
::: zone pivot="programming-language-python"  
Access blob data via the parameter typed as [InputStream](/python/api/azure-functions/azure.functions.inputstream). Refer to the [input example](#example) for details.
::: zone-end  

[!INCLUDE [functions-storage-blob-connections](../../includes/functions-storage-blob-connections.md)]

## Next steps

- [Run a function when blob storage data changes](./functions-bindings-storage-blob-trigger.md)
- [Write blob storage data from a function](./functions-bindings-storage-blob-output.md)
