<properties
	pageTitle="What is Site Recovery? | Microsoft Azure" 
	description="Provides an overview of the Azure Site Recovery service and explains how the service can be deployed." 
	services="site-recovery" 
	documentationCenter="" 
	authors="rayne-wiselman" 
	manager="jwhit" 
	editor=""/>

<tags 
	ms.service="site-recovery" 
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.tgt_pltfrm="na"
	ms.workload="storage-backup-recovery" 
	ms.date="02/22/2016" 
	ms.author="raynew"/>

#  What is Site Recovery?

Welcome to the Azure Site Recovery! Start with this article to get a quick overview of the Site Recovery service and how can contribute to your business continuity and disaster recovery (BCDR) strategy.

Azure has two different deployment models for creating and working with resources: [Resource Manager and classic](../resource-manager-deployment-model.md). This article applies to both models. Microsoft recommends that most new deployments use the Resource Manager model.

## Overview

An important part of your organization's BCDR strategy is figuring out how to keep corporate workloads and apps up and running when planned and unplanned outages occur.

Site Recovery helps do this by orchestrating replication, failover, and recovery of workloads and apps so that they'll be available from a secondary location if your primary location goes down. 

## Why use Site Recovery? 

Here's what Site Recovery can do for your business:

- **Simplify your BCDR strategy**—Site Recovery makes it easy to handle replication, failover and recovery of multiple business workloads and apps from a single location. Site recovery orchestrates replication and failover but doesn't intercept your application data or have any information about it.
- **Provide flexible replication**—Using Site Recovery you can replicate workloads running on Hyper-V virtual machines, VMware virtual machines, and Windows/Linux physical servers. 
- **Easy failover and recovery**—Site Recovery provides test failovers to support disaster recovery drills without affecting production environments. You can also run planned failovers with a zero-data loss for expected outages, or unplanned failovers with minimal data loss (depending on replication frequency) for unexpected disasters. After failover you can failback to your primary sites. Site Recovery provides recovery plans that can include scripts and Azure automation workbooks so that you can customize failover and recovery of multi-tier applications. 
- **Eliminate secondary datacenter**—You can replicate to a secondary on-premises site, or to Azure. Using Azure as a destination for disaster recovery eliminates the cost and complexity maintaining a secondary site, and replicated data is stored in Azure Storage, with all the resilience that provides.
- **Integrate with existing BCDR technologies**—Site Recovery partners with other application BCDR features. For example you can use Site Recovery to protect the SQL Server back end of corporate workloads, including native support for SQL Server AlwaysOn to manage the failover of availability groups. 

## What can I replicate?

Here's a summary of what Site Recovery can replicate.

![On-premises to on-premises](./media/site-recovery-overview/asr-overview-graphic.png)

**REPLICATE** | **REPLICATE FROM** | **REPLICATE TO** | **ARTICLE**
---|---|---|---
Workloads running on VMware VMs | On-premises VMware server | Azure storage | [Deploy](site-recovery-vmware-to-azure-classic.md)
Workloads running on VMware VMs | On-premises VMware server | Secondary VMware site | [Deploy](site-recovery-vmware-to-vmware.md) 
Workloads running on Hyper-V VMs | On-premises Hyper-V host server in VMM cloud | Azure storage | [Deploy](site-recovery-vmm-to-azure.md)
Workloads running on Hyper-V VMs | On-premises Hyper-V host server in VMM cloud | Secondary VMM site | [Deploy](site-recovery-vmm-to-vmm.md)
Workloads running on Hyper-V VMs | On-premises Hyper-V host server in VMM cloud with SAN storage| Secondary VMM site with SAN storage | [Deploy](site-recovery-vmm-san.md)
Workloads running on Hyper-V VMs | On-premises Hyper-V site (no VMM) | Azure storage | [Deploy](site-recovery-hyper-v-site-to-azure.md)
Workloads running on physical Windows/Linux servers | On-premises physical server | Azure storage | [Deploy](site-recovery-vmware-to-azure-classic.md)
Workloads running on physical Windows/Linux servers | On-premises physical server | Secondary datacenter | [Deploy](site-recovery-vmware-to-vmware.md) 


## What workloads can I protect?

Site Recovery can help with application-aware BCDR so that workloads and apps continue to run in a consistent way when outages occur. Site Recovery provides: 

- **Application-consistent snapshots**—Replication using application-consistent snapshots for single or N-tier apps.
**Near-synchronous replication**—Replication frequency as low as 30 seconds for Hyper-V, and continuous replication for VMware.
**Integration with SQL Server AlwaysOn**—You can manage the failover of availability groups in Site Recovery recovery plans. 
- **Flexible recovery plans**— You can create and customize recovery plans with external scripts, manual actions, and Azure Automation runbooks that enable you to recover an entire application stack with a single click.
- **Automation library**—A rich Azure Automation library provides production-ready, application-specific scripts that can be downloaded and integrated with Site Recovery. 
-** Simple network management**—Advanced network management in Site Recovery and Azure simplifies application network requirements, including reserving IP addresses, configuring load-balancers, and integrating Azure Traffic Manager for efficient network switch overs.


## Next steps

- Read more in [What workloads can Site Recovery protect?](site-recovery-workload.md)
- Learn more about Site Recovery architecture in [How does Site Recovery work?](site-recovery-components.md)
 
