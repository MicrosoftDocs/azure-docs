---
 ms.topic: include
 author: cherylmc
 ms.service: vpn-gateway
 ms.date: 01/04/2024
 ms.author: cherylmc

---

| Resource                                | Limit        |
|-----------------------------------------|------------------------------|
| VNet Address Prefixes                   | 600 per VPN gateway          |
| Aggregate BGP routes                    | 4,000 per VPN gateway        |
| Local Network Gateway address prefixes  | 1000 per local network gateway               |
| S2S connections                         | Limit depends on the gateway SKU. See the [Limits by gateway SKU](#limits-by-gateway-sku) table.|
| P2S connections                         | Limit depends on the gateway SKU. See the [Limits by gateway SKU](#limits-by-gateway-sku) table.|
| P2S route limit - IKEv2                 | 256 for non-Windows **/** 25 for Windows           |
| P2S route limit - OpenVPN               | 1000                         |
| Max. flows                              | 500K inbound and 500K outbound for VpnGw1-5/AZ|
| Traffic Selector Policies               | 100  |
| Custom APIPA BGP addresses              | 32   |
| Supported number of VMs in the virtual network | Limit depends on the gateway SKU. See the [Limits by gateway SKU](#limits-by-gateway-sku) table.|

#### Limits by gateway SKU

[!INCLUDE [Limits by gateway SKU](vpn-gateway-table-gwtype-aggtput-include.md)]

For more information about gateway SKUs and limits, see [About gateway SKUs](../articles/vpn-gateway/about-gateway-skus.md#benchmark).

#### Gateway performance limits

[!INCLUDE [Performance by gateway SKU](vpn-gateway-table-sku-performance.md)]
