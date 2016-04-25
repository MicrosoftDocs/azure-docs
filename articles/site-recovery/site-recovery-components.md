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
	ms.date="02/16/2016"
	ms.author="raynew"/>

# How does Azure Site Recovery work?

This article describes the underlying architecture of Site Recovery and the components that make it work. After reading this article you can post any questions on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

## Overview

Organizations need a business continuity and disaster recovery (BCDR) strategy that a determines how apps, workloads, and data stay running and available during planned and unplanned downtime, and recover to normal working conditions as soon as possible. Your BCDR strategy center's around solutions that keep business data safe and recoverable, and workloads continuously available, when disaster occurs.

Site Recovery is an Azure service that contributes to your BCDR strategy by orchestrating replication of on-premises physical servers and virtual machines to the cloud (Azure) or to a secondary datacenter. When outages occur in your primary location, you fail over to the secondary site to keep apps and workloads available. You fail back to your primary location when it returns to normal operations.

Site Recovery can be used in a number of scenarios and can protect a number of workloads. 

- **Protect VMware virtual machines**: You can protect on-premises VMware virtual machines by replicating them to [Azure](site-recovery-vmware-to-azure-classic.md) or to a [secondary datacenter](site-recovery-vmware-to-vmware.md).
- **Protect Hyper-V VMs**: You can protect on-premises Hyper-V virtual machines in VMM clouds by replicating them to [Azure](site-recovery-vmm-to-azure.md) or to a [secondary datacenter](site-recovery-vmm-to-vmm.md). You can replicate Hyper-V VMs that aren't managed by VMM to [Azure](site-recovery-hyper-v-site-to-azure.md).
- **Protect physical servers to Azure**: You can protect physical machines running Windows or Linux by replicating them to [Azure](site-recovery-vmware-to-azure-classic.md) or to a [secondary datacenter](site-recovery-vmware-to-vmware.md).
- **Migrate VMs**: You can use Site Recovery to [migrate Azure IaaS VMs](site-recovery-migrate-azure-to-azure.md) between regions, or to [migrate AWS Windows instances](site-recovery-migrate-aws-to-azure.md) to Azure IaaS VMs.

Site Recovery can replicate most apps running on these VMs and physical servers. You can get a full summary of the supported apps in [What workloads can Azure Site Recovery protect?](site-recovery-workload.md)


## Replicate on-premises VMware virtual machines or physical servers to Azure

If you want to protect either VMware VMs, or Windows/Linux physical machines by replicating them to Azure here's what you'll need.

There are currently two different architectures available for this replication scenario:

- **Legacy architecture**: This architecture shouldn't be used for new deployments. 
- **Enhanced architecture**: This is the latest solution and should be used for all new deployments. You can also [migrate your legacy architecture](site-recovery-vmware-to-azure-classic-legacy.md#migrate-to-the-enhanced-deployment) to this new solution.

Here's the architecture for the enhanced deployment

![Enhanced](./media/site-recovery-components/arch-enhanced.png)

- **On-premises**: When you deploy the enhanced architecture you don't need to deploy infrastructure VMs in Azure. In addition, all traffic is encrypted and replication management communications are sent over HTTPS 443. Here's what you'll need in your on-premises infrastructure:

	- **Management server**: A single management server that runs all of the Site Recovery components, which include:

		- **Configuration server**: To coordinate communication between your on-premises environment and Azure and manage data replication and recovery processes.
		- **Process server**: Acts as a replication gateway. It receives data from protected source machines, optimizes it with caching, compression, and encryption, and sends replication data to Azure storage. It also handles push installation of Mobility service to protected machines and performs automatic discovery of VMware VMs. As your deployment grows you can add additional dedicated servers that run as process servers only to handle larger volumes of replication traffic.
		- **Master target server**: Handles replication data during failback from Azure. 

	- **VMware ESX/ESXi host and vCenter server**: One or more ESX/ESXi host servers on which VMware VMs are located. We recommend you have a vCenter server to manage those hosts. Note that even if you're protecting physical servers you'll need a VMware environment in order to fail back from Azure to your on-premises site.
	
	- **Protected machines**: Each machine you want to replicate to Azure will need the Mobility service component installed. It captures data writes on the machine and forwards them to the process server. This component can be installed manually or can be pushed and installed automatically by the process server when you enable protection for a machine.

- **Azure**: Here's what you'll need in your Azure infrastructure:
	- **Azure account**: You'll need a Microsoft Azure account.
	- **Azure storage**: You'll need an Azure storage account to store replicated data. Replicated data is stored in Azure storage and Azure VMs are spun up when failover occurs. 
	- **Azure network**: You'll need an Azure virtual network that Azure VMs will connect to when failover occurs. You’ll also need a VPN connection (or Azure ExpressRoute) set up from the Azure network to the on-premises site.

	![Enhanced](./media/site-recovery-components/arch-enhanced2.png)

Learn more about exact [deployment requirements](site-recovery-vmware-to-azure-classic.md#before-you-start-deployment).

### Failback architecture

- Failback from Azure must be to VMware VMs. You can't currently fail back to a physical server.
- To fail back you'll need a VPN connection (or Azure ExpressRoute) from your Azure network to your on-premises network.
- You'll need a process server in Azure for the failback. You can delete it after failback finishes.
- You'll need a master target server on-premises. A master target server is installed by default on the management server when you set it up on-premises. But for larger volumes of traffic we recommend you set up a separate master target server on premises for the failback.

![Enhanced failback](./media/site-recovery-components/enhanced-failback.png)

Learn more about [failback](site-recovery-failback-azure-to-vmware-classic.md).

### Legacy architecture

The legacy architecture requires an on-premises configuration server and process server, VMware ESX/ESXi hosts and vCenter server, and the Mobility service installed on machines you want to protect. In Azure you set up Azure VMs for the Configuration server and master target server. You'll also need an Azure subscription, storage account, and virtual network.



## Replicate Hyper-V VMs in VMM clouds to Azure

If you're VMs are located on a Hyper-V host that's managed in a System Center VMM cloud here's what you'll need in order to replicate them to Azure.

- On-premises: 
	- **VMM server**: At least one VMM server set up with at least one VMM private cloud.The server should be running on System Center 2012 R2. The VMM server should have internet connectivity. If you want to ensure that Azure VMs are connected to a network after failover you'll need to set up network mapping. To do this you need to connect source VMs to a VMM VM network. That network should be linked to a logical network that is associated with the cloud.
	- **Hyper-V server**: At least one Hyper-V host server located in the VMM cloud. The Hyper-V hosts should be running Windows Server 2012 R2.
	- **Protected machines**: The source Hyper-V host server should have an least one VM  you want to protect.
	
- Azure: 
	- **Azure account**: You'll need a Microsoft Azure account.
	- **Azure storage**: You'll need an Azure storage account to store replicated data. Replicated data is stored in Azure storage and Azure VMs are spun up when failover occurs.
	- **Azure network**: If you want to ensure that Azure VMs are connected to networks after failover you'll need to set up network mapping. To do this you'll need an Azure network set up.

	![VMM to Azure](./media/site-recovery-components/arch-onprem-onprem-azure-vmm.png)

In this scenario the Azure Site Recovery Provider is installed on the VMM server during Site Recovery deployment. It coordinates and orchestrates replication with the Site Recovery service over the internet. The Azure Recovery Services agent is installed during Site Recovery deployment on the Hyper-V host server, and data is replicated between it and Azure storage over HTTPS 443. Communications from both the Provider and the agent are secure and encrypted. Replicated data in Azure storage is also encrypted.

Learn more about exact [deployment requirements](site-recovery-vmm-to-azure.md#before-you-start).

## Replicate Hyper-V VMs to Azure (without VMM)

If your VMs aren't managed by a System Center VMM server  here's what you'll need to do to replicate them to Azure

- On-premises: 
	- **Hyper-V server**: At least one Hyper-V host server. The Hyper-V hosts should be running Windows Server 2012 R2.
	- **Protected machines**: The source Hyper-V host server should have an least one VM  you want to protect.
	
- Azure: 
	- **Azure account**: You'll need a Microsoft Azure account.
	- **Azure storage**: You'll need an Azure storage account to store replicated data. Replicated data is stored in Azure storage and Azure VMs are spun up when failover occurs.

	![Hyper-V site to Azure](./media/site-recovery-components/arch-onprem-azure-hypervsite.png)

In this scenario the Azure Site Recovery Provider and the Azure Recovery Services agent are installed on the VMM server during Site Recovery deployment. The Provider coordinates and orchestrates replication with the Site Recovery service over the internet. The agent handles data replication data over HTTPS 443. Communications from both the Provider and the agent are secure and encrypted. Replicated data in Azure storage is also encrypted.

Learn more about exact [deployment requirements](site-recovery-hyper-v-site-to-azure.md#before-you-start)

## Replicate Hyper-V VMs to a secondary datacenter

If you want to protect your Hyper-V VMs by replicating them to a secondary datacenter here's what you'll need. Note that you can only do this if your Hyper-V host server is managed in a System Center VMM cloud.

- **On-premises**: 
	- **VMM server**: We recommend a VMM server in the primary site and one in the secondary site, each containing at least one VMM private cloud.The server should be running at least System Center 2012 SP1 with latest updates, and connected to the internet. Clouds should have the Hyper-V capability profile set.
	- **Hyper-V server**: Hyper-V host servers located in the primary and secondary VMM clouds. The host servers should be running at least Windows Server 2012 with the latest updates installed, and connected to the internet.
	- **Protected machines**: The source Hyper-V host server should have an least one VM  you want to protect.
	
- **Azure**:  You'll need an Azure subscription.

	![On-premises to on-premises](./media/site-recovery-components/arch-onprem-onprem.png)

In this scenario the Azure Site Recovery Provider is installed during Site Recovery deployment on the VMM server. It coordinates and orchestrates replication with the Site Recovery service over the internet. Data is replicated between the primary and secondary Hyper-V host servers over the LAN or VPN using Kerberos or certificate authentication. Communications from both the Provider and between Hyper-V host servers are secure and encrypted. 

Learn more about exact [deployment requirements](site-recovery-vmm-to-vmm.md#before-you-start)



## Replicate Hyper-V VMs to a secondary datacenter with SAN replication

If your VMs are located on a Hyper-V host that's managed in a System Center VMM cloud and you're using SAN storage here's what you'll need in order to replicate between two datacenters.

- **On-premises**: 
	- **SAN array**: A [supported SAN array](http://social.technet.microsoft.com/wiki/contents/articles/28317.deploying-azure-site-recovery-with-vmm-and-san-supported-storage-arrays.aspx) managed by the primary VMM server. The SAN shares a network infrastructure with another SAN array in the secondary site.
	- **VMM server**: We recommend a VMM server in the primary site and one in the secondary site, each containing at least one VMM private cloud.The server should be running at least System Center 2012 SP1 with latest updates, and connected to the internet. Clouds should have the Hyper-V capability profile set.
	- **Hyper-V server**: Hyper-V host servers located in the primary and secondary VMM clouds. The host servers should be running at least Windows Server 2012 with the latest updates installed, and connected to the internet.
	- **Protected machines**: The source Hyper-V host server should have an least one VM  you want to protect.
	
- **Azure**:  You'll need an Azure subscription.

	![SAN replication](./media/site-recovery-components/arch-onprem-onprem-san.png)

In this scenario the Azure Site Recovery Provider is installed during Site Recovery deployment on the VMM server. It coordinates and orchestrates replication with the Site Recovery service over the internet. Data is replicated between the primary and secondary storage arrays using synchronous SAN replication. 

Learn more about exact [deployment requirements](site-recovery-vmm-san.md#before-you-start)


## Replicate VMware virtual machines or physical servers to a secondary site

If you want to protect either VMware VMs, or Windows/Linux physical machines by replicating them between two on-premises datacenters here's what you'll need.

- **On-premises primary**: 
	- **Process server**: Set up the process server component in your primary site to handle caching, compression, and data optimization. It also handles push installation of the Unified Agent to machines you want to protect.
	- **VMware ESX/ESXi and vCenter server**: If you're protecting VMware VMs you'll need a VMware EXS/ESXi hypervisor or a VMware vCenter server managing multiple hypervisors
	- Protected machines: VMware VMs or Windows/Linux physical servers you want to protect will need the Unified Agent installed. The Unified Agent is also installed on the machines acting as the master target server. It acts as a communication provider between all the InMage components.
	
- **On-premises secondary**: 
	- **Configuration server**: The configuration server is the first component you install, and it's installed on the secondary site to manage, configure, and monitor your deployment, either using the management website or the vContinuum console. The configuration server also includes the push mechanism for remote deployment of the Unified Agent. There's only a single configuration server in a deployment and it must be installed on a machine running Windows Server 2012 R2.
	- **vContinuum server**: It's installation in the same location (secondary site) as the configuration server. It provides a console for managing and monitoring your protected environment. In a default install the vContinuum server is the first master target server and has the Unified Agent installed.
	- **Master target server**: The master target server holds replicated data. It receives data from the process server and creates a replica machine in the secondary site, and holds the data retention points. The number of master target servers you need depends on the number of machines you're protecting. If you want to fail back to the primary site you'll need a master target server there too. 

- **Azure**: You'll need an Azure subscription. You download InMage Scout to set up the deployment after creating a Site Recovery vault. You also install the latest update for all the InMage component servers.


	![VMware to VMware](./media/site-recovery-components/vmware-to-vmware.png)

In this scenario delta replication changes are sent from the Unified Agent running on the protected machine to the process server. The process server optimizes this data and transfers it to the master target server on the secondary site. The configuration server manages the replication process.


## Hyper-V protection lifecycle

This workflow shows the process for protecting, replicating, and failing over Hyper-V virtual machines. 

1. **Enable protection**: You set up the Site Recovery vault, configure replication settings for a VMM cloud or Hyper-V site, and enable protection for VMs. A job called **Enable Protection** is initiated and can be monitored in the **Jobs** tab. The job checks that the machine complies with prerequisites and then invokes the [CreateReplicationRelationship](https://msdn.microsoft.com/library/hh850036.aspx) method which sets up replication to Azure with the settings you've configured. The **Enable protection** job also invokes the [StartReplication](https://msdn.microsoft.com/library/hh850303.aspx) method to initialize a full VM replication.
2. **Initial replication**: A virtual machine snapshot is taken and virtual hard disks are replicated one by one until they're all copied to Azure or to the secondary datacenter. This The time to complete this depends on the size and network bandwidth and the initial replication method you've chosen. If disk changes occur while initial replication is in progress the Hyper-V Replica Replication Tracker tracks those changes as Hyper-V Replication Logs (.hrl) that are located in the same folder as the disks. Each disk has an associated .hrl file that will be sent to secondary storage. Note that the snapshot and log files consume disk resources while initial replication is in progress. When the initial replication finishes the VM snapshot is deleted and the delta disk changes in the log are synchronized and merged.
3. **Finalize protection**: After initial replication finishes the **Finalize protection** job configures network and other post-replication settings and the virtual machine is protected. If you're replicating to Azure you might need to tweak the settings for the virtual machine so that it's ready for failover. At this point you can run a test failover to check everything's working as expected.
4. **Replication**: After initial replication delta synchronized occurs, in accordance with the replication settings and method. 
	- **Replication failure**: If delta replication fails and a full replication would be costly in terms of bandwidth or time then resynchronization occurs. For example if the .hrl files reach 50% of the disk size then the virtual machine will be marked for resynchronization. Resynchronization minimizes the amount of data sent by computing checksums of the source and target virtual machines and sending only the delta. After resynchronization finishes delta replication should resume. By default resynchronization is scheduled to run automatically outside office hours, but you can resynchronize a virtual machine manually.
	- **Replication error**: If a replication error occurs there's a built-in retry. If it's a non-recoverable error such as an authentication or authorization error, or a replica machine in an invalid state no retry will be attempted. If it's a recoverable error such as a network error, or low disk space/memory then a retry occurs with increasing intervals between retries (1, 2, 4, 8, 10, and then every 30 minutes).
4. **Planned/unplanned failovers**: You run planned/unplanned failovers when the need arises. If you run a planned failover source VMs are shut down to ensure no data loss. After replica VMs are created they're in a commit pending state. You need to commit them to complete the failover unless you're replicating with SAN in which case commit is automatic. After the primary site is up and running failback can occur. If you've replicated to Azure reverse replication is automatic. Otherwise you kick off a reverse replication.
 

![workflow](./media/site-recovery-components/arch-hyperv-azure-workflow.png)

## Next steps

[Get ready for deployment](site-recovery-best-practices.md).
