---
title: Azure Batch task requeue event
description: Reference for Batch task requeue event. This event is emitted when Batch requeues a task so it can be scheduled again.
ms.topic: reference
ms.date: 08/05/2026
# Customer intent: As a cloud operator, I want to understand the task requeue event in Batch so that I can monitor when tasks are returned to the queue and scheduled again.
---

# Task requeue event

This event is emitted when Batch requeues a task so that it can be scheduled again.

A task can be requeued after service actions such as node removal, job disable operations that requeue tasks, or other service-driven recovery scenarios.

When the requeued task is scheduled again, Batch emits a new [Task start](batch-task-start-event.md) event for that later attempt.

The following example shows the body of a task requeue event.

```json
{
    "jobId": "myJob",
    "id": "myTask",
    "taskType": "User",
    "systemTaskVersion": 3,
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
        "startTime": "2016-09-08T16:32:23.799Z",
        "endTime": "2016-09-08T16:34:00.666Z",
        "exitCode": 11,
        "retryCount": 0,
        "requeueCount": 1,
        "result": "failure",
        "schedulingError": {
            "category": "UserError",
            "code": "BadCommandType",
            "message": "Task has invalid command",
            "details": [
                {
                    "name": "Reason",
                    "value": "Access denied"
                }
            ]
        }
    }
}
```

`exitCode`, `result`, and `schedulingError` are populated only when Batch has execution error information for the requeued task.

|Element name|Type|Notes|
|------------------|----------|-----------|
|`jobId`|String|The ID of the job containing the task.|
|`id`|String|The ID of the task.|
|`taskType`|String|The type of the task. It's either `JobManager` indicating it's a job manager task or `User` indicating it isn't a job manager task. This event isn't emitted for job preparation tasks, job release tasks, or start tasks. For those tasks, see [Special task event](batch-special-task-event.md).|
|`systemTaskVersion`|Int32|The internal retry counter on a task. Internally the Batch service can retry a task to account for transient issues. These issues can include internal scheduling errors or attempts to recover from compute nodes in a bad state.|
|`requiredSlots`|Int32|The required slots to run the task.|
|[`nodeInfo`](#nodeInfo)|Complex Type|Contains information about the compute node on which the task most recently ran.|
|[`multiInstanceSettings`](#multiInstanceSettings)|Complex Type|Specifies that the task is a Multi-Instance Task requiring multiple compute nodes. See [`multiInstanceSettings`](/rest/api/batchservice/get-information-about-a-task) for details.|
|[`constraints`](#constraints)|Complex Type|The execution constraints that apply to this task.|
|[`executionInfo`](#executionInfo)|Complex Type|Contains information about the execution state captured when the task was requeued.|

###  <a name="nodeInfo"></a> nodeInfo

|Element name|Type|Notes|
|------------------|----------|-----------|
|`poolId`|String|The ID of the pool on which the task most recently ran.|
|`nodeId`|String|The ID of the node on which the task most recently ran.|

###  <a name="multiInstanceSettings"></a> multiInstanceSettings

|Element name|Type|Notes|
|------------------|----------|-----------|
|`numberOfInstances`|Int32|The number of compute nodes required by the task.|

###  <a name="constraints"></a> constraints

|Element name|Type|Notes|
|------------------|----------|-----------|
|`maxTaskRetryCount`|Int32|The maximum number of times the task might be retried. The Batch service retries a task if its exit code is nonzero.<br /><br /> This value specifically controls the number of retries. The Batch service tries the task once, and might then retry up to this limit. For example, if the maximum retry count is 3, Batch tries a task up to four times (one initial try and three retries).<br /><br /> If the maximum retry count is 0, the Batch service doesn't retry tasks.<br /><br /> If the maximum retry count is -1, the Batch service retries tasks without limit.<br /><br /> The default value is 0 (no retries).|

###  <a name="executionInfo"></a> executionInfo

|Element name|Type|Notes|
|------------------|----------|-----------|
|`startTime`|DateTime|The time when the task most recently started running before it was requeued. If the task had not started, this field might be omitted.|
|`endTime`|DateTime|The time when the task most recently stopped running before it was requeued. If the task had not started, this field might be omitted.|
|`exitCode`|Int32|The exit code from the most recent task execution, when Batch has one to report. Otherwise, this field is omitted.|
|`retryCount`|Int32|The number of times the Batch service retried the task. The task is retried if it exits with a nonzero exit code, up to the specified max task retry count.|
|`requeueCount`|Int32|The number of times the Batch service requeued the task. In the current emitted payload, this field reflects the service's current requeue counter for the task.|
|`result`|String|A service-defined result string for the task when one is available.|
|[`schedulingError`](#schedulingError)|Complex Type|Contains detailed information about the reported error, if one is available.|

###  <a name="schedulingError"></a> schedulingError

|Element name|Type|Notes|
|------------------|----------|-----------|
|`category`|String|The error category, for example `UserError`.|
|`code`|String|The error code, for example `BadCommandType`.|
|`message`|String|The error message.|
|[`details`](#details)|Array|A list of name-value pairs that provides more detail about the error. If no extra detail values are available, the array is empty.|

###  <a name="details"></a> details

|Element name|Type|Notes|
|------------------|----------|-----------|
|`name`|String|The detail name.|
|`value`|String|The detail value.|
