---

title="App Service Environment Readme" 
description="Lists the documentation that describes the App Service Environment" 
services: app-service
documentationcenter: ''
author: ccompy
manager: stefsch
editor: ''

ms.assetid: 
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/08/2017
ms.author: ccompy

---

# App Service Environment Documentation
The App Service Environment is an Azure App Service feature that provides a fully isolated and dedicated environment for securely running Azure App Service apps at high scale. This capability can host your [Web Apps][WebApps], [Mobile Apps][MobileApps], [API Apps][APIApps], and [Functions][Functions].

App Service Environments are ideal for application workloads that require:

* Very high scale
* Isolation and secure network access

Customers can create multiple App Service Environments within a single Azure region, as well as across multiple Azure regions. This makes App Service Environments ideal for horizontally scaling state-less application tiers in support of high RPS workloads.

App Service Environments are isolated to running only a single customer's applications, and are always deployed into a virtual network. Customers have fine-grained control over both inbound and outbound application network traffic using [network security groups][NetworkSecurityGroups]. Applications can also establish high-speed secure connections over virtual networks to on-premises corporate resources.

Apps frequently need to access corporate resources such as internal databases and web services. Apps running on App Service Environments can access resources reachable via [Site-to-Site][SiteToSite] VPN and [Azure ExpressRoute][ExpressRoute] connections.

* [What is an App Service Environment?][Intro]
* [Creating an App Service Environment][MakeExternalASE]
* [Creating an Internal Load Balancer App Service Environment][MakeILBASE]
* [Using an App Service Environment][UsingASE]
* [Networking Considerations and the App Service Environment][ASENetwork]
* [Creating an App Service Environment from a Template][MakeASEfromTemplate]


## Videos
>[!VIDEO https://channel9.msdn.com/Events/Ignite/2016/BRK3205/player]

>[!VIDEO https://channel9.msdn.com/Events/Microsoft-Azure/AzureCon-2015/ACON325/player]

>[!VIDEO https://channel9.msdn.com/Events/Ignite/2015/BRK3715/player]

## ASEv1 ##
There are two versions to the App Service Environment: ASEv1 and ASEv2. For information on ASEv1, see [App Service Environment v1 Documentation][ASEv1README].


<!-- LINKS -->
[PremiumTier]: http://azure.microsoft.com/pricing/details/app-service/
[WebApps]: http://azure.microsoft.com/documentation/articles/app-service-web-overview/
[MobileApps]: http://azure.microsoft.com/documentation/articles/app-service-mobile-value-prop-preview/
[APIApps]: http://azure.microsoft.com/documentation/articles/app-service-api-apps-why-best-platform/
[NetworkSecurityGroups]: https://azure.microsoft.com/documentation/articles/virtual-networks-nsg/
[SiteToSite]: https://azure.microsoft.com/documentation/articles/vpn-gateway-site-to-site-create/
[ExpressRoute]: http://azure.microsoft.com/services/expressroute/
[Intro]: http://azure.microsoft.com/documentation/articles/app-service-env-intro/
[MakeExternalASE]: http://azure.microsoft.com/documentation/articles/app-service-env-create-external-ase/
[MakeASEfromTemplate]: http://azure.microsoft.com/documentation/articles/app-service-env-create-from-template/
[MakeILBASE]: http://azure.microsoft.com/documentation/articles/app-service-env-create-ilb-ase/
[ASENetwork]: http://azure.microsoft.com/documentation/articles/app-service-env-network-info/
[ASEReadme]: http://azure.microsoft.com/documentation/articles/app-service-env-readme/
[UsingASE]: http://azure.microsoft.com/documentation/articles/app-service-env-using-an-ase/
[UDRs]: http://docs.microsoft.com/azure/virtual-network/virtual-networks-udr-overview/
[ConfigureASEv1]: http://azure.microsoft.com/documentation/articles/app-service-web-configure-an-app-service-environment/
[ASEv1Intro]: http://azure.microsoft.com/documentation/articles/app-service-app-service-environment-intro/
[Functions]: https://docs.microsoft.com/en-us/azure/azure-functions/
[Pricing]: http://azure.microsoft.com/pricing/details/app-service/
[ARMOverview]: http://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview
[ConfigureSSL]: http://docs.microsoft.com/azure/app-service-web/web-sites-purchase-ssl-web-site/
[Kudu]: http://azure.microsoft.com/resources/videos/super-secret-kudu-debug-console-for-azure-web-sites/
[AppDeploy]: http://docs.microsoft.com/azure/app-service-web/web-sites-deploy/
[ASEWAF]: http://docs.microsoft.com/azure/app-service-web/app-service-app-service-environment-web-application-firewall/
[AppGW]: http://docs.microsoft.com/azure/application-gateway/application-gateway-web-application-firewall-overview/
[ASEv1README]: http://docs.microsoft.com/azure/app-service/app-service-app-service-environments-readme/
