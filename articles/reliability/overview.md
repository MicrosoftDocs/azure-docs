---
title: Azure reliability documentation
description: Overview of Azure reliability documentation, including platform capabilities, the shared responsibility model, and how each Azure service supports reliability.
author: anaharris-ms
ms.topic: overview
ms.date: 01/28/2025
ms.author: anaharris
ms.service: azure
ms.custom: subject-reliability
CustomerIntent: As a cloud architect/engineer, I want to learn about Azure Reliability.
---

# Azure reliability documentation

The Azure reliability documentation provides information on what reliability means in a cloud platform, how Azure cloud supports reliability, and in what way each Azure service can be configured to support a reliable solution. 

The documentation is organized into the following sections:

- **Azure reliability guides by service.** Learn how each Azure service supports reliability, including availability zones, multi-region support, and backup support.
- **Reliability fundamentals.** Learn about the concepts of reliability, business continuity, high availability, and disaster recovery. Understand how shared responsibility works between Microsoft and you.
- **Azure regions.** Learn about Azure regions, paired and nonpaired regions, and the list of services that are deployed to Azure regions.
- **Azure availability zones.** Learn about availability zones, including how they support high availability and disaster recovery, and which Azure services and regions support availability zones.

## What is reliability?

Reliability refers to the ability of a workload to perform consistently at the expected level, and in accordance with business continuity requirements. Reliability is a key concept in cloud computing. In Azure, reliability is achieved through a combination of factors, including the design of the platform itself, its services, the architecture of your applications, and the implementation of best practices.

A key approach to achieve reliability in a workload is *resiliency*, which is a workload's ability to withstand and recover from faults and outages. Azure offers a number of resiliency features such as availability zones, multi-region support, data replication, and backup and restore capabilities. These features must be considered when designing a workload to meet its business continuity requirements. 

The documentation is organized into the following sections:

## Azure reliability guides by service

Each Azure service has its own unique reliability characteristics. Azure provides a set of service-specific reliability guides that can help you design and implement a reliable workload, and the guidance can help you understand how to best use the service to meet your business needs. Each guide may contain the following sections, depending on which reliability features it supports:

Each reliability service guide generally contains information on how the service supports a range of reliability capabilities, including:

- *Availability zones* such as zonal and zone-redundant deployment options, traffic routing and data replication between zones, what happens if a zone experiences an outage, failback, and how to configure your resources for availability zone support.
- *Multi-region support* such as how to configure multi-region or geo-disaster recovery support, traffic routing and data replication between regions, region-down experience, and failover and failback support. For some services that don't have native multi-region support, the guides present alternative multi-region deployment approaches to consider.
- *Backup support* such as Microsoft-controlled and customer-controlled backup capabilities, where they are stored, how they can be recovered, and whether they are accessible only within a region or across regions.

For more information and a list of reliability service guides, see [Reliability guides by service](./reliability-guidance-overview.md).

> [!TIP]
> Reliability also incorporates other elements of your solution design too, including how you deploy changes safely, how you manage your performance to avoid downtime due to high load, and how you test and validate each part of your solution. To learn more, see the [Azure Well-Architected Framework](/azure/well-architected).

## Reliability fundamentals

The reliability fundamentals section provides an overview of the key concepts and principles that underpin reliability in Azure. 

### Business continuity, high availability, and disaster recovery

Business continuity planning can be understood as the ongoing process of risk management through high availability and disaster recovery design. 

When considering business continuity, it's important to understand the following terms:

- *Business continuity* is the state in which a business can continue operations during failures, outages, or disasters. Business continuity requires proactive planning, preparation, and the implementation of resilient systems and processes.

- *High availability* is about designing a solution to meet the business needs for availability, and being resilient to day-to-day issues that might affect the uptime requirements.

- *Disaster recovery* is about planning how to deal with uncommon risks and the catastrophic outages that can result.

For more information on business continuity and business continuity planning through high availability and disaster recovery design, see [What are business continuity, high availability, and disaster recovery?](./concept-business-continuity-high-availability-disaster-recovery.md)

### Shared responsibility

Resiliency defines a workload's ability to automatically self-correct and recover from various forms of failures or outages. Azure services are built to be resilient to many common failures, and each product provides a service level agreement (SLA) that describes the uptime you can expect. However, the overall resiliency of your workload depends on how you have designed your solution to meet your business needs. Some business continuity plans may consider certain failure risks to be unimportant, while others may consider them critical.

In the Azure public cloud platform, resiliency is a shared responsibility between Microsoft and you. Because there are different levels of resiliency in each workload that you design and deploy, it's important that you understand who has primary responsibility for each one of those levels from a resiliency perspective. To better understand how shared responsibility works, especially when confronting an outage or disaster, see [Shared responsibility for resiliency](concept-shared-responsibility.md).

## Azure regions

Azure provides over 60 regions globally, that are located across many different geographies. Each region is a set of physical facilities that include datacenters and networking infrastructure. All regions may be divided into geographical areas called geographies. Each geography is a data residency boundary, and may contain one or more regions.

- For more information on Azure regions, see [What are Azure regions](./regions-overview.md).
- To learn about paired and nonpaired regions, including lists of region pairs and nonpaired regions, see [Azure region pairs and nonpaired regions](./regions-paired.md). 
- To see the list of services that are deployed to Azure regions, see [Product Availability by Region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/table) 

## Azure availability zones

Many Azure regions provide availability zones, which are separated groups of datacenters within a region. Availability zones are close enough to have low-latency connections to other availability zones, but are far enough apart to reduce the likelihood that more than one will be affected by local outages or weather. Availability zones have independent power, cooling, and networking infrastructure. They're designed so that if one zone experiences an outage, then regional services, capacity, and high availability are supported by the remaining zones. 

- For more information on availability zones, see [What are availability zones?](./availability-zones-overview.md).
- To view which regions support availability zones, see [Azure regions with availability zone support](./availability-zones-region-support.md).
- To learn about how each Azure service supports availability zones, see [Azure services with availability zone support](./availability-zones-service-support.md)
- To learn how to approach a migration to availability zone support, see [Azure availability zone migration baseline](availability-zones-baseline.md).

## Related content

- For service specific guides on availability zone support and other reliability capabilities, see [Reliability guidance](./reliability-guidance-overview.md).
- For service migration guides to availability zone support, see [Availability zone migration guidance](./availability-zones-migration-overview.md).
- [Availability of service by category](availability-service-by-category.md)
- [Build solutions for high availability using availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability)
- [What are Azure regions and availability zones?](availability-zones-overview.md)
- [Cross-region replication in Azure | Microsoft Learn](./cross-region-replication-azure.md)
- [Training: Describe high availability and disaster recovery strategies](/training/modules/describe-high-availability-disaster-recovery-strategies/) 
