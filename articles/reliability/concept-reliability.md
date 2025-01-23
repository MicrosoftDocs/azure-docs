---
title: Overview of reliability
description: Get an overvview of reliability concepts such as availability zones, regions.
author: anaharris-ms
ms.topic: overview
ms.date: 01/23/2025
ms.author: anaharris
ms.service: azure
ms.custom: subject-reliability
CustomerIntent: As a cloud architect/engineer, I want to learn about Azure Reliability.
---

# What is Reliability?

Reliability is a key concept in cloud computing, and refers to the ability of a workload to perform at expectation and in accordance with business continuity requirements. In Azure, reliability is achieved through a combination of factors, including the the design of the platform itself,  its services, the architecture of applications, and the implementation of best practices. 

Primarily, the reliability of a workload is defined by its *resiliency*, which is a workload's ability to recover from possible faults or outages and still "just work". Azure offers a number of resiliency features such as availability zones, multi-region support, data replication, and backup and restore capabilities. These features must be considered when designing a workload to meet its business continuity requirements.

While resiliency is the primary way you can ensure a reliable workload, you also can consider other aspects of workflow design such as:

- Operational Excellence, 

- Security,

- Performance Efficiency, 

- Cost Optimization, 



## Business continuity, high availability, and disaster recovery

Business continuity planning can be understood as the ongoing process of risk management through high availability and disaster recovery design. 

When considering business continuity, it's important to understand the following terms:

- *Business continuity* is the state in which a business can continue operations during failures, outages, or disasters. Business continuity requires proactive planning, preparation, and the implementation of resilient systems and processes.

- *High availability* is about designing a solution to be resilient to day-to-day issues and to meet the business needs for availability.

- *Disaster recovery* is about planning how to deal with uncommon risks and the catastrophic outages that can result.

For more information on business continuity and business continuity planning through high availability and disaster recovery design, see [What are business continuity, high availability, and disaster recovery?](./concept-business-continuity-high-availability-disaster-recovery.md)

## Resiliency and shared responsibility

Resiliency defines a workload's ability to be highly available by being able to automatically self-correct and recover from various forms of failures or outages. Although Azure services are built to be resilient to common failures, the resiliency of your workload depends on how you have designed your business continuity plan to meet your business needs. Some plans may consider certain failure risks to be unimportant, while others may consider them critical.

In the Azure public cloud platform, resiliency is a shared responsibility between Microsoft and you. Because there are different levels of resiliency in each workload that you design and deploy, it's important that you understand who has primary responsibility for each one of those levels from a resiliency perspective. To better understand how shared responsibility works, especially when confronting an outage or disaster, see [Shared responsibility for resiliency](concept-shared-responsibility.md).


## Azure regions

Azure provides over 60 regions globally, that are located across many different geographies. Each region is a set of physical facilities that include datacenters and networking infrastructure. All regions may be divided into geographical areas called geographies. Each geography is a data residency boundary, and may contain one or more regions.

- For more information on Azure regions, see [What are Azure regions](./regions-overview.md).
- To learn about paired and nonpaired regions, including lists of region pairs and nonpaired regions, see [Azure region pairs and nonpaired regions](./regions-paired.md). 
- To see the list of services that are deployed to Azure regions, see [Product Availability by Region](/explore/global-infrastructure/products-by-region/table) 


## Azure availability zones

Many Azure regions provide availability zones, which are separated groups of datacenters within a region. Availability zones are close enough to have low-latency connections to other availability zones, but are far enough apart to reduce the likelihood that more than one will be affected by local outages or weather. Availability zones have independent power, cooling, and networking infrastructure. They're designed so that if one zone experiences an outage, then regional services, capacity, and high availability are supported by the remaining zones. 

- For more information on availability zones, see [What are availability zones?](./availability-zones-overview.md).
- To view which services support availability zones, see [Azure services with availability zone support](./availability-zones-service-support.md)
- To view which regions support availability zones, see [Azure regions with availability zone support](./availability-zones-region-support.md).
- To learn how to approach a migration to availability zone support, see [Azure availability zone migration baseline](availability-zones-baseline.md).

## Azure reliability guides by service

Azure provides a set of service specific reliability guidance that can help you design and implement a reliable workload. Each service has its own unique characteristics, and the guidance can help you understand how to best use the service to meet your business needs. Each guide may contain the following sections, depending on which reliability features it supports:

Each reliability service guide generally contains information on how the service supports:

- *Availability zones* such as zonal or zone-redundant options, traffic routing and data replication between zones, zone-down experience, capacity planning, failback, and how to configure for availability zone support.
- *Multi-region support* such as how to configure multi-region or geo-disaster support, traffic routing and data replication between regions, region-down experience, failover and failback support, alternative multi-region support.
- *Backup support* such as who controls backups, where they are stored,how they can be recovered, and whether they are accessible only within a region or across regions.

For more information and a list of reliability service guides, see [Reliability guides by service](./reliability-guidance-overview.md).


## Related content

- For service specific guides on availability zone support and disaster recovery, see [Reliability guidance](./reliability-guidance-overview.md).
- For service migration guides to availability zone support, see [Availability zone migration guidance](./availability-zones-migration-overview.md).
- [Availability of service by category](availability-service-by-category.md)
- [Build solutions for high availability using availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability)
- [What are Azure regions and availability zones?](availability-zones-overview.md)
- [Cross-region replication in Azure | Microsoft Learn](./cross-region-replication-azure.md)
- [Training: Describe high availability and disaster recovery strategies](/training/modules/describe-high-availability-disaster-recovery-strategies/) 
