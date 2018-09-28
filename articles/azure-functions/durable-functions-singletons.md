---
title: Singletons for Durable Functions - Azure
description: How to use singletons in the Durable Functons extension for Azure Functions.
services: functions
author: cgillum
manager: jeconnoc
keywords:
ms.service: azure-functions
ms.devlang: multiple
ms.topic: conceptual
ms.date: 09/29/2017
ms.author: azfuncdf
---

# Singleton orchestrators in Durable Functions (Azure Functions)

For background jobs or actor-style orchestrations, you often need to ensure that only one instance of a particular orchestrator runs at a time. This can be done in [Durable Functions](durable-functions-overview.md) by assigning a specific instance ID to an orchestrator when creating it.

## Singleton example

The following C# example shows an HTTP-trigger function that creates a singleton background job orchestration. The code ensures that only one instance exists for a specified instance ID.

```cs
[FunctionName("HttpStartSingle")]
public static async Task<HttpResponseMessage> RunSingle(
    [HttpTrigger(AuthorizationLevel.Function, methods: "post", Route = "orchestrators/{functionName}/{instanceId}")] HttpRequestMessage req,
    [OrchestrationClient] DurableOrchestrationClient starter,
    string functionName,
    string instanceId,
    TraceWriter log)
{
    // Check if an instance with the specified ID already exists.
    var existingInstance = await starter.GetStatusAsync(instanceId);
    if (existingInstance == null)
    {
        // An instance with the specified ID doesn't exist, create one.
        dynamic eventData = await req.Content.ReadAsAsync<object>();
        await starter.StartNewAsync(functionName, instanceId, eventData);
        log.Info($"Started orchestration with ID = '{instanceId}'.");
        return starter.CreateCheckStatusResponse(req, instanceId);
    }
    else
    {
        // An instance with the specified ID exists, don't create one.
        return req.CreateErrorResponse(
            HttpStatusCode.Conflict,
            $"An instance with ID '{instanceId}' already exists.");
    }
}
```

By default, instance IDs are randomly generated GUIDs. But in this case, the instance ID is passed in route data from the URL. The code calls [GetStatusAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html#Microsoft_Azure_WebJobs_DurableOrchestrationContext_GetStatusAsync_) to check if an instance having the specified ID is already running. If not, an instance is created with that ID.

> [!NOTE]
> There is a potential race condition in this sample. If two instances of **HttpStartSingle** execute concurrently, the result could be two different created instances of the singleton, one which overwrites the other. Depending on your requirements, this may have undesirable side effects. For this reason, it is important to ensure that no two requests can execute this trigger function concurrently.

The implementation details of the orchestrator function do not actually matter. It could be a regular orchestrator function that starts and completes, or it could be one that runs forever (that is, an [Eternal Orchestration](durable-functions-eternal-orchestrations.md)). The important point is that there is only ever one instance running at a time.

## Next steps

> [!div class="nextstepaction"]
> [Learn how to call sub-orchestrations](durable-functions-sub-orchestrations.md)
