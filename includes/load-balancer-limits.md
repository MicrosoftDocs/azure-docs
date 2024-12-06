---
 title: include file
 description: include file
 services: networking
 author: anavinahar
 ms.service: networking
 ms.topic: include
 ms.date: 10/24/2024
 ms.author: anavin
 ms.custom: include file

---
### Standard Load Balancer

| Resource                                | Limit         |
|-----------------------------------------|-------------------------------|
| Load balancers                          | 1,000                         |
| Frontend IP configurations              | 600                           |
| Rules (Load Balancer + Inbound NAT) per resource  | 1,500               |
| Rules per NIC (across all IPs on a NIC)<sup>1<sup> | 300                           |
| High-availability ports rule            | 1 per internal frontend       |
| Outbound rules per Load Balancer        | 600                           |
| Backend pool size                       | 5,000                         |
| Azure global Load Balancer Backend pool size                       | 300                         |
| Backend IP configurations per frontend <sup>2<sup> | 10,000                        |
| Backend IP configurations across all frontends | 500,000 |

<sup>1<sup> Each NIC can have a total of 300 rules (load balancing, inbound NAT, and outbound rules combined) configured across all IP configurations on the NIC.
<sup>2</sup> Backend IP configurations are aggregated across all load balancer rules including load balancing, inbound NAT, and outbound rules. Each rule a backend pool instance is configured to counts as one configuration.

Load Balancer doesn't apply any throughput limits. However, throughput limits for virtual machines and virtual networks still apply. For more information, see [Virtual machine network bandwidth](../articles/virtual-network/virtual-machine-network-throughput.md).

### Gateway Load Balancer

| Resource                                | Limit        |
|-----------------------------------------|------------------------------|
| Resources chained per Load Balancer (LB frontend configurations or VM NIC IP configurations combined) | 100 |

All limits for Standard Load Balancer also apply to Gateway Load Balancer.

### Basic Load Balancer

| Resource                                | Limit        |
|-----------------------------------------|------------------------------|
| Load balancers                          | 1,000                        |
| Rules per resource                      | 250                          |
| Rules per NIC (across all IPs on a NIC) | 300                          |
| Frontend IP configurations <sup>3<sup>  | 200                          |
| Backend pool size                       | 300 IP configurations, single availability set |
| Availability sets per Load Balancer     | 1                            |
| Load Balancers per VM                   | 2 (1 Public and 1 internal)  |

<sup>3</sup> The limit for a single discrete resource in a backend pool (standalone virtual machine, availability set, or virtual machine scale-set placement group) is to have up to 250 Frontend IP configurations across a single Basic Public Load Balancer and Basic Internal Load Balancer.