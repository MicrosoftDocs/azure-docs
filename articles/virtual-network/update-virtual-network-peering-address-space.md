---
title: Updating the address space for a peered virtual network 
description: This article covers adding or deleting the address space for a peered virtual network without downtime
author: mbender-ms
ms.author: mbender
ms.service: virtual-network
ms.topic: how-to 
ms.date: 07/10/2022
ms.custom: template-how-to
---
# [H1 heading here]

<!-- 2. Introductory paragraph 
Required. Lead with a light intro that describes, in customer-friendly language, 
what the customer will learn, or do, or accomplish. Answer the fundamental “why 
would I want to do this?” question. Keep it short.
-->
[Reference](https://microsoft-my.sharepoint.com/:w:/p/lijay/EWehkqRi0uBFiV7VbEHwgH0BQjvKtNOCSHHlYrsjawEiUg?e=v58JPe&CID=1c6ffccd-0fc1-8e93-bd77-68287c61ceef)

In this article, you will learn how to update a peered virtual network by adding or deleting an address space without incurring downtime interruptions. This can be accomplished through the portal, and with AZ PowerShell or Azure CLI. 
[Add your introductory paragraph]

## Prerequisites

- <!-- prerequisite 1 -->
## Add or delete a peered virtual network address space in the Azure portal

### Add or remove an address range
To add or remove an address range:

1. In the search box at the top of the portal, enter *virtual networks* in the search box. When **Virtual networks** appear in the search results, select it.
2. From the list of virtual networks, select the virtual network for which you want to add or remove an address range.
3. Select **Address space**, under **SETTINGS**.
4. Complete one of the following options:
	- **Add an address range**: Enter the new address range. The address range can't overlap with an existing address range that is defined for the virtual network.
	- **Remove an address range**: On the right of the address range you want to remove, select **...**, then select **Remove**. If a subnet exists in the address range, you can't remove the address range. To remove an address range, you must first delete any subnets (and any resources in the subnets) that exist in the address range.
5. Select **Save**.

### Sync peering links
Perform a “sync” on the peering link from each of the peered remote virtual networks to this virtual network (1) on which the address change is made. This action is required for each remote peered VNet to learn of the newly added address prefix. 

To do this on the Azure portal, go to the peerings tab on the virtual network where the address update has been made. Select all the peerings that have peering status as “Remote sync required”, and then click the Sync button. This will ensure that all the remote peered virtual networks learn the updated address space of this virtual network. 

The sync can also be performed individually on the peering link from each remote peered virtual network, by going to the Peerings tab on the remote virtual networks. 

**Commands**

- Azure CLI: [az network vnet update](/cli/azure/network/vnet)
- PowerShell: [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork)

## Add or delete an address space using PowerShell

### Add or delete address space

### Sync peering link
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

## [Section n heading]
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

<!-- 5. Next steps
Required. Provide at least one next step and no more than three. Include some 
context so the customer can determine why they would click the link.
-->

## Next steps
<!-- Add a context sentence for the following links -->
- [Write how-to guides](contribute-how-to-write-howto.md)
- [Links](links-how-to.md)



## Next steps
<!-- Add a context sentence for the following links -->
- [Write concepts](contribute-how-to-write-concept.md)
- [Links](links-how-to.md)

