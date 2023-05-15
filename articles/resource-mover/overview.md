---
title: What is Azure Resource Mover?
description: Learn about Azure Resource Mover
author: ankitaduttaMSFT
manager: evansma
ms.service: resource-mover
ms.topic: overview
ms.date: 02/02/2023
ms.author: ankitadutta
ms.custom: mvc, engagement-fy23, UpdateFrequency.5

#Customer intent: As an Azure admin, I need a simple way to move Azure resources, and want to understand how Azure Resource Mover can help me do that.

---

# What is Azure Resource Mover?

This article provides an overview of the Azure Resource Mover service. Resource Mover helps you to move Azure resources between Azure regions.

You might move resources to different Azure regions to:

- **Align to a region launch**: Move resources to a newly introduced Azure region that wasn't previously available.
- **Align for services/features**: Move resources to take advantage of the services or features that are available in a specific region.
- **Respond to business developments**: Move resources to a region in response to business changes, such as mergers or acquisitions.
- **Align for proximity**: Move resources to a region local to your business.
- **Meet data requirements**: Move resources to align with data residency requirements, or data classification needs.
- **Respond to deployment requirements**: Move resources that were deployed in error or move in response to capacity needs.
- **Respond to decommissioning**: Move resources because a region is decommissioned.


## Why use Resource Mover?

Resource Mover provides:

- A single hub for moving resources across regions.
- Reduced move time and complexity. Everything you need is in a single location.
- A simple and consistent experience for moving different types of Azure resources.
- An easy way to identify dependencies across resources you want to move. This feature helps you to move related resources together so that everything works as expected in the target region after the move.
- Automatic cleanup of resources in the source region, if you want to delete them after the move.
- Testing. You can try out a move and then discard it if you don't want to do a full move.

## Move across regions

To move resources across regions, you select the resources that you want to move. Resource Mover validates those resources and resolves any dependencies they have on other resources. If there are dependencies, you have a couple of options:
- Move the dependent resources to the target region.
- Don't move the dependent resources but use equivalent resources in the target region instead.

After all dependencies are resolved, Resource Mover walks you through a simple move process.

1. You kick off an initial move.
2. After the initial move, you can decide whether to commit and complete the move or discard the move.
3. After the move is done you can decide whether you want to delete the resources in the source location.

You can move resources across regions in the Resource Mover hub or from within a resource group. [Learn more](select-move-tool.md)

## What resources can I move across regions?

Using Resource Mover, you can currently move the following resources across regions:

- Azure VMs and associated disks (Azure Spot VMs are not currently supported)
- Encrypted Azure VMs and associated disks. This includes VMs with Azure disk encryption enabled and Azure VMs using default server-side encryption (both with platform-managed keys and customer-managed keys)
- NICs
- Availability sets 
- Azure virtual networks 
- Public IP addresses (Public IP will not be retained across regions)
- Network security groups (NSGs)
- Internal and public load balancers 
- Azure SQL databases and elastic pools


## Next steps

[Learn more](about-move-process.md) about Resource Mover components, and the move process.
