---
title: Azure Logic Apps Automated Test SDK
description: Reference documentation for the Azure Logic Apps Automated Test SDK classes and enums.
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 06/10/2025
---

# Azure Logic Apps Automated Test SDK

This SDK provides a comprehensive framework for unit testing Standard workflows in single-tenant Azure Logic Apps. You can create mock operations and data, run workflows in isolation, and validate execution results.

The SDK contains several key components that work together to provide a complete testing solution:

| Component | Description |
|-----------|-------------|
| **Test execution** | Core classes for running workflow tests |
| **Mock data** | Classes for creating mock triggers and actions |
| **Test context** | Classes that represent test execution state and context |
| **Results** | Classes that contain workflow execution results and status information |
| **Error handling** | Classes for managing test errors and exceptions |

## SDK classes and enums

| Class/Enum | Description | Type |
|------------|-------------|------|
| [UnitTestExecutor](unit-test-executor-class-definition.md) | Main entry point for executing unit tests for Standard workflows in Azure Logic Apps | Class |
| [ActionMock](action-mock-class-definition.md) | Represents a mock action for workflow testing. | Class |
| [TriggerMock](trigger-mock-class-definition.md) | Represents a mock trigger for workflow testing. | Class |
| [TestActionExecutionContext](test-action-execution-context-class-definition.md) | Represents the execution context for a specific action in a test workflow. | Class |
| [TestExecutionContext](test-execution-context-class-definition.md) | Represents the execution context for a test workflow. | Class |
| [TestIterationItem](test-iteration-item-class-definition.md) | Represents an iteration item in a test workflow execution. | Class |
| [TestWorkflowRun](test-workflow-run-class-definition.md) | Represents the result of a workflow test execution. | Class |
| [TestErrorInfo](test-error-info-class-definition.md) | Contains detailed information about errors that occur during workflow testing. | Class |
| [TestErrorResponseAdditionalInfo](test-error-response-additional-info-class-definition.md) | Contains more information about error responses in workflow testing. | Class |
| [TestWorkflowOutputParameter](test-workflow-output-parameter-class-definition.md) | Represents an output parameter from a workflow test execution. | Class |
| [TestWorkflowRunActionRepetitionResult](test-workflow-run-action-repetition-result-class-definition.md) | Represents the result of an action repetition in a workflow test run. | Class |
| [TestWorkflowRunActionResult](test-workflow-run-action-result-class-definition.md) | Represents the result of an action execution in a workflow test run. | Class |
| [TestWorkflowRunTriggerResult](test-workflow-run-trigger-result-class-definition.md) | Represents the result of a trigger execution in a workflow test run. | Class |
| [TestWorkflowStatus](test-workflow-status-enum-definition.md) | Defines the possible status values for a test workflow execution. | Enum |

## Get started

To begin using the Azure Logic Apps Automated Test SDK, set up and run your workflow tests by starting with the [**`UnitTestExecutor`**](unit-test-executor-class-definition.md) class. Create test data with the [**`ActionMock`**](action-mock-class-definition.md) and [**`TriggerMock`**](trigger-mock-class-definition.md) classes, and validate your workflow behavior by examining the [**`TestWorkflowRun`**](test-workflow-run-class-definition.md) results.

## Key concepts

### Test execution flow

1. **Initialize**: Create a **`UnitTestExecutor`** object with your workflow definition and configuration files.

1. **Mock the data**: Create **`TriggerMock`** and **`ActionMock`** objects to simulate external dependencies.

1. **Execute**: Run the workflow using the **`RunWorkflowAsync()`** method.

1. **Validate**: Examine the **`TestWorkflowRun`** result to verify the expected behavior.

### Mock objects

Mock objects let you simulate external dependencies and control the data flow in your tests.

- **`TriggerMock`**: Simulates workflow triggers, such as HTTP requests, timers, and so on.
- **`ActionMock`**: Simulates workflow actions, such as API calls, database operations, and so on.

### Test results

The SDK provides the following detailed information about test execution:

| Item | Description |
|------|-------------|
| **Status** | Overall workflow execution status |
| **Actions** | Individual action execution results |
| **Errors** | Detailed error information if execution fails |
| **Output** | Workflow output parameters and values |

## Best practices

- Create comprehensive mock data that covers both success and failure scenarios.
- Improve test readability by using meaningful names for your mock objects.
- Validate both successful execution paths and error handling scenarios.
- Organize your test files in a clear directory structure.
- Use appropriate timeout values for your specific workflow requirements.

## Related content

- [Create unit tests from Standard workflow definitions in Azure Logic Apps with Visual Studio Code](create-unit-tests-Standard-workflow-definitions-visual-studio-code.md)
- [Create unit tests from Standard workflow runs in Azure Logic Apps with Visual Studio Code](create-unit-tests-standard-workflow-runs-visual-studio-code.md)
