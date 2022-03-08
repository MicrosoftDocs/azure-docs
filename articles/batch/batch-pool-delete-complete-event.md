---
title: Azure Batch pool delete complete event
description: Reference for Batch pool delete complete event. This event is emitted when a pool delete operation has completed.
ms.topic: reference
ms.date: 12/28/2020
---

# Pool delete complete event

 This event is emitted when a pool delete operation has completed.

 The following example shows the body of a pool delete complete event.

```
{
   "id": "myPool1",
   "startTime": "2016-09-09T22:13:48.579Z",
   "endTime": "2016-09-09T22:14:08.836Z"
}
```

|Element|Type|Notes|
|-------------|----------|-----------|
|`id`|String|The ID of the pool.|
|`startTime`|DateTime|The time the pool delete started.|
|`endTime`|DateTime|The time the pool delete completed.|

## Remarks

For more information about states and error codes for pool resize operation, see [Delete a pool from an account](/rest/api/batchservice/delete-a-pool-from-an-account).
