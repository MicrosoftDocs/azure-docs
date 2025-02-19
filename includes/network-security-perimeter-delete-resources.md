---
 title: include file
 description: include file
 services: private-link
 author: mbender
 ms.service: azure-private-link
 ms.topic: include
 ms.date: 11/11/2024
 ms.author: mbender-ms
ms.custom: include file, ignite-2024
---

> [!NOTE]
> Removing your resource association from the network security perimeter results in access control falling back to the existing resource firewall configuration. This may result in access being allowed/denied as per the resource firewall configuration. If PublicNetworkAccess is set to SecuredByPerimeter and the association has been deleted, the resource will enter a locked down state. For more information, see [Transition to a network security perimeter in Azure](../articles/private-link/network-security-perimeter-transition.md#transition-to-a-network-security-perimeter-in-azure).
