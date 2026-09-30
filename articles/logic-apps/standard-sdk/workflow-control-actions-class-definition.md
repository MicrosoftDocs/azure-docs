---
title: WorkflowControlActions class
titleSuffix: Azure Logic Apps
description: Factory methods for creating control flow actions such as Scope, Condition, ForEach, Until, Switch, and Terminate.
services: azure-logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 05/28/2026
---

# WorkflowControlActions class

**Namespace**: Microsoft.Azure.Workflows.Sdk

Provides factory methods for creating control flow actions that branch, group, repeat, or stop execution. Access this class through [WorkflowBuiltInActions](workflow-built-in-actions-class-definition.md) by using `WorkflowActions.BuiltIn.Control`.

## Usage

```C#
// Access control actions via WorkflowActions.BuiltIn.Control
var trigger = WorkflowTriggers.BuiltIn.CreateHttpTrigger();

var scope = WorkflowActions.BuiltIn.Control.Scope(() =>
{
    var step1 = WorkflowActions.BuiltIn.Compose(inputs: () => "Process").WithName("Process");
    return step1;
}).WithName("ProcessingScope");

trigger.Then(scope);
WorkflowFactory.CreateStatefulWorkflow("ControlFlowExample", trigger);
```

## Methods

### Scope

Creates a Scope action that groups nested actions into a single [IWorkflowAction](i-workflow-action-class-definition.md).

```C#
IWorkflowAction Scope(Func<IChainableNode> actions)
```

|Name|Description|Type|Required|
|---|---|---|---|
|actions|Factory that builds the nested action graph.|Func&lt;[IChainableNode](i-chainable-node-class-definition.md)&gt;|Yes|

```C#
var scope = WorkflowActions.BuiltIn.Control.Scope(() =>
{
    var step1 = WorkflowActions.BuiltIn.Compose(inputs: () => "Step 1").WithName("Step1");
    var step2 = WorkflowActions.BuiltIn.Compose(inputs: () => "Step 2").WithName("Step2");
    return step1.Then(step2);
}).WithName("MyScope");
```

### Condition

Creates a conditional action that evaluates a Boolean expression and routes execution to one of two branches.

```C#
IWorkflowAction Condition(Expression<Func<bool>> expression, Func<IChainableNode> trueBranch, Func<IChainableNode> falseBranch)
```

|Name|Description|Type|Required|
|---|---|---|---|
|expression|Boolean expression to evaluate.|Expression&lt;Func&lt;bool&gt;&gt;|Yes|
|trueBranch|Factory for the true branch actions.|Func&lt;[IChainableNode](i-chainable-node-class-definition.md)&gt;|Yes|
|falseBranch|Factory for the false branch actions.|Func&lt;[IChainableNode](i-chainable-node-class-definition.md)&gt;|Yes|

```C#
var condition = WorkflowActions.BuiltIn.Control.Condition(
    expression: () => trigger.TriggerOutput.Body != null,
    trueBranch: () => WorkflowActions.BuiltIn.Compose(inputs: () => "Has body").WithName("True"),
    falseBranch: () => WorkflowActions.BuiltIn.Compose(inputs: () => "No body").WithName("False")
).WithName("CheckBody");
```

### ForEach

Creates a loop action that iterates over a collection and executes the supplied action graph for each item.

```C#
IWorkflowAction ForEach(Expression<Func<JToken>> items, Func<JToken, IChainableNode> actions)
```

|Name|Description|Type|Required|
|---|---|---|---|
|items|Expression for the collection to iterate.|Expression&lt;Func&lt;JToken&gt;&gt;|Yes|
|actions|Factory receiving the current item and returning an action graph.|Func&lt;JToken, [IChainableNode](i-chainable-node-class-definition.md)&gt;|Yes|

```C#
var forEach = WorkflowActions.BuiltIn.Control.ForEach(
    items: () => JArray.Parse("[\"one\",\"two\"]"),
    actions: (item) => WorkflowActions.BuiltIn.Compose(inputs: () => $"Item: {item}").WithName("ProcessItem")
).WithName("LoopItems");
```

### Until

Creates a loop action that repeats its nested actions until the supplied expression evaluates to true.

```C#
IWorkflowAction Until(Expression<Func<bool>> expression, Func<IChainableNode> actions)
```

|Name|Description|Type|Required|
|---|---|---|---|
|expression|Boolean exit condition.|Expression&lt;Func&lt;bool&gt;&gt;|Yes|
|actions|Factory that builds the repeated action graph.|Func&lt;[IChainableNode](i-chainable-node-class-definition.md)&gt;|Yes|

```C#
var counterVar = WorkflowActions.BuiltIn.Variables.InitializeVariable<int>(
    name: () => "counter",
    value: () => 0).WithName("Counter");

var until = WorkflowActions.BuiltIn.Control.Until(
    expression: () => counterVar.Value.Value<int>() >= 10,
    actions: () => WorkflowActions.BuiltIn.Variables.IncrementVariable<int>(
        name: () => "counter", value: () => 1).WithName("Increment")
).WithName("RepeatUntil10");
```

### Switch

Creates a switch action that evaluates an input and routes execution to a matching SwitchCase or a default branch.

```C#
IWorkflowAction Switch(Expression<Func<JToken>> on, Func<Dictionary<string, SwitchCase>> cases, Func<IChainableNode> defaultCase = null)
```

|Name|Description|Type|Required|
|---|---|---|---|
|on|Expression for the value to switch on.|Expression&lt;Func&lt;JToken&gt;&gt;|Yes|
|cases|Factory returning case label to SwitchCase mapping.|Func&lt;Dictionary&lt;string, SwitchCase&gt;&gt;|Yes|
|defaultCase|Factory for the default case actions.|Func&lt;[IChainableNode](i-chainable-node-class-definition.md)&gt;|No|

```C#
var switchAction = WorkflowActions.BuiltIn.Control.Switch(
    on: () => trigger.TriggerOutput.Body,
    cases: () => new Dictionary<string, SwitchCase>
    {
        ["case1"] = new SwitchCase("value1",
            WorkflowActions.BuiltIn.Compose(inputs: () => "Case 1").WithName("HandleCase1")),
        ["case2"] = new SwitchCase("value2",
            WorkflowActions.BuiltIn.Compose(inputs: () => "Case 2").WithName("HandleCase2"))
    },
    defaultCase: () => WorkflowActions.BuiltIn.Compose(inputs: () => "Default").WithName("HandleDefault")
).WithName("RouteByValue");
```

### Terminate

Creates a terminate action that stops the workflow with a specified FlowStatus and optional message.

```C#
IWorkflowAction Terminate(Expression<Func<FlowStatus>> status, Expression<Func<string>> message = null)
```

|Name|Description|Type|Required|
|---|---|---|---|
|status|Expression for termination status.|Expression&lt;Func&lt;FlowStatus&gt;&gt;|Yes|
|message|Expression for termination message.|Expression&lt;Func&lt;string&gt;&gt;|No|

```C#
var terminate = WorkflowActions.BuiltIn.Control.Terminate(
    status: () => FlowStatus.Failed,
    message: () => "Critical error occurred").WithName("StopWorkflow");
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
- [WorkflowBuiltInTriggers Class Definition](workflow-built-in-triggers-class-definition.md)
- [WorkflowContext Class Definition](workflow-context-class-definition.md)
- [WorkflowFactory Class Definition](workflow-factory-class-definition.md)
- [WorkflowManagedActions Class Definition](workflow-managed-actions-class-definition.md)
- [WorkflowManagedTriggers Class Definition](workflow-managed-triggers-class-definition.md)
- [WorkflowProviderExtensions Class Definition](workflow-provider-extensions-class-definition.md)
- [WorkflowTriggerBase Class Definition](workflow-trigger-base-class-definition.md)
- [WorkflowTriggers Class Definition](workflow-triggers-class-definition.md)
- [WorkflowVariableActions Class Definition](workflow-variable-actions-class-definition.md)
