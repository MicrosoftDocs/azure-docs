---
title: 'How to configure OpenVPN Clients for Azure VPN Gateway| Microsoft Docs'
description: Learn how to configure OpenVPN for Azure VPN Gateway for Windows, Linux, and Mac operating system clients.
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: how-to
ms.date: 09/03/2020
ms.author: cherylmc

---
# Configure OpenVPN clients for Azure VPN Gateway

This article helps you configure **OpenVPN &reg; Protocol** clients.

## Before you begin

Verify that you have completed the steps to configure OpenVPN for your VPN gateway. For details, see [Configure OpenVPN for Azure VPN Gateway](vpn-gateway-howto-openvpn.md).

[!INCLUDE [configuration steps](../../includes/vpn-gateway-vwan-config-openvpn-clients.md)]

## Next steps

If you want the VPN clients to be able to access resources in another VNet, then follow the instructions on the [VNet-to-VNet](vpn-gateway-howto-vnet-vnet-resource-manager-portal.md) article to set up a vnet-to-vnet connection. Be sure to enable BGP on the gateways and the connections, otherwise traffic will not flow.

**"OpenVPN" is a trademark of OpenVPN Inc.**
