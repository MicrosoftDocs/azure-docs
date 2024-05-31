---
title: Azure Blob storage trigger for Azure Functions
description: Learn how to use Azure Function to run your custom code based on changes in an Azure Blob storage container. 
ms.topic: reference
ms.date: 05/14/2024
ms.devlang: csharp
# ms.devlang: csharp, java, javascript, powershell, python
ms.custom: devx-track-csharp, devx-track-python, devx-track-extended-java, devx-track-js
zone_pivot_groups: programming-languages-set-functions
---

# Azure Blob storage trigger for Azure Functions

The Blob storage trigger starts a function when a new or updated blob is detected. The blob contents are provided as [input to the function](./functions-bindings-storage-blob-input.md).

> [!TIP] 
> There are several ways to execute your function code based on changes to blobs in a storage container. If you choose to use the Blob storage trigger, note that there are two implementations offered: a polling-based one (referenced in this article) and an event-based one. It is recommended that you use the [event-based implementation](./functions-event-grid-blob-trigger.md) as it has lower latency than the other. Also, the Flex Consumption plan supports only the event-based Blob storage trigger. 

> For details about differences between the two implementations of the Blob storage trigger, as well as other triggering options, see [Working with blobs](./storage-considerations.md#working-with-blobs).

For information on setup and configuration details, see the [overview](./functions-bindings-storage-blob.md). 

::: zone pivot="programming-language-javascript,programming-language-typescript"  
[!INCLUDE [functions-nodejs-model-tabs-description](../../includes/functions-nodejs-model-tabs-description.md)]  
::: zone-end  
::: zone pivot="programming-language-python"   
[!INCLUDE [functions-python-model-tabs-description](../../includes/functions-python-model-tabs-description.md)]  
::: zone-end   

## Example

::: zone pivot="programming-language-csharp"

[!INCLUDE [functions-bindings-csharp-intro](../../includes/functions-bindings-csharp-intro.md)]

[!INCLUDE [functions-in-process-model-retirement-note](../../includes/functions-in-process-model-retirement-note.md)]

# [Isolated worker model](#tab/isolated-process)

The following example is a [C# function](dotnet-isolated-process-guide.md) that runs in an isolated worker process and uses a blob trigger with both blob input and blob output blob bindings. The function is triggered by the creation of a blob in the *test-samples-trigger* container. It reads a text file from the *test-samples-input* container and creates a new text file in an output container based on the name of the triggered file.

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/Blob/BlobFunction.cs" range="9-25":::

# [In-process model](#tab/in-process)

The following example shows a [C# function](functions-dotnet-class-library.md) that writes a log when a blob is added or updated in the `samples-workitems` container.

```csharp
[FunctionName("BlobTriggerCSharp")]        
public static void Run([BlobTrigger("samples-workitems/{name}")] Stream myBlob, string name, ILogger log)
{
    log.LogInformation($"C# Blob trigger function Processed blob\n Name:{name} \n Size: {myBlob.Length} Bytes");
}
```

The string `{name}` in the blob trigger path `samples-workitems/{name}` creates a [binding expression](./functions-bindings-expressions-patterns.md) that you can use in function code to access the file name of the triggering blob. For more information, see [Blob name patterns](#blob-name-patterns) later in this article.

For more information about the `BlobTrigger` attribute, see [Attributes](#attributes).

---

::: zone-end
::: zone pivot="programming-language-java"

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

::: zone-end  
::: zone pivot="programming-language-typescript"  

# [Model v4](#tab/nodejs-v4)

The following example shows a blob trigger [TypeScript code](functions-reference-node.md). The function writes a log when a blob is added or updated in the `samples-workitems` container.

The string `{name}` in the blob trigger path `samples-workitems/{name}` creates a [binding expression](./functions-bindings-expressions-patterns.md) that you can use in function code to access the file name of the triggering blob. For more information, see [Blob name patterns](#blob-name-patterns) later in this article.

:::code language="typescript" source="~/azure-functions-nodejs-v4/ts/src/functions/storageBlobTrigger1.ts" :::

# [Model v3](#tab/nodejs-v3)

TypeScript samples are not documented for model v3.

---

::: zone-end  
::: zone pivot="programming-language-javascript"  

# [Model v4](#tab/nodejs-v4)

The following example shows a blob trigger [JavaScript code](functions-reference-node.md). The function writes a log when a blob is added or updated in the `samples-workitems` container.

The string `{name}` in the blob trigger path `samples-workitems/{name}` creates a [binding expression](./functions-bindings-expressions-patterns.md) that you can use in function code to access the file name of the triggering blob. For more information, see [Blob name patterns](#blob-name-patterns) later in this article.

:::code language="javascript" source="~/azure-functions-nodejs-v4/js/src/functions/storageBlobTrigger1.js" :::

# [Model v3](#tab/nodejs-v3)

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
module.exports = async function(context) {
    context.log('Node.js Blob trigger function processed', context.bindings.myBlob);
};
```

---

::: zone-end  
::: zone pivot="programming-language-powershell"  

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

::: zone-end  
::: zone pivot="programming-language-python"  
# [v2](#tab/python-v2)

This example uses SDK types to directly access the underlying [`BlobClient`](/python/api/azure-storage-blob/azure.storage.blob.blobclient) object provided by the Blob storage trigger: 

:::code language="python" source="~/functions-python-extensions/azurefunctions-extensions-bindings-blob/samples/blob_samples_blobclient/function_app.py" range="9-14,31-39"::: 

For examples of using other SDK types, see the [`ContainerClient`](https://github.com/Azure/azure-functions-python-extensions/blob/dev/azurefunctions-extensions-bindings-blob/samples/blob_samples_containerclient/function_app.py) and [`StorageStreamDownloader`](https://github.com/Azure/azure-functions-python-extensions/blob/dev/azurefunctions-extensions-bindings-blob/samples/blob_samples_storagestreamdownloader/function_app.py) samples.

To learn more, including how to enable SDK type bindings in your project, see [SDK type bindings](functions-reference-python.md#sdk-type-bindings-preview).

This example logs information from the incoming blob metadata.

```python
import logging
import azure.functions as func

app = func.FunctionApp()

@app.function_name(name="BlobTrigger1")
@app.blob_trigger(arg_name="myblob", 
                  path="PATH/TO/BLOB",
                  connection="CONNECTION_SETTING")
def test_function(myblob: func.InputStream):
   logging.info(f"Python blob trigger function processed blob \n"
                f"Name: {myblob.name}\n"
                f"Blob Size: {myblob.length} bytes")
```

# [v1](#tab/python-v1)

The function writes a log when a blob is added or updated in the `samples-workitems` [container](../storage/blobs/storage-blobs-introduction.md#blob-storage-resources).
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

::: zone-end  

---

::: zone pivot="programming-language-csharp"
## Attributes

Both [in-process](functions-dotnet-class-library.md) and [isolated worker process](dotnet-isolated-process-guide.md) C# libraries use the [BlobAttribute](/dotnet/api/microsoft.azure.webjobs.blobattribute) attribute to define the function. C# script instead uses a function.json configuration file as described in the [C# scripting guide](./functions-reference-csharp.md#blob-trigger).

The attribute's constructor takes the following parameters:

|Parameter | Description|
|---------|----------------------|
|**BlobPath** | The path to the blob.|
|**Connection** | The name of an app setting or setting collection that specifies how to connect to Azure Blobs. See [Connections](#connections).|
|**Access** | Indicates whether you will be reading or writing.|
|**Source** | Sets the source of the triggering event. Use `BlobTriggerSource.EventGrid` for an [Event Grid-based blob trigger](functions-event-grid-blob-trigger.md), which provides much lower latency. The default is `BlobTriggerSource.LogsAndContainerScan`, which uses the standard polling mechanism to detect changes in the container. |

# [Isolated worker model](#tab/isolated-process)

Here's an `BlobTrigger` attribute in a method signature:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/Blob/BlobFunction.cs" range="11-16":::

# [In-process model](#tab/in-process)

In [C# class libraries](functions-dotnet-class-library.md), the attribute's constructor takes a path string that indicates the container to watch and optionally a [blob name pattern](#blob-name-patterns). Here's an example:

```csharp
[FunctionName("ResizeImage")]
public static void Run(
  [BlobTrigger("sample-images/{name}")] Stream image,
  [Blob("sample-images-md/{name}", FileAccess.Write)] Stream imageSmall)
{
  ....
}
```

[!INCLUDE [functions-bindings-storage-attribute](../../includes/functions-bindings-storage-attribute.md)]

---

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

::: zone-end  
::: zone pivot="programming-language-python"
## Decorators

_Applies only to the Python v2 programming model._

For Python v2 functions defined using decorators, the following properties on the `blob_trigger` decorator define the Blob Storage trigger:

| Property    | Description |
|-------------|-----------------------------|
|`arg_name`       | Declares the parameter name in the function signature. When the function is triggered, this parameter's value has the contents of the queue message. |
|`path`  | The [container](../storage/blobs/storage-blobs-introduction.md#blob-storage-resources) to monitor.  May be a [blob name pattern](#blob-name-patterns). |
|`connection` | The storage account connection string. |
|`source` | Sets the source of the triggering event. Use `EventGrid` for an [Event Grid-based blob trigger](functions-event-grid-blob-trigger.md), which provides much lower latency. The default is `LogsAndContainerScan`, which uses the standard polling mechanism to detect changes in the container. |

For Python functions defined by using *function.json*, see the [Configuration](#configuration) section.
::: zone-end
::: zone pivot="programming-language-java"  
## Annotations

The `@BlobTrigger` attribute is used to give you access to the blob that triggered the function. Refer to the [trigger example](#example) for details. Use the `source` property to set the source of the triggering event. Use `EventGrid` for an [Event Grid-based blob trigger](functions-event-grid-blob-trigger.md), which provides much lower latency. The default is `LogsAndContainerScan`, which uses the standard polling mechanism to detect changes in the container. |
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python"  
## Configuration
::: zone-end

::: zone pivot="programming-language-python" 
_Applies only to the Python v1 programming model._

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"  

# [Model v4](#tab/nodejs-v4)

The following table explains the properties that you can set on the `options` object passed to the `app.storageBlob()` method.

| Property | Description |
|---------|----------------------|
|**path** | The [container](../storage/blobs/storage-blobs-introduction.md#blob-storage-resources) to monitor.  May be a [blob name pattern](#blob-name-patterns). |
|**connection** | The name of an app setting or setting collection that specifies how to connect to Azure Blobs. See [Connections](#connections).|
|**source** | Sets the source of the triggering event. Use `EventGrid` for an [Event Grid-based blob trigger](functions-event-grid-blob-trigger.md), which provides much lower latency. The default is `LogsAndContainerScan`, which uses the standard polling mechanism to detect changes in the container. |

# [Model v3](#tab/nodejs-v3)

The following table explains the binding configuration properties that you set in the *function.json* file.

| Property | Description |
|---------|----------------------|
|**type** | Must be set to `blobTrigger`. This property is set automatically when you create the trigger in the Azure portal.|
|**direction** | Must be set to `in`. This property is set automatically when you create the trigger in the Azure portal. Exceptions are noted in the [usage](#usage) section. |
|**name** |  The name of the variable that represents the blob in function code. |
|**path** | The [container](../storage/blobs/storage-blobs-introduction.md#blob-storage-resources) to monitor.  May be a [blob name pattern](#blob-name-patterns). |
|**connection** | The name of an app setting or setting collection that specifies how to connect to Azure Blobs. See [Connections](#connections).|
|**source** | Sets the source of the triggering event. Use `EventGrid` for an [Event Grid-based blob trigger](functions-event-grid-blob-trigger.md), which provides much lower latency. The default is `LogsAndContainerScan`, which uses the standard polling mechanism to detect changes in the container. |

---

::: zone-end  
::: zone pivot="programming-language-powershell,programming-language-python"  
The following table explains the binding configuration properties that you set in the *function.json* file.

|function.json property |Description|
|---------|----------------------|
|**type** | Must be set to `blobTrigger`. This property is set automatically when you create the trigger in the Azure portal.|
|**direction** | Must be set to `in`. This property is set automatically when you create the trigger in the Azure portal. Exceptions are noted in the [usage](#usage) section. |
|**name** |  The name of the variable that represents the blob in function code. |
|**path** | The [container](../storage/blobs/storage-blobs-introduction.md#blob-storage-resources) to monitor.  May be a [blob name pattern](#blob-name-patterns). |
|**connection** | The name of an app setting or setting collection that specifies how to connect to Azure Blobs. See [Connections](#connections).|
|**source** | Sets the source of the triggering event. Use `EventGrid` for an [Event Grid-based blob trigger](functions-event-grid-blob-trigger.md), which provides much lower latency. The default is `LogsAndContainerScan`, which uses the standard polling mechanism to detect changes in the container. |

::: zone-end  

See the [Example section](#example) for complete examples.

::: zone pivot="programming-language-csharp"
## Metadata

The blob trigger provides several metadata properties. These properties can be used as part of binding expressions in other bindings or as parameters in your code. These values have the same semantics as the [Cloud​Blob](/dotnet/api/microsoft.azure.storage.blob.cloudblob) type.

|Property  |Type  |Description  |
|----------|---------|---------|
|`BlobTrigger`|`string`|The path to the triggering blob.|
|`Uri`|`System.Uri`|The blob's URI for the primary location.|
|`Properties` |[BlobProperties](/dotnet/api/microsoft.azure.storage.blob.blobproperties)|The blob's system properties. |
|`Metadata` |`IDictionary<string,string>`|The user-defined metadata for the blob.|

The following example logs the path to the triggering blob, including the container:

```csharp
public static void Run(string myBlob, string blobTrigger, ILogger log)
{
    log.LogInformation($"Full blob path: {blobTrigger}");
} 
```
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"  
## Metadata

The blob trigger provides several metadata properties. These properties can be used as part of binding expressions in other bindings or as parameters in your code. 

|Property     |Description  |
|-------------|--------|
|`blobTrigger`|The path to the triggering blob.|
|`uri`        |The blob's URI for the primary location.|
|`properties` |The blob's system properties. |
|`metadata`   |The user-defined metadata for the blob.|

# [Model v4](#tab/nodejs-v4)

Metadata can be obtained from the `triggerMetadata` property of the supplied `context` object, as shown in the following example, which logs the path to the triggering blob (`blobTrigger`), including the container:

```javascript
context.log(`Full blob path: ${context.triggerMetadata.blobTrigger}`);
```

# [Model v3](#tab/nodejs-v3)

Metadata can be obtained from the `bindingData` property of the supplied `context` object, as shown in the following example, which logs the path to the triggering blob (`blobTrigger`), including the container:

```javascript
module.exports = async function (context, myBlob) {
    context.log("Full blob path:", context.bindingData.blobTrigger);
};
```

---

::: zone-end  
::: zone pivot="programming-language-powershell"  
## Metadata

Metadata is available through the `$TriggerMetadata` parameter.
::: zone-end  

## Usage

::: zone pivot="programming-language-csharp"  

The binding types supported by Blob trigger depend on the extension package version and the C# modality used in your function app.

# [Isolated worker model](#tab/isolated-process)

[!INCLUDE [functions-bindings-storage-blob-trigger-dotnet-isolated-types](../../includes/functions-bindings-storage-blob-trigger-dotnet-isolated-types.md)]

# [In-process model](#tab/in-process)

See [Binding types](./functions-bindings-storage-blob.md?tabs=in-process#binding-types) for a list of supported types.

---

Binding to `string`, or `Byte[]` is only recommended when the blob size is small. This is recommended because the entire blob contents are loaded into memory. For most blobs, use a `Stream` or `BlobClient` type. For more information, see [Concurrency and memory usage](./functions-bindings-storage-blob-trigger.md#memory-usage-and-concurrency).

If you get an error message when trying to bind to one of the Storage SDK types, make sure that you have a reference to [the correct Storage SDK version](./functions-bindings-storage-blob.md#tabpanel_2_functionsv1_in-process).

[!INCLUDE [functions-bindings-blob-storage-attribute](../../includes/functions-bindings-blob-storage-attribute.md)]
::: zone-end  

::: zone pivot="programming-language-java"
The `@BlobTrigger` attribute is used to give you access to the blob that triggered the function. Refer to the [trigger example](#example) for details.
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"  
# [Model v4](#tab/nodejs-v4)

Access the blob data as the first argument to your function.

# [Model v3](#tab/nodejs-v3)

Access blob data using `context.bindings.<NAME>` where `<NAME>` matches the value defined in *function.json*.

---
::: zone-end  
::: zone pivot="programming-language-powershell"  
Access the blob data via a parameter that matches the name designated by binding's name parameter in the _function.json_ file.
::: zone-end  
::: zone pivot="programming-language-python" 
Access blob data via the parameter typed as [InputStream](/python/api/azure-functions/azure.functions.inputstream). Refer to the [trigger example](#example) for details.
 
Functions also supports Python SDK type bindings for Azure Blob storage, which lets you work with blob data using these underlying SDK types:

+ [`BlobClient`](/python/api/azure-storage-blob/azure.storage.blob.blobclient)
+ [`ContainerClient`](/python/api/azure-storage-blob/azure.storage.blob.containerclient)
+ [`StorageStreamDownloader`](/python/api/azure-storage-blob/azure.storage.blob.storagestreamdownloader)

> [!IMPORTANT]  
> SDK types support for Python is currently in preview and is only supported for the Python v2 programming model. For more information, see [SDK types in Python](./functions-reference-python.md#sdk-type-bindings-preview).

::: zone-end  

[!INCLUDE [functions-storage-blob-connections](../../includes/functions-storage-blob-connections.md)]

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

## Polling and latency

Polling works as a hybrid between inspecting logs and running periodic container scans. Blobs are scanned in groups of 10,000 at a time with a continuation token used between intervals. If your function app is on the Consumption plan, there can be up to a 10-minute delay in processing new blobs if a function app has gone idle. 

> [!WARNING]
> [Storage logs are created on a "best effort"](/rest/api/storageservices/About-Storage-Analytics-Logging) basis. There's no guarantee that all events are captured. Under some conditions, logs may be missed. 

If you require faster or more reliable blob processing, you should consider switching your hosting to use an App Service plan with Always On enabled, which may result in increased costs. You might also consider using a trigger other than the classic polling blob trigger. For more information and a comparison of the various triggering options for blob storage containers, see [Trigger on a blob container](storage-considerations.md#trigger-on-a-blob-container).  

## Blob receipts

The Azure Functions runtime ensures that no blob trigger function gets called more than once for the same new or updated blob. To determine if a given blob version has been processed, it maintains *blob receipts*.

Azure Functions stores blob receipts in a container named *azure-webjobs-hosts* in the Azure storage account for your function app (defined by the app setting `AzureWebJobsStorage`). A blob receipt has the following information:

- The triggered function (`<FUNCTION_APP_NAME>.Functions.<FUNCTION_NAME>`, for example: `MyFunctionApp.Functions.CopyBlob`)
- The container name
- The blob type (`BlockBlob` or `PageBlob`)
- The blob name
- The ETag (a blob version identifier, for example: `0x8D1DC6E70A277EF`)

To force reprocessing of a blob, delete the blob receipt for that blob from the *azure-webjobs-hosts* container manually. While reprocessing might not occur immediately, it's guaranteed to occur at a later point in time. To reprocess immediately, the *scaninfo* blob in *azure-webjobs-hosts/blobscaninfo* can be updated. Any blobs with a last modified timestamp after the `LatestScan` property will be scanned again.

## Poison blobs

When a blob trigger function fails for a given blob, Azure Functions retries that function a total of five times by default.

If all 5 tries fail, Azure Functions adds a message to a Storage queue named *webjobs-blobtrigger-poison*. The maximum number of retries is configurable. The same MaxDequeueCount setting is used for poison blob handling and poison queue message handling. The queue message for poison blobs is a JSON object that contains the following properties:

- FunctionId (in the format `<FUNCTION_APP_NAME>.Functions.<FUNCTION_NAME>`)
- BlobType (`BlockBlob` or `PageBlob`)
- ContainerName
- BlobName
- ETag (a blob version identifier, for example: `0x8D1DC6E70A277EF`)

## Memory usage and concurrency 

::: zone pivot="programming-language-csharp" 
When you bind to an [output type](#usage) that doesn't support steaming, such as `string`, or `Byte[]`, the runtime must load the entire blob into memory more than one time during processing. This can result in higher-than expected memory usage when processing blobs. When possible, use a stream-supporting type. Type support depends on the C# mode and extension version. For more information, see [Binding types](./functions-bindings-storage-blob.md#binding-types).
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-python,programming-language-powershell,programming-language-java" 
At this time, the runtime must load the entire blob into memory more than one time during processing. This can result in higher-than expected memory usage when processing blobs. 
::: zone-end  
Memory usage can be further impacted when multiple function instances are concurrently processing blob data. If you are having memory issues using a Blob trigger, consider reducing the number of concurrent executions permitted. Of course, reducing the concurrency can have the side effect of increasing the backlog of blobs waiting to be processed. The memory limits of your function app depends on the plan. For more information, see [Service limits](functions-scale.md#service-limits).  
 
The way that you can control the number of concurrent executions depends on the version of the Storage extension you are using.

### [Extension 5.x and higher](#tab/extensionv5)

When using version 5.0.0 of the Storage extension or a later version, you control trigger concurrency by using the `maxDegreeOfParallelism` setting in the [blobs configuration in host.json](functions-bindings-storage-blob.md#hostjson-settings). 

### [Pre-extension 5.x](#tab/extensionv4)

Because the blob trigger uses a queue internally, the maximum number of concurrent function invocations is controlled by the [queues configuration in host.json](functions-bindings-storage-queue.md#host-json). 

---

Limits apply separately to each function that uses a blob trigger.

## host.json properties

The [host.json](functions-host-json.md#blobs) file contains settings that control blob trigger behavior. See the [host.json settings](functions-bindings-storage-blob.md#hostjson-settings) section for details regarding available settings.

## Next steps

- [Read blob storage data when a function runs](./functions-bindings-storage-blob-input.md)
- [Write blob storage data from a function](./functions-bindings-storage-blob-output.md)
