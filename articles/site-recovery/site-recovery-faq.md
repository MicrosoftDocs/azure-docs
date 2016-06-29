<properties 
	pageTitle="Site Recovery: Frequently asked questions | Microsoft Azure" 
	description="This article answers common questions about Azure Site Recovery."
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
	ms.date="03/27/2016"
	ms.author="raynew"/>


# Azure Site Recovery: Frequently asked questions (FAQ)

Read this article to review frequently asked questions about the Azure Site Recovery service.

If you still have questions after reading the article you can post them at the bottom of this article, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=hypervrecovmgr).

## General

### What does Site Recovery do?

Site Recovery contributes to your business continuity and disaster recovery (BCDR) strategy by orchestrating and automating replication from on-premises virtual machines and physical servers to Azure, or to a secondary datacenter. [Learn more](site-recovery-overview.md).

### What can Site Recovery replicate?

- **Hyper-V virtual machines**: Site Recovery can replicate any workload running on a supported Hyper-V VM. 
- **Physical servers**: Site Recovery can replicate any workload running on a supported Windows/Linux physical server.
- **VMware virtual machines**: Site Recovery can replicate any workload running on a supported VMware VM.


### What do I need in Hyper-V?

For the Hyper-V host server what you need depends on the deployment scenario. Check out the Hyper-V prerequisites in:

- [Replicating Hyper-V VMs (without VMM) to Azure](site-recovery-hyper-v-site-to-azure.md#before-you-start)
- [Replicating Hyper-V VMs (with VMM) to Azure](site-recovery-vmm-to-azure.md#before-you-start)
- [Replicating Hyper-V VMs to a secondary datacenter](site-recovery-vmm-to-vmm.md#before-you-start)

For the guests running on the Hyper-V host server:

- If you're replicating to a secondary site read about [Supported guest operating systems for Hyper-V VMs](https://technet.microsoft.com/library/mt126277.aspx).
- If you're replicating to Azure, Site Recovery supports the same guest operating systems that are [supported by Azure](https://technet.microsoft.com/library/cc794868%28v=ws.10%29.aspx).


### Can I protect VMs if Hyper-V is running on a client operating system?

No, VMs must be located on a Hyper-V host server that's running on a supported Windows server machine. If you need to protect a client computer you could replicate it as a physical machine [to Azure](site-recovery-vmware-to-azure-classic.md), or to a [secondary datacenter](site-recovery-vmware-to-vmware.md).


### What workloads can I protect with Site Recovery?

Site Recovery can replicate any workloads running on a supported VM or physical server. Site Recovery provides support for application-aware replication so that apps can be recovered to an intelligent state. It integrates with Microsoft applications such as SharePoint, Exchange, Dynamics, SQL Server and Active Directory, and works closely with leading vendors, includin Oracle, SAP, IBM and Red Hat. [Learn more](site-recovery-workload.md) about workload protection.


### Do I Hyper-V hosts have to be in System Center VMM clouds in order to replicate them with Site Recovery? 

If you want to replicate to a secondary datacenter then Hyper-V VMs must be located on Hyper-V hosts servers in a VMM cloud. If you want to replicate to Azure then you can replicate VMs on Hyper-V host servers with or without VMM clouds. [Learn more](site-recovery-hyper-v-site-to-azure.md). 

### Can I deploy Site Recovery with VMM if I only have one VMM server? 

Yes. You can either replicate VMs in Hyper-V servers in the VMM cloud to Azure, or you can  replicate between VMM clouds on the same server. For on-premises to on-premises replication we recommend that you have a VMM server in both the primary and secondary sites. [Read more](site-recovery-single-vmm.md)

### What physical servers can I protect?

You can protect physical servers running supported Windows and Linux operating systems to Azure or to a secondary site. [Learn](site-recovery-vmware-to-azure-classic.md#before-you-start-deployment) about operating system requirements for Azure or secondary site replication. 
Note that physical servers that are replicated to Azure storage will run as VMs in Azure when failover occurs. When you fail back from Azure to your on-premises site failing back to a physical server isn't currently supported. You can only fail back to a virtual machine running on VMware.

### What VMware VMs can I protect?

To protect VMware VMs you'll need a vSphere hypervisor, and virtual machines running VMware tools. We also recommend that you have a VMware vCenter server to manage the hypervisors. [Learn more](site-recovery-vmware-to-azure-classic.md#before-you-start-deployment) about exact requirements  for replicating VMware servers and VMs to Azure or to a secondary site.

### Can I manage disaster recovery for my branch offices with Site Recovery?

Yes. When you use Site Recovery to orchestrate replication and failover in your branch offices, you can orchestrate and view of all your branch office workloads in a central location. You can easily run failovers and administer disaster recovery of all branches from your head office, without visiting the branches. 

## Security


### Is replication data sent to the Site Recovery service?

No, Site Recovery doesn't intercept replicated data or have any information about what's running on your virtual machines or physical servers.

Replication data is exchanged between on-premises Hyper-V hosts, VMware hypervisors, or physical servers and Azure storage or your secondary site.  Site Recovery has no ability to intercept that data. Only the metadata needed to orchestrate replication and failover is sent to the Site Recovery service. 

Site Recovery is ISO 27001:2005-certified, and is in the process of completing its HIPAA, DPA, and FedRAMP JAB assessments.

### For compliance, even metadata from our on-premises environments must remain within the same geographic region. Can Site Recovery do this?

Yes. When you create a Site Recovery vault in a region, we ensure that all the metadata that we need to enable and orchestrate replication and failover remains within that region's geographic boundary.

### Does Site Recovery encrypt replication?
For virtual machines and physical servers replicating etween on-premises sites encryption-in-transit is supported. For virtual machines and physical servers replicating to Azure both encryption-in-transit and encryption-at-rest(in Azure) is supported. 



## Replication

### Are there any prerequisites for replicating virtual machines to Azure?

Virtual machines you want to replicate to Azure should comply with [Azure requirements](site-recovery-best-practices.md#azure-virtual-machine-requirements).

### Can I replicate Hyper-V generation 2 virtual machines to Azure?

Yes. Site Recovery converts VMs from generation 2 to generation 1 during failover. At failback the VM is converted back to generation 2. [Read more](https://azure.microsoft.com/blog/2015/04/28/disaster-recovery-to-azure-enhanced-and-were-listening/).

### If I replicate to Azure how do I pay for Azure VMs? 

During regular replication, data is replicated to geo-redundant Azure storage and you don’t need to pay any Azure IaaS virtual machine charges.  When you run a failover to Azure, Site Recovery automatically creates Azure IaaS virtual machines, and after that you'll be billed for the compute resources that you consume in Azure.

### Is there an SDK that I can use to automate Site Recovery workflows?

Yes. You can automate Site Recovery workflows using the Rest API, PowerShell, or the Azure SDK. Learn more about [Deploying Site Recovery using PowerShell and Azure Resource Manager](site-recovery-deploy-with-powershell-resource-manager.md).

### If I replicate to Azure what kind of storage account do I need?

You'll need a storage account with [standard geo-redundant storage](../storage/storage-introduction.md#replication-for-durability-and-high-availability). Premium storage isn't currently supported.

### How often can I replicate data?

- **Hyper-V:** Hyper-V VMs running on Windows Server 2012 R2 can be replicated every 30 seconds, 5 minutes or 15 minutes. If you've set up SAN replication then replication will be synchronous.
- **VMware and physical servers:** A replication frequency isn't relevant here. Replication will be continuous. 

### Can I extend replication from existing recovery site to another recovery site?

Extended or chained replication isn't supported. [Send us feedback](https://feedback.azure.com/forums/256299-site-recovery/suggestions/6097959-support-for-exisiting-extended-replication/) about this feature.


### Can I do an offline replication the first time I replicate to Azure? 

This isn't supported. [Send us feedback](https://feedback.azure.com/forums/256299-site-recovery/suggestions/6227386-support-for-offline-replication-data-transfer-from/) about this feature.

### Can I exclude specific disks from replication?

This isn't supported. [Send us feedback](https://feedback.azure.com/forums/256299-site-recovery/suggestions/6418801-exclude-disks-from-replication/) about this feature.

### Can I replicate virtual machines with  dynamic disks?

Dynamic disks are supported when replicating Hyper-V virtual machines. They are also supported when replicating VMware VMs and physical machines if you're using the [enhanced deployment](site-recovery-vmware-to-azure-classic.md). Note that the OS disk must be a basic disk.

### Can I throttle bandwidth allotted for Hyper-V replication traffic?
- If you're replicating between Hyper-V VMs two on-premises sites then you can use Windows QoS. Here's a sample script: 

    	New-NetQosPolicy -Name ASRReplication -IPDstPortMatchCondition 8084 -ThrottleRate (2048*1024)
    	gpupdate.exe /force

- If you're replicating Hyper-V VMs to Azure then you can configure throttling using the following sample PowerShell cmdlet:

    	Set-OBMachineSetting -WorkDay $mon, $tue -StartWorkHour "9:00:00" -EndWorkHour "18:00:00" -WorkHourBandwidth (512*1024) -NonWorkHourBandwidth (2048*1024)

- [Learn more](https://support.microsoft.com/en-us/kb/3056159) about throttling Hyper-V traffic.
- [Learn more](site-recovery-vmware-to-azure-classic.md#capacity-planning) about throttling VMware replication to Azure.


## Failover

### How do I access Azure virtual machines after failover to Azure? 

You can access the Azure VMs over a secure Internet connection, over a site-to-site VPN, or over Azure ExpressRoute. Communications over a VPN connection are to internal ports on the Azure network on which the VM is located. Communications over the internet are mapped to the public endpoints on the Azure cloud service for the VMs.

### For failover to Azure, how does Azure make sure my data is resilient?

Azure is designed for resilience. Site Recovery is already engineered for failover to a secondary Azure datacenter in accordance with the Azure SLA if the need arises. If this happens we make sure your metadata and vaults remain within the same geographic region that you chose for your vault. 

### If I'm replicating between two sites, what happens if my primary site experiences an unexpected outage?

You can trigger an unplanned failover from the secondary site. Site Recovery doesn't need connectivity from the primary site to perform the failover.

### Is failover automatic?

Failover isn't automatic. You initiate failovers with single click in the portal, or you can use [Site Recovery PowerShell cmdlets](https://msdn.microsoft.com/library/dn850420.aspx) to trigger a failover.Failback is a series of actions in the Site Recovery portal.

To automate failover you could use on-premises Orchestrator or Operations Manager to detect a virtual machine failure, and then trigger the failover using the SDK.


## 
### I'm a service provides. Does Site Recovery work for dedicated or shared infrastructure models?
Yes, Site Recovery supports both dedicated and shared infrastructure models.

### For service provides, is the identity of my tenant shared with the Site Recovery service?
No. Your tenants don't need access to the Site Recovery portal. Only the service provider administrator interacts with the portal.


### Will my tenants' application data ever go to Azure?

When replicating between service provider-owned sites, application data never goes to Azure. Data is encrypted in-transit and replicated directly between the service provider sites.

If you're replicating to Azure, application data is sent to Azure storage but not to the Site Recovery service. Data is encrypted in-transit and remains encrypted in Azure. 

### Will my tenants receive a bill for any Azure services?

No. Azure's billing relationship is directly with the service provider. Service providers are responsible for generating specific bills for their tenants.

### If I'm replicating to Azure, do we need to run virtual machines in Azure at all times?

No. Data is replicated to a geo-redundant Azure storage account in your subscription. When you perform a test failover (DR drill) or an actual failover, Site Recovery automatically creates virtual machines in your subscription.

### Do you ensure tenant-level isolation when I replicate to Azure?

Yes.

### What platforms do you currently support?

We support Azure Pack, Cloud Platform System, and System Center (2012 and higher) deployments. Learn more about Azure Pack integration in [Configure protection for virtual machines](https://technet.microsoft.com/library/dn850370.aspx).

### Do you support single Azure Pack and single VMM server deployments?

Yes, you can replicate Hyper-V virtual virtual machines and Azure, or between service provider sites.  Note that if you replicate between service provider sites Azure runbook integration isn't available.


## Next steps

- Read the [Site Recovery overview](site-recovery-overview.md)
- Learn about [Site Recovery architecture](site-recovery-components.md)  
