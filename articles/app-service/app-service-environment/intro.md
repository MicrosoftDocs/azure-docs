---
title: Introduction to the Azure App Service Environment
description: Brief overview on the Azure App Service Environment
services: app-service
documentationcenter: na
author: ccompy
manager: stefsch

ms.assetid: 3c7eaefa-1850-4643-8540-428e8982b7cb
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/13/2017
ms.author: ccompy
---
# Introduction to the App Service Environment #
 
## Overview ##

An App Service Environment is an Azure App Service feature that provides a fully isolated and dedicated environment for securely running Azure App Service apps at high scale. This capability can host your [Web Apps][webapps], [Mobile Apps][mobileapps], [API Apps][APIapps], and [Functions][Functions].

App Service Environments are ideal for application workloads that require:

- Very high scale
- Isolation and secure network access
- High memory utilization

Customers can create multiple App Service Environments within a single Azure region, or across multiple Azure regions. This makes App Service Environments ideal for horizontally scaling state-less application tiers in support of high RPS workloads.

App Service Environments are isolated to running only a single customer's applications, and are always deployed into a virtual network. Customers have fine-grained control over both inbound and outbound application network traffic, and applications can establish high-speed secure connections over VPNs to on-premises corporate resources.

All articles and How-tos about App Service Environments are available in the [README for Application Service Environments][ASEReadme].

For an overview of how App Service Environments enable high scale and secure network access, see the [AzureCon Deep Dive](https://azure.microsoft.com/documentation/videos/azurecon-2015-deploying-highly-scalable-and-secure-web-and-mobile-apps/) on App Service Environments.

For a deep-dive on horizontally scaling using multiple App Service Environments see the article on how to setup a [geo-distributed app footprint](https://azure.microsoft.com/documentation/articles/app-service-app-service-environment-geo-distributed-scale/).

To see how the security architecture shown in the AzureCon Deep Dive was configured, see the article on implementing a [layered security architecture](https://docs.microsoft.com/en-us/azure/app-service-web/app-service-app-service-environment-layered-security) with App Service Environments.

Apps running on App Service Environments can have their access gated by upstream devices such as web application firewalls (WAF). The article on [configuring a WAF for App Service Environments](https://docs.microsoft.com/en-us/azure/app-service-web/app-service-app-service-environment-web-application-firewall) covers this scenario.

## Dedicated Environment ##

An App Service Environment is dedicated exclusively to a single subscription and can host 100 instances. That can be from 100 instances in a single App Service plan to 100 single-instance App Service plans and everything in between.

An App Service Environment is composed of front-ends and workers. The front-ends are responsible for HTTP/HTTPS termination as well automatic load balancing of app requests within an App Service Environment. Front-ends are automatically added as the App Service plans in the App Service Environment are scaled out.

The workers are roles that host customer apps. The workers are available in 3 fixed sizes:
* 1 core/3.5 GB Ram
* 2 core/7GB Ram
* 4 core/14GB Ram.

Customers do not need to manage the front-ends and workers. All infrastructure is automatically added as customers scale out their App Service plans. As App Service plans are created or scaled in an App Service Environment, the required infrastructure is added or removed as appropriate.

There is a flat monthly rate for an App Service Environment that pays for the infrastructure and does not change with the size of the App Service Environment. On top of that there is a cost per App Service plan core. All apps hosted in an App Service Environment are in the Isolated pricing SKU. For details on pricing for an App Service Environment, consult the [App Service Pricing][Pricing] page and review the available options for App Service Environments.

## Virtual Network Support ##

An App Service Environment can be created only in an Azure Resource Manager virtual network. You can learn more about Azure Virtual Networks here: [Azure virtual networks FAQ](https://azure.microsoft.com/documentation/articles/virtual-networks-faq/). Since an App Service Environment always exists in a virtual network, and more precisely within a subnet of a virtual network, you can leverage the security features of virtual networks to control both inbound and outbound network communications for your apps.

An App Service Environment can be either internet facing with a public IP address, or internal facing with only an Azure Internal Load Balancer (ILB) address.

You can use [network security groups][NSGs] to restrict inbound network communications to the subnet where an App Service Environment resides. This allows you to run apps behind upstream devices and services such as web application firewalls, and network SaaS providers.

Apps also frequently need to access corporate resources such as internal databases and web services. If the App Service Environment is deployed in an Azure Virtual Network that has a VPN connection to the on premises network, then the apps in the App Service Environment will be able to access the on premises resources. This is true regardless if the VPN is a [Site-to-Site](https://azure.microsoft.com/documentation/articles/vpn-gateway-site-to-site-create/) or [Azure ExpressRoute](http://azure.microsoft.com/services/expressroute/) VPN.

For more information on how App Service Environments work with virtual networks and on-premises networks, see [App Service Environment network considerations][ASENetwork].

## ASEv1 ##

The App Service Environment has two versions: ASEv1 and ASEv2. The preceding information was centered around ASEv2. This section shows you the differences between ASEv1 and ASEv2. 

In ASEv1, you need to manage all of the resources manually. That includes the front-ends, workers, and, IP addresses used for IP-based SSL. Before you can scale out your App Service plan, you need to first scale out the worker pool you want to host it in.

ASEv1 uses a different pricing model from ASEv2. In ASEv1, you need to pay for each core allocated. That includes cores used for front-ends or workers that are not hosting any workloads. In ASEv1, default maximum scale size of an App Service Environment is 55 total hosts. That includes workers and front-ends. The one advantage to ASEv1 is that it can be deployed in a classic virtual network as well as a resource manager virtual network. You can learn more about ASEv1 from here: [App Service Environment v1 introduction][ASEv1Intro]

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
