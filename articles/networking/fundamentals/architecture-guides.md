---
title: Azure networking reference architecture documentation
description: Learn about the reference architecture documentation available for Azure networking services.
services: networking
author: KumudD
ms.service: virtual-network
ms.topic: article
ms.date: 03/30/2021
ms.author: kumud
---
# Azure networking architecture documentation

The following table includes architecture guides that help you explore the different networking services that are available to you for building your application in Azure.

|Category|Title |Description  |
|---------|---------|---------|---------|
|General networking|[Virtual Datacenters](/azure/architecture/vdc/networking-virtual-datacenter)   | Provides a networking perspective of a virtual datacenter in Azure.       |
|General networking|[Hub-spoke topology](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke)  |Provides an overview of the hub and spoke network topology in Azure along with information about subscription limits and multiple hubs.          |
|Connectivity|[Add IP address spaces to peered virtual networks](/azure/architecture/networking/prefixes/add-ip-space-peered-vnet)     | Provides scripts that help add IP address spaces to peered virtual networks.        |
|Connectivity|[Connect standalone servers by using Azure Network Adapter](/azure/architecture/hybrid/azure-network-adapter)   | Shows how to connect an on-premises standalone server to Microsoft Azure virtual networks by using the Azure Network Adapter that you deploy through Windows Admin Center.        |
|Connectivity|[Choose between virtual network peering and VPN gateways](/azure/architecture/reference-architectures/hybrid-networking/vnet-peering)   | Compares two ways to connect virtual networks in Azure: virtual network peering and VPN gateways.        |
|Cross-premises connectivity|[Connect an on-premises network to Azure](/azure/architecture/reference-architectures/hybrid-networking/)  | Compares options for connecting an on-premises network to an Azure Virtual Network (VNet). For each option, a more detailed reference architecture is available.        |
|High availability|[Multi-region N-tier application](/azure/architecture/reference-architectures/n-tier/multi-region-sql-server))  | Describes a multi-region N-tier application that uses Traffic Manager to route incoming requests to a primary region and if that region becomes unavailable, Traffic Manager fails over to the secondary region.      |
|High availability| [Multitenant SaaS on Azure](https://docs.microsoft.com/azure/architecture/example-scenario/multi-saas/multitenant-saas)       |   Uses a multi-tenant solution that includes a combination of Front Door and Application Gateway.  Front Door helps load balance traffic across regions and Application Gateway routes and load-balances traffic internally in the application to the various services that satisfy client business needs.  |
|High availability| [Multi-tier web application built for high availability and disaster recovery ](https://docs.microsoft.com/azure/architecture/example-scenario/infrastructure/multi-tier-app-disaster-recovery)        |      Deploys resilient multi-tier applications built for high availability and disaster recovery. If the primary region becomes unavailable, Traffic Manager fails over to the secondary region.  |
|High availability|[IaaS: Web application with relational database](/azure/architecture/high-availability/ref-arch-iaas-web-and-db)    |   Describes how to use resources spread across multiple zones to provide a high availability architecture for hosting an Infrastructure as a Service (IaaS) web application and SQL Server database.     |
|High availability|[Sharing location in real time using low-cost serverless Azure services](/azure/architecture/example-scenario/signalr/#azure-front-door)       |   Uses Azure Front Door to provide higher availability for your applications than deploying to a single region. If a regional outage affects the primary region, you can use Front Door to fail over to the secondary region.      |
|High availability|[Highly available network virtual appliances](/azure/architecture/reference-architectures/dmz/nva-ha)     | Shows how to deploy a set of network virtual appliances (NVAs) for high availability in Azure.        |
|Network security|[Network security best practices](../../security/fundamentals/network-best-practices.md) |Discusses a collection of Azure best practices to enhance your network security.         |
|Network security|[Azure Firewall Architecture Guide](/azure/architecture/example-scenario/firewalls/) | Provides a structured approach for designing highly available firewalls in Azure using third-party virtual appliances.        |
|Network security|[Implement a secure hybrid network](/azure/architecture/reference-architectures/dmz/secure-vnet-dmz)     | Describes an architecture that implements a DMZ, also called a perimeter network, between the on-premises network and an Azure virtual network. All inbound and outbound traffic passes through Azure Firewall.        |
|Network security|[Secure and govern workloads with network level segmentation](/azure/architecture/reference-architectures/hybrid-networking/network-level-segmentation) | Describes the three common patterns used for organizing workloads in Azure from a networking perspective.   Each of these patterns provides a different type of isolation and connectivity.      |
|Network security|[Firewall and Application Gateway for virtual networks](/azure/architecture/example-scenario/gateway/firewall-application-gateway) | Describes Azure Virtual Network security services like Azure Firewall and Azure Application Gateway, when to use each service, and network design options that combine both.      |

## Next steps

Learn about [Azure Virtual Network](../../virtual-network/virtual-networks-overview.md).
