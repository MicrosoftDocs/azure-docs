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

Instance Flexibility is best suited for workloads that are flexible in compute requirements and can be run on various different sized VMs. 