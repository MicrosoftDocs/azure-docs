---
title: AgentToolContext class
titleSuffix: Azure Logic Apps
description: Provides access to agent tool parameters for expression conversion in AI agent workflows.
services: azure-logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 05/28/2026
---

# AgentToolContext class

**Namespace**: Microsoft.Azure.Workflows.Sdk

Documents the `IAgentToolContext<T>` interface and the `AgentToolContext<T>` class, which provide typed access to agent tool parameters during expression conversion in AI agent workflows.

## Usage

```C#
// AgentToolContext is used internally by the SDK when defining agent tools
// It provides typed access to tool parameters within expression lambdas

var agent = WorkflowActions.BuiltIn.Agent(
    agentModelType: AgentModelType.OpenAI,
    deploymentId: "gpt-4",
    agentModelSettings: new AgentModelSettings(),
    connectionName: "openai-connection",
    messages: () => new[] { new AgentPromptMessage { Role = "system", Content = "You are helpful" } });
```

## Interface: IAgentToolContext<T>

Represents a contract for exposing typed tool parameters in agent scenarios.

### Properties

|Name|Description|Type|Required|
|---|---|---|---|
|Parameters|Gets the parameters for the agent tool.|T|No|

## Class: AgentToolContext<T>

Provides the default implementation of `IAgentToolContext<T>`.

## Constructors

### AgentToolContext

Initializes a new `AgentToolContext<T>` instance with the supplied agent tool parameters.

```C#
AgentToolContext(T parameters)
```

|Name|Description|Type|Required|
|---|---|---|---|
|parameters|The parameters to configure the agent tool.|T|Yes|

```C#
var parameters = new { city = "Seattle" };
var context = new AgentToolContext<object>(parameters);
```

## Properties

|Name|Description|Type|Required|
|---|---|---|---|
|Parameters|Gets the parameters supplied to the constructor.|T|No|

## Related Content

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
- [WorkflowTriggerBase Class Definition](workflow-trigger-base-class-definition.md)
- [WorkflowTriggers Class Definition](workflow-triggers-class-definition.md)
- [WorkflowVariableActions Class Definition](workflow-variable-actions-class-definition.md)
