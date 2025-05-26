# TestWorkflowRun

**Namespace**: Microsoft.Azure.Workflows.UnitTesting.Definitions

The flow run properties for a workflow test.

## Usage

The TestWorkflowRun class represents a workflow execution instance for testing purposes. It contains all the data related to a workflow run, including trigger information, action results, outputs, and variables.

```C#
// Creating a TestWorkflowRun instance
var workflowRun = new TestWorkflowRun
{
    StartTime = DateTime.UtcNow.AddMinutes(-5),
    EndTime = DateTime.UtcNow,
    Status = TestWorkflowStatus.Succeeded,
    Trigger = new TestWorkflowRunTriggerResult
    {
        Name = "HttpTrigger",
        Inputs = JToken.Parse(@"{""method"": ""POST"", ""url"": ""https://example.com/webhook""}"),
        Outputs = JToken.Parse(@"{""statusCode"": 200, ""headers"": {""Content-Type"": ""application/json""}}"),
    },
    Actions = new Dictionary<string, TestWorkflowRunActionResult>
    {
        ["ProcessData"] = new TestWorkflowRunActionResult
        {
            Status = TestWorkflowStatus.Succeeded,
            Inputs = JToken.Parse(@"{""data"": ""sample input""}"),
            Outputs = JToken.Parse(@"{""result"": ""processed data""}")
        }
    },
    Outputs = new Dictionary<string, TestWorkflowOutputParameter>
    {
        ["result"] = new TestWorkflowOutputParameter { Value = "Operation completed successfully" }
    },
    Variables = new Dictionary<string, JToken>
    {
        ["counter"] = JToken.FromObject(5),
        ["processedFlag"] = JToken.FromObject(true)
    }
};
```

## Properties

| Name | Description | Type |
|------|-------------|------|
| StartTime | Gets or sets the start time of the flow run | DateTime? |
| EndTime | Gets or sets the end time of the flow run | DateTime? |
| Status | Gets or sets the status of the flow run | TestWorkflowStatus? |
| Error | Gets or sets the flow run error | TestErrorInfo |
| Trigger | Gets or sets the flow run fired trigger | TestWorkflowRunTriggerResult |
| Actions | Gets or sets the actions | Dictionary<string, TestWorkflowRunActionResult> |
| Outputs | Gets or sets the outputs of the flow run | Dictionary<string, TestWorkflowOutputParameter> |
| Variables | Gets or sets the values of the flow run variables | Dictionary<string, JToken> |

## Related Content

* [Action Mock Class Definition](action-mock-class-definition.md)
* [Trigger Mock Class Definition](trigger-mock-class-definition.md)
* [Test Execution Context Class Definition](test-execution-context-class-definition.md)
* [Test Action Execution Context Class Definition](test-action-execution-context-class-definition.md)
* [Test Iteration Item Class Definition](test-iteration-item-class-definition.md)
