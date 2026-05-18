---
title: "Durable Functions Packages, Extensions, and SDKs: Overview"
description: "Learn about Durable Functions packages, extensions, and SDKs for .NET, Node.js, Python, Java, and PowerShell. Find the right package and storage provider for your Azure Functions runtime."
author: davidmrdavid
ms.topic: overview
ms.service: azure-functions
ms.date: 04/23/2026
ms.author: dajusto
ms.custom: devdivchpfy22, devx-track-extended-java, devx-track-dotnet
ms.reviewer: azfuncdf
#Customer intent: As a Durable Functions developer, I want to find the correct package for my language and hosting model so that I can set up Durable Functions quickly.
---

# Durable Functions packages, extensions, and SDKs overview

[Durable Functions](../../durable-task/common/what-is-durable-task.md) is available for all first-party Azure Functions languages, including .NET, Node.js, Python, Java, and PowerShell. This article helps you find the right package to install for your language and hosting model.

In this article, *extension* refers to the binary that runs inside the Azure Functions host and implements the Durable Task protocol. *SDK* refers to the language-specific library you call in your application code. For .NET, the extension and SDK are combined in a single NuGet package.

## Quick reference

The following table lists the primary Durable Functions package for each supported language and hosting model:

| Language | Hosting model | Package | Registry |
| -------- | ------------- | ------- | -------- |
| .NET | In-process | [Microsoft.Azure.WebJobs.Extensions.DurableTask](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.DurableTask/) | NuGet |
| .NET | Isolated worker | [Microsoft.Azure.Functions.Worker.Extensions.DurableTask](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask/) | NuGet |
| Node.js (JavaScript / TypeScript) | Extension bundles | [durable-functions](https://www.npmjs.com/package/durable-functions) | npm |
| Python | Extension bundles | [azure-functions-durable](https://pypi.org/project/azure-functions-durable/) | PyPI |
| Java | Extension bundles | [durabletask-azure-functions](https://mvnrepository.com/artifact/com.microsoft/durabletask-azure-functions) | Maven |
| PowerShell | Extension bundles | [AzureFunctions.PowerShell.Durable.SDK](https://www.powershellgallery.com/packages/AzureFunctions.PowerShell.Durable.SDK) | PowerShell Gallery |

The following sections provide more detail on each language, including alternative storage provider packages.

## .NET in-process

Add the [Microsoft.Azure.WebJobs.Extensions.DurableTask](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.DurableTask/) NuGet package to your `.csproj` file. This package (sometimes called the "WebJobs extension") contains both the Durable Functions extension and the .NET in-process SDK.

> [!NOTE]
> These are the same packages that non-.NET customers [manually upgrading their extensions](./durable-functions-extension-upgrade.md#manually-upgrade-the-durable-functions-extension-version) need to manage in their `.csproj`.

## .NET isolated

Add the [Microsoft.Azure.Functions.Worker.Extensions.DurableTask](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask/) NuGet package to your `.csproj` file. This package (sometimes called the "worker extension") replaces the WebJobs extension used in the in-process model.

## Node.js, Python, Java, and PowerShell

Non-.NET languages use [extension bundles](../extension-bundles.md) to manage the Durable Functions extension automatically. You only need to install the Durable Functions SDK for your language:

* **Node.js (JavaScript / TypeScript):** The [durable-functions](https://www.npmjs.com/package/durable-functions) npm package.
* **Python:** The [azure-functions-durable](https://pypi.org/project/azure-functions-durable/) PyPI package.
* **Java:** The [durabletask-azure-functions](https://mvnrepository.com/artifact/com.microsoft/durabletask-azure-functions) Maven package.
* **PowerShell:** The [AzureFunctions.PowerShell.Durable.SDK](https://www.powershellgallery.com/packages/AzureFunctions.PowerShell.Durable.SDK) module.

> [!NOTE]
> **PowerShell users:** Use the standalone [AzureFunctions.PowerShell.Durable.SDK](https://www.powershellgallery.com/packages/AzureFunctions.PowerShell.Durable.SDK) module, which is now generally available (GA). The legacy SDK built into the Azure Functions PowerShell language worker may not receive new features or bug fixes and may eventually be removed. See the [migration guide](./durable-functions-powershell-v2-sdk-migration-guide.md) for details.

## Storage providers

Durable Functions uses a [storage provider](../../durable-task/common/durable-task-storage-providers.md) to persist orchestration state, entity state, and internal messages. The recommended provider is [Durable Task Scheduler](../../durable-task/scheduler/durable-task-scheduler.md), an Azure-managed backend that requires no additional packages—only configuration. To get started, see [Configure Durable Functions with Durable Task Scheduler](../../durable-task/scheduler/quickstart-durable-task-scheduler.md).

### Alternative storage providers

If you need a different backend, the following "bring your own" (BYO) storage providers are also available. For .NET apps, add the corresponding package to your `.csproj` _in addition to_ your primary Durable Functions package.

The following table lists the BYO storage provider packages for each .NET hosting model:

| Storage provider | .NET in-process package | .NET isolated package |
| ---------------- | ----------------------- | --------------------- |
| Azure Storage | _No extra package required (built in)_ | _No extra package required (built in)_ |
| MSSQL | [Microsoft.DurableTask.SqlServer.AzureFunctions](https://www.nuget.org/packages/Microsoft.DurableTask.SqlServer.AzureFunctions) | [Microsoft.Azure.Functions.Worker.Extensions.DurableTask.SqlServer](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask.SqlServer) |
| Netherite (retiring) | [Microsoft.Azure.DurableTask.Netherite.AzureFunctions](https://www.nuget.org/packages/Microsoft.Azure.DurableTask.Netherite.AzureFunctions) | [Microsoft.Azure.Functions.Worker.Extensions.DurableTask.Netherite](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask.Netherite) |

> [!WARNING]
> The Netherite storage provider is retiring. If you currently use Netherite, plan to migrate to the [Durable Task Scheduler](../../durable-task/scheduler/durable-task-scheduler.md) or another supported provider.

Non-.NET languages manage the extension through [extension bundles](../extension-bundles.md), so no additional storage provider package is needed in your application project.

> [!TIP]
> See the [storage providers guide](../../durable-task/common/durable-task-storage-providers.md) for complete instructions on comparing and configuring each backend.

## GitHub repositories

Durable Functions is developed as open-source software. To contribute, request features, or report bugs, use the repository for your language or component:

|GitHub repository | Description |
| ----- | ----- |
|[azure-functions-durable-extension](https://github.com/Azure/azure-functions-durable-extension) | .NET in-process library and the Azure Storage storage provider |
| [durabletask-dotnet](https://github.com/microsoft/durabletask-dotnet)| .NET isolated worker process library |
|[azure-functions-durable-js](https://github.com/Azure/azure-functions-durable-js)| Node.js SDK |
|[azure-functions-durable-python](https://github.com/Azure/azure-functions-durable-python)| Python SDK |
|[durabletask-java](https://github.com/Microsoft/durabletask-java)| Java SDK |
|[azure-functions-durable-powershell](https://github.com/Azure/azure-functions-durable-powershell)| PowerShell SDK |
|[durabletask-netherite](https://github.com/microsoft/durabletask-netherite)| Netherite storage provider |
|[durabletask-mssql](https://github.com/microsoft/durabletask-mssql)| MSSQL storage provider |
