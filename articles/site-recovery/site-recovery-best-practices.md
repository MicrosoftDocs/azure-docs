---
title: Prepare for Site Recovery deployment | Microsoft Docs
description: This article describes how to get ready to deploy replication with Azure Site Recovery.
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: jwhit
editor: tysonn

ms.assetid: e24eea6c-50a7-4cd5-aab4-2c5c4d72ee2d
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 02/06/2017
ms.author: raynew
---

# Prepare for Azure Site Recovery deployment

Organizations need a BCDR strategy that determines how apps, workloads, and data stay running and available during planned and unplanned downtime, and recover to normal working conditions as soon as possible. Site Recovery is an Azure service that contributes to your BCDR strategy by orchestrating replication of on-premises physical servers and virtual machines to the cloud (Azure), or to a secondary datacenter. When outages occur in your primary location, you fail over to the secondary location to keep apps and workloads available. You fail back to your primary location when it returns to normal operations. Learn more in [What is Site Recovery?](site-recovery-overview.md)

This article summarizes high-level requirements for each Site Recovery replication scenario, and provides links to detailed deployment walkthroughs.  

Post any comments at the bottom of the article, or ask technical questions on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).



## Azure deployment models

Azure has two different [deployment models](../azure-resource-manager/resource-manager-deployment-model.md) for creating and working with resources: the Azure Resource Manager mode, and the classic model. Azure also has two portals – the [Azure classic portal](https://manage.windowsazure.com/) that supports the classic deployment model, and the [Azure portal](https://ms.portal.azure.com/) with support for both deployment models.

New Site Recovery scenarios should be deployed in the [Azure portal](https://portal.azure.com). This portal provides new features and an improved deployment experience. Vaults can be maintained in the classic portal, but new vaults can't be created.


## Deployment scenarios

Here's what you can replicate with Site Recovery.

| **Deployment** | **Details** | **Azure portal** | **Classic portal** | **PowerShell deployment** |
| --- | --- | --- | --- | --- |
| [VMware to Azure](site-recovery-vmware-to-azure.md) | Replicate on-premises VMware VMs to Azure storage | Use Resource Manager or classic storage and networks. Fail over to Resource Manager-based or classic VMs. | Maintenance mode only. New vaults can't be created. | Not currently supported. |
| [Physical servers to Azure](site-recovery-vmware-to-vmware.md) | Replicate physical Windows/Linux servers to Azure storage | Use Resource Manager or classic storage and networks. Fail over to Resource Manager-based or classic VMs. | Maintenance mode only. New vaults can't be created.  |
| [Hyper-V VMs in VMM clouds to Azure](site-recovery-vmm-to-azure.md) | Replicate on-premises Hyper-V VMs in VMM clouds to Azure storage.<br/><br/> | Use Resource Manager or classic storage and networks. Fail over to Resource Manager-based or classic VMs.   | Maintenance mode only. New vaults can't be created. | Supported |
| [Hyper-V VMs to Azure (no VMM)](site-recovery-hyper-v-site-to-azure.md) | Replicate on-premises Hyper-V VMs to Azure storage. | Use Resource Manager or classic storage and networks. Fail over to Resource Manager-based or classic VMs. | Maintenance mode only. New vaults can't be created. | Supported |
| VMware VMs/physical servers to secondary site(site-recovery-vmware-to-vmware.md) | Replicate VMware VMs or physical Windows/Linux servers to a secondary site.<br/><br/> [Download the help guide](http://download.microsoft.com/download/E/0/8/E08B3BCE-3631-4CED-8E65-E3E7D252D06D/InMage_Scout_Standard_User_Guide_8.0.1.pdf) the InMage Scout user guide. | Not available in the Azure portal | Download InMage Scout from a Site Recovery vault. | Not supported |
| [Hyper-V VMs to a secondary site](site-recovery-vmm-to-vmm.md) | Replicate Hyper-V VMs in VMM clouds to a secondary cloud  | Replication uses standard Hyper-V Replica. SAN isn't supported. | Replicate using Hyper-V Replica or [SAN replication](site-recovery-vmm-san.md) | Supported |

## Requirements for replication to Azure

| **Requirement** | **Details** |
| --- | --- |
| **Azure account** | A [Microsoft Azure](http://azure.microsoft.com/) account.<br/><br/> You can start with a [free trial](https://azure.microsoft.com/pricing/free-trial/). [Learn more](https://azure.microsoft.com/pricing/details/site-recovery/) about Site Recovery pricing. |
| **Azure storage** | Replicated data is stored in Azure storage, and Azure VMs are created when failover occurs. You need an [Azure storage account](../storage/storage-introduction.md).<br/><br/>In the Azure portal use [GRS](../storage/storage-redundancy.md#geo-redundant-storage) or LRS storage. The classic portal supported GRS only.<br/><br/> If you replicate VMware VMs or physical servers in the Azure portal, premium storage is supported.<br/><br/>  |
| **Azure network** | You need an Azure network to which Azure VMs will connect <br/><br/> In the Azure portal you can use a classic or Resource Manager network.<br/><br/> The network must be in the same region as the vault.<br/><br/> If you replicate from VMM to Azure, you will set up [network mapping](site-recovery-network-mapping.md) between VMM VM networks and Azure networks, to ensure that Azure VMs connect to appropriate networks after failover. |
| **On-premises** |**VMware VMs**: An on-premises machine running Site Recovery components. In addition, you need VMware vSphere hosts/vCenter server, and VMs you want to replicate. [Learn more](site-recovery-vmware-to-azure.md#configuration-server-or-additional-process-server-prerequisites).<br/><br/> **Physical servers**: An on-premises machine running Site Recovery components, and physical servers you want to replicate. [Learn more](site-recovery-vmware-to-azure.md#configuration-server-or-additional-process-server-prerequisites). If you want to [fail back](site-recovery-failback-azure-to-vmware.md) physical servers from Azure, you need a VMware infrastructure to do that.<br/><br/> **Hyper-V VMs**: A VMM server, and Hyper-V hosts containing VMs you want to replicate. [Learn more](site-recovery-vmm-to-azure.md#on-premises-prerequisites).<br/><br/> To replicate Hyper-V VMs without VMM, you need Hyper-V hosts only. [Learn more](site-recovery-hyper-v-site-to-azure.md#on-premises-prerequisites). |
| **Protected machines** | Protected machines that will replicate to Azure must comply with [Azure prerequisites](#azure-virtual-machine-requirements) described below. |

## Requirements for replication to a secondary site

| **Requirement** | **Details** |
| --- | --- |
| **Azure** | A [Microsoft Azure](http://azure.microsoft.com/) account.<br/><br/> You can start with a [free trial](https://azure.microsoft.com/pricing/free-trial/). [Learn more](https://azure.microsoft.com/pricing/details/site-recovery/) about Site Recovery pricing. |
| **On-premises** |**VMware VMs**: In the primary site you need a process server for caching, compressing and encrypting replication data. In the secondary site you need a configuration server to manage and monitor the deployment, and a master target server. We also recommend a vContinuum server, for easier management. In addition, you need one or more VMware vSphere hosts, and optionally a vCenter server. [Learn more](site-recovery-vmware-to-vmware.md)<br/><br/> **Hyper-V VMs in VMM clouds**: VMM servers, and Hyper-V hosts containing VMs you want to replicate. [Learn more](site-recovery-vmm-to-vmm.md#on-premises-prerequisites). |
| **Network (VMM to VMM)** | If you replicate from VMM to VMM, you set up [network mapping](site-recovery-network-mapping.md) to ensures that replica VMs are connected to appropriate networks after failover, and are optimally placed on Hyper-V hosts. |

## URL access

These URLs should be available from VMware, VMM, and Hyper-V host servers.

**URL** | **VMM to VMM** | **VMM to Azure** | **Hyper-V to Azure** | **VMware to Azure** |
|--- | --- | --- | --- | ---
``*.accesscontrol.windows.net`` | Allow | Allow | Allow | Allow
``*.backup.windowsazure.com`` | Not required | Allow | Allow | Allow
``*.hypervrecoverymanager.windowsazure.com`` | Allow | Allow | Allow | Allow
``*.store.core.windows.net`` | Allow | Allow | Allow | Allow
``*.blob.core.windows.net`` | Not required | Allow | Allow | Allow
``https://www.msftncsi.com/ncsi.txt`` | Allow | Allow | Allow | Allow
``https://dev.mysql.com/get/archives/mysql-5.5/mysql-5.5.37-win32.msi`` | Not required | Not required | Not required | Allow for SQL download
``time.windows.com`` | Allow | Allow | Allow | Allow
``time.nist.gov`` | Allow | Allow | Allow | Allow



## Azure virtual machine requirements

You can deploy Site Recovery to replicate virtual machines and physical servers, running any operating system supported by Azure. This includes most versions of Windows and Linux. On-premises virtual machines that you want to replicate must conform with Azure requirements.

**Feature** | **Requirements** | **Details**
--- | --- | ---
**Hyper-V host** | Should be running Windows Server 2012 R2 or later | Prerequisites check will fail if operating system unsupported
**VMware hypervisor** | Supported operating system | [Check requirements](site-recovery-vmware-to-azure-classic.md#before-you-start-deployment)
**Guest operating system** | Hyper-V to Azure replication: Site Recovery supports all operating systems that are [supported by Azure](https://technet.microsoft.com/library/cc794868%28v=ws.10%29.aspx). <br/><br/> For VMware and physical server replication: Check the Windows and Linux [prerequisites](site-recovery-vmware-to-azure-classic.md#before-you-start-deployment) | Prerequisites check will fail if unsupported.
**Guest operating system architecture** | 64-bit | Prerequisites check will fail if unsupported
**Operating system disk size** | Up to 1023 GB | Prerequisites check will fail if unsupported
**Operating system disk count** | 1 | Prerequisites check will fail if unsupported.
**Data disk count** | 16 or less (maximum value is a function of the size of the virtual machine being created. 16 = XL) | Prerequisites check will fail if unsupported
**Data disk VHD size** | Up to 1023 GB | Prerequisites check will fail if unsupported
**Network adapters** | Multiple adapters are supported |
**Static IP address** | Supported | If the primary virtual machine is using a static IP address you can specify the static IP address for the virtual machine that will be created in Azure.<br/><br/> Static IP address for a **Linux VM running on Hyper-V** isn't supported.
**iSCSI disk** | Not supported | Prerequisites check will fail if unsupported
**Shared VHD** | Not supported | Prerequisites check will fail if unsupported
**FC disk** | Not supported | Prerequisites check will fail if unsupported
**Hard disk format** | VHD <br/><br/> VHDX | Although VHDX isn't currently supported in Azure, Site Recovery automatically converts VHDX to VHD when you fail over to Azure. When you fail back to on-premises the virtual machines continue to use the VHDX format.
**Bitlocker** | Not supported | Bitlocker must be disabled before protecting a virtual machine.
**VM name** | Between 1 and 63 characters. Restricted to letters, numbers, and hyphens. Should start and end with a letter or number | Update the value in the virtual machine properties in Site Recovery
**VM type** | Generation 1<br/><br/> Generation 2 - Windows | Generation 2 VMs with an OS disk type of basic, which includes one or two data volumes formatted as VHDX and less than 300 GB are supported.<br/><br/>. Linux Generation 2 VM's aren't supported. [Learn more](https://azure.microsoft.com/blog/2015/04/28/disaster-recovery-to-azure-enhanced-and-were-listening/) |

## Deployment optimization

Use the following tips to optimize and scale your deployment.

- **Operating system volume size**: When you replicate a virtual machine to Azure the operating system volume must be less than 1TB. If you have more volumes than this you can manually move them to a different disk before you start deployment.
- **Data disk size**: If you're replicating to Azure you can have up to 64 data disks on a virtual machine, each with a maximum of 1 TB. You can effectively replicate and fail over a ~64 TB virtual machine.
- **Recovery plan limits**: Site Recovery can scale to thousands of virtual machines. Recovery plans are designed as a model for applications that should fail over together so we limit the number of machines in a recovery plan to 50.
- **Azure service limits**: Every Azure subscription comes with a set of default limits on cores, cloud services etc. We recommend that you run a test failover to validate the availability of resources in your subscription. You can modify these limits via Azure support.
- **Capacity planning**: Read about [capacity planning](site-recovery-capacity-planner.md) for Site Recovery.
- **Replication bandwidth**: If you're short on replication bandwidth note that:
- **ExpressRoute**: Site Recovery works with Azure ExpressRoute and WAN optimizers such as Riverbed. [Read more](http://blogs.technet.com/b/virtualization/archive/2014/07/20/expressroute-and-azure-site-recovery.aspx) about ExpressRoute.
- **Replication traffic**: Site Recovery uses performs a smart initial replication using only data blocks and not the entire VHD. Only changes are replicated during ongoing replication.
- **Network traffic**: You can control network traffic used for replication by setting up [Windows QoS](https://technet.microsoft.com/library/hh967468.aspx) with a policy based on the destination IP address and port.  In addition, if you're replicating to Azure Site Recovery using the Azure Backup agent you can configure throttling for that agent. [Read more](https://support.microsoft.com/kb/3056159).
- **RTO**: To measure the recovery time objective (RTO) you can expect with Site Recovery we suggest you run a test failover and view the Site Recovery jobs to analyze how much time it takes to complete the operations. If you're failing over to Azure, for the best RTO we recommend that you automate all manual actions by integrating with Azure automation and recovery plans.
- **RPO**: Site Recovery supports a near-synchronous recovery point objective (RPO) when you replicate to Azure. This assumes sufficient bandwidth between your datacenter and Azure.



## Next steps
After reviewing general deployment requirements, read the detailed prerequisites and deploy a scenario.

* [Replicate VMware virtual machines to Azure](site-recovery-vmware-to-azure.md)
* [Replicate physical servers to Azure](site-recovery-vmware-to-azure.md)
* [Replicate Hyper-V server in VMM clouds to Azure](site-recovery-vmm-to-azure.md)
* [Replicate Hyper-V virtual machines (without VMM) to Azure](site-recovery-hyper-v-site-to-azure.md)
* [Replicate Hyper-V VMs to a secondary site](site-recovery-vmm-to-vmm.md)
* [Replicate Hyper-V VMs with a single VMM server](site-recovery-single-vmm.md)
