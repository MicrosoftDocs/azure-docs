---
title: Durable Functions versions overview - Azure Functions
description: Learn about Durable Functions versions.
services: functions
author: cgillum
manager: jeconnoc
keywords:
ms.service: azure-functions
ms.topic: article
ms.date: 10/30/2019
ms.author: azfuncdf
---

# Durable Functions versions overview

*Durable Functions* is an extension of [Azure Functions](../functions-overview.md) and [Azure WebJobs](../../app-service/web-sites-create-web-jobs.md) that lets you write stateful functions in a serverless environment. The extension manages state, checkpoints, and restarts for you. If you are not already familiar with Durable Functions, see the [overview documentation](durable-functions-overview.md).

> [!NOTE]
> Durable Functions 1.0 is generally available (GA). Durable Functions 2.0 is currently in public preview.

## New features in 2.0

### Durable entities

In Durable Functions 2.0, we introduced a new [entity functions](durable-functions-entities.md) concept.

Entity functions define operations for reading and updating small pieces of state, known as *durable entities*. Like orchestrator functions, entity functions are functions with a special trigger type, *entity trigger*. Unlike orchestrator functions, entity functions do not have any specific code constraints. Entity functions also manage state explicitly rather than implicitly representing state via control flow.

To learn more, see the [durable entities](durable-functions-entities.md) article.

### Durable HTTP

In Durable Functions 2.0, we introduced a new [Durable HTTP](durable-functions-http-features.md#consuming-http-apis) feature that allows you to:

* Call HTTP APIs directly from orchestration functions (with some documented limitations)
* Implement automatic client-side HTTP 202 status polling
* Built-in support for [Azure Managed Identities](../../active-directory/managed-identities-azure-resources/overview.md)

To learn more, see the [HTTP features](durable-functions-http-features.md#consuming-http-apis) article.

## Migrate from 1.0 to 2.0

### Durable Functions extension

Install the version of the [Durable Functions bindings extension](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.DurableTask) that matches the version you want to use. See [Register Azure Functions binding extensions](../functions-bindings-register.md) for more information.

### Breaking changes

Several breaking changes are introduced in Durable Functions 2.0. Durable Functions 1.0 applications are not compatible with Durable Functions 2.0 without code changes. This section lists some of the changes.

#### Host.json schema

Durable Functions 2.0 uses a new host.json schema. The main changes from 1.0 include:

* `"storageProvider"` (and the `"azureStorage"` subsection) for storage-specific configuration
* `"tracking"` for tracking and logging configuration
* `"notifications"` (and the `"eventGrid"` subsection) for event grid notification configuration

See the [Durable Functions bindings documentation](durable-functions-bindings.md#durable-functions-2-0-host-json) for details.

#### Public interface changes (.NET only)

The various "context" objects supported by Durable Functions had abstract base classes intended for use in unit testing. As part of Durable Functions 2.0, these abstract base classes have been replaced with interfaces. Function code that uses the concrete types directly are not affected.

The following table represents the main changes:

| Old type | New type |
|----------|----------|
| DurableOrchestrationClientBase | IDurableOrchestrationClient |
| DurableOrchestrationContextBase | IDurableOrchestrationContext |
| DurableActivityContextBase | IDurableActivityContext |
| OrchestrationClientAttribute | DurableClientAttribute |

In the case where an abstract base class contained virtual methods, these virtual methods have been replaced by extension methods defined in `DurableContextExtensions`.
