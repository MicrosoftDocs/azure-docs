---
title: Alternative Virtual machine size recommendation in Azure Site Recovery failover flow
description: Summarizes guidance for alternative virtual machine size recommendation in Azure Site Recovery failover flow.
services: site-recovery
author: jyothisuri
ms.service: azure-site-recovery
ms.topic: concept-article
ms.date: 09/08/2025
ms.author: jsuri
---

# Alternative virtual machine size recommendation in Azure Site Recovery failover flow 

Azure Site Recovery now provides alternative virtual machine (VM) size guidance to help you improve the chances of successful VM allocation in your target location during disaster recovery events or drills. This helps you assess the VM capacity and increase the chances of VM allocation during failover process by providing you with alternative VM size recommendations in your target location, in case current configured target VM size has less likelihood of allocation success. 

## Why this guidance matters 

We continually invest in additional infrastructure and features to make sure that we always have all VM types available to support customer demand. However, you might occasionally experience resource allocation failures because of unprecedented growth in demand for Azure services in specific regions.  Failover failures may happen in such cases and disrupt your business continuity. The new guidance feature helps you reduce this risk by validating if there is sufficient capacity for requested VM size and recommending alternative VM sizes. 

## How alternative VM size capacity guidance works 

You can select any one of the alternative based on your recommendation, and then select **Save**. You can then proceed with the failover or test failover. 

- **Capacity validation**: When you reach failover or test failover screen in the Azure Site Recovery portal experience, Azure Site Recovery checks whether target location has sufficient capacity for configured VM size. 

- **Alternative recommendations**: If the chances of success are low, Azure Site Recovery determines if there are alternative VM size recommendations that can be suggested to you that can increase your chances of allocation in the target location. 

- **Selection and proceeding**: You can choose to select an alternative recommendation and proceed with failover or test failover. 

- **Pricing information**: Prices for recommended VM sizes are shown and may vary. It is always recommended to verify the price from the Azure price page.  

>[!NOTE]
>- If you select a recommendation, that VM size will be used for all further failovers and test failovers. You can choose to change the target VM size by going to the Compute section of Azure Site Recovery protected item. 
> - Sometimes, the capacity issues might be temporary and retrying the failover after a short period can resolve the problem. This is because enough resources may have been freed in the cluster, region, or zone to accommodate your request. 

## Limitations 

Recommendations aren't provided: 

- If there are target Availability Sets, target Virtual Machine Scale Set (VMSS), or target Proximity Placement Groups (PPG) configured. 
- In case there is on-demand capacity reservation configured for target. 
- When failover is triggered via Recovery plans.  
- For VMWare-to-Azure Site Recovery, HyperV-to-Azure Site Recovery. 

>[!NOTE]
>Only Azure-to-Azure scenario is currently supported. 

## Best Practices 

- For critical workloads, consider using On-Demand capacity reservations to guarantee VM availability during failover. You can also [combine it with Reserved Instances to reduce the cost](https://techcommunity.microsoft.com/blog/azuregovernanceandmanagementblog/ensure-failover-capacity-at-optimal-cost-with-azure-site-recovery/4337357).
- Monitor failover health using ASR validator and take necessary actions in case failover health is not green. 
