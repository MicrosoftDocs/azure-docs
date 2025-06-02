---
title: ActionMock Class Definition
description: Creates a mocked instance of an action in a workflow for testing purposes
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 06/02/2025
---

# ActionMock Class Definition

**Namespace**: Microsoft.Azure.Workflows.UnitTesting.Definitions

This class creates a mocked instance of an action in a workflow. It inherits from `OperationMock` and provides multiple ways to create action mocks for testing Logic Apps workflows with static outputs, error conditions, or dynamic behavior based on execution context.

## Usage

```C#
// Simple action mock with success status
var successAction = new [ActionMock](action-mock-class-definition.md)([TestWorkflowStatus](test-workflow-status-enum-definition.md).Succeeded, "SendEmail");

// Action mock with specific outputs
var outputAction = new [ActionMock](action-mock-class-definition.md)(
    [TestWorkflowStatus](test-workflow-status-enum-definition.md).Succeeded, 
    "HttpRequest",
    new MockOutput { 
        StatusCode = 200,
        Headers = JToken.Parse(@"{""Content-Type"": ""application/json""}"),
        Body = JToken.Parse(@"{""result"": ""success"", ""id"": 12345}")
    });

// Failed action with error information
var failedAction = new [ActionMock](action-mock-class-definition.md)(
    [TestWorkflowStatus](test-workflow-status-enum-definition.md).Failed,
    "DatabaseWrite",
    new [TestErrorInfo](test-error-info-class-definition.md)(
        ErrorResponseCode.BadRequest,
        "Database connection failed"
    ));

// Dynamic action that changes behavior based on execution context
var dynamicAction = new ActionMock(
    (context) => {
        var inputs = context.ActionContext.ActionInputs;
        var amount = (int)inputs["amount"];
        
        if (amount > 1000) {
            return new ActionMock(TestWorkflowStatus.Failed, "PaymentProcessing", 
                new TestErrorInfo(ErrorResponseCode.BadRequest, "Amount exceeds limit"));
        }
        
        return new ActionMock(TestWorkflowStatus.Succeeded, "PaymentProcessing",
            new MockOutput { Body = JToken.Parse(@"{""transactionId"": ""ABC123""}") });
    },
    "DynamicPaymentAction");
```

## Constructors

### Constructor with Static Outputs

Creates a mocked instance for ActionMock with static outputs.

```C#
public ActionMock(TestWorkflowStatus status, string name = null, MockOutput outputs = null)
```

|Name|Description|Type|Required|
|---|---|---|---|
|status|The mocked action result status|[TestWorkflowStatus](test-workflow-status-enum-definition.md)|Yes|
|name|The mocked action name|string|No|
|outputs|The mocked static outputs|MockOutput|No|

```C#
// Example: Creating an action mock with successful status and static outputs
var outputs = new MockOutput { 
    Body = JToken.Parse(@"{""result"": ""Operation completed""}"),
    StatusCode = 200
};
var actionMock = new ActionMock(TestWorkflowStatus.Succeeded, "ProcessData", outputs);
```

### Constructor with Error Info

Creates a mocked instance for ActionMock with static error info.

```C#
public ActionMock(TestWorkflowStatus status, string name = null, TestErrorInfo error = null)
```

|Name|Description|Type|Required|
|---|---|---|---|
|status|The mocked action result status|TestWorkflowStatus|Yes|
|name|The mocked action name|string|No|
|error|The mocked action error info|TestErrorInfo|No|

```C#
// Example: Creating an action mock with failed status and error information
var errorInfo = new TestErrorInfo(
    ErrorResponseCode.InternalServerError,
    "Service temporarily unavailable"
);
var actionMock = new ActionMock(TestWorkflowStatus.Failed, "ExternalAPICall", errorInfo);
```

### Constructor with Callback Function

Creates a mocked instance for ActionMock with a callback function for dynamic outputs.

```C#
public ActionMock(Func<TestExecutionContext, ActionMock> onGetActionMock, string name = null)
```

|Name|Description|Type|Required|
|---|---|---|---|
|onGetActionMock|The callback function to get the mocked action|Func&lt;[TestExecutionContext](test-execution-context-class-definition.md), [ActionMock](action-mock-class-definition.md)&gt;|Yes|
|name|The mocked action name|string|No|

```C#
// Example: Creating an action mock with dynamic outputs based on execution context
var actionMock = new ActionMock(
    (context) => {
        var actionName = context.ActionContext.ActionName;
        var inputs = context.ActionContext.ActionInputs;
          // Determine outputs dynamically based on context
        if (actionName == "ValidateUser" && inputs["userId"]?.Value<int>() > 0) {
            return new [ActionMock](action-mock-class-definition.md)(
                [TestWorkflowStatus](test-workflow-status-enum-definition.md).Succeeded,
                "ValidateUser", 
                new MockOutput { Body = JToken.Parse(@"{""isValid"": true}") }
            );
        }
        
        return new [ActionMock](action-mock-class-definition.md)([TestWorkflowStatus](test-workflow-status-enum-definition.md).Failed, "ValidateUser");
    }, 
    "ConditionalValidation");
```

## Properties

This class inherits the following properties from its base class `OperationMock`:

|Name|Description|Type|Required|
|---|---|---|---|
|Name|Gets or sets the name of the mocked operation|string|No|
|Status|Gets or sets the operation status|[TestWorkflowStatus](test-workflow-status-enum-definition.md)?|No|
|Outputs|Gets or sets a value that represents static output in JSON format|JToken|No|
|Error|Gets or sets the operation error|[TestErrorInfo](test-error-info-class-definition.md)|No|

## Related Content

- [MockData](mock-data-class-definition.md)
- [TestActionExecutionContext](test-action-execution-context-class-definition.md)
- [TestErrorInfo](test-error-info-class-definition.md)
- [TestErrorResponseAdditionalInfo](test-error-response-additional-info-class-definition.md)
- [TestExecutionContext](test-execution-context-class-definition.md)
- [TestIterationItem](test-iteration-item-class-definition.md)
- [TestWorkflowOutputParameter](test-workflow-output-parameter-class-definition.md)
- [TestWorkflowRun](test-workflow-run-class-definition.md)
- [TestWorkflowRunActionRepetitionResult](test-workflow-run-action-repetition-result-class-definition.md)
- [TestWorkflowRunActionResult](test-workflow-run-action-result-class-definition.md)
- [TestWorkflowRunOperationResult](test-workflow-run-operation-result-class-definition.md)
- [TestWorkflowRunTriggerResult](test-workflow-run-trigger-result-class-definition.md)
- [TestWorkflowStatus](test-workflow-status-enum-definition.md)
- [TriggerMock](trigger-mock-class-definition.md)
- [UnitTestExecutor](unit-test-executor-class-definition.md)
