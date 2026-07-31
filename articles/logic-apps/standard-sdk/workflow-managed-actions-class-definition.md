---
title: WorkflowManagedActions class
titleSuffix: Azure Logic Apps
description: Extensible access point for managed connector actions that are generated from Azure connector definitions.
services: azure-logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 05/28/2026
---

# WorkflowManagedActions class

**Namespace**: Microsoft.Azure.Workflows.Sdk

Provides the extensible access point for managed API connector actions. Access this partial class through [WorkflowActions](workflow-actions-class-definition.md) by using `WorkflowActions.Managed`. Connector-specific methods are generated in separate partial definitions from Azure connector metadata.

## Usage

```C#
// Managed actions are accessed via WorkflowActions.Managed
// Connector methods are auto-generated and follow the pattern:
// WorkflowActions.Managed.<ConnectorName>("<connectionName>").<Operation>(...)

var sharepoint = WorkflowActions.Managed.Sharepointonline("sharepoint").GetItems(
    dataset: () => "https://example.sharepoint.com",
    table: () => "my-list-id").WithName("GetSharePointItems");
```

## Methods

This partial class does not declare public methods in its core source file. Managed connector action methods are added by generated partial class definitions and become available as instance methods through `WorkflowActions.Managed`.

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
- [WorkflowManagedTriggers Class Definition](workflow-managed-triggers-class-definition.md)
- [WorkflowProviderExtensions Class Definition](workflow-provider-extensions-class-definition.md)
- [WorkflowTriggerBase Class Definition](workflow-trigger-base-class-definition.md)
- [WorkflowTriggers Class Definition](workflow-triggers-class-definition.md)
- [WorkflowVariableActions Class Definition](workflow-variable-actions-class-definition.md)
