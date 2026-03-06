---
title: Handling external events
description: Learn how to handle external events
ms.topic: conceptual
ms.date: 01/28/2026
ms.author: azfuncdf
# ms.devlang: csharp, javascript, powershell, python, java
zone_pivot_groups: azure-durable-approach
---

# Handling external events

::: zone pivot="durable-functions"
Orchestrator functions can wait and listen for external events. This feature of [Durable Functions](what-is-durable-task.md) is often useful for handling human interaction or other external triggers.

> [!NOTE]
> External events are one-way asynchronous operations. They aren't suitable for situations where the client sending the event needs a synchronous response from the orchestrator function.
::: zone-end

::: zone pivot="durable-task-sdks"
Orchestrations can wait and listen for external events. This feature is often useful for handling human interaction or other external triggers.

> [!NOTE]
> External events are one-way asynchronous operations. They aren't suitable for situations where the client sending the event needs a synchronous response from the orchestration.

[!INCLUDE [preview-sample-limitations](./durable-task-scheduler/includes/preview-sample-limitations.md)]

::: zone-end

## Wait for events

::: zone pivot="durable-functions"
The *"wait-for-external-event"* API of the [orchestration trigger binding](durable-functions-bindings.md#orchestration-trigger) allows an orchestrator function to asynchronously wait and listen for an event delivered by an external client. The listening orchestrator function declares the *name* of the event and the *shape of the data* it expects to receive.
::: zone-end

::: zone pivot="durable-task-sdks"
The *"wait-for-external-event"* API allows an orchestration to asynchronously wait and listen for an event delivered by an external client. The listening orchestration declares the *name* of the event and the *shape of the data* it expects to receive.
::: zone-end

::: zone pivot="durable-functions"

# [C#](#tab/csharp)

**Isolated worker model**

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.DurableTask;
using Microsoft.Extensions.Logging;

public class BudgetApproval
{
    private readonly ILogger _logger;

    public BudgetApproval(ILoggerFactory loggerFactory)
    {
        _logger = loggerFactory.CreateLogger<BudgetApproval>();
    }

    [Function("BudgetApproval")]
    public async Task Run(
        [OrchestrationTrigger] TaskOrchestrationContext context)
    {
        bool approved = await context.WaitForExternalEventAsync<bool>("Approval");
        if (approved)
        {
            // approval granted - do the approved action
        }
        else
        {
            // approval denied - send a notification
        }
    }
}
```

**In-process model**

```csharp
[FunctionName("BudgetApproval")]
public static async Task Run(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
{
    bool approved = await context.WaitForExternalEvent<bool>("Approval");
    if (approved)
    {
        // approval granted - do the approved action
    }
    else
    {
        // approval denied - send a notification
    }
}
```

> [!NOTE]
> If you're using Durable Functions 1.x, use `DurableOrchestrationContext` instead of `IDurableOrchestrationContext`. Check out the [Durable Functions versions](durable-functions-versions.md) article for more version-specific details.

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

module.exports = df.orchestrator(function*(context) {
    const approved = yield context.df.waitForExternalEvent("Approval");
    if (approved) {
        // approval granted - do the approved action
    } else {
        // approval denied - send a notification
    }
});
```

# [Python](#tab/python)

```python
import azure.functions as func
import azure.durable_functions as df

def orchestrator_function(context: df.DurableOrchestrationContext):
    approved = yield context.wait_for_external_event('Approval')
    if approved:
        # approval granted - do the approved action
    else:
        # approval denied - send a notification

main = df.Orchestrator.create(orchestrator_function)
```

# [Java](#tab/java)

```java
@FunctionName("WaitForExternalEvent")
public void waitForExternalEvent(
        @DurableOrchestrationTrigger(name = "ctx") TaskOrchestrationContext ctx) {
    boolean approved = ctx.waitForExternalEvent("Approval", boolean.class).await();
    if (approved) {
        // approval granted - do the approved action
    } else {
        // approval denied - send a notification
    }
}
```

# [PowerShell](#tab/powershell)

```powershell
param($Context)

$approved = Start-DurableExternalEventListener -EventName "Approval"

if ($approved) {
    # approval granted - do the approved action
} else {
    # approval denied - send a notification
}
```

---

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

```csharp
public class BudgetApproval : TaskOrchestrator<object?, bool>
{
    public override async Task<bool> RunAsync(TaskOrchestrationContext context, object? input)
    {
        bool approved = await context.WaitForExternalEvent<bool>("Approval");
        if (approved)
        {
            // approval granted - do the approved action
        }
        else
        {
            // approval denied - send a notification
        }
        return approved;
    }
}
```

# [Python](#tab/python)

```python
from durabletask import task

def budget_approval(ctx: task.OrchestrationContext, _):
    approved = yield ctx.wait_for_external_event("Approval")
    if approved:
        # approval granted - do the approved action
        pass
    else:
        # approval denied - send a notification
        pass
    return approved
```

# [Java](#tab/java)

```java
public class BudgetApproval implements TaskOrchestration {
    @Override
    public void run(TaskOrchestrationContext ctx) {
        boolean approved = ctx.waitForExternalEvent("Approval", boolean.class).await();
        if (approved) {
            // approval granted - do the approved action
        } else {
            // approval denied - send a notification
        }
    }
}
```

# [JavaScript](#tab/javascript)

```typescript
import { OrchestrationContext, TOrchestrator } from "@microsoft/durabletask-js";

const budgetApproval: TOrchestrator = async function* (ctx: OrchestrationContext): any {
    const approved = yield ctx.waitForExternalEvent("Approval");
    if (approved) {
        // approval granted - do the approved action
    } else {
        // approval denied - send a notification
    }
    return approved;
};
```

# [PowerShell](#tab/powershell)

The Durable Task SDK is not available for PowerShell. Use [Durable Functions](what-is-durable-task.md) instead.

---

::: zone-end

The preceding example listens for a specific single event and takes action when the event is received.

You can listen for multiple events concurrently, like in the following example, which waits for one of three possible event notifications.

::: zone pivot="durable-functions"

# [C#](#tab/csharp)

**Isolated worker model**

```csharp
[Function("Select")]
public async Task Run(
    [OrchestrationTrigger] TaskOrchestrationContext context)
{
    Task<float> event1 = context.WaitForExternalEventAsync<float>("Event1");
    Task<bool> event2 = context.WaitForExternalEventAsync<bool>("Event2");
    Task<int> event3 = context.WaitForExternalEventAsync<int>("Event3");

    Task winner = await Task.WhenAny(event1, event2, event3);
    if (winner == event1)
    {
        // ...
    }
    else if (winner == event2)
    {
        // ...
    }
    else if (winner == event3)
    {
        // ...
    }
}
```

**In-process model**

```csharp
[FunctionName("Select")]
public static async Task Run(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
{
    var event1 = context.WaitForExternalEvent<float>("Event1");
    var event2 = context.WaitForExternalEvent<bool>("Event2");
    var event3 = context.WaitForExternalEvent<int>("Event3");

    var winner = await Task.WhenAny(event1, event2, event3);
    if (winner == event1)
    {
        // ...
    }
    else if (winner == event2)
    {
        // ...
    }
    else if (winner == event3)
    {
        // ...
    }
}
```

> [!NOTE]
> Using Durable Functions 1.x? Swap in `DurableOrchestrationContext` instead of `IDurableOrchestrationContext`. See the [Durable Functions versions](durable-functions-versions.md) article to learn about other version differences.

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

module.exports = df.orchestrator(function*(context) {
    const event1 = context.df.waitForExternalEvent("Event1");
    const event2 = context.df.waitForExternalEvent("Event2");
    const event3 = context.df.waitForExternalEvent("Event3");

    const winner = yield context.df.Task.any([event1, event2, event3]);
    if (winner === event1) {
        // ...
    } else if (winner === event2) {
        // ...
    } else if (winner === event3) {
        // ...
    }
});
```

# [Python](#tab/python)

```python
import azure.functions as func
import azure.durable_functions as df

def orchestrator_function(context: df.DurableOrchestrationContext):
    event1 = context.wait_for_external_event('Event1')
    event2 = context.wait_for_external_event('Event2')
    event3 = context.wait_for_external_event('Event3')

    winner = yield context.task_any([event1, event2, event3])
    if winner == event1:
        # ...
    elif winner == event2:
        # ...
    elif winner == event3:
        # ...

main = df.Orchestrator.create(orchestrator_function)
```

# [Java](#tab/java)

```java
@FunctionName("Select")
public void selectOrchestrator(
        @DurableOrchestrationTrigger(name = "ctx") TaskOrchestrationContext ctx) {
    Task<Void> event1 = ctx.waitForExternalEvent("Event1");
    Task<Void> event2 = ctx.waitForExternalEvent("Event2");
    Task<Void> event3 = ctx.waitForExternalEvent("Event3");

    Task<?> winner = ctx.anyOf(event1, event2, event3).await();
    if (winner == event1) {
        // ...
    } else if (winner == event2) {
        // ...
    } else if (winner == event3) {
        // ...
    }
}
```

# [PowerShell](#tab/powershell)

```powershell
param($Context)

$event1 = Start-DurableExternalEventListener -EventName "Event1" -NoWait
$event2 = Start-DurableExternalEventListener -EventName "Event2" -NoWait
$event3 = Start-DurableExternalEventListener -EventName "Event3" -NoWait

$winner = Wait-DurableTask -Task @($event1, $event2, $event3) -Any

if ($winner -eq $event1) {
    # ...
} else if ($winner -eq $event2) {
    # ...
} else if ($winner -eq $event3) {
    # ...
}
```

---

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

```csharp
public class SelectOrchestrator : TaskOrchestrator<object?, object?>
{
    public override async Task<object?> RunAsync(TaskOrchestrationContext context, object? input)
    {
        Task<float> event1 = context.WaitForExternalEvent<float>("Event1");
        Task<bool> event2 = context.WaitForExternalEvent<bool>("Event2");
        Task<int> event3 = context.WaitForExternalEvent<int>("Event3");

        Task winner = await Task.WhenAny(event1, event2, event3);
        if (winner == event1)
        {
            // ...
        }
        else if (winner == event2)
        {
            // ...
        }
        else if (winner == event3)
        {
            // ...
        }
        return null;
    }
}
```

# [Python](#tab/python)

```python
from durabletask import task

def select_orchestrator(ctx: task.OrchestrationContext, _):
    event1 = ctx.wait_for_external_event("Event1")
    event2 = ctx.wait_for_external_event("Event2")
    event3 = ctx.wait_for_external_event("Event3")

    winner = yield task.when_any([event1, event2, event3])
    if winner == event1:
        # ...
        pass
    elif winner == event2:
        # ...
        pass
    elif winner == event3:
        # ...
        pass
```

# [Java](#tab/java)

```java
public class SelectOrchestrator implements TaskOrchestration {
    @Override
    public void run(TaskOrchestrationContext ctx) {
        Task<Void> event1 = ctx.waitForExternalEvent("Event1");
        Task<Void> event2 = ctx.waitForExternalEvent("Event2");
        Task<Void> event3 = ctx.waitForExternalEvent("Event3");

        Task<?> winner = ctx.anyOf(event1, event2, event3).await();
        if (winner == event1) {
            // ...
        } else if (winner == event2) {
            // ...
        } else if (winner == event3) {
            // ...
        }
    }
}
```

# [JavaScript](#tab/javascript)

```typescript
import { OrchestrationContext, TOrchestrator, whenAny } from "@microsoft/durabletask-js";

const selectOrchestrator: TOrchestrator = async function* (ctx: OrchestrationContext): any {
    const event1 = ctx.waitForExternalEvent("Event1");
    const event2 = ctx.waitForExternalEvent("Event2");
    const event3 = ctx.waitForExternalEvent("Event3");

    const winner = yield whenAny([event1, event2, event3]);
    if (winner === event1) {
        // ...
    } else if (winner === event2) {
        // ...
    } else if (winner === event3) {
        // ...
    }
};
```

# [PowerShell](#tab/powershell)

The Durable Task SDK is not available for PowerShell. Use [Durable Functions](what-is-durable-task.md) instead.

---

::: zone-end

The previous example listens for *any* of multiple events. You can also wait for *all* events.

::: zone pivot="durable-functions"

# [C#](#tab/csharp)

**Isolated worker model**

```csharp
[Function("NewBuildingPermit")]
public async Task Run(
    [OrchestrationTrigger] TaskOrchestrationContext context)
{
    string applicationId = context.GetInput<string>();

    Task gate1 = context.WaitForExternalEventAsync<object>("CityPlanningApproval");
    Task gate2 = context.WaitForExternalEventAsync<object>("FireDeptApproval");
    Task gate3 = context.WaitForExternalEventAsync<object>("BuildingDeptApproval");

    // all three departments must grant approval before a permit can be issued
    await Task.WhenAll(gate1, gate2, gate3);

    await context.CallActivityAsync("IssueBuildingPermit", applicationId);
}
```

**In-process model**

```csharp
[FunctionName("NewBuildingPermit")]
public static async Task Run(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
{
    string applicationId = context.GetInput<string>();

    var gate1 = context.WaitForExternalEvent("CityPlanningApproval");
    var gate2 = context.WaitForExternalEvent("FireDeptApproval");
    var gate3 = context.WaitForExternalEvent("BuildingDeptApproval");

    // all three departments must grant approval before a permit can be issued
    await Task.WhenAll(gate1, gate2, gate3);

    await context.CallActivityAsync("IssueBuildingPermit", applicationId);
}
```

> [!NOTE]
> If you're running Durable Functions 1.x, use `DurableOrchestrationContext` instead of `IDurableOrchestrationContext`. Head over to [Durable Functions versions](durable-functions-versions.md) for a full breakdown of version differences.

In .NET, if the event payload cannot be converted into the expected type `T`, an exception is thrown.

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

module.exports = df.orchestrator(function*(context) {
    const applicationId = context.df.getInput();

    const gate1 = context.df.waitForExternalEvent("CityPlanningApproval");
    const gate2 = context.df.waitForExternalEvent("FireDeptApproval");
    const gate3 = context.df.waitForExternalEvent("BuildingDeptApproval");

    // all three departments must grant approval before a permit can be issued
    yield context.df.Task.all([gate1, gate2, gate3]);

    yield context.df.callActivity("IssueBuildingPermit", applicationId);
});
```

# [Python](#tab/python)

```python
import azure.functions as func
import azure.durable_functions as df

def orchestrator_function(context: df.DurableOrchestrationContext):
    application_id = context.get_input()
    
    gate1 = context.wait_for_external_event('CityPlanningApproval')
    gate2 = context.wait_for_external_event('FireDeptApproval')
    gate3 = context.wait_for_external_event('BuildingDeptApproval')

    yield context.task_all([gate1, gate2, gate3])
    yield context.call_activity('IssueBuildingPermit', application_id)

main = df.Orchestrator.create(orchestrator_function)
```

# [Java](#tab/java)

```java
@FunctionName("NewBuildingPermit")
public void newBuildingPermit(
        @DurableOrchestrationTrigger(name = "ctx") TaskOrchestrationContext ctx) {
    String applicationId = ctx.getInput(String.class);

    Task<Void> gate1 = ctx.waitForExternalEvent("CityPlanningApproval");
    Task<Void> gate2 = ctx.waitForExternalEvent("FireDeptApproval");
    Task<Void> gate3 = ctx.waitForExternalEvent("BuildingDeptApproval");

    // all three departments must grant approval before a permit can be issued
    ctx.allOf(List.of(gate1, gate2, gate3)).await();

    ctx.callActivity("IssueBuildingPermit", applicationId).await();
}
```

# [PowerShell](#tab/powershell)

```powershell
param($Context)

$applicationId = $Context.Input
$gate1 = Start-DurableExternalEventListener -EventName "CityPlanningApproval" -NoWait
$gate2 = Start-DurableExternalEventListener -EventName "FireDeptApproval" -NoWait
$gate3 = Start-DurableExternalEventListener -EventName "BuildingDeptApproval" -NoWait

Wait-DurableTask -Task @($gate1, $gate2, $gate3)

Invoke-ActivityFunction -FunctionName 'IssueBuildingPermit' -Input $applicationId
```

---

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

```csharp
public class NewBuildingPermit : TaskOrchestrator<string, object?>
{
    public override async Task<object?> RunAsync(TaskOrchestrationContext context, string applicationId)
    {
        Task<object?> gate1 = context.WaitForExternalEvent<object?>("CityPlanningApproval");
        Task<object?> gate2 = context.WaitForExternalEvent<object?>("FireDeptApproval");
        Task<object?> gate3 = context.WaitForExternalEvent<object?>("BuildingDeptApproval");

        // all three departments must grant approval before a permit can be issued
        await Task.WhenAll(gate1, gate2, gate3);

        await context.CallActivityAsync("IssueBuildingPermit", applicationId);
        return null;
    }
}
```

In .NET, if the event payload cannot be converted into the expected type `T`, an exception is thrown.

# [Python](#tab/python)

```python
from durabletask import task

def issue_building_permit(ctx: task.ActivityContext, application_id: str) -> None:
    # Issue the permit
    pass

def new_building_permit(ctx: task.OrchestrationContext, application_id: str):
    gate1 = ctx.wait_for_external_event("CityPlanningApproval")
    gate2 = ctx.wait_for_external_event("FireDeptApproval")
    gate3 = ctx.wait_for_external_event("BuildingDeptApproval")

    # all three departments must grant approval before a permit can be issued
    yield task.when_all([gate1, gate2, gate3])
    yield ctx.call_activity(issue_building_permit, input=application_id)
```

# [Java](#tab/java)

```java
public class NewBuildingPermit implements TaskOrchestration {
    @Override
    public void run(TaskOrchestrationContext ctx) {
        String applicationId = ctx.getInput(String.class);

        Task<Void> gate1 = ctx.waitForExternalEvent("CityPlanningApproval");
        Task<Void> gate2 = ctx.waitForExternalEvent("FireDeptApproval");
        Task<Void> gate3 = ctx.waitForExternalEvent("BuildingDeptApproval");

        // all three departments must grant approval before a permit can be issued
        ctx.allOf(List.of(gate1, gate2, gate3)).await();

        ctx.callActivity("IssueBuildingPermit", applicationId).await();
    }
}
```

# [JavaScript](#tab/javascript)

```typescript
import { ActivityContext, OrchestrationContext, TOrchestrator, whenAll } from "@microsoft/durabletask-js";

const issueBuildingPermit = async (_: ActivityContext, applicationId: string): Promise<void> => {
    // Issue the permit
};

const newBuildingPermit: TOrchestrator = async function* (
    ctx: OrchestrationContext,
    applicationId: string,
): any {
    const gate1 = ctx.waitForExternalEvent("CityPlanningApproval");
    const gate2 = ctx.waitForExternalEvent("FireDeptApproval");
    const gate3 = ctx.waitForExternalEvent("BuildingDeptApproval");

    // all three departments must grant approval before a permit can be issued
    yield whenAll([gate1, gate2, gate3]);
    yield ctx.callActivity(issueBuildingPermit, applicationId);
};
```

# [PowerShell](#tab/powershell)

The Durable Task SDK is not available for PowerShell. Use [Durable Functions](what-is-durable-task.md) instead.

---

::: zone-end

::: zone pivot="durable-functions"
The *"wait-for-external-event"* API waits indefinitely for some input.  You can safely unload the function app while waiting. If and when an event arrives for this orchestration instance, the instance is awakened automatically and immediately processes the event.

> [!NOTE]
> If your function app uses the Consumption Plan, no billing charges are incurred while an orchestrator function is awaiting an external event task, no matter how long it waits.

As with Activity Functions, external events have an _at-least-once_ delivery guarantee. This means that, under certain conditions (like restarts, scaling, crashes, etc.), your application may receive duplicates of the same external event. Therefore, we recommend that external events contain some kind of ID that allows them to be manually de-duplicated in orchestrators.
::: zone-end

::: zone pivot="durable-task-sdks"
The *"wait-for-external-event"* API waits indefinitely for some input. You can safely stop the worker while waiting. If and when an event arrives for this orchestration instance, it is awakened automatically and immediately processes the event.

External events have an _at-least-once_ delivery guarantee. This means that, under certain conditions (like restarts, scaling, crashes, etc.), your application may receive duplicates of the same external event. Therefore, we recommend that external events contain some kind of ID that allows them to be manually de-duplicated in orchestrations.
::: zone-end

## Send events

::: zone pivot="durable-functions"
You can use the *"raise-event"* API defined by the [orchestration client](durable-functions-bindings.md#orchestration-client) binding to send an external event to an orchestration. You can also use the built-in [raise event HTTP API](durable-functions-http-api.md#raise-event) to send an external event to an orchestration.

A raised event includes an `instanceID`, an `eventName`, and `eventData` as parameters. Orchestrator functions handle these events using the [`wait-for-external-event`](#wait-for-events) APIs. The `eventName` must match on both the *sending* and *receiving* ends in order for the event to be processed. The event data must also be JSON-serializable.

Internally, the *"raise-event"* mechanisms enqueue a message that gets picked up by the waiting orchestrator function. If the instance isn't waiting on the specified *event name,* the event message is added to an in-memory queue. If the orchestration instance later begins listening for that *event name,* it checks the queue for event messages.

> [!NOTE]
> If there's no orchestration instance with the specified *instance ID*, the event message is discarded.

Below is an example queue-triggered function that sends an "Approval" event to an orchestrator function instance. The orchestration instance ID comes from the body of the queue message.
::: zone-end

::: zone pivot="durable-task-sdks"
You can use the *"raise-event"* API on the Durable Task client to send an external event to an orchestration.

A raised event includes an *instance ID*, an *eventName*, and *eventData* as parameters. Orchestrations handle these events using the [*"wait-for-external-event"*](#wait-for-events) APIs. The *eventName* must match on both the sending and receiving ends in order for the event to be processed. The event data must also be JSON-serializable.

Internally, the *"raise-event"* mechanisms enqueue a message that gets picked up by the waiting orchestration. If the instance is not waiting on the specified *event name,* the event message is added to an in-memory queue. If the orchestration instance later begins listening for that *event name,* it will check the queue for event messages.

> [!NOTE]
> If there is no orchestration instance with the specified `instanceID`, the event message is discarded.

Below is an example that sends an "Approval" event to an orchestration instance.
::: zone-end

::: zone pivot="durable-functions"

# [C#](#tab/csharp)

**Isolated worker model**

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.DurableTask.Client;

public class ApprovalQueueProcessor
{
    [Function("ApprovalQueueProcessor")]
    public async Task Run(
        [QueueTrigger("approval-queue")] string instanceId,
        [DurableClient] DurableTaskClient client)
    {
        await client.RaiseEventAsync(instanceId, "Approval", true);
    }
}
```

**In-process model**

```csharp
[FunctionName("ApprovalQueueProcessor")]
public static async Task Run(
    [QueueTrigger("approval-queue")] string instanceId,
    [DurableClient] IDurableOrchestrationClient client)
{
    await client.RaiseEventAsync(instanceId, "Approval", true);
}
```

> [!NOTE]
> For Durable Functions 1.x, use the `OrchestrationClient` attribute and `DurableOrchestrationClient` parameter type instead. Check the [Durable Functions versions](durable-functions-versions.md) article for all version-specific changes.

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

module.exports = async function(context, instanceId) {
    const client = df.getClient(context);
    await client.raiseEvent(instanceId, "Approval", true);
};
```

# [Python](#tab/python)

```python
import azure.functions as func
import azure.durable_functions as df

async def main(instance_id:str, starter: str) -> func.HttpResponse:
    client = df.DurableOrchestrationClient(starter)
    await client.raise_event(instance_id, 'Approval', True)
```

# [Java](#tab/java)

```java
@FunctionName("ApprovalQueueProcessor")
public void approvalQueueProcessor(
        @QueueTrigger(name = "instanceID", queueName = "approval-queue") String instanceID,
        @DurableClientInput(name = "durableContext") DurableClientContext durableContext) {
    durableContext.getClient().raiseEvent(instanceID, "Approval", true);
}
```

# [PowerShell](#tab/powershell)

```powershell
param($instanceId)

Send-DurableExternalEvent -InstanceId $InstanceId -EventName "Approval"
```

---

Internally, the "*raise-event*" API enqueues a message that gets picked up by the waiting orchestrator function. If the instance isn't waiting on the specified *event name,* the event message is added to an in-memory buffer. If the orchestration instance later begins listening for that *event name,* it checks the buffer for event messages and triggers the task that was waiting for it.

> [!NOTE]
> If there is no orchestration instance with the specified *instance ID*, the event message is discarded.

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

```csharp
await client.RaiseEventAsync(instanceId, "Approval", true);
```

# [Python](#tab/python)

```python
client.raise_orchestration_event(instance_id, "Approval", data=True)
```

# [Java](#tab/java)

```java
client.raiseEvent(instanceId, "Approval", true);
```

# [JavaScript](#tab/javascript)

```typescript
await client.raiseOrchestrationEvent(instanceId, "Approval", true);
```

# [PowerShell](#tab/powershell)

The Durable Task SDK is not available for PowerShell. Use [Durable Functions](what-is-durable-task.md) instead.

---

Internally, the "*raise-event*" API enqueues a message that gets picked up by the waiting orchestration. If the instance is not waiting on the specified *event name,* the event message is added to an in-memory buffer. If the orchestration instance later begins listening for that *event name,* it will check the buffer for event messages and trigger the task that was waiting for it.

> [!NOTE]
> If there is no orchestration instance with the specified *instance ID*, the event message is discarded.

::: zone-end

::: zone pivot="durable-functions"

### HTTP

The following is an example of an HTTP request that raises an `Approval` event to an orchestration instance.

```http
POST /runtime/webhooks/durabletask/instances/MyInstanceId/raiseEvent/Approval&code=XXX
Content-Type: application/json

"true"
```

In this case, the instance ID is hardcoded as *MyInstanceId*.

::: zone-end

## Best practices for external events

Keep the following best practices in mind when working with external events:

### Use unique event names for deduplication

External events have an *at-least-once* delivery guarantee. Under certain rare conditions (which can occur during restarts, scaling, or crashes), your application might receive duplicates of the same external event. We recommend that external events contain a unique ID that allows them to be manually deduplicated in orchestrators.

> [!NOTE]
> The [MSSQL storage provider](./durable-functions-storage-providers.md#mssql) consumes external events and updates orchestrator state transactionally, so there's no risk of duplicate events with that backend, unlike the [Azure Storage provider](./durable-functions-storage-providers.md#azure-storage). However, it's still recommended that external events have unique names so that code is portable across backends.

## Next steps

::: zone pivot="durable-functions"
> [!div class="nextstepaction"]
> [Learn how to implement error handling](durable-functions-error-handling.md)

> [!div class="nextstepaction"]
> [Run a sample that waits for human interaction](durable-functions-human-interaction.md)
::: zone-end

::: zone pivot="durable-task-sdks"
> [!div class="nextstepaction"]
> [Get started with Durable Task SDKs](durable-task-scheduler/quickstart-portable-durable-task-sdks.md)
::: zone-end
