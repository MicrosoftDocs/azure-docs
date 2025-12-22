---
title: 'Generate and export certificates for point-to-site: Linux - OpenSSL'
description: Learn how to create a self-signed root certificate, export the public key, and generate client certificates using OpenSSL.
titleSuffix: Azure VPN Gateway
author: cherylmc
ms.service: azure-vpn-gateway
ms.custom: linux-related-content
ms.topic: how-to
ms.date: 03/20/2025
ms.author: cherylmc
# Customer intent: "As a network administrator, I want to generate and export self-signed root and client certificates using OpenSSL, so that I can securely configure point-to-site VPN connections for our Linux environment."
---
# Generate and export certificates - Linux - OpenSSL

This article helps you create a self-signed root certificate and generate client certificate **.pem** files using OpenSSL. If you need *.pfx* and *.cer* files instead, see the [Windows- PowerShell](vpn-gateway-certificates-point-to-site.md) instructions.

[!INCLUDE [Steps](../../includes/vpn-gateway-vwan-generate-certificates-linux-openssl.md)]

## Next steps

* To continue VPN Gateway configuration steps, see [Point-to-site certificate authentication](point-to-site-certificate-gateway.md#uploadfile).