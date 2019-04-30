---
title: Sub-orchestrations for Durable Functions - Azure
description: How to call orchestrations from orchestrations in the Durable Functions extension for Azure Functions.
services: functions
author: ggailey777
manager: jeconnoc
keywords:
ms.service: azure-functions
ms.devlang: multiple
ms.topic: conceptual
ms.date: 12/07/2018
ms.author: azfuncdf
---

# Sub-orchestrations in Durable Functions (Azure Functions)

In addition to calling activity functions, orchestrator functions can  call other orchestrator functions. For example, you can build a larger orchestration out of a library of orchestrator functions. Or you can run multiple instances of an orchestrator function in parallel.

An orchestrator function can call another orchestrator function by calling the [CallSubOrchestratorAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html#Microsoft_Azure_WebJobs_DurableOrchestrationContext_CallSubOrchestratorAsync_) or the [CallSubOrchestratorWithRetryAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html#Microsoft_Azure_WebJobs_DurableOrchestrationContext_CallSubOrchestratorWithRetryAsync_) methods in .NET, or the `callSubOrchestrator` or `callSubOrchestratorWithRetry` methods in JavaScript. The [Error Handling & Compensation](durable-functions-error-handling.md#automatic-retry-on-failure) article has more information on automatic retry.

Sub-orchestrator functions behave just like activity functions from the caller's perspective. They can return a value, throw an exception, and can be awaited by the parent orchestrator function.

## Example

The following example illustrates an IoT ("Internet of Things") scenario where there are multiple devices that need to be provisioned. There is a particular orchestration that needs to happen for each of the devices, which might look something like the following:

### C#

```csharp
public static async Task DeviceProvisioningOrchestration(
    [OrchestrationTrigger] DurableOrchestrationContext context)
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

### JavaScript (Functions 2.x only)

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

This orchestrator function can be used as-is for one-off device provisioning or it can be part of a larger orchestration. In the latter case, the parent orchestrator function can schedule instances of `DeviceProvisioningOrchestration` using the `CallSubOrchestratorAsync` (C#) or `callSubOrchestrator` (JavaScript) API.

Here is an example that shows how to run multiple orchestrator functions in parallel.

### C#

```csharp
[FunctionName("ProvisionNewDevices")]
public static async Task ProvisionNewDevices(
    [OrchestrationTrigger] DurableOrchestrationContext context)
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

### JavaScript (Functions 2.x only)

```javascript
const df = require("durable-functions");

module.exports = df.orchestrator(function*(context) {
    const deviceIds = yield context.df.callActivity("GetNewDeviceIds");

    // Run multiple device provisioning flows in parallel
    const provisioningTasks = [];
    for (const deviceId of deviceIds) {
        const provisionTask = context.df.callSubOrchestrator("DeviceProvisioningOrchestration", deviceId);
        provisioningTasks.push(provisionTask);
    }

    yield context.df.Task.all(provisioningTasks);

    // ...
});
```

## Next steps

> [!div class="nextstepaction"]
> [Learn what task hubs are and how to configure them](durable-functions-task-hubs.md)
