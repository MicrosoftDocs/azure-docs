---
title: 'Generate and export certificates for point-to-site: Linux - strongSwan'
description: Learn how to create a self-signed root certificate, export the public key, and generate client certificates using the Linux (strongSwan) CLI.
titleSuffix: Azure VPN Gateway
author: cherylmc
ms.service: azure-vpn-gateway
ms.custom: linux-related-content
ms.topic: how-to
ms.date: 06/24/2024
ms.author: cherylmc
---
# Generate and export certificates - Linux (strongSwan)

This article shows you how to create a self-signed root certificate and generate client certificates using strongSwan. The steps in this exercise help you create certificate **.pem** files. If you need *.pfx* and *.cer* files instead, see the [Windows- PowerShell](vpn-gateway-certificates-point-to-site.md) instructions.

For point-to-site connections, each VPN client must have a client certificate installed locally to connect. Additionally, the root certificate public key information must be uploaded to Azure. For more information, see [Point-to-site configuration - certificate authentication](vpn-gateway-howto-point-to-site-resource-manager-portal.md).

## <a name="install"></a>Install strongSwan

The following steps help you install strongSwan.

[!INCLUDE [strongSwan Install](../../includes/vpn-gateway-strongswan-install-include.md)]

## <a name="cli"></a>Linux CLI instructions (strongSwan)

The following steps help you generate and export certificates using the Linux CLI (strongSwan).
For more information, see [Additional instructions to install the Azure CLI](/cli/azure/install-azure-cli-apt).

[!INCLUDE [strongSwan certificates](../../includes/vpn-gateway-strongswan-certificates-include.md)]

## Next steps

Continue with your point-to-site configuration. See  [Configure P2S VPN clients: certificate authentication - Linux](point-to-site-vpn-client-certificate-ike-linux.md).
