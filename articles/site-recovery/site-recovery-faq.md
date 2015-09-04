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
	ms.date="08/26/2015" 
	ms.author="lauraa"/>


# Azure Site Recovery: Frequently asked questions
## About this article

This article includes frequently asked questions about Azure Site Recovery. For an introduction to Site Recovery and related deployment scenarios, read the [Site Recovery Overview](site-recovery-overview.md).

If you have other questions after reading this article, you can post them on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=hypervrecovmgr).


## General
### Is ASR secure? What data do you send to Azure?

Yes, ASR is secure. It neither intercepts your application data nor has any information about what is running inside your virtual machines. No Internet connectivity is needed, either from the Hyper-V hosts or the virtual machines.

Since replication is between your own enterprise and service provider sites, no application data is sent to Azure. Only metadata, such as VM or cloud names, that is needed to orchestrate failover, is sent to Azure. ASR does not have the ability to intercept your application data, and that data always remains on-premises.

ASR is ISO 27001:2005-certified, and is in the process of completing its HIPAA, DPA, and FedRAMP JAB assessments.

### Compliance requirements require that even metadata from our on-premises environments remains within the same geographic region. Can ASR ensure that we meet that requirement?

Yes. When you create a Site Recovery vault in a region of your choice, we ensure that all metadata that we need to enable and orchestrate your disaster recovery setup remains within that region's geographic boundary.

### Is there an SDK that I can use to automate the ASR workflow?

Yes. ASR workflows can be automated using Rest API, PowerShell, or Azure SDK. You can find more details in the blog post titled [Introducing PowerShell support for Azure Site Recovery](http://azure.microsoft.com/blog/2014/11/05/introducing-powershell-support-for-azure-site-recovery/).

### Does ASR encrypt the replication 
Between on-premises to Azure & between on-premises replication supports encryption in transit for *Hyper-V & VMM protection scenarios*. *Hyper-V & VMM protection* to Azure supports encryption at rest as well. Refer [this article](https://azure.microsoft.com/blog/2014/09/02/azure-site-recovery-privacy-security-part1/) for more information.

### Can I increase replication/copy frequency to higher than 15 mins?
* **Hyper-V & VMM scenarios**: No, Hyper-V virtual machine replication using Host based replication can only be configured for 30 secs, 5 mins and 15 mins
* **VMware/Physical scenario**: This isn't applicable for in-guest based replication because technology uses continuous data protection.

### Can I exclude specific disks from replication using ASR?
This isn't supported. Send us your feedback through [Azure Site Recovery Feedback Forum - Exclude disk from replication](http://feedback.azure.com/forums/256299-site-recovery/suggestions/6418801-exclude-disks-from-replication).

### Can I replicate dynamic disks based virtual machines?
*Hyper-V & VMM scenarios* supports dynamic disks. *VMware virtual machine or Physical machine scenarios* doesn't support dynamic disk. Send us your feedback through [Azure Site Recovery Feedback Forum](http://feedback.azure.com/forums/256299-site-recovery).

### What kind of storage accounts types are supported?
[Standard Geo-redundant storage](../storage/storage-redundancy.md#geo-redundant-storage) is supported. [Premium Storage Account]((../storage/storage-premium-storage-preview-portal/) is supported only for [VMware virtual machine or Physical machine scenarios](site-recovery-vmware-to-azure.md). Support for Standard locally redundant storage is in backlogs, send us your feedback through [Support for locally redundant storage support](http://feedback.azure.com/forums/256299-site-recovery/suggestions/7204469-local-redundant-type-azure-storage-support).

### Can I extend replication from existing recovery site to a tertiary site?
This isn't supported. Send us your feedback through [Azure Site Recovery Feedback Forum - Support for extending replication](http://feedback.azure.com/forums/256299-site-recovery/suggestions/6097959-support-for-exisiting-extended-replication).

### Can I seed the initial disks to Azure using offline mechanism?
This isn't supported. Send us your feedback through [Azure Site Recovery Feedback Forum - Support for offline replication](http://feedback.azure.com/forums/256299-site-recovery/suggestions/6227386-support-for-offline-replication-data-transfer-from).

## Version support

### What versions of Windows Server hosts and clusters are supported?
Windows Server 2012 and Windows Server 2012 R2 can be used when you choose Hyper-V Replica to enable replication and protection between Hyper-V Sites.


### What versions of Hyper-V guest operating systems are supported?
The most current list of supported guest operating systems is available in the topic titled [About Virtual Machines and Guest Operating Systems](https://technet.microsoft.com/library/cc794868%28v=ws.10%29.aspx).

### Can I configure virtual machine protection when Hyper-V is running on a client operating system?

You can't configure Hyper-V runing on a client operating system to replicate virtual machines to Azure. Hyper-V Replica is only supported on server operating systems. You can replicate your physical client computers to Azure using [this article](site-recovery-vmware-to-azure.md). 

### Does ASR support generation 2 machines?

Yes, ASR supports replication of generation 2 virtual machines on Hyper-V to Azure. ASR converts from generation 2 to generation 1 during failover. At failback the machine is converted back to generation 1. [Read more](http://azure.microsoft.com/blog/2015/04/28/disaster-recovery-to-azure-enhanced-and-were-listening/) for further information. 


## Deploy between service provider sites 

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
We support Azure Pack, Cloud Platform System, and System Center based Hyper 2012 and higher deployments. To learn more about the ASR and Azure Pack integration, see [Configure protection for virtual machines](https://technet.microsoft.com/library/dn850370.aspx).

### Do you also support single Azure Pack and single VMM server deployments?
Yes, single SCVMM deployments is supported for either scenarios – DR between service provider sites and DR between a service provider site and Azure.

Single Azure Pack deployment is also supported when you enable DR between service provider sites, however, ASR Runbook integration is not available for this topology.

## Deploy between Hyper-V sites and Azure (without VMM)

### Does ASR require that you enable site-to-site VPN?
No, it is not mandatory; ASR works over the public Internet as well. However, if you have configured site-to-site VPN, you will be able to access the failed over virtual machines in the same manner as before. For more information about networking considerations when enabling Disaster Recovery to Azure, see the [Networking Infrastructure Setup for Microsoft Azure as a Disaster Recovery Site blog](http://azure.microsoft.com/blog/2014/09/04/networking-infrastructure-setup-for-microsoft-azure-as-a-disaster-recovery-site/).

### Do I need to pay anything in addition to the ASR Protection charge?
In steady state, we replicate changes to Geo-Redundant Azure Storage and you don’t need to pay any Azure IaaS virtual machine charges (a significant advantage). When you perform a failover to Azure, ASR automatically creates Azure IaaS virtual machines, after which you are billed for the compute resources that you consume in Azure.

### I have a branch office where I don’t have VMM installed. Can I enable protection of the workloads in the branch office to Azure? What are the key benefits of using ASR to do that?
Yes, you can use ASR to protect virtual machines running on the Hyper-V hosts that are not managed by SCVMM.

When you use ASR to manage the disaster recovery needs of all your branch offices, you get a unified view of all your branch office workloads in one central location. You also achieve one-click failover and disaster recovery administration of all branches from your head office, without ever going to the branch. Currently, networking mapping and encryption-at-rest are not supported for branch office disaster recovery.

### For the branch offices, is there a limit on the number of virtual machines that I can protect?
No. Support remains the same as it does in our enterprise scenario.

### Do I need to install an agent on the virtual machines I want to protect?

You don't need an agent on the virtual machines. You need to install the Site Recovery Provider and the Recovery Services Agent on each Hyper-V server running virtual machines you want to protect. These two components are installed with a single Provider file that can be downloaded during Site Recovery deployment.

### Does the Provider running on the Hyper-V server need any special firewall settings?

No specific setting is required. The Provider components on the server communicate over an HTTPS connection to Azure and use the default internet setting on the Hyper-V host server unless otherwise specified. 

### Does the Hyper-V server need to be a domain member?

No the server doesn't need to be in a domain

### What versions of Windows Server hosts and clusters are supported?
Windows Server 2012 and Windows Server 2012 R2 can be used when using ASR and Hyper-V replication between a Hyper-V sites and Azure.

### What versions of guest operating systems are supported?
The most current list of supported guest operating systems is available in the article titled [About Virtual Machines and Guest Operating Systems](https://technet.microsoft.com/library/cc794868%28v=ws.10%29.aspx).

## Deploy between two VMM datacenters

### Can I replicate a virtual machine that's been replicated to a secondary site into Azure? 

No, this type of chained replication isn't supported

### Do I need certificates to configure protection between two VMM datacenters?

No. While configuring protection between VMM clouds in ASR specify the authentication type. Select HTTPS unless you have a working Kerberos environment configured. Azure Site Recovery will automatically configure certificates for HTTPS authentication. No manual configuration is required. If you do select Kerberos, a Kerberos ticket will be used for mutual authentication of the host servers. By default, port 8083 (for Kerberos) and 8084 (for certificates) will be opened in the Windows Firewall on the Hyper-V host servers. Note that this setting is only relevant for Hyper-V host servers running on Windows Server 2012 R2.



## Deploy between two VMM datacenters with SAN

### What if I already have a SAN-based replication set up and I don't want to change it?
No problem. ASR supports the scenario where replication may already be set up, in which case, you can leverage ASR for virtual machine-centric disaster recovery orchestration, configuration of disaster recovery networking, application-aware recovery plans, disaster recovery drills, and your compliance and audit reporting requirements.


### Do I need VMM? Do I need VMM on both sides?
Yes. We need the SAN array to be brought under management by VMM using an array-specific SMI-S provider.

We support single VMM HA deployments based on the array type, though the recommended configuration is to use separate VMM servers to manage the sites.


### What are the supported storage arrays?

NetApp, EMC and HP have enabled support for Azure Site Recovery SAN replication with updates to their SMI-S providers. For more details see below links.

- [NetApp Clustered Data ONTAP 8.2](http://community.netapp.com/t5/Technology/NetApp-Unveils-Support-for-Microsoft-Azure-SAN-Replication-with-SMI-S-and/ba-p/94483)
- [EMC VMAX series](https://thecoreblog.emc.com/high-end-storage/microsoft-azure-site-recovery-now-generally-available-vmax-srdf-integration-pack-ready-for-public-review/)    
- [HP 3PAR](http://h20195.www2.hp.com/V2/GetDocument.aspx?docname=4AA5-7068ENW&cc=us&lc=en)


### What if I'm not sure about my storage admin?
We work with existing replication set up by your storage administrator, which means that the storage administrator does not need to make any changes on their arrays. However, organizations that want to automate their storage management through SCVMM can also provision storage using ASR and VMM.

### Can I support synchronous replication? Guest clusters? Shared storage?
Yes, yes, and yes!

### Net-net: What do I need to install on-premises to get this working?
When using (SAN) array-based replication to enable replication and protection between Hyper-V Sites, all you need is the ASR DR Provider to be installed on the SCVMM Server(s). Remember that this is also the *only* host that needs connectivity to the Internet.


Your arrays also need to be discovered by SCVMM using an updated SMI-S provider that is made available by your respective storage vendors.

## Deploy between physical servers and Azure

### Can I protect my physical on-premises server to Azure?

Yes, you can replicate a physical server using ASR and run it as VM in Azure in the event that your on-premises server goes down. Failback to an on-premises physical server isn't currently supported. You can fail back to a virtual machine running on Hyper-V or VMware.


## Failover

### What if Azure is down? Can I trigger a failover from VMM?

While Azure is designed for service resilience, we like to plan for the worst. ASR is already engineered for failover to a secondary Azure datacenter in accordance with the Azure SLA. We also ensure that even when this happens, your metadata and ASR Vault remain within the same geographic region in which you chose to your vault.


### What if my ISP for the primary datacenter also experiences an outage during a disaster? What if my ISP for the secondary datacenter also experiences an outage?

You can use the ASR portal to perform an unplanned failover with a single click. No connectivity from your primary datacenter is needed to perform the failover.

It's likely that applications that need to be running in your secondary datacenter after a failover will need some form of Internet connectivity. ASR assumes that even though the primary site and ISP may be impacted during a disaster, the secondary site’s SCVMM server is still connected to ASR.

### Does ASR support failback?
Yes. Failing back from Azure back to your on-premises site is simple using the one-click process through the ASR portal.

### Is automatic failover possible?

There's no automatic failover option. You can either hit a single button in the portal to trigger a failover, or you can use [Site Recovery PowerShell](https://msdn.microsoft.com/library/dn850420.aspx) to trigger a failover. You use on-premises Orchestrator or Operations Manager to witness a virtual machine failure and then decide to trigger the failover using the SDK. This makes it an automatic process.




## Monitoring

### What solutions do you provide for me to monitor my setup and ongoing replication?
You can subscribe to email alerts directly from the ASR service to be notified about any issues that need attention. You can also monitor ongoing replication health using SCOM.

## Next steps

To start deploying ASR:

- [Set up protection between an on-premises VMM site and Azure](site-recovery-vmm-to-azure.md) 
- [Set up protection between an on-premises Hyper-V site and Azure](site-recovery-hyper-v-site-to-azure.md) 
- [Set up protection between two on-premises VMM sites](site-recovery-vmm-to-vmm.md) 
- [Set up protection between two on-premises VMM sites with SAN](site-recovery-vmm-san.md) 
- [Set up protection with a single VMM server](site-recovery-single-vmm.md) 

 