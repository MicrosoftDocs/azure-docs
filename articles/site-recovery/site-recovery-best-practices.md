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
	ms.date="02/15/2016"
	ms.author="raynew"/>

# Prepare for Azure Site Recovery deployment

The Azure Site Recovery service contributes to your business continuity and disaster recovery (BCDR) strategy by orchestrating replication, failover and recovery of virtual machines and physical servers. Machines can be replicated to Azure, or to a secondary on-premises data center. For a quick overview read [What is Azure Site Recovery?](site-recovery-overview.md).

## Overview

Azure Site Recovery supports replication of VMware and Hyper-V VMs, and physical servers. to Azure or to a secondary datacenter. This article describes how to prepare for your Azure Site Recovery deployment for each of these replication scenarios.

Post any comments or questions at the bottom of this article, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

## Deployment requirements for Hyper-V replication

The table summarizes the general deployment requirements for Hyper-V replication to Azure (with and without VMM) and to a secondary site. The table helps you to understand and compare general requirements for each replication scenario. There's also a link to detailed deployment prerequisites.

**Replicate to Azure (with VMM)** | **Replicate to Azure (without VMM)** | **Replicate to secondary site (with VMM)**
---|---|---
**VMM**: At least one VMM server running on System Center 2012 R2. The VMM server should have at least one cloud containing one or more VMM host groups.<br/><br/> **Hyper-V**: One or more Hyper-V host servers in the on-premises datacenter running at least Windows Server 2012 R2. The Hyper-V server must be located in a host group in a VM cloud.<br/><br/> **Virtual machines**: You'll need at least one VM on the source Hyper-V server. VMs replicating to Azure must conform with [Azure virtual machine prerequisites](#azure-virtual-machine-requirements).<br/><br/> **Azure account**: You'll need an [Azure](https://azure.microsoft.com/) account and subscription.<br/><br/> **Azure storage**: You'll need an [Azure storage account](../storage/storage-redundancy.md#geo-redundant-storage) to store replicated data. Replicated data is stored in Azure storage and Azure VMs are spun up when failover occurs.<br/><br/> **Network mapping**: Set up network mapping so that all machines that fail over on the same Azure network can connect to each other, irrespective of which recovery plan they are in. If there's a network gateway on the target Azure network, virtual machines also can connect to on-premises virtual machines. If you don't set up network mapping only machines that fail over in the same recovery plan can connect.<br/><br/> **Providers/agents**: During deployment you'll install the Azure Site Recovery Provider on VMM servers and the Azure Recovery Services agent on Hyper-V host servers. The Provider communicates with Azure Site Recovery. The agent handles data replication between source and target Hyper-V servers. Nothing gets installs on VMs.<br/><br/> **Internet connectivity**: From the VMM server and Hyper-V hosts.<br/><br/> **Provider connectivity**: If the Provider will connect to Site Recovery via a proxy you'll need to make sure the proxy can access the Site Recovery URLs.<br/><br/> [Detailed deployment prerequisites](site-recovery-vmm-to-azure.md#before-you-start) | **Hyper-V**: At least one Hyper-V server in the source and target sites running at least Windows Server 2012 R2.<br/><br/> **Virtual machines**: At least one VM on the source Hyper-V server. VMs replicating to Azure must conform with [Azure virtual machine prerequisites](#azure-virtual-machine-requirements)<br/><br/> **Azure account**: You'll need an [Azure](https://azure.microsoft.com/) account and  subscription.<br/><br/> **Azure storage**: You'll need an [Azure storage account](../storage/storage-redundancy.md#geo-redundant-storage) to store replicated data.<br/><br/> **Providers/agents**: During deployment you'll install both the Azure Site Recovery Provider and the Azure Recovery Services agent on Hyper-V host servers or clusters. Nothing gets installed on VMs.<br/><br/> **Internet connectivity**: From the Hyper-V hosts.<br/><br/> **Provider connectivity**: If the Provider will connect via a proxy you'll need to make sure the proxy can access Site Recovery URLs.<br/><br/> [Detailed deployment prerequisites](site-recovery-hyper-v-site-to-azure.md#before-you-start#before-you-start) | **VMM**: The source VMM server should have at least one cloud containing one or more VMM host groups. Clouds should have the Hyper-V capability profile set. <br/><br/>**Hyper-V**: One or more Hyper-V server in the source and target sites running at least Windows Server 2012 with the latest updates. The Hyper-V server must be located in a host group in a VMM cloud.<br/><br/> **Virtual machines**: At least one VM in the source VMM cloud. <br/><br/> **Network mapping**: Set up network mapping so that virtual machines are connected to appropriate networks after failover, and replica virtual machines are optimally placed on target Hyper-V host servers. If you don't configure network mapping replicated machines won't be connected to any VM network after failover.<br/><br/> **Storage mapping**: You can optionally set up storage mapping to make sure that virtual machines are optimally connected to storage after failover (by default the replica VM will be stored in the location indicated on the target Hyper-V server).<br/><br/> **SAN replication** If you want to replicate between two on-premises VMM sites with SAN replication, you can use your existing SAN environment. View [supported SAN arrays](http://social.technet.microsoft.com/wiki/contents/articles/28317.deploying-azure-site-recovery-with-vmm-and-san-supported-storage-arrays.aspx).<br/><br/> **Providers/agents**: During deployment you'll install the Azure Site Recovery Provider on VMM servers to communicate with Azure Site Recovery. Replication occurs between Hyper-V source and target servers over the LAN/VPN.<br/><br/> **Internet connectivity**: On the VMM server only.<br/><br/> **Provider connectivity**: If the Provider will connect via a proxy you'll need to make sure Site Recovery URLs are accessible.<br/><br/> [Detailed deployment prerequisites](site-recovery-vmm-to-vmm.md#before-you-start)


## Deployment requirements for replicating VMware VMs and physical servers

The table summarizes the requirements for replicating VMware VMs and Windows/Linux physical servers to Azure and to a secondary site.

>[AZURE.NOTE] You can replicate VMware VMs and physical servers to Azure using an [enhanced](site-recovery-vmware-to-azure-classic.md) deployment model, or with a [legacy](site-recovery-vmware-to-azure-classic-legacy.md) model that was used for older deployments. The table below includes deployment requirements for each model.

**Replicate to Azure (enhanced)** | **Replicate to Azure (legacy)** | **Replicate to secondary site**
---|---|---
**On-premises management server**: In your on-premises site you'll need a dedicated server that will act as the management server. All Site Recovery components are installed on this server.<br/><br/> **Additional process servers**: A process server is installed by default on the management server but you can optionally install additional on-premises process servers to scale your deployment.<br/><br/> **VMware vCenter/ESXi**: If you're replicating VMware VMs (or want to fail back physical servers) you'll need a vSphere ESX/ESXi on which the VMs are located. We recommend a vCenter server to manage your ESXi hosts.</br><br/> **Failback**: You need a VMware environment to fail back from Azure, even if you're replicating physical servers. In addition you'll need to set up a process server as an Azure VM and if you're failing back large traffic volumes you might want to set up an additional on-premises master target server. [Learn more](site-recovery-failback-azure-to-vmware-classic.md)<br/><br/> **Azure account**: You'll need an [Azure](https://azure.microsoft.com/) account and subscription.<br/><br/> **Azure storage**: You'll need an [Azure storage account](../storage/storage-redundancy.md#geo-redundant-storage) to store replicated data. Replicated data is stored in Azure storage and Azure VMs are spun up when failover occurs.<br/><br/> **Azure virtual network**: You'll need an Azure virtual network that Azure VMs will connect to when failover occurs. To fail back after failover you’ll need a VPN connection (or Azure ExpressRoute) set up from the Azure network to the on-premises site.<br/><br/> **Protected machines**: At least one VMware virtual machine or physical Windows/Linux server. During deployment the Mobility service is installed on each machine you want to replicate.<br/><br/> **Connectivity**: If the management server will connect to Site Recovery via a proxy you'll need to make sure the proxy server can connect to specific URLs.<br/><br/> [Detailed deployment prerequisites](site-recovery-vmware-to-azure-classic.md#before-you-start-deployment). | **Primary site**: You'll need to set up a process server.<br/><br/> **Failback**: You need a VMware environment to fail back from Azure, even if you're replicating physical servers. In your on-premises site you'll need to set up a vContinuum server and a master target server. In Azure you'll need to set up a process server. [Learn more](site-recovery-failback-azure-to-vmware-classic-legacy.md)<br/><br/> **Azure account**: You'll need an [Azure](https://azure.microsoft.com/) account and  subscription.<br/><br/> **Azure storage**: You'll need an [Azure storage account](../storage/storage-redundancy.md#geo-redundant-storage) to store replicated data. Replicated data is stored in Azure storage and Azure VMs are spun up when failover occurs.<br/><br/> **Azure infrastructure VMs**: You'll need to set up a configuration server and a master target server as Azure VMs.<br/><br/> **Azure virtual network**: You'll need an Azure virtual network on which the configuration server and master target server will be deployed. Azure VMs will be connected to this network after failover.<br/><br/> **Protected machines**: At least one VMware virtual machine or physical Windows/Linux server. During deployment the Mobility service is installed on each machine you want to replicate.<br/><br/> **Connectivity**: If the management server will connect to Site Recovery via a proxy you'll need to make sure the proxy server can connect to specific URLs.<br/><br/> [Detailed deployment prerequisites](site-recovery-vmware-to-azure-classic-legacy.md#before-you-start). | **Primary site**: a dedicated Windows server (physical or VMware virtual machine.<br/><br/> **Secondary site**: Dedicated configuration and master target servers.<br/><br/> **Protected machines**: At least one VMware virtual machine or physical Windows/Linux server. During deployment the Unified agent will be installed on each machine.





## Azure virtual machine requirements

You can deploy Site Recovery to replicate virtual machines and physical servers running any operating system supported by Azure. This includes most versions of Windows and Linux. You'll need to make sure that on-premises virtual machines that you want to protect conform with Azure requirements.


**Feature** | **Support** | **Details**
---|---|---
Hyper-V host operating system | Windows Server 2012 R2 | Prerequisites check will fail if unsupported
VMware hypervisor operating system | Running a supported operating system | [Details](site-recovery-vmware-to-azure-classic.md#before-you-start)
Guest operating system |  For Hyper-V to Azure replication Site Recovery supports all operating systems that are [supported by Azure](https://technet.microsoft.com/library/cc794868%28v=ws.10%29.aspx). <br/><br/> For VMware and physical server replication check the Windows and Linux [prerequisites](site-recovery-vmware-to-azure-classic.md#before-you-start) | Prerequisites check will fail if unsupported.
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
	- **Network traffic**: You can control network traffic used for replication by setting up [Windows QoS](https://technet.microsoft.com/library/hh967468.aspx) with a policy based on the destination IP address and port.  In addition if you're replicating to Azure Site Recovery using the Azure Backup agent. You can configure throttling for that agent. [Read more](https://support.microsoft.com/kb/3056159).
- **RTO**: If you want to measure the recovery time objective (RTO) you can expect with Site Recovery we suggest you run a test failover and view the Site Recovery jobs to analyze how much time it takes to complete the operations. If you're failing over to Azure, for the best RTO we recommend that you automate all manual actions by integrating with Azure automation and recovery plans.
- **RPO**: Site Recovery supports a near-synchronous recovery point objective (RPO) when you replicate to Azure. This assumes sufficient bandwith between your datacenter and Azure.





## Next steps

After learning and comparing general deployment requirements you can read the detailed prerequisites and start deploying each scenario.

- [Replicate VMware virtual machines to Azure](site-recovery-vmware-to-azure-classic.md)
- [Replicate physical servers to Azure](site-recovery-vmware-to-azure-classic.md)
- [Replicate Hyper-V server in VMM clouds to Azure](site-recovery-vmm-to-azure.md)
- [Replicate Hyper-V virtual machines (without VMM) to Azure](site-recovery-hyper-v-site-to-azure.md)
- [Replicate Hyper-V VMs to a secondary site](site-recovery-vmm-to-vmm.md)
- [Replicate Hyper-V VMs to a secondary site with SAN](site-recovery-vmm-san.md)
- [Replicate Hyper-V VMs with a single VMM server](site-recovery-single-vmm.md)
