---
title: What's new in Azure VPN Gateway?
description: Learn what's new with Azure VPN Gateway such as the latest release notes, known issues, bug fixes, deprecated functionality, and upcoming changes.
author: cherylmc
ms.service: vpn-gateway
ms.topic: conceptual
ms.date: 11/27/2023
ms.author: cherylmc
---

# What's new in Azure VPN Gateway?

Azure VPN Gateway is updated regularly. Stay up to date with the latest announcements. This article provides you with information about:

* Recent releases
* Previews underway with known limitations (if applicable)
* Known issues
* Deprecated functionality (if applicable)

You can also find the latest VPN Gateway updates and subscribe to the RSS feed [here](https://azure.microsoft.com/updates/?category=networking&query=azure%20vpn%20gateway).

## Recent releases and announcements

| Type | Area | Name | Description | Date added | Limitations |
|---|---|---|---|---|---|
|SKU deprecation  | N/A | Standard/High performance VPN gateway SKU | Legacy SKUs (Standard and HighPerformance) will be deprecated on 30 Sep 2025.  | Nov 2023 | N/A |
|Feature  | All | [Customer-controlled gateway maintenance](customer-controlled-gateway-maintenance.md) |Customers can schedule maintenance (Guest OS and Service updates) during a time of the day that best suits their business needs.  | Nov 2023 (Public preview)| See the [FAQ](vpn-gateway-vpn-faq.md#customer-controlled).
| Feature | All | [APIPA for VPN Gateway (General availability)](bgp-howto.md#2-create-testvnet1-gateway-with-bgp) | All SKUs of active-active VPN gateways now support multiple custom BGP APIPA addresses for each instance.  | Jan 2022 | N/A |

## Next steps

* [What is Azure VPN Gateway?](vpn-gateway-about-vpngateways.md)
* [VPN Gateway FAQ](vpn-gateway-vpn-faq.md)