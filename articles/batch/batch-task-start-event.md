---
title: Azure Batch task start event
description: Reference information for Batch task start event. This event is emitted once a task has been scheduled to start on a compute node by the scheduler.
ms.topic: reference
ms.date: 07/01/2025
---

# Task start event

 This event is emitted once a task is scheduled to start on a compute node by the scheduler. If the task is retried or requeued, this event will be emitted again for the same task. The retry count and system task version will be updated accordingly.


 The following example shows the body of a task start event.

```
{
    "jobId": "myJob",
    "id": "myTask",
    "taskType": "User",
    "systemTaskVersion": 220192842,
    "requiredSlots": 1,
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
        "retryCount": 0
    }
}
```

|Element name|Type|Notes|
|------------------|----------|-----------|
|`jobId`|String|The ID of the job containing the task.|
|`id`|String|The ID of the task.|
|`taskType`|String|The type of the task. It's either a 'JobManager' indicating it's a job manager task or 'User' indicating it isn't a job manager task.|
|`systemTaskVersion`|Int32|The internal retry counter on a task. Internally the Batch service retries a task to account for transient issues. These issues include internal scheduling errors or attempts to recover from compute nodes in a bad state.|
|`requiredSlots`|Int32|The required slots to run the task.|
|[`nodeInfo`](#nodeInfo)|Complex Type| Contains information about the compute node on which the task ran.|
|[`multiInstanceSettings`](#multiInstanceSettings)|Complex Type| Specifies that the task is Multi-Instance Task requiring multiple compute nodes. See [multiInstanceSettings](/rest/api/batchservice/get-information-about-a-task) for details.|
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
|`numberOfInstances`|Int|The number of compute nodes required by the task.|

###  <a name="constraints"></a> constraints

|Element name|Type|Notes|
|------------------|----------|-----------|
|`maxTaskRetryCount`|Int32|The maximum number of times the task is retried. The Batch service retries a task if its exit code is nonzero.<br /><br /> This value specifically controls the number of retries. The Batch service tries the task once, and may then retry up to this limit. For example, if the maximum retry count is 3, Batch tries a task up to 4 times (one initial try and 3 retries).<br /><br /> If the maximum retry count is 0, the Batch service doesn't retry tasks.<br /><br /> If the maximum retry count is -1, the Batch service retries tasks without limit.<br /><br /> The default value is 0 (no retries).|

###  <a name="executionInfo"></a> executionInfo

|Element name|Type|Notes|
|------------------|----------|-----------|
|`retryCount`|Int32|The number of times the task is retried by the Batch service. The task is retried if it exits with a nonzero exit code, up to the specified MaxTaskRetryCount|
