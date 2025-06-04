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
|StartTime|The start time of the flow run|DateTime?|No|
|EndTime|The end time of the flow run|DateTime?|No|
|Status|The status of the flow run|[TestWorkflowStatus](test-workflow-status-enum-definition.md)?|No|
|Error|The flow run error|[TestErrorInfo](test-error-info-class-definition.md)|No|
|Trigger|The flow run fired trigger|[TestWorkflowRunTriggerResult](test-workflow-run-trigger-result-class-definition.md)|No|
|Actions|The actions|Dictionary&lt;string, [TestWorkflowRunActionResult](test-workflow-run-action-result-class-definition.md)&gt;|No|
|Outputs|The outputs of the flow run|Dictionary&lt;string, [TestWorkflowOutputParameter](test-workflow-output-parameter-class-definition.md)&gt;|No|
|Variables|The values of the flow run variables|Dictionary&lt;string, JToken&gt;|No|

## Related Content

- [ActionMock Class Definition](action-mock-class-definition.md)
- [TriggerMock Class Definition](trigger-mock-class-definition.md)
- [TestActionExecutionContext Class Definition](test-action-execution-context-class-definition.md)
- [TestExecutionContext Class Definition](test-execution-context-class-definition.md)
- [TestIterationItem Class Definition](test-iteration-item-class-definition.md)
- [TestErrorInfo Class Definition](test-error-info-class-definition.md)
- [TestErrorResponseAdditionalInfo Class Definition](test-error-response-additional-info-class-definition.md)
- [TestWorkflowOutputParameter Class Definition](test-workflow-output-parameter-class-definition.md)
- [TestWorkflowRunActionRepetitionResult Class Definition](test-workflow-run-action-repetition-result-class-definition.md)
- [TestWorkflowRunActionResult Class Definition](test-workflow-run-action-result-class-definition.md)
- [TestWorkflowRunTriggerResult Class Definition](test-workflow-run-trigger-result-class-definition.md)
- [TestWorkflowStatus Enum Definition](test-workflow-status-enum-definition.md)
- [UnitTestExecutor Class Definition](unit-test-executor-class-definition.md)
