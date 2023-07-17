---
title: Azure Networking architecture documentation
description: Learn about the reference architecture documentation available for Azure networking services.
author: asudbring
ms.service: virtual-network
ms.topic: article
ms.date: 06/13/2023
ms.author: allensu
---
# Azure Networking architecture documentation

This article provides information about architecture guides that can help you explore the different networking services in Azure available to you for building your applications.

## Networking overview

The following table includes articles that provide a networking overview of a virtual datacenter and a hub and spoke topology in Azure.

| Title | Description |
|--|--|
| [Virtual Datacenters](/azure/architecture/vdc/networking-virtual-datacenter) | Provides a networking perspective of a virtual datacenter in Azure. |
| [Hub-spoke topology](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke) | Provides an overview of the hub and spoke network topology in Azure along with information about subscription limits and multiple hubs. |
| [Hub-spoke network topology with Azure Virtual WAN](/azure/architecture/networking/hub-spoke-vwan-architecture) | Provides an alternative solution to the hub-spoke network topology that uses Azure Virtual WAN. Azure Virtual WAN is used to replace hubs as a managed service. |

## Connect to Azure resources

Azure Networking services provide connectivity between Azure resources, connectivity from an on-premises network to Azure resources, and branch to branch connectivity in Azure. The following table includes articles about these services.

| Title | Description |
|--|--|
| [Add IP address spaces to peered virtual networks](/azure/architecture/networking/prefixes/add-ip-space-peered-vnet) | Provides scripts that help add IP address spaces to peered virtual networks. |
| [Connect standalone servers by using Azure Network Adapter](/azure/architecture/hybrid/azure-network-adapter) | Shows how to connect an on-premises standalone server to Microsoft Azure virtual networks by using the Azure Network Adapter that you deploy through Windows Admin Center. |
| [Choose between virtual network peering and VPN gateways](/azure/architecture/reference-architectures/hybrid-networking/vnet-peering) | Compares two ways to connect virtual networks in Azure: virtual network peering and VPN gateways. |
| [Connect an on-premises network to Azure](/azure/architecture/reference-architectures/hybrid-networking/) | Compares options for connecting an on-premises network to an Azure Virtual Network (VNet). For each option, a more detailed reference architecture is available. |
| [SD-WAN connectivity architecture with Azure Virtual WAN](../../virtual-wan/sd-wan-connectivity-architecture.md) | Describes the different connectivity options for interconnecting a private Software Defined WAN (SD-WAN) with Azure Virtual WAN. |
| [Cross-cloud scaling with Traffic Manager](/azure/architecture/example-scenario/hybrid/hybrid-cross-cloud-scaling) | Describes how to use Traffic Manager to extend your on-premises application with your application running in the public cloud. |
| [Hybrid geo-distributed architecture](/azure/architecture/example-scenario/hybrid/hybrid-geo-distributed) | Describes how to use Azure Traffic Manager to route traffic to endpoints to meet regional requirements, corporate policies, and international regulations. |
| [Design a hybrid Domain Name System solution with Azure](/azure/architecture/hybrid/hybrid-dns-infra) | Describes how to design a hybrid Domain Name System (DNS) solution to resolve names for workloads deployed across on-premises and Azure. The solution employs Azure DNS Public for internet users and Azure DNS Private zones for resolution between virtual networks. DNS servers are used for on-premises users and Azure systems. |
| [Choosing between virtual network peering and VPN gateways](/azure/architecture/reference-architectures/hybrid-networking/vnet-peering) | Describes how to choose between virtual network peering and VPN gateways to connect virtual networks in Azure. |
| [Guide to Private Link and DNS in Azure Virtual WAN](/azure/architecture/guide/networking/private-link-virtual-wan-dns-guide) | This guide describes how to use Azure Private Link and Azure Private DNS to connect to Azure PaaS services over a private endpoint in Azure Virtual WAN. |
| [Carrier-grade voicemail solution on Azure](/azure/architecture/industries/telecommunications/carrier-grade) | This architecture provides guidance for designing a carrier-grade solution for a telecommunication use case. The design choices focus on high reliability by minimizing points of failure and ultimately overall downtime using native Azure capabilities. |
 
## Deploy highly available applications

The following table includes articles that describe how to deploy your applications for high availability using a combination of Azure Networking services.

| Title | Description |
|--|--|
| [Multi-region N-tier application](/azure/architecture/reference-architectures/n-tier/multi-region-sql-server)) | Describes a multi-region N-tier application that uses Traffic Manager to route incoming requests to a primary region and if that region becomes unavailable, Traffic Manager fails over to the secondary region. |
| [Multitenant SaaS on Azure](/azure/architecture/example-scenario/multi-saas/multitenant-saas) | Uses a multi-tenant solution that includes a combination of Front Door and Application Gateway. Front Door balances traffic across regions. Application Gateway routes and load-balances traffic internally in the application to the various services that satisfy the client business needs. |
| [Multi-tier web application built for high availability and disaster recovery](/azure/architecture/example-scenario/infrastructure/multi-tier-app-disaster-recovery) | Deploys resilient multi-tier applications built for high availability and disaster recovery. If the primary region becomes unavailable, Traffic Manager fails over to the secondary region. |
| [Application Gateway Ingress Controller (AGIC) with a multitenant Azure Kubernetes Service](/azure/architecture/example-scenario/aks-agic/aks-agic) | Protect your Azure Kubernetes Service (AKS) cluster with Application Gateway Ingress Controller (AGIC) and Web Application Firewall (WAF). AGIC is a Kubernetes application that makes it easy to manage an Application Gateway instance in your AKS cluster. |
| [IaaS: Web application with relational database](/azure/architecture/high-availability/ref-arch-iaas-web-and-db) | Describes how to use resources spread across multiple zones to provide a high availability architecture for hosting an Infrastructure as a Service (IaaS) web application and SQL Server database. |
| [Sharing location in real time using low-cost serverless Azure services](/azure/architecture/example-scenario/signalr/#azure-front-door) | Uses Azure Front Door to provide higher availability for your applications than deploying to a single region. If a regional outage affects the primary region, you can use Front Door to fail over to the secondary region. |
| [Highly available network virtual appliances](/azure/architecture/reference-architectures/dmz/nva-ha) | Shows how to deploy a set of network virtual appliances (NVAs) for high availability in Azure. |
| [Multi-region load balancing with Traffic Manager and Application Gateway](/azure/architecture/high-availability/reference-architecture-traffic-manager-application-gateway) | Describes how to deploy resilient multi-tier applications in multiple Azure regions, in order to achieve availability and a robust disaster recovery infrastructure. |
| [Scalable and secure WordPress on Azure](/azure/architecture/example-scenario/infrastructure/wordpress) | Describes how to deploy a scalable and secure WordPress application on Azure. The architecture uses Azure Cloud Delivery Network (CDN) to cache static content. The CDN uses an Azure Load Balancer as the origin to retrieve content from the WordPress application. |
| [Azure Firewall - Well-Architected Framework](/azure/well-architected/services/networking/azure-firewall) | Architectural best practice for Azure Firewall. This guide covers the five pillars of architecture excellence: cost optimization, operational excellence, performance efficiency, reliability, and security. |
| [Expose Azure Spring Apps through a reverse proxy](/azure/architecture/reference-architectures/microservices/spring-cloud-reverse-proxy) | Describes how to use a reverse proxy service such as Azure Application Gateway or Azure Front Door to expose Azure Spring Cloud applications to the internet. By placing a service in front of Azure Spring Apps you can protect, load balance, route and filter requests based on your business needs. |
| [Oracle database migration to Azure](/azure/architecture/solution-ideas/articles/reference-architecture-for-oracle-database-migration-to-azure) | Describes how to migrate an Oracle database to Azure using Oracle Active Data Guard. The architecture uses Azure Load Balancer to load balance traffic to the Oracle database. |

## Secure your network resources

The following table includes articles that describe how to protect your network resources using Azure Networking services.

| Title | Description |
|--|--|
| [Network security best practices](../../security/fundamentals/network-best-practices.md) | Discusses a collection of Azure best practices to enhance your network security. |
| [Azure Firewall Architecture Guide](/azure/architecture/example-scenario/firewalls/) | Provides a structured approach for designing highly available firewalls in Azure using third-party virtual appliances. |
| [Implement a secure hybrid network](/azure/architecture/reference-architectures/dmz/secure-vnet-dmz) | Describes an architecture that implements a DMZ, also called a perimeter network, between the on-premises network and an Azure virtual network. All inbound and outbound traffic passes through Azure Firewall. |
| [Secure and govern workloads with network level segmentation](/azure/architecture/reference-architectures/hybrid-networking/network-level-segmentation) | Describes the three common patterns used for organizing workloads in Azure from a networking perspective.   Each of these patterns provides a different type of isolation and connectivity. |
| [Firewall and Application Gateway for virtual networks](/azure/architecture/example-scenario/gateway/firewall-application-gateway) | Describes Azure Virtual Network security services like Azure Firewall and Azure Application Gateway, when to use each service, and network design options that combine both. |
| [Secure managed web applications](/azure/architecture/example-scenario/apps/fully-managed-secure-apps) | Overview of deploying secure applications using Azure App Service Environment (ASE), Azure Application Gateway, and Azure Web Application Firewall (WAF). |
| [Secure virtual network applications](/azure/architecture/example-scenario/gateway/firewall-application-gateway) | The article explains Azure Virtual Network security services such as Azure Firewall, Azure DDoS Protection, Azure Application Gateway, and Azure Web Application Firewall (WAF) and their use cases. It also covers network design options that combine these services. |
| [Open-source jump server solution on Azure](/azure/architecture/example-scenario/infrastructure/apache-guacamole) | Describes how to deploy a jump server solution on Azure using Apache Guacamole.  Apache Guacamole is a clientless remote desktop gateway. It supports standard protocols like VNC, RDP, and SSH. |
| [Secure your Microsoft Teams channel bot and web app behind a firewall](/azure/architecture/example-scenario/teams/securing-bot-teams-channel) | Describes how to use Azure Firewall, Azure Private Link and Azure Private Endpoint to secure connectivity to Microsoft Teams channel bot web app. |
| [Secure access to an Azure Kubernetes Service (AKS) API server](/azure/architecture/guide/security/access-azure-kubernetes-service-cluster-api-server) | Describes various options to secure access to an Azure Kubernetes Service (AKS) API server. |
| [Enterprise cloud file share with Azure sharing solution](/azure/architecture/hybrid/azure-files-private) | The article explains how to create a secure enterprise cloud file share solution using Azure Files, Azure File Sync, Azure DNS, and Azure Private Link. This solution saves cost by outsourcing the management of file server and infrastructure while retaining control of the data. |
| [Protect APIs with Application Gateway and API Management](/azure/architecture/reference-architectures/apis/protect-apis) | Describes how to Azure Application Gateway to restrict and protect access to APIs hosted in Azure API Management. |
| [Deploy AD DS in an Azure virtual network](/azure/architecture/example-scenario/identity/adds-extend-domain) | Describes how to extend an on-premises Active Directory Domain Services (AD DS) environment to Azure by deploying domain controllers in an Azure virtual network. |
| [Securing PaaS deployments](/azure/security/fundamentals/paas-deployments) | Provide general guidance for securing PaaS deployments in Azure. |

## Next steps

Learn about [Azure Virtual Network](../../virtual-network/virtual-networks-overview.md).