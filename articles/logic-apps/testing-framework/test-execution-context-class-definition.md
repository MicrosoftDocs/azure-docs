---
title: Test Execution Context Class Definition
description: Describes the TestExecutionContext class that provides execution context for Logic Apps workflow testing, helping maintain state during test execution and creating dynamic mocks.
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 05/26/2025
---

# TestExecutionContext

**Namespace**: Microsoft.Azure.Workflows.UnitTesting.Definitions

The execution context for a unit test.

## Usage

The TestExecutionContext class provides the execution context for Logic Apps workflow testing. It helps in maintaining state during test execution and is especially useful when creating dynamic mocks that respond differently based on the current workflow state.

```C#
// Create an action execution context
var actionContext = new TestActionExecutionContext
{
    ActionName = "ProcessOrder",
    ActionInputs = JToken.Parse(@"{
        ""orderId"": 12345,
        ""customerId"": ""CUST-987"",
        ""items"": [
            {""productId"": ""P100"", ""quantity"": 2},
            {""productId"": ""P200"", ""quantity"": 1}
        ]
    }"),
    ParentActionName = "OrderWorkflow"
};

// Create an execution context with the action context
var executionContext = new TestExecutionContext
{
    ActionContext = actionContext
};

// Use in a mock to make decisions based on context
var dynamicMock = new ActionMock(
    (context) => {
        var orderId = (int)context.ActionContext.ActionInputs["orderId"];
        
        // Different behavior based on order ID
        if (orderId > 10000) {
            return new ActionMock(
                TestWorkflowStatus.Succeeded, 
                "ProcessOrder", 
                new MockOutput { Body = JToken.Parse(@"{""status"": ""premium""}") }
            );
        }
        
        return new ActionMock(
            TestWorkflowStatus.Succeeded, 
            "ProcessOrder", 
            new MockOutput { Body = JToken.Parse(@"{""status"": ""standard""}") }
            );
    }
);
```

## Properties

| Name | Description | Type |
|------|-------------|------|
| ActionContext | Gets the current action context | [TestActionExecutionContext](TestActionExecutionContext-document.md) |

## Constructor

This class uses property initialization for construction.

```C#
// Example: Creating a TestExecutionContext
var actionContext = new TestActionExecutionContext { /* action context properties */ };
var executionContext = new TestExecutionContext
{
    ActionContext = actionContext
};
```

## Related Content

* [Action Mock Class Definition](action-mock-class-definition.md)
* [Trigger Mock Class Definition](trigger-mock-class-definition.md)
* [Test Action Execution Context Class Definition](test-action-execution-context-class-definition.md)
* [Test Iteration Item Class Definition](test-iteration-item-class-definition.md)
* [Test Workflow Run Class Definition](test-workflow-run-class-definition.md)
