---
title: 'Generate and export certificates for P2S: PowerShell'
titleSuffix: Azure VPN Gateway
description: Learn how to create a self-signed root certificate, export a public key, and generate client certificates for VPN Gateway point-to-site connections.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 08/04/2023
ms.author: cherylmc

---
# Generate and export certificates for point-to-site using PowerShell

Point-to-site connections use certificates to authenticate. This article shows you how to create a self-signed root certificate and generate client certificates using PowerShell on Windows 10 or later, or Windows Server 2016 or later.

The PowerShell cmdlets that you use to generate certificates are part of the operating system and don't work on other versions of Windows. The host operating system is only used to generate the certificates. Once the certificates are generated, you can upload them or install them on any supported client operating system.

If you don't have a computer that meets the operating system requirement, you can use [MakeCert](vpn-gateway-certificates-point-to-site-makecert.md) to generate certificates. The certificates that you generate using either method can be installed on any [supported](vpn-gateway-howto-point-to-site-resource-manager-portal.md#faq) client operating system.

[!INCLUDE [Generate and export - this include is for both vpn-gateway and virtual-wan](../../includes/vpn-gateway-generate-export-certificates-include.md)]

## <a name="install"></a>Install an exported client certificate

Each client that connects over a P2S connection requires a client certificate to be installed locally. To install a client certificate, see [Install a client certificate for point-to-site connections](point-to-site-how-to-vpn-client-install-azure-cert.md).

## Next steps

Continue with your point-to-site configuration.

* For **Resource Manager** deployment model steps, see [Configure P2S using native Azure certificate authentication](vpn-gateway-howto-point-to-site-resource-manager-portal.md).
* For **classic** deployment model steps, see [Configure a point-to-site VPN connection to a VNet (classic)](vpn-gateway-howto-point-to-site-classic-azure-portal.md).