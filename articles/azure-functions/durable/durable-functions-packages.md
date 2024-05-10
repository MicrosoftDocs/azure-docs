---
title: Durable Functions packages
description: Introduction to the Durable Functions packages, extensions, and SDKs.
author: davidmrdavid
ms.topic: overview
ms.date: 04/09/2024
ms.author: dajusto
ms.custom: devdivchpfy22, devx-track-extended-java, devx-track-js, devx-track-python
ms.reviewer: azfuncdf
#Customer intent: As a < type of user >, I want < what? > so that < why? >.
---

# The Durable Functions packages

[Durable Functions](./durable-functions-overview.md) is available in all first-party Azure Functions runtime environments (e.g. .NET, Node, Python, etc.). As such, there are multiple Durable Functions SDKs and packages for each language runtime supported. This guide provides a description of each Durable Functions package from the perspective of each runtime supported.

## .NET in-process

.NET in-process users need to reference the [Microsoft.Azure.WebJobs.Extensions.DurableTask](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.DurableTask/) package in their `.csproj` file to use Durable Functions. This package is known as the "WebJobs extension" for Durable Functions.

### The storage providers packages

By default, Durable Functions uses Azure Storage as it's backing store. However, alternative [storage providers](./durable-functions-storage-providers.md) are available as well. To use them, you need to reference their packages _in addition to_ the WebJobs extension in your `.csproj`. Those packages are:

* The Netherite storage provider: [Microsoft.Azure.DurableTask.Netherite.AzureFunctions](https://www.nuget.org/packages/Microsoft.Azure.DurableTask.Netherite.AzureFunctions).
* The MSSQL storage provider: [Microsoft.DurableTask.SqlServer.AzureFunctions](https://www.nuget.org/packages/Microsoft.DurableTask.SqlServer.AzureFunctions)

> [!TIP]
> See the [storage providers guide](./durable-functions-storage-providers.md) for complete instructions on how to configure each backend.

> [!NOTE]
> These are the same packages that non-.NET customers [manually upgrading their extensions](./durable-functions-extension-upgrade.md#manually-upgrade-the-durable-functions-extension) need to manage in their `.csproj`.

## .NET isolated

.NET isolated users need to reference the [Microsoft.Azure.Functions.Worker.Extensions.DurableTask](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask/) package in their `.csproj` file to use Durable Functions. This replaces the "WebJobs" extension used in .NET in-process as .NET isolated projects can't directly reference WebJobs packages. This package is known as the "worker extension" for Durable Functions.

### The storage providers packages

In .NET isolated, the alternative [storage providers](./durable-functions-storage-providers.md) are available as well under "worker extension" packages of their own. You need to reference their packages _in addition to_ the worker extension in your `.csproj`. Those packages are:

* The Netherite storage provider: [Microsoft.Azure.Functions.Worker.Extensions.DurableTask.Netherite](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask.Netherite).
* The MSSQL storage provider: [Microsoft.Azure.Functions.Worker.Extensions.DurableTask.SqlServer](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask.SqlServer)

> [!TIP]
> See the [storage providers guide](./durable-functions-storage-providers.md) for complete the instructions on how to configure each backend.

## Extension Bundles users

Users of [Extension Bundles](../functions-bindings-register.md#extension-bundles) (the recommended Azure Functions extension management mechanism for non-.NET users) simply need to install their language runtime's Durable Functions SDK. The SDKs for each first-party language are listed in the table below:

* Node (JavaScript / TypeScript): The [durable-functions](https://www.npmjs.com/package/durable-functions) npm package.
* Python: The [azure-functions-durable](https://pypi.org/project/azure-functions-durable/) PyPI package.
* Java: The [durabletask-azure-functions](https://mvnrepository.com/artifact/com.microsoft/durabletask-azure-functions) Maven package.
* PowerShell: The current GA SDK is built-in to Azure Functions PowerShell language worker, so no installation is needed. See the following _note_ for details.

> [!NOTE]
> For PowerShell users: we have a [_preview_ SDK standalone package](./durable-functions-powershell-v2-sdk-migration-guide.md) under [AzureFunctions.PowerShell.Durable.SDK](https://www.powershellgallery.com/packages/AzureFunctions.PowerShell.Durable.SDK) in the PowerShell gallery. The latter will be preferred in the future.

## GitHub repositories

Durable Functions is developed in the open as OSS. Users are welcome to contribute to it's development, request features, and to report issues in the appropiate repositories:

* [azure-functions-durable-extension](https://github.com/Azure/azure-functions-durable-extension): For .NET in-process and the Azure Storage storage provider.
* [durabletask-dotnet](https://github.com/microsoft/durabletask-dotnet): For .NET isolated.
* [azure-functions-durable-js](https://github.com/Azure/azure-functions-durable-js): For the Node.js SDK.
* [azure-functions-durable-python](https://github.com/Azure/azure-functions-durable-python): For the Python SDK.
* [durabletask-java](https://github.com/Microsoft/durabletask-java): For the Java SDK.
* [azure-functions-durable-powershel](https://github.com/Azure/azure-functions-durable-powershell): For the PowerShell SDK.
* [durabletask-netherite](https://github.com/microsoft/durabletask-netherite): For the Netherite storage provider.
* [durabletask-mssql](https://github.com/microsoft/durabletask-mssql): For the MSSQL storage provider.
