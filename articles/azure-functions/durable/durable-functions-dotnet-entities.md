---
title: Developer's Guide to Durable Entities in .NET - Azure Functions
description: How to work with durable entities in .NET with the Durable Functions extension for Azure Functions.
author: sebastianburckhardt
ms.topic: conceptual
ms.date: 10/24/2023
ms.author: azfuncdf
ms.devlang: csharp
ms.custom: devx-track-dotnet
#Customer intent: As a developer, I want to learn how to use Durable Entities in .NET so I can persist object state in a serverless context.
---

# Developer's guide to durable entities in .NET

In this article, we describe the available interfaces for developing durable entities with .NET in detail, including examples and general advice. 

Entity functions provide serverless application developers with a convenient way to organize application state as a collection of fine-grained entities. For more detail about the underlying concepts, see the [Durable Entities: Concepts](durable-functions-entities.md) article.

We currently offer two APIs for defining entities:

- The **class-based syntax** represents entities and operations as classes and methods. This syntax produces easily readable code and allows operations to be invoked in a type-checked manner through interfaces. 

- The **function-based syntax** is a lower-level interface that represents entities as functions. It provides precise control over how the entity operations are dispatched, and how the entity state is managed.  

This article focuses primarily on the class-based syntax, as we expect it to be better suited for most applications. However, the [function-based syntax](#function-based-syntax) can be appropriate for applications that wish to define or manage their own abstractions for entity state and operations. Also, it can be appropriate for implementing libraries that require genericity not currently supported by the class-based syntax. 

> [!NOTE]
> The class-based syntax is just a layer on top of the function-based syntax, so both variants can be used interchangeably in the same application.

> [!NOTE]
> Durable entities support for the dotnet-isolated worker is currently in **preview**. You can find more samples and provide feedback in the [durabletask-dotnet](https://github.com/microsoft/durabletask-dotnet) GitHub repo. 
 
## Defining entity classes

The following example is an implementation of a `Counter` entity that stores a single value of type integer, and offers four operations `Add`, `Reset`, `Get`, and `Delete`.

### [In-process](#tab/in-process) 
```csharp
[JsonObject(MemberSerialization.OptIn)]
public class Counter
{
    [JsonProperty("value")]
    public int Value { get; set; }

    public void Add(int amount) 
    {
        this.Value += amount;
    }

    public Task Reset() 
    {
        this.Value = 0;
        return Task.CompletedTask;
    }

    public Task<int> Get() 
    {
        return Task.FromResult(this.Value);
    }

    public void Delete() 
    {
        Entity.Current.DeleteState();
    }

    [FunctionName(nameof(Counter))]
    public static Task Run([EntityTrigger] IDurableEntityContext ctx)
        => ctx.DispatchAsync<Counter>();
}
```

The `Run` function contains the boilerplate required for using the class-based syntax. It must be a *static* Azure Function. It executes once for each operation message that is processed by the entity. When `DispatchAsync<T>` is called and the entity isn't already in memory, it constructs an object of type `T` and populates its fields from the last persisted JSON found in storage (if any). Then it invokes the method with the matching name.

The `EntityTrigger` Function, `Run` in this sample, doesn't need to reside within the Entity class itself. It can reside within any valid location for an Azure Function: inside the top-level namespace, or inside a top-level class. However, if nested deeper (e.g, the Function is declared inside a *nested* class), then this Function won't be recognized by the latest runtime.

> [!NOTE]
> The state of a class-based entity is **created implicitly** before the entity processes an operation, and can be **deleted explicitly** in an operation by calling `Entity.Current.DeleteState()`.

### [Isolated worker process](#tab/isolated-process)
There are two ways of defining an entity as a class in the C# isolated worker model. They produce entities with different state serialization structures. 

With the following approach, the entire object is serialized when defining an entity.  
```csharp
public class Counter
{
    public int Value { get; set; }

    public void Add(int amount) 
    {
        this.Value += amount;
    }

    public Task Reset() 
    {
        this.Value = 0;
        return Task.CompletedTask;
    }

    public Task<int> Get() 
    {
        return Task.FromResult(this.Value);
    }

    // Delete is implicitly defined when defining an entity this way

    [Function(nameof(Counter))]
    public static Task Run([EntityTrigger] TaskEntityDispatcher dispatcher)
        => dispatcher.DispatchAsync<Counter>();
}
```
A `TaskEntity<TState>`-based implementation, which makes it easy to use dependency injection. In this case, state is deserialized to the `State` property, and no other property is serialized/deserialized. 

```csharp
public class Counter : TaskEntity<int>
{
    readonly ILogger logger; 

    public Counter(ILogger<Counter> logger)
    {
        this.logger = logger; 
    }

    public int Add(int amount) 
    {
        this.State += amount;
    }

    public Reset() 
    {
        this.State = 0;
        return Task.CompletedTask;
    }

    public Task<int> Get() 
    {
        return Task.FromResult(this.State);
    }

    // Delete is implicitly defined when defining an entity this way

    [Function(nameof(Counter))]
    public static Task Run([EntityTrigger] TaskEntityDispatcher dispatcher)
        => dispatcher.DispatchAsync<Counter>();
}
```
> [!WARNING]
> When writing entities that derive from `ITaskEntity` or `TaskEntity<TState>`, it is important to **not** name your entity trigger method `RunAsync`. This will cause runtime errors when invoking the entity as there is an ambiguous match with the method name "RunAsync" due to `ITaskEntity` already defining an instance-level "RunAsync".

### Deleting entities in the isolated model

Deleting an entity in the isolated model is accomplished by setting the entity state to `null`. How this is accomplished depends on what entity implementation path is being used.

- When deriving from `ITaskEntity` or using [function based syntax](#function-based-syntax), delete is accomplished by calling `TaskEntityOperation.State.SetState(null)`.
- When deriving from `TaskEntity<TState>`, delete is implicitly defined. However, it can be overridden by defining a method `Delete` on the entity. State can also be deleted from any operation via `this.State = null`.
    - To delete by setting state to null requires `TState` to be nullable.
    - The implicitly defined delete operation deletes non-nullable `TState`.
- When using a POCO as your state (not deriving from `TaskEntity<TState>`), delete is implicitly defined. It's possible to override the delete operation by defining a method `Delete` on the POCO. However, there's no way to set state to `null` in the POCO route so the implicitly defined delete operation is the only true delete.

---

### Class Requirements
 
Entity classes are POCOs (plain old CLR objects) that require no special superclasses, interfaces, or attributes. However:

- The class must be constructible (see [Entity construction](#entity-construction)).
- The class must be JSON-serializable (see [Entity serialization](#entity-serialization)).

Also, any method that is intended to be invoked as an operation must satisfy other requirements:

- An operation must have at most one argument, and must not have any overloads or generic type arguments.
- An operation meant to be called from an orchestration using an interface must return `Task` or `Task<T>`.
- Arguments and return values must be serializable values or objects.

### What can operations do?

All entity operations can read and update the entity state, and changes to the state are automatically persisted to storage. Moreover, operations can perform external I/O or other computations, within the general limits common to all Azure Functions.

Operations also have access to functionality provided by the `Entity.Current` context:

* `EntityName`: the name of the currently executing entity.
* `EntityKey`: the key of the currently executing entity.
* `EntityId`: the ID of the currently executing entity (includes name and key).
* `SignalEntity`: sends a one-way message to an entity.
* `CreateNewOrchestration`: starts a new orchestration.
* `DeleteState`: deletes the state of this entity.

For example, we can modify the counter entity so it starts an orchestration when the counter reaches 100 and passes the entity ID as an input argument:

#### [In-process](#tab/in-process)
```csharp
public void Add(int amount) 
{
    if (this.Value < 100 && this.Value + amount >= 100)
    {
        Entity.Current.StartNewOrchestration("MilestoneReached", Entity.Current.EntityId);
    }
    this.Value += amount;      
}
```
#### [Isolated worker process](#tab/isolated-process)
```csharp
public void Add(int amount, TaskEntityContext context) 
{
    if (this.Value < 100 && this.Value + amount >= 100)
    {
        context.ScheduleNewOrchestration("MilestoneReached", context.Id);
    }

    this.Value += amount;      
}
```
---

## Accessing entities directly

Class-based entities can be accessed directly, using explicit string names for the entity and its operations. This section provides examples. For a deeper explanation of the underlying concepts (such as signals vs. calls), see the discussion in [Access entities](durable-functions-entities.md#access-entities). 

> [!NOTE]
> Where possible, you should [accesses entities through interfaces](#accessing-entities-through-interfaces), because it provides more type checking.

### Example: client signals entity

The following Azure Http Function implements a DELETE operation using REST conventions. It sends a delete signal to the counter entity whose key is passed in the URL path.
#### [In-process](#tab/in-process)
```csharp
[FunctionName("DeleteCounter")]
public static async Task<HttpResponseMessage> DeleteCounter(
    [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "Counter/{entityKey}")] HttpRequestMessage req,
    [DurableClient] IDurableEntityClient client,
    string entityKey)
{
    var entityId = new EntityId("Counter", entityKey);
    await client.SignalEntityAsync(entityId, "Delete");    
    return req.CreateResponse(HttpStatusCode.Accepted);
}
```
#### [Isolated worker process](#tab/isolated-process)

```csharp
[Function("DeleteCounter")]
public static async Task<HttpResponseData> DeleteCounter(
    [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "Counter/{entityKey}")] HttpRequestData req,
    [DurableClient] DurableTaskClient client, string entityKey)
{
    var entityId = new EntityInstanceId("Counter", entityKey);
    await client.Entities.SignalEntityAsync(entityId, "Delete");
    return req.CreateResponse(HttpStatusCode.Accepted);
}
```
---

### Example: client reads entity state

The following Azure Http Function implements a GET operation using REST conventions. It reads the current state of the counter entity whose key is passed in the URL path.

#### [In-process](#tab/in-process)
```csharp
[FunctionName("GetCounter")]
public static async Task<HttpResponseMessage> GetCounter(
    [HttpTrigger(AuthorizationLevel.Function, "get", Route = "Counter/{entityKey}")] HttpRequestMessage req,
    [DurableClient] IDurableEntityClient client,
    string entityKey)
{
    var entityId = new EntityId("Counter", entityKey);
    var state = await client.ReadEntityStateAsync<Counter>(entityId); 
    return req.CreateResponse(state);
}
```
> [!NOTE]
> The object returned by `ReadEntityStateAsync` is just a local copy, that is, a snapshot of the entity state from some earlier point in time. In particular, it can be stale, and modifying this object has no effect on the actual entity. 

#### [Isolated worker process](#tab/isolated-process)

```csharp
[Function("GetCounter")]
public static async Task<HttpResponseData> GetCounter(
    [HttpTrigger(AuthorizationLevel.Function, "get", Route = "Counter/{entityKey}")] HttpRequestData req,
    [DurableClient] DurableTaskClient client, string entityKey)
{
    var entityId = new EntityInstanceId("Counter", entityKey);
    EntityMetadata<int>? entity = await client.Entities.GetEntityAsync<int>(entityId);
    HttpResponseData response = request.CreateResponse(HttpStatusCode.OK);
    await response.WriteAsJsonAsync(entity.State);

    return response;
}
```
---

### Example: orchestration first signals then calls entity

The following orchestration signals a counter entity to increment it, and then calls the same entity to read its latest value.

#### [In-process](#tab/in-process)
```csharp
[FunctionName("IncrementThenGet")]
public static async Task<int> Run(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
{
    var entityId = new EntityId("Counter", "myCounter");

    // One-way signal to the entity - does not await a response
    context.SignalEntity(entityId, "Add", 1);

    // Two-way call to the entity which returns a value - awaits the response
    int currentValue = await context.CallEntityAsync<int>(entityId, "Get");

    return currentValue;
}
```

#### [Isolated worker process](#tab/isolated-process)

```csharp
[Function("IncrementThenGet")]
public static async Task<int> Run([OrchestrationTrigger] TaskOrchestrationContext context)
{
    var entityId = new EntityInstanceId("Counter", "myCounter");

    // One-way signal to the entity - does not await a response
    await context.Entities.SignalEntityAsync(entityId, "Add", 1);

    // Two-way call to the entity which returns a value - awaits the response
    int currentValue = await context.Entities.CallEntityAsync<int>(entityId, "Get");

    return currentValue; 
}
```
---

## Accessing entities through interfaces

Interfaces can be used for accessing entities via generated proxy objects. This approach ensures that the name and argument type of an operation matches what is implemented. We recommend using interfaces for accessing entities whenever possible.

For example, we can modify the counter example as follows:

```csharp
public interface ICounter
{
    void Add(int amount);
    Task Reset();
    Task<int> Get();
    void Delete();
}

public class Counter : ICounter
{
    ...
}
```

Entity classes and entity interfaces are similar to the grains and grain interfaces popularized by [Orleans](https://www.microsoft.com/research/project/orleans-virtual-actors/). For a more information about similarities and differences between Durable Entities and Orleans, see [Comparison with virtual actors](durable-functions-entities.md#comparison-with-virtual-actors).

Besides providing type checking, interfaces are useful for a better separation of concerns within the application. For example, since an entity can implement multiple interfaces, a single entity can serve multiple roles. Also, since an interface can be implemented by multiple entities, general communication patterns can be implemented as reusable libraries.

### Example: client signals entity through interface

#### [In-process](#tab/in-process)
Client code can use `SignalEntityAsync<TEntityInterface>` to send signals to entities that implement `TEntityInterface`. For example:

```csharp
[FunctionName("DeleteCounter")]
public static async Task<HttpResponseMessage> DeleteCounter(
    [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "Counter/{entityKey}")] HttpRequestMessage req,
    [DurableClient] IDurableEntityClient client,
    string entityKey)
{
    var entityId = new EntityId("Counter", entityKey);
    await client.SignalEntityAsync<ICounter>(entityId, proxy => proxy.Delete());    
    return req.CreateResponse(HttpStatusCode.Accepted);
}
```

In this example, the `proxy` parameter is a dynamically generated instance of `ICounter`, which internally translates the call to `Delete` into a signal.

> [!NOTE]
> The `SignalEntityAsync` APIs can be used only for one-way operations. Even if an operation returns `Task<T>`, the value of the `T` parameter will always be null or `default`, not the actual result.
For example, it doesn't make sense to signal the `Get` operation, as no value is returned. Instead, clients can use either `ReadStateAsync` to access the counter state directly, or can start an orchestrator function that calls the `Get` operation. 

#### [Isolated worker process](#tab/isolated-process)

This is currently not supported in the .NET isolated worker. 

---

### Example: orchestration first signals then calls entity through proxy

#### [In-process](#tab/in-process)

To call or signal an entity from within an orchestration, `CreateEntityProxy` can be used, along with the interface type, to generate a proxy for the entity. This proxy can then be used to call or signal operations:

```csharp
[FunctionName("IncrementThenGet")]
public static async Task<int> Run(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
{
    var entityId = new EntityId("Counter", "myCounter");
    var proxy = context.CreateEntityProxy<ICounter>(entityId);

    // One-way signal to the entity - does not await a response
    proxy.Add(1);

    // Two-way call to the entity which returns a value - awaits the response
    int currentValue = await proxy.Get();

    return currentValue;
}
```

Implicitly, any operations that return `void` are signaled, and any operations that return `Task` or `Task<T>` are called. One can change this default behavior, and signal operations even if they return Task, by using the `SignalEntity<IInterfaceType>` method explicitly.

#### [Isolated worker process](#tab/isolated-process)

This is currently not supported in the .NET isolated worker. 

---

### Shorter option for specifying the target

When calling or signaling an entity using an interface, the first argument must specify the target entity. The target can be specified either by specifying the entity ID, or, in cases where there's just one class that implements the entity, just the entity key:

```csharp
context.SignalEntity<ICounter>(new EntityId(nameof(Counter), "myCounter"), ...);
context.SignalEntity<ICounter>("myCounter", ...);
```

If only the entity key is specified and a unique implementation can't be found at runtime, `InvalidOperationException` is thrown. 

### Restrictions on entity interfaces

As usual, all parameter and return types must be JSON-serializable. Otherwise, serialization exceptions are thrown at runtime.

We also enforce some more rules:
* Entity interfaces must be defined in the same assembly as the entity class.
* Entity interfaces must only define methods.
* Entity interfaces must not contain generic parameters.
* Entity interface methods must not have more than one parameter.
* Entity interface methods must return `void`, `Task`, or `Task<T>`.

If any of these rules are violated, an `InvalidOperationException` is thrown at runtime when the interface is used as a type argument to `SignalEntity`, `SignalEntityAsync`, or `CreateEntityProxy`. The exception message explains which rule was broken.

> [!NOTE]
> Interface methods returning `void` can only be signaled (one-way), not called (two-way). Interface methods returning `Task` or `Task<T>` can be either called or signalled. If called, they return the result of the operation, or re-throw exceptions thrown by the operation. However, when signalled, they do not return the actual result or exception from the operation, but just the default value.

## Entity serialization

Since the state of an entity is durably persisted, the entity class must be serializable. The Durable Functions runtime uses the [Json.NET](https://www.newtonsoft.com/json) library for this purpose, which supports policies and attributes to control the serialization and deserialization process. Most commonly used C# data types (including arrays and collection types) are already serializable, and can easily be used for defining the state of durable entities.

For example, Json.NET can easily serialize and deserialize the following class:

```csharp
[JsonObject(MemberSerialization = MemberSerialization.OptIn)]
public class User
{
    [JsonProperty("name")]
    public string Name { get; set; }

    [JsonProperty("yearOfBirth")]
    public int YearOfBirth { get; set; }

    [JsonProperty("timestamp")]
    public DateTime Timestamp { get; set; }

    [JsonProperty("contacts")]
    public Dictionary<Guid, Contact> Contacts { get; set; } = new Dictionary<Guid, Contact>();

    [JsonObject(MemberSerialization = MemberSerialization.OptOut)]
    public struct Contact
    {
        public string Name;
        public string Number;
    }

    ...
}
```

### Serialization Attributes

In the example above, we chose to include several attributes to make the underlying serialization more visible:
- We annotate the class with `[JsonObject(MemberSerialization.OptIn)]` to remind us that the class must be serializable, and to persist only members that are explicitly marked as JSON properties.
-  We annotate the fields to be persisted with `[JsonProperty("name")]` to remind us that a field is part of the persisted entity state, and to specify the property name to be used in the JSON representation.

However, these attributes aren't required; other conventions or attributes are permitted as long as they work with Json.NET. For example, one can use `[DataContract]` attributes, or no attributes at all:

```csharp
[DataContract]
public class Counter
{
    [DataMember]
    public int Value { get; set; }
    ...
}

public class Counter
{
    public int Value;
    ...
}
```

By default, the name of the class isn't* stored as part of the JSON representation: that is, we use `TypeNameHandling.None` as the default setting. This default behavior can be overridden using `JsonObject` or `JsonProperty` attributes.

### Making changes to class definitions

Some care is required when making changes to a class definition after an application has been run, because the stored JSON object can no longer match the new class definition. Still, it's often possible to deal correctly with changing data formats as long as one understands the deserialization process used by `JsonConvert.PopulateObject`.

For example, here are some examples of changes and their effect:

* When a new property is added, which isn't present in the stored JSON, it assumes its default value.
* When a property is removed, which is present in the stored JSON, the previous content is lost.
* When a property is renamed, the effect is as if removing the old one and adding a new one.
* When the type of a property is changed so it can no longer be deserialized from the stored JSON, an exception is thrown.
* When the type of a property is changed, but it can still be deserialized from the stored JSON, it does so.

There are many options available for customizing the behavior of Json.NET. For example, to force an exception if the stored JSON contains a field that isn't present in the class, specify the attribute `JsonObject(MissingMemberHandling = MissingMemberHandling.Error)`. It's also possible to write custom code for deserialization that can read JSON stored in arbitrary formats.

## Entity construction

Sometimes we want to exert more control over how entity objects are constructed. We now describe several options for changing the default behavior when constructing entity objects. 

### Custom initialization on first access

Occasionally we need to perform some special initialization before dispatching an operation to an entity that has never been accessed, or that has been deleted. To specify this behavior, one can add a conditional before the `DispatchAsync`:

#### [In-process](#tab/in-process)

```csharp
[FunctionName(nameof(Counter))]
public static Task Run([EntityTrigger] IDurableEntityContext ctx)
{
    if (!ctx.HasState)
    {
        ctx.SetState(...);
    }
    return ctx.DispatchAsync<Counter>();
}
```
#### [Isolated worker process](#tab/isolated-process)

```csharp
public class Counter : TaskEntity<int>
{
    protected override int InitializeState(TaskEntityOperation operation)
    {
        // This is called when state is null, giving a chance to customize first-access of entity.
        return 10;
    }
}
```
---

### Bindings in entity classes

Unlike regular functions, entity class methods don't have direct access to input and output bindings. Instead, binding data must be captured in the entry-point function declaration and then passed to the `DispatchAsync<T>` method. Any objects passed to `DispatchAsync<T>` is passed automatically to the entity class constructor as an argument.

The following example shows how a `CloudBlobContainer` reference from the [blob input binding](../functions-bindings-storage-blob-input.md) can be made available to a class-based entity.

#### [In-process](#tab/in-process)

```csharp
public class BlobBackedEntity
{
    [JsonIgnore]
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
#### [Isolated worker process](#tab/isolated-process)

```csharp
public class BlobBackedEntity : TaskEntity<object?>
{
    private BlobContainerClient Container { get; set; }

    [Function(nameof(BlobBackedEntity))]
    public Task DispatchAsync(
        [EntityTrigger] TaskEntityDispatcher dispatcher, 
        [BlobInput("my-container")] BlobContainerClient container)
    {
        this.Container = container;
        return dispatcher.DispatchAsync(this);
    }
}
```
---

For more information on bindings in Azure Functions, see the [Azure Functions Triggers and Bindings](../functions-triggers-bindings.md) documentation.

### Dependency injection in entity classes

Entity classes support [Azure Functions Dependency Injection](../functions-dotnet-dependency-injection.md). The following example demonstrates how to register an `IHttpClientFactory` service into a class-based entity.

#### [In-process](#tab/in-process)

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
#### [Isolated worker process](#tab/isolated-process)

The following demonstrates how to configure an `HttpClient` in the `program.cs` file to be imported later in the entity class. 

```csharp
public class Program
{
    public static void Main()
    {
        IHost host = new HostBuilder()
            .ConfigureFunctionsWorkerDefaults((IFunctionsWorkerApplicationBuilder workerApplication) =>
            {
                workerApplication.Services.AddHttpClient<HttpEntity>()
                    .ConfigureHttpClient(client => {/* configure http client here */});
             })
            .Build();

        host.Run();
    }
}
```
---

The following snippet demonstrates how to incorporate the injected service into your entity class.

#### [In-process](#tab/in-process)

```csharp
public class HttpEntity
{
    [JsonIgnore]
    private readonly HttpClient client;

    public HttpEntity(IHttpClientFactory factory)
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

    [FunctionName(nameof(HttpEntity))]
    public static Task Run([EntityTrigger] IDurableEntityContext ctx)
        => ctx.DispatchAsync<HttpEntity>();
}
```

#### [Isolated worker process](#tab/isolated-process)

```csharp
public class HttpEntity : TaskEntity<object?>
{
    private readonly HttpClient client;

     public HttpEntity(HttpClient client)
    {
        this.client = client;
    }

    public async Task<int> GetAsync(string url)
    {
        using var response = await this.client.GetAsync(url);
        return (int)response.StatusCode;
    }

    [Function(nameof(HttpEntity))]
    public static Task Run([EntityTrigger] TaskEntityDispatcher dispatcher)
        => dispatcher.DispatchAsync<HttpEntity>();
}
```
---

> [!NOTE]
> To avoid issues with serialization, make sure to exclude fields meant to store injected values from the serialization.

> [!NOTE]
> Unlike when using constructor injection in regular .NET Azure Functions, the functions entry point method for class-based entities *must* be declared `static`. Declaring a non-static function entry point can cause conflicts between the normal Azure Functions object initializer and the Durable Entities object initializer.

## Function-based syntax

So far we have focused on the class-based syntax, as we expect it to be better suited for most applications. However, the function-based syntax can be appropriate for applications that wish to define or manage their own abstractions for entity state and operations. Also, it can be appropriate when implementing libraries that require genericity not currently supported by the class-based syntax. 

With the function-based syntax, the Entity Function explicitly handles the operation dispatch, and explicitly manages the state of the entity. For example, the following code shows the *Counter* entity implemented using the function-based syntax.  

### [In-process](#tab/in-process)

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
        case "delete":
            ctx.DeleteState();
            break;
    }
}
```

### The entity context object

Entity-specific functionality can be accessed via a context object of type `IDurableEntityContext`. This context object is available as a parameter to the entity function, and via the async-local property `Entity.Current`.

The following members provide information about the current operation, and allow us to specify a return value. 

* `EntityName`: the name of the currently executing entity.
* `EntityKey`: the key of the currently executing entity.
* `EntityId`: the ID of the currently executing entity (includes name and key).
* `OperationName`: the name of the current operation.
* `GetInput<TInput>()`: gets the input for the current operation.
* `Return(arg)`: returns a value to the orchestration that called the operation.

The following members manage the state of the entity (create, read, update, delete). 

* `HasState`: whether the entity exists, that is, has some state. 
* `GetState<TState>()`: gets the current state of the entity. If it doesn't already exist, it's created.
* `SetState(arg)`: creates or updates the state of the entity.
* `DeleteState()`: deletes the state of the entity, if it exists. 

If the state returned by `GetState` is an object, it can be directly modified by the application code. There's no need to call `SetState` again at the end (but also no harm). If `GetState<TState>` is called multiple times, the same type must be used.

Finally, the following members are used to signal other entities, or start new orchestrations:

* `SignalEntity(EntityId, operation, input)`: sends a one-way message to an entity.
* `CreateNewOrchestration(orchestratorFunctionName, input)`: starts a new orchestration.

### [Isolated worker process](#tab/isolated-process)

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
---

## Next steps

> [!div class="nextstepaction"]
> [Learn about entity concepts](durable-functions-entities.md)
