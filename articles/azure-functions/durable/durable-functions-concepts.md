---
title: Durable Functions patterns and technical concepts in Azure Functions
description: Learn how the Durable Functions extension in Azure Functions gives you the benefits of stateful code execution in the cloud.
services: functions
author: ggailey777
manager: jeconnoc
keywords:
ms.service: azure-functions
ms.devlang: multiple
ms.topic: conceptual
ms.date: 12/06/2018
ms.author: azfuncdf
#Customer intent: As a developer, I want to understand the core concepts and patterns that Azure Durable Functions supports, so I can evaluate this technology to solve my application development challenges.
---

# Durable Functions patterns and technical concepts (Azure Functions)

Durable Functions is an extension of [Azure Functions](../functions-overview.md) and [Azure WebJobs](../../app-service/web-sites-create-web-jobs.md). You can use Durable Functions to write stateful functions in a serverless environment. The extension manages state, checkpoints, and restarts for you. 

This article gives you detailed information about the behaviors of the Durable Functions extension for Azure Functions and common implementation patterns. The information can help you determine how to use Durable Functions to help solve your development challenges.

> [!NOTE]
> Durable Functions is an advanced extension for Azure Functions that isn't appropriate for all applications. This article assumes that you have a strong familiarity with concepts in [Azure Functions](../functions-overview.md) and the challenges involved in serverless application development.

## Patterns

This section describes some common application patterns where Durable Functions can be useful.

### <a name="chaining"></a>Pattern #1: Function chaining

In the function chaining pattern, a sequence of functions executes in a specific order. In this pattern, the output of one function is applied to the input of another function.

![A diagram of the function chaining pattern](./media/durable-functions-concepts/function-chaining.png)

You can use Durable Functions to implement the function chaining pattern concisely as shown in the following example:

#### C# script

```csharp
public static async Task<object> Run(DurableOrchestrationContext context)
{
    try
    {
        var x = await context.CallActivityAsync<object>("F1");
        var y = await context.CallActivityAsync<object>("F2", x);
        var z = await context.CallActivityAsync<object>("F3", y);
        return  await context.CallActivityAsync<object>("F4", z);
    }
    catch (Exception)
    {
        // Error handling or compensation goes here.
    }
}
```

> [!NOTE]
> There are subtle differences between writing a precompiled durable function in C# and writing a precompiled durable function in the C# script that's shown in the example. In a C# precompiled function, durable parameters must be decorated with respective attributes. An example is the `[OrchestrationTrigger]` attribute for the `DurableOrchestrationContext` parameter. In a C# precompiled durable function, if the parameters aren't properly decorated, the runtime can't inject the variables into the function, and an error occurs. For more examples, see the [azure-functions-durable-extension samples on GitHub](https://github.com/Azure/azure-functions-durable-extension/blob/master/samples).

#### JavaScript (Functions 2.x only)

```javascript
const df = require("durable-functions");

module.exports = df.orchestrator(function*(context) {
    const x = yield context.df.callActivity("F1");
    const y = yield context.df.callActivity("F2", x);
    const z = yield context.df.callActivity("F3", y);
    return yield context.df.callActivity("F4", z);
});
```

In this example, the values `F1`, `F2`, `F3`, and `F4` are the names of other functions in the function app. You can implement control flow by using normal imperative coding constructs. Code executes from the top down. The code can involve existing language control flow semantics, like conditionals and loops. You can include error handling logic in `try`/`catch`/`finally` blocks.

You can use the `context` parameter [DurableOrchestrationContext] \(.NET\) and the `context.df` object (JavaScript) to invoke other functions by name, pass parameters, and return function output. Each time the code calls `await` (C#) or `yield` (JavaScript), the Durable Functions framework checkpoints the progress of the current function instance. If the process or VM recycles midway through the execution, the function instance resumes from the preceding `await` or `yield` call. For more information, see the next section, Pattern #2: Fan out/fan in.

> [!NOTE]
> The `context` object in JavaScript represents the entire [function context](../functions-reference-node.md#context-object), not only the [DurableOrchestrationContext] parameter.

### <a name="fan-in-out"></a>Pattern #2: Fan out/fan in

In the fan out/fan in pattern, you execute multiple functions in parallel and then wait for all functions to finish. Often, some aggregation work is done on the results that are returned from the functions.

![A diagram of the fan out/fan pattern](./media/durable-functions-concepts/fan-out-fan-in.png)

With normal functions, you can fan out by having the function send multiple messages to a queue. Fanning back in is much more challenging. To fan in, in a normal function, you write code to track when the queue-triggered functions end, and then store function outputs. 

The Durable Functions extension handles this pattern with relatively simple code:

#### C# script

```csharp
public static async Task Run(DurableOrchestrationContext context)
{
    var parallelTasks = new List<Task<int>>();

    // Get a list of N work items to process in parallel.
    object[] workBatch = await context.CallActivityAsync<object[]>("F1");
    for (int i = 0; i < workBatch.Length; i++)
    {
        Task<int> task = context.CallActivityAsync<int>("F2", workBatch[i]);
        parallelTasks.Add(task);
    }

    await Task.WhenAll(parallelTasks);

    // Aggregate all N outputs and send the result to F3.
    int sum = parallelTasks.Sum(t => t.Result);
    await context.CallActivityAsync("F3", sum);
}
```

#### JavaScript (Functions 2.x only)

```javascript
const df = require("durable-functions");

module.exports = df.orchestrator(function*(context) {
    const parallelTasks = [];

    // Get a list of N work items to process in parallel.
    const workBatch = yield context.df.callActivity("F1");
    for (let i = 0; i < workBatch.length; i++) {
        parallelTasks.push(context.df.callActivity("F2", workBatch[i]));
    }

    yield context.df.Task.all(parallelTasks);

    // Aggregate all N outputs and send the result to F3.
    const sum = parallelTasks.reduce((prev, curr) => prev + curr, 0);
    yield context.df.callActivity("F3", sum);
});
```

The fan-out work is distributed to multiple instances of the `F2` function. The work is tracked by using a dynamic list of tasks. The .NET `Task.WhenAll` API or JavaScript `context.df.Task.all` API is called, to wait for all the called functions to finish. Then, the `F2` function outputs are aggregated from the dynamic task list and passed to the `F3` function.

The automatic checkpointing that happens at the `await` or `yield` call on `Task.WhenAll` or `context.df.Task.all` ensures that a potential midway crash or reboot doesn't require restarting an already completed task.

### <a name="async-http"></a>Pattern #3: Async HTTP APIs

The async HTTP APIs pattern addresses the problem of coordinating the state of long-running operations with external clients. A common way to implement this pattern is by having an HTTP call trigger the long-running action. Then, redirect the client to a status endpoint that the client polls to learn when the operation is finished.

![A diagram of the HTTP API pattern](./media/durable-functions-concepts/async-http-api.png)

Durable Functions provides built-in APIs that simplify the code you write to interact with long-running function executions. The Durable Functions quickstart samples ([C#](durable-functions-create-first-csharp.md) and [JavaScript](quickstart-js-vscode.md)) show a simple REST command that you can use to start new orchestrator function instances. After an instance starts, the extension exposes webhook HTTP APIs that query the orchestrator function status. 

The following example shows REST commands that start an orchestrator and query its status. For clarity, some details are omitted from the example.

```
> curl -X POST https://myfunc.azurewebsites.net/orchestrators/DoWork -H "Content-Length: 0" -i
HTTP/1.1 202 Accepted
Content-Type: application/json
Location: https://myfunc.azurewebsites.net/admin/extensions/DurableTaskExtension/b79baf67f717453ca9e86c5da21e03ec

{"id":"b79baf67f717453ca9e86c5da21e03ec", ...}

> curl https://myfunc.azurewebsites.net/admin/extensions/DurableTaskExtension/b79baf67f717453ca9e86c5da21e03ec -i
HTTP/1.1 202 Accepted
Content-Type: application/json
Location: https://myfunc.azurewebsites.net/admin/extensions/DurableTaskExtension/b79baf67f717453ca9e86c5da21e03ec

{"runtimeStatus":"Running","lastUpdatedTime":"2017-03-16T21:20:47Z", ...}

> curl https://myfunc.azurewebsites.net/admin/extensions/DurableTaskExtension/b79baf67f717453ca9e86c5da21e03ec -i
HTTP/1.1 200 OK
Content-Length: 175
Content-Type: application/json

{"runtimeStatus":"Completed","lastUpdatedTime":"2017-03-16T21:20:57Z", ...}
```

Because the Durable Functions runtime manages state, you don't need to implement your own status-tracking mechanism.

The Durable Functions extension has built-in webhooks that manage long-running orchestrations. You can implement this pattern yourself by using your own function triggers (such as HTTP, a queue, or Azure Event Hubs) and the `orchestrationClient` binding. For example, you might use a queue message to trigger termination. Or, you might use an HTTP trigger that's protected by an Azure Active Directory authentication policy instead of the built-in webhooks that use a generated key for authentication.

Here are some examples of how to use the HTTP API pattern:

#### C#

```csharp
// An HTTP-triggered function starts a new orchestrator function instance.
public static async Task<HttpResponseMessage> Run(
    HttpRequestMessage req,
    DurableOrchestrationClient starter,
    string functionName,
    ILogger log)
{
    // The function name comes from the request URL.
    // The function input comes from the request content.
    dynamic eventData = await req.Content.ReadAsAsync<object>();
    string instanceId = await starter.StartNewAsync(functionName, eventData);

    log.LogInformation($"Started orchestration with ID = '{instanceId}'.");

    return starter.CreateCheckStatusResponse(req, instanceId);
}
```

#### JavaScript (Functions 2.x only)

```javascript
// An HTTP-triggered function starts a new orchestrator function instance.
const df = require("durable-functions");

module.exports = async function (context, req) {
    const client = df.getClient(context);

    // The function name comes from the request URL.
    // The function input comes from the request content.
    const eventData = req.body;
    const instanceId = await client.startNew(req.params.functionName, undefined, eventData);

    context.log(`Started orchestration with ID = '${instanceId}'.`);

    return client.createCheckStatusResponse(req, instanceId);
};
```

In .NET, the [DurableOrchestrationClient](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html) `starter` parameter is a value from the `orchestrationClient` output binding, which is part of the Durable Functions extension. In JavaScript, this object is returned by calling `df.getClient(context)`. These objects provide methods you can use to start, send events to, terminate, and query for new or existing orchestrator function instances.

In the preceding examples, an HTTP-triggered function takes in a `functionName` value from the incoming URL and passes the value to [StartNewAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_StartNewAsync_). The [CreateCheckStatusResponse](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_CreateCheckStatusResponse_System_Net_Http_HttpRequestMessage_System_String_) binding API then returns a response that contains a `Location` header and additional information about the instance. You can use the information later to look up the status of the started instance or to terminate the instance.

### <a name="monitoring"></a>Pattern #4: Monitor

The monitor pattern refers to a flexible, recurring process in a workflow. An example is polling until specific conditions are met. You can use a regular [timer trigger](../functions-bindings-timer.md) to address a basic scenario, such as a periodic cleanup job, but its interval is static and managing instance lifetimes becomes complex. You can use Durable Functions to create flexible recurrence intervals, manage task lifetimes, and create multiple monitor processes from a single orchestration.

An example of the monitor pattern is to reverse the earlier async HTTP API scenario. Instead of exposing an endpoint for an external client to monitor a long-running operation, the long-running monitor consumes an external endpoint, and then waits for a state change.

![A diagram of the monitor pattern](./media/durable-functions-concepts/monitor.png)

In a few lines of code, you can use Durable Functions to create multiple monitors that observe arbitrary endpoints. The monitors can end execution when a condition is met, or the [DurableOrchestrationClient](durable-functions-instance-management.md) can terminate the monitors. You can change a monitor's `wait` interval based on a specific condition (for example, exponential backoff.) 

The following code implements a basic monitor:

#### C# script

```csharp
public static async Task Run(DurableOrchestrationContext context)
{
    int jobId = context.GetInput<int>();
    int pollingInterval = GetPollingInterval();
    DateTime expiryTime = GetExpiryTime();

    while (context.CurrentUtcDateTime < expiryTime)
    {
        var jobStatus = await context.CallActivityAsync<string>("GetJobStatus", jobId);
        if (jobStatus == "Completed")
        {
            // Perform an action when a condition is met.
            await context.CallActivityAsync("SendAlert", machineId);
            break;
        }

        // Orchestration sleeps until this time.
        var nextCheck = context.CurrentUtcDateTime.AddSeconds(pollingInterval);
        await context.CreateTimer(nextCheck, CancellationToken.None);
    }

    // Perform more work here, or let the orchestration end.
}
```

#### JavaScript (Functions 2.x only)

```javascript
const df = require("durable-functions");
const moment = require("moment");

module.exports = df.orchestrator(function*(context) {
    const jobId = context.df.getInput();
    const pollingInternal = getPollingInterval();
    const expiryTime = getExpiryTime();

    while (moment.utc(context.df.currentUtcDateTime).isBefore(expiryTime)) {
        const jobStatus = yield context.df.callActivity("GetJobStatus", jobId);
        if (jobStatus === "Completed") {
            // Perform an action when a condition is met.
            yield context.df.callActivity("SendAlert", machineId);
            break;
        }

        // Orchestration sleeps until this time.
        const nextCheck = moment.utc(context.df.currentUtcDateTime).add(pollingInterval, 's');
        yield context.df.createTimer(nextCheck.toDate());
    }

    // Perform more work here, or let the orchestration end.
});
```

When a request is received, a new orchestration instance is created for that job ID. The instance polls a status until a condition is met and the loop is exited. A durable timer controls the polling interval. Then, more work can be performed, or the orchestration can end. When the `context.CurrentUtcDateTime` (.NET) or `context.df.currentUtcDateTime` (JavaScript) exceeds the `expiryTime` value, the monitor ends.

### <a name="human"></a>Pattern #5: Human interaction

Many automated processes involve some kind of human interaction. Involving humans in an automated process is tricky because people aren't as highly available and as responsive as cloud services. An automated process might allow for this by using timeouts and compensation logic.

An approval process is an example of a business process that involves human interaction. Approval from a manager might be required for an expense report that exceeds a certain dollar amount. If the manager doesn't approve the expense report within 72 hours (maybe the manager went on vacation), an escalation process kicks in to get the approval from someone else (perhaps the manager's manager).

![A diagram of the human interaction pattern](./media/durable-functions-concepts/approval.png)

You can implement the pattern in this example by using an orchestrator function. The orchestrator uses a [durable timer](durable-functions-timers.md) to request approval. The orchestrator escalates if timeout occurs. The orchestrator waits for an [external event](durable-functions-external-events.md), such as a notification that's generated by a human interaction.

These examples create an approval process to demonstrate the human interaction pattern:

#### C# script

```csharp
public static async Task Run(DurableOrchestrationContext context)
{
    await context.CallActivityAsync("RequestApproval");
    using (var timeoutCts = new CancellationTokenSource())
    {
        DateTime dueTime = context.CurrentUtcDateTime.AddHours(72);
        Task durableTimeout = context.CreateTimer(dueTime, timeoutCts.Token);

        Task<bool> approvalEvent = context.WaitForExternalEvent<bool>("ApprovalEvent");
        if (approvalEvent == await Task.WhenAny(approvalEvent, durableTimeout))
        {
            timeoutCts.Cancel();
            await context.CallActivityAsync("ProcessApproval", approvalEvent.Result);
        }
        else
        {
            await context.CallActivityAsync("Escalate");
        }
    }
}
```

#### JavaScript (Functions 2.x only)

```javascript
const df = require("durable-functions");
const moment = require('moment');

module.exports = df.orchestrator(function*(context) {
    yield context.df.callActivity("RequestApproval");

    const dueTime = moment.utc(context.df.currentUtcDateTime).add(72, 'h');
    const durableTimeout = context.df.createTimer(dueTime.toDate());

    const approvalEvent = context.df.waitForExternalEvent("ApprovalEvent");
    if (approvalEvent === yield context.df.Task.any([approvalEvent, durableTimeout])) {
        durableTimeout.cancel();
        yield context.df.callActivity("ProcessApproval", approvalEvent.result);
    } else {
        yield context.df.callActivity("Escalate");
    }
});
```

To create the durable timer, call `context.CreateTimer` (.NET) or `context.df.createTimer` (JavaScript). The notification is received by `context.WaitForExternalEvent` (.NET) or `context.df.waitForExternalEvent` (JavaScript). Then, `Task.WhenAny` (.NET) or `context.df.Task.any` (JavaScript) is called to decide whether to escalate (timeout happens first) or process the approval (the approval is received before timeout).

An external client can deliver the event notification to a waiting orchestrator function by using either the [built-in HTTP APIs](durable-functions-http-api.md#raise-event) or by using the [DurableOrchestrationClient.RaiseEventAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_RaiseEventAsync_System_String_System_String_System_Object_) API from another function:

```csharp
public static async Task Run(string instanceId, DurableOrchestrationClient client)
{
    bool isApproved = true;
    await client.RaiseEventAsync(instanceId, "ApprovalEvent", isApproved);
}
```

```javascript
const df = require("durable-functions");

module.exports = async function (context) {
    const client = df.getClient(context);
    const isApproved = true;
    await client.raiseEvent(instanceId, "ApprovalEvent", isApproved);
};
```

### <a name="aggregator"></a>Pattern #6: Aggregator (preview)

The sixth pattern is about aggregating event data over a period of time into a single, addressable *entity*. In this pattern, the data being aggregated may come from multiple sources, may be delivered in batches, or may be scattered over long-periods of time. The aggregator might need to take action on event data as it arrives, and external clients may need to query the aggregated data.

![Aggregator diagram](./media/durable-functions-concepts/aggregator.png)

The tricky thing about trying to implement this pattern with normal, stateless functions is that concurrency control becomes a huge challenge. Not only do you need to worry about multiple threads modifying the same data at the same time, you also need to worry about ensuring that the aggregator only runs on a single VM at a time.

Using a [Durable Entity function](durable-functions-preview.md#entity-functions), one can implement this pattern easily as a single function.

```csharp
[FunctionName("Counter")]
public static void Counter([EntityTrigger] IDurableEntityContext ctx)
{
    int currentValue = ctx.GetState<int>();

    switch (ctx.OperationName.ToLowerInvariant())
    {
        case "add":
            int amount = ctx.GetInput<int>();
            currentValue += operand;
            break;
        case "reset":
            currentValue = 0;
            break;
        case "get":
            ctx.Return(currentValue);
            break;
    }

    ctx.SetState(currentValue);
}
```

Durable Entities can also be modeled as .NET classes. This can be useful if the list of operations becomes large and if it is mostly static. The following example is an equivalent implementation of the `Counter` entity using .NET classes and methods.

```csharp
public class Counter
{
    [JsonProperty("value")]
    public int CurrentValue { get; set; }

    public void Add(int amount) => this.CurrentValue += amount;
    
    public void Reset() => this.CurrentValue = 0;
    
    public int Get() => this.CurrentValue;

    [FunctionName(nameof(Counter))]
    public static Task Run([EntityTrigger] IDurableEntityContext ctx)
        => ctx.DispatchAsync<Counter>();
}
```

Clients can enqueue *operations* for (also known as "signaling") an entity function using the `orchestrationClient` binding.

```csharp
[FunctionName("EventHubTriggerCSharp")]
public static async Task Run(
    [EventHubTrigger("device-sensor-events")] EventData eventData,
    [OrchestrationClient] IDurableOrchestrationClient entityClient)
{
    var metricType = (string)eventData.Properties["metric"];
    var delta = BitConverter.ToInt32(eventData.Body, eventData.Body.Offset);

    // The "Counter/{metricType}" entity is created on-demand.
    var entityId = new EntityId("Counter", metricType);
    await entityClient.SignalEntityAsync(entityId, "add", delta);
}
```

Dynamically generated proxies are also available for signaling entities in a type-safe way. And in addition to signaling, clients can also query for the state of an entity function using methods on the `orchestrationClient` binding.

> [!NOTE]
> Entity functions are currently only available in the [Durable Functions 2.0 preview](durable-functions-preview.md).

## The technology

Behind the scenes, the Durable Functions extension is built on top of the [Durable Task Framework](https://github.com/Azure/durabletask), an open-source library on GitHub that's used to build durable task orchestrations. Like Azure Functions is the serverless evolution of Azure WebJobs, Durable Functions is the serverless evolution of the Durable Task Framework. Microsoft and other organizations use the Durable Task Framework extensively to automate mission-critical processes. It's a natural fit for the serverless Azure Functions environment.

### Event sourcing, checkpointing, and replay

Orchestrator functions reliably maintain their execution state by using the [event sourcing](https://docs.microsoft.com/azure/architecture/patterns/event-sourcing) design pattern. Instead of directly storing the current state of an orchestration, the Durable Functions extension uses an append-only store to record the full series of actions the function orchestration takes. An append-only store has many benefits compared to "dumping" the full runtime state. Benefits include increased performance, scalability, and responsiveness. You also get eventual consistency for transactional data and full audit trails and history. The audit trails support reliable compensating actions.

Durable Functions uses event sourcing transparently. Behind the scenes, the `await` (C#) or `yield` (JavaScript) operator in an orchestrator function yields control of the orchestrator thread back to the Durable Task Framework dispatcher. The dispatcher then commits any new actions that the orchestrator function scheduled (such as calling one or more child functions or scheduling a durable timer) to storage. The transparent commit action appends to the execution history of the orchestration instance. The history is stored in a storage table. The commit action then adds messages to a queue to schedule the actual work. At this point, the orchestrator function can be unloaded from memory. 

Billing for the orchestrator function stops if you're using the Azure Functions consumption plan. When there's more work to do, the function restarts, and its state is reconstructed.

When an orchestration function is given more work to do (for example, a response message is received or a durable timer expires), the orchestrator wakes up and re-executes the entire function from the start to rebuild the local state. 

During the replay, if the code tries to call a function (or do any other async work), the Durable Task Framework consults the execution history of the current orchestration. If it finds that the [activity function](durable-functions-types-features-overview.md#activity-functions) has already executed and yielded a result, it replays that function's result and the orchestrator code continues to run. Replay continues until the function code is finished or until it has scheduled new async work.

### Orchestrator code constraints

The replay behavior of orchestrator code creates constraints on the type of code that you can write in an orchestrator function. For example, orchestrator code must be deterministic because it will be replayed multiple times, and it must produce the same result each time. For the complete list of constraints, see [Orchestrator code constraints](durable-functions-checkpointing-and-replay.md#orchestrator-code-constraints).

## Monitoring and diagnostics

The Durable Functions extension automatically emits structured tracking data to [Application Insights](../functions-monitoring.md) if you set up your function app with an Azure Application Insights instrumentation key. You can use the tracking data to monitor the actions and progress of your orchestrations.

Here's an example of what the Durable Functions tracking events look like in the Application Insights portal when you use [Application Insights Analytics](../../application-insights/app-insights-analytics.md):

![Application Insights query results](./media/durable-functions-concepts/app-insights-1.png)

You can find useful structured data in the `customDimensions` field in each log entry. Here's an example of an entry that is fully expanded:

![The customDimensions field in an Application Insights query](./media/durable-functions-concepts/app-insights-2.png)

Because of the replay behavior of the Durable Task Framework dispatcher, you can expect to see redundant log entries for replayed actions. Redundant log entries can help you understand the replay behavior of the core engine. The [Diagnostics](durable-functions-diagnostics.md) article shows sample queries that filter out replay logs, so you can see just the "real-time" logs.

## Storage and scalability

The Durable Functions extension uses queues, tables, and blobs in Azure Storage to persist execution history state and trigger function execution. You can use the default storage account for the function app, or you can configure a separate storage account. You might want a separate account based on storage throughput limits. The orchestrator code you write doesn't interact with the entities in these storage accounts. The Durable Task Framework manages the entities directly as an implementation detail.

Orchestrator functions schedule activity functions and receive their responses via internal queue messages. When a function app runs in the Azure Functions consumption plan, the [Azure Functions scale controller](../functions-scale.md#how-the-consumption-and-premium-plans-work) monitors these queues. New compute instances are added as needed. When scaled out to multiple VMs, an orchestrator function might run on one VM, while activity functions that the orchestrator function calls might run on several different VMs. For more information about the scale behavior of Durable Functions, see [Performance and scale](durable-functions-perf-and-scale.md).

The execution history for orchestrator accounts is stored in table storage. Whenever an instance rehydrates on a particular VM, the orchestrator fetches its execution history from table storage so it can rebuild its local state. A convenient aspect of having the history available in table storage is that you can use tools like [Azure Storage Explorer](../../vs-azure-tools-storage-manage-with-storage-explorer.md) to see the history of your orchestrations.

Storage blobs are primarily used as a leasing mechanism to coordinate the scale-out of orchestration instances across multiple VMs. Storage blobs hold data for large messages that can't be stored directly in tables or queues.

![A screenshot of Azure Storage Explorer](./media/durable-functions-concepts/storage-explorer.png)

> [!NOTE]
> Although it's easy and convenient to see execution history in table storage, don't make any dependencies on this table. The table might change as the Durable Functions extension evolves.

## Known issues

All known issues should be tracked in the [GitHub issues](https://github.com/Azure/azure-functions-durable-extension/issues) list. If you run into a problem and can't find the issue in GitHub, open a new issue. Include a detailed description of the problem.

## Next steps

To learn more about Durable Functions, see [Durable Functions function types and features](durable-functions-types-features-overview.md). 

To get started:

> [!div class="nextstepaction"]
> [Create your first durable function](durable-functions-create-first-csharp.md)

[DurableOrchestrationContext]: https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html
