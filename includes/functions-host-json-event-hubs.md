---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 02/07/2022
ms.author: glenga
---

### Functions 2.x and higher with extensions v5.x and higher

```json
{
    "version": "2.0",
    "extensions": {
        "eventHubs": {
            "maxEventBatchSize" : 10,
            "batchCheckpointFrequency" : 5,
            "prefetchCount" : 300,
            "transportType" : "amqpWebSockets",
            "webProxy" : "https://proxyserver:8080",
            "customEndpointAddress" : "amqps://company.gateway.local",
            "initialOffsetOptions" : {
                "type" : "fromStart",
                "enqueuedTimeUtc" : ""
            },
            "clientRetryOptions":{
                "mode" : "exponential",
                "tryTimeout" : "00:01:00",
                "delay" : "00:00:00.80",
                "maxDelay" : "00:01:00",
                "maxRetries" : 3
            }
        }
    }
}  
```

|Property  |Default | Description |
|---------|---------|---------|
| maxEventBatchSize| 10| The maximum number of events that will be included in a batch for a single invocation. Must be at least 1.|
| batchCheckpointFrequency| 1| The number of batches to process before creating  a checkpoint for the Event Hub.|
| prefetchCount| 300| The number of events that will be eagerly requested from Event Hubs and held in  a local cache to allow reads to avoid waiting on a network operation|
| transportType| amqpTcp | The protocol and transport that is used for communicating with Event Hubs. Available options: `amqpTcp`, `amqpWebSockets`|
| webProxy| | The proxy to use for communicating with Event Hubs over web sockets. A proxy cannot be used with the `amqpTcp` transport. |
| customEndpointAddress | | The address to use when establishing a connection to Event Hubs, allowing network requests to be routed through an application gateway or other path needed for the host environment. The fully qualified namespace for the Event Hub is still needed when a custom endpoint address is used and must be specified explicitly or via the connection string.|
| initialOffsetOptions/type | fromStart| The location in the event stream to start processing when a checkpoint does not exist in storage. Applies to all partitions. For more information, see the  [OffsetType documentation](/dotnet/api/microsoft.azure.webjobs.eventhubs.offsettype). Available options: `fromStart`, `fromEnd`, `fromEnqueuedTime`|
| initialOffsetOptions/enqueuedTimeUtc | | Specifies the enqueued time of the event in the stream from which to start processing. When `initialOffsetOptions/type` is configured as `fromEnqueuedTime`, this setting is mandatory. Supports time in any format supported by [DateTime.Parse()](/dotnet/standard/base-types/parsing-datetime), such as  `2020-10-26T20:31Z`. For clarity, you should also specify a timezone. When timezone isn't specified, Functions assumes the local timezone of the machine running the function app, which is UTC when running on Azure. |
| clientRetryOptions/mode | exponential | The approach to use for calculating retry delays. Exponential mode will retry attempts with a delay based on a back-off strategy where each attempt will increase the duration that it waits before retrying. The fixed mode will retry attempts at fixed intervals with each delay having a consistent duration. Available options: `exponential`, `fixed`|
| clientRetryOptions/tryTimeout | 00:01:00 | The maximum duration to wait for an Event Hubs operation to complete, per attempt.|
| clientRetryOptions/delay | 00:00:00.80 | The delay or back-off factor to apply between retry attempts.|
| clientRetryOptions/maxDelay | 00:00:01 | The maximum delay to allow between retry attempts. |
| clientRetryOptions/maxRetries | 3 | The maximum number of retry attempts before considering the associated operation to have failed.|

> [!NOTE]
> For a reference of host.json in Azure Functions 2.x and beyond, see [host.json reference for Azure Functions](../articles/azure-functions/functions-host-json.md).

### Functions 2.x and higher with extensions v4.x and earlier

```json
{
    "version": "2.0",
    "extensions": {
        "eventHubs": {
            "batchCheckpointFrequency": 5,
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
|initialOffsetOptions/enqueuedTimeUtc<sup>1</sup>| | Specifies the enqueued time of the event in the stream from which to start processing. When `initialOffsetOptions/type` is configured as `fromEnqueuedTime`, this setting is mandatory. Supports time in any format supported by [DateTime.Parse()](/dotnet/standard/base-types/parsing-datetime), such as  `2020-10-26T20:31Z`. For clarity, you should also specify a timezone. When timezone isn't specified, Functions assumes the local timezone of the machine running the function app, which is UTC when running on Azure. For more information, see the [EventProcessorOptions documentation](/dotnet/api/microsoft.azure.eventhubs.processor.eventprocessoroptions.initialoffsetprovider).|

<sup>1</sup> Support for `initialOffsetOptions` begins with [EventHubs v4.2.0](https://github.com/Azure/azure-functions-eventhubs-extension/releases/tag/v4.2.0).

> [!NOTE]
> For a reference of host.json in Azure Functions 2.x and beyond, see [host.json reference for Azure Functions](../articles/azure-functions/functions-host-json.md).

### Functions 1.x

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

> [!NOTE]
> For a reference of host.json in Azure Functions 1.x, see [host.json reference for Azure Functions 1.x](../articles/azure-functions/functions-host-json-v1.md).
