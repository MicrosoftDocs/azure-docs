---
 title: include file
 description: include file
 services: networking
 author: johndowns
 ms.service: NAT Gateway
 ms.topic: include
 ms.date: 09/24/2020
 ms.author: jodowns
 ms.custom: include file

---
The following limits apply to NAT gateway resources managed through Azure Resource Manager per region per subscription. Learn how to [view your current resource usage against your subscription limits](../articles/networking/check-usage-against-limits.md).


| Resource            | Limit              |
|---------------------|--------------------|
| Public IP addresses | 16 per NAT gateway |
| Subnets             | 800 per NAT gateway |
| Data throughput     | 50 Gbps |
| NAT gateways        | 1,000 per subscription per region |
| Packets processed   | 1M - 5M packets per second |
| Connections to same destination endpoint | 50,000 connections to the same destination per public IP |
| Connections total | 2M connections per NAT gateway |
