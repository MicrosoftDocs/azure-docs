---
title: Bindings for Durable Functions - Azure
description: How to use triggers and bindings for the Durable Functions extension for Azure Functions.
ms.topic: conceptual
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 03/22/2023
ms.author: azfuncdf
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Bindings for Durable Functions (Azure Functions)

The [Durable Functions](durable-functions-overview.md) extension introduces three trigger bindings that control the execution of orchestrator, entity, and activity functions. It also introduces an output binding that acts as a client for the Durable Functions runtime.

Make sure to choose your Durable Functions development language at the top of the article.

::: zone pivot="programming-language-python" 

> [!IMPORTANT]   
> This article supports both Python v1 and Python v2 programming models for Durable Functions.  

## Python v2 programming model

Durable Functions is supported in the new [Python v2 programming model](../functions-reference-python.md?pivots=python-mode-decorators). To use the v2 model, you must install the Durable Functions SDK, which is the PyPI package `azure-functions-durable`, version `1.2.2` or a later version. You must also check `host.json` to make sure your app is referencing [Extension Bundles](../functions-bindings-register.md#extension-bundles) version 4.x to use the v2 model with Durable Functions. 

You can provide feedback and suggestions in the [Durable Functions SDK for Python repo](https://github.com/Azure/azure-functions-durable-python/issues).
::: zone-end

## Orchestration trigger

The orchestration trigger enables you to author [durable orchestrator functions](durable-functions-types-features-overview.md#orchestrator-functions). This trigger executes when a new orchestration instance is scheduled and when an existing orchestration instance receives an event. Examples of events that can trigger orchestrator functions include durable timer expirations, activity function responses, and events raised by external clients.

::: zone pivot="programming-language-csharp"
When you author functions in .NET, the orchestration trigger is configured using the [OrchestrationTriggerAttribute](/dotnet/api/microsoft.azure.webjobs.extensions.durabletask.orchestrationtriggerattribute) .NET attribute. 
::: zone-end  
::: zone pivot="programming-language-java"   
For Java, the `@DurableOrchestrationTrigger` annotation is used to configure the orchestration trigger.
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-powershell" 
When you write orchestrator functions, the orchestration trigger is defined by the following JSON object in the `bindings` array of the *function.json* file:

```json
{
    "name": "<Name of input parameter in function signature>",
    "orchestration": "<Optional - name of the orchestration>",
    "type": "orchestrationTrigger",
    "direction": "in"
}
```

* `orchestration` is the name of the orchestration that clients must use when they want to start new instances of this orchestrator function. This property is optional. If not specified, the name of the function is used.
::: zone-end
::: zone pivot="programming-language-python"  
Azure Functions supports two programming models for Python. The way that you define an orchestration trigger depends on your chosen programming model.

# [v2](#tab/python-v2)
The Python v2 programming model lets you define an orchestration trigger using the `orchestration_trigger` decorator directly in your Python function code. 

In the v2 model, the Durable Functions triggers and bindings are accessed from an instance of `DFApp`, which is a subclass of `FunctionApp` that additionally exports Durable Functions-specific decorators. 

# [v1](#tab/python-v1)
When you write orchestrator functions in the Python v1 programming model, the orchestration trigger is defined by the following JSON object in the `bindings` array of the *function.json* file:

```json
{
    "name": "<Name of input parameter in function signature>",
    "orchestration": "<Optional - name of the orchestration>",
    "type": "orchestrationTrigger",
    "direction": "in"
}
```

* `orchestration` is the name of the orchestration that clients must use when they want to start new instances of this orchestrator function. This property is optional. If not specified, the name of the function is used.

---

::: zone-end    

Internally, this trigger binding polls the configured durable store for new orchestration events, such as orchestration start events, durable timer expiration events, activity function response events, and external events raised by other functions.

### Trigger behavior

Here are some notes about the orchestration trigger:

* **Single-threading** - A single dispatcher thread is used for all orchestrator function execution on a single host instance. For this reason, it's important to ensure that orchestrator function code is efficient and doesn't perform any I/O. It is also important to ensure that this thread does not do any async work except when awaiting on Durable Functions-specific task types.
* **Poison-message handling** - There's no poison message support in orchestration triggers.
* **Message visibility** - Orchestration trigger messages are dequeued and kept invisible for a configurable duration. The visibility of these messages is renewed automatically as long as the function app is running and healthy.
* **Return values** - Return values are serialized to JSON and persisted to the orchestration history table in Azure Table storage. These return values can be queried by the orchestration client binding, described later.

> [!WARNING]
> Orchestrator functions should never use any input or output bindings other than the orchestration trigger binding. Doing so has the potential to cause problems with the Durable Task extension because those bindings may not obey the single-threading and I/O rules. If you'd like to use other bindings, add them to an activity function called from your orchestrator function. For more information about coding constraints for orchestrator functions, see the [Orchestrator function code constraints](durable-functions-code-constraints.md) documentation.

::: zone pivot="programming-language-javascript,programming-language-python"
> [!WARNING]
> Orchestrator functions should never be declared `async`.
::: zone-end

### Trigger usage

The orchestration trigger binding supports both inputs and outputs. Here are some things to know about input and output handling:

* **inputs** - Orchestration triggers can be invoked with inputs, which are accessed through the context input object. All inputs must be JSON-serializable.
* **outputs** - Orchestration triggers support output values as well as inputs. The return value of the function is used to assign the output value and must be JSON-serializable.

### Trigger sample

The following example code shows what the simplest "Hello World" orchestrator function might look like. Note that this example orchestrator doesn't actually schedule any tasks.

::: zone pivot="programming-language-csharp"
The specific attribute used to define the trigger depends on whether you are running your C# functions [in-process](../functions-dotnet-class-library.md) or in an [isolated worker process](../dotnet-isolated-process-guide.md).

# [In-process](#tab/in-process)

```csharp
[FunctionName("HelloWorld")]
public static string Run([OrchestrationTrigger] IDurableOrchestrationContext context)
{
    string name = context.GetInput<string>();
    return $"Hello {name}!";
}
```

> [!NOTE]
> The previous code is for Durable Functions 2.x. For Durable Functions 1.x, you must use `DurableOrchestrationContext` instead of `IDurableOrchestrationContext`. For more information about the differences between versions, see the [Durable Functions Versions](durable-functions-versions.md) article.

# [Isolated process](#tab/isolated-process)

```csharp
[Function("HelloWorld")]
public static string Run([OrchestrationTrigger] TaskOrchestrationContext context, string name)
{
    return $"Hello {name}!";
}
```

> [!NOTE]
> In both Durable functions in-proc and in .NET-isolated, the orchestration input can be extracted via `context.GetInput<T>()`. However, .NET-isolated also supports the input being supplied as a parameter, as shown above. The input binding will bind to the first parameter which has no binding attribute on it and is not a well-known type already covered by other input bindings (ie: `FunctionContext`).

---

::: zone-end  
::: zone pivot="programming-language-javascript" 

```javascript
const df = require("durable-functions");

module.exports = df.orchestrator(function*(context) {
    const name = context.df.getInput();
    return `Hello ${name}!`;
});
```

> [!NOTE]
> The `durable-functions` library takes care of calling the synchronous `context.done` method when the generator function exits.
::: zone-end  
::: zone pivot="programming-language-python" 
# [v2](#tab/python-v2)

```python
import azure.functions as func
import azure.durable_functions as df

myApp = df.DFApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@myApp.orchestration_trigger(context_name="context")
def my_orchestrator(context):
    result = yield context.call_activity("Hello", "Tokyo")
    return result
```

# [v1](#tab/python-v1)
```python
import azure.durable_functions as df

def orchestrator_function(context: df.DurableOrchestrationContext):
    input = context.get_input()
    return f"Hello {input['name']}!"

main = df.Orchestrator.create(orchestrator_function)
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
Most orchestrator functions call activity functions, so here is a "Hello World" example that demonstrates how to call an activity function:
::: zone-end
::: zone pivot="programming-language-csharp"
# [In-process](#tab/in-process)

```csharp
[FunctionName("HelloWorld")]
public static async Task<string> Run(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
{
    string name = context.GetInput<string>();
    string result = await context.CallActivityAsync<string>("SayHello", name);
    return result;
}
```

> [!NOTE]
> The previous code is for Durable Functions 2.x. For Durable Functions 1.x, you must use `DurableOrchestrationContext` instead of `IDurableOrchestrationContext`. For more information about the differences between versions, see the [Durable Functions versions](durable-functions-versions.md) article.

# [Isolated process](#tab/isolated-process)

```csharp
[Function("HelloWorld")]
public static async Task<string> Run(
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
const df = require("durable-functions");

module.exports = df.orchestrator(function*(context) {
    const name = context.df.getInput();
    const result = yield context.df.callActivity("SayHello", name);
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

The activity trigger enables you to author functions that are called by orchestrator functions, known as [activity functions](durable-functions-types-features-overview.md#activity-functions).

::: zone pivot="programming-language-csharp"
The activity trigger is configured using the [ActivityTriggerAttribute](/dotnet/api/microsoft.azure.webjobs.extensions.durabletask.activitytriggerattribute) .NET attribute. 
::: zone-end  
::: zone pivot="programming-language-java" 
The activity trigger is configured using the `@DurableActivityTrigger` annotation.
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-powershell" 
The activity trigger is defined by the following JSON object in the `bindings` array of *function.json*:

```json
{
    "name": "<Name of input parameter in function signature>",
    "activity": "<Optional - name of the activity>",
    "type": "activityTrigger",
    "direction": "in"
}
```

* `activity` is the name of the activity. This value is the name that orchestrator functions use to invoke this activity function. This property is optional. If not specified, the name of the function is used.
::: zone-end
::: zone pivot="programming-language-python"  
The way that you define an activity trigger depends on your chosen programming model.

# [v2](#tab/python-v2)
Using the `activity_trigger` decorator directly in your Python function code. 

# [v1](#tab/python-v1)
The activity trigger is defined by the following JSON object in the `bindings` array of *function.json*:

```json
{
    "name": "<Name of input parameter in function signature>",
    "activity": "<Optional - name of the activity>",
    "type": "activityTrigger",
    "direction": "in"
}
```

* `activity` is the name of the activity. This value is the name that orchestrator functions use to invoke this activity function. This property is optional. If not specified, the name of the function is used.

---
::: zone-end    

Internally, this trigger binding polls the configured durable store for new activity execution events.

### Trigger behavior

Here are some notes about the activity trigger:

* **Threading** - Unlike the orchestration trigger, activity triggers don't have any restrictions around threading or I/O. They can be treated like regular functions.
* **Poison-message handling** - There's no poison message support in activity triggers.
* **Message visibility** - Activity trigger messages are dequeued and kept invisible for a configurable duration. The visibility of these messages is renewed automatically as long as the function app is running and healthy.
* **Return values** - Return values are serialized to JSON and persisted to the configured durable store.

### Trigger usage

The activity trigger binding supports both inputs and outputs, just like the orchestration trigger. Here are some things to know about input and output handling:

* **inputs** - Activity triggers can be invoked with inputs from an orchestrator function. All inputs must be JSON-serializable.
* **outputs** - Activity functions support output values as well as inputs. The return value of the function is used to assign the output value and must be JSON-serializable.
* **metadata** - .NET activity functions can bind to a `string instanceId` parameter to get the instance ID of the calling orchestration.

### Trigger sample

The following example code shows what a simple `SayHello` activity function might look like.

::: zone pivot="programming-language-csharp"
# [In-process](#tab/in-process)

```csharp
[FunctionName("SayHello")]
public static string SayHello([ActivityTrigger] IDurableActivityContext helloContext)
{
    string name = helloContext.GetInput<string>();
    return $"Hello {name}!";
}
```

The default parameter type for the .NET `ActivityTriggerAttribute` binding is [IDurableActivityContext](/dotnet/api/microsoft.azure.webjobs.extensions.durabletask.idurableactivitycontext) (or [DurableActivityContext](/dotnet/api/microsoft.azure.webjobs.durableactivitycontext?view=azure-dotnet-legacy&preserve-view=true) for Durable Functions v1). However, .NET activity triggers also support binding directly to JSON-serializeable types (including primitive types), so the same function could be simplified as follows:

```csharp
[FunctionName("SayHello")]
public static string SayHello([ActivityTrigger] string name)
{
    return $"Hello {name}!";
}
```

# [Isolated process](#tab/isolated-process)

In the .NET-isolated worker, only serializable types representing your input are supported for the `[ActivityTrigger]`.

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

::: zone-end  
::: zone pivot="programming-language-python" 

# [v2](#tab/python-v2)

```python
import azure.functions as func
import azure.durable_functions as df

myApp = df.DFApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@myApp.activity_trigger(input_name="myInput")
def my_activity(myInput: str):
    return "Hello " + myInput
```

# [v1](#tab/python-v1)

```python
def main(name: str) -> str:
    return f"Hello {name}!"
```

---

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

### Using input and output bindings

You can use regular input and output bindings in addition to the activity trigger binding. 

::: zone pivot="programming-language-javascript" 
For example, you can take the input to your activity binding, and send a message to an EventHub using the EventHub output binding:

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
::: zone-end

## Orchestration client

The orchestration client binding enables you to write functions that interact with orchestrator functions. These functions are often referred to as [client functions](durable-functions-types-features-overview.md#client-functions). For example, you can act on orchestration instances in the following ways:

* Start them.
* Query their status.
* Terminate them.
* Send events to them while they're running.
* Purge instance history.

::: zone pivot="programming-language-csharp"
You can bind to the orchestration client by using the [DurableClientAttribute](/dotnet/api/microsoft.azure.webjobs.extensions.durabletask.durableclientattribute) attribute ([OrchestrationClientAttribute](/dotnet/api/microsoft.azure.webjobs.orchestrationclientattribute?view=azure-dotnet-legacy&preserve-view=true) in Durable Functions v1.x). 
::: zone-end  
::: zone pivot="programming-language-java" 
You can bind to the orchestration client by using the `@DurableClientInput` annotation.
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-powershell" 
The durable client trigger is defined by the following JSON object in the `bindings` array of *function.json*:

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
::: zone-end
::: zone pivot="programming-language-python"  
The way that you define a durable client trigger depends on your chosen programming model.

# [v2](#tab/python-v2)
Using the `durable_client_input` decorator directly in your Python function code. 

# [v1](#tab/python-v1)
The durable client trigger is defined by the following JSON object in the `bindings` array of *function.json*:

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

---
::: zone-end 

### Client usage

::: zone pivot="programming-language-csharp"
You typically bind to [IDurableClient](/dotnet/api/microsoft.azure.webjobs.extensions.durabletask.idurableclient) ([DurableOrchestrationClient](/dotnet/api/microsoft.azure.webjobs.durableorchestrationclient?view=azure-dotnet-legacy&preserve-view=true) in Durable Functions v1.x), which gives you full access to all orchestration client APIs supported by Durable Functions. 
::: zone-end  
::: zone pivot="programming-language-java" 
You typically bind to the `DurableClientContext` class. 
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-powershell" 
You must use the language-specific SDK to get access to a client object.
::: zone-end

Here's an example queue-triggered function that starts a "HelloWorld" orchestration.

::: zone pivot="programming-language-csharp"

# [In-process](#tab/in-process)

```csharp
[FunctionName("QueueStart")]
public static Task Run(
    [QueueTrigger("durable-function-trigger")] string input,
    [DurableClient] IDurableOrchestrationClient starter)
{
    // Orchestration input comes from the queue message content.
    return starter.StartNewAsync("HelloWorld", input);
}
```

> [!NOTE]
> The previous C# code is for Durable Functions 2.x. For Durable Functions 1.x, you must use `OrchestrationClient` attribute instead of the `DurableClient` attribute, and you must use the `DurableOrchestrationClient` parameter type instead of `IDurableOrchestrationClient`. For more information about the differences between versions, see the [Durable Functions Versions](durable-functions-versions.md) article.

# [Isolated process](#tab/isolated-process)

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
::: zone pivot="programming-language-javascript,programming-language-powershell" 

**function.json**
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
      "type": "durableClient",
      "direction": "in"
    }
  ]
}
```

::: zone-end
::: zone pivot="programming-language-javascript"
**index.js**
```javascript
const df = require("durable-functions");

module.exports = async function (context) {
    const client = df.getClient(context);
    return instanceId = await client.startNew("HelloWorld", undefined, context.bindings.input);
};
```
::: zone-end  
::: zone pivot="programming-language-powershell" 

**run.ps1**
```powershell
param([string] $input, $TriggerMetadata)

$InstanceId = Start-DurableOrchestration -FunctionName $FunctionName -Input $input
```
::: zone-end  
::: zone pivot="programming-language-python" 

# [v2](#tab/python-v2)

```python
import azure.functions as func
import azure.durable_functions as df

myApp = df.DFApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@myApp.route(route="orchestrators/{functionName}")
@myApp.durable_client_input(client_name="client")
async def durable_trigger(req: func.HttpRequest, client):
    function_name = req.route_params.get('functionName')
    instance_id = await client.start_new(function_name)
    response = client.create_check_status_response(req, instance_id)
    return response
```

# [v1](#tab/python-v1)

**`function.json`**
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
      "type": "durableClient",
      "direction": "in"
    }
  ]
}
```

**`__init__.py`**
```python
import json
import azure.functions as func
import azure.durable_functions as df

async def main(msg: func.QueueMessage, starter: str) -> None:
    client = df.DurableOrchestrationClient(starter)
    payload = msg.get_body().decode('utf-8')
    instance_id = await client.start_new("HelloWorld", client_input=payload)
```
---

::: zone-end 
::: zone pivot="programming-language-powershell" 

**function.json**
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
More details on starting instances can be found in [Instance management](durable-functions-instance-management.md).

## Entity trigger

Entity triggers allow you to author [entity functions](durable-functions-entities.md). This trigger supports processing events for a specific entity instance.

> [!NOTE]
> Entity triggers are available starting in Durable Functions 2.x.

Internally, this trigger binding polls the configured durable store for new entity operations that need to be executed.

::: zone pivot="programming-language-csharp"
The entity trigger is configured using the [EntityTriggerAttribute](/dotnet/api/microsoft.azure.webjobs.extensions.durabletask.entitytriggerattribute) .NET attribute.

> [!NOTE]
> Entity triggers aren't yet supported for isolated worker process apps.
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-powershell" 
The entity trigger is defined by the following JSON object in the `bindings` array of *function.json*:

```json
{
    "name": "<Name of input parameter in function signature>",
    "entityName": "<Optional - name of the entity>",
    "type": "entityTrigger",
    "direction": "in"
}
```

By default, the name of an entity is the name of the function.
::: zone-end 
::: zone pivot="programming-language-java" 
> [!NOTE]
> Entity triggers aren't yet supported for Java.
::: zone-end  
::: zone pivot="programming-language-python"  
The way that you define a entity trigger depends on your chosen programming model.

# [v2](#tab/python-v2)
Using the `entity_trigger` decorator directly in your Python function code. 

# [v1](#tab/python-v1)
The entity trigger is defined by the following JSON object in the `bindings` array of *function.json*:

```json
{
    "name": "<Name of input parameter in function signature>",
    "entityName": "<Optional - name of the entity>",
    "type": "entityTrigger",
    "direction": "in"
}
```

By default, the name of an entity is the name of the function.

---
::: zone-end 

### Trigger behavior

Here are some notes about the entity trigger:

* **Single-threaded**: A single dispatcher thread is used to process operations for a particular entity. If multiple messages are sent to a single entity concurrently, the operations will be processed one-at-a-time.
* **Poison-message handling** - There's no poison message support in entity triggers.
* **Message visibility** - Entity trigger messages are dequeued and kept invisible for a configurable duration. The visibility of these messages is renewed automatically as long as the function app is running and healthy.
* **Return values** - Entity functions don't support return values. There are specific APIs that can be used to save state or pass values back to orchestrations.

Any state changes made to an entity during its execution will be automatically persisted after execution has completed.

For more information and examples on defining and interacting with entity triggers, see the [Durable Entities](durable-functions-entities.md) documentation.

## Entity client

The entity client binding enables you to asynchronously trigger [entity functions](#entity-trigger). These functions are sometimes referred to as [client functions](durable-functions-types-features-overview.md#client-functions).

::: zone pivot="programming-language-csharp"
You can bind to the entity client by using the [DurableClientAttribute](/dotnet/api/microsoft.azure.webjobs.extensions.durabletask.durableclientattribute) .NET attribute in .NET class library functions.

> [!NOTE]
> The `[DurableClientAttribute]` can also be used to bind to the [orchestration client](#orchestration-client).

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-powershell" 
The entity client is defined by the following JSON object in the `bindings` array of *function.json*:

```json
{
    "name": "<Name of input parameter in function signature>",
    "taskHub": "<Optional - name of the task hub>",
    "connectionName": "<Optional - name of the connection string app setting>",
    "type": "durableClient",
    "direction": "in"
}
```

* `taskHub` - Used in scenarios where multiple function apps share the same storage account but need to be isolated from each other. If not specified, the default value from `host.json` is used. This value must match the value used by the target entity functions.
* `connectionName` - The name of an app setting that contains a storage account connection string. The storage account represented by this connection string must be the same one used by the target entity functions. If not specified, the default storage account connection string for the function app is used.

> [!NOTE]
> In most cases, we recommend that you omit the optional properties and rely on the default behavior.
::: zone-end  
::: zone pivot="programming-language-python"  
The way that you define a entity client depends on your chosen programming model.

# [v2](#tab/python-v2)
Using the `durable_client_input` decorator directly in your Python function code. 

# [v1](#tab/python-v1)
The entity client is defined by the following JSON object in the `bindings` array of *function.json*:

```json
{
    "name": "<Name of input parameter in function signature>",
    "taskHub": "<Optional - name of the task hub>",
    "connectionName": "<Optional - name of the connection string app setting>",
    "type": "durableClient",
    "direction": "in"
}
```

* `taskHub` - Used in scenarios where multiple function apps share the same storage account but need to be isolated from each other. If not specified, the default value from `host.json` is used. This value must match the value used by the target entity functions.
* `connectionName` - The name of an app setting that contains a storage account connection string. The storage account represented by this connection string must be the same one used by the target entity functions. If not specified, the default storage account connection string for the function app is used.

> [!NOTE]
> In most cases, we recommend that you omit the optional properties and rely on the default behavior.

---
::: zone-end  
::: zone pivot="programming-language-java" 
> [!NOTE]
> Entity clients aren't yet supported for Java.
::: zone-end  

For more information and examples on interacting with entities as a client, see the [Durable Entities](durable-functions-entities.md#access-entities) documentation.

<a name="host-json"></a>
## host.json settings

[!INCLUDE [durabletask](../../../includes/functions-host-json-durabletask.md)]

## Next steps

> [!div class="nextstepaction"]
> [Built-in HTTP API reference for instance management](durable-functions-http-api.md)
