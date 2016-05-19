<properties
   pageTitle="Resiliency technical guidance index | Microsoft Azure"
   description="Index of technical articles on understanding and designing resilient, highly available, fault tolerant applications as well as planning for disaster recovery and business continuity"
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
   ms.date="05/13/2016"
   ms.author="patw;jroth;aglick"/>

#Azure resiliency technical guidance

##Introduction
Meeting high availability and disaster recovery requirements requires two types of knowledge: 1) detailed technical understanding of a cloud platform’s capabilities and 2) how to properly architect a distributed service. This series of articles covers the former - the capabilities and limitations of the Azure platform with respect to resiliency (sometimes refered to as business continuity). If you are interested in the later, please see the article series focused on [Disaster recovery and high availability for Azure applications](https://aka.ms/drtechguide). While this article series touches on architecture and design patterns, that is not the core focus of this series. The reader should consult the material in the [additional resources](#additional-resources) section for design guidance.

The information is organized into the following articles:
##[Recovery from local failures](./resiliency-technical-guidance-recovery-local-failures.md)
Physical hardware (for example drives, servers, and network devices) can all fail and resources can be exhausted when load spikes. This section describes the capabilities Azure provides to maintain high availability under these conditions.

##[Recovery from an Azure region-wide service disruption](./resiliency-technical-guidance-recovery-loss-azure-region.md)
Widespread failures are rare, but theoretically possible. Entire regions can become isolated due to network failures, or be physically damaged due to natural disasters. This section explains how to use Azure’s capabilities to create applications that span geographically diverse regions.

##[Recovery from on-premises to Azure](./resiliency-technical-guidance-recovery-on-premises-azure.md)
The cloud significantly alters the economics of disaster recovery, making it possible for organizations to use Azure to establish a second site for recovery. This can be done at a fraction of the cost of building and maintaining a secondary datacenter. This section explains the capabilities Azure provides for extending an on-premises datacenter to the cloud.

##[Recovery from data corruption or accidental deletion](./resiliency-technical-guidance-recovery-data-corruption.md)
Applications can have bugs which corrupt data and operators can incorrectly delete important data. This section explains what Azure provides for backing up data and restoring to a previous point it time.

##Additional resources

###[Azure business continuity technical guidance](./resiliency-technical-guidance.md)
A details listing of concepts and best practices for achieving business continuity and resiliency with Microsoft Azure for your on-premises, hybrid, and public cloud applications.

###[Disaster Recovery and High Availability for Azure Applications](./resiliency-disaster-recovery-high-availability-azure-applications.md)
A detailed overview of availability and disaster recovery. It covers the challenge of manual replication for reference and transactional data. The final sections provide summaries of different types of disaster recovery topologies that span Azure regions for the highest level of availability.

###[Business Continuity in Azure SQL Database](../sql-database/sql-database-business-continuity.md)
Focusses exclusively on Azure Azure SQL Database techniques for availability, which primarily centers on backup and restore strategies. If you use Azure SQL Database in your cloud service, you should review this paper and its related resources.

###[High Availability and Disaster Recovery for SQL Server in Azure Virtual Machines](../virtual-machines/virtual-machines-windows-sql-high-availability-dr.md)
Discusses the availability options open to you when you use Infrastructure-as-a-Service (IaaS) to host your database services. It discusses AlwaysOn Availability Groups, Database Mirroring, Log Shipping, and Backup/Restore. Note that there are also several tutorials in the same section that show how to use these techniques.

###[Best Practices for the Design of Large-Scale Services on Azure Cloud Services](https://azure.microsoft.com//blog/best-practices-for-designing-large-scale-services-on-windows-azure/)
Focuses on developing highly scalable cloud architectures. Many of the techniques that you employ to improve scalability also improve availability. Also, if your application can not scale under increased load, then scalability becomes an availability issue.

###[Backup and Restore for SQL Server in Azure Virtual Machines](../virtual-machines/virtual-machines-windows-sql-backup-recovery.md)
Technical guidance on how to backup and restore Microsoft SQL Server running on Azure Virtual Machines.

###[Failsafe: Guidance for Resilient Cloud Architectures](https://channel9.msdn.com/Series/FailSafe)
Guidance for building resilient cloud architectures, guidance for implementing those architectures on Microsoft technologies, and recipes for implementing these architectures for specific scenarios.

##Next steps
This article is part of a series focused on Azure [resiliency technical guidance](./resiliency-technical-guidance.md). If you are interested in reading other articles in this series; please start with the next article titled [Recovery from local failures](./resiliency-technical-guidance-recovery-local-failures.md).
