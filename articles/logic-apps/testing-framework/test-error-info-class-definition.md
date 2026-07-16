---
title: TestErrorInfo class
description: The extended error information for Standard logic app workflow testing scenarios.
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 06/10/2025
---

# TestErrorInfo class

**Namespace**: Microsoft.Azure.Workflows.UnitTesting.ErrorResponses

This class provides extended and detailed error information for Standard logic app workflow testing scenarios, including error codes, messages, nested error details, and other contextual information.

## Usage

```C#
// Simple error
var basicError = new TestErrorInfo(
    ErrorResponseCode.BadRequest,
    "Invalid input parameter"
);

// Nested errors with additional info
var detailError1 = new TestErrorInfo(
    ErrorResponseCode.ValidationError,
    "Field 'email' is required"
);

var detailError2 = new TestErrorInfo(
    ErrorResponseCode.ValidationError,
    "Field 'age' must be a positive number"
);

var additionalInfo = new TestErrorResponseAdditionalInfo[]
{
    new TestErrorResponseAdditionalInfo
    {
        Type = "RequestId",
        Info = JToken.FromObject("req-12345")
    }
};

var complexError = new TestErrorInfo(
    ErrorResponseCode.BadRequest,
    "Request validation failed",
    new[] { detailError1, detailError2 },
    additionalInfo
);
```

## Constructors

### Primary constructor

Creates a new instance of the **`TestErrorInfo`** class.

```C#
public TestErrorInfo(ErrorResponseCode code, string message, TestErrorInfo[] details = null, TestErrorResponseAdditionalInfo[] additionalInfo = null)
```

|Name|Description|Type|Required|
|---|---|---|---|
|code|The error code|ErrorResponseCode|Yes|
|message|The error message|string|Yes|
|details|The detailed error message details|[TestErrorInfo](test-error-info-class-definition.md)|No|
|additionalInfo|The array of additional information|[TestErrorResponseAdditionalInfo](test-error-response-additional-info-class-definition.md)|No|

```C#
// Example: Creating an error with code and message
var error = new TestErrorInfo(
    ErrorResponseCode.NotFound,
    "The specified resource was not found"
);
```

## Properties

|Name|Description|Type|Required|
|---|---|---|---|
|Code|The error code|ErrorResponseCode|Yes|
|Message|The error message|string|Yes|
|Details|The detailed error message details|[TestErrorInfo](test-error-info-class-definition.md)|No|
|AdditionalInfo|The array of additional information|[TestErrorResponseAdditionalInfo](test-error-response-additional-info-class-definition.md)|No|

## Related content

- [ActionMock Class Definition](action-mock-class-definition.md)
- [TriggerMock Class Definition](trigger-mock-class-definition.md)
- [TestActionExecutionContext Class Definition](test-action-execution-context-class-definition.md)
- [TestExecutionContext Class Definition](test-execution-context-class-definition.md)
- [TestIterationItem Class Definition](test-iteration-item-class-definition.md)
- [TestWorkflowRun Class Definition](test-workflow-run-class-definition.md)
- [TestErrorResponseAdditionalInfo Class Definition](test-error-response-additional-info-class-definition.md)
- [TestWorkflowOutputParameter Class Definition](test-workflow-output-parameter-class-definition.md)
- [TestWorkflowRunActionRepetitionResult Class Definition](test-workflow-run-action-repetition-result-class-definition.md)
- [TestWorkflowRunActionResult Class Definition](test-workflow-run-action-result-class-definition.md)
- [TestWorkflowRunTriggerResult Class Definition](test-workflow-run-trigger-result-class-definition.md)
- [TestWorkflowStatus Enum Definition](test-workflow-status-enum-definition.md)
- [UnitTestExecutor Class Definition](unit-test-executor-class-definition.md)
