---
title: Move Azure resources to another region
description: Provides an overview of moving Azure resources across Azure regions. 
author: rayne-wiselman
ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 11/21/2019
ms.author: raynew
---

# Moving Azure resources across regions

This article provides information about moving Azure resources across Azure regions.

Azure geographies, regions, and Availability Zones form the foundation of the Azure global infrastructure. Azure [geographies](https://azure.microsoft.com/global-infrastructure/geographies/) typically contain two or more [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/). A region is an area within a geography, containing Availability Zones, and multiple data centers. 

After deploying resources in specific Azure region, there are a number of reasons that you might want to move resources to a different region.

- **Align to a region launch**: Move your resources to a newly introduced Azure region that wasn't previously available.
- **Align for services/features**: Move resources to take advantage of services or features that are available in a specific region.
- **Respond to business developments**: Move resources to a region in response to business changes, such as mergers or acquisitions.
- **Align for proximity**: Move resources to a region local to your business.
- **Meet data requirements**: Move resources in order to align with data residency requirements, or data classification needs. [Learn more](https://azure.microsoft.com/mediahandler/files/resourcefiles/achieving-compliant-data-residency-and-security-with-azure/Achieving_Compliant_Data_Residency_and_Security_with_Azure.pdf).
- **Respond to deployment requirements**: Move resources that were deployed in error, or move in response to capacity needs. 
- **Respond to decommissioning**: Move resources due to decommissioning of regions.

## Move process

The actual move process depends on the resources you're moving. However, there are some common key steps:

- **Verify prerequisites**: Prerequisites include making sure that the resources you need are available in the target region, checking that you have enough quota, and verifying that your subscription can access the target region.
- **Analyze dependencies**: Your resources might have dependencies on other resources. Before moving, figure out dependencies so that moved resources continue to function as expected after the move.
- **Prepare for move**: These are the steps you take in your primary region before the move. For example, you might need to export an Azure Resource Manager template, or start replicating resources from source to target.
- **Move the resources**: How you move resources depends on what they are. You might need to deploy a template in the target region, or fail resources over to the target.
- **Discard target resources**: After moving resources, you might want to take a look at the resources now in the target region, and decide if there's anything you don't need.
- **Commit the move**: After verifying resources in the target region, some resources might require a final commit action. For example, in a target region that's now the primary region, you might need to set up disaster recovery to a new secondary region. 
- **Clean up the source**: Finally, after everything's up and running in the new region, you can clean up and decommission resources you created for the move, and resources in your primary region.



## Next steps

For a list of which resources support moving across regions, see [Move operation support for resources](region-move-support.md).
