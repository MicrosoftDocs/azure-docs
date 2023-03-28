---
title: Other network requirements for SAP HANA on Azure (Large Instances) | Microsoft Docs
description: Learn about added network requirements for SAP HANA on Azure (Large Instances) that you might have.
services: virtual-machines-linux
documentationcenter: 
author: lauradolan
manager: bburns
editor:
ms.service: sap-on-azure
ms.subservice: sap-large-instances
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 6/3/2021
ms.author: ladolan
ms.custom: H1Hack27Feb2017

---

# Other network requirements for Large Instances

In this article, we'll look at other network requirements you may have when deploying SAP HANA Large Instances on Azure.

## Prerequisites

This article assumes you've completed the steps in:
- [Connecting Azure VMs to HANA Large Instances](hana-connect-azure-vm-large-instances.md)
- [Connect a virtual network to HANA Large Instances](hana-connect-vnet-express-route.md)

## Add more IP addresses or subnets

You may find you need to add more IP addresses or subnets. Use either the Azure portal, PowerShell, or the Azure CLI when you add more IP addresses or subnets.

Add the new IP address range as a new range to the virtual network address space. Don't generate a new aggregated range. Submit this change to Microsoft. This way you can connect from that new IP address range to the HANA Large Instances in your client. You can open an Azure support request to get the new virtual network address space added. Once you receive confirmation, do the steps discussed in [Connecting Azure VMs to HANA Large Instances](hana-connect-azure-vm-large-instances.md). 

To create another subnet from the Azure portal, see [Create a virtual network using the Azure portal](../../virtual-network/manage-virtual-network.md#create-a-virtual-network). To create one from PowerShell, see [Create a virtual network using PowerShell](../../virtual-network/manage-virtual-network.md#create-a-virtual-network).

## Add virtual networks

After initially connecting one or more Azure virtual networks, you might want to connect more virtual networks that access SAP HANA on Azure (Large Instances). First, submit an Azure support request. In that request, include the specific information identifying the particular Azure deployment. Also include the IP address space range or ranges of the Azure virtual network address space. SAP HANA on Microsoft Service Management then provides the necessary information you need to connect the added virtual networks and Azure ExpressRoute. For every virtual network, you need a unique authorization key to connect to the ExpressRoute circuit to HANA Large Instances.

## Increase ExpressRoute circuit bandwidth

Consult with SAP HANA on Microsoft Service Management. If they advise you to increase the bandwidth of the SAP HANA on Azure (Large Instances) ExpressRoute circuit, create an Azure support request. (You can request an increase for a single circuit bandwidth up to a maximum of 10 Gbps.) You then receive notification after the operation is complete; you don't need to do anything else to enable this higher speed in Azure.

## Add another ExpressRoute circuit

Consult with SAP HANA on Microsoft Service Management. If they advise you to add another ExpressRoute circuit, create an Azure support request (including a request to get authorization information to connect to the new circuit). Before making the request, you must define the address space used on the virtual networks. SAP HANA on Microsoft Service Management can then provide authorization.

When the new circuit is created, and the SAP HANA on Microsoft Service Management configuration is complete, you'll receive notification with the information you need to continue. You can't connect Azure virtual networks to this added circuit if they're already connected to another SAP HANA on Azure (Large Instance) ExpressRoute circuit in the same Azure region.

## Delete a subnet

To remove a virtual network subnet, you can use the Azure portal, PowerShell, or the Azure CLI. If your Azure virtual network IP address range or address space was an aggregated range, you don't have to take any action with Microsoft. (The virtual network is still propagating the BGP route address space that includes the deleted subnet.) 

You might have defined the Azure virtual network address range or address space as multiple IP address ranges. One of these ranges could have been assigned to your deleted subnet. Be sure to delete that from your virtual network address space. Then inform SAP HANA on Microsoft Service Management to remove it from the ranges that SAP HANA on Azure (Large Instances) is allowed to communicate with.

For more information, see [Delete a subnet](../../virtual-network/virtual-network-manage-subnet.md#delete-a-subnet).

## Delete a virtual network

For information, see [Delete a virtual network](../../virtual-network/manage-virtual-network.md#delete-a-virtual-network).

SAP HANA on Microsoft Service Management removes the existing authorizations on the SAP HANA on Azure (Large Instances) ExpressRoute circuit. It also removes the Azure virtual network IP address range or address space for the communication with HANA Large Instances.

After you remove the virtual network, open an Azure support request to provide the IP address space range or ranges to be removed.

Be sure you remove everything. Delete the:
- ExpressRoute connection
- Virtual network gateway
- Virtual network gateway public IP
- Virtual network

## Delete an ExpressRoute circuit

To remove an extra SAP HANA on Azure (Large Instances) ExpressRoute circuit, open an Azure support request with SAP HANA on Microsoft Service Management. Request that they delete the circuit. Within the Azure subscription, you may delete or keep the virtual network as needed. However, you must delete the connection between the HANA Large Instances ExpressRoute circuit and the linked virtual network gateway.

## Next steps

Learn how to install and configure SAP HANA (Large Instances) on Azure.

> [!div class="nextstepaction"]
> [Install and configure SAP HANA (Large Instances)](hana-installation.md)
