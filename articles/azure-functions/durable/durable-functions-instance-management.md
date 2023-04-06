---
title: Manage instances in Durable Functions - Azure
description: Learn how to manage instances in the Durable Functions extension for Azure Functions.
author: cgillum
ms.topic: conceptual
ms.date: 12/07/2022
ms.author: azfuncdf
ms.devlang: csharp, java, javascript, python
ms.custom: ignite-2022
#Customer intent: As a developer, I want to understand the options provided for managing my Durable Functions orchestration instances, so I can keep my orchestrations running efficiently and make improvements.
---

# Manage instances in Durable Functions in Azure

Orchestrations in Durable Functions are long-running stateful functions that can be started, queried, suspended, resumed, and terminated using built-in management APIs. Several other instance management APIs are also exposed by the Durable Functions [orchestration client binding](durable-functions-bindings.md#orchestration-client), such as sending external events to instances, purging instance history, etc. This article goes into the details of all supported instance management operations.

## Start instances

The *start-new* (or *schedule-new*) method on the [orchestration client binding](durable-functions-bindings.md#orchestration-client) starts a new orchestration instance. Internally, this method writes a message via the [Durable Functions storage provider](durable-functions-storage-providers.md) and then returns. This message asynchronously triggers the start of an [orchestration function](durable-functions-types-features-overview.md#orchestrator-functions) with the specified name.

The parameters for starting a new orchestration instance are as follows:

* **Name**: The name of the orchestrator function to schedule.
* **Input**: Any JSON-serializable data that should be passed as the input to the orchestrator function.
* **InstanceId**: (Optional) The unique ID of the instance. If you don't specify this parameter, the method uses a random ID.

> [!TIP]
> Use a random identifier for the instance ID whenever possible. Random instance IDs help ensure an equal load distribution when you're scaling orchestrator functions across multiple VMs. The proper time to use non-random instance IDs is when the ID must come from an external source, or when you're implementing the [singleton orchestrator](durable-functions-singletons.md) pattern.

The following code is an example function that starts a new orchestration instance:

# [C#](#tab/csharp)

```csharp
[FunctionName("HelloWorldQueueTrigger")]
public static async Task Run(
    [QueueTrigger("start-queue")] string input,
    [DurableClient] IDurableOrchestrationClient starter,
    ILogger log)
{
    string instanceId = await starter.StartNewAsync("HelloWorld", input);
    log.LogInformation($"Started orchestration with ID = '{instanceId}'.");
}
```

> [!NOTE]
> The previous C# code is for Durable Functions 2.x. For Durable Functions 1.x, you must use `OrchestrationClient` attribute instead of the `DurableClient` attribute, and you must use the `DurableOrchestrationClient` parameter type instead of `IDurableOrchestrationClient`. For more information about the differences between versions, see the [Durable Functions versions](durable-functions-versions.md) article.

# [JavaScript](#tab/javascript)

<a name="javascript-function-json"></a>Unless otherwise specified, the examples on this page use the HTTP trigger with the following function.json.

**`function.json`**

```json
{
  "bindings": [
    {
      "name": "req",
      "type": "httpTrigger",
      "direction": "in",
      "methods": ["post"]
    },
    {
      "name": "$return",
      "type": "http",
      "direction": "out"
    },
    {
      "name": "starter",
      "type": "durableClient",
      "direction": "in"
    }
  ],
  "disabled": false
}
```

> [!NOTE]
> This example targets Durable Functions version 2.x. In version 1.x, use `orchestrationClient` instead of `durableClient`.

**`index.js`**

```javascript
const df = require("durable-functions");

module.exports = async function(context, input) {
    const client = df.getClient(context);

    const instanceId = await client.startNew("HelloWorld", undefined, input);
    context.log(`Started orchestration with ID = ${instanceId}.`);
};
```

# [Python](#tab/python)

<a name="python-function-json"></a>Unless otherwise specified, the examples on this page use the HTTP trigger with the following function.json.

**`function.json`**

```json
{
  "scriptFile": "__init__.py",
  "bindings": [    
    {
      "name": "msg",
      "type": "queueTrigger",
      "direction": "in",
      "queueName": "messages",
      "connection": "AzureStorageQueuesConnectionString"
    },
    {
      "name": "$return",
      "type": "http",
      "direction": "out"
    },
    {
      "name": "starter",
      "type": "durableClient",
      "direction": "in"
    }
  ],
  "disabled": false
}
```

> [!NOTE]
> This example targets Durable Functions version 2.x. In version 1.x, use `orchestrationClient` instead of `durableClient`.

**`__init__.py`**

```python
import logging
import azure.functions as func
import azure.durable_functions as df

async def main(req: func.HttpRequest, starter: str) -> func.HttpResponse:
    client = df.DurableOrchestrationClient(starter)
    
    instance_id = await client.start_new('HelloWorld', None, None)
    logging.log(f"Started orchestration with ID = ${instance_id}.")

```

# [Java](#tab/java)

```java
@FunctionName("HelloWorldQueueTrigger")
public void helloWorldQueueTrigger(
        @QueueTrigger(name = "input", queueName = "start-queue", connection = "Storage") String input,
        @DurableClientInput(name = "durableContext") DurableClientContext durableContext,
        final ExecutionContext context) {
    DurableTaskClient client = durableContext.getClient();        
    String instanceID = client.scheduleNewOrchestrationInstance("HelloWorld");
    context.getLogger().info("Scheduled orchestration with ID = " + instanceID);
}
```

If you want to wait for the orchestrator to start before returning from your function, you can also use the `waitForInstanceStart()` method.

```java
// wait up to 30 seconds for the scheduled orchestration to enter the "Running" state
client.waitForInstanceStart(instanceID, Duration.ofSeconds(30));
```

---

### Azure Functions Core Tools

You can also start an instance directly by using the [`func durable start-new` command](../functions-core-tools-reference.md#func-durable-start-new) in Core Tools, which takes the following parameters:

* **`function-name` (required)**: Name of the function to start.
* **`input` (optional)**: Input to the function, either inline or through a JSON file. For files, add a prefix to the path to the file with `@`, such as `@path/to/file.json`.
* **`id` (optional)**: ID of the orchestration instance. If you don't specify this parameter, the command uses a random GUID.
* **`connection-string-setting` (optional)**: Name of the application setting containing the storage connection string to use. The default is AzureWebJobsStorage.
* **`task-hub-name` (optional)**: Name of the Durable Functions task hub to use. The default is DurableFunctionsHub. You can also set this in [host.json](durable-functions-bindings.md#host-json) by using durableTask:HubName.

> [!NOTE]
> Core Tools commands assume you are running them from the root directory of a function app. If you explicitly provide the `connection-string-setting` and `task-hub-name` parameters, you can run the commands from any directory. Although you can run these commands without a function app host running, you might find that you can't observe some effects unless the host is running. For example, the `start-new` command enqueues a start message into the target task hub, but the orchestration doesn't actually run unless there is a function app host process running that can process the message.

> [!NOTE]
> The Core Tools commands are currently only supported when using the default [Azure Storage provider](durable-functions-storage-providers.md) for persisting runtime state.

The following command starts the function named HelloWorld, and passes the contents of the file `counter-data.json` to it:

```bash
func durable start-new --function-name HelloWorld --input @counter-data.json --task-hub-name TestTaskHub
```

## Query instances

After starting new orchestration instances, you'll most likely need to query their runtime status to learn whether they are running, have completed, or have failed.

The *get-status* method on the [orchestration client binding](durable-functions-bindings.md#orchestration-client) queries the status of an orchestration instance.

It takes an `instanceId` (required), `showHistory` (optional), `showHistoryOutput` (optional), and `showInput` (optional) as parameters.

* **`showHistory`**: If set to `true`, the response contains the execution history.
* **`showHistoryOutput`**: If set to `true`, the execution history contains activity outputs.
* **`showInput`**: If set to `false`, the response won't contain the input of the function. The default value is `true`.

The method returns an object with the following properties:

* **Name**: The name of the orchestrator function.
* **InstanceId**: The instance ID of the orchestration (should be the same as the `instanceId` input).
* **CreatedTime**: The time at which the orchestrator function started running.
* **LastUpdatedTime**: The time at which the orchestration last checkpointed.
* **Input**: The input of the function as a JSON value. This field isn't populated if `showInput` is false.
* **CustomStatus**: Custom orchestration status in JSON format.
* **Output**: The output of the function as a JSON value (if the function has completed). If the orchestrator function failed, this property includes the failure details. If the orchestrator function was suspended or terminated, this property includes the reason for the suspension or termination (if any).
* **RuntimeStatus**: One of the following values:
  * **Pending**: The instance has been scheduled but has not yet started running.
  * **Running**: The instance has started running.
  * **Completed**: The instance has completed normally.
  * **ContinuedAsNew**: The instance has restarted itself with a new history. This state is a transient state.
  * **Failed**: The instance failed with an error.
  * **Terminated**: The instance was stopped abruptly.
  * **Suspended**: The instance was suspended and may be resumed at a later point in time.
* **History**: The execution history of the orchestration. This field is only populated if `showHistory` is set to `true`.

> [!NOTE]
> An orchestrator is not marked as `Completed` until all of its scheduled tasks have finished *and* the orchestrator has returned. In other words, it is not sufficient for an orchestrator to reach its `return` statement for it to be marked as `Completed`. This is particularly relevant for cases where `WhenAny` is used; those orchestrators often `return` before all the scheduled tasks have executed.

This method returns `null` (.NET and Java), `undefined` (JavaScript), or `None` (Python) if the instance doesn't exist.

# [C#](#tab/csharp)

```csharp
[FunctionName("GetStatus")]
public static async Task Run(
    [DurableClient] IDurableOrchestrationClient client,
    [QueueTrigger("check-status-queue")] string instanceId)
{
    DurableOrchestrationStatus status = await client.GetStatusAsync(instanceId);
    // do something based on the current status.
}
```

> [!NOTE]
> The previous C# code is for Durable Functions 2.x. For Durable Functions 1.x, you must use `OrchestrationClient` attribute instead of the `DurableClient` attribute, and you must use the `DurableOrchestrationClient` parameter type instead of `IDurableOrchestrationClient`. For more information about the differences between versions, see the [Durable Functions versions](durable-functions-versions.md) article.

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

module.exports = async function(context, instanceId) {
    const client = df.getClient(context);

    const status = await client.getStatus(instanceId);
    // do something based on the current status.
    // example: if status.runtimeStatus === df.OrchestrationRuntimeStatus.Running: ...
}
```

See [Start instances](#javascript-function-json) for the function.json configuration.

# [Python](#tab/python)

```python
import azure.functions as func
import azure.durable_functions as df

async def main(req: func.HttpRequest, starter: str, instance_id: str) -> func.HttpResponse:
    client = df.DurableOrchestrationClient(starter)

    status = await client.get_status(instance_id)
    # do something based on the current status
    # example: if (existing_instance.runtime_status is df.OrchestrationRuntimeStatus.Running) { ...
```

# [Java](#tab/java)

```java
@FunctionName("GetStatus")
public void getStatus(
        @QueueTrigger(name = "instanceID", queueName = "check-status-queue", connection = "Storage") String instanceID,
        @DurableClientInput(name = "durableContext") DurableClientContext durableContext,
        final ExecutionContext context) {
    DurableTaskClient client = durableContext.getClient();        
    OrchestrationMetadata metadata = client.getInstanceMetadata(instanceID, false);
    if (metadata != null) {
        OrchestrationRuntimeStatus status = metadata.getRuntimeStatus();
        switch (status) {
            // do something based on the current status
        }
    }
}
```

---

### Azure Functions Core Tools

It's also possible to get the status of an orchestration instance directly by using the [`func durable get-runtime-status` command](../functions-core-tools-reference.md#func-durable-get-runtime-status) in Core Tools.

> [!NOTE]
> Core Tools commands are currently only supported when using the default [Azure Storage provider](durable-functions-storage-providers.md) for persisting runtime state.

The `durable get-runtime-status` command takes the following parameters:

* **`id` (required)**: ID of the orchestration instance.
* **`show-input` (optional)**: If set to `true`, the response contains the input of the function. The default value is `false`.
* **`show-output` (optional)**: If set to `true`, the response contains the output of the function. The default value is `false`.
* **`connection-string-setting` (optional)**: Name of the application setting containing the storage connection string to use. The default is `AzureWebJobsStorage`.
* **`task-hub-name` (optional)**: Name of the Durable Functions task hub to use. The default is `DurableFunctionsHub`. It can also be set in [host.json](durable-functions-bindings.md#host-json), by using durableTask:HubName.

The following command retrieves the status (including input and output) of an instance with an orchestration instance ID of 0ab8c55a66644d68a3a8b220b12d209c. It assumes that you are running the `func` command from the root directory of the function app:

```bash
func durable get-runtime-status --id 0ab8c55a66644d68a3a8b220b12d209c --show-input true --show-output true
```

You can use the `durable get-history` command to retrieve the history of an orchestration instance. It takes the following parameters:

* **`id` (required)**: ID of the orchestration instance.
* **`connection-string-setting` (optional)**: Name of the application setting containing the storage connection string to use. The default is `AzureWebJobsStorage`.
* **`task-hub-name` (optional)**: Name of the Durable Functions task hub to use. The default is `DurableFunctionsHub`. It can also be set in host.json, by using durableTask:HubName.

```bash
func durable get-history --id 0ab8c55a66644d68a3a8b220b12d209c
```

## Query all instances

You can use APIs in your language SDK to query the statuses of all orchestration instances in your [task hub](durable-functions-task-hubs.md). This *"list-instances"* or *"get-status"* API returns a list of objects that represent the orchestration instances matching the query parameters.

# [C#](#tab/csharp)

```csharp
[FunctionName("GetAllStatus")]
public static async Task Run(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestMessage req,
    [DurableClient] IDurableOrchestrationClient client,
    ILogger log)
{
    var noFilter = new OrchestrationStatusQueryCondition();
    OrchestrationStatusQueryResult result = await client.ListInstancesAsync(
        noFilter,
        CancellationToken.None);
    foreach (DurableOrchestrationStatus instance in result.DurableOrchestrationState)
    {
        log.LogInformation(JsonConvert.SerializeObject(instance));
    }
    
    // Note: ListInstancesAsync only returns the first page of results.
    // To request additional pages provide the result.ContinuationToken
    // to the OrchestrationStatusQueryCondition's ContinuationToken property.
}
```

> [!NOTE]
> The previous C# code is for Durable Functions 2.x. For Durable Functions 1.x, you must use `OrchestrationClient` attribute instead of the `DurableClient` attribute, and you must use the `DurableOrchestrationClient` parameter type instead of `IDurableOrchestrationClient`. For more information about the differences between versions, see the [Durable Functions versions](durable-functions-versions.md) article.

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

module.exports = async function(context, req) {
    const client = df.getClient(context);

    const instances = await client.getStatusAll();
    instances.forEach((instance) => {
        context.log(JSON.stringify(instance));
    });
};
```

See [Start instances](#javascript-function-json) for the function.json configuration.

# [Python](#tab/python)

```python
import logging
import json
import azure.functions as func
import azure.durable_functions as df


async def main(req: func.HttpRequest, starter: str) -> func.HttpResponse:
    client = df.DurableOrchestrationClient(starter)

    instances = await client.get_status_all()

    for instance in instances:
        logging.log(json.dumps(instance))
```

See [Start instances](#python-function-json) for the function.json configuration.

# [Java](#tab/java)

```java
@FunctionName("GetAllStatus")
public String getAllStatus(
        @HttpTrigger(name = "req", methods = {HttpMethod.GET}) HttpRequestMessage<?> req,
        @DurableClientInput(name = "durableContext") DurableClientContext durableContext) {
    DurableTaskClient client = durableContext.getClient();
    OrchestrationStatusQuery noFilter = new OrchestrationStatusQuery();
    OrchestrationStatusQueryResult result = client.queryInstances(noFilter);
    return "Found " + result.getOrchestrationState().size() + " orchestrations.";
}
```
---

### Azure Functions Core Tools

It's also possible to query instances directly, by using the [`func durable get-instances` command](../functions-core-tools-reference.md#func-durable-get-instances) in Core Tools.

> [!NOTE]
> The Core Tools commands are currently only supported when using the default [Azure Storage provider](durable-functions-storage-providers.md) for persisting runtime state.

The `durable get-instances` command takes the following parameters:

* **`top` (optional)**: This command supports paging. This parameter corresponds to the number of instances retrieved per request. The default is 10.
* **`continuation-token` (optional)**: A token to indicate which page or section of instances to retrieve. Each `get-instances` execution returns a token to the next set of instances.
* **`connection-string-setting` (optional)**: Name of the application setting containing the storage connection string to use. The default is `AzureWebJobsStorage`.
* **`task-hub-name` (optional)**: Name of the Durable Functions task hub to use. The default is `DurableFunctionsHub`. It can also be set in [host.json](durable-functions-bindings.md#host-json), by using durableTask:HubName.

```bash
func durable get-instances
```

## Query instances with filters

What if you don't really need all the information that a standard instance query can provide? For example, what if you're just looking for the orchestration creation time, or the orchestration runtime status? You can narrow your query by applying filters.

# [C#](#tab/csharp)

```csharp
[FunctionName("QueryStatus")]
public static async Task Run(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestMessage req,
    [DurableClient] IDurableOrchestrationClient client,
    ILogger log)
{
    // Get the first 100 running or pending instances that were created between 7 and 1 day(s) ago
    var queryFilter = new OrchestrationStatusQueryCondition
    {
        RuntimeStatus = new[]
        {
            OrchestrationRuntimeStatus.Pending,
            OrchestrationRuntimeStatus.Running,
        },
        CreatedTimeFrom = DateTime.UtcNow.Subtract(TimeSpan.FromDays(7)),
        CreatedTimeTo = DateTime.UtcNow.Subtract(TimeSpan.FromDays(1)),
        PageSize = 100,
    };
    
    OrchestrationStatusQueryResult result = await client.ListInstancesAsync(
        queryFilter,
        CancellationToken.None);
    foreach (DurableOrchestrationStatus instance in result.DurableOrchestrationState)
    {
        log.LogInformation(JsonConvert.SerializeObject(instance));
    }
}
```

> [!NOTE]
> The previous C# code is for Durable Functions 2.x. For Durable Functions 1.x, you must use `OrchestrationClient` attribute instead of the `DurableClient` attribute, and you must use the `DurableOrchestrationClient` parameter type instead of `IDurableOrchestrationClient`. For more information about the differences between versions, see the [Durable Functions versions](durable-functions-versions.md) article.

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

module.exports = async function(context, req) {
    const client = df.getClient(context);

    const runtimeStatus = [
        df.OrchestrationRuntimeStatus.Completed,
        df.OrchestrationRuntimeStatus.Running,
    ];
    const instances = await client.getStatusBy(
        new Date(2021, 3, 10, 10, 1, 0),
        new Date(2021, 3, 10, 10, 23, 59),
        runtimeStatus
    );
    instances.forEach((instance) => {
        context.log(JSON.stringify(instance));
    });
};
```

See [Start instances](#javascript-function-json) for the function.json configuration.

# [Python](#tab/python)

```python
import logging
from datetime import datetime
import json
import azure.functions as func
import azure.durable_functions as df
from azure.durable_functions.models.OrchestrationRuntimeStatus import OrchestrationRuntimeStatus

async def main(req: func.HttpRequest, starter: str) -> func.HttpResponse:
    client = df.DurableOrchestrationClient(starter)

    runtime_status = [OrchestrationRuntimeStatus.Completed, OrchestrationRuntimeStatus.Running]

    instances = await client.get_status_by(
        datetime(2021, 3, 10, 10, 1, 0),
        datetime(2021, 3, 10, 10, 23, 59),
        runtime_status
    )

    for instance in instances:
        logging.log(json.dumps(instance))
```

# [Java](#tab/java)

```java
@FunctionName("GetRunningInstances")
public String getRunningInstances(
        @HttpTrigger(name = "req", methods = {HttpMethod.GET}) HttpRequestMessage<?> req,
        @DurableClientInput(name = "durableContext") DurableClientContext durableContext) {
    DurableTaskClient client = durableContext.getClient();
    OrchestrationStatusQuery filter = new OrchestrationStatusQuery()
        .setRuntimeStatusList(List.of(OrchestrationRuntimeStatus.PENDING, OrchestrationRuntimeStatus.RUNNING))
        .setCreatedTimeFrom(Instant.now().minus(Duration.ofDays(7)))
        .setCreatedTimeTo(Instant.now().minus(Duration.ofDays(1)));
    OrchestrationStatusQueryResult result = client.queryInstances(filter);
    return "Found " + result.getOrchestrationState().size() + " orchestrations.";
}
```

---

### Azure Functions Core Tools

In the Azure Functions Core Tools, you can also use the `durable get-instances` command with filters. In addition to the aforementioned `top`, `continuation-token`, `connection-string-setting`, and `task-hub-name` parameters, you can use three filter parameters (`created-after`, `created-before`, and `runtime-status`).

> [!NOTE]
> The Core Tools commands are currently only supported when using the default [Azure Storage provider](durable-functions-storage-providers.md) for persisting runtime state.

The following are the parameters for the `durable get-instances` command.

* **`created-after` (optional)**: Retrieve the instances created after this date/time (UTC). ISO 8601 formatted datetimes accepted.
* **`created-before` (optional)**: Retrieve the instances created before this date/time (UTC). ISO 8601 formatted datetimes accepted.
* **`runtime-status` (optional)**: Retrieve the instances with a particular status (for example, running or completed). Can provide multiple (space separated) statuses.
* **`top` (optional)**: Number of instances retrieved per request. The default is 10.
* **`continuation-token` (optional)**: A token to indicate which page or section of instances to retrieve. Each `get-instances` execution returns a token to the next set of instances.
* **`connection-string-setting` (optional)**: Name of the application setting containing the storage connection string to use. The default is `AzureWebJobsStorage`.
* **`task-hub-name` (optional)**: Name of the Durable Functions task hub to use. The default is `DurableFunctionsHub`. It can also be set in [host.json](durable-functions-bindings.md#host-json), by using durableTask:HubName.

If you don't provide any filters (`created-after`, `created-before`, or `runtime-status`), the command simply retrieves `top` instances, with no regard to runtime status or creation time.

```bash
func durable get-instances --created-after 2021-03-10T13:57:31Z --created-before  2021-03-10T23:59Z --top 15
```

## Terminate instances

If you have an orchestration instance that is taking too long to run, or you just need to stop it before it completes for any reason, you can terminate it.

The two parameters for the terminate API are an *instance ID* and a *reason* string, which are written to logs and to the instance status.

# [C#](#tab/csharp)

```csharp
[FunctionName("TerminateInstance")]
public static Task Run(
    [DurableClient] IDurableOrchestrationClient client,
    [QueueTrigger("terminate-queue")] string instanceId)
{
    string reason = "Found a bug";
    return client.TerminateAsync(instanceId, reason);
}
```

> [!NOTE]
> The previous C# code is for Durable Functions 2.x. For Durable Functions 1.x, you must use `OrchestrationClient` attribute instead of the `DurableClient` attribute, and you must use the `DurableOrchestrationClient` parameter type instead of `IDurableOrchestrationClient`. For more information about the differences between versions, see the [Durable Functions versions](durable-functions-versions.md) article.

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

module.exports = async function(context, instanceId) {
    const client = df.getClient(context);

    const reason = "Found a bug";
    return client.terminate(instanceId, reason);
};
```

See [Start instances](#javascript-function-json) for the function.json configuration.

# [Python](#tab/python)

```python
import azure.functions as func
import azure.durable_functions as df

async def main(req: func.HttpRequest, starter: str, instance_id: str) -> func.HttpResponse:
    client = df.DurableOrchestrationClient(starter)

    reason = "Found a bug"
    return await client.terminate(instance_id, reason)
```

# [Java](#tab/java)

```java
@FunctionName("TerminateInstance")
public void terminateInstance(
        @HttpTrigger(name = "req", methods = {HttpMethod.POST}) HttpRequestMessage<String> req,
        @DurableClientInput(name = "durableContext") DurableClientContext durableContext) {
    String instanceID = req.getBody();
    String reason = "Found a bug";
    durableContext.getClient().terminate(instanceID, reason);
}
```

---

A terminated instance will eventually transition into the `Terminated` state. However, this transition will not happen immediately. Rather, the terminate operation will be queued in the task hub along with other operations for that instance. You can use the [instance query](#query-instances) APIs to know when a terminated instance has actually reached the `Terminated` state.

> [!NOTE]
> Instance termination doesn't currently propagate. Activity functions and sub-orchestrations run to completion, regardless of whether you've terminated the orchestration instance that called them.

## Suspend and Resume instances (preview)

Suspending an orchestration allows you to stop a running orchestration. Unlike with termination, you have the option to resume a suspended orchestrator at a later point in time.

The two parameters for the suspend API are an instance ID and a reason string, which are written to logs and to the instance status.

# [C#](#tab/csharp)

```csharp
[FunctionName("SuspendResumeInstance")]
public static async Task Run(
    [DurableClient] IDurableOrchestrationClient client,
    [QueueTrigger("suspend-resume-queue")] string instanceId)
{
    string suspendReason = "Need to pause workflow";
    await client.SuspendAsync(instanceId, suspendReason);
    
    // ... wait for some period of time since suspending is an async operation...
    
    string resumeReason = "Continue workflow";
    await client.ResumeAsync(instanceId, resumeReason);
}
```

# [JavaScript](#tab/javascript)
> [!NOTE]
> This feature is currently not supported in JavaScript.
# [Python](#tab/python)
> [!NOTE]
> This feature is currently not supported in Python.
# [Java](#tab/java)
> [!NOTE]
> This feature is currently not supported in Java.

---

A suspended instance will eventually transition to the `Suspended` state. However, this transition will not happen immediately. Rather, the suspend operation will be queued in the task hub along with other operations for that instance. You can use the instance query APIs to know when a running instance has actually reached the Suspended state.

When a suspended orchestrator is resumed, its status will change back to `Running`.

### Azure Functions Core Tools

You can also terminate an orchestration instance directly, by using the [`func durable terminate` command](../functions-core-tools-reference.md#func-durable-terminate) in Core Tools.

> [!NOTE]
> The Core Tools commands are currently only supported when using the default [Azure Storage provider](durable-functions-storage-providers.md) for persisting runtime state.

The `durable terminate` command takes the following parameters:

* **`id` (required)**: ID of the orchestration instance to terminate.
* **`reason` (optional)**: Reason for termination.
* **`connection-string-setting` (optional)**: Name of the application setting containing the storage connection string to use. The default is `AzureWebJobsStorage`.
* **`task-hub-name` (optional)**: Name of the Durable Functions task hub to use. The default is `DurableFunctionsHub`. It can also be set in [host.json](durable-functions-bindings.md#host-json), by using durableTask:HubName.

The following command terminates an orchestration instance with an ID of 0ab8c55a66644d68a3a8b220b12d209c:

```bash
func durable terminate --id 0ab8c55a66644d68a3a8b220b12d209c --reason "Found a bug"
```

## Send events to instances

In some scenarios, orchestrator functions need to wait and listen for external events. Examples scenarios where this is useful include the [monitoring](durable-functions-overview.md#monitoring) and [human interaction](durable-functions-overview.md#human) scenarios.

You can send event notifications to running instances by using the *raise event* API of the [orchestration client](durable-functions-bindings.md#orchestration-client). Orchestrations can listen and respond to these events using the *wait for external event* orchestrator API.

The parameters for *raise event* are as follows:

* *Instance ID*: The unique ID of the instance.
* *Event name*: The name of the event to send.
* *Event data*: A JSON-serializable payload to send to the instance.

# [C#](#tab/csharp)

```csharp
[FunctionName("RaiseEvent")]
public static Task Run(
    [DurableClient] IDurableOrchestrationClient client,
    [QueueTrigger("event-queue")] string instanceId)
{
    int[] eventData = new int[] { 1, 2, 3 };
    return client.RaiseEventAsync(instanceId, "MyEvent", eventData);
}
```

> [!NOTE]
> The previous C# code is for Durable Functions 2.x. For Durable Functions 1.x, you must use `OrchestrationClient` attribute instead of the `DurableClient` attribute, and you must use the `DurableOrchestrationClient` parameter type instead of `IDurableOrchestrationClient`. For more information about the differences between versions, see the [Durable Functions versions](durable-functions-versions.md) article.

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

module.exports = async function(context, instanceId) {
    const client = df.getClient(context);

    const eventData = [ 1, 2, 3 ];
    return client.raiseEvent(instanceId, "MyEvent", eventData);
};
```

See [Start instances](#javascript-function-json) for the function.json configuration.

# [Python](#tab/python)

```python
import azure.functions as func
import azure.durable_functions as df

async def main(req: func.HttpRequest, starter: str, instance_id: str) -> func.HttpResponse:
    client = df.DurableOrchestrationClient(starter)

    event_data = [1, 2 ,3]
    return await client.raise_event(instance_id, 'MyEvent', event_data)
```

# [Java](#tab/java)

```java
@FunctionName("RaiseEvent")
public void raiseEvent(
        @HttpTrigger(name = "req", methods = {HttpMethod.POST}) HttpRequestMessage<String> req,
        @DurableClientInput(name = "durableContext") DurableClientContext durableContext) {
    String instanceID = req.getBody();
    String eventName = "MyEvent";
    int[] eventData = { 1, 2, 3 };
    durableContext.getClient().raiseEvent(instanceID, eventName, eventData);
}
```

---

> [!NOTE]
> If there is no orchestration instance with the specified instance ID, the event message is discarded. If an instance exists but it is not yet waiting for the event, the event will be stored in the instance state until it is ready to be received and processed.

### Azure Functions Core Tools

You can also raise an event to an orchestration instance directly, by using the [`func durable raise-event` command](../functions-core-tools-reference.md#func-durable-raise-event) in Core Tools.

> [!NOTE]
> The Core Tools commands are currently only supported when using the default [Azure Storage provider](durable-functions-storage-providers.md) for persisting runtime state.

The `durable raise-event` command takes the following parameters:

* **`id` (required)**: ID of the orchestration instance.
* **`event-name`**: Name of the event to raise.
* **`event-data` (optional)**: Data to send to the orchestration instance. This can be the path to a JSON file, or you can provide the data directly on the command line.
* **`connection-string-setting` (optional)**: Name of the application setting containing the storage connection string to use. The default is `AzureWebJobsStorage`.
* **`task-hub-name` (optional)**: Name of the Durable Functions task hub to use. The default is `DurableFunctionsHub`. It can also be set in [host.json](durable-functions-bindings.md#host-json), by using durableTask:HubName.

```bash
func durable raise-event --id 0ab8c55a66644d68a3a8b220b12d209c --event-name MyEvent --event-data @eventdata.json
```

```bash
func durable raise-event --id 1234567 --event-name MyOtherEvent --event-data 3
```

## Wait for orchestration completion

In long-running orchestrations, you may want to wait and get the results of an orchestration. In these cases, it's also useful to be able to define a timeout period on the orchestration. If the timeout is exceeded, the state of the orchestration should be returned instead of the results.

The *"wait for completion or create check status response"* API can be used to get the actual output from an orchestration instance synchronously. By default, this method has a default timeout of 10 seconds and a polling interval of 1 second.

Here is an example HTTP-trigger function that demonstrates how to use this API:

# [C#](#tab/csharp)

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/HttpSyncStart.cs)]

# [JavaScript](#tab/javascript)

:::code language="javascript" source="~/azure-functions-durable-js/samples/HttpSyncStart/index.js":::

See [Start instances](#javascript-function-json) for the function.json configuration.

# [Python](#tab/python)

```python
import logging
import azure.functions as func
import azure.durable_functions as df

timeout = "timeout"
retry_interval = "retryInterval"

async def main(req: func.HttpRequest, starter: str) -> func.HttpResponse:
    client = df.DurableOrchestrationClient(starter)

    instance_id = await client.start_new(req.route_params['functionName'], None, req.get_body())
    logging.log(f"Started orchestration with ID = '${instance_id}'.")

    timeout_in_milliseconds = get_time_in_seconds(req, timeout)
    timeout_in_milliseconds = timeout_in_milliseconds if timeout_in_milliseconds != None else 30000
    retry_interval_in_milliseconds = get_time_in_seconds(req, retry_interval)
    retry_interval_in_milliseconds = retry_interval_in_milliseconds if retry_interval_in_milliseconds != None else 1000

    return await client.wait_for_completion_or_create_check_status_response(
        req,
        instance_id,
        timeout_in_milliseconds,
        retry_interval_in_milliseconds
    )

def get_time_in_seconds(req: func.HttpRequest, query_parameter_name: str):
    query_value = req.params.get(query_parameter_name)
    return query_value if query_value != None else 1000
```

# [Java](#tab/java)

Java doesn't currently have a single method for this scenario. However, it can be implemented using a few extra lines of code.

<!-- Tracking issue: https://github.com/microsoft/durabletask-java/issues/64 -->

```java
@FunctionName("HttpStartAndWait")
public HttpResponseMessage httpStartAndWait(
        @HttpTrigger(name = "req", route = "orchestrators/{functionName}/wait", methods = {HttpMethod.POST}) HttpRequestMessage<?> req,
        @DurableClientInput(name = "durableContext") DurableClientContext durableContext,
        @BindingName("functionName") String functionName,
        final ExecutionContext context) {

    DurableTaskClient client = durableContext.getClient();
    String instanceId = client.scheduleNewOrchestrationInstance(functionName);
    context.getLogger().info("Created new Java orchestration with instance ID = " + instanceId);
    try {
        String timeoutString = req.getQueryParameters().get("timeout");
        Integer timeoutInSeconds = Integer.parseInt(timeoutString);
        OrchestrationMetadata orchestration = client.waitForInstanceCompletion(
                instanceId,
                Duration.ofSeconds(timeoutInSeconds),
                true /* getInputsAndOutputs */);
        return req.createResponseBuilder(HttpStatus.OK)
                .body(orchestration.getSerializedOutput())
                .header("Content-Type", "application/json")
                .build();
    } catch (TimeoutException timeoutEx) {
        // timeout expired - return a 202 response
        return durableContext.createCheckStatusResponse(req, instanceId);
    }
}
```

---

Call the function with the following line. Use 2 seconds for the timeout and 0.5 second for the retry interval:

```bash
curl -X POST "http://localhost:7071/orchestrators/E1_HelloSequence/wait?timeout=2&retryInterval=0.5"
```

> [!NOTE]
> The above cURL command assumes you have an orchestrator function named `E1_HelloSequence` in your project. Because of how the HTTP trigger function is written, you can replace it with the name of any orchestrator function in your project.

Depending on the time required to get the response from the orchestration instance, there are two cases:

* The orchestration instances complete within the defined timeout (in this case 2 seconds), and the response is the actual orchestration instance output, delivered synchronously:

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Date: Thu, 14 Dec 2021 06:14:29 GMT
Transfer-Encoding: chunked

[
    "Hello Tokyo!",
    "Hello Seattle!",
    "Hello London!"
]
```

* The orchestration instances can't complete within the defined timeout, and the response is the default one described in [HTTP API URL discovery](durable-functions-http-api.md):

```http
HTTP/1.1 202 Accepted
Content-Type: application/json; charset=utf-8
Date: Thu, 14 Dec 2021 06:13:51 GMT
Location: http://localhost:7071/runtime/webhooks/durabletask/instances/d3b72dddefce4e758d92f4d411567177?taskHub={taskHub}&connection={connection}&code={systemKey}
Retry-After: 10
Transfer-Encoding: chunked

{
    "id": "d3b72dddefce4e758d92f4d411567177",
    "sendEventPostUri": "http://localhost:7071/runtime/webhooks/durabletask/instances/d3b72dddefce4e758d92f4d411567177/raiseEvent/{eventName}?taskHub={taskHub}&connection={connection}&code={systemKey}",
    "statusQueryGetUri": "http://localhost:7071/runtime/webhooks/durabletask/instances/d3b72dddefce4e758d92f4d411567177?taskHub={taskHub}&connection={connection}&code={systemKey}",
    "terminatePostUri": "http://localhost:7071/runtime/webhooks/durabletask/instances/d3b72dddefce4e758d92f4d411567177/terminate?reason={text}&taskHub={taskHub}&connection={connection}&code={systemKey}",
    "suspendPostUri": "http://localhost:7071/runtime/webhooks/durabletask/instances/d3b72dddefce4e758d92f4d411567177/suspend?reason={text}&taskHub={taskHub}&connection={connection}&code={systemKey}",
    "resumePostUri": "http://localhost:7071/runtime/webhooks/durabletask/instances/d3b72dddefce4e758d92f4d411567177/resume?reason={text}&taskHub={taskHub}&connection={connection}&code={systemKey}"
}
```

> [!NOTE]
> The format of the webhook URLs might differ, depending on which version of the Azure Functions host you are running. The preceding example is for the Azure Functions 3.0 host.

## Retrieve HTTP management webhook URLs

You can use an external system to monitor or to raise events to an orchestration. External systems can communicate with Durable Functions through the webhook URLs that are part of the default response described in [HTTP API URL discovery](durable-functions-http-features.md#http-api-url-discovery). The webhook URLs can alternatively be accessed programmatically using the [orchestration client binding](durable-functions-bindings.md#orchestration-client). Specifically, the *create HTTP management payload* API can be used to get a serializable object that contains these webhook URLs.

The *create HTTP management payload* API has one parameter:

* *Instance ID*: The unique ID of the instance.

The methods return an object with the following string properties:

* **Id**: The instance ID of the orchestration (should be the same as the `InstanceId` input).
* **StatusQueryGetUri**: The status URL of the orchestration instance.
* **SendEventPostUri**: The "raise event" URL of the orchestration instance.
* **TerminatePostUri**: The "terminate" URL of the orchestration instance.
* **PurgeHistoryDeleteUri**: The "purge history" URL of the orchestration instance.
* **suspendPostUri**: The "suspend" URL of the orchestration instance.
* **resumePostUri**: The "resume" URL of the orchestration instance.

Functions can send instances of these objects to external systems to monitor or raise events on the corresponding orchestrations, as shown in the following examples:

# [C#](#tab/csharp)

```csharp
[FunctionName("SendInstanceInfo")]
public static void SendInstanceInfo(
    [ActivityTrigger] IDurableActivityContext ctx,
    [DurableClient] IDurableOrchestrationClient client,
    [DocumentDB(
        databaseName: "MonitorDB",
        collectionName: "HttpManagementPayloads",
        ConnectionStringSetting = "CosmosDBConnection")]out dynamic document)
{
    HttpManagementPayload payload = client.CreateHttpManagementPayload(ctx.InstanceId);

    // send the payload to Azure Cosmos DB
    document = new { Payload = payload, id = ctx.InstanceId };
}
```

> [!NOTE]
> The previous C# code is for Durable Functions 2.x. For Durable Functions 1.x, you must use `DurableActivityContext` instead of `IDurableActivityContext`, you must use the `OrchestrationClient` attribute instead of the `DurableClient` attribute, and you must use the `DurableOrchestrationClient` parameter type instead of `IDurableOrchestrationClient`. For more information about the differences between versions, see the [Durable Functions versions](durable-functions-versions.md) article.

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

modules.exports = async function(context, ctx) {
    const client = df.getClient(context);

    const payload = client.createHttpManagementPayload(ctx.instanceId);

    // send the payload to Azure Cosmos DB
    context.bindings.document = JSON.stringify({
        id: ctx.instanceId,
        payload,
    });
};
```

See [Start instances](#javascript-function-json) for the function.json configuration.

# [Python](#tab/python)

```python
import azure.functions as func
import azure.durable_functions as df

async def main(req: func.HttpRequest, starter: str, instance_id: str) -> func.cosmosdb.cdb.Document:
    client = df.DurableOrchestrationClient(starter)

    payload = client.create_check_status_response(req, instance_id).get_body().decode()

    return func.cosmosdb.CosmosDBConverter.encode({
        id: instance_id,
        payload: payload
    })
```

# [Java](#tab/java)

<!-- Tracking issue: https://github.com/microsoft/durabletask-java/issues/63 -->

> [!NOTE]
> This feature is currently not supported in Java.

---

## Rewind instances (preview)

If you have an orchestration failure for an unexpected reason, you can *rewind* the instance to a previously healthy state by using an API built for that purpose.

> [!NOTE]
> This API is not intended to be a replacement for proper error handling and retry policies. Rather, it is intended to be used only in cases where orchestration instances fail for unexpected reasons. Orchestrations in states other than `Failed` (e.g., `Running`, `Pending`, `Terminated`, `Completed`) cannot be "rewound". For more information on error handling and retry policies, see the [Error handling](durable-functions-error-handling.md) article.

Use the `RewindAsync` (.NET) or `rewind` (JavaScript) method of the [orchestration client binding](durable-functions-bindings.md#orchestration-client) to put the orchestration back into the *Running* state. This method will also rerun the activity or sub-orchestration execution failures that caused the orchestration failure.

For example, let's say you have a workflow involving a series of [human approvals](durable-functions-overview.md#human). Suppose there are a series of activity functions that notify someone that their approval is needed, and wait out the real-time response. After all of the approval activities have received responses or timed out, suppose that another activity fails due to an application misconfiguration, such as an invalid database connection string. The result is an orchestration failure deep into the workflow. With the `RewindAsync` (.NET) or `rewind` (JavaScript) API, an application administrator can fix the configuration error, and rewind the failed orchestration back to the state immediately before the failure. None of the human-interaction steps need to be re-approved, and the orchestration can now complete successfully.

> [!NOTE]
> The *rewind* feature doesn't support rewinding orchestration instances that use durable timers.

# [C#](#tab/csharp)

```csharp
[FunctionName("RewindInstance")]
public static Task Run(
    [DurableClient] IDurableOrchestrationClient client,
    [QueueTrigger("rewind-queue")] string instanceId)
{
    string reason = "Orchestrator failed and needs to be revived.";
    return client.RewindAsync(instanceId, reason);
}
```

> [!NOTE]
> The previous C# code is for Durable Functions 2.x. For Durable Functions 1.x, you must use `OrchestrationClient` attribute instead of the `DurableClient` attribute, and you must use the `DurableOrchestrationClient` parameter type instead of `IDurableOrchestrationClient`. For more information about the differences between versions, see the [Durable Functions versions](durable-functions-versions.md) article.

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

module.exports = async function(context, instanceId) {
    const client = df.getClient(context);

    const reason = "Orchestrator failed and needs to be revived.";
    return client.rewind(instanceId, reason);
};
```

See [Start instances](#javascript-function-json) for the function.json configuration.

# [Python](#tab/python)

> [!NOTE]
> This feature is currently not supported in Python.

<!-- ```python
import azure.functions as func
import azure.durable_functions as df

async def main(req: func.HttpRequest, starter: str, instance_id: str) -> func.HttpResponse:
    client = df.DurableOrchestrationClient(starter)

    reason = "Orchestrator failed and needs to be revived."
    return client.rewind(instance_id, reason)
``` -->

# [Java](#tab/java)

> [!NOTE]
> This feature is currently not supported in Java.

<!--
Tracking issue: https://github.com/microsoft/durabletask-java/issues/65

```java
@FunctionName("Rewind")
public void rewind(
        @HttpTrigger(name = "req", methods = {HttpMethod.POST}) HttpRequestMessage<String> req,
        @DurableClientInput(name = "durableContext") DurableClientContext durableContext) {
    String instanceID = req.getBody();
    String reason = "Failed due to external configuration issue";
    durableContext.getClient().rewind(instanceID, reason);
}
```
-->

---

### Azure Functions Core Tools

You can also rewind an orchestration instance directly by using the [`func durable rewind` command](../functions-core-tools-reference.md#func-durable-rewind) in Core Tools.

> [!NOTE]
> The Core Tools commands are currently only supported when using the default [Azure Storage provider](durable-functions-storage-providers.md) for persisting runtime state.

The `durable rewind` command takes the following parameters:

* **`id` (required)**: ID of the orchestration instance.
* **`reason` (optional)**: Reason for rewinding the orchestration instance.
* **`connection-string-setting` (optional)**: Name of the application setting containing the storage connection string to use. The default is `AzureWebJobsStorage`.
* **`task-hub-name` (optional)**: Name of the Durable Functions task hub to use. By default, the task hub name in the [host.json](durable-functions-bindings.md#host-json) file is used.

```bash
func durable rewind --id 0ab8c55a66644d68a3a8b220b12d209c --reason "Orchestrator failed and needs to be revived."
```

## Purge instance history

To remove all the data associated with an orchestration, you can purge the instance history. For example, you might want to delete any storage resources associated with a completed instance. To do so, use the *purge instance* API defined by the [orchestration client](durable-functions-bindings.md#orchestration-client).

This first example shows how to purge a single orchestration instance.

# [C#](#tab/csharp)

```csharp
[FunctionName("PurgeInstanceHistory")]
public static Task Run(
    [DurableClient] IDurableOrchestrationClient client,
    [QueueTrigger("purge-queue")] string instanceId)
{
    return client.PurgeInstanceHistoryAsync(instanceId);
}
```

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

module.exports = async function(context, instanceId) {
    const client = df.getClient(context);
    return client.purgeInstanceHistory(instanceId);
};
```

See [Start instances](#javascript-function-json) for the function.json configuration.

# [Python](#tab/python)

```python
import azure.functions as func
import azure.durable_functions as df

async def main(req: func.HttpRequest, starter: str, instance_id: str) -> func.HttpResponse:
    client = df.DurableOrchestrationClient(starter)

    return await client.purge_instance_history(instance_id)
```

# [Java](#tab/java)

```java
@FunctionName("PurgeInstance")
public HttpResponseMessage purgeInstance(
        @HttpTrigger(name = "req", methods = {HttpMethod.POST}, route = "purge/{instanceID}") HttpRequestMessage<?> req,
        @DurableClientInput(name = "durableContext") DurableClientContext durableContext,
        @BindingName("instanceID") String instanceID) {
    PurgeResult result = durableContext.getClient().purgeInstance(instanceID);
    if (result.getDeletedInstanceCount() == 0) {
        return req.createResponseBuilder(HttpStatus.NOT_FOUND)
                .body("No completed instance with ID '" + instanceID + "' was found!")
                .build();
    } else {
        return req.createResponseBuilder(HttpStatus.OK)
                .body("Successfully purged data for " + instanceID)
                .build();
    }
}
```

---

The next example shows a timer-triggered function that purges the history for all orchestration instances that completed after the specified time interval. In this case, it removes data for all instances completed 30 or more days ago. This example function is scheduled to run once per day, at 12:00 PM UTC:

# [C#](#tab/csharp)

```csharp
[FunctionName("PurgeInstanceHistory")]
public static Task Run(
    [DurableClient] IDurableOrchestrationClient client,
    [TimerTrigger("0 0 12 * * *")] TimerInfo myTimer)
{
    return client.PurgeInstanceHistoryAsync(
        DateTime.MinValue,
        DateTime.UtcNow.AddDays(-30),  
        new List<OrchestrationStatus>
        {
            OrchestrationStatus.Completed
        });
}
```

> [!NOTE]
> The previous C# code is for Durable Functions 2.x. For Durable Functions 1.x, you must use `OrchestrationClient` attribute instead of the `DurableClient` attribute, and you must use the `DurableOrchestrationClient` parameter type instead of `IDurableOrchestrationClient`. For more information about the differences between versions, see the [Durable Functions versions](durable-functions-versions.md) article.

# [JavaScript](#tab/javascript)

The `purgeInstanceHistoryBy` method can be used to conditionally purge instance history for multiple instances.

**function.json**

```json
{
  "bindings": [
    {
      "schedule": "0 0 12 * * *",
      "name": "myTimer",
      "type": "timerTrigger",
      "direction": "in"
    },
    {
      "name": "starter",
      "type": "durableClient",
      "direction": "in"
    }
  ],
  "disabled": false
}
```

> [!NOTE]
> This example targets Durable Functions version 2.x. In version 1.x, use `orchestrationClient` instead of `durableClient`.

**index.js**

```javascript
const df = require("durable-functions");

module.exports = async function (context, myTimer) {
    const client = df.getClient(context);
    const createdTimeFrom = new Date(0);
    const createdTimeTo = new Date().setDate(today.getDate() - 30);
    const runtimeStatuses = [ df.OrchestrationRuntimeStatus.Completed ];
    return client.purgeInstanceHistoryBy(createdTimeFrom, createdTimeTo, runtimeStatuses);
};
```

# [Python](#tab/python)

```python
import azure.functions as func
import azure.durable_functions as df
from azure.durable_functions.models.DurableOrchestrationStatus import OrchestrationRuntimeStatus
from datetime import datetime, timedelta

async def main(req: func.HttpRequest, starter: str, instance_id: str) -> func.HttpResponse:
    client = df.DurableOrchestrationClient(starter)
    created_time_from = datetime.min
    created_time_to = datetime.today() + timedelta(days = -30)
    runtime_statuses = [OrchestrationRuntimeStatus.Completed]

    return await client.purge_instance_history_by(created_time_from, created_time_to, runtime_statuses)
```

# [Java](#tab/java)

```java
@FunctionName("PurgeInstances")
public void purgeInstances(
        @TimerTrigger(name = "purgeTimer", schedule = "0 0 12 * * *") String timerInfo,
        @DurableClientInput(name = "durableContext") DurableClientContext durableContext,
        ExecutionContext context) throws TimeoutException {
    PurgeInstanceCriteria criteria = new PurgeInstanceCriteria()
            .setCreatedTimeFrom(Instant.now().minus(Duration.ofDays(60)))
            .setCreatedTimeTo(Instant.now().minus(Duration.ofDays(30)))
            .setRuntimeStatusList(List.of(OrchestrationRuntimeStatus.COMPLETED));
    PurgeResult result = durableContext.getClient().purgeInstances(criteria);
    context.getLogger().info(String.format("Purged %d instance(s)", result.getDeletedInstanceCount()));
}
```

---

> [!NOTE]
> For the purge history operation to succeed, the runtime status of the target instance must be **Completed**, **Terminated**, or **Failed**.

### Azure Functions Core Tools

You can purge an orchestration instance's history by using the [`func durable purge-history` command](../functions-core-tools-reference.md#func-durable-purge-history) in Core Tools. Similar to the second C# example in the preceding section, it purges the history for all orchestration instances created during a specified time interval. You can further filter purged instances by runtime status.

> [!NOTE]
> The Core Tools commands are currently only supported when using the default [Azure Storage provider](durable-functions-storage-providers.md) for persisting runtime state.

The `durable purge-history` command has several parameters:

* **`created-after` (optional)**: Purge the history of instances created after this date/time (UTC). ISO 8601 formatted datetimes accepted.
* **`created-before` (optional)**: Purge the history of instances created before this date/time (UTC). ISO 8601 formatted datetimes accepted.
* **`runtime-status` (optional)**: Purge the history of instances with a particular status (for example, running or completed). Can provide multiple (space separated) statuses.
* **`connection-string-setting` (optional)**: Name of the application setting containing the storage connection string to use. The default is `AzureWebJobsStorage`.
* **`task-hub-name` (optional)**: Name of the Durable Functions task hub to use. By default, the task hub name in the [host.json](durable-functions-bindings.md#host-json) file is used.

The following command deletes the history of all failed instances created before November 14, 2021 at 7:35 PM (UTC).

```bash
func durable purge-history --created-before 2021-11-14T19:35:00.0000000Z --runtime-status failed
```

## Delete a task hub

Using the [`func durable delete-task-hub` command](../functions-core-tools-reference.md#func-durable-delete-task-hub) in Core Tools, you can delete all storage artifacts associated with a particular task hub, including Azure storage tables, queues, and blobs. 

> [!NOTE]
> The Core Tools commands are currently only supported when using the default [Azure Storage provider](durable-functions-storage-providers.md) for persisting runtime state.

The `durable delete-task-hub` command has two parameters:

* **`connection-string-setting` (optional)**: Name of the application setting containing the storage connection string to use. The default is `AzureWebJobsStorage`.
* **`task-hub-name` (optional)**: Name of the Durable Functions task hub to use. By default, the task hub name in the [host.json](durable-functions-bindings.md#host-json) file is used.

The following command deletes all Azure storage data associated with the `UserTest` task hub.

```bash
func durable delete-task-hub --task-hub-name UserTest
```

## Next steps

> [!div class="nextstepaction"]
> [Learn how to handle versioning](durable-functions-versioning.md)

> [!div class="nextstepaction"]
> [Built-in HTTP API reference for instance management](durable-functions-http-api.md)
