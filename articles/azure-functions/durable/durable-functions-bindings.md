---
title: Bindings for Durable Functions - Azure
description: Become familiar with triggers and bindings for the Durable Functions extension for Azure Functions. Also find information about Durable Functions settings.
ms.topic: concept-article
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 09/29/2025
ms.author: azfuncdf
zone_pivot_groups: programming-languages-set-functions-lang-workers
# Customer intent: As a developer, I want to become familiar with Durable Functions triggers and bindings so that I can use them to control the execution of orchestrator, entity, activity, and client functions in my function apps.
---

# Bindings for Durable Functions (Azure Functions)

The [Durable Functions](durable-functions-overview.md) extension introduces three trigger bindings that control the execution of orchestrator, entity, and activity functions. It also introduces an output binding that acts as a client for the Durable Functions runtime.

This article discusses the use of these four bindings and provides code samples. It also provides information about the Durable Functions configuration properties in *host.json*, the metadata file that contains settings that affect all functions in a function app. 

Make sure to select your Durable Functions development language at the top of the article.

::: zone pivot="programming-language-python" 

Both versions of the [Python programming model for Azure Functions](../functions-reference-python.md) are supported by Durable Functions. Because Python v2 is the recommended version, examples in this article exclusively feature this version.  

## Prerequisites

* Durable Functions SDK, which is the Python Package Index (PyPI) package `azure-functions-durable`, version `1.2.2` or a later version 
* [Extension bundle](../extension-bundles.md) version 4.x (or a later version), which is set in the *host.json* project file

You can provide feedback and suggestions in the [Durable Functions SDK for Python repository](https://github.com/Azure/azure-functions-durable-python/issues).
::: zone-end

## Orchestration trigger

You can use the orchestration trigger to develop [durable orchestrator functions](durable-functions-types-features-overview.md#orchestrator-functions). This trigger executes when a new orchestration instance is scheduled and when an existing orchestration instance receives an event. Examples of events that can trigger orchestrator functions include durable timer expirations, activity function responses, and events raised by external clients.

::: zone pivot="programming-language-csharp"
When you develop functions in .NET, you use the [OrchestrationTriggerAttribute](/dotnet/api/microsoft.azure.webjobs.extensions.durabletask.orchestrationtriggerattribute) .NET attribute to configure the orchestration trigger. 
::: zone-end  
::: zone pivot="programming-language-java"   
For Java, you use the `@DurableOrchestrationTrigger` annotation to configure the orchestration trigger.
::: zone-end  
::: zone pivot="programming-language-javascript"
When you use version 4 of the Node.js programming model to develop functions, you import the `app` object from the `@azure/functions npm` module. Then you call the `app.orchestration` method of the Durable Functions API directly in your function code. This method registers your orchestrator function with the Durable Functions framework.
::: zone-end
::: zone pivot="programming-language-powershell" 
When you write orchestrator functions, you define the orchestration trigger by using the following JSON object in the `bindings` array of the *function.json* file:

```json
{
    "name": "<name-of-input-parameter-in-function-signature>",
    "orchestration": "<optional-name-of-orchestration>",
    "type": "orchestrationTrigger",
    "direction": "in"
}
```

The `orchestration` value is the name of the orchestration that clients must use when they want to start new instances of the orchestrator function. This property is optional. If you don't specify it, the name of the function is used.
::: zone-end
::: zone pivot="programming-language-python"  
When you use the Python v2 programming model, you can define an orchestration trigger by using the `orchestration_trigger` decorator directly in your Python function code. 

In the v2 model, you access the Durable Functions triggers and bindings from an instance of `DFApp`. You can use this subclass of `FunctionApp` to export decorators that are specific to Durable Functions. 
::: zone-end    

Internally, this trigger binding polls the configured durable store for new orchestration events. Examples of events include orchestration start events, durable timer expiration events, activity function response events, and external events raised by other functions.

### Trigger behavior

Here are some notes about the orchestration trigger:

* **Single-threading**: A single dispatcher thread is used for all orchestrator function execution on a single host instance. For this reason, it's important to ensure that orchestrator function code is efficient and doesn't perform any I/O operations. It's also important to ensure that this thread doesn't do any asynchronous work except when awaiting task types that are specific to Durable Functions.
* **Poison-message handling**: There's no support for poison messages in orchestration triggers.
* **Message visibility**: Orchestration trigger messages are dequeued and kept invisible for a configurable duration. The visibility of these messages is renewed automatically as long as the function app is running and healthy.
* **Return values**: Return values are serialized to JSON and persisted to the orchestration history table in Azure Table Storage. These return values can be queried by the orchestration client binding, described later.

> [!WARNING]
> Orchestrator functions should never use any input or output bindings other than the orchestration trigger binding. Using other bindings can cause problems with the Durable Task extension, because those bindings might not obey the single-threading and I/O rules. If you want to use other bindings, add them to an activity function called from your orchestrator function. For more information about coding constraints for orchestrator functions, see [Orchestrator function code constraints](durable-functions-code-constraints.md).

::: zone pivot="programming-language-javascript,programming-language-python"
> [!WARNING]
> Orchestrator functions should never be declared `async`.
::: zone-end

<a name="python-trigger-usage"></a> 
### Trigger usage

The orchestration trigger binding supports both inputs and outputs. Here are some notes about input and output handling:

* **Inputs**: You can invoke orchestration triggers that have inputs. The inputs are accessed through the context input object. All inputs must be JSON-serializable.
* **Outputs**: Orchestration triggers support both output and input values. The return value of the function is used to assign the output value. The return value must be JSON-serializable.

### Trigger sample

The following code provides an example of a basic *Hello World* orchestrator function. This example orchestrator doesn't schedule any tasks.

::: zone pivot="programming-language-csharp"
The attribute that you use to define the trigger depends on whether you run your C# functions [in the same process as the Functions host process](../functions-dotnet-class-library.md) or in an [isolated worker process](../dotnet-isolated-process-guide.md).

#### [In-process](#tab/in-process)

```csharp
[FunctionName("HelloWorld")]
public static string RunOrchestrator([OrchestrationTrigger] IDurableOrchestrationContext context)
{
    string name = context.GetInput<string>();
    return $"Hello {name}!";
}
```

> [!NOTE]
> The preceding code is for Durable Functions 2.x. For Durable Functions 1.x, you must use `DurableOrchestrationContext` instead of `IDurableOrchestrationContext`. For more information about the differences between versions, see [Durable Functions versions overview](durable-functions-versions.md).

#### [Isolated process](#tab/isolated-process)

```csharp
[Function("HelloWorld")]
public static string RunOrchestrator([OrchestrationTrigger] TaskOrchestrationContext context, string name)
{
    return $"Hello {name}!";
}
```

> [!NOTE]
> In the isolated worker model and the in-process model for .NET Durable Functions apps, you can use `context.GetInput<T>()` to extract the orchestration input. However, the isolated worker model also supports the input being supplied as a parameter, as shown in the preceding code. The input binds to the first parameter, which has no binding attribute on it and isn't a well-known type already covered by other input bindings, such as `FunctionContext`.

---

::: zone-end  
::: zone pivot="programming-language-javascript" 

```javascript
const { app } = require('@azure/functions');
const df = require('durable-functions');

df.app.orchestration('helloOrchestrator', function* (context) {
    const name = context.df.getInput();
    return `Hello ${name}`;
});
```

> [!NOTE]
> The `durable-functions` library calls the synchronous `context.done` method when the generator function exits.
::: zone-end  
::: zone pivot="programming-language-python" 

```python
import azure.functions as func
import azure.durable_functions as df

myApp = df.DFApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@myApp.orchestration_trigger(context_name="context")
def my_orchestrator(context):
    result = yield context.call_activity("Hello", "Tokyo")
    return result
```

::: zone-end  
::: zone pivot="programming-language-powershell" 

```powershell
param($Context)

$InputData = $Context.Input
$InputData
```
::: zone-end  
::: zone pivot="programming-language-java" 

```java
@FunctionName("HelloWorldOrchestration")
public String helloWorldOrchestration(
        @DurableOrchestrationTrigger(name = "ctx") TaskOrchestrationContext ctx) {
    return String.format("Hello %s!", ctx.getInput(String.class));
}
```
::: zone-end

::: zone pivot="programming-language-csharp,programming-language-java,programming-language-javascript"
Most orchestrator functions call activity functions. The following code provides a *Hello World* example that demonstrates how to call an activity function:
::: zone-end
::: zone pivot="programming-language-csharp"
### [In-process](#tab/in-process)

```csharp
[FunctionName("HelloWorld")]
public static async Task<string> RunOrchestrator(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
{
    string name = context.GetInput<string>();
    string result = await context.CallActivityAsync<string>("SayHello", name);
    return result;
}
```

> [!NOTE]
> The preceding code is for Durable Functions 2.x. For Durable Functions 1.x, you must use `DurableOrchestrationContext` instead of `IDurableOrchestrationContext`. For more information about the differences between versions, see [Durable Functions versions overview](durable-functions-versions.md).

### [Isolated process](#tab/isolated-process)

```csharp
[Function("HelloWorld")]
public static async Task<string> RunOrchestrator(
    [OrchestrationTrigger] TaskOrchestrationContext context, string name)
{
    string result = await context.CallActivityAsync<string>("SayHello", name);
    return result;
}
```

---

::: zone-end  
::: zone pivot="programming-language-javascript" 

```javascript
const { app } = require('@azure/functions');
const df = require('durable-functions');

const activityName = 'hello';

df.app.orchestration('helloOrchestrator', function* (context) {
    const name = context.df.getInput();
    const result = yield context.df.callActivity(activityName, name);
    return result;
});
```
::: zone-end  
::: zone pivot="programming-language-java" 

```java
@FunctionName("HelloWorld")
public String helloWorldOrchestration(
        @DurableOrchestrationTrigger(name = "ctx") TaskOrchestrationContext ctx) {
    String input = ctx.getInput(String.class);
    String result = ctx.callActivity("SayHello", input, String.class).await();
    return result;
}
```
::: zone-end

## Activity trigger

You can use the activity trigger to develop functions known as [activity functions](durable-functions-types-features-overview.md#activity-functions) that are called by orchestrator functions.

::: zone pivot="programming-language-csharp"
You use the [ActivityTriggerAttribute](/dotnet/api/microsoft.azure.webjobs.extensions.durabletask.activitytriggerattribute) .NET attribute to configure the activity trigger.
::: zone-end  
::: zone pivot="programming-language-java" 
You use the `@DurableActivityTrigger` annotation to configure the activity trigger.
::: zone-end  
::: zone pivot="programming-language-javascript"
To register your activity function, you import the `app` object from the `@azure/functions npm` module. Then you call the `app.activity` method of the Durable Functions API directly in your function code.
::: zone-end
::: zone pivot="programming-language-powershell" 
To define the activity trigger, you use the following JSON object in the `bindings` array of *function.json*:

```json
{
    "name": "<name-of-input-parameter-in-function-signature>",
    "activity": "<optional-name-of-activity>",
    "type": "activityTrigger",
    "direction": "in"
}
```

The `activity` value is the name of the activity. This value is the name that orchestrator functions use to invoke this activity function. This property is optional. If you don't specify it, the name of the function is used.
::: zone-end
::: zone pivot="programming-language-python"  
You can define an activity trigger by using the `activity_trigger` decorator directly in your Python function code. 
::: zone-end    

Internally, this trigger binding polls the configured durable store for new activity execution events.

### Trigger behavior

Here are some notes about the activity trigger:

* **Threading**: Unlike the orchestration trigger, activity triggers don't have any restrictions on threading or I/O operations. They can be treated like regular functions.
* **Poison-message handling**: There's no support for poison messages in activity triggers.
* **Message visibility**: Activity trigger messages are dequeued and kept invisible for a configurable duration. The visibility of these messages is renewed automatically as long as the function app is running and healthy.
* **Return values**: Return values are serialized to JSON and persisted to the configured durable store.

### Trigger usage

The activity trigger binding supports both inputs and outputs, just like the orchestration trigger. Here are some notes about input and output handling:

* **Inputs**: Activity triggers can be invoked with inputs from an orchestrator function. All inputs must be JSON-serializable.
* **Outputs**: Activity functions support both output and input values. The return value of the function is used to assign the output value and must be JSON-serializable.
* **Metadata**: .NET activity functions can bind to a `string instanceId` parameter to get the instance ID of the calling orchestration.

### Trigger sample

The following code provides an example of a basic *Hello World* activity function.

::: zone pivot="programming-language-csharp"
### [In-process](#tab/in-process)

```csharp
[FunctionName("SayHello")]
public static string SayHello([ActivityTrigger] IDurableActivityContext helloContext)
{
    string name = helloContext.GetInput<string>();
    return $"Hello {name}!";
}
```

The default parameter type for the .NET `ActivityTriggerAttribute` binding is [IDurableActivityContext](/dotnet/api/microsoft.azure.webjobs.extensions.durabletask.idurableactivitycontext) (or [DurableActivityContext](/previous-versions/dotnet/api/microsoft.azure.webjobs.durableactivitycontext) for Durable Functions 1.x). However, .NET activity triggers also support binding directly to JSON-serializeable types (including primitive types), so you can also use the following simplified version of the function:

```csharp
[FunctionName("SayHello")]
public static string SayHello([ActivityTrigger] string name)
{
    return $"Hello {name}!";
}
```

### [Isolated process](#tab/isolated-process)

In the isolated worker model for .NET, only serializable types representing your input are supported for the `[ActivityTrigger]` binding attribute.

```csharp
[Function("SayHello")]
public static string SayHello([ActivityTrigger] string name)
{
    return $"Hello {name}!";
}
```

---

::: zone-end  
::: zone pivot="programming-language-javascript" 
```javascript
const { app } = require('@azure/functions');
const df = require('durable-functions');
const activityName = 'hello';
df.app.activity(activityName, {
    handler: (input) => {
        return `Hello, ${input}`;
    },
});
```

::: zone-end  
::: zone pivot="programming-language-python" 

```python
import azure.functions as func
import azure.durable_functions as df

myApp = df.DFApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@myApp.activity_trigger(input_name="myInput")
def my_activity(myInput: str):
    return "Hello " + myInput
```

::: zone-end  
::: zone pivot="programming-language-powershell" 
```powershell
param($name)

"Hello $name!"
```
::: zone-end  
::: zone pivot="programming-language-java" 
```java
@FunctionName("SayHello")
public String sayHello(@DurableActivityTrigger(name = "name") String name) {
    return String.format("Hello %s!", name);
}
```
::: zone-end

### Use input and output bindings

Besides the activity trigger binding, you can also use regular input and output bindings. 

::: zone pivot="programming-language-javascript" 
For example, an activity function can receive input from an orchestrator function. The activity function can then send that input as a message to Azure Event Hubs.

```javascript
const { app } = require('@azure/functions');
const df = require('durable-functions');

df.app.orchestration('helloOrchestrator', function* (context) {
    const input = context.df.getInput();
    yield context.df.callActivity('sendToEventHub', input);
    return `Message sent: ${input}`;
});

const { EventHubProducerClient } = require("@azure/event-hubs");
const connectionString = process.env.EVENT_HUB_CONNECTION_STRING;
const eventHubName = process.env.EVENT_HUB_NAME;

df.app.activity("sendToEventHub", {
    handler: async (message, context) => {
        const producer = new EventHubProducerClient(connectionString, eventHubName);
        try {
            const batch = await producer.createBatch();
            batch.tryAdd({ body: message });
            await producer.sendBatch(batch);
            context.log(`Message sent to Event Hubs: ${message}`);
        } catch (err) {
            context.log.error("Failed to send message to Event Hubs:", err);
            throw err;
        } finally {
            await producer.close();
        }
    },
});

app.storageQueue('helloQueueStart', {
    queueName: 'start-orchestration',
    extraInputs: [df.input.durableClient()],
    handler: async (message, context) => {
        const client = df.getClient(context);
        const orchestratorName = message.orchestratorName || 'helloOrchestrator';
        const input = message.input || null;
        const instanceId = await client.startNew(orchestratorName, { input });
        context.log(`Started orchestration with ID = '${instanceId}'`);
    },
});
```
::: zone-end

## Orchestration client

You can use the orchestration client binding to write functions that interact with orchestrator functions. These functions are often referred to as [client functions](durable-functions-types-features-overview.md#client-functions). For example, you can act on orchestration instances in the following ways:

* Start them.
* Query their status.
* Terminate them.
* Send events to them while they're running.
* Purge the instance history.

::: zone pivot="programming-language-csharp"
You can bind to an orchestration client by using the [DurableClientAttribute](/dotnet/api/microsoft.azure.webjobs.extensions.durabletask.durableclientattribute) attribute ([OrchestrationClientAttribute](/previous-versions/dotnet/api/microsoft.azure.webjobs.orchestrationclientattribute) in Durable Functions 1.x). 
::: zone-end  
::: zone pivot="programming-language-java" 
You can bind to an orchestration client by using the `@DurableClientInput` annotation.
::: zone-end  
::: zone pivot="programming-language-javascript"
To register your client function, you import the `app` object from the `@azure/functions npm` module. Then you call a Durable Functions API method that's specific to your trigger type. For instance, for an HTTP trigger, you call the `app.http` method. For a queue trigger, you call the `app.storageQueue` method.
::: zone-end
::: zone pivot="programming-language-powershell" 
To define the durable client trigger, you use the following JSON object in the `bindings` array of *function.json*:

```json
{
    "name": "<name-of-input-parameter-in-function-signature>",
    "taskHub": "<optional-name-of-task-hub>",
    "connectionName": "<optional-name-of-connection-string-app-setting>",
    "type": "orchestrationClient",
    "direction": "in"
}
```

* The `taskHub` property is used when multiple function apps share the same storage account but need to be isolated from each other. If you don't specify this property, the default value from *host.json* is used. This value must match the value that the target orchestrator functions use.
* The `connectionName` value is the name of an app setting that contains a storage account connection string. The storage account represented by this connection string must be the same one that the target orchestrator functions use. If you don't specify this property, the default storage account connection string for the function app is used.

> [!NOTE]
> In most cases, we recommend that you omit these properties and rely on the default behavior.
::: zone-end
::: zone pivot="programming-language-python"  
You can define a durable client trigger by using the `durable_client_input` decorator directly in your Python function code. 
::: zone-end 

### Client usage

::: zone pivot="programming-language-csharp"
You typically bind to an implementation of [IDurableClient](/dotnet/api/microsoft.azure.webjobs.extensions.durabletask.idurableclient) ([DurableOrchestrationClient](/previous-versions/dotnet/api/microsoft.azure.webjobs.durableorchestrationclient) in Durable Functions 1.x), which gives you full access to all orchestration client APIs that Durable Functions supports. 
::: zone-end  
::: zone pivot="programming-language-java" 
You typically bind to the `DurableClientContext` class. 
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-powershell" 
You must use the language-specific SDK to get access to a client object.
::: zone-end

The following code provides an example of a queue-triggered function that starts a *Hello World* orchestration.

::: zone pivot="programming-language-csharp"

#### [In-process](#tab/in-process)

```csharp
[FunctionName("QueueStart")]
public static Task Run(
    [QueueTrigger("durable-function-trigger")] string input,
    [DurableClient] IDurableOrchestrationClient starter)
{
    // Orchestration input comes from the queue message content.
    return starter.StartNewAsync<string>("HelloWorld", input);
}
```

> [!NOTE]
> The preceding C# code is for Durable Functions 2.x. For Durable Functions 1.x, you must use the `OrchestrationClient` attribute instead of the `DurableClient` attribute, and you must use the `DurableOrchestrationClient` parameter type instead of `IDurableOrchestrationClient`. For more information about the differences between versions, see [Durable Functions versions overview](durable-functions-versions.md).

#### [Isolated process](#tab/isolated-process)

```csharp
[Function("QueueStart")]
public static Task Run(
    [QueueTrigger("durable-function-trigger")] string input,
    [DurableClient] DurableTaskClient client)
{
    // Orchestration input comes from the queue message content.
    return client.ScheduleNewOrchestrationInstanceAsync("HelloWorld", input);
}
```

---

::: zone-end  
::: zone pivot="programming-language-javascript" 
```javascript
const { app } = require('@azure/functions');
const df = require('durable-functions');

app.storageQueue('helloQueueStart', {
    queueName: 'start-orchestration',
    extraInputs: [df.input.durableClient()],
    handler: async (message, context) => {
        const client = df.getClient(context);
        const orchestratorName = message.orchestratorName || 'helloOrchestrator';
        const input = message.input || null;
        const instanceId = await client.startNew(orchestratorName, { input });
        context.log(`Started orchestration with ID = '${instanceId}' from queue message.`);
    },
});
```
::: zone-end  
::: zone pivot="programming-language-python" 

```python
import azure.functions as func
import azure.durable_functions as df

myApp = df.DFApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@myApp.queue_trigger(
    arg_name="msg",
    queue_name="start-orchestration",
    connection="AzureWebJobsStorage"
)
@myApp.durable_client_input(client_name="client")
async def client_function(msg: func.QueueMessage, client: df.DurableOrchestrationClient):
    input_data = msg.get_body().decode("utf-8")
    await client.start_new("my_orchestrator", None, input_data)
    return None
```

::: zone-end 
::: zone pivot="programming-language-powershell" 

**function.json**
```json
{
  "bindings": [
    {
      "name": "InputData",
      "type": "queueTrigger",
      "queueName": "durable-function-trigger",
      "direction": "in"
    },
    {
      "name": "starter",
      "type": "durableClient",
      "direction": "in"
    }
  ]
}
```

**run.ps1**
```powershell
param([string]$InputData, $TriggerMetadata)

$InstanceId = Start-DurableOrchestration -FunctionName 'HelloWorld' -Input $InputData
```

::: zone-end  
::: zone pivot="programming-language-java" 

```java
@FunctionName("QueueStart")
public void queueStart(
        @QueueTrigger(name = "input", queueName = "durable-function-trigger", connection = "Storage") String input,
        @DurableClientInput(name = "durableContext") DurableClientContext durableContext) {
    // Orchestration input comes from the queue message content.
    durableContext.getClient().scheduleNewOrchestrationInstance("HelloWorld", input);
}
```
::: zone-end  
For detailed information about starting instances, see [Manage instances in Durable Functions in Azure](durable-functions-instance-management.md).

## Entity trigger

You can use the entity trigger to develop an [entity function](durable-functions-entities.md). This trigger supports processing events for a specific entity instance.

> [!NOTE]
> Entity triggers are available starting in Durable Functions 2.x.

Internally, this trigger binding polls the configured durable store for new entity operations that need to be executed.

::: zone pivot="programming-language-csharp"
You use the [EntityTriggerAttribute](/dotnet/api/microsoft.azure.webjobs.extensions.durabletask.entitytriggerattribute) .NET attribute to configure the entity trigger.

::: zone-end  
::: zone pivot="programming-language-javascript" 
To register the entity trigger, you import the `app` object from the `@azure/functions npm` module. Then you call the `app.entity` method of the Durable Functions API directly in your function code.
```javascript
const df = require('durable-functions');
df.app.entity('counter', (context) => {
    const currentValue = context.df.getState(() => 0);
    switch (context.df.operationName) {
        case 'add':
            context.df.setState(currentValue + context.df.getInput());
            break;
        case 'reset':
            context.df.setState(0);
            break;
        case 'get':
            context.df.return(currentValue);
            break;
    }
});
```
::: zone-end 
::: zone pivot="programming-language-java" 
> [!NOTE]
> Entity triggers aren't yet supported for Java.
::: zone-end  
::: zone pivot="programming-language-powershell" 
> [!NOTE]
> Entity triggers aren't yet supported for PowerShell.
::: zone-end 
::: zone pivot="programming-language-python"  
You can define an entity trigger by using the `entity_trigger` decorator directly in your Python function code. 
::: zone-end 

### Trigger behavior

Here are some notes about the entity trigger:

* **Single-threading**: A single dispatcher thread is used to process operations for a particular entity. If multiple messages are sent to a single entity concurrently, the operations are processed one at a time.
* **Poison-message handling**: There's no support for poison messages in entity triggers.
* **Message visibility**: Entity trigger messages are dequeued and kept invisible for a configurable duration. The visibility of these messages is renewed automatically as long as the function app is running and healthy.
* **Return values**: Entity functions don't support return values. There are specific APIs that you can use to save state or pass values back to orchestrations.

Any state changes made to an entity during its execution are automatically persisted after execution is complete.

For more information and examples of defining and interacting with entity triggers, see [Entity functions](durable-functions-entities.md).

## Entity client

You can use the entity client binding to asynchronously trigger [entity functions](#entity-trigger). These functions are sometimes referred to as [client functions](durable-functions-types-features-overview.md#client-functions).

::: zone pivot="programming-language-csharp"
You can bind to the entity client by using the [DurableClientAttribute](/dotnet/api/microsoft.azure.webjobs.extensions.durabletask.durableclientattribute) .NET attribute in .NET class library functions.

> [!NOTE]
> You can also use the `[DurableClientAttribute]` to bind to the [orchestration client](#orchestration-client).

::: zone-end  
::: zone pivot="programming-language-javascript" 
Instead of registering an entity client, you use `signalEntity` or `callEntity` to call an entity trigger method from any registered function.

- From a queue-triggered function, you can use `client.signalEntity`:
  ```javascript
  const { app } = require('@azure/functions');
  const df = require('durable-functions');
  app.storageQueue('helloQueueStart', {
      queueName: 'start-orchestration',
      extraInputs: [df.input.durableClient()],
      handler: async (message, context) => {
          const client = df.getClient(context);
          const entityId = new df.EntityId('counter', 'myCounter');
          await client.signalEntity(entityId, 'add', 5);
      },
  });
  ```

- From an orchestrator function, you can use `context.df.callEntity`:

  ```javascript
  const { app } = require('@azure/functions');
  const df = require('durable-functions');
  df.app.orchestration('entityCaller', function* (context) {
      const entityId = new df.EntityId('counter', 'myCounter');
      yield context.df.callEntity(entityId, 'add', 5);
      yield context.df.callEntity(entityId, 'add', 5);
      const result = yield context.df.callEntity(entityId, 'get');
      return result;
  });
  ```
::: zone-end  
::: zone pivot="programming-language-python"  
You can define an entity client by using the `durable_client_input` decorator directly in your Python function code. 
::: zone-end  
::: zone pivot="programming-language-java" 
> [!NOTE]
> Entity clients aren't yet supported for Java.
::: zone-end  
::: zone pivot="programming-language-powershell" 
> [!NOTE]
> Entity clients aren't yet supported for PowerShell.
::: zone-end  

For more information and examples of interacting with entities as a client, see [Access entities](durable-functions-entities.md#access-entities).

<a name="host-json"></a>
## Durable Functions settings in host.json

This section provides information about the Durable Functions configuration properties in *host.json*. For information about general settings in *host.json*, see [host.json reference for Azure Functions 1.x](../functions-host-json-v1.md) or [host.json reference for Azure Functions 2.x and later](../functions-host-json.md).

[!INCLUDE [durabletask](../../../includes/functions-host-json-durabletask.md)]

## Next steps

> [!div class="nextstepaction"]
> [Built-in HTTP API reference for instance management](durable-functions-http-api.md)
