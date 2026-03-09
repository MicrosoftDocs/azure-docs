---
title: Eternal orchestrations
description: Learn how to implement eternal orchestrations
author: cgillum
ms.topic: conceptual
ms.date: 01/28/2026
ms.author: azfuncdf
ms.devlang: csharp
# ms.devlang: csharp, javascript, python, java
zone_pivot_groups: azure-durable-approach
---

# Eternal orchestrations

::: zone pivot="durable-functions"

*Eternal orchestrations* are orchestrator functions that never end. They're useful when you want to use [Durable Functions](what-is-durable-task.md) for aggregators, and any scenario that requires an infinite loop.

::: zone-end

::: zone pivot="durable-task-sdks"

*Eternal orchestrations* are orchestrations that never end. They're useful when you want to use durable orchestrations for aggregators and any scenario that requires an infinite loop.

[!INCLUDE [preview-sample-limitations](./durable-task-scheduler/includes/preview-sample-limitations.md)]

::: zone-end

## Orchestration history

::: zone pivot="durable-functions"

As explained in the [orchestration history](durable-functions-orchestrations.md#orchestration-history) topic, the Durable Task Framework keeps track of the history of each function orchestration. This history grows continuously as long as the orchestrator function schedules new work. If the orchestrator function goes into an infinite loop and continuously schedules work, the history can grow critically large and cause significant performance problems. The *eternal orchestration* concept was designed to mitigate these kinds of problems for applications that need infinite loops.

::: zone-end

::: zone pivot="durable-task-sdks"

The Durable Task SDKs keep track of the history of each orchestration. This history grows continuously as long as the orchestration schedules new work. If the orchestration goes into an infinite loop and continuously schedules work, the history can grow critically large and cause significant performance problems. The *eternal orchestration* concept was designed to mitigate these kinds of problems for applications that need infinite loops.

::: zone-end

## Resetting and restarting

::: zone pivot="durable-functions"

Instead of using infinite loops, orchestrator functions reset their state by calling the `continue-as-new` method of the [orchestration trigger binding](durable-functions-bindings.md#orchestration-trigger). This method takes a JSON-serializable parameter that becomes the new input for the next orchestrator function generation.

When you call `continue-as-new`, the orchestration instance restarts itself with the new input value. The same instance ID is kept, but the orchestrator function's history resets.

::: zone-end

::: zone pivot="durable-task-sdks"

Instead of using infinite loops, orchestrations reset their state by calling the `continue-as-new` method on the orchestration context. This method takes a JSON-serializable parameter that becomes the new input for the next orchestration generation.

When you call `continue-as-new`, the orchestration instance restarts itself with the new input value. The same instance ID is kept, but the orchestration's history resets.

::: zone-end

## Eternal orchestration considerations

::: zone pivot="durable-functions"

Keep these considerations in mind when using the `continue-as-new` method in an orchestration:

+ When an orchestrator function is reset by using the `continue-as-new` method, the Durable Task Framework maintains the same instance ID but internally creates and uses a new *execution ID* going forward. This execution ID isn't exposed externally, but it's useful when debugging orchestration execution.

+ When an unhandled exception occurs during execution, the orchestration enters a _failed_ state and execution terminates. In this state, a call to `continue-as-new` from the `finally` block of a try-catch statement can't restart the orchestration. 

> [!IMPORTANT]
> If the orchestration encounters an uncaught exception during execution, the orchestration enters a "failed" state and execution completes. In particular, this means that a call to *continue-as-new*, even in a `finally` block, does *not* restart the orchestration in the case of an uncaught exception.

::: zone-end

::: zone pivot="durable-task-sdks"

Keep these considerations in mind when using the `continue-as-new` method in an orchestration:

+ When an orchestration is reset by using the `continue-as-new` method, the Durable Task SDKs maintain the same instance ID but internally create and use a new *execution ID* going forward. This execution ID isn't exposed externally, but it can be useful when debugging orchestration execution.

+ When an unhandled exception occurs during execution, the orchestration enters a _failed_ state and execution terminates. In this state, a call to `continue-as-new` from the `finally` block of a try-catch statement can't restart the orchestration. 

+ The results of any incomplete tasks are discarded when an orchestration calls `continue-as-new`. For example, if a timer is scheduled and then `continue-as-new` is called before the timer fires, the timer event is discarded.

+ You can optionally preserve unprocessed external events across `continue-as-new` restarts. In .NET and Java, `continue-as-new` preserves unprocessed events by default. In Python, `continue_as_new` doesn't preserve events unless `save_events=True`. In JavaScript, `continueAsNew` requires a `saveEvents` parameter (`true` or `false`) to control this behavior. In all cases, unprocessed events are delivered when the orchestration next calls `waitForExternalEvent` or `wait_for_external_event`.

> [!IMPORTANT]
> If the orchestration encounters an uncaught exception during execution, the orchestration enters a "failed" state and execution completes. In particular, this means that a call to *continue-as-new*, even in a `finally` block, does *not* restart the orchestration in the case of an uncaught exception.

::: zone-end

## Periodic work example

One use case for eternal orchestrations is code that does periodic work indefinitely.

::: zone pivot="durable-functions"

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

PowerShell doesn't support `continue-as-new`.

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

The difference between this example and a timer-triggered function is that cleanup trigger times aren't based on a schedule. For example, a CRON schedule that runs a function every hour runs at 1:00, 2:00, 3:00, and so on, and could potentially run into overlap issues. In this example, if the cleanup takes 30 minutes, then it schedules at 1:00, 2:30, 4:00, and so on, and there's no chance of overlap.

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

```csharp
public class PeriodicCleanupLoop : TaskOrchestrator<object?, object?>
{
    public override async Task<object?> RunAsync(TaskOrchestrationContext context, object? input)
    {
        await context.CallActivityAsync("DoCleanup");

        // sleep for one hour between cleanups
        await context.CreateTimer(TimeSpan.FromHours(1), CancellationToken.None);

        context.ContinueAsNew(null);
        return null;
    }
}
```

# [Python](#tab/python)

```python
from datetime import timedelta
from durabletask import task

def do_cleanup(ctx: task.ActivityContext, _) -> None:
    # Cleanup logic here
    pass

def periodic_cleanup_loop(ctx: task.OrchestrationContext, _):
    yield ctx.call_activity(do_cleanup)

    # sleep for one hour between cleanups
    yield ctx.create_timer(timedelta(hours=1))

    ctx.continue_as_new(None)
```

# [Java](#tab/java)

```java
public class PeriodicCleanupLoop implements TaskOrchestration {
    @Override
    public void run(TaskOrchestrationContext ctx) {
        ctx.callActivity("DoCleanup").await();

        // sleep for one hour between cleanups
        ctx.createTimer(Duration.ofHours(1)).await();

        ctx.continueAsNew(null);
    }
}
```

# [JavaScript](#tab/javascript)

```typescript
import { ActivityContext, OrchestrationContext, TOrchestrator } from "@microsoft/durabletask-js";

const doCleanup = async (_: ActivityContext, _input: void): Promise<void> => {
    // Cleanup logic here
};

const periodicCleanupLoop: TOrchestrator = async function* (ctx: OrchestrationContext): any {
    yield ctx.callActivity(doCleanup);

    // sleep for one hour between cleanups
    yield ctx.createTimer(60 * 60);

    ctx.continueAsNew(null, false);
};
```

# [PowerShell](#tab/powershell)

The Durable Task SDK isn't available for PowerShell. Use [Durable Functions](what-is-durable-task.md) instead.

---

The difference between this example and a timer-based approach is that cleanup trigger times aren't based on a schedule. For example, a schedule that runs every hour runs at 1:00, 2:00, 3:00, and so on, and could potentially run into overlap issues. In this example, if the cleanup takes 30 minutes, then it schedules at 1:00, 2:30, 4:00, and so on, and there's no chance of overlap.

::: zone-end

## Start an eternal orchestration

::: zone pivot="durable-functions"

Use the *start-new* or *schedule-new* durable client method to start an eternal orchestration, just like you would for any other orchestration function.  

> [!NOTE]
> If you need to ensure a singleton eternal orchestration is running, maintain the same instance `id` when starting the orchestration. For more information, see [Instance management](durable-functions-instance-management.md).

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
> The previous code is for Durable Functions 2.x. For Durable Functions 1.x, use the `OrchestrationClient` attribute instead of the `DurableClient` attribute, and use the `DurableOrchestrationClient` parameter type instead of `IDurableOrchestrationClient`. For more information about the differences between versions, see [Durable Functions versions](durable-functions-versions.md).

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

::: zone-end

::: zone pivot="durable-task-sdks"

Use the *schedule-new* client method to start an eternal orchestration, just like you would for any other orchestration.

> [!NOTE]
> If you need to ensure a singleton eternal orchestration is running, maintain the same instance `id` when starting the orchestration.

# [C#](#tab/csharp)

```csharp
string instanceId = "StaticId";
await client.ScheduleNewOrchestrationInstanceAsync(
    "PeriodicCleanupLoop",
    null,
    new StartOrchestrationOptions { InstanceId = instanceId });
```

# [Python](#tab/python)

```python
instance_id = "StaticId"
client.schedule_new_orchestration(periodic_cleanup_loop, instance_id=instance_id)
```

# [Java](#tab/java)

```java
String instanceId = "StaticId";
client.scheduleNewOrchestrationInstance("PeriodicCleanupLoop", null, instanceId);
```

# [JavaScript](#tab/javascript)

```typescript
const instanceId = "StaticId";
await client.scheduleNewOrchestration(periodicCleanupLoop, undefined, instanceId);
```

# [PowerShell](#tab/powershell)

The Durable Task SDK is not available for PowerShell. Use [Durable Functions](what-is-durable-task.md) instead.

---

::: zone-end

## Exit from an eternal orchestration

::: zone pivot="durable-functions"

If an orchestrator function needs to eventually complete, don't call `ContinueAsNew` and let the function exit.

If an orchestrator function is in an infinite loop and needs to be stopped, use the *terminate* API of the [orchestration client binding](durable-functions-bindings.md#orchestration-client) to stop it. For more information, see [Instance management](durable-functions-instance-management.md).

::: zone-end

::: zone pivot="durable-task-sdks"

If an orchestration needs to eventually complete, don't call `continue-as-new` and let the orchestration exit.

If an orchestration is in an infinite loop and needs to be stopped, use the *terminate* API on the durable task client to stop it.

# [C#](#tab/csharp)

```csharp
await client.TerminateInstanceAsync(instanceId, "Cleanup no longer needed");
```

# [Python](#tab/python)

```python
client.terminate_orchestration(instance_id, output="Cleanup no longer needed")
```

# [Java](#tab/java)

```java
client.terminate(instanceId, "Cleanup no longer needed");
```

# [JavaScript](#tab/javascript)

```typescript
await client.terminateOrchestration(instanceId, "Cleanup no longer needed");
```

# [PowerShell](#tab/powershell)

The Durable Task SDK is not available for PowerShell. Use [Durable Functions](what-is-durable-task.md) instead.

---

::: zone-end

## Next steps

::: zone pivot="durable-functions"

> [!div class="nextstepaction"]
> [Learn how to implement singleton orchestrations](durable-functions-singletons.md)

::: zone-end

::: zone pivot="durable-task-sdks"

> [!div class="nextstepaction"]
> [Get started with Durable Task SDKs](durable-task-scheduler/quickstart-portable-durable-task-sdks.md)

::: zone-end
