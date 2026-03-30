---
title: 'Generate and export certificates for point-to-site: Linux - strongSwan'
description: Learn how to create a self-signed root certificate, export the public key, and generate client certificates using the Linux (strongSwan) CLI.
titleSuffix: Azure VPN Gateway
author: cherylmc
ms.service: azure-vpn-gateway
ms.custom: linux-related-content
ms.topic: how-to
ms.date: 02/26/2025
ms.author: cherylmc

# The note "Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a very high degree of trust in the application, and carries risks that aren't present in other flows. You should only use this flow when other more secure flows, such as managed identities, aren't viable." is in the vpn-gateway-strongswan-certificates-include file.
# Customer intent: "As a network administrator, I want to generate and export client certificates using strongSwan on Linux, so that I can establish secure point-to-site VPN connections for remote clients."
---
# Generate and export certificates - Linux (strongSwan)

This article shows you how to create a self-signed root certificate and generate client certificates using strongSwan. The steps in this exercise help you create certificate **.pem** files. If you need *.pfx* and *.cer* files instead, see the [Windows- PowerShell](vpn-gateway-certificates-point-to-site.md) instructions.

For point-to-site connections, each VPN client must have a client certificate installed locally to connect. Additionally, the root certificate public key information must be uploaded to Azure. For more information, see [Point-to-site configuration - certificate authentication](point-to-site-certificate-gateway.md).

## <a name="install"></a>Install strongSwan

The following steps help you install strongSwan.

[!INCLUDE [strongSwan Install](../../includes/vpn-gateway-strongswan-install-include.md)]

## <a name="cli"></a>Linux CLI instructions (strongSwan)

The following steps help you generate and export certificates using the Linux CLI (strongSwan).
For more information, see [Additional instructions to install the Azure CLI](/cli/azure/install-azure-cli-apt).

[!INCLUDE [strongSwan certificates](../../includes/vpn-gateway-strongswan-certificates-include.md)]

## Next steps

Continue with your point-to-site configuration. See  [Configure P2S VPN clients: certificate authentication - Linux](point-to-site-vpn-client-certificate-ike-linux.md).
