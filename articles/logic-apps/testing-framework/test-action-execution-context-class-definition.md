---
title: Test Action Execution Context Class Definition
description: Describes the TestActionExecutionContext class that stores information about the current action being executed in Logic Apps workflow tests, including action name, inputs, parent action, and iteration context.
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 05/26/2025
---

# TestActionExecutionContext

**Namespace**: Microsoft.Azure.Workflows.UnitTesting.Definitions

The execution context for a unit test action.

## Usage

The TestActionExecutionContext class stores information about the current action being executed in a Logic Apps workflow test. It contains details like the action name, inputs, parent action, and iteration context, which are useful for creating context-aware test mocks.

```C#
// Basic context with action name and inputs
var basicContext = new TestActionExecutionContext
{
    ActionName = "SendEmail",
    ActionInputs = JToken.Parse(@"{
        ""to"": ""recipient@example.com"",
        ""subject"": ""Test Notification"",
        ""body"": ""This is a test email""
    }")
};

// Context for a nested action with parent information
var nestedContext = new TestActionExecutionContext
{
    ActionName = "ValidateAddress",
    ParentActionName = "ProcessCustomer",
    ActionInputs = JToken.Parse(@"{
        ""streetAddress"": ""123 Main St"",
        ""city"": ""Seattle"",
        ""state"": ""WA"",
        ""zipCode"": ""98101""
    }")
};

// Context with iteration information for a 'For each' action
var iterationItem = new TestIterationItem
{
    Index = 2,
    Item = JToken.Parse(@"{
        ""id"": ""ORD-3456"",
        ""product"": ""Wireless Headphones"",
        ""quantity"": 1
    }")
};

var iterationContext = new TestActionExecutionContext
{
    ActionName = "ProcessOrderItem",
    ParentActionName = "ProcessAllOrders",
    CurrentIterationInput = iterationItem,
    ActionInputs = JToken.Parse(@"{""processMode"": ""express""}")
};
```

## Properties

| Name | Description | Type |
|------|-------------|------|
| ActionName | Gets or sets the current action name | string |
| ActionInputs | Gets or sets the current action inputs | JToken |
| ParentActionName | Gets or sets the current parent action name | string |
| CurrentIterationInput | Gets or sets the current iteration input | [TestIterationItem](TestIterationItem-document.md) |

## Constructor

This class uses property initialization for construction.

```C#
// Example: Creating a TestActionExecutionContext
var iterationItem = new TestIterationItem 
{
    Index = 0,
    Item = JToken.Parse("{ \"value\": \"test\" }")
};

var actionContext = new TestActionExecutionContext
{
    ActionName = "SendEmail",
    ActionInputs = JToken.Parse("{ \"to\": \"example@example.com\", \"subject\": \"Test Email\" }"),
    ParentActionName = "ProcessEmails",
    CurrentIterationInput = iterationItem
};
```

## Related Content

* [Action Mock Class Definition](action-mock-class-definition.md)
* [Trigger Mock Class Definition](trigger-mock-class-definition.md)
* [Test Execution Context Class Definition](test-execution-context-class-definition.md)
* [Test Iteration Item Class Definition](test-iteration-item-class-definition.md)
* [Test Workflow Run Class Definition](test-workflow-run-class-definition.md)
