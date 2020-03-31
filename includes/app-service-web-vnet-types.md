---
author: ccompy
ms.service: app-service-web
ms.topic: include
ms.date: 02/27/2020
ms.author: ccompy
---

* The multitenant systems that support the full range of pricing plans except Isolated.
* The App Service Environment, which deploys into your virtual network and supports Isolated pricing plan apps.

The VNet Integration feature is used in multitenant apps. If your app is in [App Service Environment][ASEintro], then it's already in a virtual network and doesn't require use of the VNet Integration feature to reach resources in the same virtual network. For more information on all of the networking features, see [App Service networking features][Networkingfeatures].

VNet Integration gives your app access to resources in your virtual network, but it doesn't grant inbound private access to your app from the virtual network. Private site access refers to making an app accessible only from a private network, such as from within an Azure virtual network. VNet Integration is used only to make outbound calls from your app into your virtual network. The VNet Integration feature behaves differently when it's used with virtual networks in the same region and with virtual networks in other regions. The VNet Integration feature has two variations:

* **Regional VNet Integration**: When you connect to Azure Resource Manager virtual networks in the same region, you must have a dedicated subnet in the virtual network you're integrating with.
* **Gateway-required VNet Integration**: When you connect to virtual networks in other regions or to a classic virtual network in the same region, you need an Azure Virtual Network gateway provisioned in the target virtual network.

The VNet Integration features:

* Require a Standard, Premium, PremiumV2, or Elastic Premium pricing plan.
* Support TCP and UDP.
* Work with Azure App Service apps and function apps.

There are some things that VNet Integration doesn't support, like:

* Mounting a drive.
* Active Directory integration.
* NetBIOS.

Gateway-required VNet Integration provides access to resources only in the target virtual network or in networks connected to the target virtual network with peering or VPNs. Gateway-required VNet Integration doesn't enable access to resources available across Azure ExpressRoute connections or works with service endpoints.

Regardless of the version used, VNet Integration gives your app access to resources in your virtual network, but it doesn't grant inbound private access to your app from the virtual network. Private site access refers to making your app accessible only from a private network, such as from within an Azure virtual network. VNet Integration is only for making outbound calls from your app into your virtual network.

<!--Links-->
[ASEintro]: https://docs.microsoft.com/azure/app-service/environment/intro
[Networkingfeatures]: https://docs.microsoft.com/azure/app-service/networking-features
