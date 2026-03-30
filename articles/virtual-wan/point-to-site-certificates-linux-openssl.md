---
title: 'Generate and export certificates for User VPN: Linux - OpenSSL'
description: Learn how to create a self-signed root certificate, export the public key, and generate client certificates using OpenSSL for Virtual WAN User VPN connections.
titleSuffix: Azure Virtual WAN
author: cherylmc
ms.service: azure-virtual-wan
ms.custom: linux-related-content
ms.topic: how-to
ms.date: 03/20/2025
ms.author: cherylmc
---
# User VPN - Generate and export certificates - Linux - OpenSSL

This article helps you create a self-signed root certificate and generate client certificate **.pem** files using OpenSSL. If you need *.pfx* and *.cer* files instead, see the [Windows- PowerShell](certificates-point-to-site.md) instructions. To upload the self-signed certificate to Azure, see the [User VPN configuration steps](virtual-wan-point-to-site-portal.md#p2sconfig).

[!INCLUDE [Steps](../../includes/vpn-gateway-vwan-generate-certificates-linux-openssl.md)]

## Next steps

* To continue Virtual WAN configuration steps, see [Create a P2S User VPN connection](../virtual-wan/virtual-wan-point-to-site-portal.md).
