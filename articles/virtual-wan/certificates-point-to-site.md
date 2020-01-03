---
title: 'Generate and export certificates for Azure Virtual WAN user VPN connections | Microsoft Docs'
description: Create a self-signed root certificate, export the public key, and generate client certificates using PowerShell on Windows 10 or Windows Server 2016.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: conceptual
ms.date: 10/09/2019
ms.author: cherylmc

---
# Generate and export certificates for Virtual WAN user VPN connections

User VPN connections use certificates to authenticate. This article shows you how to create a self-signed root certificate and generate client certificates using PowerShell on Windows 10 or Windows Server 2016.

You must perform the steps in this article on a computer running Windows 10 or Windows Server 2016. The PowerShell cmdlets that you use to generate certificates are part of the operating system and do not work on other versions of Windows. The Windows 10 or Windows Server 2016 computer is only needed to generate the certificates. Once the certificates are generated, you can upload them, or install them on any supported client operating system.

[!INCLUDE [Export public key](../../includes/vpn-gateway-generate-export-certificates-include.md)]

## Next steps

Continue with the [Virtual WAN steps for user VPN connection](virtual-wan-about.md)
