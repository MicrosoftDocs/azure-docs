---
title: Configure Versioning for Durable Task Scheduler (preview)
description: Learn how to use orchestration versioning in Durable Task Scheduler.
ms.topic: how-to
ms.date: 12/03/2025
author: halspang
ms.author: azfuncdf
ms.reviewer: hannahhunter
zone_pivot_groups: df-languages
---

# Orchestration Versioning (preview)

Upgrading and downgrading orchestrations is a key consideration when working with durable orchestration systems. If an orchestration is interrupted and later resumed (for instance, during a host update), Durable Task Scheduler replays the events of the orchestration, ensuring all previous steps were executed successfully before taking the next step. This action ensures reliability, one of the core promises of the durable execution paradigm. 

If an orchestration changes between deployments, the steps it takes may no longer be the same. In this case, the system throws a `NonDeterministicError`, instead of allowing the orchestration to continue. 

_Orchestration versioning_ prevents problems related to nondeterminism, allowing you to work seamlessly with new (or old) orchestrations. Durable Task Scheduler has two different styles of versioning, which you can use separately or together:
- [Client/context-based conditional versioning](#clientcontext-based-conditional-versioning)
- [Worker-based versioning](#worker-based-versioning)

::: zone pivot="javascript"

[!INCLUDE [preview-sample-limitations](./includes/preview-sample-limitations.md)]

::: zone-end

::: zone pivot="powershell"

[!INCLUDE [preview-sample-limitations](./includes/preview-sample-limitations.md)]

::: zone-end

::: zone pivot="java,python,csharp"

## Client/context-based conditional versioning

In order for an orchestration to have a version, you must first set it in the client.

::: zone-end

::: zone pivot="csharp"

The .NET SDK uses the standard host builder extensions.

> [!NOTE]
> Available in the .NET SDK (`Microsoft.DurableTask.Client.AzureManaged`) since v1.9.0.

```csharp
builder.Services.AddDurableTaskClient(builder =>
{
    builder.UseDurableTaskScheduler(connectionString);
    builder.UseDefaultVersion("1.0.0");
});
```

::: zone-end

::: zone pivot="java"

> [!NOTE]
> Available in the Java SDK (`com.microsoft:durabletask-client`) since v1.6.0.

```java
public DurableTaskClient durableTaskClient(DurableTaskProperties properties) {
    // Create client using Azure-managed extensions
    return DurableTaskSchedulerClientExtensions.createClientBuilder(properties.getConnectionString())
        .defaultVersion("1.0")
        .build();
}
```

::: zone-end

::: zone pivot="python"

```python
 c = DurableTaskSchedulerClient(host_address=endpoint, secure_channel=secure_channel,
                                   taskhub=taskhub_name, token_credential=credential,
                                   default_version="1.0.0")
```


::: zone-end

::: zone pivot="csharp"

Once you add the version to the client, any orchestration started by this host uses the version `1.0.0`. The version is a simple string and accepts any value. However, the SDK tries to convert it to .NET's `System.Version`. 
- If it _can_ be converted, that library is used for comparison.
- If _not,_ a simple string comparison is used.

Supplying the version in the client also makes it available in the `TaskOrchestrationContext`, meaning you can use the version in conditional statements. As long as newer orchestration versions have the appropriate version gating, both the old and new orchestration versions can run together on the same host. 

**Example:**

```csharp
[DurableTask]
class HelloCities : TaskOrchestrator<string, List<string>>
{
    private readonly string[] Cities = ["Seattle", "Amsterdam", "Hyderabad", "Kuala Lumpur", "Shanghai", "Tokyo"];

    public override async Task<List<string>> RunAsync(TaskOrchestrationContext context, string input)
    {
        List<string> results = [];
        foreach (var city in Cities)
        {
            results.Add(await context.CallSayHelloAsync($"{city} v{context.Version}"));
            if (context.CompareVersionTo("2.0.0") >= 0)
            {
                results.Add(await context.CallSayGoodbyeAsync($"{city} v{context.Version}"));
            }
        }

        Console.WriteLine("HelloCities orchestration completed.");
        return results;
    }
}
```

::: zone-end

::: zone pivot="java"

Once you add the version to the client, any orchestration started by this client uses the version `1.0.0`. The version is a simple string and accepts any value. 

Supplying the version in the client also makes it available in `TaskOrchestration`, meaning you can use the version in conditional statements. As long as newer orchestration versions have the appropriate version gating, both the old and new orchestration versions can run together on the same client. 

**Example:**

```java
public TaskOrchestration create() {
    return ctx -> {
        List<String> results = new ArrayList<>();
        for (String city : new String[]{ "Seattle", "Amsterdam", "Hyderabad", "Kuala Lumpur", "Shanghai", "Tokyo" }) {
            results.add(ctx.callActivity("SayHello", city, String.class).await());
            if (VersionUtils.compareVersions(ctx.getVersion(), "2.0.0") >= 0) {
                // Simulate a delay for newer versions
                results.add(ctx.callActivity("SayGoodbye", city, String.class).await());
            }
        }
        ctx.complete(results);
    };
}
```

::: zone-end

::: zone pivot="python"

Once you add the version to the client, any orchestration started by this client uses the version `1.0.0`. The version is a simple string parsed using `packaging.version`, which supports semantic versioning comparison and accepts any value.  

Supplying the version in the client also makes it available in the `task.OrchestrationContext`, meaning you can use the version in conditional statements. As long as newer orchestration versions have the appropriate version gating, both the old and new orchestration versions can run together on the same client. 

**Example:**

```python
def orchestrator(ctx: task.OrchestrationContext, _):
    if ctx.version == "1.0.0":
        # For version 1.0.0, we use the original logic
        result: int = yield ctx.call_activity(activity_v1, input="input for v1")
    elif ctx.version == "2.0.0":
        # For version 2.0.0, we use the updated logic
        result: int = yield ctx.call_activity(activity_v2, input="input for v2")
    else:
        raise ValueError(f"Unsupported version: {ctx.version}")
    return {
        'result': result,
    }
```

::: zone-end

::: zone pivot="csharp,java"

In this example, we added a `SayGoodbye` activity to the `HelloCities` orchestration. This activity is only called for orchestration versions `2.0.0` and higher. With the simple conditional statement, any orchestration with a version less than `2.0.0` continues to function and any new orchestration includes the new activity.

::: zone-end

::: zone pivot="csharp,java,python"

### When to use client versioning

While client versioning provides the simplest mechanism for versioning orchestrations, interacting with the version can be programming intensive. Use client versioning if:
- You want a standard version across all versions, or 
- You require custom logic around specific versions. 

## Worker-based versioning

While orchestrations still need a client version to set the version, the worker-based versioning method helps you avoid conditionals in your orchestrations. The _worker_ chooses how to act on different versions of orchestrations before they start executing. 

Worker versioning requires the following fields to be set:

1. The version of the worker.
1. The default version applied to suborchestrations started by the worker.
1. The strategy that the worker uses to match against the orchestration's version.

    | Name           | Description                                                                              |
    |----------------|------------------------------------------------------------------------------------------|
    | None           | The version isn't considered when work is being processed                                |
    | Strict         | The version in the orchestration and the worker must match exactly                       |
    | CurrentOrOlder | The version in the orchestration must be equal to or less than the version in the worker |

1. The strategy that the worker takes if the version doesn't meet the matching strategy.

    | Name   | Description                                                                                               |
    |--------|-----------------------------------------------------------------------------------------------------------|
    | Reject | The orchestration is rejected by the worker but remains in the work queue to be attempted again later |
    | Fail   | The orchestration is failed and removed from the work queue                                          |

::: zone-end

::: zone pivot="csharp"

Similar to the client versioning, you can set these fields via the standard host builder pattern.

> [!NOTE]
> Available in the .NET SDK (Microsoft.DurableTask.Worker.AzureManaged) since v1.9.0.

```csharp
builder.Services.AddDurableTaskWorker(builder =>
{
    builder.AddTasks(r => r.AddAllGeneratedTasks());
    builder.UseDurableTaskScheduler(connectionString);
    builder.UseVersioning(new DurableTaskWorkerOptions.VersioningOptions
    {
        Version = "1.0.0",
        DefaultVersion = "1.0.0",
        MatchStrategy = DurableTaskWorkerOptions.VersionMatchStrategy.Strict,
        FailureStrategy = DurableTaskWorkerOptions.VersionFailureStrategy.Reject,
    });
});
```

::: zone-end

::: zone pivot="java"

> [!NOTE]
> Available in the Java SDK (com.microsoft:durabletask-client) since v1.6.0.

```java
private static DurableTaskGrpcWorker createTaskHubServer() {
    DurableTaskGrpcWorkerBuilder builder = new DurableTaskGrpcWorkerBuilder();
    builder.useVersioning(new DurableTaskGrpcWorkerVersioningOptions(
            "1.0",
            "1.0",
            DurableTaskGrpcWorkerVersioningOptions.VersionMatchStrategy.CURRENTOROLDER,
            DurableTaskGrpcWorkerVersioningOptions.VersionFailureStrategy.REJECT));
    
    // Orchestrations can be defined inline as anonymous classes or as concrete classes
    builder.addOrchestration(new TaskOrchestrationFactory() {
        @Override
        public String getName() { return "HelloCities"; }

        @Override
        public TaskOrchestration create() {
            return ctx -> {
                List<String> results = new ArrayList<>();
                for (String city : new String[]{ "Seattle", "Amsterdam", "Hyderabad", "Kuala Lumpur", "Shanghai", "Tokyo" }) {
                    results.add(ctx.callActivity("SayHello", city, String.class).await());
                }
                ctx.complete(results);
            };
        }
    });

    // Activities can be defined inline as anonymous classes or as concrete classes
    builder.addActivity(new TaskActivityFactory() {
        @Override
        public String getName() { return "SayHello"; }

        @Override
        public TaskActivity create() {
            return ctx -> {
                String input = ctx.getInput(String.class);
                return "Hello, " + input + "!";
            };
        }
    });

    return builder.build();
}
```

::: zone-end

::: zone pivot="python"

```python
with DurableTaskSchedulerWorker(host_address=endpoint, secure_channel=secure_channel,
                                taskhub=taskhub_name, token_credential=credential) as w:
    # This worker is versioned for v2, as the orchestrator code has already been updated
    # CURRENT_OR_OLDER allows this worker to process orchestrations versioned below 2.0.0 - e.g. 1.0.0
    w.use_versioning(worker.VersioningOptions(
        version="2.0.0",
        default_version="2.0.0",
        match_strategy=worker.VersionMatchStrategy.CURRENT_OR_OLDER,
        failure_strategy=worker.VersionFailureStrategy.FAIL
    ))
    w.add_orchestrator(orchestrator)
    w.add_activity(activity_v1)
    w.add_activity(activity_v2)
    w.start()
```

::: zone-end

::: zone pivot="csharp,java,python"

### Failure strategies

**Reject**

Use the `Reject` failure strategy when the desired behavior is for the orchestration to retry at a later time or on a different worker. During the `Reject` failure:

1. An orchestration is rejected and returned to the work queue. 
1. An orchestration is dequeued.
1. The dequeued orchestration could land on a different worker or the same one again. 

The process repeats until a worker that can handle the orchestration is available. This strategy seamlessly handles deployments in which an orchestration is updated. As the deployment progresses, workers that can't handle the orchestration reject it, while workers that can handle it process it. 

The ability to have mixed workers and orchestration versions allows for scenarios like blue-green deployments.

**Fail**

Use the `Fail` failure strategy when no other versions are expected. In this case, the new version is an anomaly and no worker should even attempt to work on it. The Durable Task Scheduler fails the orchestration, putting it in a terminal state.

### When to Use Worker Versioning

Use worker versioning in scenarios where unknown or unsupported orchestration versions shouldn't be executed at all. Instead of placing version handling code in the worker, worker versioning stops the orchestration from ever executing. This method allows for simpler orchestration code. Without any code changes, various deployment scenarios can be handled, like blue-green deployments.

## Next steps
::: zone-end

::: zone pivot="csharp"
[See more detailed examples and explanations in the code repository.](https://github.com/microsoft/durabletask-dotnet/tree/main)
::: zone-end

::: zone pivot="java"
[See more detailed examples and explanations in the code repository.](https://github.com/microsoft/durabletask-java/tree/main)

::: zone-end

::: zone pivot="python"
[See more detailed examples and explanations in the code repository.](https://github.com/microsoft/durabletask-python/tree/main)

::: zone-end