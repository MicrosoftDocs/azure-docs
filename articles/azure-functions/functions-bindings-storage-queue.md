---
title: Azure Queue storage trigger and bindings for Azure Functions overview
description: Understand how to use the Azure Queue storage trigger and output binding in Azure Functions.
ms.topic: reference
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 11/11/2022
zone_pivot_groups: programming-languages-set-functions
---

# Azure Queue storage trigger and bindings for Azure Functions overview

Azure Functions can run as new Azure Queue storage messages are created and can write queue messages within a function.

| Action | Type |
|---------|---------|
| Run a function as queue storage data changes | [Trigger](./functions-bindings-storage-queue-trigger.md) |
| Write queue storage messages |[Output binding](./functions-bindings-storage-queue-output.md) |

::: zone pivot="programming-language-csharp"

## Install extension

The extension NuGet package you install depends on the C# mode you're using in your function app: 

# [Isolated worker model](#tab/isolated-process)

Functions execute in an isolated C# worker process. To learn more, see [Guide for running C# Azure Functions in an isolated worker process](dotnet-isolated-process-guide.md).

# [In-process model](#tab/in-process)

Functions execute in the same process as the Functions host. To learn more, see [Develop C# class library functions using Azure Functions](functions-dotnet-class-library.md).

In a variation of this model, Functions can be run using [C# scripting], which is supported primarily for C# portal editing. To update existing binding extensions for C# script apps running in the portal without having to republish your function app, see [Update your extensions].

---

The functionality of the extension varies depending on the extension version:

# [Extension 5.x+](#tab/extensionv5/in-process)

<a name="storage-extension-5x-and-higher"></a>

_This section describes using a [class library](./functions-dotnet-class-library.md). For [C# scripting], you would need to instead [install the extension bundle][Update your extensions], version 4.x._

[!INCLUDE [functions-bindings-supports-identity-connections-note](../../includes/functions-bindings-supports-identity-connections-note.md)]

This version allows you to bind to types from [Azure.Storage.Queues].

This extension is available by installing the [Microsoft.Azure.WebJobs.Extensions.Storage.Queues NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Storage.Queues), version 5.x.

Using the .NET CLI:

```dotnetcli
dotnet add package Microsoft.Azure.WebJobs.Extensions.Storage.Queues --version 5.0.0
``` 

[!INCLUDE [functions-bindings-storage-extension-v5-tables-note](../../includes/functions-bindings-storage-extension-v5-tables-note.md)]

# [Functions 2.x+](#tab/functionsv2/in-process)

<a name="functions-2x-and-higher"></a>

_This section describes using a [class library](./functions-dotnet-class-library.md). For [C# scripting], you would need to instead [install the extension bundle][Update your extensions], version 2.x._

Working with the trigger and bindings requires that you reference the appropriate NuGet package. Install the [NuGet package], version 3.x or 4.x.

# [Functions 1.x](#tab/functionsv1/in-process)

[!INCLUDE [functions-runtime-1x-retirement-note](../../includes/functions-runtime-1x-retirement-note.md)]

Functions 1.x apps automatically have a reference the [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) NuGet package, version 2.x.

[!INCLUDE [functions-storage-sdk-version](../../includes/functions-storage-sdk-version.md)]

# [Extension 5.x+](#tab/extensionv5/isolated-process)

[!INCLUDE [functions-bindings-supports-identity-connections-note](../../includes/functions-bindings-supports-identity-connections-note.md)]

This version allows you to bind to types from [Azure.Storage.Queues](/dotnet/api/azure.storage.queues).

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Storage.Queues), version 5.x.


Using the .NET CLI:

```dotnetcli
dotnet add package Microsoft.Azure.Functions.Worker.Extensions.Storage.Queues --version 5.0.0
``` 

[!INCLUDE [functions-bindings-storage-extension-v5-isolated-worker-tables-note](../../includes/functions-bindings-storage-extension-v5-isolated-worker-tables-note.md)]

# [Functions 2.x+](#tab/functionsv2/isolated-process)

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Storage/), version 4.x.

# [Functions 1.x](#tab/functionsv1/isolated-process)

Functions version 1.x doesn't support the isolated worker process.

---

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-python,programming-language-java,programming-language-powershell"  

## Install bundle

The Blob storage binding is part of an [extension bundle], which is specified in your host.json project file. You may need to modify this bundle to change the version of the binding, or if bundles aren't already installed. To learn more, see [extension bundle].

# [Bundle v3.x](#tab/extensionv3)

[!INCLUDE [functions-bindings-supports-identity-connections-note](../../includes/functions-bindings-supports-identity-connections-note.md)]

You can add this version of the extension from the preview extension bundle v3 by adding or replacing the following code in your `host.json` file:

[!INCLUDE [functions-extension-bundles-json-v3](../../includes/functions-extension-bundles-json-v3.md)]

To learn more, see [Update your extensions].

# [Bundle v2.x](#tab/extensionv2)

You can install this version of the extension in your function app by registering the [extension bundle], version 2.x.

# [Functions 1.x](#tab/functions1)

Functions 1.x apps automatically have a reference to the extension.

---

::: zone-end

::: zone pivot="programming-language-csharp"

## Binding types

The binding types supported for .NET depend on both the extension version and C# execution mode, which can be one of the following: 
   
# [Isolated worker model](#tab/isolated-process)

An isolated worker process class library compiled C# function runs in a process isolated from the runtime.  
   
# [In-process model](#tab/in-process)

An in-process class library is a compiled C# function runs in the same process as the Functions runtime.
 
---

Choose a version to see binding type details for the mode and version.

# [Extension 5.x+](#tab/extensionv5/in-process)

The Azure Queues extension supports parameter types according to the table below.

 Binding scenario | Parameter types |
|-|-|
| Queue trigger | [QueueMessage]<br/>JSON serializable types<sup>1</sup><br/>`string`<br/>`byte[]`<br/>[BinaryData] |
| Queue output (single message)  | [QueueMessage]<br/>JSON serializable types<sup>1</sup><br/>`string`<br/>`byte[]`<br/>[BinaryData] |
| Queue output (multiple messages)  | [QueueClient]<br/>`ICollector<T>` or `IAsyncCollector<T>` where `T` is one of the single message types |

<sup>1</sup> Messages containing JSON data can be deserialized into known plain-old CLR object (POCO) types.

# [Functions 2.x+](#tab/functionsv2/in-process)

Earlier versions of the extension exposed types from the now deprecated [Microsoft.Azure.Storage.Queues] namespace. Newer types from [Azure.Storage.Queues] are exclusive to **Extension 5.x+**.

This version of the extension supports parameter types according to the table below.

 Binding scenario | Parameter types |
|-|-|
| Queue trigger | [CloudQueueMessage]<br/>JSON serializable types<sup>1</sup><br/>`string`<br/>`byte[]` |
| Queue output  | [CloudQueueMessage]<br/>JSON serializable types<sup>1</sup><br/>`string`<br/>`byte[]`<br/>[CloudQueue] |

<sup>1</sup> Messages containing JSON data can be deserialized into known plain-old CLR object (POCO) types.

# [Functions 1.x](#tab/functionsv1/in-process)

Functions 1.x exposed types from the deprecated [Microsoft.WindowsAzure.Storage] namespace. Newer types from [Azure.Storage.Queues] are exclusive to the **Extension 5.x+**. To use these, you will need to [upgrade your application to Functions 4.x].

# [Extension 5.x+](#tab/extensionv5/isolated-process)

The isolated worker process supports parameter types according to the tables below. Support for binding to types from [Azure.Storage.Queues] is in preview.

**Queue trigger**

[!INCLUDE [functions-bindings-storage-queue-trigger-dotnet-isolated-types](../../includes/functions-bindings-storage-queue-trigger-dotnet-isolated-types.md)]

**Queue output binding**

[!INCLUDE [functions-bindings-storage-queue-output-dotnet-isolated-types](../../includes/functions-bindings-storage-queue-output-dotnet-isolated-types.md)]

# [Functions 2.x+](#tab/functionsv2/isolated-process)

Earlier versions of extensions in the isolated worker process only support binding to string types. Additional options are available to the **Extension 5.x**.

# [Functions 1.x](#tab/functionsv1/isolated-process)

Functions version 1.x doesn't support the isolated worker process. To use the isolated worker model, [upgrade your application to Functions 4.x].

---

[QueueMessage]: /dotnet/api/azure.storage.queues.models.queuemessage
[QueueClient]: /dotnet/api/azure.storage.queues.queueclient
[BinaryData]: /dotnet/api/system.binarydata

[CloudQueueMessage]: /dotnet/api/microsoft.azure.storage.queue.cloudqueuemessage
[CloudQueue]: /dotnet/api/microsoft.azure.storage.queue.cloudqueue

[upgrade your application to Functions 4.x]: ./migrate-version-1-version-4.md

:::zone-end

## <a name="host-json"></a>host.json settings

[!INCLUDE [functions-host-json-section-intro](../../includes/functions-host-json-section-intro.md)]

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
            "newBatchThreshold": 8,
            "messageEncoding": "base64"
        }
    }
}
```

|Property  |Default | Description |
|---------|---------|---------|
|maxPollingInterval|00:01:00|The maximum interval between queue polls. The minimum interval is 00:00:00.100 (100 ms). Intervals increment up to `maxPollingInterval`. The default value of `maxPollingInterval` is 00:01:00 (1 min). `maxPollingInterval` must not be less than 00:00:00.100 (100 ms). In Functions 2.x and later, the data type is a `TimeSpan`. In Functions 1.x, it is in milliseconds.|
|visibilityTimeout|00:00:00|The time interval between retries when processing of a message fails. |
|batchSize|16|The number of queue messages that the Functions runtime retrieves simultaneously and processes in parallel. When the number being processed gets down to the `newBatchThreshold`, the runtime gets another batch and starts processing those messages. So the maximum number of concurrent messages being processed per function is `batchSize` plus `newBatchThreshold`. This limit applies separately to each queue-triggered function. <br><br>If you want to avoid parallel execution for messages received on one queue, you can set `batchSize` to 1. However, this setting eliminates concurrency as long as your function app runs only on a single virtual machine (VM). If the function app scales out to multiple VMs, each VM could run one instance of each queue-triggered function.<br><br>The maximum `batchSize` is 32. |
|maxDequeueCount|5|The number of times to try processing a message before moving it to the poison queue.|
|newBatchThreshold|N*batchSize/2|Whenever the number of messages being processed concurrently gets down to this number, the runtime retrieves another batch.<br><br>`N` represents the number of vCPUs available when running on App Service or Premium Plans. Its value is `1` for the Consumption Plan.|
|messageEncoding|base64| This setting is only available in [extension bundle version 5.0.0 and higher](#storage-extension-5x-and-higher). It represents the encoding format for messages. Valid values are `base64` and `none`.|

## Next steps

- [Run a function as queue storage data changes (Trigger)](./functions-bindings-storage-queue-trigger.md)
- [Write queue storage messages (Output binding)](./functions-bindings-storage-queue-output.md)
 
[extension bundle]: ./functions-bindings-register.md#extension-bundles
[NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Storage
[Update your extensions]: ./functions-bindings-register.md

[Azure.Storage.Queues]: /dotnet/api/azure.storage.queues
[Microsoft.Azure.Storage.Queues]: /dotnet/api/microsoft.azure.storage.queue
[Microsoft.WindowsAzure.Storage]: /dotnet/api/microsoft.windowsazure.storage

[C# scripting]: ./functions-reference-csharp.md
