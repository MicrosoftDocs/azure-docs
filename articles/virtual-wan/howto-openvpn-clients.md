---
title: 'Configure OpenVPN clients for Azure Virtual WAN'
description: Learn how to configure OpenVPN clients for Azure Virtual WAN. This article includes Windows, Mac, iOS, and Linux client configuration steps.
author: cherylmc

ms.service: virtual-wan
ms.topic: how-to
ms.date: 05/04/2023
ms.author: cherylmc

---
# Configure an OpenVPN client for Azure Virtual WAN

This article helps you configure **OpenVPN &reg; Protocol** clients. You can also use the Azure VPN Client to connect via OpenVPN protocol. For more information, see [Configure a VPN client for P2S OpenVPN connections](openvpn-azure-ad-client.md).

## Before you begin

Create a User VPN (point-to-site) configuration. Make sure that you select "OpenVPN" for tunnel type. For steps, see [Create a P2S configuration for Azure Virtual WAN](virtual-wan-point-to-site-portal.md#p2sconfig).

[!INCLUDE [configuration steps](../../includes/vpn-gateway-vwan-config-openvpn-clients.md)]

## Next steps

For more information about User VPN (point-to-site), see [Create User VPN connections](virtual-wan-point-to-site-portal.md).

**"OpenVPN" is a trademark of OpenVPN Inc.**
