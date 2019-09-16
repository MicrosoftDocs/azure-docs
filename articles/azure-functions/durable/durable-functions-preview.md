---
title: Durable Functions preview features - Azure Functions
description: Learn about preview features for Durable Functions.
services: functions
author: cgillum
manager: jeconnoc
keywords:
ms.service: azure-functions
ms.topic: article
ms.date: 09/04/2019
ms.author: azfuncdf
---

# Durable Functions 2.0 preview (Azure Functions)

*Durable Functions* is an extension of [Azure Functions](../functions-overview.md) and [Azure WebJobs](../../app-service/web-sites-create-web-jobs.md) that lets you write stateful functions in a serverless environment. The extension manages state, checkpoints, and restarts for you. If you are not already familiar with Durable Functions, see the [overview documentation](durable-functions-overview.md).

Durable Functions 1.x is a GA (Generally Available) feature of Azure Functions, but also contains several subfeatures that are currently in public preview. This article describes newly released preview features and goes into details on how they work and how you can start using them.

> [!NOTE]
> These preview features are part of a Durable Functions 2.0 release, which is currently a **preview quality release** with several breaking changes. The Azure Functions Durable extension package builds can be found on nuget.org with versions in the form of **2.0.0-betaX**. These builds are not intended for production workloads, and subsequent releases may contain additional breaking changes.

## Breaking changes

Several breaking changes are introduced in Durable Functions 2.0. Existing applications are not expected to be compatible with Durable Functions 2.0 without code changes. This section lists some of the changes:

### Host.json schema

The following snippet shows the new schema for host.json. The main changes to be aware of are the new subsections:

* `"storageProvider"` (and the `"azureStorage"` subsection) for storage-specific configuration
* `"tracking"` for tracking and logging configuration
* `"notifications"` (and the `"eventGrid"` subsection) for event grid notification configuration

```json
{
  "version": "2.0",
  "extensions": {
    "durableTask": {
      "hubName": <string>,
      "storageProvider": {
        "azureStorage": {
          "connectionStringName": <string>,
          "controlQueueBatchSize": <int?>,
          "partitionCount": <int?>,
          "controlQueueVisibilityTimeout": <hh:mm:ss?>,
          "workItemQueueVisibilityTimeout": <hh:mm:ss?>,
          "trackingStoreConnectionStringName": <string?>,
          "trackingStoreNamePrefix": <string?>,
          "maxQueuePollingInterval": <hh:mm:ss?>
        }
      },
      "tracking": {
        "traceInputsAndOutputs": <bool?>,
        "traceReplayEvents": <bool?>,
      },
      "notifications": {
        "eventGrid": {
          "topicEndpoint": <string?>,
          "keySettingName": <string?>,
          "publishRetryCount": <string?>,
          "publishRetryInterval": <hh:mm:ss?>,
          "publishRetryHttpStatus": <int[]?>,
          "publishEventTypes": <string[]?>,
        }
      },
      "maxConcurrentActivityFunctions": <int?>,
      "maxConcurrentOrchestratorFunctions": <int?>,
      "extendedSessionsEnabled": <bool?>,
      "extendedSessionIdleTimeoutInSeconds": <int?>,
      "customLifeCycleNotificationHelperType": <string?>
  }
}
```

As Durable Functions 2.0 continues to stabilize, more changes will be introduced to the `durableTask` section host.json. For more information on these changes, see [this GitHub issue](https://github.com/Azure/azure-functions-durable-extension/issues/641).

### Public interface changes

The various "context" objects supported by Durable Functions had abstract base classes intended for use in unit testing. As part of Durable Functions 2.0, these abstract base classes have been replaced with interfaces. Function code that uses the concrete types directly are not affected.

The following table represents the main changes:

| Old type | New type |
|----------|----------|
| DurableOrchestrationClientBase | IDurableOrchestrationClient |
| DurableOrchestrationContextBase | IDurableOrchestrationContext |
| DurableActivityContextBase | IDurableActivityContext |
| OrchestrationClientAttribute | DurableClientAttribute |

In the case where an abstract base class contained virtual methods, these virtual methods have been replaced by extension methods defined in `DurableContextExtensions`.

## Entity functions

Starting in Durable Functions v2.0.0-alpha, we've introduced a new [entity functions](durable-functions-entities.md) concept.

Entity functions define operations for reading and updating small pieces of state, known as *durable entities*. Like orchestrator functions, entity functions are functions with a special trigger type, *entity trigger*. Unlike orchestrator functions, entity functions do not have any specific code constraints. Entity functions also manage state explicitly rather than implicitly representing state via control flow.

Based on initial user feedback, we later added support for a class-based programming model for entities in Durable Functions v2.0.0-beta1.

To learn more, see the [entity functions](durable-functions-entities.md) article.

## Durable HTTP

Starting in Durable Functions v2.0.0-beta2, we've introduced a new [Durable HTTP](durable-functions-http-features.md) feature that allows you to:

* Call HTTP APIs directly from orchestration functions (with some documented limitations)
* Implements automatic client-side HTTP 202 status polling
* Built-in support for [Azure Managed Identities](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview)

To learn more, see the [HTTP features](durable-functions-http-features.md#consuming-http-apis) article.

## Alternate storage providers

The Durable Task Framework supports multiple storage providers today, including [Azure Storage](https://github.com/Azure/durabletask/tree/master/src/DurableTask.AzureStorage), [Azure Service Bus](https://github.com/Azure/durabletask/tree/master/src/DurableTask.ServiceBus), an [in-memory emulator](https://github.com/Azure/durabletask/tree/master/src/DurableTask.Emulator), and an experimental [Redis](https://github.com/Azure/durabletask/tree/redis/src/DurableTask.Redis) provider. However, until now, the Durable Task extension for Azure Functions only supported the Azure Storage provider. Starting with Durable Functions 2.0, support for alternate storage providers is being added, starting with the Redis provider.

> [!NOTE]
> Durable Functions 2.0 only supports .NET Standard 2.0-compatible providers.

### Emulator

The [DurableTask.Emulator](https://www.nuget.org/packages/Microsoft.Azure.DurableTask.Emulator/) provider is a local memory, non-durable storage provider suitable for local testing scenarios. It can be configured using the following minimal **host.json** schema:

```json
{
  "version": "2.0",
  "extensions": {
    "durableTask": {
      "hubName": <string>,
      "storageProvider": {
        "emulator": { "enabled": true }
      }
    }
  }
}
```

### Redis (experimental)

The [DurableTask.Redis](https://www.nuget.org/packages/Microsoft.Azure.DurableTask.Redis/) provider persists all orchestration state to a configured Redis cluster.

```json
{
  "version": "2.0",
  "extensions": {
    "durableTask": {
      "hubName": <string>,
      "storageProvider": {
        "redis": {
          "connectionStringName": <string>,
        }
      }
    }
  }
}
```

The `connectionStringName` must reference the name of an app setting or environment variable. That app setting or environment variable should contain a Redis connection string value in the form of *server:port*. For example, `localhost:6379` for connecting to a local Redis cluster.

> [!NOTE]
> The Redis provider is currently experimental and only supports function apps running on a single node. It is not guaranteed that the Redis provider will ever be made generally available, and it may be removed in a future release.
