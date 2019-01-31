---
title: Configure replication for storage spaces direct (S2d) VMs in Azure Site Recovery | Microsoft Docs
description: This article describes how to configure replication for VMs having S2D, from one Azure region to another using Site Recovery.
services: site-recovery
author: asgang
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 01/29/2019
ms.author: asgang

---

# Replicate Azure virtual machines using storage spaces direct to another Azure region

This article describes how to enable disaster recovery of Azure VMs running storage spaces direct.

>[!NOTE]
>Only crash consistent points are supported for storage spaces direct clusters.
>

##Introduction 
[Storage spaces direct (S2D)](https://docs.microsoft.com/windows-server/storage/storage-spaces/deploy-storage-spaces-direct) is a software-defined storage which provides a way to create [guest clusters](https://blogs.msdn.microsoft.com/clustering/2017/02/14/deploying-an-iaas-vm-guest-clusters-in-microsoft-azure) on Azure.  A guest cluster in Microsoft Azure is a Failover Cluster comprised of IaaS VMs. It allows hosted VM workloads to failover across the guest clusters achieving higher availability SLA for applications than a single Azure VM can provide. It is useful in scenarios where VM hosting a critical application like SQL or Scale out file server.

##Disaster Recovery of Azure Virtual Machines using storage spaces direct

In a typical scenario, you may have virtual machines guest cluster on Azure for higher resiliency of your application like Scale out file server. While this can provide your application higher availability, you would like to protect these applications using Site Recovery for any region level failure. Site Recovery replicates the data from one region to another Azure region and brings up the cluster in disaster recovery region in an event of failover.

Below diagram shows the pictorial representation of 2 Azure VMs failover cluster using storage spaces direct.

![storagespacesdirect](./media/azure-to-azure-how-to-enable-replication-s2d-vms/storagespacedirect.png)

 
- Two Azure virtual machines in a Windows Failover Cluster and each virtual machine have two or more data disks.
- S2D synchronizes the data on the data disk and presents the synchronized storage as a storage pool.
- The storage pool presents as a cluster shared volume (CSV) to the failover cluster.
- The Failover cluster uses the CSV for the data drives.

**Things to keep in mind**

1. When you are setting up [cloud witness](https://docs.microsoft.com/windows-server/failover-clustering/deploy-cloud-witness#CloudWitnessSetUp) for the cluster keep witness in the Disaster Recovery region.
2. If you are going to failover the virtual machines to the subnet on the DR region which is different from the source region then cluster IP address needs to be change after failover.  Azure Site Recovery will not be able to change the ip of the cluster it has to be done through the [script](https://github.com/krnese/azure-quickstart-templates/blob/master/asr-automation-recovery/scripts/ASR-Wordpress-ChangeMysqlConfig.ps1)

**Enabling Site Recovery for S2D cluster:**

1. Inside the recovery services vault, click “+replicate”
1. Select all the nodes in the cluster and make them part of a [Multi-VM consistency group](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-common-questions#multi-vm-consistency)
1. Select replication policy with application consistency off* (only crash consistency support is available)
1. Enable the replication

# failover of the 

![storagespacesdirect](./media/azure-to-azure-how-to-enable-replication-s2d-vms/multivmgroup.png)


## Next steps

[Learn more](site-recovery-test-failover-to-azure.md) about running a test failover.
