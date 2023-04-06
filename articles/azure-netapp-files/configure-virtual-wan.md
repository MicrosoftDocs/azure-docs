---
title: Configure Virtual WAN for Azure NetApp Files | Microsoft Docs
description: Describes guidelines to help you configure Azure NetApp files on Azure Virtual WAN.
services: azure-netapp-files, virtual-wan
author: rambk
ms.service: azure-netapp-files
ms.topic: conceptual
ms.date: 03/24/2023
ms.author: rambala
---
# Configure Virtual WAN for Azure NetApp Files (preview)

You can configure Azure NetApp Files volumes with Standard network features in one or more Virtual WAN spoke virtual networks (VNets). Virtual WAN spoke VNets allow access to the file storage service globally across your Virtual WAN environment.

Your Virtual WAN global deployments could include any combinations of different branches, Point-of-Presence (PoP), private users, offices, Azure virtual networks, and other multicloud deployments. You can use SD-WAN, site-to-site VPN, point-to-site VPN, and ExpressRoute to connect your different sites to a virtual hub. If you have multiple virtual hubs, all the hubs would be connected in full mesh in a standard Virtual WAN deployment.

Refer to [What is Azure Virtual WAN?](../virtual-wan/virtual-wan-about.md) to learn more about Virtual WAN.

The following diagram shows the concept of deploying Azure NetApp Files volume in one or more spokes of a Virtual WAN and accessing the volumes globally.

:::image type="content" source="../media/azure-netapp-files/virtual-wan-1.png" alt-text="Conceptual illustration of virtual wan setup.":::

This article will explain how to deploy and access an Azure NetApp Files volume over Virtual WAN.

## Considerations

* You should be familiar with network policies for Azure NetApp Files [private endpoints](../private-link/disable-private-endpoint-network-policy.md). Refer to [Route Azure NetApp Files traffic from on-premises via Azure Firewall](#route-azure-netapp-files-traffic-from-on-premises-via-azure-firewall) for further information.

## Before you begin

Before you proceed with configuring virtual WAN for Azure NetApp Files, confirm:

* You've configured at least one virtual hub within your Virtual WAN environment. For help with the virtual hub settings, refer to [About virtual hub settings](../virtual-wan/hub-settings.md).
* You've connected at least one spoke VNet to the virtual hub for deploying Azure NetApp Files volumes. For help, refer to [Connect a virtual network to a Virtual WAN hub](../virtual-wan/howto-connect-vnet-hub.md). 
* You have sufficient address space within the selected spoke VNet (at the least a /28 space) for creating a subnet dedicated for Azure NetApp Files.

## Deploy an Azure NetApp Files volume

Once you've selected a spoke VNet, you can create the delegated Azure NetApp Files subnet within the VNet as part of the Azure NetApp Files deployment process. If you've already created the subnet, refer [Delegate a subnet to Azure NetApp Files](azure-netapp-files-delegate-subnet.md).

Deploying Azure NetApp Files volume with Standard network features in a Virtual WAN spoke VNet is the same process as deploying it in any VNet. For deployment steps, refer to [Configure network features for an Azure NetApp Files volume](configure-network-features.md).

## Route Azure NetApp Files traffic from on-premises via Azure Firewall

This diagram shows routing traffic from on-premises to an Azure NetApp Files volume in a Virtual WAN spoke VNet via a Virtual WAN hub with a VPN gateway and an Azure firewall deployed inside the virtual hub.

:::image type="content" source="../media/azure-netapp-files/azure-netapp-files-vnet-diagram.png" alt-text="Diagram of routing on-premises traffic via secure virtual hub.":::

To learn how to install an Azure Firewall in a Virtual WAN hub, refer [Configure Azure Firewall in a Virtual WAN hub](../virtual-wan/howto-firewall.md).

To force different traffic flows via the Azure Firewall installed in the hub, see [How to configure Virtual WAN Hub routing intent and routing policies](../virtual-wan/how-to-routing-policies.md).

To force the Azure NetApp Files-bound traffic through Azure Firewall in the Virtual WAN hub, the effective routes of the virtual hub should have the specific IP address of the Azure NetApp Files volume pointing to the Azure Firewall.

The following image of the Azure portal shows an example virtual hub of effective routes. In the first item, the IP address is listed as 10.2.0.5/32. The static routing entry's destination prefix is `<IP-Azure NetApp Files-Volume>/32`, and the next hop is `Azure-Firewall-in-hub`.

:::image type="content" source="../media/azure-netapp-files/effective-routes.png" alt-text="Screenshot of effective routes in Azure portal.":::

> [!IMPORTANT] 
> Azure NetApp Files mount leverages Azure Private Endpoint. The specific IP address entry is required, even if a CIDR to which the Azure NetApp Files volume IP address belongs is pointing to the Azure Firewall as its next hop. For example, 10.2.0.5/32 should be listed even though 10.0.0.0/8 is listed with the Azure Firewall as the next hop.

## List Azure NetApp Files volume IP under virtual hub effective routes

To identify the private IP address associated with your Azure NetApp Files volume:
1. Navigate to the **Volumes** in your Azure NetApp Files subscription. 
1. Identify the volume you're looking for. The private IP address associated with an Azure NetApp Files volume is listed as part of the mount path of the volume.

:::image type="content" source="../media/azure-netapp-files/virtual-wan-volumes-list.png" alt-text="Screenshot showing the private IP address of an Azure NetApp Files volume  listed as part of its mount path." lightbox="../media/azure-netapp-files/virtual-wan-volumes-list.png":::

### Edit virtual hub effective routes

You can effect changes to a virtual hub's effective routes by adding routes explicitly to the virtual hub's route table.

1. In the virtual hub, navigate to **Route Tables**.
1. Select the route table you want to edit.
    :::image type="content" source="../media/azure-netapp-files/virtual-hub-route-table.png" alt-text="Screenshot of virtual hub route table.":::
1. Choose a **Route name** then add the **Destination prefix** and **Next hop**.
    :::image type="content" source="../media/azure-netapp-files/route-table-edit.png" alt-text="Screenshot of route table edits.":::
1. Save your changes. 

## Next steps

* [Understand Azure NetApp Files backup](backup-introduction.md)
* [Cross-region replication of Azure NetApp Files volumes](cross-region-replication-introduction.md)
* [Disaster recovery design](../virtual-wan/disaster-recovery-design.md)
* [Migrate to Azure Virtual WAN](../virtual-wan/migrate-from-hub-spoke-topology.md)
* [Virtual WAN routing deep dive](../virtual-wan/routing-deep-dive.md)