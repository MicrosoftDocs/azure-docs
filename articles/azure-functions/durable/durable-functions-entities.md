---
title: Durable Entities - Azure Functions
description: Learn what are Durable Entities and how to use them in the Durable Functions extension for Azure Functions.
services: functions
author: cgillum
manager: jeconnoc
keywords:
ms.service: azure-functions
ms.topic: overview
ms.date: 08/31/2019
ms.author: azfuncdf
#Customer intent: As a developer, I want to learn what Durable Entities are and how to use them to solve distributed, stateful problems in my applications.
---

# Entity functions (preview)

Entity functions define operations for reading and updating small pieces of state, known as *durable entities*. Like orchestrator functions, entity functions are functions with a special trigger type, *entity trigger*. Unlike orchestrator functions, entity functions don't have any specific code constraints. Entity functions also manage state explicitly rather than implicitly representing state via control flow.

> [!NOTE]
> Entity functions and related functionality is only available in Durable Functions 2.0 and above. Entity functions are currently in public preview.

## Entity identity

Entities (sometimes referred to as entity *instances*) are accessed via a unique identifier, the *entity ID*. An entity ID is simply a pair of strings that uniquely identifies an entity instance. It consists of:

* An **entity name**: a name that identifies the type of the entity (for example, "Counter").
* An **entity key**: a string that uniquely identifies the entity among all other entities of the same name (for example, a GUID).

For example, a *counter* entity function might be used for keeping score in an online game. Each instance of the game will have a unique entity ID, such as `@Counter@Game1`, `@Counter@Game2`, and so on. All operations that target a particular entity require specifying an entity ID as a parameter.

## Programming models

Durable entities support two different programming models. The first model is a dynamic "functional" model where the entity is defined by a single function. The second model is an object-oriented model where the entity is defined by a class and methods. These models and the programming models for interacting with entities are described in the next sections.

### Defining entities

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

This model works best for simple entity implementations, or implementations that have a dynamic set of operations. However, you can also use a class-based programming model that is useful for entities that are static but have more complex implementations. The following example is an equivalent implementation of the `Counter` entity using classes and methods.

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

> [!NOTE]
> The function entry point method with the `[FunctionName]` attribute *must* be declared `static` when using entity classes. Non-static entry point methods may result in multiple object initialization and potentially other undefined behaviors.

In the class-based programming model, the `IDurableEntityContext` object is available in the `Entity.Current` static property.

The class-based model is similar to the programming model popularized by [Orleans](https://www.microsoft.com/research/project/orleans-virtual-actors/). In this model, an entity type is defined as a .NET class. Each method of the class is an operation that can be invoked by an external client. Unlike Orleans, however, .NET interfaces are optional. The previous *Counter* example did not use an interface, but it can still be invoked via other functions or via HTTP API calls.

> [!NOTE]
> Entity trigger functions are available in Durable Functions 2.0 and above. Currently, entity trigger functions are available only to .NET function apps.

### Accessing entities from clients

Durable entities can be invoked or queried from ordinary functions - also known as *client functions* - by using the [entity client output binding](durable-functions-bindings.md#entity-client). The following example shows a queue-triggered function *signaling* an entity using this binding.

```csharp
[FunctionName("AddFromQueue")]
public static Task Run(
    [QueueTrigger("durable-function-trigger")] string input,
    [DurableClient] IDurableEntityClient client)
{
    // Entity operation input comes from the queue message content.
    var entityId = new EntityId(nameof(Counter), "myCounter");
    int amount = int.Parse(input);
    return client.SignalEntityAsync(entityId, "Add", amount);
}
```

> [!NOTE]
> .NET functions support both loosely typed and type-safe methods for signaling entities. See the [entity client binding](durable-functions-bindings.md#entity-client-usage) reference documentation for details.

The term *signal* means that the entity API invocation is one-way and asynchronous. It's not possible for a *client function* to know when the entity has processed the operation, nor is it possible for an entity function return a value to a client function. One-way queue-based messaging was an intentional design choice for Durable Entities to prioritize durability over performance. This design choice is one of the tradeoffs of Durable Entities compared to other, similar technologies. Currently only orchestrations are capable of handling return values from entities, as described in the next section.

Client functions can also query the state of entities, as shown in the following example:

```csharp
[FunctionName("QueryCounter")]
public static async Task<HttpResponseMessage> Run(
    [HttpTrigger(AuthorizationLevel.Function)] HttpRequestMessage req,
    [DurableClient] IDurableEntityClient client)
{
    var entityId = new EntityId(nameof(Counter), "myCounter");
    JObject state = await client.ReadEntityStateAsync<JObject>(entityId);
    return req.CreateResponse(HttpStatusCode.OK, state);
}
```

Entity state queries are sent to the Durable tracking store and return the entity's most recently *persisted* state. It is possible that the returned state may be stale compared to the entity's in-memory state. Only orchestrations can read an entity's in-memory state, as described in the following section.

### Accessing entities from orchestrations

Orchestrator functions can access entities using APIs on the [orchestration trigger binding](durable-functions-bindings.md#orchestration-trigger). Orchestrator functions can choose between one-way communication (fire and forget, also referred to as *signaling*) and two-way communication (request and response, also referred to as *calling*). The following example code shows an orchestrator function *calling* and *signaling* a *Counter* entity.

```csharp
[FunctionName("CounterOrchestration")]
public static async Task Run(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
{
    var entityId = new EntityId(nameof(Counter), "myCounter");

    // Synchronous call to the entity which returns a value
    int currentValue = await context.CallEntityAsync<int>(entityId, "Get");
    if (currentValue < 10)
    {
        // Asynchronous call which updates the value
        await context.SignalEntityAsync<int>(entityId, "Add", 1);
    }
}
```

Only orchestrations are capable of calling entities and getting a response, which could be either a return value or an exception. Client functions using the [client binding](durable-functions-bindings.md#entity-client) can only *signal* entities.

> [!NOTE]
> Calling an entity from an orchestrtor function is similar to calling an [activity function](durable-functions-types-features-overview.md#activity-functions) from an orchestrator function. The main difference is that entity functions are durable objects with an address (the *entity ID*) and they support specifying an operation name. Activity functions, on the other hand, are stateless and do not have the concept of operations.

### Dependency injection in entity classes (.NET)

Entity classes support [Azure Functions Dependency Injection](../functions-dotnet-dependency-injection.md). The following example demonstrates how to register an `IHttpClientFactory` service into a class-based entity.

```csharp
[assembly: FunctionsStartup(typeof(MyNamespace.Startup))]

namespace MyNamespace
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddHttpClient();
        }
    }
}
```

The following snippet demonstrates how to incorporate the injected service into your entity class.

```csharp
public class HttpEntity
{
    private readonly HttpClient client;

    public class HttpEntity(IHttpClientFactory factory)
    {
        this.client = factory.CreateClient();
    }

    public Task<int> GetAsync(string url)
    {
        using (var response = await this.client.GetAsync(url))
        {
            return (int)response.StatusCode;
        }
    }

    // The function entry point must be declared static
    [FunctionName(nameof(HttpEntity))]
    public static Task Run([EntityTrigger] IDurableEntityContext ctx)
        => ctx.DispatchAsync<HttpEntity>();
}
```

> [!NOTE]
> Unlike when using constructor injection in regular .NET Azure Functions, the functions entry point method for class-based entities *must* be declared `static`. Declaring a non-static function entry point may cause conflicts between the normal Azure Functions object initializer and the Durable Entities object initializer.

### Bindings in entity classes (.NET)

Unlike regular functions, entity class methods do not have direct access to input and output bindings. Instead, binding data must be captured in the entry-point function declaration and then passed to the `DispatchAsync<T>` method. Any objects passed to `DispatchAsync<T>` will be automatically passed into the entity class constructor as an argument.

The following example shows how a `CloudBlobContainer` reference from the [blob input binding](../functions-bindings-storage-blob.md#input) can be made available to a class-based entity.

```csharp
public class BlobBackedEntity
{
    private readonly CloudBlobContainer container;

    public BlobBackedEntity(CloudBlobContainer container)
    {
        this.container = container;
    }

    // ... entity methods can use this.container in their implementations ...
    
    [FunctionName(nameof(BlobBackedEntity))]
    public static Task Run(
        [EntityTrigger] IDurableEntityContext context,
        [Blob("my-container", FileAccess.Read)] CloudBlobContainer container)
    {
        // passing the binding object as a parameter makes it available to the
        // entity class constructor
        return context.DispatchAsync<BlobBackedEntity>(container);
    }
}
```

For more information on bindings in Azure Functions, see the [Azure Functions Triggers and Bindings](../functions-triggers-bindings.md) documentation.

## Entity coordination

There may be times when you need to coordinate operations across multiple entities. For example, in a banking application, you may have entities representing individual bank accounts. When transferring funds from one account to another, you must ensure that the _source_ account has sufficient funds, and that updates to both the _source_ and _destination_ accounts are done in a transactionally consistent way.

### Transfer Funds example in C#

The following example code transfers funds between two _account_ entities using an orchestrator function. Coordinating entity updates requires using the `LockAsync` method to create a _critical section_ in the orchestration:

> [!NOTE]
> For simplicity, this example reuses the `Counter` entity defined previously. However, in a real application, it would be better to instead define a more detailed `BankAccount` entity.

```csharp
// This is a method called by an orchestrator function
public static async Task<bool> TransferFundsAsync(
    string sourceId,
    string destinationId,
    int transferAmount,
    IDurableOrchestrationContext context)
{
    var sourceEntity = new EntityId(nameof(Counter), sourceId);
    var destinationEntity = new EntityId(nameof(Counter), destinationId);

    // Create a critical section to avoid race conditions.
    // No operations can be performed on either the source or
    // destination accounts until the locks are released.
    using (await context.LockAsync(sourceEntity, destinationEntity))
    {
        ICounter sourceProxy = 
            context.CreateEntityProxy<ICounter>(sourceEntity);
        ICounter destinationProxy =
            context.CreateEntityProxy<ICounter>(destinationEntity);

        int sourceBalance = await sourceProxy.Get();

        if (sourceBalance >= transferAmount)
        {
            await sourceProxy.Add(-transferAmount);
            await destinationProxy.Add(transferAmount);

            // the transfer succeeded
            return true;
        }
        else
        {
            // the transfer failed due to insufficient funds
            return false;
        }
    }
}
```

In .NET, `LockAsync` returns an `IDisposable` that ends the critical section when disposed. This `IDisposable` result can be used together with a `using` block to get a syntactic representation of the critical section.

In the preceding example, an orchestrator function transferred funds from a _source_ entity to a _destination_ entity. The `LockAsync` method locked both the _source_ and _destination_ account entities. This locking ensured that no other client could query or modify the state of either account until the orchestration logic exited the _critical section_ at the end of the `using` statement. This effectively prevented the possibility of overdrafting from the _source_ account.

### Critical section behavior

The `LockAsync` method creates a _critical section_ in an orchestration. These _critical sections_ prevent other orchestrations from making overlapping changes to a specified set of entities. Internally, the `LockAsync` API sends "lock" operations to the entities and returns when it receives a "lock acquired" response message from each of these same entities. Both *lock* and *unlock* are built-in operations supported by all entities.

No operations from other clients are allowed on an entity while it is in a locked state. This behavior ensures that only one orchestration instance can lock an entity at a time. If a caller tries to invoke an operation on an entity while it is locked by an orchestration, that operation will be placed in a *pending operation queue*. No pending operations will be processed until after the holding orchestration releases its lock.

> [!NOTE] 
> This is slightly different from synchronization primitives used in most programming languages, such as the `lock` statement in C#. For example, in C#, the `lock` statement must be used by all threads to ensure proper synchonization across multiple threads. Entities, however, do not require all callers to explicitly _lock_ an entity. If any caller locks an entity, all other operations on that entity will be blocked and queued behind that lock.

Locks on entities are durable, so they will persist even if the executing process is recycled. Locks are internally persisted as part of an entity's durable state.

### Critical section restrictions

We impose several restrictions on how critical sections can be used. These restrictions serve to prevent deadlocks and reentrancy.

* Critical sections cannot be nested.
* Critical sections cannot create suborchestrations.
* Critical sections can call only entities they have locked.
* Critical sections cannot call the same entity using multiple parallel calls.
* Critical sections can signal only entities they have not locked.

## Comparison with virtual actors

Many of the Durable Entities features are inspired by the [actor model](https://en.wikipedia.org/wiki/Actor_model). If you are already familiar with actors, then you may recognize many of the concepts described in this article. In particular, durable entities are similar to [virtual actors](https://research.microsoft.com/projects/orleans/) in many ways:

* Durable entities are addressable via an *entity ID*.
* Durable entity operations execute serially, one at a time, to prevent race conditions.
* Durable entities are created automatically when they are called or signaled.
* When not executing operations, durable entities are silently unloaded from memory.

There are some important differences, however, that are worth noting:

* Durable entities prioritize *durability* over *latency*, and thus may not be appropriate for applications with strict latency requirements.
* Messages sent between entities are delivered reliably and in order.
* Durable entities can be used in conjunction with durable orchestrations, and support distributed locking mechanisms.
* Request/response patterns in entities are limited to orchestrations. For *client-to-entity* and *entity-to-entity* communication, only one-way messaging (also known as "signaling") is permitted, as in the original actor model. This behavior prevents distributed deadlocks.

## Next steps

> [!div class="nextstepaction"]
> [Learn about task hubs](durable-functions-task-hubs.md)