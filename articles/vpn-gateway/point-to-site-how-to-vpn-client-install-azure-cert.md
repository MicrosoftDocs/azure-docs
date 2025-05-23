---
title: 'Install a Point-to-Site client certificate'
titleSuffix: Azure VPN Gateway
description: Learn how to install client certificates for P2S certificate authentication - Windows, Mac, Linux.
author: cherylmc
ms.service: azure-vpn-gateway
ms.custom: linux-related-content
ms.topic: how-to
ms.date: 02/13/2025
ms.author: cherylmc
---
# Install client certificates for P2S certificate authentication connections

When a P2S VPN gateway is configured to require certificate authentication, each client computer must have a client certificate installed locally. This article helps you install a client certificate locally on a client computer. You can also use [Intune](/mem/intune/configuration/vpn-settings-configure) to install certain VPN client profiles and certificates.

For information about generating certificates, see the [Generate certificates](point-to-site-certificate-gateway.md#generatecert) section of the Point-to-site configuration article.

## <a name="installwin"></a>Windows

[!INCLUDE [Install on Windows](../../includes/vpn-gateway-certificates-install-client-cert-include.md)]

## <a name="installmac"></a>macOS

[!INCLUDE [Install on Mac](../../includes/vpn-gateway-certificates-install-mac-client-cert-include.md)]

## <a name="installlinux"></a>Linux

The Linux client certificate is installed on the client as part of the client configuration. There are a few different methods to install certificates. You can use [strongSwan](point-to-site-vpn-client-certificate-ike-linux.md), or [OpenVPN client](point-to-site-vpn-client-certificate-openvpn-linux.md) steps.

## <a name="vpn-clients"></a>Configure VPN clients

To continue configuration, go back to the VPN client instructions that you were working with. You can use this table to locate the link:

[!INCLUDE [All client articles](../../includes/vpn-gateway-vpn-client-install-articles.md)]

## Next steps

For P2S server configuration, see [Configure P2S server settings for certificate authentication](point-to-site-certificate-gateway.md) configuration steps.