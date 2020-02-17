---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 09/04/2018
ms.author: glenga
---
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
|prefetchCount|n/a|The default PrefetchCount that will be used by the underlying EventProcessorHost.| 
|batchCheckpointFrequency|1|The number of event batches to process before creating an EventHub cursor checkpoint.| 
