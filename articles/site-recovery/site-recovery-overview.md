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
ms.date: 06/23/2017
ms.author: raynew

---
# What is Site Recovery?

Welcome to the Azure Site Recovery service! This article provides a quick overview of the service.

Outages are causes by natural events and operational failures. Your organization needs a business continuity and disaster recovery (BCDR) strategy so that, during planned and unplanned downtime, data stays safe, apps remain available, and business recovers to normal working conditions as soon as possible.

Azure Recovery Services contribute to your BCDR strategy. The [Azure Backup](https://docs.microsoft.com/en-us/azure/backup/) service keeps your data safe and recoverable. Site Recovery replicates, fails over, and recovers workloads, so that they remain available when failure occurs.

## What does Site Recovery provide?

- **Disaster recovery in the cloud**— You can replicate and protect VMs running on Azure, using Azure to Azure disaster recovery solution. You can replicate workloads running on VMs and physical servers to Azure, rather than to a secondary site. This eliminates the cost and complexity of maintaining a secondary datacenter.
- **Flexible replication for hybrid environments**—You can replicate any workload supported on Azure VMs, on-premises Hyper-V VMs, VMware VMs, and Windows/Linux physical servers.
- **Migration**—You can use Site Recovery to migrate on-premises and AWS instances to Azure VMs, or to migrate Azure VMs between Azure regions.
- **Simplified BCDR**—You can deploy replication from a single location in the Azure portal.  You can run simple failovers and failback of single and multiple machines.
- **Resilience**—Site recovery orchestrates replication and failover, without intercepting application data. Replicated data is stored in Azure storage, with the resilience that Azure storage provides. When failover occurs, Azure VMs are created based on the replicated data.
- **Replication performance**—Site Recovery provides continuous replication for Azure VMs and VMware VMs, and replication frequency as low as 30 seconds for Hyper-V. You can reduce recovery time objective (RTO) with Site Recovery's automated recovery process, and integration with [Azure Traffic Manager](https://azure.microsoft.com/blog/reduce-rto-by-using-azure-traffic-manager-with-azure-site-recovery/)
- **Application consistency**— You can configure application-consistent snapshots for the recovery points. In addition to capturing disk data, application-consistent snapshots capture all data in memory, and all transactions in process.
- **Testing without disruption**—You can easily run test failovers to support disaster recovery drills, without affecting production environments and the ongoing replication.
- **Flexible failover and recovery**—You can run planned failovers for expected outages with zero-data loss, or unplanned failovers with minimal data loss (depending on replication frequency) for unexpected disasters. You can easily fail back to your primary site when it's available again.
- **Custom recovery plans**—Recovery plans allow you to model and customize failover and recovery of multi-tier applications that are spread over multiple VMs. You order groups within plans, and add scripts and manual actions. Recovery plans can be integrated with Azure automation runbooks.
- **Multi-tier apps**—You can create recovery plans for sequenced failover and recovery of multi-tiered apps. You can group machines in different tiers (for example database, web, app) within a recovery plan, and customize how each group fails over and starts up.
* **Integration with existing BCDR technologies**—Site Recovery integrates with other BCDR technologies. For example, you can use Site Recovery to protect the SQL Server backend of corporate workloads, including native support for SQL Server AlwaysOn, to manage the failover of availability groups.
* **Integration with the automation library**—A rich Azure Automation library provides production-ready, application-specific scripts that can be downloaded and integrated with Site Recovery.
* **Simple network management**—Advanced network management in Site Recovery and Azure simplifies application network requirements, including reserving IP addresses, configuring load-balancers, and integrating Azure Traffic Manager for efficient network switchovers.


## What's supported?

**Supported** | **Details**
--- | ---
**Which regions are supported for Site Recovery?** | [Supported regions](https://azure.microsoft.com/en-us/regions/services/) |
**What can I replicate?** | Azure VMs (in preview), On-premises VMware VMs, Hyper-V VMs, Windows and Linux physical servers.
**What operating systems do replicated machines need?** | [Supported operating systems](site-recovery-support-matrix-azure-to-azure.md#support-for-replicated-machine-os-versions)for Azure VMs<br></br>[Supported operating systems](site-recovery-support-matrix-to-azure.md#support-for-replicated-machine-os-versions) for VMware VMs<br/><br/> For Hyper-V VMs, any [guest OS](https://technet.microsoft.com/en-us/windows-server-docs/compute/hyper-v/supported-windows-guest-operating-systems-for-hyper-v-on-windows) supported by Azure and Hyper-V is supported.<br/><br/> [Operating systems](site-recovery-support-matrix-to-azure.md#support-for-replicated-machine-os-versions) for physical servers
**Where can I replicate to?** | For Azure VMs, you can replicate another Azure region. <br></br> For on-premises machines, you can replicate to Azure storage, or to a secondary datacenter.<br/><br/> 

>[!NOTE]
>
> For Hyper-V, only VMs on Hyper-V hosts managed in System Center VMM clouds can replicate to a secondary datacenter.

**What VMware servers/hosts do I need?** | VMware VMs you want to replicate can be managed by [supported vSphere hosts/vCenter servers](site-recovery-support-matrix-to-azure.md#support-for-datacenter-management-servers)
**What workloads can I replicate** | You can replicate any workload running on a supported replication machine. In addition, the Site Recovery team have performed app-specific testing for a [number of apps](site-recovery-workload.md#workload-summary).


## Which Azure portal?

* Site Recovery can be deployed in the [Azure portal](https://portal.azure.com).
* In the Azure classic portal, you can manage Site Recovery with the classic services management model.
- The classic portal should only be used to maintain existing Site Recovery deployments. You can't create new vaults in the classic portal.

## Next steps
* Learn more about [replicating Azure virtual machines] (site-recovery-azure-to-azure.md)
* Read more about [workload support](site-recovery-workload.md)
* Learn more about [Site Recovery architecture and components](site-recovery-components.md)
