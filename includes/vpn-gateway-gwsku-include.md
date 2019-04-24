---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 03/20/2019
 ms.author: cherylmc
 ms.custom: include file
---

When you create a virtual network gateway, you need to specify the gateway SKU that you want to use. Select the SKU that satisfies your requirements based on the types of workloads, throughputs, features, and SLAs. For virtual network gateway SKUs in Azure Availability Zones, see [Azure Availability Zones Gateway SKUs](../articles/vpn-gateway/about-zone-redundant-vnet-gateways.md).

###  <a name="benchmark"></a>Gateway SKUs by tunnel, connection, and throughput

[!INCLUDE [Aggregated throughput by SKU](./vpn-gateway-table-gwtype-aggtput-include.md)]

[!INCLUDE [classic SKU](./vpn-gateway-classic-sku-support-include.md)]

###  <a name="feature"></a>Gateway SKUs by feature set

The new VPN gateway SKUs streamline the feature sets offered on the gateways:

| **SKU**| **Features**|
| ---    | ---         |
|**Basic** (**)   | **Route-based VPN**: 10 tunnels for S2S/connections; no RADIUS authentication for P2S; no IKEv2 for P2S<br>**Policy-based VPN**: (IKEv1): 1 S2S/connection tunnel; no P2S|
| **VpnGw1, VpnGw2, and VpnGw3** | **Route-based VPN**: up to 30 tunnels (*), P2S, BGP, active-active, custom IPsec/IKE policy, ExpressRoute/VPN coexistence |
|        |             |

(*) You can configure "PolicyBasedTrafficSelectors" to connect a route-based VPN gateway (VpnGw1, VpnGw2, VpnGw3) to multiple on-premises policy-based firewall devices. Refer to [Connect VPN gateways to multiple on-premises policy-based VPN devices using PowerShell](../articles/vpn-gateway/vpn-gateway-connect-multiple-policybased-rm-ps.md) for details.

(\*\*) The Basic SKU is considered a legacy SKU. The Basic SKU has certain feature limitations. You can't resize a gateway that uses a Basic SKU to one of the new gateway SKUs, you must instead change to a new SKU, which involves deleting and recreating your VPN gateway.

###  <a name="workloads"></a>Gateway SKUs - Production vs. Dev-Test Workloads

Due to the differences in SLAs and feature sets, we recommend the following SKUs for production vs. dev-test:

| **Workload**                       | **SKUs**               |
| ---                                | ---                    |
| **Production, critical workloads** | VpnGw1, VpnGw2, VpnGw3 |
| **Dev-test or proof of concept**   | Basic (**)                 |
|                                    |                        |

(\*\*) The Basic SKU is considered a legacy SKU and has feature limitations. Verify that the feature that you need is supported before you use the Basic SKU.

If you are using the old SKUs (legacy), the production SKU recommendations are Standard and HighPerformance. For information and instructions for old SKUs, see [Gateway SKUs (legacy)](../articles/vpn-gateway/vpn-gateway-about-skus-legacy.md).
