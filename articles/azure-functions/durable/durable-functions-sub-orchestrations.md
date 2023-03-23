---
title: Sub-orchestrations for Durable Functions - Azure
description: How to call orchestrations from orchestrations in the Durable Functions extension for Azure Functions.
ms.topic: conceptual
ms.date: 02/14/2023
ms.author: azfuncdf
---

# Sub-orchestrations in Durable Functions (Azure Functions)

In addition to calling activity functions, orchestrator functions can call other orchestrator functions. For example, you can build a larger orchestration out of a library of smaller orchestrator functions. Or you can run multiple instances of an orchestrator function in parallel.

An orchestrator function can call another orchestrator function using the *"call-sub-orchestrator"* API. The [Error Handling & Compensation](durable-functions-error-handling.md#automatic-retry-on-failure) article has more information on automatic retry.

Sub-orchestrator functions behave just like activity functions from the caller's perspective. They can return a value, throw an exception, and can be awaited by the parent orchestrator function. 

> [!NOTE]
> Sub-orchestrations are not yet supported in PowerShell.

> [!NOTE]
> The new programming model for authoring Functions in Node.js (V4) is currently in preview. Compared to the current model, the new experience is designed to be more idiomatic and intuitive for JavaScript and TypeScript developers. To learn more, see the Azure Functions Node.js [developer guide](../functions-reference-node.md?pivots=nodejs-model-v4).
>
> In the following code snippets, JavaScript (PM4) denotes programming model V4, the new experience.

## Example

The following example illustrates an IoT ("Internet of Things") scenario where there are multiple devices that need to be provisioned. The following function represents the provisioning workflow that needs to be executed for each device:

# [C# (InProc)](#tab/csharp-inproc)

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

# [C# (Isolated)](#tab/csharp-isolated)

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

# [JavaScript (PM3)](#tab/javascript-v3)

```javascript
const df = require("durable-functions");

module.exports = df.orchestrator(function*(context) {
    const deviceId = context.df.getInput();

    // Step 1: Create an installation package in blob storage and return a SAS URL.
    const sasUrl = yield context.df.callActivity("CreateInstallationPackage", deviceId);

    // Step 2: Notify the device that the installation package is ready.
    yield context.df.callActivity("SendPackageUrlToDevice", { id: deviceId, url: sasUrl });

    // Step 3: Wait for the device to acknowledge that it has downloaded the new package.
    yield context.df.waitForExternalEvent("DownloadCompletedAck");

    // Step 4: ...
});
```
# [JavaScript (PM4)](#tab/javascript-v4)

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

This orchestrator function can be used as-is for one-off device provisioning or it can be part of a larger orchestration. In the latter case, the parent orchestrator function can schedule instances of `DeviceProvisioningOrchestration` using the *"call-sub-orchestrator"* API.

Here is an example that shows how to run multiple orchestrator functions in parallel.

# [C# (InProc)](#tab/csharp-inproc)

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

> [!NOTE]
> The previous C# examples are for Durable Functions 2.x. For Durable Functions 1.x, you must use `DurableOrchestrationContext` instead of `IDurableOrchestrationContext`. For more information about the differences between versions, see the [Durable Functions versions](durable-functions-versions.md) article.

# [C# (Isolated)](#tab/csharp-isolated)

```csharp
[FunctionName("ProvisionNewDevices")]
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

# [JavaScript (PM3)](#tab/javascript-v3)

```javascript
const df = require("durable-functions");

module.exports = df.orchestrator(function*(context) {
    const deviceIds = yield context.df.callActivity("GetNewDeviceIds");

    // Run multiple device provisioning flows in parallel
    const provisioningTasks = [];
    var id = 0;
    for (const deviceId of deviceIds) {
        const child_id = context.df.instanceId+`:${id}`;
        const provisionTask = context.df.callSubOrchestrator("DeviceProvisioningOrchestration", deviceId, child_id);
        provisioningTasks.push(provisionTask);
        id++;
    }

    yield context.df.Task.all(provisioningTasks);

    // ...
});
```

# [JavaScript (PM4)](#tab/javascript-v4)

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

> [!NOTE]
> Sub-orchestrations must be defined in the same function app as the parent orchestration. If you need to call and wait for orchestrations in another function app, consider using the built-in support for HTTP APIs and the HTTP 202 polling consumer pattern. For more information, see the [HTTP Features](durable-functions-http-features.md) topic.

## Next steps

> [!div class="nextstepaction"]
> [Learn how to set a custom orchestration status](durable-functions-custom-orchestration-status.md)
