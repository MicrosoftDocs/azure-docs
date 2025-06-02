---
title: TestWorkflowRunTriggerResult Class Definition
description: The unit test flow run trigger result representing trigger execution details
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 06/02/2025
---

# TestWorkflowRunTriggerResult Class Definition

**Namespace**: Microsoft.Azure.Workflows.UnitTesting.Definitions

The unit test flow run trigger result. This class extends TestWorkflowRunOperationResult to represent the execution result of a trigger within a workflow during testing, providing specific functionality for trigger operations.

## Usage

```C#
// HTTP trigger result
var httpTriggerResult = new TestWorkflowRunTriggerResult
{
    Name = "HttpTrigger",
    Status = TestWorkflowStatus.Succeeded,
    Code = "200",
    Inputs = JToken.Parse(@"{""method"": ""POST"", ""headers"": {""Content-Type"": ""application/json""}}"),
    Outputs = JToken.Parse(@"{""body"": {""orderId"": 12345}, ""statusCode"": 200}")
};

// Timer trigger result
var timerTriggerResult = new TestWorkflowRunTriggerResult
{
    Name = "RecurrenceTrigger",
    Status = TestWorkflowStatus.Succeeded,
    Outputs = JToken.Parse(@"{""triggerTime"": ""2025-06-02T10:00:00Z""}")
};

// Failed trigger result
var failedTriggerResult = new TestWorkflowRunTriggerResult
{
    Name = "DatabaseTrigger",
    Status = TestWorkflowStatus.Failed,
    Error = new TestErrorInfo(
        ErrorResponseCode.ConnectionError,
        "Failed to connect to database"
    )
};

// Access trigger execution details
var triggerName = httpTriggerResult.Name;
var triggerStatus = httpTriggerResult.Status;
var triggerOutputs = httpTriggerResult.Outputs;
```

## Methods

### ToTestWorkflowRunTriggerResult

Creates a new instance of the TestWorkflowRunTriggerResult class from trigger data.

```C#
internal static TestWorkflowRunTriggerResult ToTestWorkflowRunTriggerResult(string triggerName, JToken triggerData)
```

|Name|Description|Type|Required|
|---|---|---|---|
|triggerName|The trigger name|string|Yes|
|triggerData|The trigger data|JToken|Yes|

```C#
// Example: Creating TestWorkflowRunTriggerResult from trigger data
var triggerData = JToken.Parse(@"{
    ""status"": ""Succeeded"",
    ""code"": ""200"",
    ""inputs"": {""method"": ""POST""},
    ""outputs"": {""body"": ""trigger data""}
}");

var triggerResult = TestWorkflowRunTriggerResult.ToTestWorkflowRunTriggerResult(
    "HttpTrigger", 
    triggerData
);
```

*Note: This class inherits additional properties from TestWorkflowRunOperationResult including Name, Inputs, Outputs, Code, Status, and Error.*

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
- [TestWorkflowRunOperationResult Class Definition](test-workflow-run-operation-result-class-definition.md)
- [TestWorkflowStatus Enum Definition](test-workflow-status-enum-definition.md)
- [UnitTestExecutor Class Definition](unit-test-executor-class-definition.md)
