
<properties
   pageTitle="Azure Guidance | patterns & practices | Microsoft Azure"
   description="Best practices and guidance for Azure"
   services=""
   documentationCenter="na"
   authors="bennage"
   manager="marksou"
   editor=""
   tags=""/>

<tags
   ms.service="guidance"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="06/29/2016"
   ms.author="christb"/>

# Azure Guidance

[AZURE.INCLUDE [pnp-header](../../includes/guidance-pnp-header-include.md)]

The Microsoft patterns & practices team is part of the Azure Customer Advisory Team. Our purpose is to help developers, architects, and IT professionals be successful on the Microsoft Azure platform. We develop guidance that shows best practices for building cloud solutions on Azure.

## Checklists

These lists are a quick reference for reviewing the fundamental aspects of availability and scalability. 

- [Availability Checklist][AvailabilityChecklist] 

    A summary of recommended practices for ensuring resiliency and availability.

- [Scalability Checklist][ScalabilityChecklist]

    A summary of recommended practices for designing and implementing scalable services and handling data management.

## Best practices articles

These articles provide an in-depth discussion of important concepts commonly associated with cloud computing. 

- [API Design][APIDesign] 

    A discussion of design issues to consider when designing a web API.

- [API Implementation][APIImplementation] 

    A set of recommended practices for implementing and publishing a web API.

- [API security guidance](https://github.com/mspnp/azure-guidance/blob/master/API-security.md) 

    A discussion of authentication and authorization concerns (e.g., token types, authorization protocols, authorization flows and threat mitigation).

- [Autoscaling guidance][AutoscalingGuidance] 

    A summary of considerations for taking advantage of the elasticity of cloud-hosted environments without the need for manual intervention.

- [Background Jobs guidance][BackgroundJobsGuidance] 

    A description of available options and recommended practices for implementing tasks that should be performed in the background, independently from any foreground or interactive operations.

- [Content Delivery Network (CDN) guidance][CDNGuidance] 

    General guidance and recommended practice for using the CDN to minimize the load on your applications, and maximize availability and performance.

- [Caching guidance][CachingGuidance] 

    A summary of how to use caching to improve the performance and scalability of a system.

- [Data Partitioning guidance][DataPartitioningGuidance]

    Strategies that you can use to partition data to improve scalability, reduce contention, and optimize performance.

- [Monitoring and Diagnostics guidance][MonitoringandDiagnosticsGuidance] 

    Guidance on how to track the way in which users utilize your system, trace resource utilization, and generally monitor the health and performance of your system.

- [Recommended naming conventions][naming-conventions] 

    Recommended naming conventions for Azure resources.

- [Retry General guidance][RetryGeneralGuidance] 

    Discussion of the general concepts for handling transient faults.

- [Retry Service-specific guidance][RetryServiceSpecificGuidance]

    A summary of retry features for many of Azure services, including information to help you use, adapt, or extend the retry mechanism for that service.

## Scenario guides

- [Running Elasticsearch on Azure][elasticsearch] 
    
    Elasticsearch is a highly scalable open-source search engine and database. It is suitable for situations that require fast analysis and discovery of information held in big datasets. This guidance looks at some key aspects to consider when designing an Elasticsearch cluster.

- [Identity management for multitenant applications][identity-multitenant] 
    
    Multitenancy is an architecture where multiple tenants share the same app but are isolated from one another. This guidance will show you how to manage user identities in a multitenant application, using [Azure Active Directory][AzureAD] to handle sign-in and authentication.
    
- [Developing big data solutions](https://msdn.microsoft.com/library/dn749874.aspx)

    This guide explores the use of HDInsight in a range of use cases and scenarios such as iterative exploration, as a data warehouse, for ETL processes, and integration into existing BI systems. It also includes guidance on understanding the concepts of big data, planning and designing big data solutions, and implementing these solutions.
    
## Patterns

- [Cloud Design Patterns: Prescriptive Architecture Guidance for Cloud Applications](https://msdn.microsoft.com/library/dn568099.aspx)

    Cloud Design Patterns is a library of design patterns and related guidance topics. It articulates the benefit of applying patterns by showing how each piece can fit into the big picture of cloud application architectures.
    
- [Optimizing Performance for Cloud Applications](https://github.com/mspnp/performance-optimization)

    This guidance is an exploration of common anti-patterns that impede apps from scaling under load. It includes samples demonstratraing 8 anti-patterns as well as a [performance analysis primer](https://github.com/mspnp/performance-optimization/blob/master/Performance-Analysis-Primer.md) and a guide for [assessing performance against key metrics](https://github.com/mspnp/performance-optimization/blob/master/Assessing-System-Performance-Against-KPI.md).

## Under development

We're creating a new set of guidance we're calling _reference architectures_. Each reference architecture offers recommended practices and prescriptive steps for infrastructure-oriented scenarios. We're actively developing these reference architectures, and some are available for preview. We're very intereseted in your feedback.

Running virtual machines on Azure:

- [Running a Windows VM on Azure][ref-arch-single-vm-windows]
- [Running a Linux VM on Azure][ref-arch-single-vm-linux]
- [Running multiple VMs for scalability and availability][ref-arch-multi-vm]
- [Running VMs for an N-tier architecture][ref-arch-3-tier]
- [Adding reliability to an N-tier architecture (Windows)][ref-arch-n-tier-windows]
- [Adding reliability to an N-tier architecture (Linux)][ref-arch-n-tier-linux]
- [Running VMs in multiple regions for high availability (Windows)][ref-arch-multi-dc-windows]
- [Running VMs in multiple regions for high availability (Linux)][ref-arch-multi-dc-linux]

Hybrid network architectures:

- [Implementing a hybrid network architecture with Azure and on-premises VPN](guidance-hybrid-network-vpn.md)
- [Implementing a hybrid network architecture with Azure ExpressRoute](guidance-hybrid-network-expressroute.md)
- [Implementing a highly available hybrid network architecture](guidance-hybrid-network-expressroute-vpn-failover.md)
- [Implementing a DMZ between Azure and your on-premises datacenter](guidance-iaas-ra-secure-vnet-hybrid.md)
- [Implementing a DMZ between Azure and the Internet](guidance-iaas-ra-secure-vnet-dmz.md)

Web applications (PaaS):

- [Basic web application](guidance-web-apps-basic.md)
- [Improving scalability in a web application](guidance-web-apps-scalability.md)
- [Web application with high availability](guidance-web-apps-multi-region.md)

[AzureAD]: https://azure.microsoft.com/documentation/services/active-directory/

[PerformanceOptimization]: https://github.com/mspnp/performance-optimization

[APIDesign]: ../best-practices-api-design.md
[APIImplementation]: ../best-practices-api-implementation.md
[AutoscalingGuidance]: ../best-practices-auto-scaling.md
[BackgroundJobsGuidance]: ../best-practices-background-jobs.md
[CDNGuidance]: ../best-practices-cdn.md
[CachingGuidance]: ../best-practices-caching.md
[DataPartitioningGuidance]: ../best-practices-data-partitioning.md
[MonitoringandDiagnosticsGuidance]: ../best-practices-monitoring.md
[RetryGeneralGuidance]: ../best-practices-retry-general.md
[RetryServiceSpecificGuidance]: ../best-practices-retry-service-specific.md
[RetryPolicies]: Retry-Policies.md
[ScalabilityChecklist]: ../best-practices-scalability-checklist.md
[AvailabilityChecklist]: ../best-practices-availability-checklist.md
[naming-conventions]: guidance-naming-conventions.md

<!-- guidance projects -->
[elasticsearch]: guidance-elasticsearch.md
[identity-multitenant]: guidance-multitenant-identity.md

<!-- reference architectures -->
[ref-arch-single-vm-windows]: guidance-compute-single-vm.md
[ref-arch-single-vm-linux]: guidance-compute-single-vm-linux.md
[ref-arch-multi-vm]: guidance-compute-multi-vm.md
[ref-arch-3-tier]: guidance-compute-3-tier-vm.md
[ref-arch-n-tier-windows]: guidance-compute-n-tier-vm.md
[ref-arch-n-tier-linux]: guidance-compute-n-tier-vm-linux.md
[ref-arch-multi-dc-windows]: guidance-compute-multiple-datacenters.md
[ref-arch-multi-dc-linux]: guidance-compute-multiple-datacenters-linux.md
