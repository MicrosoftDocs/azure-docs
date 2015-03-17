<properties pageTitle="Cloud Platform Integration Framework - Azure Architecture" description="The Cloud Platform Integration Framework provides workload integration guidance for onboarding applications into a Microsoft Cloud Solution consisting of architectural patterns for Microsoft Azure" services="active-directory" documentationCenter="" authors="arynes" manager="fredhar" editor="" />

<tags ms.service="active-directory" ms.workload="identity" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="02/27/2015" ms.author="arynes" />

<h1 id="vnettut1">Azure Search Tier (Azure Architecture Patterns)</h1>

The [Cloud Platform Integration Framework (CPIF)](http://azure.microsoft.com/) provides workload integration guidance for onboarding applications into a Microsoft Cloud Solution. 

CPIF describes how organizations, customers and partners should design and deploy Cloud-targeted workloads utilizing the hybrid cloud platform and management capabilities of Azure, System Center and Windows Server. 

The **Azure Search Tier** pattern is part of the **Foundation** area, which is described extensively in the CPIF Architecture document. 

##  Azure Search Tier

The Azure Search Tier design pattern details the Azure features and services required to deliver search services that can provide predictable performance and high availability across geographic boundaries and provides an architectural pattern for using Azure Search in delivering a search Solution.  Azure Search is a “search-as-a-service” built within Microsoft Azure that allows developers to incorporate search capabilities into applications without having to deploy, manage or maintain infrastructure services to provide this capability to applications. The purpose of this pattern is to provide a repeatable solution intended for use in different situations and design. 

## Architectural Pattern Overview 

This document describes a core pattern for using Azure Search with two variations of the core to demonstrate the architectural range of the service.  The core pattern consists of Azure Search and surrounding Azure services and is intended to provide guidance for creating end-to-end designs.  Variations of the pattern, specifically the Shared Service and Concurrency patterns, are also included in this section to provide guidance based on different requirements, Service Level Agreements (SLA) and other specific conditions. 

##  Additional Resources
[Azure Search Tier](http://azure.microsoft.com/) 

## See Also
[CPIF Architecture](http://azure.microsoft.com/documentation/services/active-directory/) 

[Global Load Balanced Web Tier](http://azure.microsoft.com/) 

[Load Balanced Data Tier](http://azure.microsoft.com/)

[Batch Processing Tier](http://azure.microsoft.com/)

[Azure Networking](http://azure.microsoft.com/)
