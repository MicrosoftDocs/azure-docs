---
title: Durable Functions Roslyn Analyzer (C# only)
description: Learn how to use the Durable Task Roslyn Analyzer to detect code constraint violations in your Durable Functions or Durable Task SDK orchestrations.
author: cgillum
ms.topic: reference
ms.date: 02/18/2026
ms.author: azfuncdf
ms.service: azure-functions
ms.subservice: durable
zone_pivot_groups: azure-durable-approach
#Customer intent: As a C# developer, I want to use static code analysis to catch orchestrator code constraint violations at build time so that I can avoid runtime bugs.
---

# Durable Task Roslyn Analyzer (C# only)

::: zone pivot="durable-functions"

The Durable Task Roslyn Analyzer is a live code analyzer that helps you follow [orchestrator code constraints](durable-functions-code-constraints.md) in your C# Durable Functions apps. It detects common issues like non-deterministic API usage, incorrect bindings, and type mismatches at build time, before your code reaches production.

The analyzer is bundled with the [`Microsoft.Azure.Functions.Worker.Extensions.DurableTask`](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask) NuGet package (v1.6.0 and later) and is enabled by default. No extra setup is required.

::: zone-end

::: zone pivot="durable-task-sdks"

The Durable Task Roslyn Analyzer is a live code analyzer that helps you follow [orchestrator code constraints](durable-functions-code-constraints.md) in your C# Durable Task SDK apps. It detects common issues like non-deterministic API usage and type mismatches at build time, before your code reaches production.

To use the analyzer, add the [`Microsoft.DurableTask.Analyzers`](https://www.nuget.org/packages/Microsoft.DurableTask.Analyzers) NuGet package to your project:

```dotnetcli
dotnet add package Microsoft.DurableTask.Analyzers
```

::: zone-end

## How it works

The analyzer runs automatically in Visual Studio, Visual Studio Code (with the C# Dev Kit extension), and during `dotnet build` on the command line. It inspects your orchestrator code and reports diagnostics as warnings or errors in your IDE's error list and in build output.

No special IDE configuration is required. The analyzer activates as soon as the NuGet package is present in your project.

> [!TIP]
> By default, Visual Studio only runs analyzers on open files. To run the analyzer across your entire solution, go to **Tools** > **Options** > **Text Editor** > **C#** > **Advanced** and set **Background analysis scope** to **Entire solution**.

## Analyzer rules

The following table lists the analyzer rules that ship with the Durable Task Roslyn Analyzer. Each rule targets a specific code constraint violation or common mistake.

::: zone pivot="durable-functions"

| Rule ID | Severity | Description |
| ------- | -------- | ----------- |
| DURABLE0001 | Warning | Detects non-deterministic `DateTime` properties (`DateTime.Now`, `DateTime.UtcNow`, `DateTime.Today`, `DateTimeOffset.Now`, `DateTimeOffset.UtcNow`) in orchestrations. Use `context.CurrentUtcDateTime` instead. |
| DURABLE0002 | Warning | Detects `Guid.NewGuid()` in orchestrations. Use `context.NewGuid()` instead. |
| DURABLE0003 | Warning | Detects `Task.Delay` or `Thread.Sleep` in orchestrations. Use `context.CreateTimer` instead. |
| DURABLE0004 | Warning | Detects non-deterministic thread and task APIs (`Thread.Start`, `Task.Run`, `Task.ContinueWith`, `TaskFactory.StartNew`) in orchestrations. |
| DURABLE0005 | Warning | Detects I/O APIs (for example, `HttpClient`, Azure Storage clients) used directly in orchestrations. Move I/O calls to activities. |
| DURABLE0006 | Warning | Detects `System.Environment` API usage (for example, `GetEnvironmentVariable`) in orchestrations. |
| DURABLE0007 | Warning | Detects `CancellationToken` parameters in orchestration function signatures. |
| DURABLE0008 | Warning | Detects non-`[OrchestrationTrigger]` bindings (for example, `[EntityTrigger]`, `[DurableClient]`) in orchestration function parameters. |
| DURABLE0009 | Info | Suggests using an input parameter instead of `context.GetInput<T>()`. |
| DURABLE0010 | Warning | Detects non-contextual `ILogger` usage in orchestrations. Use `context.CreateReplaySafeLogger()` instead. |
| DURABLE1001 | Error | Ensures `[OrchestrationTrigger]` is only applied to `TaskOrchestrationContext` parameters. |
| DURABLE1002 | Error | Ensures `[DurableClient]` is only applied to `DurableTaskClient` parameters. |
| DURABLE1003 | Error | Ensures `[EntityTrigger]` is only applied to `TaskEntityDispatcher` parameters. |
| DURABLE2001 | Warning | Detects input type mismatches between activity invocations and activity definitions. |
| DURABLE2002 | Warning | Detects output type mismatches between activity invocations and activity definitions. |
| DURABLE2003 | Info | Reports when an activity call references a name that doesn't match any defined activity in the compilation. |
| DURABLE2004 | Info | Reports when a sub-orchestration call references a name that doesn't match any defined orchestrator in the compilation. |

::: zone-end

::: zone pivot="durable-task-sdks"

| Rule ID | Severity | Description |
| ------- | -------- | ----------- |
| DURABLE0001 | Warning | Detects non-deterministic `DateTime` properties (`DateTime.Now`, `DateTime.UtcNow`, `DateTime.Today`, `DateTimeOffset.Now`, `DateTimeOffset.UtcNow`) in orchestrations. Use `context.CurrentUtcDateTime` instead. |
| DURABLE0002 | Warning | Detects `Guid.NewGuid()` in orchestrations. Use `context.NewGuid()` instead. |
| DURABLE0003 | Warning | Detects `Task.Delay` or `Thread.Sleep` in orchestrations. Use `context.CreateTimer` instead. |
| DURABLE0004 | Warning | Detects non-deterministic thread and task APIs (`Thread.Start`, `Task.Run`, `Task.ContinueWith`, `TaskFactory.StartNew`) in orchestrations. |
| DURABLE0005 | Warning | Detects I/O APIs (for example, `HttpClient`, Azure Storage clients) used directly in orchestrations. Move I/O calls to activities. |
| DURABLE0006 | Warning | Detects `System.Environment` API usage (for example, `GetEnvironmentVariable`) in orchestrations. |
| DURABLE0009 | Info | Suggests using an input parameter instead of `context.GetInput<T>()`. |
| DURABLE0010 | Warning | Detects non-contextual `ILogger` usage in orchestrations. Use `context.CreateReplaySafeLogger()` instead. |
| DURABLE2001 | Warning | Detects input type mismatches between activity invocations and activity definitions. |
| DURABLE2002 | Warning | Detects output type mismatches between activity invocations and activity definitions. |
| DURABLE2003 | Info | Reports when an activity call references a name that doesn't match any defined activity in the compilation. |
| DURABLE2004 | Info | Reports when a sub-orchestration call references a name that doesn't match any defined orchestrator in the compilation. |

> [!NOTE]
> Rules DURABLE0007, DURABLE0008, and DURABLE1001-DURABLE1003 apply only to Azure Functions and aren't included in the standalone Durable Task SDK analyzer.

::: zone-end

For more information, see the [analyzer release notes](https://github.com/microsoft/durabletask-dotnet/blob/main/src/Analyzers/AnalyzerReleases.Shipped.md) on GitHub.

## Suppress analyzer warnings

You can suppress analyzer diagnostics at the project, file, or line level.

### Suppress with `.editorconfig`

Add an entry to your `.editorconfig` file to change the severity of a rule or disable it entirely:

```ini
[*.cs]
dotnet_diagnostic.DURABLE0001.severity = none
```

Valid severity values are `error`, `warning`, `suggestion`, `silent`, and `none`.

### Suppress inline with `#pragma`

Use `#pragma warning disable` to suppress a specific warning in a section of code:

```csharp
#pragma warning disable DURABLE0001
var now = DateTime.UtcNow;
#pragma warning restore DURABLE0001
```

### Suppress at the project level

Add a `<NoWarn>` entry to your `.csproj` file to suppress a rule for the entire project:

```xml
<PropertyGroup>
  <NoWarn>$(NoWarn);DURABLE0001</NoWarn>
</PropertyGroup>
```

::: zone pivot="durable-functions"

## Legacy .NET in-process analyzer

A separate, older Roslyn analyzer exists for the [.NET in-process](../functions-dotnet-class-library.md) programming model. This analyzer is part of the [`Microsoft.Azure.WebJobs.Extensions.DurableTask`](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.DurableTask) package and has a different set of rules.

> [!IMPORTANT]
> The .NET in-process programming model is being retired. Use the [.NET isolated worker model](../dotnet-isolated-process-guide.md) for new projects. The legacy in-process analyzer doesn't receive new rules or improvements.

For information about the in-process analyzer rules, see the [Analyzer v0.2.0 release page](https://github.com/Azure/azure-functions-durable-extension/releases/tag/Analyzer-v0.2.0).

::: zone-end

## Next step

> [!div class="nextstepaction"]
> [Orchestrator function code constraints](durable-functions-code-constraints.md)
