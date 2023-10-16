---
ms.author: cherylmc
author: cherylmc
ms.date: 09/26/2023
ms.service: vpn-gateway
ms.topic: include
---

When you create a virtual network gateway, you specify the gateway SKU that you want to use. This section describes the factors that you should take into consideration when selecting a gateway SKU for the current deployment model (Resource Manager).

If you're looking for SKU information about legacy SKUs, ExpressRoute gateway SKUs, or more information about Availability Zone SKUs, see the following articles:

* For information about working with the legacy gateway SKUs (Basic, Standard, and HighPerformance), see [Working with VPN gateway SKUs (legacy SKUs)](../articles/vpn-gateway/vpn-gateway-about-skus-legacy.md).
* For ExpressRoute gateway SKUs, see [Virtual Network gateways for ExpressRoute](../articles/expressroute/expressroute-about-virtual-network-gateways.md).
* For more information about Availability Zone SKU (*AZ SKUs), see [About Zone redundant gateway SKUs](../articles/vpn-gateway/about-zone-redundant-vnet-gateways.md).

When selecting a virtual network gateway SKU, select the SKU that satisfies your requirements based on the types of workloads, throughput, features, and SLAs. The following sections show the relevant information that you should use when deciding.

### <a name="benchmark"></a>Gateway SKUs by tunnel, connection, and throughput

[!INCLUDE [Aggregated throughput by SKU](./vpn-gateway-table-gwtype-aggtput-include.md)]

**Additional information**

* You can resize a gateway SKU as long as it is in the same generation, except for the Basic SKU. The Basic SKU is a legacy SKU and has feature limitations. To change from the Basic SKU to another SKU, you first delete the Basic SKU VPN gateway, then create a new gateway with the desired generation and SKU size combination. See [Working with Legacy SKUs](../articles/vpn-gateway/vpn-gateway-about-skus-legacy.md).

* The Basic SKU doesn't support IPv6 and can only be configured using PowerShell or Azure CLI. Additionally, the Basic SKU doesn't support RADIUS authentication.

* These connection limits are separate. For example, you can have 128 SSTP connections and also 250 IKEv2 connections on a VpnGw1 SKU.

* If you have numerous P2S connections, it can negatively impact your S2S connections. The Aggregate Throughput Benchmarks were tested by maximizing a combination of S2S and P2S connections. A single P2S or S2S connection can have a much lower throughput.

* See the [Pricing](https://azure.microsoft.com/pricing/details/vpn-gateway) page for pricing information.

* See the [SLA](https://azure.microsoft.com/support/legal/sla/vpn-gateway/) page for SLA (Service Level Agreement) information.

* All benchmarks aren't guaranteed due to Internet traffic conditions and your application behaviors.

### Gateway SKU by performance

[!INCLUDE [SKU by performance](./vpn-gateway-performance-include.md)]

### <a name="feature"></a>Gateway SKUs by feature set

The new VPN Gateway SKUs streamline the feature sets offered on the gateways:

| **SKU**| **Features**|
| ---    | ---         |
|**Basic** (**)   | **Route-based VPN**: 10 tunnels for S2S/connections; no RADIUS authentication for P2S; no IKEv2 for P2S<br>**Policy-based VPN**: (IKEv1): 1 S2S/connection tunnel; no P2S|
| **All Generation1 and Generation2 SKUs except Basic** | **Route-based VPN**: up to 100 tunnels (*), P2S, BGP, active-active, custom IPsec/IKE policy, ExpressRoute/VPN coexistence |
|        |             |

(*) You can configure "PolicyBasedTrafficSelectors" to connect a route-based VPN gateway to multiple on-premises policy-based firewall devices. Refer to [Connect VPN gateways to multiple on-premises policy-based VPN devices using PowerShell](../articles/vpn-gateway/vpn-gateway-connect-multiple-policybased-rm-ps.md) for details.

(\*\*) The Basic SKU is considered a legacy SKU. The Basic SKU has certain feature limitations. Verify that the feature that you need is supported before you use the Basic SKU. The Basic SKU doesn't support IPv6 and can only be configured using PowerShell or Azure CLI. Additionally, the Basic SKU doesn't support RADIUS authentication.

###  <a name="workloads"></a>Gateway SKUs - Production vs. Dev-Test Workloads

Due to the differences in SLAs and feature sets, we recommend the following SKUs for production vs. dev-test:

| **Workload**                       | **SKUs**               |
| ---                                | ---                    |
| **Production, critical workloads** | All Generation1 and Generation2 SKUs except Basic |
| **Dev-test or proof of concept**   | Basic (**)                 |
|                                    |                        |

(\*\*) The Basic SKU is considered a legacy SKU. The Basic SKU has certain feature limitations. Verify that the feature that you need is supported before you use the Basic SKU. The Basic SKU doesn't support IPv6 and can only be configured using PowerShell or Azure CLI. Additionally, the Basic SKU doesn't support RADIUS authentication.

If you're using the old SKUs (legacy), the production SKU recommendations are Standard and HighPerformance. For information and instructions for old SKUs, see [Gateway SKUs (legacy)](../articles/vpn-gateway/vpn-gateway-about-skus-legacy.md).
