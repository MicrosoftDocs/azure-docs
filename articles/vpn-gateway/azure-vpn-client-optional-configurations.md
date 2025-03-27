---
title: 'Configure Azure VPN Client optional settings'
titleSuffix: Azure VPN Gateway
description: Learn how to configure optional configuration settings for the Azure VPN Client. Settings include DNS suffixes, custom DNS servers, custom routes, and VPN client forced tunneling.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 03/07/2025
ms.author: cherylmc

---
# Azure VPN Client - configure optional DNS and routing settings

This article helps you configure optional settings for the Azure VPN Client for VPN Gateway point-to-site (P2S) connections. You can configure DNS suffixes, custom DNS servers, custom routes, and VPN client-side forced tunneling.

> [!NOTE]
> The Azure VPN Client is only supported for OpenVPN® protocol connections.

## Prerequisites

The steps in this article assume that you configured your P2S gateway and downloaded the Azure VPN Client to connecting client computers. For steps, see the following articles:

* [Certificate authentication](point-to-site-certificate-gateway.md)
* [Microsoft Entra ID authentication](point-to-site-entra-gateway.md)

[!INCLUDE [Configuration steps](../../includes/vpn-gateway-vwan-azure-vpn-client-optional.md)]

## Azure VPN Client version information

For Azure VPN Client version information, see [Azure VPN Client versions](azure-vpn-client-versions.md).

## Next steps

For more information about P2S VPN, see the following articles:

* [About point-to-site VPN](point-to-site-about.md)
* [About point-to-site VPN routing](vpn-gateway-about-point-to-site-routing.md)
* [Advertise custom routes for P2S VPN clients](vpn-gateway-p2s-advertise-custom-routes.md)
