When you create a virtual network gateway, you need to specify the gateway SKU that you want to use. Select the SKUs that satisfy your requirements based on the types of workloads, throughputs, features, and SLAs. Azure offers the following VPN gateway SKUs:

|**SKU**   | **S2S/VNet-to-VNet<br>Tunnels** | **P2S<br>Connections** | **Aggregate<br>Throughput** |
|---       | ---                             | ---                    | ---                         |
|**VpnGw1**| Max. 30                         | Max. 256               | 500 Mbps                    |
|**VpnGw2**| Max. 30                         | Max. 512               | 1 Gbps                      |
|**VpnGw3**| Max. 30                         | Max. 512               | 1.25 Gbps                   |
|**Basic** | Max. 10                         | Max. 128               | 100 Mbps                    | 
|          |                                 |                        |                             | 

* Pricing information can be found on the [Pricing](https://azure.microsoft.com/pricing/details/vpn-gateway) page
* SLA (Service Level Agreement) information can be found on the [SLA](https://azure.microsoft.com/en-us/support/legal/sla/vpn-gateway/) page

> [!NOTE]
> * The throughput is based on measurements of multiple tunnels aggregated through a single gateway. It is not a guaranteed throughput due to Internet traffic conditions and your application behaviors.
> * VPN Gateway does not use the UltraPerformance gateway SKU. For information about the UltraPerformance SKU, see the [ExpressRoute](../articles/expressroute/expressroute-about-virtual-network-gateways.md) documentation.

### Production *vs.* Dev-Test Workloads
Due to the differences in SLAs and feature sets, we recommend the following SKUs for production *vs.* dev-test:

| **Workload**                       | **SKUs**               |
| ---                                | ---                    |
| **Production, critical workloads** | VpnGw1, VpnGw2, VpnGw3 |
| **Dev-test or proof of concept**   | Basic                  |
|                                    |                        |

If you are still using the old SKUs, the production SKU recommendations are Standard and HighPerformance SKUs.

### Gateway SKU feature sets
The new gateway SKUs streamline the feature sets offered on the gateways:

| **SKU**| **Features**|
| ---    | ---         |
| VpnGw1<br>VpnGw2<br>VpnGw3|Route- and policy-based VPN up to 30 tunnels<br>P2S, BGP, active-active, custom IPsec/IKE policy, ExpressRoute/VPN co-existence|
|Basic   | Route-based: 10 tunnels with P2S<br>Policy-based (IKEv1): 1 tunnel; no P2S|
|        |             |

### Re-sizing gateway SKUs

> [!IMPORTANT]
> 1. You can resize between VpnGw1, VpnGw2, and VpnGw3 SKUs
> 2. You **cannot** resize from Basic/Standard/HighPerformance SKUs to the new VpnGw1/VpnGw2/VpnGw3 SKUs
> 3. For the old SKUs, you can still re-size between Basic, Standard, and HighPerformance SKUs

### Migrating from old SKUs to VpnGw1/VpnGw2/VpnGw3
You cannot resize your Azure VPN gateways directly between the old (Basic/Standard/HighPerformance) and the new (VpnGw1/VpnGw2/VpnGw3) SKU families. You need to delete the existing (Basic/Standard/HighPerformance) gateway and create a new (VpnGw1/VpnGw2/VpnGw3) gateway with the new SKUs. Note that your Azure Gateway public IP address will change as a result.

1. [Delete the old gateway](../articles/vpn-gateway/vpn-gateway-delete-vnet-gateway-portal.md)
2. [Create the new gateway] (../articles/vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md)
3. Update your [on-premises VPN devices](../articles/vpn-gateway/vpn-gateway-about-vpn-devices.md) with the new Azure VPN gateway public IP address
