---
title: About Azure Site Recovery
description: Provides an overview of the Azure Site Recovery service, and summarizes disaster recovery and migration deployment scenarios.
ms.topic: overview
ms.date: 03/17/2020
ms.custom: MVC
---

# About Site Recovery

Welcome to the Azure Site Recovery service! This article provides a quick service overview.

As an organization you need to adopt a business continuity and disaster recovery (BCDR) strategy that keeps your data safe, and your apps and workloads online, when planned and unplanned outages occur.

Azure Recovery Services contributes to your BCDR strategy:

- **Site Recovery service**: Site Recovery helps ensure business continuity by keeping business apps and workloads running during outages. Site Recovery replicates workloads running on physical and virtual machines (VMs) from a primary site to a secondary location. When an outage occurs at your primary site, you fail over to secondary location, and access apps from there. After the primary location is running again, you can fail back to it.
- **Backup service**: The [Azure Backup](/azure/backup/) service keeps your data safe and recoverable.

Site Recovery can manage replication for:

- Azure VMs replicating between Azure regions.
- On-premises VMs, Azure Stack VMs, and physical servers.

## What does Site Recovery provide?

**Feature** | **Details**
--- | ---
**Simple BCDR solution** | Using Site Recovery, you can set up and manage replication, failover, and failback from a single location in the Azure portal.
**Azure VM replication** | You can set up disaster recovery of Azure VMs from a primary region to a secondary region.
**On-premises VM replication** | You can replicate on-premises VMs and physical servers to Azure, or to a secondary on-premises datacenter. Replication to Azure eliminates the cost and complexity of maintaining a secondary datacenter.
**Workload replication** | Replicate any workload running on supported Azure VMs, on-premises Hyper-V and VMware VMs, and Windows/Linux physical servers.
**Data resilience** | Site Recovery orchestrates replication without intercepting application data. When you replicate to Azure, data is stored in Azure storage, with the resilience that provides. When failover occurs, Azure VMs are created, based on the replicated data.
**RTO and RPO targets** | Keep recovery time objectives (RTO) and recovery point objectives (RPO) within organizational limits. Site Recovery provides continuous replication for Azure VMs and VMware VMs, and replication frequency as low as 30 seconds for Hyper-V. You can reduce RTO further by integrating with [Azure Traffic Manager](https://azure.microsoft.com/blog/reduce-rto-by-using-azure-traffic-manager-with-azure-site-recovery/).
**Keep apps consistent over failover** | You can replicate using recovery points with application-consistent snapshots. These snapshots capture disk data, all data in memory, and all transactions in process.
**Testing without disruption** | You can easily run disaster recovery drills, without affecting ongoing replication.
**Flexible failovers** | You can run planned failovers for expected outages with zero-data loss. Or, unplanned failovers with minimal data loss, depending on replication frequency, for unexpected disasters. You can easily fail back to your primary site when it's available again.
**Customized recovery plans** | Using recovery plans, you can customize and sequence the failover and recovery of multi-tier applications running on multiple VMs. You group machines together in a recovery plan, and optionally add scripts and manual actions. Recovery plans can be integrated with Azure automation runbooks.
**BCDR integration** | Site Recovery integrates with other BCDR technologies. For example, you can use Site Recovery to protect the SQL Server backend of corporate workloads, with native support for SQL Server AlwaysOn, to manage the failover of availability groups.
**Azure automation integration** | A rich Azure Automation library provides production-ready, application-specific scripts that can be downloaded and integrated with Site Recovery.
**Network integration** | Site Recovery integrates with Azure for application network management. For example, to reserve IP addresses, configure load-balancers, and use Azure Traffic Manager for efficient network switchovers.

## What can I replicate?

**Supported** | **Details**
--- | ---
**Replication scenarios** | Replicate Azure VMs from one Azure region to another.<br/><br/>  Replicate on-premises VMware VMs, Hyper-V VMs, physical servers (Windows and Linux), Azure Stack VMs to Azure.<br/><br/> Replicate AWS Windows instances to Azure.<br/><br/> Replicate on-premises VMware VMs, Hyper-V VMs managed by System Center VMM, and physical servers to a secondary site.
**Regions** | Review [supported regions](https://azure.microsoft.com/regions/services/) for Site Recovery. |
**Replicated machines** | Review the replication requirements for [Azure VM](azure-to-azure-support-matrix.md#replicated-machine-operating-systems) replication, [on-premises VMware VMs and physical servers](vmware-physical-azure-support-matrix.md#replicated-machines), and [on-premises Hyper-V VMs](hyper-v-azure-support-matrix.md#replicated-vms).
**Workloads** | You can replicate any workload running on a machine that's supported for replication. And, the Site Recovery team did app-specific tests for a [number of apps](site-recovery-workload.md#workload-summary).

## Next steps

- Read more about [workload support](site-recovery-workload.md).
- Get started with [Azure VM replication between regions](azure-to-azure-quickstart.md).
