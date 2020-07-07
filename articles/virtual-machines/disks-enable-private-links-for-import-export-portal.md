---
title: Private Links for exporting and importing Azure Managed Disks 
description: Private links for securely exporting and importing data to Azure Managed Disks
author: roygara
ms.service: virtual-machines
ms.topic: overview
ms.date: 07/06/2020
ms.author: rogarana
ms.subservice: disks
---

# Enable private links for importing and exporting managed disks - Azure portal

You can generate a time bound Shared Access Signature (SAS) URI for unattached managed disks and snapshots for exporting the data to other region for regional expansion, disaster recovery and to read the data for forensic analysis. You can also use the SAS URI to directly upload VHD to an empty disk from your on-premises.  Now you can leverage [private links](../private-link/private-link-overview.md) for restricting the export and import to Managed Disks only from your Azure VNET. Moreover, you are rest assured that the data never goes over the public internet and always travels within the secure Microsoft backbone network when you use Private Links. 

You can create an instance of the new resource called DiskAccess and link it to your VNET in the same subscription by creating a private endpoint. You must associate a disk or a snapshot with an instance of DiskAccess for exporting and importing the data via Private Links. Also, you must set the NetworkAccessPolicy property of the disk or the snapshot to AllowPrivate. 

You can set the NetworkAccessPolicy property to DenyAll to prevent anybody from generating the SAS URI for a disk or a snapshot. The default value for the NetworkAccessPolicy property is AllowAll.

## Limitations

[!INCLUDE [virtual-machines-disks-private-links-limitations](../../includes/virtual-machines-disks-private-links-limitations.md)]

## Regional availability

[!INCLUDE [virtual-machines-disks-private-links-regions](../../includes/virtual-machines-disks-private-links-regions.md)]

## Create a DiskAccess resource

1. Sign in to the Azure portal
1. Navigate to DiskAccess
1. Select create
1. Select a resource group and region, fill in the name
1. Select create

## Create a private endpoint

1. From your diskaccess resource, select private endpoints
1. Select add.
1. Select a resource group
1. Fill in the name and select the same region as your diskaccess resource
1. Select next
1. On the Resource blade, select **Microsoft.Compute/diskAccesses**
1. For **Resource** select the diskAccess resource you created earlier
1. Leave the target sub-resource as **disks**
1. Select next.
1. Select the vNet of the VM the disk is attached to.

> [!NOTE]
> Note about subnet and NSG here

1. Select the subnet
1. The remaining selections are up to you
1. Select create

## Enable private endpoint on your disk

1. Navigate to the disk you'd like to configure
1. Select **Networking**
1. Select **Private endpoint** and select the private endpoint you just configured
1. Select save.