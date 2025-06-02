---
title: TestWorkflowOutputParameter Class Definition
description: The unit test flow output parameter representing workflow execution outputs
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 06/02/2025
---

# TestWorkflowOutputParameter Class Definition

**Namespace**: Microsoft.Azure.Workflows.UnitTesting.Definitions

The unit test flow output parameter. This class represents an output parameter from a workflow execution during testing, including its type, value, description, and any associated error information.

## Usage

```C#
// Simple string output parameter
var stringOutput = new TestWorkflowOutputParameter
{
    Type = TestFlowTemplateParameterType.String,
    Value = JToken.FromObject("Operation completed successfully"),
    Description = "Status message from the workflow"
};

// Complex object output parameter
var complexOutput = new TestWorkflowOutputParameter
{
    Type = TestFlowTemplateParameterType.Object,
    Value = JToken.Parse(@"{
        ""orderId"": ""ORD-12345"",
        ""amount"": 299.99,
        ""currency"": ""USD"",
        ""status"": ""processed""
    }"),
    Description = "Order processing result"
};

// Output parameter with error
var errorOutput = new TestWorkflowOutputParameter
{
    Value = null,
    Description = "Failed to generate report",
    Error = new TestErrorInfo(
        ErrorResponseCode.InternalServerError,
        "Report generation service unavailable"
    )
};

// Boolean output parameter
var boolOutput = new TestWorkflowOutputParameter
{
    Type = TestFlowTemplateParameterType.Bool,
    Value = JToken.FromObject(true),
    Description = "Indicates whether the operation was successful"
};
```

## Properties

|Name|Description|Type|Required|
|---|---|---|---|
|Type|The type of the output parameter|TestFlowTemplateParameterType?|No|
|Value|The value of the output parameter|JToken|No|
|Description|The description of the output parameter|string|No|
|Error|Gets or sets the operation error|TestErrorInfo|No|

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
- [TestWorkflowRunActionRepetitionResult Class Definition](test-workflow-run-action-repetition-result-class-definition.md)
- [TestWorkflowRunActionResult Class Definition](test-workflow-run-action-result-class-definition.md)
- [TestWorkflowRunOperationResult Class Definition](test-workflow-run-operation-result-class-definition.md)
- [TestWorkflowRunTriggerResult Class Definition](test-workflow-run-trigger-result-class-definition.md)
- [TestWorkflowStatus Enum Definition](test-workflow-status-enum-definition.md)
- [UnitTestExecutor Class Definition](unit-test-executor-class-definition.md)
