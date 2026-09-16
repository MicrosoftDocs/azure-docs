---
title: WorkflowBuiltInActions class
titleSuffix: Azure Logic Apps
description: Factory methods for creating built-in workflow actions such as Compose, HTTP, Response, CustomCode, NestedWorkflow, and Agent actions.
services: azure-logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 05/28/2026
---

# WorkflowBuiltInActions class

**Namespace**: Microsoft.Azure.Workflows.Sdk

Provides factory methods for creating built-in workflow actions that run directly in the Logic Apps runtime. Access this class through [WorkflowActions](workflow-actions-class-definition.md) by using `WorkflowActions.BuiltIn` to create data transformation, HTTP, response, nested workflow, custom code, and agent actions.

## Usage

```C#
// Built-in actions are accessed via WorkflowActions.BuiltIn
var compose = WorkflowActions.BuiltIn.Compose(inputs: () => "Hello").WithName("Greet");
var http = WorkflowActions.BuiltIn.HttpAction(
    uri: () => new Uri("https://api.example.com"),
    method: () => HttpMethod.Post,
    requestBody: () => new { message = "test" }).WithName("PostData");
var response = WorkflowActions.BuiltIn.Response(
    responseBody: () => $"{http.Body}").WithName("Reply");

// Chain actions in a workflow
var trigger = WorkflowTriggers.BuiltIn.CreateHttpTrigger();
trigger.Then(compose).Then(http).Then(response);
```

## Properties

|Name|Description|Type|Required|
|---|---|---|---|
|Control|Gets the factory for control flow actions such as Scope, Condition, ForEach, Until, Switch, and Terminate.|[WorkflowControlActions](workflow-control-actions-class-definition.md)|No|
|Variables|Gets the factory for variable actions such as initialize, set, increment, decrement, and append operations.|[WorkflowVariableActions](workflow-variable-actions-class-definition.md)|No|

## Methods

### Compose

Creates a Compose action and returns an [IOutputWorkflowAction<JToken>](typed-workflow-action-interfaces-class-definition.md) whose output can be referenced by later actions.

```C#
IOutputWorkflowAction<JToken> Compose(Expression<Func<string>> inputs)
```

|Name|Description|Type|Required|
|---|---|---|---|
|inputs|Expression for the inputs to compose.|Expression&lt;Func&lt;string&gt;&gt;|Yes|

```C#
var compose = WorkflowActions.BuiltIn.Compose(inputs: () => "Hello World").WithName("Greet");
```

### Compose<T>(Expression<Func<T>> input)

Creates a typed Compose action and returns an [IOutputWorkflowAction<T>](typed-workflow-action-interfaces-class-definition.md) for strongly typed output references.

```C#
IOutputWorkflowAction<T> Compose<T>(Expression<Func<T>> input)
```

|Name|Description|Type|Required|
|---|---|---|---|
|input|Expression for the typed input to compose.|Expression&lt;Func&lt;T&gt;&gt;|Yes|

```C#
var typed = WorkflowActions.BuiltIn.Compose<int>(input: () => 42).WithName("Answer");
```

### HttpAction

Creates an HTTP action and returns an [IBodyWorkflowAction<JToken>](typed-workflow-action-interfaces-class-definition.md) for calling external endpoints.

```C#
IBodyWorkflowAction<JToken> HttpAction(Expression<Func<Uri>> uri, Expression<Func<HttpMethod>> method, Expression<Func<object>> requestBody = null, Expression<Func<Dictionary<string, string>>> queries = null, Expression<Func<Dictionary<string, string>>> headers = null)
```

|Name|Description|Type|Required|
|---|---|---|---|
|uri|Expression for the request URI.|Expression&lt;Func&lt;Uri&gt;&gt;|Yes|
|method|Expression for the HTTP method.|Expression&lt;Func&lt;HttpMethod&gt;&gt;|Yes|
|requestBody|Expression for the request body.|Expression&lt;Func&lt;object&gt;&gt;|No|
|queries|Expression for query parameters.|Expression&lt;Func&lt;Dictionary&lt;string, string&gt;&gt;&gt;|No|
|headers|Expression for request headers.|Expression&lt;Func&lt;Dictionary&lt;string, string&gt;&gt;&gt;|No|

```C#
var http = WorkflowActions.BuiltIn.HttpAction(
    uri: () => new Uri("https://api.example.com/data"),
    method: () => HttpMethod.Get,
    headers: () => new Dictionary<string, string> { ["Authorization"] = "Bearer token" })
    .WithName("CallAPI");
```

### Response

Creates a response action and returns an [IBodyWorkflowAction<JToken>](typed-workflow-action-interfaces-class-definition.md) for sending an HTTP response from a request workflow.

```C#
IBodyWorkflowAction<JToken> Response(Expression<Func<HttpStatusCode>> statusCode = null, Expression<Func<object>> responseBody = null, Expression<Func<Dictionary<string, string>>> headers = null, Expression<Func<JToken>> schema = null)
```

|Name|Description|Type|Required|
|---|---|---|---|
|statusCode|Expression for the HTTP status code.|Expression&lt;Func&lt;HttpStatusCode&gt;&gt;|No|
|responseBody|Expression for the response body.|Expression&lt;Func&lt;object&gt;&gt;|No|
|headers|Expression for response headers.|Expression&lt;Func&lt;Dictionary&lt;string, string&gt;&gt;&gt;|No|
|schema|Expression for the response schema.|Expression&lt;Func&lt;JToken&gt;&gt;|No|

```C#
var response = WorkflowActions.BuiltIn.Response(
    statusCode: () => HttpStatusCode.OK,
    responseBody: () => "Success").WithName("SendResponse");
```

### CustomCode<T>(Func<WorkflowContext, Task<T>> callback)

Creates a custom code action and returns an [IBodyWorkflowAction<T>](typed-workflow-action-interfaces-class-definition.md) that executes inline C# against a [WorkflowContext](workflow-context-class-definition.md).

```C#
IBodyWorkflowAction<T> CustomCode<T>(Func<WorkflowContext, Task<T>> callback)
```

|Name|Description|Type|Required|
|---|---|---|---|
|callback|The async callback to execute.|Func&lt;[WorkflowContext](workflow-context-class-definition.md), Task&lt;T&gt;&gt;|Yes|

```C#
var custom = WorkflowActions.BuiltIn.CustomCode<string>(async (context) =>
{
    var result = await context.GetTriggerResults();
    return "Processed";
}).WithName("RunCode");
```

### NestedWorkflow

Creates a nested workflow action and returns an [IBodyWorkflowAction<JToken>](typed-workflow-action-interfaces-class-definition.md) that invokes another workflow by reference name.

```C#
IBodyWorkflowAction<JToken> NestedWorkflow(Expression<Func<string>> workflowReferenceName, Expression<Func<object>> requestBody = null, Expression<Func<Dictionary<string, string>>> headers = null)
```

|Name|Description|Type|Required|
|---|---|---|---|
|workflowReferenceName|Reference name of the child workflow.|Expression&lt;Func&lt;string&gt;&gt;|Yes|
|requestBody|Request body for the child workflow.|Expression&lt;Func&lt;object&gt;&gt;|No|
|headers|Request headers for the child workflow.|Expression&lt;Func&lt;Dictionary&lt;string, string&gt;&gt;&gt;|No|

```C#
var nested = WorkflowActions.BuiltIn.NestedWorkflow(
    workflowReferenceName: () => "ChildWorkflow",
    requestBody: () => new { name = "test" }).WithName("CallChild");
```

### Agent

Creates an AgentAction that sends prompt messages to an AI model configured for an agent workflow.

```C#
AgentAction Agent(AgentModelType agentModelType, string deploymentId, AgentModelSettings agentModelSettings, string connectionName, Expression<Func<AgentPromptMessage[]>> messages)
```

|Name|Description|Type|Required|
|---|---|---|---|
|agentModelType|The AI model type, such as OpenAI.|AgentModelType|Yes|
|deploymentId|The model deployment identifier.|string|Yes|
|agentModelSettings|Configuration for the agent model.|AgentModelSettings|Yes|
|connectionName|The connection name for the AI service.|string|Yes|
|messages|Expression for the prompt messages array.|Expression&lt;Func&lt;AgentPromptMessage[]&gt;&gt;|Yes|

```C#
var agent = WorkflowActions.BuiltIn.Agent(
    agentModelType: AgentModelType.OpenAI,
    deploymentId: "gpt-4",
    agentModelSettings: new AgentModelSettings(),
    connectionName: "openai-connection",
    messages: () => new[] { new AgentPromptMessage { Role = "system", Content = "You are helpful" } });
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
- [WorkflowBuiltInTriggers Class Definition](workflow-built-in-triggers-class-definition.md)
- [WorkflowContext Class Definition](workflow-context-class-definition.md)
- [WorkflowControlActions Class Definition](workflow-control-actions-class-definition.md)
- [WorkflowFactory Class Definition](workflow-factory-class-definition.md)
- [WorkflowManagedActions Class Definition](workflow-managed-actions-class-definition.md)
- [WorkflowManagedTriggers Class Definition](workflow-managed-triggers-class-definition.md)
- [WorkflowProviderExtensions Class Definition](workflow-provider-extensions-class-definition.md)
- [WorkflowTriggerBase Class Definition](workflow-trigger-base-class-definition.md)
- [WorkflowTriggers Class Definition](workflow-triggers-class-definition.md)
- [WorkflowVariableActions Class Definition](workflow-variable-actions-class-definition.md)
