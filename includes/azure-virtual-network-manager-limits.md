---
 title: include file
 description: include file
 services: networking
 author: darrent
 ms.service: networking
 ms.topic: include
 ms.date: 06/06/2024
 ms.author: darrent
 ms.custom: include file
---

| Category | Limitation |
| --- | --- |
| **General Limitations** | |
| Cross-tenant Support | Only with static membership network groups |
| Azure Subscriptions | Policy application limited to < 15,000 subscriptions |
| Policy Enforcement Mode | No addition to network group if set to Disabled |
| Policy Evaluation Cycle | Standard evaluation cycle not supported |
| Subscription Movement | Moving subscription to another tenant not supported |
| **Limits for Connectivity Configurations** | |
| Virtual Networks in a Connected Group | A connected group can include up to 250 VNets by default, expandable to 1000 upon request using [this form](https://forms.office.com/r/xXxYrQt0NQ).|
| Private Endpoints | 1000 private endpoints per connected group |
| Hub-and-Spoke Configuration | Max 1000 virtual networks peered to the hub |
| Direct Connectivity | Up to 250 VNets by default, expandable to 1000 upon request using [this form](https://forms.office.com/r/xXxYrQt0NQ). |
| Group Membership | A virtual network can be part of up to two connected groups, expandable to 1000 upon request using [this form](https://forms.office.com/r/xXxYrQt0NQ). |
| Overlapping IP Spaces | Communication to overlapped IP address is dropped |
| **Limits for Security Admin Rules** | |
| IP Prefixes | Max 1,000 IP prefixes combined |
| Admin Rules | Max 100 admin rules at one level |
| **Limits for User Defined Routes** | |
| User Defined Routes per Route Table | Max 1,000 |
