---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 07/25/2022
ms.author: danlep
---


* With multi-region deployment, only the [gateway component](../articles/api-management/api-management-key-concepts.md#api-management-components) of your API Management instance is replicated to multiple regions. The instance's management plane and developer portal remain hosted only in the *primary* region, the region where you originally deployed the service. 

* Gateway configurations such as APIs and policy definitions are regularly synchronized between the primary and secondary regions you add. Multi-region deployment provides availability of the API gateway in more than one region and provides service availability if one region goes offline.

* When API Management receives public HTTP requests to the traffic manager endpoint (applies for the external VNet and non-networked modes of API Management), traffic is routed to a regional gateway based on lowest latency, which can reduce latency experienced by geographically distributed API consumers. 

* If a region goes offline, API requests are automatically routed around the failed region to the next closest gateway.

* If the primary region goes offline, the API Management management plane and developer portal become unavailable, but secondary regions continue to serve API requests using the most recent gateway configuration. 
