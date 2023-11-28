---
title: Introduction to ASE v1
description: Learn about the App Service Environment v1 features. This doc is provided only for customers who use the legacy v1 ASE. 
author: madsd

ms.assetid: 78e6d4f5-da46-4eb5-a632-b5fdc17d2394
ms.topic: article
ms.date: 03/29/2022
ms.author: madsd
ms.custom: seodec18

---
# Introduction to App Service Environment v1

> [!IMPORTANT]
> This article is about App Service Environment v1. [App Service Environment v1 will be retired on 31 August 2024](https://azure.microsoft.com/updates/app-service-environment-version-1-and-version-2-will-be-retired-on-31-august-2024-2/). There's a new version of App Service Environment that is easier to use and runs on more powerful infrastructure. To learn more about the new version, start with the [Introduction to the App Service Environment](overview.md). If you're currently using App Service Environment v1, please follow the steps in [this article](upgrade-to-asev3.md) to migrate to the new version.

As of 15 January 2024, you can no longer create new App Service Environment v1 resources using any of the available methods including ARM/Bicep templates, Azure Portal, Azure CLI, or REST API. Existing App Service Environment v1 resources will continue to be supported until 31 August 2024. You must [migrate to App Service Environment v3](upgrade-to-asev3.md) before 31 August 2024 to prevent resource deletion and data loss.
>

## Overview

An App Service Environment is a [Premium][PremiumTier] service plan option of [Azure App Service](../overview.md) that provides a fully isolated and dedicated environment for securely running Azure App Service apps at high scale.  

App Service Environments are ideal for application workloads requiring:

* Very high scale
* Isolation and secure network access

Customers can create multiple App Service Environments within a single Azure region, as well as across multiple Azure regions.  This makes App Service Environments ideal for horizontally scaling state-less application tiers in support of high RPS workloads.

App Service Environments are isolated to running only a single customer's applications, and are always deployed into a virtual network.  Customers have fine-grained control over both inbound and outbound application network traffic, and applications can establish high-speed secure connections over virtual networks to on-premises corporate resources.

For an overview of how App Service Environments enable high scale and secure network access, see the [AzureCon Deep Dive][AzureConDeepDive] on App Service Environments!

For a deep-dive on horizontally scaling using multiple App Service Environments see the article on how to setup a [geo-distributed app footprint][GeodistributedAppFootprint].

To see how the security architecture shown in the AzureCon Deep Dive was configured, see the article on implementing a [layered security architecture](app-service-app-service-environment-layered-security.md) with App Service Environments.

Apps running on App Service Environments can have their access gated by upstream devices such as web application firewalls (WAF).  The article on [configuring a WAF for App Service Environments](integrate-with-application-gateway.md) covers this scenario.

[!INCLUDE [app-service-web-to-api-and-mobile](../../../includes/app-service-web-to-api-and-mobile.md)]

## Dedicated Compute Resources

All of the compute resources in an App Service Environment are dedicated exclusively to a single subscription, and an App Service Environment can be configured with up to fifty (50) compute resources for exclusive use by a single application.

An App Service Environment is composed of a front-end compute resource pool, as well as one to three worker compute resource pools.

The front-end pool contains compute resources responsible for TLS termination as well automatic load balancing of app requests within an App Service Environment.

Each worker pool contains compute resources allocated to [App Service Plans][AppServicePlan], which in turn contain one or more Azure App Service apps.  Since there can be up to three different worker pools in an App Service Environment, you have the flexibility to choose different compute resources for each worker pool.  

For example, this allows you to create one worker pool with less powerful compute resources for App Service Plans intended for development or test apps.  A second (or even third) worker pool could use more powerful compute resources intended for App Service Plans running production apps.

For more details on the quantity of compute resources available to the front-end and worker pools, see [How To Configure an App Service Environment][HowToConfigureanAppServiceEnvironment].  

For details on the available compute resource sizes supported in an App Service Environment, consult the [App Service Pricing][AppServicePricing] page and review the available options for App Service Environments in the Premium pricing tier.

## Virtual Network Support

An App Service Environment can be created in **either** an Azure Resource Manager virtual network, **or** a classic deployment model virtual network ([more info on virtual networks][MoreInfoOnVirtualNetworks]).  Since an App Service Environment always exists in a virtual network, and more precisely within a subnet of a virtual network, you can leverage the security features of virtual networks to control both inbound and outbound network communications.  

An App Service Environment can be either Internet facing with a public IP address, or internal facing with only an Azure Internal Load Balancer (ILB) address.

You can use [network security groups][NetworkSecurityGroups] to restrict inbound network communications to the subnet where an App Service Environment resides.  This allows you to run apps behind upstream devices and services such as web application firewalls, and network SaaS providers.

Apps also frequently need to access corporate resources such as internal databases and web services.  A common approach is to make these endpoints available only to internal network traffic flowing within an Azure virtual network.  Once an App Service Environment is joined to the same virtual network as the internal services, apps running in the environment can access them, including endpoints reachable via [Site-to-Site][SiteToSite] and [Azure ExpressRoute][ExpressRoute] connections.

For more details on how App Service Environments work with virtual networks and on-premises networks consult the following articles on [Network Architecture][NetworkArchitectureOverview], [Controlling Inbound Traffic][ControllingInboundTraffic], and [Securely Connecting to Backends][SecurelyConnectingToBackends]. 

## Getting started

To get started with App Service Environments, see [How to Create an ASEv1 from template](app-service-app-service-environment-create-ilb-ase-resourcemanager.md)

For an overview of the App Service Environment network architecture, see the [Network Architecture Overview][NetworkArchitectureOverview] article.

For details on using an App Service Environment with ExpressRoute, see the following article on [Express Route and App Service Environments][NetworkConfigDetailsForExpressRoute].

[!INCLUDE [app-service-web-try-app-service](../../../includes/app-service-web-try-app-service.md)]

<!-- LINKS -->
[PremiumTier]: https://azure.microsoft.com/pricing/details/app-service/
[MoreInfoOnVirtualNetworks]: ../../virtual-network/virtual-networks-faq.md
[AppServicePlan]: ../overview-hosting-plans.md
[LogicApps]: ../../logic-apps/logic-apps-overview.md
[AzureConDeepDive]:  https://azure.microsoft.com/documentation/videos/azurecon-2015-deploying-highly-scalable-and-secure-web-and-mobile-apps/
[GeodistributedAppFootprint]:  app-service-app-service-environment-geo-distributed-scale.md
[NetworkSecurityGroups]: ../../virtual-network/virtual-network-vnet-plan-design-arm.md
[SiteToSite]: ../../vpn-gateway/vpn-gateway-multi-site.md
[ExpressRoute]: https://azure.microsoft.com/services/expressroute/
[HowToConfigureanAppServiceEnvironment]:  app-service-web-configure-an-app-service-environment.md
[ControllingInboundTraffic]:  app-service-app-service-environment-control-inbound-traffic.md
[SecurelyConnectingToBackends]:  app-service-app-service-environment-securely-connecting-to-backend-resources.md
[NetworkArchitectureOverview]:  app-service-app-service-environment-network-architecture-overview.md
[NetworkConfigDetailsForExpressRoute]:  app-service-app-service-environment-network-configuration-expressroute.md
[AppServicePricing]: https://azure.microsoft.com/pricing/details/app-service/ 

<!-- IMAGES -->