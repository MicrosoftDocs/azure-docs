---
title: TestWorkflowOutputParameter class
description: The unit test flow output parameter that represents the outputs from a Standard logic app workflow during test execution.
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 06/10/2025
---

# TestWorkflowOutputParameter class

**Namespace**: Microsoft.Azure.Workflows.UnitTesting.Definitions

This class represents the output parameter for a unit test flow when a Standard logic app workflow runs during test execution. The output parameter includes its type, value, description, and any associated error information.

## Usage

```C#
// Check output parameter value
Assert.AreEqual(expected: "Test", actual: testFlowRun.Outputs["outputName"].Value.Value<string>());

// Check output error
Assert.IsNull(flow.Outputs["outputName"].Error);
```

## Properties

|Name|Description|Type|Required|
|---|---|---|---|
|Type|The type of the output parameter|TestFlowTemplateParameterType?|No|
|Value|The value of the output parameter|JToken|No|
|Description|The description of the output parameter|string|No|
|Error|The operation error|TestErrorInfo|No|

## Related content

- [ActionMock Class Definition](action-mock-class-definition.md)
- [TriggerMock Class Definition](trigger-mock-class-definition.md)
- [TestActionExecutionContext Class Definition](test-action-execution-context-class-definition.md)
- [TestExecutionContext Class Definition](test-execution-context-class-definition.md)
- [TestIterationItem Class Definition](test-iteration-item-class-definition.md)
- [TestWorkflowRun Class Definition](test-workflow-run-class-definition.md)
- [TestErrorInfo Class Definition](test-error-info-class-definition.md)
- [TestErrorResponseAdditionalInfo Class Definition](test-error-response-additional-info-class-definition.md)
- [TestWorkflowRunActionRepetitionResult Class Definition](test-workflow-run-action-repetition-result-class-definition.md)
- [TestWorkflowRunActionResult Class Definition](test-workflow-run-action-result-class-definition.md)
- [TestWorkflowRunTriggerResult Class Definition](test-workflow-run-trigger-result-class-definition.md)
- [TestWorkflowStatus Enum Definition](test-workflow-status-enum-definition.md)
- [UnitTestExecutor Class Definition](unit-test-executor-class-definition.md)
