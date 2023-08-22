---
title: include file
description: include file
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 03/14/2019
ms.author: glenga
ms.custom: include file
---

Configuration settings for [Durable Functions](../articles/azure-functions/durable/durable-functions-overview.md).

> [!NOTE]
> All major versions of Durable Functions are supported on all versions of the Azure Functions runtime. However, the schema of the host.json configuration is slightly different depending on the version of the Azure Functions runtime and the Durable Functions extension version you use. The following examples are for use with Azure Functions 2.0 and 3.0. In both examples, if you're using Azure Functions 1.0, the available settings are the same, but the "durableTask" section of the host.json should go in the root of the host.json configuration instead of as a field under "extensions".

# [Durable Functions 2.x](#tab/2x-durable-functions)

<a name="durable-functions-2-0-host-json"></a>

```json
{
 "extensions": {
  "durableTask": {
    "hubName": "MyTaskHub",
    "storageProvider": {
      "connectionStringName": "AzureWebJobsStorage",
      "controlQueueBatchSize": 32,
      "controlQueueBufferThreshold": 256,
      "controlQueueVisibilityTimeout": "00:05:00",
      "maxQueuePollingInterval": "00:00:30",
      "partitionCount": 4,
      "trackingStoreConnectionStringName": "TrackingStorage",
      "trackingStoreNamePrefix": "DurableTask",
      "useLegacyPartitionManagement": true,
      "useTablePartitionManagement": false,
      "workItemQueueVisibilityTimeout": "00:05:00",
    },
    "tracing": {
      "traceInputsAndOutputs": false,
      "traceReplayEvents": false,
    },
    "notifications": {
      "eventGrid": {
        "topicEndpoint": "https://topic_name.westus2-1.eventgrid.azure.net/api/events",
        "keySettingName": "EventGridKey",
        "publishRetryCount": 3,
        "publishRetryInterval": "00:00:30",
        "publishEventTypes": [
          "Started",
          "Pending",
          "Failed",
          "Terminated"
        ]
      }
    },
    "maxConcurrentActivityFunctions": 10,
    "maxConcurrentOrchestratorFunctions": 10,
    "extendedSessionsEnabled": false,
    "extendedSessionIdleTimeoutInSeconds": 30,
    "useAppLease": true,
    "useGracefulShutdown": false,
    "maxEntityOperationBatchSize": 50
  }
 }
}
```

# [Durable Functions 1.x](#tab/1x-durable-functions)

```json
{
  "extensions": {
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
      "trackingStoreConnectionStringName": "TrackingStorage",
      "trackingStoreNamePrefix": "DurableTask",
      "traceInputsAndOutputs": false,
      "logReplayEvents": false,
      "eventGridTopicEndpoint": "https://topic_name.westus2-1.eventgrid.azure.net/api/events",
      "eventGridKeySettingName":  "EventGridKey",
      "eventGridPublishRetryCount": 3,
      "eventGridPublishRetryInterval": "00:00:30",
      "eventGridPublishEventTypes": ["Started", "Completed", "Failed", "Terminated"]
    }
  }
}
```
---

Task hub names must start with a letter and consist of only letters and numbers. If not specified, the default task hub name for a function app is **TestHubName**. For  more information, see [Task hubs](../articles/azure-functions/durable/durable-functions-task-hubs.md).

|Property  |Default | Description |
|---------|---------|----------|
|hubName|TestHubName (DurableFunctionsHub if using Durable Functions 1.x)|Alternate [task hub](../articles/azure-functions/durable/durable-functions-task-hubs.md) names can be used to isolate multiple Durable Functions applications from each other, even if they're using the same storage backend.|
|controlQueueBatchSize|32|The number of messages to pull from the control queue at a time.|
|controlQueueBufferThreshold| **Consumption plan for Python**: 32 <br> **Consumption plan for JavaScript and C#**: 128 <br> **Dedicated/Premium plan**: 256 |The number of control queue messages that can be buffered in memory at a time, at which point the dispatcher will wait before dequeuing any additional messages.|
|partitionCount |4|The partition count for the control queue. May be a positive integer between 1 and 16.|
|controlQueueVisibilityTimeout |5 minutes|The visibility timeout of dequeued control queue messages.|
|workItemQueueVisibilityTimeout |5 minutes|The visibility timeout of dequeued work item  queue messages.|
|maxConcurrentActivityFunctions | **Consumption plan**: 10 <br> **Dedicated/Premium plan**: 10X the number of processors on the current machine|The maximum number of activity functions that can be processed concurrently on a single host instance.|
|maxConcurrentOrchestratorFunctions | **Consumption plan**: 5 <br> **Dedicated/Premium plan**: 10X the number of processors on the current machine |The maximum number of orchestrator functions that can be processed concurrently on a single host instance.|
|maxQueuePollingInterval|30 seconds|The maximum control and work-item queue polling interval in the *hh:mm:ss* format. Higher values can result in higher message processing latencies. Lower values can result in higher storage costs because of increased storage transactions.|
|connectionName (2.7.0 and later)<br/>connectionStringName (2.x)<br/>azureStorageConnectionStringName (1.x) |AzureWebJobsStorage|The name of an app setting or setting collection that specifies how to connect to the underlying Azure Storage resources. When a single app setting is provided, it should be an Azure Storage connection string.|
|trackingStoreConnectionName (2.7.0 and later)<br/>trackingStoreConnectionStringName||The name of an app setting or setting collection that specifies how to connect to the History and Instances tables. When a single app setting is provided, it should be an Azure Storage connection string. If not specified, the `connectionStringName` (Durable 2.x) or `azureStorageConnectionStringName` (Durable 1.x) connection is used.|
|trackingStoreNamePrefix||The prefix to use for the History and Instances tables when `trackingStoreConnectionStringName` is specified. If not set, the default prefix value will be `DurableTask`. If `trackingStoreConnectionStringName` is not specified, then the History and Instances tables will use the `hubName` value as their prefix, and any setting for `trackingStoreNamePrefix` will be ignored.|
|traceInputsAndOutputs |false|A value indicating whether to trace the inputs and outputs of function calls. The default behavior when tracing function execution events is to include the number of bytes in the serialized inputs and outputs for function calls. This behavior provides minimal information about what the inputs and outputs look like without bloating the logs or inadvertently exposing sensitive information. Setting this property to true causes the default function logging to log the entire contents of function inputs and outputs.|
|traceReplayEvents|false|A value indicating whether to write orchestration replay events to Application Insights.|
|eventGridTopicEndpoint ||The URL of an Azure Event Grid custom topic endpoint. When this property is set, orchestration life-cycle notification events are published to this endpoint. This property supports App Settings resolution.|
|eventGridKeySettingName ||The name of the app setting containing the key used for authenticating with the Azure Event Grid custom topic at `EventGridTopicEndpoint`.|
|eventGridPublishRetryCount|0|The number of times to retry if publishing to the Event Grid Topic fails.|
|eventGridPublishRetryInterval|5 minutes|The Event Grid publishes retry interval in the *hh:mm:ss* format.|
|eventGridPublishEventTypes||A list of event types to publish to Event Grid. If not specified, all event types will be published. Allowed values include `Started`, `Completed`, `Failed`, `Terminated`.|
|useAppLease|true|When set to `true`, apps will require acquiring an app-level blob lease before processing task hub messages. For more information, see the [disaster recovery and geo-distribution](../articles/azure-functions/durable/durable-functions-disaster-recovery-geo-distribution.md) documentation. Available starting in v2.3.0.
|useLegacyPartitionManagement|false|When set to `false`, uses a partition management algorithm that reduces the possibility of duplicate function execution when scaling out.  Available starting in v2.3.0.|
|useTablePartitionManagement|false|When set to `true`, uses a partition management algorithm designed to reduce costs for Azure Storage V2 accounts. Available starting in v2.10.0.|
|useGracefulShutdown|false|(Preview) Enable gracefully shutting down to reduce the chance of host shutdowns failing in-process function executions.|
|maxEntityOperationBatchSize(2.6.1)|**Consumption plan**: 50 <br> **Dedicated/Premium plan**: 5000|The maximum number of entity operations that are processed as a [batch](../articles/azure-functions/durable/durable-functions-perf-and-scale.md#entity-operation-batching). If set to 1, batching is disabled, and each operation message is processed by a separate function invocation.|

Many of these settings are for optimizing performance. For more information, see [Performance and scale](../articles/azure-functions/durable/durable-functions-perf-and-scale.md).
