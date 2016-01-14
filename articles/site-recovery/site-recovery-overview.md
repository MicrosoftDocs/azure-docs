<properties
	pageTitle="What is Site Recovery? | Microsoft Azure" 
	description="Azure Site Recovery coordinates the replication, failover and recovery of virtual machines and physical servers located on on-premises to Azure or to a secondary on-premises site." 
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
	ms.date="12/14/2015" 
	ms.author="raynew"/>

#  What is Site Recovery?

Site Recovery is an Azure service that contributes to your business continuity and disaster recovery (BCDR) strategy by orchestrating replication of your on-premises servers and virtual machines to a secondary on-premises datacenter, or to Azure. Site Recovery handles the replication, and you can kick off failover and recovery with a simple click. Read through a list of common questions in the [FAQ](site-recovery-faq.md)


## Why use Site Recovery? 

- **Simpler BCDR story**-Site Recovery makes it easy to handle replication, failover and recovery for your on-premises workloads and applications.
- **Flexible replication**-You can replicate on-premises servers, Hyper-V virtual machines, and VMware virtual machines.  Site Recovery uses smart replication, replicating only data blocks and not the entire VHD for the initial replication. For ongoing replication only delta changes are replicated. Site Recovery supports offline data transfer and works with WAN optimizers. 
- **Eliminate the need for secondary datacenter**-Site Recovery can automate replication between datacenters, but it also provides the opportunity to forgo a secondary on-site location by replicating to Azure. Replicated data is stored in Azure Storage, with all the resilience that provides.


## Deployment scenarios

This table summarizes the replication scenarios supported by Site Recovery.

**REPLICATE** | **REPLICATE FROM** | **REPLICATE TO** | **ARTICLE**
---|---|---|---
VMware virtual machines | On-premises VMware server | Azure storage | [Deploy](site-recovery-vmware-to-azure-classic.md)
Physical Windows/Linux server | On-premises physical server | Azure storage | [Deploy](site-recovery-vmware-to-azure-classic.md)
Hyper-V virtual machines | On-premises Hyper-V host server in VMM cloud | Azure storage | [Deploy](site-recovery-vmm-to-azure.md)
Hyper-V virtual machines | On-premises Hyper-V site (one or more Hyper-V host servers) | Azure storage | [Deploy](site-recovery-hyper-v-site-to-azure.md)
On-premises Hyper-V virtual machines| On-premises Hyper-V host server in VMM cloud | On-premises Hyper-V host server in VMM cloud in secondary datacenter | [Deploy](site-recovery-vmm-to-vmm.md)
Hyper-V virtual machines | On-premises Hyper-V host server in VMM cloud with SAN storage| On-premises Hyper-V host server in VMM cloud with SAN storage in secondary datacenter | [Deploy](site-recovery-vmm-san.md)
VMware virtual machines | On-premises VMware server | Secondary datacenter running VMware | [Deploy](site-recovery-vmware-to-vmware.md) 
Physical Windows/Linux server | On-premises physical server | Secondary datacenter | [Deploy](site-recovery-vmware-to-vmware.md) 

These are summarized in the following diagrams.

![On-premises to on-premises](./media/site-recovery-overview/asr-overview-graphic.png)

## What workloads can I protect?

Site Recovery helps you with your appliance-aware business continuity. You can use Site Recovery to orchestrate disaster recovery for Windows and third-party apps. This application-aware protection provides:


- Near-synchronous replication with RPOs as low as 30 seconds for Hyper-V, and continuous replication for VMware,  to meet the needs of most critical applications.
- Application-consistent snapshots for single or N-tier applications
- Integrate with SQL Server AlwaysOn, partner with other application-level replication technologies  including Active Directory replication, Exchange DAGS, and Oracle Data Guard.
- Flexible recovery plans that enable you to recover an entire application stack with a single click, and include external scripts or manual actions. 
- Advanced network management in Site Recovery and Azure simplifies network requirements for an app, including reserving IP addresses, configuring load-balancers, or integration of Azure Traffic Manager for low RTO network switchovers.
- A rich automation library that provides production-ready, application specific scripts that can be downloaded and integrated with Site Recovery.  


Read more in  [What workloads can Site Recovery protect?](site-recovery-workload.md).


## Next steps

After you're finished this overview [learn more](site-recovery-components.md) about Site Recovery architecture. 
 
