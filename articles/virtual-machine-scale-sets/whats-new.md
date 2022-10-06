---
title: "What's new for virtual machine scale sets" 
description: Learn about what's new for virtual machine scale sets in Azure.
author: cynthn
ms.service: virtual-machine-scale-sets
ms.topic: whats-new
ms.date: 10/06/2022
ms.author: cynthn
ms.custom: day0
---

# What's new for scale sets

This article describes what's new for virtual machines in Azure.


## Spot Priority Mix for Flexible scale sets

On October 12, 2022  [Spot Priority Mix](spot-priority-mix.md) was introduced for scale sets using Flexible orchestration.

Spot Priority Mix provides the flexibility of running a mix of regular on-demand VMs and Spot VMs for virtual machine scale set deployments. Easily balance between high-capacity availability and lower infrastructure costs according to your workload requirements.

Customize your deployment by setting a percentage distribution across Spot and regular VMs. The platform will automatically orchestrates each scale-out and scale-in operation to achieve the desired distribution by selecting an appropriate number of VMs to create or delete. You can also set the number of base regular uninterruptible VMs you would like to maintain in the virtual machine scale set during any scale operation.

- Reduce compute infrastructure costs by leveraging the deep discounts of Spot VMs while maintaining capacity availability through on-demand VMs
- Provide reassurance that all your VMs will not be taken away simultaneously due to evictions before the infrastructure has time to react and recover the evicted capacity
- Simplify the scale-out and scale-in of workloads that require both Spot and on-demand VMs by letting Azure orchestrate the creating and deleting VMs.

## Change

On <date> the <change> was introduced.

## Next steps

