---
title: TestWorkflowStatus Enum Definition
description: The status of a unit test flow representing different execution states
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 06/02/2025
---

# TestWorkflowStatus Enum Definition

**Namespace**: Microsoft.Azure.Workflows.UnitTesting.Definitions

The status of a unit test flow. This enumeration represents the various execution states that a workflow, action, or trigger can have during testing scenarios.

## Values

|Name|Description|
|---|---|
|Succeeded|The flow status is succeeded|
|Skipped|The flow status is skipped|
|Cancelled|The flow status is cancelled|
|Failed|The flow status is failed|
|TimedOut|The flow status is timed out|
|Terminated|The flow status is Terminated|
|NotSpecified|The flow status is not specified|

## Related Content

- [ActionMock Class Definition](action-mock-class-definition.md)
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
- [TestWorkflowRunTriggerResult Class Definition](test-workflow-run-trigger-result-class-definition.md)
- [UnitTestExecutor Class Definition](unit-test-executor-class-definition.md)
