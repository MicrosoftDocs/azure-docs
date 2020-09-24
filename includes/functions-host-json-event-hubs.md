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
            }
        }
    }
}  
```

|Property  |Default | Description |
|---------|---------|---------|
|maxBatchSize|10|The maximum event count received per receive loop.|
|prefetchCount|300|The default pre-fetch count used by the underlying `EventProcessorHost`.|
|batchCheckpointFrequency|1|The number of event batches to process before creating an EventHub cursor checkpoint.|

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

