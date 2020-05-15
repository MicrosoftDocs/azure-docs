---
title: 'Generate and export certificates for P2S: PowerShell'
titleSuffix: Azure VPN Gateway
description: Create a self-signed root certificate, export the public key, and generate client certificates using PowerShell on Windows 10 or Windows Server 2016.
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: conceptual
ms.date: 10/10/2019
ms.author: cherylmc

---
# Generate and export certificates for Point-to-Site using PowerShell

Point-to-Site connections use certificates to authenticate. This article shows you how to create a self-signed root certificate and generate client certificates using PowerShell on Windows 10 or Windows Server 2016. If you are looking for different certificate instructions, see [Certificates - Linux](vpn-gateway-certificates-point-to-site-linux.md) or [Certificates - MakeCert](vpn-gateway-certificates-point-to-site-makecert.md).

You must perform the steps in this article on a computer running Windows 10 or Windows Server 2016. The PowerShell cmdlets that you use to generate certificates are part of the operating system and do not work on other versions of Windows. The Windows 10 or Windows Server 2016 computer is only needed to generate the certificates. Once the certificates are generated, you can upload them, or install them on any supported client operating system.

If you do not have access to a Windows 10 or Windows Server 2016 computer, you can use [MakeCert](vpn-gateway-certificates-point-to-site-makecert.md) to generate certificates. The certificates that you generate using either method can be installed on any [supported](vpn-gateway-howto-point-to-site-resource-manager-portal.md#faq) client operating system.

[!INCLUDE [generate and export certificates](../../includes/vpn-gateway-generate-export-certificates-include.md)]

## <a name="install"></a>Install an exported client certificate

Each client that connects to the VNet over a P2S connection requires a client certificate to be installed locally.

To install a client certificate, see [Install a client certificate for Point-to-Site connections](point-to-site-how-to-vpn-client-install-azure-cert.md).

## Next steps

Continue with your Point-to-Site configuration.

* For **Resource Manager** deployment model steps, see [Configure P2S using native Azure certificate authentication](vpn-gateway-howto-point-to-site-resource-manager-portal.md).
* For **classic** deployment model steps, see [Configure a Point-to-Site VPN connection to a VNet (classic)](vpn-gateway-howto-point-to-site-classic-azure-portal.md).