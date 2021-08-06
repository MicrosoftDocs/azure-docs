---
title: Azure portal - Restrict import/export access to managed disks with Private Links
description: Enable Private Links for your managed disks with Azure portal. Allowing you to securely export and import disks within your virtual network.
author: roygara
ms.service: storage
ms.topic: overview
ms.date: 07/15/2021
ms.author: rogarana
ms.subservice: disks
ms.custom: references_regions
---

# Restrict import/export access for disks with Private Link using the Azure portal

[Azure Private Link](../private-link/private-link-overview.md) support for managed disks allows you to restrict the export and import of managed disks so that it occurs only within your Azure virtual network. You can generate a time-bound Shared Access Signature (SAS) URI for unattached managed disks and snapshots which can be used to:
- Export the data to other region for regional expansion.
- Configure disaster recovery and business continuity policies.
- Read data for forensic analysis.
- Upload a VHD to an empty disk from your on-premises network.

Network traffic between clients on their virtual network and managed disks does not traverse the public internet. It is limited to the clients' virtual network and a private link on the Microsoft backbone network.

You can create a disk access resource and link it to your virtual network in the same subscription by creating a private endpoint. You must associate a disk or a snapshot with a disk access to export and import the data through a private link.

## Limitations

[!INCLUDE [virtual-machines-disks-private-links-limitations](../../includes/virtual-machines-disks-private-links-limitations.md)]

## Create a disk access resource

1. Sign in to the Azure portal and navigate to **Disk Accesses** with [this link](https://aka.ms/disksprivatelinks).

    > [!IMPORTANT]
    > You must use the [provided link](https://aka.ms/disksprivatelinks) to navigate to the Disk Accesses pane. It is not currently visible in the public portal without using the link.

1. Select **+ Create** to create a new disk access resource.
1. On the **Create a disk access** pane, select your subscription and a resource group. In the **Instance details** group, enter a name and select a region.

    :::image type="content" source="media/disks-enable-private-links-for-import-export-portal/disk-access-create-basics.png" alt-text="Screenshot of disk access creation pane. Fill in the desired name, select a region, select a resource group, and proceed":::

1. Select **Review + create**.
When your resource has been created, navigate directly to it.

:::image type="content" source="media/disks-enable-private-links-for-import-export-portal/screenshot-resource-button.png" alt-text="Screenshot of the Go to resource button in the portal":::

## Create a private endpoint

Next, you'll need to create a private endpoint and configure it for disk access.

1. From your disk access resource, in the **Settings** group, select **Private endpoint connections**.
1. Select **+ Private endpoint**.

    :::image type="content" source="media/disks-enable-private-links-for-import-export-portal/disk-access-main-private-blade.png" alt-text="Screenshot of the overview pane for your disk access resource. Private endpoint connections is highlighted.":::

1. In the **Create a private endpoint** pane, select a resource group.
1. Provide a name and select the same region in which your disk access resource was created.

    :::image type="content" source="media/disks-enable-private-links-for-import-export-portal/disk-access-private-endpoint-first-blade.png" alt-text="Screenshot of the private endpoint creation workflow, first pane. If you do not select the appropriate region then you may encounter issues later on.":::

1. Select **Next: Resource**.
1. On the **Resource** pane, select **Connect to an Azure resource in my directory**.
1. For **Resource type** select **Microsoft.Compute/diskAccesses**.
1. For **Resource** select the disk access resource you created earlier.
1. Leave the **Target sub-resource** as **disks**.

    :::image type="content" source="media/disks-enable-private-links-for-import-export-portal/disk-access-private-endpoint-second-blade.png" alt-text="Screenshot of the private endpoint creation workflow, second pane. With all the values highlighted (Resource type, Resource, Target sub-resource)":::

1. Select **Next : Configuration**.
1. Select the virtual network to which you will limit disk import and export. This prevents the import and export of your disk to other virtual networks.

    > [!NOTE]
    > If you have a network security group (NGS) enabled for the selected subnet, it will be disabled for private endpoints on this subnet only. Other resources on this subnet will retain NSG enforcement.

1. Select the appropriate subnet.

    :::image type="content" source="media/disks-enable-private-links-for-import-export-portal/disk-access-private-endpoint-third-blade.png" alt-text="Screenshot of the private endpoint creation workflow, third pane. Virtual network and subnet emphasized.":::

1. Select **Review + create**.

## Enable private endpoint on your disk

1. Navigate to the disk you'd like to configure.
1. Under **Settings**, select **Networking**.
1. Select **Private endpoint (through disk access)** and select the disk access you created earlier.

    :::image type="content" source="media/disks-enable-private-links-for-import-export-portal/disk-access-managed-disk-networking-blade.png" alt-text="Screenshot of the managed disk networking pane. Highlighting the private endpoint selection as well as the selected disk access. Saving this configures your disk for this access.":::

1. Select **Save**.

You've now configured a private link that you can use to import and export your managed disk.

## Next steps

- Upload a VHD to Azure or copy a managed disk to another region - [Azure CLI](linux/disks-upload-vhd-to-managed-disk-cli.md) or [Azure PowerShell module](windows/disks-upload-vhd-to-managed-disk-powershell.md)
- Download a VHD - [Windows](windows/download-vhd.md) or [Linux](linux/download-vhd.md)
- [FAQ for private links and managed disks](/azure/virtual-machines/faq-for-disks#private-links-for-securely-exporting-and-importing-managed-disks)
- [Export/Copy managed snapshots as VHD to a storage account in different region with PowerShell](/previous-versions/azure/virtual-machines/scripts/virtual-machines-powershell-sample-copy-snapshot-to-storage-account)