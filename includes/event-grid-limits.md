---
 title: include file
 description: include file
 services: event-grid
 author: spelluru
 ms.service: event-grid
 ms.topic: include
 ms.date: 09/07/2022
 ms.author: spelluru
 ms.custom: include file
---

The following limits apply to Azure Event Grid **topics** (system,  custom, and partner topics). 

> [!NOTE]
> These limits are per region. 

| Resource | Limit |
| --- | --- |
| Custom topics per Azure subscription | 100. <br/>When the limit is reached, you can consider a different region or consider using domains, which can support 100,000 topics.  |
| Event subscriptions per topic | 500<br/>This limit can't be increased. |
| Publish rate for a custom or a partner topic (ingress) | 5,000 events/sec or 5 MB/sec (whichever is met first) |
| Event size | 1 MB<br/>This limit can't be increased. |
| Number of incoming events per batch | 5,000<br/>This limit can't be increased. | 
| Private endpoint connections per topic  | 64<br/>This limit can't be increased. | 
| IP Firewall rules per topic | 128 | 

The following limits apply to Azure Event Grid **domains**. 

| Resource | Limit |
| --- | --- |
| Topics per event domain | 100,000 |
| Event subscriptions per topic within a domain | 500<br/>This limit can't be increased. |
| Domain scope event subscriptions | 50 <br/>This limit can't be increased.|
| Publish rate for an event domain (ingress) | 5,000 events/sec or 5 MB/sec (whichever is met first) |
| Event Domains per Azure Subscription | 100 |
| Private endpoint connections per domain | 64 | 
| IP Firewall rules per domain | 128 | 


