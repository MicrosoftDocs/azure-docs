---
title: Azure disk pools (preview) overview
description: Learn about Azure disk pools (preview).
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 01/04/2022
ms.author: rogarana
ms.subservice: disks
ms.custom: references_regions, ignite-fall-2021, ignite-2022
---

# Azure disk pools (preview)

An Azure disk pool (preview) is an Azure resource that allows your applications and workloads to access a group of managed disks from a single endpoint. A disk pool can expose an Internet Small Computer Systems Interface (iSCSI) target to enable data access to disks inside this pool over iSCSI. Each disk pool can have one iSCSI target and each disk can be exposed as an iSCSI LUN. You can connect disks under the disk pool to Azure VMware Solution hosts as datastores. This allows you to scale your storage independent of your Azure VMware Solution hosts. Once a datastore is configured, you can create volumes on it and attach them to your VMware instances.

## How it works

When a disk pool is deployed, a managed resource group is automatically created for you. This managed resource group contains all Azure resources necessary for the operation of a disk pool. The naming convention for these resource groups is: MSP_(resource-group-name)_(diskpool-name)\_(region-name).

When you add a managed disk to the disk pool, the disk is attached to managed iSCSI controllers. Multiple managed disks can be added as storage targets to a disk pool, each storage target is presented as an iSCSI LUN under the disk pool's iSCSI target. Disk pools offer native support for Azure VMware Solution. An Azure VMware Solution cluster can connect to a disk pool, which would encompass all Azure VMware Solution hosts in that environment. The following diagram shows how you can use disk pools with Azure VMware Solution.

:::image type="content" source="media/disks-pools/disk-pool-diagram.png" alt-text="Diagram depicting how disk pools works, each ultra disk can be accessed by each iSCSI controller over iSCSI, and the Azure VMware Solution hosts can access the iSCSI controller over iSCSI.":::

## Restrictions

In preview, disk pools have the following restrictions:

- Only premium SSD managed disks and standard SSDs, or ultra disks can be added to a disk pool.
    - A disk pool can't be configured to contain both ultra disks and premium/standard SSDs. If a disk pool is configured to use ultra disks, it can only contain ultra disks. Likewise, a disk pool configured to use premium and standard SSDs can only contain premium and standard SSDs.
- Disks using [zone-redundant storage (ZRS)](disks-redundancy.md#zone-redundant-storage-for-managed-disks) aren't currently supported. 

### Regional availability

Disk pools are currently available in the following regions:

- Australia East
- Canada Central
- Central US
- East US
- East US 2
- West US 2
- Japan East
- North Europe
- West Europe
- Southeast Asia
- UK South
- Korea Central
- Sweden Central
- Central India


## Billing

When you deploy a disk pool, there are two areas that will incur billing costs: The price of the disk pool service fee itself, and the price of each individual disk added to the pool. For example, if you have a disk pool with one P30 disk added, you will be billed for the P30 disk and the disk pool. Other than the disk pool and your disks, there are no extra service charges for a disk pool and you will not be billed for the resources deployed in the managed resource group: MSP_(resource-group-name)_(diskpool-name)_(region-name).

See the [Azure managed disk pricing page](https://azure.microsoft.com/pricing/details/managed-disks/) for regional pricing on disk pools and disks to evaluate the cost of a disk pool for you.

## Next steps

See the [disk pools planning guide](disks-pools-planning.md).
