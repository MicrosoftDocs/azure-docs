<properties 
	pageTitle="Azure Site Recovery: Frequently asked questions" 
	description="This article discusses popular questions about using Azure Site Recovery." 
	services="site-recovery" 
	documentationCenter=""
	authors="csilauraa"
	manager="jwhit"
	editor="tysonn"/>

<tags 
	ms.service="site-recovery"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na" 
	ms.workload="storage-backup-recovery"
	ms.date="05/12/2014" 
	ms.author="lauraa"/>


# Azure Site Recovery: Frequently asked questions
## About this article

This article includes frequently asked questions about Azure Site Recovery. For an introduction to Site Recovery and related deployment scenarios, read the [Site Recovery Overview](hyper-v-recovery-manager-overview.md).

If you have other questions after reading this article, you can post them on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=hypervrecovmgr).


## Between enterprise Hyper-V sites: Hyper-V replica
### Is Azure Site Recovery secure? What data do you send to Azure?

Yes, Azure Site Recovery (ASR) is secure. ASR neither intercepts your application data nor has any information about what is running inside your virtual machines. No Internet connectivity is needed, either from the Hyper-V hosts or the virtual machines.

Since replication is between your own enterprise and service provider sites, no application data is sent to Azure. Only metadata, such as VM or cloud names, that is needed to orchestrate failover, is sent to Azure. ASR does not have the ability to intercept your application data, and that data always remains on-premises.

Azure Site Recovery is ISO 27001:2005-certified, and is in the process of completing its HIPAA, DPA, and FedRAMP JAB assessments.

### Compliance requirements require that even metadata from our on-premises environments remains within the same geographic region. Can Azure Site Recovery ensure that we meet that requirement?

Yes. When you create an ASR Vault in a region of your choice, we ensure that all metadata that we need to enable and orchestrate your disaster recovery setup remains within that region's geographic boundary.

### What if Azure is down? Can I trigger a failover from SCVMM?
While Azure is designed for service resilience, we like to plan for the worst. ASR is already engineered for failover to a secondary Azure datacenter in accordance with the Azure SLA. We also ensure that even when this happens, your metadata and ASR Vault remain within the same geographic region in which you chose to your vault.


### What if my ISP for the primary datacenter also experiences an outage during a disaster? What if my ISP for the secondary datacenter also experiences an outage?
You can use the ASR portal to perform an unplanned failover with a single click. No connectivity from your primary datacenter is needed to perform the failover.

It's likely that applications that need to be running in your secondary datacenter after a failover will need some form of Internet connectivity. ASR assumes that even though the primary site and ISP may be impacted during a disaster, the secondary site’s SCVMM server is still connected to ASR.


### Is there an SDK that I can use to automate the ASR workflow?
Yes. ASR workflows can be automated using Rest API, PowerShell, or Azure SDK. You can find more details in the blog post titled [Introducing PowerShell support for Azure Site Recovery](http://azure.microsoft.com/blog/2014/11/05/introducing-powershell-support-for-azure-site-recovery/).

### What solutions do you provide for me to monitor my setup and ongoing replication?
You can subscribe to email alerts directly from the ASR service to be notified about any issues that need attention. You can also monitor ongoing replication health using SCOM.

### What versions of Windows Server hosts and clusters are supported?
Windows Server 2012 and Windows Server 2012 R2 can be used when you choose Hyper-V Replica to enable replication and protection between Hyper-V Sites.


### What versions of guest operating systems are supported?
The most current list of supported guest operating systems is available in the topic titled [About Virtual Machines and Guest Operating Systems](https://technet.microsoft.com/en-us/library/cc794868%28v=ws.10%29.aspx).


## Between enterprise Hyper-V sites: SAN storage array-based replication
### What if I already have a SAN-based replication set up and I don't want to change it?
No problem. ASR supports the scenario where replication may already be set up, in which case, you can leverage ASR for virtual machine-centric disaster recovery orchestration, configuration of disaster recovery networking, application-aware recovery plans, disaster recovery drills, and your compliance and audit reporting requirements.


### Do I need SCVMM? Do I need SCVMM on both sides?
Yes. We need the SAN array to be brought under management by SCVMM using an array-specific SMI-S provider.

We support single SCVMM HA deployments based on the array type, though the recommended configuration is to use separate SCVMM servers to manage the sites.


### What if I'm not sure about my storage admin?
We work with existing replication set up by your storage administrator, which means that the storage administrator does not need to make any changes on their arrays. However, organizations that want to automate their storage management through SCVMM can also provision storage using ASR and SCVMM.

### Can I support synchronous replication? Guest clusters? Shared storage?
Yes, yes, and yes!

### Net-net: What do I need to install on-premises to get this working?
When using (SAN) array-based replication to enable replication and protection between Hyper-V Sites, all you need is the ASR DR Provider to be installed on the SCVMM Server(s). Remember that this is also the *only* host that needs connectivity to the Internet.


Your arrays also need to be discovered by SCVMM using an updated SMI-S provider that is made available by your respective storage vendors.

## Between service provider sites: 

### Does this solution work for dedicated or shared infrastructure models?
Yes, ASR supports both dedicated and shared infrastructure models.

### Is the identity of my tenant shared with Azure?
No. In fact, your tenants do not need access to the ASR portal. Only the service provider administrator performs actions on the ASR portal in Azure.

### Will my tenants receive a bill from Azure?
No. Microsoft Azure's billing relationship remains directly with the service provider. Service providers are responsible for generating specific bills for their tenants.

### Will my tenants application data ever go to Azure?
When using a service provider-owned site for DR, application data never goes to Azure. Data is encrypted and replicated directly between the service provider sites.
When using Azure as a DR Site, application data is sent to Azure – Data at-rest and in-transit remains encrypted. You can also use VPN, ExpressRoute, or Public Internet to establish connectivity to Azure.

### When using Azure as a DR site, do we need to run virtual machines in Azure at all times?
No, ASR is designed as a first-class, public cloud DRaaS solution. Data is replicated to a geo-redundant Azure storage account in your own subscription. When you perform a DR drill or an actual failover, ASR automatically creates virtual machines in your subscription.

### Do you ensure tenant-level isolation when I choose to use Azure as a DR site?
Yes.

### What platforms do you currently support?
We support Azure Pack, Cloud Platform System, and System Center based Hyper 2012 and higher deployments. To learn more about the ASR and Azure Pack integration, see [Configure protection for virtual machines](https://technet.microsoft.com/en-us/library/dn850370.aspx).

### Do you also support single Azure Pack and single SCVMM deployments?
Yes, single SCVMM deployments is supported for either scenarios – DR between service provider sites and DR between a service provider site and Azure.

Single Azure Pack deployment is also supported when you enable DR between service provider sites, however, ASR Runbook integration is not available for this topology.

## Between Hyper-V site and Azure (SCVMM is optional)

### Does ASR support failback?
Yes. Failing back from Azure back to your on-premises site is simple using the one-click process through the ASR portal.

### Does ASR require that you enable site-to-site VPN?
No, it is not mandatory; ASR works over the public Internet as well. However, if you have configured site-to-site VPN, you will be able to access the failed over virtual machines in the same manner as before. For more information about networking considerations when enabling Disaster Recovery to Azure, see the [Networking Infrastructure Setup for Microsoft Azure as a Disaster Recovery Site blog](http://azure.microsoft.com/blog/2014/09/04/networking-infrastructure-setup-for-microsoft-azure-as-a-disaster-recovery-site/).

### Do I need to pay anything in addition to the ASR Protection charge?
In steady state, we replicate changes to Geo-Redundant Azure Storage and you don’t need to pay any Azure IaaS virtual machine charges (a significant advantage). When you perform a failover to Azure, ASR automatically creates Azure IaaS virtual machines, after which you are billed for the compute resources that you consume in Azure.

### I have a branch office where I don’t have SCVMM installed. Can I enable protection of the workloads in the branch office to Azure? What are the key benefits of using ASR to do that?
Yes, you can use ASR to protect virtual machines running on the Hyper-V hosts that are not managed by SCVMM.

When you use ASR to manage the disaster recovery needs of all your branch offices, you get a unified view of all your branch office workloads in one central location. You also achieve one-click failover and disaster recovery administration of all branches from your head office, without ever going to the branch. Currently, networking mapping and encryption-at-rest are not supported for branch office disaster recovery.

### For the branch offices, is there a limit on the number of virtual machines that I can protect?
No. Support remains the same as it does in our enterprise scenario.

### What versions of Windows Server hosts and clusters are supported?
Windows Server 2012 and Windows Server 2012 R2 can be used when you choose Hyper-V Replica to enable replication and protection between Hyper-V Sites.


### What versions of guest operating systems are supported?
The most current list of supported guest operating systems is available in the article titled [About Virtual Machines and Guest Operating Systems](https://technet.microsoft.com/en-us/library/cc794868%28v=ws.10%29.aspx).

## Next steps

To start deploying ASR:

- [Set up protection between an on-premises VMM site and Azure](site-recovery-vmm-to-azure.md) 
- [Set up protection between an on-premises Hyper-V site and Azure](site-recovery-hyper-v-site-to-azure) 
- [Set up protection between two on-premises VMM sites](site-recovery-vmm-to-vmm) 
- [Set up protection between two on-premises VMM sites with SAN](site-recovery-vmm-san) 
- [Set up protection with a single VMM server](site-recovery-single-vmm) 

