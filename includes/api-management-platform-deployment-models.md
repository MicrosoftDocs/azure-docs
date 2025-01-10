---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 08/08/2023
ms.author: danlep
---

|Model|Description  |
|---------|---------|
|**Centralized**<br/><br/>:::image type="content" source="media/workspaces-overview/centralized.png" alt-text="Diagram of the centralized model of Azure API Management." border="false" lightbox="media/workspaces-overview/centralized.png":::      |**Pros**<br/>• Centralized API governance and observability<br/>• Unified developer portal for effective API discovery and onboarding<br/>• Cost-efficiency of the infrastructure<br/><br/>**Cons**<br/>• No segregation of administrative permissions between teams<br/>• API gateway is a single point of failure<br/>• Inability to attribute runtime issues to specific teams<br/>• Burden on platform team to facilitate collaboration may reduce API growth     |
|**Siloed**<br/><br/>:::image type="content" source="media/workspaces-overview/siloed.png"  alt-text="Diagram of the siloed model of Azure API Management." border="false" lightbox="media/workspaces-overview/siloed.png":::       |**Pros**<br/>• Segregation of administrative permissions between teams increases productivity and security<br/>• Segregation of API runtime between teams increases API reliability, resiliency, and security<br/>• Runtime issues are contained and attributable to specific teams<br/><br/>**Cons**<br/>• Lack of centralized API governance and observability<br/>• Lack of unified developer portal<br/>• Increased cost and harder platform management​    | 
|**Federated**<br/><br/>:::image type="content" source="media/workspaces-overview/federated.png" alt-text="Diagram of the federated model of Azure API Management." border="false" lightbox="media/workspaces-overview/federated.png":::       |**Pros**<br/>• Centralized API governance and observability<br/>• Unified developer portal for effective API discovery and onboarding<br/>• Segregation of administrative permissions between teams increases productivity and security<br/>• Segregation of API runtime between teams increases API reliability, resiliency, and security<br/>• Runtime issues are contained and attributable to specific teams<br/><br/>**Cons**<br/>• Platform cost and management difficulty greater than in the centralized model but lower than in the siloed model |
