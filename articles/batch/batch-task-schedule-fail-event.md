---
title: Azure Batch task schedule fail event
description: Reference for Batch task schedule fail event. This event is emitted when a task failed to be scheduled and will retry later.
ms.topic: reference
ms.date: 09/20/2020
---

# Task schedule fail event

 This event is emitted when a task failed to be scheduled and will be retried later. This is a temporary failure at task scheduling time due to resource limitation, for example not enough slots available on nodes to run a task with `requiredSlots` specified.

 The following example shows the body of a task schedule fail event.

```
{
    "jobId": "job-01",
    "id": "task-01",
    "taskType": "User",
    "systemTaskVersion": 665378862,
    "requiredSlots": 1,
    "nodeInfo": {
        "poolId": "pool-01",
        "nodeId": " "
    },
    "multiInstanceSettings": {
        "numberOfInstances": 1
    },
    "constraints": {
        "maxTaskRetryCount": 0
    },
    "schedulingError": {
        "category": "UserError",
        "code": "JobPreparationTaskFailed",
        "message": "Task cannot run because the job preparation task failed on node"
    }
}
```

|Element name|Type|Notes|
|------------------|----------|-----------|
|`jobId`|String|The ID of the job containing the task.|
|`id`|String|The ID of the task.|
|`taskType`|String|The type of the task. This can either be 'JobManager' indicating it is a job manager task or 'User' indicating it is not a job manager task. This event is not emitted for job preparation tasks, job release tasks or start tasks.|
|`systemTaskVersion`|Int32|This is the internal retry counter on a task. Internally the Batch service can retry a task to account for transient issues. These issues can include internal scheduling errors or attempts to recover from compute nodes in a bad state.|
|`requiredSlots`|Int32|The required slots to run the task.|
|[`nodeInfo`](#nodeInfo)|Complex Type|Contains information about the compute node on which the task ran.|
|[`multiInstanceSettings`](#multiInstanceSettings)|Complex Type|Specifies that the task is a Multi-Instance Task requiring multiple compute nodes.  See [`multiInstanceSettings`](/rest/api/batchservice/get-information-about-a-task) for details.|
|[`constraints`](#constraints)|Complex Type|The execution constraints that apply to this task.|
|[`schedulingError`](#schedulingError)|Complex Type|Contains information about the scheduling error of the task.|

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


###  <a name="schedulingError"></a> schedulingError

|Element name|Type|Notes|
|------------------|----------|-----------|
|`category`|String|The category of the error.|
|`code`|String|An identifier for the task scheduling error. Codes are invariant and are intended to be consumed programmatically.|
|`message`|String|A message describing the task scheduling error, intended to be suitable for display in a user interface.|
