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
| **Limitations for Connected Groups** | |
| Virtual Networks in a Group | Max 250 virtual networks |
| Communication with Private Endpoints | Not supported in current preview |
| Hub-and-Spoke Configuration | Max 500 virtual networks peered to the hub |
| Direct Connectivity | Max 250 virtual networks if enabled |
| Network Group Membership | A virtual network can be part of up to two connected groups |
| Overlapping IP Spaces | Communication to overlapped IP address is dropped |
| **Limitations for Security Admin Rules** | |
| IP Prefixes | Max 1,000 IP prefixes combined |
| Admin Rules | Max 100 admin rules at one level |
