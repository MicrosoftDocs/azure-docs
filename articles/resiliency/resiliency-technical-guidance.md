<properties
   pageTitle="Resiliency technical guidance index | Microsoft Azure"
   description="Index of technical articles on understanding and designing resilient, highly available, fault-tolerant applications, as well as planning for disaster recovery and business continuity"
   services=""
   documentationCenter="na"
   authors="adamglick"
   manager="hongfeig"
   editor=""/>

<tags
   ms.service="resiliency"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="08/01/2016"
   ms.author="aglick"/>

#Azure resiliency technical guidance

##Introduction

Meeting high availability and disaster recovery requirements requires two types of knowledge:

- Detailed technical understanding of a cloud platform’s capabilities
- Knowledge of how to properly architect a distributed service

This series of articles covers the former: the capabilities and limitations of the Azure platform with respect to resiliency (sometimes called business continuity). If you're interested in the latter, please see the article series focused on [disaster recovery and high availability for Azure applications](https://aka.ms/drtechguide). Although this article series touches on architecture and design patterns, that's not the focus of the series. For design guidance, you can consult the material in the [Additional resources](#additional-resources) section.

The information is organized into the following articles:

- [Recovery from local failures](resiliency-technical-guidance-recovery-local-failures.md).
Physical hardware (for example, drives, servers, and network devices) can fail. Resources can be exhausted when load spikes. This article describes the capabilities that Azure provides to maintain high availability under these conditions.

- [Recovery from an Azure region-wide service disruption](resiliency-technical-guidance-recovery-loss-azure-region.md).
Widespread failures are rare, but they are theoretically possible. Entire regions can become isolated due to network failures, or they can be physically damaged from natural disasters. This article explains how to use Azure to create applications that span geographically diverse regions.

- [Recovery from on-premises to Azure](resiliency-technical-guidance-recovery-on-premises-azure.md).
The cloud significantly alters the economics of disaster recovery, enabling organizations to use Azure to establish a second site for recovery. You can do this at a fraction of the cost of building and maintaining a secondary datacenter. This article explains the capabilities that Azure provides for extending an on-premises datacenter to the cloud.

- [Recovery from data corruption or accidental deletion](resiliency-technical-guidance-recovery-data-corruption.md).
Applications can have bugs that corrupt data. Operators can incorrectly delete important data. This article explains what Azure provides for backing up data and restoring to a previous point it time.

##Additional resources

- [Disaster recovery and high availability for applications built on Microsoft Azure](resiliency-disaster-recovery-high-availability-azure-applications.md).
This article is a detailed overview of availability and disaster recovery. It covers the challenge of manual replication for reference and transactional data. The final sections provide summaries of different types of disaster recovery topologies that span Azure regions for the highest level of availability.

- [High-availability checklist](resiliency-high-availability-checklist.md).
This article is a list of features, services, and designs that can help you increase the resiliency and availability of your application.

- [Microsoft Azure service resiliency guidance](resiliency-service-guidance-index.md).
This article is an index of Azure services and provides links to both disaster recovery guidance and design guidance.

- [Overview: Cloud business continuity and database disaster recovery with SQL Database](../sql-database/sql-database-business-continuity.md).
This article provides Azure SQL Database techniques for availability. It primarily centers on backup and restore strategies. If you use Azure SQL Database in your cloud service, you should review this paper and its related resources.

- [High availability and disaster recovery for SQL Server in Azure Virtual Machines](../virtual-machines/virtual-machines-windows-sql-high-availability-dr.md).
This article discusses availability options that you can explore when you use infrastructure as a service (IaaS) to host your database services. It discusses AlwaysOn Availability Groups, database mirroring, log shipping, and backup/restore. Several tutorials show how to use these techniques.

- [Best practices for designing large-scale services on Azure Cloud Services](https://azure.microsoft.com//blog/best-practices-for-designing-large-scale-services-on-windows-azure/).
This article focuses on developing highly scalable cloud architectures. Many of the techniques that you employ to improve scalability also improve availability. Also, if your application can't scale under increased load, scalability becomes an availability issue.

- [Backup and restore for SQL Server in Azure Virtual Machines](../virtual-machines/virtual-machines-windows-sql-backup-recovery.md).
This article provides technical guidance on how to back up and restore Microsoft SQL Server running on Azure Virtual Machines.

- [Failsafe: Guidance for resilient cloud architectures](https://channel9.msdn.com/Series/FailSafe).
This article provides guidance for building resilient cloud architectures, guidance for implementing those architectures on Microsoft technologies, and recipes for implementing these architectures for specific scenarios.

- [Technical case study: Using cloud technologies to improve disaster recovery](https://www.microsoft.com/itshowcase/Article/Content/737/Using-cloud-technologies-to-improve-disaster-recovery).
This case study shows how Microsoft IT used Azure to improve disaster recovery.

##Next steps

This article is part of a series focused on technical guidance for Azure resiliency. If you're interested in reading other articles in this series, you can start with [Recovery from local failures](resiliency-technical-guidance-recovery-local-failures.md).
