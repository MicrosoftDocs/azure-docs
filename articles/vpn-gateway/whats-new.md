---
title: What's new in Azure VPN Gateway?
description: Learn what's new with Azure VPN Gateway such as the latest release notes, known issues, bug fixes, deprecated functionality, and upcoming changes.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: concept-article
ms.date: 05/06/2026
ms.author: cherylmc
ms.custom:
  - build-2025
# Customer intent: "As a network administrator, I want to stay informed about the latest updates and planned changes for the VPN Gateway service, so that I can ensure optimal usage and compliance with upcoming migrations and deprecations."
---

# What's new in Azure VPN Gateway?

Azure VPN Gateway is updated regularly. Stay up to date with the latest announcements. This article provides you with information about:

* Projected changes
* Recent releases
* Previews underway with known limitations (if applicable)
* Known issues
* Deprecated functionality (if applicable)
* Azure VPN Client versions

You can also find the latest VPN Gateway updates and subscribe to the RSS feed [here](https://azure.microsoft.com/updates?filters=%5B%22VPN+Gateway%22%5D).

## Upcoming projected changes

> [!NOTE]
> Timelines are subject to change.<br>
> Basic IP deprecation timeline for all **VPN Gateways** is moved to **End of June 2026**

| Event | Customer impact| Anticipated timelines | Customer action/ prerequisites | Documentation | Announcement Links |
|---|---|---|---|---|---|
|Basic SKU public IP address migration - For all VPN SKUs except Basic SKU gateway |- New [pricing changes](https://azure.microsoft.com/pricing/details/ip-addresses/).<br>- Up to 10 min downtime during migration.<br>- IP address un-changed.|- **Jan 2026**: General Availability for Active-Passive gateways. <br>- **Apr 2026**: General Availability for Active-Active gateways. |- Verify IP address space and subnet size [here](basic-public-ip-migrate-about.md#considerations). <br>- Migrate Basic to Standard SKU public IP. <br> - No action if already on Standard SKU.|- [About Basic SKU Public IP address migration](basic-public-ip-migrate-about.md) <br>  - [How to migrate Basic SKU public IP address to Standard](basic-public-ip-migrate-howto.md?tabs=portal)|[Basic SKU public IP address retirement](https://azure.microsoft.com/updates?id=upgrade-to-standard-sku-public-ip-addresses-in-azure-by-30-september-2025-basic-sku-will-be-retired) |
|Basic SKU public IP address - For Basic SKU gateway | - IP address unchanged.<br> - No connectivity interruption. | - **Mar 2026**: Available. <br> | - Removing Basic public IP reference from VPN Gateway virtual network gateways. [FAQ](basic-sku-public-ip-remove.md) | [Remove Basic Public IP Reference from Basic SKU VPN Gateway](basic-sku-public-ip-remove.md)  | [Basic SKU public IP address retirement](https://azure.microsoft.com/updates?id=upgrade-to-standard-sku-public-ip-addresses-in-azure-by-30-september-2025-basic-sku-will-be-retired) |
|Non-AZ gateway SKU retirement |- New AZ SKUs pricing applied since Jan 2025.<br>- No downtime expected.<br>- New Non-AZ SKU creates blocked in 2025. |- **Jan 2025**: New pricing activated.<br> - **May 2025 - Sep 2026**: Non-AZ SKU migration.<br> - **Sep 2026**: Non-AZ SKU retirement.|- Migrate Basic IP address to Standard IP if applicable. <br> - Upgrade the gateway SKU from portal. |[VPN Gateway SKU consolidation and migration](gateway-sku-consolidation.md)| [Non-AZ gateway SKU retirement](https://azure.microsoft.com/updates?id=vpngw1-5-non-az-skus-will-be-retired-on-30-september-2026)|
|Legacy SKU retirement: Standard and High Performance SKUs |- New creations blocked in 2024.<br> - Up to 10 minutes of downtime.|- **May 2025 - Jun 2026**: Migration.<br>- **Jun 2026**: Legacy SKU retirement.| - **Nov 2025** Migrate Basic IP address (Active-Passive gateway).  <br>- **Jan 2026** Migrate Basic IP address (Active-Active gateway). |[Working with VPN Gateway legacy SKUs](vpn-gateway-about-skus-legacy.md)|[Standard and HighPerf gateway SKU retirement](https://azure.microsoft.com/updates?id=standard-and-highperformance-vpn-gateway-skus-will-be-retired-on-30-september-2025)|
|Classic VPN gateways retired|- Classic VPN gateways will be decommissioned.|- **Aug 2024**: Retirement.<br>- **By Aug 2025**: Decommission.|- Migrate your classic VPN gateway to an Azure Resource Manager gateway.|[VPN Gateway classic to Resource Manager migration](vpn-gateway-classic-resource-manager-migration.md)|[Classic resource retirement](https://azure.microsoft.com/updates?id=cloud-services-retirement-announcement)|


## Recent releases and announcements

| Type | Area | Name | Description | Date added | Limitations |
|---|---|---|---|---|---|
| Feature | S2S | [S2S VPN Gateway certificate authentication connection](site-to-site-certificate-authentication-gateway-about.md) |Azure VPN Gateway supports site-to-site VPN with digital certificate authentication. View the [portal](site-to-site-certificate-authentication-gateway-portal.md) and [Powershell](site-to-site-certificate-authentication-gateway-powershell.md) instructions to enable it. | May 2026 | N/A |
| Feature | P2S | [User Groups and client address pools](point-to-site-user-groups-create.md) | Azure VPN Gateway supports user groups and client address pools. View the [portal](point-to-site-user-groups-create-portal.md) and [Powershell](point-to-site-user-groups-create.md) instructions to enable it. | May 2026 | N/A |
| IPv6 Preview | N/A | [VPN Gateway IPv6](ipv6-configuration.md) | Azure VPN Gateway supports IPv6 in dual stack. View the announcement [here](https://aka.ms/vpnipv6preview). | May 2025 | N/A |
| SKU Consolidation | N/A | [VpnGw1-5 non-AZ VPN Gateway SKU](gateway-sku-consolidation.md) | VpnGw1-5 non-AZ SKU will be deprecated on 30 Sep 2026. View the announcement [here](https://azure.microsoft.com/updates/v2/vpngw1-5-non-az-skus-will-be-retired-on-30-september-2026). | Sep 2024 | N/A |
| P2S VPN | P2S VPN Client| [Azure VPN Client for Linux](#linux)| [Certificate](point-to-site-certificate-client-linux-azure-vpn-client.md) authentication, [Microsoft Entra ID ](point-to-site-entra-vpn-client-linux.md) authentication.| May 2024 | N/A|
| P2S VPN | P2S VPN Client | [Azure VPN Client for macOS](#macos) | Microsoft Entra ID authentication updates, additional features.  | Sept 2024 | N/A|
| P2S VPN | P2S VPN Client | [Azure VPN Client for Windows](#windows) | Microsoft Entra ID authentication updates, additional features.  | May 2024 | N/A|
|SKU deprecation  | N/A | [Standard/High performance VPN gateway SKU](vpn-gateway-about-skus-legacy.md#sku-deprecation) | Legacy SKUs (Standard and HighPerformance) will be deprecated on 30 Sep 2025. View the announcement [here](https://go.microsoft.com/fwlink/?linkid=2255127).  | Nov 2023 | N/A |
|Feature  | All | [Customer-controlled gateway maintenance](customer-controlled-gateway-maintenance.md) |Customers can schedule maintenance (Guest OS and Service updates) during a time of the day that best suits their business needs.  | Nov 2023 (Public preview)| See the [FAQ](vpn-gateway-vpn-faq.md#customer-controlled) |
| Feature | All | [APIPA for VPN Gateway (General availability)](bgp-howto.md#2-create-testvnet1-gateway-with-bgp) | All SKUs of active-active VPN gateways now support multiple custom BGP APIPA addresses for each instance.  | Jan 2022 | N/A |
| Feature | P2S VPN Client | [Feedback Hub support for Azure VPN Client connections](feedback-hub-azure-vpn-client.md)  | Customers can use Feedback Hub to file a bug/allow feedback triage for Azure VPN Client connections. | May 2024| Windows 10, Windows 11 only|

### <a name="windows"></a>Azure VPN Client - Windows

[!INCLUDE [Windows client versions](../../includes/vpn-gateway-azure-vpn-client-windows-table.md)]

### <a name="linux"></a>Azure VPN Client - Linux

[!INCLUDE [Linux client versions](../../includes/vpn-gateway-azure-vpn-client-linux-table.md)]

### <a name="macos"></a>Azure VPN Client - macOS

[!INCLUDE [macOS client versions](../../includes/vpn-gateway-azure-vpn-client-macos-table.md)]

## Next steps

* [What is Azure VPN Gateway?](vpn-gateway-about-vpngateways.md)
* [VPN Gateway FAQ](vpn-gateway-vpn-faq.md)
