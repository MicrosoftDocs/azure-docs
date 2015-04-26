<properties 
   pageTitle="Hybrid Networking (Azure Architecture Patterns)" 
   description="The Hybrid Networking pattern is part of the Infrastructure area, which is described extensively in the CPIF Architecture document." 
   services="" 
   documentationCenter="" 
   authors="arynes" 
   manager="fredhar" 
   editor=""/>

<tags
   ms.service="cloud-services"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="multiple" 
   ms.date="03/25/2015"
   ms.author="arynes"/>

# Hybrid Networking (Azure Architecture Patterns)

The [Cloud Platform Integration Framework (CPIF)](azure-architectures-cpif-overview.md) provides workload integration guidance for onboarding applications into a Microsoft Cloud Solution.  

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
[Hybrid Networking (pdf)](https://gallery.technet.microsoft.com/Cloud-Platform-Integration-5e401f38)

## See Also
[CPIF Architecture](https://gallery.technet.microsoft.com/Cloud-Platform-Integration-bd1e434a) 

[Global Load Balanced Web Tier](https://gallery.technet.microsoft.com/Cloud-Platform-Integration-2c3c663a) 

[Load Balanced Data Tier](https://gallery.technet.microsoft.com/Cloud-Platform-Integration-dfb09e41)

[Azure Search Tier](https://gallery.technet.microsoft.com/Cloud-Platform-Integration-e581d65d) 

[Batch Processing Tier](https://gallery.technet.microsoft.com/Cloud-Platform-Integration-0bc3f8b1)
