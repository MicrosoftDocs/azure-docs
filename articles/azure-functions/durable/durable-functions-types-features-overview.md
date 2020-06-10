---
title: Function types in Azure Durable Functions
description: Learn about the types of functions and roles that support function-to-function communication in a Durable Functions orchestration in Azure Functions.
author: cgillum
ms.topic: conceptual
ms.date: 08/22/2019
ms.author: azfuncdf
#Customer intent: As a developer, I want to understand the core concepts and patterns that Azure Durable Functions supports, so I can learn how to use this technology to solve my application development challenges.
---

# Durable Functions types and features

Durable Functions is an extension of [Azure Functions](../functions-overview.md). You can use Durable Functions for stateful orchestration of function execution. A durable function app is a solution that's made up of different Azure functions. Functions can play different roles in a durable function orchestration. 

There are currently four durable function types in Azure Functions: activity, orchestrator, entity, and client. The rest of this section goes into more details about the types of functions involved in an orchestration.

## Orchestrator functions

Orchestrator functions describe how actions are executed and the order in which actions are executed. Orchestrator functions describe the orchestration in code (C# or JavaScript) as shown in [Durable Functions application patterns](durable-functions-overview.md#application-patterns). An orchestration can have many different types of actions, including [activity functions](#activity-functions), [sub-orchestrations](durable-functions-orchestrations.md#sub-orchestrations), [waiting for external events](durable-functions-orchestrations.md#external-events), [HTTP](durable-functions-http-features.md), and [timers](durable-functions-orchestrations.md#durable-timers). Orchestrator functions can also interact with [entity functions](#entity-functions).

> [!NOTE]
> Orchestrator functions are written using ordinary code, but there are strict requirements on how to write the code. Specifically, orchestrator function code must be *deterministic*. Failing to follow these determinism requirements can cause orchestrator functions to fail to run correctly. Detailed information on these requirements and how to work around them can be found in the [code constraints](durable-functions-code-constraints.md) topic.

For more detailed information on orchestrator functions and their features, see the [Durable orchestrations](durable-functions-orchestrations.md) article.

## Activity functions

Activity functions are the basic unit of work in a durable function orchestration. Activity functions are the functions and tasks that are orchestrated in the process. For example, you might create an orchestrator function to process an order. The tasks involve checking the inventory, charging the customer, and creating a shipment. Each task would be a separate activity function. These activity functions may be executed serially, in parallel, or some combination of both.

Unlike orchestrator functions, activity functions aren't restricted in the type of work you can do in them. Activity functions are frequently used to make network calls or run CPU intensive operations. An activity function can also return data back to the orchestrator function. The Durable Task Framework guarantees that each called activity function will be executed *at least once* during an orchestration's execution.

> [!NOTE]
> Because activity functions only guarantee *at least once* execution, we recommend you make your activity function logic *idempotent* whenever possible.

Use an [activity trigger](durable-functions-bindings.md#activity-trigger) to define an activity function. .NET functions receive a `DurableActivityContext` as a parameter. You can also bind the trigger to any other JSON-serializeable object to pass in inputs to the function. In JavaScript, you can access an input via the `<activity trigger binding name>` property on the [`context.bindings` object](../functions-reference-node.md#bindings). Activity functions can only have a single value passed to them. To pass multiple values, you must use tuples, arrays, or complex types.

> [!NOTE]
> You can trigger an activity function only from an orchestrator function.

## Entity functions

Entity functions define operations for reading and updating small pieces of state. We often refer to these stateful entities as *durable entities*. Like orchestrator functions, entity functions are functions with a special trigger type, *entity trigger*. They can also be invoked from client functions or from orchestrator functions. Unlike orchestrator functions, entity functions do not have any specific code constraints. Entity functions also manage state explicitly rather than implicitly representing state via control flow.

> [!NOTE]
> Entity functions and related functionality is only available in Durable Functions 2.0 and above.

For more information about entity functions, see the [Durable Entities](durable-functions-entities.md) article.

## Client functions

Orchestrator functions are triggered by an [orchestration trigger binding](durable-functions-bindings.md#orchestration-trigger) and entity functions are triggered by an [entity trigger binding](durable-functions-bindings.md#entity-trigger). Both of these triggers work by reacting to messages that are enqueued into a [task hub](durable-functions-task-hubs.md). The primary way to deliver these messages is by using an [orchestrator client binding](durable-functions-bindings.md#orchestration-client) or an [entity client binding](durable-functions-bindings.md#entity-client) from within a *client function*. Any non-orchestrator function can be a *client function*. For example, You can trigger the orchestrator from an HTTP-triggered function, an Azure Event Hub triggered function, etc. What makes a function a *client function* is its use of the durable client output binding.

> [!NOTE]
> Unlike other function types, orchestrator and entity functions cannot be triggered directly using the buttons in the Azure Portal. If you want to test an orchestrator or entity function in the Azure Portal, you must instead run a *client function* that starts an orchestrator or entity function as part of its implementation. For the simplest testing experience, a *manual trigger* function is recommended.

In addition to triggering orchestrator or entity functions, the *durable client* binding can be used to interact with running orchestrations and entities. For example, orchestrations can be queried, terminated, and can have events raised to them. For more information on managing orchestrations and entities, see the [Instance management](durable-functions-instance-management.md) article.

## Next steps

To get started, create your first durable function in [C#](durable-functions-create-first-csharp.md) or [JavaScript](quickstart-js-vscode.md).

> [!div class="nextstepaction"]
> [Read more about Durable Functions orchestrations](durable-functions-orchestrations.md)