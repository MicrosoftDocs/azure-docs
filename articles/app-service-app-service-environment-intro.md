<properties 
	pageTitle="Introduction to App Service Environment" 
	description="Learn about the App Service Environment feature that provides secure, VNet-joined, dedicated scale units for running all of your apps." 
	services="app-service\web" 
	documentationCenter="" 
	authors="ccompy" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/14/2015" 
	ms.author="stefsh"/>	

# Introduction to App Service Environment

## Overview ##
An App Service Environment is a [Premium][PremiumTier] service plan option of Azure App Service that provides a fully isolated and dedicated environment for securely running all of your apps.  This includes [Web Apps][WebApps], [Mobile Apps][MobileApps], [Api Apps][APIApps] and [Logic Apps][LogicApps] with expanded scaling options.  

Compute resources for an App Service Environment are exclusively dedicated to running only your apps.  An App Service Environment is always created in a regional virtual network, which gives your apps new options for network isolation.  Furthermore an App Service Environment supports additional scaling options, with up to fifty (50) compute resources available to run your apps.  Outside of an App Service Environment there is a limit of 20 compute resources to host your apps. 

## Virtual Network Support ##
An App Service Environment can either be created in a pre-existing regional virtual network, or a new regional virtual network ([more info on virtual networks][MoreInfoOnVirtualNetworks]).  Since an App Service Environment always exists in a regional virtual network, and more precisely within a subnet of a regional virtual network, you can leverage the security features of virtual networks to control both inbound and outbound network communications.  

You can use [network security groups][NetworkSecurityGroups] to restrict inbound network communications to the subnet where an App Service Environment resides.  This allows you to run apps behind upstream devices and services such as web application firewalls, and network SaaS providers.  

Apps also frequently need to access corporate resources such as internal databases and web services.  A common approach is to make these endpoints available only to internal network traffic flowing within an Azure virtual network.  Once an App Service Environment is joined to the same virtual network as the internal services, apps running in the environment can access them, including endpoints reachable via [Site-to-Site][SiteToSite] and [Azure ExpressRoute][ExpressRoute] connections.

## Dedicated Compute Resources ##
All of the compute resources in an App Service Environment are dedicated exclusively to a single subscription.  An App Service Environment is composed of a single front-end compute resource pool, as well as one to three worker compute resource pools. 

The front-end pool contains compute resources responsible for SSL termination as well automatic load balancing of app requests within an App Service Environment. 

Each worker pool contains compute resources allocated to [App Service Plans][AppServicePlan], which in turn contain one or more Azure App Service apps.  Since there can be up to three different worker pools in an App Service Environment, you have the flexibility to choose different compute resources for each worker pool.  

For example this allows you to create one worker pool with less powerful compute resources for App Service Plans intended for development or test apps.  A second (or even third) worker pool could use more powerful compute resources intended for App Service Plans running production apps.

An App Service Environment can be configured with up to fifty (50) compute resources in a single worker pool.  For more details on the quantity of compute resources available to the front-end and worker pools, see [How To Configure an App Service Environment][HowToConfigureanAppServiceEnvironment].  

For details on the available compute resource sizes supported in an App Service Environment, consult the [App Service Pricing][AppServicePricing] page and review the available options for App Service Environments in the Premium pricing tier.


## Getting started

To get started with App Service Environments, see [How To Create An App Service Environment][HowToCreateAnAppServiceEnvironment]

For more information about the Azure App Service platform, see [Azure App Service][AzureAppService].

[AZURE.INCLUDE [app-service-web-whats-changed](../includes/app-service-web-whats-changed.md)]

[AZURE.INCLUDE [app-service-web-try-app-service](../includes/app-service-web-try-app-service.md)]

<!-- LINKS -->
[PremiumTier]: http://azure.microsoft.com/pricing/details/app-service/
[MoreInfoOnVirtualNetworks]: https://msdn.microsoft.com/library/azure/dn133803.aspx
[AppServicePlan]: http://azure.microsoft.com/documentation/articles/azure-web-sites-web-hosting-plans-in-depth-overview/
[Azure preview portal]: http://portal.azure.com
[HowToCreateAnAppServiceEnvironment]: http://azure.microsoft.com/documentation/articles/app-service-web-how-to-create-an-app-service-environment/
[AzureAppService]: http://azure.microsoft.com/documentation/articles/app-service-value-prop-what-is/
[WebApps]: http://azure.microsoft.com/documentation/articles/app-service-web-overview/
[MobileApps]: http://azure.microsoft.com/documentation/articles/app-service-mobile-value-prop-preview/
[APIApps]: http://azure.microsoft.com/documentation/articles/app-service-api-apps-why-best-platform/
[LogicApps]: http://azure.microsoft.com/documentation/articles/app-service-logic-what-are-logic-apps/
[NetworkSecurityGroups]: https://msdn.microsoft.com/library/azure/dn848316.aspx
[SiteToSite]: https://msdn.microsoft.com/library/azure/dn133795.aspx
[ExpressRoute]: http://azure.microsoft.com/services/expressroute/
[HowToConfigureanAppServiceEnvironment]:  http://azure.microsoft.com/documentation/articles/app-service-web-configure-an-app-service-environment/
[AppServicePricing]: http://azure.microsoft.com/pricing/details/app-service/ 

<!-- IMAGES -->

