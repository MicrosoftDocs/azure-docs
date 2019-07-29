---
title: Azure to Azure replication architecture in Azure Site Recovery | Microsoft Docs
description: This article provides an overview of components and architecture used when you set up disaster recovery between Azure regions for Azure VMs, using the Azure Site Recovery service.
services: site-recovery
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
ms.topic: conceptual
ms.date: 05/30/2019
ms.author: raynew
---


# Azure to Azure disaster recovery architecture


This article describes the architecture, components, and processes used when you deploy disaster recovery for Azure virtual machines (VMs)  using the [Azure Site Recovery](site-recovery-overview.md) service. With disaster recovery set up, Azure VMs continuously replicate from to a different target region. If an outage occurs, you can fail over VMs to the secondary region, and access them from there. When everything's running normally again, you can fail back and continue working in the primary location.



## Architectural components

The components involved in disaster recovery for Azure VMs are summarized in the following table.

**Component** | **Requirements**
--- | ---
**VMs in source region** | One of more Azure VMs in a [supported source region](azure-to-azure-support-matrix.md#region-support).<br/><br/> VMs can be running any [supported operating system](azure-to-azure-support-matrix.md#replicated-machine-operating-systems).
**Source VM storage** | Azure VMs can be managed, or have non-managed disks spread across storage accounts.<br/><br/>[Learn about](azure-to-azure-support-matrix.md#replicated-machines---storage) supported Azure storage.
**Source VM networks** | VMs can be located in one or more subnets in a virtual network (VNet) in the source region. [Learn more](azure-to-azure-support-matrix.md#replicated-machines---networking) about networking requirements.
**Cache storage account** | You need a cache storage account in the source network. During replication, VM changes are stored in the cache before being sent to target storage.  Cache storage accounts must be Standard.<br/><br/> Using a cache ensures minimal impact on production applications that are running on a VM.<br/><br/> [Learn more](azure-to-azure-support-matrix.md#cache-storage) about cache storage requirements. 
**Target resources** | Target resources are used during replication, and when a failover occurs. Site Recovery can set up target resource by default, or you can create/customize them.<br/><br/> In the target region, check that you're able to create VMs, and that your subscription has enough resources to support VM sizes that will be needed in the target region. 

![Source and target replication](./media/concepts-azure-to-azure-architecture/enable-replication-step-1.png)

## Target resources

When you enable replication for a VM, Site Recovery gives you the option of creating target resources automatically. 

**Target resource** | **Default setting**
--- | ---
**Target subscription** | Same as the source subscription.
**Target resource group** | The resource group to which VMs belong after failover.<br/><br/> It can be in any Azure region except the source region.<br/><br/> Site Recovery creates a new resource group in the target region, with an "asr" suffix.<br/><br/>
**Target VNet** | The virtual network (VNet) in which replicated VMs are located after failover. A network mapping is created between source and target virtual networks, and vice versa.<br/><br/> Site Recovery creates a new VNet and subnet, with the "asr" suffix.
**Target storage account** |  If the VM doesn't use a managed disk, this is the storage account to which data is replicated.<br/><br/> Site Recovery creates a new storage account in the target region, to mirror the source storage account.
**Replica managed disks** | If the VM uses a managed disk, this is the managed disks to which data is replicated.<br/><br/> Site Recovery creates replica managed disks in the storage region to mirror the source.
**Target availability sets** |  Availability set in which replicating VMs are located after failover.<br/><br/> Site Recovery creates an availability set in the target region with the suffix "asr", for VMs that are located in an availability set in the source location. If an availability set exists, it's used and a new one isn't created.
**Target availability zones** | If the target region supports availability zones, Site Recovery assigns the same zone number as that used in the source region.

### Managing target resources

You can manage target resources as follows:

- You can modify target settings as you enable replication.
- You can modify target settings after replication is already working. The exception is the availability type (single instance, set or zone). To change this setting you need to disable replication, modify the setting, and then reenable.



## Replication policy 

When you enable Azure VM replication, by default Site Recovery creates a new replication policy with the default settings summarized in the table.

**Policy setting** | **Details** | **Default**
--- | --- | ---
**Recovery point retention** | Specifies how long Site Recovery keeps recovery points | 24 hours
**App-consistent snapshot frequency** | How often Site Recovery takes an app-consistent snapshot. | Every 60 minutes.

### Managing replication policies

You can manage and modify the default replication policies settings as follows:
- You can modify the settings as you enable replication.
- You can create a replication policy at any time, and then apply it when you enable replication.

### Multi-VM consistency

If you want VMs to replicate together, and have shared crash-consistent and app-consistent recovery points at failover, you can gather them together into a replication group. Multi-VM consistency impacts workload performance, and should only be used for VMs running workloads that need consistency across all machines. 



## Snapshots and recovery points

Recovery points are created from snapshots of VM disks taken at a specific point in time. When you fail over a VM, you use a recovery point to restore the VM in the target location.

When failing over, we generally want to ensure that the VM starts with no corruption or data loss, and that the VM data is consistent for the operating system, and for apps that run on the VM. This depends on the type of snapshots taken.

Site Recovery takes snapshots as follows:

1. Site Recovery takes crash-consistent snapshots of data by default, and app-consistent snapshots if you specify a frequency for them.
2. Recovery points are created from the snapshots, and stored in accordance with retention settings in the replication policy.

### Consistency

The following table explains different types of consistency.

### Crash-consistent

**Description** | **Details** | **Recommendation**
--- | --- | ---
A crash consistent snapshot captures data that was on the disk when the snapshot was taken. It doesn't include anything in memory.<br/><br/> It contains the equivalent of the on-disk data that would be present if the VM crashed or the power cord was pulled from the server at the instant that the snapshot was taken.<br/><br/> A crash-consistent doesn't guarantee data consistency for the operating system, or for apps on the VM. | Site Recovery creates crash-consistent recovery points every five minutes by default. This setting can't be modified.<br/><br/>  | Today, most apps can recover well from crash-consistent points.<br/><br/> Crash-consistent recovery points are usually sufficient for the replication of operating systems, and apps such as DHCP servers and print servers.

### App-consistent

**Description** | **Details** | **Recommendation**
--- | --- | ---
App-consistent recovery points are created from app-consistent snapshots.<br/><br/> An app-consistent snapshot contain all the information in a crash-consistent snapshot, plus all the data in memory and transactions in progress. | App-consistent snapshots use the Volume Shadow Copy Service (VSS):<br/><br/>   1) When a snapshot is initiated, VSS perform a copy-on-write (COW) operation on the volume.<br/><br/>   2) Before it performs the COW, VSS informs every app on the machine that it needs to flush its memory-resident data to disk.<br/><br/>   3) VSS then allows the backup/disaster recovery app (in this case Site Recovery) to read the snapshot data and proceed. | App-consistent snapshots are taken in accordance with the frequency you specify. This frequency should always be less than you set for retaining recovery points. For example, if you retain recovery points using the default setting of 24 hours, you should set the frequency at less than 24 hours.<br/><br/>They're more complex and take longer to complete than crash-consistent snapshots.<br/><br/> They affect the performance of apps running on a VM enabled for replication. 

## Replication process

When you enable replication for an Azure VM, the following happens:

1. The Site Recovery Mobility service extension is automatically installed on the VM.
2. The extension registers the VM with Site Recovery.
3. Continuous replication begins for the VM.  Disk writes are immediately transferred to the cache storage account in the source location.
4. Site Recovery processes the data in the cache, and sends it to the target storage account, or to the replica managed disks.
5. After the data is processed, crash-consistent recovery points are generated every five minutes. App-consistent recovery points are generated according to the setting specified in the replication policy.

![Enable replication process, step 2](./media/concepts-azure-to-azure-architecture/enable-replication-step-2.png)

**Replication process**

## Connectivity requirements

 The Azure VMs you replicate need outbound connectivity. Site Recovery never needs inbound connectivity to the VM. 

### Outbound connectivity (URLs)

If outbound access for VMs is controlled with URLs, allow these URLs.

| **URL** | **Details** |
| ------- | ----------- |
| *.blob.core.windows.net | Allows data to be written from the VM to the cache storage account in the source region. |
| login.microsoftonline.com | Provides authorization and authentication to Site Recovery service URLs. |
| *.hypervrecoverymanager.windowsazure.com | Allows the VM to communicate with the Site Recovery service. |
| *.servicebus.windows.net | Allows the VM to write Site Recovery monitoring and diagnostics data. |

### Outbound connectivity for IP address ranges

To control outbound connectivity for VMs using IP addresses, allow these addresses.

#### Source region rules

**Rule** |  **Details** | **Service tag**
--- | --- | --- 
Allow HTTPS outbound: port 443 | Allow ranges that correspond to storage accounts in the source region | Storage.\<region-name>.
Allow HTTPS outbound: port 443 | Allow ranges that correspond to Azure Active Directory (Azure AD).<br/><br/> If Azure AD addresses are added in future you need to create new Network Security Group (NSG) rules.  | AzureActiveDirectory
Allow HTTPS outbound: port 443 | Allow access to [Site Recovery endpoints](https://aka.ms/site-recovery-public-ips) that correspond to the target location. 

#### Target region rules

**Rule** |  **Details** | **Service tag**
--- | --- | --- 
Allow HTTPS outbound: port 443 | Allow ranges that correspond to storage accounts in the target region. | Storage.\<region-name>.
Allow HTTPS outbound: port 443 | Allow ranges that correspond to Azure AD.<br/><br/> If Azure AD addresses are added in future you need to create new NSG rules.  | AzureActiveDirectory
Allow HTTPS outbound: port 443 | Allow access to [Site Recovery endpoints](https://aka.ms/site-recovery-public-ips) that correspond to the source location. 


#### Control access with NSG rules

If you control VM connectivity by filtering network traffic to and from Azure networks/subnets using [NSG rules](https://docs.microsoft.com/azure/virtual-network/security-overview), note the following requirements:

- NSG rules for the source Azure region should allow outbound access for replication traffic.
- We recommend you create rules in a test environment before you put them into production.
- Use [service tags](https://docs.microsoft.com/azure/virtual-network/security-overview#service-tags) instead of allowing individual IP addresses.
    - Service tags represent a group of IP address prefixes gathered together to minimize complexity when creating security rules.
    - Microsoft automatically updates service tags over time. 
 
Learn more about [outbound connectivity](azure-to-azure-about-networking.md#outbound-connectivity-for-ip-address-ranges) for Site Recovery, and [controlling connectivity with NSGs](concepts-network-security-group-with-site-recovery.md).


### Connectivity for multi-VM consistency

If you enable multi-VM consistency, machines in the replication group communicate with each other over port 20004.
- Ensure that there is no firewall appliance blocking the internal communication between the VMs over port 20004.
- If you want Linux VMs to be part of a replication group, ensure the outbound traffic on port 20004 is manually opened as per the guidance of the specific Linux version.




## Failover process

When you initiate a failover, the VMs are created in the target resource group, target virtual network, target subnet, and in the target availability set. During a failover, you can use any recovery point.

![Failover process](./media/concepts-azure-to-azure-architecture/failover.png)

## Next steps

[Quickly replicate](azure-to-azure-quickstart.md) an Azure VM to a secondary region.
