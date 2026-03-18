---
title: Singleton orchestrators - Azure Durable Functions and Durable Task SDKs
description: Learn how to implement singleton orchestrations that ensure only one instance runs at a time using Durable Functions or the Durable Task SDKs.
author: cgillum
ms.topic: conceptual
ms.date: 01/30/2026
ms.author: azfuncdf
reviewer: hhunter-ms
ms.service: azure-functions
ms.subservice: durable
ms.devlang: csharp
zone_pivot_groups: azure-durable-approach
---

# Singleton orchestrators

For background jobs, you often need to ensure that only one instance of a particular orchestrator runs at a time. You can ensure this kind of singleton behavior in [Durable Functions](what-is-durable-task.md) or the [Durable Task SDKs](durable-task-scheduler/quickstart-portable-durable-task-sdks.md) by assigning a specific instance ID to an orchestrator when creating it, and then checking if an instance with that ID is already running before starting a new one.

::: zone pivot="durable-task-sdks"

[!INCLUDE [preview-sample-limitations](./durable-task-scheduler/includes/preview-sample-limitations.md)]

::: zone-end

## Singleton example

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
> The previous C# code is for the isolated worker model, which is the recommended model for .NET apps. For more information about the differences between the in-process and isolated worker models, see the [Durable Functions versions](durable-functions-versions.md) article.

# [JavaScript](#tab/javascript)

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

**__init__.py**

```python
import logging
import azure.functions as func
import azure.durable_functions as df

async def main(req: func.HttpRequest, starter: str) -> func.HttpResponse:
    client = df.DurableOrchestrationClient(starter)
    instance_id = req.route_params['instanceId']
    function_name = req.route_params['functionName']

    existing_instance = await client.get_status(instance_id)

    if existing_instance.runtime_status in [df.OrchestrationRuntimeStatus.Completed, df.OrchestrationRuntimeStatus.Failed, df.OrchestrationRuntimeStatus.Terminated, None]:
        event_data = req.get_body()
        instance_id = await client.start_new(function_name, instance_id, event_data)
        logging.info(f"Started orchestration with ID = '{instance_id}'.")
        return client.create_check_status_response(req, instance_id)
    else:
        return {
            'status': 409,
            'body': f"An instance with ID '${existing_instance.instance_id}' already exists"
        }

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
        @HttpTrigger(name = "req") HttpRequestMessage<?> req,
        @DurableClientInput(name = "durableContext") DurableClientContext durableContext) {

    String instanceID = "StaticID";
    DurableTaskClient client = durableContext.getClient();

    // Check to see if an instance with this ID is already running
    OrchestrationMetadata metadata = client.getInstanceMetadata(instanceID, false);
    if (metadata.isRunning()) {
        return req.createResponseBuilder(HttpStatus.CONFLICT)
                .body("An instance with ID '" + instanceID + "' already exists.")
                .build();
    }

    // No such instance exists - create a new one. De-dupe is handled automatically
    // in the storage layer if another function tries to also use this instance ID.
    client.scheduleNewOrchestrationInstance("MyOrchestration", null, instanceID);
    return durableContext.createCheckStatusResponse(req, instanceID);
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

By default, instance IDs are randomly generated GUIDs. In the previous example, however, a specific instance ID is used. The code then fetches the orchestration instance metadata to check if an instance having the specified ID is already running. If no such instance is running, a new instance is created with that ID.

> [!NOTE]
> There is a potential race condition in this sample. If two instances execute concurrently, both calls might report success, but only one orchestration instance will actually start. Depending on your requirements, this may have undesirable side effects.

The implementation details of the orchestrator function don't actually matter. It could be a regular orchestrator function that starts and completes, or it could be one that runs forever (that is, an [Eternal Orchestration](durable-functions-eternal-orchestrations.md)). The important point is that there is only ever one instance running at a time.

## Next steps

::: zone pivot="durable-functions"
> [!div class="nextstepaction"]
> [Learn about the native HTTP features of orchestrations](durable-functions-http-features.md)
::: zone-end

::: zone pivot="durable-task-sdks"
> [!div class="nextstepaction"]
> [Get started with Durable Task SDKs](durable-task-scheduler/quickstart-portable-durable-task-sdks.md)
::: zone-end
