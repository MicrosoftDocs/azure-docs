---
title: Add or remove a subnet delegation in an Azure virtual network
titlesuffix: Azure Virtual Network
description: Learn how to add or remove a delegated subnet for a service in Azure in Azure.
services: virtual-network
documentationcenter: na
author: KumudD
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/01/2019
ms.author: kumud
---

# Add or remove a subnet delegation

Subnet delegation gives explicit permissions to the service to create service-specific resources in the subnet using a unique identifier when deploying the service. This article describes how to add or remove a delegated subnet for an Azure service.

## Sign in to Azure

Sign in to the Azure portal at https://portal.azure.com.

## Create the virtual network

In this section, you create a virtual network and the subnet that you will later delegate to an Azure service.

1. On the upper-left side of the screen, select **Create a resource** > **Networking** > **Virtual network**.
1. In **Create virtual network**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter *MyVirtualNetwork*. |
    | Address space | Enter *10.0.0.0/16*. |
    | Subscription | Select your subscription.|
    | Resource group | Select **Create new**, enter *myResourceGroup*, then select **OK**. |
    | Location | Select **EastUS**.|
    | Subnet - Name | Enter *mySubnet*. |
    | Subnet - Address range | Enter *10.0.0.0/24*. |
    |||
1. Leave the rest as default, and then select **Create**.

## Permissons

If you didn't create the subnet you would like to delegate to an Azure service, you need the follwoing permission: `Microsoft.Network/virtualNetworks/subnets/write`.

The built-in [Network Contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role also contains the necessary permissions.

## Delegate a subnet to an Azure service

In this section, you delegate the subnet that you created in the preceding section to an Azure service.

1. In the portal's search bar, enter *myVirtualNetwork*. When **myVirtualNetwork** appears in the search results, select it.
2. In the search results, select *myVirtualNetwork*.
3. Select **Subnets**, under **SETTINGS**, and then select **mySubnet**.
4. On the *mySubnet* page, for the **Subnet delegation** list, select from the services listed under **Delegate subnet to a service** (for example, **Microsoft.DBforPostgreSQL/serversv2**).  

## Remove subnet delegation from an Azure service

1. In the portal's search bar, enter *myVirtualNetwork*. When **myVirtualNetwork** appears in the search results, select it.
2. In the search results, select *myVirtualNetwork*.
3. Select **Subnets**, under **SETTINGS**, and then select **mySubnet**.
4. In *mySubnet* page, for the **Subnet delegation** list, select **None** from the services listed under **Delegate subnet to a service**. 

## Next steps
- Learn how to [manage subnets in Azure](virtual-network-manage-subnet.md).
