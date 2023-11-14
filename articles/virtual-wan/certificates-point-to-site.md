---
title: 'Generate and export certificates for User VPN P2S connections: PowerShell'
titleSuffix: Azure Virtual WAN
description: Learn how to create a self-signed root certificate, export a public key, and generate client certificates for Virtual WAN User VPN (point-to-site) connections using PowerShell.
author: cherylmc
ms.service: virtual-wan
ms.topic: how-to
ms.date: 08/23/2023
ms.author: cherylmc

---
# Generate and export certificates for User VPN connections using PowerShell

User VPN (point-to-site) configurations can be configured to require certificates to authenticate. This article shows you how to create a self-signed root certificate and generate client certificates using PowerShell on Windows 10 (or later) or Windows Server 2016 (or later).

The PowerShell cmdlets that you use to generate certificates are part of the operating system and don't work on other versions of Windows. The host operating system is only used to generate the certificates. Once the certificates are generated, you can upload them or install them on any supported client operating system.

If you don't have a computer that meets the operating system requirement, you can use [MakeCert](../vpn-gateway/vpn-gateway-certificates-point-to-site-makecert.md) to generate certificates. The certificates that you generate using either method can be installed on any supported client operating system.

[!INCLUDE [Generate and export - this include is for both vpn-gateway and virtual-wan](../../includes/vpn-gateway-generate-export-certificates-include.md)]

## Install an exported client certificate

Each client that connects over a P2S connection requires a client certificate to be installed locally. For steps to install a certificate, see [Install client certificates](install-client-certificates.md).

## Next steps

Continue with the [Virtual WAN steps for user VPN connections](virtual-wan-point-to-site-portal.md#p2sconfig).
