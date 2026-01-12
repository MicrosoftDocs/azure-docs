---
title: Choose a tool for moving Azure resources across regions
description: Review options and tools for moving Azure resources across regions.
author: RochakSingh-blr
ms.author: v-rochak2
ms.date: 07/31/2025
ms.service: azure-resource-mover
ms.topic: overview
ms.update-cycle: 180-days
ms.custom: mvc, engagement-fy23, UpdateFrequency.5
# Customer intent: As an Azure administrator, I want to compare the available tools for moving resources across regions, so that I can select the most suitable option for efficiently relocating my Azure resources based on their dependencies and requirements.
---

# Options to move Azure resources

In this article, you can explore Azure options to move resources across regions, subscriptions,  clouds, and availability zones, and learn when to use each option.

| Options | When to use| Learn more |
|----- | ---------- | ---------- |
| **Move from resource group overview** | Move resources to a different resource group/subscription, or across regions.<br/><br/> If you move across regions, in the resource group you select the resources you want to move, and then you move to the Resource Mover hub, to verify dependencies and move the resources to the target region. | [Move resources to another resource group/subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md).<br/><br/> [Move resources to another region from a resource group](move-region-within-resource-group.md). |
| **Move from the Resource Mover hub** | Move resources across regions. <br/><br/> You can move to a target region, or to a specific availability zone, or availability set, within the target region. | [Move resources across regions in the Resource Mover hub](). |
| **Move VMs with Site Recovery** | Use it for moving Azure VMs between government and public clouds.<br/><br/> Use if you want to move VMs between availability zones in the same region. |[Move resources between government/public clouds](../site-recovery/region-move-cross-geos.md), [Move resources to availability zones in the same region](../site-recovery/azure-to-azure-how-to-enable-zone-to-zone-disaster-recovery.md).|

## Next steps

[Learn more](about-move-process.md) about Resource Mover components, and the move process.
