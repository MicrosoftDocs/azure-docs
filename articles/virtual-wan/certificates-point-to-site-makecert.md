---
title: 'Generate & export certificates for P2S User VPN: MakeCert'
titleSuffix: Azure Virtual WAN
description: Learn how to create a self-signed root certificate for User VPN, export a public key, and generate client certificates using MakeCert.
author: cherylmc
ms.service: azure-virtual-wan
ms.topic: how-to
ms.date: 03/20/2025
ms.author: cherylmc

---
# Generate and export certificates for User VPN P2S connections using MakeCert

This article shows you how to create a self-signed root certificate and generate client certificates using MakeCert. The steps in this article help you create **.pfx** and **.cer** files. For **.pem** files, see [Generate .pem certificate files](point-to-site-certificates-linux-openssl.md).

> [!NOTE]
> We recommend using the [PowerShell steps](certificates-point-to-site.md) instead to create your certificates. We provide these MakeCert instructions as an optional method.

MakeCert is deprecated. This means that this tool could be removed at any point. Certificates that you already generated using MakeCert aren't affected if MakeCert is no longer available. MakeCert is only used to generate the certificates, not as a validating mechanism.

[!INCLUDE [Steps](../../includes/vpn-gateway-vwan-makecert.md)]

### <a name="clientexport"></a>Export a client certificate

[!INCLUDE [Export client certificate](../../includes/vpn-gateway-certificates-export-client-cert-include.md)]

### <a name="install"></a>Install an exported client certificate

To install a client certificate, see [Install a client certificate](install-client-certificates.md).

## Next steps

Continue with your Point-to-Site configuration. See [Create a P2S User VPN connection using Azure Virtual WAN](virtual-wan-point-to-site-portal.md).