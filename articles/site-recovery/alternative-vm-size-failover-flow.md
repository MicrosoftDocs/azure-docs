---
title: Alternative Virtual machine size recommendation in Azure Site Recovery failover flow
description: Summarizes guidance for alternative virtual machine size recommendation in Azure Site Recovery failover flow.
services: site-recovery
author: Jeronika-MS
ms.service: azure-site-recovery
ms.topic: concept-article
ms.date: 09/11/2025
ms.author: v-gajeronika
---

# Alternative virtual machine size recommendation in Azure Site Recovery failover flow 

Azure Site Recovery now provides alternative virtual machine (VM) size guidance to help you improve the chances of successful VM allocation in your target location during disaster recovery events or drills. This helps you assess the VM capacity and increase the chances of VM allocation during failover process by providing you with alternative VM size recommendations in your target location, in case current configured target VM size has less likelihood of allocation success. 

## How alternative VM size capacity guidance works 

:::image type="content" source="./media/alternative-vm-size-failover-flow/failover-recommendations-inline.png" alt-text="Diagram that shows the failover-recommendations screen." lightbox="./media/alternative-vm-size-failover-flow/failover-recommendations-expanded.png":::
*Select any one of the alternatives as per your preference, and then select **Save**. You can then proceed with the failover or test failover.*

- **Capacity validation**: When you reach failover or test failover screen in the Azure Site Recovery portal experience, Azure Site Recovery checks whether target location has sufficient capacity for configured VM size. 

- **Alternative recommendations**: If the chances of success are low, Azure Site Recovery determines if there are alternative VM size recommendations that can be suggested to you that can increase your chances of allocation in the target location. 

- **Selection and proceeding**: You can choose to select an alternative recommendation and proceed with failover or test failover. 

- **Pricing information**: Prices for recommended VM sizes are shown and may vary. We recommend you to verify the price from the Azure price page.  

>[!NOTE]
>- If you select a recommendation, that VM size is used for all further failovers and test failovers. You can choose to change the target VM size by navigating to the Compute section of Azure Site Recovery protected item. 
> :::image type="content" source="./media/alternative-vm-size-failover-flow/replicated-items.png" alt-text="Diagram that shows the replicated items screen.":::
> - Sometimes, the capacity issues might be temporary and retrying the failover after a short period can resolve the problem. This is because enough resources may have been freed in the cluster, region, or zone to accommodate your request. 

## Limitations 

Recommendations aren't provided: 

- If there is target Availability Sets, target Virtual Machine Scale Set (VMSS), or target Proximity Placement Groups (PPG) configured. 
- In case there's on-demand capacity reservation configured for target. 
- When failover is triggered via Recovery plans.  
- For VMware-to-Azure Site Recovery, Hyper-V-to-Azure Site Recovery. 

>[!NOTE]
>Only Azure-to-Azure scenario is currently supported. 

## Best Practices 

- For critical workloads, consider using On-Demand capacity reservations to guarantee VM availability during failover. You can also [combine it with Reserved Instances to reduce the cost](https://techcommunity.microsoft.com/blog/azuregovernanceandmanagementblog/ensure-failover-capacity-at-optimal-cost-with-azure-site-recovery/4337357).
- Monitor failover health using ASR validator and take necessary actions in case failover health isn't Green. 
