---
title: 'Guidelines for configuring Azure NetApp Files on Virtual WAN'
description: Describes guidelines to help you configure Azure NetApp files on Azure Virtual WAN.
services: azure-netapp-files, virtual-wan
author: rambk
ms.service: azure-netapp-files
ms.service: virtual-wan
ms.topic: conceptual
ms.date: 10/11/2022
ms.author: rambala
---
# Guidelines for configuring Azure NetApp Files on Virtual WAN

You can configure Azure NetApp Files volumes with Standard network features in one or more Virtual WAN spoke virtual networks (VNets). This allows access to the file storage service globally across your Virtual WAN environment.

Your Virtual WAN global deployments could include any combinations of different branches, Point-of-Presence (PoP), private users, offices, Azure virtual networks, and other multicloud deployments. You can use SD-WAN, site-to-site VPN, point-to-site VPN, and ExpressRoute to connect your different sites to a virtual hub. If you have multiple virtual hubs, all the hubs would be connected in full mesh in a standard Virtual WAN deployment.

See [What is Azure Virtual WAN?](../virtual-wan/virtual-wan-about.md) to learn more about Virtual WAN. To learn more about Azure NetApp Files, see [What is Azure NetApp Files?](azure-netapp-files-introduction.md)

The following diagram shows the concept of deploying Azure NetApp Files volume in one or more spokes of a Virtual WAN and accessing the volumes globally.

:::image type="content" source="../media/azure-netapp-files/virtualwan1.png" alt-text="conceptual illustration":::

In this article, let's look into how to deploy and access an Azure NetApp Files volume over Virtual WAN.

## Before you begin

Before you proceed with configuring Azure NetApp Files, confirm:

- You've configured at least one virtual hub within your Virtual WAN environment. For help with the virtual hub settings, see [About virtual hub settings](../virtual-wan/hub-settings.md).
- You've connected at least one spoke VNet to the virtual hub for deploying Azure NetApp Files volumes. For help, see [Connect a virtual network to a Virtual WAN hub](../virtual-wan/howto-connect-vnet-hub.md). 
- You have sufficient address space within the selected spoke VNet (at the least a /28 space) for creating a subnet dedicated for Azure NetApp Files.

## Deploying Azure NetApp Files volume

Once you've selected a spoke VNet, you can create the delegated Azure NetApp Files subnet within the VNet as part of the Azure NetApp Files deployment process. If you've already created the subnet, see [Delegate a subnet to Azure NetApp Files](azure-netapp-files-delegate-subnet.md).

Deploying Azure NetApp Files volume with Standard network features in a Virtual WAN spoke VNet is the same process as deploying it in any VNet. For deployment steps, see [Configure network features for an Azure NetApp Files volume](configure-network-features.md).

## Route Azure NetApp Files traffic from on-premises via Azure Firewall

The following diagram shows routing traffic from on-premises to an Azure NetApp Files volume in a Virtual WAN spoke VNet via a Virtual WAN hub with a VPN gateway and an Azure firewall deployed inside the virtual hub.

:::image type="content" source="../media/azure-netapp-files/azure-netapp-files-vnet-diagram.png" alt-text="Diagram of routing on-premises traffic via secure virtual hub":::

To learn how to install an Azure Firewall in a Virtual WAN hub, see [Configure Azure Firewall in a Virtual WAN hub](../virtual-vwan/howto-firewall.md). To force different traffic flows via the Azure Firewall installed in the hub, see [How to configure Virtual WAN Hub routing intent and routing policies](../virtual-vwan/how-to-routing-policies.md).

To force the Azure NetApp Files bound traffic through Azure Firewall in the Virtual WAN hub, the effective routes of the virtual hub should have the specific IP address of the Azure NetApp Files volume pointing to the Azure Firewall. The following image of the Azure portal shows an example virtual hub effective routes. Note the listing of 10.2.0.5/32. The static routing entry's destination prefix is `<IP-Azure NetApp Files-Volume>/32` and the next hop is `Azure-firewall-in-hub`.

:::image type="content" source="../virtual-wan/media/howto-private-link/effective-routes.png" alt-text="inclusion of specific routes in virtual hub effective routes":::

> [!IMPORTANT] 
> Azure NetApp Files mount leverages Azure Private Endpoint. Therefore, the specific IP address entry is required even if a CIDR to which the Azure NetApp Files volume IP address belongs is pointing to the Azure Firewall as its next hop. For example, 10.2.0.5/32 should be listed even though 10.0.0.0/8 is listed with the Azure Firewall as the next hop.

## Listing Azure NetApp Files volume IP under virtual hub effective routes

### What is the private IP address associated with my Azure NetApp Files volume?

The following Azure Portal screenshot shows an example NetApp account volume list. The private IP address associated with an Azure NetApp Files volume is listed as part of the mount path of the volume.

:::image type="content" source="../media/azure-netapp-files/anfvolumes.png" alt-text="private IP address of an Azure NetApp Files volume is listed as part of its mount path":::

### Editing virtual hub effective routes

You can effect changes to a virtual hub's effective routes by adding routes explicitly to the virtual hub's route table. The following Azure Portal screenshot illustrates how to select the associated route table of a virtual hub.

:::image type="content" source="../media/azure-netapp-files/virtualhub-routetable.png" alt-text="Virtual hub route table":::

The following Azure Portal clip shows the edit of the example route table.

:::image type="content" source="../media/azure-netapp-files/routetable-edit.png" alt-text="route table edits":::

## Next steps

* [Understand Azure NetApp Files backup](backup-introduction.md)
* [Cross-region replication of Azure NetApp Files volumes](cross-region-replication-introduction.md)
* [Disaster recovery design](../virtual-wan/disaster-recovery-design.md)
* [Migrate to Azure Virtual WAN](../virtual-wan/migrate-from-hub-spoke-topology.md)
