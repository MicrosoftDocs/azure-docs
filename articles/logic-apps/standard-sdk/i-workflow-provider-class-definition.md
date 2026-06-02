---
title: IWorkflowProvider Interface Definition
description: Provides workflow definitions for registration with the workflow host via dependency injection.
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 05/28/2026
---

# IWorkflowProvider Interface Definition

**Namespace**: Microsoft.Azure.Workflows.Sdk

Provides workflow definitions for registration with the workflow host via dependency injection. Implement this interface to return one or more workflow definitions that can be discovered and registered by [WorkflowProviderExtensions](workflow-provider-extensions-class-definition.md).

## Usage

```C#
public class MyWorkflowProvider : IWorkflowProvider
{
    public FlowDefinition[] GetWorkflows()
    {
        var trigger = WorkflowTriggers.BuiltIn.CreateHttpTrigger();
        trigger.Then(WorkflowActions.BuiltIn.Response().WithName("Reply"));
        
        return new[]
        {
            WorkflowFactory.CreateStatefulWorkflow("MyWorkflow", trigger)
        };
    }
}
```

## Methods

### GetWorkflows

Returns the workflow definitions exposed by the provider for registration with the workflow host.

```C#
FlowDefinition[] GetWorkflows()
```

|Name|Description|Type|Required|
|---|---|---|---|
|None|This method does not accept parameters.|—|No|

```C#
public class MyWorkflowProvider : IWorkflowProvider
{
    public FlowDefinition[] GetWorkflows()
    {
        var trigger = WorkflowTriggers.BuiltIn.CreateHttpTrigger();
        trigger.Then(WorkflowActions.BuiltIn.Response().WithName("Reply"));
        
        return new[]
        {
            WorkflowFactory.CreateStatefulWorkflow("MyWorkflow", trigger)
        };
    }
}
```

## Related Content

- [AgentToolContext Class Definition](agent-tool-context-class-definition.md)
- [IChainableNode Interface Definition](i-chainable-node-class-definition.md)
- [IVariableWorkflowAction Interface Definition](i-variable-workflow-action-class-definition.md)
- [IWorkflowAction Interface Definition](i-workflow-action-class-definition.md)
- [IWorkflowOperation Interface Definition](i-workflow-operation-class-definition.md)
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
