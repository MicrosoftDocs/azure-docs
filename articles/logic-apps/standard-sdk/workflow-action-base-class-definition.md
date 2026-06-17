---
title: WorkflowActionBase class
titleSuffix: Azure Logic Apps
description: Base implementation for workflow action nodes with fluent chaining, generated names, child tracking, and run-after configuration.
services: azure-logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 05/28/2026
---

# WorkflowActionBase class

**Namespace**: Microsoft.Azure.Workflows.Sdk

[WorkflowActionBase](workflow-action-base-class-definition.md) is the abstract base implementation for [IWorkflowAction](i-workflow-action-class-definition.md) nodes. It provides the fluent chaining behavior used by concrete workflow actions, plus automatic action naming, child action tracking, and run-after configuration storage.

## Usage

```C#
// WorkflowActionBase is abstract; use concrete actions via WorkflowActions.BuiltIn
var action = WorkflowActions.BuiltIn.Compose(inputs: () => "Hello").WithName("Greet");

// Access inherited properties
string name = action.Name; // "Greet"
var children = action.Children; // populated by .Then() calls
```

## Properties

|Name|Description|Type|Required|
|---|---|---|---|
|Name|Gets or sets the unique action name used in the generated workflow definition.|string|No|
|Children|Gets the child actions that run after this action.|List<[IWorkflowAction](i-workflow-action-class-definition.md)>|No|
|RunAfterConfig|Gets the mapping of predecessor action names to required completion statuses for this action.|Dictionary<string, FlowStatus[]>|No|

## Methods

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
- [OperationChain Class Definition](operation-chain-class-definition.md)
- [Typed Workflow Action Interfaces Definition](typed-workflow-action-interfaces-class-definition.md)
- [Typed Workflow Trigger Interfaces Definition](typed-workflow-trigger-interfaces-class-definition.md)
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
