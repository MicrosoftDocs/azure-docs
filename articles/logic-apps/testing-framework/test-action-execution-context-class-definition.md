---
title: TestActionExecutionContext class
description: The execution context for a unit test action that contains action details and iteration information.
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 06/10/2025
---

# TestActionExecutionContext class

**Namespace**: Microsoft.Azure.Workflows.UnitTesting.Definitions

The execution context for a unit test action, this class stores information about the current action running in a test for a Standard logic app workflow. This information includes the action name, inputs, parent action context, and iteration details for looping scenarios.

## Properties

|Name|Description|Type|Required|
|---|---|---|---|
|ActionName|The current action name|string|Yes|
|ActionInputs|The current action inputs|JToken|No|
|ParentActionName|The current parent action name|string|No|
|CurrentIterationInput|The current iteration input|[TestIterationItem](test-iteration-item-class-definition.md)|No|

## Related content

- [ActionMock Class Definition](action-mock-class-definition.md)
- [TriggerMock Class Definition](trigger-mock-class-definition.md)
- [TestErrorInfo Class Definition](test-error-info-class-definition.md)
- [TestErrorResponseAdditionalInfo Class Definition](test-error-response-additional-info-class-definition.md)
- [TestExecutionContext Class Definition](test-execution-context-class-definition.md)
- [TestIterationItem Class Definition](test-iteration-item-class-definition.md)
- [TestWorkflowOutputParameter Class Definition](test-workflow-output-parameter-class-definition.md)
- [TestWorkflowRun Class Definition](test-workflow-run-class-definition.md)
- [TestWorkflowRunActionRepetitionResult Class Definition](test-workflow-run-action-repetition-result-class-definition.md)
- [TestWorkflowRunActionResult Class Definition](test-workflow-run-action-result-class-definition.md)
- [TestWorkflowRunTriggerResult Class Definition](test-workflow-run-trigger-result-class-definition.md)
- [TestWorkflowStatus Enum Definition](test-workflow-status-enum-definition.md)

- [UnitTestExecutor Class Definition](unit-test-executor-class-definition.md)
