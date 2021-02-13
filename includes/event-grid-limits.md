---
 title: include file
 description: include file
 services: event-grid
 author: spelluru
 ms.service: event-grid
 ms.topic: include
 ms.date: 10/18/2020
 ms.author: spelluru
 ms.custom: include file
---

The following limits apply to Azure Event Grid **topics** (system,  custom, and partner topics). 

| Resource | Limit |
| --- | --- |
| Custom topics per Azure subscription | 100 |
| Event subscriptions per topic | 500 |
| Publish rate for a custom or a partner topic (ingress) | 5,000 events/sec or 1 MB/sec (whichever is met first) |
| Event size | 1 MB  |
| Private endpoint connections per topic  | 64 | 
| IP Firewall rules per topic | 16 | 

The following limits apply to Azure Event Grid **domains**. 

| Resource | Limit |
| --- | --- |
| Topics per event domain | 100,000 |
| Event subscriptions per topic within a domain | 500 |
| Domain scope event subscriptions | 50 |
| Publish rate for an event domain (ingress) | 5,000 events/sec or 1 MB/sec (whichever is met first) |
| Event Domains per Azure Subscription | 100 |
| Private endpoint connections per domain | 64 | 
| IP Firewall rules per domain | 16 | 


