---
title: TriggerMock class
description: Creates a mock instance for a trigger in a Standard logic app workflow for unit testing.
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 06/10/2025
---

# TriggerMock class

**Namespace**: Microsoft.Azure.Workflows.UnitTesting.Definitions

This class creates a mock instance for a trigger in a Standard logic app workflow. The **`TriggerMock`** class provides multiple ways to create mock triggers for testing Standard workflows by using static outputs, error conditions, or dynamic behavior based on execution context.

## Usage

```C#
// Simple trigger mock with success status
var successTrigger = new TriggerMock(TestWorkflowStatus.Succeeded, "HttpTrigger");

// Trigger mock with specific outputs
var outputTrigger = new TriggerMock(
    TestWorkflowStatus.Succeeded,
    "EmailTrigger",
    new MockOutput { 
        Body = JToken.Parse(@"{""subject"": ""Test Email"", ""from"": ""test@example.com""}") 
    });

// Failed trigger with error information
var failedTrigger = new TriggerMock(
    TestWorkflowStatus.Failed,
    "DatabaseTrigger",
    new TestErrorInfo(
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

### Constructor with static outputs

Creates a mock instance for **`TriggerMock`** with static outputs.

```C#
public TriggerMock(TestWorkflowStatus status, string name = null, MockOutput outputs = null)
```

|Name|Description|Type|Required|
|---|---|---|---|
|status|The mock trigger result status|[TestWorkflowStatus](test-workflow-status-enum-definition.md)|Yes|
|name|The mock trigger name|string|No|
|outputs|The mock static outputs|MockOutput|No|

```C#
// Example: Create a mock trigger with successful status and static outputs
var outputs = new MockOutput { 
    Body = JToken.Parse(@"{""webhookData"": ""sample payload""}")
};
var triggerMock = new TriggerMock(TestWorkflowStatus.Succeeded, "WebhookTrigger", outputs);
```

### Constructor with error information

Creates a mock instance for **`TriggerMock`** with static error information.

```C#
public TriggerMock(TestWorkflowStatus status, string name = null, TestErrorInfo error = null)
```

|Name|Description|Type|Required|
|---|---|---|---|
|status|The mock trigger result status|[TestWorkflowStatus](test-workflow-status-enum-definition.md)|Yes|
|name|The mock trigger name|string|No|
|error|The mock trigger error info|[TestErrorInfo](test-error-info-class-definition.md)|No|

```C#
// Example: Create a mock trigger with failed status and error information
var errorInfo = new TestErrorInfo(
    ErrorResponseCode.Unauthorized,
    "Authentication failed for trigger"
);
var triggerMock = new TriggerMock(TestWorkflowStatus.Failed, "SecureTrigger", errorInfo);
```

### Constructor with callback function

Creates a mock instance for **`TriggerMock`** with a callback function for dynamic outputs.

```C#
public TriggerMock(Func<TestExecutionContext, TriggerMock> onGetTriggerMock, string name = null)
```

|Name|Description|Type|Required|
|---|---|---|---|
|onGetTriggerMock|The callback function to get the mock trigger|Func&lt;TestExecutionContext, TriggerMock&gt;|Yes|
|name|The mock trigger name|string|No|

```C#
// Example: Create a mock trigger with dynamic outputs based on execution context
var triggerMock = new TriggerMock(
    (context) => {
        var inputs = context.ActionContext.ActionInputs;
        var eventType = inputs["eventType"]?.Value<string>();
        
        // Return different mock based on event type
        if (eventType == "priority") {
            return new TriggerMock(
                TestWorkflowStatus.Succeeded, 
                "EventTrigger", 
                new MockOutput { Body = JToken.Parse(@"{""priority"": true}") }
            );
        }
        
        return new TriggerMock(TestWorkflowStatus.Succeeded, "EventTrigger");
    }, 
    "ConditionalEventTrigger");
```

### JSON constructor

Creates a mock instance for **`TriggerMock`** from JSON.

```C#
public TriggerMock(TestWorkflowStatus status, string name = null, JToken outputs = null, TestErrorInfo error = null)
```

|Name|Description|Type|Required|
|---|---|---|---|
|status|The mock trigger result status|[TestWorkflowStatus](test-workflow-status-enum-definition.md)|Yes|
|name|The mock trigger name|string|No|
|outputs|The mock outputs|MockOutput|No|
|error|The mock error|[TestErrorInfo](test-error-info-class-definition.md)|No|

```C#
// Example: Create a mock trigger from JSON
var triggerFromJson = JsonConvert.DeserializeObject<TriggerMock>(File.ReadAllText(mockDataPath));
```

## Properties

|Name|Description|Type|Required|
|---|---|---|---|
|Name|The name of the mock operation|string|No|
|Status|The operation status|[TestWorkflowStatus](test-workflow-status-enum-definition.md)|No|
|Outputs|The static output in JSON format|JToken|No|
|Error|The operation error|[TestErrorInfo](test-error-info-class-definition.md)|No|

## Related content

- [ActionMock Class Definition](action-mock-class-definition.md)
- [TestActionExecutionContext Class Definition](test-action-execution-context-class-definition.md)
- [TestErrorInfo Class Definition](test-error-info-class-definition.md)
- [TestErrorResponseAdditionalInfo Class Definition](test-error-response-additional-info-class-definition.md)
- [TestExecutionContext Class Definition](test-execution-context-class-definition.md)
- [TestIterationItem Class Definition](test-iteration-item-class-definition.md)
- [TestWorkflowOutputParameter Class Definition](test-workflow-output-parameter-class-definition.md)
- [TestWorkflowRun Class Definition](test-workflow-run-class-definition.md)
- [TestWorkflowRunActionRepetitionResult Class Definition](test-workflow-run-action-repetition-result-class-definition.md)
- [TestWorkflowRunActionResult Class Definition](test-workflow-run-action-result-class-definition.md)
- [TestWorkflowRunTriggerResult Class Definition](test-workflow-run-trigger-result-class-definition.md)
- [TestWorkflowStatus Enum Definition](test-workflow-status-enum-definition.md)
- [UnitTestExecutor Class Definition](unit-test-executor-class-definition.md)

