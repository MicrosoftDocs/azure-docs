---
title: 'Configure P2S VPN clients - certificate authentication - macOS OpenVPN client'
titleSuffix: Azure Virtual WAN
description: Learn how to configure the VPN client for Virtual WAN P2S configurations that use certificate authentication. This article applies to macOS OpenVPN client.
author: cherylmc
ms.service: azure-virtual-wan
ms.topic: how-to
ms.date: 01/30/2025
ms.author: cherylmc
---

# Configure P2S User VPN clients: certificate authentication - OpenVPN client - macOS

This article helps you connect to your Azure virtual network (VNet) using Virtual WAN User VPN point-to-site (P2S) and **Certificate authentication** on macOS using an OpenVPN client.

[!INCLUDE [Prerequisites- macOS](../../includes/virtual-wan-user-vpn-openvpn-prerequisites.md)]

## Generate client certificates

For certificate authentication, a client certificate must be installed on each client computer. The client certificate you want to use must be exported with the private key, and must contain all certificates in the certification path.

For information about working with certificates, see [Generate and export certificates](certificates-point-to-site.md).

## Configure the OpenVPN client

The following example uses **TunnelBlick**.

[!INCLUDE [OpenVPN macOS](../../includes/vpn-gateway-vwan-config-openvpn-mac.md)]

## Next steps

Follow up with any additional server or connection settings. See [Tutorial: Create a P2S User VPN connection using Azure Virtual WAN](virtual-wan-point-to-site-portal.md).
