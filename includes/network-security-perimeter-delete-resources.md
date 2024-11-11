---
 title: include file
 description: include file
 services: private-link
 author: mbender
 ms.service: azure-private-link
 ms.topic: include
 ms.date: 11/05/2024
 ms.author: mbender> -ms
ms.custom: include file
---

---
 title: include file
 description: include file
 services: private-link
 author: mbender
 ms.service: azure-private-link
 ms.topic: include
 ms.date: 11/11/2024
 ms.author: mbender> -ms
ms.custom: include file
---

> [!NOTE]
> Removing your resource association from the network security perimeter results in access control falling back to the existing resource firewall configuration. This may result in access being allowed/denied as per the resource firewall configuration. For more information, see [Transition to a network security perimeter in Azure](../articles/private-link/network-security-perimeter-transition.md#transition-to-a-network-security-perimeter-in-azure) for implications of `publicNetworkAccess` set to `SecuredByPerimeter` when the resource is not associated with a network security perimeter.