---
title: Overview of function types and features for Durable Functions  - Azure
description: Learn the types of functions and roles that allow for function-to-function communication as part of a durable function orchestration.
services: functions
author: jeffhollan
manager: jeconnoc
keywords:
ms.service: azure-functions
ms.devlang: multiple
ms.topic: conceptual
ms.date: 07/04/2018
ms.author: azfuncdf
---

# Overview of function types and features for Durable Functions (Azure Functions)

Azure Durable Functions provides stateful orchestration of function execution.  A durable function is a solution made up of different Azure Functions.  Each of these functions can play different roles as part of an orchestration.  The following document provides an overview of the types of functions involved in a durable function orchestration.  It also includes some common patterns in connecting functions together.  

![Types of durable functions][1]  

## Types of functions

### Activity functions

Activity functions are the basic unit of work in a durable orchestration.  Activity functions are the functions and tasks being orchestrated in the process.  For example, you may create a durable function to process an order - check the inventory, charge the customer, and create a shipment.  Each one of those tasks would be an activity function.  Activity functions don't have any restrictions in the type of work you can do in them.  They can be written in any language supported by Azure Functions.  The durable task framework guarantees that each called activity function will be executed at least once during an orchestration.

An activity function must be triggered by an [activity trigger](durable-functions-bindings.md#activity-triggers).  This function will receive a [DurableActivityContext](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableActivityContext.html) as a parameter. You can also bind the trigger to any other object to pass in inputs to the function.  Your activity function can also return values back to the orchestrator.  If sending or returning many values from an activity function, you can [leverage tuples or arrays](durable-functions-bindings.md#passing-multiple-parameters).  Activity functions can only be triggered from an orchestration instance.  While some code may be shared between an activity function and another function (like an HTTP triggered function), each function can only have one trigger.

More information and examples can be found in the [Durable Functions binding article](durable-functions-bindings.md#activity-triggers).

### Orchestrator functions

Orchestrator functions are the heart of a durable function.  Orchestrator functions describe the way and order actions are executed.  Orchestrator functions describe the orchestration in code (C# or JavaScript) as shown in the [durable functions overview](durable-functions-overview.md).  An orchestration can have many different types of actions, like [activity Functions](#activity-functions), [sub-orchestrations](#sub-orchestrations), [waiting for external events](#external-events), and [timers](#durable-timers).  

An orchestrator function must be triggered by an [orchestration trigger](durable-functions-bindings.md#orchestration-triggers).

An orchestrator is started by an [orchestrator client](#client-functions) which could itself be triggered from any source (HTTP, queues, event streams).  Each instance of an orchestration has an instance identifier, which can be auto-generated (recommended) or user-generated.  This identifier can be used to [manage instances](durable-functions-instance-management.md) of the orchestration.

More information and examples can be found in the [Durable Functions binding article](durable-functions-bindings.md#orchestration-triggers).

### Client functions

Client functions are the triggered functions that will create new instances of an orchestration.  They are the entry point for creating an instance of a durable orchestration.  Client functions can be triggered by any trigger (HTTP, queues, event streams, etc.) and written in any language supported by the app.  In addition to the trigger, client functions have an [orchestration client](durable-functions-bindings.md#orchestration-client) binding that allows them to create and manage durable orchestrations.  The most basic example of a client function is an HTTP triggered function that starts an orchestrator function and returns a check status response as [shown in this following example](durable-functions-http-api.md#http-api-url-discovery).

More information and examples can be found in the [Durable Functions binding article](durable-functions-bindings.md#orchestration-client).

## Features and patterns

### Sub-orchestrations

In addition to calling activity functions, orchestrator functions can call other orchestrator functions. For example, you can build a larger orchestration out of a library of orchestrator functions. Or you can run multiple instances of an orchestrator function in parallel.

More information and examples can be found in the [sub-orchestration article](durable-functions-sub-orchestrations.md).

### Durable timers

[Durable Functions](durable-functions-overview.md) provides *durable timers* for use in orchestrator functions to implement delays or to set up timeouts on async actions. Durable timers should be used in orchestrator functions instead of `Thread.Sleep` and `Task.Delay` (C#), or `setTimeout()` and `setInterval()` (JavaScript).

More information and examples of durable timers can be found in the [durable timers article](durable-functions-timers.md)

### External events

Orchestrator functions can wait for external events to update an orchestration instance. This feature of Durable Functions is often useful for handling human interaction or other external callbacks.

More information and examples can be found in the [external events article](durable-functions-external-events.md).

### Error handling

Durable Function orchestrations are implemented in code and can use the error-handling features of the programming language.  This means patterns like "try/catch" will work in your orchestration.  Durable functions also come with some built-in retry policies.  An action can delay and retry activities automatically on exceptions.  Retries allow you to handle transient exceptions without having to abandon the orchestration.

More information and examples can be found in the [error handling article](durable-functions-error-handling.md).

### Cross-function app communication

While a durable orchestration generally lives within a context of a single function app, there are patterns to enable you to coordinate orchestrations across many function apps.  Even though cross-app communication may be happening over HTTP, using the durable framework for each activity means you can still maintain a durable process across two apps.

An example of a cross-function app orchestration in C# is provided below.  One activity will start the external orchestration. Another activity will then retrieve and return the status.  The orchestrator will wait for the status to be complete before continuing.

```csharp
[FunctionName("OrchestratorA")]
public static async Task RunRemoteOrchestrator(
    [OrchestrationTrigger] DurableOrchestrationContext context)
{
    // Do some work...

    // Call a remote orchestration
    string statusUrl = await context.CallActivityAsync<string>(
        "StartRemoteOrchestration", "OrchestratorB");

    // Wait for the remote orchestration to complete
    while (true)
    {
        bool isComplete = await context.CallActivityAsync<bool>("CheckIsComplete", statusUrl);
        if (isComplete)
        {
            break;
        }

        await context.CreateTimer(context.CurrentUtcDateTime.AddMinutes(1), CancellationToken.None);
    }

    // B is done. Now go do more work...
}

[FunctionName("StartRemoteOrchestration")]
public static async Task<string> StartRemoteOrchestration([ActivityTrigger] string orchestratorName)
{
    using (var response = await HttpClient.PostAsync(
        $"https://appB.azurewebsites.net/orchestrations/{orchestratorName}",
        new StringContent("")))
    {
        string statusUrl = await response.Content.ReadAsAsync<string>();
        return statusUrl;
    }
}

[FunctionName("CheckIsComplete")]
public static async Task<bool> CheckIsComplete([ActivityTrigger] string statusUrl)
{
    using (var response = await HttpClient.GetAsync(statusUrl))
    {
        // 200 = Complete, 202 = Running
        return response.StatusCode == HttpStatusCode.OK;
    }
}
```

## Next steps

> [!div class="nextstepaction"]
> [Continue reading Durable Functions documentation](durable-functions-bindings.md)

> [!div class="nextstepaction"]
> [Install the Durable Functions extension and samples](durable-functions-install.md)

<!-- Media references -->
[1]: media/durable-functions-types-features-overview/durable-concepts.png
