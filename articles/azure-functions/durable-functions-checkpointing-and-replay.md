---
title: Checkpoints and replay in Durable Functions for Azure Functions
description: Learn how checkpointing and reply works in the Durable Functions extension for Azure Functions.
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
ms.author: cgillum
---

# Checkpoints and replay in Durable Functions
One of the key attributes of Durable Functions is **reliable execution**. Orchestrator functions and activity functions may be running on different VMs within a particular data center, and those VMs or the underlying networking infrastructure is not guaranteed to be 100% reliable.

In spite of this, Durable Functions ensures reliable execution of orchestrations. It does so by using storage queues to drive function invocation and by periodically checkpointing execution history into storage tables (using a cloud design pattern known as [Event Sourcing](https://docs.microsoft.com/en-us/azure/architecture/patterns/event-sourcing)). Replaying that history can then be used to automatically rebuild the in-memory state of an orchestrator function. The rest of this article will go into the details.

## Orchestration History
Suppose you have the following orchestrator function.

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

At each `await` statement, the Durable Task Framework will checkpoint the execution state of the function into table storage. This state is what is referred to as the *orchestration history*.

## History Table
Generally speaking, each checkpoint will include the following:.

1. Saving execution history into Azure Storage tables.
2. Enqueuing messages for the functions we want to invoke.
3. Enqueuing messages for the orchestrator itself - e.g. durable timer messages.

Once the checkpoint is complete, the orchestrator function is free to be removed from memory until there is more work for it to do.

> [!NOTE]
> Azure Storage does not provide any transactional guarantees between saving data into table storage and queues. To account for this, the Durable Functions storage provider uses *eventual consistency* patterns to ensure that no data is lost if there is a crash or loss of connectivity in the middle of a checkpoint.

Upon completion, the history of the above function will look something like the following in Azure Table Storage (abbreviated for illustration purposes):

| PartitionKey (InstanceId)                     | EventType             | Timestamp               | Input | Name             | Result                                                    | Status | 
|----------------------------------|-----------------------|----------|--------------------------|-------|------------------|-----------------------------------------------------------|---------------------| 
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
* **EventType**: Represents the type of the event.
    * **OrchestrationStarted**: The orchestrator function resumed from an await (or is running for the first time). The `Timestamp` column is used to populate the deterministic value for the <xref:Microsoft.Azure.WebJobs.DurableOrchestrationContext.CurrentUtcDateTime> API.
    * **ExecutionStarted**: The orchestrator function started executing for the first time. This event also contains the function input in the `Input` column.
    * **TaskScheduled**: An activity function was scheduled. The name of the activity function is captured in the `Name` column.
    * **TaskCompleted**: An activity function completed. The result of the function is in the `Result` column.
    * **TimerCreated**: A durable timer was created. The `FireAt` column contains the scheduled UTC time at which the timer will expire.
    * **TimerFired**: A durable timer expired.
    * **EventRaised**: An external event was sent to the orchestration instance. The `Name` column captures the name of the event and the `Input` column captures the payload of the event.
    * **OrchestratorCompleted**: The orchestrator function awaited.
    * **ContinueAsNew**: The orchestrator function completed and restarted itself with new state. The `Result` column contains the value which will be used as the input in the restarted instance.
    * **ExecutionCompleted**: The orchestrator function ran to completion (or failed). The output of the function (or the error details) are stored in the `Result` column.
* **Timestamp**: The UTC timestamp of the history event.
* **Name**: The name of the function which was invoked.
* **Input**: The JSON-formatted input of the function.
* **Output**: The output of the function (if any) which comes from its return value.

> [!WARNING]
> While it's useful as a debugging tool, you should not take any dependency on the existence or the format of this table as the specifics of its usage may change as the Durable Functions extension evolves.

Every time the function resumes from an `await`, the Durable Task Framework re-runs the orchestrator function from scratch. On each re-run it consults the execution history to determine whether the current async operation has taken place and, if so, replays the output of that operation immediately and moves on to the next `await`. This continues until the entire history has been replayed, at which point all the local variables in the orchestrator function should be restored to their previous values.

## Code Constraints
With this replay behavior in mind, there are a very important set of constraints on the type of code that can be written in an orchestrator function:
* Orchestrator code **must be deterministic** since it is going to be replayed multiple times. This means there cannot be any direct calls to get the current date/time, get random numbers, generate random GUIDs, or call into remote endpoints.
* If orchestrator code needs to get the current date/time, it should use the <xref:Microsoft.Azure.WebJobs.DurableOrchestrationContext.CurrentUtcDateTime> API, which is safe for replay.
* Non-deterministic operations need to be done in activity functions. This includes any interaction with other input or output bindings. This ensures any non-deterministic values will be generated once on the first execution and saved into the execution history. Subsequent executions will then use the saved value automatically.
* Orchestrator code should be **non-blocking** - i.e. no `Thread.Sleep` or equivalent APIs. If an orchestrator needs to delay for a period of time, it should use the <xref:Microsoft.Azure.WebJobs.DurableOrchestrationContext.CreateTimer*> API.
* Orchestrator code must never initiate any async operation outside of the operations exposed by <xref:Microsoft.Azure.WebJobs.DurableOrchestrationContext> - e.g. no `Task.Delay` or `HttpClient.SendAsync`. The Durable Task Framework executes orchestrator code on a single thread and cannot interact with any other threads which could be scheduled by other async APIs.
* Because the Durable Task Framework saves execution history as the orchestration function progresses, **infinite loops should be avoided** to ensure orchestrator instances do not run out of memory. Instead, APIs such as <xref:Microsoft.Azure.WebJobs.DurableOrchestrationContext.ContinueAsNew*> should be used to restart the function execution and discard previous execution history.

If the runtime is replaying the orchestrator code and detects that the replay is taking a different path than the original execution, it will throw a `NonDeterministicOrchestration` exception and terminate the instance.

> [!NOTE]
> Note that all the rules mentioned above only apply to functions triggered by the `orchestrationTrigger` binding. Activity functions triggered by the `activityTrigger` binding and functions which use the `orchestrationClient` binding have no such limitations.

## Durable Tasks
> [!NOTE]
> This section describes internal implementation details of the Durable Task Framework. It is intended to be informative and help make sense of the replay behavior. However, it is not necessary to fully understand this information.

Tasks that can be safely awaited in orchestrator functions are occasionally referred to as *durable tasks*. These are tasks that are created and managed by the Durable Task Framework, such as the tasks returned by <xref:Microsoft.Azure.WebJobs.DurableOrchestrationContext.CallActivityAsync*>, <xref:Microsoft.Azure.WebJobs.DurableOrchestrationContext.WaitForExternalEvent*>, and <xref:Microsoft.Azure.WebJobs.DurableOrchestrationContext.CreateTimer*>.

These *durable tasks* are internally managed using a list of `TaskCompletionSource` objects. During replay, these tasks get created as part of orchestrator code execution and are completed as the dispatcher enumerates the corresponding history events. This is all done synchronously using a single thread until all the history has been replayed. Any durable tasks which are not completed by the end of history replay will have appropriate actions carried out (enqueuing a message to call an activity function, etc.).

The execution behavior described here should help you understand why orchestrator function code must never `await` on a non-durable task: the dispatcher thread cannot wait for it to complete and any callback by that task could potentially corrupt the tracking state of the orchestrator function (though some runtime checks are in place to try and detect and prevent this).

If you'd like more information about how the Durable Task Framework executes orchestrator functions, the best thing to do is to consult the source code on [GitHub](https://github.com/Azure/durabletask). In particular, the following two files will be the most informative, and contain relatively simple logic:

* [TaskOrchestrationExecutor](https://github.com/Azure/durabletask/blob/master/src/DurableTask.Core/TaskOrchestrationExecutor.cs)
* [TaskOrchestrationContext](https://github.com/Azure/durabletask/blob/master/src/DurableTask.Core/TaskOrchestrationContext.cs)

