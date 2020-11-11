---
title: Azure portal - Restrict import/export access to managed disks with Private Links
description: Enable Private Links for your managed disks with Azure portal. Allowing you to securely export and import disks within your virtual network.
author: roygara
ms.service: virtual-machines
ms.topic: overview
ms.date: 08/24/2020
ms.author: rogarana
ms.subservice: disks
ms.custom: references_regions
---

# Use the Azure portal to restrict import/export access for managed disks with Private Links

Private Links support for managed disks allows you to restrict the export and import of managed disks so that it only occurs within your Azure virtual network. You can generate a time bound Shared Access Signature (SAS) URI for unattached managed disks and snapshots for exporting the data to other region for regional expansion, disaster recovery and to read the data for forensic analysis. You can also use the SAS URI to directly upload VHD to an empty disk from your on-premises. Network traffic between clients on their virtual network and managed disks only traverses over the virtual network and a private link on the Microsoft backbone network, eliminating exposure to the public internet.

You can create a disk access resource and link it to your virtual network in the same subscription by creating a private endpoint. You must associate a disk or a snapshot with a disk access for exporting and importing the data via Private Links. Also, you must set the NetworkAccessPolicy property of the disk or the snapshot to `AllowPrivate`. 

You can set the NetworkAccessPolicy property to `DenyAll` to prevent anybody from generating the SAS URI for a disk or a snapshot. The default value for the NetworkAccessPolicy property is `AllowAll`.

## Limitations

[!INCLUDE [virtual-machines-disks-private-links-limitations](../../includes/virtual-machines-disks-private-links-limitations.md)]

## Regional availability

[!INCLUDE [virtual-machines-disks-private-links-regions](../../includes/virtual-machines-disks-private-links-regions.md)]

## Create a disk access resource

1. Sign in to the Azure portal and navigate to **Disk Access** with [this link](https://aka.ms/disksprivatelinks).

    > [!IMPORTANT]
    > You must use the [provided link](https://aka.ms/disksprivatelinks) to navigate to the Disk Access blade. It is not currently visible in the public portal without using the link.

1. Select **+ Add** to create a new disk access resource.
1. On the create blade, select your subscription, a resource group, enter a name, and select a region.
1. Select **Review + create**.

    :::image type="content" source="media/disks-enable-private-links-for-import-export-portal/disk-access-create-basics.png" alt-text="Screenshot of disk access creation blade. Fill in the desired name, select a region, select a resource group, and proceed":::

When your resource has been created, navigate directly to it.

:::image type="content" source="media/disks-enable-private-links-for-import-export-portal/screenshot-resource-button.png" alt-text="Screenshot of the Go to resource button in the portal":::

## Create a private endpoint

Now that you have a disk access resource, you can use it to handle access to your disk's export/imports, this is done through private endpoints. Accordingly, you'll need to create a private endpoint and configure it for disk access.

1. From your disk access resource, select **Private endpoint connections**.
1. Select **+ Private endpoint**.

    :::image type="content" source="media/disks-enable-private-links-for-import-export-portal/disk-access-main-private-blade.png" alt-text="Screenshot of the overview blade for your disk access resource. Private endpoint connections is highlighted.":::

1. Select a resource group
1. Fill in the name and select the same region your disk access resource was created in.
1. Select **Next: Resource >**

    :::image type="content" source="media/disks-enable-private-links-for-import-export-portal/disk-access-private-endpoint-first-blade.png" alt-text="Screenshot of the private endpoint creation workflow, first blade. If you do not select the appropriate region then you may encounter issues later on.":::

1. On the **Resource** blade, select **Connect to an Azure resource in my directory**.
1. For **Resource type** select **Microsoft.Compute/diskAccesses**
1. For **Resource** select the disk access resource you created earlier
1. Leave the **Target sub-resource** as **disks**
1. Select **Next : Configuration >**.

    :::image type="content" source="media/disks-enable-private-links-for-import-export-portal/disk-access-private-endpoint-second-blade.png" alt-text="Screenshot of the private endpoint creation workflow, second blade. With all the values highlighted (Resource type, Resource, Target sub-resource)":::

1. Select the virtual network that you want to limit the disk export to, other virtual networks will not be able to export your disk.

    > [!NOTE]
    > If you have a network security group (NGS) enabled for the selected subnet, it will be disabled for private endpoints on this subnet only. Other resources on this subnet will still have NSG enforcement.

1. Select the appropriate subnet
1. Select **Review + create**.

    :::image type="content" source="media/disks-enable-private-links-for-import-export-portal/disk-access-private-endpoint-third-blade.png" alt-text="Screenshot of the private endpoint creation workflow, third blade. Virtual network and subnet emphasized.":::

## Enable private endpoint on your disk

1. Navigate to the disk you'd like to configure
1. Select **Networking**
1. Select **Private endpoint (through disk access)** and select the disk access you created earlier.
1. Select **Save**.

    :::image type="content" source="media/disks-enable-private-links-for-import-export-portal/disk-access-managed-disk-networking-blade.png" alt-text="Screenshot of the managed disk networking blade. Highlighting the private endpoint selection as well as the selected disk access. Saving this configures your disk for this access.":::

You've now completed configuring Private Links that you can use when importing/exporting your managed disk.

## Next steps

- [FAQ for Private Links](./faq-for-disks.md#private-links-for-securely-exporting-and-importing-managed-disks)
- [Export/Copy managed snapshots as VHD to a storage account in different region with PowerShell](./scripts/virtual-machines-powershell-sample-copy-snapshot-to-storage-account.md)