---
author: alexeyo26
ms.service: azure-ai-speech
ms.topic: include
ms.date: 03/19/2021
ms.author: alexeyo
---

## Simultaneous use of private endpoints and Virtual Network service endpoints

You can use [private endpoints](../speech-services-private-link.md) and [Virtual Network service endpoints](../speech-service-vnet-service-endpoint.md) to access to the same Speech resource simultaneously. To enable this simultaneous use, you need to use the **Selected Networks and Private Endpoints** option in the networking settings of the Speech resource in the Azure portal. Other options aren't supported for this scenario.
