<properties pageTitle="Cloud Platform Integration Framework - Azure Architecture" description="The Cloud Platform Integration Framework provides workload integration guidance for onboarding applications into a Microsoft Cloud Solution consisting of architectural patterns for Microsoft Azure" services="active-directory" documentationCenter="" authors="arynes" manager="fredhar" editor="" />

<tags ms.service="active-directory" ms.workload="identity" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="02/27/2015" ms.author="arynes" />

<h1 id="vnettut1">Global Load Balanced Web Tier (Azure Architecture Patterns)</h1>

The [Cloud Platform Integration Framework (CPIF)](http://azure.microsoft.com/) provides workload integration guidance for onboarding applications into a Microsoft Cloud Solution. 

CPIF describes how organizations, customers and partners should design and deploy Cloud-targeted workloads utilizing the hybrid cloud platform and management capabilities of Azure, System Center and Windows Server. 

The **Global Load Balanced Web Tier** pattern is part of the **Foundation** area, which is described extensively in the CPIF Architecture document. 

##  Global Load Balanced Web Tier

The Global Load Balanced Web Tier design pattern details the Azure features and services required to deliver web tier services that can provide predictable performance and high availability across geographic boundaries. 

For the purposes of this design pattern a web tier is defined as a tier of service providing traditional HTTP/HTTPS content or application services in either an isolated manner or as part of a multi-tiered web application.  Within this pattern, load balancing of the web tier is provided both locally within the region and across regions. From a compute perspective, these services can be provided through Microsoft Azure virtual machines, web sites or a combination of both.  Virtual machines providing web services can host content using any supported Microsoft Windows or Linux distribution guest operating system within Microsoft Azure. 


## Architectural Pattern Overview 

This document describes a pattern for providing access to web services or web server content over multiple geographies for the purposes of availability and redundancy.  Critical services are illustrated below without attention to web platform constraints or development methodology within the web service itself.  There are two variations to this pattern – one which hosts the web content or services on virtual machines (using Azure supported operating systems and families) and one which uses Azure Websites.  The diagram below is a simple illustration of the relevant services and how they are used as part of this pattern using the example of virtual machines.   

##  Additional Resources
[Global Load Balanced Web Tier](http://azure.microsoft.com/) 

## See Also
[CPIF Architecture](http://azure.microsoft.com/documentation/services/active-directory/) 

[Load Balanced Data Tier](http://azure.microsoft.com/)

[Batch Processing Tier](http://azure.microsoft.com/)

[Azure Networking](http://azure.microsoft.com/)

[Azure Search Tier](http://azure.microsoft.com/) 
