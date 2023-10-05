---
title: Faults and actions in Azure Chaos Studio
description: Understand what faults and actions are in Azure Chaos Studio. What is the difference between a fault and an action? How do you define a fault?
author: prasha-microsoft 
ms.author: prashabora
ms.service: chaos-studio
ms.topic: conceptual
ms.date: 11/01/2021
ms.custom: template-concept, ignite-fall-2021, ignite-2022
---

# Faults and actions in Azure Chaos Studio

In Azure Chaos Studio, every activity that happens as part of an experiment is called an *action*. The most common type of action is a *fault*. This article describes actions and faults and the properties of each.

## Experiment actions

An action is any activity that's orchestrated as part of a chaos experiment. Actions are organized into steps and branches, enabling actions to run either sequentially or in parallel. Every action has the following properties:

* **Name**: The specific action that takes place. A name usually takes the form of a URN for the action, for example, `urn`.
* **Type**: The way that the action executes. Actions can be either *continuous* or *discrete*. A continuous action runs nonstop over a period of time. An example is applying CPU pressure for 10 minutes. A discrete action occurs only once. An example is rebooting an Azure Cache for Redis instance.

## Types of actions

There are two varieties of actions in Chaos Studio:

- **Faults**: This action causes a disruption in one or more resources.
- **Time delays**: This action "waits" without affecting any resources. It's useful for pausing in between faults to wait for a system to be affected by the previous fault.

## Faults

Faults are the most common action in Chaos Studio. Faults cause a disruption in a system, allowing you to verify that the system effectively handles that disruption without affecting availability.

Faults can:

- Be destructive. For example, a fault can kill a process.
- Apply pressure. For example, a fault can add virtual memory pressure.
- Add latency.
- Cause a configuration change.

In addition to a name and type, faults might also have a *duration*, if continuous, and *parameters*. Parameters describe how the fault should be applied and are specific to the fault name. For example, a parameter for the Azure Cosmos DB failover fault is the read region that will be promoted to the write region during the write region failure. Some parameters are required while others are optional.

Faults are either *agent-based* or *service-direct* depending on the target type. An agent-based fault requires the Chaos Studio agent to be installed on a virtual machine or virtual machine scale set. The agent is available for both Windows and Linux, but not all faults are available on both operating systems. For information on which faults are supported on each operating system, see [Chaos Studio fault and action library](chaos-studio-fault-library.md). Service-direct faults don't require any agent. They run directly against an Azure resource.

Faults also include the name of the selector that describes the resources that the fault runs against. To learn more about selectors, see [Chaos experiments](chaos-studio-chaos-experiments.md). A fault can only affect a resource if the resource has been onboarded as a target and has the corresponding fault capability enabled on the resource.

## Next steps
Now that you understand actions and faults you're ready to:
- [Create and run your first experiment](chaos-studio-tutorial-service-direct-portal.md)
