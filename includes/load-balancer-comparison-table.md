---
 title: include file
 description: include file
 services: load balancer
 author: KumudD
 ms.service: load-balancer
 ms.topic: include
 ms.date: 02/21/2020
 ms.author: kumud
 ms.custom: include file
---

| | Standard Load Balancer | Basic Load Balancer |
| --- | --- | --- |
| [Backend pool size](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits#load-balancer) | Supports up to 1000 instances. | Supports up to 300 instances. |
| Backend pool endpoints | Any virtual machines or virtual machine scale sets in a single virtual network. | Virtual machines in a single availability set or virtual machine scale set. |
| [Health probes](../articles/load-balancer/load-balancer-custom-probe-overview.md#types) | TCP, HTTP, HTTPS | TCP, HTTP |
| [Health probe down behavior](../articles/load-balancer/load-balancer-custom-probe-overview.md#probedown) | TCP connections stay alive on an instance probe down __and__ on all probes down. | TCP connections stay alive on an instance probe down. All TCP connections terminate when all probes are down. |
| Availability Zones | Zone-redundant and zonal frontends for inbound and outbound traffic. | Not available |
| Diagnostics | [Azure Monitor multi-dimensional metrics](../articles/load-balancer/load-balancer-standard-diagnostics.md) | [Azure Monitor logs](../articles/load-balancer/load-balancer-monitor-log.md) |
| HA Ports | [Available for Internal Load Balancer](../articles/load-balancer/load-balancer-ha-ports-overview.md) | Not available |
| Secure by default | Closed to inbound flows unless allowed by a network security group. Please note that internal traffic from the VNet to the internal load balancer is allowed. | Open by default. Network security group optional. |
| Outbound Rules | [Declarative outbound NAT configuration](../articles/load-balancer/load-balancer-outbound-rules-overview.md) | Not available |
| TCP Reset on Idle | [Available on any rule](../articles/load-balancer/load-balancer-tcp-reset.md) | Not available |
| [Multiple front ends](../articles/load-balancer/load-balancer-multivip-overview.md) | Inbound and [outbound](../articles/load-balancer/load-balancer-outbound-connections.md) | Inbound only |
| Management Operations | Most operations < 30 seconds | 60-90+ seconds typical |
| SLA | [99.99%](https://azure.microsoft.com/support/legal/sla/load-balancer/v1_0/) | Not available | 
