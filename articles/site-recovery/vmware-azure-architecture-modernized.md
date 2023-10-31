---
title: VMware VM disaster recovery architecture in Azure Site Recovery - Modernized
description: This article provides an overview of components and architecture used when setting up disaster recovery of on-premises VMware VMs to Azure with Azure Site Recovery - Modernized
ms.service: site-recovery
ms.topic: conceptual
ms.date: 04/04/2023
ms.author: ankitadutta
author: ankitaduttaMSFT
---

# VMware to Azure disaster recovery architecture - Modernized

This article describes the architecture and processes used when you deploy disaster recovery replication, failover, and recovery of VMware virtual machines (VMs) between an on-premises VMware site and Azure using the Modernized VMware/Physical machine protection experience.

>[!NOTE]
> Ensure you create a new Recovery Services vault for setting up the ASR replication appliance. Don't use an existing vault.

For information about Azure Site Recovery architecture in Classic architecture, see [this article](vmware-azure-architecture.md).


## Architectural components

The following table and graphic provide a high-level view of the components used for VMware VMs/physical machines disaster recovery to Azure.

[![VMware to Azure architecture](./media/vmware-azure-architecture-modernized/architecture-modernized.png)](./media/vmware-azure-architecture-modernized/architecture-modernized.png#lightbox)

**Component** | **Requirement** | **Details**
--- | --- | ---
**Azure** | An Azure subscription, Azure Storage account for cache, Managed Disk, and Azure network. | Replicated data from on-premises VMs is stored in Azure storage. Azure VMs are created with the replicated data when you run a failover from on-premises to Azure. The Azure VMs connect to the Azure virtual network when they're created.
**Azure Site Recovery replication appliance** | 	This is the basic building block of the entire Azure Site Recovery on-premises infrastructure. <br/><br/> All components in the appliance coordinate with the replication appliance. This service oversees all end-to-end Site Recovery activities including monitoring the health of protected machines, data replication, automatic updates, etc. | The appliance hosts various crucial components like:<br/><br/>**Proxy server:** This component acts as a proxy channel between mobility agent and Site Recovery  services in the cloud. It ensures there's no other internet connectivity required from production workloads to generate recovery points.<br/><br/>**Discovered items:** This component gathers information of vCenter and coordinates with Azure Site Recovery management service in the cloud.<br/><br/>**Re-protection server:** This component coordinates between Azure and on-premises machines during reprotect and failback operations.<br/><br/>**Process server:** This component is used for caching, compression of data before being sent to Azure. <br/><br/> [Learn more](switch-replication-appliance-modernized.md) about replication appliance and how to use multiple replication appliances.<br/><br/>**Recovery Service agent:** This component is used for configuring/registering with Site Recovery services, and for monitoring the health of all the components.<br/><br/>**Site Recovery provider:** This component is used for facilitating reprotect. It identifies between alternate location reprotect and original location reprotect for a source machine. <br/><br/> **Replication service:** This component is used for replicating data from source location to Azure.
**VMware servers** | VMware VMs are hosted on on-premises vSphere ESXi servers. We recommend a vCenter server to manage the hosts. | During Site Recovery deployment, you add VMware servers to the Recovery Services vault.
**Replicated machines** | Mobility Service is installed on each VMware VM that you replicate. | We recommend that you allow automatic installation of the Mobility Service. Alternatively, you can install the [service manually](vmware-physical-mobility-service-overview.md#install-the-mobility-service-using-ui-modernized).


## Set up outbound network connectivity

For Site Recovery to work as expected, you need to modify outbound network connectivity to allow your environment to replicate.

> [!NOTE]
> Site Recovery doesn't support using an authentication proxy to control network connectivity.

### Outbound connectivity for URLs

If you're using a URL-based firewall proxy to control outbound connectivity, allow access to these URLs:

| **URL**                  | **Details**                             |
| ------------------------- | -------------------------------------------|
|`portal.azure.com`         | Navigate to the Azure portal.              |
|`*.windows.net `<br>`*.msftauth.net`<br>`*.msauth.net`<br>`*.microsoft.com`<br>`*.live.com `<br>`*.office.com ` | To sign-in to your Azure subscription.  |
|`*.microsoftonline.com `|Create Microsoft Entra apps for the appliance to communicate with Azure Site Recovery. |
|`management.azure.com` |Create Microsoft Entra apps for the appliance to communicate with the Azure Site Recovery service. |
|`*.services.visualstudio.com `|Upload app logs used for internal monitoring. |
|`*.vault.azure.net `|Manage secrets in the Azure Key Vault. Note: Ensure that machines to be replicated have access to this. |
|`aka.ms` |Allow access to "also known as" links. Used for Azure Site Recovery appliance updates. |
|`download.microsoft.com/download` |Allow downloads from Microsoft download. |
|`*.servicebus.windows.net `|Communication between the appliance and the Azure Site Recovery service. |
|`*.discoverysrv.windowsazure.com `|Connect to Azure Site Recovery discovery service URL. |
|`*.hypervrecoverymanager.windowsazure.com `|Connect to Azure Site Recovery micro-service URLs.  |
|`*.blob.core.windows.net `|Upload data to Azure storage, which is used to create target disks. |
|`*.backup.windowsazure.com `|Protection service URL – a microservice used by Azure Site Recovery for processing & creating replicated disks in Azure. |
|`*.prod.migration.windowsazure.com `| To discover your on-premises estate. |


## Replication process

1. When you enable replication for a VM, initial replication to Azure storage begins, using the specified replication policy. Note the following:
    - For VMware VMs, replication is block-level, near-continuous, using the Mobility service agent running on the VM.
    - Any replication policy settings are applied:
        - **RPO threshold**. This setting doesn't affect replication. It helps with monitoring. An event is raised, and optionally an email sent, if the current RPO exceeds the threshold limit that you specify.
        - **Recovery point retention**. This setting specifies how far back in time you want to go when a disruption occurs. Maximum retention is 15 days.
        - **App-consistent snapshots**. App-consistent snapshot can be taken every 1 to 12 hours, depending on your app needs. Snapshots are standard Azure blob snapshots. The Mobility agent running on a VM requests a VSS snapshot in accordance with this setting, and bookmarks that point-in-time as an application consistent point in the replication stream.
        >[!NOTE]
        >High recovery point retention period may have an implication on the storage cost since more recovery points may need to be saved. 
        

2. Traffic replicates to Azure storage public endpoints over the internet. Alternately, you can use Azure ExpressRoute with [Microsoft peering](../expressroute/expressroute-circuit-peerings.md#microsoftpeering). Replicating traffic over a site-to-site virtual private network (VPN) from an on-premises site to Azure is only supported when using [private endpoints](../private-link/private-endpoint-overview.md).
3. Initial replication operation ensures that entire data on the machine at the time of enable replication is sent to Azure. After initial replication finishes, replication of delta changes to Azure begins. Tracked changes for a machine are sent to the process server.
4. Communication happens as follows:

    - VMs communicate with the on-premises appliance on port HTTPS 443 inbound, for replication management.
    - VMs send replication data to the appliance on port HTTPS 9443 inbound. This port can be modified.
    - The appliance receives replication data, optimizes, and encrypts it, and sends it to Azure storage over port 443 outbound.
5. The replication data logs first land in a cache storage account in Azure. These logs are processed, and the data is stored in an Azure Managed Disk (called as *asrseeddisk*). The recovery points are created on this disk.

[![VMware to Azure data flow with ports](./media/vmware-azure-architecture-modernized/architecture-modernized-with-ports.png)](./media/vmware-azure-architecture-modernized/architecture-modernized-with-ports.png#lightbox)

## Resynchronization process

1. At times, during initial replication or while transferring delta changes, there can be network connectivity issues between source machine to process server or between process server to Azure. Either of these can lead to failures in data transfer to Azure momentarily.
2. To avoid data integrity issues, and minimize data transfer costs, Site Recovery marks a machine for resynchronization.
3. A machine can also be marked for resynchronization in situations like following to maintain consistency between source machine and data stored in Azure
    - If a machine undergoes force shutdown
    - If a machine undergoes configurational changes like disk resizing (modifying the size of disk from 2 TB to 4 TB)
4. Resynchronization sends only delta data to Azure. Data transfer between on-premises and Azure by minimized by computing checksums of data between source machine and data stored in Azure.
5. By default, resynchronization is scheduled to run automatically outside office hours. If you don't want to wait for default resynchronization outside hours, you can resynchronize a VM manually. To do this, go to Azure portal, select the VM > **Resynchronize**.
6. If default resynchronization fails outside office hours and a manual intervention is required, then an error is generated on the specific machine in Azure portal. You can resolve the error and trigger the resynchronization manually.
7. After completion of resynchronization, replication of delta changes will resume.

## Replication policy

When you enable Azure VM replication, by default Site Recovery creates a new replication policy with the default settings summarized in the table.

**Policy setting** | **Details** | **Default**
--- | --- | ---
**Recovery point retention** | Specifies how long Site Recovery keeps recovery points | 1 day
**App-consistent snapshot frequency** | How often Site Recovery takes an app-consistent snapshot | Disabled

### Managing replication policies

You can manage and modify the default replication policies settings as follows:
- You can modify the settings as you enable replication.
- You can create or edit new replication policy while trying to enable replication.

### Multi-VM consistency

If you want VMs to replicate together and have shared crash-consistent and app-consistent recovery points at failover, you can gather them together into a replication group. Multi-VM consistency impacts workload performance and should only be used for VMs 4 workloads that need consistency across all machines.



## Snapshots and recovery points

Recovery points are created from snapshots of VM disks taken at a specific point in time. When you fail over a VM, you use a recovery point to restore the VM in the target location.

When failing over, we generally want to ensure that the VM starts with no corruption or data loss, and that the VM data is consistent for the operating system, and for apps that run on the VM. This depends on the type of snapshots taken.

Site Recovery takes snapshots as follows:

1. Site Recovery takes crash-consistent snapshots of data by default, and app-consistent snapshots if you specify a frequency for them.
2. Recovery points are created from the snapshots and stored in accordance with retention settings in the replication policy.

### Consistency

The following table explains different types of consistency.

### Crash-consistent

**Description** | **Details** | **Recommendation**
--- | --- | ---
A crash consistent snapshot captures data that was on the disk when the snapshot was taken. It doesn't include anything in memory.<br/><br/> It contains the equivalent of the on-disk data that would be present if the VM crashed or the power cord was pulled from the server at the instant that the snapshot was taken.<br/><br/> A crash-consistent doesn't guarantee data consistency for the operating system, or for apps on the VM. | Site Recovery creates crash-consistent recovery points every five minutes by default. This setting can't be modified.<br/><br/>  | Today, most apps can recover well from crash-consistent points.<br/><br/> Crash-consistent recovery points are usually sufficient for the replication of operating systems, and apps such as DHCP servers and print servers.

### App-consistent

**Description** | **Details** | **Recommendation**
--- | --- | ---
App-consistent recovery points are created from app-consistent snapshots.<br/><br/> An app-consistent snapshot contains all the information in a crash-consistent snapshot, plus all the data in memory and transactions in progress. | App-consistent snapshots use the Volume Shadow Copy Service (VSS):<br/><br/>   1) Azure Site Recovery uses Copy Only backup (VSS_BT_COPY) method, which doesn't change Microsoft SQL's transaction log backup time and sequence number </br></br> 2) When a snapshot is initiated, VSS perform a copy-on-write (COW) operation on the volume.<br/><br/>   3) Before it performs the COW, VSS informs every app on the machine that it needs to flush its memory-resident data to disk.<br/><br/>   4) VSS then allows the backup/disaster recovery app (in this case Site Recovery) to read the snapshot data and proceed. | App-consistent snapshots are taken in accordance with the frequency you specify. This frequency should always be less than you set for retaining recovery points. For example, if you retain recovery points using the default setting of 24 hours, you should set the frequency at less than 24 hours.<br/><br/>They're more complex and take longer to complete than crash-consistent snapshots.<br/><br/> They affect the performance of apps running on a VM enabled for replication.

## Failover and failback process

After replication is set up and you run a disaster recovery drill (test failover) to check that everything's working as expected, you can run failover, and failback as you need to.

1. You can run fail over for a single machine or create a recovery plan to fail over multiple VMs at the same time. The advantage of a recovery plan rather than single machine failover include:
    - You can model app-dependencies by including all the VMs across the app in a single recovery plan.
    - You can add scripts, Azure runbooks, and pause for manual actions.
2. After triggering the initial failover, you commit it to start accessing the workload from the Azure VM.
3. When your primary on-premises site is available again, you can prepare for fail back. If you need to fail back large volumes of traffic, set up a new Azure Site Recovery replication appliance.

    - Stage 1: Reprotect the Azure VMs so that they replicate from Azure back to the on-premises VMware VMs.
    - Stage 2: Run a failover to the on-premises site.
    - Stage 3: After workloads have failed back, you reenable replication for the on-premises VMs.

## Next steps

Follow [this tutorial](vmware-azure-set-up-replication-tutorial-modernized.md) to enable VMware to Azure replication.
