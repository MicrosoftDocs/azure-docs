---
author: alexeyo26
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 01/08/2021
ms.author: alexeyo
---

## Simultaneous use of private endpoints and VNet service endpoints

[Private endpoints](../speech-services-private-link.md) and [VNet service endpoints](../speech-service-vnet-service-endpoint.md) can be used for the access to the same Speech resource simultaneously. However, note the following limitation: for enabling private endpoint(s) and VNet service endpoint(s) simultaneously you need to use **Selected Networks and Private Endpoints** option in the networking settings of the Speech resource. All other options are not supported for this scenario.