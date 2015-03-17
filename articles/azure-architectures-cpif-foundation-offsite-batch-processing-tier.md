<properties pageTitle="Cloud Platform Integration Framework - Azure Architecture" description="The Cloud Platform Integration Framework provides workload integration guidance for onboarding applications into a Microsoft Cloud Solution consisting of architectural patterns for Microsoft Azure" services="active-directory" documentationCenter="" authors="arynes" manager="fredhar" editor="" />

<tags ms.service="active-directory" ms.workload="identity" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="02/27/2015" ms.author="arynes" />

<h1 id="vnettut1">Hybrid Networking (Azure Architecture Patterns)</h1>

The [Cloud Platform Integration Framework (CPIF)](http://azure.microsoft.com/) provides workload integration guidance for onboarding applications into a Microsoft Cloud Solution. 

CPIF describes how organizations, customers and partners should design and deploy Cloud-targeted workloads utilizing the hybrid cloud platform and management capabilities of Azure, System Center and Windows Server. 

The **Offsite Batch Processing Tier** pattern is part of the **Infrastructure** area, which is described extensively in the CPIF Architecture document. 

##  Offsite Batch Processing Tier

The Offsite Batch Processing Tier design pattern details the Azure features and services required to deliver backend data processing that is both fault tolerant and scalable.  These services are realized as worker roles in cloud services on Azure, which currently can be deployed to any Azure data center.   

Batch processing workloads are unique in that they typically provide little or no user interface.  An example of this type of workload on premises would be a Windows Service running on Windows Server.  When considering this type of workload in a cloud environment, it would be wasteful to deploy an entire server to run a workload, when what is really required is compute, storage and network connectivity.  The worker role is the implementation of this on Azure. 

By definition, a batch processing job that is run in Azure is a workload that connects to a resource, provides some business logic (computing) and provides some output.  The input and output resources are defined by the user and can range from flat files, blobs in Azure blob storage, a NoSQL database, or relational databases.   

The business logic is implemented in an Azure worker role, typically by defining the required business logic in a .NET library.  While deployment of a worker role to Azure is a simple operation, deploying a worker role that is fault tolerant and scalable requires a design which takes into consideration how the service is executed and maintained within Azure.  This pattern will detail the design which considers these requirements and describes how these can be implemented. 

## Architectural Pattern Overview 

This document describes a pattern for offsite batch processing utilizing worker role instances contained within a cloud service in Azure.  The critical components to this design are shown below.  This diagram illustrates the minimum required instances to achieve fault tolerance.  Additional instances can be deployed to increase performance of the service.  Additionally, auto scaling can be enabled to assisting in scaling the instances by time or additional server metrics. 

##  Additional Resources
[Batch Processing Tier](http://azure.microsoft.com/)

## See Also
[CPIF Architecture](http://azure.microsoft.com/documentation/services/active-directory/) 

[Global Load Balanced Web Tier](http://azure.microsoft.com/) 

[Load Balanced Data Tier](http://azure.microsoft.com/)

[Azure Networking](http://azure.microsoft.com/)

[Azure Search Tier](http://azure.microsoft.com/) 
