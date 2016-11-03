
---
title: 'Azure Site Recovery: Replicate Hyper-V virtual machines on a single VMM server | Microsoft Docs'
description: This article describes how to replicate Hyper-V virtual machines when you only have a single VMM server.
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: jwhit
editor: ''

ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: backup-recovery
ms.date: 08/24/2016
ms.author: raynew

---
# Replicate Hyper-V virtual machines on a single VMM server
Read this article to learn how to replicate Hyper-V virtual machines located on a Hyper-V host server in a VMM cloud when you only have a single VMM server in your deployment.

Azure has two different [deployment models](../resource-manager-deployment-model.md) for creating and working with resources: Azure Resource Manager and classic. Azure also has two portals – the Azure classic portal that supports the classic deployment model, and the Azure portal with support for both deployment models. This article contains instructions for setting up replication in the Azure portal.

If you have any questions after reading this article, post them in the Disqus comments at the bottom of this article or on the [Azure Recovery Services forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

## Overview
If you want to replicate Hyper-V VMs located on Hyper-V hosts in VMM and you only have a single VMM server, you can [replicate to Azure](site-recovery-vmm-to-azure.md), or between clouds on the single VMM server.

We recommend that you replicate to Azure because failover and recovery aren't seamless when replicating between clouds, and a number of manual steps are needed. If you do want to replicate using the VMM server only, you can do the following:

* Replicate with a single standalone VMM server
* Replicate with a single VMM server deployed in a stretched Windows cluster

## Replicate across sites with a single standalone VMM server
![Standalone virtual VMM server](./media/site-recovery-single-vmm/single-vmm-standalone.png)

In this scenario you deploy the single VMM server as a virtual machine in the primary site, and replicate this VM to a secondary site using Site Recovery and Hyper-V Replica.

1. Set up VMM on a Hyper-V VM. We suggest you install the SQL Server instance used by VMM on the same VM to save time. If you want to use a remote instance of SQL Server and an outage occurs, you need to recover that instance before you can recover VMM.
2. Make sure that the VMM server has at least two clouds configured. One cloud contains the VMs you want to replicate, and the other cloud serves as the secondary location. The cloud that contains the VMs you want to protect should have:
   
   * One or more VMM host groups containing one or more Hyper-V host servers in each host group.
   * At least one Hyper-V virtual machine on each Hyper-V host server.
3. Create a Recovery Services vault, generate and download a vault registration key, and register the VMM server in the vault. During registration you install the Azure Site Recovery Provider on the VMM server.
4. Set up one or more clouds on the VMM VM, and add the Hyper-V hosts to these clouds.
5. Configure protection settings for the clouds. You specify the name of the single VMM server as the source and target locations. To configure network mapping, you map the VM network for the cloud with the VMs you want to protect, to the VM network for the replication cloud.
6. Enable initial replication for VMs you want to protect over the network because both clouds are located on the same server.
7. In the Hyper-V Manager console, enable Hyper-V Replica on the Hyper-V host that contains the VMM VM, and enable replication on the VM. Make sure you don't add the VMM VM to any clouds that are protected by Site Recovery. This ensures that Hyper-V Replica settings aren't overridden by Site Recovery.
8. If you want to create recovery plans, you specify the same VMM server for source and target.

Follow the instructions in [this article](site-recovery-vmm-to-vmm.md) to create a vault, register the server, and set up protection.

### What to do in an outage
If a complete outage occurs and you need to operate from the secondary site, do the following:

1. In the Hyper-V Manager console in the secondary site, run an unplanned failover to fail over the VMM VM from the primary to secondary site.
2. Verify that the VMM VM is up and running in the secondary site.
3. In the Recovery Services vault, run an unplanned failover to fail over the workload VMs from the primary to secondary clouds. To complete the unplanned failover of the VMs, commit the failover or select a different recovery point as required.
4. After the unplanned failover is complete, users can access workload resources in the secondary site.

When the primary site is operating normally again, do the following:

1. In the Hyper-V Manager console, enable reverse replication for the VMM VM, to start replicating it from secondary to primary.
2. In the Hyper-V Manager console, run a planned failover to fail back the VMM VM to the primary site. Commit the failover to complete it. Then enable reverse replication to start replicating the VMM from primary to secondary.
3. In the Recovery Services vault, enable reverse replication for the workload VMs, to start replicating them from secondary to primary.
4. In the Recovery Services vault, run a planned failover to fail back the workload VMs to the primary site. Commit the failover to complete it. Then enable reverse replication to start replicating the workload VMs from primary to secondary.

## Replicate across sites with a single VMM server in a stretched cluster
![Clustered virtual VMM server](./media/site-recovery-single-vmm/single-vmm-cluster.png)

Instead of deploying a standalone VMM server as a VM that replicates to a secondary site, you can make VMM highly available by deploying it as a VM in a Windows failover cluster. This provides workload resilience and protection against hardware failure. To deploy with Site Recovery the VMM VM should be deployed in a stretch cluster across geographically separate sites. To do this:

1. Install VMM on a virtual machine in a Windows failover cluster, and select the option to run the server as highly available during setup.
2. The SQL Server instance that's used by VMM should be replicated with SQL Server AlwaysOn availability groups so that there's a replica of the database in the secondary site.
3. Follow the instructions in [this article](site-recovery-vmm-to-vmm.md) to create a vault, register the server, and set up protection. You need to register each VMM server in the cluster in the Recovery Services vault. To do this, you install the Provider on an active node, and register the VMM server. Then you install the Provider on other nodes.

### What to do in an outage
When an outage occurs, the VMM server and its corresponding SQL Server database are failed over and accessed from the secondary site.

## Next steps
[Learn more](site-recovery-vmm-to-vmm.md) about detailed Site Recovery deployment for VMM to VMM replication.

