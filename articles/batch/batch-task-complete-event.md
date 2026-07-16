---
title: Azure Batch task complete event
description: Reference for Batch task complete event. This event is emitted once a task is completed, regardless of the exit code.
ms.topic: reference
ms.date: 02/05/2026
# Customer intent: "As a cloud developer, I want to receive task completion events, so that I can monitor task durations, retry counts, and execution details for better performance analysis and troubleshooting."
---

# Task complete event

 This event is emitted once a task is completed, regardless of the exit code. This event can be used to determine the duration of a task, where the task ran, and whether it was retried.


 The following example shows the body of a task complete event.

```
{
    "jobId": "myJob",
    "id": "myTask",
    "taskType": "User",
    "systemTaskVersion": 0,
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
        "exitCode": 0,
        "retryCount": 0,
        "requeueCount": 0,
        "result": "Success",
        "schedulingError": {
            "category": "",
            "code": "",
            "message": "",
            "details": []
        }
    }
}
```

|Element name|Type|Notes|
|------------------|----------|-----------|
|`jobId`|String|The ID of the job containing the task.|
|`id`|String|The ID of the task.|
|`taskType`|String|The type of the task. The task type can either be 'JobManager' indicating it's a job manager task or 'User' indicating it isn't a job manager task. This event isn't emitted for job preparation tasks, job release tasks, or start tasks.|
|`systemTaskVersion`|Int32|The internal retry counter on a task. Internally the Batch service can retry a task to account for transient issues. These issues can include internal scheduling errors or attempts to recover from compute nodes in a bad state.|
|`requiredSlots`|Int32|The required slots to run the task.|
|[`nodeInfo`](#nodeInfo)|Complex Type|Contains information about the compute node on which the task ran.|
|[`multiInstanceSettings`](#multiInstanceSettings)|Complex Type|Specifies that the task is a Multi-Instance Task requiring multiple compute nodes. See [`multiInstanceSettings`](/rest/api/batchservice/get-information-about-a-task) for details.|
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
|`maxTaskRetryCount`|Int32|The maximum number of times the task might be retried. The Batch service retries a task if its exit code is nonzero.<br /><br /> This value specifically controls the number of retries. The Batch service tries the task once, and might then retry up to this limit. For example, if the maximum retry count is 3, Batch tries a task up to four times (one initial try and three retries).<br /><br /> If the maximum retry count is 0, the Batch service doesn't retry tasks.<br /><br /> If the maximum retry count is -1, the Batch service retries tasks without limit.<br /><br /> The default value is 0 (no retries).|

###  <a name="executionInfo"></a> executionInfo

|Element name|Type|Notes|
|------------------|----------|-----------|
|`startTime`|DateTime|The time when the task started running. 'Running' corresponds to the **running** state, so if the task specifies resource files or application packages, then the start time reflects the time when the task started downloading or deploying these resource files or application packages. If the task restarted or retried, this is the most recent time at which the task started running.|
|`endTime`|DateTime|The time when the task completed.|
|`exitCode`|Int32|The exit code of the task. If the task failed before it started running, then exitCode is null.|
|`retryCount`|Int32|The number of times the Batch service retried the task. The task is retried if it exits with a nonzero exit code, up to the specified MaxTaskRetryCount.|
|`requeueCount`|Int32|The number of times the Batch service requeued the task as the result of a user request.<br /><br /> When nodes are removed from a pool (through resizing or shrinking) or a job is disabled, you can choose to requeue the running tasks on those nodes. This count tracks how many times a task was requeued for these reasons.|
|`result`|String|The task result string, it could be "Success" or "Failure"|
|[`schedulingError`](#schedulingError)|Complex Type|Contains detailed information about the error.|

###  <a name="schedulingError"></a> schedulingError

|Element name|Type|Notes|
|------------------|----------|-----------|
|`category`|String|The error category, for example "UserError".|
|`code`|String|The error code, for example "FailureExitCode".|
|`message`|String|The error message.|
|`details`|Array|The error details.|
