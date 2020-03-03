---
title: include file
description: include file
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 10/19/2018
ms.author: glenga
ms.custom: include file
---

Specifies how many function invocations are aggregated when [calculating metrics for Application Insights](../articles/azure-functions/functions-monitoring.md#configure-the-aggregator). 

```json
{
    "aggregator": {
        "batchSize": 1000,
        "flushTimeout": "00:00:30"
    }
}
```

|Property |Default  | Description |
|---------|---------|---------| 
|batchSize|1000|Maximum number of requests to aggregate.| 
|flushTimeout|00:00:30|Maximum time period to aggregate.| 

Function invocations are aggregated when the first of the two limits are reached.
