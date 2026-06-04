---
title: Logic Apps Standard SDK Class Library
description: Complete reference for the Azure Logic Apps Workflow SDK classes and interfaces.
services: logic-apps
ms.service: azure-logic-apps
ms.suite: integration
author: wsilveiranz
ms.author: wsilveira
ms.reviewers: estfan, azla
ms.topic: reference
ms.date: 05/28/2026
---

# Logic Apps Standard SDK Class Library

The Azure Logic Apps Workflow SDK (`Microsoft.Azure.Workflows.Sdk`) provides fluent builder APIs for constructing Logic Apps workflow definitions programmatically in C#. This SDK enables developers to define workflows using a type-safe, IntelliSense-enabled approach instead of JSON authoring.

## Architecture Overview

The SDK uses a fluent builder pattern to compose workflows through method chaining:

- **Entry points**: [WorkflowFactory](workflow-factory-class-definition.md) for creating workflows, [WorkflowActions](workflow-actions-class-definition.md) and [WorkflowTriggers](workflow-triggers-class-definition.md) for accessing operations
- **Fluent chaining**: `Trigger → .Then(Action1) → .Then(Action2) → ...`
- **Dependency injection**: Support via [IWorkflowProvider](i-workflow-provider-class-definition.md) and [WorkflowProviderExtensions](workflow-provider-extensions-class-definition.md) for workflow registration

## Class Library Reference

### Workflow Composition & Chaining

Types that define how workflow operations are composed into execution graphs.

| Type | Description | Link |
|------|-------------|------|
| IChainableNode | Fluent chaining contract providing the `Then()` method pattern for composing operations | [IChainableNode](i-chainable-node-class-definition.md) |
| IWorkflowOperation | Named workflow operation with identity and downstream child connections | [IWorkflowOperation](i-workflow-operation-class-definition.md) |
| OperationChain | Directed chain tracking start and end nodes; supports `Join()` for fan-in patterns | [OperationChain](operation-chain-class-definition.md) |
| WorkflowFactory | Factory methods for creating stateful, stateless, and agent workflow definitions | [WorkflowFactory](workflow-factory-class-definition.md) |

### Action Types

Types for defining workflow actions that execute after triggers fire.

| Type | Description | Link |
|------|-------------|------|
| IWorkflowAction | Interface for action steps with run-after configuration | [IWorkflowAction](i-workflow-action-class-definition.md) |
| IVariableWorkflowAction | Extended action interface for variable operations | [IVariableWorkflowAction](i-variable-workflow-action-class-definition.md) |
| Typed Workflow Action Interfaces | Type-safe interfaces (`IBodyWorkflowAction<T>`, `IOutputWorkflowAction<T>`) for strongly typed output | [Typed Action Interfaces](typed-workflow-action-interfaces-class-definition.md) |
| WorkflowActionBase | Abstract base class providing common action functionality | [WorkflowActionBase](workflow-action-base-class-definition.md) |
| WorkflowBuiltInActions | Factory for built-in actions: HTTP, Compose, Response, CustomCode, NestedWorkflow, Agent | [WorkflowBuiltInActions](workflow-built-in-actions-class-definition.md) |
| WorkflowControlActions | Factory for control flow: Scope, Condition, ForEach, Until, Switch, Terminate | [WorkflowControlActions](workflow-control-actions-class-definition.md) |
| WorkflowVariableActions | Factory for variable operations: Initialize, Set, Increment, Decrement, Append | [WorkflowVariableActions](workflow-variable-actions-class-definition.md) |
| WorkflowManagedActions | Extensible managed connector actions (auto-generated from connector definitions) | [WorkflowManagedActions](workflow-managed-actions-class-definition.md) |

### Trigger Types

Types for defining workflow triggers that initiate execution.

| Type | Description | Link |
|------|-------------|------|
| IWorkflowTrigger | Interface for the root trigger that initiates workflow execution | [IWorkflowTrigger](i-workflow-trigger-class-definition.md) |
| Typed Workflow Trigger Interfaces | Type-safe interfaces (`IOutputWorkflowTrigger<T>`, `IBodyWorkflowTrigger<T>`) for strongly typed output | [Typed Trigger Interfaces](typed-workflow-trigger-interfaces-class-definition.md) |
| WorkflowTriggerBase | Abstract base class providing common trigger functionality | [WorkflowTriggerBase](workflow-trigger-base-class-definition.md) |
| WorkflowBuiltInTriggers | Factory for built-in triggers: HTTP Request, Recurrence, Conversational Agent | [WorkflowBuiltInTriggers](workflow-built-in-triggers-class-definition.md) |
| WorkflowManagedTriggers | Extensible managed connector triggers (auto-generated from connector definitions) | [WorkflowManagedTriggers](workflow-managed-triggers-class-definition.md) |

### Entry Points & Registration

Static entry points and dependency injection helpers.

| Type | Description | Link |
|------|-------------|------|
| WorkflowActions | Static entry point providing access to `BuiltIn` and `Managed` action factories | [WorkflowActions](workflow-actions-class-definition.md) |
| WorkflowTriggers | Static entry point providing access to `BuiltIn` and `Managed` trigger factories | [WorkflowTriggers](workflow-triggers-class-definition.md) |
| IWorkflowProvider | Interface for providing workflow definitions for host registration | [IWorkflowProvider](i-workflow-provider-class-definition.md) |
| WorkflowProviderExtensions | DI extension methods: `AddWorkflowProvider<T>`, `AddWorkflowProviders(assembly)` | [WorkflowProviderExtensions](workflow-provider-extensions-class-definition.md) |

### Runtime & Context

Types used during workflow execution.

| Type | Description | Link |
|------|-------------|------|
| WorkflowContext | Abstract context providing runtime access to action and trigger results | [WorkflowContext](workflow-context-class-definition.md) |
| AgentToolContext | Interface and class providing typed parameter access for AI agent tools | [AgentToolContext](agent-tool-context-class-definition.md) |

## Getting Started

To use the Logic Apps Standard SDK in your application:

1. **Reference the SDK**: Add the `Microsoft.Azure.Workflows.Sdk` NuGet package to your project
2. **Implement IWorkflowProvider**: Create workflow definitions by implementing the [IWorkflowProvider](i-workflow-provider-class-definition.md) interface
3. **Use WorkflowFactory**: Create workflow definitions using [WorkflowFactory](workflow-factory-class-definition.md) methods for stateful, stateless, or agent workflows
4. **Access Actions and Triggers**: Use [WorkflowActions](workflow-actions-class-definition.md) and [WorkflowTriggers](workflow-triggers-class-definition.md) as entry points to available operations
5. **Build with Fluent Chaining**: Compose workflows using the fluent API: `trigger.Then(action1).Then(action2)`

The SDK supports three workflow types: **Stateful** (maintains state between runs), **Stateless** (runs without maintaining state), and **Agent** (AI-powered workflows with conversational capabilities).
