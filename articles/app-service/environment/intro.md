---
title: Introduction to Azure App Service Environments
description: Brief overview of Azure App Service Environments
services: app-service
documentationcenter: na
author: ccompy
manager: stefsch

ms.assetid: 3c7eaefa-1850-4643-8540-428e8982b7cb
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: overview
ms.date: 04/19/2018
ms.author: ccompy
ms.custom: mvc
---
# Introduction to the App Service Environments #
 
## Overview ##

The Azure App Service Environment is an Azure App Service feature that provides a fully isolated and dedicated environment for securely running App Service apps at high scale. This capability can host your:

* Windows web apps
* Linux web apps 
* Docker containers
* Mobile apps
* Functions

App Service environments (ASEs) are appropriate for application workloads that require:

* Very high scale.
* Isolation and secure network access.
* High memory utilization.

Customers can create multiple ASEs within a single Azure region or across multiple Azure regions. This flexibility makes ASEs ideal for horizontally scaling stateless application tiers in support of high RPS workloads.

ASEs are isolated to running only a single customer's applications and are always deployed into a virtual network. Customers have fine-grained control over inbound and outbound application network traffic. Applications can establish high-speed secure connections over VPNs to on-premises corporate resources.

* ASE comes with its own pricing tier, learn how the [Isolated offering](https://channel9.msdn.com/Shows/Azure-Friday/Security-and-Horsepower-with-App-Service-The-New-Isolated-Offering?term=app%20service%20environment) helps drive hyper-scale and security.
* [App Service Environments v2](https://channel9.msdn.com/Blogs/Azure/Azure-Application-Service-Environments-v2-Private-PaaS-Environments-in-the-Cloud?term=app%20service%20environment) provide a surrounding to safeguard your apps in a subnet of your network and provides your own private deployment of Azure App Service.
* Multiple ASEs can be used to scale horizontally. For more information, see [how to set up a geo-distributed app footprint](app-service-app-service-environment-geo-distributed-scale.md).
* ASEs can be used to configure security architecture, as shown in the AzureCon Deep Dive. To see how the security architecture shown in the AzureCon Deep Dive was configured, see the [article on how to implement a layered security architecture](app-service-app-service-environment-layered-security.md) with App Service environments.
* Apps running on ASEs can have their access gated by upstream devices, such as web application firewalls (WAFs). For more information, see [Web application firewall (WAF)][AppGW].

## Dedicated environment ##

An ASE is dedicated exclusively to a single subscription and can host 100 App Service Plan instances. The range can span 100 instances in a single App Service plan to 100 single-instance App Service plans, and everything in between.

An ASE is composed of front ends and workers. Front ends are responsible for HTTP/HTTPS termination and automatic load balancing of app requests within an ASE. Front ends are automatically added as the App Service plans in the ASE are scaled out.

Workers are roles that host customer apps. Workers are available in three fixed sizes:

* One vCPU/3.5 GB RAM
* Two vCPU/7 GB RAM
* Four vCPU/14 GB RAM

Customers do not need to manage front ends and workers. All infrastructure is automatically added as customers scale out their App Service plans. As App Service plans are created or scaled in an ASE, the required infrastructure is added or removed as appropriate.

There is a flat monthly rate for an ASE that pays for the infrastructure and doesn't change with the size of the ASE. In addition, there is a cost per App Service plan vCPU. All apps hosted in an ASE are in the Isolated pricing SKU. For information on pricing for an ASE, see the [App Service pricing][Pricing] page and review the available options for ASEs.

## Virtual network support ##

The ASE feature is a deployment of the Azure App Service directly into a customer's Azure resource manager virtual network. To learn more about Azure virtual networks, see the [Azure virtual networks FAQ](https://azure.microsoft.com/documentation/articles/virtual-networks-faq/). An ASE always exists in a virtual network, and more precisely, within a subnet of a virtual network. You can use the security features of virtual networks to control inbound and outbound network communications for your apps.

An ASE can be either internet-facing with a public IP address or internal-facing with only an Azure internal load balancer (ILB) address.

[Network Security Groups][NSGs] restrict inbound network communications to the subnet where an ASE resides. You can use NSGs to run apps behind upstream devices and services such as WAFs and network SaaS providers.

Apps also frequently need to access corporate resources such as internal databases and web services. If you deploy the ASE in a virtual network that has a VPN connection to the on-premises network, the apps in the ASE can access the on-premises resources. This capability is true regardless of whether the VPN is a [site-to-site](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-multi-site) or [Azure ExpressRoute](http://azure.microsoft.com/services/expressroute/) VPN.

For more information on how ASEs work with virtual networks and on-premises networks, see [App Service Environment network considerations][ASENetwork].

> [!VIDEO https://channel9.msdn.com/Blogs/Azure/Azure-Application-Service-Environments-v2-Private-PaaS-Environments-in-the-Cloud/player]

## App Service Environment v1 ##

App Service Environment has two versions: ASEv1 and ASEv2. The preceding information was based on ASEv2. This section shows you the differences between ASEv1 and ASEv2. 

In ASEv1, you need to manage all of the resources manually. That includes the front ends, workers, and IP addresses used for IP-based SSL. Before you can scale out your App Service plan, you need to first scale out the worker pool where you want to host it.

ASEv1 uses a different pricing model from ASEv2. In ASEv1, you pay for each vCPU allocated. That includes vCPUs used for front ends or workers that aren't hosting any workloads. In ASEv1, the default maximum-scale size of an ASE is 55 total hosts. That includes workers and front ends. One advantage to ASEv1 is that it can be deployed in a classic virtual network and a Resource Manager virtual network. To learn more about ASEv1, see [App Service Environment v1 introduction][ASEv1Intro].

<!--Links-->
[App Service Environments v2]: https://channel9.msdn.com/Blogs/Azure/Azure-Application-Service-Environments-v2-Private-PaaS-Environments-in-the-Cloud?term=app%20service%20environment
[Isolated offering]: https://channel9.msdn.com/Shows/Azure-Friday/Security-and-Horsepower-with-App-Service-The-New-Isolated-Offering?term=app%20service%20environment
[Intro]: ./intro.md
[MakeExternalASE]: ./create-external-ase.md
[MakeASEfromTemplate]: ./create-from-template.md
[MakeILBASE]: ./create-ilb-ase.md
[ASENetwork]: ./network-info.md
[UsingASE]: ./using-an-ase.md
[UDRs]: ../../virtual-network/virtual-networks-udr-overview.md
[NSGs]: ../../virtual-network/security-overview.md
[ConfigureASEv1]: app-service-web-configure-an-app-service-environment.md
[ASEv1Intro]: app-service-app-service-environment-intro.md
[webapps]: ../app-service-web-overview.md
[mobileapps]: ../../app-service-mobile/app-service-mobile-value-prop.md
[Functions]: ../../azure-functions/index.yml
[Pricing]: http://azure.microsoft.com/pricing/details/app-service/
[ARMOverview]: ../../azure-resource-manager/resource-group-overview.md
[ConfigureSSL]: ../web-sites-purchase-ssl-web-site.md
[Kudu]: http://azure.microsoft.com/resources/videos/super-secret-kudu-debug-console-for-azure-web-sites/
[ASEWAF]: app-service-app-service-environment-web-application-firewall.md
[AppGW]: ../../application-gateway/waf-overview.md
