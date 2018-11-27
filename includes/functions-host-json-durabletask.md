---
title: include file
description: include file
services: functions
author: ggailey777
manager: jeconnoc
ms.service: functions
ms.topic: include
ms.date: 10/19/2018
ms.author: glenga
ms.custom: include file
---

Configuration settings for [Durable Functions](../articles/azure-functions/durable-functions-overview.md).

```json
{
  "durableTask": {
    "HubName": "MyTaskHub",
    "ControlQueueBatchSize": 32,
    "PartitionCount": 4,
    "ControlQueueVisibilityTimeout": "00:05:00",
    "WorkItemQueueVisibilityTimeout": "00:05:00",
    "MaxConcurrentActivityFunctions": 10,
    "MaxConcurrentOrchestratorFunctions": 10,
    "AzureStorageConnectionStringName": "AzureWebJobsStorage",
    "TraceInputsAndOutputs": false,
    "LogReplayEvents": false,
    "EventGridTopicEndpoint": "https://topic_name.westus2-1.eventgrid.azure.net/api/events",
    "EventGridKeySettingName":  "EventGridKey",
    "EventGridPublishRetryCount": 3,
    "EventGridPublishRetryInterval": "00:00:30"
  }
}
```

Task hub names must start with a letter and consist of only letters and numbers. If not specified, the default task hub name for a function app is **DurableFunctionsHub**. For  more information, see [Task hubs](../articles/azure-functions/durable-functions-task-hubs.md).

|Property  |Default | Description |
|---------|---------|---------|
|HubName|DurableFunctionsHub|Alternate [task hub](../articles/azure-functions/durable-functions-task-hubs.md) names can be used to isolate multiple Durable Functions applications from each other, even if theyre using the same storage backend.|
|ControlQueueBatchSize|32|The number of messages to pull from the control queue at a time.|
|PartitionCount |4|The partition count for the control queue. May be a positive integer between 1 and 16.|
|ControlQueueVisibilityTimeout |5 minutes|The visibility timeout of dequeued control queue messages.|
|WorkItemQueueVisibilityTimeout |5 minutes|The visibility timeout of dequeued work item  queue messages.|
|MaxConcurrentActivityFunctions |10X the number of processors on the current machine|The maximum number of activity functions that can be processed concurrently on a single host instance.|
|MaxConcurrentOrchestratorFunctions |10X the number of processors on the current machine|The maximum number of orchestrator functions that can be processed concurrently on a single host instance.|
|AzureStorageConnectionStringName |AzureWebJobsStorage|The name of the app setting that has the Azure Storage connection string used to manage the underlying Azure Storage resources.|
|TraceInputsAndOutputs |false|A value indicating whether to trace the inputs and outputs of function calls. The default behavior when tracing function execution events is to include the number of bytes in the serialized inputs and outputs for function calls. This provides minimal information about what the inputs and outputs look like without bloating the logs or inadvertently exposing sensitive information to the logs. Setting this property to true causes the default function logging to log the entire contents of function inputs and outputs.|
|LogReplayEvents|false|A value indicating whether to write orchestration replay events to Application Insights.|
|EventGridTopicEndpoint ||The URL of an Azure Event Grid custom topic endpoint. When this property is set, orchestration life cycle notification events are published to this endpoint. This property supports App Settings resolution.|
|EventGridKeySettingName ||The name of the app setting containing the key used for authenticating with the Azure Event Grid custom topic at `EventGridTopicEndpoint`.|
|EventGridPublishRetryCount|0|The number of times to retry if publishing to the Event Grid Topic fails.|
|EventGridPublishRetryInterval|5 minutes|The Event Grid publishes retry interval in the *hh:mm:ss* format.|

Many of these are for optimizing performance. For more information, see [Performance and scale](../articles/azure-functions/durable-functions-perf-and-scale.md).