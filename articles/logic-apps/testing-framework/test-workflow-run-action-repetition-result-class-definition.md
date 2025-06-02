---
title: TestWorkflowRunActionRepetitionResult Class Definition
description: The unit test flow run repetition action result for looping actions
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 06/02/2025
---

# TestWorkflowRunActionRepetitionResult Class Definition

**Namespace**: Microsoft.Azure.Workflows.UnitTesting.Definitions

The unit test flow run repetition action result. This class extends TestWorkflowRunActionResult to represent the execution result of an action within a loop iteration, such as actions inside "For each" or "Until" loops.

## Usage

```C#
// Create repetition result for a For each action
var iterationItem = new [TestIterationItem](test-iteration-item-class-definition.md)
{
    Index = 2,
    Item = JToken.Parse(@"{""productId"": ""P123"", ""quantity"": 5}")
};

var repetitionResult = new [TestWorkflowRunActionRepetitionResult](test-workflow-run-action-repetition-result-class-definition.md)
{
    Name = "ProcessOrderItem",
    Status = [TestWorkflowStatus](test-workflow-status-enum-definition.md).Succeeded,
    Inputs = JToken.Parse(@"{""itemData"": {""productId"": ""P123"", ""quantity"": 5}}"),
    Outputs = JToken.Parse(@"{""processedItem"": {""id"": ""P123"", ""totalPrice"": 149.95}}"),
    IterationItem = iterationItem
};

// Use in parent action result
var forEachResult = new [TestWorkflowRunActionResult](test-workflow-run-action-result-class-definition.md)
{
    Name = "ProcessAllItems",
    Status = [TestWorkflowStatus](test-workflow-status-enum-definition.md).Succeeded,
    Repetitions = new[] { repetitionResult }
};

// Access iteration details
var currentIndex = repetitionResult.IterationItem.Index;
var currentItem = repetitionResult.IterationItem.Item;
var productId = currentItem["productId"]?.Value<string>();
```

## Properties

|Name|Description|Type|Required|
|---|---|---|---|
|IterationItem|Gets or sets the iteration item|[TestIterationItem](test-iteration-item-class-definition.md)|No|

*Note: This class inherits additional properties from [TestWorkflowRunActionResult](test-workflow-run-action-result-class-definition.md) including Name, Inputs, Outputs, Code, Status, Error, ChildActions, and Repetitions.*

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
- [TestWorkflowRunActionResult Class Definition](test-workflow-run-action-result-class-definition.md)
- [TestWorkflowRunOperationResult Class Definition](test-workflow-run-operation-result-class-definition.md)
- [TestWorkflowRunTriggerResult Class Definition](test-workflow-run-trigger-result-class-definition.md)
- [TestWorkflowStatus Enum Definition](test-workflow-status-enum-definition.md)
- [UnitTestExecutor Class Definition](unit-test-executor-class-definition.md)
