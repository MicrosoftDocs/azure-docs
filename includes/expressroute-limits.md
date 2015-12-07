#### ExpressRoute Limits

The following limits apply to ExpressRoute resources per subscription.

| Resource | Default Limit |
|---|---|
| ExpressRoute circuits per subscription | 10 |
| ExpressRoute circuits per region per subscription for ARM | 10 |
| Maximum number of routes for Azure private peering with ExpressRoute standard | 4,000 |
| Maximum number of routes for Azure private peering with ExpressRoute premium add-on | 10,000 |
| Maximum number of routes for Azure public peering with ExpressRoute standard | 200 |
| Maximum number of routes for Azure public peering with ExpressRoute premium add-on | 200 |
| Maximum number of routes for Azure Microsoft peering with ExpressRoute standard | 200 |
| Maximum number of routes for Azure Microsoft peering with ExpressRoute premium add-on | 200 |
| Number of virtual network links allowed per ExpressRoute circuit | see table below |

#### Number of Virtual Networks per ExpressRoute circuit

| **Circuit Size** | **Number of VNet links for standard** | **Number of VNet Links with Premium add-on** |
|---|---|---|
| 10 Mbps | 10 | Not Supported |
| 50 Mbps | 10 | 20 |
| 100 Mbps | 10 | 25 |
| 200 Mbps | 10 | 25 |
| 500 Mbps | 10 | 40 |
| 1 Gbps | 10 | 50 |
| 2 Gbps | 10 | 60 |
| 5 Gbps | 10 | 75 |
| 10 Gbps | 10 | 100 |

