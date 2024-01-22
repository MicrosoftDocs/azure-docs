---
title: Upgrade Policies for Virtual Machine Scale Sets
description: Learn about the different Upgrade Policies available for Virtual Machine Scale Sets
author: mimckitt
ms.author: mimckitt
ms.topic: overview
ms.service: virtual-machine-scale-sets
ms.date: 01/19/2024
ms.reviewer: ju-shim
ms.custom: upgradepolicy
---
# Upgrade Policies for Virtual Machine Scale Sets

> [!IMPORTANT]
> **Upgrade Policies for Virtual Machine Scale Sets using Flexible Orchestration mode are currently in preview**. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of these features may change prior to general availability (GA). 
>
>Upgrade Policies for Virtual Machine Scale Sets using Uniform Orchestration mode are generally available (GA). 

The Upgrade Policy of a Virtual Machine Scale Set determines how virtual machines are brought up-to-date with the latest scale set model. 

## Upgrade Policy modes

Each Virtual Machine Scale Set has an Upgrade Policy that determines how virtual machines are brought up-to-date with the latest scale set model. The Upgrade Policies available are  **Automatic**, **Manual**, and **Rolling**. The Upgrade Policy you choose can impact the overall service uptime of your Virtual Machine Scale Set. 

Additionally, there can be situations where you might want specific instances to be treated differently from the rest of the scale set instance. For example, certain instances in the scale set could be needed to perform different tasks than the other members of the scale set. In these situations, [Instance Protection](virtual-machine-scale-sets-instance-protection.md) provides the controls needed to protect these instances from being upgraded along side the other instances in a scale set. 

### Automatic Upgrade Policy
With an Automatic Upgrade Policy, the scale set makes no guarantees about the order of virtual machines being brought down. The scale set might take down all virtual machines at the same time when performing upgrades. 

Automatic Upgrade Policy is best suited for DevTest scenarios where you aren't concerned about the uptime of your instances while making changes to configurations and settings. 

If your scale set is part of a Service Fabric cluster, *Automatic* mode is the only available mode. For more information, see [Service Fabric application upgrades](../service-fabric/service-fabric-application-upgrade.md).

### Manual Upgrade Policy
With a Manual Upgrade Policy, you choose when to initiate an update to the scale set instances. Nothing happens automatically to the existing virtual machines when changes occur to the scale set model. New instances added to the scale set use the most update-to-date model available. 

Manual Upgrade Policy is best suited for workloads where the instances in the scale set are composed of different configurations and each configuration might require different updates and changes.

### Rolling Upgrade Policy

With a Rolling Upgrade Policy, the scale set performs updates in batches with an optional pause time in between. You can also configure upgrades to be completed across multiple availability zones at the same time. 

Rolling Upgrade Policy is best suited for Production workloads that require instances always be available to take traffic. Rolling Upgrades provides the safest way to upgrade instances to the latest model without compromising availability and uptime. 

When using a Rolling Upgrade Policy, the scale set must also have a [health probe](../load-balancer/load-balancer-custom-probe-overview.md) or use the [Application Health Extension](virtual-machine-scale-sets-health-extension.md) to monitor application health.

## What triggers an upgrade

Depending on the type of change you make to your scale set can impact the availability of the instances. Any changes that impact the Virtual Machine Scale Set model can trigger an upgrade and those upgrades are applied to the instances within the scale set based on the Upgrade Policy you're using. The exception to this would be if you enable [Instance Protection](virtual-machine-scale-sets-instance-protection.md) on specific instances. 

Some upgrades require a virtual machine restart while others can be complete without disrupting scale set instances. Updates that require restarting, reimaging or redeploying the virtual machine instance include: 

- Password or SSH keys updates
- Custom Data changes
- Major OS upgrades (this upgrade can only be achieved by using [MaxSurge](virtual-machine-scale-sets-configure-rolling-upgrades.md))
- Minor OS upgrades
- Virtual machine size changes
- Adding Availability Zones
- Fault Domain changes
- Proximity Placement Group changes

> [!NOTE]
> While Password and Custom Data changes can be made without a restart, in order for the upgrades to be applied to the virtual machine instances, you must reimage the virtual machine. For more information, see [Reimage a virtual machine](virtual-machine-scale-sets-reimage-virtual-machine.md)

Upgrades that do not require a restart or reimage and can be completed in place without disrupting the virtual machine instance include: 

- NIC updates
- Data Disk updates
- Extension upgrades
- Enabling boot diagnostics

If you're using Rolling Upgrade Policy with MaxSurge, any changes to the scale set model triggers a rolling upgrade and result in replacing the virtual machine. However, when using Rolling Upgrades with MaxSurge, the new instances are brought up to date with the latest scale set model before being added to the scale set to take traffic. This results in the capacity of your scale set remaining constant throughout the upgrade process. 

MaxSurge is the suggested way of deploying all scale set upgrades to ensure your application remains available and healthy during the entire upgrade process. For more information on MaxSurge, see [Configure Rolling Upgrades](virtual-machine-scale-sets-configure-rolling-upgrades.md)


## Next steps
Learn how to [set the Upgrade Policy](virtual-machine-scale-sets-set-upgrade-policy.md) of your Virtual Machine Scale Set.
