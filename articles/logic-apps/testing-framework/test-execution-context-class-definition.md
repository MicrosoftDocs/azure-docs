---
title: TestExecutionContext class
description: The execution context for a unit test that contains action execution details.
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 06/10/2025
---

# TestExecutionContext class

**Namespace**: Microsoft.Azure.Workflows.UnitTesting.Definitions

This class provides the execution context for a unit test used for Standard workflow testing in single-tenant Azure Logic Apps. The class helps maintain the state during test execution and is useful when you want to create dynamic mocks that respond differently based on the current workflow state.

## Usage

```C#
var actionMock = new CallExternalSystemsActionMock(name: "Call_External_Systems", onGetActionMock: (testExecutionContext) =>
{
    return new CallExternalSystemsActionMock(
        status: TestWorkflowStatus.Succeeded,
        outputs: new CallExternalSystemsActionOutput {
            Body = new JObject
            {
                { "name", testExecutionContext.ActionContext.ActionName },
                { "inputs", testExecutionContext.ActionContext.ActionInputs },
                { "scope", testExecutionContext.ActionContext.ParentActionName },
                { "iteration", testExecutionContext.ActionContext.CurrentIterationInput.Index }
            }
        }
    );
});
```

## Properties

|Name|Description|Type|Required|
|---|---|---|---|
|ActionContext|Gets the current action context.|[TestActionExecutionContext](test-action-execution-context-class-definition.md)|Yes|

## Related content

- [ActionMock Class Definition](action-mock-class-definition.md)
- [TriggerMock Class Definition](trigger-mock-class-definition.md)
- [TestActionExecutionContext Class Definition](test-action-execution-context-class-definition.md)
- [TestErrorInfo Class Definition](test-error-info-class-definition.md)
- [TestErrorResponseAdditionalInfo Class Definition](test-error-response-additional-info-class-definition.md)
- [TestIterationItem Class Definition](test-iteration-item-class-definition.md)
- [TestWorkflowOutputParameter Class Definition](test-workflow-output-parameter-class-definition.md)
- [TestWorkflowRun Class Definition](test-workflow-run-class-definition.md)
- [TestWorkflowRunActionRepetitionResult Class Definition](test-workflow-run-action-repetition-result-class-definition.md)
- [TestWorkflowRunActionResult Class Definition](test-workflow-run-action-result-class-definition.md)
- [TestWorkflowRunTriggerResult Class Definition](test-workflow-run-trigger-result-class-definition.md)
- [TestWorkflowStatus Enum Definition](test-workflow-status-enum-definition.md)
- [UnitTestExecutor Class Definition](unit-test-executor-class-definition.md)
