---
title: WorkflowProviderExtensions class
titleSuffix: Azure Logic Apps
description: Extension methods for registering workflow providers with dependency injection service collections.
services: azure-logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 05/28/2026
---

# WorkflowProviderExtensions class

**Namespace**: Microsoft.Azure.Workflows.Sdk

[WorkflowProviderExtensions](workflow-provider-extensions-class-definition.md) contains extension methods for registering [IWorkflowProvider](i-workflow-provider-class-definition.md) implementations with dependency injection containers.

## Usage

```C#
// Register a single workflow provider
services.AddWorkflowProvider<MyWorkflowProvider>();

// Register all providers in an assembly
services.AddWorkflowProviders(typeof(MyWorkflowProvider).Assembly);
```

## Methods

### AddWorkflowProvider<T>(IServiceCollection services)

Registers a single [IWorkflowProvider](i-workflow-provider-class-definition.md) implementation as a singleton in the target `IServiceCollection`.

```C#
public static IServiceCollection AddWorkflowProvider<T>(this IServiceCollection services) where T : class, IWorkflowProvider
```

|Name|Description|Type|Required|
|---|---|---|---|
|services|The service collection to register with.|IServiceCollection|Yes|

```C#
services.AddWorkflowProvider<MyWorkflowProvider>();
```

### AddWorkflowProviders

Scans an `Assembly` for concrete [IWorkflowProvider](i-workflow-provider-class-definition.md) implementations and registers each one as a singleton in the target `IServiceCollection`.

```C#
public static IServiceCollection AddWorkflowProviders(this IServiceCollection services, Assembly assembly)
```

|Name|Description|Type|Required|
|---|---|---|---|
|services|The service collection to register with.|IServiceCollection|Yes|
|assembly|The assembly to scan for IWorkflowProvider implementations.|Assembly|Yes|

```C#
services.AddWorkflowProviders(typeof(MyWorkflowProvider).Assembly);
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
- [WorkflowContext Class Definition](workflow-context-class-definition.md)
- [WorkflowControlActions Class Definition](workflow-control-actions-class-definition.md)
- [WorkflowFactory Class Definition](workflow-factory-class-definition.md)
- [WorkflowManagedActions Class Definition](workflow-managed-actions-class-definition.md)
- [WorkflowManagedTriggers Class Definition](workflow-managed-triggers-class-definition.md)
- [WorkflowTriggerBase Class Definition](workflow-trigger-base-class-definition.md)
- [WorkflowTriggers Class Definition](workflow-triggers-class-definition.md)
- [WorkflowVariableActions Class Definition](workflow-variable-actions-class-definition.md)
