---
title: WorkflowFactory class
titleSuffix: Azure Logic Apps
description: Primary entry point for creating stateful, stateless, and agent workflows from trigger-rooted operation graphs.
services: azure-logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 05/28/2026
---

# WorkflowFactory class

**Namespace**: Microsoft.Azure.Workflows.Sdk

[WorkflowFactory](workflow-factory-class-definition.md) is the primary entry point for defining and registering Azure Logic Apps workflows. It creates stateful, stateless, and agent workflows from trigger-rooted graphs built with [WorkflowTriggers](workflow-triggers-class-definition.md), [WorkflowActions](workflow-actions-class-definition.md), and [OperationChain](operation-chain-class-definition.md).

## Usage

```C#
// Stateful workflow
var trigger = WorkflowTriggers.BuiltIn.CreateHttpTrigger();
trigger.Then(WorkflowActions.BuiltIn.Compose(inputs: () => "Hello").WithName("Greet"));
var stateful = WorkflowFactory.CreateStatefulWorkflow("MyStatefulFlow", trigger);

// Stateless workflow
var timer = WorkflowTriggers.BuiltIn.CreateRecurrenceTrigger();
timer.Then(WorkflowActions.BuiltIn.Compose(inputs: () => "Tick").WithName("Process"));
var stateless = WorkflowFactory.CreateStatelessWorkflow("MyStatelessFlow", timer);

// Agent workflow
var agentTrigger = WorkflowTriggers.BuiltIn.CreateConversationalAgentTrigger();
agentTrigger.Then(WorkflowActions.BuiltIn.Agent(
    AgentModelType.OpenAI, "gpt-4", new AgentModelSettings(), "conn",
    messages: () => new[] { new AgentPromptMessage { Role = "system", Content = "Hello" } }));
var agent = WorkflowFactory.CreateAgentWorkflow("MyAgentFlow", agentTrigger);
```

## Methods

### CreateStatefulWorkflow(String, IWorkflowTrigger)

Creates a durable stateful workflow from an [IWorkflowTrigger](i-workflow-trigger-class-definition.md). This overload throws `InvalidOperationException` if the supplied trigger is a `ConversationalFlowTrigger`.

```C#
public static FlowDefinition CreateStatefulWorkflow(string flowName, IWorkflowTrigger trigger)
```

|Name|Description|Type|Required|
|---|---|---|---|
|flowName|The unique workflow name.|string|Yes|
|trigger|The trigger that starts the workflow graph.|[IWorkflowTrigger](i-workflow-trigger-class-definition.md)|Yes|

```C#
var trigger = WorkflowTriggers.BuiltIn.CreateHttpTrigger();
trigger.Then(WorkflowActions.BuiltIn.Compose(inputs: () => "Hello").WithName("Greet"));
var flow = WorkflowFactory.CreateStatefulWorkflow("MyStatefulFlow", trigger);
```

### CreateStatefulWorkflow(String, OperationChain)

Creates a durable stateful workflow from an [OperationChain](operation-chain-class-definition.md). This overload extracts the trigger from the chain start and throws `InvalidOperationException` if the chain does not start with an [IWorkflowTrigger](i-workflow-trigger-class-definition.md) or if that trigger is a `ConversationalFlowTrigger`.

```C#
public static FlowDefinition CreateStatefulWorkflow(string flowName, OperationChain chain)
```

|Name|Description|Type|Required|
|---|---|---|---|
|flowName|The unique workflow name.|string|Yes|
|chain|The operation chain whose start node must be a trigger.|[OperationChain](operation-chain-class-definition.md)|Yes|

```C#
var trigger = WorkflowTriggers.BuiltIn.CreateHttpTrigger();
var chain = trigger
    .Then(WorkflowActions.BuiltIn.Compose(inputs: () => "Step 1").WithName("Step1"))
    .Then(WorkflowActions.BuiltIn.Compose(inputs: () => "Step 2").WithName("Step2"));
var flow = WorkflowFactory.CreateStatefulWorkflow("MyStatefulFlow", chain);
```

### CreateStatelessWorkflow(String, IWorkflowTrigger)

Creates a lightweight stateless workflow from an [IWorkflowTrigger](i-workflow-trigger-class-definition.md). This overload throws `InvalidOperationException` if the supplied trigger is a `ConversationalFlowTrigger`.

```C#
public static FlowDefinition CreateStatelessWorkflow(string flowName, IWorkflowTrigger trigger)
```

|Name|Description|Type|Required|
|---|---|---|---|
|flowName|The unique workflow name.|string|Yes|
|trigger|The trigger that starts the workflow graph.|[IWorkflowTrigger](i-workflow-trigger-class-definition.md)|Yes|

```C#
var timer = WorkflowTriggers.BuiltIn.CreateRecurrenceTrigger();
timer.Then(WorkflowActions.BuiltIn.Compose(inputs: () => "Tick").WithName("Process"));
var flow = WorkflowFactory.CreateStatelessWorkflow("MyStatelessFlow", timer);
```

### CreateStatelessWorkflow(String, OperationChain)

Creates a lightweight stateless workflow from an [OperationChain](operation-chain-class-definition.md). This overload extracts the trigger from the chain start and throws `InvalidOperationException` if the chain does not start with an [IWorkflowTrigger](i-workflow-trigger-class-definition.md) or if that trigger is a `ConversationalFlowTrigger`.

```C#
public static FlowDefinition CreateStatelessWorkflow(string flowName, OperationChain chain)
```

|Name|Description|Type|Required|
|---|---|---|---|
|flowName|The unique workflow name.|string|Yes|
|chain|The operation chain whose start node must be a trigger.|[OperationChain](operation-chain-class-definition.md)|Yes|

```C#
var timer = WorkflowTriggers.BuiltIn.CreateRecurrenceTrigger();
var chain = timer.Then(WorkflowActions.BuiltIn.Compose(inputs: () => "Tick").WithName("Process"));
var flow = WorkflowFactory.CreateStatelessWorkflow("MyStatelessFlow", chain);
```

### CreateAgentWorkflow(String, ConversationalFlowTrigger)

Creates an agent workflow from a `ConversationalFlowTrigger`. Agent workflows require a conversational trigger and cannot be created from standard HTTP or recurrence triggers.

```C#
public static FlowDefinition CreateAgentWorkflow(string flowName, ConversationalFlowTrigger trigger)
```

|Name|Description|Type|Required|
|---|---|---|---|
|flowName|The unique workflow name.|string|Yes|
|trigger|The conversational trigger that starts the agent workflow.|ConversationalFlowTrigger|Yes|

```C#
var agentTrigger = WorkflowTriggers.BuiltIn.CreateConversationalAgentTrigger();
agentTrigger.Then(WorkflowActions.BuiltIn.Agent(
    AgentModelType.OpenAI,
    "gpt-4",
    new AgentModelSettings(),
    "conn",
    messages: () => new[] { new AgentPromptMessage { Role = "system", Content = "Hello" } }));
var flow = WorkflowFactory.CreateAgentWorkflow("MyAgentFlow", agentTrigger);
```

### CreateAgentWorkflow(String, OperationChain)

Creates an agent workflow from an [OperationChain](operation-chain-class-definition.md). This overload extracts the trigger from the chain start and requires that the start node be a `ConversationalFlowTrigger`.

```C#
public static FlowDefinition CreateAgentWorkflow(string flowName, OperationChain chain)
```

|Name|Description|Type|Required|
|---|---|---|---|
|flowName|The unique workflow name.|string|Yes|
|chain|The operation chain whose start node must be a conversational trigger.|[OperationChain](operation-chain-class-definition.md)|Yes|

```C#
var agentTrigger = WorkflowTriggers.BuiltIn.CreateConversationalAgentTrigger();
var chain = agentTrigger.Then(WorkflowActions.BuiltIn.Agent(
    AgentModelType.OpenAI,
    "gpt-4",
    new AgentModelSettings(),
    "conn",
    messages: () => new[] { new AgentPromptMessage { Role = "system", Content = "Hello" } }));
var flow = WorkflowFactory.CreateAgentWorkflow("MyAgentFlow", chain);
```

### ConfigureServices

Registers the Logic Apps SDK runtime services in an `IServiceCollection`, including the workflow initialization infrastructure and required runtime services.

```C#
public static void ConfigureServices(IServiceCollection services)
```

|Name|Description|Type|Required|
|---|---|---|---|
|services|The dependency injection service collection to configure.|IServiceCollection|Yes|

```C#
IServiceCollection services = new ServiceCollection();
WorkflowFactory.ConfigureServices(services);
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
- [WorkflowManagedActions Class Definition](workflow-managed-actions-class-definition.md)
- [WorkflowManagedTriggers Class Definition](workflow-managed-triggers-class-definition.md)
- [WorkflowProviderExtensions Class Definition](workflow-provider-extensions-class-definition.md)
- [WorkflowTriggerBase Class Definition](workflow-trigger-base-class-definition.md)
- [WorkflowTriggers Class Definition](workflow-triggers-class-definition.md)
- [WorkflowVariableActions Class Definition](workflow-variable-actions-class-definition.md)
