---
title: Durable Functions best practices and diagnostic tools
description: Learn about the best practices when using Durable Functions and the various tools available for diagnosing problems.
author: lilyjma
ms.topic: conceptual
ms.date: 02/15/2023
ms.author: azfuncdf
---

# Durable Functions best practices and diagnostic tools

This article details some best practices when using Durable Functions. It also describes various tools to help diagnose problems during development and testing and when running your app in production.

## Best practices

### Use the latest version of Durable Functions extension and SDK

There are two components that a function app uses to execute Durable Functions. One is the *Durable Functions SDK* that allows you to write orchestrator, activity, and entity functions using your target programming language. The other is the *Durable extension*, which is the runtime component that actually executes the code. With the exception of .NET in-process apps, the SDK and the extension are versioned independently.
    
Some runtime issues that you may experience with Durable Functions can be resolved by upgrading to the latest version of the extension and SDK. Any release of the extension and SDK may contain important bug fixes and performance improvements and staying up-to-date ensures that your app always have the latest fixes. Upgrading to the latest versions also ensures that Microsoft can collect the latest diagnostic telemetry to help accelerate the investigation process when you open a support case with Azure.
    
* See [Upgrade durable functions extension version](durable-functions-extension-upgrade.md) for instructions on getting the latest extension version.
* To ensure you're using the latest version of the SDK, check the package manager of the language you're using. 

### Adhere to Durable Functions [code constraints](durable-functions-code-constraints.md)

The [replay](durable-functions-orchestrations.md#reliability) behavior of orchestrator code creates constraints on the type of code that you can write in an orchestrator function. An example of a constraint is that your orchestrator function must use deterministic APIs so that each time it’s replayed, it produces the same result.

The Durable Functions Roslyn Analyzer is a live code analyzer that guides C# users to adhere to Durable Functions specific code constraints. See [Durable Functions Roslyn Analyzer](durable-functions-roslyn-analyzer.md) for instructions on how to enable it on Visual Studio and Visual Studio Code.  

### Familiarize yourself with your programming language's Azure Functions performance settings

* [JavaScript](../functions-reference-node.md#scaling-and-concurrency)
* [PowerShell](../functions-reference-powershell.md#concurrency)
* [Python](../python-scale-performance-reference.md)

### Make sure [task hubs have unique names](durable-functions-task-hubs.md#multiple-function-apps) when multiple apps share one storage account

Multiple Durable Function apps can share the same storage account. By default, the name of the app is used as the task hub name, which ensures that accidental sharing of task hubs won't happen. If you need to explicitly configure task hub names for your apps in host.json, you must ensure that the names are *unique*. Otherwise, the multiple apps will compete for messages, which could result in undefined behavior, including orchestrations getting unexpectedly "stuck" in the Pending or Running state. 

The only exception is if you deploy *copies* of the same app in [multiple regions](durable-functions-disaster-recovery-geo-distribution.md); in this case, you can use the same task hub for the copies. 

### Handle code changes correctly

It's inevitable that functions will be added, removed, and changed over the lifetime of an application. Examples of [common breaking changes](durable-functions-versioning.md) include changing activity or entity function signatures and changing orchestrator logic. These changes are a problem when they affect orchestrations that are still running. If deployed incorrectly, code changes could lead to orchestrations failing with a non-deterministic error, getting stuck indefinitely, performance degradation, etc. Refer to recommended [mitigation strategies](durable-functions-versioning.md#mitigation-strategies) when making code changes that may impact running orchestrations. 

### Keep function inputs and outputs as small as possible

You can run into memory issues if you have large inputs and outputs to Durable Functions APIs. 

One common mistake Durable Functions users make is passing in large values to and from activity functions. These values get persisted into orchestrator history when they enter or exit orchestrator functions. Over time, this history grows and loading it into memory during [replay](durable-functions-orchestrations.md#reliability) could cause out of memory exceptions. If you need to work with large objects, splitting your activity functions across more orchestration or suborchestration functions would reduce the size of the orchestration history, which could prevent out of memory exceptions. Another approach could be storing your large data in an external store like Azure Blob Storage under a given ID, then retrieve that data with the ID inside an activity function. 

### Fine tune your concurrency settings

A single worker instance can execute multiple work items concurrently to increase efficiency. However, if a worker tries to process too many work items simultaneously, it could exhaust its resources like CPU load, network connections, etc. Usually, this shouldn’t be a concern because scaling and limiting work items are handled automatically for you. However, if you’re experiencing performance issues (such as orchestrators taking too long to finish, are stuck in pending, etc.) or are doing performance testing, you could [configure concurrency limits](durable-functions-perf-and-scale.md#configuration-of-throttles) in the host.json file.
 
 
## Diagnostic tools

There are several tools available to help you diagnose problems.

### Configuration for more logs

#### Durable Functions Extension
The Durable extension emits tracking events that allow you to trace the end-to-end execution of an orchestration. These tracking events can be found and queried using the [Application Insights Analytics](../../azure-monitor/logs/log-query-overview.md) tool in the Azure portal. The verbosity of tracking data emitted can be configured in the logger (Functions 1.x) or logging (Functions 2.0) section of the host.json file. See [configuration details](durable-functions-diagnostics.md#functions-10). 
        
#### Durable Task Framework
Starting in v2.3.0 of the Durable extension, logs emitted by the underlying Durable Task Framework (DTFx) are also available for collection. Details on how to [enable these logs](durable-functions-diagnostics.md#durable-task-framework-logging).  

### Azure Portal

#### Diagnose and solve problems
Azure Function App Diagnostics is a useful resource on Azure portal for monitoring and diagnosing potential issues in your application. It also provides suggestions to help resolve problems based on the diagnosis. See [Azure Function App Diagnostics](function-app-diagnostics.md). 

#### Durable Functions Orchestration traces
Azure portal provides orchestration trace details to help you understand the status of each orchestration instance and trace the end-to-end execution. When you look at the list of functions inside your Azure Functions app, you'll see a "Monitor" column that contains links to the traces. You need to have Applications Insights enabled for your app to get this information. 

### Durable Functions Monitor Extension

This is a [Visual Studio Code extension](https://github.com/microsoft/DurableFunctionsMonitor) that provides a UI for monitoring, managing, and debugging your orchestration instances. 

### Roslyn Analyzer

The Durable Functions Roslyn Analyzer is a live code analyzer that guides C# users to adhere to Durable Functions specific [code constraints](durable-functions-code-constraints.md). See [Durable Functions Roslyn Analyzer](durable-functions-roslyn-analyzer.md) for instructions on how to enable it on Visual Studio and Visual Studio Code. 


## Support

If you have any questions, open an issue in one of the GitHub repos below. Including information such as instance IDs, time ranges in UTC, app name (if possible), deployment region would help facilitate investigations. 
- [Durable Functions extension and .NET in-process SDK](https://github.com/Azure/azure-functions-durable-extension/issues)
- [.NET isolated SDK](https://github.com/microsoft/durabletask-dotnet/issues)
- [Durable Functions for Java](https://github.com/microsoft/durabletask-java/issues)
- [Durable Functions for JavaScript](https://github.com/Azure/azure-functions-durable-js/issues)
- [Durable Functions for Python](https://github.com/Azure/azure-functions-durable-python/issues)
