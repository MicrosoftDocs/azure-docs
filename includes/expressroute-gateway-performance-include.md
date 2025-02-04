---
 title: Include file
 description: Include file
 services: expressroute
 author: duongau
 ms.service: azure-expressroute
 ms.topic: include
 ms.date: 07/09/2024
 ms.author: duau
 ms.custom: include file
---

The following tables provide an overview of the different types of gateways, their respective limitations, and their expected performance metrics.


#### Maximum supported limits

This table applies to both the Azure Resource Manager and classic deployment models.

| Gateway SKU | Megabits per second | Packets per second | Supported number of VMs in the virtual network <sup>1</sup> | Flow count limit | Number of routes learned by gateway |
|--|--|--|--|--|--|
| **Standard/ERGw1Az** | 1,000 | 100,000 | 2,000 | 200,000 | 4,000 |
| **High Performance/ERGw2Az** | 2,000 | 200,000 | 4,500 | 400,000 | 9,500 |
| **Ultra Performance/ErGw3Az** | 10,000 | 1,000,000 | 11,000 | 1,000,000 | 9,500 |
| **ErGwScale (per scale unit 1-40)** | 1,000 per scale unit | 100,000 per scale unit | 2,000 per scale unit | 100,000 per scale unit | 60,000 total per gateway

<sup>1</sup> The values in the table are estimates and vary depending on the CPU utilization of the gateway. If the CPU utilization is high and the number of supported VMs is exceeded, the gateway will start to drop packets.
> [!NOTE]
> ExpressRoute can facilitate up to 11,000 routes that span virtual network address spaces, on-premises networks, and any relevant virtual network peering connections. To ensure stability of your ExpressRoute connection, refrain from advertising more than 11,000 routes to ExpressRoute. The maximum number of routes advertised by gateway is 1,000 routes.

> [!IMPORTANT]
> * Application performance depends on multiple factors, such as end-to-end latency and the number of traffic flows that the application opens. The numbers in the table represent the upper limit that the application can theoretically achieve in an ideal environment. Additionally, we perform routine host and OS maintenance on the ExpressRoute virtual network gateway, to maintain reliability of the service. During a maintenance period, the control plane and data path capacity of the gateway is reduced.
> * During a maintenance period, you might experience intermittent connectivity problems to private endpoint resources.
> * ExpressRoute supports a maximum TCP and UDP packet size of 1,400 bytes. Packet sizes larger than 1,400 bytes will get fragmented.
> * Azure Route Server can support up to 4,000 VMs. This limit includes VMs in virtual networks that are peered. For more information, see [Azure Route Server limitations](/azure/route-server/overview#route-server-limits).
