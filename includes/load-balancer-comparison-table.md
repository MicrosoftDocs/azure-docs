---
 title: include file
 description: include file
 services: load balancer
 author: KumudD
 ms.service: load-balancer
 ms.topic: include
 ms.date: 02/08/2018
 ms.author: kumud
 ms.custom: include file
---

| | Standard SKU | Basic SKU |
| --- | --- | --- |
| Backend pool size | Supports up to 1000 instances. | Supports up to 300 instances. |
| Backend pool endpoints | Any virtual machine in a single virtual network, including blends of virtual machines, availability sets, and virtual machine scale sets. | Virtual machines in a single availability set or virtual machine scale set. |
| [Health probes](../articles/load-balancer/load-balancer-custom-probe-overview.md#types) | TCP, HTTP, HTTPS | TCP, HTTP |
| [Health probe down behavior](../articles/load-balancer/load-balancer-custom-probe-overview.md#probedown) | TCP connections stay alive on an instance probe down __and__ on all probes down. | TCP connections stay alive on an instance probe down. All TCP connections terminate when all probes are down. |
| Availability Zones | Zone-redundant and zonal front ends for inbound and outbound traffic. Outbound flows mappings survive zone failure. Cross-zone load balancing. | Not available |
| Diagnostics | Azure Monitor. Multi-dimensional metrics including byte and packet counters. Health probe status. Connection attempts (TCP SYN). Outbound connection health (SNAT successful and failed flows). Active data plane measurements. | Azure Log Analytics for public Load Balancer only. SNAT exhaustion alert. Back-end pool health count. |
| HA Ports | Internal Load Balancer | Not available |
| Secure by default | Public IP, public Load Balancer endpoints, and internal Load Balancer endpoints are closed to inbound flows unless allowed by a network security group. Please note that internal traffic from the VNET to the internal load balancer is still allowed. | Open by default. Network security group optional. |
| [Outbound connections](../articles/load-balancer/load-balancer-outbound-connections.md) | You can explicitly define pool-based outbound NAT with [outbound rules](../articles/load-balancer/load-balancer-outbound-rules-overview.md). You can use multiple front ends with per load-balancing rule opt-out. An outbound scenario _must_ be explicitly created for the virtual machine, availability set, or virtual machine scale set to use outbound connectivity. Virtual network service endpoints can be reached without defining outbound connectivity and don't count towards data processed. Any public IP addresses, including Azure PaaS services not available as virtual network service endpoints, must be reached by using outbound connectivity and count towards data processed. When only an internal Load Balancer serves virtual machine, availability set, or virtual machine scale set, outbound connections over default SNAT aren't available. Use [outbound rules](../articles/load-balancer/load-balancer-outbound-rules-overview.md) instead. Outbound SNAT programming depends on the transport protocol  of the inbound load-balancing rule. | Single front end, selected at random when multiple front ends are present. When only internal Load Balancer serves a virtual machine, availability set, or virtual machine scale set, default SNAT is used. |
| [Outbound Rules](../articles/load-balancer/load-balancer-outbound-rules-overview.md) | Declarative outbound NAT configuration, using public IP addresses or public IP prefixes or both. Configurable outbound idle timeout (4-120 minutes). Custom SNAT port allocation | Not available |
| [TCP Reset on Idle](../articles/load-balancer/load-balancer-tcp-reset.md) | Enable TCP Reset (TCP RST) on Idle Timeout on any rule | Not available |
| [Multiple front ends](../articles/load-balancer/load-balancer-multivip-overview.md) | Inbound and [outbound](../articles/load-balancer/load-balancer-outbound-connections.md) | Inbound only |
| Management Operations | Most operations < 30 seconds | 60-90+ seconds typical |
| SLA | 99.99% for data path with two healthy virtual machines. | Not applicable | 
| Pricing | Charged based on number of rules, data processed inbound and outbound associated with resource. | No charge |
|  |  |  |
