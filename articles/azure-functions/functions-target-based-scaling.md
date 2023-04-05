---
title: Target-based scaling in Azure Functions
description: Explains target-based scaling behaviors of Consumption plan and Premium plan function apps.
ms.date: 04/04/2023
ms.topic: conceptual
ms.service: azure-functions

---
# Target-based scaling

Target-based scaling provides a fast and intuitive scaling model for customers and is currently supported for the following extensions:

- Service Bus Queues and Topics
- Storage Queues
- Event Hubs
- Cosmos DB

Target-based scaling  replaces the previous Azure Functions incremental scaling model as the default for these extension types. Incremental scaling added or removed a maximum of 1 worker at [each new instance rate](event-driven-scaling.md#understanding-scaling-behaviors), with complex decisions for when to scale. In contrast, target-based scaling allows scale up of 4 instances at a time, and the scaling decision is based on a simple target-based equation:

![Desired instances = event source length / target executions per instance](./media/functions-target-based-scaling/targetbasedscalingformula.png)

The default _target executions per instance_ values come from the SDKs used by the Azure Functions extensions. You don't need to make any changes for target-based scaling to work.

> [!NOTE]
> In order to achieve the most accurate scaling based on metrics, we recommend one target-based triggered function per function app.

## Prerequisites

Target-based scaling is supported for the [Consumption](consumption-plan.md) and [Premium](functions-premium-plan.md) plans. Your function app runtime must be 4.3.0 or higher.

## Opting out
Target-based scaling is on by default for apps on the Consumption plan or Premium plans without runtime scale monitoring. If you wish to disable target-based scaling and revert to incremental scaling, add the following app setting to your function app:

|          App Setting          | Value |
| ----------------------------- | ----- |
|`TARGET_BASED_SCALING_ENABLED` |   0   |

## Customizing target-based scaling

You can make the scaling behavior more or less aggressive based on your app's workload by adjusting _target executions per instance_. Each extension has different settings that you can use to set _target executions per instance_. 

This table summarizes the `host.json` values that are used for the _target executions per instance_ values and the defaults:

| Extension                                                      | host.json values                                                  | Default Value |
| -------------------------------------------------------------- | ----------------------------------------------------------------- | ------------- |
| Service Bus (Extension v5.x+, Single Dispatch)                 | extensions.serviceBus.maxConcurrentCalls                          |       16      |
| Service Bus (Extension v5.x+, Single Dispatch Sessions Based)  | extensions.serviceBus.maxConcurrentSessions                       |       8       |
| Service Bus (Extension v5.x+, Batch Processing)                | extensions.serviceBus.maxMessageBatchSize                         |       1000    |
| Service Bus (Functions v2.x+, Single Dispatch)                 | extensions.serviceBus.messageHandlerOptions.maxConcurrentCalls    |       16      |
| Service Bus (Functions v2.x+, Single Dispatch Sessions Based)  | extensions.serviceBus.sessionHandlerOptions.maxConcurrentSessions |       2000    |
| Service Bus (Functions v2.x+, Batch Processing)                | extensions.serviceBus.batchOptions.maxMessageCount                |       1000    |
| Event Hubs (Extension v5.x+)                                   | extensions.eventHubs.maxEventBatchSize                            |       10      |
| Event Hubs (Extension v3.x+)                                   | extensions.eventHubs.eventProcessorOptions.maxBatchSize           |       10      |
| Event Hubs (if defined)                                        | extensions.eventHubs.targetUnprocessedEventThreshold              |       n/a     |
| Storage Queue                                                  | extensions.queues.batchSize                                       |       16      |

For Cosmos DB _target executions per instance_ is set in the function attribute:

| Extension   | Function trigger setting | Default Value | 
| ------------| ------------------------ | ------------- |
| Cosmos DB   | maxItemsPerInvocation    |  100          |

See [Details per extension](#details-per-extension) for example configurations of the supported extensions.

## Premium plan with runtime scale monitoring enabled
In [runtime scale monitoring](functions-networking-options.md?tabs=azure-cli#premium-plan-with-virtual-network-triggers), the extensions handle target-based scaling. Hence, in addition to the function app runtime version requirement, your extension packages must meet the following minimum versions:

| Extension Name | Minimum Version Needed | 
| -------------- | ---------------------- |
| Storage Queue  |         5.1.0          |
| Event Hubs     |         5.2.0          |
| Service Bus    |         5.9.0          |
| Cosmos DB      |         4.1.0          |

Additionally, target-based scaling is currently an **opt-in** feature with runtime scale monitoring. In order to use target-based scaling with the Premium plan when runtime scale monitoring is enabled, add the following app setting to your function app:

|          App Setting          | Value |
| ----------------------------- | ----- |
|`TARGET_BASED_SCALING_ENABLED` |   1   |

## Dynamic concurrency support
Target-based scaling introduces faster scaling, and uses defaults for _target executions per instance_. When using Service Bus or Storage queues you also have the option of enabling [dynamic concurrency](functions-concurrency.md#dynamic-concurrency). In this configuration, the _target executions per instance_ value is determined automatically by the dynamic concurrency feature. It starts with limited concurrency and identifies the best setting over time.

## Details per extension
### Service Bus queues and topics

The Service Bus extension support three execution models, determined by the `IsBatched` and `IsSessionsEnabled` attributes of your Service Bus trigger. The default value for `IsBatched` and `IsSessionsEnabled` is `false`.

|                                            | IsBatched | IsSessionsEnabled | Concurrency Setting Used for target-based scaling |
| ------------------------------------------ | --------- | ----------------- | ------------------------------------------------- |
| Single Dispatch Processing                 | false     | false             | maxConcurrentCalls                                |
| Single Dispatch Processing (Session Based) | false     | true              | maxConcurrentSessions                             |
| Batch Processing                           | true      | false             | maxMessageBatchSize or maxMessageCount            |

> [!NOTE]
> **Scale efficiency:** For the Service Bus extension, use _Manage_ rights on resources for the most efficient scaling. With _Listen_ rights scaling will revert to incremental scale because the queue or topic length can't be used to inform scaling decisions. To learn more about setting rights in Service Bus access policies, see [Shared Access Authorization Policy](../service-bus-messaging/service-bus-sas.md#shared-access-authorization-policies).


#### Single Dispatch Processing
In this model, each invocation of your function processes a single message. The `maxConcurrentCalls` setting governs concurrency.

For **v5.x+** of the Service Bus extension, modify the `host.json` setting `maxConcurrentCalls`:
```json
{
    "version": "2.0",
    "extensions": {
        "serviceBus": {
            "maxConcurrentCalls": 16
        }
    }
}
```

For Functions host **v2.x+**, modify the `host.json` setting `maxConcurrentCalls` in `messageHandlerOptions`:
```json
{
    "version": "2.0",
    "extensions": {
        "serviceBus": {
            "messageHandlerOptions": {
                "maxConcurrentCalls": 16
            }
        }
    }
}
```
#### Single Dispatch Processing (Session Based)
In this model, each invocation of your function processes a single message. However, depending on the number of active sessions for your Service Bus topic or queue, each instance leases one or more sessions.
For **v5.x+** of the Service Bus extension, modify the `host.json` setting `maxConcurrentSessions`:
```json
{
    "version": "2.0",
    "extensions": {
        "serviceBus": {
            "maxConcurrentSessions": 8
        }
    }
}
```
For Functions host **v2.x+**, modify the `host.json` setting `maxConcurrentSessions` in `sessionHandlerOptions`:
```json
{
    "version": "2.0",
    "extensions": {
        "serviceBus": {
            "sessionHandlerOptions": {
                "maxConcurrentSessions": 2000
            }
        }
    }
}
```
#### Batch Processing
In this model, each invocation of your function processes a batch of messages.

For **v5.x+** of the Service Bus extension, modify the `host.json` setting `maxMessageBatchSize`:
```json
{
    "version": "2.0",
    "extensions": {
        "serviceBus": {
            "maxMessageBatchSize": 1000
        }
    }
}
```
For Functions host **v2.x+**, modify the `host.json` setting `maxMessageCount` in `batchOptions`:
```json
{
    "version": "2.0",
    "extensions": {
        "serviceBus": {
            "batchOptions": {
                "maxMessageCount": 1000
            }
        }
    }
}
```

### Event Hubs
For Event Hubs, Azure Functions scales based on the number of unprocessed events distributed across all the partitions in the hub. By default, the `host.json` attributes used are `maxEventBatchSize` and `maxBatchSize`. However, if you wish to fine-tune target-based scaling, you can define a separate parameter `targetUnprocessedEventThreshold` that overrides the target value without changing the batch settings. If `targetUnprocessedEventThreshold` is set, the total unprocessed event count is divided by this value to determine the number of instances, which is then be rounded up to a worker instance count that creates a balanced partition distribution.

> [!NOTE]
> Since Event Hubs is a partitioned workload, the target instance count for Event Hubs is capped by the number of partitions in your Event Hub. 

For **v5.x+** of the Event Hubs extension, modify the `host.json` setting `maxEventBatchSize`:
```json
{
    "version": "2.0",
    "extensions": {
        "eventHubs": {
            "maxEventBatchSize" : 10
        }
    }
}
```

For **v3.x+** of the Event Hubs extension, modify the `host.json` setting `maxBatchSize` under `eventProcessorOptions`:
```json
{
    "version": "2.0",
    "extensions": {
        "eventHubs": {
            "eventProcessorOptions": {
                "maxBatchSize": 10
            }
        }
    }
}
```

If defined, `targetUnprocessedEventThreshold` in `host.json` will be used as the target value instead of `maxBatchSize` or `maxEventBatchSize`:
```json
{
    "version": "2.0",
    "extensions": {
        "eventHubs": {
            "targetUnprocessedEventThreshold": 23
        }
    }
}
```

### Storage Queues
For **v2.x**+ of the Storage extension, modify the `host.json` setting `batchSize`:
```json
{
    "version": "2.0",
    "extensions": {
        "queues": {
            "batchSize": 16
        }
    }
}
```

### Cosmos DB

Cosmos DB uses a function-level attribute, `MaxItemsPerInvocation`. Modify this in `function.json`, or directly in the trigger definition:
```C#
namespace CosmosDBSamplesV2
{
    public static class CosmosTrigger
    {
        [FunctionName("CosmosTrigger")]
        public static void Run([CosmosDBTrigger(
            databaseName: "ToDoItems",
            collectionName: "Items",
            MaxItemsPerInvocation: 100,
            ConnectionStringSetting = "CosmosDBConnection",
            LeaseCollectionName = "leases",
            CreateLeaseCollectionIfNotExists = true)]IReadOnlyList<Document> documents,
            ILogger log)
        {
            if (documents != null && documents.Count > 0)
            {
                log.LogInformation($"Documents modified: {documents.Count}");
                log.LogInformation($"First document Id: {documents[0].Id}");
            }
        }
    }
}

```
Sample `bindings` section of a `function.json` with `MaxItemsPerInvocation` defined:
```json
{
  "bindings": [
    {
      "type": "cosmosDBTrigger",
      "maxItemsPerInvocation": 100,
      "connection": "MyCosmosDb",
      "leaseContainerName": "leases",
      "containerName": "collectionName",
      "databaseName": "databaseName",
      "leaseDatabaseName": "databaseName",
      "createLeaseContainerIfNotExists": false,
      "startFromBeginning": false,
      "name": "input"
    }
  ]
}
```
> [!NOTE]
> Since Cosmos DB is a partitioned workload, the target instance count for Cosmos DB is capped by the number of physical partitions in your Cosmos DB. For further documentation on Cosmos DB scaling, please see notes on [physical partitions](../cosmos-db/nosql/change-feed-processor.md#dynamic-scaling) and [lease ownership](../cosmos-db/nosql/change-feed-processor.md#dynamic-scaling).