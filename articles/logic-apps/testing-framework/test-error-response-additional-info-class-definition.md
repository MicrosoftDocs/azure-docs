---
title: TestErrorResponseAdditionalInfo class
description: The error response with additional info and the service-specific schema that is dependent on **Type** string.
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 06/10/2025
---

# TestErrorResponseAdditionalInfo class

**Namespace**: Microsoft.Azure.Workflows.UnitTesting.ErrorResponses

This class provides more contextual information for the error responses in workflow testing scenarios. The information schema is service-specific and dependent on the **Type** string.

## Usage

```C#
// The request ID for the additional info
var requestIdInfo = new TestErrorResponseAdditionalInfo
{
    Type = "RequestId",
    Info = JToken.FromObject("req-abc123")
};

// The timestamp for the additional info
var timestampInfo = new TestErrorResponseAdditionalInfo
{
    Type = "Timestamp",
    Info = JToken.FromObject(DateTime.UtcNow)
};

// Complex additional info with nested data
var complexInfo = new TestErrorResponseAdditionalInfo
{
    Type = "ValidationDetails",
    Info = JToken.Parse(@"{
        ""field"": ""email"",
        ""providedValue"": ""invalid-email"",
        ""expectedFormat"": ""user@domain.com""
    }")
};

// Use in error context
var error = new TestErrorInfo(
    ErrorResponseCode.BadRequest,
    "Validation failed",
    null,
    new[] { requestIdInfo, timestampInfo }
);
```

## Properties

|Name|Description|Type|Required|
|---|---|---|---|
|Type|The type for the additional error info|string|No|
|Info|The additional information|JToken|No|

## Related content

- [ActionMock Class Definition](action-mock-class-definition.md)
- [TriggerMock Class Definition](trigger-mock-class-definition.md)
- [TestActionExecutionContext Class Definition](test-action-execution-context-class-definition.md)
- [TestExecutionContext Class Definition](test-execution-context-class-definition.md)
- [TestIterationItem Class Definition](test-iteration-item-class-definition.md)
- [TestWorkflowRun Class Definition](test-workflow-run-class-definition.md)
- [TestErrorInfo Class Definition](test-error-info-class-definition.md)
- [TestWorkflowOutputParameter Class Definition](test-workflow-output-parameter-class-definition.md)
- [TestWorkflowRunActionRepetitionResult Class Definition](test-workflow-run-action-repetition-result-class-definition.md)
- [TestWorkflowRunActionResult Class Definition](test-workflow-run-action-result-class-definition.md)
- [TestWorkflowRunTriggerResult Class Definition](test-workflow-run-trigger-result-class-definition.md)
- [TestWorkflowStatus Enum Definition](test-workflow-status-enum-definition.md)
- [UnitTestExecutor Class Definition](unit-test-executor-class-definition.md)
