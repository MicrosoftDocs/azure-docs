---
author: hhunter-ms
title: "Sub-orchestrations in Durable Task"
description: Learn how to use sub-orchestrations to call orchestrator functions from parent orchestrators in Durable Functions and Durable Task SDKs. Get started now.
ms.topic: concept-article
ms.service: durable-task
ms.date: 04/23/2026
ms.author: azfuncdf
zone_pivot_groups: azure-durable-approach
---

# Sub-orchestrations

Orchestrator functions can call other orchestrator functions as *sub-orchestrations*. A sub-orchestration runs as a child of the calling (parent) orchestrator and behaves like an activity from the caller's perspective: it can return a value, throw exceptions caught by the parent, and support [automatic retry](durable-task-error-handling.md#automatic-retry-on-failure).

## When to use sub-orchestrations

Use sub-orchestrations when you need to:

- **Compose reusable workflow building blocks:** Extract a multi-step workflow into its own orchestrator so multiple parent orchestrations can call it.
- **Fan out orchestrations in parallel:** Schedule many instances of the same orchestrator concurrently and wait for all of them to finish.
- **Organize complex workflows:** Break a large orchestration into named, testable pieces instead of a single long function.

> [!NOTE]
> Sub-orchestrations must be defined in the same app as the parent orchestration. To call orchestrations in a different app, use the HTTP 202 polling pattern instead. For more information, see [HTTP features](../../azure-functions/durable-functions/durable-functions-http-features.md).

In this article:

- [Define a sub-orchestration](#define-a-sub-orchestration) — Single-device provisioning example
- [Run sub-orchestrations in parallel](#run-sub-orchestrations-in-parallel) — Fan-out pattern with deterministic instance IDs

::: zone pivot="durable-functions"

> [!NOTE]
> In PowerShell, sub-orchestrations are supported only in the standalone SDK: [`AzureFunctions.PowerShell.Durable.SDK`](https://www.powershellgallery.com/packages/AzureFunctions.PowerShell.Durable.SDK). For the differences between the standalone SDK and the legacy built-in SDK, see the [migration guide](../../azure-functions/durable-functions/durable-functions-powershell-v2-sdk-migration-guide.md).

::: zone-end

## Define a sub-orchestration

The following example illustrates an IoT scenario where multiple devices need to be set up. The function represents the setup workflow that runs for each device:

::: zone pivot="durable-functions"

# [C#](#tab/csharp)

<details>
<summary><b>Isolated worker model</b></summary>

```csharp
public static async Task DeviceProvisioningOrchestration(
    [OrchestrationTrigger] TaskOrchestrationContext context, string deviceId)
{
    // Step 1: Create an installation package in blob storage and return a SAS URL.
    Uri sasUrl = await context.CallActivityAsync<Uri>("CreateInstallationPackage", deviceId);

    // Step 2: Notify the device that the installation package is ready.
    await context.CallActivityAsync("SendPackageUrlToDevice", (deviceId, sasUrl));

    // Step 3: Wait for the device to acknowledge that it has downloaded the new package.
    await context.WaitForExternalEvent<bool>("DownloadCompletedAck");

    // Step 4: ...
}
```

</details>

<br>

<details>
<summary><b>In-process model</b></summary>

```csharp
public static async Task DeviceProvisioningOrchestration(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
{
    string deviceId = context.GetInput<string>();

    // Step 1: Create an installation package in blob storage and return a SAS URL.
    Uri sasUrl = await context.CallActivityAsync<Uri>("CreateInstallationPackage", deviceId);

    // Step 2: Notify the device that the installation package is ready.
    await context.CallActivityAsync("SendPackageUrlToDevice", Tuple.Create(deviceId, sasUrl));

    // Step 3: Wait for the device to acknowledge that it has downloaded the new package.
    await context.WaitForExternalEvent<bool>("DownloadCompletedAck");

    // Step 4: ...
}
```

</details>

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

df.app.orchestration("deviceProvisioningOrchestration", function* (context) {
    const deviceId = context.df.getInput();

    // Step 1: Create an installation package in blob storage and return a SAS URL.
    const sasUrl = yield context.df.callActivity("createInstallationPackage", deviceId);

    // Step 2: Notify the device that the installation package is ready.
    yield context.df.callActivity("sendPackageUrlToDevice", { id: deviceId, url: sasUrl });

    // Step 3: Wait for the device to acknowledge that it has downloaded the new package.
    yield context.df.waitForExternalEvent("downloadCompletedAck");

    // Step 4: ...
});
```

# [Python](#tab/python)

```python
import azure.functions as func
import azure.durable_functions as df

def orchestrator_function(context: df.DurableOrchestrationContext):
    device_id = context.get_input()

    # Step 1: Create an installation package in blob storage and return a SAS URL.
    sas_url = yield context.call_activity("CreateInstallationPackage", device_id)

    # Step 2: Notify the device that the installation package is ready.
    yield context.call_activity("SendPackageUrlToDevice", { "id": device_id, "url": sas_url })

    # Step 3: Wait for the device to acknowledge that it has downloaded the new package.
    yield context.call_activity("DownloadCompletedAck")

    # Step 4: ...
```

# [PowerShell](#tab/powershell)

```powershell
param($Context)

$deviceId = $Context.Input

# Step 1: Create an installation package in blob storage and return a SAS URL.
$sasUrl = Invoke-DurableActivity -FunctionName "CreateInstallationPackage" -Input $deviceId

# Step 2: Notify the device that the installation package is ready.
$deviceInfo = @{
    id = $deviceId
    url = $sasUrl
}
Invoke-DurableActivity -FunctionName "SendPackageUrlToDevice" -Input $deviceInfo

# Step 3: Wait for the device to acknowledge that it has downloaded the new package.
Start-DurableExternalEventListener -EventName "DownloadCompletedAck"

# Step 4: ...
```

# [Java](#tab/java)

```java
@FunctionName("DeviceProvisioningOrchestration")
public void deviceProvisioningOrchestration(
        @DurableOrchestrationTrigger(name = "ctx") TaskOrchestrationContext ctx) {
    // Step 1: Create an installation package in blob storage and return a SAS URL.
    String deviceId = ctx.getInput(String.class);
    String blobUri = ctx.callActivity("CreateInstallPackage", deviceId, String.class).await();

    // Step 2: Notify the device that the installation package is ready.
    String[] args = { deviceId, blobUri };
    ctx.callActivity("SendPackageUrlToDevice", args).await();

    // Step 3: Wait for the device to acknowledge that it has downloaded the new package.
    ctx.waitForExternalEvent("DownloadCompletedAck").await();

    // Step 4: ...
}
```

---

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

```csharp
using Microsoft.DurableTask;

[DurableTask]
public class DeviceProvisioningOrchestration : TaskOrchestrator<string, object?>
{
    public override async Task<object?> RunAsync(TaskOrchestrationContext context, string deviceId)
    {
        // Step 1: Create an installation package in blob storage and return a SAS URL.
        Uri sasUrl = await context.CallActivityAsync<Uri>("CreateInstallationPackage", deviceId);

        // Step 2: Notify the device that the installation package is ready.
        await context.CallActivityAsync("SendPackageUrlToDevice", (deviceId, sasUrl.ToString()));

        // Step 3: Wait for the device to acknowledge that it has downloaded the new package.
        await context.WaitForExternalEvent<bool>("DownloadCompletedAck");

        // Step 4: ...
        return null;
    }
}
```

# [JavaScript](#tab/javascript)

This sample is shown for .NET, Java, and Python.

# [Python](#tab/python)

```python
from durabletask import task

def device_provisioning_orchestrator(ctx: task.OrchestrationContext, device_id: str):
    # Step 1: Create an installation package in blob storage and return a SAS URL.
    sas_url = yield ctx.call_activity("create_installation_package", input=device_id)

    # Step 2: Notify the device that the installation package is ready.
    yield ctx.call_activity("send_package_url_to_device", input={"id": device_id, "url": sas_url})

    # Step 3: Wait for the device to acknowledge that it has downloaded the new package.
    yield ctx.wait_for_external_event("DownloadCompletedAck")

    # Step 4: ...
```

# [PowerShell](#tab/powershell)

This sample is shown for .NET, Java, and Python.

# [Java](#tab/java)

```java
import com.microsoft.durabletask.TaskOrchestration;
import com.microsoft.durabletask.TaskOrchestrationContext;

public class DeviceProvisioningOrchestration implements TaskOrchestration {
    @Override
    public void run(TaskOrchestrationContext ctx) {
        String deviceId = ctx.getInput(String.class);

        // Step 1: Create an installation package in blob storage and return a SAS URL.
        String blobUri = ctx.callActivity("CreateInstallPackage", deviceId, String.class).await();

        // Step 2: Notify the device that the installation package is ready.
        String[] args = { deviceId, blobUri };
        ctx.callActivity("SendPackageUrlToDevice", args).await();

        // Step 3: Wait for the device to acknowledge that it has downloaded the new package.
        ctx.waitForExternalEvent("DownloadCompletedAck").await();

        // Step 4: ...
    }
}
```

---

::: zone-end

This orchestrator function can run standalone for one-off device setup, or a parent orchestrator can schedule it as a sub-orchestration using the *call-sub-orchestrator* API.

## Run sub-orchestrations in parallel

The following example shows a parent orchestrator that fans out multiple sub-orchestrations in parallel. Some languages use a deterministic child instance ID (derived from the parent's instance ID plus an index) to prevent duplicate sub-orchestrations on replay.

::: zone pivot="durable-functions"

# [C#](#tab/csharp)

<details>
<summary><b>Isolated worker model</b></summary>

```csharp
[Function("ProvisionNewDevices")]
public static async Task ProvisionNewDevices(
    [OrchestrationTrigger] TaskOrchestrationContext context)
{
    string[] deviceIds = await context.CallActivityAsync<string[]>("GetNewDeviceIds");

    // Run multiple device provisioning flows in parallel
    var provisioningTasks = new List<Task>();
    foreach (string deviceId in deviceIds)
    {
        Task provisionTask = context.CallSubOrchestratorAsync("DeviceProvisioningOrchestration", deviceId);
        provisioningTasks.Add(provisionTask);
    }

    await Task.WhenAll(provisioningTasks);

    // ...
}
```

</details>

<br>

<details>
<summary><b>In-process model</b></summary>

```csharp
[FunctionName("ProvisionNewDevices")]
public static async Task ProvisionNewDevices(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
{
    string[] deviceIds = await context.CallActivityAsync<string[]>("GetNewDeviceIds");

    // Run multiple device provisioning flows in parallel
    var provisioningTasks = new List<Task>();
    foreach (string deviceId in deviceIds)
    {
        Task provisionTask = context.CallSubOrchestratorAsync("DeviceProvisioningOrchestration", deviceId);
        provisioningTasks.Add(provisionTask);
    }

    await Task.WhenAll(provisioningTasks);

    // ...
}
```

</details>

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

df.app.orchestration("provisionNewDevices", function* (context) {
    const deviceIds = yield context.df.callActivity("getNewDeviceIds");

    // Run multiple device provisioning flows in parallel
    const provisioningTasks = [];
    var id = 0;
    for (const deviceId of deviceIds) {
        const child_id = context.df.instanceId + `:${id}`;
        const provisionTask = context.df.callSubOrchestrator(
            "deviceProvisioningOrchestration",
            deviceId,
            child_id
        );
        provisioningTasks.push(provisionTask);
        id++;
    }

    yield context.df.Task.all(provisioningTasks);

    // ...
});
```

# [Python](#tab/python)

```Python
import azure.functions as func
import azure.durable_functions as df

def orchestrator_function(context: df.DurableOrchestrationContext):

    device_IDs = yield context.call_activity("GetNewDeviceIds")

    # Run multiple device provisioning flows in parallel
    provisioning_tasks = []
    id_ = 0
    for device_id in device_IDs:
        child_id = f"{context.instance_id}:{id_}"
        provision_task = context.call_sub_orchestrator("DeviceProvisioningOrchestration", device_id, child_id)
        provisioning_tasks.append(provision_task)
        id_ += 1

    yield context.task_all(provisioning_tasks)

    # ...
```

# [PowerShell](#tab/powershell)

```powershell
param($Context)

$deviceIds = Invoke-DurableActivity -FunctionName "GetNewDeviceIds"

# Run multiple device setting up flows in parallel
$provisioningTasks = @()
for ($i = 0; $i -lt $deviceIds.Count; $i++) {
    $deviceId = $deviceIds[$i]
    $childId = "$($Context.InstanceId):$i"
    $provisionTask = Invoke-DurableSubOrchestrator `
        -FunctionName "DeviceProvisioningOrchestration" `
        -Input $deviceId `
        -InstanceId $childId `
        -NoWait
    $provisioningTasks += $provisionTask
}

Wait-DurableTask -Task $provisioningTasks

# ...
```

# [Java](#tab/java)

```java
@FunctionName("ProvisionNewDevices")
public void provisionNewDevices(
        @DurableOrchestrationTrigger(name = "ctx") TaskOrchestrationContext ctx) {
    List<?> deviceIDs = ctx.getInput(List.class);

    // Schedule each device provisioning sub-orchestration to run in parallel
    List<Task<Void>> parallelTasks = deviceIDs.stream()
        .map(device -> ctx.callSubOrchestrator("DeviceProvisioningOrchestration", device))
        .collect(Collectors.toList());

    // ...
}
```

---

## Next steps

> [!div class="nextstepaction"]
> [Learn how to set a custom orchestration status](durable-task-custom-orchestration-status.md)

- [Error handling and compensation](durable-task-error-handling.md)
- [Orchestrations overview](durable-task-orchestrations.md)
- [Get started with Durable Task Scheduler](../scheduler/quickstart-durable-task-scheduler.md)

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

```csharp
using Microsoft.DurableTask;

[DurableTask]
public class ProvisionNewDevices : TaskOrchestrator<object?, object?>
{
    public override async Task<object?> RunAsync(TaskOrchestrationContext context, object? input)
    {
        string[] deviceIds = await context.CallActivityAsync<string[]>("GetNewDeviceIds");

        // Run multiple device provisioning flows in parallel
        var provisioningTasks = new List<Task>();
        foreach (string deviceId in deviceIds)
        {
            Task provisionTask = context.CallSubOrchestratorAsync("DeviceProvisioningOrchestration", deviceId);
            provisioningTasks.Add(provisionTask);
        }

        await Task.WhenAll(provisioningTasks);
        return null;
    }
}
```

# [JavaScript](#tab/javascript)

This sample is shown for .NET, Java, and Python.

# [Python](#tab/python)

```python
from durabletask import task

def provision_new_devices(ctx: task.OrchestrationContext, _):
    device_ids = yield ctx.call_activity("get_new_device_ids")

    # Run multiple device provisioning flows in parallel
    provisioning_tasks = []
    for device_id in device_ids:
        provision_task = ctx.call_sub_orchestrator(device_provisioning_orchestrator, input=device_id)
        provisioning_tasks.append(provision_task)

    yield task.when_all(provisioning_tasks)
```

# [PowerShell](#tab/powershell)

This sample is shown for .NET, Java, and Python.

# [Java](#tab/java)

```java
import com.microsoft.durabletask.TaskOrchestration;
import com.microsoft.durabletask.TaskOrchestrationContext;

public class ProvisionNewDevices implements TaskOrchestration {
    @Override
    public void run(TaskOrchestrationContext ctx) {
        List<?> deviceIDs = ctx.getInput(List.class);

        // Schedule each device provisioning sub-orchestration to run in parallel
        List<Task<Void>> parallelTasks = deviceIDs.stream()
            .map(device -> ctx.callSubOrchestrator("DeviceProvisioningOrchestration", device))
            .collect(Collectors.toList());

        ctx.allOf(parallelTasks).await();
    }
}
```

---

## Next steps

> [!div class="nextstepaction"]
> [Get started with Durable Task SDKs](../sdks/quickstart-portable-durable-task-sdks.md)

- [Error handling and compensation](durable-task-error-handling.md)
- [Orchestrations overview](durable-task-orchestrations.md)
- [Get started with Durable Task Scheduler](../scheduler/quickstart-durable-task-scheduler.md)

::: zone-end
