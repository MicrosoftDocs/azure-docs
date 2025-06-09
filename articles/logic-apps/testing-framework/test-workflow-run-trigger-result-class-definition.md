---
title: TestWorkflowRunTriggerResult class
description: The result from the trigger execution in a Standard logic app workflow run during test execution.
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 06/10/2025
---

# TestWorkflowRunTriggerResult class

**Namespace**: Microsoft.Azure.Workflows.UnitTesting.Definitions

This class represents the result from the trigger execution in a Standard logic app workflow run during unit test execution. The class also provides specific functionality for trigger operations.

## Usage

```C#
// Check trigger status and code
Assert.AreEqual(expected: "200", actual: testFlowRun.Trigger.Code);
Assert.AreEqual(expected: TestWorkflowStatus.Succeeded, actual: testFlowRun.Trigger.Status);

// Check trigger output value
Assert.AreEqual(expected: "Test", actual: testFlowRun.Trigger.Outputs["outputParam"].Value<string>());

// Check trigger error
Assert.IsNull(testFlowRun.Trigger.Error);
```

## Properties

|Name|Description|Type|Required|
|---|---|---|---|
|Name|The trigger name|string|Yes|
|Inputs|The trigger execution inputs|JToken|No|
|Outputs|The trigger execution outputs|JToken|No|
|Code|The trigger status code|string|No|
|Status|The trigger status|[TestWorkflowStatus](test-workflow-status-enum-definition.md)|Yes|
|Error|The trigger error|[TestErrorInfo](test-error-info-class-definition.md)|No|

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
- [TestWorkflowStatus Enum Definition](test-workflow-status-enum-definition.md)
- [UnitTestExecutor Class Definition](unit-test-executor-class-definition.md)
