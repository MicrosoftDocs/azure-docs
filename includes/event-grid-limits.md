---
 title: include file
 description: include file
 services: event-grid
 author: tfitzmac
 ms.service: event-grid
 ms.topic: include
 ms.date: 04/30/2018
 ms.author: tomfitz
 ms.custom: include file
---

####

The following limits apply to Event Grid system topics and custom topics, *not* Event Domains.

| Resource | Limit |
| --- | --- |
| Custom topics per Azure subscription | 100 |
| Event subscriptions per topic | 500 |
| Publish rate for a custom topic (ingress) | 5,000 events per second per topic |

####

The following limits apply to Event Domains only.

| Resource | Limit |
| --- | --- |
| Topics per Event Domain | 1,000 during public preview |
| Event Subscriptions per topic within a Domain | 50 during public preview |
| Domain scope Event Subscriptions | 50 during public preview |
| Publish rate for an Event Domain (ingress) | 5,000 events per second during public preview |