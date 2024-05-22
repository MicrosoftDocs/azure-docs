---
title: Upgrade policies for Virtual Machine Scale Sets
description: Learn about the different upgrade policies available for Virtual Machine Scale Sets
author: mimckitt
ms.author: mimckitt
ms.topic: overview
ms.service: virtual-machine-scale-sets
ms.date: 03/07/2024
ms.reviewer: ju-shim
ms.custom: upgradepolicy
---
# Upgrade policies for Virtual Machine Scale Sets

The upgrade policy of a Virtual Machine Scale Set determines how virtual machines can be brought up-to-date with the latest scale set model. 

## Upgrade policy modes

The upgrade policies available for Virtual Machine Scale Sets are  **Automatic**, **Manual**, and **Rolling**. The upgrade policy you choose can impact the overall service uptime of your Virtual Machine Scale Set. 

Additionally, there can be situations where you might want specific instances in your scale set to be treated differently from the rest. For example, certain instances in the scale set could be needed to perform different tasks than the other members of the scale set. In these situations, [Instance Protection](virtual-machine-scale-sets-instance-protection.md) provides the controls needed to protect these instances from being upgraded along side the other instances in when an upgrade occurs. 

### Automatic upgrade policy

> [!NOTE]
> Automatic upgrade policy is only available for Virtual Machine Scale Sets with Uniform Orchestration. 

With an automatic upgrade policy, the scale set makes no guarantees about the order of virtual machines being brought down. The scale set might take down all virtual machines at the same time to perform upgrades. 

Automatic upgrade policy is best suited for DevTest scenarios where you aren't concerned about the uptime of your instances while making changes to configurations and settings. 

If your scale set is part of a Service Fabric cluster, *Automatic* mode is the only available mode. For more information, see [Service Fabric application upgrades](../service-fabric/service-fabric-application-upgrade.md).

### Manual upgrade policy
> [!NOTE]
> Manual upgrade policy is available for both Virtual Machine Scale Sets with Uniform Orchestration and Virtual Machine Scale Sets with Flexible Orchestration. 
>
>**Manual upgrade policy for Virtual Machine Scale Sets with Flexible Orchestration is currently in preview**. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of these features may change prior to general availability (GA). 

With a manual upgrade policy, you choose when to update the scale set instances. Nothing happens automatically to the existing virtual machines when changes occur to the scale set model. New instances added to the scale set use the most update-to-date model available. 

Manual upgrade policy is best suited for workloads where you require more control over when and how instances are updated.  

### Rolling upgrade policy
> [!NOTE]
> Rolling upgrade policy is only available for Virtual Machine Scale Sets with Uniform Orchestration. 

With a rolling upgrade policy, the scale set performs updates in batches. You also get more control over the upgrades with settings like batch size, max healthy percentage, prioritizing unhealthy instances and enabling upgrades across availability zones. 

Rolling upgrade policy is best suited for production workloads that require a set number of instances always be available. Rolling upgrades is safest way to upgrade instances to the latest model without compromising availability and uptime. 

When using a rolling upgrade policy, the scale set must also have a [health probe](../load-balancer/load-balancer-custom-probe-overview.md) or use the [Application Health Extension](virtual-machine-scale-sets-health-extension.md) to monitor application health.

For more information, see [configure rolling upgrade policy](virtual-machine-scale-sets-configure-rolling-upgrades.md),

## What triggers an upgrade

The changes made to a scale set may impact the availability of the instances. Any changes that impact the Virtual Machine Scale Set model can trigger an upgrade and those upgrades are applied to the instances within the scale set based on the upgrade policy you're using. The exception to this would be if you enable [Instance Protection](virtual-machine-scale-sets-instance-protection.md) on specific instances. 

Some upgrades require a virtual machine restart while others can be completed without disrupting scale set instances. Updates that require restarting, reimaging or redeploying the virtual machine instance include: 

- Password or SSH keys updates
- Custom Data changes
- Minor OS upgrades
- Virtual machine size changes
- Adding Availability Zones
- Fault Domain changes
- Proximity Placement Group changes

> [!NOTE]
> While Password and Custom Data changes can be made without a restart, in order for the upgrades to be applied to the virtual machine instances, you must reimage the virtual machine. For more information, see [Reimage a virtual machine](virtual-machine-scale-sets-reimage-virtual-machine.md)

If you're using a rolling upgrade policy with MaxSurge, any changes to the scale set model result will trigger a rolling upgrade. MaxSurge is the suggested way of deploying all scale set upgrades to ensure your application remains available and healthy during the entire upgrade process. For more information on MaxSurge, see [configure rolling upgrade policy](virtual-machine-scale-sets-configure-rolling-upgrades.md).

## Next steps
Learn how to [set the upgrade policy](virtual-machine-scale-sets-set-upgrade-policy.md) of your Virtual Machine Scale Set.
