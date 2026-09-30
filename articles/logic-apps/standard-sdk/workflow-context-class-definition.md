---
title: WorkflowContext class
titleSuffix: Azure Logic Apps
description: Provides runtime access to action and trigger results during custom code execution within workflows.
services: azure-logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 05/28/2026
---

# WorkflowContext class

**Namespace**: Microsoft.Azure.Workflows.Sdk

[WorkflowContext](workflow-context-class-definition.md) is an abstract runtime context passed to custom code actions. It provides access to trigger results and previously executed action results while workflow code is running.

## Methods

### GetActionResults

Gets the WorkflowOperationResult for a named action that has already executed in the current workflow run.

```C#
public abstract Task<WorkflowOperationResult> GetActionResults(string actionName)
```

|Name|Description|Type|Required|
|---|---|---|---|
|actionName|The name of the action to retrieve results for.|string|Yes|

```C#
public async Task<string> RunAsync(WorkflowContext context)
{
    WorkflowOperationResult composeResult = await context.GetActionResults("ComposeStep");
    return "Processed";
}
```

### GetTriggerResults

Gets the WorkflowOperationResult for the trigger that started the current workflow run.

```C#
public abstract Task<WorkflowOperationResult> GetTriggerResults()
```

This method has no parameters.

```C#
public async Task<string> RunAsync(WorkflowContext context)
{
    WorkflowOperationResult triggerResult = await context.GetTriggerResults();
    return "Processed";
}
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
- [WorkflowControlActions Class Definition](workflow-control-actions-class-definition.md)
- [WorkflowFactory Class Definition](workflow-factory-class-definition.md)
- [WorkflowManagedActions Class Definition](workflow-managed-actions-class-definition.md)
- [WorkflowManagedTriggers Class Definition](workflow-managed-triggers-class-definition.md)
- [WorkflowProviderExtensions Class Definition](workflow-provider-extensions-class-definition.md)
- [WorkflowTriggerBase Class Definition](workflow-trigger-base-class-definition.md)
- [WorkflowTriggers Class Definition](workflow-triggers-class-definition.md)
- [WorkflowVariableActions Class Definition](workflow-variable-actions-class-definition.md)
