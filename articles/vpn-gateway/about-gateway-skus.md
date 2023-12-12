---
title: 'About gateway SKUs'
description: Learn about VPN Gateway SKUs.
author: cherylmc
ms.service: vpn-gateway
ms.topic: conceptual
ms.date: 11/28/2023
ms.author: cherylmc 

---
# About gateway SKUs

When you create a VPN Gateway virtual network gateway, you specify the gateway SKU that you want to use. This article describes the factors that you should take into consideration when selecting a gateway SKU. If you're looking for information about ExpressRoute gateway SKUs, see [Virtual network gateways for ExpressRoute](../expressroute/expressroute-about-virtual-network-gateways.md). For Virtual WAN gateways, see [Virtual WAN gateway settings](../virtual-wan/gateway-settings.md).

When you configure a virtual network gateway SKU, select the SKU that satisfies your requirements based on the types of workloads, throughput, features, and SLAs. The following sections show the relevant information that you should use when deciding.

## <a name="benchmark"></a>Gateway SKUs by tunnel, connection, and throughput

[!INCLUDE [Aggregated throughput by SKU](../../includes/vpn-gateway-table-gwtype-aggtput-include.md)]

**Additional information**

* The Basic SKU doesn't support IPv6 and can only be configured using PowerShell or Azure CLI. Additionally, the Basic SKU doesn't support RADIUS authentication.

* These connection limits are separate. For example, you can have 128 SSTP connections and also 250 IKEv2 connections on a VpnGw1 SKU.

* If you have numerous P2S connections, it can negatively impact your S2S connections. The Aggregate Throughput Benchmarks were tested by maximizing a combination of S2S and P2S connections. A single P2S or S2S connection can have a much lower throughput.

* See the [Pricing](https://azure.microsoft.com/pricing/details/vpn-gateway) page for pricing information.

* See the [SLA](https://azure.microsoft.com/support/legal/sla/vpn-gateway) page for SLA (Service Level Agreement) information.

* All benchmarks aren't guaranteed due to Internet traffic conditions and your application behaviors.

## <a name="performance"></a>Gateway SKUs by performance

To help you understand the relative performance of SKUs using different algorithms, we used publicly available iPerf and CTSTraffic tools to measure performances for site-to-site connections.

The table in this section lists the results of performance tests for VpnGW SKUs. A VPN tunnel connects to a VPN gateway instance. Each instance throughput is mentioned in the throughput table in the previous section and is available aggregated across all tunnels connecting to that instance. The table shows the observed bandwidth and packets per second throughput per tunnel for the different gateway SKUs. All testing was performed between gateways (endpoints) within Azure across different regions with 100 connections and under standard load conditions.

* The best performance was obtained when we used the GCMAES256 algorithm for both IPsec Encryption and Integrity.
* Average performance was obtained when using AES256 for IPsec Encryption and SHA256 for Integrity.
* The lowest performance was obtained when we used DES3 for IPsec Encryption and SHA256 for Integrity.

|**Generation**|**SKU**   | **Algorithms<br>used** | **Throughput<br>observed per tunnel** | **Packets per second per tunnel<br>observed** |
|---           |---       | ---                 | ---            | ---                    |
|**Generation1**|**VpnGw1**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 650 Mbps<br>500 Mbps<br>130 Mbps   | 62,000<br>47,000<br>12,000|
|**Generation1**|**VpnGw2**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 1.2 Gbps<br>650 Mbps<br>140 Mbps | 100,000<br>61,000<br>13,000|
|**Generation1**|**VpnGw3**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 1.25 Gbps<br>700 Mbps<br>140 Mbps | 120,000<br>66,000<br>13,000|
|**Generation1**|**VpnGw1AZ**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 650 Mbps<br>500 Mbps<br>130 Mbps   | 62,000<br>47,000<br>12,000|
|**Generation1**|**VpnGw2AZ**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 1.2 Gbps<br>650 Mbps<br>140 Mbps | 110,000<br>61,000<br>13,000|
|**Generation1**|**VpnGw3AZ**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 1.25 Gbps<br>700 Mbps<br>140 Mbps | 120,000<br>66,000<br>13,000|
| | |
|**Generation2**|**VpnGw2**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 1.25 Gbps<br>550 Mbps<br>130 Mbps | 120,000<br>52,000<br>12,000|
|**Generation2**|**VpnGw3**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 1.5 Gbps<br>700 Mbps<br>140 Mbps | 140,000<br>66,000<br>13,000|
|**Generation2**|**VpnGw4**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 2.3 Gbps<br>700 Mbps<br>140 Mbps | 220,000<br>66,000<br>13,000|
|**Generation2**|**VpnGw5**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 2.3 Gbps<br>700 Mbps<br>140 Mbps | 220,000<br>66,000<br>13,000|
|**Generation2**|**VpnGw2AZ**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 1.25 Gbps<br>550 Mbps<br>130 Mbps | 120,000<br>52,000<br>12,000|
|**Generation2**|**VpnGw3AZ**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 1.5 Gbps<br>700 Mbps<br>140 Mbps | 140,000<br>66,000<br>13,000|
|**Generation2**|**VpnGw4AZ**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 2.3 Gbps<br>700 Mbps<br>140 Mbps | 220,000<br>66,000<br>13,000|
|**Generation2**|**VpnGw5AZ**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 2.3 Gbps<br>700 Mbps<br>140 Mbps | 220,000<br>66,000<br>13,000|

## <a name="feature"></a>Gateway SKUs by feature set

| **SKU**| **Features**|
| ---    | ---         |
|**Basic** (**)   | **Route-based VPN**: 10 tunnels for S2S/connections; no RADIUS authentication for P2S; no IKEv2 for P2S<br>**Policy-based VPN**: (IKEv1): 1 S2S/connection tunnel; no P2S|
| **All Generation1 and Generation2 SKUs except Basic** | **Route-based VPN**: up to 100 tunnels (*), P2S, BGP, active-active, custom IPsec/IKE policy, ExpressRoute/VPN coexistence |
|        |             |

(*) You can configure "PolicyBasedTrafficSelectors" to connect a route-based VPN gateway to multiple on-premises policy-based firewall devices. Refer to [Connect VPN gateways to multiple on-premises policy-based VPN devices using PowerShell](vpn-gateway-connect-multiple-policybased-rm-ps.md) for details.

(\*\*) The Basic SKU is considered a legacy SKU. The Basic SKU has certain feature limitations. Verify that the feature that you need is supported before you use the Basic SKU. The Basic SKU doesn't support IPv6 and can only be configured using PowerShell or Azure CLI. Additionally, the Basic SKU doesn't support RADIUS authentication.

## <a name="workloads"></a>Gateway SKUs - Production vs. Dev-Test workloads

Due to the differences in SLAs and feature sets, we recommend the following SKUs for production vs. dev-test:

| **Workload**                       | **SKUs**               |
| ---                                | ---                    |
| **Production, critical workloads** | All Generation1 and Generation2 SKUs except Basic |
| **Dev-test or proof of concept**   | Basic (**)                 |
|                                    |                        |

(\*\*) The Basic SKU is considered a legacy SKU. The Basic SKU has certain feature limitations. Verify that the feature that you need is supported before you use the Basic SKU. The Basic SKU doesn't support IPv6 and can only be configured using PowerShell or Azure CLI. Additionally, the Basic SKU doesn't support RADIUS authentication.

If you're using the old SKUs (legacy), the production SKU recommendations are Standard and HighPerformance. For information and instructions for old SKUs, see [Gateway SKUs (legacy)](vpn-gateway-about-skus-legacy.md).

## About legacy SKUs

For information about working with the legacy gateway SKUs (Basic, Standard, and High Performance), including SKU deprecation, see [Managing legacy gateway SKUs](vpn-gateway-about-skus-legacy.md).

## Specify a SKU

You specify the gateway SKU when you create your VPN Gateway. See the following article for steps:

* [Azure portal](tutorial-create-gateway-portal.md)
* [PowerShell](create-routebased-vpn-gateway-powershell.md)
* [Azure CLI](create-routebased-vpn-gateway-cli.md)

## <a name="resizechange"></a>Change or resize a SKU

> [!NOTE]
> If you're working with a legacy gateway SKU (Basic, Standard, and High Performance), see [Managing Legacy gateway SKUs](vpn-gateway-about-skus-legacy.md).

[!INCLUDE [changing vs. resizing](../../includes/vpn-gateway-sku-about-change-resize.md)]

### Considerations

There are many things to consider when moving to a new gateway SKU. This section outlines the main items and also provides a table that helps you select the best method to use.

[!INCLUDE [resize SKU restrictions](../../includes/vpn-gateway-sku-resize-restrictions.md)]

The following table helps you understand the required method to move from one SKU to another.

[!INCLUDE [resize SKU methods table](../../includes/vpn-gateway-sku-resize-methods-table.md)]

## Next steps

For more information about available connection configurations, see [About VPN Gateway](vpn-gateway-about-vpngateways.md).
