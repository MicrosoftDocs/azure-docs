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
                "enqueuedTime": ""
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
|initialOffsetOptions/type|fromStart|The location in the event stream from which to start processing when a checkpoint doesn't exist in storage. Options are `fromStart` , `fromEnd` or `fromEnqueuedTime`. `fromEnd` processes new events that were enqueued after the function app started running. Applies to all partitions.  For more information, see the [EventProcessorOptions documentation](/dotnet/api/microsoft.azure.eventhubs.processor.eventprocessoroptions.initialoffsetprovider?view=azure-dotnet).|
|initialOffsetOptions/enqueuedTime|N/A|When "initialOffsetOptions/type" is configured as "fromEnqueuedTime", this field is mandatory.  It specifies the enqueued time of the event in the stream to start processing from. Supports time in any format supported by [DateTime.Parse()](https://docs.microsoft.com/en-us/dotnet/standard/base-types/parsing-datetime) e.g. 2020-10-26T20:31Z. Specifying timezone is recommended for clarity, if timezone is not specified, local timezone of where the function runs is assumed, which is UTC when running on Azure.|
> [!NOTE]
> For a reference of host.json in Azure Functions 2.x and beyond, see [host.json reference for Azure Functions](../articles/azure-functions/functions-host-json.md).
> For more details on how "initialOffsetOptions" works, please refer to the relevant [Azure Event Hubs documentation](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.eventhubs.processor.eventprocessoroptions.initialoffsetprovider?view=azure-dotnet).

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
