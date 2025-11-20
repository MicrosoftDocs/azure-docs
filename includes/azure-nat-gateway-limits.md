---
 title: include file
 description: include file
 services: networking
 author: aimee-littleton
 ms.service: NAT Gateway
 ms.topic: include
 ms.date: 09/09/2025
 ms.author: alittleton
 ms.custom: include file

---
The following limits apply to Standard and StandardV2 NAT gateway resources managed through Azure Resource Manager per region per subscription. Learn how to [view your current resource usage against your subscription limits](../articles/networking/check-usage-against-limits.md).

> [!IMPORTANT]
> Standard V2 SKU Azure NAT Gateway is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

> [!NOTE]
> Each subscription has a combined quota for both Standard and StandardV2 NAT gateways. For example, if your subscription has a quota of 100 NAT gateways, you can create any combination of Standard and StandardV2 NAT gateways up to that quota.


| Resource            | Standard SKU       | StandardV2 SKU     |
|---------------------|--------------------|--------------------|
| Public IP addresses | 16 IPv4 addresses  | 16 IPv4 addresses  |
| Subnets             | 800 per NAT gateway | 800 per NAT gateway |
| Data throughput<sup>1</sup>     | 50 Gbps per NAT gateway | 100 Gbps per NAT gateway, 1 Gbps per NAT gateway |
| NAT gateways for Enterprise and CSP agreements<sup>2</sup>       | 1,000 per subscription per region | see previous column for combined quota |
| NAT gateways for Sponsored and pay-as-you-go<sup>2</sup>         | 100 per subscription per region | see previous column for combined quota |
| NAT gateways for Free Trial and all other offer types<sup>2</sup>             | 15 per subscription per region | see previous column for combined quota|
| Packets processed   | 5M packets per second | 10M packets per second per NAT Gateway, 100,000 PPS per connection  |
| Connections to same destination endpoint | 50,000 connections to the same destination per public IP | 50,000 connections to the same destination per public IP |
| Connections total | 2M connections per NAT gateway | 2M connections per NAT gateway |

<sup>1</sup> For a Standard SKU NAT gateway resource, the total data throughput of 50 Gbps is split between outbound and inbound (return) data. Data throughput is supported up to 25 Gbps for outbound data and up to 25 Gbps for inbound (response) data through NAT gateway.

<sup>2</sup> Default limits for NAT gateways vary by offer category type, such as Free Trial, pay-as-you-go, and CSP. For example, the default for Enterprise Agreement subscriptions is 1000.
