---
title: Allocation strategies for Azure Compute Fleet
description: Learn about Compute Fleet allocation strategies for Spot and Standard virtual machines (VM).
author: rrajeesh
ms.author: rajeeshr
ms.topic: concept-article
ms.service: azure-compute-fleet
ms.custom:
  - ignite-2024
ms.date: 11/13/2024
ms.reviewer: jushiman
---

# Allocation strategies for Azure Compute Fleet 

> [!IMPORTANT]
> [Azure Compute Fleet](overview.md) is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 

When using a Compute Fleet for your workloads, you have several allocation strategies available to optimize costs, performance, or availability. These strategies determine how the fleet fulfills your capacity requirements by distributing the requested instances across different instance types and Availability Zones. 

This article outlines the various strategies available for your Compute Fleet depending on if you are deploying Standard virtual machines (VMs) or Spot VMs. 

## Standard VMs 

For Standard VMs, you have the following allocation strategies available for your Compute Fleet. 

### Lowest price (default)

The **lowest price** allocation strategy is the default strategy for Standard VMs. 

The Compute Fleet launches the lowest price pay-as-you-go VM from the list of VM types and sizes you specified. The fleet attempts to fulfill the pay-as-you-go capacity, followed by the second and third lowest in price VMs until the desired capacity is fulfilled. 

### Prioritized 

The Compute Fleet utilizes the priority you assign to each VM types and sizes, initiating VM sizes in descending order of priority. This approach prioritizes the highest-ranked VM types and sizes for launching first. This strategy is not compatible with attribute-based VM selection.

## Spot VMs

For Spot VMs, you have the following allocation strategies available for your Compute Fleet. 

### Price capacity optimized (recommended)

The **price capacity optimized** allocation strategy is the recommended strategy for Spot VMs.

The Compute Fleet launches qualifying VMs from your selected list of VM types and sizes to fullfil the target capacity. It prioritizes the highest available Spot capacity at the lowest price on Spot VMs in the region. This strategy is not compatible with attribute-based VM selection.

If you select multiple VMs that happen to offer the ideal capacity to meet your target, then Compute Fleet prioritizes deploying VMs that offer the lowest price first. Followed by the second and third lowest price if sufficient capacity isn't available with the first lowest price VMs. Compute Fleet considers both price and capacity while configuring this strategy.

### Capacity optimized 

The Compute Fleet launches VM types and sizes from your specified list of VMs that offer the highest available Spot capacity. This strategy prioritizes choosing VMs that fulfill your Spot target capacity over VMs with the lowest prices that don't have enough Spot capacity.

If you select multiple VMs that happen to offer the ideal capacity to meet your target, then Compute Fleet prioritizes deploying VMs that offer the highest capacity first. Followed by the second and third highest capacity if sufficient capacity isn't achieved. 

With this strategy, Compute Fleet doesn't prioritize pricing over capacity, so your costs may be higher.

### Lowest price (default) 

The **lowest price** allocation strategy is the default strategy for Spot VMs. 

The Compute Fleet launches VM types and sizes from your specified list of VMs that offer the lowest price for Spot VMs. Followed by the second and third lowest price until the desired capacity is fulfilled.

## Next steps

> [!div class="nextstepaction"]
> [Find answers to frequently asked questions.](faq.yml)
