---
 title: include file
 description: include file
 services: expressroute
 author: duongau
 ms.service: expressroute
 ms.topic: include
 ms.date: 09/11/2023
 ms.author: duau
 ms.custom: include file
---

The following table shows the gateway types and the estimated performance scale numbers. These numbers are derived from the following testing conditions and represent the max support limits. Actual performance may vary, depending on how closely traffic replicates these testing conditions.

#### Testing conditions

| Gateway SKU | Traffic sent from on-premises | Number of routes advertised by gateway | Number of routes learned by gateway |
|--|--|--|--|
| **Standard/ERGw1Az** | 1 Gbps | 500 | 4000 |
| **High Performance/ERGw2Az** | 2 Gbps | 500 | 9,500 |
| **Ultra Performance/ErGw3Az** | 10 Gbps | 500 | 9,500 |

### Performance results

This table applies to both the Resource Manager and classic deployment models.
 
|Gateway SKU|Connections per second|Mega-Bits per second|Packets per second|Supported number of VMs in the Virtual Network|
| --- | --- | --- | --- | --- |
|**Standard/ERGw1Az**|7,000|1,000|100,000|2,000|
|**High Performance/ERGw2Az**|14,000|2,000|250,000|4,500|
|**Ultra Performance/ErGw3Az**|16,000|10,000|1,000,000|11,000|

> [!IMPORTANT]
> * Application performance depends on multiple factors, such as end-to-end latency, and the number of traffic flows the application opens. The numbers in the table represent the upper limit that the application can theoretically achieve in an ideal environment. Additionally, Microsoft performs routine host and OS maintenance on the ExpressRoute Virtual Network Gateway, to maintain reliability of the service. During a maintenance period, the control plane and data path capacity of the gateway is reduced.
> * During a maintenance period, you may experience intermittent connectivity issues to private endpoint resources.
> * ExpressRoute supports a maximum TCP and UDP packet size of 1400 bytes. Packet size larger than 1400 bytes will get fragmented.
