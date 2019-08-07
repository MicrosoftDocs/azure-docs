---
title: Checkpoints and replay in Durable Functions - Azure
description: Learn how checkpointing and reply works in the Durable Functions extension for Azure Functions.
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

# Checkpoints and replay in Durable Functions (Azure Functions)

One of the key attributes of Durable Functions is **reliable execution**. Orchestrator functions and activity functions may be running on different VMs within a data center, and those VMs or the underlying networking infrastructure is not 100% reliable.

In spite of this, Durable Functions ensures reliable execution of orchestrations. It does so by using storage queues to drive function invocation and by periodically checkpointing execution history into storage tables (using a cloud design pattern known as [Event Sourcing](https://docs.microsoft.com/azure/architecture/patterns/event-sourcing)). That history can then be replayed to automatically rebuild the in-memory state of an orchestrator function.

## Orchestration history

Suppose you have the following orchestrator function:

### C#

```csharp
[FunctionName("E1_HelloSequence")]
public static async Task<List<string>> Run(
    [OrchestrationTrigger] DurableOrchestrationContext context)
{
    var outputs = new List<string>();

    outputs.Add(await context.CallActivityAsync<string>("E1_SayHello", "Tokyo"));
    outputs.Add(await context.CallActivityAsync<string>("E1_SayHello", "Seattle"));
    outputs.Add(await context.CallActivityAsync<string>("E1_SayHello", "London"));

    // returns ["Hello Tokyo!", "Hello Seattle!", "Hello London!"]
    return outputs;
}
```

### JavaScript (Functions 2.x only)

```javascript
const df = require("durable-functions");

module.exports = df.orchestrator(function*(context) {
    const output = [];
    output.push(yield context.df.callActivity("E1_SayHello", "Tokyo"));
    output.push(yield context.df.callActivity("E1_SayHello", "Seattle"));
    output.push(yield context.df.callActivity("E1_SayHello", "London"));

    // returns ["Hello Tokyo!", "Hello Seattle!", "Hello London!"]
    return output;
});
```

At each `await` (C#) or `yield` (JavaScript) statement, the Durable Task Framework checkpoints the execution state of the function into table storage. This state is what is referred to as the *orchestration history*.

## History table

Generally speaking, the Durable Task Framework does the following at each checkpoint:

1. Saves execution history into Azure Storage tables.
2. Enqueues messages for functions the orchestrator wants to invoke.
3. Enqueues messages for the orchestrator itself &mdash; for example, durable timer messages.

Once the checkpoint is complete, the orchestrator function is free to be removed from memory until there is more work for it to do.

> [!NOTE]
> Azure Storage does not provide any transactional guarantees between saving data into table storage and queues. To handle failures, the Durable Functions storage provider uses *eventual consistency* patterns. These patterns ensure that no data is lost if there is a crash or loss of connectivity in the middle of a checkpoint.

Upon completion, the history of the function shown earlier looks something like the following in Azure Table Storage (abbreviated for illustration purposes):

| PartitionKey (InstanceId)                     | EventType             | Timestamp               | Input | Name             | Result                                                    | Status |
|----------------------------------|-----------------------|----------|--------------------------|-------|------------------|-----------------------------------------------------------|
| eaee885b | OrchestratorStarted   | 2017-05-05T18:45:32.362Z |       |                  |                                                           |                     |
| eaee885b | ExecutionStarted      | 2017-05-05T18:45:28.852Z | null  | E1_HelloSequence |                                                           |                     |
| eaee885b | TaskScheduled         | 2017-05-05T18:45:32.670Z |       | E1_SayHello      |                                                           |                     |
| eaee885b | OrchestratorCompleted | 2017-05-05T18:45:32.670Z |       |                  |                                                           |                     |
| eaee885b | OrchestratorStarted   | 2017-05-05T18:45:34.232Z |       |                  |                                                           |                     |
| eaee885b | TaskCompleted         | 2017-05-05T18:45:34.201Z |       |                  | """Hello Tokyo!"""                                        |                     |
| eaee885b | TaskScheduled         | 2017-05-05T18:45:34.435Z |       | E1_SayHello      |                                                           |                     |
| eaee885b | OrchestratorCompleted | 2017-05-05T18:45:34.435Z |       |                  |                                                           |                     |
| eaee885b | OrchestratorStarted   | 2017-05-05T18:45:34.857Z |       |                  |                                                           |                     |
| eaee885b | TaskCompleted         | 2017-05-05T18:45:34.763Z |       |                  | """Hello Seattle!"""                                      |                     |
| eaee885b | TaskScheduled         | 2017-05-05T18:45:34.857Z |       | E1_SayHello      |                                                           |                     |
| eaee885b | OrchestratorCompleted | 2017-05-05T18:45:34.857Z |       |                  |                                                           |                     |
| eaee885b | OrchestratorStarted   | 2017-05-05T18:45:35.032Z |       |                  |                                                           |                     |
| eaee885b | TaskCompleted         | 2017-05-05T18:45:34.919Z |       |                  | """Hello London!"""                                       |                     |
| eaee885b | ExecutionCompleted    | 2017-05-05T18:45:35.044Z |       |                  | "[""Hello Tokyo!"",""Hello Seattle!"",""Hello London!""]" | Completed           |
| eaee885b | OrchestratorCompleted | 2017-05-05T18:45:35.044Z |       |                  |                                                           |                     |

A few notes on the column values:

* **PartitionKey**: Contains the instance ID of the orchestration.
* **EventType**: Represents the type of the event. May be one of the following types:
  * **OrchestrationStarted**: The orchestrator function resumed from an await or is running for the first time. The `Timestamp` column is used to populate the deterministic value for the [CurrentUtcDateTime](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html#Microsoft_Azure_WebJobs_DurableOrchestrationContext_CurrentUtcDateTime) API.
  * **ExecutionStarted**: The orchestrator function started executing for the first time. This event also contains the function input in the `Input` column.
  * **TaskScheduled**: An activity function was scheduled. The name of the activity function is captured in the `Name` column.
  * **TaskCompleted**: An activity function completed. The result of the function is in the `Result` column.
  * **TimerCreated**: A durable timer was created. The `FireAt` column contains the scheduled UTC time at which the timer expires.
  * **TimerFired**: A durable timer fired.
  * **EventRaised**: An external event was sent to the orchestration instance. The `Name` column captures the name of the event and the `Input` column captures the payload of the event.
  * **OrchestratorCompleted**: The orchestrator function awaited.
  * **ContinueAsNew**: The orchestrator function completed and restarted itself with new state. The `Result` column contains the value, which is used as the input in the restarted instance.
  * **ExecutionCompleted**: The orchestrator function ran to completion (or failed). The outputs of the function or the error details are stored in the `Result` column.
* **Timestamp**: The UTC timestamp of the history event.
* **Name**: The name of the function that was invoked.
* **Input**: The JSON-formatted input of the function.
* **Result**: The output of the function; that is, its return value.

> [!WARNING]
> While it's useful as a debugging tool, don't take any dependency on this table. It may change as the Durable Functions extension evolves.

Every time the function resumes from an `await` (C#) or `yield` (JavaScript), the Durable Task Framework reruns the orchestrator function from scratch. On each rerun it consults the execution history to determine whether the current async operation has taken place.  If the operation took place, the framework replays the output of that operation immediately and moves on to the next `await` (C#) or `yield` (JavaScript). This process continues until the entire history has been replayed, at which point all the local variables in the orchestrator function are restored to their previous values.

## Orchestrator code constraints

The replay behavior creates constraints on the type of code that can be written in an orchestrator function:

* Orchestrator code must be **deterministic**. It will be replayed multiple times and must produce the same result each time. For example, no direct calls to get the current date/time, get random numbers, generate random GUIDs, or call into remote endpoints.

  If orchestrator code needs to get the current date/time, it should use the [CurrentUtcDateTime](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html#Microsoft_Azure_WebJobs_DurableOrchestrationContext_CurrentUtcDateTime) (.NET) or `currentUtcDateTime` (JavaScript) API, which is safe for replay.

  If orchestrator code needs to generate a random GUID, it should use the [NewGuid](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html#Microsoft_Azure_WebJobs_DurableOrchestrationContext_NewGuid) (.NET) API, which is safe for replay, or delegate GUID generation to an activity function (JavaScript), as in this example:

  ```javascript
  const uuid = require("uuid/v1");

  module.exports = async function(context) {
    return uuid();
  }
  ```

  Non-deterministic operations must be done in activity functions. This includes any interaction with other input or output bindings. This ensures that any non-deterministic values will be generated once on the first execution and saved into the execution history. Subsequent executions will then use the saved value automatically.

* Orchestrator code should be **non-blocking**. For example, that means no I/O and no calls to `Thread.Sleep` (.NET) or equivalent APIs.

  If an orchestrator needs to delay, it can use the [CreateTimer](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html#Microsoft_Azure_WebJobs_DurableOrchestrationContext_CreateTimer_) (.NET) or `createTimer` (JavaScript) API.

* Orchestrator code must **never initiate any async operation** except by using the [DurableOrchestrationContext](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html) API or `context.df` object's API. For example, no `Task.Run`, `Task.Delay` or `HttpClient.SendAsync` in .NET, or `setTimeout()` and `setInterval()` in JavaScript. The Durable Task Framework executes orchestrator code on a single thread and cannot interact with any other threads that could be scheduled by other async APIs.

* **Infinite loops should be avoided** in orchestrator code. Because the Durable Task Framework saves execution history as the orchestration function progresses, an infinite loop could cause an orchestrator instance to run out of memory. For infinite loop scenarios, use APIs such as [ContinueAsNew](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html#Microsoft_Azure_WebJobs_DurableOrchestrationContext_ContinueAsNew_) (.NET) or `continueAsNew` (JavaScript) to restart the function execution and discard previous execution history.

* JavaScript orchestrator functions cannot be `async`. They must be declared as synchronous generator functions.

While these constraints may seem daunting at first, in practice they aren't hard to follow. The Durable Task Framework attempts to detect violations of the above rules and throws a `NonDeterministicOrchestrationException`. However, this detection behavior is best-effort, and you shouldn't depend on it.

> [!NOTE]
> All of these rules apply only to functions triggered by the `orchestrationTrigger` binding. Activity functions triggered by the `activityTrigger` binding, and functions that use the `orchestrationClient` binding, have no such limitations.

## Durable tasks (.NET)

> [!NOTE]
> This section describes internal implementation details of the Durable Task Framework. You can use Durable Functions without knowing this information. It is intended only to help you understand the replay behavior.

Tasks that can be safely awaited in orchestrator functions are occasionally referred to as *durable tasks*. These are tasks that are created and managed by the Durable Task Framework. Examples are the tasks returned by `CallActivityAsync`, `WaitForExternalEvent`, and `CreateTimer`.

These *durable tasks* are internally managed by using a list of `TaskCompletionSource` objects. During replay, these tasks get created as part of orchestrator code execution and are completed as the dispatcher enumerates the corresponding history events. This is all done synchronously using a single thread until all the history has been replayed. Any durable tasks, which are not completed by the end of history replay has appropriate actions carried out. For example, a message may be enqueued to call an activity function.

The execution behavior described here should help you understand why orchestrator function code must never `await` a non-durable task: the dispatcher thread cannot wait for it to complete and any callback by that task could potentially corrupt the tracking state of the orchestrator function. Some runtime checks are in place to try to prevent this.

If you'd like more information about how the Durable Task Framework executes orchestrator functions, the best thing to do is to consult the [Durable Task source code on GitHub](https://github.com/Azure/durabletask). In particular, see [TaskOrchestrationExecutor.cs](https://github.com/Azure/durabletask/blob/master/src/DurableTask.Core/TaskOrchestrationExecutor.cs) and [TaskOrchestrationContext.cs](https://github.com/Azure/durabletask/blob/master/src/DurableTask.Core/TaskOrchestrationContext.cs)

## Next steps

> [!div class="nextstepaction"]
> [Learn about instance management](durable-functions-instance-management.md)
