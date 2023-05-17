---
title: Update the address space for a peered virtual network - Azure portal
description: Learn how to add, modify, or delete the address ranges for a peered virtual network without downtime.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.topic: how-to 
ms.date: 03/21/2023
ms.custom: template-how-to
#Customer Intent: As a cloud engineer, I need to update the address space for peered virtual networks without incurring downtime from the current address spaces. I wish to do this in the Azure portal.
---

# Update the address space for a peered virtual network using the Azure portal

In this article, you learn how to update a peered virtual network by modifying, adding, or deleting an address space using the Azure portal. These updates don't incur downtime interruptions. This feature is useful when you need to grow or resize the virtual networks in Azure after scaling your workloads.

## Prerequisites

- An existing peered virtual network with two virtual networks
- If you add an address space, ensure that it doesn't overlap other address spaces

## Modify the address range prefix of an existing address range

In this section, you modify the address range prefix for an existing address range within your peered virtual network.

1. In the search box at the top of the Azure portal, enter *virtual networks*. Select **Virtual networks** from the search results.
1. From the list of virtual networks, select the virtual network to modify.
1. Under **Settings**, select **Address space**.
1. On the **Address space** page, change the address range prefix per your requirements, and select **Save**.

    :::image type="content" source="media/update-virtual-network-peering-address-space/update-address-prefix-thumb.png" alt-text="Screenshot of the Address Space page for changing a subnet's prefix." lightbox="media/update-virtual-network-peering-address-space/update-address-prefix-full.png":::

1. Under **Settings**, select **Peerings** and select the checkbox for the peering that you want to sync.
1. Select **Sync** from the taskbar.

    :::image type="content" source="media/update-virtual-network-peering-address-space/sync-peering-thumb.png" alt-text="Screenshot of the Peerings page where you resync a peering connection." lightbox="media/update-virtual-network-peering-address-space/sync-peering-full.png":::

1. Select the name of the other peered virtual network under **Peer**.
1. Under **Settings** for the peered virtual network, select **Address space** and verify that the address space listed has been updated.

    :::image type="content" source="media/update-virtual-network-peering-address-space/verify-address-space-thumb.png" alt-text="Screenshot of the Address Space page where you verify the address space has changed." lightbox="media/update-virtual-network-peering-address-space/verify-address-space-full.png":::

> [!NOTE]
> When you update the address space for a virtual network, you need to sync the virtual network peer for each remote peered virtual network. We recommend that you run sync after every resize address space operation instead of performing multiple resizing operations and then running the sync operation.
>
> The following actions require you to sync:
>
> - Modifying the address range prefix of an existing address range, for example changing 10.1.0.0/16 to 10.1.0.0/18
> - Adding address ranges to a virtual network
> - Deleting address ranges from a virtual network

## Add an address range

In this section, you add an IP address range to the IP address space of a peered virtual network.

1. In the search box at the top of the Azure portal, enter *virtual networks*. Select **Virtual networks** from the search results.
1. From the list of virtual networks, select the virtual network where you're adding an address range.
1. Under **Settings**, select **Address space**.
1. On the **Address space** page, add the address range per your requirements, and select **Save** when finished.

    :::image type="content" source="media/update-virtual-network-peering-address-space/add-address-range-thumb.png" alt-text="Screenshot of the Address Space page used to add an IP address range." lightbox="media/update-virtual-network-peering-address-space/add-address-range-full.png":::

1. Under **Settings**, select **Peering**, and sync the peering connection.
1. Under **Settings** for the peered virtual network, select **Address space** and verify that the address space listed has been updated.

## Delete an address range

In this task, you delete an IP address range from an address space. First, delete any existing subnets, and then delete the IP address range.

> [!IMPORTANT]
> Before you can delete an address space, it must be empty. If a subnet exists in the address range, you can't remove the address range. To remove an address range, you must first delete any subnets and any of the subnet's resources which exist in the address range.

1. In the search box at the top of the Azure portal, enter *virtual networks*. Select **Virtual networks** from the search results.
1. From the list of virtual networks, select the virtual network from which to remove the address range.
1. Under **Settings**, select **Subnets**.
1. To the right of the address range you want to remove, select **...** and select **Delete** from the dropdown list. Choose **Yes** to confirm deletion.

    :::image type="content" source="media/update-virtual-network-peering-address-space/delete-subnet.png" alt-text="Screenshot shows of Subnet page and menu for deleting a subnet.":::

1. Select **Save** after you complete your changes.
1. Under **Settings**, select **Peering** and sync the peering connection.
1. Under **Settings** for the peered virtual network, select **Address space** and verify that the address space listed has been updated.

## Next steps

- [Create, change, or delete a virtual network peering](virtual-network-manage-peering.md)
- [Create, change, or delete a virtual network](manage-virtual-network.md)
