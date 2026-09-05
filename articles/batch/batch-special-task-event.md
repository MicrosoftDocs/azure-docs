---
title: Azure Batch special task event
description: Reference for Batch special task event. This event is emitted for special tasks such as job preparation, job release, and start tasks when Batch reports them as completed or failed.
ms.topic: reference
ms.date: 08/05/2026
# Customer intent: As a cloud operator, I want to understand the special task event in Batch so that I can monitor job preparation, job release, and start task execution.
---

# Special task event

This event is emitted for special tasks, such as job preparation tasks, job release tasks, and start tasks, when Batch reports the task as completed or failed.

The following example shows the body of a special task event for a completed job preparation task.

```json
{
    "jobId": "myJob",
    "taskName": "jobprep-task-01",
    "taskType": "JobPrep",
    "nodeInfo": {
        "poolId": "pool-001",
        "nodeId": "tvm-257509324_1-20160908t162728z"
    },
    "executionInfo": {
        "startTime": "2020-06-30T01:47:56Z",
        "endTime": "2020-06-30T02:13:29Z",
        "exitCode": 0,
        "result": "success",
        "schedulingError": {
            "details": []
        }
    }
}
```

|Element name|Type|Notes|
|------------------|----------|-----------|
|`jobId`|String|The ID of the job associated with the special task. For pool start tasks, this field might be empty or omitted.|
|`taskName`|String|The name of the special task.|
|`taskType`|String|The special task type, such as a job preparation task, job release task, or start task.|
|[`nodeInfo`](#nodeInfo)|Complex Type|Contains information about the compute node on which the special task ran.|
|[`executionInfo`](#executionInfo)|Complex Type|Contains information about the special task execution.|

###  <a name="nodeInfo"></a> nodeInfo

|Element name|Type|Notes|
|------------------|----------|-----------|
|`poolId`|String|The ID of the pool on which the special task ran.|
|`nodeId`|String|The ID of the node on which the special task ran.|

###  <a name="executionInfo"></a> executionInfo

|Element name|Type|Notes|
|------------------|----------|-----------|
|`startTime`|DateTime|The time when the special task started running.|
|`endTime`|DateTime|The time when the special task completed.|
|`exitCode`|Int32|The exit code of the special task.|
|`result`|String|A service-defined result string for the special task, such as `success` or `failure`.|
|[`schedulingError`](#schedulingError)|Complex Type|Contains detailed information about the reported error. If no error details are available, the object might contain only an empty `details` array.|

The special task event payload doesn't currently populate `retryCount` or `requeueCount`.

###  <a name="schedulingError"></a> schedulingError

|Element name|Type|Notes|
|------------------|----------|-----------|
|`category`|String|The error category, if one is available.|
|`code`|String|The error code, if one is available.|
|`message`|String|The error message, if one is available.|
|[`details`](#details)|Array|A list of name-value pairs that provides more detail about the error. If no extra detail values are available, the array is empty.|

###  <a name="details"></a> details

|Element name|Type|Notes|
|------------------|----------|-----------|
|`name`|String|The detail name.|
|`value`|String|The detail value.|
