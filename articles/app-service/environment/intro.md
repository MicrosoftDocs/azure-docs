---
title: Introduction to ASEv2
description: Learn how Azure App Service Environments v2 help you scale, secure, and optimize your apps in a fully isolated and dedicated environment.
author: madsd
ms.topic: overview
ms.date: 03/29/2022
ms.author: madsd
---

# Introduction to App Service Environment v2

> [!IMPORTANT]
> This article is about App Service Environment v2 which is used with Isolated App Service plans. [App Service Environment v2 will be retired on 31 August 2024](https://azure.microsoft.com/updates/app-service-environment-v1-and-v2-retirement-announcement/). There's a new version of App Service Environment that is easier to use and runs on more powerful infrastructure. To learn more about the new version, start with the [Introduction to the App Service Environment](overview.md). If you're currently using App Service Environment v2, please follow the steps in [this article](migration-alternatives.md) to migrate to the new version.
>

## Overview

The Azure App Service Environment v2 is an Azure App Service feature that provides a fully isolated and dedicated environment for securely running App Service apps at high scale. This capability can host your:

* Windows web apps
* Linux web apps 
* Docker containers
* Functions

> [!NOTE]
> Linux web apps and docker containers are not supported in Azure Government and Microsoft Azure operated by 21Vianet regions.

App Service environments (ASEs) are appropriate for application workloads that require:

* Very high scale.
* Isolation and secure network access.
* High memory utilization.

Customers can create multiple ASEs within a single Azure region or across multiple Azure regions. This flexibility makes ASEs ideal for horizontally scaling stateless application tiers in support of high requests per second (RPS) workloads.

ASEs host applications from only one customer and do so in one of their VNets. Customers have fine-grained control over inbound and outbound application network traffic. Applications can establish high-speed secure connections over VPNs to on-premises corporate resources.

* Multiple ASEs can be used to scale horizontally. For more information, see [how to set up a geo-distributed app footprint](app-service-app-service-environment-geo-distributed-scale.md).
* ASEs can be used to configure security architecture, as shown in the AzureCon Deep Dive. To see how the security architecture shown in the AzureCon Deep Dive was configured, see the [article on how to implement a layered security architecture](app-service-app-service-environment-layered-security.md) with App Service environments.
* Apps running on ASEs can have their access gated by upstream devices, such as web application firewalls (WAFs). For more information, see [Web application firewall (WAF)][AppGW].
* App Service Environments can be deployed into Availability Zones (AZ) using zone pinning.  See [App Service Environment Support for Availability Zones][ASEAZ] for more details.

## Dedicated environment

An ASE is dedicated environment that is exclusive to a single customer and can host 200 App Service plan total instances. A single Isolated SKU App Service plan can have up to 100 instances in it. When you add up all the instances from all of the App Service plans in that ASE, the total must be less than or equal to 200.

An ASE is composed of front ends and workers. Front ends are responsible for HTTP/HTTPS termination and automatic load balancing of app requests within an ASE. Front ends are automatically added as the App Service plans in the ASE are scaled out.

Workers are roles that host customer apps. Workers are available in three fixed sizes:

* One vCPU/3.5 GB RAM
* Two vCPU/7 GB RAM
* Four vCPU/14 GB RAM

Customers do not need to manage front ends and workers. All infrastructure is automatically added as customers scale out their App Service plans. As App Service plans are created or scaled in an ASE, the required infrastructure is added or removed as appropriate.

There is a flat monthly rate for an ASE that pays for the infrastructure and doesn't change with the size of the ASE. In addition, there is a cost per App Service plan vCPU. All apps hosted in an ASE are in the Isolated pricing SKU. For information on pricing for an ASE, see the [App Service pricing][Pricing] page and review the available options for ASEs.

## Virtual network support

The ASE feature is a deployment of the Azure App Service directly into a customer's Azure Resource Manager virtual network. To learn more about Azure virtual networks, see the [Azure virtual networks FAQ](../../virtual-network/virtual-networks-faq.md). An ASE always exists in a virtual network, and more precisely, within a subnet of a virtual network. You can use the security features of virtual networks to control inbound and outbound network communications for your apps.

An ASE can be either internet-facing with a public IP address or internal-facing with only an Azure internal load balancer (ILB) address.

[Network Security Groups][NSGs] restrict inbound network communications to the subnet where an ASE resides. You can use NSGs to run apps behind upstream devices and services such as WAFs and network SaaS providers.

Apps also frequently need to access corporate resources such as internal databases and web services. If you deploy the ASE in a virtual network that has a VPN connection to the on-premises network, the apps in the ASE can access the on-premises resources. This capability is true regardless of whether the VPN is a [site-to-site](../../vpn-gateway/vpn-gateway-multi-site.md) or [Azure ExpressRoute](https://azure.microsoft.com/services/expressroute/) VPN.

For more information on how ASEs work with virtual networks and on-premises networks, see [App Service Environment network considerations][ASENetwork].

## App Service Environment v1

App Service Environment has three versions: ASEv1, ASEv2, and ASEv3. The preceding information was based on ASEv2. This section shows you the differences between ASEv1 and ASEv2. To learn more about, see [App Service Environment v3 introduction](./overview.md)

In ASEv1, you need to manage all of the resources manually. That includes the front ends, workers, and IP addresses used for IP-based TLS/SSL bindings. Before you can scale out your App Service plan, you need to first scale out the worker pool where you want to host it.

ASEv1 uses a different pricing model from ASEv2. In ASEv1, you pay for each vCPU allocated. That includes vCPUs used for front ends or workers that aren't hosting any workloads. In ASEv1, the default maximum-scale size of an ASE is 55 total hosts. That includes workers and front ends. One advantage to ASEv1 is that it can be deployed in a classic virtual network and a Resource Manager virtual network. To learn more about ASEv1, see [App Service Environment v1 introduction][ASEv1Intro].

<!--Links-->
[Intro]: ./intro.md
[MakeExternalASE]: ./create-external-ase.md
[MakeASEfromTemplate]: ./create-from-template.md
[MakeILBASE]: ./create-ilb-ase.md
[ASENetwork]: ./network-info.md
[UsingASE]: ./using-an-ase.md
[UDRs]: ../../virtual-network/virtual-networks-udr-overview.md
[NSGs]: ../../virtual-network/network-security-groups-overview.md
[ConfigureASEv1]: app-service-web-configure-an-app-service-environment.md
[ASEv1Intro]: app-service-app-service-environment-intro.md
[webapps]: ../overview.md
[mobileapps]: /previous-versions/azure/app-service-mobile/app-service-mobile-value-prop
[Functions]: ../../azure-functions/index.yml
[Pricing]: https://azure.microsoft.com/pricing/details/app-service/
[ARMOverview]: ../../azure-resource-manager/management/overview.md
[ConfigureSSL]: ../configure-ssl-certificate.md
[Kudu]: https://azure.microsoft.com/resources/videos/super-secret-kudu-debug-console-for-azure-web-sites/
[ASEWAF]: ./integrate-with-application-gateway.md
[AppGW]: ../../web-application-firewall/ag/ag-overview.md
[ASEAZ]: https://azure.github.io/AppService/2019/12/12/App-Service-Environment-Support-for-Availability-Zones.html