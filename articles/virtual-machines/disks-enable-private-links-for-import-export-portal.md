---
title: Azure portal - Restrict import/export access to managed disks
description: Enable Private Link for your managed disks with Azure portal. This allows you to securely export and import disks within your virtual network.
author: roygara
ms.service: azure-disk-storage
ms.topic: how-to
ms.date: 03/31/2023
ms.author: rogarana
---

# Restrict import/export access for managed disks using Azure Private Link

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

You can use [private endpoints](../private-link/private-endpoint-overview.md) to restrict the export and import of managed disks and more securely access data over a [private link](../private-link/private-link-overview.md) from clients on your Azure virtual network. The private endpoint uses an IP address from the virtual network address space for your managed disks. Network traffic between clients on their virtual network and managed disks only traverses over the virtual network and a private link on the Microsoft backbone network, eliminating exposure from the public internet.

To use Private Link to export and import managed disks, first you create a disk access resource and link it to a virtual network in the same subscription by creating a private endpoint. Then, associate a disk or a snapshot with a disk access instance.

## Limitations

[!INCLUDE [virtual-machines-disks-private-links-limitations](../../includes/virtual-machines-disks-private-links-limitations.md)]

## Create a disk access resource

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to **Disk Accesses**.
1. Select **+ Create** to create a new disk access resource.
1. On the **Create a disk accesses** pane, select your subscription and a resource group. Under **Instance details**, enter a name and select a region.

    :::image type="content" source="media/disks-enable-private-links-for-import-export-portal/disk-access-create-basics.png" alt-text="Screenshot of disk access creation pane. Fill in the desired name, select a region, select a resource group, and proceed":::

1. Select **Review + create**.
1. When your resource has been created, navigate directly to it.

    :::image type="content" source="media/disks-enable-private-links-for-import-export-portal/screenshot-resource-button.png" alt-text="Screenshot of the Go to resource button in the portal":::

## Create a private endpoint

Next, you'll need to create a private endpoint and configure it for disk access.

1. From your disk access resource, under **Settings**, select **Private endpoint connections**.
1. Select **+ Private endpoint**.

    :::image type="content" source="media/disks-enable-private-links-for-import-export-portal/disk-access-main-private-blade.png" alt-text="Screenshot of the overview pane for your disk access resource. Private endpoint connections is highlighted.":::

1. In the **Create a private endpoint** pane, select a resource group.
1. Provide a name and select the same region in which your disk access resource was created.

    :::image type="content" source="media/disks-enable-private-links-for-import-export-portal/disk-access-private-endpoint-first-blade.png" alt-text="Screenshot of the private endpoint creation workflow, first pane. If you do not select the appropriate region then you may encounter issues later on.":::

1. Select **Next: Resource**.
1. On the **Resource** pane, select **Connect to an Azure resource in my directory**.
1. For **Resource type**, select **Microsoft.Compute/diskAccesses**.
1. For **Resource**, select the disk access resource you created earlier.
1. Leave the **Target sub-resource** as **disks**.

    :::image type="content" source="media/disks-enable-private-links-for-import-export-portal/disk-access-private-endpoint-second-blade.png" alt-text="Screenshot of the private endpoint creation workflow, second pane. With all the values highlighted (Resource type, Resource, Target sub-resource)":::

1. Select **Next : Configuration**.
1. Select the virtual network to which you will limit disk import and export. This prevents the import and export of your disk to other virtual networks.

    > [!NOTE]
    > If you have a network security group enabled for the selected subnet, it will be disabled for private endpoints on this subnet only. Other resources on this subnet will retain network security group enforcement.

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
- [FAQ for private links and managed disks](./faq-for-disks.yml#private-links-for-managed-disks)
- [Export/Copy managed snapshots as VHD to a storage account in different region with PowerShell](/previous-versions/azure/virtual-machines/scripts/virtual-machines-powershell-sample-copy-snapshot-to-storage-account)
