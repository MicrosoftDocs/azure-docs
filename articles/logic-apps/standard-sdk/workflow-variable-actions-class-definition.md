---
title: WorkflowVariableActions class
titleSuffix: Azure Logic Apps
description: Factory methods for creating variable actions such as initialize, set, increment, decrement, and append operations.
services: azure-logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 05/28/2026
---

# WorkflowVariableActions class

**Namespace**: Microsoft.Azure.Workflows.Sdk

Provides factory methods for creating variable manipulation actions in Logic Apps workflows. Access this class through [WorkflowBuiltInActions](workflow-built-in-actions-class-definition.md) by using `WorkflowActions.BuiltIn.Variables`.

## Usage

```C#
// Variable actions are accessed via WorkflowActions.BuiltIn.Variables
var trigger = WorkflowTriggers.BuiltIn.CreateHttpTrigger();

var init = WorkflowActions.BuiltIn.Variables.InitializeVariable<int>(
    name: () => "counter", value: () => 0).WithName("InitCounter");
var increment = WorkflowActions.BuiltIn.Variables.IncrementVariable<int>(
    name: () => "counter", value: () => 1).WithName("AddOne");

trigger.Then(init).Then(increment);
WorkflowFactory.CreateStatefulWorkflow("VariableExample", trigger);
```

## Methods

### InitializeVariable<T>(Expression<Func<string>> name, Expression<Func<T>> value)

Creates an [IVariableWorkflowAction](i-variable-workflow-action-class-definition.md) that declares a workflow variable with its initial value.

```C#
IVariableWorkflowAction InitializeVariable<T>(Expression<Func<string>> name, Expression<Func<T>> value)
```

|Name|Description|Type|Required|
|---|---|---|---|
|name|Expression for the variable name.|Expression&lt;Func&lt;string&gt;&gt;|Yes|
|value|Expression for the initial value.|Expression&lt;Func&lt;T&gt;&gt;|Yes|

```C#
var initVar = WorkflowActions.BuiltIn.Variables.InitializeVariable<string>(
    name: () => "greeting",
    value: () => "Hello").WithName("InitGreeting");
```

### SetVariable<T>(Expression<Func<string>> name, Expression<Func<T>> value)

Creates an [IVariableWorkflowAction](i-variable-workflow-action-class-definition.md) that assigns a new value to an existing workflow variable.

```C#
IVariableWorkflowAction SetVariable<T>(Expression<Func<string>> name, Expression<Func<T>> value)
```

|Name|Description|Type|Required|
|---|---|---|---|
|name|Expression for the variable name.|Expression&lt;Func&lt;string&gt;&gt;|Yes|
|value|Expression for the new value.|Expression&lt;Func&lt;T&gt;&gt;|Yes|

```C#
var setVar = WorkflowActions.BuiltIn.Variables.SetVariable<string>(
    name: () => "greeting",
    value: () => "Updated greeting").WithName("UpdateGreeting");
```

### IncrementVariable<T>(Expression<Func<string>> name, Expression<Func<T>> value)

Creates an [IVariableWorkflowAction](i-variable-workflow-action-class-definition.md) that increments a numeric variable.

```C#
IVariableWorkflowAction IncrementVariable<T>(Expression<Func<string>> name, Expression<Func<T>> value)
```

|Name|Description|Type|Required|
|---|---|---|---|
|name|Expression for the variable name.|Expression&lt;Func&lt;string&gt;&gt;|Yes|
|value|Expression for the increment value.|Expression&lt;Func&lt;T&gt;&gt;|Yes|

```C#
var increment = WorkflowActions.BuiltIn.Variables.IncrementVariable<int>(
    name: () => "counter",
    value: () => 1).WithName("IncrementCounter");
```

### DecrementVariable<T>(Expression<Func<string>> name, Expression<Func<T>> value)

Creates an [IVariableWorkflowAction](i-variable-workflow-action-class-definition.md) that decrements a numeric variable.

```C#
IVariableWorkflowAction DecrementVariable<T>(Expression<Func<string>> name, Expression<Func<T>> value)
```

|Name|Description|Type|Required|
|---|---|---|---|
|name|Expression for the variable name.|Expression&lt;Func&lt;string&gt;&gt;|Yes|
|value|Expression for the decrement value.|Expression&lt;Func&lt;T&gt;&gt;|Yes|

```C#
var decrement = WorkflowActions.BuiltIn.Variables.DecrementVariable<int>(
    name: () => "counter",
    value: () => 1).WithName("DecrementCounter");
```

### AppendToStringVariable

Creates an [IVariableWorkflowAction](i-variable-workflow-action-class-definition.md) that appends text to a string variable.

```C#
IVariableWorkflowAction AppendToStringVariable(Expression<Func<string>> name, Expression<Func<string>> value)
```

|Name|Description|Type|Required|
|---|---|---|---|
|name|Expression for the variable name.|Expression&lt;Func&lt;string&gt;&gt;|Yes|
|value|Expression for the string to append.|Expression&lt;Func&lt;string&gt;&gt;|Yes|

```C#
var append = WorkflowActions.BuiltIn.Variables.AppendToStringVariable(
    name: () => "log",
    value: () => " new entry").WithName("AppendLog");
```

### AppendToArrayVariable<T>(Expression<Func<string>> name, Expression<Func<T>> value)

Creates an [IVariableWorkflowAction](i-variable-workflow-action-class-definition.md) that appends a value to an array variable.

```C#
IVariableWorkflowAction AppendToArrayVariable<T>(Expression<Func<string>> name, Expression<Func<T>> value)
```

|Name|Description|Type|Required|
|---|---|---|---|
|name|Expression for the variable name.|Expression&lt;Func&lt;string&gt;&gt;|Yes|
|value|Expression for the value to append.|Expression&lt;Func&lt;T&gt;&gt;|Yes|

```C#
var appendArray = WorkflowActions.BuiltIn.Variables.AppendToArrayVariable<string>(
    name: () => "items",
    value: () => "new item").WithName("AddItem");
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
- [WorkflowProviderExtensions Class Definition](workflow-provider-extensions-class-definition.md)
- [WorkflowTriggerBase Class Definition](workflow-trigger-base-class-definition.md)
- [WorkflowTriggers Class Definition](workflow-triggers-class-definition.md)
