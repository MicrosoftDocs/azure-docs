---
title: What's new in Azure VPN Gateway?
description: Learn what's new with Azure VPN Gateway such as the latest release notes, known issues, bug fixes, deprecated functionality, and upcoming changes.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: concept-article
ms.date: 08/16/2024
ms.author: cherylmc
---

# What's new in Azure VPN Gateway?

Azure VPN Gateway is updated regularly. Stay up to date with the latest announcements. This article provides you with information about:

* Recent releases
* Previews underway with known limitations (if applicable)
* Known issues
* Deprecated functionality (if applicable)
* Azure VPN Client versions

You can also find the latest VPN Gateway updates and subscribe to the RSS feed [here](https://azure.microsoft.com/updates?filters=%5B%22VPN+Gateway%22%5D).

## Recent releases and announcements

| Type | Area | Name | Description | Date added | Limitations |
|---|---|---|---|---|---|
|SKU Consolidation | N/A | [VpnGw1-5 non-AZ VPN Gateway SKU](gateway-sku-consolidation.md) | VpnGw1-5 non-AZ SKU will be deprecated on 30 Sep 2026. View the announcement [here](https://azure.microsoft.com/updates/v2/vpngw1-5-non-az-skus-will-be-retired-on-30-september-2026) | Sep 2024 | N/A
| P2S VPN | P2S | [Azure VPN Client for Linux](#linux)| [Certificate](point-to-site-certificate-client-linux-azure-vpn-client.md) authentication, [Microsoft Entra ID ](point-to-site-entra-vpn-client-linux.md) authentication.| May 2024 | N/A|
| P2S VPN | P2S | [Azure VPN Client for macOS](#macos) | Microsoft Entra ID authentication updates, additional features.  | Sept 2024 | N/A|
| P2S VPN | P2S | [Azure VPN Client for Windows](#windows) | Microsoft Entra ID authentication updates, additional features.  | May 2024 | N/A|
|SKU deprecation  | N/A | [Standard/High performance VPN gateway SKU](vpn-gateway-about-skus-legacy.md#sku-deprecation) | Legacy SKUs (Standard and HighPerformance) will be deprecated on 30 Sep 2025. View the announcement [here](https://go.microsoft.com/fwlink/?linkid=2255127).  | Nov 2023 | N/A |
|Feature  | All | [Customer-controlled gateway maintenance](customer-controlled-gateway-maintenance.md) |Customers can schedule maintenance (Guest OS and Service updates) during a time of the day that best suits their business needs.  | Nov 2023 (Public preview)| See the [FAQ](vpn-gateway-vpn-faq.md#customer-controlled).
| Feature | All | [APIPA for VPN Gateway (General availability)](bgp-howto.md#2-create-testvnet1-gateway-with-bgp) | All SKUs of active-active VPN gateways now support multiple custom BGP APIPA addresses for each instance.  | Jan 2022 | N/A |
|P2S VPN| P2S| [Feedback Hub support for Azure VPN Client connections](feedback-hub-azure-vpn-client.md)  | Customers can use Feedback Hub to file a bug/allow feedback triage for Azure VPN Client connections. | May 2024| Windows 10, Windows 11 only|

### <a name="windows"></a>Azure VPN Client - Windows

[!INCLUDE [Windows client versions](../../includes/vpn-gateway-azure-vpn-client-windows-table.md)]

### <a name="linux"></a>Azure VPN Client - Linux

[!INCLUDE [Linux client versions](../../includes/vpn-gateway-azure-vpn-client-linux-table.md)]

### <a name="macos"></a>Azure VPN Client - macOS

[!INCLUDE [macOS client versions](../../includes/vpn-gateway-azure-vpn-client-macos-table.md)]

## Next steps

* [What is Azure VPN Gateway?](vpn-gateway-about-vpngateways.md)
* [VPN Gateway FAQ](vpn-gateway-vpn-faq.md)
