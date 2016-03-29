<properties
	pageTitle="How does Site Recovery work? | Microsoft Azure"
	description="This article provides an overview of Site Recovery architecture"
	services="site-recovery"
	documentationCenter=""
	authors="rayne-wiselman"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="site-recovery"
	ms.workload="backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="03/27/2016"
	ms.author="raynew"/>

# How does Azure Site Recovery work?

Read this article to understand the underlying architecture of the Azure Site Recovery service and the components that make it work. 

Post any comments or questions at the bottom of this article, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).


## Overview

Organizations need a business continuity and disaster recovery (BCDR) strategy that a determines how apps, workloads, and data remain available during planned and unplanned downtime, and recover to regular working conditions as soon as possible.

Site Recovery is an Azure service that contributes to your BCDR strategy by orchestrating replication of on-premises physical servers and virtual machines to the cloud (Azure) or to a secondary site. When outages occur in your primary location, you fail over to the secondary site to keep apps and workloads available. You fail back to your primary location when it returns to normal operations.

Site Recovery can be deployed to orchestrate replication in a number of scenarios:

- **Replicate VMware virtual machines**: You can replicate on-premises VMware virtual machines to [Azure](site-recovery-vmware-to-azure-classic.md) or to a [secondary datacenter](site-recovery-vmware-to-vmware.md).
- **Replicate physical machines**: You can replicate physical machines running Windows or Linux to [Azure](site-recovery-vmware-to-azure-classic.md) or to a [secondary datacenter](site-recovery-vmware-to-vmware.md).
- **Replicate Hyper-V VMs managed in System Center VMM clouds**: You can replicate on-premises Hyper-V virtual machines in VMM clouds to [Azure](site-recovery-vmm-to-azure.md) or to a [secondary datacenter](site-recovery-vmm-to-vmm.md). 
- **Replicate Hyper-V VMs (without VMM)**: You can replicate Hyper-V VMs that aren't managed by VMM to [Azure](site-recovery-hyper-v-site-to-azure.md).
- **Migrate VMs**: You can use Site Recovery to [migrate Azure IaaS VMs](site-recovery-migrate-azure-to-azure.md) between regions, or to [migrate AWS Windows instances](site-recovery-migrate-aws-to-azure.md) to Azure IaaS VMs. Currently only migration is supported which means you can fail over these VMs but you can't fail them back.

Site Recovery can replicate most apps running on these VMs and physical servers. You can get a full summary of the supported apps in [What workloads can Azure Site Recovery protect?](site-recovery-workload.md)

## Replicate on-premises VMware virtual machines/physical servers to Azure

There are currently two different architectures available for replicating VMware VMs or physical Windows/Linux servers to Azure:

- [Legacy architecture](site-recovery-vmware-to-azure-classic-legacy.md): This architecture shouldn't be used for new deployments. 
- [Enhanced architecture](site-recovery-vmware-to-azure-classic.md): This is the latest architecture and should be used for all new deployments. If you've already deployed this scenario using the legacy architecture [learn about migration](site-recovery-vmware-to-azure-classic-legacy.md#migrate-to-the-enhanced-deployment) to the enhanced deployment.

In the enhanced deployment you'll need to set up an on-premises management server with all Site Recovery components. On each machine that you want to protect you automatically push (or manually install) the Mobility service. After initial replication the Mobility service on the machine sends delta replication data to the process server, which optimizes it before sending it to Azure storage.

![Enhanced](./media/site-recovery-components/arch-enhanced.png)
![Enhanced](./media/site-recovery-components/arch-enhanced2.png)

### On-premises
Here's what you need on-premises:

- **Management server**: You'll need a Windows Server 2012 R2 machine to act as the Management server. On this server you'll install all these Site Recovery components with a single installation file:

	- **Configuration server component**: Coordinates communication between your on-premises environment and Azure, and manages data replication and recovery.
	- **Process server component**: Acts as a replication gateway. It receives replication data from protected source machines, optimizes it with caching, compression, and encryption, and sends the data to Azure storage. It also handles push installation of the Mobility service to protected machines, and performs automatic discovery of VMware VMs. As your deployment grows you can add additional separate dedicated process servers to handle increasing volumes of replication traffic.
	- **Master target server component**: Handles replication data during failback from Azure. 
- **VMware ESX/ESXi hosts and vCenter server**: You'll need one or more ESX/ESXi host servers running VMware VMs. We recommend that you deploy a vCenter server to manage those hosts. **Note:** **Even if you're replicating physical servers you have to fail them back to VMware**. When you replicate a physical server it will run as an Azure VM when you fail over to Azure. It will fail back to on-premises as a VMware VM. 
	
- **VMs/physical servers**: Each machine that you want to replicate to Azure will need the Mobility service component installed. This service captures data writes on the machine and forwards them to the process server. This component can be installed manually, or can be pushed and installed automatically by the process server when you enable replication for a machine.

### Azure

Here's what you'll need in the Azure infrastructure:
	- **Azure account**: You'll need a Microsoft Azure account.
	- **Azure storage**: You'll need an Azure storage account to store replicated data. Replicated data is stored in Azure storage and Azure VMs are spun up when failover occurs. 
	- **Azure network**: You'll need an Azure virtual network that spun up Azure VMs will connect to when failover occurs. 
	
	
### Failback

Failback to on-premises is always to VMware VMs, even if you failed over a physical server. Here's what you'll  need:

- **Temporary process server in Azure**: If you want to fail back from Azure after failover you'll need to set up an Azure VM configured as a process server, to handle replication from Azure. You can delete this VM after failback finishes.
- **VPN connection**: For failback you'll need a VPN connection (or Azure ExpressRoute) set up from the Azure network to the on-premises site.
- **Separate on-premises master target server**: The on-premises master target server handles failback. The master target server is installed by default on the management server, but if you're failing back larger volumes of traffic you should set up a separate on-premises master target server for this purpose. 

![Enhanced failback](./media/site-recovery-components/enhanced-failback.png)

[Learn more](site-recovery-vmware-to-azure-classic.md#before-you-start-deployment) about enhanced deployment requirements.
[Learn more](site-recovery-failback-azure-to-vmware-classic.md) about failback for the enhanced deployment.




## Replicate Hyper-V VMs in VMM clouds to Azure

To deploy this scenario during Site Recovery deployment you'll install the Azure Site Recovery Provider on the VMM server. The Provider coordinates and orchestrates replication with the Site Recovery service over the internet. The Azure Recovery Services agent is installed during Site Recovery deployment on the Hyper-V host server, and data is replicated between it and Azure storage over HTTPS 443. Communications from both the Provider and the agent are secure and encrypted. Replicated data in Azure storage is also encrypted.

- On-premises: 
	- **VMM server**: At least one VMM server set up with at least one VMM private cloud. The server should be running on System Center 2012 R2 and should have internet connectivity. If you want to ensure that Azure VMs are connected to a network after failover you'll need to set up network mapping. To do this your source VMs should be connected to a VMM VM network. That VM network should be linked to a logical network that's associated with the cloud.
	- **Hyper-V server**: At least one Hyper-V host server located in the VMM cloud. The Hyper-V hosts should be running Windows Server 2012 R2.
	- **Protected machines**: The source Hyper-V host server should have at least one VM that you want to protect.
	
- Azure: 
	- **Azure account**: You'll need a Microsoft Azure account.
	- **Azure storage**: You'll need an Azure storage account to store replicated data. Replicated data is stored in Azure storage and Azure VMs are spun up when failover occurs.
	- **Azure network**: If you want to set up network mapping so that Azure VMs are connected to networks after failover you'll need to set up an Azure network.

	![VMM to Azure](./media/site-recovery-components/arch-onprem-onprem-azure-vmm.png)

Learn more about exact [deployment requirements](site-recovery-vmm-to-azure.md#before-you-start).

## Replicate VMware virtual machines or physical servers to a secondary site

To replicate VMware VMS or Windows/Linux physical servers to a secondary site you'll download InMage Scout that's included in the Azure Site Recovery subscription. You set up the component servers in each site (configuration, process, master target), and install the Unified Agent on machines that you want to replicate. After initial replication the agent on each machine sends delta replication changes to the process server. The process server optimizes the data and transfers it to the master target server on the secondary site. The configuration server manages the replication process.

![VMware to VMware](./media/site-recovery-components/vmware-to-vmware.png)

### On-premises primary site

- **Process server**: Set up the process server component in your primary site to handle caching, compression, and data optimization. It also handles push installation of the Unified Agent to machines you want to protect. 
- **VMware ESX/ESXi and vCenter server**: If you're protecting VMware VMs you'll need a VMware EXS/ESXi hypervisor and optionally a VMware vCenter server to manage hypervisors.
- **VMs/physical servers**: VMware VMs or Windows/Linux physical servers you want to protect will need the Unified Agent installed. The Unified Agent is also installed on the machines acting as the master target server. The agent acts as a communication provider between all of the components. 
	
### On-premises secondary site
 
- **Configuration server**: The configuration server is the first component you install, and it's installed on the secondary site to manage, configure, and monitor your deployment, either using the management website or the vContinuum console. There's only a single configuration server in a deployment and it must be installed on a machine running Windows Server 2012 R2.
- **vContinuum server**: It's installed in the same location (secondary site) as the configuration server. It provides a console for managing and monitoring your protected environment. In a default installation the vContinuum server is the first master target server and has the Unified Agent installed.
- **Master target server**: The master target server holds replicated data. It receives data from the process server, creates a replica machine in the secondary site, and holds the data retention points. The number of master target servers you need depends on the number of machines you're protecting. If you want to fail back to the primary site you'll need a master target server there too. 

### Azure

You deploy this scenario using InMage Scout. To obtain it you'll need an Azure subscription. After you create a Site Recovery vault you download InMage Scout and install the latest updates to set up the deployment.


## Replicate Hyper-V VMs to Azure (without VMM)

To replicate Hyper-V VMs that aren't managed in VMM clouds to Azure you install the Azure Site Recovery Provider and the Azure Recovery Services agent on the Hyper-V host during Site Recovery deployment. The Provider coordinates and orchestrates replication with the Site Recovery service over the internet. The agent handles data replication data over HTTPS 443. Communications from both the Provider and the agent are secure and encrypted. Replicated data in Azure storage is also encrypted.

![Hyper-V site to Azure](./media/site-recovery-components/arch-onprem-azure-hypervsite.png)

### On-premises

- **Hyper-V server**: At least one Hyper-V host server. The Hyper-V hosts should be running Windows Server 2012 R2.
- **Protected machines**: The source Hyper-V host server should have at least one VM that you want to protect.
	
### Azure

- **Azure account**: You'll need a Microsoft Azure account.
- **Azure storage**: You'll need an Azure storage account to store replicated data. Replicated data is stored in Azure storage and Azure VMs are spun up when failover occurs.

[Learn more](site-recovery-hyper-v-site-to-azure.md#before-you-start) about deployment requirements.


## Replicate Hyper-V VMs in VMM clouds to Azure

To deploy this scenario, during Site Recovery deployment you install the Azure Site Recovery Provider on the VMM server, and the Azure Recovery Services agent on the Hyper-V host. The Provider coordinates and orchestrates replication with the Site Recovery service over the internet. The agent handles data replication data over HTTPS 443. Communications from both the Provider and the agent are secure and encrypted. Replicated data in Azure storage (at rest) is also encrypted.

![VMM to Azure](./media/site-recovery-components/arch-onprem-onprem-azure-vmm.png)

### On-premises

- **VMM server**: At least one VMM server set up with at least one VMM private cloud. The server should be running on System Center 2012 R2 and should have internet connectivity. If you want to ensure that Azure VMs are connected to a network after failover you'll need to set up network mapping. To do this you need to connect source VMs to a VMM VM network. That network should be linked to a logical network that is associated with the cloud.
- **Hyper-V server**: At least one Hyper-V host server located in the VMM cloud. The Hyper-V hosts should be running Windows Server 2012 R2.
- **Protected machines**: The source Hyper-V host server should have at least one VM that you want to protect.
	
### Azure

- **Azure account**: You'll need a Microsoft Azure account.
- **Azure storage**: You'll need an Azure storage account to store replicated data. Replicated data is stored in Azure storage and Azure VMs are spun up when failover occurs.
- **Azure network**: If you want to ensure that Azure VMs are connected to networks after failover you'll need to set up network mapping. To do this you'll need an Azure network.

[Learn more](site-recovery-vmm-to-azure.md#before-you-start) about deployment requirements.

## Replicate Hyper-V VMs to a secondary datacenter

To deploy this scenario, during Site Recovery deployment you'll install the Azure Site Recovery Provider on the VMM server. The Provider coordinates and orchestrates replication with the Site Recovery service over the internet. Data is replicated between the primary and secondary Hyper-V host servers over the LAN or VPN using Kerberos or certificate authentication. Communications from both the Provider and between Hyper-V host servers are secure and encrypted. 

![On-premises to on-premises](./media/site-recovery-components/arch-onprem-onprem.png)

### On-premises

- **VMM server**: We recommend a VMM server in the primary site and one in the secondary site, each containing at least one VMM private cloud. The server should be running at least System Center 2012 SP1 with latest updates, and connected to the internet. Clouds should have the Hyper-V capability profile set.
- **Hyper-V server**: Hyper-V host servers should be located in the primary and secondary VMM clouds. The host servers should be running at least Windows Server 2012 with the latest updates installed, and connected to the internet.
- **Protected machines**: The source Hyper-V host server should have at least one VM that you want to protect.
	
### Azure

You'll need an Azure subscription.

[Learn more](site-recovery-vmm-to-vmm.md#before-you-start) about deployment requirements.


## Replicate Hyper-V VMs to a secondary datacenter with SAN replication

In this scenario during Site Recovery deployment you'll install the Azure Site Recovery Provider on VMM servers. The Provider coordinates and orchestrates replication with the Site Recovery service over the internet. Data is replicated between the primary and secondary storage arrays using synchronous SAN replication.

![SAN replication](./media/site-recovery-components/arch-onprem-onprem-san.png)

### On-premises

- **SAN array**: A [supported SAN array](http://social.technet.microsoft.com/wiki/contents/articles/28317.deploying-azure-site-recovery-with-vmm-and-san-supported-storage-arrays.aspx) managed by the primary VMM server. The SAN shares a network infrastructure with another SAN array in the secondary site.
- **VMM server**: We recommend a VMM server in the primary site and one in the secondary site, each containing at least one VMM private cloud. The server should be running at least System Center 2012 SP1 with latest updates, and connected to the internet. Clouds should have the Hyper-V capability profile set.
- **Hyper-V server**: Hyper-V host servers located in the primary and secondary VMM clouds. The host servers should be running at least Windows Server 2012 with the latest updates installed, and connected to the internet.
- **Protected machines**: The source Hyper-V host server should have at least one VM that you want to protect.
	
### Azure

You'll need an Azure subscription.	

[Learn more](site-recovery-vmm-san.md#before-you-start) about deployment requirements.


## Hyper-V protection lifecycle

This workflow shows the process for protecting, replicating, and failing over Hyper-V virtual machines. 

1. **Enable protection**: You set up the Site Recovery vault, configure replication settings for a VMM cloud or Hyper-V site, and enable protection for VMs. A job called **Enable Protection** is initiated and can be monitored in the **Jobs** tab. The job checks that the machine complies with prerequisites and then invokes the [CreateReplicationRelationship](https://msdn.microsoft.com/library/hh850036.aspx) method which sets up replication to Azure with the settings you've configured. The **Enable protection** job also invokes the [StartReplication](https://msdn.microsoft.com/library/hh850303.aspx) method to initialize a full VM replication.
2. **Initial replication**: A virtual machine snapshot is taken and virtual hard disks are replicated one by one until they're all copied to Azure or to the secondary datacenter. The time needed to complete this depends on the VM size, network bandwidth, and the initial replication method. If disk changes occur while initial replication is in progress the Hyper-V Replica Replication Tracker tracks those changes as Hyper-V Replication Logs (.hrl) that are located in the same folder as the disks. Each disk has an associated .hrl file that will be sent to secondary storage. Note that the snapshot and log files consume disk resources while initial replication is in progress. When the initial replication finishes the VM snapshot is deleted and the delta disk changes in the log are synchronized and merged.
3. **Finalize protection**: After initial replication finishes the **Finalize protection** job configures network and other post-replication settings so that the virtual machine is protected. If you're replicating to Azure you might need to tweak the settings for the virtual machine so that it's ready for failover. At this point you can run a test failover to check everything is working as expected.
4. **Replication**: After the initial replication delta synchronization begins, in accordance with replication settings. 
	- **Replication failure**: If delta replication fails, and a full replication would be costly in terms of bandwidth or time, then resynchronization occurs. For example if the .hrl files reach 50% of the disk size then the VM will be marked for resynchronization. Resynchronization minimizes the amount of data sent by computing checksums of the source and target virtual machines and sending only the delta. After resynchronization finishes delta replication will resume. By default resynchronization is scheduled to run automatically outside office hours, but you can resynchronize a virtual machine manually.
	- **Replication error**: If a replication error occurs there's a built-in retry. If it's a non-recoverable error such as an authentication or authorization error, or a replica machine is in an invalid state,  then no retry will be attempted. If it's a recoverable error such as a network error, or low disk space/memory, then a retry occurs with increasing intervals between retries (1, 2, 4, 8, 10, and then every 30 minutes).
4. **Planned/unplanned failovers**: You can run planned or unplanned failovers as needed. If you run a planned failover then source VMs are shut down to ensure no data loss. After replica VMs are created they're placed in a commit pending state. You need to commit them to complete the failover, unless you're replicating with SAN in which case commit is automatic. After the primary site is up and running failback can occur. If you've replicated to Azure reverse replication is automatic. Otherwise you kick off reverse replication manually.
 

![workflow](./media/site-recovery-components/arch-hyperv-azure-workflow.png)

## Next steps

[Prepare for deployment](site-recovery-best-practices.md)
