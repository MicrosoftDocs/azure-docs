<properties 
   pageTitle="Azure Search Tier (Azure Architecture Patterns)" 
   description="The Azure Search Tier pattern is part of the Foundation area, which is described extensively in the CPIF Architecture document" 
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

# Azure Search Tier (Azure Architecture Patterns)

The [Cloud Platform Integration Framework (CPIF)](azure-architectures-cpif-overview.md) provides workload integration guidance for onboarding applications into a Microsoft Cloud Solution.  

CPIF describes how organizations, customers and partners should design and deploy Cloud-targeted workloads utilizing the hybrid cloud platform and management capabilities of Azure, System Center and Windows Server. 

The **Azure Search Tier** pattern is part of the **Foundation** area, which is described extensively in the CPIF Architecture document. 

##  Azure Search Tier

The Azure Search Tier design pattern details the Azure features and services required to deliver search services that can provide predictable performance and high availability across geographic boundaries and provides an architectural pattern for using Azure Search in delivering a search Solution.  Azure Search is a “search-as-a-service” built within Microsoft Azure that allows developers to incorporate search capabilities into applications without having to deploy, manage or maintain infrastructure services to provide this capability to applications. The purpose of this pattern is to provide a repeatable solution intended for use in different situations and design. 

## Architectural Pattern Overview 

This document describes a core pattern for using Azure Search with two variations of the core to demonstrate the architectural range of the service.  The core pattern consists of Azure Search and surrounding Azure services and is intended to provide guidance for creating end-to-end designs.  Variations of the pattern, specifically the Shared Service and Concurrency patterns, are also included in this section to provide guidance based on different requirements, Service Level Agreements (SLA) and other specific conditions. 

##  Additional Resources
[Azure Search Tier (pdf)](https://gallery.technet.microsoft.com/Cloud-Platform-Integration-e581d65d) 

## See Also
[CPIF Architecture](https://gallery.technet.microsoft.com/Cloud-Platform-Integration-bd1e434a) 

[Global Load Balanced Web Tier](https://gallery.technet.microsoft.com/Cloud-Platform-Integration-2c3c663a) 

[Load Balanced Data Tier](https://gallery.technet.microsoft.com/Cloud-Platform-Integration-dfb09e41)

[Hybrid Networking](https://gallery.technet.microsoft.com/Cloud-Platform-Integration-5e401f38)

[Batch Processing Tier](https://gallery.technet.microsoft.com/Cloud-Platform-Integration-0bc3f8b1)
