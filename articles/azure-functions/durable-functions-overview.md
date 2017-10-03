---
title: Durable Functions Overview - Azure Functions
description: Introduction to the Durable Functions extension for Azure Functions.
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

# Durable Functions Overview

## What are Durable Functions?

*Durable Functions* is an extension of Azure Functions and Azure WebJobs that lets you write *long-running*, *stateful* function orchestrations in code in a serverless environment.

A new type of function called the *orchestrator function* allows you to do several new things that differentiate it from an ordinary, stateless function:
* They are stateful workflows **authored in code**. No JSON schemas or designers.
* They can *synchronously* and *asynchronously* **call other functions** and **save output to local variables**.
* They **automatically checkpoint** their progress whenever the function awaits. Local state is never lost if the process recycles or the VM reboots.

> [!NOTE]
> Durable Functions is an advanced extension for Azure Functions and may not be useful for all applications. The rest of this article assumes the reader has a strong familiarity with existing Azure Functions concepts and the challenges involved in serverless application development.

## Patterns

The primary use case for Durable Functions is *simplifying complex, stateful coordination problems* in serverless applications. The following sections describe some typical application patterns that can benefit from Durable Functions.

### Pattern #1: Function Chaining

Function chaining refers to the pattern of executing a sequence of functions in a particular order. Often the output of one function needs to be applied to the input of another function.

![Function chaining diagram](media/durable-functions-overview/function-chaining.png)

Durable Functions allows you to implement this pattern as a simple, easy-to-understand C# function snippet.

```cs
public static async Task<object> Run(DurableOrchestrationContext ctx)
{
    try
    {
        var x = await ctx.CallActivityAsync<object>("F1");
        var y = await ctx.CallActivityAsync<object>("F2", x);
        var z = await ctx.CallActivityAsync<object>("F3", y);
        return  await ctx.CallActivityAsync<object>("F4", z);
    }
    catch (Exception)
    {
        // error handling/compensation goes here
    }
}
```

Generally speaking, this logic is concise and easily understood by any developer. The values "F1", "F2", "F3", and "F4" are the names of other functions in the function app. Control flow is implemented using normal imperative coding constructs. That is, code executes top-down and can involve existing language control flow semantics, like conditionals, loops, and try/catch/finally blocks.  Local variables are used to capture and flow state. If more detailed compensation logic is required, it can be done so naturally with additional try/catch logic.

The built-in `ctx` parameter provides methods for invoking other functions by name, passing parameters, and returning function output. Each time the code calls `await`, the orchestrator function *checkpoints* the progress of the current function instance. If the process or VM recycles midway through the execution, the function instance resumes from the previous `await` call, much like it would if we were using queues in between each function invocation. More on this restart behavior later.

### Pattern #2: Fan out, Fan in

A slightly more interesting pattern enabled by the Durable Functions extension is fan out, fan in.

![Fan out fan in diagram](media/durable-functions-overview/fan-out-fan-in.png)

With normal functions, fanning out can be done by having the function output multiple messages to a queue using an output binding. However, fanning back in is much more challenging because work needs to be done to coordinate and orchestrate the data processing.

The Durable Functions extension is optimized to handle this kind of pattern with a relatively simple code snippet.

```cs
public static async Task Run(DurableOrchestrationContext ctx)
{
    var parallelTasks = new List<Task<int>>();
 
    // get a list of N work items to process in parallel
    object[] workBatch = await ctx.CallActivityAsync<object[]>("F1");
    for (int i = 0; i < workBatch.Length; i++)
    {
        Task<int> task = ctx.CallActivityAsync<int>("F2", workBatch[i]);
        parallelTasks.Add(task);
    }
 
    await Task.WhenAll(parallelTasks);
 
    // aggregate all N outputs and send result to F3
    int sum = parallelTasks.Sum(t => t.Result);
    await ctx.CallActivityAsync("F3", sum);
}
```

As demonstrated by the code, the fan-out work is tracked using a dynamic list of tasks. Then using the existing .NET `Task.WhenAll` API, a continuation can be scheduled which aggregates the outputs from the dynamic task list and passes them on to a third function. The automatic checkpointing that happens at the `await` call on `Task.WhenAll` ensures that any crash or reboot midway through does not require a restart of any already completed tasks.

### Pattern #3: Async HTTP APIs

The third pattern is all about the problem of coordinating the state of long-running operations with external clients. A common way to implement this pattern is by having the long-running action triggered by an HTTP call, and then redirecting the client to a status endpoint that they can poll to learn when the operation completes.

![HTTP API diagram](media/durable-functions-overview/async-http-api.png)

Durable Functions makes implementing these kinds of Async HTTP APIs simple by providing a set of built-in HTTP APIs for interacting with long-running function executions. We show in the samples a simple REST command that can be used to start new orchestrator function instances. Once an instance is started, the durable extension exposes webhook HTTP APIs that can be used to query their status (for clarity, some details have been removed from the example below).

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

Because all the state is managed by the Durable Functions runtime, it's not necessary for you to implement your own status tracking mechanism.

> [!NOTE]
> More information on the HTTP APIs exposed by the Durable Functions extension can be found in the [HTTP APIs](durable-functions-http-api.md) topic.

It's important to point out that even though the Durable Functions extension has built-in webhooks for managing long-running orchestrations, it's entirely possible for you to implement this pattern yourself using your own function triggers (such as HTTP, queue, or Event Hub) and the `orchestrationClient` binding.

```cs
// HTTP-triggered function to start a new orchestrator function instance.
public static async Task<HttpResponseMessage> Run(
    HttpRequestMessage req,
    DurableOrchestrationClient starter,
    string functionName,
    TraceWriter log)
{
    // Function name comes from the request URL.
    // Function input comes from the request content.
    dynamic eventData = await req.Content.ReadAsAsync<object>();
    string instanceId = await starter.StartNewAsync(functionName, eventData);
    
    log.Info($"Started orchestration with ID = '{instanceId}'.");
    
    return starter.CreateCheckStatusResponse(req, instanceId);
}
```

The [DurableOrchestrationClient](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html) `starter` parameter is a value from the `orchestrationClient` output binding, which is part of the Durable Functions extension. It provides methods for starting, sending events to, terminating, and querying for new or existing orchestrator function instances. In the above example, an HTTP triggered-function takes in a `functionName` value from the incoming URL and passes that value to [StartNewAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_StartNewAsync_). This binding API then returns a response that contains a `Location` header and additional information about the instance that can later be used to look up the status of the started instance or terminate it.

### Pattern #4: Stateful Singletons (aka "Reliable Actors")

Most functions have an explicit start and an end and don't directly interact with external event sources. However, orchestrations support a "stateful singleton" pattern that allows them to behave like reliable [actors](https://en.wikipedia.org/wiki/Actor_model) in distributed computing.

![Stateful singleton diagram](media/durable-functions-overview/stateful-singleton.png)

While Durable Functions is by no means a proper implementation of the actor model, orchestrator functions do have many of the same runtime characteristics. For example, they are long-running (possibly endless), stateful, reliable, single-threaded, location-transparent, and globally addressable. This makes orchestrator functions useful for "actor"-like scenarios without the need for a separate framework.

Ordinary Azure Functions is stateless and therefore not suited to implement a stateful singleton pattern. However, the Durable Functions extension makes stateful singleton relatively trivial to implement. The following code is a simple orchestrator function that implements a counter.

```cs
public static async Task Run(DurableOrchestrationContext ctx)
{
    int counterState = ctx.GetInput<int>();

    string operation = await ctx.WaitForExternalEvent<string>("operation");
    if (operation == "incr")
    {
        counterState++;
    }
    else if (operation == "decr")
    {
        counterState--;
    }

    ctx.ContinueAsNew(counterState);
}
```

The above function is what you might describe as an "eternal orchestration" &mdash that is, one that starts and never ends. It executes the following steps:

* Starts with some input value `counterState`.
* Waits indefinitely for a message called `operation`.
* Performs some logic to update its local state.
* "Restarts" itself by calling `ctx.ContinueAsNew`.
* Awaits again indefinitely for the next operation.

### Pattern #5: Human Interaction and Timeouts

Many types of process automation need to involve some kind of human interaction. The tricky thing about involving humans in an automated process is that people are not always as highly available and responsive as cloud services. These automated processes must account for this, and often do so using timeouts and compensation logic.

One example of a business process that involves human interaction is an approval process. One could imagine a system where a manager must approve an expense report that exceeds a certain amount. If the manager does not approve within 72 hours (maybe they went on vacation), then an escalation process kicks in to get the approval from someone else (perhaps the manager's manager).

![Human interaction diagram](media/durable-functions-overview/approval.png)

This kind of pattern can be implemented using an orchestrator function to coordinate a "durable timeout" with an "external event" notification generated by some human interaction.

```cs
public static async Task Run(DurableOrchestrationContext ctx)
{
    await ctx.CallActivityAsync("RequestApproval");
    using (var timeoutCts = new CancellationTokenSource())
    {
        DateTime dueTime = ctx.CurrentUtcDateTime.AddHours(72);
        Task durableTimeout = ctx.CreateTimer(dueTime, timeoutCts.Token);

        Task<bool> approvalEvent = ctx.WaitForExternalEvent<bool>("ApprovalEvent");
        if (approvalEvent == await Task.WhenAny(approvalEvent, durableTimeout))
        {
            timeoutCts.Cancel();
            await ctx.CallActivityAsync("HandleApproval", approvalEvent.Result);
        }
        else
        {
            await ctx.CallActivityAsync("Escalate");
        }
    }
}
```

The important thing to notice here is that the timeout was implemented using `ctx.CreateTimer`, `ctx.WaitForExternalEvent`, and `Task.WhenAny` to synchronize the notification and the timer expiration. Depending on which event occurs first, the orchestrator function takes the appropriate action (escalation or completing the approval process).

## The Technology

Behind the scenes, the Durable Functions extension is built on top of the [Durable Task Framework](https://github.com/Azure/durabletask), an open source library on GitHub for building durable task orchestrations. Much like how Azure Functions is the serverless evolution of Azure WebJobs, Durable Functions is the serverless evolution of the Durable Task Framework. The Durable Task Framework is used heavily within Microsoft and outside as well to automate mission-critical processes and is a natural fit for the serverless Azure Functions environment.

### Event Sourcing, Checkpointing, and Orchestrator Replay

Orchestrator functions reliably maintain their execution state using a cloud design pattern known as [Event Sourcing](https://docs.microsoft.com/en-us/azure/architecture/patterns/event-sourcing). Instead of directly storing the *current* state of an orchestration, the durable extension uses an append-only store to record the *full series of actions* taken by the function orchestration. This has many benefits, including improving performance, scalability, and responsiveness compared to "dumping" the full runtime state. Other benefits include providing eventual consistency for transactional data and maintaining full audit trails/history, which itself can enable reliable compensating actions.

The use of Event Sourcing by this extension is transparent. Under the covers, the `await` operator in an orchestrator function yields control of the orchestrator thread back to the Durable Task Framework dispatcher. The dispatcher then commits any new actions that the orchestrator function scheduled (such as calling one or more child functions or scheduling a durable timer) to storage. This transparent commit action appends to the *execution history* of the orchestration instance to durable storage and subsequently adds messages to a queue to schedule the actual work. At this point, the orchestrator function can be unloaded from memory and billing can be stopped (if using the Azure Functions Consumption Plan) until there is more work to do, at which point its state can be reconstructed.

Once an orchestration function is given more work to do (for example, a response message is received or a durable timer expires), the orchestrator wakes up again and re-executes the entire function from the start in order to rebuild the local state. If during this replay the code tries to call a function (or do any other async work), the Durable Task Framework consults with the *execution history* of the current orchestration. If it finds that the activity function has already executed and yielded some result, it will replay that function's result immediately, and the orchestrator code continues running. This continues happening until the function code gets to a point where either it is finished or it has scheduled new async work.

### Orchestrator Code Constraints

With this replay behavior in mind, there are constraints on the type of code that can be written in an orchestrator function:

* Orchestrator code **must be deterministic** since it is going to be replayed multiple times. This means there cannot be any direct calls to get the current date/time, get random numbers, generate random GUIDs, or call into remote endpoints.
* If orchestrator code needs to get the current date/time, it should use the [CurrentUtcDateTime](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html#Microsoft_Azure_WebJobs_DurableOrchestrationContext_CurrentUtcDateTime) API, which is safe for replay.
* Non-deterministic operations must be done in activity functions. This includes any interaction with other input or output bindings. This ensures that any non-deterministic values will be generated once on the first execution and saved into the execution history. Subsequent executions will then use the saved value automatically.
* Orchestrator code should be **non-blocking** &mdash that is, no `Thread.Sleep` or equivalent APIs. If an orchestrator needs to delay for a period of time, it should use the [CreateTimer](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html#Microsoft_Azure_WebJobs_DurableOrchestrationContext_CreateTimer_) API.
* Orchestrator code must never initiate any async operation outside of the operations exposed by [DurableOrchestrationContext](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html) &mdash, for example, no `Task.Run`, `Task.Delay` or `HttpClient.SendAsync`. The Durable Task Framework executes orchestrator code on a single thread and cannot interact with any other threads that could be scheduled by other async APIs.
* Because the Durable Task Framework saves execution history as the orchestration function progresses, **infinite loops should be avoided** to ensure orchestrator instances do not run out of memory. Instead, APIs such as [ContinueAsNew](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html#Microsoft_Azure_WebJobs_DurableOrchestrationContext_ContinueAsNew_) should be used to restart the function execution and discard previous execution history.

While these constraints may seem daunting at first, in practice they are easy to follow. Where possible, the Durable Task Framework attempts to detect violations of the above rules and throws a `NonDeterministicOrchestrationException`. However, this detection behavior is best-effort, and orchestrator code should never depend on it.

> [!NOTE]
> All the rules mentioned above only apply to functions triggered by the `orchestrationTrigger` binding. Activity functions triggered by the `activityTrigger` binding, and functions that use the `orchestrationClient` binding, have no such limitations.

## Language Support

Currently C# is the only supported language for Durable Functions. This includes authoring orchestrator functions and activity functions. In the future, we will add support for all languages supported by Azure Functions.

> [!NOTE]
> See our [GitHub repository issues list](https://github.com/Azure/azure-functions-durable-extension/issues) to submit requests or to see the latest status of our additional language support work.

## Monitoring and Diagnostics

The Durable Functions host extension automatically emits structured tracking data to [Application Insights](https://azure.microsoft.com/en-us/services/application-insights/) when the function app is configured with an Application Insights key. This tracking data can be used to monitor the behavior and progress of your orchestrations.

Here is an example of what the Durable Functions tracking events look like in the Application Insights portal using [Application Insights Analytics](https://docs.microsoft.com/en-us/azure/application-insights/app-insights-analytics):

![App Insights query results](media/durable-functions-overview/app-insights-1.png)

There is a lot of useful structured data packed into the `customDimensions` field in each log entry. Here is an example of one such entry fully expanded.

![customDimensions field in App Insights query](media/durable-functions-overview/app-insights-2.png)

Because of the replay behavior of the Durable Task Framework dispatcher, you can expect to see redundant log entries for replayed actions. This can be useful to understand the replay behavior of the core engine. If you would like to see just the "real-time" logs, you can modify the example query above with a `isReplay == false` filter.

> [!NOTE]
> For more information and samples related to monitoring and diagnostics, see the [Diagnostics](durable-functions-diagnostics.md) topic. General information on monitoring in Azure Functions can be found in the [Monitoring Azure Functions](functions-monitoring.md) documentation.

## Storage and Scalability

The Durable Functions extension uses Azure Storage queues, tables, and blobs to persist execution history state and use messages to trigger function execution. The default storage account for the function app can be used, or you can configure a separate storage account to create greater isolation in terms of storage throughput limits. The orchestrator code you write does not need to (and should not) interact with the entities in these storage accounts. The entities are managed directly by the Durable Task Framework as an implementation detail.

Orchestrator functions schedule activity functions and receive their responses via internal queue messages. When running in the Azure Functions Consumption plan, these queues are monitored by the [Azure Functions Scale Controller](functions-scale.md#how-the-consumption-plan-works) and new compute instances are added as needed. When scaled out to multiple VMs, an orchestrator function may run on one VM while activity functions it calls run on several different VMs.

> [!NOTE]
> You can find more details on the scale behavior of Durable Functions in the [Performance and scale](durable-functions-perf-and-scale.md) topic.

Lastly, table storage is used to store the execution history for orchestrator accounts. Whenever an instance rehydrates on a particular VM, it fetches its execution history from table storage so that it can rebuild its local state. One of the convenient things about having the history available in Table storage is that you can take a look and see the history of your orchestrations using tools such as [Microsoft Azure Storage Explorer](https://docs.microsoft.com/azure/vs-azure-tools-storage-manage-with-storage-explorer).

![Azure Storage Explorer screen shot](media/durable-functions-overview/storage-explorer.png)

> [!WARNING]
> While it's easy and convenient to see execution history in table storage, you should avoid taking any dependency on this table, as the specifics of its usage may change prior to the general availability of the Durable Functions extension.

## Next steps

> [!div class="nextstepaction"]
> [Install the Durable Functions extension](durable-functions-install.md)


