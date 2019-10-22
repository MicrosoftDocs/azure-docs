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

Entity functions define operations for reading and updating small pieces of state, known as *durable entities*. Like orchestrator functions, entity functions are functions with a special trigger type, *entity trigger*. Unlike orchestrator functions, entity functions manage the state of an entity explicitly, rather than implicitly representing state via control flow.
Entities provide a means for scaling out applications, by distributing the work across many entities, each with a modestly sized state.

> [!NOTE]
> Entity functions and related functionality is only available in Durable Functions 2.0 and above. Entity functions are currently in public preview.

## General concepts

Entities behave a bit like tiny services that communicate via messages. Each entity has a unique identity and an internal state (if it exists). Like services or objects, entities perform operations when prompted to do so. When it executes, an operation may update the internal state of the entity. It may also call external services and wait for a response. Entities communicate with other entities, orchestrations, and clients using messages that are implicitly sent via reliable queues. 

To prevent conflicts, all operations on a single entity are guaranteed to execute serially, that is, one after another. 

### Entity ID
Entities are accessed via a unique identifier, the *entity ID*. An entity ID is simply a pair of strings that uniquely identifies an entity instance. It consists of:

* An **entity name**: a name that identifies the type of the entity (for example, "Counter"). This name must match the name of the entity function that implements the entity. It isn't sensitive to case.
* An **entity key**: a string that uniquely identifies the entity among all other entities of the same name (for example, a GUID).

For example, a *counter* entity function might be used for keeping score in an online game. Each instance of the game will have a unique entity ID, such as `@Counter@Game1`, `@Counter@Game2`, and so on. All operations that target a particular entity require specifying an entity ID as a parameter.

### Entity operations ###

To invoke an operation on an entity, one specifies

* The *entity ID* of the target entity
* The *operation name*, a string that specifies the operation to perform. For example, the counter entity could support "add", "get", or "reset" operations.
* The *operation input*, which is an optional input parameter for the operation. For example, the "add" operation can take an integer amount as the input.

Operations can return a result value, or an error result (such as a JavaScript error or a .NET exception). This result or error can be observed by orchestrations that called the operation.

An entity operation can also create, read, update, and delete the state of the entity. The state of the entity is always durably persisted in storage.

## Defining entities

We currently offer two distinct APIs for defining entities.

A **function-based syntax** where entities are represented as functions, and operations are explicitly dispatched by the application. This syntax works well for entities with simple state, few operations, or a dynamic set of operations (such as in application frameworks). However, it can be tedious to maintain, as it doesn't catch type errors at compile time.

A **class-based syntax** where entities and operations are represented by classes and methods. This syntax produces more easily readable code and allows operations to be invoked in a type-safe way. The class-based syntax is just a thin layer on top of the function-based syntax, so both variants can be used interchangeably in the same application.

### Example: Function-based Syntax

The following code is an example of a simple *Counter* entity implemented as a durable function. This function defines three operations, `add`, `reset`, and `get`, each of which operate on an integer state.

```csharp
[FunctionName("Counter")]
public static void Counter([EntityTrigger] IDurableEntityContext ctx)
{
    switch (ctx.OperationName.ToLowerInvariant())
    {
        case "add":
            ctx.SetState(ctx.GetState<int>() + ctx.GetInput<int>());
            break;
        case "reset":
            ctx.SetState(0);
            break;
        case "get":
            ctx.Return(ctx.GetState<int>()));
            break;
    }
}
```

For more information on the function-based syntax and how to use it, see [Function-Based Syntax](durable-functions-dotnet-entities.md#function-based-syntax).

### Example: Class-based syntax

The following example is an equivalent implementation of the `Counter` entity using classes and methods.

```csharp
[JsonObject(MemberSerialization.OptIn)]
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

The state of this entity is an object of type `Counter`, which contains a field that stores the current value of the counter. To persist this object in storage, it is serialized and deserialized by the [Json.NET](https://www.newtonsoft.com/json) library. 

For more information on the class-based syntax and how to use it, see [Defining entity classes](durable-functions-dotnet-entities.md#defining-entity-classes).

## Accessing entities

Entities can be accessed using one-way or two-way communication. We use the following terminology to distinguish: 

* **Calling** an entity means we use two-way (round-trip) communication: we send an operation message to the entity, and then wait for the response message before continuing. The response message can provide a result value or an error result (such as a JavaScript error or a .NET exception). This result or error is then observed by the caller.
* **Signaling** an entity means we use one-way (fire and forget) communication: we send an operation message, but don't wait for a response. While the message is guaranteed to be delivered eventually, the sender does not know when, and can't observe any result value or errors.

Entities can be accessed from within client functions, from within orchestrator functions, or from within entity functions. Not all forms of communication are supported by all contexts:

* From within clients, you can *signal* entities, and you can *read* the entity state.
* From within orchestrations, you can *signal* entities, and you can *call* entities.
* From within entities, you can *signal* entities.

Below we show some examples that illustrate these various ways of accessing entities.

> [!NOTE]
> For simplicity, the examples below show the loosely typed syntax for accessing entities. In general, we recommend [Accessing entities through interfaces](durable-functions-dotnet-entities.md#accessing-entities-through-interfaces) as it provides more type checking.

### Example: client signals an entity

To access entities from an ordinary Azure Function - also known as *client function* - use the [entity client output binding](durable-functions-bindings.md#entity-client). The following example shows a queue-triggered function *signaling* an entity using this binding.

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

The term *signal* means that the entity API invocation is one-way and asynchronous. It's not possible for a *client function* to know when the entity has processed the operation. Also, the client function can't observe any result values or exceptions. 

### Example: client reads an entity state

Client functions can also query the state of an entity, as shown in the following example:

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

Entity state queries are sent to the Durable tracking store and return the entity's most recently *persisted* state. This state is always a "committed" state, that is, it is never a temporary intermediate state assumed in the middle of executing an operation. However, it is possible that this state is stale compared to the entity's in-memory state. Only orchestrations can read an entity's in-memory state, as described in the following section.

### Example: orchestration signals and calls an entity

Orchestrator functions can access entities using APIs on the [orchestration trigger binding](durable-functions-bindings.md#orchestration-trigger). The following example code shows an orchestrator function *calling* and *signaling* a *Counter* entity.

```csharp
[FunctionName("CounterOrchestration")]
public static async Task Run(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
{
    var entityId = new EntityId(nameof(Counter), "myCounter");

   // Two-way call to the entity which returns a value - awaits the response
    int currentValue = await context.CallEntityAsync<int>(entityId, "Get");
    if (currentValue < 10)
    {
        // One-way signal to the entity which updates the value - does not await a response
        context.SignalEntity(entityId, "Add", 1);
    }
}
```

Only orchestrations are capable of calling entities and getting a response, which could be either a return value or an exception. Client functions using the [client binding](durable-functions-bindings.md#entity-client) can only *signal* entities.

> [!NOTE]
> Calling an entity from an orchestrator function is similar to calling an [activity function](durable-functions-types-features-overview.md#activity-functions) from an orchestrator function. The main difference is that entity functions are durable objects with an address (the *entity ID*) and they support specifying an operation name. Activity functions, on the other hand, are stateless and do not have the concept of operations.

### Example: entity signals an entity

An entity function can send signals to other entities (or even itself!) while it executes an operation.
For example, we can modify the counter entity example above so it sends a "milestone-reached" signal to some monitor entity when the counter reaches the value 100:

```csharp
   case "add":
        var amount = ctx.GetInput<int>();
        if (currentValue < 100 && currentValue + amount >= 100)
        {
            ctx.SignalEntity(new EntityId("MonitorEntity", ""), "milestone-reached", ctx.EntityKey);
        }
        currentValue += amount;
        break;
```

The following snippet demonstrates how to incorporate the injected service into your entity class.

```csharp
public class HttpEntity
{
    private readonly HttpClient client;

    public HttpEntity(IHttpClientFactory factory)
    {
        this.client = factory.CreateClient();
    }

    public async Task<int> GetAsync(string url)
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

### Example: Transfer funds

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

> [!NOTE] 
> When an orchestration terminates (either normally, or with an error), any critical sections in progress are implicitly ended and all locks are released.

### Critical section behavior

The `LockAsync` method creates a _critical section_ in an orchestration. These _critical sections_ prevent other orchestrations from making overlapping changes to a specified set of entities. Internally, the `LockAsync` API sends "lock" operations to the entities and returns when it receives a "lock acquired" response message from each of these same entities. Both *lock* and *unlock* are built-in operations supported by all entities.

No operations from other clients are allowed on an entity while it is in a locked state. This behavior ensures that only one orchestration instance can lock an entity at a time. If a caller tries to invoke an operation on an entity while it is locked by an orchestration, that operation will be placed in a *pending operation queue*. No pending operations will be processed until after the holding orchestration releases its lock.

> [!NOTE] 
> This is slightly different from synchronization primitives used in most programming languages, such as the `lock` statement in C#. For example, in C#, the `lock` statement must be used by all threads to ensure proper synchonization across multiple threads. Entities, however, do not require all callers to explicitly _lock_ an entity. If any caller locks an entity, all other operations on that entity will be blocked and queued behind that lock.

Locks on entities are durable, so they will persist even if the executing process is recycled. Locks are internally persisted as part of an entity's durable state.

Unlike transactions, critical sections do not automatically roll back changes in the case of errors. Rather, any error handling (roll-back, retry, or other) needs to be explicitly coded; for example, by catching errors or exceptions. This design choice is intentional. Automatically rolling back all the effects of an orchestration is difficult or impossible in general, as orchestrations may run activities and make calls to external services that cannot be rolled back. Also, attempts to roll back may themselves fail, and require further error handling.

### Critical section rules

Unlike low-level locking primitives in most programming languages, critical sections are **guaranteed not to deadlock**. To prevent deadlocks, we enforce the following restrictions: 

* Critical sections cannot be nested.
* Critical sections cannot create suborchestrations.
* Critical sections can call only entities they have locked.
* Critical sections cannot call the same entity using multiple parallel calls.
* Critical sections can signal only entities they have not locked.

Any violations of these rules cause a runtime error (such as a `LockingRulesViolationException` in .NET) which includes a message explaining what rule was broken.

## Comparison with virtual actors

Many of the Durable Entities features are inspired by the [actor model](https://en.wikipedia.org/wiki/Actor_model). If you are already familiar with actors, then you may recognize many of the concepts described in this article. Durable entities are particularly similar to [virtual actors](https://research.microsoft.com/projects/orleans/), or *grains*, as popularized by the [Orleans project](http://dotnet.github.io/orleans/). For example:

* Durable entities are addressable via an *entity ID*.
* Durable entity operations execute serially, one at a time, to prevent race conditions.
* Durable entities are created implicitly when they are called or signaled.
* When not executing operations, durable entities are silently unloaded from memory.

There are some important differences, however, that are worth noting:

* Durable entities prioritize *durability* over *latency*, and thus may not be appropriate for applications with strict latency requirements.
* Durable entities do not have built-in timeouts for messages. In Orleans, all messages time out after a configurable time (30 seconds by default).
* Messages sent between entities are delivered reliably and in order. In Orleans, reliable or ordered delivery is supported for content sent through streams, but is not guaranteed for all messages between grains.
* Request/response patterns in entities are limited to orchestrations. From within entities, only one-way messaging (also known as "signaling") is permitted, as in the original actor model, and unlike grains in Orleans. 
* Durable entities do not deadlock. In Orleans, deadlocks can occur (and do not resolve until messages time out).
* Durable entities can be used in conjunction with durable orchestrations, and support distributed locking mechanisms. 


## Next steps

> [!div class="nextstepaction"]
> [Read the Developer's Guide to Durable Entities in .NET](durable-functions-dotnet-entities.md)

> [!div class="nextstepaction"]
> [Learn about task hubs](durable-functions-task-hubs.md)
