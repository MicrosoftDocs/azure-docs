<properties 
   pageTitle="Cloud Platform Integration Framework - Azure Architecture Patterns" 
   description="The Cloud Platform Integration Framework provides workload integration guidance for onboarding applications into a Microsoft Cloud Solution consisting of architectural patterns for Microsoft Azure" 
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


# Cloud Platform Integration Framework (Azure Architecture Patterns)

The Cloud Platform Integration Framework (CPIF) provides workload integration guidance for onboarding applications into a Microsoft Cloud Solution. 

CPIF describes how organizations, customers and partners should design and deploy Cloud-targeted workloads utilizing the hybrid cloud platform and management capabilities of Azure, System Center and Windows Server. The CPIF domains have been decomposed into the following functions:

![Tags part on resource and resource group blades](./media/azure-architecture-cpif-overview/overview.png)

##  CPIF Architecture

Both public and private cloud environments provide common elements to support the running of complex workloads. While these architectures are relatively well understood in traditional on-premises physical and virtualized environments, the constructs found within the Microsoft Azure require additional planning to rationalize the infrastructure and platform capabilities found within public cloud environments. To support the development of a hosted application or service in Azure, a series of patterns are required outlining the various components required to compose a given workload Solution.  

These architectural patterns fall within the following categories:

- **Infrastructure**– Microsoft Azure is an Infrastructure- and Platform-as-a-Service Solution which is comprised of several underlying services and capabilities.  These services largely can be decomposed into compute, storage and network services, however there are several capabilities which may fall outside of these definitions.  Infrastructure patterns detail a given functional area of Microsoft Azure which is required to provide a given service to one or more Solutions hosted within a given Azure subscription. 
- **Foundation** – When composing a multi-tiered application or service within Azure, several components must be used in combination to provide a suitable hosting environment.  Foundation patterns compose one or more services from Microsoft Azure to support a given layer of functionality within an application. This may require the use of one or more components described in the infrastructure patterns outlined above. For example, the presentation layer of a multi-tier application requires compute, network and storage capabilities within Azure to become functional.  Foundation patterns are meant to be composed with other patterns as part of a given Solution.
- **Solution** – Solution patterns are composed of infrastructure and/or foundation patterns to represent an end application or service being developed.  It is envisioned that complex solutions would not be developed independently of other patterns.  Rather, they should utilize the components and interfaces defined in each of the pattern categories outlined above.    

## Azure Architectural Pattern Concepts

To support the development of Solution architectures within Azure, a series of pattern guides are provided for common scenarios.   While these scenario guides will be constructed over time, envisioned patterns include:

- Global Load Balanced Web Tier 
- Load Balanced Data Tier
- Batch Processing Tier
- Hybrid Networking
- Azure Search 

##  Additional Resources
[CPIF Architecture (pdf)](https://gallery.technet.microsoft.com/Cloud-Platform-Integration-bd1e434a) 

## See Also
[Global Load Balanced Web Tier](https://gallery.technet.microsoft.com/Cloud-Platform-Integration-2c3c663a) 

[Load Balanced Data Tier](https://gallery.technet.microsoft.com/Cloud-Platform-Integration-dfb09e41)

[Batch Processing Tier](https://gallery.technet.microsoft.com/Cloud-Platform-Integration-0bc3f8b1)

[Azure Networking](https://gallery.technet.microsoft.com/Cloud-Platform-Integration-5e401f38)

[Azure Search](https://gallery.technet.microsoft.com/Cloud-Platform-Integration-e581d65d)
