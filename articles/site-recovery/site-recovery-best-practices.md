<properties
	pageTitle="Prepare for Azure Site Recovery deployment"
	description="Azure Site Recovery coordinates the replication, failover and recovery of virtual machines and physical servers located on on-premises servers to Azure or to a secondary datacenter."
	services="site-recovery"
	documentationCenter=""
	authors="rayne-wiselman"
	manager="jwhit"
	editor="tysonn"/>

<tags
	ms.service="site-recovery"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.tgt_pltfrm="na"
	ms.workload="storage-backup-recovery"
	ms.date="12/07/2015"
	ms.author="raynew"/>

# Prepare for Azure Site Recovery deployment

## About this article

This article describes how to prepare for your Azure Site Recovery deployment. If you have any questions after reading this article post them on the [Azure Recovery Services forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr). 

## Protecting Hyper-V virtual machines

You have a couple of deployment choices for protecting Hyper-V virtual machines. You can replicate on-premises Hyper-VMs to Azure, or  to a secondary datacenter. There are different requirements for each deployment.

**Requirement** | **Replicate to Azure (with VMM)** | **Replicate Hyper-V VMs to Azure (no VMM)** | **Replicate Hyper-V VMs to secondary site (with VMM)** | **Details**
---|---|---|---|---
**VMM** | VMM running on System Center 2012 R2 <br/><br/>At least one VMM cloud that contains one or more VMM host groups. | NA | VMM servers in the primary and secondary sites running on at least System Center 2012 SP1 with latest updates. <br/><br/> At least one cloud on each VMM server. Clouds should have the Hyper-V capacity profile set.<br/><br/> The source cloud should have at least one VMM host group. | Optional. You don't need to have System Center VMM deployed in order to replicate Hyper-V virtual machines to Azure but if you do you'll need to make sure the VMM server is set up properly. That includes making sure you're running the right VMM version, and that clouds are set up.
**Hyper-V** | At least one Hyper-V host server in the on-premises datacenter running at least Windows Server 2012 R2 | At least one Hyper-V server in the source and target sites running at least Windows Server 2012 R2, and connected to the internet.<br/><br/> The Hyper-V servers must be in a host group in a VMM cloud. | At least one Hyper-V server in the source and target sites running at least Windows Server 2012 with the latest updates installed, and connected to the internet.<br/><br/> The Hyper-V servers must be located in a host group in a VMM cloud. | 
**Virtual machines** | At least one VM on the source Hyper-V host server | At least one VM on the Hyper-V host server in the source VMM cloud | At least one VM on the Hyper-V host server in the source VMM cloud. |  VMs replicating to Azure must conform with [Azure virtual machine prerequisites](site-recovery-best-practices.md/#virtual-machines)
**Azure account** | You'll need an [Azure](http://azure.microsoft.com/) account and a subscription to the Site Recovery service. | You'll need an [Azure](http://azure.microsoft.com/) account and a subscription to the Site Recovery service. | NA | If you don't have an account, start with a [free trial](pricing/free-trial/). Read about [pricing](pricing/details/site-recovery/) for the service.
**Azure storage** | You'll need a subscription for an Azure storage account that has geo-replication enabled. | You'll need a subscription for an Azure storage account that has geo-replication enabled. | NA | The account should be in the same region as the Azure Site Recovery vault and be associated with the same subscription. [Read more about storage](../storage/storage-introduction.md).
**Storage mapping** | NA | NA | You can optionally set up storage mapping to make sure that virtual machines are optimally connected to storage after failover. When you replicate between two on-premises VMM sites, by default the replica virtual machine will be stored on the located indicated on the target Hyper-V host server. You can configure mapping between VMM storage classifications on source and target VMM servers.  | To use this feature you'll need storage classifications set up before you begin deployment. [Read more](site-recovery-storage-mapping.md).
**SAN replication** | NA | NA | If you want to replicate between two on-premises VMM sites with SAN replication, you can use your existing SAN environment. | You'll need a [supported SAN array](http://social.technet.microsoft.com/wiki/contents/articles/28317.deploying-azure-site-recovery-with-vmm-and-san-supported-storage-arrays.aspx), and SAN storage must be discovered and classified in VMM.<br/><br/>If you aren't currently replicating you'll need to create LUNs and allocate storage in the VMM console. If you're already replicating you can skip this step.
**Networking** | Set up network mapping to ensure that all machines that fail over on the same Azure network can connect to each other, irrespective of which recovery plan they are in. In addition if a network gateway is configure on the target Azure network, virtual machines can connect to other on-premises virtual machines. If you don't set up network mapping only machines that fail over in the same recovery plan can connect. | NA |  <br/><br/>Set up network mapping to ensure that virtual machines are connected to appropriate networks after failover, and that replica virtual machines are optimally placed on Hyper-V host servers. If you don't configure network mapping replicated machines won't be connected to any VM network after failover. | [Read more](site-recovery-network-mapping) about network mapping. <br/><br/> To set up network mapping with VMM you'll need to make sure that VMM logical and VM networks are configured correctly. [Learn more](http://blogs.technet.com/b/scvmm/archive/2013/02/14/networking-in-vmm-2012-sp1-logical-networks-part-i.aspx) and [VM networks](https://technet.microsoft.com/library/jj721575.aspx). In addition read about [network considerations for VMM](site-recovery-network-design.md/#vmm-design).  
**Providers and agents** | During deployment you'll install the Azure Site Recovery Provider on VMM servers. On Hyper-V servers in VMM clouds you'll install the Azure Recovery Services agent. | During deployment you'll install both the Azure Site Recovery Provider and the Azure Recovery Services agent on the Hyper-V host server or cluster| During deployment you'll install the Azure Site Recovery Provider on VMM servers. On Hyper-V servers in VMM clouds you'll install the Azure Recovery Services agent. | Providers and agents connect to Site Recovery over the internet using an encrypted HTTPS connection. You don't need to add firewall exceptions or create a specific proxy for the Provider connection, but if you do want to use a custom proxy you should allow these URLs through the firewall before you begin deployment: <br/><br/>  *.hypervrecoverymanager.windowsazure.com <br/><br/> *.accesscontrol.windows.net<br/><br/> *.backup.windowsazure.com <br/><br/> *.blob.core.windows.net <br/><br/>*.store.core.windows.net
**Internet connectivity** | Only the VMM servers need an internet connection | Only the Hyper-V host servers need an internet connection | Only VMM servers need an internet connection | Virtual machines don't need anything installed on them and don't connect directly to the internet.



## Protect VMware virtual machines or physical servers

You have a couple of deployment choices for protecting VMware virtual machines or Windows/Linux physical servers. You can replicate them to Azure, or  to a secondary datacenter. There are different requirements for each deployment.

**Requirement** | **Replicate VMware VMs/physical servers to Azure)** | * **Replicate VMware VMs/physical servers to secondary site**  
---|---|--- 
**Primary site** | **Process server**: a dedicated Windows server (physical or virtual) | **Process server**: a dedicated Windows server (physical or VMware virtual machine<br/><br/>  
**Secondary on-premises site** | NA | **Configuration server**: a dedicated Windows server (physical or virtual) <br/><br/> **Master target server**: a dedicated server (physical or virtual). Configure with Windows to protect Windows machines, or Linux to protect Linux.
**Azure** | **Subscription**: You'll need a subscription for the Site Recovery service. Read about [pricing](pricing/details/site-recovery/) <br/><br/> **Storage account**: You'll need a storage account with geo-replication enabled. The account should be in the same region as the Site Recovery vault and be associated with the same subscription. [Read more](../storage/storage-introduction.md).<br/><br/> **Configuration server**: You'll need to set up the configuration server as an Azure VM <br/><br/> **Master target server**: You'll need to set up the master target server as an Azure VM <br/><br/> Configure with Windows to protect Windows machines, or Linux to protect Linux.<br/><br/> **Azure virtual network**:  You'll need an Azure virtual network on which the configuration server and master target server will be deployed. It should be in the same subscription and region as the Azure Site Recovery vault | NA  
**Virtual machines/physical servers** | At least one VMware virtual machine or physical Windows/Linux server.<br/><br/>During deployment the Mobility service will be installed on each machine| At least one VMware VM or physical Windows/Linux server.<br/><br/> During deployment the Unified agent is installed on each machine.




## Azure virtual machine requirements

You can deploy Site Recovery to replicate virtual machines and physical servers running any operating system supported by Azure. This includes most versions of Windows and Linux. You will need to make sure that on-premises virtual machines that you want to protect conform with Azure requirements.


**Feature** | **Support** | **Details**
---|---|---
Hyper-V host operating system | Windows Server 2012 R2 | Prerequisites check will fail if unsupported
VMware hypervisor operating system | Running a supported operating system | [Details](site-recovery-vmware-to-azure.md/#before-you-start) 
Guest operating system |  For Hyper-V to Azure replication Site Recovery supports all operating systems that are [supported by Azure](https://technet.microsoft.com/library/cc794868%28v=ws.10%29.aspx). <br/><br/> For VMware and physical server replication check the Windows and Linux [prerequisites](site-recovery-vmware-to-azure.md/#before-you-start) | Prerequisites check will fail if unsupported. 
Guest operating system architecture | 64-bit | Prerequisites check will fail if unsupported
Operating system disk size |  Up to 1023 GB | Prerequisites check will fail if unsupported
Operating system disk count | 1 | Prerequisites check will fail if unsupported. 
Data disk count | 16 or less (maximum value is a function of the size of the virtual machine being created. 16 = XL) | Prerequisites check will fail if unsupported
Data disk VHD size | Upto 1023 GB | Prerequisites check will fail if unsupported
Network adapters | Multiple adapters are supported |
Static IP address | Supported | If the primary virtual machine is using a static IP address you can specify the static IP address for the virtual machine that will be created in Azure
iSCSI disk | Not supported | Prerequisites check will fail if unsupported
Shared VHD | Not supported | Prerequisites check will fail if unsupported
FC disk | Not supported | Prerequisites check will fail if unsupported
Hard disk format| VHD <br/><br/> VHDX | Although VHDX isn't currently supported in Azure, Site Recovery automatically converts VHDX to VHD when you fail over to Azure. When you fail back to on-premises the virtual machines continue to use the VHDX format.
Virtual machine name| Between 1 and 63 characters. Restricted to letters, numbers, and hyphens. Should start and end with a letter or number | Update the value in the virtual machine properties in Site Recovery
Virtual machine type | <p>Generation 1</p> <p>Generation 2 - Windows</p> |  Generation 2 virtual machine with OS disk type of Basic Disk which includes 1 or 2 Data volumes with disk format as VHDX which is less than 300GB is supported. Linux Generation 2 virtual machines are not supported. [Read more information](http://azure.microsoft.com/blog/2015/04/28/disaster-recovery-to-azure-enhanced-and-were-listening/)



## Optimizing your deployment

Use the following tips to help you optimize and scale your deployment.

- **Operating system volume size**: When you replicate a virtual machine to Azure the operating system volume must be less than 1TB. If you have more volumes than this you can manually move them to a different disk before you start deployment.
- **Data disk size**: If you're replicating to Azure you can have up to 32 data disks on a virtual machine, each with a maximum of 1 TB. You can effectively replicate and fail over a ~32 TB virtual machine.
- **Recovery plan limits**: Site Recovery can scale to thousands of virtual machines. Recovery plans are designed as a model for applications that should fail over together so we limit the number of machines in a recovery plan to 50.
- **Azure service limits**: Every Azure subscription comes with a set of default limits on cores, cloud services etc. We recommend that you run a test failover to validate the availability of resources in your subscription. You can modify these limits via Azure support.
- **Capacity planning**: Read the [capacity planner](http://www.microsoft.com/download/details.aspx?id=39057) if you're replicating Hyper-V VMs.
- **Replication bandwidth**: If you're short on replication bandwidth note that:
	- **ExpressRoute**: Site Recovery works with Azure ExpressRoute and WAN optimizers such as Riverbed. [Read more](http://blogs.technet.com/b/virtualization/archive/2014/07/20/expressroute-and-azure-site-recovery.aspx) about ExpressRoute.
	- **Replication traffic**: Site Recovery uses performs a smart initial replication using only data blocks and not the entire VHD. Only changes are replicated during ongoing replication.
	- **Network traffic**: You can control network traffic used for replication by setting up [Windows QoS](https://technet.microsoft.com/library/hh967468.aspx) with a policy based on the destination IP address and port.  In addition if you're replicating to Azure Site Recovery using the Azure Backup agent. You can configure throttling for that agent. [Read more](https://support.microsoft.com/kb/3056159).
- **RTO**: If you want to measure the recovery time objective (RTO) you can expect with Site Recovery we suggest you run a test failover and view the Site Recovery jobs to analyze how much time it takes to complete the operations. If you're failing over to Azure, for the best RTO we recommend that you automate all manual actions by integrating with Azure automation and recovery plans.
- **RPO**: Site Recovery supports a near-synchronous recovery point objective (RPO) when you replicate to Azure. This assumes sufficient bandwith between your datacenter and Azure.





## Next steps

After reviewing these best practices you can start deploying Site Recovery:

- [Set up protection between an on-premises VMM site and Azure](site-recovery-vmm-to-azure.md)
- [Set up protection between an on-premises Hyper-V site and Azure](site-recovery-hyper-v-site-to-azure.md)
- [Set up protection between two on-premises VMM sites](site-recovery-vmm-to-vmm.md)
- [Set up protection between two on-premises VMM sites with SAN](site-recovery-vmm-san.md)
- [Set up protection with a single VMM server](site-recovery-single-vmm.md)
 
