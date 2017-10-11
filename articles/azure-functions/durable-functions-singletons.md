---
title: Singletons for Durable Functions - Azure
description: How to use singletons in the Durable Functons extension for Azure Functions.
services: functions
author: cgillum
manager: cfowler
editor: ''
tags: ''
keywords:
ms.service: functions
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 09/29/2017
ms.author: azfuncdf
---

# Singleton orchestrators in Durable Functions (Azure Functions)

For background jobs or actor-style orchestrations, you often need to ensure that only one instance of a particular orchestrator runs at a time. This can be done in [Durable Functions](durable-functions-overview.md) by assigning a specific instance ID to an orchestrator when creating it.

## Singleton example

The following C# example shows an HTTP-trigger function that creates a singleton background job orchestration. It uses a well-known instance ID to ensure that only one instance exists.

```cs
[FunctionName("EnsureSingletonTrigger")]
public static async Task<HttpResponseMessage> Ensure(
    [HttpTrigger(AuthorizationLevel.Function, methods: "post")] HttpRequestMessage req,
    [OrchestrationClient] DurableOrchestrationClient starter,
    TraceWriter log)
{
    // Ensure only one instance is ever running at a time
    const string OrchestratorName = "MySingletonOrchestrator";
    const string InstanceId = "MySingletonInstanceId";

    var existingInstance = await starter.GetStatusAsync(InstanceId);
    if (existingInstance == null)
    {
        log.Info($"Creating singleton instance with ID = {InstanceId}...");
        await starter.StartNewAsync(OrchestratorName, InstanceId, input: null);
    }

    return starter.CreateCheckStatusResponse(req, InstanceId);
}
```

By default, instance IDs are randomly generated GUIDs. But notice in this case the trigger function uses a predefined `InstanceId` variable with a value of `MySingletonInstanceId` to pre-assign an instance ID to the orchestrator function. This allows the trigger to check and see whether the well-known instance is already running by calling [GetStatusAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html#Microsoft_Azure_WebJobs_DurableOrchestrationContext_GetStatusAsync_).

The implementation details of the orchestrator function do not actually matter. It could be a regular orchestrator function that starts and completes, or it could be one that runs forever (that is, an [Eternal Orchestration](durable-functions-eternal-orchestrations.md)). The important point is that there is only ever one instance running at a time.

> [!NOTE]
> If the singleton orchestration instance terminates, fails, or completes, it will not be possible to recreate it using the same ID. In those cases, you should be prepared to recreate it using a new instance ID.

## Next steps

> [!div class="nextstepaction"]
> [Learn how to call sub-orchestrations](durable-functions-sub-orchestrations.md)

> [!div class="nextstepaction"]
> [Run a sample singleton](durable-functions-counter.md)
