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

You can configure Azure NetApp Files (ANF) volume with 'Standard' network features in one or more Virtual WAN spoke Virtual Network (VNet). This allows access to the file storage service globally across your Virtual WAN environment. Your Virtual WAN global deployments could include any combinations of different branches, Point-of-Presence (PoP), private users, offices, Azure virtual networks, and other multicloud deployments. You can use SD-WAN, site-to-site VPN, point-to-site VPN, and ExpressRoute to connect your different sites to a virtual hub. If you have multiple virtual hubs, all the hubs would be connected in full mesh in a standard Virtual WAN deployment. See [What is Azure Virtual WAN?](virtual-wan-about.md) to learn more about Virtual WAN. To learn more about Azure NetApp Files, see [What is Azure NetApp Files?](../azure-netapp-files/azure-netapp-files-introduction.md)

The following diagram shows the concept of deploying ANF volume in one or more spokes of a Virtual WAN and accessing the volumes globally.

:::image type="content" source="./media/configure-anf-on-vwan/virtualwan1.png" alt-text="conceptual illustration":::

In this article, let's look into how to deploy and access an ANF volume over Virtual WAN.

## Before you begin

Before you proceed with configuring ANF, confirm:

- You've configured at least one virtual hub within your Virtual WAN environment. For help with the virtual hub settings, see [About virtual hub settings](hub-settings.md).
- You've at least one spoke VNet connected to the virtual hub for deploying ANF volumes. For help, see [Connect a virtual network to a Virtual WAN hub](howto-connect-vnet-hub.md). 
- You've sufficient address space within the selected spoke VNet (at the least a /28 space) for creating a subnet dedicated for ANF.

## Deploying ANF volume

Once you've selected a spoke VNet, you can create the delegated ANF subnet within the VNet as part of the ANF deployment process. If you've already created the subnet, see [Delegate a subnet to Azure NetApp Files](../azure-netapp-files/azure-netapp-files-delegate-subnet.md).

Deploying ANF volume with Standard network features in a Virtual WAN spoke VNet is same as deploying it in any VNet. For deployment steps, see [Configure network features for an Azure NetApp Files volume](../azure-netapp-files/configure-network-features.md).

## Routing ANF traffic from on-premises via Azure Firewall

The following diagram shows routing traffic from on-premises to an ANF volume in a Virtual WAN spoke VNet via a Virtual WAN hub with a VPN gateway and an Azure firewall deployed inside the virtual hub.

:::image type="content" source="./media/configure-anf-on-vwan/gw2fw.png" alt-text="routing on-premises traffic via secure virtual hub":::

To learn how to install an Azure Firewall in a Virtual WAN hub, see [Configure Azure Firewall in a Virtual WAN hub](howto-firewall.md). To force different traffic flows via the Azure Firewall installed in the hub, see [How to configure Virtual WAN Hub routing intent and routing policies](how-to-routing-policies.md).

To force the ANF bound traffic through Azure Firewall in the Virtual WAN hub, the effective routes of the virtual hub should have the specific IP address of the ANF volume pointing to the Azure Firewall. The following Azure portal clip shows an example virtual hub effective routes. Note the listing of 10.2.0.5/32. The static routing entry's destination prefix is [IP-ANF-Volume]/32 and the next hop is [Azure-firewall-in-hub].

:::image type="content" source="./media/configure-anf-on-vwan/effectiveroutes.png" alt-text="inclusion of specific routes in virtual hub effective routes":::

> [!important] 
> ANF mount leverages Azure Private Endpoint. Therefore, the specific IP address entry is required even if a CIDR to which the ANF volume IP address belongs is pointing to the Azure Firewall as its next hop. For example, 10.2.0.5/32 should be listed even though 10.0.0.0/8 is listed with the Azure Firewall as the next hop.
>

## Listing ANF volume IP under virtual hub effective routes

### What is the private IP address associated with my ANF volume?

The following Azure portal clip shows an example NetApp account volume list. You can see the private IP address associated with an ANF volume is listed as part of the mount path of the volume.

:::image type="content" source="./media/configure-anf-on-vwan/anfvolumes.png" alt-text="private IP address of an ANF volume is listed as part of its mount path":::

### Editing virtual hub effective routes

You can effect changes to a virtual hub's effective routes by adding routes explicitly to the virtual hub's route table. The following Azure portal clip shows how to select the associated route table of a virtual hub.

:::image type="content" source="./media/configure-anf-on-vwan/virtualhub-routetable.png" alt-text="virtual hub route table":::

The following Azure portal clip shows the edit of the example route table.

:::image type="content" source="./media/configure-anf-on-vwan/routetable-edit.png" alt-text="route table edits":::

## Next steps

In this article, we discussed about deploying and accessing an ANF volume over Virtual WAN. To automatically back up your NetApp files, see [Understand Azure NetApp Files backup](../azure-netapp-files/backup-introduction.md). For geo-redundant protection, see [Cross-region replication of Azure NetApp Files volumes](../azure-netapp-files/cross-region-replication-introduction.md).

To learn about designing your Virtual WAN deployment to withstand disasters, see [Disaster recovery design](disaster-recovery-design.md). To migrate from a classical hub-and-spoke Azure networking model to Virtual WAN, see [Migrate to Azure Virtual WAN](migrate-from-hub-spoke-topology.md)
