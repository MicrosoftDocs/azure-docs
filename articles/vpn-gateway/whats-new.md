---
title: What's new in Azure VPN Gateway?
description: Learn what's new with Azure VPN Gateway such as the latest release notes, known issues, bug fixes, deprecated functionality, and upcoming changes.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: concept-article
ms.date: 11/25/2025
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
|Basic SKU public IP address migration - For all VPN SKUs except Basic SKU Gateway |- New [pricing changes](https://azure.microsoft.com/pricing/details/ip-addresses/).<br>- To qualify for successful migration, ensure you have the right IP address space and subnet size.<br>- Up to 10 minutes of downtime is expected during customer-controlled migration.<br>- Customers will have at least ~3 months to migrate after the release of the migration tool.|- **Starting Aug 4, 2025**: Basic SKU public IP address-to-Standard SKU public IP address migration tool is in **public preview** for **active-passive** gateways in Public cloud. <br> - **Active-Passive GA** in Public and National Clouds(Mooncake and Fairfax): GA by 1/30/26 <br> **Active-Active GA** in all clouds: Public Preview in Feb'26 with plan to announce GA in Mar’26 <br>- **July 2026**: Basic SKU public IP addresses are deprecated. <br> - **Deprecation timeline of Basic IP for all VPN Gateways is moved to End of June 2026**|- Ensure you have the right IP address space and subnet size, check here.<br>- If your VPN gateway is using a Basic SKU public IP address, migrate it to a Standard SKU public IP address.<br> - If your VPN gateway is already using a Standard SKU public IP address, no action is required.|- [About Basic SKU Public IP address migration](basic-public-ip-migrate-about.md) <br>  - [How to migrate Basic SKU public IP address to Standard](basic-public-ip-migrate-howto.md?tabs=portal)|[Basic SKU public IP address retirement](https://azure.microsoft.com/updates?id=upgrade-to-standard-sku-public-ip-addresses-in-azure-by-30-september-2025-basic-sku-will-be-retired) |
|Basic SKU public IP address migration - For Basic SKU Gateway | - Your actual IP address won't change, and connectivity won't be interrupted. | An automated capability to remove the Basic public IP from your gateway will be available **Mid-February'2026** <br> - **Deprecation timeline of Basic IP for all VPN Gateways is moved to end of  June 2026** | - Because Microsoft is retiring Basic public IP resources, we’re updating the Basic VPN Gateway construct. You’ll see the Basic public IP reference as an attribute on your virtual network gateway. <br> - Your actual IP address won't change, and connectivity won't be interrupted. <br> - If you have scripts, ARM templates, or monitoring solutions that reference the Basic public IP resource, update them to use the IP address property of the virtual network gateway instead. | Available when the migration details are released | [Basic SKU public IP address retirement](https://azure.microsoft.com/updates?id=upgrade-to-standard-sku-public-ip-addresses-in-azure-by-30-september-2025-basic-sku-will-be-retired) |
|Non-AZ gateway SKU retirement |- New pricing for AZ gateway SKUs applied since Jan 2025.<br>- Non-AZ gateway SKUs will be migrated to AZ gateway SKUs with no downtime expected.<br>- Non-AZ gateway SKU creates to be blocked by May 2025. |- **Jan 2025**: New pricing for AZ gateway SKUs activated.<br> - **May 2025 to Sep 2026**: Non-AZ gateway SKU-to-AZ gateway SKU migration available.<br> - **Sep 2026**: Non-AZ gateway SKU retirement.|- If the VPN gateway is using a Basic public IP address SKU, migrate it to a Standard public IP address SKU. In case of Standard IP, you can upgrade the gateway SKU from portal |[VPN Gateway SKU consolidation and migration](gateway-sku-consolidation.md)| [Non-AZ gateway SKU retirement](https://azure.microsoft.com/updates?id=vpngw1-5-non-az-skus-will-be-retired-on-30-september-2026)|
|Legacy SKU retirement: Standard and High Performance SKUs.|- New Standard/High Perf SKU gateway creations blocked Nov 2023.<br> - Standard/High Perf SKU gateways will be migrated to VpnGw1/VpnGw2 on non-AZ regions and to VpnGw1AZ/VpnAz2 on AZ regions.<br> - Up to 10 minutes of downtime is expected during customer-controlled migration.|- **May 2025 to Mar 2026**: Standard/HighPerf SKU migration.<br>- **Mar 2026**: Standard/HighPerf SKU retirement (extended from Sep 2025).| - **Nov 2025** Migrate your Basic IP address from portal for Active-Passive gateway <br>- **Jan 2026** Migrate your Basic IP address from portal for Active-Active gateway |[Working with VPN Gateway legacy SKUs](vpn-gateway-about-skus-legacy.md)|[Standard and HighPerf gateway SKU retirement](https://azure.microsoft.com/updates?id=standard-and-highperformance-vpn-gateway-skus-will-be-retired-on-30-september-2025)|
|Classic VPN gateways retired|- Classic VPN gateways will be decommissioned.|- **Aug 2024**: Retirement<br>- **By Aug 2025**: Decommission|- Migrate your classic VPN gateway to an Azure Resource Manager gateway|[VPN Gateway classic to Resource Manager migration](vpn-gateway-classic-resource-manager-migration.md)|[Classic resource retirement](https://azure.microsoft.com/updates?id=cloud-services-retirement-announcement)|


## Recent releases and announcements

| Type | Area | Name | Description | Date added | Limitations |
|---|---|---|---|---|---|
|IPv6 Preview | N/A | [VPN Gateway IPv6](ipv6-configuration.md) | Azure VPN Gateway supports IPv6 in dual stack. View the announcement [here](https://aka.ms/vpnipv6preview) | May 2025 | N/A |
|SKU Consolidation | N/A | [VpnGw1-5 non-AZ VPN Gateway SKU](gateway-sku-consolidation.md) | VpnGw1-5 non-AZ SKU will be deprecated on 30 Sep 2026. View the announcement [here](https://azure.microsoft.com/updates/v2/vpngw1-5-non-az-skus-will-be-retired-on-30-september-2026) | Sep 2024 | N/A |
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
