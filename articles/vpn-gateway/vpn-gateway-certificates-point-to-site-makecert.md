---
title: 'Generate & export certificates for P2S: MakeCert'
titleSuffix: Azure VPN Gateway
description: Learn how to create a self-signed root certificate, export a public key, and generate client certificates using MakeCert.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 02/13/2025
ms.author: cherylmc

---
# Generate and export certificates for Point-to-Site connections using MakeCert

This article shows you how to create a self-signed root certificate and generate client certificates using MakeCert. The steps in this article help you create **.pfx** and **.cer** files. For **.pem** files, see [Generate .pem certificate files](point-to-site-certificates-linux-openssl.md).

> [!NOTE]
> We recommend using the [PowerShell steps](vpn-gateway-certificates-point-to-site.md) instead to create your certificates. We provide these MakeCert instructions as an optional method.

MakeCert is deprecated. This means that this tool could be removed at any point. Certificates that you already generated using MakeCert aren't affected if MakeCert is no longer available. MakeCert is only used to generate the certificates, not as a validating mechanism.

[!INCLUDE [Steps](../../includes/vpn-gateway-vwan-makecert.md)]

### <a name="clientexport"></a>Export a client certificate

[!INCLUDE [Export client certificate](../../includes/vpn-gateway-certificates-export-client-cert-include.md)]

### <a name="install"></a>Install an exported client certificate

To install a client certificate, see [Install a client certificate](point-to-site-how-to-vpn-client-install-azure-cert.md).

## Next steps

To continue with your Point-to-Site configuration, see [Configure server settings for P2S VPN Gateway certificate authentication](point-to-site-certificate-gateway.md).

For P2S troubleshooting information, see [Troubleshooting Azure point-to-site connections](vpn-gateway-troubleshoot-vpn-point-to-site-connection-problems.md).