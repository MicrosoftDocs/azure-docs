---
title: Additional network requirements for SAP HANA on Azure (Large Instances) | Microsoft Docs
description: Additional network requirements for SAP HANA on Azure (Large Instances).
services: virtual-machines-linux
documentationcenter: 
author: RicksterCDN
manager: jeconnoc
editor:

ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 09/10/2018
ms.author: rclaus
ms.custom: H1Hack27Feb2017

---

# Additional network requirements

Sometimes you may have additional network requirements as part of HANA Large Instances deployment. This article illustrates the following network requirements:
- [Adding more IP addresses or subnet ](#adding-more-ip-addresses-or-subnets)
- [Adding virtual vetworks](#adding-vnets)
- [Increasing the express route circuit bandwidth](#increasing-expressroute-circuit-bandwidth)
- [Adding an additional express route circuit](#adding-an-additional-expressroute-circuit)
- [Deleting a subnet](#deleting-a-subnet)
- [Deleting a virtual network](#deleting-a-vnet)
- [Deleting an express router circuit](#deleting-an-expressroute-circuit)


## Adding more IP addresses or subnets

Use either the Azure portal, PowerShell, or CLI when adding more IP addresses or subnets.

In this case, the recommendation is to add the new IP address range as new range to the VNet Address Space instead of generating a new aggregated range. In either case, you need to submit this change to Microsoft to allow connectivity out of that new IP address range to the HANA Large Instance units in your client. You can open an Azure support request to get the new VNet Address space added. After you receive confirmation, perform the next steps.

To create an additional subnet from the Azure portal, see the article [Create a virtual network using the Azure portal](../../../virtual-network/manage-virtual-network.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json#create-a-virtual-network), and to create from PowerShell, see [Create a virtual network using PowerShell](../../../virtual-network/manage-virtual-network.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json#create-a-virtual-network).

## Adding VNets

After initially connecting one or more Azure VNets, you might want to add additional ones that access SAP HANA on Azure (Large Instances). First, submit an Azure support request, in that request include both the specific information identifying the particular Azure deployment, and the IP address space range(s) of the Azure VNet Address Space. SAP HANA on Azure Service Management then provides the necessary information you need to connect the additional VNets and ExpressRoute. For every VNet, you need a unique Authorization Key to connect to the ExpressRoute Circuit to HANA Large Instances.

Steps to add a new Azure VNet:

1. Complete the first step in the onboarding process, see the _Creating Azure VNet_ section.
2. Complete the second step in the onboarding process, see the _Creating gateway subnet_ section.
3. To connect your additional VNets to the HANA Large Instance ExpressRoute circuit, open an Azure support request with information on the new VNet and request a new Authorization Key.
4. Once notified that the authorization is complete, use the Microsoft-provided authorization information to complete the third step in the onboarding process, see the _Linking VNets_ section.

## Increasing ExpressRoute circuit bandwidth

Consult with SAP HANA on Azure Service Management. If you are advised to increase the bandwidth of the SAP HANA on Azure (Large Instances) ExpressRoute circuit, create an Azure support request. (You can request an increase for a single circuit bandwidth up to a maximum of 10 Gbps.) You then receive notification after the operation is complete; no additional action needed to enable this higher speed in Azure.

## Adding an additional ExpressRoute circuit

Consult with SAP HANA on Azure Service Management, if you are advised that an additional ExpressRoute circuit is needed, make an Azure support request to create a new ExpressRoute circuit (and to get authorization information to connect to it). The address space that is going be used on the VNets must be defined before making the request, in order for SAP HANA on Azure Service Management to provide authorization.

Once the new circuit is created and the SAP HANA on Azure Service Management configuration is complete, you are going to receive notification with the information you need to proceed. Follow the steps provided above for creating and connecting the new VNet to this additional circuit. You are not able to connect Azure VNets to this additional circuit if they already connected to another SAP HANA on Azure (Large Instance) ExpressRoute circuit in the same Azure Region.

## Deleting a subnet

To remove a VNet subnet, either the Azure portal, PowerShell, or CLI can be used. In case your Azure VNet IP address range/Azure VNet Address Space was an aggregated range, there is no follow up for you with Microsoft. Except that the VNet is still propagating BGP route address space that includes the deleted subnet. If you defined the Azure VNet IP address range/Azure VNet Address Space as multiple IP address ranges of which one was assigned to your deleted subnet, you should delete that out of your VNet Address Space and subsequently inform  SAP HANA on Azure Service Management to remove it from the ranges that SAP HANA on Azure (Large Instances) is allowed to communicate with.

To delete a subnet, see [Delete a subnet](../../../virtual-network/virtual-network-manage-subnet.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json#delete-a-subnet) for more information on creating subnets.

## Deleting a VNet

To delete a virtual network, see [Delete a virtual network](../../../virtual-network/manage-virtual-network.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json#delete-a-virtual-network). SAP HANA on Azure Service Management removes the existing authorizations on the SAP HANA on Azure (Large Instances) ExpressRoute circuit and remove the Azure VNet IP address range/Azure VNet Address Space for the communication with HANA Large Instances.

Once the VNet has been removed, open an Azure support request to provide the IP address space range(s) to be removed.

To ensure everything is removed, delete the following items:

- The ExpressRoute connection, VNet Gateway, VNet Gateway Public IP and, VNet

## Deleting an ExpressRoute circuit

To remove an additional SAP HANA on Azure (Large Instances) ExpressRoute circuit, open an Azure support request with SAP HANA on Azure Service Management and request that the circuit should be deleted. Within the Azure subscription, you may delete or keep the VNet as necessary. However, you must delete the connection between the HANA Large Instances ExpressRoute circuit and the linked VNet gateway.

If you also want to remove a VNet, follow the guidance on Deleting a VNet in the section above.

**Next steps**

- Refer [How to install and configure SAP HANA (large instances) on Azure](hana-installation.md).
