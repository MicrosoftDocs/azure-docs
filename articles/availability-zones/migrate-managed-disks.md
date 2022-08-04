---
title: Migrate managed disks to availability zone support 
description: Learn how to migrate managed disks  to availability zone support.
author: anaharris-ms
ms.service: storage
ms.topic: conceptual
ms.date: 08/03/2022
ms.author: anaharris 
ms.reviewer: anaharris
ms.custom: references_regions
---

# Migrate Azure managed disks to availability zone support
 
This guide describes how to migrate Azure managed disks from non-availability zone support to availability support. We'll take you through the two different options for migration. The first migration option describes how to migrate a non-zonal managed disk to zonal. The second option describes how to migrate a non-zonal managed disk to zone-redundant.

For both options, you'll need to take snapshots of those disks and recreate them in the zone of the Azure VM to which they will be attached.  


## Prerequisites

For zone-redundant managed disks, one of the following two specific storage SKUs must be selected:

- **Zonal**. When you create a zonal Azure VM, the managed disk that's created is also zonal by default, which means that your managed disk will be co-located in the same zone as your Azure VM. 
- **Zone-redundant**. Managed disks support zone-redundant storage (ZRS) which synchronously replicates your managed disk across three availability zones in the region you select. 


## Downtime requirements

Although managed disks can be created ahead of time to avoid downtime, there are instances where some downtime should be expected.

Downtime should be expected under the following conditions:

- You're creating snapshots while the VM is offline.
- You switch over to the new zonal VMs with the newly attached zonal disks.
- You swap the OS disk of a VM.


## Create your snapshot

The easiest and cleanest way to create a snapshot is to do so while the VM is offline. See [Create snapshots while the VM is offline](../virtual-machines/backup-and-disaster-recovery-for-azure-iaas-disks.md#create-snapshots-while-the-vm-is-offline). If you choose this approach, some downtime should be expected. To create a snapshot of your VM using the Azure portal, PowerShell, or Azure CLI, see [Create a snapshot of a virtual hard disk](../virtual-machines/snapshot-copy-managed-disk.md)

If you'll be taking a snapshot of a disk that's attached to a running VM, make sure you read the guidance in [Create snapshots while the VM is running](../virtual-machines/backup-and-disaster-recovery-for-azure-iaas-disks.md#create-snapshots-while-the-vm-is-running) before proceeding.

>[!NOTE]
> The source managed disk remains intact with its current configuration. If you no longer want to keep it, you must manually delete the disk. For more information, see [Find and delete unattached Azure managed and unmanaged disks](../virtual-machines/windows/find-unattached-disks.md).


## Option 1: Migrate a non-zonal managed disk to zonal

Existing non-zonal managed disks can't be attached to a zonal VM. To attach an existing non-zonal managed disk to a zonal VM, you'll need to take a snapshot of the current disk, and then create a new zonal managed disk with that snapshot in the same zone as the zonal VM. 

To migrate a non-zonal managed disk to zonal:

1. Create your snapshot. Thoroughly read the recommendations and directions in [Create your snapshot](#create-your-snapshot)

1. Create a zonal managed disk from the source disk snapshot. The zone parameter should match your zonal VM.  To create a zonal managed disk from the snapshot, you can use [Azure CLI](../virtual-machines/scripts/create-managed-disk-from-snapshot.md)(example below), [PowerShell](../virtual-machines/scripts/virtual-machines-powershell-sample-create-managed-disk-from-snapshot.md), or the Azure Portal.

    ```azurecli
        az disk create --resource-group $resourceGroupName --name $diskName --location @location --zone 1 --sku $storageType --size-gb $diskSize --source $snapshotId
    ```

1. Attach the zonal managed disk to the zonal VM. For guidance on how to attach a managed disk, see [Attach a data disk to a Windows VM with Azure Portal](../virtual-machines/windows/attach-managed-disk-portal.md) or [Attach a data disk to a Windows VM with PowerShell](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/attach-disk-ps.md).

    >[!NOTE]
    > The source managed disk remains intact with its current configuration. If you no longer want to keep it, you must manually delete the disk. For more information, see [Find and delete unattached Azure managed and unmanaged disks](../virtual-machines/windows/find-unattached-disks.md).

## Option 2: Migrate a non-zonal managed disk to zone-redundant

This option shows you how to migrate an existing non-zonal managed disk to a zone-redundant managed disk. A zone redundant managed disk can be attached either to a zonal VM or a non-zonal VM in the same region. 

>![IMPORTANT]
> ZRS for managed disks has some restrictions. For more information see [Limitations](../virtual-machines/disks-deploy-zrs.md?tabs=portal#limitations). 

To migrate a non-zonal managed disk to zone-redundant:

1. Create your snapshot. Thoroughly read the recommendations and directions in [Create your snapshot](#create-your-snapshot)

1. Create a ZRS managed disk using the following Azure CLI snippet: 

    ```powershell
    # Create a new ZRS Managed Disks using the snapshot Id and the SKU supported   
    storageType=Premium_ZRS 
    location=westus2 

    az disk create --resource-group $resourceGroupName --name $diskName --sku $storageType --size-gb $diskSize --source $snapshotId 
    
    ```

1. Attach the ZRS managed disk to the Azure VM. . For guidance on how to attach a managed disk, see [Attach a data disk to a Windows VM with Azure Portal](../virtual-machines/windows/attach-managed-disk-portal.md) or [Attach a data disk to a Windows VM with PowerShell](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/attach-disk-ps.md).



## Next steps

Learn about:

> [!div class="nextstepaction"]
> [Zone-redundant storage for managed disks](../virtual-machines/disks-redundancy#zone-redundant-storage-for-managed-disks.md).

> [!div class="nextstepaction"]
> [Regions and Availability Zones in Azure](az-overview.md)

> [!div class="nextstepaction"]
> [Azure Services that support Availability Zones](az-region.md)