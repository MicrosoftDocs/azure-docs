---
title: Durable Functions versions overview - Azure Functions
description: Learn about Durable Functions versions.
author: cgillum
ms.topic: conceptual
ms.date: 10/30/2019
ms.author: azfuncdf
---

# Durable Functions versions overview

*Durable Functions* is an extension of [Azure Functions](../functions-overview.md) and [Azure WebJobs](../../app-service/web-sites-create-web-jobs.md) that lets you write stateful functions in a serverless environment. The extension manages state, checkpoints, and restarts for you. If you are not already familiar with Durable Functions, see the [overview documentation](durable-functions-overview.md).

## New features in 2.x

This section describes the features of Durable Functions that are added in version 2.x.

### Durable entities

In Durable Functions 2.x, we introduced a new [entity functions](durable-functions-entities.md) concept.

Entity functions define operations for reading and updating small pieces of state, known as *durable entities*. Like orchestrator functions, entity functions are functions with a special trigger type, *entity trigger*. Unlike orchestrator functions, entity functions do not have any specific code constraints. Entity functions also manage state explicitly rather than implicitly representing state via control flow.

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

Install version 2.x of the [Durable Functions bindings extension](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.DurableTask) in your project. See [Register Azure Functions binding extensions](../functions-bindings-register.md) for more information.

### Update your code

Durable Functions 2.x introduces several breaking changes. Durable Functions 1.x applications are not compatible with Durable Functions 2.x without code changes. This section lists some of the changes you must make when upgrading your version 1.x functions to 2.x.

#### Host.json schema

Durable Functions 2.x uses a new host.json schema. The main changes from 1.x include:

* `"storageProvider"` (and the `"azureStorage"` subsection) for storage-specific configuration.
* `"tracing"` for tracing and logging configuration.
* `"notifications"` (and the `"eventGrid"` subsection) for event grid notification configuration.

See the [Durable Functions host.json reference documentation](durable-functions-bindings.md#durable-functions-2-0-host-json) for details.

#### Default taskhub name changes

In version 1.x, if a task hub name was not specified in host.json, it was defaulted to "DurableFunctionsHub". In version 2.x, the default task hub name is now derived from the name of the function app. Because of this, if you have not specified a task hub name when upgrading to 2.x, your code will be operating with new task hub, and all in-flight orchestrations will no longer have an application processing them. To work around this, you can either explicitly set your task hub name to the v1.x default of "DurableFunctionsHub", or you can follow our [zero-downtime deployment guidance](durable-functions-zero-downtime-deployment.md) for details on how to handle breaking changes for in-flight orchestrations.

#### Public interface changes (.NET only)

In version 1.x, the various _context_ objects supported by Durable Functions have abstract base classes intended for use in unit testing. As part of Durable Functions 2.x, these abstract base classes are replaced with interfaces.

The following table represents the main changes:

| 1.x | 2.x |
|----------|----------|
| `DurableOrchestrationClientBase` | `IDurableOrchestrationClient` or `IDurableClient` |
| `DurableOrchestrationContext` or `DurableOrchestrationContextBase` | `IDurableOrchestrationContext` |
| `DurableActivityContext` or `DurableActivityContextBase` | `IDurableActivityContext` |
| `OrchestrationClientAttribute` | `DurableClientAttribute` |

In the case where an abstract base class contained virtual methods, these virtual methods have been replaced by extension methods defined in `DurableContextExtensions`.

#### function.json changes (JavaScript and C# Script)

In Durable Functions 1.x, the orchestration client binding uses a `type` of `orchestrationClient`. Version 2.x uses `durableClient` instead.
