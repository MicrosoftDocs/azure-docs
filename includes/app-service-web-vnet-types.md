---
author: ccompy
ms.service: app-service-web
ms.topic: include
ms.date: 02/27/2020
ms.author: ccompy
---
1. The multi-tenant systems that support the full range of pricing plans except Isolated
2. The App Service Environment (ASE), which deploys into your VNet and supports Isolated pricing plan apps

This document goes through the VNet Integration feature, which is for use in the multi-tenant apps. If your app is in [App Service Environment][ASEintro], then it's already in a VNet and doesn't require use of the VNet Integration feature to reach resources in the same VNet. For details on all of the networking features, read [App Service networking features](networking-features.md)

VNet Integration gives your app access to resources in your virtual network but doesn't grant inbound private access to your app from the VNet. Private site access refers to making app only accessible from a private network such as from within an Azure virtual network. VNet Integration is only for making outbound calls from your app into your VNet. The VNet Integration feature behaves differently when used with VNets in the same region and with VNets in other regions. The VNet Integration feature has two variations.

1. Regional VNet Integration - When connecting to Resource Manager VNets in the same region, you must have a dedicated subnet in the VNet you are integrating with. 
2. Gateway required VNet Integration - When connecting to VNets in other regions or to a Classic VNet in the same region you need a Virtual Network gateway provisioned in the target VNet.

The VNet Integration features:

* require a Standard, Premium, PremiumV2, or Elastic Premium pricing plan 
* support TCP and UDP
* work with App Service apps, and Function apps

There are some things that VNet Integration doesn't support including:

* mounting a drive
* AD integration 
* NetBios

Gateway required VNet Integration only provides access to resources in the target VNet or in networks connected to the target VNet with peering or VPNs. Gateway required VNet Integration doesn't enable access to resources available across ExpressRoute connections or works with service endpoints. 

Regardless of the version used, VNet Integration gives your app access to resources in your virtual network but doesn't grant inbound private access to your app from the virtual network. Private site access refers to making your app only accessible from a private network such as from within an Azure virtual network. VNet Integration is only for making outbound calls from your app into your VNet. 