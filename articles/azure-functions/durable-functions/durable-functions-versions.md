---
title: "Durable Functions versions and migration guide - Azure Functions"
description: "Compare Durable Functions v1.x, v2.x, and v3.x. Learn what's new in each version and how to migrate between them."
author: cgillum
ms.topic: overview
ms.service: azure-functions
ms.date: 04/27/2026
ms.author: azfuncdf
zone_pivot_groups: programming-languages-set-functions-lang-workers
# CustomerIntent: As a developer using Durable Functions, I want to understand the differences between extension versions so that I can upgrade and take advantage of new features.
---

# Durable Functions versions and migration guide

*Durable Functions* is an extension of [Azure Functions](../functions-overview.md) and [Azure WebJobs](../../app-service/webjobs-create.md) that lets you write stateful functions in a serverless environment. The extension manages state, checkpoints, and restarts for you. If you aren't already familiar with Durable Functions, see the [overview documentation](../../durable-task/common/what-is-durable-task.md).

## Version summary

| Version | Status | Key changes |
| ------- | ------ | ----------- |
| **v3.x** | **Current (recommended)** | Updated Azure Storage SDK, improved cost efficiency, no code changes to upgrade from v2.x |
| **v2.x** | Maintained (security and bug fixes only) | Durable entities, Durable HTTP |
| **v1.x** | End of support [September 2026](https://azure.microsoft.com/updates?id=support-for-the-1x-version-of-azure-functions-ends-14-september-2026) | Legacy |

## What's new in v3.x

The [Microsoft.Azure.WebJobs.Extensions.DurableTask v3](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.DurableTask/3.0.0) package (referred to as WebJobs.Extensions.DurableTask in subsequent sections) is the current recommended version. **Upgrading from v2.x requires no code changes** — you only need to update your package dependencies. This update is only considered a breaking change for customers running Durable C# apps that use the [in-process model](../functions-dotnet-class-library.md).

::: zone pivot="programming-language-csharp"

> [!NOTE]
> The Durable Functions .NET out-of-process package, Microsoft.Azure.Functions.Worker.Extensions.DurableTask, references Microsoft.Azure.WebJobs.Extensions.DurableTask as its underlying assembly. Thus, this update also applies to Microsoft.Azure.Functions.Worker.Extensions.DurableTask, starting from version [1.2.x](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask/1.2.0).

::: zone-end

### Updated Azure Storage SDK

By default, Durable Functions use Azure Storage as a storage backend to durably save application state. In WebJobs.Extensions.DurableTask v3, the Azure Storage backend was upgraded to use the latest versions of the Azure Storage SDKs: [Azure.Data.Tables](https://www.nuget.org/packages/Azure.Data.Tables), [Azure.Storage.Blobs](https://www.nuget.org/packages/Azure.Storage.Blobs), and [Azure.Storage.Queues](https://www.nuget.org/packages/Azure.Storage.Queues). These SDKs offer enhanced support for Managed Identity, better performance, more efficient data handling, and improved security compared to the legacy `Microsoft.Azure.Storage.*` packages used in v2.x.

### Improved cost efficiency (for the Azure Storage provider)

In the [Azure Storage backend](./durable-functions-azure-storage-provider.md), the Partition Manager is responsible for distributing [partitions/control queues](./durable-functions-azure-storage-provider.md#control-queues) among workers. The WebJobs.Extensions.DurableTask v3 package uses Partition Manager V3 by default, which is a new design that leverages Azure Tables to manage partition assignments instead of Azure Blob leases. This design can significantly reduce storage costs while making debugging easier. When Partition Manager V3 is used, [a new table](./durable-functions-azure-storage-provider.md#partitions-table-for-worker-distribution), named `Partitions`, is created in your storage account, allowing you to easily check the partition information.

### Removed support for the Azure Functions v1 runtime

WebJobs.Extensions.DurableTask v3 no longer supports version 1.x of the Azure Functions runtime, support for which is scheduled to end in [September 2026](https://azure.microsoft.com/updates?id=support-for-the-1x-version-of-azure-functions-ends-14-september-2026). If you must use Functions runtime v1, please use a Durable Functions extension version lower than *v2.11.0*. Keep in mind that when the scheduled end of support comes, Durable Functions will drop its support for runtime v1 as well.  

### .NET runtime target update

WebJobs.Extensions.DurableTask v3 updates the target runtime from .NET Core 3.1 to .NET 6, offering improved performance and enhanced compatibility with modern .NET features and libraries. This update aligns with future releases of the Azure Functions extension bundles.

### Migrate from v2.x to v3.x

Migration from v2.x to v3.x requires no code changes — simply update your dependencies to start using the new features.

::: zone pivot="programming-language-csharp"

- **In-process model:** Update to [Microsoft.Azure.WebJobs.Extensions.DurableTask version 3.0.0](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.DurableTask/3.0.0) or later.
- **Isolated worker model:** Update to [Microsoft.Azure.Functions.Worker.Extensions.DurableTask version 1.2.0](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask/1.2.0) or later.

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-python,programming-language-powershell,programming-language-java"

Update to [Azure Functions extension bundle version 4.22.0](https://github.com/Azure/azure-functions-extension-bundles/releases) or later.

::: zone-end

### Downgrade compatibility (v3.x to v2.x)

WebJobs.Extensions.DurableTask v3 uses a different text encoding for the Azure Storage SDK (Base64) compared to v2 (UTF-8). If you need to revert from v3.x to v2.x, use the following minimum versions to ensure backward compatibility:

::: zone pivot="programming-language-csharp"

- **In-process model:** [v2.13.5](https://github.com/Azure/azure-functions-durable-extension/releases/tag/v2.13.5) or later.
- **Isolated worker model:** [v1.1.5](https://github.com/Azure/azure-functions-durable-extension/releases/tag/v1.1.5Worker.Extensions.DurableTask) or later (if reverting from v1.2.x or higher).

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-python,programming-language-powershell,programming-language-java"

Revert to an extension bundle version earlier than 4.22.0.

::: zone-end

### Support and maintenance of v2.x

WebJobs.Extensions.DurableTask v2.x continues to receive security updates and bug fixes, ensuring that your existing applications remain secure and stable. However, all new features and enhancements are added exclusively to v3.x. Because of this, you should upgrade to WebJobs.Extensions.DurableTask v3 as soon as you can to take advantage of the latest capabilities and ongoing improvements.

## Features introduced in v2.x

The following features are available in Durable Functions 2.x and later, across all supported languages.

::: zone pivot="programming-language-csharp"

> [!NOTE]
> The .NET in-process API details in this section don't apply to the isolated worker model. For isolated worker guidance, see the [Durable Functions isolated process overview](./durable-functions-dotnet-isolated-overview.md).

::: zone-end

### Durable entities

Durable Functions supports [entity functions](../../durable-task/common/durable-task-entities.md) for reading and updating small pieces of state, known as *durable entities*. Like orchestrator functions, entity functions are functions with a special trigger type, *entity trigger*. Unlike orchestrator functions, entity functions don't have any specific code constraints. Entity functions also manage state explicitly rather than implicitly representing state via control flow.

To learn more, see the [durable entities](../../durable-task/common/durable-task-entities.md) article.

### Durable HTTP

Durable Functions includes a [Durable HTTP](durable-functions-http-features.md#consume-http-apis) feature that allows you to:

* Call HTTP APIs directly from orchestration functions (with some documented limitations).
* Implement automatic client-side HTTP 202 status polling.
* Use built-in support for [Azure Managed Identities](/entra/identity/managed-identities-azure-resources/overview).

To learn more, see the [HTTP features](durable-functions-http-features.md#consume-http-apis) article.

## Migrate from 1.x to 2.x

> [!IMPORTANT]
> Version 1.x of the Azure Functions runtime reaches end of support in [September 2026](https://azure.microsoft.com/updates?id=support-for-the-1x-version-of-azure-functions-ends-14-september-2026). If you're still on v1.x, plan your migration soon.

This section describes how to migrate your existing version 1.x Durable Functions to version 2.x to take advantage of the new features.

### Upgrade the Durable Functions extension

Install the latest 2.x version of the Durable Functions bindings extension in your project.

::: zone pivot="programming-language-javascript,programming-language-python,programming-language-powershell"

Durable Functions 2.x is available starting in version 2.x of the [Azure Functions extension bundle](../extension-bundles.md).

Python support in Durable Functions requires Durable Functions 2.x or greater.

To update the extension bundle version in your project, open host.json and update the `extensionBundle` section to use version 4.x (`[4.*, 5.0.0)`).

```json
{
    "version": "2.0",
    "extensionBundle": {
        "id": "Microsoft.Azure.Functions.ExtensionBundle",
        "version": "[4.*, 5.0.0)"
    }
}
```

# [JavaScript](#tab/javascript)

Durable Functions 2.x is available starting in version 2.x of the [Azure Functions extension bundle](../extension-bundles.md).

To update the extension bundle version in your project, open host.json and update the `extensionBundle` section to use version 4.x (`[4.*, 5.0.0)`).

```json
{
    "version": "2.0",
    "extensionBundle": {
        "id": "Microsoft.Azure.Functions.ExtensionBundle",
        "version": "[4.*, 5.0.0)"
    }
}
```

> [!NOTE]
> If Visual Studio Code is not displaying the correct templates after you change the extension bundle version, reload the window by running the *Developer: Reload Window* command (<kbd>Ctrl+R</kbd> on Windows and Linux, <kbd>Command+R</kbd> on macOS).

::: zone-end

::: zone pivot="programming-language-java"

Durable Functions 2.x is available starting in version 2.x of the [Azure Functions extension bundle](../extension-bundles.md).

To update the extension bundle version in your project, open host.json and update the `extensionBundle` section to use version 4.x (`[4.*, 5.0.0)`).

```json
{
    "version": "2.0",
    "extensionBundle": {
        "id": "Microsoft.Azure.Functions.ExtensionBundle",
        "version": "[4.*, 5.0.0)"
    }
}
```

::: zone-end

::: zone pivot="programming-language-csharp"

Update your .NET project to use the latest version of the [Durable Functions bindings extension](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.DurableTask).

See [Register Azure Functions binding extensions](../functions-develop-vs.md?tabs=in-process#add-bindings) for more information.

::: zone-end

### Update your Durable Functions code

Durable Functions 2.x introduces several breaking changes. Durable Functions 1.x applications aren't compatible with Durable Functions 2.x without code changes. This section lists some of the changes you must make when upgrading your version 1.x functions to 2.x.

#### Host.json schema

Durable Functions 2.x uses a new host.json schema. The main changes from 1.x include:

* `"storageProvider"` (and the `"azureStorage"` subsection) for storage-specific configuration.
* `"tracing"` for tracing and logging configuration.
* `"notifications"` (and the `"eventGrid"` subsection) for Event Grid notification configuration.

See the [Durable Functions host.json reference documentation](durable-functions-host-json-settings.md#durable-functions-2-0-host-json) for details.

#### Default task hub name changes

In version 1.x, if a task hub name wasn't specified in host.json, it was defaulted to "DurableFunctionsHub". In version 2.x, the default task hub name is now derived from the name of the function app. Because of this, if you haven't specified a task hub name when upgrading to 2.x, your code will be operating with new task hub, and all in-flight orchestrations will no longer have an application processing them. To work around this, you can either explicitly set your task hub name to the v1.x default of "DurableFunctionsHub", or you can follow our [zero-downtime deployment guidance](durable-functions-zero-downtime-deployment.md) for details on how to handle breaking changes for in-flight orchestrations.

::: zone pivot="programming-language-csharp"

#### Public interface changes in Durable Functions

In version 1.x, the various *context* objects supported by Durable Functions have abstract base classes intended for use in unit testing. As part of Durable Functions 2.x, these abstract base classes are replaced with interfaces.

The following table represents the main changes:

| 1.x | 2.x |
| -------- | -------- |
| `DurableOrchestrationClientBase` | `IDurableOrchestrationClient` or `IDurableClient` |
| `DurableOrchestrationContext` or `DurableOrchestrationContextBase` | `IDurableOrchestrationContext` |
| `DurableActivityContext` or `DurableActivityContextBase` | `IDurableActivityContext` |
| `OrchestrationClientAttribute` | `DurableClientAttribute` |

In the case where an abstract base class contained virtual methods, these virtual methods have been replaced by extension methods defined in `DurableContextExtensions`.

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-python,programming-language-powershell,programming-language-java"

#### function.json changes

In Durable Functions 1.x, the orchestration client binding uses a `type` of `orchestrationClient`. Version 2.x uses `durableClient` instead.

::: zone-end

#### Raise event changes

In Durable Functions 1.x, calling the [raise event](../../durable-task/common/durable-task-external-events.md#send-events) API and specifying an instance that didn't exist resulted in a silent failure. Starting in 2.x, raising an event to a non-existent orchestration results in an exception.

## Related content

- [Migrate from in-process to isolated worker model](./durable-functions-migrate.md)
- [Durable Functions overview](./durable-functions-overview.md)
- [Durable Functions isolated process overview](./durable-functions-dotnet-isolated-overview.md)
