<properties
	pageTitle="What is Site Recovery? | Microsoft Azure"
	description="Provides an overview of the Azure Site Recovery service, and summarizes deployment scenarios."
	services="site-recovery"
	documentationCenter=""
	authors="rayne-wiselman"
	manager="cfreeman"
	editor=""/>

<tags
	ms.service="site-recovery"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.tgt_pltfrm="na"
	ms.workload="storage-backup-recovery"
	ms.date="10/13/2016"
	ms.author="raynew"/>

#  What is Site Recovery?

Welcome to the Azure Site Recovery! This article provides a quick overview of the Site Recovery service, and how it contributes to your  business.

Your organization needs a business continuity and disaster recovery (BCDR) strategy that keep apps, workloads, and data safe and available during planned and unplanned downtime, and recovers to normal working conditions as soon as possible. Site Recovery is an Azure service that contributes to this strategy.

Site Recovery orchestrates replication of workloads running on-premises physical servers, and virtual machines. You can replicate servers and VMs from a primary datacenter to the cloud (Azure), or to a secondary datacenter. When outages occur in the primary site, you fail over to the secondary site to keep apps and workloads accessible and available. You fail back to your primary location when it returns to normal operations.

## Site Recovery in the Azure portal

Azure has two different [deployment models](../resource-manager-deployment-model.md) for creating and working with resources. The Azure Resource Manager model and the classic services management model. Azure also has two portals – the [Azure classic portal](https://manage.windowsazure.com/) that supports the classic deployment model, and the [Azure portal](https://portal.azure.com) with support for both the classic and Resource Manager models.

- Site Recovery is available in both the classic portal and the Azure portal.
- In the Azure classic portal, you can support Site Recovery with the classic services management model.
- In the Azure portal, you can support the classic model or Resource Manager deployments. 

The information in this article applies to both classic and Azure portal deployments. Differences are noted where applicable.


## Why deploy Site Recovery?

Here's what Site Recovery can do for your business:

- **Simplify BCDR**—You can handle replication, failover and recovery of multiple workloads in a single location in the Azure portal. Site recovery orchestrates replication and failover but doesn't intercept your application data or have any information about it.
- **Provide flexible replication**—Using Site Recovery, you can replicate workloads running on supported Hyper-V VMs, VMware VMs, and Windows/Linux physical servers.
- **Perform easy replication testing**—Site Recovery provides test failovers to support disaster recovery drills, without affecting production environments.
- **Fail over and recover**— You can run planned failovers for expected outages with a zero-data loss, or unplanned failovers with minimal data loss (depending on replication frequency) for unexpected disasters. After failover, you can failback to your primary sites. Site Recovery provides recovery plans that can include scripts and Azure automation workbooks, so that you can customize failover and recovery of multi-tier applications.
- **Eliminate a secondary datacenter**—You can replicate workloads to Azure, rather than to a secondary site. This eliminates the cost and complexity maintaining a secondary datacenter. Replicated data is stored in Azure Storage, with all the resilience that provides. VMs are created with the replicated data when failover occurs.
- **Integrate with existing BCDR technologies**—Site Recovery integrates with other BCDR features. For example, you can use Site Recovery to protect the SQL Server backend of corporate workloads, including native support for SQL Server AlwaysOn, to manage the failover of availability groups.

## What can I replicate?

Here's a summary of what you can replicate using Site Recovery.

![On-premises to on-premises](./media/site-recovery-overview/asr-overview-graphic.png)

**REPLICATE** | **REPLICATE TO** 
---|---
Workloads running on on-premises VMware VMs | [Azure](site-recovery-vmware-to-azure-classic.md)<br/><br/> [Secondary site](site-recovery-vmware-to-vmware.md)
Workloads running on on-premises Hyper-V VMs managed in VMM clouds  | [Azure](site-recovery-vmm-to-azure.md)<br/><br/> [Secondary site](site-recovery-vmm-to-vmm.md) 
Workload running on on-premises Hyper-V VMs managed in VMM clouds, with SAN storage|  [Secondary site](site-recovery-vmm-san.md)
Workloads running on on-premises Hyper-V VMs, without VMM | [Azure](site-recovery-hyper-v-site-to-azure.md)
Workloads running on on-premises physical Windows/Linux servers | [Azure](site-recovery-vmware-to-azure-classic.md)<br/><br/> [Secondary site](site-recovery-vmware-to-vmware.md)


## What workloads can I protect?

Site Recovery enables application-aware BCDR, so that workloads and apps continue to run in a consistent way when outages occur. Site Recovery provides:

- **Application-consistent snapshots**—Machines replicate using application-consistent snapshots, for single or multiple-tier apps. In addition to capturing disk data, application-consistent snapshots capture capture all data in memory and all transactions in process.
- **Near-synchronous replication**—Site Recovery provides replication frequency is as low as 30 seconds for Hyper-V, and continuous replication for VMware.
- **Flexible recovery plans**— You can create and customize recovery plans with external scripts, and manual actions. Integration with Azure Automation runbooks enable you to recover an entire application stack with a single click.
- **Integration with SQL Server AlwaysOn**—You can manage the failover of availability groups in Site Recovery recovery plans.
- **Automation library**—A rich Azure Automation library provides production-ready, application-specific scripts that can be downloaded and integrated with Site Recovery.
- **Simple network management**—Advanced network management in Site Recovery and Azure simplifies application network requirements, including reserving IP addresses, configuring load-balancers, and integrating Azure Traffic Manager for efficient network switchovers.


## Next steps

- Read more in [What workloads can Site Recovery protect?](site-recovery-workload.md)
- Learn more about Site Recovery architecture in [How does Site Recovery work?](site-recovery-components.md)
 
