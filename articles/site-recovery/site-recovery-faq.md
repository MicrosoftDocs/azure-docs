<properties 
	pageTitle="Azure Site Recovery: Frequently asked questions" 
	description="This article discusses popular questions about Azure Site Recovery." 
	services="site-recovery" 
	documentationCenter=""
	authors="rayne-wiselman"
	manager="jwhit"
	editor=""/>

<tags 
	ms.service="get-started-article"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na" 
	ms.workload="storage-backup-recovery"
	ms.date="12/07/2015" 
	ms.author="raynew"/>


# Azure Site Recovery: Frequently asked questions (FAQ)
## About this article

This article includes frequently asked questions about Site Recovery. If you have questions after reading through theh FAQ, post them on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=hypervrecovmgr).


## Support

###What does Site Recovery do?

Site Recovery contributes to your business continuity and disaster recovery (BCDR) strategy by orchestrating and automating replication from on-premises virtual machines and physical servers to Azure, or to a secondary datacenter. [Learn more](site-recovery-overview.md).


### What can Site Recovery protect?

- **Hyper-V virtual machines**: Site Recovery can protect any workload running on a Hyper-V VM. 
- **Physical servers**: Site Recovery can protect physical servers running Windows or Linux.
- **VMware virtual machines**: Site Recovery can protect any workload running in a VMware VM.


###What Hyper-V VMs can I protect?

It depends on the deployment scenario. 

Check the Hyper-V host server prerequisites in:

- [Replicating Hyper-V VMs (without VMM) to Azure](site-recovery-hyper-v-site-to-azure.md/#before-you-start)
- [Replicating Hyper-V VMs (with VMM) to Azure](site-recovery-vmm-to-azure.md/#before-you-start)
- [Replicating Hyper-V VMs to a secondary datacenter](site-recovery-vmm-to-vmm.md/#before-you-start)

Regarding guest operating systems:

- If you're replicating to a secondary datacenter see a list of the supported guest operating systems for VMs running on Hyper-V host servers in [Supported guest operating systems for Hyper-V VMs](https://technet.microsoft.com/library/mt126277.aspx).
- If you're replicating to Azure, Site Recovery supports all the guest operating systems that are [supported by Azure](https://technet.microsoft.com/library/cc794868%28v=ws.10%29.aspx).

Site Recovery can protect any workload running on a supported VM.

### Can I protect VMs when Hyper-V is running on a client operating system?

No, it's not supported. Instead you'd need to [replicate the physical client machine](site-recovery-vmware-to-azure.md) to Azure or a secondary datacenter.


### What workloads can I protect with Site Recovery?

You can use Site Recovery to protect most workloads running on a virtual machine or physical server. Site Recovery can help you to deploy application-aware DR. It integrates with Microsoft applications, including SharePoint, Exchange, Dynamics, SQL Server and Active Directory, and works closely with leading vendors including Oracle, SAP, IBM and Red Hat  You can customize your disaster recovery solution for each specific application. [Learn more](site-recovery-workload.md) about workload protection.


### Do I always need a System Center VMM server to protect Hyper-V virtual machines? 

No. If you're replicating to Azure you can replicate Hyper-V VMs located on Hyper-V host servers that are/aren't located in VMM clouds. If you're replicating to a secondary datacenter then Hyper-V host servers must be managed in VMM clouds. [Read more](site-recovery-hyper-v-site-to-azure.md)

### Can I deploy Site Recovery with VMM if I only have one VMM server? 

Yes. You can either replicate Hyper-V VMs in the cloud on the VMM server to Azure, or you can  replicate between VMM clouds on the same server. Note that we do recommend that for on-premises to on-premises replication you have a VMM server in the primary and secondary sites.  [Read more](site-recovery-single-vmm.md)

### What physical servers can I protect?

You can protect physical servers running Windows and Linux, to Azure or to a secondary site. For operating system requirements read [What do I need?](site-recovery-vmware-to-azure.md/#what-do-i-need). The same limitations apply whether you're replicating physical servers to Azure or to a secondary site.

Note that physical servers will run as VMs in Azure if your on-premises server goes down. Failback to an on-premises physical server isn't currently supported but you can fail back to a virtual machine running on Hyper-V or VMware.

### What VMware VMs can I protect?

For this scenario you'll need a VMware vCenter server, a vSphere hypervisor, and virtual machines with VMware tools running. for exact requirements see [What do I need?](site-recovery-vmware-to-azure.md/#what-do-i-need). The same limitations apply whether you're replicating physical servers to Azure or to a secondary site.

### Are there any prerequisites for replicating virtual machines to Azure?

Virtual machines you want to replicate to Azure should comply with [Azure requirements](site-recovery-best-practices.md/#virtual-machines). 

### Can I replicate Hyper-V generation 2 virtual machines to Azure?

Yes. Site Recovery converts from generation 2 to generation 1 during failover. At failback the machine is converted back to generation 2. [Read more](http://azure.microsoft.com/blog/2015/04/28/disaster-recovery-to-azure-enhanced-and-were-listening/).

### If I replicate to Azure how do I pay for Azure VMs? 

During regular replication, data is replicated to geo-redundant Azure storage and you don’t need to pay any Azure IaaS virtual machine charges, providing a significant advantage. When you run a failover to Azure, Site Recovery automatically creates Azure IaaS virtual machines, and after that you'll be billed for the compute resources that you consume in Azure.

### Can I manage disaster recovery for my branch offices with Site Recovery?

Yes. When you use Site Recovery to orchestrate replication and failover in your branch offices, you'll get a unified orchestration and view of all your branch office workloads in a central location. You can easily run failovers and administer disaster recovery  of all branches from your head office, without visiting the branches. 

### Is there an SDK I can use to automate the ASR workflow?

Yes. You can automate Site Recovery workflows using the Rest API, PowerShell, or the Azure SDK. Learn more in [Deploy Site Recovery with PowerShell](site-recovery-deploy-with-powershell.md).


## Security and compliance

### Is my data sent to the Site Recovery service?

No, Site Recovery doesn't intercept your application data or have any information about what's running on your virtual machines or physical servers.

Replication data is exchanged between Hyper-V hosts, VMware hypervisors, or physical servers in your primary and secondary datacenters, or between your datacenter and Azure storage. Site Recovery has no ability to intercept that data. Only the metadata needed to orchestrate replication and failover is sent to the Site Recovery service. 

Site Recovery is ISO 27001:2005-certified, and is in the process of completing its HIPAA, DPA, and FedRAMP JAB assessments.

### For compliance even metadata from our on-premises environments must remain within the same geographic region. Can Site Recovery help us?

Yes. When you create a Site Recovery vault in a region, we ensure that all metadata that we need to enable and orchestrate replication and failover remains within that region's geographic boundary.

### Does Site Recovery encrypt replication?
When replicating virtual machines and physical servers between on-premises sites encryption in transit is supported. When replicating virtual machines and physical servers between on-premises sites and Azure, both encryption in transit and encryption in Azure is supported. 




## Replication and failover

### If I replicate to Azure what kind of storage account do I need?

You'll need a storage account with [standard geo-redundant storage](../storage/storage-redundancy.md/#geo-redundant-storage). A [premium storage account](../storage/storage-premium-storage-preview-portal/) is only supported if you're replicating VMware virtual machines or Windows/Linux physical servers to Azure.   

Support for standard locally redundant storage is in backlog, send feedback about this feature in the [feedback forum](http://feedback.azure.com/forums/256299-site-recovery/suggestions/7204469-local-redundant-type-azure-storage-support).

### How often can I replicate data?
- **Hyper-V:** Hyper-V VMs can be replicated every 30 seconds, 5 minutes or 15 minutes. If you've set up SAN replication then replication with be synchronous.
- **VMware and physical servers:** A replication frequency isn't relevant here. Replication will be continuous. 

### Can I extend replication from existing recovery site to another tertiary site?
Extended or chained replication isn't supported. Send feedback about this feature in [feedback forum](http://feedback.azure.com/forums/256299-site-recovery/suggestions/6097959-support-for-exisiting-extended-replication).


### Can I do an offline replication the first time I replicate to Azure? 

This isn't supported. Send us feedback about this feature in the [feedback forum](http://feedback.azure.com/forums/256299-site-recovery/suggestions/6227386-support-for-offline-replication-data-transfer-from).


### Can I exclude specific disks from replication?

This isn't supported. Send us feedback about this feature in the [feedback forum](http://feedback.azure.com/forums/256299-site-recovery/suggestions/6418801-exclude-disks-from-replication).

### Can I replicate virtual machines with  dynamic disks?

Dynamic disks are supported when replicating Hyper-V virtual machines. They're not supported when replicating VMware virtual machines or physical servers. Send us feedback about this feature in the [feedback forum](http://feedback.azure.com/forums/256299-site-recovery).

### If I'm failing over to Azure how to I access the Azure virtual machines after failover? 

You can access the Azure VMs over a secure Internet connection or over a site-to-site VPN (or Azure ExpressRoute) if you have one. Communications over a VPN connection are to internal ports on the Azure network on which the VM is located. Communications over the internet are mapped to the public endpoints on the Azure cloud service for VMs. [Read more](site-recovery-network-design.md/#connectivity-after-failover)

### If I fail over to Azure how does Azure make sure my data is resilient?

Azure is designed for service resilience. Site Recovery is already engineered for failover to a secondary Azure datacenter in accordance with the Azure SLA if the need arises. If this happens we make sure your metadata and vaults remain within the same geographic region that you chose for your vault. 

### If I'm replicating between two datacenters what happens if my primary datacenter experiences an unexpected outage?

You can trigger an unplanned failover from the secondary site. Site Recovery doesn't need connectivity from the primary site to perform the failover.


### Is failover automatic?

Failover isn't automatic. You initiate failovers with single click in the portal, or you can use [Site Recovery PowerShell](https://msdn.microsoft.com/library/dn850420.aspx) to trigger a failover. Failing back is also a simple action in the Site Recovery portal. To automate you could use on-premises Orchestrator or Operations Manager to detect a virtual machine failure and then trigger the failover using the SDK.

### If I'm replicating Hyper-V VMs can I throttle bandwidth allotted for Hyper-V replication traffic?
- If you're replicating between Hyper-V VMs two on-premises sites then you can use Windows QoS. Here's a sample script: 

    	New-NetQosPolicy -Name ASRReplication -IPDstPortMatchCondition 8084 -ThrottleRate (2048*1024)
    	gpupdate.exe /force

- If you're replicating Hyper-V VMs to Azure then you can configure throttling using the following sample PowerShell cmdlet:

    	Set-OBMachineSetting -WorkDay $mon, $tue -StartWorkHour "9:00:00" -EndWorkHour "18:00:00" -WorkHourBandwidth (512*1024) -NonWorkHourBandwidth (2048*1024)



## Service Provider deployment

### Does Site Recovery work for dedicated or shared infrastructure models?
Yes, Site Recovery supports both dedicated and shared infrastructure models.

### Is the identity of my tenant shared with the Site Recovery service?
No. In fact, your tenants do not need access to the Site Recovery portal. Only the service provider administrator performs actions in the portal.


### Will my tenants' application data ever go to Azure?
When replicating between service provider-owned sites, application data never goes to Azure. Data is encrypted in transit and replicated directly between the service provider sites.

If you're replicating to Azure, application data is sent to Azure storage but not to the Site Recovery service. Data is encrypted in transit and remains encrypted in Azure. 

### Will my tenants receive a bill for any Azure services?

No. Azure's billing relationship is directly with the service provider. Service providers are responsible for generating specific bills for their tenants.

### If I'm replicating to Azure, do we need to run virtual machines in Azure at all times?

No, Data is replicated to a geo-redundant Azure storage account in your subscription. When you perform a test failover (DR drill) or an actual failover, Site Recovery automatically creates virtual machines in your subscription.

### Do you ensure tenant-level isolation when I replicate to Azure?

Yes.

### What platforms do you currently support?

We support Azure Pack, Cloud Platform System, and System Center based (2012 and higher) deployments. Learn more about Azure Pack and Site Recovery integration in [Configure protection for virtual machines](https://technet.microsoft.com/library/dn850370.aspx).

### Do you support single Azure Pack and single VMM server deployments?

Yes, you can replicate Hyper-V virtual virtual machines and Azure, or between service provider sites.  Note that if you replicate between service provider sites Azure runbook integration isn't available.


## Next steps

- Read the [Site Recovery overview](site-recovery-overview.md)
- Learn about [Site Recovery architecture](site-recovery-components.md)  

 
