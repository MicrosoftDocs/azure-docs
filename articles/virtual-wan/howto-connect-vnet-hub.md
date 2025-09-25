---
title: 'Connect a VNet to a Virtual WAN hub - portal'
titleSuffix: Azure Virtual WAN
description: Learn how to connect a VNet to a Virtual WAN hub using the portal.
author: cherylmc
ms.service: azure-virtual-wan
ms.topic: how-to
ms.date: 03/26/2025
ms.author: cherylmc

---
# Connect a virtual network to a Virtual WAN hub - portal

This article helps you connect your virtual network to your virtual hub using the Azure portal. You can also use [PowerShell](howto-connect-vnet-hub-powershell.md) to complete this task. Repeat these steps for each VNet that you want to connect.

Before you create a connection, be aware of the following:

* A virtual network can only be connected to one virtual hub at a time.
* In order to connect it to a virtual hub, the remote virtual network can't have a gateway (ExpressRoute or VPN) or RouteServer.
* To create a cross-tenant virtual network connection to the virtual hub, refer to [Connect cross-tenant virtual networks to a Virtual WAN hub](cross-tenant-vnet.md)

> [!IMPORTANT]
> * If VPN gateways are present in the virtual hub, this operation as well as any other write operation on the connected VNet can cause disconnection to Point-to-site clients as well as reconnection of site-to-site tunnels and BGP sessions.

## Add a connection

[!INCLUDE [Connect](../../includes/virtual-wan-connect-vnet-hub-include.md)]

> [!NOTE]
>
> * To delete a virtual network connected to the virtual hub, you must delete both the virtual network connection and virtual network resource. 

## Understanding Bypass Next Hop IP for workloads within this VNet
[!INCLUDE [Bypass Next Hop IP](../../includes/virtual-wan-bypass-next-hop-ip-include.md)]

## Next steps

For more information about Virtual WAN, see the [Virtual WAN FAQ](virtual-wan-faq.md).
