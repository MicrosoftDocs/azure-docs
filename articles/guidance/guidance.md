
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
   ms.date="04/19/2016"
   ms.author="christb"/>

# Azure Guidance

![patterns & practices](media/guidance/pnp-logo.png)

## Checklists

These lists are a quick reference for reviewing the fundamental aspects of availability and scalability. 

- **[Availability Checklist][AvailabilityChecklist]** summarizes recommended practices for ensuring resiliency and availability.

- **[Scalability Checklist][ScalabilityChecklist]** summarizes recommended practices for designing and implementing scalable services and handling data management.

## Best pracitces articles

These articles provide an in-depth discussion of important concepts commonly associated with cloud computing. 

- **[API Design][APIDesign]** describes the issues that you should consider when designing a web API.

- **[API Implementation][APIImplementation]** focuses on recommended practices for implementing a web API and publishing it to make it available to client applications.

- [**API security guidance**](https://github.com/mspnp/azure-guidance/blob/master/API-security.md) addresses  authentication and authorization concerns as well as design consideration such as token types, authorization protocols, authorization flows and threat mitigation.

- **[Autoscaling guidance][AutoscalingGuidance]** summarizes considerations for taking advantage of the elasticity of cloud-hosted environments while easing management overhead by reducing the need for an operator to continually monitor the performance of a system and make decisions about adding or removing resources.

- **[Background Jobs guidance][BackgroundJobsGuidance]** describes the available options and recommended practices for implementing tasks that should be performed in the background, independently from any foreground or interactive operations.

- **[Content Delivery Network (CDN) guidance][CDNGuidance]** provides general guidance and good practice for using the CDN to minimize the load on your applications, and maximize availability and performance.

- **[Caching guidance][CachingGuidance]** summarizes how to use caching with Azure applications and services to improve the performance and scalability of a system.

- **[Data Partitioning guidance][DataPartitioningGuidance]** describes strategies that you can use to partition data to improve scalability, reduce contention, and optimize performance.

- **[Monitoring and Diagnostics guidance][MonitoringandDiagnosticsGuidance]** provides guidance on how to track the way in which users utilize your system, trace resource utilization, and generally monitor the health and performance of your system.

- **[Recommended naming conventions][naming-conventions]** recommends practical naming conventions for Azure resources.

- **[Retry General guidance][RetryGeneralGuidance]** covers general guidance for transient fault handling in an Azure application.

- **[Retry Service-specific guidance][RetryServiceSpecificGuidance]** summarizes the retry mechanism features for the majority of Azure services, and includes information to help you use, adapt, or extend the retry mechanism for that service.

## Scenario Guides

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

We're creating a new set of guidance we're calling "blueprints". Each blueprint offers recommended practices and prescriptive steps for infrastructure-oriented scenarios. We're actively developing these blueprints, and some are available for preview. We're very intereseted in your feedback.

- [Running a single VM on Azure][blueprint-single-vm-windows]
- [Achieving availabitilty using multiple VM instances][blueprint-multi-vm-windows]
- [Achieving manageability, scalability, availability, and security for a 3-tier app][blueprint-3-tier-windows]
- Adding a network appliance and SQL AlwaysOn Availability Groups (_not yet available_)
- Deploying to multiple datacenters, routing traffic, facilitating failover(_not yet available_)
- [Extending an on-premises network to Azure using a site-to-site virtual private network][blueprint-hybrid-network-vpn].

[AzureAD]: https://azure.microsoft.com/documentation/services/active-directory/

[PerformanceOptimization]: https://github.com/mspnp/performance-optimization

[APIDesign]: ../best-practices-api-design/
[APIImplementation]: ../best-practices-api-implementation/
[AutoscalingGuidance]: ../best-practices-auto-scaling/
[BackgroundJobsGuidance]: ../best-practices-background-jobs/
[CDNGuidance]: ../best-practices-cdn/
[CachingGuidance]: ../best-practices-caching/
[DataPartitioningGuidance]: ../best-practices-data-partitioning/
[MonitoringandDiagnosticsGuidance]: ../best-practices-monitoring/
[RetryGeneralGuidance]: ../best-practices-retry-general/
[RetryServiceSpecificGuidance]: ../best-practices-retry-service-specific/
[RetryPolicies]: Retry-Policies.md
[ScalabilityChecklist]: ../best-practices-scalability-checklist/
[AvailabilityChecklist]: ../best-practices-availability-checklist/
[naming-conventions]: ./guidance-naming-conventions/

<!-- guidance projects -->
[elasticsearch]: guidance-elasticsearch.md
[identity-multitenant]: guidance-multitenant-identity.md

<!-- blueprints -->
[blueprint-single-vm-windows]: guidance-compute-single-vm.md
[blueprint-multi-vm-windows]: guidance-compute-multi-vm.md
[blueprint-3-tier-windows]: guidance-compute-3-tier-vm.md
[blueprint-hybrid-network-vpn]: guidance-hybrid-network-vpn.md