---
title: WorkflowActions Class Definition
description: Top-level entry point for creating workflow actions through built-in and managed connector factories.
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 05/28/2026
---

# WorkflowActions Class Definition

**Namespace**: Microsoft.Azure.Workflows.Sdk

[WorkflowActions](workflow-actions-class-definition.md) is the top-level entry point for creating workflow actions. It exposes factory instances for built-in actions and managed connector actions used when defining Azure Logic Apps workflows in code.

## Usage

```C#
// Access built-in actions
var builtIn = WorkflowActions.BuiltIn;
var compose = builtIn.Compose(inputs: () => "Hello").WithName("Greet");
var http = builtIn.HttpAction(
    uri: () => new Uri("https://api.example.com"),
    method: () => HttpMethod.Get).WithName("CallAPI");

// Access the managed connector action factory
var managed = WorkflowActions.Managed;
```

## Fields

|Name|Description|Type|Required|
|---|---|---|---|
|BuiltIn|Provides the factory for built-in workflow actions such as Compose, HTTP, Response, and custom code actions.|[WorkflowBuiltInActions](workflow-built-in-actions-class-definition.md)|No|
|Managed|Provides the factory for managed connector actions.|[WorkflowManagedActions](workflow-managed-actions-class-definition.md)|No|

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
