---
title: UnitTestExecutor Class Definition
description: Detailed documentation for the UnitTestExecutor class in the Azure Logic Apps Unit Testing SDK.
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 06/02/2025
---

# UnitTestExecutor Class Definition

Provides functionality to execute unit tests for Azure Logic Apps workflows. This class serves as the main entry point for running workflow tests with mock data and custom configurations.

## Namespace

`Microsoft.Azure.Workflows.UnitTesting`

## Usage

The `UnitTestExecutor` class is used to load workflow definitions and execute them with test data:

```csharp
// Initialize with workflow file path
var executor = new UnitTestExecutor("path/to/workflow.json");

// Initialize with all configuration files
var executor = new UnitTestExecutor(
    workflowFilePath: "path/to/workflow.json",
    connectionsFilePath: "path/to/connections.json",
    parametersFilePath: "path/to/parameters.json",
    localSettingsFilePath: "path/to/local.settings.json"
);

// Execute workflow with test mocks
var testMock = new TestMockDefinition
{
    TriggerMock = new [TriggerMock](trigger-mock-class-definition.md) { /* trigger configuration */ },
    ActionMocks = new List<[ActionMock](action-mock-class-definition.md)> { /* action mocks */ }
};

var result = await executor.RunWorkflowAsync(testMock);
```

## Constructors

### UnitTestExecutor(string, string, string, string)

Initializes a new instance of the UnitTestExecutor class with workflow and configuration files.

#### Parameters

| Name | Type | Description | Required |
|------|------|-------------|----------|
| workflowFilePath | string | The path to the workflow definition file | Yes |
| connectionsFilePath | string | The path to the connections configuration file | No |
| parametersFilePath | string | The path to the parameters configuration file | No |
| localSettingsFilePath | string | The path to the local settings file | No |

#### Example

```csharp
var executor = new UnitTestExecutor(
    workflowFilePath: "MyWorkflow/workflow.json",
    connectionsFilePath: "MyWorkflow/connections.json",
    parametersFilePath: "MyWorkflow/parameters.json",
    localSettingsFilePath: "local.settings.json"
);
```

## Properties

### WorkflowSettings

Gets or sets the workflow definition settings.

| Property | Type | Description | Required |
|----------|------|-------------|----------|
| WorkflowSettings | TestWorkflowSettings | Configuration settings for the workflow test execution | Yes |

## Methods

### RunWorkflowAsync(TestMockDefinition, string, int)

Executes a workflow using the given configuration files with the specified trigger and action mocks.

#### Parameters

| Name | Type | Description | Required | Default |
|------|------|-------------|----------|---------|
| testMock | TestMockDefinition | The test mock definition containing trigger and action mocks | Yes | - |
| customCodeFunctionFilePath | string | The path to custom code function file | No | null |
| timeoutInSeconds | int | The timeout configuration in seconds | No | DefaultUnitTestTimeoutSeconds |

#### Returns

`Task<[TestWorkflowRun](test-workflow-run-class-definition.md)>` - A task representing the asynchronous operation that returns the workflow run result.

#### Example

```csharp
var testMock = new TestMockDefinition
{
    TriggerMock = new [TriggerMock](trigger-mock-class-definition.md)
    {
        Kind = "Http",
        Outputs = new
        {
            body = new { message = "Test message" },
            statusCode = 200
        }
    },
    ActionMocks = new List<[ActionMock](action-mock-class-definition.md)>
    {
        new [ActionMock](action-mock-class-definition.md)
        {
            ActionName = "Send_an_email",
            Kind = "Office365Outlook",
            Outputs = new { status = "success" }
        }
    }
};

// Run with default timeout
var result = await executor.RunWorkflowAsync(testMock);

// Run with custom timeout and custom code
var result = await executor.RunWorkflowAsync(
    testMock: testMock,
    customCodeFunctionFilePath: "path/to/custom-functions.js",
    timeoutInSeconds: 120
);
```

## Related Content

- [ActionMock Class Definition](action-mock-class-definition.md)
- [MockData Class Definition](mock-data-class-definition.md)
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
- [TestWorkflowRunOperationResult Class Definition](test-workflow-run-operation-result-class-definition.md)
- [TestWorkflowRunTriggerResult Class Definition](test-workflow-run-trigger-result-class-definition.md)
- [TestWorkflowStatus Enum Definition](test-workflow-status-enum-definition.md)
