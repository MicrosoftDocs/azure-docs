---
title: Disaster recovery overview for Microsoft Azure products and services
description: Disaster recovery overview for Microsoft Azure products and services
author: anaharris-ms
ms.service: reliability
ms.topic: conceptual
ms.date: 08/25/2023
ms.author: anaharris
ms.custom: subject-reliability
---


# What is disaster recovery? 

A disaster is a single, major event with a larger and longer-lasting impact than an application can mitigate through the high availability part of its design. Disaster recovery (DR) is about recovering from high-impact events, such as natural disasters or failed deployments, that result in downtime and data loss. Regardless of the cause, the best remedy for a disaster is a well-defined and tested DR plan and an application design that actively supports DR.  

## Recovery objectives

A complete DR plan must specify the following critical business requirements for each process the application implements: 

- **Recovery Point Objective (RPO)** is the maximum duration of acceptable data loss. RPO is measured in units of time, not volume, such as "30 minutes of data" or "four hours of data." RPO is about limiting and recovering from data loss, not data theft. 

- **Recovery Time Objective (RTO)** is the maximum duration of acceptable downtime, where "downtime" is defined by your specification. For example, if the acceptable downtime duration in a disaster is eight hours, then the RTO is eight hours. 


:::image type="content" source="media/disaster-recovery-rpo-rto.png" alt-text="Screenshot of RTO and RPO durations in hours.":::

Each major process or workload that an application implements should have separate RPO and RTO values by examining disaster-scenario risks and potential recovery strategies. The process of specifying an RPO and RTO effectively creates DR requirements for your application as a result of your unique business concerns (costs, impact, data loss, etc.).

## Design for disaster recovery

Disaster recovery isn't an automatic feature, but must be designed, built, and tested. To support a solid DR strategy, you must build an application with DR in mind from the ground up. Azure offers services, features, and guidance to help you support DR when you create apps.




### Data recovery

During a disaster, there are two main methods of restoring data: backups and replication.


**Backup** restores data to a specific point in time.   By using backup, you can provide simple, secure, and cost-effective solutions to back up and recover your data to the Microsoft Azure cloud. Use [Azure Backup](/azure/backup/backup-overview) to create long-lived, read-only data snapshots for use in recovery.  

**Data Replication** creates real-time or near-real-time copies of live data in multiple data store replicas with minimal data loss in mind. The goal of replication is to keep replicas synchronized with as little latency as possible while maintaining application responsiveness.  Most fully featured database systems and other data-storage products and services include some kind of replication as a tightly integrated feature, due to its functional and performance requirements.  An example of this is [geo-redundant storage (GRS)](/azure/storage/common/storage-redundancy#geo-redundant-storage).

Different replication designs place different priorities on data consistency, performance, and cost. 
    
- *Active* replication requires updates to take place on multiple replicas simultaneously, guaranteeing consistency at the cost of throughput. 
    
- *Passive* replication does synchronization in the background, removing replication as a constraint on application performance, but increasing RPO. 
    
- *Active-active* or *multimaster* replication enables using multiple replicas simultaneously, enabling load balancing at the cost of complicating data consistency. 
    
- *Active-passive* replication reserves replicas for live use during failover only. 
    
>[!NOTE]
>Most fully featured database systems and other data-storage products and services include some kind of replication, such as geo-redundant storage (GRS), due to their functional and performance requirements.   

### Building resilient applications  

Disaster scenarios also commonly result in downtime, whether due to network connectivity problems, datacenter outages, damaged virtual machines (VMs), or corrupted software deployments. In most cases, application recovery involves failover to a separate, working deployment. As a result,it may be necessary to recover processes in another Azure region in the event of a large-scale disaster. Additional considerations may include: recovery locations, number of replicated environments, and how to maintain these environments.

Depending on your application design, you can use several different strategies and Azure features, such as [Azure Site Recovery](/azure/site-recovery/site-recovery-overview), to improve your application's support for process recovery after a disaster. 

## Service-specific disaster recovery features 

Most services that run on Azure platform as a service (PaaS) offerings like [Azure App Service](./reliability-app-service.md) provide features and guidance to support DR. For some scenarios, you can use service-specific features to support fast recovery. For example, Azure SQL Server supports geo-replication for quickly restoring service in another region. Azure App Service has a Backup and Restore feature, and the documentation includes guidance for using Azure Traffic Manager to support routing traffic to a secondary region. 


## Next steps

- [Disaster recovery guidance by service](./disaster-recovery-guidance-overview.md)

- [Cloud Adaption Framework for Azure - Business continuity and disaster recovery](/azure/cloud-adoption-framework/ready/landing-zone/design-area/management-business-continuity-disaster-recovery)