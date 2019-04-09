---
title: 'Generate and export certificates for Point-to-Site: Linux: CLI: Azure | Microsoft Docs'
description: Create a self-signed root certificate, export the public key, and generate client certificates using the Linux (strongSwan) CLI.
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: article
ms.date: 01/31/2019
ms.author: cherylmc

---
# Generate and export certificates

Point-to-Site connections use certificates to authenticate. This article shows you how to create a self-signed root certificate and generate client certificates using the Linux CLI and strongSwan. If you are looking for different certificate instructions, see the [Powershell](vpn-gateway-certificates-point-to-site.md) or [MakeCert](vpn-gateway-certificates-point-to-site-makecert.md) articles. For information about how to install strongSwan using the GUI instead of CLI, see the steps in the [Client configuration](point-to-site-vpn-client-configuration-azure-cert.md#install) article.

## Generate and export
[!INCLUDE [strongSwan certificates](../../includes/vpn-gateway-strongswan-certificates-include.md)]

## Next steps

Continue with your Point-to-Site configuration to [Create and install VPN client configuration files](point-to-site-vpn-client-configuration-azure-cert.md#linuxinstallcli).
