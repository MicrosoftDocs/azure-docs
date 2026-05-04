---
title: "Eternal Orchestrations in Durable Task"
description: "Learn how to implement eternal orchestrations in Durable Task Framework to run infinite loops without performance issues. Discover how to use continue-as-new to reset orchestration history."
author: cgillum
ms.topic: concept-article
ms.service: durable-task
ms.date: 04/23/2026
ms.author: azfuncdf
ms.devlang: csharp
# ms.devlang: csharp, javascript, python, java, powershell
zone_pivot_groups: azure-durable-approach
---

# Eternal orchestrations

::: zone pivot="durable-functions"

*Eternal orchestrations* are orchestrator functions that run indefinitely by periodically resetting their own history using the `continue-as-new` API. They're useful for aggregators, periodic background jobs, and any [Durable Functions](what-is-durable-task.md) scenario that requires an infinite loop without unbounded history growth.

Without `continue-as-new`, an orchestrator that loops forever would accumulate [orchestration history](durable-task-orchestrations.md#orchestration-history) with every scheduled task, eventually causing performance problems and excessive memory use. The eternal orchestration pattern solves this by resetting the history on each iteration.

> [!NOTE]
> Eternal orchestration code samples are available for C#, JavaScript, Python, and Java. PowerShell doesn't support `continue-as-new`.

In this article:

- [How continue-as-new works](#how-continue-as-new-works) — The reset mechanism
- [Considerations](#eternal-orchestration-considerations) — Exception behavior, incomplete tasks, and external events
- [Periodic work example](#periodic-work-example) — A cleanup loop that avoids timer overlap
- [Start an eternal orchestration](#start-an-eternal-orchestration) — Launch and singleton patterns
- [Exit from an eternal orchestration](#exit-from-an-eternal-orchestration) — Graceful stop and termination

::: zone-end

::: zone pivot="durable-task-sdks"

*Eternal orchestrations* are orchestrations that run indefinitely by periodically resetting their own history using the `continue-as-new` API. They're useful for aggregators, periodic background jobs, and any scenario that requires an infinite loop without unbounded history growth.

Without `continue-as-new`, an orchestration that loops forever would accumulate history with every scheduled task, eventually causing performance problems and excessive memory use. The eternal orchestration pattern solves this by resetting the history on each iteration.

[!INCLUDE [preview-sample-limitations](../scheduler/includes/preview-sample-limitations.md)]

In this article:

- [How continue-as-new works](#how-continue-as-new-works) — The reset mechanism
- [Considerations](#eternal-orchestration-considerations) — Exception behavior, incomplete tasks, and external events
- [Periodic work example](#periodic-work-example) — A cleanup loop that avoids timer overlap
- [Start an eternal orchestration](#start-an-eternal-orchestration) — Launch and singleton patterns
- [Exit from an eternal orchestration](#exit-from-an-eternal-orchestration) — Graceful stop and termination

::: zone-end

## How continue-as-new works

::: zone pivot="durable-functions"

Instead of using infinite loops, orchestrator functions reset their state by calling the `continue-as-new` method of the [orchestration trigger binding](../../azure-functions/durable-functions/durable-functions-bindings.md#orchestration-trigger). This method takes a JSON-serializable parameter that becomes the new input for the next orchestrator function generation.

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

+ When an unhandled exception occurs during execution, the orchestration enters a _failed_ state and execution terminates. A call to `continue-as-new` from a `finally` block does *not* restart the orchestration after an uncaught exception.

+ The results of any incomplete tasks are discarded when an orchestration calls `continue-as-new`. For example, if a timer is scheduled and then `continue-as-new` is called before the timer fires, the timer event is discarded.

+ You can optionally preserve unprocessed external events across `continue-as-new` restarts. In C#, `ContinueAsNew` preserves unprocessed events by default. In Java, `continueAsNew` also preserves events by default. In Python, `continue_as_new` doesn't preserve events unless `save_events=True`. In JavaScript, `continueAsNew` requires a `saveEvents` parameter (`true` or `false`) to control this behavior.

::: zone-end

::: zone pivot="durable-task-sdks"

Keep these considerations in mind when using the `continue-as-new` method in an orchestration:

+ When an orchestration is reset by using the `continue-as-new` method, the Durable Task SDKs maintain the same instance ID but internally create and use a new *execution ID* going forward. This execution ID isn't exposed externally, but it can be useful when debugging orchestration execution.

+ When an unhandled exception occurs during execution, the orchestration enters a _failed_ state and execution terminates. A call to `continue-as-new` from a `finally` block does *not* restart the orchestration after an uncaught exception.

+ The results of any incomplete tasks are discarded when an orchestration calls `continue-as-new`. For example, if a timer is scheduled and then `continue-as-new` is called before the timer fires, the timer event is discarded.

+ You can optionally preserve unprocessed external events across `continue-as-new` restarts. In .NET and Java, `continue-as-new` preserves unprocessed events by default. In Python, `continue_as_new` doesn't preserve events unless `save_events=True`. In JavaScript, `continueAsNew` requires a `saveEvents` parameter (`true` or `false`) to control this behavior. In all cases, unprocessed events are delivered when the orchestration next calls `waitForExternalEvent` or `wait_for_external_event`.

::: zone-end

## Periodic work example

One common use case for eternal orchestrations is periodic background work, such as cleanup jobs.

**Why not use a timer trigger?** A CRON-based timer trigger runs at fixed times regardless of whether the previous run finished. An eternal orchestration waits for the work to complete before scheduling the next iteration, so runs never overlap.

| Approach | Schedule (1-hour interval, 30-min job) | Overlap risk |
|---|---|---|
| Timer trigger (CRON) | 1:00, 2:00, 3:00 | Yes — if the job exceeds the interval |
| Eternal orchestration | 1:00, 2:30, 4:00 | No — next run waits for completion |

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

PowerShell doesn't support `continue-as-new`. For periodic work in PowerShell, use a [durable timer](durable-task-timers.md) with a [singleton orchestration](durable-task-singletons.md) instead.

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

The Durable Task SDK isn't available for PowerShell. For eternal orchestrations in PowerShell, use [Durable Functions](what-is-durable-task.md) with a [durable timer](durable-task-timers.md) and a [singleton pattern](durable-task-singletons.md).

---

::: zone-end

## Start an eternal orchestration

::: zone pivot="durable-functions"

Use the *start-new* or *schedule-new* durable client method to start an eternal orchestration, just like any other orchestration function. To ensure only one instance runs at a time, use a fixed instance ID. For more information, see [Singleton orchestrations](durable-task-singletons.md).

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

PowerShell doesn't support `continue-as-new`. For periodic work in PowerShell, use a [durable timer](durable-task-timers.md) with a [singleton orchestration](durable-task-singletons.md) instead.

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

Use the *schedule-new* client method to start an eternal orchestration, just like any other orchestration. To ensure only one instance runs at a time, use a fixed instance ID. For more information, see [Singleton orchestrations](durable-task-singletons.md).

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

The Durable Task SDK isn't available for PowerShell. For eternal orchestrations in PowerShell, use [Durable Functions](what-is-durable-task.md) with a [durable timer](durable-task-timers.md) and a [singleton pattern](durable-task-singletons.md).

---

::: zone-end

## Exit from an eternal orchestration

::: zone pivot="durable-functions"

If an orchestrator function needs to eventually complete, don't call `continue-as-new` and let the function exit.

If an orchestrator function is in an infinite loop and needs to be stopped, use the *terminate* API of the [orchestration client binding](../../azure-functions/durable-functions/durable-functions-bindings.md#orchestration-client) to stop it.

# [C#](#tab/csharp)

```csharp
await client.TerminateAsync(instanceId, "Cleanup no longer needed");
```

# [JavaScript](#tab/javascript)

```javascript
await client.terminate(instanceId, "Cleanup no longer needed");
```

# [Python](#tab/python)

```python
await client.terminate(instance_id, "Cleanup no longer needed")
```

# [PowerShell](#tab/powershell)

```powershell
Stop-DurableOrchestration -InstanceId $instanceId -Reason "Cleanup no longer needed"
```

# [Java](#tab/java)

```java
client.terminate(instanceId, "Cleanup no longer needed");
```

---

For more information, see [Instance management](durable-task-instance-management.md).

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

The Durable Task SDK isn't available for PowerShell. For eternal orchestrations in PowerShell, use [Durable Functions](what-is-durable-task.md) with a [durable timer](durable-task-timers.md) and a [singleton pattern](durable-task-singletons.md).

---

::: zone-end

## Next steps

::: zone pivot="durable-functions"

> [!div class="nextstepaction"]
> [Learn how to implement singleton orchestrations](durable-task-singletons.md)

- [Durable timers](durable-task-timers.md)
- [Instance management](durable-task-instance-management.md)
- [Durable Functions bindings](../../azure-functions/durable-functions/durable-functions-bindings.md)

::: zone-end

::: zone pivot="durable-task-sdks"

> [!div class="nextstepaction"]
> [Get started with Durable Task SDKs](../sdks/quickstart-portable-durable-task-sdks.md)

- [Singleton orchestrations](durable-task-singletons.md)
- [Durable timers](durable-task-timers.md)
- [Instance management](durable-task-instance-management.md)

::: zone-end
