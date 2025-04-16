---
 description: include file
 author: cherylmc
 ms.service: azure-virtual-wan
 ms.topic: include
 ms.date: 04/07/2025
 ms.author: cherylmc
 ms.custom: include file
---
| Resource |  Limit |
| --- | --- |
| VPN (branch) connections per hub | 1,000 |
| Aggregate throughput per Virtual WAN Site-to-site VPN gateway | 20 Gbps |
| Throughput per Virtual WAN VPN connection (2 tunnels) | 2 Gbps with 1 Gbps/IPsec tunnel |
| Point-to-site users per hub| 100,000 |
| Aggregate throughput per Virtual WAN User VPN (Point-to-site) gateway | 200 Gbps |
| Aggregate throughput per Virtual WAN ExpressRoute gateway | 20 Gbps |
| ExpressRoute circuit connections per hub | 8 |
| VNet connections per hub without Routing Intent enabled | 500 minus total number of hubs in Virtual WAN |
| Address spaces across all VNets directly connected to single hub with Routing Intent with private routing policies enabled| 400 per Virtual WAN hub - [adjustable](../articles/virtual-wan/how-to-routing-policies.md#address-limits)|
| Aggregate throughput per Virtual WAN hub router | 50 Gbps for VNet to VNet transit |
| VM workload across all VNets connected to a single Virtual WAN hub | 2000 (If you want to raise the limit or quota above the default limit, see [hub settings](../articles/virtual-wan/hub-settings.md)). |
| Total number of routes the hub can accept from its connected resources (virtual networks, branches, other virtual hubs, etc.) | 10,000 |


