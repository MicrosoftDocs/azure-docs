---
title: Azure Blob storage trigger for Azure Functions
description: Learn how to run an Azure Function as Azure Blob storage data changes.
author: craigshoemaker
ms.topic: reference
ms.date: 02/13/2020
ms.author: cshoe
ms.custom: "devx-track-csharp, devx-track-python"
---

# Azure Blob storage trigger for Azure Functions

The Blob storage trigger starts a function when a new or updated blob is detected. The blob contents are provided as [input to the function](./functions-bindings-storage-blob-input.md).

The Azure Blob storage trigger requires a general-purpose storage account. Storage V2 accounts with [hierarchical namespaces](../storage/blobs/data-lake-storage-namespace.md) are also supported. To use a blob-only account, or if your application has specialized needs, review the alternatives to using this trigger.

For information on setup and configuration details, see the [overview](./functions-bindings-storage-blob.md).

## Polling

Polling works as a hybrid between inspecting logs and running periodic container scans. Blobs are scanned in groups of 10,000 at a time with a continuation token used between intervals.

> [!WARNING]
> In addition, [storage logs are created on a "best effort"](/rest/api/storageservices/About-Storage-Analytics-Logging) basis. There's no guarantee that all events are captured. Under some conditions, logs may be missed.
> 
> If you require faster or more reliable blob processing, consider creating a [queue message](../storage/queues/storage-dotnet-how-to-use-queues.md) when you create the blob. Then use a [queue trigger](functions-bindings-storage-queue.md) instead of a blob trigger to process the blob. Another option is to use Event Grid; see the tutorial [Automate resizing uploaded images using Event Grid](../event-grid/resize-images-on-storage-blob-upload-event.md).
>

## Alternatives

### Event Grid trigger

> [!NOTE]
> When using Storage Extensions 5.x and higher, the Blob trigger has built-in support for an Event Grid based Blob trigger. For more information, see the [Storage extension 5.x and higher](#storage-extension-5x-and-higher) section below.

The [Event Grid trigger](functions-bindings-event-grid.md) also has built-in support for [blob events](../storage/blobs/storage-blob-event-overview.md). Use Event Grid instead of the Blob storage trigger for the following scenarios:

- **Blob-only storage accounts**: [Blob-only storage accounts](../storage/common/storage-account-overview.md#types-of-storage-accounts) are supported for blob input and output bindings but not for blob triggers.

- **High-scale**: High scale can be loosely defined as containers that have more than 100,000 blobs in them or storage accounts that have more than 100 blob updates per second.

- **Minimizing latency**: If your function app is on the Consumption plan, there can be up to a 10-minute delay in processing new blobs if a function app has gone idle. To avoid this latency, you can switch to an App Service plan with Always On enabled. You can also use an [Event Grid trigger](functions-bindings-event-grid.md) with your Blob storage account. For an example, see the [Event Grid tutorial](../event-grid/resize-images-on-storage-blob-upload-event.md?toc=%2Fazure%2Fazure-functions%2Ftoc.json).

See the [Image resize with Event Grid](../event-grid/resize-images-on-storage-blob-upload-event.md) tutorial of an Event Grid example.

#### Storage Extension 5.x and higher

When using the preview storage extension, there is built-in support for Event Grid in the Blob trigger which requires setting the `source` parameter to Event Grid in your existing Blob trigger. 

For more information on how to use the Blob Trigger based on Event Grid, refer to the [Event Grid Blob Trigger guide](./functions-event-grid-blob-trigger.md).

### Queue storage trigger

Another approach to processing blobs is to write queue messages that correspond to blobs being created or modified and then use a [Queue storage trigger](./functions-bindings-storage-queue.md) to begin processing.

## Example

# [C#](#tab/csharp)

The following example shows a [C# function](functions-dotnet-class-library.md) that writes a log when a blob is added or updated in the `samples-workitems` container.

```csharp
[FunctionName("BlobTriggerCSharp")]        
public static void Run([BlobTrigger("samples-workitems/{name}")] Stream myBlob, string name, ILogger log)
{
    log.LogInformation($"C# Blob trigger function Processed blob\n Name:{name} \n Size: {myBlob.Length} Bytes");
}
```

The string `{name}` in the blob trigger path `samples-workitems/{name}` creates a [binding expression](./functions-bindings-expressions-patterns.md) that you can use in function code to access the file name of the triggering blob. For more information, see [Blob name patterns](#blob-name-patterns) later in this article.

For more information about the `BlobTrigger` attribute, see [attributes and annotations](#attributes-and-annotations).

# [C# Script](#tab/csharp-script)

The following example shows a blob trigger binding in a *function.json* file and code that uses the binding. The function writes a log when a blob is added or updated in the `samples-workitems` [container](../storage/blobs/storage-blobs-introduction.md#blob-storage-resources).

Here's the binding data in the *function.json* file:

```json
{
    "disabled": false,
    "bindings": [
        {
            "name": "myBlob",
            "type": "blobTrigger",
            "direction": "in",
            "path": "samples-workitems/{name}",
            "connection":"MyStorageAccountAppSetting"
        }
    ]
}
```

The string `{name}` in the blob trigger path `samples-workitems/{name}` creates a [binding expression](./functions-bindings-expressions-patterns.md) that you can use in function code to access the file name of the triggering blob. For more information, see [Blob name patterns](#blob-name-patterns) later in this article.

For more information about *function.json* file properties, see the [Configuration](#configuration) section explains these properties.

Here's C# script code that binds to a `Stream`:

```cs
public static void Run(Stream myBlob, string name, ILogger log)
{
   log.LogInformation($"C# Blob trigger function Processed blob\n Name:{name} \n Size: {myBlob.Length} Bytes");
}
```

Here's C# script code that binds to a `CloudBlockBlob`:

```cs
#r "Microsoft.WindowsAzure.Storage"

using Microsoft.WindowsAzure.Storage.Blob;

public static void Run(CloudBlockBlob myBlob, string name, ILogger log)
{
    log.LogInformation($"C# Blob trigger function Processed blob\n Name:{name}\nURI:{myBlob.StorageUri}");
}
```

# [Java](#tab/java)

This function writes a log when a blob is added or updated in the `myblob` container.

```java
@FunctionName("blobprocessor")
public void run(
  @BlobTrigger(name = "file",
               dataType = "binary",
               path = "myblob/{name}",
               connection = "MyStorageAccountAppSetting") byte[] content,
  @BindingName("name") String filename,
  final ExecutionContext context
) {
  context.getLogger().info("Name: " + filename + " Size: " + content.length + " bytes");
}
```

# [JavaScript](#tab/javascript)

The following example shows a blob trigger binding in a *function.json* file and [JavaScript code](functions-reference-node.md) that uses the binding. The function writes a log when a blob is added or updated in the `samples-workitems` container.

Here's the *function.json* file:

```json
{
    "disabled": false,
    "bindings": [
        {
            "name": "myBlob",
            "type": "blobTrigger",
            "direction": "in",
            "path": "samples-workitems/{name}",
            "connection":"MyStorageAccountAppSetting"
        }
    ]
}
```

The string `{name}` in the blob trigger path `samples-workitems/{name}` creates a [binding expression](./functions-bindings-expressions-patterns.md) that you can use in function code to access the file name of the triggering blob. For more information, see [Blob name patterns](#blob-name-patterns) later in this article.

For more information about *function.json* file properties, see the [Configuration](#configuration) section explains these properties.

Here's the JavaScript code:

```javascript
module.exports = function(context) {
    context.log('Node.js Blob trigger function processed', context.bindings.myBlob);
    context.done();
};
```

# [PowerShell](#tab/powershell)

The following example demonstrates how to create a function that runs when a file is added to `source` blob storage container.

The function configuration file (_function.json_) includes a binding with the `type` of `blobTrigger` and `direction` set to `in`.

```json
{
  "bindings": [
    {
      "name": "InputBlob",
      "type": "blobTrigger",
      "direction": "in",
      "path": "source/{name}",
      "connection": "MyStorageAccountConnectionString"
    }
  ]
}
```

Here's the associated code for the _run.ps1_ file.

```powershell
param([byte[]] $InputBlob, $TriggerMetadata)

Write-Host "PowerShell Blob trigger: Name: $($TriggerMetadata.Name) Size: $($InputBlob.Length) bytes"
```

# [Python](#tab/python)

The following example shows a blob trigger binding in a *function.json* file and [Python code](functions-reference-python.md) that uses the binding. The function writes a log when a blob is added or updated in the `samples-workitems` [container](../storage/blobs/storage-blobs-introduction.md#blob-storage-resources).

Here's the *function.json* file:

```json
{
    "scriptFile": "__init__.py",
    "disabled": false,
    "bindings": [
        {
            "name": "myblob",
            "type": "blobTrigger",
            "direction": "in",
            "path": "samples-workitems/{name}",
            "connection":"MyStorageAccountAppSetting"
        }
    ]
}
```

The string `{name}` in the blob trigger path `samples-workitems/{name}` creates a [binding expression](./functions-bindings-expressions-patterns.md) that you can use in function code to access the file name of the triggering blob. For more information, see [Blob name patterns](#blob-name-patterns) later in this article.

For more information about *function.json* file properties, see the [Configuration](#configuration) section explains these properties.

Here's the Python code:

```python
import logging
import azure.functions as func


def main(myblob: func.InputStream):
    logging.info('Python Blob trigger function processed %s', myblob.name)
```

---

## Attributes and annotations

# [C#](#tab/csharp)

In [C# class libraries](functions-dotnet-class-library.md), use the following attributes to configure a blob trigger:

* [BlobTriggerAttribute](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs.Extensions.Storage/Blobs/BlobTriggerAttribute.cs)

  The attribute's constructor takes a path string that indicates the container to watch and optionally a [blob name pattern](#blob-name-patterns). Here's an example:

  ```csharp
  [FunctionName("ResizeImage")]
  public static void Run(
      [BlobTrigger("sample-images/{name}")] Stream image,
      [Blob("sample-images-md/{name}", FileAccess.Write)] Stream imageSmall)
  {
      ....
  }
  ```

  You can set the `Connection` property to specify the storage account to use, as shown in the following example:

   ```csharp
  [FunctionName("ResizeImage")]
  public static void Run(
      [BlobTrigger("sample-images/{name}", Connection = "StorageConnectionAppSetting")] Stream image,
      [Blob("sample-images-md/{name}", FileAccess.Write)] Stream imageSmall)
  {
      ....
  }
   ```

  For a complete example, see [Trigger example](#example).

* [StorageAccountAttribute](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/StorageAccountAttribute.cs)

  Provides another way to specify the storage account to use. The constructor takes the name of an app setting that contains a storage connection string. The attribute can be applied at the parameter, method, or class level. The following example shows class level and method level:

  ```csharp
  [StorageAccount("ClassLevelStorageAppSetting")]
  public static class AzureFunctions
  {
      [FunctionName("BlobTrigger")]
      [StorageAccount("FunctionLevelStorageAppSetting")]
      public static void Run( //...
  {
      ....
  }
  ```

The storage account to use is determined in the following order:

* The `BlobTrigger` attribute's `Connection` property.
* The `StorageAccount` attribute applied to the same parameter as the `BlobTrigger` attribute.
* The `StorageAccount` attribute applied to the function.
* The `StorageAccount` attribute applied to the class.
* The default storage account for the function app ("AzureWebJobsStorage" app setting).

# [C# Script](#tab/csharp-script)

Attributes are not supported by C# Script.

# [Java](#tab/java)

The `@BlobTrigger` attribute is used to give you access to the blob that triggered the function. Refer to the [trigger example](#example) for details.

# [JavaScript](#tab/javascript)

Attributes are not supported by JavaScript.

# [PowerShell](#tab/powershell)

Attributes are not supported by PowerShell.

# [Python](#tab/python)

Attributes are not supported by Python.

---

## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `BlobTrigger` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type** | n/a | Must be set to `blobTrigger`. This property is set automatically when you create the trigger in the Azure portal.|
|**direction** | n/a | Must be set to `in`. This property is set automatically when you create the trigger in the Azure portal. Exceptions are noted in the [usage](#usage) section. |
|**name** | n/a | The name of the variable that represents the blob in function code. |
|**path** | **BlobPath** |The [container](../storage/blobs/storage-blobs-introduction.md#blob-storage-resources) to monitor.  May be a [blob name pattern](#blob-name-patterns). |
|**connection** | **Connection** | The name of an app setting that contains the Storage connection string to use for this binding. If the app setting name begins with "AzureWebJobs", you can specify only the remainder of the name here. For example, if you set `connection` to "MyStorage", the Functions runtime looks for an app setting that is named "AzureWebJobsMyStorage." If you leave `connection` empty, the Functions runtime uses the default Storage connection string in the app setting that is named `AzureWebJobsStorage`.<br><br>The connection string must be for a general-purpose storage account, not a [Blob storage account](../storage/common/storage-account-overview.md#types-of-storage-accounts).<br><br>If you are using [version 5.x or higher of the extension](./functions-bindings-storage-blob.md#storage-extension-5x-and-higher), instead of a connection string, you can provide a reference to a configuration section which defines the connection. See [Connections](./functions-reference.md#connections).|

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Usage

# [C#](#tab/csharp)

[!INCLUDE [functions-bindings-blob-storage-trigger](../../includes/functions-bindings-blob-storage-trigger.md)]

# [C# Script](#tab/csharp-script)

[!INCLUDE [functions-bindings-blob-storage-trigger](../../includes/functions-bindings-blob-storage-trigger.md)]

# [Java](#tab/java)

The `@BlobTrigger` attribute is used to give you access to the blob that triggered the function. Refer to the [trigger example](#example) for details.

# [JavaScript](#tab/javascript)

Access blob data using `context.bindings.<NAME>` where `<NAME>` matches the value defined in *function.json*.

# [PowerShell](#tab/powershell)

Access the blob data via a parameter that matches the name designated by binding's name parameter in the _function.json_ file.

# [Python](#tab/python)

Access blob data via the parameter typed as [InputStream](/python/api/azure-functions/azure.functions.inputstream). Refer to the [trigger example](#example) for details.

---

## Blob name patterns

You can specify a blob name pattern in the `path` property in *function.json* or in the `BlobTrigger` attribute constructor. The name pattern can be a [filter or binding expression](./functions-bindings-expressions-patterns.md). The following sections provide examples.

> [!TIP]
> A container name can't contain a resolver in the name pattern.

### Get file name and extension

The following example shows how to bind to the blob file name and extension separately:

```json
"path": "input/{blobname}.{blobextension}",
```

If the blob is named *original-Blob1.txt*, the values of the `blobname` and `blobextension` variables in function code are *original-Blob1* and *txt*.

### Filter on blob name

The following example triggers only on blobs in the `input` container that start with the string "original-":

```json
"path": "input/original-{name}",
```

If the blob name is *original-Blob1.txt*, the value of the `name` variable in function code is `Blob1.txt`.

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

## Metadata

# [C#](#tab/csharp)

[!INCLUDE [functions-bindings-blob-storage-trigger](../../includes/functions-bindings-blob-storage-metadata.md)]

# [C# Script](#tab/csharp-script)

[!INCLUDE [functions-bindings-blob-storage-trigger](../../includes/functions-bindings-blob-storage-metadata.md)]

# [Java](#tab/java)

Metadata is not available in Java.

# [JavaScript](#tab/javascript)

```javascript
module.exports = function (context, myBlob) {
    context.log("Full blob path:", context.bindingData.blobTrigger);
    context.done();
};
```

# [PowerShell](#tab/powershell)

Metadata is available through the `$TriggerMetadata` parameter.

# [Python](#tab/python)

Metadata is not available in Python.

---

## Blob receipts

The Azure Functions runtime ensures that no blob trigger function gets called more than once for the same new or updated blob. To determine if a given blob version has been processed, it maintains *blob receipts*.

Azure Functions stores blob receipts in a container named *azure-webjobs-hosts* in the Azure storage account for your function app (defined by the app setting `AzureWebJobsStorage`). A blob receipt has the following information:

* The triggered function (`<FUNCTION_APP_NAME>.Functions.<FUNCTION_NAME>`, for example: `MyFunctionApp.Functions.CopyBlob`)
* The container name
* The blob type (`BlockBlob` or `PageBlob`)
* The blob name
* The ETag (a blob version identifier, for example: `0x8D1DC6E70A277EF`)

To force reprocessing of a blob, delete the blob receipt for that blob from the *azure-webjobs-hosts* container manually. While reprocessing might not occur immediately, it's guaranteed to occur at a later point in time. To reprocess immediately, the *scaninfo* blob in *azure-webjobs-hosts/blobscaninfo* can be updated. Any blobs with a last modified timestamp after the `LatestScan` property will be scanned again.

## Poison blobs

When a blob trigger function fails for a given blob, Azure Functions retries that function a total of 5 times by default.

If all 5 tries fail, Azure Functions adds a message to a Storage queue named *webjobs-blobtrigger-poison*. The maximum number of retries is configurable. The same MaxDequeueCount setting is used for poison blob handling and poison queue message handling. The queue message for poison blobs is a JSON object that contains the following properties:

* FunctionId (in the format `<FUNCTION_APP_NAME>.Functions.<FUNCTION_NAME>`)
* BlobType (`BlockBlob` or `PageBlob`)
* ContainerName
* BlobName
* ETag (a blob version identifier, for example: `0x8D1DC6E70A277EF`)

## Concurrency and memory usage

The blob trigger uses a queue internally, so the maximum number of concurrent function invocations is controlled by the [queues configuration in host.json](functions-host-json.md#queues). The default settings limit concurrency to 24 invocations. This limit applies separately to each function that uses a blob trigger.

> [!NOTE]
> For apps using the [5.0.0 or higher version of the Storage extension](functions-bindings-storage-blob.md#storage-extension-5x-and-higher), the queues configuration in host.json only applies to queue triggers. The blob trigger concurrency is instead controlled by [blobs configuration in host.json](functions-host-json.md#blobs).

[The Consumption plan](event-driven-scaling.md) limits a function app on one virtual machine (VM) to 1.5 GB of memory. Memory is used by each concurrently executing function instance and by the Functions runtime itself. If a blob-triggered function loads the entire blob into memory, the maximum memory used by that function just for blobs is 24 * maximum blob size. For example, a function app with three blob-triggered functions and the default settings would have a maximum per-VM concurrency of 3*24 = 72 function invocations.

JavaScript and Java functions load the entire blob into memory, and C# functions do that if you bind to `string`, or `Byte[]`.

## host.json properties

The [host.json](functions-host-json.md#blobs) file contains settings that control blob trigger behavior. See the [host.json settings](functions-bindings-storage-blob.md#hostjson-settings) section for details regarding available settings.

## Next steps

- [Read blob storage data when a function runs](./functions-bindings-storage-blob-input.md)
- [Write blob storage data from a function](./functions-bindings-storage-blob-output.md)
