---
title: Azure Batch pool autoscale event
description: Reference for the Batch pool autoscale event, which is emitted once a pool automatic scaling is executed. The content of the log will expose autoscale formula and evaluation results for the pool.
ms.topic: reference
ms.date: 10/08/2020
---

# Pool autoscale event

 This event is emitted once a pool automatic scaling is executed. The content of the log will expose autoscale formula and evaluation results for the pool.

 The following example shows the body of a pool autoscale event for a pool automatic scaling which failed due to insufficient sample data.

```
{
    "id": "myPool1",
    "timestamp": "2020-09-21T18:59:56.204Z",
    "formula": "...",
    "results": "...",
    "error": {
        "code": "InsufficientSampleData",
        "message": "Autoscale evaluation failed due to insufficient sample data",
        "values": [{
                "name": "Message",
                "value": "Line 15, Col 44: Insufficient data from data set: $RunningTasks wanted 70%, received 50%"
            }
        ]
    }
}
```

|Element|Type|Notes|
|-------------|----------|-----------|
|`id`|String|The ID of the pool.|
|`timestamp`|DateTime|The timestamp when automatic scaling is executed.|
|`formula`|String|The formula defined for automatic scaling.|
|`results`|String|Evaluation results for all variables used in the formula.|
|[`error`](#error)|Complex Type|The detailed error for automatic scaling.|

###  <a name="error"></a> error

|Element name|Type|Notes|
|------------------|----------|-----------|
|`code`|String|An identifier for the automatic scaling error. Codes are invariant and are intended to be consumed programmatically.|
|`message`|String|A message describing the automatic scaling error, intended to be suitable for display in a user interface.|
|`values`|Array|List of name-value pairs describing more details of the automatic scaling error.|
