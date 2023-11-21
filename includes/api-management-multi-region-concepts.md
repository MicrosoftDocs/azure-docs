---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 07/25/2022
ms.author: danlep
---


* With multi-region deployment, only the [gateway component](../articles/api-management/api-management-key-concepts.md#api-management-components) of your API Management instance is replicated to multiple regions. The instance's management plane and developer portal remain hosted only in the *primary* region, the region where you originally deployed the service.
  
* If you want to configure a secondary location for your APIM, the VNET and subnet region should match with the secondary location you're configuring. If you're adding, removing, or enabling the Availability zone in the Primary region, or if you're changing the subnet of the primary region, then the VIP of APIM will change. For more information, see [IP addresses of Azure API Management service](/azure/api-management/api-management-howto-ip-addresses#changes-to-the-ip-addresses). However, if you're adding a secondary region, the primary region's VIP of APIM won't change because every region has its own private VIP.

* Gateway configurations such as APIs and policy definitions are regularly synchronized between the primary and secondary regions you add. Multi-region deployment provides availability of the API gateway in more than one region and provides service availability if one region goes offline.

* When API Management receives public HTTP requests to the traffic manager endpoint (applies for the external VNet and non-networked modes of API Management), traffic is routed to a regional gateway based on lowest latency, which can reduce latency experienced by geographically distributed API consumers. 

* If a region goes offline, API requests are automatically routed around the failed region to the next closest gateway.

* If the primary region goes offline, the API Management management plane and developer portal become unavailable, but secondary regions continue to serve API requests using the most recent gateway configuration.
  
