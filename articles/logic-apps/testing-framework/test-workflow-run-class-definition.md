---
title: TestWorkflowRun class
description: The properties and data from a Standard logic app workflow run during unit test execution.
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 06/10/2025
---

# TestWorkflowRun class

**Namespace**: Microsoft.Azure.Workflows.UnitTesting.Definitions

This class represents the run from a Standard logic app workflow execution for testing purposes. The class includes properties from the workflow run and contains all the data related to that workflow run, including trigger details, action results, outputs, and variables.

## Properties

|Name|Description|Type|Required|
|---|---|---|---|
|StartTime|The start time of workflow run|DateTime?|No|
|EndTime|The end time of the workflow run|DateTime?|No|
|Status|The status of the workflow run|[TestWorkflowStatus](test-workflow-status-enum-definition.md)|No|
|Error|The workflow run error|[TestErrorInfo](test-error-info-class-definition.md)|No|
|Trigger|The fired trigger for the workflow run|[TestWorkflowRunTriggerResult](test-workflow-run-trigger-result-class-definition.md)|No|
|Actions|The actions in the workflow run |Dictionary&lt;string, [TestWorkflowRunActionResult](test-workflow-run-action-result-class-definition.md)&gt;|No|
|Outputs|The outputs from the workflow run|Dictionary&lt;string, [TestWorkflowOutputParameter](test-workflow-output-parameter-class-definition.md)&gt;|No|
|Variables|The values from the workflow run variables|Dictionary&lt;string, JToken&gt;|No|

## Related content

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
