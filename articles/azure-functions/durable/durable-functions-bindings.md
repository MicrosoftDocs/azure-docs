---
title: Bindings for Durable Functions - Azure
description: How to use triggers and bindings for the Durable Functions extension for Azure Functions.
services: functions
author: ggailey777
manager: jeconnoc
keywords:
ms.service: azure-functions
ms.topic: conceptual
ms.date: 09/04/2019
ms.author: azfuncdf
---

# Bindings for Durable Functions (Azure Functions)

The [Durable Functions](durable-functions-overview.md) extension introduces two new trigger bindings that control the execution of orchestrator and activity functions. It also introduces an output binding that acts as a client for the Durable Functions runtime.

## Orchestration trigger

The orchestration trigger enables you to author [durable orchestrator functions](durable-functions-types-features-overview.md#orchestrator-functions). This trigger supports starting new orchestrator function instances and resuming existing orchestrator function instances that are "awaiting" a task.

When you use the Visual Studio tools for Azure Functions, the orchestration trigger is configured using the [OrchestrationTriggerAttribute](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.OrchestrationTriggerAttribute.html) .NET attribute.

When you write orchestrator functions in scripting languages (for example, JavaScript or C# scripting), the orchestration trigger is defined by the following JSON object in the `bindings` array of the *function.json* file:

```json
{
    "name": "<Name of input parameter in function signature>",
    "orchestration": "<Optional - name of the orchestration>",
    "type": "orchestrationTrigger",
    "direction": "in"
}
```

* `orchestration` is the name of the orchestration. This is the value that clients must use when they want to start new instances of this orchestrator function. This property is optional. If not specified, the name of the function is used.

Internally this trigger binding polls a series of queues in the default storage account for the function app. These queues are internal implementation details of the extension, which is why they are not explicitly configured in the binding properties.

### Trigger behavior

Here are some notes about the orchestration trigger:

* **Single-threading** - A single dispatcher thread is used for all orchestrator function execution on a single host instance. For this reason, it is important to ensure that orchestrator function code is efficient and doesn't perform any I/O. It is also important to ensure that this thread does not do any async work except when awaiting on Durable Functions-specific task types.
* **Poison-message handling** - There is no poison message support in orchestration triggers.
* **Message visibility** - Orchestration trigger messages are dequeued and kept invisible for a configurable duration. The visibility of these messages is renewed automatically as long as the function app is running and healthy.
* **Return values** - Return values are serialized to JSON and persisted to the orchestration history table in Azure Table storage. These return values can be queried by the orchestration client binding, described later.

> [!WARNING]
> Orchestrator functions should never use any input or output bindings other than the orchestration trigger binding. Doing so has the potential to cause problems with the Durable Task extension because those bindings may not obey the single-threading and I/O rules. If you'd like to use other bindings, add them to an Activity function called from your Orchestrator function.

> [!WARNING]
> JavaScript orchestrator functions should never be declared `async`.

### Trigger usage (.NET)

The orchestration trigger binding supports both inputs and outputs. Here are some things to know about input and output handling:

* **inputs** - .NET orchestration functions support only [DurableOrchestrationContext](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html) as a parameter type. Deserialization of inputs directly in the function signature is not supported. Code must use the [GetInput\<T>](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html#Microsoft_Azure_WebJobs_DurableOrchestrationContext_GetInput__1)(.NET) or `getInput` (JavaScript) method to fetch orchestrator function inputs. These inputs must be JSON-serializable types.
* **outputs** - Orchestration triggers support output values as well as inputs. The return value of the function is used to assign the output value and must be JSON-serializable. If a .NET function returns `Task` or `void`, a `null` value will be saved as the output.

### Trigger sample

The following example code shows what the simplest "Hello World" orchestrator function might look like:

#### C#

```csharp
[FunctionName("HelloWorld")]
public static string Run([OrchestrationTrigger] DurableOrchestrationContext context)
{
    string name = context.GetInput<string>();
    return $"Hello {name}!";
}
```

#### JavaScript (Functions 2.x only)

```javascript
const df = require("durable-functions");

module.exports = df.orchestrator(function*(context) {
    const name = context.df.getInput();
    return `Hello ${name}!`;
});
```

> [!NOTE]
> The `context` object in JavaScript does not represent the DurableOrchestrationContext, but the [function context as a whole](../functions-reference-node.md#context-object). You can access orchestration methods via the `context` object's `df` property.

> [!NOTE]
> JavaScript orchestrators should use `return`. The `durable-functions` library takes care of calling the `context.done` method.

Most orchestrator functions call activity functions, so here is a "Hello World" example that demonstrates how to call an activity function:

#### C#

```csharp
[FunctionName("HelloWorld")]
public static async Task<string> Run(
    [OrchestrationTrigger] DurableOrchestrationContext context)
{
    string name = context.GetInput<string>();
    string result = await context.CallActivityAsync<string>("SayHello", name);
    return result;
}
```

#### JavaScript (Functions 2.x only)

```javascript
const df = require("durable-functions");

module.exports = df.orchestrator(function*(context) {
    const name = context.df.getInput();
    const result = yield context.df.callActivity("SayHello", name);
    return result;
});
```

## Activity trigger

The activity trigger enables you to author functions that are called by orchestrator functions, known as [activity functions](durable-functions-types-features-overview.md#activity-functions).

If you're using Visual Studio, the activity trigger is configured using the [ActivityTriggerAttribute](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.ActivityTriggerAttribute.html) .NET attribute.

If you're using VS Code or the Azure portal for development, the activity trigger is defined by the following JSON object in the `bindings` array of *function.json*:

```json
{
    "name": "<Name of input parameter in function signature>",
    "activity": "<Optional - name of the activity>",
    "type": "activityTrigger",
    "direction": "in"
}
```

* `activity` is the name of the activity. This value is the name that orchestrator functions use to invoke this activity function. This property is optional. If not specified, the name of the function is used.

Internally this trigger binding polls a queue in the default storage account for the function app. This queue is an internal implementation detail of the extension, which is why it is not explicitly configured in the binding properties.

### Trigger behavior

Here are some notes about the activity trigger:

* **Threading** - Unlike the orchestration trigger, activity triggers don't have any restrictions around threading or I/O. They can be treated like regular functions.
* **Poison-message handling** - There is no poison message support in activity triggers.
* **Message visibility** - Activity trigger messages are dequeued and kept invisible for a configurable duration. The visibility of these messages is renewed automatically as long as the function app is running and healthy.
* **Return values** - Return values are serialized to JSON and persisted to the orchestration history table in Azure Table storage.

> [!WARNING]
> The storage backend for activity functions is an implementation detail and user code should not interact with these storage entities directly.

### Trigger usage (.NET)

The activity trigger binding supports both inputs and outputs, just like the orchestration trigger. Here are some things to know about input and output handling:

* **inputs** - .NET activity functions natively use [DurableActivityContext](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableActivityContext.html) as a parameter type. Alternatively, an activity function can be declared with any parameter type that is JSON-serializable. When you use `DurableActivityContext`, you can call [GetInput\<T>](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableActivityContext.html#Microsoft_Azure_WebJobs_DurableActivityContext_GetInput__1) to fetch and deserialize the activity function input.
* **outputs** - Activity functions support output values as well as inputs. The return value of the function is used to assign the output value and must be JSON-serializable. If a .NET function returns `Task` or `void`, a `null` value will be saved as the output.
* **metadata** - .NET activity functions can bind to a `string instanceId` parameter to get the instance ID of the parent orchestration.

### Trigger sample

The following example code shows what a simple "Hello World" activity function might look like:

#### C#

```csharp
[FunctionName("SayHello")]
public static string SayHello([ActivityTrigger] DurableActivityContext helloContext)
{
    string name = helloContext.GetInput<string>();
    return $"Hello {name}!";
}
```

The default parameter type for the .NET `ActivityTriggerAttribute` binding is `DurableActivityContext`. However, .NET activity triggers also support binding directly to JSON-serializeable types (including primitive types), so the same function could be simplified as follows:

```csharp
[FunctionName("SayHello")]
public static string SayHello([ActivityTrigger] string name)
{
    return $"Hello {name}!";
}
```

#### JavaScript (Functions 2.x only)

```javascript
module.exports = async function(context) {
    return `Hello ${context.bindings.name}!`;
};
```

JavaScript bindings can also be passed in as additional parameters, so the same function could be simplified as follows:

```javascript
module.exports = async function(context, name) {
    return `Hello ${name}!`;
};
```


### Using input and output bindings

You can use regular input and output bindings in addition to the activity trigger binding. For example, you can take the input to your activity binding, and send a message to an EventHub using the EventHub output binding:

```json
{
  "bindings": [
    {
      "name": "message",
      "type": "activityTrigger",
      "direction": "in"
    },
    {
      "type": "eventHub",
      "name": "outputEventHubMessage",
      "connection": "EventhubConnectionSetting",
      "eventHubName": "eh_messages",
      "direction": "out"
  }
  ]
}
```

```javascript
module.exports = async function (context) {
    context.bindings.outputEventHubMessage = context.bindings.message;
};
```

## Orchestration client

The orchestration client binding enables you to write functions that interact with orchestrator functions. These functions are sometimes referred to as [client functions](durable-functions-types-features-overview.md#client-functions). For example, you can act on orchestration instances in the following ways:

* Start them.
* Query their status.
* Terminate them.
* Send events to them while they're running.
* Purge instance history.

If you're using Visual Studio, you can bind to the orchestration client by using the [OrchestrationClientAttribute](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.OrchestrationClientAttribute.html) .NET attribute for Durable Functions 1.0. Starting in the Durable Functions 2.0 preview, you can bind to the orchestration client by using the `DurableClientAttribute` .NET attribute.

If you're using scripting languages (for example, *.csx* or *.js* files) for development, the orchestration trigger is defined by the following JSON object in the `bindings` array of *function.json*:

```json
{
    "name": "<Name of input parameter in function signature>",
    "taskHub": "<Optional - name of the task hub>",
    "connectionName": "<Optional - name of the connection string app setting>",
    "type": "orchestrationClient",
    "direction": "in"
}
```

* `taskHub` - Used in scenarios where multiple function apps share the same storage account but need to be isolated from each other. If not specified, the default value from `host.json` is used. This value must match the value used by the target orchestrator functions.
* `connectionName` - The name of an app setting that contains a storage account connection string. The storage account represented by this connection string must be the same one used by the target orchestrator functions. If not specified, the default storage account connection string for the function app is used.

> [!NOTE]
> In most cases, we recommend that you omit these properties and rely on the default behavior.

### Client usage

In .NET functions, you typically bind to `DurableOrchestrationClient`, which gives you full access to all client APIs supported by Durable Functions. Starting in Durable Functions 2.0, you instead bind to the `IDurableOrchestrationClient` interface. In JavaScript, the same APIs are exposed by the object returned from `getClient`. APIs on the client object include:

* [StartNewAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_StartNewAsync_)
* [GetStatusAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_GetStatusAsync_)
* [TerminateAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_TerminateAsync_)
* [RaiseEventAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_RaiseEventAsync_)
* [PurgeInstanceHistoryAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_PurgeInstanceHistoryAsync_)
* [CreateCheckStatusResponse](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_CreateCheckStatusResponse_)
* [CreateHttpManagementPayload](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_CreateHttpManagementPayload_)

Alternatively, .NET functions can bind to `IAsyncCollector<T>` where `T` is [StartOrchestrationArgs](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.StartOrchestrationArgs.html) or `JObject`.

For more information on these operations, see the [DurableOrchestrationClient](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html) API documentation.

### Client sample (Visual Studio development)

Here is an example queue-triggered function that starts a "HelloWorld" orchestration.

```csharp
[FunctionName("QueueStart")]
public static Task Run(
    [QueueTrigger("durable-function-trigger")] string input,
    [OrchestrationClient] DurableOrchestrationClient starter)
{
    // Orchestration input comes from the queue message content.
    return starter.StartNewAsync("HelloWorld", input);
}
```

### Client sample (not Visual Studio)

If you're not using Visual Studio for development, you can create the following *function.json* file. This example shows how to configure a queue-triggered function that uses the durable orchestration client binding:

```json
{
  "bindings": [
    {
      "name": "input",
      "type": "queueTrigger",
      "queueName": "durable-function-trigger",
      "direction": "in"
    },
    {
      "name": "starter",
      "type": "orchestrationClient",
      "direction": "in"
    }
  ]
}
```

Following are language-specific samples that start new orchestrator function instances.

#### C# Sample

The following sample shows how to use the durable orchestration client binding to start a new function instance from a C# script function:

```csharp
#r "Microsoft.Azure.WebJobs.Extensions.DurableTask"

public static Task<string> Run(string input, DurableOrchestrationClient starter)
{
    return starter.StartNewAsync("HelloWorld", input);
}
```

#### JavaScript Sample

The following sample shows how to use the durable orchestration client binding to start a new function instance from a JavaScript function:

```javascript
const df = require("durable-functions");

module.exports = async function (context) {
    const client = df.getClient(context);
    return instanceId = await client.startNew("HelloWorld", undefined, context.bindings.input);
};
```

More details on starting instances can be found in [Instance management](durable-functions-instance-management.md).

## Entity trigger

Entity triggers allow you to author [entity functions](durable-functions-entities.md). This trigger supports processing events for a specific entity instance.

When you use the Visual Studio tools for Azure Functions, the entity trigger is configured using the `EntityTriggerAttribute` .NET attribute.

> [!NOTE]
> Entity triggers are available in Durable Functions 2.0 and above. Entity triggers are not yet available for JavaScript.

Internally this trigger binding polls a series of queues in the default storage account for the function app. These queues are internal implementation details of the extension, which is why they are not explicitly configured in the binding properties.

### Trigger behavior

Here are some notes about the entity trigger:

* **Single-threaded**: A single dispatcher thread is used to process operations for a particular entity. If multiple messages are sent to a single entity concurrently, the operations will be processed one-at-a-time.
* **Poison-message handling** - There is no poison message support in entity triggers.
* **Message visibility** - Entity trigger messages are dequeued and kept invisible for a configurable duration. The visibility of these messages is renewed automatically as long as the function app is running and healthy.
* **Return values** - Entity functions do not support return values. There are specific APIs that can be used to save state or pass values back to orchestrations.

Any state changes made to an entity during its execution will be automatically persisted after execution has completed.

### Trigger usage (.NET)

Every entity function has a parameter type of `IDurableEntityContext`, which has the following members:

* **EntityName**: the name of the currently executing entity.
* **EntityKey**: the key of the currently executing entity.
* **EntityId**: the ID of the currently executing entity.
* **OperationName**: the name of the current operation.
* **HasState**: whether the entity exists, that is, has some state. 
* **GetState\<TState>()**: gets the current state of the entity. If it does not already exist, it is created and initialized to `default<TState>`. The `TState` parameter must be a primitive or JSON-serializeable type. 
* **GetState\<TState>(initfunction)**: gets the current state of the entity. If it does not already exist, it is created by calling the provided `initfunction` parameter. The `TState` parameter must be a primitive or JSON-serializeable type. 
* **SetState(arg)**: creates or updates the state of the entity. The `arg` parameter must be a JSON-serializeable object or primitive.
* **DeleteState()**: deletes the state of the entity. 
* **GetInput\<TInput>()**: gets the input for the current operation. The `TInput` type parameter must be a primitive or JSON-serializeable type.
* **Return(arg)**: returns a value to the orchestration that called the operation. The `arg` parameter must be a primitive or JSON-serializeable object.
* **SignalEntity(EntityId, operation, input)**: sends a one-way message to an entity. The `operation` parameter must be a non-null string, and the `input` parameter must be a primitive or JSON-serializeable object.
* **CreateNewOrchestration(orchestratorFunctionName, input)**: starts a new orchestration. The `input` parameter must be a primitive or JSON-serializeable object.

The `IDurableEntityContext` object passed to the entity function can be accessed using the `Entity.Current` async-local property. This approach is convenient when using the class-based programming model.

### Trigger sample (function-based syntax)

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

### Trigger sample (class-based syntax)

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

> [!NOTE]
> The function entry point method with the `[FunctionName]` attribute *must* be declared `static` when using entity classes. Non-static entry point methods may result in multiple object initialization and potentially other undefined behaviors.

Entity classes have special mechanisms for interacting with bindings and .NET dependency injection. For more information, see [Entity construction](durable-functions-dotnet-entities.md#entity-construction).

## Entity client

The entity client binding enables you to asynchronously trigger [entity functions](#entity-trigger). These functions are sometimes referred to as [client functions](durable-functions-types-features-overview.md#client-functions).

If you're using Visual Studio, you can bind to the entity client by using the `DurableClientAttribute` .NET attribute.

> [!NOTE]
> The `[DurableClientAttribute]` can also be used to bind to the [orchestration client](#orchestration-client).

If you're using scripting languages (for example, *.csx* or *.js* files) for development, the entity trigger is defined by the following JSON object in the `bindings` array of *function.json*:

```json
{
    "name": "<Name of input parameter in function signature>",
    "taskHub": "<Optional - name of the task hub>",
    "connectionName": "<Optional - name of the connection string app setting>",
    "type": "durableClient",
    "direction": "out"
}
```

* `taskHub` - Used in scenarios where multiple function apps share the same storage account but need to be isolated from each other. If not specified, the default value from `host.json` is used. This value must match the value used by the target entity functions.
* `connectionName` - The name of an app setting that contains a storage account connection string. The storage account represented by this connection string must be the same one used by the target entity functions. If not specified, the default storage account connection string for the function app is used.

> [!NOTE]
> In most cases, we recommend that you omit the optional properties and rely on the default behavior.

### Entity client usage

In .NET functions, you typically bind to `IDurableEntityClient`, which gives you full access to all client APIs supported by Durable Entities. You can also bind to the `IDurableClient` interface, which provides access to client APIs for both entities and orchestrations. APIs on the client object include:

* **ReadEntityStateAsync\<T>**: reads the state of an entity. It returns a response that indicates whether the target entity exists, and if so, what its state is.
* **SignalEntityAsync**: sends a one-way message to an entity, and waits for it to be enqueued.

There is no need to create the target entity before sending a signal - the entity state can be created from within the entity function that handles the signal.

> [!NOTE]
> It's important to understand that the "signals" sent from the client are simply enqueued, to be processed asynchronously at a later time. In particular, the `SignalEntityAsync` usually returns before the entity even starts the operation, and it is not possible to get back the return value or observe exceptions. If stronger guarantees are required (e.g. for workflows), *orchestrator functions* should be used, which can wait for entity operations to complete, and can process return values and observe exceptions.

### Example: client signals entity directly

Here is an example queue-triggered function that invokes a "Counter" entity.

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

### Example: client signals entity via interface

Where possible, we recommend [accessing entities through interfaces](durable-functions-dotnet-entities.md#accessing-entities-through-interfaces) because it provides more type checking. For example, suppose the `Counter` entity mentioned earlier implemented an `ICounter` interface, defined as follows:

```csharp
public interface ICounter
{
    void Add(int amount);
    void Reset();
    Task<int> Get();
}

public class Counter : ICounter
{
    // ...
}
```

Client code can then use `SignalEntityAsync<ICounter>` to generate a type-safe proxy:

```csharp
[FunctionName("UserDeleteAvailable")]
public static async Task AddValueClient(
    [QueueTrigger("my-queue")] string message,
    [DurableClient] IDurableEntityClient client)
{
    var target = new EntityId(nameof(Counter), "myCounter");
    int amount = int.Parse(message);
    await client.SignalEntityAsync<ICounter>(target, proxy => proxy.Add(amount));
}
```

The `proxy` parameter is a dynamically generated instance of `ICounter`, which internally translates the call to `Add` into the equivalent (untyped) call to `SignalEntityAsync`.

> [!NOTE]
> The `SignalEntityAsync` APIs represent one-way operations. If an entity interfaces returns `Task<T>`, the value of the `T` parameter will always be null or `default`.

In particular, it does not make sense to signal the `Get` operation, as no value is returned. Instead, clients can use either `ReadStateAsync` to access the counter state directly, or can start an orchestrator function that calls the `Get` operation. 

<a name="host-json"></a>
## host.json settings

[!INCLUDE [durabletask](../../../includes/functions-host-json-durabletask.md)]

## Next steps

> [!div class="nextstepaction"]
> [Built-in HTTP API reference for instance management](durable-functions-http-api.md)
