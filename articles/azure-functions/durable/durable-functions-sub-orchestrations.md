---
title: Sub-orchestrations for Durable Functions - Azure
description: How to call orchestrations from orchestrations in the Durable Functions extension for Azure Functions.
ms.topic: conceptual
ms.date: 11/03/2019
ms.author: azfuncdf
---

# Sub-orchestrations in Durable Functions (Azure Functions)

In addition to calling activity functions, orchestrator functions can call other orchestrator functions. For example, you can build a larger orchestration out of a library of smaller orchestrator functions. Or you can run multiple instances of an orchestrator function in parallel.

An orchestrator function can call another orchestrator function using the `CallSubOrchestratorAsync` or the `CallSubOrchestratorWithRetryAsync` methods in .NET, or the `callSubOrchestrator` or `callSubOrchestratorWithRetry` methods in JavaScript. The [Error Handling & Compensation](durable-functions-error-handling.md#automatic-retry-on-failure) article has more information on automatic retry.

Sub-orchestrator functions behave just like activity functions from the caller's perspective. They can return a value, throw an exception, and can be awaited by the parent orchestrator function. 

> [!NOTE]
> Sub-orchestrations are currently supported in .NET and JavaScript.

## Example

The following example illustrates an IoT ("Internet of Things") scenario where there are multiple devices that need to be provisioned. The following function represents the provisioning workflow that needs to be executed for each device:

# [C#](#tab/csharp)

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

# [JavaScript](#tab/javascript)

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

---

This orchestrator function can be used as-is for one-off device provisioning or it can be part of a larger orchestration. In the latter case, the parent orchestrator function can schedule instances of `DeviceProvisioningOrchestration` using the `CallSubOrchestratorAsync` (.NET) or `callSubOrchestrator` (JavaScript) API.

Here is an example that shows how to run multiple orchestrator functions in parallel.

# [C#](#tab/csharp)

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

# [JavaScript](#tab/javascript)

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

---

> [!NOTE]
> Sub-orchestrations must be defined in the same function app as the parent orchestration. If you need to call and wait for orchestrations in another function app, consider using the built-in support for HTTP APIs and the HTTP 202 polling consumer pattern. For more information, see the [HTTP Features](durable-functions-http-features.md) topic.

## Next steps

> [!div class="nextstepaction"]
> [Learn how to set a custom orchestration status](durable-functions-custom-orchestration-status.md)
