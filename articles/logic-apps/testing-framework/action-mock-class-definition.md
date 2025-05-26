---
title: Action Mock Class Definition
description: Describes the ActionMock class for simulating actions in Logic Apps workflow unit tests, including its constructors, usage examples for static and dynamic outputs, and error handling.
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 05/26/2025
---

# Action Mock Class Definition

**Namespace**: *Microsoft.Azure.Workflows.UnitTesting.Definitions*

This class creates a mocked instance of an action in a workflow.

## Usage

The ActionMock class helps you create simulated actions for testing Logic Apps workflows. You can create different types of action mocks to test various scenarios.

```C#
// Simple success action
var simpleAction = new ActionMock(TestWorkflowStatus.Succeeded, "SendEmail");

// Action with specific outputs
var outputAction = new ActionMock(
    TestWorkflowStatus.Succeeded, 
    "HttpRequest",
    new MockOutput { 
        StatusCode = 200,
        Headers = JToken.Parse(@"{""Content-Type"": ""application/json""}"),
        Body = JToken.Parse(@"{""result"": ""success"", ""id"": 12345}")
    });

// Failed action with error information
var failedAction = new ActionMock(
    TestWorkflowStatus.Failed,
    "DatabaseWrite",
    new TestErrorInfo {
        Message = "Database connection failed",
        Code = "CONNECTION_ERROR"
    });

// Dynamic action that changes behavior based on input parameters
var dynamicAction = new ActionMock(
    (context) => {
        var inputs = context.ActionContext.ActionInputs;
        var amount = (int)inputs["amount"];
        
        if (amount > 1000) {
            return new ActionMock(TestWorkflowStatus.Failed, "PaymentProcessing", 
                new TestErrorInfo { Message = "Amount exceeds limit" });
        }
        
        return new ActionMock(TestWorkflowStatus.Succeeded, "PaymentProcessing",
            new MockOutput { Body = JToken.Parse(@"{""transactionId"": ""ABC123""}") });
    },
    "DynamicPaymentAction");
```

## Constructors

> [!NOTE]
>
> Each Action mock will have a mock output derived from its Action type. You will find classes for each action and trigger mock output generated when you create a new unit test from a [workflow definition](create-unit-tests-standard-workflow-definitions-visual-studio-code.md) or from a [workflow run](create-unit-tests-standard-workflow-runs-visual-studio-code.md).

### Constructor with Static Outputs

Creates a mocked instance for ActionMock with static outputs.

```C#
public ActionMock(TestWorkflowStatus status, string name = null, MockOutput outputs = null)
```

| Name | Description | Type |
|------|-------------|------|
| status | The mocked action result status | TestWorkflowStatus |
| name | The mocked action name | string * |
| outputs | The mocked static outputs | MockOutput * |

```C#
// Example: Creating an action mock with successful status and static outputs
var outputs = new MockOutput { /* output properties */ };
var actionMock = new ActionMock(TestWorkflowStatus.Succeeded, "MyAction", outputs);
```

### Constructor with Error Info

Creates a mocked instance for ActionMock with static error info.

```C#
public ActionMock(TestWorkflowStatus status, string name = null, TestErrorInfo error = null)
```

| Name | Description | Type |
|------|-------------|------|
| status | The mocked action result status | TestWorkflowStatus |
| name | The mocked action name | string * |
| error | The mocked action error info | TestErrorInfo * |

```C#
// Example: Creating an action mock with failed status and error information
var errorInfo = new TestErrorInfo { /* error properties */ };
var actionMock = new ActionMock(TestWorkflowStatus.Failed, "MyFailedAction", errorInfo);
```

### Constructor with Callback Function

Creates a mocked instance for ActionMock with a callback function for dynamic outputs.

```C#
public ActionMock(Func<TestExecutionContext, ActionMock> onGetActionMock, string name = null)
```

| Name | Description | Type |
|------|-------------|------|
| onGetActionMock | The callback function to get the mocked action | Func<TestExecutionContext, ActionMock> |
| name | The mocked action name | string * |

```C#
// Example: Creating an action mock with dynamic outputs based on execution context
var actionMock = new ActionMock(
    (context) => {
        // Determine outputs dynamically based on context
        return new ActionMock(TestWorkflowStatus.Succeeded, "DynamicAction", new MockOutput { /* dynamic outputs */ });
    }, 
    "MyDynamicAction");
```

## Related Content

* [Trigger Mock Class Definition](trigger-mock-class-definition.md)
* [Test Execution Context Class Definition](test-execution-context-class-definition.md)
* [Test Action Execution Context Class Definition](test-action-execution-context-class-definition.md)
* [Test Iteration Item Class Definition](test-iteration-item-class-definition.md)
* [Test Workflow Run Class Definition](test-workflow-run-class-definition.md)
