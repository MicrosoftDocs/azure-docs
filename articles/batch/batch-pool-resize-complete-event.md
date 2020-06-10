---
title: Azure Batch pool resize complete event
description: Reference for Batch pool resize complete event. See an example of a pool that increased in size and completed successfully.
ms.topic: reference
ms.date: 04/20/2017
---

# Pool resize complete event

 This event is emitted when a pool resize has completed or failed.

 The following example shows the body of a pool resize complete event for a pool that increased in size and completed successfully.

```
{
	"id": "myPool",
	"nodeDeallocationOption": "invalid",
     	"currentDedicatedNodes": 10,
    	"targetDedicatedNodes": 10,
   	"currentLowPriorityNodes": 5,
    	"targetLowPriorityNodes": 5,
	"enableAutoScale": false,
	"isAutoPool": false,
	"startTime": "2016-09-09T22:13:06.573Z",
	"endTime": "2016-09-09T22:14:01.727Z",
	"resultCode": "Success",
	"resultMessage": "The operation succeeded"
}
```

|Element|Type|Notes|
|-------------|----------|-----------|
|`id`|String|The ID of the pool.|
|`nodeDeallocationOption`|String|Specifies when nodes may be removed from the pool, if the pool size is decreasing.<br /><br /> Possible values are:<br /><br /> **requeue** – Terminate running tasks and requeue them. The tasks will run again when the job is enabled. Remove nodes as soon as tasks have been terminated.<br /><br /> **terminate** – Terminate running tasks. The tasks will not run again. Remove nodes as soon as tasks have been terminated.<br /><br /> **taskcompletion** – Allow currently running tasks to complete. Schedule no new tasks while waiting. Remove nodes when all tasks have completed.<br /><br /> **Retaineddata** -  Allow currently running tasks to complete, then wait for all task data retention periods to expire. Schedule no new tasks while waiting. Remove nodes when all task retention periods have expired.<br /><br /> The default value is requeue.<br /><br /> If the pool size is increasing then the value is set to **invalid**.|
|`currentDedicatedNodes`|Int32|The number of dedicated compute nodes currently assigned to the pool.|
|`targetDedicatedNodes`|Int32|The number of dedicated compute nodes that are requested for the pool.|
|`currentLowPriorityNodes`|Int32|The number of low-priority compute nodes currently assigned to the pool.|
|`targetLowPriorityNodes`|Int32|The number of low-priority compute nodes that are requested for the pool.|
|`enableAutoScale`|Bool|Specifies whether the pool size automatically adjusts over time.|
|`isAutoPool`|Bool|Specifies whether the pool was created via a job's AutoPool mechanism.|
|`startTime`|DateTime|The time the pool resize started.|
|`endTime`|DateTime|The time the pool resize completed.|
|`resultCode`|String|The result of the resize.|
|`resultMessage`|String| A detailed message about the result.<br /><br /> If the resize completed successfully it states that the operation succeeded.|
