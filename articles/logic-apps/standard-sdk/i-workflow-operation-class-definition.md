---
title: IWorkflowOperation interface
titleSuffix: Azure Logic Apps
description: Represents a named workflow operation in the execution graph, providing identity and connections to downstream child actions.
services: azure-logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 05/28/2026
---

# IWorkflowOperation interface

**Namespace**: Microsoft.Azure.Workflows.Sdk

Represents a named workflow operation in the execution graph, providing identity and connections to downstream child actions. Both [IWorkflowAction](i-workflow-action-class-definition.md) and [IWorkflowTrigger](i-workflow-trigger-class-definition.md) inherit this interface.

## Usage

```C#
var action = WorkflowActions.BuiltIn.Compose(inputs: () => "data").WithName("MyAction");
// Access name
string name = action.Name;
// Children are populated by .Then() calls
action.Then(WorkflowActions.BuiltIn.Response().WithName("Respond"));
var children = action.Children; // contains "Respond"
```

## Properties

|Name|Description|Type|Required|
|---|---|---|---|
|Name|Gets or sets the unique name of the operation within the workflow definition.|string|No|
|Children|Gets the child action nodes configured to run after this operation.|List&lt;[IWorkflowAction](i-workflow-action-class-definition.md)&gt;|No|

## Methods

_This type implements `Then()` methods from [IChainableNode](i-chainable-node-class-definition.md). See that page for full documentation of all overloads._

## Related Content

- [AgentToolContext Class Definition](agent-tool-context-class-definition.md)
- [IChainableNode Interface Definition](i-chainable-node-class-definition.md)
- [IVariableWorkflowAction Interface Definition](i-variable-workflow-action-class-definition.md)
- [IWorkflowAction Interface Definition](i-workflow-action-class-definition.md)
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
