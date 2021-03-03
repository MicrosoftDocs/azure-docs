---
title: Cluster configuration best practices
description: "Learn about the supported cluster configurations when you configure high availability and disaster recovery (HADR) for SQL Server on Azure Virtual Machines, such as supported quorums or connection routing options." 
services: virtual-machines
documentationCenter: na
author: MashaMSFT
editor: monicar
tags: azure-service-management
ms.service: virtual-machines-sql
ms.subservice: hadr
ms.topic: conceptual
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: "06/02/2020"
ms.author: mathoma

---

# Cluster configuration best practices (SQL Server on Azure VMs)
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

A cluster is used for high availability and disaster recovery (HADR) with SQL Server on Azure Virtual Machines (VMs). 

This article provides cluster configuration best practices for both [failover cluster instances (FCIs)](failover-cluster-instance-overview.md) and [availability groups](availability-group-overview.md) when you use them with SQL Server on Azure VMs. 

## Overview



## Networking

Use a single NIC per server (cluster node) and a single subnet. Azure networking has physical redundancy, which makes additional NICs and subnets unnecessary on an Azure virtual machine guest cluster. The cluster validation report will warn you that the nodes are reachable only on a single network. You can ignore this warning on Azure virtual machine guest failover clusters.

### Tuning Failover Cluster Network Thresholds

When running Windows Failover Cluster nodes in Azure Vms with SQL Server AlwaysOn, changing the cluster setting to a more relaxed monitoring state is recommended.  This will make the cluster much more stable and reliable.  For details on this, see [IaaS with SQL AlwaysOn - Tuning Failover Cluster Network Thresholds](/windows-server/troubleshoot/iaas-sql-failover-cluster).

## Quorum

Although a two-node cluster will function without a [quorum resource](/windows-server/storage/storage-spaces/understand-quorum), customers are strictly required to use a quorum resource to have production support. Cluster validation won't pass any cluster without a quorum resource. 

Technically, a three-node cluster can survive a single node loss (down to two nodes) without a quorum resource. But after the cluster is down to two nodes, there's a risk that the clustered resources will go offline in the case of a node loss or communication failure to prevent a split-brain scenario.

Configuring a quorum resource will allow the cluster to continue online with only one node online.

The following table lists the quorum options available in the order recommended to use with an Azure VM, with the disk witness being the preferred choice: 


||[Disk witness](/windows-server/failover-clustering/manage-cluster-quorum#configure-the-cluster-quorum)  |[Cloud witness](/windows-server/failover-clustering/deploy-cloud-witness)  |[File share witness](/windows-server/failover-clustering/manage-cluster-quorum#configure-the-cluster-quorum)  |
|---------|---------|---------|---------|
|**Supported OS**| All |Windows Server 2016+| All|

### Recommended Adjustments to Quorum Voting

When enabling or disabling a given WSFC node's vote, follow these guidelines:
•	No vote by default. Assume that each node should not vote without explicit justification.
•	Include all primary replicas. Each WSFC node that hosts an availability group primary replica or is the preferred owner of an FCI should have a vote.
•	Include possible automatic failover owners. Each node that could host a primary replica, as the result of an automatic availability group failover or FCI failover, should have a vote. If there is only one availability group in the WSFC cluster and availability replicas are hosted only by standalone instances, this rule includes only the secondary replica that is the automatic failover target.
•	Exclude secondary site nodes. In general, do not give votes to WSFC nodes that reside at a secondary disaster recovery site. You do not want nodes in the secondary site to contribute to a decision to take the cluster offline when there is nothing wrong with the primary site.
•	Number of votes. If necessary, add a cloud witness, file share witness, a witness node, or a witness disk to the cluster and adjust the quorum mode to prevent possible ties in the quorum vote. It is recommended to have three or more quorum votes. 
•	Re-assess vote assignments post-failover. You do not want to fail over into a cluster configuration that does not support a healthy quorum.



### Disk witness

A disk witness is a small clustered disk in the Cluster Available Storage group. This disk is highly available and can fail over between nodes. It contains a copy of the cluster database, with a default size that's usually less than 1 GB. The disk witness is the preferred quorum option for any cluster that uses Azure Shared Disks (or any shared-disk solution like shared SCSI, iSCSI, or fiber channel SAN).  A Clustered Shared Volume cannot be used as a disk witness.

Configure an Azure shared disk as the disk witness. 

To get started, see [Configure a disk witness](/windows-server/failover-clustering/manage-cluster-quorum#configure-the-cluster-quorum).


**Supported OS**: All   


### Cloud witness

A cloud witness is a type of failover cluster quorum witness that uses Microsoft Azure to provide a vote on cluster quorum. The default size is about 1 MB and contains just the time stamp. A cloud witness is ideal for deployments in multiple sites, multiple zones, and multiple regions.

To get started, see [Configure a cloud witness](/windows-server/failover-clustering/deploy-cloud-witness#CloudWitnessSetUp).


**Supported OS**: Windows Server 2016 and later   


### File share witness

A file share witness is an SMB file share that's typically configured on a file server running Windows Server. It maintains clustering information in a witness.log file, but doesn't store a copy of the cluster database. In Azure, you can you can configure an [Azure file share](../../../storage/files/storage-how-to-create-file-share.md) to use as the file share witness, or you can use a file share on a separate virtual machine.

If you're going to use an Azure file share, you can mount it with the same process used to [mount the Premium file share](failover-cluster-instance-premium-file-share-manually-configure.md#mount-premium-file-share). 

To get started, see [Configure a file share witness](/windows-server/failover-clustering/manage-cluster-quorum#configure-the-cluster-quorum).


**Supported OS**: Windows Server 2012 and later   




## Limitations

Consider the following limitations when you're working with FCI or availability groups and SQL Server on Azure Virtual Machines. 

### MSDTC 

Azure Virtual Machines support Microsoft Distributed Transaction Coordinator (MSDTC) on Windows Server 2019 with storage on Clustered Shared Volumes (CSV) and [Azure Standard Load Balancer](../../../load-balancer/load-balancer-overview.md) or on SQL Server VMs that are using Azure shared disks. 

On Azure Virtual Machines, MSDTC isn't supported for Windows Server 2016 or earlier with Clustered Shared Volumes because:

- The clustered MSDTC resource can't be configured to use shared storage. On Windows Server 2016, if you create an MSDTC resource, it won't show any shared storage available for use, even if storage is available. This issue has been fixed in Windows Server 2019.
- The basic load balancer doesn't handle RPC ports.


## Next steps

After you've determined the appropriate best practices for your solution, get started by [preparing your SQL Server VM for FCI](failover-cluster-instance-prepare-vm.md) or by creating your availability group by using the [Azure portal](availability-group-azure-portal-configure.md), the [Azure CLI / PowerShell](./availability-group-az-commandline-configure.md), or [Azure quickstart templates](availability-group-quickstart-template-configure.md).