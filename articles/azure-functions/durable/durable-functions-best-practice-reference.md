---
title: Durable Functions best practices and diagnostic tools
description: Learn about the best practices when using Durable Functions and the various tools available for diagnosing problems.
author: lilyjma
ms.topic: conceptual
ms.date: 02/15/2023
ms.author: azfuncdf
---

# Durable Functions best practices and diagnostic tools

This article details some best practices when using Durable Functions. It also describes various tools to help diagnose problems during development, testing, and production use.

## Best practices

### Use the latest version of the Durable Functions extension and SDK

There are two components that a function app uses to execute Durable Functions. One is the *Durable Functions SDK* that allows you to write orchestrator, activity, and entity functions using your target programming language. The other is the *Durable extension*, which is the runtime component that actually executes the code. With the exception of .NET in-process apps, the SDK and the extension are versioned independently.
    
Staying up to date with the latest extension and SDK ensures your application benefits from the latest performance improvements, features, and bug fixes. Upgrading to the latest versions also ensures that Microsoft can collect the latest diagnostic telemetry to help accelerate the investigation process when you open a support case with Azure.
    
* See [Upgrade durable functions extension version](durable-functions-extension-upgrade.md) for instructions on getting the latest extension version.
* To ensure you're using the latest version of the SDK, check the package manager of the language you're using. 

### Adhere to Durable Functions [code constraints](durable-functions-code-constraints.md)

The [replay](durable-functions-orchestrations.md#reliability) behavior of orchestrator code creates constraints on the type of code that you can write in an orchestrator function. An example of a constraint is that your orchestrator function must use deterministic APIs so that each time it’s replayed, it produces the same result.

> [!NOTE]
> The Durable Functions Roslyn Analyzer is a live code analyzer that guides C# users to adhere to Durable Functions specific code constraints. See [Durable Functions Roslyn Analyzer](durable-functions-roslyn-analyzer.md) for instructions on how to enable it on Visual Studio and Visual Studio Code.  

### Familiarize yourself with your programming language's Azure Functions performance settings

_Using default settings_, the language runtime you select may impose strict concurrency restrictions on your functions. For example: only allowing 1 function to execute at a time on a given VM. These restrictions can usually be relaxed by _fine tuning_ the concurrency and performance settings of your language. If you're looking to optimize the performance of your Durable Functions application, you will need to familiarize yourself with these settings.

Below is a non-exhaustive list of some of the languages that often benefit from fine tuning their performance and concurrency settings, and their guidelines for doing so.

* [JavaScript](../functions-reference-node.md#scaling-and-concurrency)
* [PowerShell](../functions-reference-powershell.md#concurrency)
* [Python](../python-scale-performance-reference.md)

### Guarantee unique Task Hub names per app

Multiple Durable Function apps can share the same storage account. By default, the name of the app is used as the task hub name, which ensures that accidental sharing of task hubs won't happen. If you need to explicitly configure task hub names for your apps in host.json, you must ensure that the names are [*unique*](durable-functions-task-hubs.md#multiple-function-apps). Otherwise, the multiple apps will compete for messages, which could result in undefined behavior, including orchestrations getting unexpectedly "stuck" in the Pending or Running state. 

The only exception is if you deploy *copies* of the same app in [multiple regions](durable-functions-disaster-recovery-geo-distribution.md); in this case, you can use the same task hub for the copies. 

### Follow guidance when deploying code changes to running orchestrators

It's inevitable that functions will be added, removed, and changed over the lifetime of an application. Examples of [common breaking changes](durable-functions-versioning.md) include changing activity or entity function signatures and changing orchestrator logic. These changes are a problem when they affect orchestrations that are still running. If deployed incorrectly, code changes could lead to orchestrations failing with a non-deterministic error, getting stuck indefinitely, performance degradation, etc. Refer to recommended [mitigation strategies](durable-functions-versioning.md#mitigation-strategies) when making code changes that may impact running orchestrations. 

### Keep function inputs and outputs as small as possible

You can run into memory issues if you provide large inputs and outputs to and from Durable Functions APIs. 

Inputs and outputs to Durable Functions APIs are serialized into the orchestration history. This means that large inputs and outputs can, over time, greatly contribute to an orchestrator history growing unbounded, which risks causing memory exceptions during [replay](durable-functions-orchestrations.md#reliability).

To mitigate the impact of large inputs and outputs to APIs, you may choose to delegate some work to sub-orchestrators. This helps load balance the history memory burden from a single orchestrator to multiple ones, therefore keeping the memory footprint of individual histories small.

That said the best practice for dealing with _large_ data is to keep it in external storage and to only materialize that data inside Activities, when needed. When taking this approach, instead of communicating the data itself as inputs and/or outputs of Durable Functions APIs, you can pass in some lightweight identifier that allows you to retrieve that data from external storage when needed in your Activities.

### Fine tune your Durable Functions concurrency settings

A single worker instance can execute multiple work items concurrently to increase efficiency. However, processing too many work items concurrently risks exhausting resources like CPU capacity, network connections, etc. In many cases, this shouldn’t be a concern because scaling and limiting work items are handled automatically for you. That said, if you’re experiencing performance issues (such as orchestrators taking too long to finish, are stuck in pending, etc.) or are doing performance testing, you could [configure concurrency limits](durable-functions-perf-and-scale.md#configuration-of-throttles) in the host.json file.

> [!NOTE]
> This is not a replacement for fine-tuning the performance and concurrency settings of your language runtime in Azure Functions. The Durable Functions concurrency settings only determine how much work can be assigned to a given VM at a time, but it does not determine the degree of parallelism in processing that work inside the VM. The latter requires fine-tuning the language runtime performance settings.
 
 
## Diagnostic tools

There are several tools available to help you diagnose problems.

### Durable Functions and Durable Task Framework Logs

#### Durable Functions Extension
The Durable extension emits tracking events that allow you to trace the end-to-end execution of an orchestration. These tracking events can be found and queried using the [Application Insights Analytics](../../azure-monitor/logs/log-query-overview.md) tool in the Azure portal. The verbosity of tracking data emitted can be configured in the `logger` (Functions 1.x) or `logging` (Functions 2.0) section of the host.json file. See [configuration details](durable-functions-diagnostics.md#functions-10). 
        
#### Durable Task Framework
Starting in v2.3.0 of the Durable extension, logs emitted by the underlying Durable Task Framework (DTFx) are also available for collection. See [details on how to enable these logs](durable-functions-diagnostics.md#durable-task-framework-logging).  

### Azure portal

#### Diagnose and solve problems
Azure Function App Diagnostics is a useful resource on Azure portal for monitoring and diagnosing potential issues in your application. It also provides suggestions to help resolve problems based on the diagnosis. See [Azure Function App Diagnostics](function-app-diagnostics.md). 

#### Durable Functions Orchestration traces
Azure portal provides orchestration trace details to help you understand the status of each orchestration instance and trace the end-to-end execution. When you look at the list of functions inside your Azure Functions app, you'll see a **Monitor** column that contains links to the traces. You need to have Applications Insights enabled for your app to get this information. 

### Durable Functions Monitor Extension

This is a [Visual Studio Code extension](https://github.com/microsoft/DurableFunctionsMonitor) that provides a UI for monitoring, managing, and debugging your orchestration instances. 

### Roslyn Analyzer

The Durable Functions Roslyn Analyzer is a live code analyzer that guides C# users to adhere to Durable Functions specific [code constraints](durable-functions-code-constraints.md). See [Durable Functions Roslyn Analyzer](durable-functions-roslyn-analyzer.md) for instructions on how to enable it on Visual Studio and Visual Studio Code. 


## Support

For questions and support, you may open an issue in one of the GitHub repos below. When reporting a bug in Azure, including information such as affected instance IDs, time ranges in UTC showing the problem, the application name (if possible) and deployment region will greatly speed up investigations.
- [Durable Functions extension and .NET in-process SDK](https://github.com/Azure/azure-functions-durable-extension/issues)
- [.NET isolated SDK](https://github.com/microsoft/durabletask-dotnet/issues)
- [Durable Functions for Java](https://github.com/microsoft/durabletask-java/issues)
- [Durable Functions for JavaScript](https://github.com/Azure/azure-functions-durable-js/issues)
- [Durable Functions for Python](https://github.com/Azure/azure-functions-durable-python/issues)
