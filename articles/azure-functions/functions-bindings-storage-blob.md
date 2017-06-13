---
title: Azure Functions Blob Storage bindings | Microsoft Docs
description: Understand how to use Azure Storage triggers and bindings in Azure Functions.
services: functions
documentationcenter: na
author: lindydonna
manager: erikre
editor: ''
tags: ''
keywords: azure functions, functions, event processing, dynamic compute, serverless architecture

ms.assetid: aba8976c-6568-4ec7-86f5-410efd6b0fb9
ms.service: functions
ms.devlang: multiple
ms.topic: reference
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 05/25/2017
ms.author: donnam, glenga

---
# Azure Functions Blob storage bindings
[!INCLUDE [functions-selector-bindings](../../includes/functions-selector-bindings.md)]

This article explains how to configure and work with Azure Blob storage bindings in Azure Functions. 
Azure Functions supports trigger, input, and output bindings for Azure Blob storage. For features that are available in all bindings, see [Azure Functions triggers and bindings concepts](functions-triggers-bindings.md).

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

> [!NOTE]
> A [blob only storage account](../storage/storage-create-storage-account.md#blob-storage-accounts) is not supported. Blob storage triggers and bindings require a general-purpose storage account. 
> 

<a name="trigger"></a>
<a name="storage-blob-trigger"></a>
## Blob storage triggers and bindings

Using the Azure Blob storage trigger, your function code is called when a new or updated blob is detected. The blob contents are provided as input to the function.

Define a blob storage trigger using the **Integrate** tab in the Functions portal. The portal creates the following definition in the  **bindings** section of *function.json*:

```json
{
    "name": "<The name used to identify the trigger data in your code>",
    "type": "blobTrigger",
    "direction": "in",
    "path": "<container to monitor, and optionally a blob name pattern - see below>",
    "connection": "<Name of app setting - see below>"
}
```

Blob input and output bindings are defined using `blob` as the binding type:

```json
{
  "name": "<The name used to identify the blob input in your code>",
  "type": "blob",
  "direction": "in", // other supported directions are "inout" and "out"
  "path": "<Path of input blob - see below>",
  "connection":"<Name of app setting - see below>"
},
```

* The `path` property supports binding expressions and filter parameters. See [Name patterns](#pattern).
* The `connection` property must contain the name of an app setting that contains a storage connection string. In the Azure portal, the standard editor in the **Integrate** tab configures this app setting for you when you select a storage account.

> [!NOTE]
> When you're using a blob trigger on a Consumption plan, there can be up to a 10-minute delay in processing new blobs after a function app has gone idle. After the function app is running, blobs are processed immediately. To avoid this initial delay, consider one of the following options:
> - Use an App Service plan with Always On enabled.
> - Use another mechanism to trigger the blob processing, such as a queue message that contains the blob name. For an example, see [Queue trigger with blob input binding](#input-sample).

<a name="pattern"></a>

### Name patterns
You can specify a blob name pattern in the `path` property, which can be a filter or binding expression. See [Binding expressions and patterns](functions-triggers-bindings.md#binding-expressions-and-patterns).

For example, to filter to blobs that start with the string "original," use the following definition. This path finds a blob named *original-Blob1.txt* in the *input* container, and the value of the `name` variable in function code is `Blob1`.

```json
"path": "input/original-{name}",
```

To bind to the blob file name and extension separately, use two patterns. This path also finds a blob named *original-Blob1.txt*, and the value of the `blobname` and `blobextension` variables in function code 
are *original-Blob1* and *txt*.

```json
"path": "input/{blobname}.{blobextension}",
```

You can restrict the file type of blobs by using a fixed value for the file extension. For instance, to trigger only on .png files, use the following pattern:

```json
"path": "samples/{name}.png",
```

Curly braces are special characters in name patterns. To specify blob names that have curly braces in the name, you can escape the braces using two braces. The following example finds a blob named *{20140101}-soundfile.mp3* in the *images* container, and the `name` variable value in the function code is *soundfile.mp3*. 

```json
"path": "images/{{20140101}}-{name}",
```

### Trigger metadata

The blob trigger provides several metadata properties. These properties can be used as part of bindings expressions in other bindings or as parameters in your code. These values have the same semantics as [Cloud​Blob](https://docs.microsoft.com/en-us/dotnet/api/microsoft.windowsazure.storage.blob.cloudblob?view=azure-dotnet).

- **BlobTrigger**. Type `string`. The triggering blob path
- **Uri**. Type `System.Uri`. The blob's URI for the primary location.
- **Properties**. Type `Microsoft.WindowsAzure.Storage.Blob.BlobProperties`. The blob's system properties.
- **Metadata**. Type `IDictionary<string,string>`. The user-defined metadata for the blob.

<a name="receipts"></a>

### Blob receipts
The Azure Functions runtime ensures that no blob trigger function gets called more than once for the same new or updated blob. 
To determine if a given blob version has been processed, it maintains *blob receipts*.

Azure Functions stores blob receipts in a container named *azure-webjobs-hosts* in the Azure storage account for your function app (defined by the app setting `AzureWebJobsStorage`). A blob receipt has the following information:

* The triggered function ("*&lt;function app name>*.Functions.*&lt;function name>*", for example: "MyFunctionApp.Functions.CopyBlob")
* The container name
* The blob type ("BlockBlob" or "PageBlob")
* The blob name
* The ETag (a blob version identifier, for example: "0x8D1DC6E70A277EF")

To force reprocessing of a blob, delete the blob receipt for that blob from the *azure-webjobs-hosts* container manually.

<a name="poison"></a>

### Handling poison blobs
When a blob trigger function fails for a given blob, Azure Functions retries that function a total of 5 times by default. 

If all 5 tries fail, Azure Functions adds a message to a Storage queue named *webjobs-blobtrigger-poison*. The queue message for poison blobs is a JSON object that contains the following properties:

* FunctionId (in the format *&lt;function app name>*.Functions.*&lt;function name>*)
* BlobType ("BlockBlob" or "PageBlob")
* ContainerName
* BlobName
* ETag (a blob version identifier, for example: "0x8D1DC6E70A277EF")

### Blob polling for large containers
If the blob container being monitored contains more than 10,000 blobs, the Functions runtime scans log files to watch 
for new or changed blobs. This process is not real time. A function might not get triggered until several minutes or longer 
after the blob is created. In addition, [storage logs are created on a "best effort"](/rest/api/storageservices/About-Storage-Analytics-Logging) 
basis. There is no guarantee that all events are captured. Under some conditions, logs may be missed. If you require faster or more reliable blob processing, consider creating a [queue message](../storage/storage-dotnet-how-to-use-queues.md) 
 when you create the blob. Then, use a [queue trigger](functions-bindings-storage-queue.md) instead of a blob trigger to process the blob.

<a name="triggerusage"></a>

## Using a blob trigger and input binding
In .NET functions, access the blob data using a method parameter such as `Stream paramName`. Here, `paramName` is the value you specified in the 
[trigger configuration](#trigger). In Node.js functions, access the input blob data using `context.bindings.<name>`.

In .NET, you can bind to any of the types in the list below. If used as an input binding, some of these types require an `inout` binding direction in *function.json*. This direction is not supported by the standard editor, so you must use the advanced editor.

* `TextReader`
* `Stream`
* `ICloudBlob` (requires "inout" binding direction)
* `CloudBlockBlob` (requires "inout" binding direction)
* `CloudPageBlob` (requires "inout" binding direction)
* `CloudAppendBlob` (requires "inout" binding direction)

If text blobs are expected, you can also bind to a .NET `string` type. This is only recommended if the blob size is small, as the entire blob contents are loaded into memory. Generally, it is preferable to use a `Stream` or `CloudBlockBlob` type.

## Trigger sample
Suppose you have the following function.json that defines a blob storage trigger:

```json
{
    "disabled": false,
    "bindings": [
        {
            "name": "myBlob",
            "type": "blobTrigger",
            "direction": "in",
            "path": "samples-workitems",
            "connection":"MyStorageAccount"
        }
    ]
}
```

See the language-specific sample that logs the contents of each blob that is added to the monitored container.

* [C#](#triggercsharp)
* [Node.js](#triggernodejs)

<a name="triggercsharp"></a>

### Blob trigger examples in C# #

```cs
// Blob trigger sample using a Stream binding
public static void Run(Stream myBlob, TraceWriter log)
{
   log.Info($"C# Blob trigger function Processed blob\n Name:{name} \n Size: {myBlob.Length} Bytes");
}
```

```cs
// Blob trigger binding to a CloudBlockBlob
#r "Microsoft.WindowsAzure.Storage"

using Microsoft.WindowsAzure.Storage.Blob;

public static void Run(CloudBlockBlob myBlob, string name, TraceWriter log)
{
    log.Info($"C# Blob trigger function Processed blob\n Name:{name}\nURI:{myBlob.StorageUri}");
}
```

<a name="triggernodejs"></a>

### Trigger example in Node.js

```javascript
module.exports = function(context) {
    context.log('Node.js Blob trigger function processed', context.bindings.myBlob);
    context.done();
};
```
<a name="outputusage"></a>
<a name=storage-blob-output-binding"></a>

## Using a blob output binding

In .NET functions, you should either use a `out string` parameter in your function signature or use one of the types in the following list. In Node.js functions, you access the output blob using `context.bindings.<name>`.

In .NET functions you can output to any of the following types:

* `out string`
* `TextWriter`
* `Stream`
* `CloudBlobStream`
* `ICloudBlob`
* `CloudBlockBlob` 
* `CloudPageBlob` 

<a name="input-sample"></a>

## Queue trigger with blob input and output sample
Suppose you have the following function.json, that defines a [Queue Storage trigger](functions-bindings-storage-queue.md), 
a blob storage input, and a blob storage output. Notice the use of the `queueTrigger` metadata property. in the blob input and output `path` properties:

```json
{
  "bindings": [
    {
      "queueName": "myqueue-items",
      "connection": "MyStorageConnection",
      "name": "myQueueItem",
      "type": "queueTrigger",
      "direction": "in"
    },
    {
      "name": "myInputBlob",
      "type": "blob",
      "path": "samples-workitems/{queueTrigger}",
      "connection": "MyStorageConnection",
      "direction": "in"
    },
    {
      "name": "myOutputBlob",
      "type": "blob",
      "path": "samples-workitems/{queueTrigger}-Copy",
      "connection": "MyStorageConnection",
      "direction": "out"
    }
  ],
  "disabled": false
}
``` 

See the language-specific sample that copies the input blob to the output blob.

* [C#](#incsharp)
* [Node.js](#innodejs)

<a name="incsharp"></a>

### Blob binding example in C# #

```cs
// Copy blob from input to output, based on a queue trigger
public static void Run(string myQueueItem, Stream myInputBlob, out string myOutputBlob, TraceWriter log)
{
    log.Info($"C# Queue trigger function processed: {myQueueItem}");
    myOutputBlob = myInputBlob;
}
```

<a name="innodejs"></a>

### Blob binding example in Node.js

```javascript
// Copy blob from input to output, based on a queue trigger
module.exports = function(context) {
    context.log('Node.js Queue trigger function processed', context.bindings.myQueueItem);
    context.bindings.myOutputBlob = context.bindings.myInputBlob;
    context.done();
};
```

## Next steps
[!INCLUDE [next steps](../../includes/functions-bindings-next-steps.md)]

