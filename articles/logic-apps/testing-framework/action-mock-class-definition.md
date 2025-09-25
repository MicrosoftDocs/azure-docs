---
title: ActionMock class
description: Creates a mock instance for an action in a Standard logic app workflow for unit testing.
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 06/10/2025
---

# ActionMock class

**Namespace**: Microsoft.Azure.Workflows.UnitTesting.Definitions

This class creates a mock instance for an action in a Standard logic app workflow. The **`*ActionMock`** class provides multiple ways to create mock actions for testing Standard workflows with static outputs, error conditions, or dynamic behavior based on execution context.

## Usage

```C#
// Simple mock action with success status
var successAction = new ActionMock(TestWorkflowStatus.Succeeded, "SendEmail");

// A mock action with specific outputs
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
    new TestErrorInfo(
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

### Constructor with static outputs

Creates a mock instance for **`ActionMock`** with static outputs.

```C#
public ActionMock(TestWorkflowStatus status, string name = null, MockOutput outputs = null)
```

| Name | Description | Type | Required |
|---|---|---|---|
| status | The mock action result status. | [TestWorkflowStatus](test-workflow-status-enum-definition.md) | Yes |
| name | The mock action name. | string | No |
| outputs| The mock static outputs. | MockOutput | No |

```C#
// Example: Create a mock action with successful status and static outputs
var outputs = new MockOutput { 
    Body = JToken.Parse(@"{""result"": ""Operation completed""}"),
    StatusCode = 200
};
var actionMock = new ActionMock(TestWorkflowStatus.Succeeded, "ProcessData", outputs);
```

### Constructor with error info

Creates a mock instance for **`ActionMock`** with static error info.

```C#
public ActionMock(TestWorkflowStatus status, string name = null, TestErrorInfo error = null)
```

|Name|Description|Type|Required|
|---|---|---|---|
|status|The mock action result status.|TestWorkflowStatus|Yes|
|name|The mock action name.|string|No|
|error|The mock action error info.|TestErrorInfo|No|

```C#
// Example: Create an action mock with failed status and error information
var errorInfo = new TestErrorInfo(
    ErrorResponseCode.InternalServerError,
    "Service temporarily unavailable"
);
var actionMock = new ActionMock(TestWorkflowStatus.Failed, "ExternalAPICall", errorInfo);
```

### Constructor with callback function

Creates a mock instance for **`ActionMock`** with a callback function for dynamic outputs.

```C#
public ActionMock(Func<TestExecutionContext, ActionMock> onGetActionMock, string name = null)
```

|Name|Description|Type|Required|
|---|---|---|---|
|onGetActionMock|The callback function to get the mock action|Func&lt;[TestExecutionContext](test-execution-context-class-definition.md), [ActionMock](action-mock-class-definition.md)&gt;|Yes|
|name|The mock action name|string|No|

```C#
// Example: Create a mock action with dynamic outputs based on execution context
var actionMock = new ActionMock(
    (context) => {
        var actionName = context.ActionContext.ActionName;
        var inputs = context.ActionContext.ActionInputs;
          // Determine outputs dynamically based on context
        if (actionName == "ValidateUser" && inputs["userId"]?.Value<int>() > 0) {
            return new ActionMock(
                TestWorkflowStatus.Succeeded,
                "ValidateUser", 
                new MockOutput { Body = JToken.Parse(@"{""isValid"": true}") }
            );
        }
        
        return new ActionMock(TestWorkflowStatus.Failed, "ValidateUser");
    }, 
    "ConditionalValidation");
```

### JSON constructor

Creates a mock instance for **`ActionMock`** from JSON.

```C#
internal ActionMock(TestWorkflowStatus status, string name = null, JToken outputs = null, TestErrorInfo error = null)
```

|Name|Description|Type|Required|
|---|---|---|---|
|status|The mock action result status.|[TestWorkflowStatus](test-workflow-status-enum-definition.md)|Yes|
|name|The mock action name.|string|No|
|outputs|The mock outputs.|MockOutput|No|
|error|The mock error.|[TestErrorInfo](test-error-info-class-definition.md)|No|

```C#
// Example: Create a mock action from JSON
var actionFromJson = JsonConvert.DeserializeObject<ActionMock>(File.ReadAllText(mockDataPath));
```

## Properties

This class inherits the following properties from the **`OperationMock`** base class.

|Name|Description|Type|Required|
|---|---|---|---|
|Name|Gets or sets the name for the mock operation.|string|No|
|Status|Gets or sets the operation status.|[TestWorkflowStatus](test-workflow-status-enum-definition.md)|No|
|Outputs|Gets or sets a value that represents static output in JSON format.|JToken|No|
|Error|Gets or sets the operation error.|[TestErrorInfo](test-error-info-class-definition.md)|No|

## Related content

- [TestActionExecutionContext](test-action-execution-context-class-definition.md)
- [TestErrorInfo](test-error-info-class-definition.md)
- [TestErrorResponseAdditionalInfo](test-error-response-additional-info-class-definition.md)
- [TestExecutionContext](test-execution-context-class-definition.md)
- [TestIterationItem](test-iteration-item-class-definition.md)
- [TestWorkflowOutputParameter](test-workflow-output-parameter-class-definition.md)
- [TestWorkflowRun](test-workflow-run-class-definition.md)
- [TestWorkflowRunActionRepetitionResult](test-workflow-run-action-repetition-result-class-definition.md)
- [TestWorkflowRunActionResult](test-workflow-run-action-result-class-definition.md)
- [TestWorkflowRunTriggerResult](test-workflow-run-trigger-result-class-definition.md)
- [TestWorkflowStatus](test-workflow-status-enum-definition.md)
- [TriggerMock](trigger-mock-class-definition.md)
- [UnitTestExecutor](unit-test-executor-class-definition.md)
