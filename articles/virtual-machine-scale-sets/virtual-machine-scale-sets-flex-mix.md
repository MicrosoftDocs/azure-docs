---
title: Use Multiple VM Sizes with Flex Mix
description: Use multiple VM sizes in a scale set using VMSS Flex Mix. Optimize deployments using allocation strategies. 
author: brittanyrowe 
ms.author: brittanyrowe
ms.topic: conceptual
ms.service: virtual-machine-scale-sets
ms.date: 06/17/2024
ms.reviewer: jushiman
---

# Use Multiple VM Sizes with Instance Flexibility
> [!IMPORTANT]
> Instance Flexibility for Virtual Machine Scale Sets with Flexible Orchestration Mode is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 

Instance Flexibility enables you to specify multiple different VM sizes in your Virtual Machine Scale Set with Flexible Orchestration Mode, as well as an allocation strategy to further optimize your deployments. 

Instance Flexibility is best suited for workloads that are flexible in compute requirements and can be run on various different sized VMs. Using Instance Flexibility you can:
- Deploy a heterogeneous mix of VM sizes in a single scale set, up to the instance size limit. You can view max scale set instance counts in the [documentation](/articles/virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes.md#what-has-changed-with-flexible-orchestration-mode).
- Optimize your deployments for cost or capacity through allocation strategies.
- Continue to make use of scale set features, like [Spot Priority Mix](/articles/virtual-machine-scale-sets/spot-priority-mix.md), [Autoscale](/articles/virtual-machine-scale-sets/virtual-machine-scale-sets-autoscale-overview.md), or [Upgrade Policies](/articles/virtual-machine-scale-sets/virtual-machine-scale-sets-set-upgrade-policy.md).
- Spread a heterogeneous mix of VMs across Availability Zones and Fault Domains for high availability and reliability.



## Limitations
- Instance Flexibility is currently available in West US, West US2, West US3, East US, East US2, CentralUS, South Central US, North Central US, West Europe, North Europle, UK South, and France Central. More regions will be added during Public Preview.
-  Instance Flexibility is currently only available through ARM template and in the Azure portal.
- You must have quota for the VM sizes you're requesting with Instance Flexibility.
- You can specify **up to** five VM sizes with Instance Flexibility at this time.
- Existing scale sets cannot be updated to use Instance Flexibility. 
- VM sizes cannot be changed once the scale set is deployed.
