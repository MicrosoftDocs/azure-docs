---
title: TestIterationItem class
description: The item from a loop iteration for a Standard workflow during unit text execution.
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 06/10/2025
---

# TestIterationItem class

**Namespace**: Microsoft.Azure.Workflows.UnitTesting.Definitions

This class represents an item from a loop iteration, such as a **For each** loop or **Until** loop for a Standard logic app workflow during unit test execution. The class provides access to the current item, its index, and allows navigation to parent iterations in nested loops.

## Properties

|Name|Description|Type|Required|
|---|---|---|---|
|Index|The index of the iteration item|int|No|
|Item|The iteration item|JToken|No|
|Parent|The parent iteration item|TestIterationItem|No|

## Related content

- [ActionMock Class Definition](action-mock-class-definition.md)
- [TriggerMock Class Definition](trigger-mock-class-definition.md)
- [TestActionExecutionContext Class Definition](test-action-execution-context-class-definition.md)
- [TestExecutionContext Class Definition](test-execution-context-class-definition.md)
- [TestErrorInfo Class Definition](test-error-info-class-definition.md)
- [TestErrorResponseAdditionalInfo Class Definition](test-error-response-additional-info-class-definition.md)
- [TestWorkflowOutputParameter Class Definition](test-workflow-output-parameter-class-definition.md)
- [TestWorkflowRun Class Definition](test-workflow-run-class-definition.md)
- [TestWorkflowRunActionRepetitionResult Class Definition](test-workflow-run-action-repetition-result-class-definition.md)
- [TestWorkflowRunActionResult Class Definition](test-workflow-run-action-result-class-definition.md)
- [TestWorkflowRunTriggerResult Class Definition](test-workflow-run-trigger-result-class-definition.md)
- [TestWorkflowStatus Enum Definition](test-workflow-status-enum-definition.md)
- [UnitTestExecutor Class Definition](unit-test-executor-class-definition.md)
