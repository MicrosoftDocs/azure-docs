---
title: Azure Functions Blob storage bindings
description: Understand how to use Azure Blob storage triggers and bindings in Azure Functions.
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
ms.date: 10/27/2017
ms.author: glenga
---

# Azure Functions Blob storage bindings

This article explains how to work with Azure Blob storage bindings in Azure Functions. Azure Functions supports trigger, input, and output bindings for blobs.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

> [!NOTE]
> [Blob-only storage accounts](../storage/common/storage-create-storage-account.md#blob-storage-accounts) are not supported. Blob storage triggers and bindings require a general-purpose storage account. 

## Blob storage trigger

Use a Blob storage trigger to start a function when a new or updated blob is detected. The blob contents are provided as input to the function.

> [!NOTE]
> When you're using a blob trigger on a Consumption plan, there can be up to a 10-minute delay in processing new blobs after a function app has gone idle. After the function app is running, blobs are processed immediately. To avoid this initial delay, consider one of the following options:
> - Use an App Service plan with Always On enabled.
> - Use another mechanism to trigger the blob processing, such as a queue message that contains the blob name. For an example, see the [blob input/output bindings example later in this article](#input--output---example).

## Trigger - example

See the language-specific example:

* [Precompiled C#](#trigger---c-example)
* [C# script](#trigger---c-script-example)
* [JavaScript](#trigger---javascript-example)

### Trigger - C# example

The following example shows [precompiled C#](functions-dotnet-class-library.md) code that writes a log when a blob is added or updated in the `samples-workitems` container.

```csharp
[FunctionName("BlobTriggerCSharp")]        
public static void Run([BlobTrigger("samples-workitems/{name}")] Stream myBlob, string name, TraceWriter log)
{
    log.Info($"C# Blob trigger function Processed blob\n Name:{name} \n Size: {myBlob.Length} Bytes");
}
```

For more information about the `BlobTrigger` attribute, see [Trigger - Attributes for precompiled C#](#trigger---attributes-for-precompiled-c).

### Trigger - C# script example

The following example shows a blob trigger binding in a *function.json* file and [C# script](functions-reference-csharp.md) code that uses the binding. The function writes a log when a blob is added or updated in the `samples-workitems` container.

Here's the binding data in the *function.json* file:

```json
{
    "disabled": false,
    "bindings": [
        {
            "name": "myBlob",
            "type": "blobTrigger",
            "direction": "in",
            "path": "samples-workitems",
            "connection":"MyStorageAccountAppSetting"
        }
    ]
}
```

The [configuration](#trigger---configuration) section explains these properties.

Here's C# script code that binds to a `Stream`:

```cs
public static void Run(Stream myBlob, TraceWriter log)
{
   log.Info($"C# Blob trigger function Processed blob\n Name:{name} \n Size: {myBlob.Length} Bytes");
}
```

Here's C# script code that binds to a `CloudBlockBlob`:

```cs
#r "Microsoft.WindowsAzure.Storage"

using Microsoft.WindowsAzure.Storage.Blob;

public static void Run(CloudBlockBlob myBlob, string name, TraceWriter log)
{
    log.Info($"C# Blob trigger function Processed blob\n Name:{name}\nURI:{myBlob.StorageUri}");
}
```

### Trigger - JavaScript example

The following example shows a blob trigger binding in a *function.json* file and [JavaScript code] (functions-reference-node.md) that uses the binding. The function writes a log when a blob is added or updated in the `samples-workitems` container.

Here's the *function.json* file:

```json
{
    "disabled": false,
    "bindings": [
        {
            "name": "myBlob",
            "type": "blobTrigger",
            "direction": "in",
            "path": "samples-workitems",
            "connection":"MyStorageAccountAppSetting"
        }
    ]
}
```

The [configuration](#trigger---configuration) section explains these properties.

Here's the JavaScript code:

```javascript
module.exports = function(context) {
    context.log('Node.js Blob trigger function processed', context.bindings.myBlob);
    context.done();
};
```

## Trigger - Attributes for precompiled C#

For [precompiled C#](functions-dotnet-class-library.md) functions, use the following attributes to configure a blob trigger:

* [BlobTriggerAttribute](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/BlobTriggerAttribute.cs), defined in NuGet package [Microsoft.Azure.WebJobs](http://www.nuget.org/packages/Microsoft.Azure.WebJobs)

  The attribute's constructor takes a path string that indicates the container to watch and optionally a [blob name pattern](#trigger---blob-name-patterns). Here's an example:

  ```csharp
  [FunctionName("ResizeImage")]
  public static void Run(
      [BlobTrigger("sample-images/{name}")] Stream image, 
      [Blob("sample-images-md/{name}", FileAccess.Write)] Stream imageSmall)
  ```

  You can set the `Connection` property to specify the storage account to use, as shown in the following example:

   ```csharp
  [FunctionName("ResizeImage")]
  public static void Run(
      [BlobTrigger("sample-images/{name}", Connection = "StorageConnectionAppSetting")] Stream image, 
      [Blob("sample-images-md/{name}", FileAccess.Write)] Stream imageSmall)
  ```

* [StorageAccountAttribute](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/StorageAccountAttribute.cs), defined in NuGet package [Microsoft.Azure.WebJobs](http://www.nuget.org/packages/Microsoft.Azure.WebJobs)

  Provides another way to specify the storage account to use. The constructor takes the name of an app setting that contains a storage connection string. The attribute can be applied at the parameter, method, or class level. The following example shows class level and method level:

  ```csharp
  [StorageAccount("ClassLevelStorageAppSetting")]
  public static class AzureFunctions
  {
      [FunctionName("BlobTrigger")]
      [StorageAccount("FunctionLevelStorageAppSetting")]
      public static void Run( //...
  ```

The storage account to use is determined in the following order:

* The `BlobTrigger` attribute's `Connection` property.
* The `StorageAccount` attribute applied to the same parameter as the `BlobTrigger` attribute.
* The `StorageAccount` attribute applied to the function.
* The `StorageAccount` attribute applied to the class.
* The default storage account for the function app ("AzureWebJobsStorage" app setting).

## Trigger - configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `BlobTrigger` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type** | n/a | Must be set to `blobTrigger`. This property is set automatically when you create the trigger in the Azure portal.|
|**direction** | n/a | Must be set to `in`. This property is set automatically when you create the trigger in the Azure portal. Exceptions are noted in the [usage](#trigger---usage) section. |
|**name** | n/a | The name of the variable that represents the blob in function code. | 
|**path** | **BlobPath** |The container to monitor.  May be a [blob name pattern](#trigger-blob-name-patterns). | 
|**connection** | **Connection** | The name of an app setting that contains the Storage connection string to use for this binding. If the app setting name begins with "AzureWebJobs", you can specify only the remainder of the name here. For example, if you set `connection` to "MyStorage", the Functions runtime looks for an app setting that is named "AzureWebJobsMyStorage." If you leave `connection` empty, the Functions runtime uses the default Storage connection string in the app setting that is named `AzureWebJobsStorage`.<br><br>The connection string must be for a general-purpose storage account, not a [blob-only storage account](../storage/common/storage-create-storage-account.md#blob-storage-accounts).<br>When you're developing locally, app settings go into the values of the [local.settings.json](../../Documents/GitHub/azure-docs-pr/articles/azure-functions/functions-run-local.md#local-settings) file.|

## Trigger - usage

In C# and C# script, access the blob data by using a method parameter such as `Stream paramName`. In C# script, `paramName` is the value specified in the `name` property of *function.json*. You can bind to any of the following types:

* `TextReader`
* `Stream`
* `ICloudBlob` (requires "inout" binding direction in *function.json*)
* `CloudBlockBlob` (requires "inout" binding direction in *function.json*)
* `CloudPageBlob` (requires "inout" binding direction in *function.json*)
* `CloudAppendBlob` (requires "inout" binding direction in *function.json*)

As noted, some of these types require an `inout` binding direction in *function.json*. This direction is not supported by the standard editor in the Azure portal, so you must use the advanced editor.

If text blobs are expected, you can bind to the `string` type. This is only recommended if the blob size is small, as the entire blob contents are loaded into memory. Generally, it is preferable to use a `Stream` or `CloudBlockBlob` type.

In JavaScript, access the input blob data using `context.bindings.<name>`.

## Trigger - blob name patterns

You can specify a blob name pattern in the `path` property in *function.json* or in the `BlobTrigger` attribute constructor. The name pattern can be a [filter or binding expression](functions-triggers-bindings.md#binding-expressions-and-patterns).

### Filter on blob name

The following example triggers only on blobs in the `input` container that start with the string "original-":

```json
"path": "input/original-{name}",
```
 
If the blob name is *original-Blob1.txt*, the value of the `name` variable in function code is `Blob1`.

### Filter on file type

The following example triggers only on *.png* files:

```json
"path": "samples/{name}.png",
```

### Filter on curly braces in file names

To look for curly braces in file names, escape the braces by using two braces. The following example filters for blobs that have curly braces in the name:

```json
"path": "images/{{20140101}}-{name}",
```

If the blob is named *{20140101}-soundfile.mp3*, the `name` variable value in the function code is *soundfile.mp3*. 

### Get file name and extension

The following example shows how to bind to the blob file name and extension separately:

```json
"path": "input/{blobname}.{blobextension}",
```
If the blob is named *original-Blob1.txt*, the value of the `blobname` and `blobextension` variables in function code are *original-Blob1* and *txt*.

## Trigger - metadata

The blob trigger provides several metadata properties. These properties can be used as part of binding expressions in other bindings or as parameters in your code. These values have the same semantics as the [Cloud​Blob](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob.cloudblob?view=azure-dotnet) type.


|Property  |Type  |Description  |
|---------|---------|---------|
|`BlobTrigger`|`string`|The path to the triggering blob.|
|`Uri`|`System.Uri`|The blob's URI for the primary location.|
|`Properties` |[BlobProperties](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob.blobproperties)|The blob's system properties. |
|`Metadata` |`IDictionary<string,string>`|The user-defined metadata for the blob.|

## Trigger - blob receipts

The Azure Functions runtime ensures that no blob trigger function gets called more than once for the same new or updated blob. To determine if a given blob version has been processed, it maintains *blob receipts*.

Azure Functions stores blob receipts in a container named *azure-webjobs-hosts* in the Azure storage account for your function app (defined by the app setting `AzureWebJobsStorage`). A blob receipt has the following information:

* The triggered function ("*&lt;function app name>*.Functions.*&lt;function name>*", for example: "MyFunctionApp.Functions.CopyBlob")
* The container name
* The blob type ("BlockBlob" or "PageBlob")
* The blob name
* The ETag (a blob version identifier, for example: "0x8D1DC6E70A277EF")

To force reprocessing of a blob, delete the blob receipt for that blob from the *azure-webjobs-hosts* container manually.

## Trigger - poison blobs

When a blob trigger function fails for a given blob, Azure Functions retries that function a total of 5 times by default. 

If all 5 tries fail, Azure Functions adds a message to a Storage queue named *webjobs-blobtrigger-poison*. The queue message for poison blobs is a JSON object that contains the following properties:

* FunctionId (in the format *&lt;function app name>*.Functions.*&lt;function name>*)
* BlobType ("BlockBlob" or "PageBlob")
* ContainerName
* BlobName
* ETag (a blob version identifier, for example: "0x8D1DC6E70A277EF")

## Trigger - polling for large containers

If the blob container being monitored contains more than 10,000 blobs, the Functions runtime scans log files to watch 
for new or changed blobs. This process can result in delays. A function might not get triggered until several minutes or longer 
after the blob is created. In addition, [storage logs are created on a "best effort"](/rest/api/storageservices/About-Storage-Analytics-Logging) 
basis. There's no guarantee that all events are captured. Under some conditions, logs may be missed. If you require faster or more reliable blob processing, consider creating a [queue message](../storage/queues/storage-dotnet-how-to-use-queues.md) 
 when you create the blob. Then use a [queue trigger](functions-bindings-storage-queue.md) instead of a blob trigger to process the blob. Another option is to use Event Grid; see the tutorial [Automate resizing uploaded images using Event Grid](../event-grid/resize-images-on-storage-blob-upload-event.md).

## Blob storage input & output bindings

Use Blob storage input and output bindings to read and write blobs.

## Input & output - example

See the language-specific example:

* [Precompiled C#](#input--output---c-example)
* [C# script](#input--output---c-script-example)
* [JavaScript](#input--output---javascript-example)

### Input & output - C# example

The following example is a [precompiled C#](functions-dotnet-class-library.md) function that uses one input and two output blob bindings. The function is triggered by the creation of an image blob in the *sample-images* container. It creates small and medium size copies of the image blob. 

```csharp
[FunctionName("ResizeImage")]
public static void Run(
    [BlobTrigger("sample-images/{name}")] Stream image, 
    [Blob("sample-images-sm/{name}", FileAccess.Write)] Stream imageSmall, 
    [Blob("sample-images-md/{name}", FileAccess.Write)] Stream imageMedium)
{
    var imageBuilder = ImageResizer.ImageBuilder.Current;
    var size = imageDimensionsTable[ImageSize.Small];

    imageBuilder.Build(image, imageSmall,
        new ResizeSettings(size.Item1, size.Item2, FitMode.Max, null), false);

    image.Position = 0;
    size = imageDimensionsTable[ImageSize.Medium];

    imageBuilder.Build(image, imageMedium,
        new ResizeSettings(size.Item1, size.Item2, FitMode.Max, null), false);
}

public enum ImageSize { ExtraSmall, Small, Medium }

private static Dictionary<ImageSize, (int, int)> imageDimensionsTable = new Dictionary<ImageSize, (int, int)>() {
    { ImageSize.ExtraSmall, (320, 200) },
    { ImageSize.Small,      (640, 400) },
    { ImageSize.Medium,     (800, 600) }
};
```        

### Input & output - C# script example

The following example shows a blob trigger binding in a *function.json* file and [C# script](functions-reference-csharp.md) code that uses the binding. The function makes a copy of a blob. The function is triggered by a queue message that contains the name of the blob to copy. The new blob is named *{originalblobname}-Copy*.

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

The [configuration](#input--output---configuration) section explains these properties.

Here's the C# script code:

```cs
public static void Run(string myQueueItem, Stream myInputBlob, out string myOutputBlob, TraceWriter log)
{
    log.Info($"C# Queue trigger function processed: {myQueueItem}");
    myOutputBlob = myInputBlob;
}
```

### Input & output - JavaScript example

The following example shows a blob trigger binding in a *function.json* file and [JavaScript code] (functions-reference-node.md) that uses the binding. The function makes a copy of a blob. The function is triggered by a queue message that contains the name of the blob to copy. The new blob is named *{originalblobname}-Copy*.

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

The [configuration](#input--output---configuration) section explains these properties.

Here's the JavaScript code:

```javascript
module.exports = function(context) {
    context.log('Node.js Queue trigger function processed', context.bindings.myQueueItem);
    context.bindings.myOutputBlob = context.bindings.myInputBlob;
    context.done();
};
```

## Input & output - Attributes for precompiled C#

For [precompiled C#](functions-dotnet-class-library.md) functions, use the [BlobAttribute](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/BlobAttribute.cs), which is defined in NuGet package [Microsoft.Azure.WebJobs](http://www.nuget.org/packages/Microsoft.Azure.WebJobs).

The attribute's constructor takes the path to the blob and a `FileAccess` parameter indicating read or write, as shown in the following example:

```csharp
[FunctionName("ResizeImage")]
public static void Run(
    [BlobTrigger("sample-images/{name}")] Stream image, 
    [Blob("sample-images-md/{name}", FileAccess.Write)] Stream imageSmall)
```

You can set the `Connection` property to specify the storage account to use, as shown in the following example:

```csharp
[FunctionName("ResizeImage")]
public static void Run(
    [BlobTrigger("sample-images/{name}")] Stream image, 
    [Blob("sample-images-md/{name}", FileAccess.Write, Connection = "StorageConnectionAppSetting")] Stream imageSmall)
```

You can use the `StorageAccount` attribute to specify the storage account at class, method, or parameter level. For more information, see [Trigger - Attributes for precompiled C#](#trigger---attributes-for-precompiled-c).

## Input & output - configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `Blob` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type** | n/a | Must be set to `blob`. |
|**direction** | n/a | Must be set to `in` for an input binding or out for an output binding. Exceptions are noted in the [usage](#input--output---usage) section. |
|**name** | n/a | The name of the variable that represents the blob in function code.  Set to `$return` to reference the function return value.|
|**path** |**BlobPath** | The path to the blob. | 
|**connection** |**Connection**| The name of an app setting that contains the Storage connection string to use for this binding. If the app setting name begins with "AzureWebJobs", you can specify only the remainder of the name here. For example, if you set `connection` to "MyStorage", the Functions runtime looks for an app setting that is named "AzureWebJobsMyStorage." If you leave `connection` empty, the Functions runtime uses the default Storage connection string in the app setting that is named `AzureWebJobsStorage`.<br><br>The connection string must be for a general-purpose storage account, not a [blob-only storage account](../storage/common/storage-create-storage-account.md#blob-storage-accounts).<br>When you're developing locally, app settings go into the values of the [local.settings.json](../../Documents/GitHub/azure-docs-pr/articles/azure-functions/functions-run-local.md#local-settings) file.|
|n/a | **Access** | Indicates whether you will be reading or writing. |

## Input & output - usage

In precompiled C# and C# script, access the blob by using a method parameter such as `Stream paramName`. In C# script, `paramName` is the value specified in the `name` property of *function.json*. You can bind to any of the following types:

* `out string`
* `TextWriter` 
* `TextReader`
* `Stream`
* `ICloudBlob` (requires "inout" binding direction in *function.json*)
* `CloudBlockBlob` (requires "inout" binding direction in *function.json*)
* `CloudPageBlob` (requires "inout" binding direction in *function.json*)
* `CloudAppendBlob` (requires "inout" binding direction in *function.json*)

As noted, some of these types require an `inout` binding direction in *function.json*. This direction is not supported by the standard editor in the Azure portal, so you must use the advanced editor.

If you are reading text blobs, you can bind to a `string` type. This type is only recommended if the blob size is small, as the entire blob contents are loaded into memory. Generally, it is preferable to use a `Stream` or `CloudBlockBlob` type.

In JavaScript, access the blob data using `context.bindings.<name>`.

## Next steps

> [!div class="nextstepaction"]
> [Go to a quickstart that uses a Blob storage trigger](functions-create-storage-blob-triggered-function.md)

> [!div class="nextstepaction"]
> [Learn more about Azure functions triggers and bindings](functions-triggers-bindings.md)
