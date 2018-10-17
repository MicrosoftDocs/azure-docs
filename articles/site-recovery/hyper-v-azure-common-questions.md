---
title: 'Common questions - Hyper-V to Azure replication with Azure Site Recovery | Microsoft Docs'
description: This article summarizes common questions about replicating on-premises Hyper-V VMs to Azure using Azure Site Recovery.
services: site-recovery
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
ms.date: 10/10/2018
ms.topic: conceptual
ms.author: raynew

---
# Common questions - Hyper-V to Azure replication

This article provides answers to common questions we see when replicating on-premises Hyper-V VMs to Azure. 


## General

### How is Site Recovery priced?
Review [Azure Site Recovery pricing](https://azure.microsoft.com/pricing/details/site-recovery/) details.

### How do I pay for Azure VMs?
During replication, data is replicated to Azure storage, and you don't pay any VM changes. When you run a failover to Azure, Site Recovery automatically creates Azure IaaS virtual machines. After that you're billed for the compute resources that you consume in Azure.

## Azure

### What do I need in Azure?
You need an Azure subscription, a Recovery Services vault, a storage account, and a virtual network. The vault, storage account and network must be in the same region.

### What Azure storage account do I need?
You need an LRS or GRS storage account. We recommend GRS so that data is resilient if a regional outage occurs, or if the primary region can't be recovered. Premium storage is supported.

### Does my Azure account need permissions to create VMs?
If you're a subscription administrator, you have the replication permissions you need. If you're not, you need permissions to create an Azure VM in the resource group and virtual network you specify when you configure Site Recovery, and permissions to write to the selected storage account. [Learn more](site-recovery-role-based-linked-access-control.md#permissions-required-to-enable-replication-for-new-virtual-machines).

### Is replication data sent to Site Recovery?
No, Site Recovery doesn't intercept replicated data, and doesn't have any information about what's running on your VMs. Replication data is exchanged between Hyper-V hosts and Azure storage. Site Recovery has no ability to intercept that data. Only the metadata needed to orchestrate replication and failover is sent to the Site Recovery service.  

Site Recovery is ISO 27001:2013, 27018, HIPAA, DPA certified, and is in the process of SOC2 and FedRAMP JAB assessments.

### Can we keep on-premises metadata within a geographic regions?
Yes. When you create a vault in a region, we ensure that all metadata used by Site Recovery remains within that region's geographic boundary.

### Does Site Recovery encrypt replication?
Yes, both encryption-in-transit and [encryption in Azure](https://docs.microsoft.com/azure/storage/storage-service-encryption) are supported.


## Deployment

### What can I do with Hyper-V to Azure replication?

- **Disaster recovery**: You can set up full disaster recovery. In this scenario, you replicate on-premises Hyper-V VMs to Azure storage:
    - You can replicate VMs to Azure. If your on-premises infrastructure is unavailable, you fail over to Azure.
    - When you fail over, Azure VMs are created using the replicated data. You can access apps and workloads on the Azure VMs.
    - When your on-premises datacenter is available again, you can fail back from Azure to your on-premises site.
- **Migration**: You can use Site Recovery to migrate on-premises Hyper-V VMs to Azure storage. Then, you fail over from on-premises to Azure. After failover, your apps and workloads are available and running on Azure VMs.


### What do I need on-premises?

You need one or more VMs running on one or more standalone or clustered Hyper-V hosts. You can also replicate VMs running on hosts managed by System Center Virtual Machine Manager (VMM).
    - If you're not running VMM, during Site Recovery deployment, you gather Hyper-V hosts and clusters into Hyper-V sites. You install the Site Recovery agents (Azure Site Recovery Provider and Recovery Services agent) on each Hyper-V host.
    - If Hyper-V hosts are located in a VMM cloud, you orchestrate replication in VMM. You install the Site Recovery Provider on the VMM server, and the Recovery Services agent on each Hyper-V host. You map between VMM logical/VM networks, and Azure VNets.
    - 
[Learn more](hyper-v-azure-architecture.md) about Hyper-V to Azure architecture.

### Can I replicate VMs located on a Hyper-V cluster?

Yes, Site Recovery supports clustered Hyper-V hosts. Note that:

- All nodes of the cluster should be registered to the same vault.
- If you're not using VMM, all Hyper-V hosts in the cluster should be added to the same Hyper-V site.
- You install the Azure Site Recovery Provider and Recovery Services agent on each Hyper-V host in the cluster, and add each host to a Hyper-V site.
- No specific steps needs to be done on the cluster.
- If you run the Deployment Planner tool for Hyper-V, the tool collects the profile data from the node which is running and where the VM is running. The tool can't collect any data from a node that's turned off, but it will track that node. After the node is up and running, the tool starts collecting the VM profile data from it (if the VM is part of the profile VM list and is running on the node).
- If a VM on a Hyper-V host in a Site Recovery vault migrates to a different Hyper-V host in the same cluster, or to a standalone host, replication for the VM isn't impacted. The Hyper-V host must meet [prerequisites](hyper-v-azure-support-matrix.md#on-premises-servers), and be configured in a Site Recovery vault. 


### Can I protect VMs when Hyper-V is running on a client operating system?
No, VMs must be located on a Hyper-V host server that's running on a supported Windows server machine. If you need to protect a client computer you could [replicate it as a physical machine](physical-azure-disaster-recovery.md) to Azure.

### Can I replicate Hyper-V generation 2 virtual machines to Azure?
Yes. Site Recovery converts from generation 2 to generation 1 during failover. At failback the machine is converted back to generation 2.

### Can I automate Site Recovery scenarios with an SDK?
Yes. You can automate Site Recovery workflows using the Rest API, PowerShell, or the Azure SDK. Currently supported scenarios for replicating Hyper-V to Azure using PowerShell:

- [Replicate Hyper-V without VMM using PowerShell](hyper-v-azure-powershell-resource-manager.md)
- [Replicating Hyper-V with VMM using Powershell](hyper-v-vmm-powershell-resource-manager.md)

## Replication

### Where do on-premises VMs replicate to?
Data replicates to Azure storage. When you run a failover, Site Recovery automatically creates Azure VMs from the storage account.

### What apps can I replicate?
You can replicate any app or workload running a Hyper-V VM that complies with [replication requirements](hyper-v-azure-support-matrix.md#replicated-vms). Site Recovery provides support for application-aware replication, so that apps can be failed over and failed back to an intelligent state. Site Recovery integrates with Microsoft applications such as SharePoint, Exchange, Dynamics, SQL Server and Active Directory, and works closely with leading vendors, including Oracle, SAP, IBM and Red Hat. [Learn more](site-recovery-workload.md) about workload protection.

### What's the replication process?

1. When initial replication is triggered, a Hyper-V VM snapshot is taken.
2. Virtual hard disks on the VM are replicated one by one, until they're all copied to Azure. This might take a while, depending on the VM size, and network bandwidth. Learn how to increase network bandwidth.
3. If disk changes occur while initial replication is in progress, the Hyper-V Replica Replication Tracker tracks the changes as Hyper-V replication logs (.hrl). These log files are located in the same folder as the disks. Each disk has an associated .hrl file that's sent to secondary storage. The snapshot and log files consume disk resources while initial replication is in progress.
4. When the initial replication finishes, the VM snapshot is deleted.
5. Any disk changes in the log are synchronized and merged to the parent disk.
6. After the initial replication finishes, the Finalize protection on the virtual machine job runs. It configures network and other post-replication settings, so that the VM is protected.
7. At this stage you can check the VM settings to make sure that it's ready for failover. You can run a disaster recovery drill (test failover) for the VM, to check that it fails over as expected.
8. After the initial replication, delta replication begins, in accordance with the replication policy.
9. Changes are logged .hrl files. Each disk that's configured for replication has an associated .hrl file.
10. The log is sent to the customer's storage account. When a log is in transit to Azure, the changes in the primary disk are tracked in another log file, in the same folder.
11. During both initial and delta replication, you can monitor the VM in the Azure portal.

[Learn more](hyper-v-azure-architecture.md#replication-process) about the replication process.

### Can I replicate to Azure with a site-to-site VPN?

Site Recovery replicates data from on-premises to Azure storage over a public endpoint, or using ExpressRoute public peering. Replication over a site-to-site VPN network isn't supported.

### Can I replicate to Azure with ExpressRoute?

Yes, ExpressRoute can be used to replicate VMs to Azure. Site Recovery replicates data to an Azure Storage Account over a public endpoint, and you need to set up [public peering](../expressroute/expressroute-circuit-peerings.md#azure-public-peering) for Site Recovery replication. After VMs fail over to an Azure virtual network, you can access them using [private peering](../expressroute/expressroute-circuit-peerings.md#azure-private-peering).


### Why can't I replicate over VPN?

When you replicate to Azure, replication traffic reaches the public endpoints of an Azure Storage account, Thus you can only replicate over the public internet with ExpressRoute (public peering), and VPN doesn't work. 

### What are the replicated VM requirements?

For replication, a Hyper-V VM must be running a supported operating system. In addition, the VM must meet the requirements for Azure VMs. [Learn more](hyper-v-azure-support-matrix.md#replicated-vms) in the support matrix.

### How often can I replicate to Azure?

Hyper-V VMs can be replicated every 30 seconds (except for premium storage), 5 minutes or 15 minutes.

###Can I extend replication?
Extended or chained replication isn't supported. Request this feature in [feedback forum](http://feedback.azure.com/forums/256299-site-recovery/suggestions/6097959-support-for-exisiting-extended-replication).

### Can I do an offline initial replication?
This isn't supported. Request this feature in the [feedback forum](http://feedback.azure.com/forums/256299-site-recovery/suggestions/6227386-support-for-offline-replication-data-transfer-from).

### Can I exclude disks?
Yes, you can exclude disks from replication. 

### Can I replicate VMs with dynamic disks?
Dynamic disks can be replicated. The operating system disk must be a basic disk.



## Security

### What access does Site Recovery need to Hyper-V hosts

Site Recovery needs access to Hyper-V hosts to replicate the VMs you select. Site Recovery installs the following on Hyper-V hosts:

- If you're not running VMM, the Azure Site Recovery Provider and Recovery Services agent are installed on each host.
- If you're running VMM, the Recovery Services agent is installed on each host. The Provider runs on the VMM server.


### What does Site Recovery install on Hyper-V VMs?

Site Recovery doesn't explicitly install anything on Hyper-V VMs enabled for replication.




## Failover and failback


### How do I fail over to Azure?

You can run a planned or unplanned failover from on-premises Hyper-V VMs to Azure.
    - If you run a planned failover, then source VMs are shut down to ensure no data loss.
    - You can run an unplanned failover if your primary site isn't accessible.
    - You can fail over a single machine, or create recovery plans, to orchestrate failover of multiple machines.
    - You run a failover. After the first stage of failover completes, you should be able to see the created replica VMs in Azure. You can assign a public IP address to the VM if required. You then commit the failover, to start accessing the workload from the replica Azure VM.
   

### How do I access Azure VMs after failover?
After failover, you can access Azure VMs over a secure Internet connection, over a site-to-site VPN, or over Azure ExpressRoute. You'll need to prepare a number of things in order to connect. [Learn more](site-recovery-test-failover-to-azure.md#prepare-to-connect-to-azure-vms-after-failover)

### Is failed over data resilient?
Azure is designed for resilience. Site Recovery is engineered for failover to a secondary Azure datacenter, in accordance with the Azure SLA. When failover occurs, we make sure your metadata and vaults remain within the same geographic region that you chose for your vault.

### Is failover automatic?
[Failover](site-recovery-failover.md) isn't automatic. You initiate failovers with single click in the portal, or you can use [ PowerShell](/powershell/module/azurerm.siterecovery) to trigger a failover.

### How do I fail back?

After your on-premises infrastructure is up and running again, you can fail back. Failback occurs in three stages:

1. You kick off a planned failover from Azure to the on-premises site using a couple of different options:

    - Minimize downtime: If you use this option Site Recovery synchronizes data before failover. It checks for changed data blocks and downloads them to the on-premises site, while the Azure VM keeps running, minimizing downtime. When you manually specify that the failover should complete, the Azure VM is shut down, any final delta changes are copied, and the failover starts.
    - Full download: With this option data is synchronized during failover. This option downloads the entire disk. It's faster because no checksums are calculated, but there's more downtime. Use this option if you've been running the replica Azure VMs for some time, or if the on-premises VM was deleted.

2. You can select to fail back to the same VM or to an alternate VM. You can specify that Site Recovery should create the VM if it doesn't already exist.
3. After initial synchronization finishes, you select to complete the failover. After it completes, you can log onto the on-premises VM to check everything's working as expected. In the Azure portal, you can see that the Azure VMs have been stopped.
4. You commit the failover to finish up, and start accessing the workload from the on-premises VM again.
5. After workloads have failed back, you enable reverse replication, so that the on-premises VMs replicate to Azure again.

### Can I fail back to a different location?
Yes, if you failed over to Azure, you can fail back to a different location if the original one isn't available. [Learn more](hyper-v-azure-failback.md#failback-to-an-alternate-location-in-hyper-v-environment).
