---
title: TestErrorInfo Class Definition
description: The extended error information for workflow testing scenarios
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 06/02/2025
---

# TestErrorInfo Class Definition

**Namespace**: Microsoft.Azure.Workflows.UnitTesting.ErrorResponses

The extended error information. This class provides detailed error information for workflow testing scenarios, including error codes, messages, nested error details, and additional contextual information.

## Usage

```C#
// Simple error with code and message
var basicError = new TestErrorInfo(
    ErrorResponseCode.BadRequest,
    "Invalid input parameter"
);

// Error with nested details
var detailError1 = new TestErrorInfo(
    ErrorResponseCode.ValidationError,
    "Field 'email' is required"
);

var detailError2 = new TestErrorInfo(
    ErrorResponseCode.ValidationError,
    "Field 'age' must be a positive number"
);

var complexError = new TestErrorInfo(
    ErrorResponseCode.BadRequest,
    "Request validation failed",
    new[] { detailError1, detailError2 }
);

// Error with additional information
var additionalInfo = new TestErrorResponseAdditionalInfo[]
{
    new TestErrorResponseAdditionalInfo
    {
        Type = "RequestId",
        Info = JToken.FromObject("req-12345")
    }
};

var errorWithInfo = new TestErrorInfo(
    ErrorResponseCode.InternalServerError,
    "Service temporarily unavailable",
    null,
    additionalInfo
);
```

## Constructors

### Primary Constructor

Creates a new instance of the TestErrorInfo class.

```C#
public TestErrorInfo(ErrorResponseCode code, string message, TestErrorInfo[] details = null, TestErrorResponseAdditionalInfo[] additionalInfo = null)
```

|Name|Description|Type|Required|
|---|---|---|---|
|code|The error code|ErrorResponseCode|Yes|
|message|The error message|string|Yes|
|details|The detailed error message details|[TestErrorInfo](test-error-info-class-definition.md)[]|No|
|additionalInfo|The array of additional information|[TestErrorResponseAdditionalInfo](test-error-response-additional-info-class-definition.md)[]|No|

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
|Code|Gets or sets the error code|ErrorResponseCode|Yes|
|Message|Gets or sets the error message|string|Yes|
|Details|Gets or sets the detailed error message details|[TestErrorInfo](test-error-info-class-definition.md)[]|No|
|AdditionalInfo|Gets or sets the array of additional information|[TestErrorResponseAdditionalInfo](test-error-response-additional-info-class-definition.md)[]|No|

## Methods

### ToExtendedErrorInfo

Converts the TestErrorInfo to ExtendedErrorInfo.

```C#
internal ExtendedErrorInfo ToExtendedErrorInfo()
```

```C#
// Example: Converting TestErrorInfo to ExtendedErrorInfo
var testError = new TestErrorInfo(ErrorResponseCode.BadRequest, "Invalid request");
var extendedError = testError.ToExtendedErrorInfo();
```

### ToTestErrorInfo

Creates a new instance of the TestErrorInfo class from a JToken.

```C#
internal static TestErrorInfo ToTestErrorInfo(JToken error)
```

|Name|Description|Type|Required|
|---|---|---|---|
|error|The extended error info JToken|JToken|Yes|

```C#
// Example: Creating TestErrorInfo from JSON token
var errorJson = JToken.Parse(@"{
    ""code"": ""BadRequest"",
    ""message"": ""Invalid input""
}");
var testError = TestErrorInfo.ToTestErrorInfo(errorJson);
```

## Related Content

- [ActionMock Class Definition](action-mock-class-definition.md)
- [MockData Class Definition](mock-data-class-definition.md)
- [TriggerMock Class Definition](trigger-mock-class-definition.md)
- [TestActionExecutionContext Class Definition](test-action-execution-context-class-definition.md)
- [TestExecutionContext Class Definition](test-execution-context-class-definition.md)
- [TestIterationItem Class Definition](test-iteration-item-class-definition.md)
- [TestWorkflowRun Class Definition](test-workflow-run-class-definition.md)
- [TestErrorResponseAdditionalInfo Class Definition](test-error-response-additional-info-class-definition.md)
- [TestWorkflowOutputParameter Class Definition](test-workflow-output-parameter-class-definition.md)
- [TestWorkflowRunActionRepetitionResult Class Definition](test-workflow-run-action-repetition-result-class-definition.md)
- [TestWorkflowRunActionResult Class Definition](test-workflow-run-action-result-class-definition.md)
- [TestWorkflowRunOperationResult Class Definition](test-workflow-run-operation-result-class-definition.md)
- [TestWorkflowRunTriggerResult Class Definition](test-workflow-run-trigger-result-class-definition.md)
- [TestWorkflowStatus Enum Definition](test-workflow-status-enum-definition.md)
- [UnitTestExecutor Class Definition](unit-test-executor-class-definition.md)
