---
title: What is Site Recovery? | Microsoft Docs
description: Provides an overview of the Azure Site Recovery service, and summarizes deployment scenarios.
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: cfreeman
editor: ''

ms.assetid: e9b97b00-0c92-4970-ae92-5166a4d43b68
ms.service: site-recovery
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 06/25/2017
ms.author: raynew

---
# What is Site Recovery?

Welcome to the Azure Site Recovery service! This article provides a quick overview of the service.

Site Recovery is an Azure service that can orchestrate replication for:

- On-premises virtual machines and physical servers to Azure or a secondary site.
- Azure VMs between Azure regions.

Outages are causes by natural events and operational failures. Your organization needs a business continuity and disaster recovery (BCDR) strategy so that data stays safe, apps remain available during such outages. In addition, your BCDR strategy ensures that your business recovers to normal working conditions as soon as possible.

Azure Recovery Services contribute to your BCDR strategy:

- **Site Recovery service**: Site Recovery replicates, fails over workloads running on VMs and physical servers so that they remain available if a primary site goes down. It recovers workloads to the primary site when it's up and running again.
- **Backup service**: In addition, the [Azure Backup](https://docs.microsoft.com/en-us/azure/backup/) service keeps your data safe and recoverable. 
- 

## What does Site Recovery provide?

- **Deploy simple BCDR**—You can set up and manage replication from a single location in the Azure portal.  You can run failovers and failback for single machine, or for multiple machines in a recovery plan.
- **Replicate to the cloud**- You can replicate VMs running in Azure, with replication between Azure regions. You can replicate on-premises VMs and physical servers to Azure. Replication to Azure eliminates the cost and complexity of maintaining a secondary datacenter.
- **Replicate any workload**—You can replicate any workload supported on Azure VMs, on-premises Hyper-V VMs, VMware VMs, and Windows/Linux physical servers.
- **Keep data resilient**—Site recovery orchestrates replication without intercepting application data. Replicated data is stored in Azure storage, with the resilience that provides. When failover occurs, Azure VMs are created based on the replicated data.
- **Meet RTOs and RPOs**—Site Recovery provides continuous replication for Azure VMs and VMware VMs, and replication frequency as low as 30 seconds for Hyper-V. You can reduce recovery time objectives (RTO) with [Azure Traffic Manager](https://azure.microsoft.com/blog/reduce-rto-by-using-azure-traffic-manager-with-azure-site-recovery/) integration.
- **Keep apps consistent**— You can configure recovery points with application-consistent snapshots. Application-consistent snapshots capture disk data, all data in memory, and all transactions in process.
- **Test without disruption**—You can easily run test failovers to support disaster recovery drills, without affecting ongoing replication.
- **Run flexible failovers**—You can run planned failovers for expected outages with zero-data loss, or unplanned failovers with minimal data loss (depending on replication frequency) for unexpected disasters. You can easily fail back to your primary site when it's available again.
- **Create recovery plans**—You can customize and sequence failover and recovery of multi-tier applications on multiple VMs with recovery plans. You group machines within plans, and add scripts and manual actions. Recovery plans can be integrated with Azure automation runbooks.
* **Integrate with existing BCDR technologies**—Site Recovery integrates with other BCDR technologies. For example, you can use Site Recovery to protect the SQL Server backend of corporate workloads, including native support for SQL Server AlwaysOn, to manage the failover of availability groups.
* **Integrate with the automation library**—A rich Azure Automation library provides production-ready, application-specific scripts that can be downloaded and integrated with Site Recovery.
* **Manage network settings**—Site Recovery integrates with Azure for simple application network management, including reserving IP addresses, configuring load-balancers, and integrating Azure Traffic Manager for efficient network switchovers.


## What can I replicate?

**Supported** | **Details**
--- | ---
**What can I replicate?** | Azure VMs between Azure regions (in preview)<br/><br/>  On-premises VMware VMs, Hyper-V VMs, physical servers (Windows and Linux) to Azure<br/<br/> On-premises VMware VMs, Hyper-V VMs, physical servers to a secondary site. For Hyper-V VMs, replication to a secondary site is only supported if Hyper-V hosts are managed by System Center VMM.
**Which regions are supported for Site Recovery?** | [Supported regions](https://azure.microsoft.com/en-us/regions/services/) |
**What operating systems do replicated machines need?** | [Azure VM requirements](site-recovery-support-matrix-azure-to-azure.md#support-for-replicated-machine-os-versions)s<br></br>[VMware VM requirements](site-recovery-support-matrix-to-azure.md#support-for-replicated-machine-os-versions)<br/><br/> For Hyper-V VMs, any [guest OS](https://technet.microsoft.com/en-us/windows-server-docs/compute/hyper-v/supported-windows-guest-operating-systems-for-hyper-v-on-windows) supported by Azure and Hyper-V is supported.<br/><br/> [Physical server requirements](site-recovery-support-matrix-to-azure.md#support-for-replicated-machine-os-versions)
**What VMware servers/hosts do I need?** | VMware VMs can be located on [supported vSphere hosts/vCenter servers](site-recovery-support-matrix-to-azure.md#support-for-datacenter-management-servers)
**What workloads can I replicate** | You can replicate any workload running on a supported replication machine. In addition, the Site Recovery team have performed app-specific testing for a [number of apps](site-recovery-workload.md#workload-summary).


## Which Azure portal?

* Site Recovery can be deployed in the [Azure portal](https://portal.azure.com).
* In the Azure classic portal, you can manage Site Recovery with the classic services management model.
- The classic portal should only be used to maintain existing Site Recovery deployments. You can't create new vaults in the classic portal.

## Next steps
* Learn more about [replicating Azure virtual machines] (site-recovery-azure-to-azure.md)
* Read more about [workload support](site-recovery-workload.md)
* Learn more about [Site Recovery architecture and components](site-recovery-components.md)
