---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 09/04/2018
ms.author: glenga
---

### Functions 2.x and higher

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
|eventProcessorOptions/prefetchCount|300|The default pre-fetch count used by the underlying `EventProcessorHost`. The minimum allowed value is 10.|
|initialOffsetOptions/type<sup>1</sup>|fromStart|The location in the event stream from which to start processing when a checkpoint doesn't exist in storage. Options are `fromStart` , `fromEnd` or `fromEnqueuedTime`. `fromEnd` processes new events that were enqueued after the function app started running. Applies to all partitions.  For more information, see the [EventProcessorOptions documentation](/dotnet/api/microsoft.azure.eventhubs.processor.eventprocessoroptions.initialoffsetprovider).|
|initialOffsetOptions/enqueuedTimeUtc<sup>1</sup>|N/A| Specifies the enqueued time of the event in the stream from which to start processing. When `initialOffsetOptions/type` is configured as `fromEnqueuedTime`, this setting is mandatory. Supports time in any format supported by [DateTime.Parse()](/dotnet/standard/base-types/parsing-datetime), such as  `2020-10-26T20:31Z`. For clarity, you should also specify a timezone. When timezone isn't specified, Functions assumes the local timezone of the machine running the function app, which is UTC when running on Azure. For more information, see the [EventProcessorOptions documentation](/dotnet/api/microsoft.azure.eventhubs.processor.eventprocessoroptions.initialoffsetprovider).|

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
|prefetchCount|n/a|The default pre-fetch that will be used by the underlying `EventProcessorHost`.| 
|batchCheckpointFrequency|1|The number of event batches to process before creating an EventHub cursor checkpoint.| 

> [!NOTE]
> For a reference of host.json in Azure Functions 1.x, see [host.json reference for Azure Functions 1.x](../articles/azure-functions/functions-host-json-v1.md).
