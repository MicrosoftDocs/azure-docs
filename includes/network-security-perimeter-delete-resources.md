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

> [!NOTE]
> Removing your resource association from the network security perimeter results in access control falling back to the existing resource firewall configuration. This may result in access being allowed/denied as per the resource firewall configuration. For more information, see [Transition to a network security perimeter in Azure](../../azure-docs-pr/articles/private-link/network-security-perimeter-transition.md#impact-on-public-private-trusted-and-perimeter-access) for implications of `publicNetworkAccess` set to `SecuredByPerimeter` when the resource is not associated with a network security perimeter.
> Also, there are implications when removing a network security perimeter association from the resource. If the resource has `PublicNetworkAccess` set to `SecuredByPerimeter` and the association has been deleted, the resource will enter a locked down state.