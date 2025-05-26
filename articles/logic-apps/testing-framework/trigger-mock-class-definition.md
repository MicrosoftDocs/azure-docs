# TriggerMock

**Namespace**: Microsoft.Azure.Workflows.UnitTesting.Definitions

This class creates a mocked instance of a trigger in a workflow. It inherits from OperationMock.

## Usage

The TriggerMock class allows you to simulate triggers in Logic Apps workflows for testing purposes. You can create mocks with different statuses, outputs, or dynamic behaviors.

```C#
// Basic trigger mock with success status
var successTrigger = new TriggerMock(TestWorkflowStatus.Succeeded, "HttpTrigger");

// Trigger mock with custom outputs
var outputTrigger = new TriggerMock(
    TestWorkflowStatus.Succeeded,
    "EmailTrigger",
    new MockOutput { 
        Body = JToken.Parse(@"{""subject"": ""Test Email"", ""from"": ""test@example.com""}") 
    });

// Dynamic trigger that changes behavior based on execution context
var dynamicTrigger = new TriggerMock(
    (context) => {
        // Examine the context and return appropriate mock
        if (context.ActionContext.ActionName == "ProcessOrder") {
            return new TriggerMock(TestWorkflowStatus.Succeeded, "OrderTrigger");
        }
        return new TriggerMock(TestWorkflowStatus.Failed, "OrderTrigger");
    },
    "ContextAwareTrigger");
```

## Constructors

> [!NOTE]
>
> Each Action mock will have a mock output derived from its Action type. You will find classes for each action and trigger mock output generated when you create a new unit test from a [workflow definition](create-unit-tests-standard-workflow-definitions-visual-studio-code.md) or from a [workflow run](create-unit-tests-standard-workflow-runs-visual-studio-code.md).

### Constructor with Static Outputs

Creates a mocked instance for TriggerMock with static outputs.

```C#
public TriggerMock(TestWorkflowStatus status, string name = null, MockOutput outputs = null)
```

| Name | Description | Type |
|------|-------------|------|
| status | The mocked trigger result status | TestWorkflowStatus |
| name | The mocked trigger name | string * |
| outputs | The mocked static outputs | MockOutput * |

```C#
// Example: Creating a trigger mock with successful status and static outputs
var outputs = new MockOutput { /* output properties */ };
var triggerMock = new TriggerMock(TestWorkflowStatus.Succeeded, "MyTrigger", outputs);
```

### Constructor with Error Info

Creates a mocked instance for TriggerMock with static error info.

```C#
public TriggerMock(TestWorkflowStatus status, string name = null, TestErrorInfo error = null)
```

| Name | Description | Type |
|------|-------------|------|
| status | The mocked trigger result status | TestWorkflowStatus |
| name | The mocked trigger name | string * |
| error | The mocked trigger error info | TestErrorInfo * |

```C#
// Example: Creating a trigger mock with failed status and error information
var errorInfo = new TestErrorInfo { /* error properties */ };
var triggerMock = new TriggerMock(TestWorkflowStatus.Failed, "MyFailedTrigger", errorInfo);
```

### Constructor with Callback Function

Creates a mocked instance for TriggerMock with a callback function for dynamic outputs.

```C#
public TriggerMock(Func<TestExecutionContext, TriggerMock> onGetTriggerMock, string name = null)
```

| Name | Description | Type |
|------|-------------|------|
| onGetTriggerMock | The callback function to get the mocked trigger | Func<TestExecutionContext, TriggerMock> |
| name | The mocked trigger name | string * |

```C#
// Example: Creating a trigger mock with dynamic outputs based on execution context
var triggerMock = new TriggerMock(
    (context) => {
        // Determine outputs dynamically based on context
        return new TriggerMock(TestWorkflowStatus.Succeeded, "DynamicTrigger", new MockOutput { /* dynamic outputs */ });
    }, 
    "MyDynamicTrigger");
```

## Related Content

* [Action Mock Class Definition](action-mock-class-definition.md)
* [Test Execution Context Class Definition](test-execution-context-class-definition.md)
* [Test Action Execution Context Class Definition](test-action-execution-context-class-definition.md)
* [Test Iteration Item Class Definition](test-iteration-item-class-definition.md)
* [Test Workflow Run Class Definition](test-workflow-run-class-definition.md)
