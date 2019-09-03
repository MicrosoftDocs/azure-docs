---
title: Cannot delete a virtual network in Azure | Microsoft Docs
description: Learn how to troubleshoot the issue in which you cannot delete a virtual network in Azure.
services: virtual-network
documentationcenter: na
author: chadmath
manager: cshepard
editor: ''
tags: azure-resource-manager

ms.service: virtual-network
ms.devlang: na
ms.topic: troubleshooting
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/31/2018
ms.author: genli

---

# Troubleshooting: Failed to delete a virtual network in Azure

You might receive errors when you try to delete a virtual network in Microsoft Azure. This article provides troubleshooting steps to help you resolve this problem. 

[!INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## Troubleshooting guidance 

1. [Check whether a virtual network gateway is running in the virtual network](#check-whether-a-virtual-network-gateway-is-running-in-the-virtual-network).
2. [Check whether an application gateway is running in the virtual network](#check-whether-an-application-gateway-is-running-in-the-virtual-network).
3. [Check whether Azure Active Directory Domain Service is enabled in the virtual network](#check-whether-azure-active-directory-domain-service-is-enabled-in-the-virtual-network).
4. [Check whether the virtual network is connected to other resource](#check-whether-the-virtual-network-is-connected-to-other-resource).
5. [Check whether a virtual machine is still running in the virtual network](#check-whether-a-virtual-machine-is-still-running-in-the-virtual-network).
6. [Check whether the virtual network is stuck in migration](#check-whether-the-virtual-network-is-stuck-in-migration).

## Troubleshooting steps

### Check whether a virtual network gateway is running in the virtual network

To remove the virtual network, you must first remove the virtual network gateway.

For classic virtual networks, go to the **Overview** page of the classic virtual network in the Azure portal. In the **VPN connections** section, if the gateway is running in the virtual network, you will see the IP address of the gateway. 

![Check whether gateway is running](media/virtual-network-troubleshoot-cannot-delete-vnet/classic-gateway.png)

For virtual networks, go to the **Overview** page of the virtual network. Check **Connected devices** for the virtual network gateway.

![Check the connected device](media/virtual-network-troubleshoot-cannot-delete-vnet/vnet-gateway.png)

Before you can remove the gateway, first remove any **Connection** objects in the gateway. 

### Check whether an application gateway is running in the virtual network

Go to the **Overview** page of the virtual network. Check the **Connected devices** for the application gateway.

![Check the connected device](media/virtual-network-troubleshoot-cannot-delete-vnet/app-gateway.png)

If there is an application gateway, you must remove it before you can delete the virtual network.

### Check whether Azure Active Directory Domain Service is enabled in the virtual network

If the Active Directory Domain Service is enabled and connected to the virtual network, you cannot delete this virtual network. 

![Check the connected device](media/virtual-network-troubleshoot-cannot-delete-vnet/enable-domain-services.png)

To disable the service, see [Disable Azure Active Directory Domain Services using the Azure portal](../active-directory-domain-services/delete-aadds.md).

### Check whether the virtual network is connected to other resource

Check for Circuit Links, connections, and virtual network peerings. Any of these can cause a virtual network deletion to fail. 

The recommended deletion order is as follows:

1. Gateway connections
2. Gateways
3. IPs
4. Virtual network peerings
5. App Service Environment (ASE)

### Check whether a virtual machine is still running in the virtual network

Make sure that no virtual machine is in the virtual network.

### Check whether the virtual network is stuck in migration

If the virtual network is stuck in a migration state, it cannot be deleted. Run the following command to abort the migration, and then delete the virtual network.

    Move-AzureVirtualNetwork -VirtualNetworkName "Name" -Abort

## Next steps

- [Azure Virtual Network](virtual-networks-overview.md)
- [Azure Virtual Network frequently asked questions (FAQ)](virtual-networks-faq.md)
