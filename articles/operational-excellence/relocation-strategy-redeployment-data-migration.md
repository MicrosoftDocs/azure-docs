---
title: Azure region relocation with Azure Resource Mover
description:  Learn how to use Azure Resource Mover for moving resources across regions.
author: anaharris-ms
ms.topic: overview
ms.date: 11/28/2023
ms.author: anaharris
ms.service: reliability
ms.subservice: availability-zones
ms.custom: subject-reliability
---

## Azure region relocation with Azure Resource Mover

This article shows you how to use Azure Resource Mover for moving resources across regions.

With ARM, you can:

- Use a single hub for moving resources across regions.
- Reduce move time and complexity.
- Create a simple and consistent experience for moving different Azure resources.
- Easily identify which dependencies need to move across resources, so related resources move together and everything works as expected in the target region after the move.
- Use automatic clean-up of the resources you must delete in the source region after the relocation.
- Provide testing capabilities.

:::image type="content" source="media/relocation/resource-mover.png" alt-text="Diagram of how ARM moves resources between one region and another":::


### Supported use cases

You can move the following resources across regions with Azure Resource Mover:

- Azure VMs and associated disks
Encrypted Azure VMs and associated disks. This use case includes VMs with Azure disk encryption enabled and Azure VMs using default server-side encryption (with platform-managed keys and customer-managed keys)
NICs
Availability sets
Azure virtual networks
Public IP addresses
Network security groups (NSGs)
Internal and public load balancers
Azure SQL databases and elastic pools

### The ARM relocation process

How you move resources across regions depends on the type of resources moved. That said, the following process for moving resource is typical:

1. **Verify prerequisites** by ensuring that:
    
    - The required resources are available in the target region.
    - There's sufficient quota.
    - The subscription can access the target region.
    - You include he dependencies so that the resources continue to function as expected after the move.

1. **Prepare for the move.** e preparation steps depend on the type of resource you are moving:

    - **Stateless resources** have configuration information only. These resources don’t need continuous replication of data to move. Examples include Azure virtual networks (VNets), network adapters, load balancers, and network security groups. The preparation process generates an Azure Resource Manager template for this resource type.

    - **Stateful resources** have configuration information and data that need to move. Examples include Azure VMs and Azure SQL databases. The preparation process differs for each resource. It might involve replicating the source resource to the target region.

1. **Move the resources:** The movement approach would depend on the resource moved. You might need to deploy a template in the target region, or resources should be failing over to the target.

1. **Commit or discard target resources:** After verifying resources in the target region, some resources might require a final commit action. For example, you need to set up disaster recovery in a target region that’s now the primary region. If the relocation results are unsatisfactory, you can discard the changes.

1. **Clean up the source:** After everything’s up and running in the new region, decommission the resources you created for the move and the resources in the primary region.
Supported use
