---
title: IWorkflowAction interface
titleSuffix: Azure Logic Apps
description: Represents an action step within a workflow that executes after a trigger fires or after preceding actions complete.
services: azure-logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 05/28/2026
---

# IWorkflowAction interface

**Namespace**: Microsoft.Azure.Workflows.Sdk

Represents an action step within a workflow that executes after a trigger fires or after preceding actions complete. Actions expose run-after metadata through `RunAfterConfig` and can be referenced through the typed interfaces documented in [Typed Workflow Action Interfaces Definition](typed-workflow-action-interfaces-class-definition.md).

## Usage

```C#
var trigger = WorkflowTriggers.BuiltIn.CreateHttpTrigger();
var firstAction = WorkflowActions.BuiltIn.Compose(inputs: () => "Hello").WithName("Greet");
var secondAction = WorkflowActions.BuiltIn.Compose(inputs: () => "Logged").WithName("Audit");

trigger
    .Then(firstAction)
    .Then(secondAction);

// secondAction.RunAfterConfig contains the predecessor mapping for "Greet"
```

## Properties

|Name|Description|Type|Required|
|---|---|---|---|
|RunAfterConfig|Gets the mapping of predecessor action names to the required completion statuses for this action.|Dictionary&lt;string, FlowStatus[]&gt;|No|

## Methods

_This type implements `Then()` methods from [IChainableNode](i-chainable-node-class-definition.md). See that page for full documentation of all overloads._

## Related Content

- [AgentToolContext Class Definition](agent-tool-context-class-definition.md)
- [IChainableNode Interface Definition](i-chainable-node-class-definition.md)
- [IVariableWorkflowAction Interface Definition](i-variable-workflow-action-class-definition.md)
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
