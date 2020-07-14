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

## Prerequisites

For this process, you will need to note down the virtual network of the VM that your disks are attached to. The vNet is necessary when configuring the private endpoint.

## Create a DiskAccess resource

1. Sign in to the Azure portal
1. Navigate to DiskAccess
1. Select create
1. On the create blade, select a resource group, fill in the name, and select a region.
1. Select create

    :::image type="content" source="media/disks-enable-private-links-for-import-export-portal/disk-access-create-basics.png" alt-text="example text":::

When your resource has been created, navigate directly to it.

## Create a private endpoint

Now that you have a diskaccess resource, you can use it to handle access to your disk's export/imports, this is done through private endpoints. Accordingly, you'll need to create a private endpoint and configure it for diskaccess.

1. From your diskaccess resource, select private endpoints
1. Select **+ Private endpoint**.

    :::image type="content" source="media/disks-enable-private-links-for-import-export-portal/disk-access-main-private-blade.png" alt-text="example text":::

1. Select a resource group
1. Fill in the name and select the same region your diskaccess resource was created in.
1. Select next

    :::image type="content" source="media/disks-enable-private-links-for-import-export-portal/disk-access-private-endpoint-first-blade.png" alt-text="example text":::

1. On the **Resource** blade, select **Connect to an Azure resource in my directory**.
1. For **Resource type** select **Microsoft.Compute/diskAccesses**
1. For **Resource** select the diskAccess resource you created earlier
1. Leave the **Target sub-resource** as **disks**
1. Select next.

    :::image type="content" source="media/disks-enable-private-links-for-import-export-portal/disk-access-private-endpoint-second-blade.png" alt-text="example text":::

1. Select the vNet that you want to limit the disk export to, other vNets will not be able to export your disk.

> [!NOTE]
> If you have a network security group (NGS) enabled for the selected subnet, it will be disabled for private endpoints on this subnet only. Other resources on this subnet will still have NSG enforcement.

1. Select the appropriate subnet
1. Select create

    :::image type="content" source="media/disks-enable-private-links-for-import-export-portal/disk-access-private-endpoint-third-blade.png" alt-text="example text":::

## Enable private endpoint on your disk

1. Navigate to the disk you'd like to configure
1. Select **Networking**
1. Select **Private endpoint (through disk access)** and select the disk access you created earlier.
1. Select **Save**.

    :::image type="content" source="media/disks-enable-private-links-for-import-export-portal/disk-access-managed-disk-networking-blade.png" alt-text="example text":::

You've now completed configuring Private Links that you can use when importing/exporting your managed disk.

## Next steps

