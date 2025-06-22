---
title: 'Install a User VPN P2S client certificate'
titleSuffix: Azure Virtual WAN
description: Learn how to install client certificates for User VPN P2S certificate authentication - Windows, Mac, Linux.
author: cherylmc
ms.service: azure-virtual-wan
ms.custom: linux-related-content
ms.topic: how-to
ms.date: 02/13/2025
ms.author: cherylmc
---
# Install client certificates for User VPN connections

When a Virtual WAN User VPN P2S configuration is configured for certificate authentication, each client computer must have a client certificate installed locally. This article helps you install a client certificate locally on a client computer. You can also use [Intune](/mem/intune/configuration/vpn-settings-configure) to install certain VPN client profiles and certificates.

If you want to generate a client certificate, see [Generate and export certificates for User VPN connections](certificates-point-to-site.md).

## <a name="installwin"></a>Windows

[!INCLUDE [Install on Windows](../../includes/vpn-gateway-certificates-install-client-cert-include.md)]

## <a name="installmac"></a>macOS

[!INCLUDE [Install on Mac](../../includes/vpn-gateway-certificates-install-mac-client-cert-include.md)]

## <a name="installlinux"></a>Linux

The Linux client certificate is installed on the client as part of the client configuration. There are a few different methods to install certificates. You can use [strongSwan](point-to-site-vpn-client-certificate-ike-linux.md), or [OpenVPN client](point-to-site-vpn-client-certificate-openvpn-linux.md) steps.

## <a name="vpn-clients"></a>Configure VPN clients

To continue configuration, go back to the VPN client instructions that you were working with. You can use this table to locate the link:

[!INCLUDE [P2S client configuration articles](../../includes/virtual-wan-vpn-client-install-articles.md)]

## Next steps

For P2S server configuration, see [Configure User VPN settings for certificate authentication](virtual-wan-point-to-site-portal.md#p2sconfig) configuration steps.
