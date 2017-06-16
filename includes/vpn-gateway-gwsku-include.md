When you create a virtual network gateway, you need to specify the gateway SKU that you want to use. Select the SKUs that satisfy your requirements based on the types of workloads, throughputs, features, and SLAs.

[!INCLUDE [Aggregated throughput by SKU](./vpn-gateway-table-gwtype-aggtput-include.md)]

###  <a name="workloads"></a>Production *vs.* Dev-Test Workloads
Due to the differences in SLAs and feature sets, we recommend the following SKUs for production *vs.* dev-test:

| **Workload**                       | **SKUs**               |
| ---                                | ---                    |
| **Production, critical workloads** | VpnGw1, VpnGw2, VpnGw3 |
| **Dev-test or proof of concept**   | Basic                  |
|                                    |                        |

If you are still using the old SKUs, the production SKU recommendations are Standard and HighPerformance SKUs. For information on the old SKUs, see [Gateway SKUs (old)](../articles/vpn-gateway/vpn-gateway-about-skus-legacy.md).

###  <a name="feature"></a>Gateway SKU feature sets
The new gateway SKUs streamline the feature sets offered on the gateways:

| **SKU**| **Features**|
| ---    | ---         |
| VpnGw1<br>VpnGw2<br>VpnGw3|Route- and policy-based VPN up to 30 tunnels<br>P2S, BGP, active-active, custom IPsec/IKE policy, ExpressRoute/VPN co-existence|
|Basic   | Route-based: 10 tunnels with P2S<br>Policy-based (IKEv1): 1 tunnel; no P2S|
|        |             |

###  <a name="resize"></a>Resizing gateway SKUs

> [!IMPORTANT]
> 1. You can resize between VpnGw1, VpnGw2, and VpnGw3 SKUs
> 2. You **cannot** resize from Basic/Standard/HighPerformance SKUs to the new VpnGw1/VpnGw2/VpnGw3 SKUs
> 3. For the old SKUs, you can still resize between Basic, Standard, and HighPerformance SKUs

###  <a name="migrate"></a>Migrating from old SKUs to VpnGw1/VpnGw2/VpnGw3

[!INCLUDE [Migrate SKU](./vpn-gateway-migrate-legacy-sku-include.md)]