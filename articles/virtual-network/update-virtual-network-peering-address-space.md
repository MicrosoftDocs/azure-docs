---
title: Updating the address space for a peered virtual network 
description: Learn about adding or deleting the address space for a peered virtual network without downtime.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.topic: how-to 
ms.date: 07/10/2022
ms.custom: template-how-to
#Customer Intent: As a cloud engineer, I need to update the address space for peered virtual networks without incurring downtime from the current address spaces. I wish to do this in the Azure Portal.
---

# Updating the address space for a peered virtual network - Portal

In this article, you'll learn how to update a peered virtual network by adding or deleting an address space without incurring downtime interruptions using the Azure portal. This feature is useful when you need to grow or resize the virtual networks in Azure after scaling your workloads.

## Prerequisites

- An existing peered virtual network w/ two virtual networks
- If adding address space, ensure it doesn't overlap other address spaces

## Modifying the address range prefix of an existing address range (For example changing 10.1.0.0/16 to 10.1.0.0/18)
In this section, you'll modify the address range prefix for an existing address range within your peered virtual network.
1. In the search box at the top of the portal, enter *virtual networks* in the search box. When **Virtual networks** appear in the search results, select it.
2. From the list of virtual networks, select the virtual network where you're adding an address range.
1. Select **Address space** under settings.
1. On the **Address space** page, change the address range prefix per your requirements, and select **Save** when finished.

    :::image type="content" source="media/update-virtual-network-peering-address-space/update-address-prefix-thumb.png" alt-text="Image of the Address Space page for changing a sugnet's prefix" lightbox="media/update-virtual-network-peering-address-space/update-address-prefix-full.png":::
1. Select **Peerings** under Settings and select the checkbox for the peering requiring synchronization.
1. Select **Sync** from the task bar.

    :::image type="content" source="media/update-virtual-network-peering-address-space/sync-peering-thumb.png" alt-text="Image of the Peerings page where you re-syncronize a peering connection." lightbox="media/update-virtual-network-peering-address-space/sync-peering-full.png":::
1. Select the name of the other peered virtual network under **Peer**.
1. Under **Settings** of the peered virtual network, select **Address space** and verify that the Address space listed has been updated.

    :::image type="content" source="media/update-virtual-network-peering-address-space/verify-address-space-thumb.png" alt-text="Image the Address Space page where you verify the address space has changed." lightbox="media/update-virtual-network-peering-address-space/verify-address-space-full.png":::

> [!NOTE]
> When an update is made to the address space for a virtual network, you will need to sync the virtual network peer for each remote peered VNet to learn of the new address space updates. We recommend that you run sync after every resize address space operation instead of performing multiple resizing operations and then running the sync operation.
>
> The following actions will require a sync:
> - Modifying the address range prefix of an existing address range (For example changing 10.1.0.0/16 to 10.1.0.0/18)
> - Adding address ranges to a virtual network
> - Deleting address ranges from a virtual network
## Add an address range
In this section, you'll add an IP address range to the IP address space of a peered virtual network.

1. In the search box at the top of the portal, enter *virtual networks* in the search box. When **Virtual networks** appear in the search results, select it.
2. From the list of virtual networks, select the virtual network where you're adding an address range.
3. Select **Address space**, under **Settings**.
4. On the **Address space** page, add the address range per your requirements, and select **Save** when finished.

    ::image type="content" source="media/update-virtual-network-peering-address-space/add-address-range-thumb.png" alt-text="Image of the Address Space page used to add an IP address range." lightbox="media/update-virtual-network-peering-address-space/add-address-range-full.png":::
1. Select **Peering**, under **Settings** and **Sync** the peering connection.
1. As previously done, verify the address space is updated on the remote virtual network.
## Delete an address range
In this task, you'll delete an IP address range from an address space. First, you'll delete any existing subnets, and then delete the IP address range.

> [!Important]
> Before you can delete an address space, it must be empty. If a subnet exists in the address range, you can't remove the address range. To remove an address range, you must first delete any subnets and any of the subnet's resources which exist in the address range.

1. In the search box at the top of the portal, enter *virtual networks* in the search box. When **Virtual networks** appear in the search results, select it.
2. From the list of virtual networks, select the virtual network where you're removing an address range.
1. Select **Subnets**, under **settings**
1. On the right of the address range you want to remove, select **...** and select **Delete** from the dropdown list. Choose **Yes** to confirm deletion.

    :::image type="content" source="media/update-virtual-network-peering-address-space/delete-subnet.png" alt-text="Image of Subnet page and menu for deleting a subnet.":::
1. Select **Save** when you've completed all changes.
1. 1. Select **Peering**, under **Settings** and **Sync** the peering connection.
1. As previously done, verify the address space is updated on the remote virtual network.

## Next steps
- [Learn how to Create, change, or delete an Azure virtual network peering]()
- [Links]()



