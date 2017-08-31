---
title: Azure App Service Environment readme
description: Lists the documentation that describes Azure App Service Environment
services: app-service
documentationcenter: na
author: ccompy
manager: stefsch

ms.assetid: 77452413-5193-4762-8b3d-5fa8e4edf1ca
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/13/2017
ms.author: ccompy
---

# App Service environment documentation
 Azure App Service Environment is an Azure App Service feature that provides a fully isolated and dedicated environment for securely running App Service apps at high scale. This capability can host your [web apps][webapps], [mobile apps][mobileapps], [API apps][APIApps], and [functions][Functions].

App Service environments (ASEs) are ideal for application workloads that require:

* Very high scale.
* Isolation and secure network access.

Customers can create multiple ASEs within a single Azure region and across multiple Azure regions. This versatility makes ASEs ideal for horizontally scaling stateless application tiers in support of high RPS workloads.

ASEs are isolated to running only a single customer's applications and are always deployed into an Azure virtual network. Customers have fine-grained control over inbound and outbound application network traffic by using [Network Security Groups][NSGs]. Applications can also establish high-speed secure connections over virtual networks to on-premises corporate resources.

Apps frequently need to access corporate resources, such as internal databases and web services. Apps that run on ASEs can access resources via [site-to-site][SiteToSite] VPN and [Azure ExpressRoute][ExpressRoute] connections.

* [What is an App Service environment?][Intro]
* [Create an App Service environment][MakeExternalASE]
* [Create an internal load balancer App Service environment][MakeILBASE]
* [Use an App Service environment][UsingASE]
* [Networking considerations and the App Service environment][ASENetwork]
* [Create an App Service environment from a template][MakeASEfromTemplate]


## Videos
Master Modern PaaS for the Enterprise with Azure App Service
>[!VIDEO https://channel9.msdn.com/Events/Ignite/2016/BRK3205/player]

Deploying Highly Scalable and Secure Apps
>[!VIDEO https://channel9.msdn.com/Events/Microsoft-Azure/AzureCon-2015/ACON325/player]

Running Enterprise Web and Mobile Apps on Azure App Service
>[!VIDEO https://channel9.msdn.com/Events/Ignite/2015/BRK3715/player]

## App Service Environment v1 ##
There are two versions of App Service Environment: ASEv1 and ASEv2. For information on ASEv1, see [App Service Environment v1 documentation][ASEv1README].


<!--Links-->
[Intro]: ./intro.md
[MakeExternalASE]: ./create-external-ase.md
[MakeASEfromTemplate]: ./create-from-template.md
[MakeILBASE]: ./create-ilb-ase.md
[ASENetwork]: ./network-info.md
[ASEReadme]: ./readme.md
[UsingASE]: ./using-an-ase.md
[UDRs]: ../../virtual-network/virtual-networks-udr-overview.md
[NSGs]: ../../virtual-network/virtual-networks-nsg.md
[ConfigureASEv1]: ../../app-service-web/app-service-web-configure-an-app-service-environment.md
[ASEv1Intro]: ../../app-service-web/app-service-app-service-environment-intro.md
[webapps]: ../../app-service-web/app-service-web-overview.md
[mobileapps]: ../../app-service-mobile/app-service-mobile-value-prop.md
[APIapps]: ../../app-service-api/app-service-api-apps-why-best-platform.md
[Functions]: ../../azure-functions/index.yml
[Pricing]: http://azure.microsoft.com/pricing/details/app-service/
[ARMOverview]: ../../azure-resource-manager/resource-group-overview.md
[ConfigureSSL]: ../../app-service-web/web-sites-purchase-ssl-web-site.md
[Kudu]: http://azure.microsoft.com/resources/videos/super-secret-kudu-debug-console-for-azure-web-sites/
[AppDeploy]: ../../app-service-web/web-sites-deploy.md
[ASEWAF]: ../../app-service-web/app-service-app-service-environment-web-application-firewall.md
[AppGW]: ../../application-gateway/application-gateway-web-application-firewall-overview.md
[PremiumTier]: http://azure.microsoft.com/pricing/details/app-service/
[ASEv1README]: ../app-service-app-service-environments-readme.md
[SiteToSite]: ../../vpn-gateway/vpn-gateway-site-to-site-create.md
[ExpressRoute]: http://azure.microsoft.com/services/expressroute/
