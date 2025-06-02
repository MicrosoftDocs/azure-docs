---
title: TestWorkflowRunActionResult Class Definition
description: The unit test flow run action result representing action execution details
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 06/02/2025
---

# TestWorkflowRunActionResult Class Definition

**Namespace**: Microsoft.Azure.Workflows.UnitTesting.Definitions

The unit test flow run action result. This class extends TestWorkflowRunOperationResult to represent the execution result of an action within a workflow, including support for nested actions and repetition results for looping scenarios.

## Usage

```C#
// Simple action result
var simpleAction = new TestWorkflowRunActionResult
{
    Name = "SendEmail",
    Status = TestWorkflowStatus.Succeeded,
    Inputs = JToken.Parse(@"{""to"": ""user@example.com"", ""subject"": ""Test""}"),
    Outputs = JToken.Parse(@"{""messageId"": ""msg-123""}")
};

// Action with child actions (e.g., Scope or Condition)
var childAction1 = new TestWorkflowRunActionResult
{
    Name = "ValidateData",
    Status = TestWorkflowStatus.Succeeded
};

var childAction2 = new TestWorkflowRunActionResult
{
    Name = "ProcessData",
    Status = TestWorkflowStatus.Succeeded
};

var parentAction = new TestWorkflowRunActionResult
{
    Name = "DataProcessingScope",
    Status = TestWorkflowStatus.Succeeded,
    ChildActions = new Dictionary<string, TestWorkflowRunActionResult>
    {
        ["ValidateData"] = childAction1,
        ["ProcessData"] = childAction2
    }
};

// Action with repetitions (e.g., For each)
var repetition1 = new TestWorkflowRunActionRepetitionResult
{
    Name = "ProcessItem",
    Status = TestWorkflowStatus.Succeeded,
    IterationItem = new TestIterationItem { Index = 0, Item = JToken.FromObject("item1") }
};

var repetition2 = new TestWorkflowRunActionRepetitionResult
{
    Name = "ProcessItem",
    Status = TestWorkflowStatus.Succeeded,
    IterationItem = new TestIterationItem { Index = 1, Item = JToken.FromObject("item2") }
};

var forEachAction = new TestWorkflowRunActionResult
{
    Name = "ForEachItem",
    Status = TestWorkflowStatus.Succeeded,
    Repetitions = new[] { repetition1, repetition2 }
};
```

## Properties

|Name|Description|Type|Required|
|---|---|---|---|
|ChildActions|Gets or sets the nested action results|Dictionary&lt;string, [TestWorkflowRunActionResult](test-workflow-run-action-result-class-definition.md)&gt;|No|
|Repetitions|Gets or sets the repetition action results|[TestWorkflowRunActionRepetitionResult](test-workflow-run-action-repetition-result-class-definition.md)[]|No|

*Note: This class inherits additional properties from [TestWorkflowRunOperationResult](test-workflow-run-operation-result-class-definition.md) including Name, Inputs, Outputs, Code, Status, and Error.*

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
- [TestWorkflowRunOperationResult Class Definition](test-workflow-run-operation-result-class-definition.md)
- [TestWorkflowRunTriggerResult Class Definition](test-workflow-run-trigger-result-class-definition.md)
- [TestWorkflowStatus Enum Definition](test-workflow-status-enum-definition.md)
- [UnitTestExecutor Class Definition](unit-test-executor-class-definition.md)
