---
title: Move Azure resources to another region
description: Provides an overview of moving Azure resources across Azure regions. 
author: rayne-wiselman
ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 09/10/2020
ms.author: raynew
---

# Moving Azure resources across regions

This article provides information about moving Azure resources across Azure regions.

Azure geographies, regions, and availability zones form the foundation of the Azure global infrastructure. Azure [geographies](https://azure.microsoft.com/global-infrastructure/geographies/) typically contain two or more [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/). A region is an area within a geography, containing Availability Zones, and multiple data centers. 

After deploying resources in specific Azure region, there are a number of reasons that you might want to move resources to a different region.

- **Align to a region launch**: Move your resources to a newly introduced Azure region that wasn't previously available.
- **Align for services/features**: Move resources to take advantage of services or features that are available in a specific region.
- **Respond to business developments**: Move resources to a region in response to business changes, such as mergers or acquisitions.
- **Align for proximity**: Move resources to a region local to your business.
- **Meet data requirements**: Move resources in order to align with data residency requirements, or data classification needs. [Learn more](https://azure.microsoft.com/mediahandler/files/resourcefiles/achieving-compliant-data-residency-and-security-with-azure/Achieving_Compliant_Data_Residency_and_Security_with_Azure.pdf).
- **Respond to deployment requirements**: Move resources that were deployed in error, or move in response to capacity needs. 
- **Respond to decommissioning**: Move resources due to decommissioning of regions.

## Move resources with Resource Mover

You can move resources to a different region with [Azure Resource Mover](../../resource-mover/overview.md). Resource Mover provides:

- A single hub for moving resources across regions.
- Reduced move time and complexity. Everything you need is in a single location.
- A simple and consistent experience for moving different types of Azure resources.
- An easy way to identify dependencies across resources you want to move. This helps you to move related resources together, so that everything works as expected in the target region, after the move.
- Automatic cleanup of resources in the source region, if you want to delete them after the move.
- Testing. You can try out a move, and then discard it if you don't want to do a full move.

You can move resources to another region using a couple of different methods:

- **Start moving resources from a resource group**: With this method you kick off the region move from within a resource group. After selecting the resources you want to move, the process continues in the Resource Mover hub, to check resource dependencies, and orchestrate the move process. [Learn more](../../resource-mover/move-region-within-resource-group.md).
- **Start moving resources directly from the Resource Mover hub**: With this method you kick off the region move process directly in the hub. [Learn more](../../resource-mover/tutorial-move-region-virtual-machines.md).


## Support for region move

You can currently use Resource Mover to move these resources to another region:

- Azure VMs and associated disks
- NICs
- Availability sets
- Azure virtual networks
- Public IP addresses
- Network security groups (NSGs)
- Internal and public load balancers
- Azure SQL databases and elastic pools

## Region move process

The actual process for moving resources across regions depends on the resources you're moving. However, there are some common key steps:

1. **Verify prerequisites**: Prerequisites include making sure that the resources you need are available in the target region, checking that you have enough quota, and verifying that your subscription can access the target region.
2. **Analyze dependencies**: Your resources might have dependencies on other resources. Before moving, figure out dependencies so that moved resources continue to function as expected after the move.
3. **Prepare for move**: These are the steps you take in your primary region before the move. For example, you might need to export an Azure Resource Manager template, or start replicating resources from source to target.
4. **Move the resources**: How you move resources depends on what they are. You might need to deploy a template in the target region, or fail resources over to the target.
5. **Discard target resources**: After moving resources, you might want to take a look at the resources now in the target region, and decide if there's anything you don't need.
6. **Commit the move**: After verifying resources in the target region, some resources might require a final commit action. For example, in a target region that's now the primary region, you might need to set up disaster recovery to a new secondary region. 
7. **Clean up the source**: Finally, after everything's up and running in the new region, you can clean up and decommission resources you created for the move, and resources in your primary region.



## Next steps

[Learn more](../../resource-mover/about-move-process.md) about the move process in Resource Mover.
