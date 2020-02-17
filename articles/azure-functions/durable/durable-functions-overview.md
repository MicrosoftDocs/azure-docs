---
title: Durable Functions Overview - Azure
description: Introduction to the Durable Functions extension for Azure Functions.
author: cgillum
ms.topic: overview
ms.date: 08/07/2019
ms.author: cgillum
ms.reviewer: azfuncdf
#Customer intent: As a < type of user >, I want < what? > so that < why? >.
---

# What are Durable Functions?

*Durable Functions* is an extension of [Azure Functions](../functions-overview.md) that lets you write stateful functions in a serverless compute environment. The extension lets you define stateful workflows by writing [*orchestrator functions*](durable-functions-orchestrations.md) and stateful entities by writing [*entity functions*](durable-functions-entities.md) using the Azure Functions programming model. Behind the scenes, the extension manages state, checkpoints, and restarts for you, allowing you to focus on your business logic.

## <a name="language-support"></a>Supported languages

Durable Functions currently supports the following languages:

* **C#**: both [precompiled class libraries](../functions-dotnet-class-library.md) and [C# script](../functions-reference-csharp.md).
* **JavaScript**: supported only for version 2.x of the Azure Functions runtime. Requires version 1.7.0 of the Durable Functions extension, or a later version. 
* **F#**: precompiled class libraries and F# script. F# script is only supported for version 1.x of the Azure Functions runtime.

Durable Functions has a goal of supporting all [Azure Functions languages](../supported-languages.md). See the [Durable Functions issues list](https://github.com/Azure/azure-functions-durable-extension/issues) for the latest status of work to support additional languages.

Like Azure Functions, there are templates to help you develop Durable Functions using [Visual Studio 2019](durable-functions-create-first-csharp.md), [Visual Studio Code](quickstart-js-vscode.md), and the [Azure portal](durable-functions-create-portal.md).

## Application patterns

The primary use case for Durable Functions is simplifying complex, stateful coordination requirements in serverless applications. The following sections describe typical application patterns that can benefit from Durable Functions:

* [Function chaining](#chaining)
* [Fan-out/fan-in](#fan-in-out)
* [Async HTTP APIs](#async-http)
* [Monitoring](#monitoring)
* [Human interaction](#human)
* [Aggregator (stateful entities)](#aggregator)

### <a name="chaining"></a>Pattern #1: Function chaining

In the function chaining pattern, a sequence of functions executes in a specific order. In this pattern, the output of one function is applied to the input of another function.

![A diagram of the function chaining pattern](./media/durable-functions-concepts/function-chaining.png)

You can use Durable Functions to implement the function chaining pattern concisely as shown in the following example.

In this example, the values `F1`, `F2`, `F3`, and `F4` are the names of other functions in the same function app. You can implement control flow by using normal imperative coding constructs. Code executes from the top down. The code can involve existing language control flow semantics, like conditionals and loops. You can include error handling logic in `try`/`catch`/`finally` blocks.

# [C#](#tab/csharp)

```csharp
[FunctionName("Chaining")]
public static async Task<object> Run(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
{
    try
    {
        var x = await context.CallActivityAsync<object>("F1", null);
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

You can use the `context` parameter to invoke other functions by name, pass parameters, and return function output. Each time the code calls `await`, the Durable Functions framework checkpoints the progress of the current function instance. If the process or virtual machine recycles midway through the execution, the function instance resumes from the preceding `await` call. For more information, see the next section, Pattern #2: Fan out/fan in.

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

module.exports = df.orchestrator(function*(context) {
    try {
        const x = yield context.df.callActivity("F1");
        const y = yield context.df.callActivity("F2", x);
        const z = yield context.df.callActivity("F3", y);
        return    yield context.df.callActivity("F4", z);
    } catch (error) {
        // Error handling or compensation goes here.
    }
});
```

You can use the `context.df` object to invoke other functions by name, pass parameters, and return function output. Each time the code calls `yield`, the Durable Functions framework checkpoints the progress of the current function instance. If the process or virtual machine recycles midway through the execution, the function instance resumes from the preceding `yield` call. For more information, see the next section, Pattern #2: Fan out/fan in.

> [!NOTE]
> The `context` object in JavaScript represents the entire [function context](../functions-reference-node.md#context-object). Access the Durable Functions context using the `df` property on the main context.

---

### <a name="fan-in-out"></a>Pattern #2: Fan out/fan in

In the fan out/fan in pattern, you execute multiple functions in parallel and then wait for all functions to finish. Often, some aggregation work is done on the results that are returned from the functions.

![A diagram of the fan out/fan pattern](./media/durable-functions-concepts/fan-out-fan-in.png)

With normal functions, you can fan out by having the function send multiple messages to a queue. Fanning back in is much more challenging. To fan in, in a normal function, you write code to track when the queue-triggered functions end, and then store function outputs.

The Durable Functions extension handles this pattern with relatively simple code:

# [C#](#tab/csharp)

```csharp
[FunctionName("FanOutFanIn")]
public static async Task Run(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
{
    var parallelTasks = new List<Task<int>>();

    // Get a list of N work items to process in parallel.
    object[] workBatch = await context.CallActivityAsync<object[]>("F1", null);
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

The fan-out work is distributed to multiple instances of the `F2` function. The work is tracked by using a dynamic list of tasks. `Task.WhenAll` is called to wait for all the called functions to finish. Then, the `F2` function outputs are aggregated from the dynamic task list and passed to the `F3` function.

The automatic checkpointing that happens at the `await` call on `Task.WhenAll` ensures that a potential midway crash or reboot doesn't require restarting an already completed task.

# [JavaScript](#tab/javascript)

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

The fan-out work is distributed to multiple instances of the `F2` function. The work is tracked by using a dynamic list of tasks. `context.df.Task.all` API is called to wait for all the called functions to finish. Then, the `F2` function outputs are aggregated from the dynamic task list and passed to the `F3` function.

The automatic checkpointing that happens at the `yield` call on `context.df.Task.all` ensures that a potential midway crash or reboot doesn't require restarting an already completed task.

---

> [!NOTE]
> In rare circumstances, it's possible that a crash could happen in the window after an activity function completes but before its completion is saved into the orchestration history. If this happens, the activity function would re-run from the beginning after the process recovers.

### <a name="async-http"></a>Pattern #3: Async HTTP APIs

The async HTTP API pattern addresses the problem of coordinating the state of long-running operations with external clients. A common way to implement this pattern is by having an HTTP endpoint trigger the long-running action. Then, redirect the client to a status endpoint that the client polls to learn when the operation is finished.

![A diagram of the HTTP API pattern](./media/durable-functions-concepts/async-http-api.png)

Durable Functions provides **built-in support** for this pattern, simplifying or even removing the code you need to write to interact with long-running function executions. For example, the Durable Functions quickstart samples ([C#](durable-functions-create-first-csharp.md) and [JavaScript](quickstart-js-vscode.md)) show a simple REST command that you can use to start new orchestrator function instances. After an instance starts, the extension exposes webhook HTTP APIs that query the orchestrator function status. 

The following example shows REST commands that start an orchestrator and query its status. For clarity, some protocol details are omitted from the example.

```
> curl -X POST https://myfunc.azurewebsites.net/orchestrators/DoWork -H "Content-Length: 0" -i
HTTP/1.1 202 Accepted
Content-Type: application/json
Location: https://myfunc.azurewebsites.net/runtime/webhooks/durabletask/b79baf67f717453ca9e86c5da21e03ec

{"id":"b79baf67f717453ca9e86c5da21e03ec", ...}

> curl https://myfunc.azurewebsites.net/runtime/webhooks/durabletask/b79baf67f717453ca9e86c5da21e03ec -i
HTTP/1.1 202 Accepted
Content-Type: application/json
Location: https://myfunc.azurewebsites.net/runtime/webhooks/durabletask/b79baf67f717453ca9e86c5da21e03ec

{"runtimeStatus":"Running","lastUpdatedTime":"2019-03-16T21:20:47Z", ...}

> curl https://myfunc.azurewebsites.net/runtime/webhooks/durabletask/b79baf67f717453ca9e86c5da21e03ec -i
HTTP/1.1 200 OK
Content-Length: 175
Content-Type: application/json

{"runtimeStatus":"Completed","lastUpdatedTime":"2019-03-16T21:20:57Z", ...}
```

Because the Durable Functions runtime manages state for you, you don't need to implement your own status-tracking mechanism.

The Durable Functions extension exposes built-in HTTP APIs that manage long-running orchestrations. You can alternatively implement this pattern yourself by using your own function triggers (such as HTTP, a queue, or Azure Event Hubs) and the [orchestration client binding](durable-functions-bindings.md#orchestration-client). For example, you might use a queue message to trigger termination. Or, you might use an HTTP trigger that's protected by an Azure Active Directory authentication policy instead of the built-in HTTP APIs that use a generated key for authentication.

For more information, see the [HTTP features](durable-functions-http-features.md) article, which explains how you can expose asynchronous, long-running processes over HTTP using the Durable Functions extension.

### <a name="monitoring"></a>Pattern #4: Monitor

The monitor pattern refers to a flexible, recurring process in a workflow. An example is polling until specific conditions are met. You can use a regular [timer trigger](../functions-bindings-timer.md) to address a basic scenario, such as a periodic cleanup job, but its interval is static and managing instance lifetimes becomes complex. You can use Durable Functions to create flexible recurrence intervals, manage task lifetimes, and create multiple monitor processes from a single orchestration.

An example of the monitor pattern is to reverse the earlier async HTTP API scenario. Instead of exposing an endpoint for an external client to monitor a long-running operation, the long-running monitor consumes an external endpoint, and then waits for a state change.

![A diagram of the monitor pattern](./media/durable-functions-concepts/monitor.png)

In a few lines of code, you can use Durable Functions to create multiple monitors that observe arbitrary endpoints. The monitors can end execution when a condition is met, or another function can use the durable orchestration client to terminate the monitors. You can change a monitor's `wait` interval based on a specific condition (for example, exponential backoff.) 

The following code implements a basic monitor:

# [C#](#tab/csharp)

```csharp
[FunctionName("MonitorJobStatus")]
public static async Task Run(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
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

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");
const moment = require("moment");

module.exports = df.orchestrator(function*(context) {
    const jobId = context.df.getInput();
    const pollingInterval = getPollingInterval();
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

---

When a request is received, a new orchestration instance is created for that job ID. The instance polls a status until a condition is met and the loop is exited. A durable timer controls the polling interval. Then, more work can be performed, or the orchestration can end. When `nextCheck` exceeds `expiryTime`, the monitor ends.

### <a name="human"></a>Pattern #5: Human interaction

Many automated processes involve some kind of human interaction. Involving humans in an automated process is tricky because people aren't as highly available and as responsive as cloud services. An automated process might allow for this interaction by using timeouts and compensation logic.

An approval process is an example of a business process that involves human interaction. Approval from a manager might be required for an expense report that exceeds a certain dollar amount. If the manager doesn't approve the expense report within 72 hours (maybe the manager went on vacation), an escalation process kicks in to get the approval from someone else (perhaps the manager's manager).

![A diagram of the human interaction pattern](./media/durable-functions-concepts/approval.png)

You can implement the pattern in this example by using an orchestrator function. The orchestrator uses a [durable timer](durable-functions-timers.md) to request approval. The orchestrator escalates if timeout occurs. The orchestrator waits for an [external event](durable-functions-external-events.md), such as a notification that's generated by a human interaction.

These examples create an approval process to demonstrate the human interaction pattern:

# [C#](#tab/csharp)

```csharp
[FunctionName("ApprovalWorkflow")]
public static async Task Run(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
{
    await context.CallActivityAsync("RequestApproval", null);
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
            await context.CallActivityAsync("Escalate", null);
        }
    }
}
```

To create the durable timer, call `context.CreateTimer`. The notification is received by `context.WaitForExternalEvent`. Then, `Task.WhenAny` is called to decide whether to escalate (timeout happens first) or process the approval (the approval is received before timeout).

# [JavaScript](#tab/javascript)

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

To create the durable timer, call `context.df.createTimer`. The notification is received by `context.df.waitForExternalEvent`. Then, `context.df.Task.any` is called to decide whether to escalate (timeout happens first) or process the approval (the approval is received before timeout).

---

An external client can deliver the event notification to a waiting orchestrator function by using the [built-in HTTP APIs](durable-functions-http-api.md#raise-event):

```bash
curl -d "true" http://localhost:7071/runtime/webhooks/durabletask/instances/{instanceId}/raiseEvent/ApprovalEvent -H "Content-Type: application/json"
```

An event can also be raised using the durable orchestration client from another function in the same function app:

# [C#](#tab/csharp)

```csharp
[FunctionName("RaiseEventToOrchestration")]
public static async Task Run(
    [HttpTrigger] string instanceId,
    [DurableClient] IDurableOrchestrationClient client)
{
    bool isApproved = true;
    await client.RaiseEventAsync(instanceId, "ApprovalEvent", isApproved);
}
```

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

module.exports = async function (context) {
    const client = df.getClient(context);
    const isApproved = true;
    await client.raiseEvent(instanceId, "ApprovalEvent", isApproved);
};
```

---

### <a name="aggregator"></a>Pattern #6: Aggregator (stateful entities)

The sixth pattern is about aggregating event data over a period of time into a single, addressable *entity*. In this pattern, the data being aggregated may come from multiple sources, may be delivered in batches, or may be scattered over long-periods of time. The aggregator might need to take action on event data as it arrives, and external clients may need to query the aggregated data.

![Aggregator diagram](./media/durable-functions-concepts/aggregator.png)

The tricky thing about trying to implement this pattern with normal, stateless functions is that concurrency control becomes a huge challenge. Not only do you need to worry about multiple threads modifying the same data at the same time, you also need to worry about ensuring that the aggregator only runs on a single VM at a time.

You can use [Durable entities](durable-functions-entities.md) to easily implement this pattern as a single function.

# [C#](#tab/csharp)

```csharp
[FunctionName("Counter")]
public static void Counter([EntityTrigger] IDurableEntityContext ctx)
{
    int currentValue = ctx.GetState<int>();
    switch (ctx.OperationName.ToLowerInvariant())
    {
        case "add":
            int amount = ctx.GetInput<int>();
            ctx.SetState(currentValue + amount);
            break;
        case "reset":
            ctx.SetState(0);
            break;
        case "get":
            ctx.Return(currentValue);
            break;
    }
}
```

Durable entities can also be modeled as classes in .NET. This model can be useful if the list of operations is fixed and becomes large. The following example is an equivalent implementation of the `Counter` entity using .NET classes and methods.

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

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

module.exports = df.entity(function(context) {
    const currentValue = context.df.getState(() => 0);
    switch (context.df.operationName) {
        case "add":
            const amount = context.df.getInput();
            context.df.setState(currentValue + amount);
            break;
        case "reset":
            context.df.setState(0);
            break;
        case "get":
            context.df.return(currentValue);
            break;
    }
});
```

---

Clients can enqueue *operations* for (also known as "signaling") an entity function using the [entity client binding](durable-functions-bindings.md#entity-client).

# [C#](#tab/csharp)

```csharp
[FunctionName("EventHubTriggerCSharp")]
public static async Task Run(
    [EventHubTrigger("device-sensor-events")] EventData eventData,
    [DurableClient] IDurableOrchestrationClient entityClient)
{
    var metricType = (string)eventData.Properties["metric"];
    var delta = BitConverter.ToInt32(eventData.Body, eventData.Body.Offset);

    // The "Counter/{metricType}" entity is created on-demand.
    var entityId = new EntityId("Counter", metricType);
    await entityClient.SignalEntityAsync(entityId, "add", delta);
}
```

> [!NOTE]
> Dynamically generated proxies are also available in .NET for signaling entities in a type-safe way. And in addition to signaling, clients can also query for the state of an entity function using [type-safe methods](durable-functions-bindings.md#entity-client-usage) on the orchestration client binding.

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

module.exports = async function (context) {
    const client = df.getClient(context);
    const entityId = new df.EntityId("Counter", "myCounter");
    await context.df.signalEntity(entityId, "add", 1);
};
```

---

Entity functions are available in [Durable Functions 2.0](durable-functions-versions.md) and above.

## The technology

Behind the scenes, the Durable Functions extension is built on top of the [Durable Task Framework](https://github.com/Azure/durabletask), an open-source library on GitHub that's used to build workflows in code. Like Azure Functions is the serverless evolution of Azure WebJobs, Durable Functions is the serverless evolution of the Durable Task Framework. Microsoft and other organizations use the Durable Task Framework extensively to automate mission-critical processes. It's a natural fit for the serverless Azure Functions environment.

## Code constraints

In order to provide reliable and long-running execution guarantees, orchestrator functions have a set of coding rules that must be followed. For more information, see the [Orchestrator function code constraints](durable-functions-code-constraints.md) article.

## Billing

Durable Functions are billed the same as Azure Functions. For more information, see [Azure Functions pricing](https://azure.microsoft.com/pricing/details/functions/). When executing orchestrator functions in the Azure Functions [Consumption plan](../functions-scale.md#consumption-plan), there are some billing behaviors to be aware of. For more information on these behaviors, see the [Durable Functions billing](durable-functions-billing.md) article.

## Jump right in

You can get started with Durable Functions in under 10 minutes by completing one of these language-specific quickstart tutorials:

* [C# using Visual Studio 2019](durable-functions-create-first-csharp.md)
* [JavaScript using Visual Studio Code](quickstart-js-vscode.md)

In both quickstarts, you locally create and test a "hello world" durable function. You then publish the function code to Azure. The function you create orchestrates and chains together calls to other functions.

## Learn more

The following video highlights the benefits of Durable Functions:

> [!VIDEO https://channel9.msdn.com/Shows/Azure-Friday/Durable-Functions-in-Azure-Functions/player] 

For a more in-depth discussion of Durable Functions and the underlying technology, see the following video (it's focused on .NET, but the concepts also apply to other supported languages):

> [!VIDEO https://channel9.msdn.com/Events/dotnetConf/2018/S204/player]

Because Durable Functions is an advanced extension for [Azure Functions](../functions-overview.md), it isn't appropriate for all applications. For a comparison with other Azure orchestration technologies, see [Compare Azure Functions and Azure Logic Apps](../functions-compare-logic-apps-ms-flow-webjobs.md#compare-azure-functions-and-azure-logic-apps).

## Next steps

> [!div class="nextstepaction"]
> [Durable Functions function types and features](durable-functions-types-features-overview.md)
