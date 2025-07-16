---
title: Configure Versioning for Durable Task Scheduler (preview)
description: Learn how to use orchestration versioning in Durable Task Scheduler.
ms.topic: how-to
ms.date: 07/16/2025
author: halspang
ms.author: azfuncdf
zone_pivot_groups: df-languages
---

# Orchestration Versioning

A key area to consider when using a durable orchestration system is how to handle the upgrading/downgrading of orchestrations. When an orchestration is interrupted and later resumed (for instance, during a host update), Durable Task Scheduler will replay the events of the orchestration. This is done to ensure reliability - the system replays to ensure all previous steps were executed successfully before the next step is taken - which is a core promise of the durable execution paradigm. So, if an orchestration changes between deployments, the steps it takes may no longer be the same. If this does happen, the system will throw a `NonDeterministicError` instead of allowing the orchestration to continue. 

Orchestration versioning helps to prevent problems related to non-determinism, allowing you to work seamlessly with new (or old) orchestrations. Durable Task Scheduler has two different styles of versioning which will be explored below. Note that the different versioning styles can be used separately or together.

::: zone pivot="javascript"

[!INCLUDE [preview-sample-limitations](./includes/preview-sample-limitations.md)]

::: zone-end

::: zone pivot="powershell"

[!INCLUDE [preview-sample-limitations](./includes/preview-sample-limitations.md)]

::: zone-end

::: zone pivot="python"

> [!IMPORTANT]
> Currently, versioning isn't available in the Python SDK.

::: zone-end

::: zone pivot="csharp,java"

## Client/context-based conditional versioning

In order for an orchestration to have a version, it must first be set in the client. For the .NET SDK, this is done through the standard host builder extensions, as seen below:

::: zone-end

::: zone pivot="csharp"

> [!NOTE]
> Available in the .NET SDK since v1.9.0.

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
> Available in the Java SDK since v1.6.0.

```java
public DurableTaskClient durableTaskClient(DurableTaskProperties properties) {
    // Create client using Azure-managed extensions
    return DurableTaskSchedulerClientExtensions.createClientBuilder(properties.getConnectionString())
        .defaultVersion("1.0")
        .build();
}
```

::: zone-end

::: zone pivot="csharp,java"

Once that is added, any orchestration started by this host will use the version `1.0.0`. The version itself is a simple string and accepts any value. However, the SDK will try to convert it to .NET's `System.Version`. If it can be converted, that library is used for comparison, if not, a simple string comparison is used.

By supplying the version in the client, it also becomes available in the `TaskOrchestrationContext`. This means the version can be used in conditional statements. So long as newer versions of an orchestration have the appropriate version gating, both the old and the new version of the orchestration can run together on the same host. An example of how the version can be used is:

::: zone-end

::: zone pivot="csharp"

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

::: zone pivot="csharp,java"

In this example, we've added a `SayGoodbye` activity to the `HelloCities` orchestration. This is only called if the orchestration is at least version `2.0.0`. With the simple conditional statement, any orchestration with a version less than `2.0.0` will continue to function and any new orchestration will have the new activity in it.

### When to use client versioning

Client versioning provides the simplest mechanism for versioning orchestrations, but interacting with the version is also the most programming intensive. Essentially, the two functionalities that client versioning provides are the ability to set a version for all orchestrations and the ability to programmatically handle the version in the orchestration. It should be used if a standard version is desired across all versions or if custom logic around specific versions is required. 

## Worker-based versioning

An additional strategy that can be used for handling versions is setting up worker versioning. Orchestrations will still need a client version in order to have the version set, but this method allows the user to avoid conditionals in their orchestrations. Worker versioning allows the worker itself to choose how to act on different version of orchestrations before those orchestrations start executing. Worker versioning requires the following fields to be set:

1. The version of the worker itself
2. The default version that will be applied to suborchestrations started by the worker
3. The strategy that the worker will use to match against the orchestration's version
4. The strategy that the worker should take if the version doesn't meet the matching strategy

The different match strategies are as follows:

| Name           | Description                                                                              |
|----------------|------------------------------------------------------------------------------------------|
| None           | The version isn't considered when work is being processed                                |
| Strict         | The version in the orchestration and the worker must match exactly                       |
| CurrentOrOlder | The version in the orchestration must be equal to or less than the version in the worker |

The different failure strategies are as follows:

| Name   | Description                                                                                               |
|--------|-----------------------------------------------------------------------------------------------------------|
| Reject | The orchestration will be rejected by the worker but remain in the work queue to be attempted again later |
| Fail   | The orchestration will be failed and removed from the work queue                                          |

Similar to the client versioning, these are all set via the standard host builder pattern:

::: zone-end

::: zone pivot="csharp"

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

::: zone pivot="csharp,java"

The `Reject` failure strategy should be used when the desired behavior is to have the orchestration try again at a later time/on a different worker. When an orchestration is rejected, it's simply returned to the work queue. When it's dequeued again, it could land on a different worker or the same one again. The process will repeat until a worker that can actually handle the orchestration is available. This strategy allows for the seamless handling of deployments in which an orchestration is updated. As the deployment progresses, workers that can't handle the orchestration will reject it while workers that can handle it will process it. The ability to have mixed workers/orchestration versions allows for scenarios like blue-green deployments.

The `Fail` failure strategy should be used when no other versions are expected. In this case, the new version is an anomaly and no worker should even attempt to work on it. So, the Durable Task Scheduler will fail the orchestration, putting it in a terminal state.

### When to Use Worker Versioning

Worker versioning should be used in scenarios where orchestrations of an unknown or unsupported version shouldn't be executed at all. Instead of placing version handling code in the worker, worker versioning stops the orchestration from ever executing. This allows for much simpler orchestration code. Without any code changes, various deployment scenarios can be handled, like blue-green deployments mentioned before.

::: zone-end