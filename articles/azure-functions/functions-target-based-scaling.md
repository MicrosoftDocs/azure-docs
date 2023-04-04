---
title: Target Based Scaling in Azure Functions
description: Explains target based scaling behaviors of Consumption plan and Premium plan function apps.
ms.date: 04/04/2023
ms.topic: conceptual
ms.service: azure-functions

---
# Target Based Scaling

Target Based Scaling provides a fast and intuitive scaling model for customers and is currently supported for the following extensions:

- Service Bus Queues and Topics
- Storage Queues
- Event Hubs
- Cosmos DB

It replaces the previous incremental scaling model as the default for these extension types. Incremental scaling allowed a maximum of 1 worker to be added or removed at [each new instance rate](event-driven-scaling.md#understanding-scaling-behaviors) and used more complicated heuristics for deciding when to scale out and scale in, so scaling was much less reactive. In contrast, Target Based Scaling allows simultaneous scale out of up to 4 instances and the total number of instances the function app will try to scale to is the length of your event source divided by the target number of executions per instance:

$$ desiredWorkers = \lceil  \frac{eventsourceLength}{targetExecutionsPerInstance} \rceil $$

Target Based Scaling is supported for the [Consumption](consumption-plan.md) and [Premium](functions-premium-plan.md) plans. Your function app runtime must be 4.3.0 or higher.

> [!NOTE]
> In order to achieve the most accurate scaling based on metrics, we recommend one trigger type per function app.

## Customizing Target Based Scaling

The defaults are the same as set by the SDKs used by the Azure Functions extensions and you don't need to make any changes to your applications for Target Based Scaling to work. But to achieve a desired scale behavior for your app's workload, you can adjust _targetExecutionsPerInstance_ for each extension type. For example, Storage Queues use the `batchSize` defined in host.json as the _targetExecutionsPerInstance_.

 This table summarizes the `host.json` values that are used for target based scaling and the default values for each extension type:

| Extension                                 | host.json values                                                  | Default Value |
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

For the Cosmos DB extension, the target is set in the a function attribute:

| Extension   | Function trigger setting | Default Value | 
| ------------| ------------------------ | ------------- |
| Cosmos DB   | maxItemsPerInvocation    |  100          |

The following section explains how to configure the target for each of the supported extensions.

## Details per Extension
### Service Bus Queues and Topics

The Service Bus extension support three execution models, which are determined by the `IsBatched` and `IsSessionsEnabled` attributes of your Service Bus trigger. The default value for `IsBatched` and `IsSessionsEnabled` is `false`, which means your Service Bus trigger is using Single Dispatch Processing if you haven't done any additional configuration.

|                                            | IsBatched | IsSessionsEnabled | Concurrency Setting Used for Target Based Scaling |
| ------------------------------------------ | --------- | ----------------- | ------------------------------------------------- |
| Single Dispatch Processing                 | false     | false             | maxConcurrentCalls                                |
| Single Dispatch Processing (Session Based) | false     | true              | maxConcurrentSessions                             |
| Batch Processing                           | true      | false             | maxMessageBatchSize or maxMessageCount            |

> [!NOTE]
> **Scale efficiency:** For the Service Bus extension, use _Manage_ rights on resources for the most efficient scaling. With _Listen_ rights, scaling isn't as accurate because the queue length can't be used to inform scaling decisions. To learn more about setting rights in Service Bus access policies, see [Shared Access Authorization Policy](../service-bus-messaging/service-bus-sas.md#shared-access-authorization-policies).


#### Single Dispatch Processing
In this model, each invocation of your function processes a single message. Concurrency is governed by the `maxConcurrentCalls` setting.

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
For Event Hubs, Azure Functions scales based on the number of unprocessed events distributed across all the partitions in the hub. By default, the `host.json` attributes used are `maxEventBatchSize` and `maxBatchSize`. However, if you wish to fine-tune target based scaling, you can define a separate parameter `targetUnprocessedEventThreshold`. This will override the target value. If `targetUnprocessedEventThreshold` is set, the total unprocessed event count will be divided by this value to determine the number of instances, which will then be rounded up to a worker instance count that creates a balanced partition distribution.

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

Cosmos DB uses a function-level attribute, `MaxItemsPerInvocation`. You can modify this in the `function.json`, or directly in the trigger definition:
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
> Since Cosmos DB is a partitioned workload, the target instance count for Cosmos DB is capped by the number of physical partitions in your Cosmos DB. For further documentation on Cosmos DB scaling, please see notes on [physical partitions](../cosmos-db/nosql/change-feed-processor.md?tabs=dotnet#dynamic-scaling:~:text=We%20see%20that,a%20lease%20document) and [lease ownership](../cosmos-db/nosql/change-feed-processor.md?tabs=dotnet#dynamic-scaling:~:text=One%20lease%20can%20only%20be%20owned%20by%20one%20instance%20at%20a%20given%20time%2C%20so%20the%20number%20of%20instances%20should%20not%20be%20greater%20than%20the%20number%20of%20leases.).

## Opting Out
Target Based Scaling is an opt-out feature except for function apps on the the Premium plan with Runtime Scale Monitoring enabled. This means it is on by default for the Functions Consumption plan, and Premium plans without Runtime Scale Monitoring. If you wish to disable Target Based Scaling and revert to incremental scaling, add the following app setting to your function app:

|          App Setting          | Value |
| ----------------------------- | ----- |
|`TARGET_BASED_SCALING_ENABLED` |   0   |

## Premium Plans with Runtime Scale Monitoring Enabled
In [Runtime Scale Monitoring](functions-networking-options.md?tabs=azure-cli#premium-plan-with-virtual-network-triggers), Target Based Scaling is handled by the extensions. Hence, in addition to the function app runtime requirement above, your extension packages must meet the following requirements:

| Extension Name | Minimum Version Needed | 
| -------------- | ---------------------- |
| Storage Queue  |         5.1.0          |
| Event Hubs     |         5.2.0          |
| Service Bus    |         5.9.0          |
| Cosmos DB      |         4.1.0          |

Additionally, Target Based Scaling is currently an **opt-in** feature for this configuration. In order to use Target Based Scaling with the Premium plan when Runtime Scale Monitoring is enabled, add the following app setting to your function app:

|          App Setting          | Value |
| ----------------------------- | ----- |
|`TARGET_BASED_SCALING_ENABLED` |   1   |

## Dynamic Concurrency Support
Target Based Scaling introduces faster scale out and in, and uses defaults for the targets. When using Service Bus or Storage queues with Target Based Scaling, you have the option of enabling [Dynamic Concurrency](functions-concurrency.md#dynamic-concurrency). In this configuration, the target metric will be determined automatically by Dynamic Concurrency feature over time, instead of the `host.json` and function attributes defined above.