---
title: TriggerMock Class Definition
description: Creates a mocked instance of a trigger in a workflow for testing purposes
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 06/02/2025
---

# TriggerMock Class Definition

**Namespace**: Microsoft.Azure.Workflows.UnitTesting.Definitions

This class creates a mocked instance of a trigger in a workflow. It inherits from `OperationMock` and provides multiple ways to create trigger mocks for testing Logic Apps workflows with static outputs, error conditions, or dynamic behavior based on execution context.

## Usage

```C#
// Simple trigger mock with success status
var successTrigger = new [TriggerMock](trigger-mock-class-definition.md)([TestWorkflowStatus](test-workflow-status-enum-definition.md).Succeeded, "HttpTrigger");

// Trigger mock with specific outputs
var outputTrigger = new [TriggerMock](trigger-mock-class-definition.md)(
    [TestWorkflowStatus](test-workflow-status-enum-definition.md).Succeeded,
    "EmailTrigger",
    new MockOutput { 
        Body = JToken.Parse(@"{""subject"": ""Test Email"", ""from"": ""test@example.com""}") 
    });

// Failed trigger with error information
var failedTrigger = new [TriggerMock](trigger-mock-class-definition.md)(
    [TestWorkflowStatus](test-workflow-status-enum-definition.md).Failed,
    "DatabaseTrigger",
    new [TestErrorInfo](test-error-info-class-definition.md)(
        ErrorResponseCode.ConnectionError,
        "Failed to connect to database"
    ));

// Dynamic trigger that changes behavior based on execution context
var dynamicTrigger = new TriggerMock(
    (context) => {
        var actionName = context.ActionContext.ActionName;
        
        if (actionName == "ProcessOrder") {
            return new TriggerMock(
                TestWorkflowStatus.Succeeded, 
                "OrderTrigger",
                new MockOutput { Body = JToken.Parse(@"{""orderId"": 12345}") }
            );
        }
        
        return new TriggerMock(TestWorkflowStatus.Failed, "OrderTrigger");
    },
    "ContextAwareTrigger");
```

## Constructors

### Constructor with Static Outputs

Creates a mocked instance for TriggerMock with static outputs.

```C#
public TriggerMock(TestWorkflowStatus status, string name = null, MockOutput outputs = null)
```

|Name|Description|Type|Required|
|---|---|---|---|
|status|The mocked trigger result status|[TestWorkflowStatus](test-workflow-status-enum-definition.md)|Yes|
|name|The mocked trigger name|string|No|
|outputs|The mocked static outputs|MockOutput|No|

```C#
// Example: Creating a trigger mock with successful status and static outputs
var outputs = new MockOutput { 
    Body = JToken.Parse(@"{""webhookData"": ""sample payload""}")
};
var triggerMock = new [TriggerMock](trigger-mock-class-definition.md)([TestWorkflowStatus](test-workflow-status-enum-definition.md).Succeeded, "WebhookTrigger", outputs);
```

### Constructor with Error Info

Creates a mocked instance for TriggerMock with static error info.

```C#
public TriggerMock(TestWorkflowStatus status, string name = null, TestErrorInfo error = null)
```

|Name|Description|Type|Required|
|---|---|---|---|
|status|The mocked trigger result status|[TestWorkflowStatus](test-workflow-status-enum-definition.md)|Yes|
|name|The mocked trigger name|string|No|
|error|The mocked trigger error info|[TestErrorInfo](test-error-info-class-definition.md)|No|

```C#
// Example: Creating a trigger mock with failed status and error information
var errorInfo = new [TestErrorInfo](test-error-info-class-definition.md)(
    ErrorResponseCode.Unauthorized,
    "Authentication failed for trigger"
);
var triggerMock = new [TriggerMock](trigger-mock-class-definition.md)([TestWorkflowStatus](test-workflow-status-enum-definition.md).Failed, "SecureTrigger", errorInfo);
```

### Constructor with Callback Function

Creates a mocked instance for TriggerMock with a callback function for dynamic outputs.

```C#
public TriggerMock(Func<TestExecutionContext, TriggerMock> onGetTriggerMock, string name = null)
```

|Name|Description|Type|Required|
|---|---|---|---|
|onGetTriggerMock|The callback function to get the mocked trigger|Func&lt;[TestExecutionContext](test-execution-context-class-definition.md), [TriggerMock](trigger-mock-class-definition.md)&gt;|Yes|
|name|The mocked trigger name|string|No|

```C#
// Example: Creating a trigger mock with dynamic outputs based on execution context
var triggerMock = new [TriggerMock](trigger-mock-class-definition.md)(
    (context) => {
        var inputs = context.ActionContext.ActionInputs;
        var eventType = inputs["eventType"]?.Value<string>();
        
        // Return different mock based on event type
        if (eventType == "priority") {
            return new [TriggerMock](trigger-mock-class-definition.md)(
                [TestWorkflowStatus](test-workflow-status-enum-definition.md).Succeeded, 
                "EventTrigger", 
                new MockOutput { Body = JToken.Parse(@"{""priority"": true}") }
            );
        }
        
        return new [TriggerMock](trigger-mock-class-definition.md)([TestWorkflowStatus](test-workflow-status-enum-definition.md).Succeeded, "EventTrigger");
    }, 
    "ConditionalEventTrigger");
```

## Properties

This class inherits the following properties from its base class `OperationMock`:

|Name|Description|Type|Required|
|---|---|---|---|
|Name|Gets or sets the name of the mocked operation|string|No|
|Status|Gets or sets the operation status|[TestWorkflowStatus](test-workflow-status-enum-definition.md)?|No|
|Outputs|Gets or sets a value that represents static output in JSON format|JToken|No|
|Error|Gets or sets the operation error|[TestErrorInfo](test-error-info-class-definition.md)|No|

## Related Content

- [ActionMock Class Definition](action-mock-class-definition.md)
- [MockData Class Definition](mock-data-class-definition.md)
- [TestActionExecutionContext Class Definition](test-action-execution-context-class-definition.md)
- [TestErrorInfo Class Definition](test-error-info-class-definition.md)
- [TestErrorResponseAdditionalInfo Class Definition](test-error-response-additional-info-class-definition.md)
- [TestExecutionContext Class Definition](test-execution-context-class-definition.md)
- [TestIterationItem Class Definition](test-iteration-item-class-definition.md)
- [TestWorkflowOutputParameter Class Definition](test-workflow-output-parameter-class-definition.md)
- [TestWorkflowRun Class Definition](test-workflow-run-class-definition.md)
- [TestWorkflowRunActionRepetitionResult Class Definition](test-workflow-run-action-repetition-result-class-definition.md)
- [TestWorkflowRunActionResult Class Definition](test-workflow-run-action-result-class-definition.md)
- [TestWorkflowRunOperationResult Class Definition](test-workflow-run-operation-result-class-definition.md)
- [TestWorkflowRunTriggerResult Class Definition](test-workflow-run-trigger-result-class-definition.md)
- [TestWorkflowStatus Enum Definition](test-workflow-status-enum-definition.md)
- [UnitTestExecutor Class Definition](unit-test-executor-class-definition.md)

