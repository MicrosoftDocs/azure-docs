---
author: madsd
ms.service: app-service
ms.topic: include
ms.date: 04/08/2022
ms.author: madsd
ms.subservice: web-apps
---

* The dedicated compute pricing tiers, which include the Basic, Standard, Premium, Premium v2, and Premium v3.
* The App Service Environment, which deploys directly into your virtual network with dedicated supporting infrastructure and is using the Isolated and Isolated v2 pricing tiers.

The virtual network integration feature is used in Azure App Service dedicated compute pricing tiers. If your app is in an [App Service Environment](../articles/app-service/environment/overview.md), it's already in a virtual network and doesn't require use of the VNet integration feature to reach resources in the same virtual network. For more information on all the networking features, see [App Service networking features](../articles/app-service/networking-features.md).

Virtual network integration gives your app access to resources in your virtual network, but it doesn't grant inbound private access to your app from the virtual network. Private site access refers to making an app accessible only from a private network, such as from within an Azure virtual network. Virtual network integration is used only to make outbound calls from your app into your virtual network. The virtual network integration feature behaves differently when it's used with virtual networks in the same region and with virtual networks in other regions. The virtual network integration feature has two variations:

* **Regional virtual network integration**: When you connect to virtual networks in the same region, you must have a dedicated subnet in the virtual network you're integrating with.
* **Gateway-required virtual network integration**: When you connect directly to virtual networks in other regions or to a classic virtual network in the same region, you need an Azure Virtual Network gateway created in the target virtual network.

The virtual network integration feature:

* Requires a [supported Basic or Standard](../articles/app-service/overview-vnet-integration.md#limitations), Premium, Premium v2, Premium v3, or Elastic Premium App Service pricing tier.
* Supports TCP and UDP.
* Works with App Service apps and function apps.

There are some things that virtual network integration doesn't support, like:

* Mounting a drive.
* Windows Server Active Directory domain join.
* NetBIOS.

Gateway-required virtual network integration provides access to resources only in the target virtual network or in networks connected to the target virtual network with peering or VPNs. Gateway-required virtual network integration doesn't enable access to resources available across Azure ExpressRoute connections or work with service endpoints.

No matter which version is used, virtual network integration gives your app access to resources in your virtual network, but it doesn't grant inbound private access to your app from the virtual network. Private site access refers to making your app accessible only from a private network, such as from within an Azure virtual network. Virtual network integration is only for making outbound calls from your app into your virtual network.
