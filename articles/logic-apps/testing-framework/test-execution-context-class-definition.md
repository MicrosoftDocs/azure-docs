---
title: TestExecutionContext Class Definition
description: The execution context for a unit test containing action execution details
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 06/02/2025
---

# TestExecutionContext Class Definition

**Namespace**: Microsoft.Azure.Workflows.UnitTesting.Definitions

The execution context for a unit test. This class provides the execution context for Logic Apps workflow testing and helps maintain state during test execution, especially useful when creating dynamic mocks that respond differently based on the current workflow state.

## Properties

|Name|Description|Type|Required|
|---|---|---|---|
|ActionContext|Gets the current action context|TestActionExecutionContext|Yes|

## Related Content

- [ActionMock Class Definition](action-mock-class-definition.md)
- [MockData Class Definition](mock-data-class-definition.md)
- [TriggerMock Class Definition](trigger-mock-class-definition.md)
- [TestActionExecutionContext Class Definition](test-action-execution-context-class-definition.md)
- [TestErrorInfo Class Definition](test-error-info-class-definition.md)
- [TestErrorResponseAdditionalInfo Class Definition](test-error-response-additional-info-class-definition.md)
- [TestIterationItem Class Definition](test-iteration-item-class-definition.md)
- [TestWorkflowOutputParameter Class Definition](test-workflow-output-parameter-class-definition.md)
- [TestWorkflowRun Class Definition](test-workflow-run-class-definition.md)
- [TestWorkflowRunActionRepetitionResult Class Definition](test-workflow-run-action-repetition-result-class-definition.md)
- [TestWorkflowRunActionResult Class Definition](test-workflow-run-action-result-class-definition.md)
- [TestWorkflowRunOperationResult Class Definition](test-workflow-run-operation-result-class-definition.md)
- [TestWorkflowRunTriggerResult Class Definition](test-workflow-run-trigger-result-class-definition.md)
- [TestWorkflowStatus Enum Definition](test-workflow-status-enum-definition.md)
- [UnitTestExecutor Class Definition](unit-test-executor-class-definition.md)
