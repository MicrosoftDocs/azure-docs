---
title: Cannot delete a virtual network in Azure | Microsoft Docs
description: Learn how to troubleshoot the issue in which you cannot delete a virtual network in Azure.
services: virtual-network
documentationcenter: na
author: chadmath
manager: dcscontentpm
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
3. [Check whether Azure container instances still exist in the virtual network](#check-whether-azure-container-instances-still-exist-in-the-virtual-network).
4. [Check whether Azure Active Directory Domain Service is enabled in the virtual network](#check-whether-azure-active-directory-domain-service-is-enabled-in-the-virtual-network).
5. [Check whether the virtual network is connected to other resource](#check-whether-the-virtual-network-is-connected-to-other-resource).
6. [Check whether a virtual machine is still running in the virtual network](#check-whether-a-virtual-machine-is-still-running-in-the-virtual-network).
7. [Check whether the virtual network is stuck in migration](#check-whether-the-virtual-network-is-stuck-in-migration).

## Troubleshooting steps

### Check whether a virtual network gateway is running in the virtual network

To remove the virtual network, you must first remove the virtual network gateway.

For classic virtual networks, go to the **Overview** page of the classic virtual network in the Azure portal. In the **VPN connections** section, if the gateway is running in the virtual network, you will see the IP address of the gateway. 

![Check whether gateway is running](media/virtual-network-troubleshoot-cannot-delete-vnet/classic-gateway.png)

For virtual networks, go to the **Overview** page of the virtual network. Check **Connected devices** for the virtual network gateway.

![Screenshot of the list of Connected devices for a virtual network in Azure portal. The Virtual network gateway is highlighted in the list.](media/virtual-network-troubleshoot-cannot-delete-vnet/vnet-gateway.png)

Before you can remove the gateway, first remove any **Connection** objects in the gateway. 

### Check whether an application gateway is running in the virtual network

Go to the **Overview** page of the virtual network. Check the **Connected devices** for the application gateway.

![Screenshot of the list of Connected devices for a virtual network in Azure portal. The Application gateway is highlighted in the list.](media/virtual-network-troubleshoot-cannot-delete-vnet/app-gateway.png)

If there is an application gateway, you must remove it before you can delete the virtual network.

### Check whether Azure container instances still exist in the virtual network

1) Go to the Resource group in Azure portal, stay at the Overview blade.
2) Click on “Show hidden types” in the middle top of all the resources in the Resource group; Network profile is hidden on Azure Portal by default.
3) Select the Network profile related to the container groups.
4) Click Delete.

![Screenshot of the list of hidden networkprofiles.](media/virtual-network-troubleshoot-cannot-delete-vnet/container-instances.png)

Delete the subnet or virtual network again.

If the above steps do not work, please use these [Azure CLI commands](https://docs.microsoft.com/azure/container-instances/container-instances-vnet#clean-up-resources) to clean up resources. 

### Check whether Azure Active Directory Domain Service is enabled in the virtual network

If the Active Directory Domain Service is enabled and connected to the virtual network, you cannot delete this virtual network. 

![Screenshot of the Azure AD Domain Services screen in Azure portal. The Available in Virtual Network/Subnet field is highlighted.](media/virtual-network-troubleshoot-cannot-delete-vnet/enable-domain-services.png)

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

```azurepowershell
Move-AzureVirtualNetwork -VirtualNetworkName "Name" -Abort
```

## Next steps

- [Azure Virtual Network](virtual-networks-overview.md)
- [Azure Virtual Network frequently asked questions (FAQ)](virtual-networks-faq.md)
