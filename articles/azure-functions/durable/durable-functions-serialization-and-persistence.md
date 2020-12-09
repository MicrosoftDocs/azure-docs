---
title: Data persistence and serialization in Durable Functions - Azure
description: Learn how the Durable Functions extension for Azure Functions persists data
author: ConnorMcMahon
ms.topic: conceptual
ms.date: 11/16/2020
ms.author: azfuncdf
#Customer intent: As a developer, I want to understand what data is persisted to durable storage, how that data is serialized, and how
#I can customize it when it doesn't work the way my app needs it to.
---

# Data persistence and serialization in Durable Functions (Azure Functions)

Durable Functions automatically persists various parameters and state to a durable backend in order to provide reliable orchestration and entity executions. Data persisted to durable storage can impact application performance, storage transaction costs, and data privacy policies.

## Azure Storage

By default, Durable Functions persists data to Azure Storage.

### Queues

Most Durable Functions APIs initially persist data Azure Storage queues. Once Durable Functions processes the queue message, it deletes the queue message and persists the data to either Azure Storage Tables or Azure Storage Blobs.

Durable Functions creates and writes to the work item queue `<taskhub>-workitem` and the control queues `<taskhub>-control-##`. The number of control queues is equal to the number of partitions configured for your application.

### Tables

Once orchestrations process messages successfully, the data is persisted to the history table named `<taskhub>History`. Some data is also persisted to the instance table named `<taskhub>Instances`. 

### Blobs

In most cases, Durable Functions doesn't use Azure Storage Blobs to persist data. However, queues and tables have size limits that can prevent Durable Functions from persisting all of the data into a storage row or queue message. When a piece of data that needs to be persisted is greater than 45 KB when serialized, Durable Functions will compress the data and store it in a blob instead. Durable Function stores a reference to that blob in the table row or queue message, and when Durable Functions needs to retrieve the data it will automatically fetch it from the blob. These blobs are stored in the blob container `taskhub>-largemessages`.

> [!NOTE]
> The extra compression and blob operation steps for large messages can be expensive in terms of CPU usage and IO latency. Additionally, Durable Functions can store persisted data in memory for many function executions at a time, so persisting large pieces of data can cause high memory usage as well. In these cases, it is often preferable to persist large pieces of data manually, and instead pass around references to this data. This way your code can fetch the data only when needed to avoid consistently taking a performance hit.

## Data-persisting APIs

The following APIs persist data to the backend used by the Durable Task Framework. If your application deals with sensitive data that needs encryption or needs to be stored in some other manner,consider one of the following approaches:

- Override [the default serialization logic](#customizing-serialization-and-deserialization) and encrypt the data as part of the serialization.
- Instead of passing the sensitive data into these APIs, manually handle data persistence with your own code, and pass along references to the sensitive data so it can be accessed in your activity functions.

# [C#](#tab/csharp)

### Client Function APIs

```cs
[FunctionName("ClientFunction")]
public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
    [DurableClient] IDurableClient client)
{
    string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
    dynamic httpBody = JsonConvert.DeserializeObject(requestBody);

    // The orchestrator function name, orchestration input, and instance id are all persisted to backend storage
    string instanceId = await client.StartNewAsync(orchestratorFunctionName: "OrchestrationFunction", input: httpBody.OrchestrationInput);

    // The instance id, event name, and event data are all persisted to backend storage
    await client.RaiseEventAsync(instanceId: instanceId, eventName: "SampleEvent", httpBody.EventData);

    // The instance id and reason are persisted to backend storage
    await client.TerminateAsync(instanceId: instanceId, reason: "Completed");

    // The entity name, entity key, schedule time, operation name, and operation input are all persisted
    await client.SignalEntity(
        entityId: new EntityId(httpBody.EntityName, httpBody.EntityKey),
        scheduledTimeUtc: DateTime.UtcNow,
        operationName: httpBody.EntityOpName,
        operationInput: httpBody.EntityOpInput);

    return new OkObjectResult();
}
```

### Orchestrator Functions

```cs
[FunctionName("Orchestration")]
public static async Task<string> Run(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
{
    dynamic inputs = JsonConvert.DeserializedObject(context.GetInput<string>());

    // The function name and activity input are persisted.
    string activityOutput = await context.CallActivityAsync<string>(functionName: "Activity", input: inputs.ActivityInput);

    // The function name, instance id, and sub-orchestration inputs are all persisted.
    string subOrchOutput = await context.CallSubOrchestrationAsync<string>(functionName: "SubOrchestration", instanceId: context.ExecutionId + ":0", input: inputs.SubOrchInput);

    // The fire-at datetime and state parameters are persisted.
    await context.CreateTimer<string>(fireAt: context.CurrentUtcDateTime, state: "TimerState", cancelToken = CancellationToken.None);

    // The entity name and entity key are persisted
    var entityId = new EntityId("EntityName", "EntityKey");
    using (await context.LockAsync(entityId))
    {
        // For both APIs, the entity name, entity key, operation name, and operation inputs are persisted.
        await context.CallEntityAsync<string>(entityId, operationName: inputs.EntityOpName, operationInput: inputs.EntityOpInput);
        context.SignalEntity<string>(entityId, operationName: inputs.EntityOpName, operationInput: inputs.EntityOpInput);
    }

    // Note that all of the below fields on DurableHttpRequest are persisted when using CallHttpAsync()
    var httpRequest = new DurableHttpRequest()
    {
        method = HttpMethod.Post,
        uri = new Uri(inputs.HttpUri),
        headers = inputs.HttpHeaders,
        content = inputs.HttpContent
    }

    // The status code, headers, and content of DurableHttpResponse are persisted when using CallHttpAsync()
    DurableHttpResponse httpResponse = await context.CallHttpAsync(httpRequest);

    // The custom status is persisted
    context.SetCustomStatus(inputs.CustomStatus);

    if (inputs.ThrowException)
    {
        // All exceptions thrown by the orchestration are serialized and persisted.
        throw new Exception("This exception is serialized and persisted!");
    }

    // The output is persisted. It is important to note that the output can also be set via IDurableOrchestrationContext.SetOutput(),
    // and it is also persisted when set this way.
    return "output";
}
```

### Activity Functions

```cs
[FunctionName("Activity")]
public static async Task<object> Activity([ActivityTrigger] IDurableActivityContext context)
{
    bool throwException = context.GetInput<bool>();
    if (throwException)
    {
        // All exceptions thrown by the activity are serialized and persisted.
        throw new Exception("This exception is serialized and persisted!");
    }

    // Outputs returned from activity functions are persisted.
    return "Output"
}
```

### Entity Functions

```cs
[FunctionName("Entity")]
public static void Entity([EntityTrigger] IDurableEntityContext ctx)
{

    switch (ctx.OperationName.ToLowerInvariant())
    {
        case "get":
            var currentState = ctx.GetState<int>();

            // result is persisted
            ctx.Return(result: currentState);
            break;
        case "set":
            var input = ctx.GetInput<int>();

            // state is persisted
            ctx.SetState(state: input);
            break;
        case "signal":
            var (key, input) = ctx.GetInput<(string, string)>();

            // Entity name, entity key, and input are all persisted
            ctx.SignalEntity(new EntityId("Entity", key), input: input);
            break;
        case "start":
            var (name, input, id) = ctx.GetInput<(string, string, string)>();

            // Orchestration name, input, and instance id are all serialized
            ctx.StartNewOrchestration(functionName: name, input: input, instanceId: id);
    }
}
```

# [JavaScript](#tab/javascript)

### Client Function APIs

```javascript
const df = require("durable-functions");

module.exports = async function (context, req) {
    const client = df.getClient(context);

    // The orchestrator function name, orchestration input, and instance id are all persisted to backend storage
    const instanceId = await client.startNew(req.params.functionName, undefined, req.body.orchestrationInput);

    // The instance id, event name, and event data are all persisted to backend storage
    const eventName = "SampleEvent";
    await client.raiseEvent(instanceId, eventName, httpBody.EventData);


    // The instance id and reason are persisted to backend storage
    const reason = "Completed";
    await client.Terminate(instanceId, reason);

    // The entity name, entity key, schedule time, operation name, and operation input are all persisted
    const entityId = new df.EntityId(httpBody.EntityName, httpBody.EntityKey);
    const scheduledTimeUtc = DateTime.UtcNow;
    await client.signalEntity(
        entityId,
        scheduledTimeUtc,
        httpBody.EntityOpName,
        httpBody.EntityOpInput);

    return "";
};

```

### Orchestrator Functions

```javascript
const df = require("durable-functions");

module.exports = df.orchestrator(function* (context) {

    const inputs = context.getInput();

    // The function name and activity input are persisted.
    const activityOutput = yield context.callActivity("ActivityName", inputs.activityInput);

    // The function name, instance id, and sub-orchestration inputs are all persisted.
    const orchestrationName = "SubOrchestration";
    const instanceId = context.ExecutionId + ":0";
    const subOrchOutput = yield context.callSubOrchestrator(orchestrationName, instanceId, inputs.subOrchInput);

    // The fire-at datetime parameter is persisted.
    const fireAt = context.currentUtcDateTime;
    yield context.createTimer(fireAt);

    
    // For both APIs, the entity name, entity key, operation name, and operation inputs are persisted.
    const entityId = new df.EntityId("EntityName", "EntityKey");
    const entityResponse = yield context.callEntity(entityId, inputs.entityOpName, inputs.entityOpInput);
    // TODO: signalEntity is not implemented yet by DurableJS
    context.signalEntity(entityId, inputs.entityOpName, inputs.entityOpInput);

    // The method, status code, headers, and content parameters are all persisted
    const httpResponse = yield context.callHttp(
        "POST",
        inputs.httpUri,
        inputs.httpContent,
        inputs.httpHeaders
    );

    // The custom status is persisted
    context.setCustomStatus(inputs.customStatus);

    // All errors thrown by the exception are serialized
    if (inputs.throwException)
    {
        // All errors thrown by the orchestration are serialized and persisted.
        throw new Error("This exception is serialized and persisted!");
    }

    // The output is persisted.
    return "output";
}
```

### Activity Functions

```javascript

const df = require("durable-functions");

module.exports = async function (context, throwError) {
    if (throwError) 
    {
        // All error thrown by the activity are serialized and persisted.
        throw new Error("This error is serialized and persisted!");
    }

    // Outputs returned from activity functions are persisted.
    return "Output"
};
```

### Entity Functions

```javascript
const df = require("durable-functions");

module.exports = df.entity(function (context) {
    switch (context.df.operationName) {
        case "get":
            let result = context.df.getState(() => 0);

            // result is persisted
            context.df.return(result);
            break;
        case "set":
            let state = context.df.getInput();

            // state is persisted
            context.df.setState(state);
            break;
        case "signal":
            let entityOp = context.df.getInput();

            // Entity name, entity key, and input are all persisted
            context.df.signalEntity(new df.EntityId("Entity", entityOp.Key), entityOp.Input);
            break;
    }

});
```

---

## Customizing serialization and deserialization

# [C#](#tab/csharp)

### Default serialization logic

Durable Functions internally uses [Json.NET](https://www.newtonsoft.com/json/help/html/Introduction.htm) to serialize orchestration and entity data to JSON. The default settings Durable Functions uses for Json.NET are:

**Inputs, Outputs, and State:**

```csharp
JsonSerializerSettings
{
    TypeNameHandling = TypeNameHandling.None,
    DateParseHandling = DateParseHandling.None,
}
```

**Exceptions:**

```csharp
JsonSerializerSettings
{
    ContractResolver = new ExceptionResolver(),
    TypeNameHandling = TypeNameHandling.Objects,
    ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
}
```

Read more detailed documentation about `JsonSerializerSettings` [here](https://www.newtonsoft.com/json/help/html/SerializationSettings.htm).

## Customizing with Attributes

When serializing data, Json.NET looks for [various attributes](https://www.newtonsoft.com/json/help/html/SerializationAttributes.htm) on classes and properties that control how the data is serialized and deserialized from JSON. If you own source code for data type passed to Durable Functions APIs, consider adding these attributes to the type to customize serialization and deserialization.

## Customizing with Dependency Injection

Function apps that target .NET and run on the Functions V3 runtime can use Dependency Injection (DI) to customize how data and exceptions are serialized. The sample classes below demonstrate how to use DI to override the default serialization settings using custom implementations of the `IMessageSerializerSettingsFactory` and `IErrorSerializerSettingsFactory` service interfaces.

```csharp
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Azure.WebJobs.Extensions.DurableTask;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Collections.Generic;

[assembly: FunctionsStartup(typeof(MyApplication.Startup))]
namespace MyApplication
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddSingleton<IMessageSerializerSettingsFactory, CustomMessageSerializerSettingFactory>();
            builder.Services.AddSingleton<IErrorSerializerSettingsFactory, CustomErrorSerializerSettingsFactory>();
        }

        /// <summary>
        /// A factory that provides the serialization for all inputs and outputs for activities and
        /// orchestrations, as well as entity state.
        /// </summary>
        internal class CustomMessageSerializerSettingsFactory : IMessageSerializerSettingsFactory
        {
            public JsonSerializerSettings CreateJsonSerializerSettings()
            {
                // Put your custom JsonSerializerSettings here
            }
        }

        /// <summary>
        /// A factory that provides the serialization for all exceptions thrown by activities
        /// and orchestrations
        /// </summary>
        internal class CustomErrorSerializerSettingsFactory : IErrorSerializerSettingsFactory
        {
            public JsonSerializerSettings CreateJsonSerializerSettings()
            {
                // Put your custom JsonSerializerSettings here
            }
        }
    }
}
```

# [JavaScript](#tab/javascript)

### Serialization and deserialization logic.

Azure Functions Node applications use [`JSON.stringify()` for serialization](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) and [`JSON.Parse()` for deserialization](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse). Most types should serialize and deserialize seamlessly. In cases where the default logic is insufficient, defining a `toJSON()` method on the object will hijack the serialization logic. However, no analogue exists for object deserialization.

For full customization of the serialization/deserialization pipeline, consider handling the serialization and deserialization with your own code and passing around data as strings.

---
