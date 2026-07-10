---
title: WorkflowBuiltInTriggers class
titleSuffix: Azure Logic Apps
description: Factory methods for creating built-in workflow triggers such as HTTP request, recurrence, and conversational agent triggers.
services: azure-logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 05/28/2026
---

# WorkflowBuiltInTriggers class

**Namespace**: Microsoft.Azure.Workflows.Sdk

Provides factory methods for creating built-in workflow triggers that start Logic Apps workflows without using managed connectors. Access this class through [WorkflowTriggers](workflow-triggers-class-definition.md) by using `WorkflowTriggers.BuiltIn`.

## Usage

```C#
// HTTP trigger for request-response workflows
var httpTrigger = WorkflowTriggers.BuiltIn.CreateHttpTrigger();
httpTrigger.Then(WorkflowActions.BuiltIn.Response(
    responseBody: () => "OK").WithName("Reply"));
WorkflowFactory.CreateStatefulWorkflow("HttpFlow", httpTrigger);

// Recurrence trigger for scheduled workflows
var timer = WorkflowTriggers.BuiltIn.CreateRecurrenceTrigger(
    frequency: FlowRecurrenceFrequency.Day, interval: 1);
timer.Then(WorkflowActions.BuiltIn.Compose(inputs: () => "Daily task").WithName("Process"));
WorkflowFactory.CreateStatelessWorkflow("ScheduledFlow", timer);

// Conversational trigger for AI agent workflows
var agentTrigger = WorkflowTriggers.BuiltIn.CreateConversationalAgentTrigger();
WorkflowFactory.CreateAgentWorkflow("AgentFlow", agentTrigger);
```

## Methods

### CreateHttpTrigger

Creates an HTTP request trigger and returns an [IOutputWorkflowTrigger&lt;HttpRequestTriggerOutput&gt;](typed-workflow-trigger-interfaces-class-definition.md) whose output provides access to the request body and headers in downstream expressions.

```C#
IOutputWorkflowTrigger<HttpRequestTriggerOutput> CreateHttpTrigger(string name = "when_an_HTTP_request_is_received", HttpMethod method = null, JToken requestBodyJsonSchema = null, string relativePath = null)
```

|Name|Description|Type|Required|
|---|---|---|---|
|name|Name for the trigger.|string|No|
|method|HTTP method filter.|HttpMethod|No|
|requestBodyJsonSchema|JSON schema for request body validation.|JToken|No|
|relativePath|Relative path for the trigger endpoint.|string|No|

```C#
var trigger = WorkflowTriggers.BuiltIn.CreateHttpTrigger(
    name: "MyHttpTrigger",
    method: HttpMethod.Post);
```

### CreateConversationalAgentTrigger

Creates a ConversationalFlowTrigger for agent workflows. Use this trigger only with workflows created through [WorkflowFactory](workflow-factory-class-definition.md) for the Agent workflow kind.

```C#
ConversationalFlowTrigger CreateConversationalAgentTrigger(string name = "When_a_new_chat_session_starts")
```

|Name|Description|Type|Required|
|---|---|---|---|
|name|Name for the conversational trigger.|string|No|

```C#
var agentTrigger = WorkflowTriggers.BuiltIn.CreateConversationalAgentTrigger();
```

### CreateRecurrenceTrigger

Creates a recurrence trigger and returns an [IWorkflowTrigger](i-workflow-trigger-class-definition.md) that starts a workflow on a schedule.

```C#
IWorkflowTrigger CreateRecurrenceTrigger(string name = "recurrence", FlowRecurrenceFrequency frequency = FlowRecurrenceFrequency.Minute, int interval = 1, DateTime? startTime = null, TimeZoneInfo timeZone = null)
```

|Name|Description|Type|Required|
|---|---|---|---|
|name|Name for the recurrence trigger.|string|No|
|frequency|Recurrence frequency such as Minute, Hour, or Day.|FlowRecurrenceFrequency|No|
|interval|Interval between recurrences.|int|No|
|startTime|Start time for the schedule.|DateTime?|No|
|timeZone|Time zone for the schedule. The implementation defaults to UTC when this value is not supplied.|TimeZoneInfo|No|

```C#
var timer = WorkflowTriggers.BuiltIn.CreateRecurrenceTrigger(
    frequency: FlowRecurrenceFrequency.Hour,
    interval: 2,
    timeZone: TimeZoneInfo.FindSystemTimeZoneById("Pacific Standard Time"));
```

## Related Content

- [AgentToolContext Class Definition](agent-tool-context-class-definition.md)
- [IChainableNode Interface Definition](i-chainable-node-class-definition.md)
- [IVariableWorkflowAction Interface Definition](i-variable-workflow-action-class-definition.md)
- [IWorkflowAction Interface Definition](i-workflow-action-class-definition.md)
- [IWorkflowOperation Interface Definition](i-workflow-operation-class-definition.md)
- [IWorkflowProvider Interface Definition](i-workflow-provider-class-definition.md)
- [IWorkflowTrigger Interface Definition](i-workflow-trigger-class-definition.md)
- [OperationChain Class Definition](operation-chain-class-definition.md)
- [Typed Workflow Action Interfaces Definition](typed-workflow-action-interfaces-class-definition.md)
- [Typed Workflow Trigger Interfaces Definition](typed-workflow-trigger-interfaces-class-definition.md)
- [WorkflowActionBase Class Definition](workflow-action-base-class-definition.md)
- [WorkflowActions Class Definition](workflow-actions-class-definition.md)
- [WorkflowBuiltInActions Class Definition](workflow-built-in-actions-class-definition.md)
- [WorkflowContext Class Definition](workflow-context-class-definition.md)
- [WorkflowControlActions Class Definition](workflow-control-actions-class-definition.md)
- [WorkflowFactory Class Definition](workflow-factory-class-definition.md)
- [WorkflowManagedActions Class Definition](workflow-managed-actions-class-definition.md)
- [WorkflowManagedTriggers Class Definition](workflow-managed-triggers-class-definition.md)
- [WorkflowProviderExtensions Class Definition](workflow-provider-extensions-class-definition.md)
- [WorkflowTriggerBase Class Definition](workflow-trigger-base-class-definition.md)
- [WorkflowTriggers Class Definition](workflow-triggers-class-definition.md)
- [WorkflowVariableActions Class Definition](workflow-variable-actions-class-definition.md)
