---
title: 'Install a Point-to-Site client certificate'
titleSuffix: Azure VPN Gateway
description: Learn how to install client certificates for P2S certificate authentication - Windows, Mac, Linux.
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: how-to
ms.date: 06/03/2021
ms.author: cherylmc

---
# Install client certificates for P2S certificate authentication connections

When a P2S VPN gateway is configured to require certificate authentication, each client must have a client certificate installed locally. You can generate a client certificate from either a self-signed root certificate, or from a root certificate that was generated using an Enterprise CA solution. 

When you generate a client certificate, the certificate is typically automatically installed on the client computer from which it was generated. If you want to connect to your VNet from a different client computer, you need to install a client certificate on the computer from which you are connecting. This is in addition to configuring the VPN client on that computer.

You can use multiple methods to generate and export self-signed certificates. For more information, see the following articles:

* [PowerShell](vpn-gateway-certificates-point-to-site.md)
* [MakeCert](vpn-gateway-certificates-point-to-site-makecert.md)
* [Linux](vpn-gateway-certificates-point-to-site-linux.md) 

## <a name="installwin"></a>Windows

[!INCLUDE [Install on Windows](../../includes/vpn-gateway-certificates-install-client-cert-include.md)]

## <a name="installmac"></a>Mac

>[!NOTE]
>Mac VPN clients are supported for the Resource Manager deployment model only. They are not supported for the classic deployment model.
>
>

[!INCLUDE [Install on Mac](../../includes/vpn-gateway-certificates-install-mac-client-cert-include.md)]

## <a name="installlinux"></a>Linux

The Linux client certificate is installed on the client as part of the client configuration. See [Client configuration - Linux](point-to-site-vpn-client-configuration-azure-cert.md#linuxinstallcli) for instructions.

## Next steps

Continue with the Point-to-Site configuration steps to [Create and install VPN client configuration files](point-to-site-vpn-client-configuration-azure-cert.md).
