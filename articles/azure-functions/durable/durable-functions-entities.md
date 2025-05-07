---
title: Durable entities - Azure Functions
description: Learn what durable entities are and how to use them in the Durable Functions extension for Azure Functions.
author: cgillum
ms.topic: overview
ms.date: 10/24/2023
ms.author: azfuncdf
ms.devlang: csharp
# ms.devlang: csharp, java, javascript, python
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: df-languages
#Customer intent: As a developer, I want to learn what durable entities are and how to use them to solve distributed, stateful problems in my applications.
---

# Entity functions

Entity functions define operations for reading and updating small pieces of state, known as *durable entities*. Like orchestrator functions, entity functions are functions with a special trigger type, the *entity trigger*. Unlike orchestrator functions, entity functions manage the state of an entity explicitly, rather than implicitly representing state via control flow.
Entities provide a means for scaling out applications by distributing the work across many entities, each with a modestly sized state.
::: zone pivot="csharp,javascript,python"
> [!NOTE]
> Entity functions and related functionality are only available in [Durable Functions 2.0](durable-functions-versions.md#migrate-from-1x-to-2x) and above. They are currently supported in .NET in-proc, .NET isolated worker, JavaScript, and Python, but not in PowerShell or Java. Furthermore, entity functions for .NET Isolated are supported when using the Azure Storage or Netherite state providers, but not when using the MSSQL state provider.
::: zone-end  
::: zone pivot="powershell,java"  
>[!IMPORTANT]
>Entity functions aren't currently supported in PowerShell and Java.
::: zone-end  

## General concepts

Entities behave a bit like tiny services that communicate via messages. Each entity has a unique identity and an internal state (if it exists). Like services or objects, entities perform operations when prompted to do so. When an operation executes, it might update the internal state of the entity. It might also call external services and wait for a response. Entities communicate with other entities, orchestrations, and clients by using messages that are implicitly sent via reliable queues. 
::: zone pivot="csharp,javascript,python"  
To prevent conflicts, all operations on a single entity are guaranteed to execute serially, that is, one after another.

> [!NOTE]
> When an entity is invoked, it processes its payload to completion and then schedules a new execution to activate once future inputs arrive. As a result, your entity execution logs might show an extra execution after each entity invocation; this is expected.

### Entity ID
Entities are accessed via a unique identifier, the *entity ID*. An entity ID is simply a pair of strings that uniquely identifies an entity instance. It consists of an:

* **Entity name**, which is a name that identifies the type of the entity. An example is "Counter." This name must match the name of the entity function that implements the entity. It isn't sensitive to case.
* **Entity key**, which is a string that uniquely identifies the entity among all other entities of the same name. An example is a GUID.

For example, a `Counter` entity function might be used for keeping score in an online game. Each instance of the game has a unique entity ID, such as `@Counter@Game1` and `@Counter@Game2`. All operations that target a particular entity require specifying an entity ID as a parameter.

### Entity operations

To invoke an operation on an entity, specify the:

* **Entity ID** of the target entity.
* **Operation name**, which is a string that specifies the operation to perform. For example, the `Counter` entity could support `add`, `get`, or `reset` operations.
* **Operation input**, which is an optional input parameter for the operation. For example, the add operation can take an integer amount as the input.
* **Scheduled time**, which is an optional parameter for specifying the delivery time of the operation. For example, an operation can be reliably scheduled to run several days in the future.

Operations can return a result value or an error result, such as a JavaScript error or a .NET exception. This result or error occurs in orchestrations that called the operation.

An entity operation can also create, read, update, and delete the state of the entity. The state of the entity is always durably persisted in storage.

## Define entities
::: zone-end
::: zone pivot="javascript,python"
You define entities using a function-based syntax, where entities are represented as functions and operations are explicitly dispatched by the application. 
::: zone-end
::: zone pivot="csharp"
Currently, there are two distinct APIs for defining entities in .NET:

### [Function-based syntax](#tab/function-based)

When you use a function-based syntax, entities are represented as functions and operations are explicitly dispatched by the application. This syntax works well for entities with simple state, few operations, or a dynamic set of operations like in application frameworks. This syntax can be tedious to maintain because it doesn't catch type errors at compile time.

### [Class-based syntax](#tab/class-based) 

When you use a class-based syntax, .NET classes and methods represent entities and operations. This syntax produces more easily readable code and allows operations to be invoked in a type-safe way. The class-based syntax is a thin layer on top of the function-based syntax, so both variants can be used interchangeably in the same application.

--- 

The specific APIs depend on whether your C# functions run in an _isolated worker process_ (recommended) or in the same process as the host. 

### [In-process](#tab/in-process/function-based)

The following code is an example of a simple `Counter` entity implemented as a durable function. This function defines three operations, `add`, `reset`, and `get`, each of which operates on an integer state.

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
            ctx.Return(ctx.GetState<int>());
            break;
    }
}
```

For more information on the function-based syntax and how to use it, see [Function-based syntax](durable-functions-dotnet-entities.md#function-based-syntax).

### [In-process](#tab/in-process/class-based)

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

The state of this entity is an object of type `Counter`, which contains a field that stores the current value of the counter. To persist this object in storage, it's serialized and deserialized by the [Json.NET](https://www.newtonsoft.com/json) library. 

For more information on the class-based syntax and how to use it, see [Defining entity classes](durable-functions-dotnet-entities.md#defining-entity-classes).

### [Isolated worker process](#tab/isolated-process/function-based)

```csharp
[Function(nameof(Counter))]
public static Task DispatchAsync([EntityTrigger] TaskEntityDispatcher dispatcher)
{
    return dispatcher.DispatchAsync(operation =>
    {
        if (operation.State.GetState(typeof(int)) is null)
        {
            operation.State.SetState(0);
        }

        switch (operation.Name.ToLowerInvariant())
        {
            case "add":
                int state = operation.State.GetState<int>();
                state += operation.GetInput<int>();
                operation.State.SetState(state);
                return new(state);
            case "reset":
                operation.State.SetState(0);
                break;
            case "get":
                return new(operation.State.GetState<int>());
            case "delete": 
                operation.State.SetState(null);
                break; 
        }

        return default;
    });
}
```

### [Isolated worker process](#tab/isolated-process/class-based)

The following example shows the implementation of the `Counter` entity using classes and methods. 
```csharp
public class Counter
{
    public int CurrentValue { get; set; }

    public void Add(int amount) => this.CurrentValue += amount;

    public void Reset() => this.CurrentValue = 0;

    public int Get() => this.CurrentValue;

    [Function(nameof(Counter))]
    public static Task RunEntityAsync([EntityTrigger] TaskEntityDispatcher dispatcher)
    {
        return dispatcher.DispatchAsync<Counter>();
    }
}

```
The following example implements a `Counter` entity by directly implementing `TaskEntity<TState>`, which gives the added benefit of being able to use Dependency Injection. 

```csharp
public class Counter : TaskEntity<int>
{
    readonly ILogger logger;

    public Counter(ILogger<Counter> logger)
    {
        this.logger = logger; 
    }

    public void Add(int amount) => this.State += amount;

    public void Reset() => this.State = 0;

    public int Get() => this.State;

    [Function(nameof(Counter))]
    public Task RunEntityAsync([EntityTrigger] TaskEntityDispatcher dispatcher)
    {
        return dispatcher.DispatchAsync(this);
    }
}
```
You can also dispatch by using a static method.
```csharp
[Function(nameof(Counter))]
public static Task RunEntityStaticAsync([EntityTrigger] TaskEntityDispatcher dispatcher)
{
    return dispatcher.DispatchAsync<Counter>();
}
```
--- 
::: zone-end
::: zone pivot="javascript"

Durable entities are available in JavaScript starting with version **1.3.0** of the `durable-functions` npm package. The following code is the `Counter` entity implemented as a durable function written in JavaScript.

**Counter/function.json**
```json
{
  "bindings": [
    {
      "name": "context",
      "type": "entityTrigger",
      "direction": "in"
    }
  ],
  "disabled": false
}
```

**Counter/index.js**
```javascript
const df = require("durable-functions");

module.exports = df.entity(function(context) {
    const currentValue = context.df.getState(() => 0);
    switch (context.df.operationName) {
        case "add":
            const amount = context.df.getInput();
            context.df.setState(currentValue + amount);
            break;
        case "reset":
            context.df.setState(0);
            break;
        case "get":
            context.df.return(currentValue);
            break;
    }
});
```

::: zone-end
::: zone pivot="python"
> [!NOTE]
> Refer to the [Azure Functions Python developer guide](../functions-reference-python.md) for more details about how the V2 model works.

The following code is the `Counter` entity implemented as a durable function written in Python.

# [v2](#tab/python-v2)

```Python
import azure.functions as func
import azure.durable_functions as df

# Entity function called counter
@myApp.entity_trigger(context_name="context")
def Counter(context):
    current_value = context.get_state(lambda: 0)
    operation = context.operation_name
    if operation == "add":
        amount = context.get_input()
        current_value += amount
    elif operation == "reset":
        current_value = 0
    elif operation == "get":
        context.set_result(current_value)
    context.set_state(current_value)
```

# [v1](#tab/python-v1)
**Counter/function.json**
```json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "name": "context",
      "type": "entityTrigger",
      "direction": "in"
    }
  ]
}
```

**Counter/__init__.py**
```Python
import azure.functions as func
import azure.durable_functions as df


def entity_function(context: df.DurableEntityContext):
    current_value = context.get_state(lambda: 0)
    operation = context.operation_name
    if operation == "add":
        amount = context.get_input()
        current_value += amount
    elif operation == "reset":
        current_value = 0
    elif operation == "get":
        context.set_result(current_value)
    context.set_state(current_value)


main = df.Entity.create(entity_function)
```
::: zone-end
::: zone pivot="csharp,javascript,python"
## Access entities

Entities can be accessed using one-way or two-way communication. The following terminology distinguishes the two forms of communication: 

* **Calling** an entity uses two-way (round-trip) communication. You send an operation message to the entity, and then wait for the response message before you continue. The response message can provide a result value or an error result, such as a JavaScript error or a .NET exception. This result or error is then observed by the caller.
* **Signaling** an entity uses one-way (fire and forget) communication. You send an operation message but don't wait for a response. While the message is guaranteed to be delivered eventually, the sender doesn't know when and can't observe any result value or errors.

Entities can be accessed from within client functions, from within orchestrator functions, or from within entity functions. Not all forms of communication are supported by all contexts:

* From within clients, you can signal entities and you can read the entity state.
* From within orchestrations, you can signal entities and you can call entities.
* From within entities, you can signal entities.

The following examples illustrate these various ways of accessing entities.

### Example: Client signals an entity

To access entities from an ordinary Azure Function, which is also known as a client function, use the [entity client binding](durable-functions-bindings.md#entity-client). The following example shows a queue-triggered function signaling an entity using this binding.
::: zone-end
::: zone pivot="csharp"  
#### [In-process](#tab/in-process)

> [!NOTE]
> For simplicity, the following examples show the loosely typed syntax for accessing entities. In general, we recommend that you [access entities through interfaces](durable-functions-dotnet-entities.md#accessing-entities-through-interfaces) because it provides more type checking.

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

#### [Isolated worker process](#tab/isolated-process)
```csharp
[Function("AddFromQueue")]
public static Task Run(
    [QueueTrigger("durable-function-trigger")] string input, [DurableClient] DurableTaskClient client)
{
    // Entity operation input comes from the queue message content. 
    var entityId = new EntityInstanceId(nameof(Counter), "myCounter");
    int amount = int.Parse(input);
    return client.Entities.SignalEntityAsync(entityId, "Add", amount);
}
```

--- 
::: zone-end  
::: zone pivot="javascript"  
```javascript
const df = require("durable-functions");

module.exports = async function (context) {
    const client = df.getClient(context);
    const entityId = new df.EntityId("Counter", "myCounter");
    await client.signalEntity(entityId, "add", 1);
};
```
::: zone-end  
::: zone pivot="python"

# [v2](#tab/python-v2)
```Python
import azure.functions as func
import azure.durable_functions as df

# An HTTP-Triggered Function with a Durable Functions Client to set a value on a durable entity
@myApp.route(route="entitysetvalue")
@myApp.durable_client_input(client_name="client")
async def http_set(req: func.HttpRequest, client):
    logging.info('Python HTTP trigger function processing a request.')
    entityId = df.EntityId("Counter", "myCounter")
    await client.signal_entity(entityId, "add", 1)
    return func.HttpResponse("Done", status_code=200)
```

# [v1](#tab/python-v1)

```Python
from azure.durable_functions import DurableOrchestrationClient
import azure.functions as func


async def main(req: func.HttpRequest, starter: str, message):
    client = DurableOrchestrationClient(starter)
    entityId = df.EntityId("Counter", "myCounter")
    await client.signal_entity(entityId, "add", 1)
```

::: zone-end
::: zone pivot="csharp,javascript,python"
The term *signal* means that the entity API invocation is one-way and asynchronous. It's not possible for a client function to know when the entity has processed the operation. Also, the client function can't observe any result values or exceptions. 

### Example: Client reads an entity state

Client functions can also query the state of an entity, as shown in the following example:
::: zone-end  
::: zone pivot="csharp"  
#### [In-process](#tab/in-process)
```csharp
[FunctionName("QueryCounter")]
public static async Task<HttpResponseMessage> Run(
    [HttpTrigger(AuthorizationLevel.Function)] HttpRequestMessage req,
    [DurableClient] IDurableEntityClient client)
{
    var entityId = new EntityId(nameof(Counter), "myCounter");
    EntityStateResponse<JObject> stateResponse = await client.ReadEntityStateAsync<JObject>(entityId);
    return req.CreateResponse(HttpStatusCode.OK, stateResponse.EntityState);
}
```
#### [Isolated worker process](#tab/isolated-process)
```csharp
[Function("QueryCounter")]
public static async Task<HttpResponseData> Run(
    [HttpTrigger(AuthorizationLevel.Function)] HttpRequestData req,
    [DurableClient] DurableTaskClient client)
{
    var entityId = new EntityInstanceId(nameof(Counter), "myCounter");
    EntityMetadata<int>? entity = await client.Entities.GetEntityAsync<int>(entityId);

    if (entity is null)
    {
        return req.CreateResponse(HttpStatusCode.NotFound);
    }
    
    HttpResponseData response = req.CreateResponse(HttpStatusCode.OK);
    await response.WriteAsJsonAsync(entity);

    return response;
}
```

--- 
::: zone-end
::: zone pivot="javascript"  
```javascript
const df = require("durable-functions");

module.exports = async function (context) {
    const client = df.getClient(context);
    const entityId = new df.EntityId("Counter", "myCounter");
    const stateResponse = await client.readEntityState(entityId);
    return stateResponse.entityState;
};
```
::: zone-end  
::: zone pivot="python"

# [v2](#tab/python-v2)

```python
# An HTTP-Triggered Function with a Durable Functions Client to retrieve the state of a durable entity
@myApp.route(route="entityreadvalue")
@myApp.durable_client_input(client_name="client")
async def http_read(req: func.HttpRequest, client):
    entityId = df.EntityId("Counter", "myCounter")
    entity_state_result = await client.read_entity_state(entityId)
    entity_state = "No state found"
    if entity_state_result.entity_exists:
      entity_state = str(entity_state_result.entity_state)
    return func.HttpResponse(entity_state)
```

# [v1](#tab/python-v1)

```python
from azure.durable_functions import DurableOrchestrationClient
import azure.functions as func

async def main(req: func.HttpRequest, starter: str, message):
    client = DurableOrchestrationClient(starter)
    entityId = df.EntityId("Counter", "myCounter")
    entity_state_result = await client.read_entity_state(entityId)
    entity_state = "No state found"
    if entity_state_result.entity_exists:
      entity_state = str(entity_state_result.entity_state)
    return func.HttpResponse(entity_state)
```
::: zone-end  
::: zone pivot="csharp,javascript,python"
Entity state queries are sent to the Durable tracking store and return the entity's most recently persisted state. This state is always a "committed" state, that is, it's never a temporary intermediate state assumed in the middle of executing an operation. However, it's possible that this state is stale compared to the entity's in-memory state. Only orchestrations can read an entity's in-memory state, as described in the following section.

### Example: Orchestration signals and calls an entity

Orchestrator functions can access entities by using APIs on the [orchestration trigger binding](durable-functions-bindings.md#orchestration-trigger). The following example code shows an orchestrator function calling and signaling a `Counter` entity.
::: zone-end
::: zone pivot="csharp"  
#### [In-process](#tab/in-process)
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

#### [Isolated worker process](#tab/isolated-process)

```csharp
[Function("CounterOrchestration")]
public static async Task Run([OrchestrationTrigger] TaskOrchestrationContext context)
{
    var entityId = new EntityInstanceId(nameof(Counter), "myCounter");

    // Two-way call to the entity which returns a value - awaits the response
    int currentValue = await context.Entities.CallEntityAsync<int>(entityId, "Get");

    if (currentValue < 10)
    {
        // One-way signal to the entity which updates the value - does not await a response
        await context.Entities.SignalEntityAsync(entityId, "Add", 1);
    }
}
```

--- 
::: zone-end  
::: zone pivot="javascript"  
```javascript
const df = require("durable-functions");

module.exports = df.orchestrator(function*(context){
    const entityId = new df.EntityId("Counter", "myCounter");

    // Two-way call to the entity which returns a value - awaits the response
    currentValue = yield context.df.callEntity(entityId, "get");
});
```

> [!NOTE]
> JavaScript does not currently support signaling an entity from an orchestrator. Use `callEntity` instead.
::: zone-end  
::: zone pivot="python"

# [v2](#tab/python-v2)

```python
@myApp.orchestration_trigger(context_name="context")
def orchestrator(context: df.DurableOrchestrationContext):
    entityId = df.EntityId("Counter", "myCounter")
    context.signal_entity(entityId, "add", 3)
    logging.info("signaled entity")
    state = yield context.call_entity(entityId, "get")
    return state
```

# [v1](#tab/python-v1)
```Python
import azure.functions as func
import azure.durable_functions as df


def orchestrator_function(context: df.DurableOrchestrationContext):
    entityId = df.EntityId("Counter", "myCounter")
    current_value = yield context.call_entity(entityId, "get")
    if current_value < 10:
        context.signal_entity(entityId, "add", 1)
    return state
```
::: zone-end  
::: zone pivot="csharp,javascript,python"  
Only orchestrations are capable of calling entities and getting a response, which could be either a return value or an exception. Client functions that use the [client binding](durable-functions-bindings.md#entity-client) can only signal entities.

> [!NOTE]
> Calling an entity from an orchestrator function is similar to calling an [activity function](durable-functions-types-features-overview.md#activity-functions) from an orchestrator function. The main difference is that entity functions are durable objects with an address, which is the entity ID. Entity functions support specifying an operation name. Activity functions, on the other hand, are stateless and don't have the concept of operations.

### Example: Entity signals an entity

An entity function can send signals to other entities, or even itself, while it executes an operation.
For example, we can modify the previous `Counter` entity example so that it sends a "milestone-reached" signal to some monitor entity when the counter reaches the value 100.
::: zone-end  
::: zone pivot="csharp"  
#### [In-process](#tab/in-process)
```csharp
   case "add":
        var currentValue = ctx.GetState<int>();
        var amount = ctx.GetInput<int>();
        if (currentValue < 100 && currentValue + amount >= 100)
        {
            ctx.SignalEntity(new EntityId("MonitorEntity", ""), "milestone-reached", ctx.EntityKey);
        }

        ctx.SetState(currentValue + amount);
        break;
```

#### [Isolated worker process](#tab/isolated-process)
```csharp
case "add":
    var currentValue = operation.State.GetState<int>();
    var amount = operation.GetInput<int>();
    if (currentValue < 100 && currentValue + amount >= 100)
    {
        operation.Context.SignalEntity(new EntityInstanceId("MonitorEntity", ""), "milestone-reached", operation.Context.EntityInstanceId);
    }

    operation.State.SetState(currentValue + amount);
    break;
```

--- 
::: zone-end  
::: zone pivot="javascript"  
```javascript
    case "add":
        const amount = context.df.getInput();
        if (currentValue < 100 && currentValue + amount >= 100) {
            const entityId = new df.EntityId("MonitorEntity", "");
            context.df.signalEntity(entityId, "milestone-reached", context.df.instanceId);
        }
        context.df.setState(currentValue + amount);
        break;
```
::: zone-end  
::: zone pivot="python"  
> [!NOTE]
> Python doesn't support entity-to-entity signals yet. Please use an orchestrator for signaling entities instead.

::: zone-end
::: zone pivot="csharp"  
## <a name="entity-coordination"></a>Entity coordination

There might be times when you need to coordinate operations across multiple entities. For example, in a banking application, you might have entities that represent individual bank accounts. When you transfer funds from one account to another, you must ensure that the source account has sufficient funds. You also must ensure that updates to both the source and destination accounts are done in a transactionally consistent way.

### Example: Transfer funds

The following example code transfers funds between two account entities by using an orchestrator function. Coordinating entity updates requires using the `LockAsync` method to create a _critical section_ in the orchestration.

> [!NOTE]
> For simplicity, this example reuses the `Counter` entity defined previously. In a real application, it would be better to define a more detailed `BankAccount` entity.

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

In .NET, `LockAsync` returns `IDisposable`, which ends the critical section when disposed. This `IDisposable` result can be used together with a `using` block to get a syntactic representation of the critical section.

In the preceding example, an orchestrator function transfers funds from a source entity to a destination entity. The `LockAsync` method locked both the source and destination account entities. This locking ensured that no other client could query or modify the state of either account until the orchestration logic exited the critical section at the end of the `using` statement. This behavior prevents the possibility of overdrafting from the source account.

> [!NOTE] 
> When an orchestration terminates, either normally or with an error, any critical sections in progress are implicitly ended and all locks are released.

### Critical section behavior

The `LockAsync` method creates a critical section in an orchestration. These critical sections prevent other orchestrations from making overlapping changes to a specified set of entities. Internally, the `LockAsync` API sends "lock" operations to the entities and returns when it receives a "lock acquired" response message from each of these same entities. Both lock and unlock are built-in operations supported by all entities.

No operations from other clients are allowed on an entity while it's in a locked state. This behavior ensures that only one orchestration instance can lock an entity at a time. If a caller tries to invoke an operation on an entity while it's locked by an orchestration, that operation is placed in a pending operation queue. No pending operations are processed until after the holding orchestration releases its lock.

> [!NOTE] 
> This behavior is slightly different from synchronization primitives used in most programming languages, such as the `lock` statement in C#. For example, in C#, the `lock` statement must be used by all threads to ensure proper synchronization across multiple threads. Entities, however, don't require all callers to explicitly lock an entity. If any caller locks an entity, all other operations on that entity are blocked and queued behind that lock.

Locks on entities are durable, so they persist even if the executing process is recycled. Locks are internally persisted as part of an entity's durable state.

Unlike transactions, critical sections don't automatically roll back changes when errors occur. Instead, any error handling, such as roll-back or retry, must be explicitly coded, for example by catching errors or exceptions. This design choice is intentional. Automatically rolling back all the effects of an orchestration is difficult or impossible in general, because orchestrations might run activities and make calls to external services that can't be rolled back. Also, attempts to roll back might themselves fail and require further error handling.

### Critical section rules

Unlike low-level locking primitives in most programming languages, critical sections are *guaranteed not to deadlock*. To prevent deadlocks, we enforce the following restrictions: 

* Critical sections can't be nested.
* Critical sections can't create suborchestrations.
* Critical sections can call only entities they have locked.
* Critical sections can't call the same entity using multiple parallel calls.
* Critical sections can signal only entities they haven't locked.

Any violations of these rules cause a runtime error, such as `LockingRulesViolationException` in .NET, which includes a message that explains what rule was broken.
::: zone-end  
::: zone pivot="csharp,javascript,python"  
## Comparison with virtual actors

Many of the durable entities features are inspired by the [actor model](https://en.wikipedia.org/wiki/Actor_model). If you're already familiar with actors, you might recognize many of the concepts described in this article. Durable entities are similar to [virtual actors](https://research.microsoft.com/projects/orleans/), or grains, as popularized by the [Orleans project](http://dotnet.github.io/orleans/). For example:

* Durable entities are addressable via an entity ID.
* Durable entity operations execute serially, one at a time, to prevent race conditions.
* Durable entities are created implicitly when they're called or signaled.
* Durable entities are silently unloaded from memory when not executing operations.

There are some important differences that are worth noting:

* Durable entities prioritize durability over latency, and so might not be appropriate for applications with strict latency requirements.
* Durable entities don't have built-in timeouts for messages. In Orleans, all messages time out after a configurable time. The default is 30 seconds.
* Messages sent between entities are delivered reliably and in order. In Orleans, reliable or ordered delivery is supported for content sent through streams, but isn't guaranteed for all messages between grains.
* Request-response patterns in entities are limited to orchestrations. From within entities, only one-way messaging (also known as signaling) is permitted, as in the original actor model, and unlike grains in Orleans. 
* Durable entities don't deadlock. In Orleans, deadlocks can occur and don't resolve until messages time out.
* Durable entities can be used with durable orchestrations and support distributed locking mechanisms. 
::: zone-end 
## Next steps

> [!div class="nextstepaction"]
> [Read the Developer's guide to durable entities in .NET](durable-functions-dotnet-entities.md)

> [!div class="nextstepaction"]
> [Learn about task hubs](durable-functions-task-hubs.md)
