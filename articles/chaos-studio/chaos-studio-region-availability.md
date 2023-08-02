---
title: Regional availability of Azure Chaos Studio Preview
description: Understand how Azure Chaos Studio Preview makes chaos experiments and chaos targets available in Azure regions.
author: prasha-microsoft 
ms.author: prashabora
ms.service: chaos-studio
ms.topic: conceptual
ms.date: 4/29/2022
ms.custom: template-concept
---

# Regional availability of Azure Chaos Studio Preview

This article describes the regional availability model for Azure Chaos Studio Preview. It explains the difference between a region where experiments can be deployed and one where resources can be targeted. It also provides an overview of the Chaos Studio high-availability model.

Chaos Studio is a regional Azure service, which means that the service is deployed and run within an Azure region. Chaos Studio has two regional components: the region where an experiment is deployed and the region where a resource is targeted.

A chaos experiment can target a resource in a different region than the experiment. This process is called cross-region targeting. To enable chaos experimentation on targets in more regions, Chaos Studio has a set of regions in which you can do *resource targeting*. This set is a superset of the regions in which you can create and manage *experiments*.

To view the list of regions where Chaos Studio and resource targeting are available, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=chaos-studio).

## Regional availability of chaos experiments
A [chaos experiment](chaos-studio-chaos-experiments.md) is an Azure resource that describes the faults that should be run and the resources those faults should be run against. An experiment is deployed to a single region. The following information and operations stay in that region:

* **Experiment definition**. The definition includes the hierarchy of steps, branches, and actions, the faults and parameters defined, and the resource IDs of target resources. Open-ended properties in the experiment resource JSON including the step name, branch name, and any fault parameters are stored in region and treated as system metadata.
* **Experiment execution**. The execution includes each time an experiment is run or the activity that orchestrates the execution of steps, branches, and actions.
* **Experiment history**. The history includes details such as the step, branch, and action timestamps, status, IDs, and any error messages for each historical experiment run. This data is treated as system metadata.

Any experiment data stored in Chaos Studio is deleted when an experiment is deleted.

## Regional availability of chaos targets (resource targeting)
A [chaos target](chaos-studio-targets-capabilities.md) enables Chaos Studio to interact with an Azure resource. Faults in a chaos experiment run against a chaos target, but the target resource can be in a different region than the experiment. A resource can only be onboarded as a chaos target if Chaos Studio resource targeting is available in that region.

The list of regions where resource targeting is available is a superset of the regions where you can create experiments. A chaos target is deployed to the same region as the target resource. The following information and operations stay in that region:

* **Target definition**. The definition includes basic metadata about the target. Agent-based targets have one user-configurable property: the [identity that's used to connect the agent to the chaos agent service](chaos-studio-permissions-security.md#agent-authentication).
* **Capability definitions**. The definitions include basic metadata about the capabilities enabled on a target.
* **Action execution**. When an experiment runs a fault, the fault itself (for example, shutting down a VM) happens within the target region.

Any target or capability metadata is deleted when a target is deleted.

## High availability with Chaos Studio

Chaos Studio is a regional, zone-redundant service (in regions that support availability zones). If there's an availability zone outage, any chaos operation might fail, but experiment metadata, history, and details should remain available and the service shouldn't see a full outage.

## Next steps
Now that you understand the region availability model for Chaos Studio, you're ready to:
- [Review the availability of Chaos Studio per region](https://azure.microsoft.com/global-infrastructure/services/?products=chaos-studio)
- [Create and run your first experiment](chaos-studio-tutorial-service-direct-portal.md)
