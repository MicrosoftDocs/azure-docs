---
title: Compute Fleet allocation stratergies
description: Learn about how to configure Spot and Stabadred VM allocation stratergies.
author: rajeeshr
ms.author: rajeeshr
ms.topic: overview
ms.service: azure-compute-fleet
ms.custom:
  - ignite-2024
ms.date: 11/10/2024
ms.reviewer: jushiman
---

# Fleet allocation strategies 

## Standard Fleet allocation strategies 

### Lowest price (default): 
The Compute Fleet launches the lowest price pay-as-you-go VM from the list of VM types and sizes you specified. It attempts to fulfill the pay-as-you-go capacity, followed by the second and third lowest in price VMs until the desired capacity is fulfilled. 

### Prioritized: 
The Compute Fleet utilizes the priority you assign to each VM types and sizes, initiating VM sizes in descending order of priority. This approach prioritizes the highest-ranked VM types and sizes for launching first. Note that this strategy is not compatible with attribute-based VM selection.

## Spot Fleet allocation strategies 

### Price capacity optimized (recommended): 
The Compute Fleet launches qualifying VMs from your selected list of VM types and sizes to fullfil the target capacity. It prioritizes the highest available Spot capacity at the lowest price on Spot VMs in the region. Note that this strategy is not compatible with attribute-based VM selection.

If you select multiple VMs that happen to offer the ideal capacity to meet your target, then Compute Fleet prioritizes deploying VMs that offer the lowest price first. Followed by the second and third lowest price if sufficient capacity isn't available with the first lowest price VMs. Compute Fleet considers both price and capacity while configuring this strategy.

### Capacity optimized: 
The Compute Fleet launches VM types and sizes from your specified list of VMs that offer the highest available Spot capacity. This strategy prioritizes choosing VMs that fulfill your Spot target capacity over VMs with the lowest prices that don't have enough Spot capacity.

If you select multiple VMs that happen to offer the ideal capacity to meet your target, then Compute Fleet prioritizes deploying VMs that offer the highest capacity first. Followed by the second and third highest capacity if sufficient capacity isn't achieved. 

With this strategy, Compute Fleet doesn't prioritize pricing over capacity, so your costs may be higher.

### Lowest Price: 
The Compute Fleet launches VM types and sizes from your specified list of VMs that offer the lowest price for Spot VMs. Followed by the second and third lowest price until the desired capacity is fulfilled.

