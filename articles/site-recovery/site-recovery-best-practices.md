<properties
	pageTitle="Prepare for Site Recovery deployment | Microsoft Azure"
	description="This article describes how to get ready to deploy replication with Azure Site Recovery."
	services="site-recovery"
	documentationCenter=""
	authors="rayne-wiselman"
	manager="jwhit"
	editor="tysonn"/>

<tags
	ms.service="site-recovery"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="storage-backup-recovery"
	ms.date="07/06/2016"
	ms.author="raynew"/>

# Prepare for Azure Site Recovery deployment

Read this article for a high level overview of the deployment requirements for each replication scenario supported by the Azure Site Recovery service. After you read the general requirements for each scenario, you can link to specific deployment details for each deployment.

After reading this article post any comments or questions at the bottom of the article, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

## Overview

Organizations need a BCDR strategy that determines how apps, workloads, and data stay running and available during planned and unplanned downtime, and recover to normal working conditions as soon as possible. Your BCDR strategy should keep business data safe and recoverable, and ensure that workloads remain continuously available when disaster occurs. 

Site Recovery is an Azure service that contributes to your BCDR strategy by orchestrating replication of on-premises physical servers and virtual machines to the cloud (Azure) or to a secondary datacenter. When outages occur in your primary location, you fail over to the secondary location to keep apps and workloads available. You fail back to your primary location when it returns to normal operations. Learn more in [What is Site Recovery?](site-recovery-overview.md)

## Select your deployment model

Azure has two different [deployment models](../resource-manager-deployment-model.md) for creating and working with resources: the Azure Resource Manager model and the classic services management model. Azure also has two portals – the [Azure classic portal](https://manage.windowsazure.com/) that supports the classic deployment model, and the [Azure portal](https://ms.portal.azure.com/) with support for both deployment models.

Site Recovery is available in both the classic portal and the Azure portal. In the Azure classic portal you can support Site Recovery with the classic services management model. In the Azure portal you can support the classic model or Resource Manager deployments. [Read more](site-recovery-overview.md#site-recovery-in-the-azure-portal) about deploying with the Azure portal.

When you're choosing a deployment model note that:

- We recommend you use the [Azure portal](https://portal.azure.com) and the Resource Manager model where possible.
- Site Recovery provides a simpler and more intuitive getting started experience in the Azure portal.
- Using the Azure portal, you can replicate machines to both classic and Resource Manager storage in Azure. In addition, in the Azure portal you can use LRS or GRS storage accounts.
- The Azure portal combines the Site Recovery and Backup services into a single Recovery Services vault so that you can set up and manage BCDR services from a single location.
- Users with Azure subscriptions provisioned with the Cloud Solution Provider (CSP) program can now manage Site Recovery operations in the Azure portal.
- Replicating VMware VMs or physical machines to Azure in the Azure portal provides a number of new features including support for premium storage and the ability to excluding specific disks from replication.


## Select your deployment scenario

**Deployment** | **Details** | **Azure portal** | **Classic portal** | **PowerShell**
---|---|---|---|---
**VMware VMs to Azure** | Replicate VMware VMs to Azure storage | In the Azure portal VMs can fail over to classic or Resource Manager storage<br/><br/> Deployment in the [Azure portal](site-recovery-vmware-to-azure.md) provides a streamlined deployment experience and a number of feature benefits. | In the Azure classic portal you can deploy with the [enhanced model](site-recovery-vmware-to-azure-classic.md) and fail over to classic Azure storage.<br/><br/> There's also a legacy model that shouldn't be used for new deployments. |  PowerShell isn't currently supported.
**Hyper-V VMs to Azure** | Hyper-V VMs to Azure storage. VMs can be on Hyper-V hosts managed in System Center VMM clouds, or without VMM. | In the Azure portal VMs can fail over to classic or Resource Manager storage.<br/><br/> The Azure portal provides a streamlined deployment experience. [Learn more](site-recovery-vmm-to-azure.md) about replicating Hyper-V VMs in VMM clouds. [Learn more](site-recovery-hyper-v-site-to-azure.md) about replicating Hyper-V VMs (without VMM).| In the classic Azure portal you can fail VMs over to classic Azure storage | PowerShell deployment is supported.
**Physical servers to Azure** | Replicate physical Windows/Linux servers to Azure storage | In the Azure portal servers can fail over to classic or Resource Manager storage.<br/><br/> Deployment in the [Azure portal](site-recovery-vmware-to-azure.md) provides an streamlined deployment experience and a number of feature benefits. | In the Azure classic portal you can deploy with the [enhanced model](site-recovery-vmware-to-azure-classic.md) and fail over to classic Azure storage.<br/><br/> There's also a legacy model that shouldn't be used for new deployments. | PowerShell deployment isn't currently supported.
**VMware VMs/physical servers to secondary site* | Replicate VMware VMs or physical Windows/Linux servers to a secondary site. [Learn more and download](http://download.microsoft.com/download/E/0/8/E08B3BCE-3631-4CED-8E65-E3E7D252D06D/InMage_Scout_Standard_User_Guide_8.0.1.pdf) the InMage Scout user guide. | Not available in the Azure portal | In the classic portal you'll download InMage Scout from a Site Recovery vault. | PowerShell deployment isn't currently supported
**Hyper-V VMs to a secondary site** | Replicate Hyper-V VMs in VMM clouds to a secondary cloud | In the [Azure portal](site-recovery-vmm-to-vmm.md) you can replicate Hyper-V VMs in VMM clouds to a secondary site using Hyper-V Replica only. SAN isn't currently supported. | In the Azure classic portal you can replicate Hyper-V VMs in VMM clouds to a secondary site using [Hyper-V Replica](site-recovery-vmm-to-vmm-classic.md) or [SAN replication](site-recovery-vmm-san.md) | PowerShell deployment is supported



## Check what you need for deployment

### Replicate to Azure

**Requirement** | **Details** 
---|---
**Azure account** | You'll need a [Microsoft Azure](http://azure.microsoft.com/) account.<br/><br/> You can start with a [free trial](https://azure.microsoft.com/pricing/free-trial/). [Learn more](https://azure.microsoft.com/pricing/details/site-recovery/) about Site Recovery pricing.
**Azure storage** | Replicated data is stored in Azure storage and Azure VMs are created when failover occurs. To replicate to Azure, you'll need an [Azure storage account](../storage/storage-introduction.md).<br/><br/>If you're deploying Site Recovery in the classic portal you'll need one or more [standard GRS storage accounts](..storage/storage-redundancy.md#geo-redundant-storage).<br/><br/> If you're deploying in the Azure portal you can use GRS or LRS storage.<br/><br/> If you're replicating VMware VMs or physical servers in the Azure portal premium storage is supported. Note that if you're using a premium storage account you'll also need a standard storage account to store replication logs that capture ongoing changes to on-premises data. [Premium storage](../storage/storage-premium-storage.md) is typically used for virtual machines that need a consistently high IO performance and low latency to host IO intensive workloads.<br/><br/> If you want to use a premium account to store replicated data, you'll also need a standard storage account to store replication logs that capture ongoing changes to on-premises data.
**Azure network** | To replicate to Azure, you'll need an Azure network that Azure VMs will connect to when they're created after failover.<br/><br/> If you're deploying in the classic portal you'll use a classic network. If you're deploying in the Azure portal, you can use a classic or Resource Manager network.<br/><br/> The network must be in the same region as the vault.
**Network mapping (VMM to Azure)** | If you're replicating from VMM to Azure, [network mapping](site-recovery-network-mapping.md) ensures that Azure VMs are connected to correct networks after failover.<br/><br/> To set up network mapping you'll need to configure VM networks in the VMM portal.
**On-premises** | **VMware VMs**: You'll need an on-premises machine running Site Recovery components, VMware vSphere hosts/vCenter server, and VMs you want to replicate. [Read more](site-recovery-vmware-to-azure.md#configuration-server-prerequisites).<br/><br/> **Physical servers**: If you're replicating physical servers you'll need an on-premises machines running Site Recovery components, and physical servers you want to replicate. [Read more](site-recovery-vmware-to-azure.md#configuration-server-prerequisites). If you want to [fail back](site-recovery-failback-azure-to-vmware.md) after failover to Azure you'll need a VMware infrastructure to do that.<br/><br/> **Hyper-V VMs**: If you want to replicate Hyper-V VMs in VMM clouds you'll need a VMM server, and Hyper-V hosts on which VMs you want to protect are located. [Read more](site-recovery-vmm-to-azure.md#on-premises-prerequisites).<br/><br/> If you want to replicate Hyper-V VMs without VMM you'll need Hyper-V hosts on which VMs are located. [Read more](site-recovery-hyper-v-site-to-azure.md#on-premises-prerequisites).
**Protected machines** | Protected machines that will replicate to Azure must comply with [Azure prerequisites](#azure-virtual-machine-requirements) described below.


### Replicate to a secondary site

**Requirement** | **Details** 
---|---
**Azure account** | You'll need a [Microsoft Azure](http://azure.microsoft.com/) account.<br/><br/> You can start with a [free trial](https://azure.microsoft.com/pricing/free-trial/). [Learn more](https://azure.microsoft.com/pricing/details/site-recovery/) about Site Recovery pricing.
**On-premises** | **VMware VMs**: In the primary site you'll need a process server for caching, compressing and encrypting replication data before sending it to the secondary site. In the secondary site you'll install a configuration server to manage and monitor the deployment and a master target server. We also recommend a vContinuum server for easier management. In addition, you need one or more VMware vSphere hosts and optionally a vCenter server. [Read more](site-recovery-vmware-to-vmware.md)<br/><br/> **Hyper-V VMs in VMM clouds**: You'll need to set up VMM servers, and Hyper-V hosts containing VMs you want to replicate. [Read more](site-recovery-vmm-to-vmm.md#on-premises-prerequisites).
**Network mapping (VMM to VMM)** | If you're replicating from VMM to VMM, [network mapping](site-recovery-network-mapping.md) ensures that replica VMs are connected to appropriate networks after failover and are optimally placed on Hyper-V hosts. To set up network mapping you'll need to configure VM networks on your VMM servers.
**Storage mapping** | If you're replicating from VMM to VMM you can optionally set up [storage mapping](site-recovery-storage-mapping.md) to specify the storage target for replicated VMs. Storage mapping can be set up for both Hyper-V Replica and SAN replication.<br/><br/> Storage mapping isn't currently supported in the Azure portal.


## Verify URL access

Make sure these URLs are accessible from servers.

**URL** | **VMM to VMM** | **VMM to Azure** | **Hyper-V to Azure** | **VMware to Azure**
---|---|---|---|---
*.accesscontrol.windows.net | Allow | Allow | Allow | Allow
*.backup.windowsazure.com | Not required | Allow | Allow | Allow
*.hypervrecoverymanager.windowsazure.com | Allow | Allow | Allow | Allow
*.store.core.windows.net | Allow | Allow | Allow | Allow
*.blob.core.windows.net | Not required | Allow | Allow | Allow
https://www.msftncsi.com/ncsi.txt | Allow | Allow | Allow | Allow
https://dev.mysql.com/get/archives/mysql-5.5/mysql-5.5.37-win32.msi | Not required | Not required | Not required | Allow

## Azure virtual machine requirements

You can deploy Site Recovery to replicate virtual machines and physical servers running any operating system supported by Azure. This includes most versions of Windows and Linux. You'll need to make sure that on-premises virtual machines that you want to protect conform with Azure requirements.


**Feature** | **Requirements** | **Details**
---|---|---
Hyper-V host | Should be running Windows Server 2012 R2 | Prerequisites check will fail if operating system unsupported
VMware hypervisor  | Supported operating system | [Check requirements](site-recovery-vmware-to-azure-classic.md#before-you-start-deployment)
Guest operating system | Hyper-V to Azure replication: Site Recovery supports all operating systems that are [supported by Azure](https://technet.microsoft.com/library/cc794868%28v=ws.10%29.aspx). <br/><br/> For VMware and physical server replication: Check the Windows and Linux [prerequisites](site-recovery-vmware-to-azure-classic.md#before-you-start-deployment) | Prerequisites check will fail if unsupported.
Guest operating system architecture | 64-bit | Prerequisites check will fail if unsupported
Operating system disk size |  Up to 1023 GB | Prerequisites check will fail if unsupported
Operating system disk count | 1 | Prerequisites check will fail if unsupported.
Data disk count | 16 or less (maximum value is a function of the size of the virtual machine being created. 16 = XL) | Prerequisites check will fail if unsupported
Data disk VHD size | Upto 1023 GB | Prerequisites check will fail if unsupported
Network adapters | Multiple adapters are supported |
Static IP address | Supported | If the primary virtual machine is using a static IP address you can specify the static IP address for the virtual machine that will be created in Azure. Note that static IP address for a linux virtual machine running on Hyper-v is not supported.
iSCSI disk | Not supported | Prerequisites check will fail if unsupported
Shared VHD | Not supported | Prerequisites check will fail if unsupported
FC disk | Not supported | Prerequisites check will fail if unsupported
Hard disk format| VHD <br/><br/> VHDX | Although VHDX isn't currently supported in Azure, Site Recovery automatically converts VHDX to VHD when you fail over to Azure. When you fail back to on-premises the virtual machines continue to use the VHDX format.
Virtual machine name| Between 1 and 63 characters. Restricted to letters, numbers, and hyphens. Should start and end with a letter or number | Update the value in the virtual machine properties in Site Recovery
Virtual machine type | <p>Generation 1</p> <p>Generation 2 - Windows</p> |  Generation 2 virtual machine with OS disk type of Basic Disk which includes 1 or 2 Data volumes with disk format as VHDX which is less than 300GB is supported. Linux Generation 2 virtual machines are not supported. [Read more information](https://azure.microsoft.com/blog/2015/04/28/disaster-recovery-to-azure-enhanced-and-were-listening/)



## Optimizing your deployment

Use the following tips to help you optimize and scale your deployment.

- **Operating system volume size**: When you replicate a virtual machine to Azure the operating system volume must be less than 1TB. If you have more volumes than this you can manually move them to a different disk before you start deployment.
- **Data disk size**: If you're replicating to Azure you can have up to 32 data disks on a virtual machine, each with a maximum of 1 TB. You can effectively replicate and fail over a ~32 TB virtual machine.
- **Recovery plan limits**: Site Recovery can scale to thousands of virtual machines. Recovery plans are designed as a model for applications that should fail over together so we limit the number of machines in a recovery plan to 50.
- **Azure service limits**: Every Azure subscription comes with a set of default limits on cores, cloud services etc. We recommend that you run a test failover to validate the availability of resources in your subscription. You can modify these limits via Azure support.
- **Capacity planning**: Read about [capacity planning](site-recovery-capacity-planner.md) for Site Recovery.
- **Replication bandwidth**: If you're short on replication bandwidth note that:
	- **ExpressRoute**: Site Recovery works with Azure ExpressRoute and WAN optimizers such as Riverbed. [Read more](http://blogs.technet.com/b/virtualization/archive/2014/07/20/expressroute-and-azure-site-recovery.aspx) about ExpressRoute.
	- **Replication traffic**: Site Recovery uses performs a smart initial replication using only data blocks and not the entire VHD. Only changes are replicated during ongoing replication.
	- **Network traffic**: You can control network traffic used for replication by setting up [Windows QoS](https://technet.microsoft.com/library/hh967468.aspx) with a policy based on the destination IP address and port.  In addition, if you're replicating to Azure Site Recovery using the Azure Backup agent you can configure throttling for that agent. [Read more](https://support.microsoft.com/kb/3056159).
- **RTO**: To measure the recovery time objective (RTO) you can expect with Site Recovery we suggest you run a test failover and view the Site Recovery jobs to analyze how much time it takes to complete the operations. If you're failing over to Azure, for the best RTO we recommend that you automate all manual actions by integrating with Azure automation and recovery plans.
- **RPO**: Site Recovery supports a near-synchronous recovery point objective (RPO) when you replicate to Azure. This assumes sufficient bandwidth between your datacenter and Azure.


##Service URLs
Make sure these URLs are accessible from the server


**URLs** | **VMM to VMM** | **VMM to Azure** | **Hyper-V Site to Azure** | **VMware to Azure**
---|---|---|---|---
 \*.accesscontrol.windows.net | Access required  | Access required  | Access required  | Access required
 \*.backup.windowsazure.com |  | Access required  | Access required  | Access required
 \*.hypervrecoverymanager.windowsazure.com | Access required  | Access required  | Access required  | Access required
 \*.store.core.windows.net | Access required  | Access required  | Access required  | Access required
 \*.blob.core.windows.net |  | Access required  | Access required  | Access required
 https://www.msftncsi.com/ncsi.txt | Access required  | Access required  | Access required  | Access required
 https://dev.mysql.com/get/archives/mysql-5.5/mysql-5.5.37-win32.msi | | | | Access required


## Next steps

After learning and comparing general deployment requirements you can read the detailed prerequisites and start deploying each scenario.

- [Replicate VMware virtual machines to Azure](site-recovery-vmware-to-azure-classic.md)
- [Replicate physical servers to Azure](site-recovery-vmware-to-azure-classic.md)
- [Replicate Hyper-V server in VMM clouds to Azure](site-recovery-vmm-to-azure.md)
- [Replicate Hyper-V virtual machines (without VMM) to Azure](site-recovery-hyper-v-site-to-azure.md)
- [Replicate Hyper-V VMs to a secondary site](site-recovery-vmm-to-vmm.md)
- [Replicate Hyper-V VMs to a secondary site with SAN](site-recovery-vmm-san.md)
- [Replicate Hyper-V VMs with a single VMM server](site-recovery-single-vmm.md)
