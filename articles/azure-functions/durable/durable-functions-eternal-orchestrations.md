---
title: Eternal orchestrations in Durable Functions - Azure
description: Learn how to implement eternal orchestrations by using the Durable Functions extension for Azure Functions.
author: cgillum
ms.topic: conceptual
ms.date: 12/07/2022
ms.author: azfuncdf
ms.devlang: csharp, javascript, python, java
---

# Eternal orchestrations in Durable Functions (Azure Functions)

*Eternal orchestrations* are orchestrator functions that never end. They are useful when you want to use [Durable Functions](durable-functions-overview.md) for aggregators and any scenario that requires an infinite loop.

## Orchestration history

As explained in the [orchestration history](durable-functions-orchestrations.md#orchestration-history) topic, the Durable Task Framework keeps track of the history of each function orchestration. This history grows continuously as long as the orchestrator function continues to schedule new work. If the orchestrator function goes into an infinite loop and continuously schedules work, this history could grow critically large and cause significant performance problems. The *eternal orchestration* concept was designed to mitigate these kinds of problems for applications that need infinite loops.

## Resetting and restarting

Instead of using infinite loops, orchestrator functions reset their state by calling the *continue-as-new* method of the [orchestration trigger binding](durable-functions-bindings.md#orchestration-trigger). This method takes a JSON-serializable parameter, which becomes the new input for the next orchestrator function generation.

When *continue-as-new* is called, the orchestration instance restarts itself with the new input value. The same instance ID is kept, but the orchestrator function's history is reset.

> [!NOTE]
> The Durable Task Framework maintains the same instance ID but internally creates a new *execution ID* for the orchestrator function that gets reset by *continue-as-new*. This execution ID is not exposed externally, but it may be useful to know about when debugging orchestration execution.

## Periodic work example

One use case for eternal orchestrations is code that needs to do periodic work indefinitely.

# [C#](#tab/csharp)

```csharp
[FunctionName("Periodic_Cleanup_Loop")]
public static async Task Run(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
{
    await context.CallActivityAsync("DoCleanup", null);

    // sleep for one hour between cleanups
    DateTime nextCleanup = context.CurrentUtcDateTime.AddHours(1);
    await context.CreateTimer(nextCleanup, CancellationToken.None);

    context.ContinueAsNew(null);
}
```

> [!NOTE]
> The previous C# example is for Durable Functions 2.x. For Durable Functions 1.x, you must use `DurableOrchestrationContext` instead of `IDurableOrchestrationContext`. For more information about the differences between versions, see the [Durable Functions versions](durable-functions-versions.md) article.

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");
const moment = require("moment");

module.exports = df.orchestrator(function*(context) {
    yield context.df.callActivity("DoCleanup");

    // sleep for one hour between cleanups
    const nextCleanup = moment.utc(context.df.currentUtcDateTime).add(1, "h");
    yield context.df.createTimer(nextCleanup.toDate());

    yield context.df.continueAsNew(undefined);
});
```

# [Python](#tab/python)

```python
import azure.functions as func
import azure.durable_functions as df
from datetime import datetime, timedelta

def orchestrator_function(context: df.DurableOrchestrationContext):
    yield context.call_activity("DoCleanup")

    # sleep for one hour between cleanups
    next_cleanup = context.current_utc_datetime + timedelta(hours = 1)
    yield context.create_timer(next_cleanup)

    context.continue_as_new(None)

main = df.Orchestrator.create(orchestrator_function)
```

# [PowerShell](#tab/powershell)

PowerShell doesn't support *continue-as-new*.

# [Java](#tab/java)

```java
@FunctionName("Periodic_Cleanup_Loop")
public void periodicCleanupLoop(
        @DurableOrchestrationTrigger(name = "ctx") TaskOrchestrationContext ctx) {
    ctx.callActivity("DoCleanup").await();

    ctx.createTimer(Duration.ofHours(1)).await();

    ctx.continueAsNew(null);
}
```

---

The difference between this example and a timer-triggered function is that cleanup trigger times here are not based on a schedule. For example, a CRON schedule that executes a function every hour will execute it at 1:00, 2:00, 3:00 etc. and could potentially run into overlap issues. In this example, however, if the cleanup takes 30 minutes, then it will be scheduled at 1:00, 2:30, 4:00, etc. and there is no chance of overlap.

## Starting an eternal orchestration

Use the *start-new* or *schedule-new* durable client method to start an eternal orchestration, just like you would any other orchestration function.  

> [!NOTE]
> If you need to ensure a singleton eternal orchestration is running, it's important to maintain the same instance `id` when starting the orchestration. For more information, see [Instance Management](durable-functions-instance-management.md).

# [C#](#tab/csharp)

```csharp
[FunctionName("Trigger_Eternal_Orchestration")]
public static async Task<HttpResponseMessage> OrchestrationTrigger(
    [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequestMessage request,
    [DurableClient] IDurableOrchestrationClient client)
{
    string instanceId = "StaticId";

    await client.StartNewAsync("Periodic_Cleanup_Loop", instanceId); 
    return client.CreateCheckStatusResponse(request, instanceId);
}
```

> [!NOTE]
> The previous code is for Durable Functions 2.x. For Durable Functions 1.x, you must use `OrchestrationClient` attribute instead of the `DurableClient` attribute, and you must use the `DurableOrchestrationClient` parameter type instead of `IDurableOrchestrationClient`. For more information about the differences between versions, see the [Durable Functions versions](durable-functions-versions.md) article.

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

module.exports = async function (context, req) {
    const client = df.getClient(context);
    const instanceId = "StaticId";
    
    // null is used as the input, since there is no input in "Periodic_Cleanup_Loop".
    await client.startNew("Periodic_Cleanup_Loop", instanceId, null);

    context.log(`Started orchestration with ID = '${instanceId}'.`);
    return client.createCheckStatusResponse(context.bindingData.req, instanceId);
};
```

# [Python](#tab/python)

```python
async def main(req: func.HttpRequest, starter: str) -> func.HttpResponse:
    client = df.DurableOrchestrationClient(starter)
    instance_id = 'StaticId'

    await client.start_new('Periodic_Cleanup_Loop', instance_id, None)

    logging.info(f"Started orchestration with ID = '{instance_id}'.")
    return client.create_check_status_response(req, instance_id)

```

# [PowerShell](#tab/powershell)

PowerShell doesn't support *continue-as-new*.

# [Java](#tab/java)

```java
@FunctionName("Trigger_Eternal_Orchestration")
public HttpResponseMessage triggerEternalOrchestration(
        @HttpTrigger(name = "req") HttpRequestMessage<?> req,
        @DurableClientInput(name = "durableContext") DurableClientContext durableContext) {

    String instanceID = "StaticID";
    DurableTaskClient client = durableContext.getClient();
    client.scheduleNewOrchestrationInstance("Periodic_Cleanup_Loop", null, instanceID);
    return durableContext.createCheckStatusResponse(req, instanceID);
}
```

---

## Exit from an eternal orchestration

If an orchestrator function needs to eventually complete, then all you need to do is *not* call `ContinueAsNew` and let the function exit.

If an orchestrator function is in an infinite loop and needs to be stopped, use the *terminate* API of the [orchestration client binding](durable-functions-bindings.md#orchestration-client) to stop it. For more information, see [Instance Management](durable-functions-instance-management.md).

## Next steps

> [!div class="nextstepaction"]
> [Learn how to implement singleton orchestrations](durable-functions-singletons.md)
