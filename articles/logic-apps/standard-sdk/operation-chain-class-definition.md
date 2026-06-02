---
title: OperationChain Class Definition
description: Represents a directed chain of workflow operations with a shared start node and one or more end nodes for fluent workflow composition.
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 05/28/2026
---

# OperationChain Class Definition

**Namespace**: Microsoft.Azure.Workflows.Sdk

[OperationChain](operation-chain-class-definition.md) represents a directed chain of workflow operations, tracking a start node and one or more end nodes. It is the result of every `Then()` call and supports combining parallel branches that share the same root.

## Usage

```C#
var trigger = WorkflowTriggers.BuiltIn.CreateHttpTrigger();
var left = trigger.Then(WorkflowActions.BuiltIn.Compose(inputs: () => "Left").WithName("Left"));
var right = trigger.Then(WorkflowActions.BuiltIn.Compose(inputs: () => "Right").WithName("Right"));

// Join two chains that share the same trigger root
var joined = left.Join(right);

// Fan-in: add an action after both branches
joined.Then(WorkflowActions.BuiltIn.Compose(inputs: () => "Merged").WithName("Merged"));

WorkflowFactory.CreateStatefulWorkflow("fanInWorkflow", trigger);
```

## Methods

### Join

Combines this chain with another [OperationChain](operation-chain-class-definition.md) that shares the same root operation, producing a single chain with unified end nodes. Use this method to merge independently built branches before continuing with additional actions.

```C#
public OperationChain Join(OperationChain other)
```

|Name|Description|Type|Required|
|---|---|---|---|
|other|The chain to join with. Must share the same start node.|[OperationChain](operation-chain-class-definition.md)|Yes|

```C#
var trigger = WorkflowTriggers.BuiltIn.CreateHttpTrigger();
var branch1 = trigger.Then(WorkflowActions.BuiltIn.Compose(inputs: () => "A").WithName("BranchA"));
var branch2 = trigger.Then(WorkflowActions.BuiltIn.Compose(inputs: () => "B").WithName("BranchB"));

// Merge both branches
OperationChain merged = branch1.Join(branch2);

// Continue after both branches complete
merged.Then(WorkflowActions.BuiltIn.Response(
    responseBody: () => "Both branches done").WithName("FinalResponse"));
```

### Then

_This type implements `Then()` methods from [IChainableNode](i-chainable-node-class-definition.md). See that page for full documentation of all overloads._

## Related Content

- [AgentToolContext Class Definition](agent-tool-context-class-definition.md)
- [IChainableNode Interface Definition](i-chainable-node-class-definition.md)
- [IVariableWorkflowAction Interface Definition](i-variable-workflow-action-class-definition.md)
- [IWorkflowAction Interface Definition](i-workflow-action-class-definition.md)
- [IWorkflowOperation Interface Definition](i-workflow-operation-class-definition.md)
- [IWorkflowProvider Interface Definition](i-workflow-provider-class-definition.md)
- [IWorkflowTrigger Interface Definition](i-workflow-trigger-class-definition.md)
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
