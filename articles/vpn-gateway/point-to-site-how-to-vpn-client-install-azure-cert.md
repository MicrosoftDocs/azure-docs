---
title: 'Azure VPN Gateway: Install a Point-to-Site client certificate'
description: Install client cert for P2S certificate authentication - Windows, Mac, Linux.
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: article
ms.date: 01/10/2020
ms.author: cherylmc

---
# Install client certificates for P2S certificate authentication connections

All clients that connect to a virtual network using Point-to-Site Azure certificate authentication require a client certificate. This article helps you install a client certificate that is used for authentication when connecting to a VNet using P2S.

## <a name="generate"></a>Acquire a client certificate

No matter what client operating system you want to connect from, you must always have a client certificate. You can generate a client certificate from either a root certificate that was generated using an Enterprise CA solution, or a self-signed root certificate. See the [PowerShell](vpn-gateway-certificates-point-to-site.md), [MakeCert](vpn-gateway-certificates-point-to-site-makecert.md), or [Linux](vpn-gateway-certificates-point-to-site-linux.md) instructions for steps to generate a client certificate. 

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
