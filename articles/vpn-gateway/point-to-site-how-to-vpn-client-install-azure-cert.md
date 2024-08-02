---
title: 'Install a Point-to-Site client certificate'
titleSuffix: Azure VPN Gateway
description: Learn how to install client certificates for P2S certificate authentication - Windows, Mac, Linux.
author: cherylmc
ms.service: azure-vpn-gateway
ms.custom: linux-related-content
ms.topic: how-to
ms.date: 05/15/2024
ms.author: cherylmc
---
# Install client certificates for P2S certificate authentication connections

When a P2S VPN gateway is configured to require certificate authentication, each client computer must have a client certificate installed locally. This article helps you install a client certificate locally on a client computer. You can also use [Intune](/mem/intune/configuration/vpn-settings-configure) to install certain VPN client profiles and certificates.

For information about generating certificates, see the [Generate certificates](vpn-gateway-howto-point-to-site-resource-manager-portal.md#generatecert) section of the Point-to-site configuration article.

## <a name="installwin"></a>Windows

[!INCLUDE [Install on Windows](../../includes/vpn-gateway-certificates-install-client-cert-include.md)]

## <a name="installmac"></a>macOS

>[!NOTE]
>macOS VPN clients are supported for the [Resource Manager deployment model](../azure-resource-manager/management/deployment-models.md) only. They are not supported for the classic deployment model.

[!INCLUDE [Install on Mac](../../includes/vpn-gateway-certificates-install-mac-client-cert-include.md)]

## <a name="installlinux"></a>Linux

The Linux client certificate is installed on the client as part of the client configuration. There are a few different methods to install certificates. You can use [strongSwan](point-to-site-vpn-client-certificate-ike-linux.md) steps, or [OpenVPN client](point-to-site-vpn-client-certificate-openvpn-linux.md).

## <a name="vpn-clients"></a>Configure VPN clients

To continue configuration, go back to the client that you were working on. You can use this table to easily locate the link:

[!INCLUDE [All client articles](../../includes/vpn-gateway-vpn-client-install-articles.md)]

## Next steps

Continue with the Point-to-Site configuration steps to Create and install VPN client configuration files. Use the links in the [VPN client table](#vpn-clients).
