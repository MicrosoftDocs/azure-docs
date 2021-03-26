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

A [Windows Server Failover Cluster](hadr-windows-server-failover-cluster-overview.md) is used for high availability and disaster recovery (HADR) with SQL Server on Azure Virtual Machines (VMs). 

This article provides cluster configuration best practices for both [failover cluster instances (FCIs)](failover-cluster-instance-overview.md) and [availability groups](availability-group-overview.md) when you use them with SQL Server on Azure VMs. 

## Overview


## VM availability settings

To reduce the impact of downtime, we recommend the following high availability best practices for your virtual machines that are part SQL HA:
* Use proximity placement groups together with accelerated networking for lowest latency
* Use availability zones to protect from datacenter level failures
* Configure multiple virtual machines in an availability set for redundancy
* Use premium-managed OS and data disks for VMs in an availability set
* Configure each application tier into separate availability sets


## Quorum

Although a two-node cluster will function without a [quorum resource](/windows-server/storage/storage-spaces/understand-quorum), customers are strictly required to use a quorum resource to have production support. Cluster validation won't pass any cluster without a quorum resource. 

Technically, a three-node cluster can survive a single node loss (down to two nodes) without a quorum resource. But after the cluster is down to two nodes, there's a risk that the clustered resources will go offline if a node loss or communication failure to prevent a split-brain scenario.

Configuring a quorum resource will allow the cluster to continue online with only one node online.

The following table lists the quorum options available in the order recommended using with an Azure VM, with the disk witness being the preferred choice: 


||[Disk witness](/windows-server/failover-clustering/manage-cluster-quorum#configure-the-cluster-quorum)  |[Cloud witness](/windows-server/failover-clustering/deploy-cloud-witness)  |[File share witness](/windows-server/failover-clustering/manage-cluster-quorum#configure-the-cluster-quorum)  |
|---------|---------|---------|---------|
|**Supported OS**| All |Windows Server 2016+| All|

### Recommended Adjustments to Quorum Voting

When enabling or disabling a given WSFC node's vote, follow these guidelines:

| Guidelines |
|-|
| No vote by default. Assume that each node shouldn't vote without explicit justification. |
| Include all primary replicas. Each WSFC node that hosts an availability group primary replica or is the preferred owner of an FCI should have a vote. |
| Include possible automatic failover owners. Each node that could host a primary replica, as the result of an automatic availability group failover or FCI failover, should have a vote. If there's only one availability group in the WSFC cluster and availability replicas are hosted only by standalone instances, this rule includes only the secondary replica that is the automatic failover target. |
| Exclude secondary site nodes. In general, don't give votes to WSFC nodes located at a secondary disaster recovery site. You don't want nodes in the secondary site to contribute to a decision to take the cluster offline when there's nothing wrong with the primary site. |
| Number of votes. If necessary, add a cloud witness, file share witness, a witness node, or a witness disk to the cluster and adjust the quorum mode to prevent possible ties in the quorum vote. It's recommended to have three or more quorum votes. |
| Re-assess vote assignments post-failover. You don't want to fail over into a cluster configuration that doesn'tsupport a healthy quorum. |

### Disk witness

A disk witness is a small clustered disk in the Cluster Available Storage group. This disk is highly available and can fail over between nodes. It contains a copy of the cluster database, with a default size that's less than 1 GB. The disk witness is the preferred quorum option for any cluster that uses Azure Shared Disks (or any shared-disk solution like shared SCSI, iSCSI, or fiber channel SAN).  A Clustered Shared Volume cannot be used as a disk witness.

Configure an Azure shared disk as the disk witness. 

To get started, see [Configure a disk witness](/windows-server/failover-clustering/manage-cluster-quorum#configure-the-cluster-quorum).

**Supported OS**: All

### Cloud witness

A cloud witness is a type of failover cluster quorum witness that uses Microsoft Azure to provide a vote on cluster quorum. The default size is about 1 MB and contains just the time stamp. A cloud witness is ideal for deployments in multiple sites, multiple zones, and multiple regions.

To get started, see [Configure a cloud witness](/windows-server/failover-clustering/deploy-cloud-witness#CloudWitnessSetUp).

**Supported OS**: Windows Server 2016 and later  

### File share witness

A file share witness is an SMB file share that's typically configured on a file server running Windows Server. It maintains clustering information in a witness.log file, but doesn't store a copy of the cluster database. In Azure, you can configure a file share on a separate virtual machine.

To get started, see [Configure a file share witness](/windows-server/failover-clustering/manage-cluster-quorum#configure-the-cluster-quorum).


**Supported OS**: Windows Server 2012 and later   

## Networking

Use a single NIC per server (cluster node) and a single subnet. Azure networking has physical redundancy, which makes additional NICs and subnets unnecessary on an Azure virtual machine guest cluster. The cluster validation report will warn you that the nodes are reachable only on a single network. You can ignore this warning on Azure virtual machine guest failover clusters.

## Heartbeat and threshold settings

### Tuning of Widows Cluster on Azure Virtual Machine 

The default settings of Windows Failover Cluster are designed for highly tuned on premises networks and do not take into account the possibility of induced latency on a cloud environment such as Azure VM. The heartbeat network is maintained with UDP 3343, which is traditionally far less reliable than TCP and more prone to incomplete conversations.
 
Therefore, when running Windows Failover Cluster nodes on Azure VM for SQL Server Always On AG or FCI, changing the cluster setting to a more relaxed monitoring state is recommended to avoid any transient failures due to increased possibility of network latency/failures, possibility of Azure maintenance or possibility of needing higher computing resources by your application load than one selected, as discussed above.

It is important to understand that both the delay and threshold have a cumulative effect on the total health detection.  

For example, setting *CrossSubnetDelay* to send a heartbeat every 2 seconds and setting the *CrossSubnetThreshold* to 10 heartbeats missed before taking recovery, means that the cluster can have a total network tolerance of 20 seconds before recovery action is taken.  In general, continuing to send frequent heartbeats but having greater thresholds is the preferred method.

To ensure legitimate outages we recommended that you relax the delay and thresholds as per below, when running SQL Server HA with Windows Cluster on Azure VM:

|     Parameter    |     Recommended   values for SQL Always on HA on Azure VM    |  |
|-|-|-|
|  | Windows Server 2012 or later | Windows Server 2008 R2 |
|     SameSubnetDelay    | 1 second | 2 second |
|     SameSubnetThreshold    | 40 heartbeats | 10 heartbeats |
|     CrossSubnetDelay    | 1 second | 2 second |

**Note 1**
Maximum values for Windows Server 2008 R2 are as follows:
SameSubnetThreshold = 10
CrossSubnetThreshold 20

**Note 2**
Same subnet values should not be greater than cross subnet values. 
SameSubnetThreshold <= CrossSubnetThreshold
SameSubnetDelay <= CrossSubnetDelay

Please note that relaxed vales that you choose, should be based on how much down time is tolerable and how long will it take to corrective actions, depending on your application, your business needs and the environment.  We recommend that you adjust the thresholds to at least match Windows Server 2019 heartbeat default settings, in case if you cannot exceed it.  


For details on this, see [IaaS with SQL AlwaysOn - Tuning Failover Cluster Network Thresholds](/windows-server/troubleshoot/iaas-sql-failover-cluster).

## Relaxed monitoring

Relaxed monitoring of *SQL AlwaysOn AG/FCI* 
If above actions do not result in improved performance such in the scenario where you are unable to move to a VM or disks with higher limit due to financial or other constraints, you can opt for relaxed monitoring of the *SQL Always On AG/FCI*. Please note that this will mask the underlying problem only and these are only temporary solution and reduces (not eliminates) the likelihood of a failure. You might need to do trial and error to find the optimum values for your environment.

Here are Always on AG/FCI parameters that can modified to achieve relaxed monitoring:  


|    AG/FCI Parameters                           |
|------------------------------------------------|
|**Lease timeout**                               |
|Prevents split-brain.                           |
| Default: 20000                                 |
| **Healthcheck timeout**                        |
| Determines health of the Primary replica.      |
| Default: 30000                                 |
| **Failure-Condition Level**                    |
| Conditions that trigger an automatic failover. |

Additionally, if you are concerned about primary and secondary replica connectivity timeout, you can review following parameter:

| Session timeout
----------------------------------| 
|Check communication issue between Primary and Secondary. |
|Default 10 seconds|

### Constraints to follow  
Few things to consider before making any changes.

| Constraints |
|:-:|
| It is not advised to lower any timeout values below their default values. |
| SameSubnetThreshold <= CrossSubnetThreshold |
| SameSubnetDelay <= CrossSubnetDelay |
| The lease interval (½ * LeaseTimeout) must be shorter than SameSubnetThreshold * SameSubnetDelay |

## Resource limits

When resource bottlenecks are observed for the VM or the disks, you can take all or some of the following steps:
* Ensure your OS, drivers and SQL server are at the latest builds.
* Optimize SQL Server on Azure VM environment as described  in the Performance guidelines for SQL Server on Azure Virtual Machines
* Reduce or spread-out workload so that you don’t reach the resource limits 
* Optimize SQL Server, if there is any opportunity, such as
* Add/optimize indexes
* Update statistics if needed and if possible, with Full scan  
* Use features like resource governor to limit certain loads such as backup. Please note this Resource governor option is available in SQL Server 2014 or later enterprise edition only. 
* Move to VM or Disk that has higher limits and meets or exceeds your workload.   

Relaxed monitoring of *SQL AlwaysOn AG/FCI* 
If above actions do not result in improved performance such in the scenario where you are unable to move to a VM or disks with higher limit due to financial or other constraints, you can opt for relaxed monitoring of the *SQL AlwaysOn AG/FCI.* Please note that this will mask the underlying problem only and these are only temporary solution and reduces (not eliminates) the likelihood of a failure. You might need to do trial and error to find the optimum values for your environment.

## Connectivity

It's possible to configure a virtual network name, or a distributed network name for both failover cluster instances and availability groups. [Review the differences between the two](hadr-compare-virtual-distributed-network-name.md).

The distributed network name is the recommended connectivity option, when available. 

## Limitations

Consider the following limitations when you're working with FCI or availability groups and SQL Server on Azure Virtual Machines. 

### MSDTC 

Azure Virtual Machines support Microsoft Distributed Transaction Coordinator (MSDTC) on Windows Server 2019 with storage on Clustered Shared Volumes (CSV) and [Azure Standard Load Balancer](../../../load-balancer/load-balancer-overview.md) or on SQL Server VMs that are using Azure shared disks. 

On Azure Virtual Machines, MSDTC isn't supported for Windows Server 2016 or earlier with Clustered Shared Volumes because:

- The clustered MSDTC resource can't be configured to use shared storage. On Windows Server 2016, if you create an MSDTC resource, it won't show any shared storage available for use, even if storage is available. This issue has been fixed in Windows Server 2019.
- The basic load balancer doesn't handle RPC ports.



## Next steps

After you've determined the appropriate best practices for your solution, get started by [preparing your SQL Server VM for FCI](failover-cluster-instance-prepare-vm.md) or by creating your availability group by using the [Azure portal](availability-group-azure-portal-configure.md), the [Azure CLI / PowerShell](./availability-group-az-commandline-configure.md), or [Azure quickstart templates](availability-group-quickstart-template-configure.md).
