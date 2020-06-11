---
title: Azure Blob storage output binding for Azure Functions
description: Learn how to provide Azure Blob storage data to an Azure Function.
author: craigshoemaker
ms.topic: reference
ms.date: 02/13/2020
ms.author: cshoe
ms.custom: tracking-python
---

# Azure Blob storage output binding for Azure Functions

The output binding allows you to modify and delete blob storage data in an Azure Function.

For information on setup and configuration details, see the [overview](./functions-bindings-storage-blob.md).

## Example

# [C#](#tab/csharp)

The following example is a [C# function](functions-dotnet-class-library.md) that uses a blob trigger and two output blob bindings. The function is triggered by the creation of an image blob in the *sample-images* container. It creates small and medium size copies of the image blob.

```csharp
using System.Collections.Generic;
using System.IO;
using Microsoft.Azure.WebJobs;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

public class ResizeImages
{
    [FunctionName("ResizeImage")]
    public static void Run([BlobTrigger("sample-images/{name}")] Stream image,
        [Blob("sample-images-sm/{name}", FileAccess.Write)] Stream imageSmall,
        [Blob("sample-images-md/{name}", FileAccess.Write)] Stream imageMedium)
    {
        IImageFormat format;

        using (Image<Rgba32> input = Image.Load<Rgba32>(image, out format))
        {
            ResizeImage(input, imageSmall, ImageSize.Small, format);
        }

        image.Position = 0;
        using (Image<Rgba32> input = Image.Load<Rgba32>(image, out format))
        {
            ResizeImage(input, imageMedium, ImageSize.Medium, format);
        }
    }

    public static void ResizeImage(Image<Rgba32> input, Stream output, ImageSize size, IImageFormat format)
    {
        var dimensions = imageDimensionsTable[size];

        input.Mutate(x => x.Resize(dimensions.Item1, dimensions.Item2));
        input.Save(output, format);
    }

    public enum ImageSize { ExtraSmall, Small, Medium }

    private static Dictionary<ImageSize, (int, int)> imageDimensionsTable = new Dictionary<ImageSize, (int, int)>() {
        { ImageSize.ExtraSmall, (320, 200) },
        { ImageSize.Small,      (640, 400) },
        { ImageSize.Medium,     (800, 600) }
    };

}
```

# [C# Script](#tab/csharp-script)

<!--Same example for input and output. -->

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

# [JavaScript](#tab/javascript)

<!--Same example for input and output. -->

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
module.exports = function(context) {
    context.log('Node.js Queue trigger function processed', context.bindings.myQueueItem);
    context.bindings.myOutputBlob = context.bindings.myInputBlob;
    context.done();
};
```

# [Python](#tab/python)

<!--Same example for input and output. -->

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
      "path": "samples-workitems/{queueTrigger}",
      "connection": "MyStorageConnectionAppSetting",
      "direction": "in"
    },
    {
      "name": "outputblob",
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

Here's the Python code:

```python
import logging
import azure.functions as func


def main(queuemsg: func.QueueMessage, inputblob: func.InputStream,
         outputblob: func.Out[func.InputStream]):
    logging.info('Python Queue trigger function processed %s', inputblob.name)
    outputblob.set(inputblob)
```

# [Java](#tab/java)

This section contains the following examples:

* [HTTP trigger, using OutputBinding](#http-trigger-using-outputbinding-java)
* [Queue trigger, using function return value](#queue-trigger-using-function-return-value-java)

#### HTTP trigger, using OutputBinding (Java)

 The following example shows a Java function that uses the `HttpTrigger` annotation to receive a parameter containing the name of a file in a blob storage container. The `BlobInput` annotation then reads the file and passes its contents to the function as a `byte[]`. The `BlobOutput` annotation binds to `OutputBinding outputItem`, which is then used by the function to write the contents of the input blob to the configured storage container.

```java
  @FunctionName("copyBlobHttp")
  @StorageAccount("Storage_Account_Connection_String")
  public HttpResponseMessage copyBlobHttp(
    @HttpTrigger(name = "req", 
      methods = {HttpMethod.GET}, 
      authLevel = AuthorizationLevel.ANONYMOUS) 
    HttpRequestMessage<Optional<String>> request,
    @BlobInput(
      name = "file", 
      dataType = "binary", 
      path = "samples-workitems/{Query.file}") 
    byte[] content,
    @BlobOutput(
      name = "target", 
      path = "myblob/{Query.file}-CopyViaHttp")
    OutputBinding<String> outputItem,
    final ExecutionContext context) {
      // Save blob to outputItem
      outputItem.setValue(new String(content, StandardCharsets.UTF_8));

      // build HTTP response with size of requested blob
      return request.createResponseBuilder(HttpStatus.OK)
        .body("The size of \"" + request.getQueryParameters().get("file") + "\" is: " + content.length + " bytes")
        .build();
  }
```

#### Queue trigger, using function return value (Java)

 The following example shows a Java function that uses the `QueueTrigger` annotation to receive a message containing the name of a file in a blob storage container. The `BlobInput` annotation then reads the file and passes its contents to the function as a `byte[]`. The `BlobOutput` annotation binds to the function return value, which is then used by the runtime to write the contents of the input blob to the configured storage container.

```java
  @FunctionName("copyBlobQueueTrigger")
  @StorageAccount("Storage_Account_Connection_String")
  @BlobOutput(
    name = "target", 
    path = "myblob/{queueTrigger}-Copy")
  public String copyBlobQueue(
    @QueueTrigger(
      name = "filename", 
      dataType = "string",
      queueName = "myqueue-items") 
    String filename,
    @BlobInput(
      name = "file", 
      path = "samples-workitems/{queueTrigger}") 
    String content,
    final ExecutionContext context) {
      context.getLogger().info("The content of \"" + filename + "\" is: " + content);
      return content;
  }
```

 In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `@BlobOutput` annotation on function parameters whose value would be written to an object in blob storage.  The parameter type should be `OutputBinding<T>`, where T is any native Java type or a POJO.

---

## Attributes and annotations

# [C#](#tab/csharp)

In [C# class libraries](functions-dotnet-class-library.md), use the [BlobAttribute](https://github.com/Azure/azure-webjobs-sdk/blob/dev/src/Microsoft.Azure.WebJobs.Extensions.Storage/Blobs/BlobAttribute.cs).

The attribute's constructor takes the path to the blob and a `FileAccess` parameter indicating read or write, as shown in the following example:

```csharp
[FunctionName("ResizeImage")]
public static void Run(
    [BlobTrigger("sample-images/{name}")] Stream image,
    [Blob("sample-images-md/{name}", FileAccess.Write)] Stream imageSmall)
{
    ...
}
```

You can set the `Connection` property to specify the storage account to use, as shown in the following example:

```csharp
[FunctionName("ResizeImage")]
public static void Run(
    [BlobTrigger("sample-images/{name}")] Stream image,
    [Blob("sample-images-md/{name}", FileAccess.Write, Connection = "StorageConnectionAppSetting")] Stream imageSmall)
{
    ...
}
```

# [C# Script](#tab/csharp-script)

Attributes are not supported by C# Script.

# [JavaScript](#tab/javascript)

Attributes are not supported by JavaScript.

# [Python](#tab/python)

Attributes are not supported by Python.

# [Java](#tab/java)

The `@BlobOutput` attribute gives you access to the blob that triggered the function. If you use a byte array with the attribute, set `dataType` to `binary`. Refer to the [output example](#example) for details.

---

For a complete example, see [Output example](#example).

You can use the `StorageAccount` attribute to specify the storage account at class, method, or parameter level. For more information, see [Trigger - attributes](./functions-bindings-storage-blob-trigger.md#attributes-and-annotations).

## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `Blob` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type** | n/a | Must be set to `blob`. |
|**direction** | n/a | Must be set to `out` for an output binding. Exceptions are noted in the [usage](#usage) section. |
|**name** | n/a | The name of the variable that represents the blob in function code.  Set to `$return` to reference the function return value.|
|**path** |**BlobPath** | The path to the blob container. |
|**connection** |**Connection**| The name of an app setting that contains the Storage connection string to use for this binding. If the app setting name begins with "AzureWebJobs", you can specify only the remainder of the name here. For example, if you set `connection` to "MyStorage", the Functions runtime looks for an app setting that is named "AzureWebJobsMyStorage." If you leave `connection` empty, the Functions runtime uses the default Storage connection string in the app setting that is named `AzureWebJobsStorage`.<br><br>The connection string must be for a general-purpose storage account, not a [blob-only storage account](../storage/common/storage-account-overview.md#types-of-storage-accounts).|
|n/a | **Access** | Indicates whether you will be reading or writing. |

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Usage

# [C#](#tab/csharp)

[!INCLUDE [functions-bindings-blob-storage-output-usage.md](../../includes/functions-bindings-blob-storage-output-usage.md)]

# [C# Script](#tab/csharp-script)

[!INCLUDE [functions-bindings-blob-storage-output-usage.md](../../includes/functions-bindings-blob-storage-output-usage.md)]

# [JavaScript](#tab/javascript)

In JavaScript, access the blob data using `context.bindings.<name from function.json>`.

# [Python](#tab/python)

You can declare function parameters as the following types to write out to blob storage:

* Strings as `func.Out(str)`
* Streams as `func.Out(func.InputStream)`

Refer to the [output example](#example) for details.

# [Java](#tab/java)

The `@BlobOutput` attribute gives you access to the blob that triggered the function. If you use a byte array with the attribute, set `dataType` to `binary`. Refer to the [output example](#example) for details.

---

## Exceptions and return codes

| Binding |  Reference |
|---|---|
| Blob | [Blob Error Codes](https://docs.microsoft.com/rest/api/storageservices/fileservices/blob-service-error-codes) |
| Blob, Table, Queue |  [Storage Error Codes](https://docs.microsoft.com/rest/api/storageservices/fileservices/common-rest-api-error-codes) |
| Blob, Table, Queue |  [Troubleshooting](https://docs.microsoft.com/rest/api/storageservices/fileservices/troubleshooting-api-operations) |

## Next steps

- [Run a function when blob storage data changes](./functions-bindings-storage-blob-trigger.md)
- [Read blob storage data when a function runs](./functions-bindings-storage-blob-input.md)
