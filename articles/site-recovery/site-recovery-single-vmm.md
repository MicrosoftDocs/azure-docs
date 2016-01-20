
<properties
	pageTitle="Azure Site Recovery: Replicate Hyper-V virtual machines (single VMM server)"
	description="Azure Site Recovery coordinates the replication, failover and recovery of virtual machines located in on-premises VMM clouds to Azure or to a secondary VMM cloud."
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
	ms.date="12/01/2015"
	ms.author="raynew"/>

#  Azure Site Recovery: Replicate Hyper-V virtual machines (single VMM server)

The Azure Site Recovery service contributes to a robust business continuity and disaster recovery (BCDR) solution by orchestrating and automating replication of on-premises physical servers and virtual machines to Azure, or to a secondary on-premises datacenter. This article describes how to deploy Site Recovery to protect Hyper-V virtual machines that are located in a VMM cloud, when you only have a single VMM server in your deployment. If you have any questions after reading this article post them on the [Azure Recovery Services forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr). 

## Overview

You can replicate Hyper-V VMs in a couple of ways:

- Replicate Hyper-V VMs that are located on Hyper-V hosts that aren't located in a VMM cloud to Azure
- Replicate Hyper-V VMs that are located on Hyper-V hosts in a VMM cloud to Azure
- Replicate Hyper-V VMs that are located on Hyper-V hosts in a VMM cloud to Azure

But what happens if you want to use VMM but only have a single VMM server in your infrastructure?

In this case you have a couple of options:

- Replicate your Hyper-V VMs in your VMM clouds to Azure. [Learn more](site-recovery-vmm-to-azure.md) about this scenario.
- Replicate between clouds on the single VMM server

We recommend the first option since failover and recovery isn't seamless in the second option and a number of manual steps are required. 


### Replicate across sites with a single standalone VMM server

In this scenario you'll deploy your single standalone VMM server as a virtual machine in a primary site, and replicate this virtual machine to a secondary site with Site Recovery and Hyper-V Replica. To do this:

1. Set up VMM on a Hyper-V VM. Consider colocating the SQL Server instance used by VMM on the same VM. This saves time as only one VM has to be instantiated. If you want to use a remote instance and an outage occurs you'll need to recover that instance before you recover VMM.
2. MAke sure the VMM server has at least two clouds configured. One cloud will contain the VMs you want to replicate and the other cloud will serve as the secondary location. The cloud contains the VMs you want to protection should have one or more VMM host groups with one or more Hyper-V host servers in each host group, and at least one Hyper-V virtual machine on each host server.
2. Create a Site Recovery vault, generate and download a vault registration key, and register the VMM server in the vault.
2. Set up one or more clouds on the VMM VM, and add the Hyper-V hosts that contain VMs you want to protect to these clouds.
3. In Azure Site Recovery configure protection settings for the clouds. In Source and Target Location you'll specify the name of the single VMM server. If you configure network mapping you'll map the VM network for the cloud that contains VMs you want to protect to the VM network for the cloud to which you want to replicate.
4. Enable replication for VMs you want to protect using **Over the network** as the replication method because both clouds are located on the same server.
4. In the Hyper-V Manager console, enable Hyper-V Replica on the Hyper-V host that contains the VMM VM, and enable replication on the VM. Make sure you don't add the VMM virtual machine to clouds that are protected by Site Recovery, to ensure that Hyper-V Replica settings aren't overridden by Site Recovery.
5. If you want to create recovery plans you specify the same VMM server for source and target. 

When outages occur you recover workloads on Hyper-V VMs as follows:

1. Manually fail over the replica VMM VM to the secondary site using Hyper-V Manager with a planned failover.
2. After the VMM VM has been recovered, you can log into Hyper-V Recovery Manager from the secondary site and do an unplanned failover of the VMs from the primary site to the secondary site.
3. After the unplanned failover is complete, the user can access all the resources at the primary site.

Note that the VMM VM will need to be failed over manually to the secondary site before workloads can be failed over. 

![Standalone virtual VMM server](./media/site-recovery-single-vmm/single-vmm-standalone.png)

### Replicate across sites with a single VMM server in a stretched cluster

Instead of deploying a standalone VMM server as a virtual machine that replicates to a secondary site, you can make VMM highly available by deploying it as a VM in a Windows failover cluster, providing workload resilience and protection against hardware failure. To deploy with Site Recovery the VMM should be deployed in a stretch cluster across geographically separate sites. To do this:

1. You install VMM on a virtual machines in a Windows failover cluster, and select option to run the server as highly available during setup.
2. The SQL Server instance used by VMM should be replicated with SQL Server AlwaysOn availability groups so that there's a replica of the database in the secondary site. 

When outages occur the VMM server and it's corresponding SQL Server database are failed over and accessed from the secondary site.

![Clustered virtual VMM server](./media/site-recovery-single-vmm/single-vmm-cluster.png)




 
