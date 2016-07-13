
<properties
	pageTitle="Azure Site Recovery: Replicate Hyper-V virtual machines on a single VMM server | Microsoft Azure"
	description="This article describes how to replicate Hyper-V virtual machines when you only have a single VMM server."
	services="site-recovery"
	documentationCenter=""
	authors="rayne-wiselman"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="site-recovery"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="backup-recovery"
	ms.date="07/06/2016"
	ms.author="raynew"/>

#  Replicate Hyper-V virtual machines on a single VMM server

Read this article to learn how to replicate Hyper-V virtual machines located on a Hyper-V host server in a VMM cloud when you only have a single VMM server in your deployment.

If you have any questions after reading this article post them at the bottom or on the [Azure Recovery Services forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr). 

## Overview

You can replicate Hyper-V VMs located on Hyper-V hosts in VMM clouds in a couple of ways:

- Replicate to Azure. 
- Replicate to a secondary VMM site

But what happens if you want to replicate to a secondary VMM location but you only have a single VMM server in your deployment?  

In this scenario you have a couple of options:

- Replicate the Hyper-V VMs in VMM clouds to Azure. [Learn more](site-recovery-vmm-to-azure.md) about this scenario.
- Replicate between clouds on the single VMM server.

We recommend the first option because failover and recovery aren't seamless in the second option, and a number of manual steps will be required. If you do want to replicate across sites rather than to Azure you have a couple of options.


## Replicate across sites with a single standalone VMM server

To replicate across sites in this scenario you'll deploy the single VMM server as a virtual machine in the primary site, and replicate this VM to a secondary site using Site Recovery and Hyper-V Replica. To do this:

1. Set up VMM on a Hyper-V VM. When you do this we suggest you also consider colocating the SQL Server instance used by VMM on the same VM. This saves time as only one VM has to be instantiated. If you want do use a remote instance of SQL Server and an outage occurs, you'll need to recover that instance before you can recover VMM.
2. Make sure that the VMM server has at least two clouds configured. One cloud will contain the VMs you want to replicate and the other cloud will serve as the secondary location. The cloud that contains the VMs you want to protect should have:

	- One or more VMM host groups containing one or more Hyper-V host servers in each host group.
	- At least one Hyper-V virtual machine on each Hyper-V host server.
3. Create a Site Recovery vault, generate and download a vault registration key, and register the VMM server in the vault. During registration you'll install the Azure Site Recovery Provider on the VMM server.
4. Set up one or more clouds on the VMM VM, and add the Hyper-V hosts that contain VMs you want to protect to these clouds.
3. In Azure Site Recovery configure protection settings for the clouds. In Source and Target Location you'll specify the name of the single VMM server. If you configure network mapping you'll map the VM network for the cloud that contains VMs you want to protect to the VM network for the cloud to which you want to replicate.
4. Enable replication for VMs you want to protect using **Over the network** as the replication method because both clouds are located on the same server.
4. In the Hyper-V Manager console, enable Hyper-V Replica on the Hyper-V host that contains the VMM VM, and enable replication on the VM. Make sure you don't add the VMM virtual machine to clouds that are protected by Site Recovery, to ensure that Hyper-V Replica settings aren't overridden by Site Recovery.
5. If you want to create recovery plans you specify the same VMM server for source and target.

Follow the instructions in [this article](site-recovery-vmm-to-vmm.md) for creating a vault, obtaining a key, registering the server, and setting up protection. 

### After an outage

When an outage occurs you'll recover workloads on Hyper-V VMs as follows:

1. Manually fail over the VMM VM to the secondary site using Hyper-V Manager with a planned failover. 
2. After the VMM VM has been recovered, you can log into Hyper-V Recovery Manager from the secondary site, and run an unplanned failover of the VMs from the secondary site to the primary site. Note that the VMM VM must be failed over manually to the secondary site before workload VMs can be failed over.
3. After the unplanned failover is complete, all resources can be accessed from the primary site again.


![Standalone virtual VMM server](./media/site-recovery-single-vmm/single-vmm-standalone.png)

## Replicate across sites with a single VMM server in a stretched cluster

Instead of deploying a standalone VMM server as a virtual machine that replicates to a secondary site, you can make VMM highly available by deploying it as a VM in a Windows failover cluster. This provides workload resilience and protection against hardware failure. To deploy with Site Recovery the VMM VM should be deployed in a stretch cluster across geographically separate sites. To do this:

1. Install VMM on a virtual machines in a Windows failover cluster, and select the option to run the server as highly available during setup.
2. The SQL Server instance that's used by VMM should be replicated with SQL Server AlwaysOn availability groups so that there's a replica of the database in the secondary site.

Note that when you set up Site Recovery you'll need to register each VMM server in the cluster in the Site Recovery vault. To do this you install the Provider on an active node and finish the installation to register that VMM server in the vault. Then you install the Provider on other nodes. 
 
### After an outage 

When an outage occur the VMM server and it's corresponding SQL Server database are failed over and accessed from the secondary site.

![Clustered virtual VMM server](./media/site-recovery-single-vmm/single-vmm-cluster.png)

## Next steps

[Learn more](site-recovery-vmm-to-vmm.md) about detailed Site Recovery deployment for VMM to VMM replication.




 
