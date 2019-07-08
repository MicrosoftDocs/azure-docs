---
title: Durable Functions preview features - Azure Functions
description: Learn about preview features for Durable Functions.
services: functions
author: cgillum
manager: jeconnoc
keywords:
ms.service: azure-functions
ms.devlang: multiple
ms.topic: article
ms.date: 04/23/2019
ms.author: azfuncdf
---

# Durable Functions 2.0 preview (Azure Functions)

*Durable Functions* is an extension of [Azure Functions](../functions-overview.md) and [Azure WebJobs](../../app-service/web-sites-create-web-jobs.md) that lets you write stateful functions in a serverless environment. The extension manages state, checkpoints, and restarts for you. If you are not already familiar with Durable Functions, see the [overview documentation](durable-functions-overview.md).

Durable Functions is a GA (Generally Available) feature of Azure Functions, but also contains several subfeatures that are currently in public preview. This article describes newly released preview features and goes into details on how they work and how you can start using them.

> [!NOTE]
> These preview features are part of a Durable Functions 2.0 release, which is currently an **alpha quality release** with several breaking changes. The Azure Functions Durable extension package builds can be found on nuget.org with versions in the form of **2.0.0-alpha**. These builds are not suitable for any production workloads, and subsequent releases may contain additional breaking changes.

## Breaking changes

Several breaking changes are introduced in Durable Functions 2.0. Existing applications are not expected to be compatible with Durable Functions 2.0 without code changes. This section lists some of the changes:

### Dropping .NET Framework support

Support for .NET Framework (and therefore Functions 1.0) has been dropped for Durable Functions 2.0. The primary reason is to enable non-Windows contributors to easily build and test changes they make to Durable Functions from macOS and Linux platforms. The secondary reason is to help encourage developers to move to the latest version of the Azure Functions runtime.

### Host.json schema

The following snippet shows the new schema for host.json. The main change to be aware of is the new `"storageProvider"` section, and the `"azureStorage"` section underneath it. This change was done to support [alternate storage providers](durable-functions-preview.md#alternate-storage-providers).

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
      "maxConcurrentActivityFunctions": <int?>,
      "maxConcurrentOrchestratorFunctions": <int?>,
      "traceInputAndOutputs": <bool?>,
      "eventGridTopicEndpoint": <string?>,
      "eventGridKeySettingName": <string?>,
      "eventGridPublishRetryCount": <string?>,
      "eventGridPublishRetryInterval": <hh:mm:ss?>,
      "eventGridPublishRetryHttpStatus": <int[]?>,
      "eventgridPublishEventTypes": <string[]?>,
      "customLifeCycleNotificationHelperType"
      "extendedSessionsEnabled": <bool?>,
      "extendedSessionIdleTimeoutInSeconds": <int?>,
      "logReplayEvents": <bool?>
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

In the case where an abstract base class contained virtual methods, these virtual methods have been replaced by extension methods defined in `DurableContextExtensions`.

## Entity functions

Entity functions define operations for reading and updating small pieces of state, known as *durable entities*. Like orchestrator functions, entity functions are functions with a special trigger type, *entity trigger*. Unlike orchestrator functions, entity functions do not have any specific code constraints. Entity functions also manage state explicitly rather than implicitly representing state via control flow.

The following code is an example of a simple entity function that defines a *Counter* entity. The function defines three operations, `add`, `subtract`, and `reset`, each of which update an integer value, `currentValue`.

```csharp
[FunctionName("Counter")]
public static async Task Counter(
    [EntityTrigger] IDurableEntityContext ctx)
{
    int currentValue = ctx.GetState<int>();
    int operand = ctx.GetInput<int>();

    switch (ctx.OperationName)
    {
        case "add":
            currentValue += operand;
            break;
        case "subtract":
            currentValue -= operand;
            break;
        case "reset":
            await SendResetNotificationAsync();
            currentValue = 0;
            break;
    }

    ctx.SetState(currentValue);
}
```

Entity *instances* are accessed via a unique identifier, the *entity ID*. An entity ID is simply a pair of strings that uniquely identifies an entity instance. It consists of:

1. an **entity name**: a name that identifies the type of the entity (for example, "Counter")
2. an **entity key**: a string that uniquely identifies the entity among all other entities of the same name (for example, a GUID)

For example, a *counter* entity function might be used for keeping score in an online game. Each instance of the game will have a unique entity ID, such as `@Counter@Game1`, `@Counter@Game2`, and so on.

### Comparison with virtual actors

The design of Durable Entities is heavily influenced by the [actor model](https://en.wikipedia.org/wiki/Actor_model). If you are already familiar with actors, then the concepts behind durable entities should be familiar to you. In particular, durable entities are similar to [virtual actors](https://research.microsoft.com/en-us/projects/orleans/) in many ways:

* Durable entities are addressable via an *entity ID*.
* Durable entity operations execute serially, one at a time, to prevent race conditions.
* Durable entities are created automatically when they are called or signaled.
* When not executing operations, durable entities are silently unloaded from memory.

There are some important differences, however, that are worth noting:

* Durable entities are modeled as pure functions. This design is different from most object-oriented frameworks that represent actors using language-specific support for classes, properties, and methods.
* Durable entities prioritize *durability* over *latency*, and thus may not be appropriate for applications with strict latency requirements.
* Messages sent between entities are delivered reliably and in order.
* Durable entities can be used in conjunction with durable orchestrations, and can serve as distributed locks, which are described later in this article.
* Request/response patterns in entities are limited to orchestrations. For entity-to-entity communication, only one-way messages (also known as "signaling") are permitted, as in the original actor model. This behavior prevents distributed deadlocks.

### Durable Entity APIs

Entity support involves several APIs. For one, there is a new API for defining entity functions, as shown above, which specify what should happen when an operation is invoked on an entity. Also, existing APIs for clients and orchestrations have been updated with new functionality for interaction with entities.

### Implementing entity operations

The execution of an operation on an entity can call these members on the context object (`IDurableEntityContext` in .NET):

* **OperationName**: gets the name of the operation.
* **GetInput\<T>**: gets the input for the operation.
* **GetState\<T>**: gets the current state of the entity.
* **SetState**: updates the state of the entity.
* **SignalEntity**: sends a one-way message to an entity.
* **Self**: gets the ID of the entity.
* **Return**: returns a value to the client or orchestration that called the operation.
* **IsNewlyConstructed**: returns `true` if the entity did not exist prior to the operation.
* **DestructOnExit**: deletes the entity after finishing the operation.

Operations are less restricted than orchestrations:

* Operations can call external I/O, using synchronous or asynchronous APIs (we recommend using asynchronous ones only).
* Operations can be non-deterministic. For example, it is safe to call `DateTime.UtcNow`, `Guid.NewGuid()` or `new Random()`.

### Accessing entities from clients

Durable entities can be invoked from ordinary functions via the `orchestrationClient` binding (`IDurableOrchestrationClient` in .NET). The following methods are supported:

* **ReadEntityStateAsync\<T>**: reads the state of an entity.
* **SignalEntityAsync**: sends a one-way message to an entity, and waits for it to be enqueued.

These methods prioritize performance over consistency: `ReadEntityStateAsync` can return a stale value, and `SignalEntityAsync` can return before the operation has finished. In contrast, calling entities from orchestrations (as described next) is strongly consistent.

### Accessing entities from orchestrations

Orchestrations can access entities using the context object. They can choose between one-way communication (fire and forget) and two-way communication (request and response). The respective methods are

* **SignalEntity**: sends a one-way message to an entity.
* **CallEntityAsync**: sends a message to an entity, and waits for a response indicating that the operation has completed.
* **CallEntityAsync\<T>**: sends a message to an entity, and waits for a response containing a result of type T.

When using two-way communication, any exceptions thrown during the execution of the operation are also transmitted back to the calling orchestration and rethrown. In contrast, when using fire-and-forget, exceptions are not observed.

### Locking entities from orchestrations

Orchestrations can lock entities. This capability provides a simple way to prevent unwanted races by using *critical sections*.

The context object provides the following methods:

* **LockAsync**: acquires locks on one or more entities.
* **IsLocked**: returns true if currently in a critical section, false otherwise.

The critical section ends, and all locks are released, when the orchestration ends. In .NET, `LockAsync` returns an `IDisposable` that ends the critical section when disposed, which can be used together with a `using` clause to get a syntactic representation of the critical section.

For example, consider an orchestration that needs to test whether two players are available, and then assign them both to a game. This task can be implemented using a critical section as follows:

```csharp
[FunctionName("Orchestrator")]
public static async Task RunOrchestrator(
    [OrchestrationTrigger] IDurableOrchestrationContext ctx)
{
    EntityId player1 = /* ... */;
    EntityId player2 = /* ... */;

    using (await ctx.LockAsync(player1, player2))
    {
        bool available1 = await ctx.CallEntityAsync<bool>(player1, "is-available");
        bool available2 = await ctx.CallEntityAsync<bool>(player2, "is-available");

        if (available1 && available2)
        {
            Guid gameId = ctx.NewGuid();

            await ctx.CallEntityAsync(player1, "assign-game", gameId);
            await ctx.CallEntityAsync(player2, "assign-game", gameId);
        }
    }
}
```

Within the critical section, both player entities are locked, which means they are not executing any operations other than the ones that are called from within the critical section). This behavior prevents races with conflicting operations, such as players being assigned to a different game, or signing off.

We impose several restrictions on how critical sections can be used. These restrictions serve to prevent deadlocks and reentrancy.

* Critical sections cannot be nested.
* Critical sections cannot create suborchestrations.
* Critical sections can call only entities they have locked.
* Critical sections cannot call the same entity using multiple parallel calls.
* Critical sections can signal only entities they have not locked.

## Alternate storage providers

The Durable Task Framework supports multiple storage providers today, including [Azure Storage](https://github.com/Azure/durabletask/tree/master/src/DurableTask.AzureStorage), [Azure Service Bus](https://github.com/Azure/durabletask/tree/master/src/DurableTask.ServiceBus), an [in-memory emulator](https://github.com/Azure/durabletask/tree/master/src/DurableTask.Emulator), and an experimental [Redis](https://github.com/Azure/durabletask/tree/redis/src/DurableTask.Redis) provider. However, until now, the Durable Task extension for Azure Functions only supported the Azure Storage provider. Starting with Durable Functions 2.0, support for alternate storage providers is being added, starting with the Redis provider.

> [!NOTE]
> Durable Functions 2.0 only supports .NET Standard 2.0-compatible providers. At the time of writing, the Azure Service Bus provider does not support .NET Standard 2.0, and is therefore not available as an alternate storage provider.

### Emulator

The [DurableTask.Emulator](https://www.nuget.org/packages/Microsoft.Azure.DurableTask.Emulator/) provider is a local memory, non-durable storage provider suitable for local testing scenarios. It can be configured using the following minimal **host.json** schema:

```json
{
  "version": "2.0",
  "extensions": {
    "durableTask": {
      "hubName": <string>,
      "storageProvider": {
        "emulator": { }
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
> The Redis provider is currently experimental and only supports function apps running on a single node.
