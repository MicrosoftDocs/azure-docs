---
title: Azure disk pools (preview) overview
description: Learn about Azure disk pools (preview).
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 07/23/2021
ms.author: rogarana
ms.subservice: disks
ms.custom: references_regions
---

# Azure disk pools (preview)

An Azure disk pool (preview) is an Azure resource that allows your applications and workloads to access a group of managed disks from a single endpoint. A disk pool can expose an Internet Small Computer Systems Interface (iSCSI) target to enable data access to disks inside this pool over iSCSI. Each disk pool can have one iSCSI target and each disk can be exposed as an iSCSI LUN. You can connect disks under the disk pool to Azure VMware Solution hosts as datastores. This allows you to scale your storage independent of your Azure VMware Solution hosts. Once a datastore is configured, you can create volumes on it and attach them to your VMware instances.

## How it works

When a disk pool is deployed, a managed resource group is automatically created for you. This managed resource group contains all Azure resources necessary for the operation of a disk pool. The naming convention for these resource groups is: MSP_(resource-group-name)_(diskpool-name)\_(region-name).

When you add a managed disk to the disk pool, the disk is attached to managed iSCSI controllers. Multiple managed disks can be added as storage targets to a disk pool, each storage target is presented as an iSCSI LUN under the disk pool's iSCSI target. Disk pools offer native support for Azure VMware Solution. An Azure VMware Solution cluster can connect to a disk pool, which would encompass all Azure VMware Solution hosts in that environment. The following diagram shows how you can use disk pools with Azure VMware Solution.

:::image type="content" source="media/disks-pools/disk-pool-diagram.png" alt-text="Diagram depicting how disk pools works, each ultra disk can be accessed by each iSCSI controller over iSCSI, and the Azure VMware Solution hosts can access the iSCSI controller over iSCSI.":::

## Restrictions

In preview, disk pools have the following restrictions:

- Only premium SSDs or ultra disks can be added to a disk pool.
- Disks using [zone-redundant storage (ZRS)](disks-redundancy.md#zone-redundant-storage-for-managed-disks-preview) aren't currently supported. 

### Regional availability

Disk pools are currently available in the following regions:

- Australia East
- Canada Central
- Central US
- East US
- West US 2
- Japan East
- North Europe
- West Europe
- Southeast Asia
- UK South


## Billing

When you deploy a disk pool, there are two main areas that will incur billing costs:

- The disks added to the disk pool
- The Azure resources deployed in the managed resource group that accompany the disk pool. These resources are:
    - Virtual machines.
    - Managed disks.
    - One network interface.
    - One storage account for diagnostic logs and metrics.
        
You will be billed for the resources inside this managed resource group and the individual disks that are the actual data storage. For example, if you have a disk pool with one P30 disk added, you will be billed for the P30 disk and all resources deployed in the managed resource group. Other than these resources and your disks, there are no extra service charges for a disk pool. For details on the managed resource group, see the [How it works](#how-it-works) section.

See the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) for regional pricing on VMs and disks to evaluate the cost of a disk pool for you. Azure resources consumed by the disk pool can be accounted for in Azure Reservations, if you have them.


## Next steps

See the [disk pools planning guide](disks-pools-planning.md).
