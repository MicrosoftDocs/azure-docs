---
title: "Azure Batch pool resize start event | Microsoft Docs"
description: Reference for Batch pool resize start event.
services: batch
author: laurenhughes
manager: jeconnoc

ms.assetid: 
ms.service: batch
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: 
ms.workload: big-compute
ms.date: 04/20/2017
ms.author: lahugh
---

# Pool resize start event

 This event is emitted when a pool resize has started. Since the pool resize is an asynchronous event, you can expect a pool resize complete event to be emitted once the resize operation completes.

 The following example shows the body of a pool resize start event for a pool resizing from 0 to 2 nodes with a manual resize.

```
{
	"poolId": "myPool1",
	"nodeDeallocationOption": "invalid",
	"currentDedicated": 0,
	"targetDedicated": 2,
	"enableAutoScale": false,
	"isAutoPool": false
}
```

|Element|Type|Notes|
|-------------|----------|-----------|
|poolId|String|The id of the pool.|
|nodeDeallocationOption|String|Specifies when nodes may be removed from the pool, if the pool size is decreasing.<br /><br /> Possible values are:<br /><br /> **requeue** – Terminate running tasks and requeue them. The tasks will run again when the job is enabled. Remove nodes as soon as tasks have been terminated.<br /><br /> **terminate** – Terminate running tasks. The tasks will not run again. Remove nodes as soon as tasks have been terminated.<br /><br /> **taskcompletion** – Allow currently running tasks to complete. Schedule no new tasks while waiting. Remove nodes when all tasks have completed.<br /><br /> **Retaineddata** - Allow currently running tasks to complete, then wait for all task data retention periods to expire. Schedule no new tasks while waiting. Remove nodes when all task retention periods have expired.<br /><br /> The default value is requeue.<br /><br /> If the pool size is increasing then the value is set to **invalid**.|
|currentDedicated|Int32|The number of compute nodes currently assigned to the pool.|
|targetDedicated|Int32|The number of compute nodes that are requested for the pool.|
|enableAutoScale|Bool|Specifies whether the pool size automatically adjusts over time.|
|isAutoPool|Bool|Specifies whether the pool was created via a job's AutoPool mechanism.|
