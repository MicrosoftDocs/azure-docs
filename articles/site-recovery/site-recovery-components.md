<properties
	pageTitle="How does Site Recovery work? | Microsoft Azure"
	description="This article provides an overview of Site Recovery architecture"
	services="site-recovery"
	documentationCenter=""
	authors="rayne-wiselman"
	manager="cfreeman"
	editor=""/>

<tags
	ms.service="site-recovery"
	ms.workload="backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="10/13/2016"
	ms.author="raynew"/>

# How does Azure Site Recovery work?

Read this article to understand Azure Site Recovery service architecture, and the components that make it work.

Post any comments or questions at the bottom of this article, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).


## Overview

You need a business continuity and disaster recovery (BCDR) strategy to keep workloads and data running and available during planned and unplanned downtime, and to recover to normal working conditions as soon as possible. 

Site Recovery is an Azure service that contributes to your BCDR strategy. It orchestrates replication of on-premises physical servers and virtual machines to the cloud (Azure), or to a secondary datacenter. When outages occur in your primary location, you fail over to the secondary location to keep apps and workloads available. You fail back to your primary location when it returns to normal operations. Read an overview in [What is Site Recovery?](site-recovery-overview.md)

## Site Recovery in the Azure portal

Azure has two different [deployment models](../resource-manager-deployment-model.md) for creating and working with resources: the Azure Resource Manager model and the classic services management model. Azure also has two portals – the [Azure classic portal](https://manage.windowsazure.com/) that supports the classic deployment model, and the [Azure portal](https://portal.azure.com) with support for both deployment models.

- Site Recovery is available in both the classic portal and the Azure portal.
- In the Azure classic portal, you can support Site Recovery with the classic services management model.
- In the Azure portal, you can support the classic model or Resource Model deployments. 

The information in this article applies to both classic and Azure portal deployments. The table summarizes any differences.

**Replicate** | **Azure portal** | **Classic portal**
--- | --- | ---
**VMware VM replication to Azure** | Simplified deployment process.<br/><br/> Fail over VMs to classic or Resource Manager-based storage.<br/><br/> Replicate to classic or Resource Manager-based storage.<br/><br/> Use classic or Resource Manager networks for connecting the Azure VMs after failover.<br/><br/> Use LRS or GRS storage. | Fail over to classic storage only.<br/><br/> Use classic networks only to connect VMs after failover.<br/><br/> Use GRS storage.
**Hyper-V VM replication (without VMM) to Azure** | Simplified deployment process.<br/><br/> Fail over VMs to classic or Resource Manager-based storage.<br/><br/> Replicate to classic or Resource Manager-based storage.<br/><br/> Use classic or Resource Manager networks for connecting the Azure VMs after failover.
**Hyper-V VM replication (with VMM) to Azure** | Simplified deployment process.<br/><br/> Fail over VMs to classic or Resource Manager-based storage.<br/><br/> Replicate to classic or Resource Manager-based storage.<br/><br/> Use classic or Resource Manager networks for connecting the Azure VMs after failover.<br/><br/> Must set up network mapping | Fail over to classic storage only.<br/><br/> Use classic networks only to connect VMs after failover.
**Hyper-V VM replication (with VMM) to secondary site** | Simplified deployment process.<br/><br/> Fail over VMs to classic or Resource Manager-based storage.<br/><br/> Replicate to classic or Resource Manager-based storage.<br/><br/> Use classic or Resource Manager networks for connecting the Azure VMs after failover.<br/><br/> Must set up network mapping | Fail over to classic storage only.<br/><br/> Use classic networks only to connect VMs after failover.<br/><br/> You can set up storage mapping. <br/><br/> SAN replication isn't supported.



## Deployment scenarios

Site Recovery can be deployed to orchestrate replication in a number of scenarios:

- **Replicate VMware VMs**: You can replicate on-premises VMware virtual machines to Azure storage, or to a secondary datacenter.
- **Replicate physical machines**: You can replicate physical machines running Windows or Linux to Azure storage, or to a secondary datacenter. The process for replicating physical machines is almost the same as the process for replicating VMware VMs.
- **Replicate Hyper-V VMs**: If your Hyper-V hosts are managed in System Center VMM clouds, you can replicate VMs to Azure, or to a secondary datacenter. If hosts aren't managed by VMM, you can replicate to Azure only. You can replicate Hyper-V VMs that aren't managed by VMM to Azure storage.
- **Migrate VMs**: You can use Site Recovery to [migrate Azure IaaS VMs](site-recovery-migrate-azure-to-azure.md) between regions, or to [migrate AWS Windows instances](site-recovery-migrate-aws-to-azure.md) to Azure IaaS VMs. Full replication isn't currently supported. You can replicate for migration (fail over), but you can't fail back. 

Site Recovery can replicate most apps running on these VMs and physical servers. You can get a full summary of the supported apps in [What workloads can Azure Site Recovery protect?](site-recovery-workload.md)


## Replicate VMware virtual machines to Azure

![Enhanced](./media/site-recovery-components/arch-enhanced.png)

**Component** | **Details**
--- | ---
**Azure** | **Account**: You need an Azure account.<br/><br/> **Storage**: You need an Azure storage account to store replicated data. You can use a classic account or a Resource Manager storage account. The account can be LRS or GRS when you deploy in the Azure portal. Replicated data is stored in Azure storage and Azure VMs are spun up when failover occurs.<br/><br/> **Network**: You need an Azure virtual network that Azure VMs will connect to when they're created at failover. In the Azure portal they can be networks created in the classic service manager model or in the Resource Manager model.
**On-premises configuration server** |  You need an on-premises Windows Server 2012 R2 machine that runs the configuration server, and other Site Recovery components.<br/><br/> This should be a highly available VMware VM.<br/><br/> Components on the server include:<br/><br/> **Configuration server**: Coordinates communication between your on-premises environment and Azure, and manages data replication and recovery.<br/><br/> **Process server**: Acts as a replication gateway. It receives replication data from protected source machines, optimizes it with caching, compression, and encryption, and sends the data to Azure storage. It also handles push installation of the Mobility service to protected machines, and performs automatic discovery of VMware VMs. As your deployment grows you can add additional separate dedicated process servers to handle increasing volumes of replication traffic.<br/><br/> **Master target server**: Handles replication data during failback from Azure.
**On-premises virtualization servers** | One or more vSphere hosts. We also recommend a vCenter server to manage the hosts.
**VMs to replicate** | Each VMware VM that you want to replicate to Azure will need the Mobility service component installed. This service captures data writes on the machine and forwards them to the process server. This component can be installed manually, or can be pushed and installed automatically by the process server when you enable replication for a machine.

- [Learn more](site-recovery-vmware-to-azure.md#azure-prerequisites) about requirements for Azure portal deployment.
- [Learn more](site-recovery-failback-azure-to-vmware.md) about failback in the Auzre portal.


## Replicate physical servers to Azure

![Enhanced](./media/site-recovery-components/arch-enhanced.png)

**Component** | **Details**
--- | ---
**Azure** | **Account**: You need an Azure account.<br/><br/> **Storage**: You need an Azure storage account to store replicated data. You can use a classic account or a Resource Manager storage account. The account can be LRS or GRS when you deploy in the Azure portal. Replicated data is stored in Azure storage and Azure VMs are spun up when failover occurs.<br/><br/> **Network**: You need an Azure virtual network that Azure VMs will connect to when they're created at failover. In the Azure portal they can be networks created in the classic service manager model or in the Resource Manager model.
**On-premises configuration server** |  You need an on-premises Windows Server 2012 R2 machine that runs the configuration server, and other Site Recovery components.<br/><br/> The server can be virtual or physical.<br/><br/> Components on the server include:<br/><br/> **Configuration server**: Coordinates communication between your on-premises environment and Azure, and manages data replication and recovery.<br/><br/> **Process server**: Acts as a replication gateway. It receives replication data from protected source machines, optimizes it with caching, compression, and encryption, and sends the data to Azure storage. It also handles push installation of the Mobility service to protected machines, and performs automatic discovery of VMware VMs. As your deployment grows you can add additional separate dedicated process servers to handle increasing volumes of replication traffic.<br/><br/> **Master target server**: Handles replication data during failback from Azure.
**Machines to replicate** | Each physical Windows/Linux that you want to replicate to Azure needs the Mobility service component installed. This service captures data writes on the machine, and forwards them to the process server. This component can be installed manually, or can be pushed and installed automatically by the process server when you enable replication for a machine.
**Failback** | Physical-to-physical failback isn't supported. This means that if you fail over physical servers to Azure and then want to fail back, you must fail back to a VMware VM. You can't fail back to a physical server. You'll need an Azure VM to fail back to, and if you didn't deploy the configuration server as a VMware VM, you'll need to set up a separate master target server as a VMware VM. This is needed because the master target server interacts and attaches to VMware storage to restore the disks to a VMware VM.


- [Learn more](site-recovery-vmware-to-azure.md#azure-prerequisites) about requirements for Azure portal deployment.
- [Learn more](site-recovery-failback-azure-to-vmware.md) about failback in the Auzre portal.


## Replicate Hyper-V VMs not managed by VMM to Azure

![Hyper-V site to Azure](./media/site-recovery-components/arch-onprem-azure-hypervsite.png)

**Component** | **Details**
--- | ---
**Azure** | **Account**: You need an Azure account.<br/><br/> **Storage**: You need an Azure storage account to store replicated data. You can use a classic account or a Resource Manager storage account. The account must be GRS. Replicated data is stored in Azure storage and Azure VMs are spun up when failover occurs.<br/><br/> **Network**: You need an Azure virtual network that Azure VMs will connect to when they're created at failover.
**Hyper-V hosts/VMs** | One or more Hyper-V hosts, running one or more VMs.<br/><br/> The Site Recovery Provider and Recovery Services agent are installed on each host during deployment.

- [Learn more](site-recovery-hyper-v-site-to-azure.md#azure-prerequisites) about requirements for Azure portal deployment.
- [Learn more](site-recovery-hyper-v-site-to-azure-classic.md#azure-prerequisites) about requirements for classic portal deployment.



## Replicate Hyper-V VMs managed by VMM to Azure


![VMM to Azure](./media/site-recovery-components/arch-onprem-onprem-azure-vmm.png)

**Component** | **Details**
--- | ---
**Azure** | **Account**: You need an Azure account.<br/><br/> **Storage**: You need an Azure storage account to store replicated data. You can use a classic account or a Resource Manager storage account. The account must be GRS. Replicated data is stored in Azure storage and Azure VMs are spun up when failover occurs.<br/><br/> **Network**: You need an Azure virtual network that Azure VMs will connect to when they're created at failover.
**VMM server** | You need one or more on-premises VMM servers, with one or more private clouds. The Site Recovery Provider is installed on each server during deployment.
**Hyper-V hosts/VMs** | One or more Hyper-V hosts running one or more VMs.<br/><br/> The Recovery Services agent is installed on each host during deployment.


- [Learn more](site-recovery-vmm-to-azure.md#azure-requirements) about requirements for Azure portal deployment.
- [Learn more](site-recovery-vmm-to-azure-classic.md#before-you-start) about requirements for classic portal deployment.




## Replicate VMware virtual machines or physical server to a secondary site

![VMware to VMware](./media/site-recovery-components/vmware-to-vmware.png)


**Component** | **Details**
--- | ---
**Azure** | **Account**: You deploy this scenario using InMage Scout. To obtain it you'll need an Azure account.<br/><br/> After you create a Site Recovery vault, you download InMage Scout and install the latest updates to set up the deployment.
**Primary site** | **Process server**: Set up the process server component in your primary site to handle caching, compression, and data optimization. It also handles push installation of the Unified Agent to machines you want to protect.<br/><br/> **VMware ESX/ESXi and vCenter**: You need a VMware EXS/ESXi hypervisor and optionally a VMware vCenter server.<br/><br/> **VMs** | During deployment the Unified Agent is installed on machines you want to protect. The agent acts as a communication provider between all of the components.
**Secondary site** | **Configuration server**: The configuration server is the first component you install, and it's installed on the secondary site to manage, configure, and monitor your deployment, either using the management website or the vContinuum console. There's only a single configuration server in a deployment and it must be installed on a machine running Windows Server 2012 R2.<br/><br/> **vContinuum server (secondary site)**: It's installed in the same location as the configuration server. It provides a console for managing and monitoring your protected environment. In a default installation, the vContinuum server is the first master target server and has the Unified Agent installed.<br/><br/> **Master target server**: The master target server holds replicated data. It receives data from the process server, creates a replica machine in the secondary site, and holds the data retention points. The number of master target servers you need depends on the number of machines you're protecting. If you want to fail back to the primary site, you'll need a master target server there too.


To replicate VMware VMs or physical servers to a secondary site, download InMage Scout that's included in the Azure Site Recovery subscription. It can be downloaded from the Azure portal, or from the Azure classic portal.

You set up the component servers in each site (configuration, process, master target), and install the Unified Agent on machines that you want to replicate. After initial replication, the agent on each machine sends delta replication changes to the process server. The process server optimizes the data, and transfers it to the master target server on the secondary site. The configuration server manages the replication process.


## Replicate Hyper-V VMs managed by VMM to a secondary site

![On-premises to on-premises](./media/site-recovery-components/arch-onprem-onprem.png)

**Component** | **Details**
--- | ---
**Azure** | **Account**: You need an Azure account.
**VMM server** | We recommend a VMM server in the primary site, and one in the secondary site. Each server needs one or more private clouds.<br/><br/> During deployment you install the Azure Site Recovery Provider on the VMM server.
**Hyper-V hosts/VMs** | One or more Hyper-V hosts running in the VMM clouds in the primary and secondary site<br/><br/> Each host should have one or more VMs to replicate.<br/><br/>. The Recovery Services agent is installed on each host during deployment.

- [Learn more](site-recovery-vmm-to-vmm.md#azure-prerequisites) about deployment requirements in the Azure portal.
- [Learn more](site-recovery-vmm-to-vmm-classic.md#before-you-start) about deployment requirements in the Azure classic portal.


## Replicate Hyper-V VMs managed by VMM to a secondary site using SAN replication

![SAN replication](./media/site-recovery-components/arch-onprem-onprem-san.png)

You can replicate Hyper-V VMs managed in VMM clouds to a secondary site using SAN replication using the classic portal. This scenario isn't currently supported in the Azure portal.

**Component** | **Details**
--- | ---
**Azure** | **Account**: You need an Azure account.
**VMM server** | We recommend a VMM server in the primary site, and one in the secondary site. Each server needs one or more private clouds.<br/><br/> During deployment you install the Azure Site Recovery Provider on the VMM server.
**SAN** | A supported SAN array managed by the primary VMM server.<br/><br/> The SAN should share a network infrastructure with another SAN array in the secondary site.
**Hyper-V hosts/VMs** | One or more Hyper-V hosts running in the VMM clouds in the primary and secondary site<br/><br/> Each host should have one or more VMs to replicate.<br/><br/>. The Recovery Services agent is installed on each host during deployment.

In this scenario during Site Recovery deployment you'll install the Azure Site Recovery Provider on VMM servers. The Provider coordinates and orchestrates replication with the Site Recovery service over the internet. Data is replicated between the primary and secondary storage arrays using synchronous SAN replication.

[Learn more](site-recovery-vmm-san.md#before-you-start) about deployment requirements.

## Hyper-V protection lifecycle

This workflow shows the process for protecting, replicating, and failing over Hyper-V virtual machines.

1. **Enable protection**: You set up the Site Recovery vault, configure replication settings for a VMM cloud or Hyper-V site, and enable protection for VMs. A job called **Enable Protection** is initiated and can be monitored in the **Jobs** tab. The job checks that the machine complies with prerequisites and then invokes the [CreateReplicationRelationship](https://msdn.microsoft.com/library/hh850036.aspx) method which sets up replication to Azure with the settings you've configured. The **Enable protection** job also invokes the [StartReplication](https://msdn.microsoft.com/library/hh850303.aspx) method to initialize a full VM replication.
2. **Initial replication**: A virtual machine snapshot is taken, and virtual hard disks are replicated one by one until they're all copied to Azure, or to the secondary datacenter. The time needed to complete this depends on the VM size, network bandwidth, and the initial replication method. If disk changes occur while initial replication is in progress, the Hyper-V Replica replication tracker tracks those changes as Hyper-V replication logs (.hrl), located in the same folder as the disks. Each disk has an associated .hrl file that will be sent to secondary storage. Note that the snapshot and log files consume disk resources while initial replication is in progress. When the initial replication finishes, the VM snapshot is deleted and the delta disk changes in the log are synchronized and merged.
3. **Finalize protection**: After initial replication finishes, the **Finalize protection** job configures network and other post-replication settings so that the virtual machine is protected. If you're replicating to Azure, you might need to tweak the settings for the virtual machine so that it's ready for failover. At this point you can run a test failover to check everything is working as expected.
4. **Replication**: After the initial replication delta synchronization begins, in accordance with replication settings.
	- **Replication failure**: If delta replication fails, and a full replication would be costly in terms of bandwidth or time, then resynchronization occurs. For example if the .hrl files reach 50% of the disk size then the VM will be marked for resynchronization. Resynchronization minimizes the amount of data sent by computing checksums of the source and target virtual machines and sending only the delta. After resynchronization finishes delta replication will resume. By default resynchronization is scheduled to run automatically outside office hours, but you can resynchronize a virtual machine manually.
	- **Replication error**: If a replication error occurs there's a built-in retry. If it's a non-recoverable error such as an authentication or authorization error, or a replica machine is in an invalid state,  then no retry will be attempted. If it's a recoverable error such as a network error, or low disk space/memory, then a retry occurs with increasing intervals between retries (1, 2, 4, 8, 10, and then every 30 minutes).
4. **Planned/unplanned failovers**: You can run planned or unplanned failovers as needed. If you run a planned failover then source VMs are shut down to ensure no data loss. After replica VMs are created they're placed in a commit pending state. You need to commit them to complete the failover, unless you're replicating with SAN in which case commit is automatic. After the primary site is up and running failback can occur. If you've replicated to Azure reverse replication is automatic. Otherwise you kick off reverse replication manually.


![workflow](./media/site-recovery-components/arch-hyperv-azure-workflow.png)

## Next steps

[Prepare for deployment](site-recovery-best-practices.md)
