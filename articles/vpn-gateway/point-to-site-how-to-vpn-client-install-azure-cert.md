---
title: 'Install a Point-to-Site client certificate'
titleSuffix: Azure VPN Gateway
description: Learn how to install client certificates for P2S certificate authentication - Windows, Mac, Linux.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 08/07/2023
ms.author: cherylmc

---
# Install client certificates for P2S certificate authentication connections

When a P2S VPN gateway is configured to require certificate authentication, each client computer must have a client certificate installed locally. This article helps you install a client certificate locally on a client computer. You can also use [Intune](/mem/intune/configuration/vpn-settings-configure) to install certain VPN client profiles and certificates.

If you want to generate a client certificate from a self-signed root certificate, see one of the following articles:

* [Generate certificates - PowerShell](vpn-gateway-certificates-point-to-site.md)
* [Generate certificates - MakeCert](vpn-gateway-certificates-point-to-site-makecert.md)
* [Generate certificates - Linux](vpn-gateway-certificates-point-to-site-linux.md)

## <a name="installwin"></a>Windows

[!INCLUDE [Install on Windows](../../includes/vpn-gateway-certificates-install-client-cert-include.md)]

## <a name="installmac"></a>macOS

>[!NOTE]
>macOS VPN clients are supported for the [Resource Manager deployment model](../azure-resource-manager/management/deployment-models.md) only. They are not supported for the classic deployment model.

[!INCLUDE [Install on Mac](../../includes/vpn-gateway-certificates-install-mac-client-cert-include.md)]

## <a name="installlinux"></a>Linux

The Linux client certificate is installed on the client as part of the client configuration. See [Client configuration - Linux](point-to-site-vpn-client-cert-linux.md) for instructions.

## Next steps

Continue with the Point-to-Site configuration steps to Create and install VPN client configuration files for [Windows](point-to-site-vpn-client-cert-windows.md), [macOS](point-to-site-vpn-client-cert-windows.md), or [Linux](point-to-site-vpn-client-cert-linux.md)).
