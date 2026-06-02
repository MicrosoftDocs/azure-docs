---
title: Typed Workflow Trigger Interfaces Definition
description: Type-safe interfaces for workflow triggers with strongly-typed output contracts for body and structured output access.
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 05/28/2026
---

# Typed Workflow Trigger Interfaces Definition

**Namespace**: Microsoft.Azure.Workflows.Sdk

Provides type-safe interfaces for workflow triggers with strongly-typed output contracts for body and structured output access. These interfaces extend [IWorkflowTrigger](i-workflow-trigger-class-definition.md) so downstream actions can reference trigger payloads and structured outputs through expression-friendly properties.

## Usage

```C#
// IOutputWorkflowTrigger<T> - HTTP trigger with typed output
IOutputWorkflowTrigger<HttpRequestTriggerOutput> trigger = WorkflowTriggers.BuiltIn.CreateHttpTrigger();
var compose = WorkflowActions.BuiltIn.Compose(
    inputs: () => $"Received: {trigger.TriggerOutput.Body}").WithName("LogInput");
trigger.Then(compose);
```

## IOutputWorkflowTrigger<T>

Represents a typed workflow trigger whose structured output is available through a strongly-typed property.

### Properties

|Name|Description|Type|Required|
|---|---|---|---|
|TriggerOutput|Gets the strongly-typed output produced by the trigger.|T|No|

### Methods

_This type implements `Then()` methods from [IChainableNode](i-chainable-node-class-definition.md). See that page for full documentation of all overloads._

## IBodyWorkflowTrigger<T>

Represents a typed workflow trigger whose body payload is available through a strongly-typed property.

### Properties

|Name|Description|Type|Required|
|---|---|---|---|
|TriggerBody|Gets the strongly-typed body payload produced by the trigger.|T|No|

### Methods

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
