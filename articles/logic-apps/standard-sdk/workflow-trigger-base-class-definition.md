---
title: WorkflowTriggerBase Class Definition
description: Base implementation for workflow trigger nodes with fluent chaining, generated names, and child action tracking.
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 05/28/2026
---

# WorkflowTriggerBase Class Definition

**Namespace**: Microsoft.Azure.Workflows.Sdk

[WorkflowTriggerBase](workflow-trigger-base-class-definition.md) is the abstract base implementation for [IWorkflowTrigger](i-workflow-trigger-class-definition.md) nodes. It provides trigger naming and fluent chaining support for concrete trigger types while enforcing the rule that run-after conditions cannot be applied to the first action after a trigger.

## Usage

```C#
// WorkflowTriggerBase is abstract; use concrete triggers via WorkflowTriggers.BuiltIn
var trigger = WorkflowTriggers.BuiltIn.CreateHttpTrigger();

// Chain actions after the trigger
trigger.Then(WorkflowActions.BuiltIn.Compose(inputs: () => "Hello").WithName("Greet"));

// Access inherited properties
string name = trigger.Name;
var children = trigger.Children; // contains "Greet"
```

## Properties

|Name|Description|Type|Required|
|---|---|---|---|
|Name|Gets or sets the unique trigger name used in the generated workflow definition.|string|No|
|Children|Gets the child actions configured to run after the trigger fires.|List<[IWorkflowAction](i-workflow-action-class-definition.md)>|No|

## Methods

### Then

_This type implements `Then()` methods from [IChainableNode](i-chainable-node-class-definition.md). See that page for full documentation of all overloads. Note: On triggers, the `Then(action, FlowStatus[])` and `Then(action, RunAfter[])` overloads throw `InvalidOperationException` because run-after conditions cannot be specified on the first action after a trigger._

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
- [WorkflowControlActions Class Definition](workflow-control-actions-class-definition.md)
- [WorkflowFactory Class Definition](workflow-factory-class-definition.md)
- [WorkflowManagedActions Class Definition](workflow-managed-actions-class-definition.md)
- [WorkflowManagedTriggers Class Definition](workflow-managed-triggers-class-definition.md)
- [WorkflowProviderExtensions Class Definition](workflow-provider-extensions-class-definition.md)
- [WorkflowTriggers Class Definition](workflow-triggers-class-definition.md)
- [WorkflowVariableActions Class Definition](workflow-variable-actions-class-definition.md)
