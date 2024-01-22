---
title: 'Generate and export certificates for point-to-site: Linux - strongSwan'
description: Learn how to create a self-signed root certificate, export the public key, and generate client certificates using the Linux (strongSwan) CLI.
titleSuffix: Azure VPN Gateway
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 10/18/2022
ms.author: cherylmc

---
# Generate and export certificates - Linux (strongSwan)

VPN Gateway point-to-site connections can use certificates to authenticate. This article shows you how to create a self-signed root certificate and generate client certificates using strongSwan. You can also use [PowerShell](vpn-gateway-certificates-point-to-site.md) or [MakeCert](vpn-gateway-certificates-point-to-site-makecert.md).

Each client must have a client certificate installed locally to connect. Additionally, the root certificate public key information must be uploaded to Azure. For more information, see [Point-to-site configuration - certificate authentication](vpn-gateway-howto-point-to-site-resource-manager-portal.md).

## <a name="install"></a>Install strongSwan

The following steps help you install strongSwan.

[!INCLUDE [strongSwan Install](../../includes/vpn-gateway-strongswan-install-include.md)]

## <a name="cli"></a>Linux CLI instructions (strongSwan)

The following steps help you generate and export certificates using the Linux CLI (strongSwan).
For more information, see [Additional instructions to install the Azure CLI](/cli/azure/install-azure-cli-apt). 

[!INCLUDE [strongSwan certificates](../../includes/vpn-gateway-strongswan-certificates-include.md)]


## Next steps

Continue with your point-to-site configuration to [Create and install VPN client configuration files - Linux](point-to-site-vpn-client-cert-linux.md).
