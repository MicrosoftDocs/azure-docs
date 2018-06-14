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

## Activity functions

Activity functions are the basic unit of work in a durable orchestration.  Activity functions are the functions and tasks you are orchestrating in the process.  For example, if creating a durable function to process an order (check inventory, charge customer, create shipment, etc.) each one of those tasks would be an activity function.  Activity functions don't have any restrictions in terms of the type of work you can perform in them.  The durable task framework gaurantees that each called activity function will be executed at-least-once during an orchestration.

An activity function must be triggered by an activity trigger.  This trigger will receive a [DurableActivityContext](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableActivityContext.html) as a parameter, but you can also bind the trigger to any other type to pass in inputs to your activity function.  Your activity function can also return values back to the orchestrator.  Activity functions can only be triggered from an orchestration instance.  You can share code within an app or library between an activity function and another function (like an HTTP triggered function), but you would need to define two distinct functions (1 per trigger type).

More information and examples of activity functions [can be found here](durable-functions-bindings.md#activity-triggers).

## Orchestrator functions

Orchestrator functions 