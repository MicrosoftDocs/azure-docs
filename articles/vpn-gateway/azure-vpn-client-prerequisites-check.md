---
title: 'Azure VPN Client prerequisites check'
titleSuffix: Azure VPN Gateway
description: Learn how run the Azure VPN Client prerequisites check to identify missing prerequisites and mitigate them.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 03/14/2025
ms.author: cherylmc

---
# Azure VPN Client prerequisites check for P2S VPN connections

If you're using the Azure VPN Client for Windows to connect to your point-to-site (P2S) VPN, you can run a prerequisites check to identify missing prerequisites and mitigate them. The **Run Prerequisites Test** feature checks the state of Windows services, background permissions for the client, local setting permissions, internet access, and user device time sync status. You can use this feature to do the following:

* Manually run a prerequisites check to identify missing prerequisites and mitigate them.
* Periodically run a prerequisites check automatically.

The **Run Prerequisites Test** feature is available in the Azure VPN Client for Windows, version 3.4.0.0 and later. It's not available for other versions of the Azure VPN Client. For Azure VPN Client version information, see [Azure VPN Client versions](azure-vpn-client-versions.md).

> [!NOTE]
> The prerequisites check is only available in the Azure VPN Client for Windows.

[!INCLUDE [Azure VPN Client preqrequsites check steps](../../includes/vpn-gateway-vwan-vpn-client-prerequisites-check.md)]

## Next steps

For more information about P2S VPN, see the following articles:

* [About point-to-site VPN](point-to-site-about.md)
* [About point-to-site VPN routing](vpn-gateway-about-point-to-site-routing.md)
