---
title: Choose a tool for moving Azure resources across regions
description: Review options and tools for moving Azure resources across regions
author: rayne-wiselman
manager: evansma
ms.service: resource-move
ms.topic: overview
ms.date: 09/09/2020
ms.author: raynew
ms.custom: mvc
#Customer intent: As an Azure admin, I need to compare tools for moving resources in Azure.
---

# Choose a tool for moving Azure resources

You can move resources within Azure as follows:

- **Move resources across regions**: Move resource from within the Resource Mover hub, or within a resource group. 
- **Move resources across resource groups/subscriptions**: Move from within a resource group. 
- **Move resources between Azure clouds**: Use the Azure Site Recovery service to move resources between public and government clouds.
- **Move resources between availability zones in the same region**: Use the Azure Site Recovery service to move resources between availability zones in the same Azure region.


## Compare move tools

**Tool** | **When to use**
--- | --- 
**Move within resource group** | Move resources to a different resource group/subscription, or across regions.<br/><br/> If you move across regions, in the resource group you select the resources you want to move, and then you move to the Resource Mover hub, to verify dependencies and move the resources to the target region.
**Move from the Resource Mover hub** | Move resources across regions. <br/><br/> You can move to a target region, or to a specific availability zone, or availability set, within the target region.
**Move VMs with Site Recovery** | Use for moving Azure VMs between government and private clouds.<br/><br/> Use if you want to move VMs between availability zones in the same region.

## Next steps

[Learn more](about-move-process.md) about Resource Mover components, and the move process.
