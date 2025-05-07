---
title: 'Generate and export certificates for P2S: PowerShell'
titleSuffix: Azure VPN Gateway
description: Learn how to create a self-signed root certificate, export a public key, and generate client certificates for VPN Gateway point-to-site connections.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 02/13/2025
ms.author: cherylmc

---
# Generate and export certificates for point-to-site using PowerShell

This article shows you how to create a self-signed root certificate and generate client certificates using PowerShell on Windows 10 or later, or Windows Server 2016 or later. The steps in this article help you create **.pfx** and **.cer** files. If you don't have a Windows computer, you can use a small Windows VM as a workaround.

The PowerShell cmdlets that you use to generate certificates are part of the operating system and don't work on other versions of Windows. The host operating system is only used to generate the certificates. Once the certificates are generated, you can upload them or install them on any supported client operating system.

If you don't have a computer that meets the operating system requirement for these instructions, you can either use a small Windows virtual machine as a workaround, or use [MakeCert](vpn-gateway-certificates-point-to-site-makecert.md) to generate certificates. The certificates that you generate using either method can be installed on any supported client operating system.

[!INCLUDE [Generate and export - this include is for both vpn-gateway and virtual-wan](../../includes/vpn-gateway-generate-export-certificates-include.md)]

## <a name="install"></a>Install an exported client certificate

Each client that connects over a P2S connection requires a client certificate to be installed locally. To install a client certificate, see [Install a client certificate for point-to-site connections](point-to-site-how-to-vpn-client-install-azure-cert.md).

## Next steps

To continue with your Point-to-Site configuration, see [Configure server settings for P2S VPN Gateway certificate authentication](point-to-site-certificate-gateway.md).
