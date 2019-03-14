---
title: include file
description: include file
services: functions
author: ggailey777
manager: jeconnoc
ms.service: functions
ms.topic: include
ms.date: 03/14/2019
ms.author: glenga
ms.custom: include file
---

Configuration settings for [Durable Functions](../articles/azure-functions/durable-functions-overview.md).

```json
{
  "durableTask": {
    "hubName": "MyTaskHub",
    "controlQueueBatchSize": 32,
    "partitionCount": 4,
    "controlQueueVisibilityTimeout": "00:05:00",
    "workItemQueueVisibilityTimeout": "00:05:00",
    "maxConcurrentActivityFunctions": 10,
    "maxConcurrentOrchestratorFunctions": 10,
    "maxQueuePollingInterval": "00:00:30",
    "azureStorageConnectionStringName": "AzureWebJobsStorage",
    "traceInputsAndOutputs": false,
    "logReplayEvents": false,
    "eventGridTopicEndpoint": "https://topic_name.westus2-1.eventgrid.azure.net/api/events",
    "eventGridKeySettingName":  "EventGridKey",
    "eventGridPublishRetryCount": 3,
    "eventGridPublishRetryInterval": "00:00:30",
    "eventGridPublishEventTypes": ["Started", "Pending", "Failed", "Terminated"]
  }
}
```

Task hub names must start with a letter and consist of only letters and numbers. If not specified, the default task hub name for a function app is **DurableFunctionsHub**. For  more information, see [Task hubs](../articles/azure-functions/durable-functions-task-hubs.md).

|Property  |Default | Description |
|---------|---------|---------|
|hubName|DurableFunctionsHub|Alternate [task hub](../articles/azure-functions/durable-functions-task-hubs.md) names can be used to isolate multiple Durable Functions applications from each other, even if they're using the same storage backend.|
|controlQueueBatchSize|32|The number of messages to pull from the control queue at a time.|
|partitionCount |4|The partition count for the control queue. May be a positive integer between 1 and 16.|
|controlQueueVisibilityTimeout |5 minutes|The visibility timeout of dequeued control queue messages.|
|workItemQueueVisibilityTimeout |5 minutes|The visibility timeout of dequeued work item  queue messages.|
|maxConcurrentActivityFunctions |10X the number of processors on the current machine|The maximum number of activity functions that can be processed concurrently on a single host instance.|
|maxConcurrentOrchestratorFunctions |10X the number of processors on the current machine|The maximum number of orchestrator functions that can be processed concurrently on a single host instance.|
|maxQueuePollingInterval|30 seconds|The maximum control and work-item queue polling interval in the *hh:mm:ss* format. Note that setting this to a higher value could result in higher message processing latencies. Setting this to a lower value could result in higher storage costs due to increased storage transactions.|
|azureStorageConnectionStringName |AzureWebJobsStorage|The name of the app setting that has the Azure Storage connection string used to manage the underlying Azure Storage resources.|
|traceInputsAndOutputs |false|A value indicating whether to trace the inputs and outputs of function calls. The default behavior when tracing function execution events is to include the number of bytes in the serialized inputs and outputs for function calls. This provides minimal information about what the inputs and outputs look like without bloating the logs or inadvertently exposing sensitive information to the logs. Setting this property to true causes the default function logging to log the entire contents of function inputs and outputs.|
|logReplayEvents|false|A value indicating whether to write orchestration replay events to Application Insights.|
|eventGridTopicEndpoint ||The URL of an Azure Event Grid custom topic endpoint. When this property is set, orchestration life cycle notification events are published to this endpoint. This property supports App Settings resolution.|
|eventGridKeySettingName ||The name of the app setting containing the key used for authenticating with the Azure Event Grid custom topic at `EventGridTopicEndpoint`.|
|eventGridPublishRetryCount|0|The number of times to retry if publishing to the Event Grid Topic fails.|
|eventGridPublishRetryInterval|5 minutes|The Event Grid publishes retry interval in the *hh:mm:ss* format.|
|eventGridPublishEventTypes||A list of event types to publish to Event Grid. If not specified, all event types will be published. Allowed values include 'Started', 'Completed', 'Failed', 'Terminated'.|

Many of these are for optimizing performance. For more information, see [Performance and scale](../articles/azure-functions/durable-functions-perf-and-scale.md).