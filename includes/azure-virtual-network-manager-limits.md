---
 title: include file
 description: include file
 services: networking
 author: mbender-ms
 ms.service: networking
 ms.topic: include
 ms.date: 09/16/2026
 ms.author: mbender
 ms.custom: include file
---

| Category | Limitation |
| --- | --- |
| **General Limitations** | |
| Cross-tenant Support | Only with static membership network groups |
| Azure Subscriptions | Policy application limited to fewer than 15,000 subscriptions |
| Policy Enforcement Mode | No addition to network group if set to Disabled |
| Policy Evaluation Cycle | Standard evaluation cycle not supported |
| Subscription Movement | Moving subscription to another tenant not supported |
| **Limits for Connectivity Configurations** | |
| Virtual Networks in a Connected Group | A connected group can include up to 250 virtual networks by default. In supported regions, you can increase the limit to 3,000 by registering the high-scale connected group feature. You can request an increase to 5,000 by submitting the [scaling request form](https://forms.cloud.microsoft.com/r/BBNK1V8qTD). |
| Private Endpoints | 2,000 private endpoints per connected group |
| Hub-and-Spoke Configuration | Up to 1,000 virtual networks peered to the hub |
| Direct Connectivity | Up to 250 virtual networks by default. In supported regions, you can increase the limit to 3,000 by registering the high-scale connected group feature. You can request an increase to 5,000 by submitting the [scaling request form](https://forms.cloud.microsoft.com/r/BBNK1V8qTD). |
| Group Membership | A virtual network can be part of up to two connected groups. You can request an increase to 1,000 by submitting the [connected group limit request form](https://forms.cloud.microsoft.com/r/1Je8uWNkXJ). |
| Overlapping IP Spaces | Communication to an overlapping IP address is dropped |
| **Limits for Security Admin Rules** | |
| IP Prefixes | Max 20,000 IP prefixes combined per one Azure Virtual Network Manager resource |
| Admin Rules | Max 100 admin rules combined per one Azure Virtual Network Manager resource |
| **Limits for User Defined Routes** | |
| User Defined Routes per Route Table | Max 1,000 |
