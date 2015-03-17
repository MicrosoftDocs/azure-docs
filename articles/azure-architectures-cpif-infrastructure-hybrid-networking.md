<properties pageTitle="Cloud Platform Integration Framework - Azure Architecture" description="The Cloud Platform Integration Framework provides workload integration guidance for onboarding applications into a Microsoft Cloud Solution consisting of architectural patterns for Microsoft Azure" services="active-directory" documentationCenter="" authors="arynes" manager="fredhar" editor="" />

<tags ms.service="active-directory" ms.workload="identity" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="02/27/2015" ms.author="arynes" />

<h1 id="vnettut1">Hybrid Networking (Azure Architecture Patterns)</h1>

The [Cloud Platform Integration Framework (CPIF)](http://azure.microsoft.com/) provides workload integration guidance for onboarding applications into a Microsoft Cloud Solution. 

CPIF describes how organizations, customers and partners should design and deploy Cloud-targeted workloads utilizing the hybrid cloud platform and management capabilities of Azure, System Center and Windows Server. 

The **Hybrid Networking** pattern is part of the **Infrastructure** area, which is described extensively in the CPIF Architecture document. 

##  Hybrid Networking

The Hybrid Networking design pattern details the Azure features and services required to deliver network functionality that can provide predictable performance and high availability across geographic boundaries.  A full list of Microsoft Azure regions and the services available within each is provided within the Microsoft Azure documentation site.  This document provides an overview of Microsoft Azure networking capabilities for hybrid environments. Microsoft Azure Virtual Networking enables you to create logically isolated networks in Azure and securely connect them to your on-premises datacenter over the Internet or using a private network connection.  In addition, individual client machines can connect to an isolated Azure network using an IPsec VPN connection.  

The Hybrid Networking architecture pattern includes the following focus areas: 

- Connecting on premises networks to Azure 
- Extending Azure virtual networks across regions 
- Extending Azure virtual networks between subscriptions 
- Providing developers remote network access 

## Architectural Pattern Overview 

The hybrid networking architecture pattern is complex due to the possible number of scenarios that can be created. This architectural pattern will focus on the following four scenarios: 

- Site-to-Site hybrid networking with Multi-hop virtual network routing within a single subscription and region 
- Site-to-Site hybrid networking with multi-hop virtual network routing across subscriptions and regions 
- ExpressRoute hybrid networking using MPLS connectivity 
- ExpressRoute hybrid networking using IXP connectivity 

##  Additional Resources
[Azure Networking](http://azure.microsoft.com/)

## See Also
[CPIF Architecture](http://azure.microsoft.com/documentation/services/active-directory/) 

[Global Load Balanced Web Tier](http://azure.microsoft.com/) 

[Load Balanced Data Tier](http://azure.microsoft.com/)

[Batch Processing Tier](http://azure.microsoft.com/)

[Azure Search Tier](http://azure.microsoft.com/) 
