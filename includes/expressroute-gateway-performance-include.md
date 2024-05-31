---
 title: include file
 description: include file
 services: expressroute
 author: duongau
 ms.service: expressroute
 ms.topic: include
 ms.date: 05/7/2024
 ms.author: duau
 ms.custom: include file
---

The following tables provides an overview of the different types of gateways, their respective limitations, and their expected performance metrics. These numbers are derived from the following testing conditions and represent the max support limits. Actual performance may vary, depending on how closely traffic replicates these testing conditions.

#### Testing conditions

| Gateway SKU | Traffic sent from on-premises | Number of routes advertised by gateway | Number of routes learned by gateway |
|--|--|--|--|
| **Standard/ERGw1Az** | 1 Gbps | 500 | 4000 |
| **High Performance/ERGw2Az** | 2 Gbps | 500 | 9,500 |
| **Ultra Performance/ErGw3Az** | 10 Gbps | 500 | 9,500 |
| **ErGwScale (per scale unit)** | 1 Gbps | 500 | 4,000 |

> [!NOTE]
> ExpressRoute can facilitate up to 11,000 routes that spans virtual network address spaces, on-premises network, and any relevant virtual network peering connections. To ensure stability of your ExpressRoute connection, refrain from advertising more than 11,000 routes to ExpressRoute.

#### Performance results

This table applies to both the Azure Resource Manager and classic deployment models.

| Gateway SKU | Connections per second | Mega-Bits per second | Packets per second | Supported number of VMs in the virtual network <sup>1<sup/> | Flow count limit |
|--|--|--|--|--|--|
| **Standard/ERGw1Az** | 7,000 | 1,000 | 100,000 | 2,000 | 200,000 |
| **High Performance/ERGw2Az** | 14,000 | 2,000 | 200,000 | 4,500 | 400,000 |
| **Ultra Performance/ErGw3Az** | 16,000 | 10,000 | 1,000,000 | 11,000 | 1,000,000 |
| **ErGwScale (per scale unit)** | N/A | 1,000 | 100,000 | 2,000 | 100,000 per scale unit |

<sup>1<sup/> The values in the table are estimates and varies depending on the CPU utilization of the gateway. If the CPU utilization is high and the number of supported VMs gets exceeded, the gateway will start to dropping packets.

> [!IMPORTANT]
> * Application performance depends on multiple factors, such as end-to-end latency, and the number of traffic flows the application opens. The numbers in the table represent the upper limit that the application can theoretically achieve in an ideal environment. Additionally, Microsoft performs routine host and OS maintenance on the ExpressRoute Virtual Network Gateway, to maintain reliability of the service. During a maintenance period, the control plane and data path capacity of the gateway is reduced.
> * During a maintenance period, you may experience intermittent connectivity issues to private endpoint resources.
> * ExpressRoute supports a maximum TCP and UDP packet size of 1400 bytes. Packet size larger than 1400 bytes will get fragmented.
> * Azure Route Server can support up to 4000 VMs. This limit includes VMs in virtual networks that are peered. For more information, see [Azure Route Server limitations](../articles/route-server/overview.md#route-server-limits).
