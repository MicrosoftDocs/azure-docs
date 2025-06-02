---
title: Azure Logic Apps Automated Test SDK
description: Complete reference documentation for the Azure Logic Apps Automated Test SDK classes and enums.
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: overview
ms.date: 06/02/2025
---

# Azure Logic Apps Automated Test SDK

The Azure Logic Apps Automated Test SDK provides a comprehensive framework for unit testing Logic Apps workflows. This SDK enables developers to create mock data, execute workflows in isolation, and validate execution results.

## Overview

The SDK consists of several key components that work together to provide a complete testing solution:

- **Test Execution**: Core classes for running workflow tests
- **Mock Data**: Classes for creating mock triggers and actions
- **Test Context**: Classes representing test execution state and context
- **Results**: Classes containing workflow execution results and status information
- **Error Handling**: Classes for managing test errors and exceptions

## SDK Classes and Enums

| Class/Enum | Description | Type |
|------------|-------------|------|
| [UnitTestExecutor](unit-test-executor-class-definition.md) | Main entry point for executing unit tests for Azure Logic Apps workflows | Class |
| [ActionMock](action-mock-class-definition.md) | Represents a mock action for workflow testing | Class |
| [TriggerMock](trigger-mock-class-definition.md) | Represents a mock trigger for workflow testing | Class |
| [MockData](mock-data-class-definition.md) | Contains mock data for testing workflows | Class |
| [TestActionExecutionContext](test-action-execution-context-class-definition.md) | Represents the execution context for a specific action in a test workflow | Class |
| [TestExecutionContext](test-execution-context-class-definition.md) | Represents the execution context for a test workflow | Class |
| [TestIterationItem](test-iteration-item-class-definition.md) | Represents an iteration item in a test workflow execution | Class |
| [TestWorkflowRun](test-workflow-run-class-definition.md) | Represents the result of a workflow test execution | Class |
| [TestErrorInfo](test-error-info-class-definition.md) | Contains detailed information about errors that occur during workflow testing | Class |
| [TestErrorResponseAdditionalInfo](test-error-response-additional-info-class-definition.md) | Contains additional information about error responses in workflow testing | Class |
| [TestWorkflowOutputParameter](test-workflow-output-parameter-class-definition.md) | Represents an output parameter from a workflow test execution | Class |
| [TestWorkflowRunActionRepetitionResult](test-workflow-run-action-repetition-result-class-definition.md) | Represents the result of an action repetition in a workflow test run | Class |
| [TestWorkflowRunActionResult](test-workflow-run-action-result-class-definition.md) | Represents the result of an action execution in a workflow test run | Class |
| [TestWorkflowRunOperationResult](test-workflow-run-operation-result-class-definition.md) | Represents the result of an operation in a workflow test run | Class |
| [TestWorkflowRunTriggerResult](test-workflow-run-trigger-result-class-definition.md) | Represents the result of a trigger execution in a workflow test run | Class |
| [TestWorkflowStatus](test-workflow-status-enum-definition.md) | Defines the possible status values for a test workflow execution | Enum |

## Getting Started

To begin using the Azure Logic Apps Automated Test SDK, start with the [`UnitTestExecutor`](unit-test-executor-class-definition.md) class to set up and run your workflow tests. Use [`ActionMock`](action-mock-class-definition.md) and [`TriggerMock`](trigger-mock-class-definition.md) to create test data, and examine the [`TestWorkflowRun`](test-workflow-run-class-definition.md) results to validate your workflow behavior.

## Key Concepts

### Test Execution Flow

1. **Initialize**: Create a `UnitTestExecutor` with your workflow definition and configuration files
2. **Mock Data**: Create `TriggerMock` and `ActionMock` objects to simulate external dependencies
3. **Execute**: Run the workflow using `RunWorkflowAsync()` method
4. **Validate**: Examine the `TestWorkflowRun` result to verify expected behavior

### Mock Objects

Mock objects allow you to simulate external dependencies and control the data flow in your tests:
- **TriggerMock**: Simulates workflow triggers (HTTP requests, timers, etc.)
- **ActionMock**: Simulates workflow actions (API calls, database operations, etc.)

### Test Results

The SDK provides detailed information about test execution:
- **Status**: Overall workflow execution status
- **Actions**: Individual action execution results
- **Errors**: Detailed error information if execution fails
- **Output**: Workflow output parameters and values

## Best Practices

- Create comprehensive mock data that covers both success and failure scenarios
- Use meaningful names for your mock objects to improve test readability
- Validate both successful execution paths and error handling scenarios
- Organize your test files in a clear directory structure
- Use appropriate timeout values for your specific workflow requirements

## Related content

* [Create unit tests from Standard workflow definitions in Azure Logic Apps with Visual Studio Code](create-unit-tests-Standard-workflow-definitions-visual-studio-code.md)
* [Create unit tests from Standard workflow runs in Azure Logic Apps with Visual Studio Code](create-unit-tests-standard-workflow-runs-visual-studio-code.md)
