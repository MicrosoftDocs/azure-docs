---
title: Updating the address space for a peered virtual network 
description: Learn about adding or deleting the address space for a peered virtual network without downtime.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network
ms.topic: how-to 
ms.date: 07/10/2022
ms.custom: template-how-to
#Customer Intent: As a cloud engineer, I need to update the address space for peered virtual networks without incurring downtime from the current address spaces. I wish to do this in the Azure Portal.
---
# Updating the address space for a peered virtual network - Portal

[Reference](https://microsoft-my.sharepoint.com/:w:/p/lijay/EWehkqRi0uBFiV7VbEHwgH0BQjvKtNOCSHHlYrsjawEiUg?e=v58JPe&CID=1c6ffccd-0fc1-8e93-bd77-68287c61ceef)

In this article, you will learn how to update a peered virtual network by adding or deleting an address space without incurring downtime interruptions using the Azure Portal. This feature is useful when you need to grow or resize the virtual networks in Azure after scaling your workloads.

## Prerequisites

- An existing peered virtual network w/ two virtual networks
- If adding address space, ensure it does not overlap other address spaces

## Modifying the address range prefix of an existing address range (For example changing 10.1.0.0/16 to 10.1.0.0/18)
In this section, you will modify the address range prefix for an existing address range within your peered virtual network.

## ### Sync peering links

Perform a “sync” on the peering link from each of the peered remote virtual networks to this virtual network (1) on which the address change is made. This action is required for each remote peered VNet to learn of the newly added address prefix. 

To do this on the Azure portal, go to the peerings tab on the virtual network where the address update has been made. Select all the peerings that have peering status as “Remote sync required”, and then click the Sync button. This will ensure that all the remote peered virtual networks learn the updated address space of this virtual network. 

The sync can also be performed individually on the peering link from each remote peered virtual network, by going to the Peerings tab on the remote virtual networks. 

- Modifying the address range prefix of an existing address range (For example changing 10.1.0.0/16 to 10.1.0.0/18)
- Adding address ranges to a virtual network
- Deleting address ranges from a virtual network


## Add an address range

1. In the search box at the top of the portal, enter *virtual networks* in the search box. When **Virtual networks** appear in the search results, select it.
2. From the list of virtual networks, select the virtual network where you're adding an address range.
3. Select **Address space**, under **SETTINGS**.
4. Complete one of the following options:
	- **Add an address range**: Enter the new address range. The address range can't overlap with an existing address range that is defined for the virtual network.
5. Select **Save**.

## Delete an address range

1. In the search box at the top of the portal, enter *virtual networks* in the search box. When **Virtual networks** appear in the search results, select it.
2. From the list of virtual networks, select the virtual network where you're removing an address range.
3. Select **Address space**, under **SETTINGS**.
4. Complete one of the following options:
	- **Remove an address range**: On the right of the address range you want to remove, select **...**, then select **Remove**. If a subnet exists in the address range, you can't remove the address range. To remove an address range, you must first delete any subnets (and any resources in the subnets) that exist in the address range.
5. Select **Save**.

## Next steps
<!-- Add a context sentence for the following links -->
- [Learn how to Create, change, or delete an Azure virtual network peering]()
- [Links]()


