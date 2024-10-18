---
 title: include file
 description: include file
 services: networking
 author: aimee-littleton
 ms.service: NAT Gateway
 ms.topic: include
 ms.date: 09/24/2020
 ms.author: alittleton
 ms.custom: include file

---
The following limits apply to NAT gateway resources managed through Azure Resource Manager per region per subscription. Learn how to [view your current resource usage against your subscription limits](../articles/networking/check-usage-against-limits.md).


| Resource            | Limit              |
|---------------------|--------------------|
| Public IP addresses | 16 per NAT gateway |
| Subnets             | 800 per NAT gateway |
| Data throughput<sup>1</sup>     | 50 Gbps |
| NAT gateways for Enterprise and CSP agreements<sup>2</sup>       | 1,000 per subscription per region |
| NAT gateways for Sponsored and pay-as-you-go<sup>2</sup>         | 100 per subscription per region |
| NAT gateways for Free Trial and all other offer types<sup>2</sup>             | 15 per subscription per region |
| Packets processed   | 1M - 5M packets per second |
| Connections to same destination endpoint | 50,000 connections to the same destination per public IP |
| Connections total | 2M connections per NAT gateway |

<sup>1</sup> The total data throughput of 50 Gbps is split between outbound and inbound (return) data through a NAT gateway resource. Data throughput is rate limited at 25 Gbps for outbound data and 25 Gbps for inbound (response) data through NAT gateway.

<sup>2</sup> Default limits for NAT gateways vary by offer category type, such as Free Trial, pay-as-you-go, and CSP. For example, the default for Enterprise Agreement subscriptions is 1000.
