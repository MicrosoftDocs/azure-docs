|    | **VPN Gateway throughput (1)** | **VPN Gateway max IPsec tunnels (2)** | **ExpressRoute Gateway throughput** | **VPN Gateway and ExpressRoute coexist**|
|--- |----------------------------|-----------------------------------|-------------------------------------|-----------------------------------------|
| **Basic SKU**              |  100 Mbps | 10                         |  500 Mbps                           | No   |
| **Standard SKU**           |  100 Mbps | 10                         | 1000 Mbps                           | Yes  |
| **High Performance SKU (3)**   | 200 Mbps  | 30                         | 2000 Mbps                           | Yes  |

- (1) The VPN throughput is a rough estimate based on the measurements between VNets in the same Azure region. It is not a guarantee of what you can get for cross-premises connections across the Internet, but should be used as a maximum possible measure.
- (2) The number of tunnels refer to route-based VPN below. A policy-based VPN can only support one Site-to-Site VPN tunnel.
- (3) The High Performance SKU is not supported for the policy-based VPN type.