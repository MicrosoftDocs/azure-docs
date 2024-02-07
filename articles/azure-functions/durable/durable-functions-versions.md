---
title: Durable Functions versions overview - Azure Functions
description: Learn about Durable Functions versions.
author: cgillum
ms.topic: conceptual
ms.date: 05/06/2022
ms.author: azfuncdf
---

# Durable Functions versions overview

*Durable Functions* is an extension of [Azure Functions](../functions-overview.md) and [Azure WebJobs](../../app-service/webjobs-create.md) that lets you write stateful functions in a serverless environment. The extension manages state, checkpoints, and restarts for you. If you aren't already familiar with Durable Functions, see the [overview documentation](durable-functions-overview.md).

## New features in 2.x

This section describes the features of Durable Functions that are added in version 2.x.

> [!NOTE]
> This section does not apply to Durable Functions in dotnet isolated worker. For that, see [durable functions isolated process overview](./durable-functions-dotnet-isolated-overview.md).

### Durable entities

In Durable Functions 2.x, we introduced a new [entity functions](durable-functions-entities.md) concept.

Entity functions define operations for reading and updating small pieces of state, known as *durable entities*. Like orchestrator functions, entity functions are functions with a special trigger type, *entity trigger*. Unlike orchestrator functions, entity functions don't have any specific code constraints. Entity functions also manage state explicitly rather than implicitly representing state via control flow.

To learn more, see the [durable entities](durable-functions-entities.md) article.

### Durable HTTP

In Durable Functions 2.x, we introduced a new [Durable HTTP](durable-functions-http-features.md#consuming-http-apis) feature that allows you to:

* Call HTTP APIs directly from orchestration functions (with some documented limitations).
* Implement automatic client-side HTTP 202 status polling.
* Built-in support for [Azure Managed Identities](../../active-directory/managed-identities-azure-resources/overview.md).

To learn more, see the [HTTP features](durable-functions-http-features.md#consuming-http-apis) article.

## Migrate from 1.x to 2.x

This section describes how to migrate your existing version 1.x Durable Functions to version 2.x to take advantage of the new features.

### Upgrade the extension

Install the latest 2.x version of the Durable Functions bindings extension in your project.

#### JavaScript, Python, and PowerShell

Durable Functions 2.x is available starting in version 2.x of the [Azure Functions extension bundle](../functions-bindings-register.md#extension-bundles).

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

> [!NOTE]
> If Visual Studio Code is not displaying the correct templates after you change the extension bundle version, reload the window by running the *Developer: Reload Window* command (<kbd>Ctrl+R</kbd> on Windows and Linux, <kbd>Command+R</kbd> on macOS).

#### Java 

Durable Functions 2.x is available starting in version 4.x of the [Azure Functions extension bundle](../functions-bindings-register.md#extension-bundles). You must use the Azure Functions 4.0 runtime to execute Java functions.

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

#### .NET

Update your .NET project to use the latest version of the [Durable Functions bindings extension](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.DurableTask).

See [Register Azure Functions binding extensions](../functions-develop-vs.md?tabs=in-process#add-bindings) for more information.

### Update your code

Durable Functions 2.x introduces several breaking changes. Durable Functions 1.x applications aren't compatible with Durable Functions 2.x without code changes. This section lists some of the changes you must make when upgrading your version 1.x functions to 2.x.

#### Host.json schema

Durable Functions 2.x uses a new host.json schema. The main changes from 1.x include:

* `"storageProvider"` (and the `"azureStorage"` subsection) for storage-specific configuration.
* `"tracing"` for tracing and logging configuration.
* `"notifications"` (and the `"eventGrid"` subsection) for Event Grid notification configuration.

See the [Durable Functions host.json reference documentation](durable-functions-bindings.md#durable-functions-2-0-host-json) for details.

#### Default task hub name changes

In version 1.x, if a task hub name wasn't specified in host.json, it was defaulted to "DurableFunctionsHub". In version 2.x, the default task hub name is now derived from the name of the function app. Because of this, if you haven't specified a task hub name when upgrading to 2.x, your code will be operating with new task hub, and all in-flight orchestrations will no longer have an application processing them. To work around this, you can either explicitly set your task hub name to the v1.x default of "DurableFunctionsHub", or you can follow our [zero-downtime deployment guidance](durable-functions-zero-downtime-deployment.md) for details on how to handle breaking changes for in-flight orchestrations.

#### Public interface changes (.NET only)

In version 1.x, the various *context* objects supported by Durable Functions have abstract base classes intended for use in unit testing. As part of Durable Functions 2.x, these abstract base classes are replaced with interfaces.

The following table represents the main changes:

| 1.x | 2.x |
|----------|----------|
| `DurableOrchestrationClientBase` | `IDurableOrchestrationClient` or `IDurableClient` |
| `DurableOrchestrationContext` or `DurableOrchestrationContextBase` | `IDurableOrchestrationContext` |
| `DurableActivityContext` or `DurableActivityContextBase` | `IDurableActivityContext` |
| `OrchestrationClientAttribute` | `DurableClientAttribute` |

In the case where an abstract base class contained virtual methods, these virtual methods have been replaced by extension methods defined in `DurableContextExtensions`.

#### function.json changes

In Durable Functions 1.x, the orchestration client binding uses a `type` of `orchestrationClient`. Version 2.x uses `durableClient` instead.

#### Raise event changes

In Durable Functions 1.x, calling the [raise event](durable-functions-external-events.md#send-events) API and specifying an instance that didn't exist resulted in a silent failure. Starting in 2.x, raising an event to a non-existent orchestration results in an exception.
