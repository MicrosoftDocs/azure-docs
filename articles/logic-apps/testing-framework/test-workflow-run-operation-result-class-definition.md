---
title: TestWorkflowRunOperationResult Class Definition
description: The unit test flow run operation result base class for workflow operations
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 06/02/2025
---

# TestWorkflowRunOperationResult Class Definition

**Namespace**: Microsoft.Azure.Workflows.UnitTesting.Definitions

The unit test flow run operation result. This abstract base class represents the execution result of any operation (trigger or action) within a workflow during testing, providing common properties for operation execution details.

## Usage

```C#
// This is an abstract class, so it's used through its derived classes:
// - TestWorkflowRunTriggerResult (for triggers)
// - TestWorkflowRunActionResult (for actions)

// Example of accessing common properties through derived class
var actionResult = new TestWorkflowRunActionResult
{
    Name = "HttpAction",
    Status = TestWorkflowStatus.Succeeded,
    Code = "200",
    Inputs = JToken.Parse(@"{""method"": ""GET"", ""uri"": ""https://api.example.com/data""}"),
    Outputs = JToken.Parse(@"{""statusCode"": 200, ""body"": {""result"": ""success""}}"),
    Error = null
};

// Example with error
var failedAction = new TestWorkflowRunActionResult
{
    Name = "DatabaseAction",
    Status = TestWorkflowStatus.Failed,
    Code = "500",    Inputs = JToken.Parse(@"{""query"": ""SELECT * FROM users""}"),
    Error = new TestErrorInfo(
        ErrorResponseCode.InternalServerError,
        "Database connection failed"
    )
};

// Access inherited properties
var operationName = actionResult.Name;
var executionStatus = actionResult.Status;
var hasError = actionResult.Error != null;
```

## Properties

|Name|Description|Type|Required|
|---|---|---|---|
|Name|Gets or sets the operation name|string|Yes|
|Inputs|Gets or sets the operation execution inputs|JToken|No|
|Outputs|Gets or sets the operation execution outputs|JToken|No|
|Code|Gets or sets the operation code|string|No|
|Status|Gets or sets the operation status|[TestWorkflowStatus](test-workflow-status-enum-definition.md)?|Yes|
|Error|Gets or sets the operation error|[TestErrorInfo](test-error-info-class-definition.md)|No|

## Related Content

- [ActionMock Class Definition](action-mock-class-definition.md)
- [MockData Class Definition](mock-data-class-definition.md)
- [TriggerMock Class Definition](trigger-mock-class-definition.md)
- [TestActionExecutionContext Class Definition](test-action-execution-context-class-definition.md)
- [TestExecutionContext Class Definition](test-execution-context-class-definition.md)
- [TestIterationItem Class Definition](test-iteration-item-class-definition.md)
- [TestWorkflowRun Class Definition](test-workflow-run-class-definition.md)
- [TestErrorInfo Class Definition](test-error-info-class-definition.md)
- [TestErrorResponseAdditionalInfo Class Definition](test-error-response-additional-info-class-definition.md)
- [TestWorkflowOutputParameter Class Definition](test-workflow-output-parameter-class-definition.md)
- [TestWorkflowRunActionRepetitionResult Class Definition](test-workflow-run-action-repetition-result-class-definition.md)
- [TestWorkflowRunActionResult Class Definition](test-workflow-run-action-result-class-definition.md)
- [TestWorkflowRunTriggerResult Class Definition](test-workflow-run-trigger-result-class-definition.md)
- [TestWorkflowStatus Enum Definition](test-workflow-status-enum-definition.md)
- [UnitTestExecutor Class Definition](unit-test-executor-class-definition.md)
