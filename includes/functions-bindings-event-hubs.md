---
author: craigshoemaker
ms.service: azure-functions
ms.topic: include
ms.date: 02/21/2020
ms.author: cshoe
---

::: zone pivot="programming-language-csharp"
## Install extension

The extension NuGet package you install depends on the C# mode you're using in your function app: 

# [Isolated worker model](#tab/isolated-process)

Functions execute in an isolated C# worker process. To learn more, see [Guide for running C# Azure Functions in an isolated worker process](../articles/azure-functions/dotnet-isolated-process-guide.md).

# [In-process model](#tab/in-process)

Functions execute in the same process as the Functions host. To learn more, see [Develop C# class library functions using Azure Functions](../articles/azure-functions/functions-dotnet-class-library.md).

In a variation of this model, Functions can be run using [C# scripting], which is supported primarily for C# portal editing. To update existing binding extensions for C# script apps running in the portal without having to republish your function app, see [Update your extensions].

---

The functionality of the extension varies depending on the extension version:

# [Extension v5.x+](#tab/extensionv5/in-process)

_This section describes using a [class library](../articles/azure-functions/functions-dotnet-class-library.md). For [C# scripting], you would need to instead [install the extension bundle][Update your extensions], version 4.x._

[!INCLUDE [functions-bindings-supports-identity-connections-note](functions-bindings-supports-identity-connections-note.md)]

This version uses the newer Event Hubs binding type [Azure.Messaging.EventHubs.EventData](/dotnet/api/azure.messaging.eventhubs.eventdata).

This extension version is available by installing the [NuGet package], version 5.x.

# [Extension v3.x+](#tab/extensionv3/in-process)

_This section describes using a [class library](../articles/azure-functions/functions-dotnet-class-library.md). For [C# scripting], you would need to instead [install the extension bundle][Update your extensions], version 2.x._

Supports the original Event Hubs binding parameter type of [Microsoft.Azure.EventHubs.EventData](/dotnet/api/microsoft.azure.eventhubs.eventdata).

Add the extension to your project by installing the [NuGet package], version 3.x or 4.x.

# [Functions v1.x](#tab/functionsv1/in-process)

[!INCLUDE [functions-runtime-1x-retirement-note](./functions-runtime-1x-retirement-note.md)]

Version 1.x of the Functions runtime doesn't require an extension. 

# [Extension v5.x+](#tab/extensionv5/isolated-process)

[!INCLUDE [functions-bindings-supports-identity-connections-note](functions-bindings-supports-identity-connections-note.md)]

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.EventHubs), version 5.x.

# [Extension v3.x+](#tab/extensionv3/isolated-process)

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.EventHubs), version 4.x.

# [Functions v1.x](#tab/functionsv1/isolated-process)

Version 1.x of the Functions runtime doesn't support running in an isolated worker process. 

---

::: zone-end  

::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-python,programming-language-java,programming-language-powershell"  

## Install bundle

The Event Hubs extension is part of an [extension bundle], which is specified in your host.json project file. You may need to modify this bundle to change the version of the binding, or if bundles aren't already installed. To learn more, see [extension bundle].

# [Bundle v3.x](#tab/extensionv5)

[!INCLUDE [functions-bindings-supports-identity-connections-note](functions-bindings-supports-identity-connections-note.md)]

You can add this version of the extension from the extension bundle v3 by adding or replacing the following code in your `host.json` file:

[!INCLUDE [functions-extension-bundles-json-v3](./functions-extension-bundles-json-v3.md)]

To learn more, see [Update your extensions].

# [Bundle v2.x](#tab/extensionv3)

You can install this version of the extension in your function app by registering the [extension bundle], version 2.x.

# [Functions v1.x](#tab/functionsv1)

Version 1.x of the Functions runtime doesn't require extension bundles. 

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

# [Extension v5.x+](#tab/extensionv5/in-process)

The Event Hubs extension supports parameter types according to the table below.

 Binding scenario | Parameter types |
|-|-|
| Event Hubs trigger (single event) | [Azure.Messaging.EventHubs.EventData]<br/>JSON serializable types<sup>1</sup><br/>`string`<br/>`byte[]`<br/>[BinaryData] |
| Event Hubs trigger (batch of events) | `EventData[]`<br/>`string[]` |
| Event Hubs output (single event) | [Azure.Messaging.EventHubs.EventData]<br/>JSON serializable types<sup>1</sup><br/>`string`<br/>`byte[]`<br/>[BinaryData]|
| Event Hubs output (multiple events) | `ICollector<T>` or `IAsyncCollector<T>` where `T` is one of the single event types |

<sup>1</sup> Events containing JSON data can be deserialized into known plain-old CLR object (POCO) types.

# [Extension v3.x+](#tab/extensionv3/in-process)

Earlier versions of the extension exposed types from the now deprecated [Microsoft.Azure.EventHubs] namespace. Newer types from [Azure.Messaging.EventHubs] are exclusive to **Extension v5.x+**.

This version of the extension supports parameter types according to the table below.

 Binding scenario | Parameter types |
|-|-|
| Event Hubs trigger (single message) | [Microsoft.Azure.EventHubs.EventData]<br/>JSON serializable types<sup>1</sup><br/>`string`<br/>`byte[]` |
| Event Hubs trigger (batch) | `EventData[]`<br/>`string[]` |
| Event Hubs output  | [Microsoft.Azure.EventHubs.EventData]<br/>JSON serializable types<sup>1</sup><br/>`string`<br/>`byte[]` |

<sup>1</sup> Events containing JSON data can be deserialized into known plain-old CLR object (POCO) types.

# [Functions v1.x](#tab/functionsv1/in-process)

Earlier versions of the extension exposed types from the now deprecated [Microsoft.Azure.EventHubs] namespace. Newer types from [Azure.Messaging.EventHubs] are exclusive to **Extension v5.x+**.

This version of the extension supports parameter types according to the table below.

 Binding scenario | Parameter types |
|-|-|
| Event Hubs trigger (single event) | [Microsoft.Azure.EventHubs.EventData]<br/>JSON serializable types<sup>1</sup><br/>`string`<br/>`byte[]` |
| Event Hubs trigger (batch of events) | `EventData[]`<br/>`string[]` |
| Event Hubs output  | [Microsoft.Azure.EventHubs.EventData]<br/>JSON serializable types<sup>1</sup><br/>`string`<br/>`byte[]` |

<sup>1</sup> Events containing JSON data can be deserialized into known plain-old CLR object (POCO) types.

# [Extension v5.x+](#tab/extensionv5/isolated-process)

The isolated worker process supports parameter types according to the tables below. Support for binding to types from [Azure.Messaging.EventHubs] is in preview.

**Event Hubs trigger**

[!INCLUDE [functions-bindings-event-hubs-trigger-dotnet-isolated-types](./functions-bindings-event-hubs-trigger-dotnet-isolated-types.md)]

**Event Hubs output binding**

[!INCLUDE [functions-bindings-event-hubs-output-dotnet-isolated-types](./functions-bindings-event-hubs-output-dotnet-isolated-types.md)]

# [Extension v3.x+](#tab/extensionv3/isolated-process)

Earlier versions of the extension in the isolated worker process only support binding to strings and JSON serializable types. Additional options are available to  **Extension v5.x+**.

# [Functions v1.x](#tab/functionsv1/isolated-process)

Functions version 1.x doesn't support the isolated worker process. To use the isolated worker model, [upgrade your application to Functions 4.x].

---

[Azure.Messaging.EventHubs.EventData]: /dotnet/api/azure.messaging.eventhubs.eventdata
[Microsoft.Azure.EventHubs.EventData]: /dotnet/api/microsoft.azure.eventhubs.eventdata

[upgrade your application to Functions 4.x]: ../articles/azure-functions/migrate-version-1-version-4.md

::: zone-end

## host.json settings
<a name="host-json"></a>

The [host.json](../articles/azure-functions/functions-host-json.md#eventhub) file contains settings that control behavior for the Event Hubs trigger. The configuration is different depending on the extension version.

# [Extension v5.x+](#tab/extensionv5)

```json
{
    "version": "2.0",
    "extensions": {
        "eventHubs": {
            "maxEventBatchSize" : 100,
            "minEventBatchSize" : 25,
            "maxWaitTime" : "00:05:00",            
            "batchCheckpointFrequency" : 1,
            "prefetchCount" : 300,
            "transportType" : "amqpWebSockets",
            "webProxy" : "https://proxyserver:8080",
            "customEndpointAddress" : "amqps://company.gateway.local",
            "targetUnprocessedEventThreshold" : 75,
            "initialOffsetOptions" : {
                "type" : "fromStart",
                "enqueuedTimeUtc" : ""
            },
            "clientRetryOptions":{
                "mode" : "exponential",
                "tryTimeout" : "00:01:00",
                "delay" : "00:00:00.80",
                "maximumDelay" : "00:01:00",
                "maximumRetries" : 3
            }
        }
    }
}  
```

|Property  |Default | Description |
|---------|---------|---------|
| maxEventBatchSize<sup>2</sup>| 100 | The maximum number of events included in a batch for a single invocation. Must be at least 1.|
| minEventBatchSize<sup>1</sup>|  1| The minimum number of events desired in a batch.  The minimum applies only when the function is receiving multiple events and must be less than `maxEventBatchSize`.<br/>The minimum size isn't strictly guaranteed.  A partial batch is dispatched when a full batch can't be prepared before the `maxWaitTime` has elapsed.  Partial batches are also likely for the first invocation of the function after scaling takes place.|
| maxWaitTime<sup>1</sup>| 00:01:00| The maximum interval that the trigger should wait to fill a batch before invoking the function. The wait time is only considered when `minEventBatchSize` is larger than 1 and is otherwise ignored. If less than `minEventBatchSize` events were available before the wait time elapses, the function is invoked with a partial batch. The longest allowed wait time is 10 minutes.<br/><br/>**NOTE:** This interval is not a strict guarantee for the exact timing on which the function is invoked. There is a small magin of error due to timer precision.  When scaling takes place, the first invocation with a partial batch may occur more quickly or may take up to twice the configured wait time.|
| batchCheckpointFrequency| 1| The number of batches to process before creating  a checkpoint for the event hub.|
| prefetchCount| 300| The number of events that is eagerly requested from Event Hubs and held in a local cache to allow reads to avoid waiting on a network operation|
| transportType| amqpTcp | The protocol and transport that is used for communicating with Event Hubs. Available options: `amqpTcp`, `amqpWebSockets`|
| webProxy| null | The proxy to use for communicating with Event Hubs over web sockets. A proxy cannot be used with the `amqpTcp` transport. |
| customEndpointAddress | null | The address to use when establishing a connection to Event Hubs, allowing network requests to be routed through an application gateway or other path needed for the host environment. The fully qualified namespace for the event hub is still needed when a custom endpoint address is used and must be specified explicitly or via the connection string.|
| targetUnprocessedEventThreshold<sup>1</sup> | null | The desired number of unprocessed events per function instance.  The threshold is used in target-based scaling to override the default scaling threshold inferred from the `maxEventBatchSize` option. When set, the total unprocessed event count is divided by this value to determine the number of function instances needed.  The instance count will be rounded up to a number that creates a balanced partition distribution.|
| initialOffsetOptions/type | fromStart| The location in the event stream to start processing when a checkpoint does not exist in storage. Applies to all partitions. For more information, see the  [OffsetType documentation](/dotnet/api/microsoft.azure.webjobs.eventhubs.offsettype). Available options: `fromStart`, `fromEnd`, `fromEnqueuedTime`|
| initialOffsetOptions/enqueuedTimeUtc | null | Specifies the enqueued time of the event in the stream from which to start processing. When `initialOffsetOptions/type` is configured as `fromEnqueuedTime`, this setting is mandatory. Supports time in any format supported by [DateTime.Parse()](/dotnet/standard/base-types/parsing-datetime), such as  `2020-10-26T20:31Z`. For clarity, you should also specify a timezone. When timezone isn't specified, Functions assumes the local timezone of the machine running the function app, which is UTC when running on Azure. |
| clientRetryOptions/mode | exponential | The approach to use for calculating retry delays. Exponential mode retries attempts with a delay based on a back-off strategy where each attempt will increase the duration that it waits before retrying. The fixed mode retries attempts at fixed intervals with each delay having a consistent duration. Available options: `exponential`, `fixed`|
| clientRetryOptions/tryTimeout | 00:01:00 | The maximum duration to wait for an Event Hubs operation to complete, per attempt.|
| clientRetryOptions/delay | 00:00:00.80 | The delay or back-off factor to apply between retry attempts.|
| clientRetryOptions/maximumDelay | 00:00:01 | The maximum delay to allow between retry attempts. |
| clientRetryOptions/maximumRetries | 3 | The maximum number of retry attempts before considering the associated operation to have failed.|

<sup>1</sup> Using `minEventBatchSize` and `maxWaitTime` requires [v5.3.0](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.EventHubs/5.3.0) of the `Microsoft.Azure.WebJobs.Extensions.EventHubs` package, or a later version.

<sup>2</sup> The default `maxEventBatchSize` changed in [v6.0.0](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.EventHubs/6.0.0) of the `Microsoft.Azure.WebJobs.Extensions.EventHubs` package.  In earlier versions, this was 10.

The `clientRetryOptions` are used to retry operations between the Functions host and Event Hubs (such as fetching events and sending events).  Refer to guidance on [Azure Functions error handling and retries](../articles/azure-functions/functions-bindings-error-pages.md#retries) for information on applying retry policies to individual functions.

For a reference of host.json in Azure Functions 2.x and beyond, see [host.json reference for Azure Functions](../articles/azure-functions/functions-host-json.md).

# [Extension v3.x+](#tab/extensionv3)

```json
{
    "version": "2.0",
    "extensions": {
        "eventHubs": {
            "batchCheckpointFrequency": 1,
            "eventProcessorOptions": {
                "maxBatchSize": 256,
                "prefetchCount": 512
            },
            "initialOffsetOptions": {
                "type": "fromStart",
                "enqueuedTimeUtc": ""
            }
        }
    }
}  
```

|Property  |Default | Description |
|---------|---------|---------|
|batchCheckpointFrequency|1|The number of event batches to process before creating an EventHub cursor checkpoint.|
|eventProcessorOptions/maxBatchSize|10|The maximum event count received per receive loop.|
|eventProcessorOptions/prefetchCount|300|The default prefetch count used by the underlying `EventProcessorHost`. The minimum allowed value is 10.|
|initialOffsetOptions/type<sup>1</sup>|fromStart|The location in the event stream from which to start processing when a checkpoint doesn't exist in storage. Options are `fromStart` , `fromEnd` or `fromEnqueuedTime`. `fromEnd` processes new events that were enqueued after the function app started running. Applies to all partitions. For more information, see the [EventProcessorOptions documentation](/dotnet/api/microsoft.azure.eventhubs.processor.eventprocessoroptions.initialoffsetprovider).|
|initialOffsetOptions/enqueuedTimeUtc<sup>1</sup>| null | Specifies the enqueued time of the event in the stream from which to start processing. When `initialOffsetOptions/type` is configured as `fromEnqueuedTime`, this setting is mandatory. Supports time in any format supported by [DateTime.Parse()](/dotnet/standard/base-types/parsing-datetime), such as  `2020-10-26T20:31Z`. For clarity, you should also specify a timezone. When timezone isn't specified, Functions assumes the local timezone of the machine running the function app, which is UTC when running on Azure. For more information, see the [EventProcessorOptions documentation](/dotnet/api/microsoft.azure.eventhubs.processor.eventprocessoroptions.initialoffsetprovider).|

<sup>1</sup> Support for `initialOffsetOptions` begins with [EventHubs v4.2.0](https://github.com/Azure/azure-functions-eventhubs-extension/releases/tag/v4.2.0).

For a reference of host.json in Azure Functions 2.x and beyond, see [host.json reference for Azure Functions](../articles/azure-functions/functions-host-json.md).

# [Functions v1.x](#tab/functionsv1)

```json
{
    "eventHub": {
      "maxBatchSize": 64,
      "prefetchCount": 256,
      "batchCheckpointFrequency": 1
    }
}
```

|Property  |Default | Description |
|---------|---------|---------| 
|maxBatchSize|64|The maximum event count received per receive loop.|
|prefetchCount| 300 |The default prefetch that will be used by the underlying `EventProcessorHost`.| 
|batchCheckpointFrequency|1|The number of event batches to process before creating an EventHub cursor checkpoint.| 

For a reference of host.json in Azure Functions 1.x, see [host.json reference for Azure Functions 1.x](../articles/azure-functions/functions-host-json-v1.md).

---


[NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.EventHubs
[extension bundle]: ../articles/azure-functions/functions-bindings-register.md#extension-bundles
[Update your extensions]: ../articles/azure-functions/functions-bindings-register.md

[Microsoft.Azure.EventHubs]: /dotnet/api/microsoft.azure.eventhubs
[Azure.Messaging.EventHubs]: /dotnet/api/azure.messaging.eventhubs

[C# scripting]: ../articles/azure-functions/functions-reference-csharp.md
