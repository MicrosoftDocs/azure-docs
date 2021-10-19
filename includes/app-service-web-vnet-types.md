---
author: madsd
ms.service: app-service-web
ms.topic: include
ms.date: 10/01/2020
ms.author: madsd
---

* The dedicated compute pricing tiers, which includes the Basic, Standard, Premium, PremiumV2, and PremiumV3.
* The App Service Environment which deploys directly into your VNet with dedicated supporting infrastructure and is using the Isolated and IsolatedV2 pricing tiers.

The VNet integration feature is used in App Service dedicated compute pricing tiers. If your app is in [App Service Environment](../articles/app-service/environment/overview.md)], then it's already in a VNet and doesn't require use of the VNet integration feature to reach resources in the same VNet. For more information on all of the networking features, see [App Service networking features](../articles/app-service/networking-features.md).

VNet integration gives your app access to resources in your VNet, but it doesn't grant inbound private access to your app from the VNet. Private site access refers to making an app accessible only from a private network, such as from within an Azure virtual network. VNet integration is used only to make outbound calls from your app into your VNet. The VNet integration feature behaves differently when it's used with VNet in the same region and with VNet in other regions. The VNet integration feature has two variations:

* **Regional VNet integration**: When you connect to virtual networks in the same region, you must have a dedicated subnet in the VNet you're integrating with.
* **Gateway-required VNet integration**: When you connect directly to VNet in other regions or to a classic virtual network in the same region, you need an Azure Virtual Network gateway created in the target VNet.

The VNet integration feature:

* Requires a **Standard**, **Premium**, **PremiumV2**, **PremiumV3**, or **Elastic Premium** App Service pricing tier.
* Supports TCP and UDP.
* Works with Azure App Service apps and function apps.

There are some things that VNet integration doesn't support, like:

* Mounting a drive.
* Windows Server Active Directory integration.
* NetBIOS.

Gateway-required VNet integration provides access to resources only in the target VNet or in networks connected to the target VNet with peering or VPNs. Gateway-required VNet integration doesn't enable access to resources available across Azure ExpressRoute connections or work with service endpoints.

Regardless of the version used, VNet integration gives your app access to resources in your VNet, but it doesn't grant inbound private access to your app from the VNet. Private site access refers to making your app accessible only from a private network, such as from within an Azure virtual network. VNet integration is only for making outbound calls from your app into your VNet.
