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
ms.date: 07/08/2019
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

In the case where an abstract base class contained virtual methods, these virtual methods have been replaced by extension methods defined in `DurableContextExtensions`.

## Entity functions

Entity functions define operations for reading and updating small pieces of state, known as *durable entities*. Like orchestrator functions, entity functions are functions with a special trigger type, *entity trigger*. Unlike orchestrator functions, entity functions do not have any specific code constraints. Entity functions also manage state explicitly rather than implicitly representing state via control flow.

### .NET programing models

There are two optional programming models for authoring durable entities. The following code is an example of a simple *Counter* entity implemented as a standard function. This function defines three *operations*, `add`, `reset`, and `get`, each of which operate on an integer state value, `currentValue`.

```csharp
[FunctionName("Counter")]
public static void Counter([EntityTrigger] IDurableEntityContext ctx)
{
    int currentValue = ctx.GetState<int>();

    switch (ctx.OperationName.ToLowerInvariant())
    {
        case "add":
            int amount = ctx.GetInput<int>();
            currentValue += operand;
            break;
        case "reset":
            currentValue = 0;
            break;
        case "get":
            ctx.Return(currentValue);
            break;
    }

    ctx.SetState(currentValue);
}
```

This model works best for simple entity implementations, or implementations that have a dynamic set of operations. However, there is also a class-based programming model that is useful for entities that are static but have more complex implementations. The following example is an equivalent implementation of the `Counter` entity using .NET classes and methods.

```csharp
public class Counter
{
    [JsonProperty("value")]
    public int CurrentValue { get; set; }

    public void Add(int amount) => this.CurrentValue += amount;
    
    public void Reset() => this.CurrentValue = 0;
    
    public int Get() => this.CurrentValue;

    [FunctionName(nameof(Counter))]
    public static Task Run([EntityTrigger] IDurableEntityContext ctx)
        => ctx.DispatchAsync<Counter>();
}
```

The class-based model is similar to the programming model popularized by [Orleans](https://www.microsoft.com/research/project/orleans-virtual-actors/). In this model, an entity type is defined as a .NET class. Each method of the class is an operation that can be invoked by an external client. Unlike Orleans, however, .NET interfaces are optional. The previous *Counter* example did not use an interface, but it can still be invoked via other functions or via HTTP API calls.

Entity *instances* are accessed via a unique identifier, the *entity ID*. An entity ID is simply a pair of strings that uniquely identifies an entity instance. It consists of:

* An **entity name**: a name that identifies the type of the entity (for example, "Counter").
* An **entity key**: a string that uniquely identifies the entity among all other entities of the same name (for example, a GUID).

For example, a *counter* entity function might be used for keeping score in an online game. Each instance of the game will have a unique entity ID, such as `@Counter@Game1`, `@Counter@Game2`, and so on.

### Comparison with virtual actors

The design of Durable Entities is heavily influenced by the [actor model](https://en.wikipedia.org/wiki/Actor_model). If you are already familiar with actors, then the concepts behind durable entities should be familiar to you. In particular, durable entities are similar to [virtual actors](https://research.microsoft.com/projects/orleans/) in many ways:

* Durable entities are addressable via an *entity ID*.
* Durable entity operations execute serially, one at a time, to prevent race conditions.
* Durable entities are created automatically when they are called or signaled.
* When not executing operations, durable entities are silently unloaded from memory.

There are some important differences, however, that are worth noting:

* Durable entities prioritize *durability* over *latency*, and thus may not be appropriate for applications with strict latency requirements.
* Messages sent between entities are delivered reliably and in order.
* Durable entities can be used in conjunction with durable orchestrations, and can serve as distributed locks, which are described later in this article.
* Request/response patterns in entities are limited to orchestrations. For entity-to-entity communication, only one-way messages (also known as "signaling") are permitted, as in the original actor model. This behavior prevents distributed deadlocks.

### Durable Entity .NET APIs

Entity support involves several APIs. For one, there is a new API for defining entity functions, as shown above, which specify what should happen when an operation is invoked on an entity. Also, existing APIs for clients and orchestrations have been updated with new functionality for interaction with entities.

#### Implementing entity operations

The execution of an operation on an entity can call these members on the context object (`IDurableEntityContext` in .NET):

* **OperationName**: gets the name of the operation.
* **GetInput\<TInput>**: gets the input for the operation.
* **GetState\<TState>**: gets the current state of the entity.
* **SetState**: updates the state of the entity.
* **SignalEntity**: sends a one-way message to an entity.
* **Self**: gets the ID of the entity.
* **Return**: returns a value to the client or orchestration that called the operation.
* **IsNewlyConstructed**: returns `true` if the entity did not exist prior to the operation.
* **DestructOnExit**: deletes the entity after finishing the operation.

Operations are less restricted than orchestrations:

* Operations can call external I/O, using synchronous or asynchronous APIs (we recommend using asynchronous ones only).
* Operations can be non-deterministic. For example, it is safe to call `DateTime.UtcNow`, `Guid.NewGuid()` or `new Random()`.

#### Accessing entities from clients

Durable entities can be invoked from ordinary functions via the `orchestrationClient` binding (`IDurableOrchestrationClient` in .NET). The following methods are supported:

* **ReadEntityStateAsync\<T>**: reads the state of an entity.
* **SignalEntityAsync**: sends a one-way message to an entity, and waits for it to be enqueued.
* **SignalEntityAsync\<T>**: same as `SignalEntityAsync` but uses a generated proxy object of type `T`.

The previous `SignalEntityAsync` call requires specifying the name of the entity operation as a `string` and the payload of the operation as an `object`. The following sample code is an example of this pattern:

```csharp
EntityId id = // ...
object amount = 5;
context.SignalEntityAsync(id, "Add", amount);
```

It's also possible to generate a proxy object for type-safe access. To generate a type-safe proxy, the entity type must implement an interface. For example, suppose the `Counter` entity mentioned earlier implemented an `ICounter` interface, defined as follows:

```csharp
public interface ICounter
{
    void Add(int amount);
    void Reset();
    int Get();
}

public class Counter : ICounter
{
    // ...
}
```

Client code could then use `SignalEntityAsync<T>` and specify the `ICounter` interface as the type parameter to generate a type-safe proxy. This use of type-safe proxies is demonstrated in the following code sample:

```csharp
[FunctionName("UserDeleteAvailable")]
public static async Task AddValueClient(
    [QueueTrigger("my-queue")] string message,
    [OrchestrationClient] IDurableOrchestrationClient client)
{
    int amount = int.Parse(message);
    var target = new EntityId(nameof(Counter), "MyCounter");
    await client.SignalEntityAsync<ICounter>(target, proxy => proxy.Add(amount));
}
```

In the previous example, the `proxy` parameter is a dynamically generated instance of `ICounter`, which internally translates the call to `Add` into the equivalent (untyped) call to `SignalEntityAsync`.

> [!NOTE]
> It's important to note that the `ReadEntityStateAsync` and `SignalEntityAsync` methods of `IDurableOrchestrationClient` prioritize performance over consistency. `ReadEntityStateAsync` can return a stale value, and `SignalEntityAsync` can return before the operation has finished.

#### Accessing entities from orchestrations

Orchestrations can access entities using the `IDurableOrchestrationContext` object. They can choose between one-way communication (fire and forget) and two-way communication (request and response). The respective methods are:

* **SignalEntity**: sends a one-way message to an entity.
* **CallEntityAsync**: sends a message to an entity, and waits for a response indicating that the operation has completed.
* **CallEntityAsync\<T>**: sends a message to an entity, and waits for a response containing a result of type T.

When using two-way communication, any exceptions thrown during the execution of the operation are also transmitted back to the calling orchestration and rethrown. In contrast, when using fire-and-forget, exceptions are not observed.

For type-safe access, orchestration functions can generate proxies based on an interface. The `CreateEntityProxy` extension method can be used for this purpose:

```csharp
public interface IAsyncCounter
{
    Task AddAsync(int amount);
    Task ResetAsync();
    Task<int> GetAsync();
}

[FunctionName("CounterOrchestration)]
public static async Task Run(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
{
    // ...
    IAsyncCounter proxy = context.CreateEntityProxy<IAsyncCounter>("MyCounter");
    await proxy.AddAsync(5);
    int newValue = await proxy.GetAsync();
    // ...
}
```

In the previous example, a "counter" entity was assumed to exist which implements the `IAsyncCounter` interface. The orchestration was then able to use the `IAsyncCounter` type definition to generate a proxy type for synchronously interacting with the entity.

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
> The Redis provider is currently experimental and only supports function apps running on a single node. It is not guaranteed that the Redis provider will ever be made generally available, and it may be removed in a future release.
