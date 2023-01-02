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

In Chaos Studio, every activity that happens as part of an experiment is called an **action** and the most common type of action is a **fault**. This article describes actions and faults and the properties of each.

## Experiment actions

An action is any activity that is orchestrated as part of a chaos experiment. Actions are organized into steps and branches, enabling actions to be run either sequentially or in parallel. Every action has the following properties:
* **Name**: The specific action that takes place. A name usually takes the form of a URN for the action, for example, `urn:
* **Type**: The way that the action executes. Actions can be either *continuous*, meaning that the action runs nonstop over a period of time (for example, applying CPU pressure for 10 minutes), or *discrete*, meaning that the action occurs only once (for example, rebooting a Redis Cache instance).

## Types of actions

There are two varieties of actions in Chaos Studio:
- **Faults** - This action causes a disruption in one or more resources.
- **Time delays** - This action "waits" without impacting any resources. It is useful for pausing in between faults to wait for a system to be impacted by the previous fault.

## Faults

Faults are the most common action in Chaos Studio. Faults cause a disruption in a system, allowing you to verify that the system effectively handles that disruption without impacting availability. Faults can be destructive (for example, killing a process), apply pressure (for example, adding virtual memory pressure), add latency, or cause a configuration change. In addition to a name and type, faults may also have a *duration*, if continuous, and *parameters*. Parameters describe how the fault should be applied and are specific to the fault name. For example, a parameter for the Azure Cosmos DB failover fault is the read region that will be promoted to the write region during the write region failure. Some parameters are required while others are optional.

Faults are either *agent-based* or *service-direct* depending on the target type. An agent-based fault requires the Chaos Studio agent to be installed on a virtual machine or virtual machine scale set. The agent is available for both Windows and Linux, but not all faults are available on both operating systems. See the [fault library](chaos-studio-fault-library.md) for information on which faults are supported on each operating system. Service-direct faults do not require any agent - they run directly against an Azure resource.

Faults also include the name of the selector that describes the resources that the fault will run against. You can learn more about selectors [in the article about chaos experiments](chaos-studio-chaos-experiments.md). A fault can only impact a resource if the resource has been onboarded as a target and has the corresponding fault capability enabled on the resource.

## Next steps
Now that you understand actions and faults you are ready to:
- [Create and run your first experiment](chaos-studio-tutorial-service-direct-portal.md)
