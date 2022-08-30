---
title: Physical server to Azure disaster recovery architecture – Modernized 
description: This article provides an overview of components and architecture used when setting up disaster recovery of on-premises Windows and Linux servers to Azure with Azure Site Recovery - Modernized
ms.service: site-recovery
ms.topic: conceptual
ms.date: 08/18/2022
---

# Physical server to Azure disaster recovery architecture – Modernized 

This article describes the architecture and processes used when you replicate, fail over, and recover physical Windows and Linux servers between an on-premises site and Azure, using the [Azure Site Recovery](/azure/site-recovery/site-recovery-overview) service. 

For information about configuration server requirements in Classic releases, see [Physical server to Azure disaster recovery architecture](/azure/site-recovery/physical-azure-architecture).  

>[!Note]
>Ensure you create a new Recovery Services vault for setting up the ASR replication appliance. Don't use an existing vault. 

## Architectural components

The following table and graphic provide a high-level view of the components used for VMware VMs/physical machines disaster recovery to Azure.

[![Screenshot of Physical server to Azure architecture modernized.](/media/physical-server-azure-architecture-modernized/architecture-modernized.png)](/media/physical-servers-azure-architecture-modernized/architecture-modernized.png#lightbox)

**Component** | **Requirement** | **Details**
--- | --- | ---
**Azure** | An Azure subscription, Azure Storage account for cache, Managed Disk, and Azure network. | Replicated data from on-premises VMs is stored in Azure storage. Azure VMs are created with the replicated data when you run a failover from on-premises to Azure. The Azure VMs connect to the Azure virtual network when they're created.
**Azure Site Recovery replication appliance** | 	This is the basic building block of the entire Azure Site Recovery on-premises infrastructure. <br/><br/> All components in the appliance coordinate with the replication appliance. This service oversees all end-to-end Site Recovery activities including monitoring the health of protected machines, data replication, automatic updates, etc. | The appliance hosts various crucial components like:<br/><br/>**Azure Site Recovery Proxy server:** This component acts as a proxy channel between mobility agent and Site Recovery  services in the cloud. It ensures there is no additional internet connectivity required from production workloads to generate recovery points.<br/><br/>**Discovered items:** This component gathers information of vCenter and coordinates with Azure Site Recovery management service in the cloud.<br/><br/>**Re-protection server:** This component coordinates between Azure and on-premises machines during reprotect and failback operations.<br/><br/>**Azure Site Recovery Process server:** This component is used for caching, compression of data before being sent to Azure. <br/><br/> [Learn more](switch-replication-appliance-preview.md) about replication appliance and how to use multiple replication appliances.<br/><br/>**Recovery services agent:** This component is used for configuring/registering with Site Recovery services, and for monitoring the health of all the components.<br/><br/>**Site Recovery provider:** This component is used for facilitating re-protect. It identifies between alternate location re-protect and original location re-protect for a source machine. <br/><br/> **Replication service:** This component is used for replicating data from source location to Azure.
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
| portal.azure.com          | Navigate to the Azure portal.              |
| `*.windows.net `<br>`*.msftauth.net`<br>`*.msauth.net`<br>`*.microsoft.com`<br>`*.live.com `<br>`*.office.com ` | To sign-in to your Azure subscription.  |
|`*.microsoftonline.com `|Create Azure Active Directory (AD) apps for the appliance to communicate with Azure Site Recovery. |
|management.azure.com |Create Azure AD apps for the appliance to communicate with the Azure Site Recovery service. |
|`*.services.visualstudio.com `|Upload app logs used for internal monitoring. |
|`*.vault.azure.net `|Manage secrets in the Azure Key Vault. Note: Ensure machines to replicate have access to this. |
|aka.ms |Allow access to aka links. Used for Azure Site Recovery appliance updates. |
|download.microsoft.com/download |Allow downloads from Microsoft download. |
|`*.servicebus.windows.net `|Communication between the appliance and the Azure Site Recovery service. |
|`*.discoverysrv.windowsazure.com `|Connect to Azure Site Recovery discovery service URL. |
|`*.hypervrecoverymanager.windowsazure.com `|Connect to Azure Site Recovery micro-service URLs  |
|`*.blob.core.windows.net `|Upload data to Azure storage which is used to create target disks |
|`*.backup.windowsazure.com `|Protection service URL – a microservice used by Azure Site Recovery for processing & creating replicated disks in Azure |

## Replication process

1. When you enable replication for a VM, initial replication to Azure storage begins, using the specified replication policy. Note the following:
    - For VMware VMs, replication is block-level, near-continuous, using the Mobility service agent running on the VM.
    - Any replication policy settings are applied:
        - **RPO threshold**. This setting does not affect replication. It helps with monitoring. An event is raised, and optionally an email sent, if the current RPO exceeds the threshold limit that you specify.
        - **Recovery point retention**. This setting specifies how far back in time you want to go when a disruption occurs. Maximum retention is 15 days.
        - **App-consistent snapshots**. App-consistent snapshot can be taken every 1 to 12 hours, depending on your app needs. Snapshots are standard Azure blob snapshots. The Mobility agent running on a VM requests a VSS snapshot in accordance with this setting, and bookmarks that point-in-time as an application consistent point in the replication stream.
        >[!NOTE]
        >High recovery point retention period may have an implication on the storage cost since more recovery points may need to be saved. 
        

2. Traffic replicates to Azure storage public endpoints over the internet. Alternately, you can use Azure ExpressRoute with [Microsoft peering](../expressroute/expressroute-circuit-peerings.md#microsoftpeering). Replicating traffic over a site-to-site virtual private network (VPN) from an on-premises site to Azure isn't supported.
3. Initial replication operation ensures that entire data on the machine at the time of enable replication is sent to Azure. After initial replication finishes, replication of delta changes to Azure begins. Tracked changes for a machine are sent to the process server.
4. Communication happens as follows:

    - VMs communicate with the on-premises appliance on port HTTPS 443 inbound, for replication management.
    - The appliance orchestrates replication with Azure over port HTTPS 443 outbound.
    - VMs send replication data to the process server on port HTTPS 9443 inbound. This port can be modified.
    - The process server receives replication data, optimizes, and encrypts it, and sends it to Azure storage over port 443 outbound.
5. The replication data logs first land in a cache storage account in Azure. These logs are processed and the data is stored in an Azure Managed Disk (called as *asrseeddisk*). The recovery points are created on this disk.

## Failover and failback process

After replication is set up and you run a disaster recovery drill (test failover) to check that everything's working as expected, you can run failover and failback as you need to.

1. You can run fail over for a single machine or create a recovery plan to fail over multiple servers at the same time. The advantage of a recovery plan rather than single machine failover include:
    - You can model app-dependencies by including all the servers across the app in a single recovery plan.
    - You can add scripts, Azure runbooks, and pause for manual actions.
2. After triggering the initial failover, you commit it to start accessing the workload from the Azure VM.
3. When your primary on-premises site is available again, you can prepare for fail back. If you need to fail back large volumes of traffic, set up a new Azure Site Recovery replication appliance.

    - Stage 1: Reprotect the Azure VMs so that they replicate from Azure back to the on-premises VMware VMs.
      >[!Note]
      >Failback to physical servers is not supported. Thus, reprotect will happen to a VMware VM.
    - Stage 2: Run a failover to the on-premises site.
    - Stage 3: After workloads have failed back, you reenable replication for the on-premises VMs.

>[!Note] 
>To execute failback using the preview architecture, there is no need to setup a process server, master target server or failback policy in Azure. 

>[!Note]
>Failback to physical machines is not supported. You must failback to a VMware site. 

## Next steps

Follow [this tutorial](vmware-azure-tutorial.md) to enable VMware to Azure replication.
