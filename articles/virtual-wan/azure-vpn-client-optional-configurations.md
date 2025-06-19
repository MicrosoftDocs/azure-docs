---
title: 'Azure VPN Client optional configuration steps: OpenVPN protocol'
titleSuffix: Azure Virtual WAN
description: Learn how to configure the Azure VPN Client optional configuration parameters for P2S OpenVPN connections.
author: cherylmc
ms.service: azure-virtual-wan
ms.topic: how-to
ms.date: 03/07/2025
ms.author: cherylmc

---

# Azure VPN Client - configure optional routing and DNS settings

This article helps you configure optional settings for the Azure VPN Client for Virtual WAN User VPN point-to-site connections. You can configure DNS suffixes, custom DNS servers, custom routes, and VPN client-side forced tunneling.

> [!NOTE]
> The Azure VPN Client is only supported for OpenVPN® protocol connections.

## Prerequisites

The steps in this article assume that you configured your P2S gateway and downloaded the Azure VPN Client to connecting client computers. For steps, see the following point-to-site configuration articles:

* [Certificate authentication](virtual-wan-point-to-site-portal.md)
* [Microsoft Entra ID authentication](point-to-site-entra-gateway.md)

To download VPN client profile configuration file (xml file), see [Download a global or hub-based profile](global-hub-profile.md).

[!INCLUDE [Configuration steps](../../includes/vpn-gateway-vwan-azure-vpn-client-optional.md)]

## Azure VPN Client versions

For Azure VPN Client version information, see [Azure VPN Client versions](azure-vpn-client-versions.md).

## Next steps

For more information about P2S VPN, see [About point-to-site VPN](point-to-site-concepts.md).