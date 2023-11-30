---
author: mdgattuso
ms.service: cdn
ms.topic: include
ms.date: 07/31/2021    
ms.author: magattus
---

| Resource | Limit |
| --- | --- |
| Azure Content Delivery Network profiles | 25 |
| Content Delivery Network endpoints per profile | 25 |
| Custom domains per endpoint | 25 |
| Maximum origin group per profile | 10 |
| Maximum origin per origin group | 10 |
| Maximum number of rules per CDN endpoint | 25 |
| Maximum number of match conditions per rule	| 10 |
| Maximum number of actions per rule	| 5 |
| Maximum bandwidth per profile* | 75 Gbps |
| Maximum requests per second per profile | 100,000 |

*These two limits are only applicable to Azure CDN Standard from Microsoft (classic). If the traffic is not globally distributed and concentrated in one or two regions, or if a higher quota limit is needed, create an [Azure Support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). 

A Content Delivery Network subscription can contain one or more Content Delivery Network profiles. A Content Delivery Network profile can contain one or more Content Delivery Network endpoints. You might want to use multiple profiles to organize your Content Delivery Network endpoints by internet domain, web application, or some other criteria. 


