
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
   ms.date="04/15/2016"
   ms.author="christb"/>

# Azure Guidance

![patterns & practices](media/guidance/pnp-logo.png)

Designing and implementing applications for the cloud brings a unique set of challenges due to the remoteness of the infrastructure and the very nature of distributed services. Azure provides a comprehensive platform and infrastructure for hosting large-scale web applications and cloud services. However, to be successful, you need to understand how to use the features that Azure provides to support your systems correctly. The purpose of this site is to provide architectural guidance to enable you to build and deploy world-class systems using Azure.

## Best pracitces

These articles focus on the essential aspects of architecting systems to make optimal use of Azure. They summarize best practice for building cloud solutions.

- **[API Design][APIDesign]** describes the issues that you should consider when designing a web API.

- **[API Implementation][APIImplementation]** focuses on recommended practices for implementing a web API and publishing it to make it available to client applications.

- **[Autoscaling Guidance][AutoscalingGuidance]** summarizes considerations for taking advantage of the elasticity of cloud-hosted environments while easing management overhead by reducing the need for an operator to continually monitor the performance of a system and make decisions about adding or removing resources.

- **[Background Jobs Guidance][BackgroundJobsGuidance]** describes the available options and recommended practices for implementing tasks that should be performed in the background, independently from any foreground or interactive operations.

- **[Content Delivery Network (CDN) Guidance][CDNGuidance]** provides general guidance and good practice for using the CDN to minimize the load on your applications, and maximize availability and performance.

- **[Caching Guidance][CachingGuidance]** summarizes how to use caching with Azure applications and services to improve the performance and scalability of a system.

- **[Data Partitioning Guidance][DataPartitioningGuidance]** describes strategies that you can use to partition data to improve scalability, reduce contention, and optimize performance.

- **[Monitoring and Diagnostics Guidance][MonitoringandDiagnosticsGuidance]** provides guidance on how to track the way in which users utilize your system, trace resource utilization, and generally monitor the health and performance of your system.

- **[Retry General Guidance][RetryGeneralGuidance]** covers general guidance for transient fault handling in an Azure application.

- **[Retry Service Specific Guidance][RetryServiceSpecificGuidance]** summarizes the retry mechanism features for the majority of Azure services, and includes information to help you use, adapt, or extend the retry mechanism for that service.

- **[Scalability Checklist][ScalabilityChecklist]** summarizes recommended practices for designing and implementing scalable services and handling data management.

- **[Availability Checklist][AvailabilityChecklist]** lists recommended practices for ensuring availability in an Azure application.


> [AZURE.NOTE] See our [Performance Optimization][PerformanceOptimization] guidance exploring how to design systems that are scalable and efficient under load.

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