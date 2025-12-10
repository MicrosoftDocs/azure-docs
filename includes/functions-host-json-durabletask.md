---
title: include file
description: include file
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 09/29/2025
ms.author: glenga
ms.custom:
  - include file
  - build-2025
  - sfi-ropc-nochange
---

Configuration settings for [Durable Functions](../articles/azure-functions/durable/durable-functions-overview.md).

> [!NOTE]
> All major versions of Durable Functions are supported on all versions of the Azure Functions runtime. However, the schema of the *host.json* configuration differs slightly depending on the version of the Azure Functions runtime and the version of the Durable Functions extension that you use.
>
> The following code provides two examples of `durableTask` settings in *host.json*: one for Durable Functions 2.x and one for Durable Functions 1.x. You can use both examples with Azure Functions 2.0 and 3.0. With Azure Functions 1.0, the available settings are the same, but the `durableTask` section of *host.json* is located in the root of the *host.json* configuration instead of being a field under `extensions`.

# [Durable Functions 2.x](#tab/2x-durable-functions)

<a name="durable-functions-2-0-host-json"></a>

```json
{
 "extensions": {
  "durableTask": {
    "hubName": "MyTaskHub",
    "defaultVersion": "1.0",
    "versionMatchStrategy": "CurrentOrOlder",
    "versionFailureStrategy": "Reject",
    "storageProvider": {
      "connectionStringName": "AzureWebJobsStorage",
      "controlQueueBatchSize": 32,
      "controlQueueBufferThreshold": 256,
      "controlQueueVisibilityTimeout": "00:05:00",
      "FetchLargeMessagesAutomatically": true,
      "maxQueuePollingInterval": "00:00:30",
      "partitionCount": 4,
      "trackingStoreConnectionStringName": "TrackingStorage",
      "trackingStoreNamePrefix": "DurableTask",
      "useLegacyPartitionManagement": false,
      "useTablePartitionManagement": true,
      "workItemQueueVisibilityTimeout": "00:05:00",
      "QueueClientMessageEncoding": "UTF8"
    },
    "tracing": {
      "traceInputsAndOutputs": false,
      "traceReplayEvents": false,
    },
    "httpSettings":{
      "defaultAsyncRequestSleepTimeMilliseconds": 30000,
      "useForwardedHost": false,
    },
    "notifications": {
      "eventGrid": {
        "topicEndpoint": "https://topic_name.westus2-1.eventgrid.azure.net/api/events",
        "keySettingName": "EventGridKey",
        "publishRetryCount": 3,
        "publishRetryInterval": "00:00:30",
        "publishEventTypes": [
          "Started",
          "Completed",
          "Failed",
          "Terminated"
        ]
      }
    },
    "maxConcurrentActivityFunctions": 10,
    "maxConcurrentOrchestratorFunctions": 10,
    "maxConcurrentEntityFunctions": 10,
    "extendedSessionsEnabled": false,
    "extendedSessionIdleTimeoutInSeconds": 30,
    "useAppLease": true,
    "useGracefulShutdown": false,
    "maxEntityOperationBatchSize": 50,
    "maxOrchestrationActions": 100000,
    "storeInputsInOrchestrationHistory": false
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



|Property  |Default value | Description |
|---------|---------|----------|
|hubName|TestHubName (DurableFunctionsHub in v1.x)|The name of the hub that stores the current state of a function app. Task hub names must start with a letter and consist of only letters and numbers. If you don't specify a name, the default value is used. Alternate task hub names can be used to isolate multiple Durable Functions applications from each other, even if they use the same storage back end. For more information, see [Task hubs](../articles/azure-functions/durable/durable-functions-task-hubs.md#task-hub-names).|
|defaultVersion||The default version to assign to new orchestration instances. When you specify a version, new orchestration instances are permanently associated with this version value. This setting is used by the [orchestration versioning](../articles/azure-functions/durable/durable-functions-orchestration-versioning.md) feature to enable scenarios like zero-downtime deployments with breaking changes. You can use any string value for the version.|
|versionMatchStrategy|CurrentOrOlder|A value that specifies how orchestration versions are matched when orchestrator functions are loaded. Valid values are `None`, `Strict`, and `CurrentOrOlder`. For detailed explanations, see [Orchestration versioning](../articles/azure-functions/durable/durable-functions-orchestration-versioning.md).|
|versionFailureStrategy|Reject|A value that specifies what happens when an orchestration version doesn't match the current `defaultVersion` value. Valid values are `Reject` and `Fail`. For detailed explanations, see [Orchestration versioning](../articles/azure-functions/durable/durable-functions-orchestration-versioning.md).|
|controlQueueBatchSize|32|The number of messages to pull from the control queue at a time.|
|controlQueueBufferThreshold|**Consumption plan for Python**: 32 <br> **Consumption plan for other languages**: 128 <br>**Dedicated or Premium plan**: 256|The number of control queue messages that can be buffered in memory at a time. When the specified number is reached, the dispatcher waits before dequeuing any other messages. In some situations, reducing this value can significantly reduce memory consumption.|
|partitionCount |4|The partition count for the control queue. This value must be a positive integer between 1 and 16. Changing this value requires configuring a new task hub.|
|controlQueueVisibilityTimeout |00:05:00|The visibility timeout of dequeued control queue messages in *hh:mm:ss* format.|
|workItemQueueVisibilityTimeout |00:05:00|The visibility timeout of dequeued work item queue messages in *hh:mm:ss* format.|
|FetchLargeMessagesAutomatically|true|A value that specifies whether to retrieve large messages in orchestration status queries. When this setting is `true`, large messages that exceed the queue size limit are retrieved. When this setting is `false`, a blob URL that points to each large message is retrieved.|
|maxConcurrentActivityFunctions |**Consumption plan**: 10 <br>**Dedicated or Premium plan**: 10 times the number of processors on the current machine|The maximum number of activity functions that can be processed concurrently on a single host instance.|
|maxConcurrentOrchestratorFunctions | **Consumption plan**: 5 <br> **Dedicated or Premium plan**: 10 times the number of processors on the current machine |The maximum number of orchestrator functions that can be processed concurrently on a single host instance.|
|maxConcurrentEntityFunctions | **Consumption plan**: 5 <br> **Dedicated or Premium plan**: 10 times the number of processors on the current machine |The maximum number of entity functions that can be processed concurrently on a single host instance. This setting is applicable only when you use the [durable task scheduler](../articles/azure-functions/durable/durable-task-scheduler/durable-task-scheduler.md). Otherwise, the maximum number of concurrent entity executions is limited to the `maxConcurrentOrchestratorFunctions` value.|
|maxQueuePollingInterval|00:00:30|The maximum control and work-item queue polling interval in *hh:mm:ss* format. Higher values can result in higher message processing latencies. Lower values can result in higher storage costs because of increased storage transactions.|
|maxOrchestrationActions|100,000|The maximum number of actions an orchestrator function can perform during a single execution cycle.|
|connectionName (v2.7.0 and later)<br/>connectionStringName (v2.x)<br/>azureStorageConnectionStringName (v1.x) |AzureWebJobsStorage|The name of an app setting or setting collection that specifies how to connect to the underlying Azure Storage resources. When you provide a single app setting, it should be an Azure Storage connection string.|
|trackingStoreConnectionName (v2.7.0 and later)<br/>trackingStoreConnectionStringName||The name of an app setting or setting collection that specifies how to connect to the History and Instances tables, which store the execution history and metadata about orchestration instances. When you provide a single app setting, it should be an Azure Storage connection string. If you don't specify a setting, the `connectionStringName` value (v2.x) or `azureStorageConnectionStringName` value (v1.x) connection is used.|
|trackingStoreNamePrefix||The prefix to use for the History and Instances tables when `trackingStoreConnectionStringName` is specified. If you don't specify a prefix, the default value of `DurableTask` is used. If `trackingStoreConnectionStringName` isn't specified, the History and Instances tables use the `hubName` value as their prefix, and the `trackingStoreNamePrefix` setting is ignored.|
|traceInputsAndOutputs |false|A value that indicates whether to trace the inputs and outputs of function calls. When function execution events are traced, the default behavior is to include the number of bytes in the serialized inputs and outputs for function calls. This behavior provides minimal information about the inputs and outputs so that it doesn't bloat the logs or inadvertently expose sensitive information. When this property is `true`, the entire contents of function inputs and outputs are logged.|
|traceReplayEvents|false|A value that indicates whether to write orchestration replay events to Application Insights.|
|logReplayEvents|false|A value that indicates whether to log replayed executions in application logs.|
|eventGridTopicEndpoint ||The URL of an Azure Event Grid custom topic endpoint. When you set this property, orchestration lifecycle notification events are published to this endpoint. This property supports app settings resolution.|
|eventGridKeySettingName ||The name of the app setting that contains the key used for authenticating with the Event Grid custom topic at the `EventGridTopicEndpoint` URL.|
|eventGridPublishRetryCount|0|The number of times to retry if publishing to the Event Grid topic fails.|
|eventGridPublishRetryInterval|00:05:00|The Event Grid publish-retry interval in *hh:mm:ss* format.|
|eventGridPublishEventTypes||A list of event types to publish to Event Grid. If you don't specify any types, all event types are published. Allowed values include `Started`, `Completed`, `Failed`, and `Terminated`.|
|extendedSessionsEnabled|false|A value that specifies whether session orchestrator and entity function sessions are cached.|
|extendedSessionIdleTimeoutInSeconds|30 |The number of seconds an idle orchestrator or entity function remains in memory before being unloaded. This setting is only used when the `extendedSessionsEnabled` setting is `true`.|
|useAppLease|true|A value that indicates whether apps must acquire an app-level blob lease before processing task hub messages. For more information, see [Disaster recovery and geo-distribution in Durable Functions](../articles/azure-functions/durable/durable-functions-disaster-recovery-geo-distribution.md). This setting is available starting in v2.3.0.|
|useLegacyPartitionManagement|false|A value that specifies the type of partition management algorithm to use. When this setting is `false`, an algorithm is used that reduces the possibility of duplicate function execution when scaling out. This setting is available starting in v2.3.0. **Setting this value to `true` isn't recommended**.|
|useTablePartitionManagement|In v3.x: true<br>In v2.x: false|A value that specifies the type of partition management algorithm to use. When this setting is `true`, an algorithm is used that's designed to reduce costs for Azure Storage v2 accounts. This setting is available starting in WebJobs.Extensions.DurableTask v2.10.0. Using this setting with a managed identity requires WebJobs.Extensions.DurableTask v3.x or later, or Worker.Extensions.DurableTask v1.2.x or later.|
|useGracefulShutdown|false|(Preview) A value that indicates whether to shut down gracefully to reduce the chance of host shutdowns causing in-process function executions to fail.|
|maxEntityOperationBatchSize|**Consumption plan**: 50 <br> **Dedicated or Premium plan**: 5,000|The maximum number of entity operations that are processed as a [batch](../articles/azure-functions/durable/durable-functions-perf-and-scale.md#entity-operation-batching). If this value is 1, batching is disabled, and a separate function invocation processes each operation message. This setting is available starting in v2.6.1.|
|storeInputsInOrchestrationHistory|false|A value that specifies how to store inputs. When this setting is `true`, the Durable Task Framework saves activity inputs in the History table, and activity function inputs appear in orchestration history query results.|
|maxGrpcMessageSizeInBytes|4,194,304|An integer value that sets the maximum size, in bytes, of messages that the generic Remote Procedure Call (gRPC) client can receive. The implementation of `DurableTaskClient` uses the gRPC client to manage orchestration instances. This setting applies to Durable Functions .NET isolated worker and Java apps.|
|grpcHttpClientTimeout|00:01:40|The timeout in *hh:mm:ss* format for the HTTP client used by the gRPC client in Durable Functions. The client is currently supported for .NET isolated worker apps (.NET 6 and later versions) and for Java apps. |
|QueueClientMessageEncoding|UTF8|The encoding strategy for Azure Queue Storage messages. Valid strategies are Unicode Transformation Format–8-bit (UTF8) and Base64. This setting applies when you use Microsoft.Azure.WebJobs.Extensions.DurableTask 3.4.0 or later, or Microsoft.Azure.Functions.Worker.Extensions.DurableTask 1.7.0 or later. |
|defaultAsyncRequestSleepTimeMilliseconds|30000| The default polling interval, in milliseconds, for async HTTP APIs. When a client polls the status of a long-running orchestration using the HTTP status query endpoint, this value determines how long the client should wait before polling again. |
|useForwardedHost| false | When set to true, the extension uses the X-Forwarded-Host and X-Forwarded-Proto headers to construct URLs in HTTP responses. |

Many of these settings are for optimizing performance. For more information, see [Performance and scale](../articles/azure-functions/durable/durable-functions-perf-and-scale.md).
