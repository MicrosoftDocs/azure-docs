---
title: Azure Batch task fail event
description: Reference for Batch task fail event. This event will be emitted in addition to a task complete event and can be used to detect when a task has failed.
services: batch
author: ju-shim
manager: gwallace

ms.assetid: 
ms.service: batch
ms.topic: article
ms.tgt_pltfrm: 
ms.workload: big-compute
ms.date: 08/15/2019
ms.author: jushiman
---

# Task fail event

 This event is emitted when a task completes with a failure. Currently all nonzero exit codes are considered failures. This event will be emitted *in addition to* a task complete event and can be used to detect when a task has failed.


 The following example shows the body of a task fail event.

```
{
	"jobId": "myJob",
	"id": "myTask",
	"taskType": "User",
	"systemTaskVersion": 0,
	"nodeInfo": {
		"poolId": "pool-001",
		"nodeId": "tvm-257509324_1-20160908t162728z"
	},
	"multiInstanceSettings": {
		"numberOfInstances": 1
	},
	"constraints": {
		"maxTaskRetryCount": 2
	},
	"executionInfo": {
		"startTime": "2016-09-08T16:32:23.799Z",
		"endTime": "2016-09-08T16:34:00.666Z",
		"exitCode": 1,
		"retryCount": 2,
		"requeueCount": 0
	}
}
```

|Element name|Type|Notes|
|------------------|----------|-----------|
|`jobId`|String|The ID of the job containing the task.|
|`id`|String|The ID of the task.|
|`taskType`|String|The type of the task. This can either be 'JobManager' indicating it is a job manager task or 'User' indicating it is not a job manager task. This event is not emitted for job preparation tasks, job release tasks or start tasks.|
|`systemTaskVersion`|Int32|This is the internal retry counter on a task. Internally the Batch service can retry a task to account for transient issues. These issues can include internal scheduling errors or attempts to recover from compute nodes in a bad state.|
|[`nodeInfo`](#nodeInfo)|Complex Type|Contains information about the compute node on which the task ran.|
|[`multiInstanceSettings`](#multiInstanceSettings)|Complex Type|Specifies that the task is a Multi-Instance Task requiring multiple compute nodes.  See [`multiInstanceSettings`](https://docs.microsoft.com/rest/api/batchservice/get-information-about-a-task) for details.|
|[`constraints`](#constraints)|Complex Type|The execution constraints that apply to this task.|
|[`executionInfo`](#executionInfo)|Complex Type|Contains information about the execution of the task.|

###  <a name="nodeInfo"></a> nodeInfo

|Element name|Type|Notes|
|------------------|----------|-----------|
|`poolId`|String|The ID of the pool on which the task ran.|
|`nodeId`|String|The ID of the node on which the task ran.|

###  <a name="multiInstanceSettings"></a> multiInstanceSettings

|Element name|Type|Notes|
|------------------|----------|-----------|
|`numberOfInstances`|Int32|The number of compute nodes required by the task.|

###  <a name="constraints"></a> constraints

|Element name|Type|Notes|
|------------------|----------|-----------|
|`maxTaskRetryCount`|Int32|The maximum number of times the task may be retried. The Batch service retries a task if its exit code is nonzero.<br /><br /> Note that this value specifically controls the number of retries. The Batch service will try the task once, and may then retry up to this limit. For example, if the maximum retry count is 3, Batch tries a task up to 4 times (one initial try and 3 retries).<br /><br /> If the maximum retry count is 0, the Batch service does not retry tasks.<br /><br /> If the maximum retry count is -1, the Batch service retries tasks without limit.<br /><br /> The default value is 0 (no retries).|


###  <a name="executionInfo"></a> executionInfo

|Element name|Type|Notes|
|------------------|----------|-----------|
|`startTime`|DateTime|The time at which the task started running. 'Running' corresponds to the **running** state, so if the task specifies resource files or application packages, then the start time reflects the time at which the task started downloading or deploying these.  If the task has been restarted or retried, this is the most recent time at which the task started running.|
|`endTime`|DateTime|The time at which the task completed.|
|`exitCode`|Int32|The exit code of the task.|
|`retryCount`|Int32|The number of times the task has been retried by the Batch service. The task is retried if it exits with a nonzero exit code, up to the specified MaxTaskRetryCount.|
|`requeueCount`|Int32|The number of times the task has been requeued by the Batch service as the result of a user request.<br /><br /> When the user removes nodes from a pool (by resizing or shrinking the pool) or when the job is being disabled, the user can specify that running tasks on the nodes be requeued for execution. This count tracks how many times the task has been requeued for these reasons.|
