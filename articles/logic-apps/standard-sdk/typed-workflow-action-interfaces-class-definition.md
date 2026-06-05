---
title: Typed workflow action interfaces
titleSuffix: Azure Logic Apps
description: Type-safe interfaces for workflow actions with strongly typed output contracts for body and structured output access.
services: azure-logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 05/28/2026
---

# Typed workflow action interfaces

**Namespace**: Microsoft.Azure.Workflows.Sdk

Provides type-safe interfaces for workflow actions with strongly typed output contracts for body and structured output access. These interfaces extend [IWorkflowAction](i-workflow-action-class-definition.md) so downstream actions can reference outputs through expression-friendly properties.

## Usage

```C#
// IBodyWorkflowAction<T> - used with HTTP actions
IBodyWorkflowAction<JToken> httpAction = WorkflowActions.BuiltIn.HttpAction(
    uri: () => new Uri("https://api.example.com/data"),
    method: () => HttpMethod.Get).WithName("FetchData");

var compose = WorkflowActions.BuiltIn.Compose(inputs: () => $"Result: {httpAction.Body}").WithName("Format");

// IOutputWorkflowAction<T> - used with Compose actions
IOutputWorkflowAction<JToken> composeAction = WorkflowActions.BuiltIn.Compose(
    inputs: () => "Hello, World!").WithName("Greeting");

var response = WorkflowActions.BuiltIn.Response(
    responseBody: () => $"{composeAction.Output}").WithName("Reply");
```

## IBodyWorkflowAction<T>

Represents a typed workflow action whose primary output is exposed through a strongly typed body property.

### Properties

|Name|Description|Type|Required|
|---|---|---|---|
|Body|Gets the strongly typed body output produced by the action.|T|No|

### Methods

_This type implements `Then()` methods from [IChainableNode](i-chainable-node-class-definition.md). See that page for full documentation of all overloads._

## IOutputWorkflowAction<T>

Represents a typed workflow action whose primary output is exposed as a strongly typed structured value.

### Properties

|Name|Description|Type|Required|
|---|---|---|---|
|Output|Gets the strongly typed structured output produced by the action.|T|No|

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
