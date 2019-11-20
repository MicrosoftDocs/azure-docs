---
title: Move Azure resources to another region
description: Provides an overview of moving Azure resources across Azure regions. 
author: rayne-wiselman
ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 11/20/2019
ms.author: raynew
---

# Moving Azure resources across regions

This article provides background information about moving Azure resources across Azure regions.

Azure operates in multiple [geographies](https://azure.microsoft.com/global-infrastructure/geographies/) around the world. Within geographies there are generally multiple [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/). A region is an area within a geography, containing one or more data centers. You deploy Azure resource groups and resources, you deploy them within specific regions.

There are a number of reasons you might want to move resources deployed in one region to a different region.

- Align to a region launch: Move your resources to a newly introduced Azure region that wasn't previously available.
- Align for services/features: Move resources to take advantage of services or features that are available in a specific region.
- Move in response to business developments: Move resources to another region in response to business changes such as mergers or acquisitions.
- Align for proximity: Move resources to a region local to your business.
- Meet data requirements: Move resources in order to align with data residency requirements, or data classification needs. [Learn more](https://azure.microsoft.com/mediahandler/files/resourcefiles/achieving-compliant-data-residency-and-security-with-azure/Achieving_Compliant_Data_Residency_and_Security_with_Azure.pdf).
- Respond to deployment requirements: Move resources that were deployed in error, or in response to capacity needs. 
- Respond to decommissioning: Move resources in response to decommissioning of regions.

## Move process

The actual move procedure will depend upon the resources you're moving. However, there are some common key steps:

- **Verify prerequisites**: Prerequisites include making sure that the resources you need are available in the target region, checking that you have enough quota, and making sure that your subscription can access the target region you want to use.
- **Analyze dependencies**: Your resources will probably have dependencies on other resources. You need to figure out dependencies to ensure that moved resources will continue to function as expected after the move.
- **Prepare for move**: These are the steps you need to take in your primary region. For example, you might need to export an Azure Resource Manager template, or replicate resources from the source region to the target.
- **Move the resources**: How you move resources will depend on what they are. But it might be deploying a template in the target region, or failing over to the target region.
- **Discard target resources**: After moving resources, you might want to take a look at the resources now in the target region, and decide if there's anything you don't need.
- **Commit the move**: After verifying resources in the target region, and making sure everything's as expected, some resources might require a final commit action. For example, a target region that's now the primary region might need disaster recovery deployed to a new secondary region. 
- **Clean up the source**: Finally, after everything's up and running in the new region, you can clean up and decommission resources you created for the move, and resources in your primary region.



## Next steps

For a list of which resources support move, see [Move operation support for resources](region-move-support.md).
