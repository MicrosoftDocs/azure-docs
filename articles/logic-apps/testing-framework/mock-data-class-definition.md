---
title: MockData Class Definition
description: Represents the generic mock data for any operation in a workflow
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 06/02/2025
---

# MockData Class Definition

**Namespace**: Microsoft.Azure.Workflows.UnitTesting.Definitions

Represents the generic mock data for any operation in a workflow. This internal class provides a container for mock data used in Logic Apps workflow testing, allowing you to define the status, outputs, and error information for mocked operations.

## Usage

```C#
// Create a successful mock with outputs
var successMock = new [MockData](mock-data-class-definition.md)(
    [TestWorkflowStatus](test-workflow-status-enum-definition.md).Succeeded,
    JToken.Parse(@"{
        ""statusCode"": 200,
        ""responseBody"": {
            ""orderId"": ""ORD-12345"",
            ""status"": ""Processed""
        }
    }")
);

// Create a failed mock with error information
var errorMock = new [MockData](mock-data-class-definition.md)(
    [TestWorkflowStatus](test-workflow-status-enum-definition.md).Failed,
    null,
    new [TestErrorInfo](test-error-info-class-definition.md)(
        ErrorResponseCode.ConnectionError,
        "Failed to connect to the service endpoint"
    )
);

// Create a skipped mock
var skippedMock = new [MockData](mock-data-class-definition.md)([TestWorkflowStatus](test-workflow-status-enum-definition.md).Skipped);

// Access mock data properties
var status = successMock.Status;
var hasError = errorMock.Error != null;
var errorMessage = errorMock.Error?.Message;
```

## Constructors

### Primary Constructor

Creates a new instance of the MockData class.

```C#
public MockData(TestWorkflowStatus status, JToken outputs = null, TestErrorInfo error = null)
```

|Name|Description|Type|Required|
|---|---|---|---|
|status|The mocked status|[TestWorkflowStatus](test-workflow-status-enum-definition.md)|Yes|
|outputs|The mocked outputs|JToken|No|
|error|The mocked error info|[TestErrorInfo](test-error-info-class-definition.md)|No|

```C#
// Example: Creating a mock data object with successful status and outputs
var outputs = JToken.Parse(@"{""result"": ""success"", ""timestamp"": ""2025-06-02T10:00:00Z""}");
var mockData = new [MockData](mock-data-class-definition.md)([TestWorkflowStatus](test-workflow-status-enum-definition.md).Succeeded, outputs);
```

## Properties

|Name|Description|Type|Required|
|---|---|---|---|
|Status|Gets or sets the operation status|[TestWorkflowStatus](test-workflow-status-enum-definition.md)|Yes|
|Outputs|Gets or sets a value that represents operation specific static output|JToken|No|
|Error|Gets or sets the operation error|[TestErrorInfo](test-error-info-class-definition.md)|No|

## Related Content

- [ActionMock Class Definition](action-mock-class-definition.md)
- [TriggerMock Class Definition](trigger-mock-class-definition.md)
- [TestActionExecutionContext Class Definition](test-action-execution-context-class-definition.md)
- [TestErrorInfo Class Definition](test-error-info-class-definition.md)
- [TestErrorResponseAdditionalInfo Class Definition](test-error-response-additional-info-class-definition.md)
- [TestExecutionContext Class Definition](test-execution-context-class-definition.md)
- [TestIterationItem Class Definition](test-iteration-item-class-definition.md)
- [TestWorkflowOutputParameter Class Definition](test-workflow-output-parameter-class-definition.md)
- [TestWorkflowRun Class Definition](test-workflow-run-class-definition.md)
- [TestWorkflowRunActionRepetitionResult Class Definition](test-workflow-run-action-repetition-result-class-definition.md)
- [TestWorkflowRunActionResult Class Definition](test-workflow-run-action-result-class-definition.md)
- [TestWorkflowRunOperationResult Class Definition](test-workflow-run-operation-result-class-definition.md)
- [TestWorkflowRunTriggerResult Class Definition](test-workflow-run-trigger-result-class-definition.md)
- [TestWorkflowStatus Enum Definition](test-workflow-status-enum-definition.md)
- [UnitTestExecutor Class Definition](unit-test-executor-class-definition.md)
