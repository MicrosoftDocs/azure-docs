There are 3 VPN Gateway SKUs:

- Basic
- Standard
- High Performance

The table below shows the gateway types and the estimated aggregate throughput. 
Pricing does differ between gateway SKUs. For information about pricing, see [VPN Gateway Pricing](https://azure.microsoft.com/pricing/details/vpn-gateway/). This table applies to both the Resource Manager and classic deployment models.


|    | **VPN Gateway throughput** | **VPN Gateway max IPsec tunnels** | **ExpressRoute Gateway throughput** | **VPN Gateway and ExpressRoute coexist**|
|--- |----------------------------|-----------------------------------|-------------------------------------|-----------------------------------------|
| **Basic SKU**              |  100 Mbps | 10                         |  500 Mbps                           | No   |
| **Standard SKU**           |  100 Mbps | 10                         | 1000 Mbps                           | Yes  |
| **High Performance SKU**   | 200 Mbps  | 30                         | 2000 Mbps                           | Yes  |


**Note:** The VPN throughput is a rough estimate based on the measurements between VNets in the same Azure region. It is not a guarantee of what you can get for cross-premises connections across the Internet, but should be used as a maximum possible measure.