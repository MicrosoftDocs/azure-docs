---
title: Azure Batch pool resize start event
description: Reference for Batch pool resize start event. Example shows the body of a pool resize start event for a pool resizing from 0 to 2 nodes with a manual resize.
ms.topic: reference
ms.date: 07/01/2025
# Customer intent: As a cloud administrator, I want to understand the details of the pool resize start event, so that I can effectively manage node allocation and ensure resource availability during processing workloads.
---

# Pool resize start event

 This event is emitted when a pool resize is started. Since the pool resize is an asynchronous event, you can expect a pool resize complete event to be emitted once the resize operation completes.

 The following example shows the body of a pool resize start event for a pool resizing from 0 to 2 nodes with a manual resize.

```
{
   "id": "myPool1",
   "nodeDeallocationOption": "Invalid",
   "currentDedicatedNodes": 0,
   "targetDedicatedNodes": 2,
   "currentLowPriorityNodes": 0,
   "targetLowPriorityNodes": 2,
   "enableAutoScale": false,
   "isAutoPool": false
}
```

|Element|Type|Notes|
|-------------|----------|-----------|
|`id`|String|The ID of the pool.|
|`nodeDeallocationOption`|String|Specifies when nodes may be removed from the pool, if the pool size is decreasing.<br /><br /> Possible values are:<br /><br /> **requeue** – Terminate running tasks and requeue them. The tasks run again when the job is enabled. Remove nodes as soon as tasks are terminated.<br /><br /> **terminate** – Terminate running tasks. The tasks won't run again. Remove nodes as soon as tasks are terminated.<br /><br /> **taskcompletion** – Allow currently running tasks to complete. Schedule no new tasks while waiting. Remove nodes when all tasks are completed.<br /><br /> **Retaineddata** - Allow currently running tasks to complete, then wait for all task data retention periods to expire. Schedule no new tasks while waiting. Remove nodes when all task retention periods are expired.<br /><br /> The default value is requeue.<br /><br /> If the pool size is increasing then the value is set to **invalid**.|
|`currentDedicatedNodes`|Int32|The number of dedicated compute nodes currently assigned to the pool.|
|`targetDedicatedNodes`|Int32|The number of dedicated compute nodes that are requested for the pool.|
|`currentLowPriorityNodes`|Int32|The number of Spot compute nodes currently assigned to the pool.|
|`targetLowPriorityNodes`|Int32|The number of Spot compute nodes that are requested for the pool.|
|`enableAutoScale`|Bool|Specifies whether the pool size automatically adjusts over time.|
|`isAutoPool`|Bool|Specifies whether the pool was created via a job's AutoPool mechanism.|
