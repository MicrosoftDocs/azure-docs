---
title: Additional network requirements for SAP HANA on Azure (large instances) | Microsoft Docs
description: Additional network requirements for SAP HANA on Azure (large instances).
services: virtual-machines-linux
documentationcenter: 
author: msjuergent
manager: bburns
editor:

ms.service: virtual-machines-linux

ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 09/10/2018
ms.author: juergent
ms.custom: H1Hack27Feb2017

---

# Additional network requirements for large instances

You might have additional network requirements as part of a deployment of large instances of SAP HANA on Azure.

## Add more IP addresses or subnets

Use either the Azure portal, PowerShell, or the Azure CLI when you add more IP addresses or subnets.

Add the new IP address range as a new range to the virtual network address space, instead of generating a new aggregated range. Submit this change to Microsoft. This enables you to connect from that new IP address range to the HANA large instance units in your client. You can open an Azure support request to get the new virtual network address space added. After you receive confirmation, perform the next steps.

To create an additional subnet from the Azure portal, see [Create a virtual network using the Azure portal](../../../virtual-network/manage-virtual-network.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json#create-a-virtual-network). To create one from PowerShell, see [Create a virtual network using PowerShell](../../../virtual-network/manage-virtual-network.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json#create-a-virtual-network).

## Add virtual networks

After initially connecting one or more Azure virtual networks, you might want to connect additional ones that access SAP HANA on Azure (large instances). First, submit an Azure support request. In that request, include the specific information identifying the particular Azure deployment. Also include the IP address space range or ranges of the Azure virtual network address space. SAP HANA on Microsoft Service Management then provides the necessary information you need to connect the additional virtual networks and Azure ExpressRoute. For every virtual network, you need a unique authorization key to connect to the ExpressRoute circuit to HANA large instances.

## Increase ExpressRoute circuit bandwidth

Consult with SAP HANA on Microsoft Service Management. If they advise you to increase the bandwidth of the SAP HANA on Azure (large instances) ExpressRoute circuit, create an Azure support request. (You can request an increase for a single circuit bandwidth up to a maximum of 10 Gbps.) You then receive notification after the operation is complete; you don't need to do anything else to enable this higher speed in Azure.

## Add an additional ExpressRoute circuit

Consult with SAP HANA on Microsoft Service Management. If they advise you to add an additional ExpressRoute circuit, create an Azure support request (including a request to get authorization information to connect to the new circuit). Before making the request, you must define the address space used on the virtual networks. SAP HANA on Microsoft Service Management can then provide authorization.

When the new circuit is created, and the SAP HANA on Microsoft Service Management configuration is complete, you receive a notification with the information you need to proceed. You are not able to connect Azure virtual networks to this additional circuit if they are already connected to another SAP HANA on Azure (large instance) ExpressRoute circuit in the same Azure region.

## Delete a subnet

To remove a virtual network subnet, you can use the Azure portal, PowerShell, or the Azure CLI. If your Azure virtual network IP address range or address space was an aggregated range, there is no follow up for you with Microsoft. (Note, however, that the virtual network is still propagating the BGP route address space that includes the deleted subnet.) You might have defined the Azure virtual network address range or address space as multiple IP address ranges, of which one was assigned to your deleted subnet. Be sure to delete that from your virtual network address space. Then inform SAP HANA on Microsoft Service Management to remove it from the ranges that SAP HANA on Azure (large instances) is allowed to communicate with.

For more information, see [Delete a subnet](../../../virtual-network/virtual-network-manage-subnet.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json#delete-a-subnet).

## Delete a virtual network

For information, see [Delete a virtual network](../../../virtual-network/manage-virtual-network.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json#delete-a-virtual-network).

SAP HANA on Microsoft Service Management removes the existing authorizations on the SAP HANA on Azure (large instances) ExpressRoute circuit. It also removes the Azure virtual network IP address range or address space for the communication with HANA large instances.

After you remove the virtual network, open an Azure support request to provide the IP address space range or ranges to be removed.

To ensure you remove everything, delete the ExpressRoute connection, the virtual network gateway, the virtual network gateway public IP, and the virtual network.

## Delete an ExpressRoute circuit

To remove an additional SAP HANA on Azure (large instances) ExpressRoute circuit, open an Azure support request with SAP HANA on Microsoft Service Management. Request that the circuit be deleted. Within the Azure subscription, you may delete or keep the virtual network, as necessary. However, you must delete the connection between the HANA large instances ExpressRoute circuit and the linked virtual network gateway.

## Next steps

- [How to install and configure SAP HANA (large instances) on Azure](hana-installation.md)
