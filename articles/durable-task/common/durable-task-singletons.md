---
title: "Singleton Orchestrators - Durable Task"
description: Implement singleton orchestrators in Azure Durable Functions and Durable Task SDKs to ensure only one orchestration instance runs at a time. Follow this step-by-step guide to get started.
author: cgillum
ms.topic: how-to
ms.date: 04/23/2026
ms.author: azfuncdf
reviewer: hhunter-ms
ms.service: durable-task
ms.devlang: csharp
zone_pivot_groups: azure-durable-approach
---

# Singleton orchestrators in Durable Task

For background jobs, you often need to ensure that only one instance of a particular orchestrator runs at a time, preventing duplicate orchestrations from running concurrently. You can implement this singleton pattern in [Durable Functions](what-is-durable-task.md) or the [Durable Task SDKs](../sdks/quickstart-portable-durable-task-sdks.md) by assigning a specific instance ID to an orchestrator when creating it, and then checking if an instance with that ID is already running before starting a new one.

This article shows how to implement singleton orchestrators with code examples for each supported language.

## Prerequisites

- Familiarity with [Durable Task orchestrations](durable-task-orchestrations.md) and [task hubs](durable-task-hubs.md)
- An existing Durable Functions or Durable Task SDK project

> [!NOTE]
> There is a potential race condition in the singleton pattern. If two clients execute the check-and-start logic concurrently, both calls might report success, but only one orchestration instance actually starts. Depending on your requirements, this may have undesirable side effects. If strict single-instance guarantees are required, consider adding additional locking mechanisms.

::: zone pivot="durable-task-sdks"

[!INCLUDE [preview-sample-limitations](../scheduler/includes/preview-sample-limitations.md)]

::: zone-end

## Singleton orchestrator example

::: zone pivot="durable-functions"

The following example shows an HTTP-trigger function that creates a singleton background job orchestration. The code attempts to ensure that only one active instance exists for a specified instance ID.

# [C#](#tab/csharp)

```cs
[Function("HttpStartSingle")]
public static async Task<HttpResponseData> RunSingle(
    [HttpTrigger(AuthorizationLevel.Function, "post", Route = "orchestrators/{functionName}/{instanceId}")] HttpRequestData req,
    [DurableClient] DurableTaskClient starter,
    string functionName,
    string instanceId,
    FunctionContext executionContext)
{
    ILogger logger = executionContext.GetLogger("HttpStartSingle");

    // Check if an instance with the specified ID already exists or an existing one stopped running(completed/failed/terminated).
    OrchestrationMetadata? existingInstance = await starter.GetInstanceAsync(instanceId, getInputsAndOutputs: false);
    if (existingInstance == null 
    || existingInstance.RuntimeStatus == OrchestrationRuntimeStatus.Completed 
    || existingInstance.RuntimeStatus == OrchestrationRuntimeStatus.Failed 
    || existingInstance.RuntimeStatus == OrchestrationRuntimeStatus.Terminated)
    {
        // An instance with the specified ID doesn't exist or an existing one stopped running, create one.
        string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
        await starter.ScheduleNewOrchestrationInstanceAsync(functionName, requestBody, new StartOrchestrationOptions { InstanceId = instanceId });
        logger.LogInformation($"Started orchestration with ID = '{instanceId}'.");
        return await starter.CreateCheckStatusResponseAsync(req, instanceId);
    }
    else
    {
        // An instance with the specified ID exists or an existing one still running, don't create one.
        var response = req.CreateResponse(HttpStatusCode.Conflict);
        await response.WriteStringAsync($"An instance with ID '{instanceId}' already exists.");
        return response;
    }
}
```

> [!NOTE]
> The previous C# code is for the isolated worker model, which is the recommended model for .NET apps. For more information about the differences between the in-process and isolated worker models, see the [Durable Functions versions](../../azure-functions/durable-functions/durable-functions-versions.md) article.

# [JavaScript](#tab/javascript)

> [!IMPORTANT]
> This JavaScript example uses the Node.js programming model v3, which uses *function.json*. If you're using the **Node.js programming model v4** (the current default), use the v4 code-first pattern instead.

**function.json**

```json
{
  "bindings": [
    {
      "authLevel": "function",
      "name": "req",
      "type": "httpTrigger",
      "direction": "in",
      "route": "orchestrators/{functionName}/{instanceId}",
      "methods": ["post"]
    },
    {
      "name": "starter",
      "type": "orchestrationClient",
      "direction": "in"
    },
    {
      "name": "$return",
      "type": "http",
      "direction": "out"
    }
  ]
}
```

**index.js**

```javascript
const df = require("durable-functions");

module.exports = async function(context, req) {
    const client = df.getClient(context);

    const instanceId = req.params.instanceId;
    const functionName = req.params.functionName;

    // Check if an instance with the specified ID already exists or an existing one stopped running(completed/failed/terminated).
    const existingInstance = await client.getStatus(instanceId);
    if (!existingInstance 
        || existingInstance.runtimeStatus == "Completed" 
        || existingInstance.runtimeStatus == "Failed" 
        || existingInstance.runtimeStatus == "Terminated") {
        // An instance with the specified ID doesn't exist or an existing one stopped running, create one.
        const eventData = req.body;
        await client.startNew(functionName, instanceId, eventData);
        context.log(`Started orchestration with ID = '${instanceId}'.`);
        return client.createCheckStatusResponse(req, instanceId);
    } else {
        // An instance with the specified ID exists or an existing one still running, don't create one.
        return {
            status: 409,
            body: `An instance with ID '${instanceId}' already exists.`,
        };
    }
};
```

# [Python](#tab/python)

**function_app.py**

```python
import logging
import azure.functions as func
import azure.durable_functions as df

app = df.DFApp(http_auth_level=func.AuthLevel.FUNCTION)

@app.route(route="orchestrators/{functionName}/{instanceId}", methods=["POST"])
@app.durable_client_input(client_name="client")
async def http_start_single(req: func.HttpRequest, client):
    instance_id = req.route_params["instanceId"]
    function_name = req.route_params["functionName"]

    existing_instance = await client.get_status(instance_id)

    if not existing_instance or existing_instance.runtime_status in [
        df.OrchestrationRuntimeStatus.Completed,
        df.OrchestrationRuntimeStatus.Failed,
        df.OrchestrationRuntimeStatus.Terminated,
    ]:
        event_data = req.get_body()
        instance_id = await client.start_new(function_name, instance_id, event_data)
        logging.info(f"Started orchestration with ID = '{instance_id}'.")
        return client.create_check_status_response(req, instance_id)

    return func.HttpResponse(
        body=f"An instance with ID '{instance_id}' already exists.",
        status_code=409,
    )
```

# [PowerShell](#tab/powershell)

```powershell
using namespace System.Net

param($Request, $TriggerMetadata)

$FunctionName = $Request.Params.FunctionName
$InstanceId = $Request.Params.InstanceId

# Check if an instance with the specified ID already exists
$existingInstance = Get-DurableStatus -InstanceId $InstanceId

if (-not $existingInstance -or 
    $existingInstance.RuntimeStatus -eq "Completed" -or 
    $existingInstance.RuntimeStatus -eq "Failed" -or 
    $existingInstance.RuntimeStatus -eq "Terminated") {
    
    # An instance with the specified ID doesn't exist or stopped running, create one
    $InstanceId = Start-DurableOrchestration -FunctionName $FunctionName -InstanceId $InstanceId -Input $Request.Body
    Write-Host "Started orchestration with ID = '$InstanceId'."
    
    $Response = New-DurableOrchestrationCheckStatusResponse -Request $Request -InstanceId $InstanceId
    Push-OutputBinding -Name Response -Value $Response
}
else {
    # An instance with the specified ID exists or still running
    Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
        StatusCode = [HttpStatusCode]::Conflict
        Body = "An instance with ID '$InstanceId' already exists."
    })
}
```

# [Java](#tab/java)

```java
@FunctionName("HttpStartSingle")
public HttpResponseMessage runSingle(
        @HttpTrigger(name = "req", route = "orchestrators/{functionName}/{instanceId}") HttpRequestMessage<?> req,
        @DurableClientInput(name = "durableContext") DurableClientContext durableContext) {

    String instanceId = req.getHeaders().getOrDefault("instanceId", "singleton-job");
    DurableTaskClient client = durableContext.getClient();

    // Check to see if an instance with this ID is already running
    OrchestrationMetadata metadata = client.getInstanceMetadata(instanceId, false);
    if (metadata == null || !metadata.isRunning()) {
        // No such instance exists or it finished - create a new one.
        // De-dupe is handled automatically in the storage layer if another
        // function tries to also use this instance ID.
        client.scheduleNewOrchestrationInstance("MyOrchestration", null, instanceId);
        return durableContext.createCheckStatusResponse(req, instanceId);
    }

    return req.createResponseBuilder(HttpStatus.CONFLICT)
            .body("An instance with ID '" + instanceId + "' already exists.")
            .build();
}
```

---

::: zone-end

::: zone pivot="durable-task-sdks"

The following example shows how to create a singleton orchestration using the Durable Task SDKs. The code attempts to ensure that only one active instance exists for a specified instance ID.

# [C#](#tab/csharp)

```csharp
using Microsoft.DurableTask.Client;

// Check if an instance with the specified ID already exists
string instanceId = "singleton-job";
OrchestrationMetadata? existingInstance = await client.GetInstanceAsync(instanceId, getInputsAndOutputs: false);

if (existingInstance == null ||
    existingInstance.RuntimeStatus == OrchestrationRuntimeStatus.Completed ||
    existingInstance.RuntimeStatus == OrchestrationRuntimeStatus.Failed ||
    existingInstance.RuntimeStatus == OrchestrationRuntimeStatus.Terminated)
{
    // An instance with the specified ID doesn't exist or an existing one stopped running, create one.
    await client.ScheduleNewOrchestrationInstanceAsync("MyOrchestration", input, new StartOrchestrationOptions(instanceId));
    Console.WriteLine($"Started orchestration with ID = '{instanceId}'.");
}
else
{
    // An instance with the specified ID exists or an existing one still running.
    Console.WriteLine($"An instance with ID '{instanceId}' already exists.");
}
```

# [Python](#tab/python)

```python
from durabletask.azuremanaged.client import DurableTaskSchedulerClient

instance_id = "singleton-job"

# Check if an instance with the specified ID already exists
existing_instance = client.get_orchestration_state(instance_id)

if (existing_instance is None or
    existing_instance.runtime_status in ['COMPLETED', 'FAILED', 'TERMINATED']):
    # An instance with the specified ID doesn't exist or an existing one stopped running, create one.
    client.schedule_new_orchestration(my_orchestration, input=input_data, instance_id=instance_id)
    print(f"Started orchestration with ID = '{instance_id}'.")
else:
    # An instance with the specified ID exists or an existing one still running.
    print(f"An instance with ID '{instance_id}' already exists.")
```

# [Java](#tab/java)

```java
import com.microsoft.durabletask.DurableTaskClient;
import com.microsoft.durabletask.OrchestrationMetadata;

String instanceId = "singleton-job";

// Check to see if an instance with this ID is already running
OrchestrationMetadata existingInstance = client.getInstanceMetadata(instanceId, false);

if (existingInstance == null || !existingInstance.isRunning()) {
    // An instance doesn't exist or finished - create one
    client.scheduleNewOrchestrationInstance("MyOrchestration", input, instanceId);
    System.out.println("Started orchestration with ID = '" + instanceId + "'.");
} else {
    // An instance with the specified ID exists and is still running
    System.out.println("An instance with ID '" + instanceId + "' already exists.");
}
```

# [JavaScript](#tab/javascript)

```typescript
import { createAzureManagedClient } from "@microsoft/durabletask-js-azuremanaged";
import { OrchestrationStatus } from "@microsoft/durabletask-js";

const client = createAzureManagedClient(connectionString);

const instanceId = "singleton-job";

// Check if an instance with the specified ID already exists
const existingInstance = await client.getOrchestrationState(instanceId, false);

if (!existingInstance ||
    existingInstance.runtimeStatus === OrchestrationStatus.COMPLETED ||
    existingInstance.runtimeStatus === OrchestrationStatus.FAILED ||
    existingInstance.runtimeStatus === OrchestrationStatus.TERMINATED) {
    // An instance with the specified ID doesn't exist or an existing one stopped running, create one.
    await client.scheduleNewOrchestration("MyOrchestration", input, instanceId);
    console.log(`Started orchestration with ID = '${instanceId}'.`);
} else {
    // An instance with the specified ID exists or an existing one still running.
    console.log(`An instance with ID '${instanceId}' already exists.`);
}
```

# [PowerShell](#tab/powershell)

The Durable Task SDK is not available for PowerShell. Use [Durable Functions](what-is-durable-task.md) instead.

---

::: zone-end

## How the singleton pattern works

Because instance IDs are unique within a task hub, scheduling an orchestration with a known, fixed ID and checking its status first prevents duplicate concurrent runs. By default, instance IDs are randomly generated GUIDs. In the previous examples, however, a specific instance ID is passed in. The code then fetches the orchestration instance metadata to check if an instance with that ID is already running. If no such instance is running, a new instance is created with that ID.

The orchestrator function itself can use any pattern — a standard function that starts and completes, or an [Eternal Orchestration](durable-task-eternal-orchestrations.md) that runs continuously. The singleton pattern only controls how many instances run concurrently.

## Next steps

::: zone pivot="durable-functions"
> [!div class="nextstepaction"]
> [Learn about the native HTTP features of orchestrations](../../azure-functions/durable-functions/durable-functions-http-features.md)

- [Eternal orchestrations](durable-task-eternal-orchestrations.md)
- [Sub-orchestrations](durable-task-sub-orchestrations.md)
- [Instance management](durable-task-instance-management.md)
::: zone-end

::: zone pivot="durable-task-sdks"
> [!div class="nextstepaction"]
> [Get started with Durable Task SDKs](../sdks/quickstart-portable-durable-task-sdks.md)

- [Eternal orchestrations](durable-task-eternal-orchestrations.md)
- [Sub-orchestrations](durable-task-sub-orchestrations.md)
- [Task hubs](durable-task-hubs.md)
::: zone-end
