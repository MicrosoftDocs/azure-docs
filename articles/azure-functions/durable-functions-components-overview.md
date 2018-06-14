---
title: Function-to-Function Communication in Durable Functions - Azure
description: Learn the types of functions and roles that allow for function-to-function communication as part of a durable function orchestration.
services: functions
author: jeffhollan
manager: cfowler
editor: ''
tags: ''
keywords:
ms.service: functions
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 04/30/2018
ms.author: azfuncdf
---

# Function-to-Function Communication in Durable Functions (Azure Functions)

Azure Durable Functions facilitates stateful orchestration of function execution.  A durable function is a solution made up of different Azure Functions.  Each of these functions can perform different roles as part of an orchestration.  The following article provides an overview of the types of functions involved in a durable function orchestration, and some common patterns to connect these functions together.

## Types of functions

### Activity functions

Activity functions are the basic unit of work in a durable orchestration.  Activity functions are the functions and tasks you are orchestrating in the process.  For example, if creating a durable function to process an order (check inventory, charge customer, create shipment, etc.) each one of those tasks would be an activity function.  Activity functions don't have any restrictions in terms of the type of work you can perform in them, and can be written in any language supported by the app.  The durable task framework gaurantees that each called activity function will be executed at-least-once during an orchestration.

An activity function must be triggered by an [activity trigger](durable-functions-bindings.md#activity-triggers).  This trigger will receive a [DurableActivityContext](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableActivityContext.html) as a parameter, but you can also bind the trigger to any other type to pass in inputs to your activity function.  Your activity function can also return values back to the orchestrator.  If sending or returning multiple values from an activity funciton, you can [leverage tuples or arrays](durable-functions-bindings#passing-multiple-parameters).  Activity functions can only be triggered from an orchestration instance.  You can share code within an app or library between an activity function and another function (like an HTTP triggered function), but you would need to define two distinct functions (1 per trigger type).

More information and examples of activity functions [can be found here](durable-functions-bindings.md#activity-triggers).

### Orchestrator functions

Orchestrator functions are the heart of a durable function.  Orchestrator functions describe the way and order actions are executed.  Orchestrator functions can describe the orchestration in code (C# or JavaScript) as shown in the [durable functions overview](durable-functions-overview).  An orchestration can contain many different types of actions, like [activity Functions](#activity-functions), [sub-orchestrations](#sub-orchestrations), [waiting for external events](#external-events), and timers.  

An orchestrator function must be triggered by an [orchestration trigger](durable-functions-bindings#orchestration-triggers).  This trigger will receive a [DurableOrchestrationContext](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html).

An orchestrator is started by an [orchestrator client](#entry-or-client-functions) which could itself be triggered from any source (HTTP, queues, event streams).  Each instance of an orchestration has an instance ID, which can be auto-generated (recommended) or user-generated.  This ID can be used to [managed instances](durable-functions-instance-management) of the orchestration.

More information and examples of orchestrator functions [can be found here]((durable-functions-bindings#orchestration-triggers).

### Entry or client functions

Entry functions are the triggered functions that will create new instances of an orchestration.  These can be triggered by any function trigger (HTTP, queues, event streams, etc.) and written in any language supported by the app.  In addition to the trigger, entry functions have an [orchestration client](durable-functions-bindings#orchestration-client) binding that allows them to create and manage durable orchestrations.  The most basic example of an entry function is an HTTP triggered function that starts an orchestrator function and returns a check status response as [shown in this following example](durable-functions-http-api#http-api-url-discovery).

More information and examples of entry or client functions [can be found here](durable-functions-bindings#orchestration-client).

## Capabilities and patterns

### Sub-orchestrations

In addition to calling activity functions, orchestrator functions can call other orchestrator functions. For example, you can build a larger orchestration out of a library of orchestrator functions. Or you can run multiple instances of an orchestrator function in parallel.

More information and examples of sub-orchestrations [can be found here](durable-functions-sub-orchestrations).

### External events

Orchestrator functions have the ability to wait and listen for external events. This feature of Durable Functions is often useful for handling human interaction or other external triggers.

More information and examples of handling external events [can be found here](durable-functions-external-events).

### Error handling

Durable Function orchestrations are implemented in code and can use the error-handling capabilities of the programming language.  This means you can use concepts like `try` and `catch` in your orchestration.  Durable functions also comes with some built-in retry policies you can define in your orchestration, so an action can wait and retry activities on exceptions.  This enables you to handle transient exceptions without having to abondon the orchestration.

More information and examples of error handling [can be found here](durable-functions-error-handling).

### Cross-function app communication

