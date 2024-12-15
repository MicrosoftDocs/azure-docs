---
title: Network architecture v1
description: Architectural overview of network topology of App Service Environments (ASE). This doc is provided only for customers who use the legacy v1 ASE.
author: madsd

ms.assetid: 13d03a37-1fe2-4e3e-9d57-46dfb330ba52
ms.topic: article
ms.date: 03/29/2022
ms.author: madsd
---
# Network Architecture Overview of App Service Environments

> [!IMPORTANT]
> This article is about App Service Environment v1. [App Service Environment v1 and v2 are retired as of 31 August 2024](https://aka.ms/postEOL/ASE). There's a new version of App Service Environment that is easier to use and runs on more powerful infrastructure. To learn more about the new version, start with the [Introduction to the App Service Environment](overview.md). If you're currently using App Service Environment v1, please follow the steps in [this article](upgrade-to-asev3.md) to migrate to the new version.
>
> As of 31 August 2024, [Service Level Agreement (SLA) and Service Credits](https://aka.ms/postEOL/ASE/SLA) no longer apply for App Service Environment v1 and v2 workloads that continue to be in production since they are retired products. Decommissioning of the App Service Environment v1 and v2 hardware has begun, and this may affect the availability and performance of your apps and data.
>
> You must complete migration to App Service Environment v3 immediately or your apps and resources may be deleted. We will attempt to auto-migrate any remaining App Service Environment v1 and v2 on a best-effort basis using the [in-place migration feature](migrate.md), but Microsoft makes no claim or guarantees about application availability after auto-migration. You may need to perform manual configuration to complete the migration and to optimize your App Service plan SKU choice to meet your needs. If auto-migration isn't feasible, your resources and associated app data will be deleted. We strongly urge you to act now to avoid either of these extreme scenarios.
>
> If you need additional time, we can offer a one-time 30-day grace period for you to complete your migration. For more information and to request this grace period, review the [grace period overview](./auto-migration.md#grace-period), and then go to [Azure portal](https://portal.azure.com) and visit the Migration blade for each of your App Service Environments.
>
> For the most up-to-date information on the App Service Environment v1/v2 retirement, see the [App Service Environment v1 and v2 retirement update](https://github.com/Azure/app-service-announcements/issues/469).
>

App Service Environments are always created within a subnet of a [virtual network][virtualnetwork] - apps running in an App Service Environment can communicate with private endpoints located within the same virtual network topology.  Since customers might lock down parts of their virtual network infrastructure, it's important to understand the types of network communication flows that occur with an App Service Environment.

## General Network Flow

When an App Service Environment (ASE) uses a public virtual IP address (VIP) for apps, all inbound traffic arrives on that public VIP.  This traffic includes HTTP and HTTPS traffic for apps, and other traffic for FTP, remote debugging functionality, and Azure management operations.  For a full list of the specific ports (both required and optional) that are available on the public VIP see the article on [controlling inbound traffic][controllinginboundtraffic] to an App Service Environment.

App Service Environments also support running apps that are bound only to a virtual network internal address, also referred to as an ILB (internal load balancer) address.  On an ILB enabled ASE, HTTP, and HTTPS traffic for apps and remote debugging calls, arrive on the ILB address.  For most common ILB-ASE configurations, FTP/FTPS traffic also arrives on the ILB address.  However Azure management operations flow to ports 454/455 on the public VIP of an ILB enabled ASE.

The following diagram shows an overview of the various inbound and outbound network flows for an App Service Environment where the apps are bound to a public virtual IP address:

![General Network Flows][GeneralNetworkFlows]

An App Service Environment can communicate with private customer endpoints.  For example, apps running in the App Service Environment can connect to database servers running on IaaS virtual machines in the same virtual network topology.

> [!IMPORTANT]
> Looking at the network diagram, the "Other Compute Resources" are deployed in a different Subnet from the App Service Environment. Deploying resources in the same Subnet with the ASE will block connectivity from ASE to those resources (except for specific intra-ASE routing). Deploy to a different Subnet instead (in the same VNET). The App Service Environment will then be able to connect. No additional configuration is necessary.
>
>

App Service Environments also communicate with Sql DB and Azure Storage resources necessary for managing and operating an App Service Environment.  Some of the Sql and Storage resources that an App Service Environment communicates with are located in the same region as the App Service Environment, while others are located in remote Azure regions.  As a result, outbound connectivity to the Internet is always required for an App Service Environment to function properly.

Since an App Service Environment is deployed in a subnet, network security groups can be used to control inbound traffic to the subnet.  For details on how to control inbound traffic to an App Service Environment, see the following [article][controllinginboundtraffic].

For details on how to allow outbound Internet connectivity from an App Service Environment, see the following article about working with [Express Route][ExpressRoute].  The same approach described in the article applies when working with Site-to-Site connectivity and using forced tunneling.

## Outbound Network Addresses

When an App Service Environment makes outbound calls, an IP Address is always associated with the outbound calls.  The specific IP address depends on whether the endpoint being called is located within the virtual network topology, or outside of the virtual network topology.

If the endpoint being called is **outside** of the virtual network topology, then the outbound address (also known as the outbound NAT address) is the public VIP of the App Service Environment.  This address can be found in the portal user interface for the App Service Environment in Properties section.

![Outbound IP Address][OutboundIPAddress]

This address can also be determined for ASEs that only have a public VIP by creating an app in the App Service Environment, and then performing a *nslookup* on the app's address. The resultant IP address is both the public VIP, and the App Service Environment's outbound NAT address.

If the endpoint being called is **inside** of the virtual network topology, the outbound address of the calling app is the internal IP address of the individual compute resource running the app.  However there isn't a persistent mapping of virtual network internal IP addresses to apps.  Apps can move around across different compute resources, and the pool of available compute resources in an App Service Environment can change due to scaling operations.

However, since an App Service Environment is always located within a subnet, you're guaranteed that the internal IP address of a compute resource running an app will always lie within the CIDR range of the subnet.  As a result, when fine-grained ACLs or network security groups are used to secure access to other endpoints within the virtual network, the subnet range containing the App Service Environment needs to be granted access.

## Calls Between App Service Environments

A more complex scenario can occur if you deploy multiple App Service Environments in the same virtual network, and make outbound calls from one App Service Environment to another App Service Environment.  These types of cross App Service Environment calls will also be treated as "Internet" calls.

## Additional Links and Information

Details on inbound ports used by App Service Environments and using network security groups to control inbound traffic is available [here][controllinginboundtraffic].

Details on using user-defined routes to grant outbound Internet access to App Service Environments is available in this [article][ExpressRoute].

<!-- LINKS -->
[virtualnetwork]: https://azure.microsoft.com/services/virtual-network/
[controllinginboundtraffic]:  app-service-app-service-environment-control-inbound-traffic.md
[ExpressRoute]:  app-service-app-service-environment-network-configuration-expressroute.md

<!-- IMAGES -->
[GeneralNetworkFlows]: ./media/app-service-app-service-environment-network-architecture-overview/NetworkOverview-1.png
[OutboundIPAddress]: ./media/app-service-app-service-environment-network-architecture-overview/OutboundIPAddress-1.png
