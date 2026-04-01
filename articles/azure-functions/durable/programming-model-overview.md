---
title: Programming model overview - Durable Functions and Durable Task SDKs
description: Learn about the core programming components in Durable Task, including orchestrators, activities, entities, and client APIs for both Durable Functions and the Durable Task SDKs.
author: cgillum
ms.topic: concept-article
ms.date: 02/18/2026
ms.author: azfuncdf
ms.reviewer: hannahhunter
ms.service: azure-functions
ms.subservice: durable
zone_pivot_groups: azure-durable-approach
#Customer intent: As a developer, I want to understand the core programming components of Durable Task so I can build stateful, fault-tolerant applications.
---

# Programming model overview

::: zone pivot="durable-functions"

Durable Functions is an extension of [Azure Functions](../functions-overview.md) that adds stateful orchestration capabilities to your function app. A Durable Functions app is made up of different Azure functions, each playing a specific role: orchestrator, activity, entity, or client. These roles correspond to specialized [trigger and binding types](durable-functions-bindings.md) that the Durable Functions extension provides.

::: zone-end

::: zone pivot="durable-task-sdks"

The Durable Task SDKs let you build stateful, fault-tolerant applications on any compute platform. Your app defines orchestrators, activities, and entities as classes or functions that you register with a worker. A separate client API lets you start and manage orchestration instances.

::: zone-end

The following table summarizes the core programming components and their roles:

::: zone pivot="durable-functions"

| Component | Role | Defined by |
| - | - | - |
| [Orchestrator](#orchestrators) | Coordinates workflow logic | [Orchestration trigger](durable-functions-bindings.md#orchestration-trigger) |
| [Activity](#activities) | Performs a single unit of work | [Activity trigger](durable-functions-bindings.md#activity-trigger) |
| [Entity](#entities) | Manages a small piece of state | [Entity trigger](durable-functions-bindings.md#entity-trigger) |
| [Client](#client) | Starts and manages orchestrations and entities | [Durable client binding](durable-functions-bindings.md#orchestration-client) |

::: zone-end

::: zone pivot="durable-task-sdks"

| Component | Role | Defined by |
| - | - | - |
| [Orchestrator](#orchestrators) | Coordinates workflow logic | A class or function registered with the worker |
| [Activity](#activities) | Performs a single unit of work | A class or function registered with the worker |
| [Entity](#entities) | Manages a small piece of state | A class registered with the worker |
| [Client](#client) | Starts and manages orchestrations and entities | `DurableTaskClient` API |

::: zone-end

## Orchestrators

Orchestrators define the workflow: what actions to take, in what order, and how to handle the results. You write orchestrator logic as ordinary code using standard control-flow constructs like loops, conditionals, and try/catch blocks.

An orchestrator can schedule several types of tasks:

- [Activities](#activities) for executing work
- [Sub-orchestrations](durable-functions-sub-orchestrations.md) for composing smaller workflows
- [Durable timers](durable-functions-timers.md) for delays and timeouts
- [External events](durable-functions-external-events.md) for waiting on signals from outside the orchestration

Orchestrators can also interact with [entities](#entities).

::: zone pivot="durable-functions"

In Durable Functions, you define an orchestrator by using the [orchestration trigger binding](durable-functions-bindings.md#orchestration-trigger). The trigger provides a context object that you use to schedule tasks and receive results.

::: zone-end

::: zone pivot="durable-task-sdks"

In the Durable Task SDKs, you define an orchestrator by implementing a class or function and registering it with the Durable Task worker. The orchestrator receives a context object that you use to schedule tasks and receive results.

::: zone-end

> [!IMPORTANT]
> Orchestrator code must be *deterministic*. The Durable Task runtime uses [event sourcing and replay](durable-functions-orchestrations.md#reliability) to rebuild orchestrator state, so nondeterministic code can cause failures or deadlocks. For detailed guidance, see [Orchestrator code constraints](durable-functions-code-constraints.md).

For a complete overview of orchestrator behavior, including replay, instance identity, and error handling, see [Durable orchestrations](durable-functions-orchestrations.md).

## Activities

Activities are the basic unit of work in a durable orchestration. Each activity typically represents a single task, such as calling a web API, writing to a database, or computing a result. Orchestrators call activities to do their real work.

Activities differ from orchestrators in key ways:

- **No code restrictions.** Orchestrators must be deterministic, but activities can run any code, including nondeterministic or long-running operations.
- **At-least-once execution.** The runtime guarantees that each activity runs *at least once* during an orchestration. If a failure occurs after the activity completes but before the result is recorded, the runtime might rerun it.
- **Single responsibility.** Each activity receives one input and returns one output. To pass multiple values, use a complex type or collection.

::: zone pivot="durable-functions"

You define an activity function by using the [activity trigger binding](durable-functions-bindings.md#activity-trigger). The trigger provides the input that the orchestrator passed when scheduling the activity.

::: zone-end

::: zone pivot="durable-task-sdks"

You define an activity by implementing a class or function and registering it with the Durable Task worker. The activity receives the input that the orchestrator passed when scheduling it.

::: zone-end

> [!NOTE]
> Because activities guarantee only at-least-once execution, make your activity logic [idempotent](https://en.wikipedia.org/wiki/Idempotence) whenever possible. For example, use "upserts" instead of inserts, or check for existing results before creating new resources.

Activities can run [serially](durable-functions-sequence.md), in [parallel](durable-functions-fan-in-fan-out.md), or in a combination of both.

## Entities

Entities manage small, durable pieces of state. Each entity has a unique identity and a set of named operations that can read or update its internal state. Entities differ from orchestrators in that they manage state explicitly through operations instead of implicitly through control flow. They also differ from orchestrators in that they don't have the same code restrictions — entity operations can run any code, including nondeterministic or long-running operations.

Common uses for entities include:

- Aggregating data from multiple sources
- Implementing distributed locks or semaphores
- Modeling stateful objects like shopping carts or game sessions

Entities run operations serially: only one operation runs at a time for a given entity instance. This serial execution prevents concurrency conflicts without requiring explicit locking.

::: zone pivot="durable-functions"

You define an entity function by using the [entity trigger binding](durable-functions-bindings.md#entity-trigger).

> [!NOTE]
> Entity functions are supported in .NET, JavaScript/TypeScript, Python, and Java, but not in PowerShell.

::: zone-end

::: zone pivot="durable-task-sdks"

You define an entity by implementing a class and registering it with the Durable Task worker.

> [!NOTE]
> Entity support is available in the .NET, JavaScript/TypeScript, and Python SDKs. The Java SDK doesn't currently support entities.

::: zone-end

For a complete guide to defining, calling, and managing entities, see [Durable entities](durable-functions-entities.md).

## Client

The client component is how you interact with orchestrations and entities from outside the orchestration. Common client operations include:

- **Scheduling** new orchestration instances
- **Querying** the status of running or completed orchestrations
- **Raising events** to waiting orchestrations
- **Suspending and resuming** orchestration instances
- **Terminating** orchestration instances
- **Signaling** entity operations and reading entity state

::: zone pivot="durable-functions"

Any non-orchestrator function can act as a client function. What makes it a client is the use of the [durable client output binding](durable-functions-bindings.md#orchestration-client). For example, you can start an orchestration from an HTTP-triggered function, a queue-triggered function, or a timer-triggered function.

The durable client binding also provides APIs for interacting with [entities](durable-functions-entities.md), including signaling entity operations and reading entity state. For more information, see the [entity client binding](durable-functions-bindings.md#entity-client).

::: zone-end

::: zone pivot="durable-task-sdks"

In the Durable Task SDKs, you interact with orchestrations and entities through the `DurableTaskClient` class. You create a client instance in your application code and call its methods to start, query, or manage orchestration and entity instances. The client can be used from any part of your application — an HTTP endpoint, a background service, a console app, or any other code.

::: zone-end

For detailed information on all instance management operations, including code samples for each language, see [Manage orchestration instances](durable-functions-instance-management.md).

## Next steps

::: zone pivot="durable-functions"

Get started by creating your first Durable Function app:

- [C#](durable-functions-isolated-create-first-csharp.md)
- [JavaScript](quickstart-js-vscode.md)
- [Python](quickstart-python-vscode.md)
- [TypeScript](quickstart-ts-vscode.md)
- [PowerShell](quickstart-powershell-vscode.md)
- [Java](quickstart-java.md)

> [!div class="nextstepaction"]
> [Learn more about durable orchestrations](durable-functions-orchestrations.md)

::: zone-end

::: zone pivot="durable-task-sdks"

Get started with the Durable Task SDKs:

- [Durable Task SDK quickstart](durable-task-scheduler/quickstart-durable-task-scheduler.md)
- [Host a Durable Task SDK app on Azure Container Apps](durable-task-scheduler/quickstart-container-apps-durable-task-sdk.md)

> [!div class="nextstepaction"]
> [Learn more about durable orchestrations](durable-functions-orchestrations.md)

::: zone-end
