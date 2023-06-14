---
title: Azure Load Balancer distribution modes
description: Get started learning about the different distribution modes of Azure Load Balancer.
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: conceptual 
ms.date: 05/30/2023
ms.custom: template-concept 
#Customer intent: As a administrator, I want to learn about the different distribution modes of Azure Load Balancer so that I can configure the distribution mode for my application.
---

# Azure Load Balancer distribution modes

Azure Load Balancer supports the following distribution modes for routing connections to instances in the backend pool:

| Distribution mode | Hash based | Session persistence: Client IP | Session persistence: Client IP and protocol |
| --- | --- | --- | --- |
| Overview | Traffic from the same client IP routed to any healthy instance in the backend pool | Traffic from the same client IP is routed to the same backend instance | Traffic from the same client IP and protocol is routed to the same backend instance |
| Tuples | five-tuple | two-tuple | three-tuple |
| Azure portal configuration | Session persistence: **None** | Session persistence: **Client IP** | Session persistence: **Client IP and protocol** |
| [REST API](/rest/api/load-balancer/load-balancers/create-or-update#loaddistribution) |  ```"loadDistribution":"Default"```| ```"loadDistribution":SourceIP```    | ```"loadDistribution":SourceIPProtocol```    |

There's no downtime when switching from one distribution mode to another on a load balancer.

## Hash based

Azure Load Balancer uses a five-tuple hash based distribution mode by default.  

The five-tuple consists of:
* **Source IP**
* **Source port**
* **Destination IP**
* **Destination port**
* **Protocol type**

The hash is used to route traffic to healthy backend instances within the backend pool. The algorithm provides stickiness only within a transport session. When the client starts a new session from the same source IP, the source port changes and causes the traffic to go to a different backend instance.
In order to configure hash based distribution, you must select session persistence to be **None** in the Azure portal. This specifies that successive requests from the same client may be handled by any virtual machine.

![Hash-based distribution](./media/load-balancer-overview/load-balancer-distribution.png)

*Figure: Default five-tuple hash based distribution*


## Session persistence 

Session persistence is also known session affinity, source IP affinity, or client IP affinity. This distribution mode uses a two-tuple (source IP and destination IP) or three-tuple (source IP, destination IP, and protocol type) hash to route to backend instances. When using session persistence, connections from the same client go to the same backend instance within the backend pool.

Session persistence mode has two configuration types:

* **Client IP (2-tuple)** - Specifies that successive requests from the same client IP address are handled by the same backend instance.
* **Client IP and protocol (3-tuple)** - Specifies that successive requests from the same client IP address and protocol combination are handled by the same backend instance.

The following figure illustrates a two-tuple configuration. Notice how the two-tuple runs through the load balancer to virtual machine 1 (VM1). VM1 is backed up by VM2 and VM3.

![Two-tuple session affinity distribution mode](./media/load-balancer-distribution-mode/load-balancer-session-affinity.png)



## Use cases

Source IP affinity with client IP and protocol (source IP affinity three-tuple), solves an incompatibility between Azure Load Balancer and Remote Desktop Gateway (RD Gateway). 

Another use case scenario is media upload. The data upload happens through UDP, but the control plane is achieved through TCP:

* A client starts a TCP session to the load-balanced public address and is directed to a specific DIP. The channel is left active to monitor the connection health.
* A new UDP session from the same client computer is started to the same load-balanced public endpoint. The connection is directed to the same DIP endpoint as the previous TCP connection. The media upload can be executed at high throughput while maintaining a control channel through TCP.

> [!NOTE]
> When Load Balancer backend pool members change either by removing or adding a virtual machine, the distribution of client requests is recomputed. You can't depend on new connections from existing clients to end up at the same server. Additionally, using source IP affinity distribution mode can cause an uneven distribution of traffic. Clients that run behind proxies might be seen as one unique client application.


## Next steps

For more information on how to configure the distribution mode of Azure Load Balancer, see [Configure the distribution mode for Azure Load Balancer](load-balancer-distribution-mode.md).

