---
title: 'Azure VPN Client for Linux - Retirement Overview and Migration Guide'
titleSuffix: Azure VPN Gateway
description: Learn how to migrate from the Azure VPN Client for Linux to a supported client for Azure VPN Gateway P2S connections.
author: flapinski
ms.service: azure-vpn-gateway
ms.topic: concept-article
ms.date: 05/27/2026
ms.author: duau
# Customer intent: As a Linux user, I want to migrate from the Azure VPN Client for Linux to a supported client so that I can securely connect to my organization's virtual network.
---
# Azure VPN Client for Linux: Retirement overview and migration guide - VPN Gateway

The Azure VPN Client for Linux (preview), which is the Microsoft-provided VPN client application used to establish Point-to-Site (P2S) connections from Linux machines to Azure VPN gateways, is being retired on August 31, 2026.

The client remained in public preview since its release and doesn't have a path to general availability (GA). As part of Microsoft's ongoing effort to align Azure networking services with current security and reliability standards, we have made the decision to retire this preview client rather than continue to maintain an unsupported preview indefinitely.

This retirement doesn't affect Azure VPN gateway itself, Azure VPN Client for Windows, Azure VPN Client for macOS, or any Site-to-Site VPN functionality. Only the Linux preview client application (microsoft-azurevpnclient package) is being retired.

* See the [FAQ and additional resources](#faq) section of this article for more details on the rationale, timing, alternatives, and impact of this retirement
* For Virtual WAN, see the [Virtual WAN article](../virtual-wan/azure-vpn-client-linux-retirement.md).

## <a name="steps"></a>What steps do I need to take?

Before August 31, 2026, transition your Linux VPN users to one of the following supported alternatives for Azure VPN Gateway Point-to-Site connections:

|Client|Tunnel Type|Authentication Type|Gateway Configuration|Client Configuration |
|---|---|---|---|---|
|OpenVPN client|OpenVPN|Certificate|[Configure your Azure VPN gateway to Support Certificate authentication](point-to-site-certificate-gateway.md)|[Configure OpenVPN client for P2S certificate authentication connections - Linux](point-to-site-vpn-client-certificate-openvpn-linux.md)|
|strongSwan|IKEv2|Certificate|[Configure your Azure VPN gateway to Support Certificate authentication](point-to-site-certificate-gateway.md)|[Configure strongSwan for P2S IKEv2 — Linux](point-to-site-vpn-client-certificate-ike-linux.md)|
|||RADIUS Authentication|[Configure your Azure VPN gateway to Support RADIUS authentication](point-to-site-radius-gateway.md)|[Configure strongSwan for P2S IKEv2 — Linux](point-to-site-vpn-client-configuration-radius-password.md#linux-vpn-client---strongswan)|

## <a name="high-level"></a>High-level migration steps

[!INCLUDE [Linux retirement how-to](../../includes/azure-vpn-client-retirement-how-to.md)]

## <a name="faq"></a>FAQ and additional resources

[!INCLUDE [Linux retirement FAQ](../../includes/azure-vpn-client-retirement-faq.md)]

### Where can I get help with migration?

See the Azure VPN Gateway documentation for configuration guidance, or contact Azure Support for migration assistance.

## Next steps

* [Azure VPN FAQ](vpn-gateway-vpn-faq.md)
* [About Point-to-Site VPN](point-to-site-about.md)
* [Configure P2S gateway — Certificate authentication](point-to-site-certificate-gateway.md)