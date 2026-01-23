---
title: Azure Functions KEDA scaling mappings on Container Apps
description: Learn how Azure Functions trigger parameters map to KEDA scaling parameters for autoscaling in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: reference
ms.date: 01/15/2026
ms.author: cshoe
---

# Azure Functions KEDA scaling mappings on Container Apps

When you deploy Azure Functions on Azure Container Apps, the platform automatically translates your Functions trigger parameters into KEDA scaling configurations. This translation ensures that your Functions scale appropriately based on the incoming workload from various event sources.

## How scaling mappings work

Azure Functions on Container Apps uses KEDA to monitor event sources and scale your function apps. The platform automatically:

1. **Translates Functions parameters**: Converts your Functions trigger configuration (from `host.json` or trigger attributes) into KEDA scaler metadata.

1. **Applies scaling rules**: Uses the translated parameters to create appropriate KEDA scaling rules.

1. **Monitors events**: KEDA continuously monitors your event sources based on these rules.

1. **Scales instances**: Automatically scales your container instances up or down based on workload.

The following sections detail the specific parameter mappings for each trigger type.

## Scaling parameters

The following sections detail how Azure Functions trigger parameters map to their corresponding KEDA scaler configurations for each supported trigger type.

### Azure Storage Queue

The following table shows how [Azure Storage Queue trigger parameters](/azure/azure-functions/functions-bindings-storage-queue) map to the [KEDA scaler configuration values](https://keda.sh/docs/scalers/azure-storage-queue/).

| Parameter | Functions Configuration | KEDA Configuration |
|--|--|--|
| **Parameter name** | `batchSize` | `queueLength` |
| **Configuration path** | `extensions.queues.batchSize` (host.json) | `metadata.queueLength` |
| **Default value** | 16 | 5 |

| Functions trigger description | KEDA scaler description |
|---|---|
| The number of queue messages that the Functions runtime retrieves and processes in parallel. When the number being processed reaches the `newBatchThreshold`, the runtime fetches another batch. The maximum number of concurrent messages per function is `batchSize` plus `newBatchThreshold`. Set `batchSize` to 1 to eliminate concurrency unless the app scales out to multiple VMs. The maximum `batchSize` is 32. | Target value for queue length passed to the scaler. For example, if one pod can handle 10 messages, set the queue length target to 10. If the actual number of messages in the queue is 30, the scaler scales to three pods. |

#### Translation logic

`metadata.queueLength` = `extensions.queues.batchSize`

### Azure Service Bus (single dispatch)

The following table shows how [Azure Service Bus trigger parameters](/azure/azure-functions/functions-bindings-service-bus) map to the [KEDA scaler configuration values](https://keda.sh/docs/scalers/azure-service-bus/).

| Parameter | Functions Configuration | KEDA Configuration |
|--|--|--|
| **Parameter name** | `maxConcurrentCalls` | `messageCount` |
| **Configuration path** | `extensions.serviceBus.maxConcurrentCalls` (host.json) | `metadata.messageCount` |
| **Default value** | 16 | 5 |

| Functions trigger description | KEDA scaler description |
|---|---|
| Limits the maximum number of concurrent calls per scaled instance. For multicore instances, the maximum is multiplied by the number of cores. Use this setting only when `isSessionsEnabled` is false. | Number of active messages in your Azure Service Bus queue or topic to scale on. |

#### Translation logic

`metadata.messageCount` = `extensions.serviceBus.maxConcurrentCalls`

### Azure Service Bus (sessions-based)

The following table shows how [Azure Event Hubs trigger parameters](/azure/azure-functions/functions-bindings-service-bus) map to the [KEDA scaler configuration values](https://keda.sh/docs/scalers/azure-service-bus/).

| Parameter | Functions Configuration | KEDA Configuration |
|--|--|--|
| **Parameter name** | `maxMessageBatchSize` | `messageCount` |
| **Configuration path** | `extensions.serviceBus.maxMessageBatchSize` (host.json) | `metadata.messageCount` |
| **Default value** | 1000 | 5 |

| Functions trigger description | KEDA scaler description |
|---|---|
| Maximum number of messages passed to each function call for batch processing. | Number of active messages in your Azure Service Bus queue or topic to scale on. |

#### Translation logic

`metadata.messageCount` = `extensions.serviceBus.maxMessageBatchSize`

### Azure Event Hubs

The following table shows how [Azure Event Hubs trigger parameters](/azure/azure-functions/functions-bindings-event-hubs) map to the [KEDA scaler configuration values](https://keda.sh/docs/scalers/azure-event-hub/).

| Parameter | Functions Configuration | KEDA Configuration |
|--|--|--|
| **Parameter name** | `targetUnprocessedEventThreshold` | `unprocessedEventThreshold` |
| **Configuration path** | `extensions.eventHubs.targetUnprocessedEventThreshold` (host.json) | `metadata.unprocessedEventThreshold` |
| **Default value** | null | 64 |

| Functions trigger description | KEDA scaler description |
|---|---|
| Desired number of unprocessed events per function instance. Used for target-based scaling. | Average target value to trigger scaling actions. |

#### Translation logic

`metadata.unprocessedEventThreshold` = `extensions.eventHubs.targetUnprocessedEventThreshold`

### Apache Kafka

The following table shows how [Apache Kafka trigger parameters](/azure/azure-functions/functions-bindings-kafka-trigger) map to the [KEDA scaler configuration values](https://keda.sh/docs/scalers/apache-kafka/).

| Parameter | Functions Configuration | KEDA Configuration |
|--|--|--|
| **Parameter name** | `LagThreshold` | `lagThreshold` |
| **Configuration path** | Function trigger attribute | `metadata.lagThreshold` |
| **Default value** | 1000 | 10 |

| Functions trigger description | KEDA scaler description |
|---|---|
| Use this value as the target executions per instance for the Kafka trigger. The number of desired instances is calculated based on the total consumer lag divided by `LagThreshold`. |
Use this value as the target for the total lag (sum of all partition lags) to trigger scaling actions. |

#### Example

```csharp
[KafkaTrigger(
  "BrokerList",
  "topic",
  ConsumerGroup = "$Default",
  LagThreshold = 100)]
```

#### Translation logic

`metadata.lagThreshold` = `LagThreshold`

### Azure Cosmos DB

The [Azure Cosmos DB trigger](/azure/azure-functions/functions-bindings-cosmosdb-v2-trigger) doesn't map to a KEDA scaler. Use custom scaling instead.

The Functions trigger sets the maximum number of items received per function call. Transaction scope is preserved for stored procedures.

| Parameter | Functions Configuration | KEDA Configuration |
|--|--|--|
| **Parameter name** | `MaxItemsPerInvocation` | N/A |
| **Configuration path** | Function trigger attribute | N/A |
| **Default value** | 100 | N/A |

#### Example

```csharp
[CosmosDBTrigger(
  databaseName: "ToDoItems",
  containerName: "Items",
  Connection = "CosmosDBConnection",
  MaxItemsPerInvocation = 100)]
```

### HTTP trigger

The [HTTP trigger](/azure/azure-functions/functions-bindings-http-webhook) doesn't map to a KEDA scaler. Instead, use the Container Apps built-in HTTP scaling capabilities or external monitoring solutions.

| Parameter | Functions Configuration | KEDA Configuration |
|--|--|--|
| **Parameter name** | `maxConcurrentRequests` | N/A |
| **Configuration path** | `extensions.http.maxConcurrentRequests` (host.json) | N/A |
| **Default value** | 100 (Consumption), -1 (Premium/Dedicated) | N/A |

### Blob storage trigger

The following table shows how [Azure Blob Storage trigger parameters](/azure/azure-functions/functions-bindings-storage-blob) map to the [KEDA scaler configuration values](https://keda.sh/docs/scalers/azure-storage-blob/).

| Parameter | Functions Configuration | KEDA Configuration |
|--|--|--|
| **Parameter name** | `maxDegreeOfParallelism` | `blobCount` |
| **Configuration path** | `extensions.blobs.maxDegreeOfParallelism` (host.json) | `metadata.blobCount` |
| **Default value** | 8 × number of available cores | 5 |

| Functions trigger description | KEDA scaler description |
|---|---|
| Sets the number of concurrent invocations allowed for all blob-triggered functions in a function app. Minimum value: 1. | Average target value to trigger scaling actions. (Default: 5, Optional) |

#### Translation logic

`metadata.blobCount` = `extensions.blobs.maxDegreeOfParallelism`

### Event Grid

The [Azure Event Grid trigger parameters](/azure/azure-functions/functions-bindings-event-grid) don't map to a KEDA scaler.

The Event Grid trigger uses a webhook HTTP request. You configure this request by using the same `host.json` settings as the HTTP trigger. These settings control parallel execution for resource management.

### RabbitMQ trigger

The following table shows how [RabbitMQ trigger parameters](/azure/azure-functions/functions-bindings-rabbitmq) map to the [KEDA scaler configuration values](https://keda.sh/docs/scalers/rabbitmq-queue/).

| Parameter | Functions Configuration | KEDA Configuration |
|--|--|--|
| **Parameter name** | `prefetchCount` | `value` |
| **Configuration path** | `extensions.rabbitMQ.prefetchCount` (host.json) | `metadata.value` |
| **Default value** | 30 | 100.50 |

| Functions trigger description | KEDA scaler description |
|---|---|
| Number of messages the receiver can simultaneously request and cache. | Message backlog or publish/sec rate to trigger scaling. In QueueLength mode, the value represents the target queue length for scaling. |

#### Translation logic

`metadata.value` = `extensions.rabbitMQ.prefetchCount`

## Related content

- [Azure Functions on Container Apps overview](functions-overview.md)
- [Deploy Azure Functions on Container Apps](get-started.md)
- [KEDA scalers documentation](https://keda.sh/docs/latest/scalers/)
- [Azure Functions host.json reference](../azure-functions/functions-host-json.md)
