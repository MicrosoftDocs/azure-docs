---
title: IChainableNode interface
titleSuffix: Azure Logic Apps
description: Defines the fluent chaining contract for composing workflow operations into sequential and parallel execution pipelines using the Then() method pattern.
services: azure-logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 05/28/2026
---

# IChainableNode interface

**Namespace**: Microsoft.Azure.Workflows.Sdk

Defines the fluent chaining contract for composing workflow operations into sequential and parallel execution pipelines using the `Then()` method pattern. Both [IWorkflowOperation](i-workflow-operation-class-definition.md) and [OperationChain](operation-chain-class-definition.md) implement this interface so you can compose linear and branched workflows fluently.

## Usage

```C#
var trigger = WorkflowTriggers.BuiltIn.CreateHttpTrigger();
var compose = WorkflowActions.BuiltIn.Compose(inputs: () => "Hello").WithName("Greet");
var response = WorkflowActions.BuiltIn.Response(responseBody: () => $"{compose.Output}").WithName("Reply");

trigger
    .Then(compose)
    .Then(response);
```

## Methods

### Then(IWorkflowAction)

Chains a subsequent [IWorkflowAction](i-workflow-action-class-definition.md) to run after the current node completes successfully. This is the standard overload for building sequential workflows.

```C#
OperationChain Then(IWorkflowAction action)
```

|Name|Description|Type|Required|
|---|---|---|---|
|action|The action to append to the current chain.|[IWorkflowAction](i-workflow-action-class-definition.md)|Yes|

```C#
var trigger = WorkflowTriggers.BuiltIn.CreateHttpTrigger();
var compose = WorkflowActions.BuiltIn.Compose(inputs: () => "Hello").WithName("Greet");
var response = WorkflowActions.BuiltIn.Response(responseBody: () => $"{compose.Output}").WithName("Reply");

trigger
    .Then(compose)
    .Then(response);
```

### Then(IWorkflowAction, FlowStatus[])

Chains a subsequent [IWorkflowAction](i-workflow-action-class-definition.md) with explicit `FlowStatus` conditions. Use this overload when the appended action should run only after the previous action reaches one of the specified statuses.

```C#
OperationChain Then(IWorkflowAction action, FlowStatus[] runAfter)
```

|Name|Description|Type|Required|
|---|---|---|---|
|action|The action to append to the current chain.|[IWorkflowAction](i-workflow-action-class-definition.md)|Yes|
|runAfter|The status values that allow the appended action to execute.|FlowStatus[]|Yes|

```C#
var trigger = WorkflowTriggers.BuiltIn.CreateHttpTrigger();
var process = WorkflowActions.BuiltIn.Compose(inputs: () => "Process").WithName("Process");
var errorHandler = WorkflowActions.BuiltIn.Compose(inputs: () => "Error occurred").WithName("HandleError");

trigger
    .Then(process)
    .Then(errorHandler, runAfter: new[] { FlowStatus.Failed, FlowStatus.TimedOut });
```

### Then(IWorkflowAction, RunAfter[])

Chains a subsequent [IWorkflowAction](i-workflow-action-class-definition.md) with explicit per-predecessor `RunAfter` configuration. Use this overload in fan-in scenarios where the next action must wait for multiple predecessor chains.

```C#
OperationChain Then(IWorkflowAction action, RunAfter[] runAfter)
```

|Name|Description|Type|Required|
|---|---|---|---|
|action|The action to append after the configured predecessors complete.|[IWorkflowAction](i-workflow-action-class-definition.md)|Yes|
|runAfter|The per-predecessor run-after definitions that control when the action executes.|RunAfter[]|Yes|

```C#
var trigger = WorkflowTriggers.BuiltIn.CreateHttpTrigger();
var leftChain = trigger
    .Then(WorkflowActions.BuiltIn.Compose(inputs: () => "Left").WithName("Left"));
var rightChain = trigger
    .Then(WorkflowActions.BuiltIn.Compose(inputs: () => "Right").WithName("Right"));
var merged = WorkflowActions.BuiltIn.Compose(inputs: () => "Done").WithName("Merged");

leftChain
    .Join(rightChain)
    .Then(merged, runAfter: new[]
    {
        new RunAfter(leftChain, FlowStatus.Succeeded),
        new RunAfter(rightChain, FlowStatus.Succeeded),
    });
```

### Then(Func<IChainableNode, OperationChain[]>)

Splits the current node into multiple parallel branches. The callback receives the current [IChainableNode](i-chainable-node-class-definition.md) and must return [OperationChain](operation-chain-class-definition.md) instances that share the same root node.

```C#
OperationChain Then(Func<IChainableNode, OperationChain[]> branches)
```

|Name|Description|Type|Required|
|---|---|---|---|
|branches|A callback that creates one or more branches from the current node.|Func&lt;[IChainableNode](i-chainable-node-class-definition.md), [OperationChain](operation-chain-class-definition.md)[]&gt;|Yes|

```C#
var trigger = WorkflowTriggers.BuiltIn.CreateHttpTrigger();
var branch1 = WorkflowActions.BuiltIn.Compose(inputs: () => "Branch 1").WithName("Branch1");
var branch2 = WorkflowActions.BuiltIn.Compose(inputs: () => "Branch 2").WithName("Branch2");
var merged = WorkflowActions.BuiltIn.Compose(inputs: () => "Merged").WithName("Merged");

trigger
    .Then(parent => new[]
    {
        parent.Then(branch1),
        parent.Then(branch2),
    })
    .Then(merged);
```

## Related Content

- [AgentToolContext Class Definition](agent-tool-context-class-definition.md)
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
- [WorkflowControlActions Class Definition](workflow-control-actions-class-definition.md)
- [WorkflowFactory Class Definition](workflow-factory-class-definition.md)
- [WorkflowManagedActions Class Definition](workflow-managed-actions-class-definition.md)
- [WorkflowManagedTriggers Class Definition](workflow-managed-triggers-class-definition.md)
- [WorkflowProviderExtensions Class Definition](workflow-provider-extensions-class-definition.md)
- [WorkflowTriggerBase Class Definition](workflow-trigger-base-class-definition.md)
- [WorkflowTriggers Class Definition](workflow-triggers-class-definition.md)
- [WorkflowVariableActions Class Definition](workflow-variable-actions-class-definition.md)
