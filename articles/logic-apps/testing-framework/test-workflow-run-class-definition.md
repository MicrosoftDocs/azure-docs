---
title: TestWorkflowRun Class Definition
description: The flow run properties representing a workflow execution instance for testing
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 06/02/2025
---

# TestWorkflowRun Class Definition

**Namespace**: Microsoft.Azure.Workflows.UnitTesting.Definitions

The flow run properties. This class represents a workflow execution instance for testing purposes and contains all the data related to a workflow run, including trigger information, action results, outputs, and variables.

## Properties

|Name|Description|Type|Required|
|---|---|---|---|
|StartTime|Gets or sets the start time of the flow run|DateTime?|No|
|EndTime|Gets or sets the end time of the flow run|DateTime?|No|
|Status|Gets or sets the status of the flow run|[TestWorkflowStatus](test-workflow-status-enum-definition.md)?|No|
|Error|Gets or sets the flow run error|[TestErrorInfo](test-error-info-class-definition.md)|No|
|Trigger|Gets or sets the flow run fired trigger|[TestWorkflowRunTriggerResult](test-workflow-run-trigger-result-class-definition.md)|No|
|Actions|Gets or sets the actions|Dictionary&lt;string, [TestWorkflowRunActionResult](test-workflow-run-action-result-class-definition.md)&gt;|No|
|Outputs|Gets or sets the outputs of the flow run|Dictionary&lt;string, [TestWorkflowOutputParameter](test-workflow-output-parameter-class-definition.md)&gt;|No|
|Variables|Gets or sets the values of the flow run variables|Dictionary&lt;string, JToken&gt;|No|

## Methods

### ToTestWorkflowRun

Creates a new instance of the TestWorkflowRun class from flow run data.

```C#
internal static TestWorkflowRun ToTestWorkflowRun(FlowRun run, JToken triggerData, Dictionary<string, TestWorkflowRunActionResult> actionProperties, Dictionary<string, TestWorkflowOutputParameter> flowRunOutputs, Dictionary<string, JToken> variables)
```

|Name|Description|Type|Required|
|---|---|---|---|
|run|The flow run|FlowRun|Yes|
|triggerData|The trigger data|JToken|Yes|
|actionProperties|The action operation results|Dictionary&lt;string, [TestWorkflowRunActionResult](test-workflow-run-action-result-class-definition.md)&gt;|Yes|
|flowRunOutputs|The flow run outputs|Dictionary&lt;string, [TestWorkflowOutputParameter](test-workflow-output-parameter-class-definition.md)&gt;|Yes|
|variables|The variable values|Dictionary&lt;string, JToken&gt;|Yes|

```C#
// Example: Converting flow run data to TestWorkflowRun
var actionResults = new Dictionary<string, TestWorkflowRunActionResult>();
var outputs = new Dictionary<string, TestWorkflowOutputParameter>();
var variables = new Dictionary<string, JToken>();

var testWorkflowRun = TestWorkflowRun.ToTestWorkflowRun(
    flowRun, 
    triggerData, 
    actionResults, 
    outputs, 
    variables
);
```

## Related Content

- [ActionMock Class Definition](action-mock-class-definition.md)
- [MockData Class Definition](mock-data-class-definition.md)
- [TriggerMock Class Definition](trigger-mock-class-definition.md)
- [TestActionExecutionContext Class Definition](test-action-execution-context-class-definition.md)
- [TestExecutionContext Class Definition](test-execution-context-class-definition.md)
- [TestIterationItem Class Definition](test-iteration-item-class-definition.md)
- [TestErrorInfo Class Definition](test-error-info-class-definition.md)
- [TestErrorResponseAdditionalInfo Class Definition](test-error-response-additional-info-class-definition.md)
- [TestWorkflowOutputParameter Class Definition](test-workflow-output-parameter-class-definition.md)
- [TestWorkflowRunActionRepetitionResult Class Definition](test-workflow-run-action-repetition-result-class-definition.md)
- [TestWorkflowRunActionResult Class Definition](test-workflow-run-action-result-class-definition.md)
- [TestWorkflowRunOperationResult Class Definition](test-workflow-run-operation-result-class-definition.md)
- [TestWorkflowRunTriggerResult Class Definition](test-workflow-run-trigger-result-class-definition.md)
- [TestWorkflowStatus Enum Definition](test-workflow-status-enum-definition.md)
- [UnitTestExecutor Class Definition](unit-test-executor-class-definition.md)
