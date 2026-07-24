---
title: TestWorkflowStatus enum
description: The possible execution states that a unit test run can have for a Standard logic app workflow, trigger, or action during test execution.
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 06/10/2025
---

# TestWorkflowStatus enum

**Namespace**: Microsoft.Azure.Workflows.UnitTesting.Definitions

This enumeration represents the possible execution states that a unit test run can have for a Standard logic app workflow, trigger, or action during test execution.

## Values

|Name|Description|
|---|---|
|Succeeded|The status is 'Succeeded.'|
|Skipped|The status is 'Skipped.'|
|Cancelled|The status is 'Cancelled.'|
|Failed|The status is 'Failed.'|
|TimedOut|The status is 'Timed out.'|
|Terminated|The status is 'Terminated.'|
|NotSpecified|The status isn't specified.|

> [!NOTE]
>
> You can create mock operations with only the **Succeeded** and **Failed** statuses. Azure Logic 
> Apps uses the other statuses to report the final operation state after execution completes.

## Related content

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
