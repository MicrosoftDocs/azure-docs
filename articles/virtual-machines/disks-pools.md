---
title: Azure managed disk pools overview
description: Learn about Azure disk pools.
author: roygara
ms.service: virtual-machines
ms.topic: conceptual
ms.date: 06/10/2021
ms.author: rogarana
ms.subservice: disks
---

# Azure disk pools (preview)

A disk pool is a top-level Azure resource that allow your applications and workloads to access all of the disk pool's underlying storage. A disk pool surfaces a single endpoint for all underlying disks added as storage targets. You can think of a disk pool like a SAN appliance, and the disks in the pool as the SSDs inside the SAN.

A disk pool can expose an Internet Small Computer Systems Interface (iSCSI) target to enable data access to disks inside the pool. Each disk pool can have one iSCSI target, which can be connected to an Azure VMware Solution (AVS) host as a datastore. This allows you to scale your storage independent of your AVS hosts. Once a datastore is configured, you can create volumes on it and attach them to your VMware instances through vCenter, like any other datastore.

## How does it work?

When a disk pool is deployed, a managed resource group is automatically created for you. This managed resource group contains all Azure resources necessary for the operation of a disk pool. The naming convention for these resource groups is: MSP_(resource-group-name)_(diskpool-name)_(region-name).

When you add a managed disk to the disk pool, the disks are attached to managed iSCSI controllers. Multiple managed disks can be added as storage targets to a disk pool, each storage target is presented as an iSCSI LUN under the disk pool's iSCSI target. Disk pools offer native support for AVS, and an AVS cloud can be added as an iSCSI initiator for a disk pool, which would encompass all AVS hosts in that environment. The following diagram shows how you can use disk pools with AVS.

:::image type="content" source="media/disks-pools/disk-pool-diagram.png" alt-text="Diagram depicting how disk pools works, each ultra disk can be accessed by each iscsi controller over iscsi, and the avs hosts can access the iscsi controller over iscsi.":::

## Restrictions

In preview, disk pools have the following restrictions:

- Only premium SSDs or ultra disks can be added to a disk pool.
- You must use the Azure Resource Manager to connect a disk pool to your AVS solution.
    - The Azure portal, Azure PowerShell module, and Azure CLI cannot currently be used to connect your disk pool to an AVS solution.

### Regional availability

Disk pools are currently available in the following regions:

- East US
- West US 2
- Canada Central
- UK South
- North Europe
- West Europe
- Australia East
- Southeast Asia
- Japan East

## Billing

When you deploy a disk pool, there are two main areas that will incur billing costs:

- The disks inside the disk pool
- The Azure artifacts deployed in the managed resource group that accompany the disk pool.
    - The resources in the managed resource group are:
        - Two virtual machines.
        - Two managed disks.
        - One network interface.
        - One storage account for diagnostic logs and metrics.
        
You will be billed for the resources inside this managed resource group. Other than these resources and your disks, there are no additional service charges for a disk pool. For details on the managed resource group, see the how does it work section.

See the Azure pricing calculator for regional pricing on VMs and disks to evaluate the cost of a disk pool for you. Azure resources consumed by the disk pool can be accounted for in Azure Reservations, if you have them.


## Next steps

See the [disk pools planning guide](disks-pools-planning.md).