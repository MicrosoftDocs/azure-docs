---
title: 'Install a User VPN P2S client certificate'
titleSuffix: Azure Virtual WAN
description: Learn how to install client certificates for User VPN P2S certificate authentication - Windows, Mac, Linux.
author: cherylmc
ms.service: virtual-wan
ms.topic: how-to
ms.date: 08/24/2023
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

The Linux client certificate is installed on the client as part of the client configuration. Use the VPN Gateway [Client configuration - Linux](../vpn-gateway/point-to-site-vpn-client-cert-linux.md) instructions.

## Next steps

Continue with the [Virtual WAN User VPN](virtual-wan-point-to-site-portal.md#p2sconfig) configuration steps.