---
title: Manage orchestration instances - Azure Durable Functions and Durable Task SDKs
description: Learn how to manage orchestration instances in Durable Functions and the Durable Task SDKs, including starting, querying, terminating, and sending events.
author: cgillum
ms.topic: how-to
ms.date: 01/30/2026
ms.author: azfuncdf
reviewer: hhunter-ms
ms.service: durable-task
ms.devlang: csharp
zone_pivot_groups: azure-durable-approach
#Customer intent: As a developer, I want to understand the options provided for managing my orchestration instances, so I can keep my orchestrations running efficiently and make improvements.
---

# Manage orchestration instances

Orchestrations are long-running stateful workflows that you can start, query, suspend, resume, and end using built-in management APIs. In [Durable Functions](what-is-durable-task.md), the [orchestration client binding](../../azure-functions/durable-functions/durable-functions-bindings.md#orchestration-client) exposes these APIs. In the [Durable Task SDKs](../sdks/quickstart-portable-durable-task-sdks.md), these operations are available through the `DurableTaskClient` class. This article covers all supported instance management operations for both platforms.

> [!TIP]
> The [Azure Durable Task Scheduler](what-is-durable-task.md) is the recommended backend for both Durable Functions and the Durable Task SDKs, providing a fully managed, serverless experience for running durable workflows at scale.

## Start instances

The *start-new* (or *schedule-new*) method on the orchestration client starts a new orchestration instance. Internally, this method writes a message to the configured backend (such as the Durable Task Scheduler or Azure Storage) and then returns. This message asynchronously triggers the start of an orchestration with the specified name.

Here are the parameters for starting a new orchestration instance:

::: zone pivot="durable-functions"

* **Name**: The name of the orchestrator function to schedule.
* **Input**: Any JSON-serializable data that should be passed as the input to the orchestrator function.
* **InstanceId**: (Optional) The unique ID of the instance. If you don't specify this parameter, the method uses a random ID.

> [!TIP]
> Use a random identifier for the instance ID whenever possible. Random instance IDs help ensure an equal load distribution when you scale orchestrator functions across multiple VMs. The proper time to use nonrandom instance IDs is when the ID comes from an external source or when you're implementing the [singleton orchestrator](durable-task-singletons.md) pattern.

::: zone-end

::: zone pivot="durable-task-sdks"

* **Name**: The name of the orchestration to schedule.
* **Input**: Any JSON-serializable data that should be passed as input to the orchestration.
* **InstanceId**: (Optional) The unique ID of the instance. If you don't specify this parameter, the method uses a random ID.

> [!TIP]
> Use a random identifier for the instance ID whenever possible. Random instance IDs help ensure an equal load distribution when you scale orchestrations across multiple VMs. The proper time to use nonrandom instance IDs is when the ID comes from an external source or when you're implementing the [singleton orchestrator](durable-task-singletons.md) pattern.

::: zone-end

::: zone pivot="durable-functions"

The following example function starts a new orchestration instance:

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
> The previous C# code uses the in-process model with `IDurableOrchestrationClient`, which is marked as obsolete in newer versions of the Durable Functions extension. For new .NET projects, consider using the [.NET isolated worker model](../../azure-functions/durable-functions/durable-functions-dotnet-isolated-overview.md) with `DurableTaskClient`. For more information, see the [Durable Functions versions](../../azure-functions/durable-functions/durable-functions-versions.md) article.

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

# [PowerShell](#tab/powershell)

<a name="powershell-function-json"></a>Unless otherwise specified, the examples on this page use the HTTP trigger with the following function.json.

**`function.json`**

```json
{
  "bindings": [    
    {
      "name": "Request",
      "type": "httpTrigger",
      "direction": "in",
      "methods": ["post"]
    },
    {
      "name": "Response",
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

**`run.ps1`**

```powershell
param($Request, $TriggerMetadata)

$InstanceId = Start-DurableOrchestration -FunctionName 'HelloWorld'
Write-Host "Started orchestration with ID = '$InstanceId'"
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

To wait for the orchestrator to start before returning from your function, use the `waitForInstanceStart()` method.

```java
// wait up to 30 seconds for the scheduled orchestration to enter the "Running" state
client.waitForInstanceStart(instanceID, Duration.ofSeconds(30));
```

---

::: zone-end

::: zone pivot="durable-task-sdks"

[!INCLUDE [preview-sample-limitations](../scheduler/includes/preview-sample-limitations.md)]

The following code shows how to start a new orchestration instance by using the Durable Task SDKs:

# [C#](#tab/csharp)

```csharp
using Microsoft.DurableTask.Client;

// Schedule a new orchestration instance
string instanceId = await client.ScheduleNewOrchestrationInstanceAsync("HelloWorld", input);
Console.WriteLine($"Started orchestration with ID = '{instanceId}'.");

// Optionally, wait for the orchestration to start
OrchestrationMetadata metadata = await client.WaitForInstanceStartAsync(instanceId, timeout: TimeSpan.FromSeconds(30));
```

# [Python](#tab/python)

```python
from durabletask.azuremanaged.client import DurableTaskSchedulerClient

# Schedule a new orchestration instance
instance_id = client.schedule_new_orchestration(hello_world, input=input_data)
print(f"Started orchestration with ID = '{instance_id}'.")

# Optionally, wait for the orchestration to start
state = client.wait_for_orchestration_start(instance_id, timeout=30)
```

# [Java](#tab/java)

```java
import com.microsoft.durabletask.DurableTaskClient;

// Schedule a new orchestration instance
String instanceId = client.scheduleNewOrchestrationInstance("HelloWorld", input);
System.out.println("Started orchestration with ID = '" + instanceId + "'.");

// Optionally, wait for the orchestration to start
OrchestrationMetadata metadata = client.waitForInstanceStart(instanceId, Duration.ofSeconds(30), false);
```

# [JavaScript](#tab/javascript)

```typescript
import { createAzureManagedClient } from "@microsoft/durabletask-js-azuremanaged";

const client = createAzureManagedClient(connectionString);

// Schedule a new orchestration instance
const instanceId = await client.scheduleNewOrchestration("HelloWorld", input);
console.log(`Started orchestration with ID = '${instanceId}'.`);

// Optionally, wait for the orchestration to start
const state = await client.waitForOrchestrationStart(instanceId, false, 30);
```

# [PowerShell](#tab/powershell)

The Durable Task SDK is not available for PowerShell. Use [Durable Functions](what-is-durable-task.md) instead.

---

::: zone-end

## Query instances

After you start new orchestration instances, you most likely need to query their runtime status to learn whether they're running, complete, or failed.

The *get-status* method on the orchestration client returns the status of an orchestration instance.

It takes an `instanceId` (required), `showHistory` (optional), `showHistoryOutput` (optional), and `showInput` (optional) as parameters.

::: zone pivot="durable-functions"

* **`showHistory`**: If set to `true`, the response contains the execution history.
* **`showHistoryOutput`**: If set to `true`, the execution history contains activity outputs.
* **`showInput`**: If set to `false`, the response doesn't contain the input of the function. The default value is `true`.

The method returns an object with the following properties:

* **Name**: The name of the orchestrator function.
* **InstanceId**: The instance ID of the orchestration (should be the same as the `instanceId` input).
* **CreatedTime**: The time at which the orchestrator function starts running.
* **LastUpdatedTime**: The time at which the orchestration last checkpoints.
* **Input**: The input of the function as a JSON value. This field isn't populated if `showInput` is `false`.
* **CustomStatus**: Custom orchestration status in JSON format.
* **Output**: The output of the function as a JSON value (if the function completes). If the orchestrator function fails, this property includes the failure details. If the orchestrator function is suspended or terminated, this property includes the reason for the suspension or termination (if any).
* **RuntimeStatus**: One of the following values:
  * **Pending**: The instance is scheduled but hasn't yet started running.
  * **Running**: The instance is running.
  * **Completed**: The instance completed normally.
  * **ContinuedAsNew**: The instance restarted itself with a new history. This state is a transient state.
  * **Failed**: The instance failed with an error.
  * **Terminated**: The instance stopped abruptly.
  * **Suspended**: The instance is suspended and can be resumed at a later point in time.
* **History**: The execution history of the orchestration. This field is only populated if `showHistory` is set to `true`.

::: zone-end

::: zone pivot="durable-task-sdks"

* **`showHistory`**: If set to `true`, the response contains the execution history.
* **`showHistoryOutput`**: If set to `true`, the execution history contains activity outputs.
* **`showInput`**: If set to `false`, the response doesn't contain the input of the orchestration. The default value is `true`.

The method returns an object with the following properties:

* **Name**: The name of the orchestration.
* **InstanceId**: The instance ID of the orchestration (should be the same as the `instanceId` input).
* **CreatedTime**: The time at which the orchestration starts running.
* **LastUpdatedTime**: The time at which the orchestration last checkpoints.
* **Input**: The input of the orchestration as a JSON value. This field isn't populated if `showInput` is `false`.
* **CustomStatus**: Custom orchestration status in JSON format.
* **Output**: The output of the orchestration as a JSON value (if the orchestration completes). If the orchestration fails, this property includes the failure details. If the orchestration is suspended or terminated, this property includes the reason for the suspension or termination (if any).
* **RuntimeStatus**: One of the following values:
  * **Pending**: The instance is scheduled but hasn't yet started running.
  * **Running**: The instance is running.
  * **Completed**: The instance completed normally.
  * **ContinuedAsNew**: The instance restarted itself with a new history. This state is a transient state.
  * **Failed**: The instance failed with an error.
  * **Terminated**: The instance stopped abruptly.
  * **Suspended**: The instance is suspended and can be resumed at a later point in time.
* **History**: The execution history of the orchestration. This field is only populated if `showHistory` is set to `true`.

::: zone-end

> [!NOTE]
> An orchestrator isn't marked as `Completed` until all of its scheduled tasks finish *and* the orchestrator returns. In other words, it isn't sufficient for an orchestrator to reach its `return` statement for it to be marked as `Completed`. This is particularly relevant for cases where `WhenAny` is used; those orchestrators often `return` before all the scheduled tasks execute.

This method returns `null` (.NET and Java), `undefined` (JavaScript), or `None` (Python) if the instance doesn't exist.

::: zone pivot="durable-functions"

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
> The previous C# code uses the in-process model with `IDurableOrchestrationClient`, which is marked as obsolete in newer versions of the Durable Functions extension. For new .NET projects, consider using the [.NET isolated worker model](../../azure-functions/durable-functions/durable-functions-dotnet-isolated-overview.md) with `DurableTaskClient`. For more information, see the [Durable Functions versions](../../azure-functions/durable-functions/durable-functions-versions.md) article.

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

For the *function.json* configuration, see [Start instances](#javascript-function-json).

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

# [PowerShell](#tab/powershell)

```powershell
param($Request, $TriggerMetadata)

# Get instanceid from body
$InstanceId = $Request.Body.InstanceId

$Status = Get-DurableStatus -InstanceId $InstanceId -ShowHistory -ShowHistoryOutput -ShowInput
Write-Host "Status: $($Status | ConvertTo-Json)"

# Do something based on status
# example: if ($Status.runtimeStatus -eq 'Running') { ... }
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

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

```csharp
using Microsoft.DurableTask.Client;

// Get the status of an orchestration instance
OrchestrationMetadata? metadata = await client.GetInstanceAsync(instanceId, getInputsAndOutputs: true);
if (metadata != null)
{
    OrchestrationRuntimeStatus status = metadata.RuntimeStatus;
    // do something based on the current status
}
```

# [Python](#tab/python)

```python
from durabletask.azuremanaged.client import DurableTaskSchedulerClient

# Get the status of an orchestration instance
state = client.get_orchestration_state(instance_id, fetch_payloads=True)
if state is not None:
    status = state.runtime_status
    # do something based on the current status
```

# [Java](#tab/java)

```java
import com.microsoft.durabletask.DurableTaskClient;
import com.microsoft.durabletask.OrchestrationMetadata;

// Get the status of an orchestration instance
OrchestrationMetadata metadata = client.getInstanceMetadata(instanceId, true);
if (metadata != null) {
    OrchestrationRuntimeStatus status = metadata.getRuntimeStatus();
    // do something based on the current status
}
```

# [JavaScript](#tab/javascript)

```typescript
import { createAzureManagedClient } from "@microsoft/durabletask-js-azuremanaged";

const client = createAzureManagedClient(connectionString);

// Get the status of an orchestration instance
const state = await client.getOrchestrationState(instanceId, true);
if (state) {
    const status = state.runtimeStatus;
    // do something based on the current status
}
```

# [PowerShell](#tab/powershell)

The Durable Task SDK is not available for PowerShell. Use [Durable Functions](what-is-durable-task.md) instead.

---

::: zone-end

## Query all instances

You can use APIs in your language SDK to query the statuses of all orchestration instances in your [task hub](durable-task-hubs.md). This *"list-instances"* or *"get-status"* API returns a list of objects that represent the orchestration instances matching the query parameters.

::: zone pivot="durable-functions"

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
> The previous C# code uses the in-process model with `IDurableOrchestrationClient`, which is marked as obsolete in newer versions of the Durable Functions extension. For new .NET projects, consider using the [.NET isolated worker model](../../azure-functions/durable-functions/durable-functions-dotnet-isolated-overview.md) with `DurableTaskClient`. For more information, see the [Durable Functions versions](../../azure-functions/durable-functions/durable-functions-versions.md) article.

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

For the function.json configuration, see [Start instances](#javascript-function-json).

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

For the function.json configuration, see [Start instances](#python-function-json).

# [PowerShell](#tab/powershell)
> [!NOTE]
> PowerShell doesn't currently support this feature, but you can achieve it by using the [Durable Functions HTTP API](../../azure-functions/durable-functions/durable-functions-http-api.md).

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

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

```csharp
using Microsoft.DurableTask.Client;

// Query all orchestration instances
AsyncPageable<OrchestrationMetadata> instances = client.GetAllInstancesAsync(new OrchestrationQuery());

await foreach (OrchestrationMetadata instance in instances)
{
    Console.WriteLine(instance.InstanceId);
}
```

# [Python](#tab/python)

```python
from durabletask.azuremanaged.client import DurableTaskSchedulerClient

# Query all orchestration instances
instances = client.list_orchestrations()

for instance in instances:
    print(instance.instance_id)
```

# [Java](#tab/java)

```java
import com.microsoft.durabletask.DurableTaskClient;
import com.microsoft.durabletask.OrchestrationStatusQuery;
import com.microsoft.durabletask.OrchestrationStatusQueryResult;

// Query all orchestration instances
OrchestrationStatusQuery query = new OrchestrationStatusQuery();
OrchestrationStatusQueryResult result = client.queryInstances(query);

for (OrchestrationMetadata instance : result.getOrchestrationState()) {
    System.out.println(instance.getInstanceId());
}
```

# [JavaScript](#tab/javascript)

```typescript
import { createAzureManagedClient } from "@microsoft/durabletask-js-azuremanaged";

const client = createAzureManagedClient(connectionString);

// Query all orchestration instances
const instances = client.getAllInstances();

for await (const instance of instances) {
    console.log(instance.instanceId);
}
```

# [PowerShell](#tab/powershell)

The Durable Task SDK is not available for PowerShell. Use [Durable Functions](what-is-durable-task.md) instead.

---

::: zone-end

## Query instances with filters

What if you don't need all the information that a standard instance query provides? For example, what if you're just looking for the orchestration creation time or the orchestration runtime status? Narrow your query by applying filters.

::: zone pivot="durable-functions"

# [C#](#tab/csharp)

```csharp
[FunctionName("QueryStatus")]
public static async Task Run(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestMessage req,
    [DurableClient] IDurableOrchestrationClient client,
    ILogger log)
{
    // Get the first 100 running or pending instances that were created between 7 and 1 days ago
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
> The previous C# code uses the in-process model with `IDurableOrchestrationClient`, which is marked as obsolete in newer versions of the Durable Functions extension. For new .NET projects, consider using the [.NET isolated worker model](../../azure-functions/durable-functions/durable-functions-dotnet-isolated-overview.md) with `DurableTaskClient`. For more information, see the [Durable Functions versions](../../azure-functions/durable-functions/durable-functions-versions.md) article.

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

# [PowerShell](#tab/powershell)
> [!NOTE]
> This feature isn't currently supported in PowerShell, but you can achieve it by using the [Durable Functions HTTP API](../../azure-functions/durable-functions/durable-functions-http-api.md).

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

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

```csharp
using Microsoft.DurableTask.Client;

// Get running or pending instances created in the last 7 days
var query = new OrchestrationQuery
{
    Statuses = new[] { OrchestrationRuntimeStatus.Running, OrchestrationRuntimeStatus.Pending },
    CreatedFrom = DateTime.UtcNow.AddDays(-7),
    CreatedTo = DateTime.UtcNow.AddDays(-1),
    PageSize = 100
};

AsyncPageable<OrchestrationMetadata> instances = client.GetAllInstancesAsync(query);

await foreach (OrchestrationMetadata instance in instances)
{
    Console.WriteLine($"{instance.InstanceId}: {instance.RuntimeStatus}");
}
```

# [Python](#tab/python)

```python
from durabletask.azuremanaged.client import DurableTaskSchedulerClient
from datetime import datetime, timedelta

# Get running or pending instances created in the last 7 days
instances = client.list_orchestrations(
    created_time_from=datetime.utcnow() - timedelta(days=7),
    created_time_to=datetime.utcnow() - timedelta(days=1),
    runtime_status=['RUNNING', 'PENDING']
)

for instance in instances:
    print(f"{instance.instance_id}: {instance.runtime_status}")
```

# [Java](#tab/java)

```java
import com.microsoft.durabletask.DurableTaskClient;
import com.microsoft.durabletask.OrchestrationStatusQuery;
import com.microsoft.durabletask.OrchestrationRuntimeStatus;
import java.time.Duration;
import java.time.Instant;
import java.util.List;

// Get running or pending instances created in the last 7 days
OrchestrationStatusQuery filter = new OrchestrationStatusQuery()
    .setRuntimeStatusList(List.of(OrchestrationRuntimeStatus.PENDING, OrchestrationRuntimeStatus.RUNNING))
    .setCreatedTimeFrom(Instant.now().minus(Duration.ofDays(7)))
    .setCreatedTimeTo(Instant.now().minus(Duration.ofDays(1)));

OrchestrationStatusQueryResult result = client.queryInstances(filter);

for (OrchestrationMetadata instance : result.getOrchestrationState()) {
    System.out.println(instance.getInstanceId() + ": " + instance.getRuntimeStatus());
}
```

# [JavaScript](#tab/javascript)

```typescript
import { createAzureManagedClient } from "@microsoft/durabletask-js-azuremanaged";
import { OrchestrationStatus } from "@microsoft/durabletask-js";

const client = createAzureManagedClient(connectionString);

// Get running or pending instances created in the last 7 days
const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

const instances = client.getAllInstances({
    statuses: [OrchestrationStatus.RUNNING, OrchestrationStatus.PENDING],
    createdFrom: sevenDaysAgo,
    createdTo: oneDayAgo,
});

for await (const instance of instances) {
    console.log(`${instance.instanceId}: ${instance.runtimeStatus}`);
}
```

# [PowerShell](#tab/powershell)

The Durable Task SDK is not available for PowerShell. Use [Durable Functions](what-is-durable-task.md) instead.

---

::: zone-end

## Terminate instances

If you have an orchestration instance that's taking too long to run, or you need to stop it before it completes for any reason, you can end it.

The two parameters for the terminate API are an *instance ID* and a *reason* string, which write to logs and to the instance status.

::: zone pivot="durable-functions"

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
> The previous C# code uses the in-process model with `IDurableOrchestrationClient`, which is marked as obsolete in newer versions of the Durable Functions extension. For new .NET projects, consider using the [.NET isolated worker model](../../azure-functions/durable-functions/durable-functions-dotnet-isolated-overview.md) with `DurableTaskClient`. For more information, see the [Durable Functions versions](../../azure-functions/durable-functions/durable-functions-versions.md) article.

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

# [PowerShell](#tab/powershell)

```powershell
param($Request, $TriggerMetadata)

# Get instance id from body
$InstanceId = $Request.Body.InstanceId
$Reason = 'Found a bug'

Stop-DurableOrchestration -InstanceId $InstanceId -Reason $Reason
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

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

```csharp
using Microsoft.DurableTask.Client;

string reason = "Found a bug";
await client.TerminateInstanceAsync(instanceId, reason);
```

# [Python](#tab/python)

```python
from durabletask.azuremanaged.client import DurableTaskSchedulerClient

reason = "Found a bug"
client.terminate_orchestration(instance_id, reason=reason)
```

# [Java](#tab/java)

```java
import com.microsoft.durabletask.DurableTaskClient;

String reason = "Found a bug";
client.terminate(instanceId, reason);
```

# [JavaScript](#tab/javascript)

```typescript
import { createAzureManagedClient } from "@microsoft/durabletask-js-azuremanaged";

const client = createAzureManagedClient(connectionString);

const reason = "Found a bug";
await client.terminateOrchestration(instanceId, reason);
```

# [PowerShell](#tab/powershell)

The Durable Task SDK is not available for PowerShell. Use [Durable Functions](what-is-durable-task.md) instead.

---

::: zone-end

A terminated instance eventually transitions into the `Terminated` state. But this transition doesn't happen immediately. Rather, the terminate operation is queued in the task hub along with other operations for that instance. You can use the [instance query](#query-instances) APIs to know when a terminated instance has actually reached the `Terminated` state.

> [!NOTE]
> Instance termination doesn't currently propagate. Activity functions and sub-orchestrations run to completion, regardless of whether you end the orchestration instance that called them.

## Suspend and resume instances

Suspending an orchestration lets you stop a running orchestration. Unlike ending an orchestration, you can resume a suspended orchestrator later.

The two parameters for the suspend API are an instance ID and a reason string, which are written to logs and to the instance status.

::: zone pivot="durable-functions"

# [C#](#tab/csharp)

```csharp
[FunctionName("SuspendResumeInstance")]
public static async Task Run(
    [DurableClient] IDurableOrchestrationClient client,
    [QueueTrigger("suspend-resume-queue")] string instanceId)
{
    // To suspend an orchestration
    string suspendReason = "Need to pause workflow";
    await client.SuspendAsync(instanceId, suspendReason);
    
    // To resume an orchestration
    string resumeReason = "Continue workflow";
    await client.ResumeAsync(instanceId, resumeReason);
}
```

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

module.exports = async function(context, instanceId) {
    const client = df.getClient(context);

    // To suspend an orchestration
    const suspendReason = "Need to pause workflow";
    await client.suspend(instanceId, suspendReason);

    // To resume an orchestration
    const resumeReason = "Continue workflow";
    await client.resume(instanceId, resumeReason);
};
```

# [Python](#tab/python)

```python
import azure.functions as func
import azure.durable_functions as df
from datetime import timedelta

async def main(req: func.HttpRequest, starter: str, instance_id: str):
    client = df.DurableOrchestrationClient(starter)

    # To suspend an orchestration
    suspend_reason = "Need to pause workflow"
    await client.suspend(instance_id, suspend_reason)

    # To resume an orchestration
    resume_reason = "Continue workflow"
    await client.resume(instance_id, resume_reason)
```

# [PowerShell](#tab/powershell)

```powershell
param($Request, $TriggerMetadata)

$InstanceId = $Request.Body.InstanceId

# To suspend an orchestration
$SuspendReason = 'Need to pause workflow'
Suspend-DurableOrchestration -InstanceId $InstanceId -Reason $SuspendReason

# To resume an orchestration
$ResumeReason = 'Continue workflow'
Resume-DurableOrchestration -InstanceId $InstanceId -Reason $ResumeReason
```

> [!NOTE]
> This feature is available in the standalone [Durable Functions PowerShell SDK](https://www.powershellgallery.com/packages/AzureFunctions.PowerShell.Durable.SDK) only. See the difference between the standalone SDK and the legacy built-in SDK along with [migration guide](../../azure-functions/durable-functions/durable-functions-powershell-v2-sdk-migration-guide.md).

# [Java](#tab/java)

```java
@FunctionName("SuspendResumeInstance")
public void suspendResumeInstance(
        @HttpTrigger(name = "req", methods = {HttpMethod.POST}) HttpRequestMessage<String> req,
        @DurableClientInput(name = "durableContext") DurableClientContext durableContext) {
    String instanceID = req.getBody();
    DurableTaskClient client = durableContext.getClient();  

    // To suspend an orchestration
    String suspendReason = "Need to pause workflow";
    client.suspendInstance(instanceID, suspendReason);

    // To resume an orchestration
    String resumeReason = "Continue workflow";
    client.resumeInstance(instanceID, resumeReason);
}
```

---

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

```csharp
using Microsoft.DurableTask.Client;

// To suspend an orchestration
string suspendReason = "Need to pause workflow";
await client.SuspendInstanceAsync(instanceId, suspendReason);

// To resume an orchestration
string resumeReason = "Continue workflow";
await client.ResumeInstanceAsync(instanceId, resumeReason);
```

# [Python](#tab/python)

```python
from durabletask.azuremanaged.client import DurableTaskSchedulerClient

# To suspend an orchestration
suspend_reason = "Need to pause workflow"
client.suspend_orchestration(instance_id, reason=suspend_reason)

# To resume an orchestration
resume_reason = "Continue workflow"
client.resume_orchestration(instance_id, reason=resume_reason)
```

# [Java](#tab/java)

```java
import com.microsoft.durabletask.DurableTaskClient;

// To suspend an orchestration
String suspendReason = "Need to pause workflow";
client.suspendInstance(instanceId, suspendReason);

// To resume an orchestration
String resumeReason = "Continue workflow";
client.resumeInstance(instanceId, resumeReason);
```

# [JavaScript](#tab/javascript)

```typescript
import { createAzureManagedClient } from "@microsoft/durabletask-js-azuremanaged";

const client = createAzureManagedClient(connectionString);

// To suspend an orchestration
await client.suspendOrchestration(instanceId);

// To resume an orchestration
await client.resumeOrchestration(instanceId);
```

# [PowerShell](#tab/powershell)

The Durable Task SDK is not available for PowerShell. Use [Durable Functions](what-is-durable-task.md) instead.

---

::: zone-end

A suspended instance eventually transitions to the `Suspended` state. However, this transition doesn't happen immediately. Rather, the suspend operation is queued in the task hub along with other operations for that instance. Use the instance query APIs to know when a running instance has actually reached the `Suspended` state.

When a suspended orchestrator is resumed, its status changes back to `Running`.

## Send events to instances

::: zone pivot="durable-functions"

In some scenarios, orchestrator functions need to wait and listen for external events. Examples where this approach is useful include the [monitoring](durable-task-monitor.md) and [human interaction](durable-task-human-interaction.md) scenarios.

::: zone-end

::: zone pivot="durable-task-sdks"

In some scenarios, orchestrations need to wait and listen for external events. Examples where this approach is useful include the [monitoring](durable-task-monitor.md) and [human interaction](durable-task-human-interaction.md) scenarios.

::: zone-end

You can send event notifications to running instances by using the *raise event* API of the orchestration client. Orchestrations can listen and respond to these events using the *wait for external event* orchestrator API.

The parameters for *raise event* are:

* *Instance ID*: The unique ID of the instance.
* *Event name*: The name of the event to send.
* *Event data*: A JSON-serializable payload to send to the instance.

::: zone pivot="durable-functions"

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
> The previous C# code uses the in-process model with `IDurableOrchestrationClient`, which is marked as obsolete in newer versions of the Durable Functions extension. For new .NET projects, consider using the [.NET isolated worker model](../../azure-functions/durable-functions/durable-functions-dotnet-isolated-overview.md) with `DurableTaskClient`. For more information, see the [Durable Functions versions](../../azure-functions/durable-functions/durable-functions-versions.md) article.

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

# [PowerShell](#tab/powershell)

```powershell
param($Request, $TriggerMetadata)

# Get instance id from body
$InstanceId = $Request.Body.InstanceId
$EventName = 'MyEvent'
$EventData = @(1,2,3)

Send-DurableExternalEvent -InstanceId $InstanceId -EventName $EventName -EventData $EventData
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

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

```csharp
using Microsoft.DurableTask.Client;

int[] eventData = new int[] { 1, 2, 3 };
await client.RaiseEventAsync(instanceId, "MyEvent", eventData);
```

# [Python](#tab/python)

```python
from durabletask.azuremanaged.client import DurableTaskSchedulerClient

event_data = [1, 2, 3]
client.raise_orchestration_event(instance_id, "MyEvent", event_data)
```

# [Java](#tab/java)

```java
import com.microsoft.durabletask.DurableTaskClient;

int[] eventData = { 1, 2, 3 };
client.raiseEvent(instanceId, "MyEvent", eventData);
```

# [JavaScript](#tab/javascript)

```typescript
import { createAzureManagedClient } from "@microsoft/durabletask-js-azuremanaged";

const client = createAzureManagedClient(connectionString);

const eventData = [1, 2, 3];
await client.raiseOrchestrationEvent(instanceId, "MyEvent", eventData);
```

# [PowerShell](#tab/powershell)

The Durable Task SDK is not available for PowerShell. Use [Durable Functions](what-is-durable-task.md) instead.

---

::: zone-end

> [!NOTE]
> If there's no orchestration instance with the specified instance ID, the event message is discarded. If an instance exists but it isn't yet waiting for the event, the event is stored in the instance state until it's ready to be received and processed.

## Wait for orchestration completion

In long-running orchestrations, you might want to wait and get the results of an orchestration. In these cases, it's also useful to define a timeout period on the orchestration. If the timeout is exceeded, the state of the orchestration is returned instead of the results.

Use the *"wait for completion or create check status response"* API to get the actual output from an orchestration instance synchronously. By default, this method has a timeout of ten seconds and a polling interval of one second.

Here's an example HTTP-trigger function that demonstrates how to use this API:

::: zone pivot="durable-functions"

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

# [PowerShell](#tab/powershell)
> [!NOTE]
> PowerShell doesn't currently have a built-in command for this scenario.

# [Java](#tab/java)

Java doesn't currently have a single method for this scenario, but you can implement it with a few extra lines of code.

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

::: zone-end

::: zone pivot="durable-task-sdks"

The Durable Task SDKs provide a method to wait for an orchestration to finish synchronously.

# [C#](#tab/csharp)

```csharp
using Microsoft.DurableTask.Client;

// Wait for orchestration to complete with a timeout
OrchestrationMetadata metadata = await client.WaitForInstanceCompletionAsync(
    instanceId,
    timeout: TimeSpan.FromSeconds(30),
    getInputsAndOutputs: true);

if (metadata.RuntimeStatus == OrchestrationRuntimeStatus.Completed)
{
    Console.WriteLine($"Output: {metadata.SerializedOutput}");
}
```

# [Python](#tab/python)

```python
from durabletask.azuremanaged.client import DurableTaskSchedulerClient

# Wait for orchestration to complete with a timeout
state = client.wait_for_orchestration_completion(
    instance_id,
    timeout=30,
    fetch_payloads=True)

if state.runtime_status == 'COMPLETED':
    print(f"Output: {state.serialized_output}")
```

# [Java](#tab/java)

```java
import com.microsoft.durabletask.DurableTaskClient;
import com.microsoft.durabletask.OrchestrationMetadata;
import java.time.Duration;
import java.util.concurrent.TimeoutException;

// Wait for orchestration to complete with a timeout
try {
    OrchestrationMetadata metadata = client.waitForInstanceCompletion(
            instanceId,
            Duration.ofSeconds(30),
            true /* getInputsAndOutputs */);
    System.out.println("Output: " + metadata.getSerializedOutput());
} catch (TimeoutException e) {
    System.out.println("Orchestration did not complete within timeout");
}
```

# [JavaScript](#tab/javascript)

```typescript
import { createAzureManagedClient } from "@microsoft/durabletask-js-azuremanaged";
import { OrchestrationStatus } from "@microsoft/durabletask-js";

const client = createAzureManagedClient(connectionString);

// Wait for orchestration to complete with a timeout
const state = await client.waitForOrchestrationCompletion(instanceId, true, 30);

if (state?.runtimeStatus === OrchestrationStatus.COMPLETED) {
    console.log(`Output: ${state.serializedOutput}`);
}
```

# [PowerShell](#tab/powershell)

The Durable Task SDK is not available for PowerShell. Use [Durable Functions](what-is-durable-task.md) instead.

---

::: zone-end

Call the function with the following line. Use two seconds for the timeout and 0.5 seconds for the retry interval:

```bash
curl -X POST "http://localhost:7071/orchestrators/E1_HelloSequence/wait?timeout=2&retryInterval=0.5"
```

> [!NOTE]
> The above cURL command assumes you have an orchestrator function named `E1_HelloSequence` in your project. Because of how the HTTP trigger function is written, you can replace it with the name of any orchestrator function in your project.

Depending on the time required to get the response from the orchestration instance, two cases exist:

* The orchestration instances finish within the defined timeout (in this case two seconds), and the response is the actual orchestration instance output, delivered synchronously:

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

* The orchestration instances can't finish within the defined timeout, and the response is the default one described in [HTTP API URL discovery](../../azure-functions/durable-functions/durable-functions-http-api.md):

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
> The format of the webhook URLs might differ, depending on which version of the Azure Functions host you run. The preceding example is for the Azure Functions 3.0 host.

::: zone pivot="durable-functions"

## Retrieve HTTP management webhook URLs

Use an external system to monitor or raise events to an orchestration. External systems communicate with Durable Functions through the webhook URLs that are part of the default response described in [HTTP API URL discovery](../../azure-functions/durable-functions/durable-functions-http-features.md#http-api-url-discovery). The webhook URLs are alternatively accessible programmatically using the [orchestration client binding](../../azure-functions/durable-functions/durable-functions-bindings.md#orchestration-client). Specifically, the *create HTTP management payload* API gets a serializable object that contains these webhook URLs.

The *create HTTP management payload* API has one parameter:

* *Instance ID*: The unique ID of the instance.

The methods return an object with the following string properties:

* **Id**: The instance ID of the orchestration (should be the same as the `InstanceId` input).
* **StatusQueryGetUri**: The status URL of the orchestration instance.
* **SendEventPostUri**: The "raise event" URL of the orchestration instance.
* **TerminatePostUri**: The "terminate" URL of the orchestration instance.
* **PurgeHistoryDeleteUri**: The "purge history" URL of the orchestration instance.
* **SuspendPostUri**: The "suspend" URL of the orchestration instance.
* **ResumePostUri**: The "resume" URL of the orchestration instance.

Functions send instances of these objects to external systems to monitor or raise events on the corresponding orchestrations, as shown in the following examples.

# [C#](#tab/csharp)

```csharp
[FunctionName("SendInstanceInfo")]
public static void SendInstanceInfo(
    [ActivityTrigger] IDurableActivityContext ctx,
    [DurableClient] IDurableOrchestrationClient client,
    [CosmosDB(
        databaseName: "MonitorDB",
        containerName: "HttpManagementPayloads",
        Connection = "CosmosDBConnectionSetting")]out dynamic document)
{
    HttpManagementPayload payload = client.CreateHttpManagementPayload(ctx.InstanceId);

    // send the payload to Azure Cosmos DB
    document = new { Payload = payload, id = ctx.InstanceId };
}
```

> [!NOTE]
> The previous C# code uses the in-process model with `IDurableOrchestrationClient` and `IDurableActivityContext`, which are marked as obsolete in newer versions of the Durable Functions extension. For new .NET projects, consider using the [.NET isolated worker model](../../azure-functions/durable-functions/durable-functions-dotnet-isolated-overview.md) with `DurableTaskClient`. For more information, see the [Durable Functions versions](../../azure-functions/durable-functions/durable-functions-versions.md) article.

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

# [PowerShell](#tab/powershell)

```powershell
using namespace System.Net

param($Request, $TriggerMetadata)

$InstanceId = $Request.Body.InstanceId
$Response = New-DurableOrchestrationCheckStatusResponse -Request $Request -InstanceId $InstanceId
Push-OutputBinding -Name Response -Value $Response
```

# [Java](#tab/java)

<!-- Tracking issue: https://github.com/microsoft/durabletask-java/issues/63 -->

> [!NOTE]
> Java doesn't currently support this feature.

---

::: zone-end

## Rewind instances

If you have an orchestration failure for an unexpected reason, *rewind* the instance to a previously healthy state by using an API built for that purpose.

> [!NOTE]
> This API isn't intended to be a replacement for proper error handling and retry policies. Rather, it's intended to be used only in cases where orchestration instances fail for unexpected reasons. Orchestrations in states other than `Failed` (for example, `Running`, `Pending`, `Terminated`, or `Completed`) can't be "rewound". For more information about error handling and retry policies, see the [Error handling](durable-task-error-handling.md) article.

Use the `RewindAsync` (.NET) or `rewind` (JavaScript) method of the [orchestration client binding](../../azure-functions/durable-functions/durable-functions-bindings.md#orchestration-client) to put the orchestration back into the *Running* state. This method also reruns the activity or suborchestration execution failures that caused the orchestration failure.

For example, say you have a workflow involving a series of [human approvals](durable-task-human-interaction.md). Suppose a series of activity functions notify someone that their approval is needed and wait out the real-time response. After all the approval activities receive responses or time out, suppose another activity fails because of an application misconfiguration, like an invalid database connection string. The result is an orchestration failure deep into the workflow. With the `RewindAsync` (.NET) or `rewind` (JavaScript) API, an application admin can fix the configuration error and rewind the failed orchestration back to the state immediately before the failure. None of the human-interaction steps need to be re-approved, and the orchestration can now complete successfully.

> [!NOTE]
> The *rewind* feature doesn't support rewinding orchestration instances that use durable timers.

::: zone pivot="durable-functions"

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
> The previous C# code uses the in-process model with `IDurableOrchestrationClient`, which is marked as obsolete in newer versions of the Durable Functions extension. For new .NET projects, consider using the [.NET isolated worker model](../../azure-functions/durable-functions/durable-functions-dotnet-isolated-overview.md) with `DurableTaskClient`. For more information, see the [Durable Functions versions](../../azure-functions/durable-functions/durable-functions-versions.md) article.

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
> Python doesn't currently support this feature.

<!-- ```python
import azure.functions as func
import azure.durable_functions as df

async def main(req: func.HttpRequest, starter: str, instance_id: str) -> func.HttpResponse:
    client = df.DurableOrchestrationClient(starter)

    reason = "Orchestrator failed and needs to be revived."
    return client.rewind(instance_id, reason)
``` -->

# [PowerShell](#tab/powershell)

> [!NOTE]
> PowerShell doesn't currently support this feature.

# [Java](#tab/java)

> [!NOTE]
> Java doesn't currently support this feature.

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

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

```csharp
using Microsoft.DurableTask.Client;

string reason = "Orchestrator failed and needs to be revived.";
await client.RewindInstanceAsync(instanceId, reason);
```

# [JavaScript](#tab/javascript)

```typescript
import { createAzureManagedClient } from "@microsoft/durabletask-js-azuremanaged";

const client = createAzureManagedClient(connectionString);

const reason = "Orchestrator failed and needs to be revived.";
await client.rewindInstance(instanceId, reason);
```

# [Python](#tab/python)

This sample is shown for .NET and JavaScript only.

# [PowerShell](#tab/powershell)

This sample is shown for .NET and JavaScript only.

# [Java](#tab/java)

This sample is shown for .NET and JavaScript only.

---

::: zone-end

## Restart instances

Restarting an orchestration creates a new instance using the history of a previously run instance. This feature is useful when you want to rerun an orchestration with the same input and instance ID pattern, creating a fresh run based on the original.

::: zone pivot="durable-functions"

# [C#](#tab/csharp)

```csharp
[FunctionName("RestartInstance")]
public static Task Run(
    [DurableClient] IDurableOrchestrationClient client,
    [QueueTrigger("restart-queue")] string instanceId)
{
    return client.RestartAsync(instanceId, restartWithNewInstanceId: true);
}
```

> [!NOTE]
> The previous C# code uses the in-process model with `IDurableOrchestrationClient`, which is marked as obsolete in newer versions of the Durable Functions extension. For new .NET projects, consider using the [.NET isolated worker model](../../azure-functions/durable-functions/durable-functions-dotnet-isolated-overview.md) with `DurableTaskClient`. For more information, see the [Durable Functions versions](../../azure-functions/durable-functions/durable-functions-versions.md) article.

# [JavaScript](#tab/javascript)

> [!NOTE]
> JavaScript doesn't currently support this feature.

# [Python](#tab/python)

> [!NOTE]
> Python doesn't currently support this feature.

# [PowerShell](#tab/powershell)

> [!NOTE]
> PowerShell doesn't currently support this feature.

# [Java](#tab/java)

> [!NOTE]
> This feature is currently not supported in Java.

---

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

```csharp
using Microsoft.DurableTask.Client;

// Restart an orchestration with a new instance ID
string newInstanceId = await client.RestartInstanceAsync(instanceId, restartWithNewInstanceId: true);
Console.WriteLine($"Restarted as new instance: {newInstanceId}");

// Restart an orchestration keeping the same instance ID
await client.RestartInstanceAsync(instanceId, restartWithNewInstanceId: false);
```

# [JavaScript](#tab/javascript)

```typescript
import { createAzureManagedClient } from "@microsoft/durabletask-js-azuremanaged";

const client = createAzureManagedClient(connectionString);

// Restart an orchestration with a new instance ID
const newInstanceId = await client.restartOrchestration(instanceId, true);
console.log(`Restarted as new instance: ${newInstanceId}`);

// Restart an orchestration keeping the same instance ID
await client.restartOrchestration(instanceId, false);
```

# [Python](#tab/python)

This sample is shown for .NET and JavaScript only.

# [PowerShell](#tab/powershell)

This sample is shown for .NET and JavaScript only.

# [Java](#tab/java)

This sample is shown for .NET and JavaScript only.

---

::: zone-end

## Purge instance history

To remove all the data associated with an orchestration, purge the instance history. For example, delete any storage resources associated with a completed instance. Use the *purge instance* API defined by the [orchestration client](../../azure-functions/durable-functions/durable-functions-bindings.md#orchestration-client).

The following example shows how to purge a single orchestration instance.

::: zone pivot="durable-functions"

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

# [PowerShell](#tab/powershell)

> [!NOTE]
> This feature is currently not supported in PowerShell, but can be achieved using the [Durable Functions HTTP API](../../azure-functions/durable-functions/durable-functions-http-api.md).

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

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

```csharp
using Microsoft.DurableTask.Client;

// Purge a single orchestration instance
PurgeResult result = await client.PurgeInstanceAsync(instanceId);
Console.WriteLine($"Purged {result.PurgedInstanceCount} instance(s).");
```

# [Python](#tab/python)

```python
from durabletask.azuremanaged.client import DurableTaskSchedulerClient

# Purge a single orchestration instance
result = client.purge_orchestration(instance_id)
print(f"Purged {result.deleted_instance_count} instance(s).")
```

# [Java](#tab/java)

```java
import com.microsoft.durabletask.DurableTaskClient;
import com.microsoft.durabletask.PurgeResult;

// Purge a single orchestration instance
PurgeResult result = client.purgeInstance(instanceId);
System.out.println("Purged " + result.getDeletedInstanceCount() + " instance(s).");
```

# [JavaScript](#tab/javascript)

```typescript
import { createAzureManagedClient } from "@microsoft/durabletask-js-azuremanaged";

const client = createAzureManagedClient(connectionString);

// Purge a single orchestration instance
const result = await client.purgeOrchestration(instanceId);
console.log(`Purged ${result?.deletedInstanceCount ?? 0} instance(s).`);
```

# [PowerShell](#tab/powershell)

The Durable Task SDK is not available for PowerShell. Use [Durable Functions](what-is-durable-task.md) instead.

---

::: zone-end

The following example shows a timer-triggered function that purges the history for all orchestration instances that completed after the specified time interval. In this case, it removes data for all instances completed 30 or more days ago. This example function is scheduled to run once per day, at 12:00 PM UTC:

::: zone pivot="durable-functions"

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
> The previous C# code uses the in-process model with `IDurableOrchestrationClient`, which is marked as obsolete in newer versions of the Durable Functions extension. For new .NET projects, consider using the [.NET isolated worker model](../../azure-functions/durable-functions/durable-functions-dotnet-isolated-overview.md) with `DurableTaskClient`. For more information, see the [Durable Functions versions](../../azure-functions/durable-functions/durable-functions-versions.md) article.

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

# [PowerShell](#tab/powershell)

> [!NOTE]
> This feature is currently not supported in PowerShell, but can be achieved using the [Durable Functions HTTP API](../../azure-functions/durable-functions/durable-functions-http-api.md).

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

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

```csharp
using Microsoft.DurableTask.Client;

// Purge completed instances older than 30 days
var filter = new PurgeInstancesFilter(
    CreatedFrom: DateTime.MinValue,
    CreatedTo: DateTime.UtcNow.AddDays(-30),
    Statuses: new[] { OrchestrationRuntimeStatus.Completed });

PurgeResult result = await client.PurgeAllInstancesAsync(filter);
Console.WriteLine($"Purged {result.PurgedInstanceCount} instance(s).");
```

# [Python](#tab/python)

```python
from durabletask.azuremanaged.client import DurableTaskSchedulerClient
from datetime import datetime, timedelta

# Purge completed instances older than 30 days
result = client.purge_orchestrations(
    created_time_from=datetime.min,
    created_time_to=datetime.utcnow() - timedelta(days=30),
    runtime_status=['COMPLETED']
)
print(f"Purged {result.deleted_instance_count} instance(s).")
```

# [Java](#tab/java)

```java
import com.microsoft.durabletask.DurableTaskClient;
import com.microsoft.durabletask.PurgeInstanceCriteria;
import com.microsoft.durabletask.PurgeResult;
import com.microsoft.durabletask.OrchestrationRuntimeStatus;
import java.time.Duration;
import java.time.Instant;
import java.util.List;

// Purge completed instances older than 30 days
PurgeInstanceCriteria criteria = new PurgeInstanceCriteria()
    .setCreatedTimeTo(Instant.now().minus(Duration.ofDays(30)))
    .setRuntimeStatusList(List.of(OrchestrationRuntimeStatus.COMPLETED));

PurgeResult result = client.purgeInstances(criteria);
System.out.println("Purged " + result.getDeletedInstanceCount() + " instance(s).");
```

# [JavaScript](#tab/javascript)

```typescript
import { createAzureManagedClient } from "@microsoft/durabletask-js-azuremanaged";
import { OrchestrationStatus, PurgeInstanceCriteria } from "@microsoft/durabletask-js";

const client = createAzureManagedClient(connectionString);

// Purge completed instances older than 30 days
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

const criteria = new PurgeInstanceCriteria();
criteria.setCreatedTimeTo(thirtyDaysAgo);
criteria.setRuntimeStatusList([OrchestrationStatus.COMPLETED]);

const result = await client.purgeOrchestration(criteria);
console.log(`Purged ${result?.deletedInstanceCount ?? 0} instance(s).`);
```

# [PowerShell](#tab/powershell)

The Durable Task SDK is not available for PowerShell. Use [Durable Functions](what-is-durable-task.md) instead.

---

::: zone-end

> [!NOTE]
> For the purge history operation to succeed, the runtime status of the target instance must be **Completed**, **Terminated**, or **Failed**.

## Next steps

::: zone pivot="durable-functions"
> [!div class="nextstepaction"]
> [Handle versioning](../../azure-functions/durable-functions/durable-functions-versioning.md)

> [!div class="nextstepaction"]
> [Built-in HTTP API reference for instance management](../../azure-functions/durable-functions/durable-functions-http-api.md)
::: zone-end

::: zone pivot="durable-task-sdks"
> [!div class="nextstepaction"]
> [Get started with Durable Task SDKs](../sdks/quickstart-portable-durable-task-sdks.md)

> [!div class="nextstepaction"]
> [Learn about the Durable Task Scheduler](../scheduler/durable-task-scheduler.md)
::: zone-end
