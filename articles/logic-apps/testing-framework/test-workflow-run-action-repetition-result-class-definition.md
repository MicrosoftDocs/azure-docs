---
title: TestWorkflowRunActionRepetitionResult class
description: The result from an action in a loop iteration from a Standard logic app workflow run during unit test execution.
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 06/10/2025
---

# TestWorkflowRunActionRepetitionResult class

**Namespace**: Microsoft.Azure.Workflows.UnitTesting.Definitions

This class extends the **`TestWorkflowRunActionResult`** class to represent the result from an action in a loop iteration for a Standard logic app workflow run during unit test execution. Such actions can appear inside **For each** loops or **Until** loops.

## Usage

```C#
var callExternalSystemsAction = testFlowRun.Actions["Call_External_Systems"];

for (int i=0; i<callExternalSystemsAction.Repetitions.Length; i++)
{
    var currActionRepetition = callExternalSystemsAction.Repetitions[i];

    // Check action repetition status and code
    Assert.AreEqual(expected: "200", actual: currActionRepetition.Code);
    Assert.AreEqual(expected: TestWorkflowStatus.Succeeded, actual: currActionRepetition.Status);

    // Check action repetition output value
    Assert.AreEqual(expected: "Test", actual: currActionRepetition.Outputs["outputParam"].Value<string>());

    // Check action repetition error
    Assert.IsNull(currActionRepetition.Error);
}
```

## Properties

|Name|Description|Type|Required|
|---|---|---|---|
|Name|The action name|string|Yes|
|Inputs|The action execution inputs|JToken|No|
|Outputs|The action execution outputs|JToken|No|
|Code|The action status code|string|No|
|Status|The action status|[TestWorkflowStatus](test-workflow-status-enum-definition.md)|Yes|
|Error|The action error|[TestErrorInfo](test-error-info-class-definition.md)|No|
|ChildActions|The nested action results|Dictionary&lt;string, [TestWorkflowRunActionResult](test-workflow-run-action-result-class-definition.md)&gt;|No|
|Repetitions|The repetition action results|[TestWorkflowRunActionRepetitionResult](test-workflow-run-action-repetition-result-class-definition.md)|No|
|IterationItem|The iteration item|[TestIterationItem](test-iteration-item-class-definition.md)|No|

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
- [TestWorkflowRunActionResult Class Definition](test-workflow-run-action-result-class-definition.md)
- [TestWorkflowRunTriggerResult Class Definition](test-workflow-run-trigger-result-class-definition.md)
- [TestWorkflowStatus Enum Definition](test-workflow-status-enum-definition.md)
- [UnitTestExecutor Class Definition](unit-test-executor-class-definition.md)
